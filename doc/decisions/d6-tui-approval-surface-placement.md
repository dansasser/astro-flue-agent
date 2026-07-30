# D6 TUI Approval Surface Placement

## Status

Resolved

## Context

The SIM-ONE TUI currently reserves one terminal row for status even though the
assembled status content is longer than the available width. `REL-TUI-002`
requires a stable two-row status surface. Separately, approval requests already
reach the shared approval service, but the TUI has no actionable control for
settling them.

These requirements share the same bottom-of-screen geometry. The approval
surface cannot be designed independently because it must appear near the status
and prompt without hiding transcript content, covering multiline input,
breaking slash-command navigation, or changing scroll and selection behavior.

The normal status surface remains two rows:

1. Row one preserves the ordered runtime fields and ends with `messages: N`.
2. Row two starts with authoritative context remaining and then renders
   overflow runtime state, including a pending-approval indicator.

## Decision

The approval interface is a drop-up above the prompt, similar to the existing
slash-command menu display. It is implemented by the separate connector
approval-controls graph member after that member consumes the completed
two-row status geometry.

The drop-up is not part of the status bar and does not add a third status row.
The two-row status member only renders the pending-approval status needed to
show that user action is required.

The selector must expose exactly:

- `Deny`
- `Allow once`
- `Allow for session`

An unlabeled generic `Approve` action is not sufficient because it does not
communicate the approval scope.

## Required Invariants

- The status surface remains exactly two rows during normal operation.
- A pending approval remains visible even when the selector is not focused.
- The selector shows action, target when present, risk, request identity, and
  expiry without exposing secrets.
- `Allow once` cannot replay.
- `Allow for session` expires when the bound session changes.
- Missing, expired, mismatched, unavailable, or ambiguous approval state
  remains fail-closed.
- Prompt contents, transcript tail state, transcript selection, slash-menu
  selection, and mouse regions survive selector open, resize, settlement, and
  dismissal.
- Multiple pending approvals remain distinguishable and settle independently.
- The TUI renders and submits decisions; approval authority remains in the
  shared gateway service.

## Resolution Evidence

The owner selected the slash-menu-style drop-up and clarified the graph
boundary:

1. `implement-tui-status-context-meter` creates the two-row status surface and
   splits the current fields at the recorded `messages: N` marker.
2. `implement-connector-approval-controls` is a different node that consumes
   the status geometry and creates the approval drop-up.
3. Framebuffer prototypes still must verify narrow, normal, and wide terminal
   sizes, multiline prompt growth, keyboard and mouse focus, transcript
   selection, multiple pending approvals, and future work-pane geometry before
   implementation can be accepted.

## Affected Nodes

- `implement-tui-status-context-meter`
- `implement-connector-approval-controls`
