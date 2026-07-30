# Acceptance Specification: Coding Evidence And File Authorization

## ACC-FILE-001: Structured Operations Are Contained

Read, write, edit, patch, delete, mkdir, move, copy, and repository operations
reject traversal and canonical targets outside the selected workspace.

## ACC-FILE-002: Shell Is Actually Sandboxed

Shell attempts using absolute paths, relative traversal, symlinks, quoting,
variables, expansion, subprocesses, and platform-specific path syntax cannot
access outside the workspace without current approval.

## ACC-FILE-003: Approval Is Exact And Scoped

Allow-once cannot be replayed. Allow-for-session ends on session change or
expiry. Changed commands, mutations, targets, principals, or tasks require a
new decision.

## ACC-FILE-004: Missing UI Fails Closed

When a connector cannot render or settle an approval, execution remains
blocked and the user receives a connector-appropriate explanation.

## ACC-FILE-005: Connector Controls Work

Packaged TUI and Telegram tests create, approve, deny, expire, and settle an
outside-workspace request without exposing hidden or secret fields.

## ACC-EVIDENCE-001: Worker Result Is Typed

The Coding Worker cannot report completion without schema-valid change,
verification, approval, artifact, and checkpoint evidence.

## ACC-EVIDENCE-002: D4 Is Resolved

The selected owner decision records whether typed results alone are
authoritative or whether a scoped Flue event projection is also required.

## ACC-EVIDENCE-003: Verification Is Scoped

Cross-session, cross-task, nested-worker, secret, and hidden-reasoning access is
denied. The orchestrator receives only evidence needed for final synthesis.
