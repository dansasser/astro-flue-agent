# Flue Architecture Contract

This document is the local source of truth for Flue architecture in this
repository. Read it before modifying `src/app.ts`, agents, application
workflows, tools, skills, subagents, MCP connections, model cards, provider
runtime, persistence, memory, RAG, routing, or observability.

## Flue 2 Components

SIM-ONE Alpha uses these Flue 2 surfaces:

```text
Vite and @flue/vite
required Hono app.ts with explicit route mounts
'use agent' modules and synchronous agent functions
Agent Hooks
subagent definitions
tools
Agent Skills
MCP connections
model providers and model specifiers
sandboxes
agent handles: init(), dispatch(), read(), and abort()
conversation snapshots and live updates
SQLite persistence
automatic agent compaction
observability events
conversation-scoped SDK clients
```

Flue 2 has no framework workflow registry, workflow HTTP routes, run registry,
or deployment-wide SDK client. Files under `src/workflows/` are application
functions, not discovered Flue framework objects.

## Build And Routing

`vite.config.ts` uses `flue()` from `@flue/vite`. `vite dev` is the development
server and `vite build` emits the Node server under
`.gorombo/sim-one-alpha/`.

`src/app.ts` is required and mounts every public Flue route explicitly. Its
current Flue mounts are:

```text
/agents/orchestrator  -> createAgentRouter(Orchestrator)
/channels/telegram    -> telegramChannel.route()
```

Allowed in `src/app.ts`:

```text
Hono app creation
health checks
imported auth middleware
imported application route registration
telemetry observer registration
explicit agent and channel route mounts
side-effect imports for runtime configuration, providers, and schedules
```

Not allowed in `src/app.ts`:

```text
orchestration logic
direct RAG or web-search wiring
agent business logic
model-selected authority
beta auto-router or workflow/run routes
```

## Agents And Hooks

An addressable Flue 2 agent is an exported capitalized synchronous function in
a module marked with `'use agent'`. The function composes behavior through
hooks and returns its instructions.

The main agent is `Orchestrator` in `src/agents/orchestrator.ts`. It uses:

```text
useModel()              selected model card and automatic compaction
useTool()               built-in and enabled runtime tools
useSkill()              built-in and enabled runtime Agent Skills
useSubagent()           built-in and enabled runtime workers
useMcpConnection()      built-in and enabled runtime MCP connections
useSandbox()            local factory with no generic model-visible file tools
useInitialData()        trusted continuation context for compacted generations
useInstruction()        conditional continuation instructions
useResponseFinish()     sanitized response metadata
```

`Orchestrator.agentName = 'orchestrator'` pins the deployed identity. Agent
functions do not receive a beta initializer environment bag; they use trusted
runtime configuration initialized before module consumers.

The orchestrator's local sandbox has an empty model tool list. Durable file,
repository, project, and handoff work belongs to the Coding Worker under
`<runtime-root>/workspace`.

## Subagents And Workers

Built-in and runtime workers are Flue `SubagentDefinition` values. Built-ins use
`defineSubagent(...)`; the owning agent registers them with `useSubagent(...)`.
The parent model delegates through Flue's `task` tool.

The orchestrator owns these top-level workers:

- `researcher` for current, external, web, and source-backed research;
- `coding-worker` for repository and GitHub work;
- `capability-manager` for runtime capability lifecycle administration.

Coding Worker internal subagents stay private to that worker. They are not
mounted as public agents and are not attached directly to the orchestrator.

## Application Workflows

`src/workflows/` contains finite application functions:

- `research.ts` drives the addressable Researcher with `init()`, `dispatch()`,
  and `read()`;
- `retrieval.ts` implements bounded memory/RAG retrieval;
- `web-research.ts` implements researcher-owned search, fetch, cache, packing,
  confidence, and provider-failure handling.

They are ordinary TypeScript modules. They are not auto-discovered, do not
export framework routes, and do not create workflow run IDs. Application code
calls them directly or exposes them through an owning tool.

## Tools

Tools use `defineTool(...)` and are attached with `useTool(...)`. A Flue 2 tool
reads parsed arguments from `run({ data })`. Object, array, number, boolean, or
`null` results are returned inside `{ output }`; a bare string remains valid.
Side-effect sequences that need Flue checkpointing may opt into
`durable: true` and use `step.do(...)`.

Tools are attached only to their owning agent. The orchestrator does not own web
search or Coding Worker repository tools.

## Skills

An import that resolves to `SKILL.md` returns a Flue Skill reference and
packages the skill directory. The owning agent registers it with
`useSkill(...)`. JavaScript import attributes are not used in Flue 2.

Skills provide instructions and supporting resources. They do not execute
actions or replace SQLite protocols.

## MCP

Built-in and runtime MCP definitions use `defineMcpConnection(...)`. The owning
agent registers each connection with `useMcpConnection(...)`. Runtime records
store endpoint, transport, and an allowlisted configuration key name; secret
values remain in `sim-one.config` and never enter model context.

## Models And Providers

Model cards contain model/provider identity, roles, capabilities, limits, and
environment-variable names. They contain no secrets. Provider modules create Pi
providers and register them with `setProvider()` before any agent renders.
`useModel()` receives the selected card's Flue specifier and card-derived
compaction settings.

## Persistence, Sessions, And Compaction

`src/db.ts` exports Flue 2's Node SQLite adapter. Flue 2 writes only to
`<runtime-root>/db/flue-v2.sqlite`; the beta
`<runtime-root>/db/flue.sqlite` is an untouched rollback archive.

`<runtime-root>/db/sessions.sqlite` remains SIM-ONE's product-session store.
Each product session maps to one or more ordered Flue 2 instance generations.
Normal chat uses an `init(Orchestrator, { id })` handle, awaits the exact
`dispatch()` receipt with `read()`, and stores `instanceId`, `submissionId`,
and `uid` correlation outside model-selected input.

Automatic context compaction is configured through `useModel()`. The explicit
`/compact` command is application-owned generation rotation: it obtains a
continuation summary from the current instance, persists it, creates the next
generation, and injects the summary through initial data. Prior generations
remain immutable transcript history.

## Observability

Flue 2 events use `instanceId` and `submissionId`. SIM-ONE stores sanitized
in-memory execution summaries keyed by submission ID when available, otherwise
instance ID, and exposes them under `/api/telemetry/executions`. There are no
beta `run_start`, `run_end`, workflow-run, or `/runs/*` contracts.

## SIM-ONE Alpha Boundary

```text
User prompt
-> authenticated application or channel ingress
-> normalized event and product-session resolution
-> init(Orchestrator, { id })
-> dispatch() admission receipt
-> read(receipt) settlement
-> Protocol Tool and trusted event lookup
-> memory, tools, MCP, or worker delegation
-> root orchestrator response
```

The orchestrator routes and delegates. The researcher owns web research. Nested
worker output remains internal until the orchestrator synthesizes the public
response.

## Related Documentation

- [Flue 2 Migration](flue-v2-migration.md)
- [Product Flow](product-flow.md)
- [Session Context Budget](session-context-budget.md)
- [Worker System](worker-system.md)
- [Tool System](tool-system.md)
- [Skill System](skill-system.md)
- [Registry System](registry-system.md)
