# Product And Agent Workflows

## Product identity and business domain

SIM-ONE Alpha is positioned as a protocol-governed AI employee runtime. The core business idea is governance: the orchestrator coordinates work, loads applicable protocols, uses durable memory, delegates specialized tasks, validates results, and responds through connected surfaces.

Use the naming rules in `/AGENTS.md` consistently:

- Gorombo is the company.
- SIM-ONE Alpha is the product/runtime.
- Flue is the TypeScript agent framework.
- `sim-one` is the product CLI binary.
- Workers are internal subsystems, not public products.
- Persona names belong in workspace contents, not architecture paths.

## Current gateway flow

The current runtime gateway is the built Flue/Hono server. The source-backed flow is:

```text
connector or HTTP client
-> app-owned Hono route or Flue route
-> normalized message event
-> durable chat/session persistence
-> orchestrator Flue agent session
-> protocol loading and optional memory retrieval
-> tool use or worker delegation
-> response returned to caller or channel
```

`src/app.ts` registers route modules for chat events, knowledge, schedules, telemetry, approvals, and Telegram admin before mounting Flue runtime routes.

## Chat event flow

`src/api/routes/chat-events.ts` handles `/api/chat/events` and `/api/chat/sessions`. The event flow is:

1. Parse JSON and normalize the incoming message through `normalizeWebApiMessage()`.
2. Parse slash commands with `src/engine/commands/slash-commands.ts`.
3. Resolve durable session routing through `src/engine/session/session-routing.ts`.
4. Record the normalized event in `goromboPersistenceRuntime.sessionDatabase`.
5. Handle `/new` or `/compact` directly when applicable.
6. Forward ordinary messages to `/agents/orchestrator/:sessionId?wait=result` with a chat prompt created by `src/api/routes/chat-prompt.ts`.
7. Add event and session metadata to JSON responses.

Session access denial returns 403. Invalid JSON returns 400. Unknown slash commands are recorded and returned as handled command responses.

## Protocol-governed orchestration

Orchestrator and chat-ingress instructions require `load_protocols` before
final reasoning, tool execution, worker delegation, or response generation.
Protocols are SQLite-backed runtime rules, not skills. Trusted fail-closed
pre-execution enforcement remains a release gate.

When delegating to `coding-worker`, the orchestrator runtime instructions require parsing the `load_protocols` result and including the parsed object as `protocolBundle` in the delegated task input. This keeps worker execution under the same runtime governance model.

The `chat.runtime-configuration-routing` base protocol handles requests to
inspect or change SIM-ONE runtime configuration. The main agent delegates these
requests to the Coding Worker lead. Redacted inspection never returns values;
a user-supplied secret can be used only for the requested one-key update after
backend approval and cannot be echoed in approval, progress, logs, tool results,
or the response.

## Research workflow

The researcher owns current, external, web, source-backed, and research tasks. The orchestrator should decide that research is needed and delegate to the `researcher` subagent rather than directly calling web search.

`src/workflows/web-research.ts` implements bounded web research. It supports research depth, freshness, query and fetch limits, context-token budgets, provider failures, confidence, and cache statistics. It calls `retrieveContext()` with `caller: 'researcher'` and provider `web-search`.

Relevant tests include:

- `src/tests/web-research-workflow.test.ts`
- `src/tests/web-research-tool.test.ts`
- `src/tests/research-agent.test.ts`
- `src/tests/research-workflow.test.ts`
- `src/tests/retrieval-workflow.test.ts`

Recent history fixed web research event dependency and fallback propagation, so preserve those behaviors when refactoring.

## Coding workflow

The coding worker is created in `src/engine/workers/coding-worker/coding-worker.ts` and attached by `src/agents/orchestrator.ts`. The orchestrator delegates coding work to `coding-worker`; it should not call coding-worker internals directly.

The coding worker owns coding-specific tools, approval service integration,
task memory, code intelligence/LSP behavior, verification parsing, the
official GitHub MCP connection, anonymous-first Git access, approval-gated
GitHub mutations, and worker-local subagents. The PAT remains trusted runtime
configuration and is removed from general shell environments. Representative
tests include:

- `src/tests/coding-worker.test.ts`
- `src/tests/coding-task-handoff.test.ts`
- `src/tests/coding-task-memory-tools.test.ts`
- `src/tests/coding-worker-internal-subagents.test.ts`
- `src/tests/code-intelligence.test.ts`
- `src/tests/lsp-tools.test.ts`
- `src/tests/verification-parsers.test.ts`
- `src/tests/github-mcp.test.ts`
- `src/tests/github-mcp.test.ts`
- `src/tests/github-private-clone.test.ts`

When changing coding behavior, check the worker workspace and approval paths before changing the main orchestrator.

Durable files, repositories, projects, and handoff notes are Coding Worker
operations. The worker resolves them under `<runtime-root>/workspace`, returns
workspace-relative paths, and verifies writes through its host-backed Flue Node
local session. Shell, Git, and verification processes additionally run in a
Bubblewrap namespace that mounts the workspace but not sibling owner runtime
state. The main orchestrator intentionally has no generic virtual filesystem or
shell tools; `/home/user` is not a durable product location.

## Capability management workflow

Capabilities are managed by the `sim-one` CLI or the dedicated
`capability-manager` worker through one shared lifecycle service.

Current source surfaces:

- `scripts/capability-admin.mjs` as a compatibility adapter to `sim-one`.
- `src/engine/workers/capability-manager/` for approval-gated agent lifecycle requests.
- `src/engine/workers/coding-worker/capability-authoring/` for workspace-scoped source validation, tests, and handoff.
- `sim-one-cli/src/cli.tsx` for product CLI subcommands.
- `src/engine/capabilities/` for SQLite store, loaders, materializers, MCP broker, user tools, and user workers.

The current `sim-one` CLI declares `skill`, `tool`, `worker`, and `mcp`
subcommands with list/inspect/validate/add/update/enable/disable/remove
behavior. Agent requests require Protocol Tool context and approval for
mutations.

## CLI and TUI workflow

`sim-one-cli/src/cli.tsx` defines the `sim-one` binary. With no subcommand, it
launches the current terminal interface. It can connect to a loopback HTTP
gateway or local SSH tunnel through `--base-url`, or start/ensure a local
server through `sim-one-cli/src/launcher/server-manager.ts`. Session creation
and resume behavior belongs to the current terminal implementation and session
routes.

`package.json` exposes:

```sh
pnpm run build:cli
pnpm run build:all
pnpm run test:tui
pnpm run test:tui:ratatui
```

`build:all` builds the runtime, packages isolated production dependencies beside
the Flue Node server, builds the terminal interface and CLI package, then runs
the product-command validation script.

## Telegram and connector workflow

Telegram integration is under `src/channels/telegram.ts` with admin routes in `src/api/routes/telegram-admin.ts`. The orchestrator has a `telegram_reply` tool when `TELEGRAM_BOT_TOKEN` is configured.

Tests include `src/tests/telegram-connector.test.ts` and
`src/tests/telegram-approval-ui.test.ts`. Recent history moved Telegram from a
former API-nested channel path to `src/channels/`, so use the current path.

## Schedule workflow

Schedules are agent-turn triggers and recurring/one-shot jobs. The boot side effect is imported by `src/app.ts`, routes are registered from `src/api/routes/schedules.ts`, and schedule tools are attached to the orchestrator.

Schedule operations enforce owner scope from trusted event ids for non-create operations. Before changing schedule behavior, read `docs/architecture/schedules-system.md` and run the focused schedule tests listed in [Development and testing](../operations/development-and-testing.md).

## Target product flow caveat

`docs/architecture/product-flow.md` describes the target product install and use experience: `sim-one.sh`, first-run wizard, always-on gateway, web UI, service management, and unified `sim-one` command. Some parts are implemented today, especially the gateway, capability store, and CLI package. Other parts are product direction. When documenting or coding, distinguish current source behavior from target flow.

## Source references

- `docs/architecture/product-flow.md`
- `docs/architecture/orchestrator-flow.md`
- `src/app.ts`
- `src/api/routes/chat-events.ts`
- `src/api/routes/chat-prompt.ts`
- `src/agents/orchestrator.ts`
- `src/workflows/web-research.ts`
- `src/engine/workers/`
- `src/engine/capabilities/`
- `src/channels/telegram.ts`
- `sim-one-cli/src/cli.tsx`
