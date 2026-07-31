# Product Specification: GitHub And Repository Access

## Problem

The Coding Worker cannot yet complete the packaged TUI clone flow reliably.
The observed path failed trusted auth-context propagation, returned an approval
request that the TUI could not act on, and required authentication for a public
repository that should support anonymous HTTPS access.

## Required Outcomes

1. The D1 official GitHub MCP/PAT strategy works from the packaged SIM-ONE TUI
   and applicable remote connectors.
2. Public repository discovery and clone can use anonymous HTTPS without
   fabricating an authenticated principal.
3. Local clone/register mutations and remote GitHub mutations remain
   action-specific and approval-gated.
4. Private repository access uses trusted credentials stored outside the
   model-writable workspace.
5. Connector-facing auth and approval messages identify the active connector.
6. GitHub tools remain owned by the Coding Worker and its private GitHub
   specialist, not by the main orchestrator.

## Non-Goals

- Building a second device-login or GitHub CLI credential path.
- Giving the TUI direct GitHub credentials or runtime-database access.
- Treating authentication as authorization for clone, push, PR, issue, or
  review mutations.
- Exposing Coding Worker internal subagents as top-level Flue agents.

## Release Binding

This specification is required by `REL-CW-004` and
`implement-coding-worker-github-flow`.

## TUI Status And Approval Surface

### Problem

The current TUI status surface is one row high and truncates status fields that
do not fit. When a Coding Worker approval request becomes pending, the same TUI
has no actionable selector, so the operation remains blocked even though the
gateway has a valid request.

The two problems must be designed together because the approval selector,
status rows, prompt editor, transcript, slash-command palette, and future work
pane share one terminal layout.

### Required Outcomes

1. The normal status surface is exactly two rows at supported terminal sizes.
2. Row one keeps the established field order and ends with `messages: N`.
3. Row two starts with authoritative context remaining and then displays
   overflow runtime state.
4. Missing authoritative context data renders as unavailable; the TUI never
   invents a percentage.
5. A pending approval is visible in status and opens an actionable drop-up
   above the prompt using the slash-command menu display pattern.
6. The selector exposes `Deny`, `Allow once`, and `Allow for session`.
7. Approval settlement resumes or stops the exact blocked operation and remains
   bound to connector, actor, conversation, task, session, target, action, and
   digest.
8. Prompt contents, transcript position and selection, slash-menu state, and
   mouse behavior survive approval display and settlement.
9. Multiple pending approvals remain identifiable and cannot settle one
   another accidentally.

### Non-Goals

- Moving approval authority into the Rust TUI.
- Reading approval databases directly from the TUI.
- Adding a permanent third status row.
- Treating a generic `Approve` action as an adequate replacement for explicit
  scope selection.
- Estimating context remaining from transcript line count or rendered text.

### Release Binding

This section is required by `REL-TUI-002`, `REL-APP-001`,
`implement-tui-status-context-meter`, and
`implement-connector-approval-controls`.

The two release requirements remain separate graph members. The status member
creates and splits the two-row status surface. The downstream connector
approval member creates the drop-up interface after consuming that status
geometry.

## Capability Management And Authoring

### Problem

SIM-ONE already has one runtime registry for user- and agent-added skills,
tools, workers, and MCP servers, but model-callable lifecycle tools are attached
directly to the main orchestrator. The Coding Worker can edit arbitrary project
source, but it has no explicit capability-authoring method or typed handoff to
the runtime registry.

This mixes orchestration, capability administration, and capability
implementation. It also leaves user CLI operations and agent operations at risk
of drifting into separate validation and mutation paths.

### Required Outcomes

1. A built-in Flue worker named `capability-manager` owns agent-requested
   runtime capability lifecycle operations.
2. The main orchestrator identifies the request, loads applicable protocols,
   delegates to `capability-manager`, and validates its result. It does not own
   direct registry mutation tools.
3. Authenticated users retain the `sim-one skill`, `sim-one tool`,
   `sim-one worker`, and `sim-one mcp` command families.
4. The worker and CLI use one typed lifecycle service for list, inspect,
   validate, add, update, enable, disable, and remove.
5. Agent-requested registry mutations are approval-gated and attributable to
   the trusted actor, connector, session, capability, operation, and source.
6. Skills, tools, workers, and MCP records retain the current runtime-root,
   collision, source-version, enablement, restart, and secret boundaries.
7. The Coding Worker receives worker-local skills and typed tools for
   classifying, designing, scaffolding, validating, testing, and packaging all
   four capability kinds.
8. The Coding Worker produces source and a typed installation handoff. It does
   not directly mutate the runtime capability database or managed capability
   directory.
9. Runtime installation and activation results remain visible through durable
   typed progress and include whether a gateway restart is required.
10. Capability classification, validation, security scanning, testing,
    packaging, handoff, and manager-side validation consume the applicable
    Protocol Tool bundle, fail closed without it, and retain applied protocol
    ids and rules in redacted evidence.
11. Source-backed validation parses exported Flue factory contracts without
    executing capability code and rejects credential values or
    machine-specific absolute paths.
12. Updating a tool, worker, or MCP connection returns it to disabled state
    until a separate explicit enable operation succeeds.

### Non-Goals

- Creating a second capability registry.
- Letting the `capability-manager` write arbitrary project source.
- Letting the Coding Worker approve, install, enable, or remove runtime
  capabilities directly.
- Storing MCP tokens, API keys, or other secret values in capability source,
  SQLite configuration JSON, transcripts, progress events, or handoff records.
- Treating a generated built-in-name manifest as the runtime capability store.
- Bypassing Flue profile ownership, protocols, sandbox policy, or approval
  requirements after a capability is enabled.

### Release Binding

This section is required by `REL-CAP-002`, `REL-CW-007`,
`implement-capability-management-worker`, and
`implement-coding-worker-capability-authoring`.
