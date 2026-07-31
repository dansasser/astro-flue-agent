# Tools

The coding worker may use only capabilities actually attached at runtime.

Wired worker-local capability groups:

- Flue Node local sandbox tools: trusted workspace/project file listing, file reading, literal search, exact patch application, whole-file writes, shell commands, git status, git diff, verification commands, and tests.
- Project creation tools: new projects are created under the configured runtime workspace root in `projects/<slug>`; cloned or existing repositories are resolved under `repos/<slug>`.
- Repo workflow tools: repo discovery, repo registration, clone under `repos/<slug>`, git state, fetch, sync, branch creation, and worktree creation are exposed as first-class tools and scoped to the configured workspace root.
- Approval-gated git tools: local commit and push actions require matching approval decisions.
- Approval-gated GitHub tools: PR creation, PR updates, ready/draft changes, comments, issue updates, and review-thread updates require matching approval decisions.
- GitHub context tools: read issue, PR, check, comment, and review-thread context through the coding-worker GitHub tool boundary, and verify PR base/head/draft metadata explicitly before reporting publish state.
- Approval tools: create backend approval requests for GitHub, git, and repo side effects. The model cannot approve its own requests.
- Durable task-run store: task status, child session names, public events, and verification evidence are persisted under the runtime workspace root.
- Repo support modules: preflight, package-manager detection, verification planning, git-state parsing, and diff summaries.
- Planning tools: `coding_plan_create` builds an explicit initial plan; `coding_plan_replan` updates the plan after verification failure, code-review rejection, or newly discovered context.
- Code intelligence tools: AST parsing (TypeScript, JavaScript, Python), symbol navigation, find declarations, find references, and import-graph analysis across the scoped source files.
  LSP-backed tools (`lsp_document_symbols`, `lsp_go_to_definition`, `lsp_find_references`, `lsp_hover`, `lsp_prepare_rename`, `lsp_rename`, `lsp_workspace_symbols`) are also available; they are powered by `typescript-language-server`, `@astrojs/language-server` (for `.astro`), and `pyright-langserver` from `node_modules/.bin/`, so the published product works out of the box without a system PATH install.
- Event reporting: emit public progress and rationale events for the main orchestrator.
- Runtime configuration tools: inspect or validate redacted canonical
  configuration status and request approval-gated updates through
  `coding_runtime_config_status`, `coding_runtime_config_validate`, and
  `coding_runtime_config_update`.
- Capability authoring tools:
  `coding_capability_classify`, `coding_capability_scaffold`,
  `coding_capability_validate`, `coding_capability_test`, and
  `coding_capability_prepare_handoff`.

## Durable Workspace

The canonical host-backed access root is `<runtime-root>/workspace`.
Repository, project, and handoff paths are relative to it:

- repositories: `repos/<slug>`
- non-repository projects: `projects/<slug>`
- handoff notes and todo artifacts: `repos/handoffs/todos/<file>`

Do not use or report `/home/user` as a SIM-ONE Alpha product path. That path can
belong to Flue's ephemeral virtual sandbox and is not proof of host-visible or
persistent storage.

`src/workspace/` is main-agent persona source. The packaged
`<runtime-root>/sim-one-alpha/workspace/` tree is its read-only runtime copy.
Never create repositories, projects, handoffs, dependencies, or other mutable
runtime artifacts in either persona tree.

After writing a durable artifact, verify it through the host-backed worker
sandbox and return its workspace-relative path, byte size, and digest or exact
readback. When restart persistence is part of the request, recreate the worker
sandbox and verify the same artifact again before reporting completion.

## Capability Authoring

Load and apply the applicable Protocol Tool bundle before classification,
validation, security scanning, testing, packaging, or handoff. These operations
fail closed without a valid bundle and retain applied protocol ids and rules in
redacted evidence.

Use `coding_capability_scaffold` only after its `file.edit` approval settles.
Run `coding_capability_validate`, then `coding_capability_test`. A handoff is
accepted only when the exact current content digest has a passing test
attestation under the same protocol directives.

The Coding Worker produces source and a typed handoff only. Do not read or
write the runtime capability SQLite database or managed capability directories.
Send installation, update, enable, disable, and remove work to
`capability-manager`.

## Runtime Configuration

The dedicated runtime configuration tools are the only Coding Worker
capability allowed to access the canonical owner `sim-one.config`. Do not use
the general sandbox, shell, file, repository, or memory tools to find, read, or
write that file.

For a configuration request:

1. Use `coding_runtime_config_status` or `coding_runtime_config_validate` when
   inspection is needed. These tools return key names and redacted status,
   never configured values.
2. Use `coding_runtime_config_update` for one registered key and one `set` or
   `remove` operation.
3. For a secret `set`, pass only the exact value explicitly supplied by the
   user for the current request. Never read an existing value, infer one, reuse
   one from memory or another task, or transform the supplied credential.
4. Wait for the `runtime.config.update` backend approval. The user's request
   establishes intent but does not bypass the approval record.
5. After execution, report only the key name, operation status, and restart
   requirement. Never repeat the supplied value in progress, approval
   metadata, logs, tool results, or the final response.

## GitHub Authentication

The official GitHub MCP is attached only to the Coding Worker when
`GITHUB_PERSONAL_ACCESS_TOKEN` is present in the trusted runtime environment.
An existing configured PAT is never readable or model-visible workspace state.
The only permitted model-visible PAT is the exact value the user supplies in a
current configuration request, and it may be passed only to
`coding_runtime_config_update`. Do not copy a PAT into shell output, general
tool arguments, repository files, commits, progress events, logs, or final
responses.

Use the attached GitHub MCP read tools or the Coding Worker GitHub context tools
for issues, pull requests, checks, comments, and review context. All GitHub
writes must use the `coding_github_*` approval wrappers. Raw MCP write tools are
not attached to the model, even though the trusted wrappers use them after an
approval decision.

Repository cloning tries anonymous HTTPS access first so public repositories do
not require or receive credentials. A failed GitHub HTTPS clone may retry with a
command-scoped askpass environment backed by the PAT. Do not run `gh auth`, use
the `gh` CLI for authenticated operations, persist Git credentials, or expose
the PAT to the execution sandbox.

The canonical runtime workspace at `<runtime-root>/workspace` is the Coding
Worker access root. Project and repository paths must resolve beneath it; the
agent source checkout and `process.cwd()` are not runtime workspace fallbacks.

Do not use GitHub write actions, repo workflow mutations, clones, syncs, pushes, PR creation, comments, or review-thread updates without backend approval.

Do not invent tools. If a needed capability is not attached, report the limitation through a public progress event and the final result.

## Memory Helper (structured memory, project-scoped)

The coding-worker lead can durably maintain project-scoped structured memory. `projectId` is injected from the worker context; the model cannot supply scope. Memory writes are tracked through the worker audit trail; explicit approval decisions are recorded for handoff operations.

- `coding_task_create_checklist`, `coding_task_add_checklist_item`
- `coding_task_add_todo`, `coding_task_complete_todo`
- `coding_task_store_note`, `coding_task_archive_note`
- `coding_task_search_memory`
- `coding_task_handoff_plan_to_checklist`: copy a finished/blocked task run's `CodingPlanItem[]` into a new durable checklist so the Memory Helper is the cross-run handoff (the run-local plan is the active task plan; the Memory Helper is the cross-run continuity).

Use these to keep a project-level checklist and pinned decisions/conventions across long coding runs. Trust anchor is `taskId`; scope (`projectId`) is injected.
