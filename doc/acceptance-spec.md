# Acceptance Specification: GitHub And Repository Access

## ACC-GH-001: D1 Is Explicitly Resolved

The official GitHub MCP/PAT strategy is recorded in D1 with credential
lifecycle, connector behavior, Flue capability ownership, and rollback.

## ACC-GH-002: Public Clone Uses Anonymous HTTPS

A packaged TUI request clones a known public repository without requiring a
GitHub login. The local clone mutation still requires and records its configured
approval.

## ACC-GH-003: Private Access Uses Trusted Credentials

The selected credential path can read an authorized private repository without
placing credentials in the workspace, transcript, progress stream, or evidence.

## ACC-GH-004: Connector Approval Is Actionable

TUI and Telegram render the approval request appropriate to their active
connector, submit approve or deny, and display the settled result.

## ACC-GH-005: Mutations Remain Separately Approved

Clone/register, branch, push, pull-request, issue, comment, and review actions
cannot reuse authentication as mutation approval.

## ACC-GH-006: Flue Ownership Is Preserved

The main orchestrator exposes only the Coding Worker lead. Any GitHub MCP or
custom tool is declared on the Flue profile that owns it.

## ACC-GH-007: Packaged Flow Is Verified

The production `sim-one` wrapper launches the TUI and gateway, completes the
selected auth/public-clone flow, and verifies repository and remote state from
an unrelated caller working directory.

## ACC-TUI-STATUS-001: Status Uses Two Stable Rows

At narrow, normal, and wide supported terminal sizes, the normal status surface
uses exactly two rows and does not overlap the transcript, prompt, slash
palette, approval selector, or future work pane.

## ACC-TUI-STATUS-002: Required Field Order Is Preserved

Row one ends with `messages: N`. Row two starts with authoritative context
remaining. Width-aware packing preserves required field boundaries instead of
truncating the assembled status string at an arbitrary character.

## ACC-TUI-STATUS-003: Context Remaining Is Authoritative

Known selected-model capacity and current session usage produce the correct
remaining percentage. Missing or stale authoritative data renders
`context: unavailable`; no estimate is displayed.

## ACC-TUI-APP-001: Pending Approval Is Visible

A connector-bound pending request updates status even when its selector is not
focused. Multiple pending requests expose a stable count and distinguishable
request identity.

## ACC-TUI-APP-002: Selector Is A Slash-Menu-Style Drop-Up

The selector opens above the prompt using the slash-command menu display
pattern and remains usable during terminal resize and multiline prompt growth.
It is not a third status row and does not hide required approval details or
corrupt transcript and prompt geometry.

## ACC-TUI-APP-003: Exact Scope Choices Are Actionable

Keyboard and mouse interaction expose and submit exactly `Deny`, `Allow once`,
and `Allow for session`. Focused Enter settles only the selected approval and
never submits the prompt or slash command.

## ACC-TUI-APP-004: Scope Semantics Fail Closed

`Deny` blocks the request. `Allow once` cannot replay. `Allow for session`
expires on session change. Missing, expired, mismatched, unavailable, or
ambiguous state does not execute the operation.

## ACC-TUI-APP-005: Interaction State Survives

Opening, resizing, settling, expiring, failing, and dismissing the selector
preserves prompt text and cursor, transcript scroll and selection, slash-menu
state, and unrelated pending approvals.

## ACC-TUI-APP-006: Connector Identity Is Correct

The TUI renders TUI controls and Telegram renders Telegram controls from the
same typed approval record. Neither connector describes or accepts the other
connector's interaction mechanism.

## ACC-TUI-APP-007: Packaged Product Flow Is Verified

The packaged `sim-one` product launches its gateway, triggers an actual
approval-gated operation, displays the selector, settles deny and both allow
scopes, and verifies the blocked operation's output state. Source-only Cargo
execution is not sufficient evidence.

## Capability Management Acceptance

### ACC-CAP-001: Agent Requests Use A Dedicated Worker

