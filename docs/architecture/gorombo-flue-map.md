# SIM-ONE Alpha Flue Map

This file maps Flue architecture to this repository.

## Top-Level Source Directory Map

Every top-level `src/` entry should fit one of these categories: Flue-facing
application files (`src/agents/`, `src/channels/`, `src/skills/`, `src/db.ts`,
`src/app.ts`), application workflow files (`src/workflows/`), root support
files (`src/index.ts`, `src/workspace-loader.ts`, `src/AGENTS.md`), or one of
the consolidation buckets (`src/core/`, `src/api/`, `src/engine/`,
`src/workspace/`, `src/tests/`). If a new directory is added, update this map
in the same change.

### Flue-facing top-level files and directories

Vite builds these from the `src/` root. Agent, channel, persistence, and skill
entries use Flue 2 APIs; workflow files are ordinary application modules.

| Path | Type | Ownership rule |
| --- | --- | --- |
| `src/agents/` | Flue 2 agent entrypoints | `'use agent'` synchronous agent functions. `src/app.ts` explicitly mounts the public orchestrator with `createAgentRouter(...)`. |
| `src/workflows/` | Application workflows | Finite TypeScript functions that can initialize agents, manage bounded loops, and return structured results. Flue 2 does not discover or route these files. |
| `src/channels/` | Flue 2 channel handlers and provider clients | `telegram.ts` owns verified ingress and stable Flue conversation routing; `telegram-client.ts` owns the official Bot API client and a reply tool bound from trusted delivery context. `src/app.ts` explicitly mounts Telegram under `/channels/telegram`. |
| `src/skills/` | Flue Agent Skills | Application-owned Agent Skills imported directly and registered by the owning agent with `useSkill(...)`. These are built-in skills, not post-build registry capabilities. |
| `src/db.ts` | Flue persistence adapter entrypoint | Exports the Flue 2 SQLite adapter backed by the dedicated `flue-v2.sqlite` store and bootstraps application-owned persistence. |
| `src/app.ts` | Application entrypoint | Hono composition root with explicit Flue 2 agent and channel routers. |

### `src/core/` — cross-cutting foundations

| Path | Type | Ownership rule |
| --- | --- | --- |
| `src/core/config/` | Runtime configuration | Typed config loaders, the canonical `.gorombo` runtime-root resolver, and shipped non-secret config source files. |
| `src/core/models/` | Model subsystem | Model cards, provider registration, model registry, limits, and runtime bootstrap. |
| `src/core/protocols/` | Protocol storage/access subsystem | Protocol schemas and provider implementations used by protocol tools. |
| `src/core/schemas/` | Shared runtime schemas | Valibot schemas for structured-output contracts and cross-subsystem data shapes. Each domain owns a file here when its schemas are reused outside a single file. `memory.ts` is the source of truth for the Rust Memory Helper record/input shapes. Imported by `src/core/types/` and worker type contracts; kept separate so type-only consumers do not pull in schema runtime code. |
| `src/core/telemetry/` | Observability subsystem | Sanitized Flue event capture and run summaries. |
| `src/core/types/` | Shared TypeScript contracts | Public/common interfaces used across subsystems. |
| `src/core/utils/` | Generic helpers | Small cross-cutting helpers only; domain subsystems do not belong here. |

### `src/api/` — HTTP/connector ingress surface

| Path | Type | Ownership rule |
| --- | --- | --- |
| `src/api/connectors/` | Connector normalization | External-source adapters that normalize input into internal message shapes. Legacy Telegram ingress moved to `src/channels/telegram.ts`. |
| `src/api/ingress/` | Application ingress modules | Cross-cutting ingress logic that turns internal worker events and storage into HTTP/connector-facing surfaces. Example: the approval ingress bridges `CodingApprovalService` to HTTP routes, CLI, and connectors. |
| `src/api/middleware/` | HTTP middleware | Reusable Hono middleware such as API-secret auth. |
| `src/api/routes/` | HTTP route modules | Concrete app-owned Hono route registration modules. |

### `src/engine/` — agent runtime and capabilities

