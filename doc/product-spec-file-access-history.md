# Product Specification: Coding Evidence And File Authorization

## Problem

The Coding Worker can express filesystem access through both structured tools
and shell commands. The current partial shell-text check does not establish
containment or provide actionable approval. Separately, the orchestrator needs
reliable evidence for worker claims without receiving raw internal history or
querying Flue's database directly.

## Required Outcomes

1. Every model-callable filesystem operation is contained to the D2 coding
   workspace by a real path/sandbox boundary.
2. Outside-workspace access is represented as a typed approval request with
   allow-once and allow-for-session scopes.
3. TUI and Telegram can render and settle the approval on their active
   connector.
4. Approval state remains outside the coding workspace and is revalidated
   immediately before execution.
5. Coding Worker completion returns typed plans, edits, tests, approvals,
   artifacts, and task checkpoints.
6. The owner-selected D4 verification path lets the orchestrator independently
   check required evidence while preserving Flue and connector boundaries.

## Non-Goals

- Using regex command scanning as the security boundary.
- Giving the coding model broad access to `.gorombo`.
- Letting a model approve its own operation.
- Exposing hidden reasoning, credentials, unrelated task history, or raw
  runtime databases.

## Release Binding

This specification is required by `REL-CW-001`, `REL-CW-003`,
`REL-CW-006`, and `REL-APP-001`.
