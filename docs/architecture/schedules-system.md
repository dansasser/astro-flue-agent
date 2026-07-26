# Schedules System

Standalone scheduled, recurring, and one-shot agent execution for SIM-ONE Alpha. No Redis, no BullMQ, no external job broker — schedule *definitions* and *run history* are durable in SQLite, schedule *firing* uses [Croner](https://croner.56k.guru/) in-process, and Croner jobs rehydrate from SQLite on restart.

## How it works

```text
CRUD via LLM tool (schedule_*) or admin route (/api/schedules/*)
  -> ScheduleStore.upsert()           [SQLite: .gorombo/db/schedules.sqlite, node:sqlite]
  -> ScheduleManager.syncCron()        [in-memory Croner mirror]
       enabled -> new Cron(pattern, { protect, timezone, catch }, fire)
       disabled/paused -> stop the Croner job, keep the row

Boot (src/app.ts imports src/engine/schedules/boot.js side effect)
  -> ScheduleManager.start()
       -> ScheduleStore.migrate() + cleanup()
       -> observe((event) => ...) subscribed once (routes agent events by instanceId)
       -> rehydrate each enabled row into a Croner job

Croner fire (dispatch is ADMISSION-ONLY — dispatch resolves = admitted, not completed)
  -> recordRunStart (run row 'queued', unique instanceId per fire)
  -> emit schedule.fired
  -> dispatch({ agent: 'orchestrator', id: instanceId, input: { type:'schedule', ... } })
       -> resolves to DispatchReceipt { dispatchId, acceptedAt }  (admission only)
  -> recordRunAdmitted (store dispatch_id + admitted_at)
  -> emit schedule.dispatched
  -> OBSERVE the agent turn to terminal in-process via observe() filtered by dispatchId/instanceId
       -> agent_end -> recordRunOk / recordRunError
       -> transient error (rate_limit/overloaded/network/server_error) -> retry with backoff (new instanceId)
       -> permanent error (validation/provider-unavailable) -> recordRunSkipped, no retry
  -> emit schedule.completed/error/skipped
  -> if deleteAfterRun and kind='at' -> delete the schedule row (cascade removes run history)
```

### Key Flue constraints (verified against the installed 1.0.0-beta.1 runtime)

- **`dispatch()` is admission-only.** It returns `DispatchReceipt { dispatchId, acceptedAt }` — `dispatchId` is "not a workflow runId." The agent turn runs asynchronously in the agent's continuing durable queue. The terminal status is observed in-process via `observe()` (the same API `src/core/telemetry/flue-telemetry.ts` uses) filtered by `event.dispatchId`/`event.instanceId`. A dispatch promise resolving is NOT the turn completing.
- **Only `orchestrator` is dispatchable.** `coding-worker` is a subagent profile of the orchestrator ("not a separately addressable agent endpoint"). Schedules always dispatch to `orchestrator`; `targetAgent: 'coding-worker'` is carried in the input and the orchestrator delegates to the coding-worker subagent through its `task` tool.
- **`node:sqlite`, not `better-sqlite3`.** The Flue `sqlite()` adapter in `src/db.ts` stores only Flue-runtime state (sessions, submissions, runs); schedule definitions + run history are application-owned business data (per the Flue database guide) and live in their own `node:sqlite` file, mirroring `GoromboSessionDatabase`.

### Schedule kinds

| Kind    | Field semantics                       | Croner pattern                                    |
| ------- | ------------------------------------- | -------------------------------------------------- |
| `cron`  | 5-field (or 6-field) cron expression  | cron expr passed through to Croner                 |
| `every` | interval string, e.g. `20m` / `1h`    | converted to a cron expr (`20m`->`*/20 * * * *`); Croner 10.x rejects interval strings directly |
| `at`    | ISO 8601 one-shot timestamp           | ISO string passed to Croner (fires once); `deleteAfterRun` defaults true |

Timezone: Croner `timezone` option (default UTC). Day-of-month/day-of-week use Croner's default Vixie OR logic (documented in the tool description so the model does not expect AND).

## Surfaces

- **Orchestrator tools** (`src/engine/tools/schedule-tools.ts`, attached to `src/agents/orchestrator.ts`): `schedule_create`, `schedule_pause`, `schedule_resume`, `schedule_update`, `schedule_delete`, `schedule_list`, `schedule_get`, `schedule_run_now`, `schedule_runs`. Auth boundary: `ownerScope` is derived from the trusted chat `eventId` (never model-selected).
- **Coding-worker aliases** (`src/engine/workers/coding-worker/tools/coding-schedule-tools.ts`, lead-only): `coding_schedule_*` scoped to the worker's `projectId`, `targetAgent` defaults to `coding-worker`. Never exposed to internal coding subagents.
- **Admin HTTP route** (`src/api/routes/schedules.ts`, behind `requireApiSecret`): `GET/POST /api/schedules`, `GET/PATCH/DELETE /api/schedules/:slug`, `POST /api/schedules/:slug/pause|resume|run`, `GET /api/schedules/:slug/runs[/:runId]`. `?wait=1` on run polls the runId to terminal.

## Config (GoromboConfig.schedules)

```text
schedules.enabled              (env GOROMBO_SKIP_SCHEDULES=1 to disable)
schedules.maxConcurrentRuns: 8
schedules.retry.maxAttempts: 3
schedules.retry.backoffMs: [60000, 120000, 300000]
schedules.retry.retryOn: ["rate_limit","overloaded","network","server_error"]
schedules.runLog.keepRuns: 200
schedules.sessionRetention: "24h"
schedules.shutdownGraceSeconds: 60
schedules.providerPreflight: true   (the current preflight returns ok without probing a provider)
```

Env overrides: `GOROMBO_SCHEDULES_MAX_CONCURRENT_RUNS`, `GOROMBO_SCHEDULES_KEEP_RUNS`, `GOROMBO_SCHEDULES_MAX_ATTEMPTS`, `GOROMBO_SCHEDULES_SHUTDOWN_GRACE_SECONDS`, `GOROMBO_SCHEDULES_PROVIDER_PREFLIGHT`, `GOROMBO_SCHEDULES_SESSION_RETENTION`, `GOROMBO_SCHEDULES_DATABASE_PATH`.

## Visibility

`src/engine/schedules/schedule-telemetry.ts` emits structured `schedule.*`
progress events (fired, dispatched, completed, error, skipped, created, paused,
resumed, updated, deleted, shutdown) to a bounded in-memory
`ScheduleProgressReporter`. The scheduled turn's actual output reaches the user
through the orchestrator response. Schedule lifecycle events are currently
typed and collected in an internal in-memory reporter. No production admin or
telemetry route exposes that reporter; schedule API routes expose definitions
and durable run history instead. Lifecycle events are not durably persisted or
pushed independently through connectors.

## Files

```text
src/engine/schedules/
  schedule-types.ts        ScheduleKind, ScheduleRecord, ScheduleRunRecord, ScheduleRunInput, ScheduleRunStatus
  schedule-store.ts        ScheduleStore (node:sqlite CRUD + run history + cleanup)
  schedule-config.ts       resolveScheduleConfig + env overrides
  schedule-dispatch.ts     dispatchSchedule wrapper (admission-only; always dispatches to orchestrator)
  schedule-manager.ts      ScheduleManager singleton (Croner mirror + observe() terminal + retry + concurrency + auto-delete)
  schedule-telemetry.ts    ScheduleProgressEvent + reporter + installScheduleTelemetry
  schedule-shutdown.ts     SIGTERM/SIGINT drain
  boot.ts                  side-effect boot target (config + start + shutdown)
src/engine/tools/schedule-tools.ts                      orchestrator schedule_* tools
src/engine/workers/coding-worker/tools/coding-schedule-tools.ts  coding_schedule_* aliases (lead-only)
src/api/routes/schedules.ts                         admin HTTP route
```

## Adding to it

- New schedule kind: add to `ScheduleKind`, handle in `toCronerPattern`, validate in `ScheduleStore.validateDefinition`.
- New tool: add a `defineTool` in `schedule-tools.ts`, export from `src/engine/tools/index.ts`, attach to the orchestrator `tools:` slot.
- New admin endpoint: add to `src/api/routes/schedules.ts` (behind `requireApiSecret`).
- New config field: add to `SchedulesConfig` + `resolveScheduleConfig` + `readScheduleEnvOverrides`.
- Tests: focused unit tests use injected fake dispatch + fake observe (`schedule-manager.test.ts`); the three-surface test (`schedules.test.ts`) uses a real 1-second Croner job to verify real firing + persistence; the route test (`schedules-routes.test.ts`) injects a real manager via `__setScheduleManagerForTesting`.
