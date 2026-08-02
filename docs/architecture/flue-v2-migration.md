# Flue 2 Migration Specification

Status: implementation-ready migration contract; implementation has not started.

Target: migrate SIM-ONE Alpha from `@flue/*` `1.0.0-beta.1` to the
official Flue `2.0.1` release line without weakening product architecture,
runtime portability, connector behavior, approvals, or user-visible progress.

This specification is governed by the `specify-flue-v2-migration` node in
`development-graph.json`. Current-state architecture documents remain
authoritative until an implementation slice changes and verifies that behavior.

## Authoritative Sources

- [Flue 2 migration guide](https://flueframework.com/docs/guide/migration/)
- [Flue agents](https://flueframework.com/docs/guide/agents/)
- [Flue agent hooks](https://flueframework.com/docs/guide/agent-hooks/)
- [Flue routing](https://flueframework.com/docs/guide/routing/)
- [Flue tools](https://flueframework.com/docs/guide/tools/)
- [Flue skills](https://flueframework.com/docs/guide/skills/)
- [Flue subagents](https://flueframework.com/docs/guide/subagents/)
- [Flue MCP](https://flueframework.com/docs/guide/mcp/)
- [Flue database](https://flueframework.com/docs/guide/database/)
- [Flue streaming protocol](https://flueframework.com/docs/reference/streaming-protocol/)
- [Flue provider API](https://flueframework.com/docs/reference/provider-api/)
- [Flue Node target](https://flueframework.com/docs/guide/node-target/)
- [Flue changelog](https://github.com/withastro/flue/blob/main/CHANGELOG.md)

The official migration guide begins from a later beta than SIM-ONE's beta.1
baseline. Therefore, this is a source-informed migration, not a mechanical
rename exercise. Every changed API must be verified against the installed Flue
2 types and an executable focused test.

## Product Invariants

The migration must preserve these contracts:

1. Flue remains the agent harness. SIM-ONE does not replace removed Flue APIs
   with a second agent framework.
2. The orchestrator remains a coordinator. It loads protocols on every call,
   delegates substantive work to owned workers, and validates results.
3. Protocols remain SQLite runtime rules. Skills remain reusable workflow
   knowledge. Tools remain executable capabilities. Registries remain the
   authoritative runtime extension boundary.
4. Runtime-added skills, tools, workers, and MCP servers remain supported from
   the movable `.gorombo` runtime tree.
5. Connectors retain connector-specific session policy: the TUI starts fresh by
   default and resumes only when requested; persistent messaging connectors can
   retain their connector-owned instance identity.
6. All mutating coding and capability-management operations remain fail-closed
   behind the approval service.
7. Tool, worker, handoff, plan, verification, and state transitions continue to
   produce durable structured progress visible in the TUI and other connectors.
8. `sim-one` remains the product CLI. Its packaged TUI continues to start or
   reuse the local gateway and works independently of the caller's current
   directory.
9. Existing app-owned databases, runtime configuration, workspaces, and user
   capability packages are not silently deleted or overwritten.

## Observed Impact

The beta.1 implementation has broad framework coupling:

- 101 source, script, client, and TUI files reference an `@flue/*`
  package.
- 33 TypeScript files contain 128 `defineTool(...)` definitions using the beta
  `parameters` and `execute` contract.
- `src/agents/orchestrator.ts` and the researcher, coding, and capability
  workers use removed `createAgent` and `defineAgentProfile` APIs.
- `src/app.ts` uses the removed automatic `flue()` router.
- Session code imports removed beta session types and, in one case,
  `@flue/runtime/internal`.
- Provider modules use removed `registerProvider` behavior.
- The Telegram connector uses beta dispatch and `conversationKey` semantics.
- The Ratatui stream parser and prompt route consume beta event and synchronous
  response behavior.
- The legacy Ink client uses beta React provider and agent hooks.
- The build expects `.gorombo/sim-one-alpha/server.mjs`, while Flue 2's Vite
  Node target emits distribution artifacts that must be staged into that
  product-owned location.

These counts are inventory evidence, not a fixed acceptance metric. They must
be rerun in each relevant implementation slice to catch newly added beta usage.

## Official Checklist Mapping

| # | Official area | Current SIM-ONE surface | Required migration and acceptance |
|---|---|---|---|
| 1 | Package pins | Root `package.json`, `pnpm-lock.yaml`, `sim-one-cli/package.json` | Pin all coordinated `@flue/*` packages to one verified 2.0.x release and update Pi AI as required by that release. No beta Flue package or incompatible duplicate remains in the lockfile. |
| 2 | Build, Vite, config, generated files | `flue.config.ts`, `scripts/run-flue.mjs`, build/package scripts, `.gorombo/sim-one-alpha` | Replace beta build/dev assumptions with the Flue 2 Vite flow. Keep generated Flue files out of hand-maintained source. Stage the verified Node output and dependencies into the existing movable product runtime. |
| 3 | Explicit routing | `src/app.ts`, custom API routes, health and auth middleware | Replace `flue()` with explicit `createAgentRouter` mounting. Preserve product middleware and custom routes. Direct agent submissions follow Flue 2's asynchronous 202 contract. |
| 4 | Agent functions and hooks | Orchestrator, worker agents, dynamic worker packages, profiles, sandboxes | Convert each exported agent to a synchronous capitalized function in a `'use agent'` module. Compose exactly one `useModel` with `useTool`, `useSkill`, `useSubagent`, `useMcpConnection`, and `useSandbox` as owned. Replace beta profiles with Flue 2 subagent definitions or agent functions. |
| 5 | Tool contract | `src/engine/tools`, worker tools, runtime tool scaffolds and validators | Convert `parameters` to `input`, `execute` to `run`, read validated arguments from `data`, and return Flue 2-compatible envelopes for non-string results. Update generated runtime packages and validators with the same contract. |
| 6 | Skill imports | `src/skills`, orchestrator and worker skill registration, runtime skill registry | Replace beta import/attachment behavior with Flue 2 skill hooks while preserving top-level application skills and runtime registry ownership. Skills never absorb protocol rules. |
| 7 | Workflow removal | `src/workflows`, research dispatch, retrieval and web-research services | Remove deleted Flue workflow APIs. Use agent `init`, `dispatch`, and `read`, durable tools, or app-owned bounded orchestration as appropriate. Plain retrieval services may remain plain services. |
| 8 | Channels and database | Telegram, session database, Flue session stores, app-owned SQLite | Change channel identity from `conversationKey` to `instanceId`. Replace removed Flue stores with the Flue 2 submission, conversation-stream, and attachment model. Keep SIM-ONE-owned databases separate from Flue-owned persistence. |
| 9 | Providers and Pi | RunPod, Ollama cloud/local, Codex Brain, model cards | Replace registration with Pi-native `createProvider` and `setProvider`. Keep model cards secret-free and preserve configuration lookup through canonical runtime config. Verify streaming, tools, reasoning, retries, and provider fallback with real output. |
| 10 | Observability | telemetry, progress events, status adapters, run identifiers | Map beta run and event fields to Flue 2 submission, instance, conversation, and chunk identifiers. Keep SIM-ONE's durable typed progress contract rather than exposing raw framework logs as product state. |
| 11 | Clients | Ratatui TUI, CLI, Telegram, legacy Ink package, SDK usage | Update clients to asynchronous submission semantics and the conversation-chunk stream. Preserve the product-owned chat facade only where its synchronous response is an intentional compatibility contract. |
| 12 | Deployment and state reset | `.gorombo` package, persistence paths, release scripts, service startup | Use a new Flue 2 persistence namespace. Never point Flue 2 at the beta database and never delete beta data during startup or build. Package Vite output into the established movable runtime layout and test from an arbitrary cwd. |
| 13 | Verification | Unit, integration, Rust, product smoke, CI, docs checks | Run focused contract tests per slice, then the full Node/Rust/build/product suite. Verify an actual agent response, live chunk stream, Telegram lifecycle, TUI lifecycle, restart persistence, packaging, and docs/graph parity. |

## Target Runtime Architecture

### Build And Packaging

Flue 2 owns compilation through Vite. SIM-ONE owns final product assembly. The
build must:

1. Compile the Flue application with the supported Vite integration.
2. Produce and execute the official Node target successfully before packaging.
3. Stage the resulting `server.mjs`, application artifact, dependencies, source
   workspaces, runtime capability seeds, config example, and required assets
   under `.gorombo/sim-one-alpha`.
4. Preserve launcher behavior that locates the owner of the `.gorombo` tree and
   sets the child gateway cwd accordingly.
5. Prove the standalone product from a directory outside the repository.

The package builder must not depend on an untracked source-tree path or assume
that `process.cwd()` is the project root.

### Routing And Product Chat Facade

`src/app.ts` continues to own Hono ingress, middleware, health checks, and
custom routes. It mounts an explicit Flue 2 agent router and contains no agent
orchestration logic.

The mounted Flue route uses the official 202 submission behavior. The existing
`/api/chat/events` product route may remain a compatibility facade for the TUI
and other product clients, but it must use public Flue 2 APIs to initialize an
agent instance, dispatch a submission, and read its settled result. It must not
use `@flue/runtime/internal`, a removed `?wait=result` parameter, or private
database records.

### Agents, Workers, And Runtime Capabilities

Each built-in agent becomes a Flue 2 agent function with static hook composition
where possible. Runtime registry content remains dynamic, so it needs an
explicit adapter from validated SIM-ONE registry records to supported Flue 2
definitions before the owning agent function executes.

Async preparation such as GitHub MCP connection setup must move outside the
synchronous agent function. On the Node target, supported top-level MCP
connection construction can prepare a connection that the agent consumes with
`useMcpConnection`. Startup failure and missing configuration remain visible and
fail according to the capability's required/optional contract.

Dynamic worker package schemas, scaffolds, validation, CLI commands, and
documentation must all target the same Flue 2 definition. The orchestrator sees
only approved top-level workers; worker-owned internal subagents remain hidden.

### Tools, Skills, MCP, And Approvals

Tool migration is contract-wide, not a search-and-replace limited to built-in
tools. Update:

- built-in orchestrator and worker tools;
- runtime package loaders and validators;
- capability-manager and coding-worker scaffolds;
- sample packages and fixtures;
- approval-wrapped mutation and GitHub MCP tools;
- tests and documentation that show tool authoring.

All runtime validation flows continue through the applicable protocol and
approval contracts. Flue 2 hook syntax does not bypass the registries or attach
unapproved mutation capabilities directly to an agent.

### Workflows And Bounded Orchestration

Removed workflow APIs are replaced according to behavior:

- conversational agent execution uses public agent instance submission APIs;
- model-callable resumable work uses durable tools;
- deterministic retrieval and indexing remain app-owned services behind tools;
- bounded worker loops remain Flue-governed and emit structured progress.

No compatibility class recreates the deleted beta workflow framework.

### Persistence And Sessions

Flue 2 persistence is reset-only relative to beta persistence. The migration
must create a distinct Flue 2 database path or namespace. It must not open,
upgrade, truncate, or delete the beta Flue database.

SIM-ONE-owned session identity, names, connector policy, memory records, task
state, and transcript compatibility must be classified separately from
framework persistence. Data that remains valid is carried through an explicit
SIM-ONE migration or read adapter, not by handing old tables to Flue 2.

Before the persistence implementation merges, resolve and record:

1. Whether beta conversation history is read-only archived, imported into
   SIM-ONE-owned transcript storage, or intentionally not exposed in Flue 2.
2. The exact new Flue 2 database path and rollback boundary.
3. How `/compact` triggers a supported deterministic compaction operation.
   Automatic model compaction can use `useModel` configuration, but it is not a
   substitute for the user-invoked command.

Startup must identify the selected instance clearly, preserve the TUI's fresh
default, and preserve persistent connector behavior without a global
"primary session" shortcut.

### Streaming And Ratatui

The Ratatui TUI must consume Flue 2's conversation update protocol rather than
beta runtime events. The adapter must handle:

- snapshot version 1;
- message started, delta, and completed chunks;
- reasoning chunks;
- tool input, output, and error chunks;
- submission settlement;
- update offsets and live SSE reconnection;
- UTF-8 and chunked HTTP framing without lossy intermediate decoding.

The transcript reducer converts framework chunks into SIM-ONE display rows. It
must preserve the existing live-tail, history, Markdown styling, operation
timing, approval drop-up, prompt editor, and no-duplicate-final-response
contracts. Flue 2's coalesced assistant conversation message becomes the
authoritative finalized response; streamed text remains provisional until that
message settles.

Prompt submission, startup greeting, slash commands, resume, rename, compact,
new, and exit behavior must be tested through the standalone packaged binary.

### Providers And Observability

Provider migration uses Pi-compatible provider factories selected from existing
model cards. Tests must check actual response content and streamed behavior,
not merely successful registration or a listening process.

Telemetry maps Flue 2 identifiers into SIM-ONE's stable progress schema. Raw
conversation chunks can feed transcript rendering, but tools and worker state
remain typed product events so Telegram, TUI, and future connectors receive the
same semantic progress.

## Delivery Slices

Implementation uses dependency-ordered stacked branches or PRs. Every PR must
contain fewer than 100 changed files. Count files before opening each PR; split
the slice again if generated lockfile or fixture changes would cross the limit.

Activating the Flue 2 package set removes beta APIs across all source surfaces
at once. Because this migration prohibits compatibility shims, intermediate
stacks are not expected to pass the repository-wide typecheck or emit the final
server before their dependent source conversions land. Each stack must pass its
owned focused checks and record the exact remaining compiler or build boundary.
The final verification stack must make the complete repository, production
build, and product smoke matrix green before any migration stack is mergeable.

1. **Foundation:** package pins, Vite/config, generated-file policy, explicit
   router, provider factory contract, and focused build tests. This establishes
   the shared framework contract before dependent changes.
2. **Agents and workers:** orchestrator and worker agent functions, hooks,
   subagent definitions, explicit sandboxes, workspace boundaries, and focused
   delegation tests.
3. **Capabilities:** tools, skills, MCP setup, runtime package schemas,
   scaffolds, registries, protocols, approvals, and focused capability tests.
4. **Persistence and execution:** removed workflows, agent dispatch/read facade,
   new Flue 2 persistence namespace, session/history policy, observability,
   schedules, and HTTP integration tests.
5. **Connectors and clients:** Telegram `instanceId`, Ratatui conversation-chunk
   adapter, CLI behavior, legacy Ink disposition or migration, and connector
   integration tests.
6. **Product packaging:** `.gorombo` staging, arbitrary-cwd launcher behavior,
   runtime dependencies, standalone TUI/server smoke, restart tests, and release
   package construction.
7. **Documentation:** update current-state architecture, OpenWiki, guides,
   operations, examples, diagrams, source maps, and release status only after
   the corresponding behavior is verified.
8. **Production verification:** run the complete CI and product matrix, prove
   real Telegram and packaged TUI flows, scan for removed beta APIs, and confirm
   every prospective stacked PR remains below 100 changed files.

Each slice updates the lifecycle graph before mutation, records focused evidence,
and invalidates downstream nodes whose assumptions changed. A dependent slice
must not merge ahead of its shared contract.

## Verification Matrix

| Surface | Focused evidence | Production evidence |
|---|---|---|
| Packages/build | Lockfile has one compatible 2.0.x set; Vite reaches the next recorded source-migration boundary | Final Vite Node output and packaged `.gorombo` runtime start outside repo cwd |
| Agents | Hook composition and protocol-first tests | Real orchestrator response with worker delegation |
| Tools/skills/MCP | Contract, schema, envelope, registry, and approval tests | Runtime-added capability loads and executes through ownership controls |
| Providers | Factory/model-card unit tests | Real streamed response, tool call, retry, and configured fallback |
| Persistence/sessions | New namespace and no-beta-open guards | New, resume, rename, compact, exit, restart, and history behavior |
| HTTP/routing | 202 route and product facade tests | Authenticated and loopback requests produce correct settled output |
| Telegram | `instanceId` and connector policy tests | Persistent conversation survives gateway restart |
| Ratatui | Chunk parser/reducer, UTF-8, reconnect, tail, input, approvals | Standalone binary starts gateway and completes multi-turn production flow |
| CLI/package | Flag routing and runtime-root tests | `sim-one`, capability commands, and arbitrary-cwd execution |
| Documentation | Graph, manifest, links, snippets, and terminology checks | Operator follows documented clean install and migration procedure |

Required repository commands are taken from the current `package.json`, not
assumed names. At minimum, the final slice runs the configured unit suite,
typecheck, build, Rust tests, Ratatui tests, product smoke, and graph/specification
verification after building the WASM artifact and fetching the embedding model.

## Documentation Update Matrix

Implementation slices must update affected current-state documentation in the
same PR as behavior. Expected surfaces include:

- `docs/architecture/flue-architecture.md`
- `docs/architecture/gorombo-flue-map.md`
- `docs/architecture/product-flow.md`
- agent, tool, skill, worker, registry, session, provider, and configuration
  architecture documents
- `docs/architecture/tui-cli-session-flow.md`
- `docs/tui/ratatui.md` and `docs/tui/session-management.md`
- `docs/guides/connectors.md` and `docs/guides/terminal-and-sessions.md`
- `docs/operations/product-tui.md` and
  `docs/operations/telegram-connector.md`
- build, packaging, installation, onboarding, and contributor documentation
- OpenWiki architecture, workflows, operations, integrations, tests, and source
  maps
- diagrams, examples, templates, runtime capability authoring docs, and
  `docs/getting-started/pre-release-status.md`

Do not rewrite these documents to describe Flue 2 as current before the
corresponding implementation and tests are merged.

## Completion Contract

The migration is complete only when:

1. No production source, generated runtime package, scaffold, or client imports
   or emits a removed beta Flue API.
2. The official 13-item checklist has executable evidence.
3. Flue-owned persistence uses the new namespace and beta data remains untouched.
4. Built-in and runtime-extensible capabilities work through the intended
   protocol, registry, ownership, and approval boundaries.
5. Telegram and the standalone SIM-ONE TUI pass real multi-turn tests, including
   restart and session-management behavior.
6. The packaged product works from an arbitrary current directory.
7. Current-state architecture, operations, guides, OpenWiki, graph, manifest,
   examples, and release status match the verified implementation.
8. All required CI and production smoke checks pass with output-level proof.