An agent request to add, inspect, update, enable, disable, or remove a runtime
capability is delegated to `capability-manager`. The orchestrator does not
directly execute registry mutation tools.

### ACC-CAP-002: CLI And Worker Share One Service

For every capability kind, equivalent user CLI and capability-manager requests
produce the same validation, stored record shape, materialization behavior,
activation state, restart requirement, rollback, and redacted result.

### ACC-CAP-003: Registry Mutations Are Trusted And Approval-Gated

Agent-requested mutations fail closed without a current matching approval.
Approval evidence binds actor, connector, session, capability kind/id,
operation, source/version or MCP endpoint metadata, scope, approver, and time.
An authenticated direct CLI principal remains attributable without accepting a
model-supplied identity.

### ACC-CAP-004: All Four Lifecycles Work

Skill, tool, worker, and MCP fixtures pass list, inspect, validate, add, update,
enable, disable, and remove tests as applicable. Source-backed records prove
exact version selection and content validation. MCP update changes validated
connection metadata in place. The packaged-product smoke runs the same
lifecycle through a relocated CLI and the source compatibility adapter.

### ACC-CAP-005: Executable Enablement Fails Closed

Agent-added tools, workers, and MCP servers remain disabled until separately
enabled by an explicit approval. Skills may activate only inside their approved
installation transaction and do not inherit undeclared tools. Updating an
enabled tool, worker, or MCP connection disables it, removes active source
materialization when applicable, and requires another explicit enable.

### ACC-CAP-005A: Validation Is Protocol-Routed And Non-Executing

Validation rejects missing or malformed applicable protocol directives before
deterministic checks. Source-backed packages are parsed for exported Flue
factory contracts without importing or executing the package, then scanned for
credential values and machine-specific absolute paths. Evidence retains the
applied protocol ids and rules.

### ACC-CAP-006: Partial Failure Rolls Back

A failed source checkout, version resolution, validation, materialization,
database write, or MCP metadata validation cannot leave a misleading enabled
record or partially active managed directory. The result identifies the failed
stage without exposing secrets.

### ACC-CAP-007: MCP Secrets Stay In Canonical Configuration

Capability records and handoffs contain only canonical configuration key names.
Secret values do not appear in SQLite capability JSON, source packages,
transcripts, progress events, approval evidence, diagnostics, or test fixtures.

### ACC-CW-CAP-001: Coding Worker Classifies Capability Kind

Given a capability request, the Coding Worker selects skill, tool, worker, MCP
server, or MCP connection using worker-local capability-design guidance and
explains the selected boundary in public progress.

### ACC-CW-CAP-002: Coding Worker Authors Every Kind

Focused fixtures prove that attached authoring tools can scaffold and validate
a conforming `SKILL.md`, `defineTool(...)` module,
`defineAgentProfile(...)` worker package, MCP server package, and MCP connection
manifest inside the selected repository/project.

### ACC-CW-CAP-003: Authoring Is Workspace-Scoped

All generated and edited source remains under the selected Coding Worker target
and requires the normal file-edit approval. Attempts to write the runtime
capability database, managed capability directory, approval store, or owner
configuration are rejected.

### ACC-CW-CAP-004: Handoff Is Reproducible

The completed authoring task returns kind, id, display metadata, source
reference, exact version, content digest, validation/test evidence, required
configuration key names, requested activation state, and capability-manager
operation. A clean checkout at that source/version reproduces the validation.

### ACC-CAP-008: Packaged Product Flow Is Verified

The packaged `sim-one` product launches from an unrelated directory, accepts a
capability request through the TUI, shows capability-manager progress and
approval, installs a test capability under the relocated runtime root, reports
restart-required state, restarts, verifies the capability is loaded, and then
disables/removes it without writing outside that runtime tree.

### ACC-CAP-009: Validation Is Protocol-Routed

Capability-manager validate and mutation requests, plus Coding Worker
classification, source validation, security scanning, tests, packaging, and
handoff, fail closed without the applicable Protocol Tool bundle. Passing
results identify the applied protocol ids and rules without exposing secrets.
