# D3 File Access Gate

## Status

Resolved

## Context

The coding-worker shell can express filesystem access that bypasses structured
file-tool path resolution. A regular expression over shell text catches only a
small subset of absolute Unix paths and cannot establish containment for
quotes, variables, relative traversal, symlinks, shell expansion, subprocesses,
or Windows paths.

## Decision

All model-callable coding-worker filesystem operations are fail-closed against
the authorized workspace root from D2.

- Structured file tools canonicalize the workspace root and target, validate
  existing ancestors for symlink escapes, and reject traversal before access.
- Shell execution uses an OS/sandbox boundary that cannot access outside the
  authorized workspace by default. Text scanning may improve diagnostics but
  is never the security boundary.
- An outside-workspace request creates a typed
  `file.access.outside-workspace` approval request containing the canonical
  target, operation, command or mutation digest, principal, task, session, and
  expiry.
- Approval scopes are `allow_once` and `allow_for_session`. Execution repeats
  canonicalization and approval validation immediately before the operation.
- Missing, denied, expired, mismatched, or unavailable approval state blocks
  the operation.
- Approval records remain under `<runtime-root>/approvals/`, outside the
  model-writable workspace.
- TUI and Telegram render connector-appropriate decisions without giving the
  model authority to approve itself.

Internal SIM-ONE services may read their own runtime-root siblings through
separate application capabilities. D2 does not grant the coding worker access
to the whole `.gorombo` tree.

## Consequences

- Every read, write, edit, delete, create-directory, move, copy, patch, and
  shell path receives focused containment tests.
- Tests cover traversal, symlinks, non-existent targets, quoting, expansion,
  platform path forms, approval replay, expiry, and session changes.
- The current regex-only shell precheck is evidence of partial work, not
  completion of this decision.

## Affected Nodes

- `implement-file-access-approval-gate`
- `implement-connector-approval-controls`
