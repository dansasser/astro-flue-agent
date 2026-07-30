# D4 Orchestrator Worker Verification

## Status

Open

## Context

Flue returns a delegated task result to the parent and durably records
correlated task, tool, operation, turn, and message events. SIM-ONE Alpha also
defines structured Coding Worker results and progress events. The orchestrator
needs evidence strong enough to verify worker claims before final synthesis,
but it must not bypass Flue persistence or turn raw SQLite access into a
model-callable capability.

## Decision

No verification architecture is selected. The owner must choose one of these
compatible boundaries, or explicitly approve both:

1. Make the typed Coding Worker result and evidence manifest authoritative,
   with required file, diff, test, approval, and artifact evidence.
2. Add a read-only application service over Flue's durable event-stream
   interface, scoped by the current parent session and `taskId`, that returns a
   sanitized verification projection.

Direct orchestrator or TUI queries against `flue.sqlite` are not an option.
The TUI remains a connector client and workers remain Flue subagents.

## Required Invariants

- Evidence is scoped to the current trusted session, parent task, and worker.
- Raw hidden reasoning, secrets, tool credentials, and unrelated sessions are
  excluded.
- The orchestrator receives structured facts, not an unbounded transcript.
- Final synthesis distinguishes worker self-report from independently checked
  filesystem, Git, test, approval, and artifact evidence.
- The chosen path uses Flue task/event contracts and survives durable replay.

## Resolution Evidence

Resolution requires an owner selection, a typed result/projection schema, a
data-retention and sanitization policy, and tests proving cross-session and
cross-task access is denied.

## Affected Nodes

- `implement-orchestrator-worker-verification`
