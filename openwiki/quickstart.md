# SIM-ONE Alpha OpenWiki Quickstart

## What this repository is

SIM-ONE Alpha is a Flue-based orchestrating agent runtime for a protocol-governed AI employee system. The product identity is explicit in `/AGENTS.md`: Gorombo is the company, SIM-ONE Alpha is the product, Flue is the TypeScript agent harness, and Ollie is a workspace persona rather than an architecture or path name.

The live runtime is a Node/TypeScript Flue 2 application. `src/app.ts` creates
the Hono app, registers app-owned HTTP routes, protects sensitive routes,
starts telemetry observation, mounts `createAgentRouter(Orchestrator)` at
`/agents/orchestrator`, and mounts Telegram at `/channels/telegram`.
`src/agents/orchestrator.ts` is the main `'use agent'` function. It registers
the selected model, instructions, tools, skills, MCP connections, sandbox, and
subagents through Flue 2 Agent Hooks.

The repository also contains the `sim-one` CLI package, the Rust terminal
interface, a Rust/WASM structured memory crate in `crates/gorombo-memory/`,
developer scripts in `scripts/`, and architecture references under
`docs/architecture/`.

## Start here

Read these OpenWiki pages in order when joining the project:

- [Runtime architecture](architecture/runtime.md) for the Flue/Hono app boundary, orchestrator, workers, workflows, sessions, auth, and telemetry.
- [Data and capabilities](architecture/data-and-capabilities.md) for SQLite-backed stores, protocol loading, structured memory, capabilities, schedules, approvals, model config, and RAG.
- [Product and agent workflows](workflows/product-and-agent-workflows.md) for user-facing flows, chat events, researcher/coding-worker ownership, Telegram, schedules, and CLI behavior.
- [Development and testing](operations/development-and-testing.md) for local commands, builds, tests, memory/WASM checks, and change-specific verification.
- [Source map](source-map.md) for where future agents should start when changing common areas.

The existing docs under `docs/architecture/` are still primary technical references. OpenWiki is the opinionated map and synthesis layer over those docs plus the current source.

## Release And Source Boundaries

The source checkout includes:

- Flue gateway app and protected HTTP routes in `src/app.ts` and `src/api/routes/`.
- Durable orchestrator agent in `src/agents/orchestrator.ts`.
- Built-in tools for protocols, memory, knowledge, schedules, image artifacts, Telegram reply, and capability management.
- Built-in `researcher` and `coding-worker` subagents.
- Runtime-extensible capabilities backed by SQLite and materialized into user capability directories.
- Structured memory through TypeScript shims plus the Rust/WASM `gorombo-memory` crate, with SQLite durability and fallback behavior.
- Web research workflow owned by the researcher path in `src/workflows/web-research.ts`.
- `sim-one` CLI package in `sim-one-cli/` with terminal launch and capability subcommands.

Packaging, onboarding, service commands, the Web UI, Discord, and complete
protocol enforcement are tracked in
`docs/getting-started/pre-release-status.md`. Architecture pages describe
implemented runtime contracts.

## Repository map

- `src/app.ts` - Hono app composition, route registration, auth middleware attachment, telemetry observer boot, and explicit Flue 2 agent/channel routers.
- `src/agents/orchestrator.ts` - main Flue 2 agent function and Agent Hook registration point.
- `src/api/` - middleware, connector normalization, and app-owned API routes for chat events, approvals, knowledge, schedules, telemetry, and Telegram admin.
- `src/channels/` - external channel integration, currently including Telegram.
- `src/core/` - config, model/provider runtime, schemas, protocols, telemetry, shared types, and input utilities.
- `src/engine/` - domain systems for approvals, capabilities, commands, embeddings, memory, RAG, registries, schedules, sessions, skills, tools, and workers.
- `src/workflows/` - finite application workflow functions for retrieval and research; Flue 2 does not discover or route them.
- `src/workspace/` - user-editable main agent workspace instructions and persona content.
- `sim-one-cli/` - separate CLI/TUI package for the `sim-one` binary.
- `crates/gorombo-memory/` - Rust structured-memory engine compiled to WASM.
- `scripts/` - developer admin, build, smoke, and test scripts.
- `docs/architecture/` - source-of-truth architecture docs for Flue boundaries, product flow, memory, capabilities, schedules, models, schema strategy, tools, and context budgets.
- `.gorombo/` - one movable runtime root containing product binaries, root
  config/environment, packaged persona assets, mutable state, and the separate
  Coding Worker workspace.

## Common developer commands

Use `pnpm` with Node `>=22.18.0` as declared in `package.json`.
Install Bubblewrap on Linux before running Coding Worker shell, Git, or
verification tests. Ubuntu 24.04 also requires the targeted AppArmor profile
and canary documented in
`docs/getting-started/installation.md#linux-coding-worker-sandbox`.

```sh
pnpm install
pnpm run fetch-embedding-model
pnpm run wasm:build
pnpm run typecheck
pnpm run test:unit
pnpm run build
pnpm run test:http
pnpm run test
```

Other useful commands from `package.json`:

```sh
pnpm run dev
pnpm run connect
pnpm run build:cli
pnpm run build:all
pnpm run test:tui
pnpm run test:tui:ratatui
pnpm run smoke:http
pnpm run smoke:memory
pnpm run cargo:test
```

The built server runs with:

```sh
pnpm run start
```

`start` executes the built server. Its bootstrap loads
`.gorombo/sim-one.config` before runtime consumers initialize. Use
`sim-one.config.example` for the supported-key shape and never read, print, or
commit the owner file's values.

## Change guidance for agents

Before changing Flue runtime boundaries, read `docs/architecture/flue-architecture.md` and `docs/architecture/gorombo-flue-map.md`. The repo intentionally keeps orchestration out of `src/app.ts`; the app file should stay limited to Hono setup, imported route registration, telemetry observer boot, auth middleware wiring, and explicit agent/channel router mounts.

Before changing product wording, keep names distinct: Gorombo is the company, SIM-ONE Alpha is the product, Flue is the framework, `sim-one` is the product binary, and worker names are internal subsystems.

Before changing memory, capabilities, schedules, model cards, or worker delegation, use the relevant OpenWiki section and source docs as a checklist, then run the focused tests listed in [Development and testing](operations/development-and-testing.md).
