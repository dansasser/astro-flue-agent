# Architecture Specification: GitHub And Repository Access

## Ownership

```text
TUI or Telegram connector
  -> trusted normalized event
  -> orchestrator
  -> Coding Worker lead
  -> Coding Worker GitHub/repository capability
  -> auth policy + approval service
  -> Git/GitHub operation
  -> typed evidence
  -> Coding Worker result
  -> orchestrator final synthesis
```

The orchestrator delegates. The Coding Worker owns Git and GitHub behavior.
The TUI renders typed connector responses and approval controls.

## D1 Strategy Boundary

D1 selects the official remote GitHub MCP server with a trusted runtime PAT:

- anonymous HTTPS for public read/clone when possible;
- `GITHUB_PERSONAL_ACCESS_TOKEN` for private access and official MCP calls;
- independent approval for local and remote mutations;
- credentials outside the coding workspace;
- connector-aware progress and approval delivery;
- output-level verification of the resulting repository or GitHub object.

Flue `connectMcpServer(...)` attaches the selected read-only MCP tools to the
Coding Worker lead. Mutation-capable MCP tools are callable only through the
typed internal GitHub client behind the approval service. General shell tools,
the orchestrator, other workers, and connector payloads receive no PAT.

Public Git operations run anonymously first. Private GitHub HTTPS access retries
with a command-scoped askpass environment only after anonymous failure. No
GitHub CLI profile, device flow, global credential helper, or SSH mutation is
part of the runtime.

## Path Boundary

Repository targets resolve under `<runtime-root>/workspace/repos/<slug>`.
Credential, approval, repository-registry, and task-run metadata resolve from
their D2 runtime-root siblings. No GitHub path derives from the caller's
working directory.

## Approval Boundary

Authentication establishes a principal. Approval authorizes one bounded
mutation. The service binds its decision to action type, canonical target,
remote, command or mutation digest, task/session identity, approver, and expiry.

## Evidence

The final result records canonical repository path, remote, selected branch,
Git status, approval ids, and remote object URLs where applicable. It never
records credentials.

## TUI Status And Approval Architecture

### Ownership

```text
Flue/runtime usage and session state
  -> typed gateway projection
  -> Ratatui App status model
  -> stable two-row status renderer

Coding Worker mutation request
  -> shared approval service
  -> connector-bound approval ingress
  -> Ratatui approval client
  -> owner-selected approval selector
  -> typed decision with explicit scope
  -> shared approval service settlement
  -> exact blocked operation resumes or stops
```

The TUI owns presentation and local interaction state. The gateway owns trusted
approval records, scope validation, expiry, and settlement. Flue and the Coding
Worker own the blocked operation and progress events.

### Stable Status Contract

The application exposes structured status fields rather than one prejoined line
that the renderer truncates:

- row one: product, session, gateway, stream, agent or turn state, and
  `messages: N` as the final item;
- row two: authoritative context remaining first, followed by overflow state
  such as pending approvals, task state, tail mode, or last event.

The renderer performs width-aware packing at field boundaries. It may shorten a
field value with an explicit unavailable or compact representation, but it must
not silently hide a whole required field behind character truncation.

Context remaining is derived from authoritative selected-model context capacity
and current session usage supplied through a typed gateway or Flue projection.
The TUI does not query SQLite or calculate usage from rendered transcript text.

### Approval Presentation Contract

D6 selects an anchored drop-up above the prompt using the existing
slash-command menu display pattern. It is a separate interface rendered by
`implement-connector-approval-controls`, not a third status row. It uses this
typed approval view model:

- request id and status;
- action type, summary, target, and risk;
- expiry;
- connector and trusted session binding;
- selected index and multiple-pending position;
- `deny`, `allow_once`, and `allow_for_session` actions;
- submitting, settled, expired, failed, and unavailable states.

Only one selector owns keyboard focus at a time. Opening it snapshots the prompt
and transcript interaction state. Settlement or dismissal restores that state
without submitting prompt text, moving transcript tail, or changing slash-menu
selection.

The status model reports pending approval count independently of selector
visibility. If the selector cannot render or its decision request fails, the
status remains pending or failed and the mutation remains blocked.

### Sequencing And File Ownership

