# D7: Separate Project And Task Lifecycle Graphs

Status: accepted for specification; implementation pending.

## Question

Should one graph represent both repository development governance and the
execution of an individual agent request?

## Decision

No. SIM-ONE Alpha will maintain two explicitly different graph contracts:

- the repository-owned Development Lifecycle Graph governs durable project
  intent, artifacts, approvals, implementation, verification, release, and
  invalidation; and
- a Task Lifecycle Graph governs one admitted user request from intake to a
  terminal task result.

A TLG can bind one authorized DLG node as input and report evidence through the
DLG runtime adapter. It cannot directly rewrite the DLG definition, run state,
or event history.

## Rationale

The graphs have different lifetimes, authority, evidence, and mutation rules.
Combining them would let short-lived task execution accidentally redefine
project intent or make repository history depend on connector session state.

## Rejected Alternatives

- One universal graph containing project, conversation, and task nodes.
- Treating every user request as a mutation of `development-graph.json`.
- Copying the DLG into each agent prompt and allowing the model to interpret
  run state.

## Consequences

- Definitions, run state, ledgers, and identifiers must name their graph type.
- Cross-graph execution requires an adapter with checksum, run-version,
  authority, and evidence bindings.
- Project graph mutation remains separately previewed, approved, validated, and
  reversible.

## Affected Graph Consumers

- `plan-implementation`
- `implement-core-contracts`
- `implement-agent-runtime`
- `implement-ingress-operations`
- `review-architecture-security`
- `specify-task-lifecycle-architecture`
- `verify-release-reconciliation-specifications`

## Revisit Trigger

Revisit only if one shared contract can preserve separate authority, persistence,
mutation, and evidence semantics without allowing a task run to rewrite project
intent.
