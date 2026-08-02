# Development And Testing

## Local setup

This repository is a pnpm workspace with a Node runtime and a Rust/WASM memory crate. `package.json` declares Node `>=22.18.0` and `pnpm@10.10.0`.

Typical developer setup:

```sh
sudo apt-get install bubblewrap
pnpm install
pnpm run fetch-embedding-model
pnpm run wasm:build
pnpm run typecheck
pnpm run test:unit
pnpm run build
pnpm run test:http
```

Ubuntu 24.04 developers must also load the packaged
`bwrap-userns-restrict` AppArmor profile. Follow
`docs/getting-started/installation.md#linux-coding-worker-sandbox` and run its
Bubblewrap canary before the test suite.

The full default test command is:

```sh
pnpm run test
```

It runs unit tests, builds the Flue runtime and product CLI, exercises the
relocated packaged capability lifecycle, then runs built HTTP tests.

## Build and run commands

Important scripts from `package.json`:

```sh
pnpm run dev              # Vite development server with @flue/vite
pnpm run build            # Vite build + registry/config/WASM/assets + contained production dependencies
pnpm run start            # built server; bootstrap loads .gorombo/sim-one.config
pnpm run connect          # flue connect orchestrator local --target node --session local
pnpm run build:cli        # build sim-one-cli package
pnpm run build:all        # build runtime, TUI, CLI, and validate product command
```

Use `sim-one.config.example` for the supported-key shape. The ignored
`sim-one.config` is owner-only runtime state; never print, document, or commit
its values. POSIX startup rejects the file unless it is a regular file owned by
the current user with exact mode `0600`.

## Test commands

Core checks:

```sh
pnpm run typecheck
pnpm run test:unit
pnpm run build
pnpm run build:cli
pnpm run test:capability-product
pnpm run test:http
pnpm run smoke:http
```

CLI and TUI checks:

```sh
pnpm run build:cli
pnpm run test:tui
pnpm run test:tui:ratatui
```

Memory/Rust/WASM checks:

```sh
pnpm run wasm:build
pnpm run smoke:memory
pnpm run cargo:test
```

The embedding model and WASM package are gitignored. Prepare both in every
fresh checkout before running the complete unit suite.

Targeted scripts:

```sh
pnpm run test:lsp
pnpm run research:local
pnpm run protocols:seed
pnpm run protocols:list
pnpm run capabilities:list
```

Set `GOROMBO_LSP_REAL_SERVER_TESTS=1` when `test:lsp` must execute the four
focused integration cases against the bundled language servers:

```sh
GOROMBO_LSP_REAL_SERVER_TESTS=1 pnpm run test:lsp
```

## Test organization

Tests live under `src/tests/`. The suite is broad and mostly source-adjacent by domain rather than by framework layer.

High-signal tests by change area:

- App routes and HTTP behavior: `http-endpoints.test.ts`, `api-secret-loopback.test.ts`, `chat-prompt.test.ts`.
- Architecture boundaries: `architecture-contract.test.ts`, `flue-internal-compat.test.ts`, `flue-session-store.test.ts`.
- Models and config: `models.test.ts`, `gorombo-config.test.ts`, `memory-config.test.ts`, `schedules-config.test.ts`.
- Protocols: `protocol-provider.test.ts`, `protocol-tool.test.ts`.
- Capabilities: `capability-store.test.ts`, `builtin-registry.test.ts`, `worker-loader.test.ts`.
- Memory: `memory-*-tools.test.ts`, `structured-memory-*.test.ts`, `rust-memory-engine.test.ts`, `checklist-memory-provider.test.ts`, `schemas-memory.test.ts`.
- Research/RAG: `retrieval-workflow.test.ts`, `web-research-workflow.test.ts`, `web-research-tool.test.ts`, `research-agent.test.ts`, `research-cache.test.ts`, `document-index-provider.test.ts`, `ollama-web-search-provider.test.ts`.
- Schedules: `schedule-manager.test.ts`, `schedules-store.test.ts`, `schedules-routes.test.ts`, `schedules.test.ts`, `coding-schedule-tools.test.ts`.
- Coding worker: `coding-worker.test.ts`, `coding-task-handoff.test.ts`, `coding-task-memory-tools.test.ts`, `coding-worker-internal-subagents.test.ts`, `code-intelligence.test.ts`, `lsp-tools.test.ts`, `verification-parsers.test.ts`.
- Telegram and approvals: `telegram-connector.test.ts`, `telegram-approval-ui.test.ts`, `approval-ingress.test.ts`, `shared-approval-service.test.ts`.
- Images/artifacts: `runpod-image-tool.test.ts`.

`src/tests/coding-worker.test.ts` is large and covers many coding-worker behaviors. Prefer narrower tests when a change maps cleanly to a focused file, then run the broader worker test when touching shared worker loops or tools.

## CI-relevant recent history

Recent commits added CLI build and TUI e2e testing to CI, fixed fork-PR handling for TUI tests, and fixed web research fallback/test behavior around missing `OLLAMA_API_KEY`. When changing `.github/workflows/ci.yml`, CLI startup, or web research, preserve these CI constraints.

Recent commits also moved Flue-contract files back to top-level `src/` paths
and removed shims. Avoid recreating the former nested agent and workflow paths
unless there is a deliberate migration.

## Change-specific guidance

When changing `src/app.ts`, run route and architecture tests. Verify the file
stays limited to Hono setup, middleware, imported route registration,
telemetry observer boot, and explicit Flue 2 agent/channel router mounts.

When changing `src/agents/orchestrator.ts`, run architecture, protocol, capability, session, and worker delegation tests as applicable. Check that the runtime capability block stays accurate.

When changing web research, run `web-research-tool.test.ts`, `web-research-workflow.test.ts`, `retrieval-workflow.test.ts`, and any researcher-agent tests. Pay attention to provider failure propagation and fetch behavior when optional provider credentials are absent.

When changing memory, run unit memory tests plus `pnpm run cargo:test`. If touching WASM load/copy paths or SQLite durability, also run `pnpm run wasm:build` and `pnpm run smoke:memory`.

When changing capabilities, run `capability-store.test.ts`,
`capability-lifecycle-service.test.ts`, `capability-manager.test.ts`,
`coding-capability-authoring.test.ts`, `worker-loader.test.ts`, and
`builtin-registry.test.ts`. Build the product CLI and run
`pnpm run test:capability-product` to verify protocol-backed validation and the
full lifecycle from an arbitrary launch directory against a relocated package.

When changing schedules, run schedule store/manager/routes/config tests and any coding schedule tool tests.

When changing the CLI/TUI, run `pnpm run build:cli`, `pnpm run test:tui`, and
`pnpm run test:tui:ratatui`.
Verify default and explicit session behavior against the current terminal
implementation rather than preserving a historical hardcoded session ID.

## Operational cautions

- Do not document or expose secret values from `sim-one.config`, legacy `.env`
  files, or local runtime databases.
- The complete `.gorombo` tree is one relocatable runtime root. In source builds
  it lives in the checkout; packaged installation conventionally uses
  `~/.gorombo`. Do not let HOME or the caller working directory split mutable
  state away from the owning product tree.
- Capability, memory, protocol, and schedule data are runtime state. Be careful with migration behavior and backward compatibility.