`implement-tui-status-context-meter` establishes the measured two-row geometry
and status view model first. `implement-connector-approval-controls` consumes
that artifact and performs the later serialized approval UI changes. The two
members may touch shared Ratatui layout files only in that graph order; they are
not parallel workstreams.

### Verification Boundary

Framebuffer tests prove geometry and focus state. Gateway and ingress tests
prove typed scope settlement. A packaged PTY product test must launch `sim-one`,
trigger a real blocked approval request, operate each selector choice, and
observe the resulting operation state.

## Capability Management Architecture

### Ownership And Routing

```text
User CLI request
  -> sim-one capability command
  -> shared capability lifecycle service
  -> runtime capability registry

Agent request
  -> trusted connector event
  -> orchestrator and Protocol Tool
  -> capability-manager worker
  -> approval-aware capability tools
  -> shared capability lifecycle service
  -> runtime capability registry

Capability implementation request
  -> orchestrator
  -> Coding Worker
  -> capability authoring skills and tools
  -> validated source plus typed handoff
  -> capability-manager worker
  -> approved installation or activation
```

The runtime registry remains SQLite plus managed files under the canonical
runtime root. The dedicated worker is an administration boundary over that
registry, not a new store. Direct CLI and worker tools adapt to the same typed
lifecycle service so validation, materialization, rollback, and result records
cannot drift.

### Capability Manager Profile

`src/engine/workers/capability-manager/` owns one built-in Flue lead profile
with:

- a workspace explaining registry kinds, trust boundaries, and delegation;
- worker-local lifecycle guidance;
- typed read tools for list, inspect, and validate;
- approval-aware mutation tools for add, update, enable, disable, and remove;
- typed restart-required and activation-state results;
- durable public progress events.

The orchestrator exposes the lead profile and delegates capability lifecycle
requests to it. The current `add_skill`, `add_tool`, `add_worker`, and
`add_mcp_server` behavior moves behind this worker boundary. The orchestrator
retains routing and final synthesis but no direct registry mutation authority.

### Shared Lifecycle Service

The service accepts a trusted principal and a typed operation:

```text
kind: skill | tool | worker | mcp
operation: list | inspect | validate | add | update | enable | disable | remove
identity: id, display name, description
source: source type, source reference, exact version, optional content digest
configuration: kind-specific non-secret metadata
activation request: enabled or disabled
provenance: connector, actor, session, task, installed-by
approval context: request and decision identifiers for mutations
```

It performs safe-id validation, built-in and cross-kind collision checks,
source/version resolution, non-executing Flue syntax validation, shared
credential and machine-path scanning, transactional store/materialization
updates, and rollback of partial failure. MCP configuration stores only
endpoint, transport, and canonical secret-key names.

Agent-requested mutations validate an approval immediately before the
side effect. Executable tools, workers, and MCP servers are installed disabled
until an explicit enable decision. Updating one of those executable
capabilities disables it again and requires a separate enable decision. A
skill may activate as part of its approved installation transaction because it
is instruction content, but it gains no tool authority.

### Coding Worker Authoring Boundary

The Coding Worker owns capability source development inside the selected
`workspace/repos/<slug>` or `workspace/projects/<slug>` target. Its worker-local
skills cover:

- capability classification and shared design;
- Agent Skill authoring;
- Flue tool authoring;
- Flue worker/subagent authoring;
- MCP server and MCP connection authoring.

Typed authoring tools scaffold, validate, test, scan, and package each kind.
They may use current Flue documentation through the worker-owned documentation
capability. They cannot write the capability SQLite store, managed runtime
capability directory, approval store, or owner configuration.

The final handoff contains kind, id, display metadata, source reference, exact
version, content digest, validation evidence, required canonical configuration
keys, requested activation state, and the requested capability-manager
operation. Secret values are never part of the handoff.

Capability classification, source validation, security scanning, tests,
packaging, handoff, and capability-manager validation are protocol-routed
operations. Each receives the applicable Protocol Tool bundle, applies its
directives before deterministic checks, fails closed when the bundle is absent
or malformed, and records the applied protocol ids and rules in redacted
evidence.

### Runtime Activation

Registry changes report their durable stored state and whether the gateway must
restart. The current initialization-time loader remains authoritative unless a
separate graph decision later approves safe hot reload. No worker claims a
capability is active merely because its source exists or its database row was
written.