| Path | Type | Ownership rule |
| --- | --- | --- |
| `src/engine/approvals/` | Shared approval subsystem | Approval service factory and ingress types shared by the coding worker and connectors/HTTP/CLI surfaces. |
| `src/engine/capabilities/` | Runtime capability registry subsystem | SQLite-backed runtime store plus the shared protocol-routed lifecycle service, exact source materialization, rollback, loaders, and MCP broker. `sim-one` and `capability-manager` share this service. |
| `src/engine/commands/` | Pre-LLM command parsing | Slash command definitions and parsing that run before prompts reach the LLM. |
| `src/engine/embeddings/` | Bundled local embedding model | In-process ONNX + tokenizer path used by the RAG embedding fallback. |
| `src/engine/memory/` | Shared memory subsystem | Memory retrieval interfaces and routing shared by agents/tools/workflows. Hosts `rust-memory-engine.ts`, the TypeScript shim for the `gorombo-memory` WASM engine (structured memory: checklists, todos, session notes), and `checklist-memory-provider.ts`, the structured-memory RAG provider. Also hosts `knowledge-service.ts` (the shared service module folded in from the removed `src/services/` directory). |
| `src/engine/rag/` | Shared retrieval subsystem | Retrieval provider interfaces, document indexing, vector storage, embedding routing, and result packing shared across retrieval workflows. |
| `src/engine/registries/` | Registry subsystem | Typed source-defined registries for base tools, skills, agents, and protocol metadata. Runtime capability authority remains in `src/engine/capabilities/`. |
| `src/engine/schedules/` | Scheduled execution subsystem | Standalone scheduled/recurring/one-shot agent execution: schedule definitions + run history durable in SQLite (`node:sqlite`, `.gorombo/db/schedules.sqlite`), firing via Croner in-process, rehydrated on restart. Dispatch persists the Flue 2 receipt and awaits `read(receipt)` for exact settlement. Exposed via orchestrator `schedule_*` tools, coding-worker `coding_schedule_*` aliases (lead-only), and the `/api/schedules/*` admin route. See `docs/architecture/schedules-system.md`. |
| `src/engine/session/` | Session/context subsystem | Flue 2 conversation persistence, connector prompt delivery correlation, ownership-scoped product-session generations, semantic transcript projection, compaction policy, context budget, and usage tracking. |
| `src/engine/tools/` | Model-callable tools | `defineTool(...)` capabilities attached only to owning agents. |
| `src/engine/workers/` | Worker/subagent implementations | Specialized `defineSubagent(...)` definitions plus worker-local support code and workspaces. |

### `src/workspace/` — agent persona content

| Path | Type | Ownership rule |
| --- | --- | --- |
| `src/workspace/` | Main agent workspace content | Source persona markdown copied read-only into the packaged main-agent workspace. It is not the Coding Worker sandbox. The main orchestrator exposes no generic Flue virtual filesystem or shell tools; durable artifact work routes to the Coding Worker under `<runtime-root>/workspace`. No TypeScript runtime code or model-created repositories belong here. |

### `src/tests/` — test suite

| Path | Type | Ownership rule |
| --- | --- | --- |
| `src/tests/` | Test suite | Node test files compiled to `.tmp/tsc/tests`. |

Top-level non-`src/` directories:

