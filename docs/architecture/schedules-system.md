# Schedules System

SIM-ONE Alpha owns scheduled, recurring, one-shot, and manual agent execution.
Schedule definitions and run history are durable in SQLite; Croner drives
in-process timers and rehydrates enabled schedules after restart.

## Lifecycle

```text
CRUD through schedule tools or /api/schedules
-> ScheduleStore writes <runtime-root>/db/schedules.sqlite
-> ScheduleManager mirrors enabled rows into Croner

Cron or manual fire
-> create durable schedule run and unique instanceId
-> init(Orchestrator, { id: instanceId })
-> dispatch structured schedule signal with idempotency key
-> persist submissionId, uid, and acceptedAt
-> await handle.read(receipt) for the exact submission
-> record ok, error, timeout, skipped, or retry state
```

Admission and completion are distinct. A dispatch receipt proves only durable
acceptance; the manager marks the run successful only after `read()` settles.

## Flue 2 Contract

`src/engine/schedules/schedule-dispatch.ts` dynamically imports the
`Orchestrator` function, initializes it by instance id, dispatches a signal
message, and returns both the receipt fields and a settlement promise.

Correlation uses:

```text
instanceId
submissionId
uid
acceptedAt
```

Schedule `runId` remains a SIM-ONE application identifier. It is not a Flue
workflow run id. Flue 2 workflow routes and beta event correlation are not used.

## Retry And Terminal State

The manager waits with a bounded timeout. Configured transient categories may
retry after backoff with a new per-attempt instance id. Permanent errors are
recorded as skipped; exhausted or non-retryable transient errors are recorded
as errors. Pausing, deleting, or stopping a schedule cancels pending retry
timers.

One-shot schedules may delete themselves only after the final terminal outcome,
never while a retry remains pending.

## Current Governance Boundary

Schedule input includes schedule, run, target, prompt, and optional payload
fields but does not yet persist a trusted normalized-event id. Protocol and
scoped-memory tools therefore cannot rehydrate connector/user scope during a
scheduled turn. Trusted schedule-event handoff and result delivery remain
release gates.

## Schedule Kinds

| Kind | Stored value | Croner input |
| --- | --- | --- |
| `cron` | Five- or six-field expression | Passed through |
| `every` | Interval such as `20m` or `1h` | Converted to a cron expression |
| `at` | ISO 8601 timestamp | One-shot date |

Timezone defaults to UTC. Croner applies its normal day-of-month/day-of-week
semantics.

## Surfaces

- Orchestrator `schedule_*` tools derive owner scope from a trusted event id.
- Coding Worker `coding_schedule_*` aliases remain lead-only and project scoped.
- Protected `/api/schedules/*` routes expose CRUD, pause/resume, manual fire,
  and application-owned run history.

`POST /api/schedules/:slug/run?wait=1` polls the SIM-ONE run record to a bounded
terminal state. Run history routes keep `runId` because that is the product
schedule identifier.

## Visibility

`schedule.*` progress events describe fired, dispatched, completed, error,
skipped, retry, CRUD, and shutdown activity. Durable route-visible state is the
schedule and run tables. Result content is not currently persisted or delivered
through a connector.

## Source Map

| Responsibility | Source |
| --- | --- |
| Types and run identifiers | `src/engine/schedules/schedule-types.ts` |
| SQLite definitions and history | `src/engine/schedules/schedule-store.ts` |
| Flue 2 dispatch/read | `src/engine/schedules/schedule-dispatch.ts` |
| Cron, retries, and settlement | `src/engine/schedules/schedule-manager.ts` |
| Boot and shutdown | `src/engine/schedules/boot.ts` |
| Orchestrator tools | `src/engine/tools/schedule-tools.ts` |
| Coding Worker aliases | `src/engine/workers/coding-worker/tools/coding-schedule-tools.ts` |
| Admin routes | `src/api/routes/schedules.ts` |
