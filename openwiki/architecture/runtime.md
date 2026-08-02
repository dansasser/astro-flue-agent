# Runtime Architecture

## Runtime Boundary

SIM-ONE Alpha is a Flue 2 application with an explicit Hono composition root.
`src/app.ts` imports runtime and schedule bootstraps, registers telemetry,
creates the Hono app, exposes `/health`, installs middleware and app-owned API
routes, mounts `createAgentRouter(Orchestrator)` at `/agents/orchestrator`, and
mounts Telegram at `/channels/telegram`.

Do not put orchestration logic in `src/app.ts`. Agent behavior, provider
registration, retrieval, application workflows, persistence policy, and worker
composition belong in their owning modules.

## Main Agent

`src/agents/orchestrator.ts` exports the durable main `'use agent'` function.
The synchronous function uses Flue 2 Agent Hooks to register its model,
sandbox, skills, tools, subagents, MCP connections, initial data, instructions,
and response metadata:

```text
useModel
useSandbox
useSkill
useTool
useSubagent
useMcpConnection
useInitialData
useInstruction
useResponseFinish
```

The module composes built-in capabilities with one runtime capability snapshot
loaded from SQLite and promoted packages when the gateway starts. A capability
change requires a gateway restart, not a rebuild.

The orchestrator coordinates protocols, memory, delegation, and final response
synthesis. Research belongs to `researcher`; repository work belongs to
`coding-worker`; runtime capability administration belongs to
`capability-manager`.

The main agent replaces Flue's default local-sandbox tools with an empty tool
list. Its packaged persona is read-only under
`<runtime-root>/sim-one-alpha/workspace/`. Durable repository and artifact work
is delegated to the Coding Worker under the separate writable
`<runtime-root>/workspace/` tree.

## Workers And Delegation

Built-in workers live under `src/engine/workers/` and are registered as Flue 2
`SubagentDefinition` values created with `defineSubagent(...)`:

- `researcher` owns source-backed research and `web_research`;
- `coding-worker` owns coding tools, verification, approvals, Git/GitHub, and
  private internal subagents;
- `capability-manager` owns protocol-routed runtime capability lifecycle tools.

Each worker agent registers only its own tools, skills, MCP connections, and
private subagents through hooks. Nested output remains internal until the root
orchestrator returns the public response.

The Coding Worker owns the official GitHub MCP connection. The trusted PAT is
used only for MCP authorization and bounded private Git fallback. Read tools
are attached to the worker; mutations remain behind typed approval gates.

## Runtime Root

`src/core/config/runtime-root.ts` resolves one movable `.gorombo` owner for
binaries, configuration, persona assets, databases, capabilities, approvals,
logs, Coding Worker state, and `workspace/{repos,projects}`. Packaged launchers
derive that root from their own location and pass `GOROMBO_RUNTIME_ROOT` to the
gateway. Relative runtime paths never use the caller's working directory.

The Coding Worker file API uses Flue's Node local sandbox rooted at the
host-visible workspace. Shell, Git, and verification commands also run inside
the Linux Bubblewrap boundary. Owner state outside the workspace is not
mounted, and execution fails closed when the required isolation is unavailable.

`src/core/config/runtime-environment.ts` owns every supported environment-style
setting. Startup loads `<runtime-root>/sim-one.config` before providers,
connectors, workers, stores, schedules, or tools consume registered keys. The
tracked `sim-one.config.example` is secret-free; public packages exclude the
owner file; POSIX startup requires exact mode `0600`.

## Persistence And Product Sessions

Flue 2 canonical conversation state is stored in:

```text
<runtime-root>/db/flue-v2.sqlite
```

The beta `<runtime-root>/db/flue.sqlite` file remains an untouched rollback
archive. SIM-ONE product sessions, ownership, normalized events, names, and
generation mappings remain in `<runtime-root>/db/sessions.sqlite`.

One product session can span multiple Flue 2 agent instances. Normal prompts
use the active generation. `/compact` dispatches a trusted summary signal to
that instance, stores the continuation summary, and rotates to a new instance.
Prior generations remain available to transcript projection and history.

## HTTP Ingress

`src/api/routes/chat-events.ts` owns connector-style chat ingress:

```text
normalize and persist trusted event
-> resolve product session and active generation
-> init(Orchestrator, { id: instanceId })
-> dispatch(message)
-> persist the receipt
-> read(receipt) to exact settlement
-> return result, stream metadata, event, and product-session metadata
```

Flue 2 does not provide application workflow routes or a deployment-wide SDK
client. Files under `src/workflows/` are ordinary application functions:

- `research.ts` is a direct agent-handle research harness;
- `retrieval.ts` owns bounded provider retrieval;
- `web-research.ts` owns source-backed research planning, cache, fetch,
  evidence packing, confidence, and provider failures.

## Models And Providers

Model/provider setup is centralized under `src/core/models/`. Provider modules
create Pi providers and the bootstrap registers them with Flue 2. Model cards
declare provider ids, model specifiers, capabilities, context/output budgets,
and required environment variable names; cards never contain secrets.

The selected card is registered by the owning agent with `useModel(...)`.
Compaction reserve and recent-token policy are passed as model options, while
manual product-session compaction uses generation rotation.

## Auth And Telemetry

`src/app.ts` protects `/agents/*` and `/api/schedules/*`; app-owned route
modules protect their own surfaces. Loopback TUI access is local, while remote
clients use `API_SECRET` in `x-api-secret`.

`registerFlueTelemetryObserver()` subscribes through `observe(...)` and stores
sanitized summaries keyed by submission id or, when absent, instance id. The
protected API exposes `/api/telemetry/executions` and
`/api/telemetry/executions/:executionId`.

## Source References

- `src/app.ts`
- `src/agents/orchestrator.ts`
- `src/db.ts`
- `src/api/routes/chat-events.ts`
- `src/engine/session/`
- `src/engine/workers/`
- `src/workflows/`
- `docs/architecture/flue-architecture.md`
- `docs/architecture/gorombo-flue-map.md`
- `docs/architecture/session-context-budget.md`