| Path | Type / ownership rule |
| --- | --- |
| `crates/gorombo-memory/` | Rust engine compiled to WebAssembly via `wasm-pack`. Owns the structured-memory data model, validation (scope non-empty, slug uniqueness, checklist cycle/depth), the in-memory inverted index, and the query planner. Never exposed to the model or agents directly — only via `src/engine/memory/rust-memory-engine.ts`. The TypeScript shim generates ids/timestamps/audit fields (Rust owns no clock/RNG in the WASM target) and passes fully-formed records to the WASM exports. The WASM module keeps a `thread_local` store hydrated by `reconcile_index` from the durable SQLite store on cold start. |
| `sim-one-cli/` | Product command wrapper. Owns `sim-one` command routing, capability subcommands, and the legacy `--ink` fallback. No-argument `sim-one` launches the packaged Ratatui binary instead of owning terminal UI state itself. |
| `tui/ratatui/` | Production local terminal client. Owns typed gateway-history loading, one semantic replay/live transcript document, root-only assistant stream consolidation, paged prepend with stable viewport anchors, assistant Markdown-to-terminal rendering, semantic transcript-row formatting, the responsive two-column transcript margin, bold prefix-only color accents, the centralized terminal palette, Unicode display-width-aware word wrapping and vertical cursor movement for transcript/prompt rows, pane-aware mouse routing, logical transcript and prompt selection, OSC52 clipboard handoff, clickable/scrollable slash-command drop-up, draggable transcript scrollbar, multiline prompt editing (including local `\` then Enter newline insertion), the product/explicit-session-name transcript header, explicit session-label status synchronization, immediate display of root Flue `text_delta`/`message_end`, full-range HTTP-result reconciliation, frame-level transcript live-tail enforcement, the virtual blank tail margin, TUI-local slash commands, gateway launch/reuse, stream attach/restart, and the packaged `sim-one-ratatui-tui` binary. Nested worker response payloads remain internal to the orchestrator. It is a connector surface, not an agent runtime and never reads runtime databases directly. |
| `scripts/` | Build, smoke, and admin scripts. `package-runtime-dependencies.mjs` installs isolated production dependencies beside the Flue Node server. TUI-relevant scripts include `build-ratatui-tui.mjs`, `check-sim-one-product-command.mjs`, `test-ratatui-product.mjs`, `test-ratatui-interactive.py`, `test-ratatui-visible-final.py`, `test-tui-e2e.mjs`, `test-built-http.mjs`, and `capability-admin.mjs`. |
| `docs/tui/` | User-facing TUI guides. Keep command and behavior descriptions aligned with `docs/architecture/tui-cli-session-flow.md`. |
| `docs/operations/` | Operator runbooks for packaged runtime and connectors. `product-tui.md` owns packaged launch, runtime paths, env files, and smoke commands. |
| `.gorombo/` | Movable packaged runtime root. Owns product binaries, root config/environment, packaged persona assets, mutable databases/capabilities/approvals/logs, Coding Worker state, and the separate host-visible, restart-persistent `workspace/{repos,projects}` model-write boundary. Flue virtual paths such as `/home/user` are not part of this tree. |

Root source files:

```text
src/app.ts
  Hono application shell and explicit Flue 2 router mounts.

src/db.ts
  Flue Node persistence adapter entrypoint discovered by Flue at build time.
  Exports the SIM-ONE Alpha persistence adapter wrapper around Flue's sqlite() adapter.

src/index.ts
  Package barrel for exported connector, registry, and type helpers.
  It must not re-export removed non-Flue orchestrator or gateway paths.

src/workspace-loader.ts
  Shared workspace markdown loader.
  Composes workspace files in a fixed order for agent instructions.
  Stays as a root support file because it is currently the only file in this category.
  Keeps user-editable workspace content separate from TypeScript agent entrypoints.
```

## Runtime Surfaces

```text
src/app.ts
  Hono application shell.
  Explicitly mounts createAgentRouter(Orchestrator) and the Telegram channel router.
  May expose health checks and app-owned ingress.
  Registers the lightweight Flue telemetry observer.
  Applies imported API-secret middleware to protected agent routes.
  Custom chat ingress dispatches and reads the durable orchestrator directly.
  Must not call the old non-Flue orchestrator.

src/api/middleware/api-secret.ts
  Imported Hono middleware for API-secret auth.
  Reads runtime env bindings and Node process env.
  Bypassed for loopback origins (127.0.0.1, ::1). Fails closed for non-loopback when API_SECRET is missing.

src/api/routes/chat-events.ts
  App-owned /api/chat/events ingress alias.
  Verifies API-secret middleware, normalizes the HTTP boundary, persists trusted event context, binds the current event through request-local trusted context for model-callable authorization tools, resolves the prompt's product session, handles pre-LLM slash commands (/new, /clear, /resume, /rename, /compact), and uses init/dispatch/read against the active orchestrator generation.
  Does not call a framework workflow route or a non-Flue orchestrator.

src/api/routes/chat-sessions.ts
  Product session lifecycle API.
  Creates a fresh durable TUI session, validates exact owned-session resume, lists sessions only for the supplied stable TUI scope, and exposes the ownership-validated canonical-id transcript projection. Lifecycle and transcript reads do not create normalized message events.

src/engine/session/session-routing.ts
  Owns session creation/resume access checks and connector persistence policy.
  Only Telegram currently reuses a connector-scoped active session; TUI and non-messaging surfaces create fresh sessions unless an exact owned session id or explicit name is resumed.

src/engine/session/session-transcript.ts
  Product-owned semantic transcript projection.
  Correlates normalized connector prompts with Flue durable submissions, sanitizes root public activity/finals, pages by opaque prompt cursors, and returns the stream `nextOffset` used for replay-to-live handoff. It uses the connected Flue persistence interface and does not open SQLite directly.

sim-one-cli/src/cli.tsx
  Product CLI wrapper.
  Routes no-subcommand `sim-one` to the packaged Ratatui binary.
  Routes `skill`, `tool`, `worker`, and `mcp` subcommands to capability management without launching the TUI.
  Keeps `--ink` as a legacy fallback path only.

tui/ratatui/src/main.rs
  Ratatui binary entrypoint.
  Wires gateway startup/reuse, default fresh creation versus explicit `--session` id/name resolution, scripted product-smoke modes through the same lifecycle, terminal setup/restore, event loop, diagnostics initialization, clipboard delivery, and final `/exit` session-id output.

tui/ratatui/src/diagnostics.rs
  Privacy-safe local TUI diagnostics.
  Resolves the packaged `.gorombo/logs` path, writes typed JSONL lifecycle/input events, rotates bounded files, and deliberately excludes prompt, response, selected-text, session-name, secret, and raw-error content.

tui/ratatui/src/gateway.rs
  Packaged gateway launcher.
  Derives the owning `.gorombo` tree from the executable, resolves
  `sim-one-alpha/server.mjs` and root `gorombo.config.json`, checks /health,
  starts the server with that root as cwd and
  `GOROMBO_RUNTIME_ROOT`, and stops only a child process it started.

tui/ratatui/src/agent.rs
  TUI HTTP client.
  Creates fresh sessions through `POST /api/chat/sessions`, validates explicit id/name resume through `POST /api/chat/sessions/:selector/resume`, accepts canonical ids returned by the gateway, and reads the scope-filtered lifecycle list for `/sessions`.
  Sends normal prompts and backend-owned slash commands through `/api/chat/events` as connector `tui` with stable `local-tui` actor/conversation/thread scope and the current durable session id.

tui/ratatui/src/history.rs
  Typed transcript-history gateway client.
  Loads canonical-id pages with stable TUI ownership fields, parses the display-neutral exchange contract, and returns the snapshot stream offset without exposing persistence details to the app.

tui/ratatui/src/transcript.rs
  Ordered semantic replay/live document.
  Keeps completed snapshot exchanges immutable, applies root live updates through stable compound identities, orders terminal activity before the final assistant response, and exposes stable source-line ids for pagination anchors and selection.

tui/ratatui/src/app.rs
  TUI state reducer.
  Owns asynchronous fresh-create and explicit id/name resume/history startup phases, missing-selector fresh fallback, greeting-only-on-fresh ordering, snapshot-before-stream input locking, older-page requests and viewport-anchor restoration, fail-closed forbidden/ambiguous startup input, prompt editing and UTF-8-safe selection, selection-aware Ctrl+C copy-versus-exit, slash-command metadata/filtering/keyboard/mouse selection state, pane hit regions, transcript scroll/scrollbar/logical-selection state, queued clipboard text, the product/explicit-session-name header, pending spinner/status, dimmed root-assistant live text, immediate final-message display from root Flue `message_end`, idempotent full-range HTTP reconciliation, final-response/activity ordering, the rendered-only blank tail margin, TUI-local commands (`/session`, `/sessions`, `/help`, `/exit`), backend command response handling for `/new`, `/clear`, `/resume`, `/rename`, `/compact`, active session switching, and stream restart.

tui/ratatui/src/input.rs
  Terminal event normalization.
  Filters key release/unsafe Enter-repeat events while preserving complete Crossterm mouse events for pane-aware app routing.

tui/ratatui/src/ui.rs
  Ratatui frame layout and presentation.
  Publishes per-frame prompt, palette, transcript, and scrollbar hit regions; renders semantic transcript/Markdown rows, prompt state, and reversed selection highlights.

tui/ratatui/src/terminal.rs
  Terminal lifecycle and host integration.
  Enables/disables mouse capture across normal/panic paths and writes completed selections to the host clipboard through OSC52.

tui/ratatui/src/text_wrap.rs
  Shared transcript/prompt row layout.
  Wraps before a word that does not fit, never splits words across rows, preserves explicit newlines and source character ranges, and uses Unicode terminal display columns for wrapping, padding, and prompt cursor placement.

tui/ratatui/src/markdown.rs
  Assistant-response Markdown presentation.
  Converts canonical Markdown into styled terminal spans and wraps those spans without splitting words or losing inline styles.

tui/ratatui/src/theme.rs
  Central Ratatui palette.
  Owns submitted-user gray bands, the darker prompt-editor background, dimmed live-assistant style, gray italic thinking style, and bold semantic prefix colors for assistant, activity, system, preflight, log, and error rows so visual semantics are not scattered through state code.

src/api/routes/knowledge.ts
  App-owned /api/knowledge and /api/knowledge/reindex routes.
  Accepts API-secret-authenticated knowledge entries, persists them to the vector knowledge base, and triggers background re-indexing of project files and knowledge docs.

src/engine/schedules/boot.ts
  Side-effect boot target imported by src/app.ts (mirrors ./core/models/runtime.js).
  Loads the schedules config block, constructs and starts the ScheduleManager singleton (schema, cleanup, and enabled Croner job rehydration), and registers SIGTERM/SIGINT drain. Skips when disabled or in test mode; a start failure logs and leaves the manager unset so the rest of the app runs. Schedules are app-owned business data in their own node:sqlite file, not the Flue SQLite adapter.

src/api/routes/schedules.ts
  App-owned /api/schedules/* admin route (full v1), behind requireApiSecret.
  CRUD + pause/resume + force-fire + run history; forwards into the Flue agent dispatch path (create/update/delete/pause/resume mutate the row + syncCron; run calls fireNow which dispatches). ?wait=1 polls the runId to terminal.

src/db.ts
  Flue persistence adapter entrypoint.
  Exports Flue 2's Node sqlite() adapter for canonical agent instances, submissions, messages, snapshots, and updates in the dedicated flue-v2.sqlite store.
  Initializes the SIM-ONE persistence runtime for product sessions and reconciles configured runtime capabilities.
  Leaves the beta flue.sqlite database unchanged as a rollback archive.

src/api/routes/telemetry.ts
  Protected app-owned telemetry inspection routes.
  Exposes sanitized in-memory Flue event summaries by execution id at /api/telemetry/executions.
  Uses submissionId when present and otherwise instanceId as the execution key.

src/core/schemas/
  Shared Valibot schemas for structured runtime contracts.
  Owned by the subsystem that defines the shape; promoted here only when the schema is reused across files or subsystems.
  Example: `src/core/schemas/coding-worker.ts` holds `CodingImplementerResultSchema` and the derived `CodingImplementerResult` type, used by the implementer subagent tool, the delegation path in `src/engine/workers/coding-worker/workflow/coordination.ts`, and re-exported from `src/engine/workers/coding-worker/types.ts`.

src/core/telemetry/flue-telemetry.ts
  Registers Flue observe(...) once per running application context.
  Stores sanitized live event summaries in memory by submissionId or instanceId.
  Tracks whether an execution delegated to the researcher and whether web_research was called.

src/agents/orchestrator.ts
  Main Flue orchestrator agent.
  Coordinates protocols, memory lookup, subagent delegation, and final synthesis.
  Composes its instructions from main workspace files plus a small runtime capability block.
  Registers the built-in `greeting-preflight` Agent Skill from `src/skills/greeting-preflight/SKILL.md`.
  Does not own web search.
  Directly owns `generate_image`, `record_image_artifact`, and `list_image_artifacts` for Runpod Public Endpoints image generation.

  Image generation tools backed by Runpod Public Endpoints.
  - `generate_image` calls Runpod, downloads the image, and saves it to `workspace/images/`.
  - `record_image_artifact` persists metadata to SQLite and indexes a memory summary.
  - `list_image_artifacts` queries prior artifacts from SQLite.
  - `models.yaml` is the human-editable model catalog copied into `.gorombo/sim-one-alpha/` and `.tmp/tsc/` at build time.

src/workspace/
  Main agent user-editable workspace persona files.
  Persona names and identity details live inside file contents, not architecture paths.

src/skills/greeting-preflight/SKILL.md
  Built-in Flue Agent Skill for connector startup greeting events.
  The Ratatui TUI sends a normal startup prompt that tells the orchestrator to use this skill with the preflight report.
  The skill is guidance only; executable preflight checks stay in the connector/gateway startup path.

src/engine/workers/researcher/researcher.ts
  Researcher defineSubagent(...) factory and direct 'use agent' function.
  Owns web research behavior.
  Composes its instructions from its workspace files plus a small runtime capability block.
  May use tools, skills, and application workflow functions.

src/engine/workers/researcher/workspace/
  Researcher subagent user-editable workspace persona files.

src/engine/workers/coding-worker/coding-worker.ts
  Coding Worker lead defineSubagent(...) factory and 'use agent' function.
  Owns coding-worker instructions, worker-local GitHub tools, coding-process skills, approval-aware side-effect boundaries, public progress event rules, and worker-local internal subagent definitions.
  The main orchestrator delegates coding work only to this lead definition.
  Receives `<runtime-root>/workspace` from the orchestrator and passes it to worker-owned tools.
  Connects the official GitHub MCP through Flue when the trusted runtime PAT is configured.
  Attaches selected read-only MCP tools and keeps GitHub mutations behind SIM-ONE approval wrappers.

src/engine/workers/coding-worker/workspace/
  Coding worker user-editable workspace persona files.
  Documents the lead coding worker identity, principal hierarchy, tools, approval gates, verification rules, and progress expectations.

src/engine/workers/coding-worker/subagents/
  Worker-local internal coding subagents used only by the coding-worker lead.
  Includes triage, implementer, test-debug, code-review, and GitHub/PR specialists.
  These are not top-level orchestrator-addressable workers.

src/engine/workers/coding-worker/tools/
  Worker-local workspace/project, shell, git, GitHub, and approval-aware execution tools.
  Includes the LSP code-intelligence tools under `src/engine/workers/coding-worker/tools/code-intelligence/lsp/`.
  File APIs are backed by Flue's Node local sandbox factory.
  Shell/git/test child processes run through a Bubblewrap mount and process namespace with only the workspace read-write, the active Node and system runtime read-only, and a private temporary directory; an authenticated private Git child may additionally receive a secret-free read-only askpass helper plus a dedicated owner-only token file, with repository hooks disabled and no PAT value in the Git environment. Execution fails closed when that Linux boundary is unavailable.
  The sandbox is rooted at `<runtime-root>/workspace`, separate from the packaged main-agent persona and owner configuration. Non-git projects live under `projects/**`; repositories live under `repos/**`.
  The coding worker must create or resolve new project work under that runtime workspace root.
  The main orchestrator does not own these tools directly.

src/engine/workers/coding-worker/subagents/<name>/workspace/
  Worker-local subagent user-editable workspace persona files.
  `USER.md` describes the coding-worker lead as the immediate principal, on behalf of the main orchestrator.

src/workspace-loader.ts
  Shared workspace markdown loader.
  Composes workspace files in a fixed order for agent instructions.
  Keeps user-editable workspace content separate from TypeScript agent entrypoints.

src/engine/commands/
  Pre-LLM slash command parsing and command registry helpers.
  Commands are application machinery; they are not sent to the LLM as prompts.

src/core/config/
  Typed loader, canonical runtime-root resolver, and source JSON for the main
  SIM-ONE Alpha runtime config file. Relative operational paths resolve under
  the one owning `.gorombo` tree, never the caller working directory.

src/core/config/runtime-environment.ts
  Authoritative typed registry, parser, validator, migration, redacted status,
  and atomic owner-file update implementation for every supported
  environment-style setting. The Coding Worker may write a user-supplied
  secret only through its dedicated approval-gated tool; existing values are
  never readable through that tool or the general worker sandbox. POSIX loads
  and updates require a regular current-user-owned file with exact mode `0600`.

src/core/config/runtime-environment-bootstrap.ts
  Side-effect bootstrap imported first by `src/app.ts`. Loads the owning
  `sim-one.config` before Flue, providers, connectors, workers, stores,
  schedules, and other runtime consumers initialize.

sim-one.config.example
  Tracked secret-free key catalog generated and reviewed against the typed
  registry. The ignored owner `sim-one.config` is copied into local runtime
  builds but is never a public package input.

.gorombo/gorombo.config.json
  Built editable runtime config shipped with the product. Starts with primary and backup model card keys.

.gorombo/sim-one.config.example
  Runtime repair/onboarding template. A trusted local build also has
  owner-only `.gorombo/sim-one.config`; public packages exclude that file.

.gorombo/sim-one-alpha/node_modules/
  Isolated production dependencies for the packaged Flue Node server.
  Generated by scripts/package-runtime-dependencies.mjs so the server does not
  resolve packages from the source checkout.

src/workflows/research.ts
  Application-owned direct research harness for tests or direct research calls.
  Initializes the Researcher agent and dispatches/reads the exact receipt.

src/engine/workers/coding-worker/github/
  Coding Worker-owned official GitHub MCP connection, PAT isolation,
  anonymous-first Git credential fallback, typed GitHub client, and
  approval-gated mutation tools. No GitHub MCP tool or PAT is attached to the
  orchestrator or general sandbox. Optional MCP connection failure leaves the
  Coding Worker available and is surfaced only when GitHub work is requested.

src/engine/workers/coding-worker/tools/sandbox-runtime.ts
  Bubblewrap execution profile with a writable coding workspace, private HOME,
  read-only Node/system/Rust toolchains, and private writable Cargo state.
  Approved Git commits receive command-scoped host author identity without
  mounting the host home or persisting that identity in the repository.

src/workflows/retrieval.ts
  Application-owned shared retrieval machinery.
  Web-search provider access is restricted to the researcher/research workflow caller boundary.
  Does not expose a public route.

src/workflows/web-research.ts
  Researcher-owned application workflow function.
  Handles query planning, basic/standard/deep research depth, cache, web search, fetch, evidence packing, confidence, and failures.
  Used by the researcher-owned web_research tool.

src/engine/tools/protocol-tool.ts
  Orchestrator-safe protocol loading tool and trusted persisted-event lookup
  used by capability lifecycle enforcement.

src/engine/capabilities/
  Runtime capability registry subsystem. SQLite-backed user/agent-added
  capability store (skills, tools, workers, MCP). `capability-store.ts`
  owns CRUD; `capability-loader.ts` selects promoted managed packages at
  orchestrator init without refetching mutable sources; `skill-materializer.ts`
  copies or clones sources into lifecycle staging; `mcp-broker.ts` creates
  MCP connection definitions through the shared canonical token-slot contract.
  Loaded into a runtime capability snapshot when the orchestrator module initializes. See
  `docs/architecture/capability-system.md` and `scripts/capability-admin.mjs`.
  `tool-loader.ts` and `worker-loader.ts` dynamically `import()` user JS
  modules that export direct `defineTool(...)`/`defineSubagent(...)`
  results. Agent local handoffs must be coding-workspace-relative, and GitHub
  sources must use a `github.com` HTTPS or SSH repository URL.

scripts/capability-admin.mjs
  Compatibility adapter to the product `sim-one` capability commands. It does
  not implement SQLite, validation, or materialization.

src/engine/tools/memory-tool.ts
  Orchestrator-safe memory lookup tool.
  Uses persisted session-memory FTS records and LanceDB vector embeddings associated with product session context.
  Combines keyword and semantic search for hybrid retrieval.

src/engine/memory/structured-memory-note-index.ts
  LanceDB-backed semantic index over session-note content. Embeds title+content on upsert, deletes on archive, and supports semantic search merged with the engine keyword index via RRF (Decision 5). Graceful keyword-only fallback when no embedding client is configured.

src/engine/memory/structured-memory-database.ts
  Durable SQLite storage for structured-memory records. TS owns the schema: the full record is stored as JSON with scope denormalized into indexed columns. Feeds `reconcile_index` on cold start and runs the retention cleanup job.

src/engine/memory/structured-memory-runtime.ts
  Lazy singleton that loads the MemoryEngine (WASM, falling back to in-memory when the artifact is absent or in test mode), runs cold-start cleanup + hydration, and wraps mutations in `PersistingMemoryEngine` so every create/update/delete is durably persisted. Exposes the `ChecklistMemoryProvider`.

src/engine/memory/checklist-memory-provider.ts
  Structured-memory RAG provider. Surfaces checklists/todos/session notes as `RetrievedContext` (provider `structured-memory`) with rank, scope isolation (derived from the trusted `RagQuery`), and token-budget truncation.

src/engine/memory/memory-router.ts
  Multi-provider memory router. Fans `retrieve` out to registered providers (session memory under `memory`, structured memory under `structured-memory`) and merges with reciprocal rank fusion.

src/engine/memory/rust-memory-engine.ts
  TypeScript shim for the `gorombo-memory` WASM engine. Exposes `RustMemoryEngine` (loads the WASM, asserts version, calls exports, maps `Err(String)` prefixes to typed `MemoryEngineError`) and `InMemoryMemoryEngine` (pure-TypeScript parity reference for unit tests). The shim owns ids/timestamps/audit fields; the WASM owns validation, indexing, and query planning.

src/engine/tools/knowledge-tool.ts
  Orchestrator-safe knowledge writing tool.
  Embeds and stores agent-captured knowledge in the vector knowledge base.

src/engine/tools/web-research-tool.ts
  Researcher-owned web research tool.
  Accepts bounded research controls such as depth, freshness, query/fetch budgets, and context budgets.

src/engine/tools/memory-checklist-tools.ts
  Orchestrator-owned Flue tools for checklist CRUD (create/update/add_item/update_item/move/archive/list). Scope is derived from the trusted eventId; model-facing parameters omit scope/audit.

src/engine/tools/memory-todo-tools.ts
  Orchestrator-owned Flue tools for todo CRUD (create/update/complete/cancel/list).

src/engine/tools/memory-note-tools.ts
  Orchestrator-owned Flue tools for session-note CRUD (store/update/archive/list).

src/engine/tools/memory-search-tools.ts
  Orchestrator-owned keyword/tag search across structured memory, returning RetrievedContext with provider `structured-memory`.

src/engine/workers/coding-worker/tools/coding-task-memory-tools.ts
  Worker-local memory tool aliases (`coding_task_*`). `projectId` is injected from `CodingWorkspaceTargetInput`; every mutating write is recorded as an audit-only `memory.write`/`memory.handoff` event on `SharedCodingApprovalService` (never blocking). Includes `coding_task_handoff_plan_to_checklist` (Decision 9 cross-run handoff). Lead-only - not exposed to internal subagents.

src/engine/tools/rag-tool.ts
  Researcher-only low-level retrieval tool.
  Not attached to the orchestrator.

src/engine/workers/researcher/research/
  Researcher-owned research cache and web-provider wrappers.

src/core/models/providers/
  Provider registration and provider-owned model cards.
  Providers resolve env bindings declared by their cards.
  Providers with multiple cards store them in their own cards/ subdirectory.
  Includes the dedicated RunPod OpenAI-compatible chat provider; its base URL
  is independent from the RunPod image SDK path.

src/core/models/catalog.ts
  Aggregates provider-owned cards and resolves Flue model specifiers.

src/core/models/runtime.ts
  Model-provider runtime bootstrap.
```

## Orchestrator Boundary

Allowed orchestrator capabilities:

```text
load_protocols
retrieve_memory
task delegation to researcher and Coding Worker
task delegation to enabled runtime workers only when attached to the owning
agent and admitted by active protocols, trusted scope, sandbox policy, and
action-specific approvals
final synthesis
```

Forbidden orchestrator capabilities:

```text
web_search
web_fetch
retrieve_context when it can select web-search
direct RAG router web provider access
old non-Flue orchestrator routes
```

## Research Boundary

The researcher owns:

```text
web_research
query planning
one-search versus multi-search decisions
source/page cache
web search
web fetch
source comparison
confidence
provider failure reporting
structured findings
```

The researcher may implement that behavior through tools, skills, and workflow files.

## app.ts Contract

`src/app.ts` must stay close to a thin composition root. Its current
responsibilities are:

```text
import model-provider and schedule boot modules
register the Flue telemetry observer
create the Hono application
register /health
apply API-secret middleware to protected agent and schedule route families
register chat-event and chat-session routes
register knowledge, schedule, telemetry, approval, and Telegram admin routes
mount createAgentRouter(Orchestrator) and the Telegram channel router explicitly
export the Hono application
```

The exact route list is verified against `src/app.ts`. Orchestration, protocol
matching, retrieval, worker execution, and model selection remain outside this
composition root.

Custom ingress may be added only if it enters a governed Flue agent or
application workflow path.

The built HTTP chat path enters the durable orchestrator agent route:

```text
POST /api/chat/events
-> persist normalized event context in SQLite
-> resolve the active product-session generation
-> init(Orchestrator, { id: instanceId })
-> dispatch(message) and read(receipt)
-> 200 { result, streamUrl, offset, event, session }
```

Async connector-style delivery should use Flue `dispatch(...)` against the orchestrator agent instance. Direct prompts and dispatched inputs share Flue's durable agent submission lifecycle when the Node runtime uses the SQLite `src/db.ts` adapter.
