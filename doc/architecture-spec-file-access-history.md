# Architecture Specification: Coding Evidence And File Authorization

## File Authorization

```text
trusted coding task
  -> selected workspace/repository scope
  -> canonical structured operation or sandboxed shell request
  -> containment check
     -> inside workspace: policy evaluation
     -> outside workspace: typed approval request
  -> current approval validation
  -> execution
  -> filesystem/Git/test evidence
  -> structured Coding Worker result
```

Structured tools validate canonical targets, ancestors, and symlinks. Shell
execution is confined by an OS/sandbox boundary. Diagnostic command scanning
cannot authorize access.

Approval records bind principal, connector, session, task, operation, canonical
target, mutation or command digest, scope, expiry, and decision. The shared
approval service owns persistence under `<runtime-root>/approvals/`.

## Connector Decisions

The gateway exposes a sanitized approval projection and decision endpoint.
Ratatui renders inline or modal controls; Telegram renders connector-native
controls. Both verify ownership and current state before accepting a decision.
The model receives only the settled typed result.

## Worker Evidence

The Coding Worker lead returns a schema-validated result containing:

- status and summary;
- bounded implementation plan/checkpoint;
- applied file and Git changes;
- verification commands and results;
- approval references;
- artifacts and repository state;
- public progress events.

Internal subagents return structured results to the lead. They are not visible
as top-level orchestrator workers.

## D4 Boundary

D4 remains open between authoritative typed worker evidence and an additional
read-only service over Flue's durable event interface. If the service is
selected, it scopes by trusted parent session and `taskId`, sanitizes data, and
returns a bounded projection. It does not expose SQLite or a generic transcript
query to the model or TUI.
