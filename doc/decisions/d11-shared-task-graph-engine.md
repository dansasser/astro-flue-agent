# D11: Share One Graph Engine Across Orchestrator And Coding Worker

Status: accepted for specification; implementation pending.

## Question

Should the main orchestrator and Coding Worker have unrelated task loops, or
should they use one graph runtime with different definitions?

## Decision

Use one task-graph engine with separate validated definitions and private state
schemas:

- `orchestrator-turn` governs one admitted root request; and
- `coding-task` governs repository work as a child graph.

The current Coding Worker loop becomes the initial coding graph topology. The
main graph invokes it through an explicit parent-to-child input projection and
receives a structured result and evidence projection.

Project graph engineering remains a Coding Worker capability. When a coding
task is bound to a DLG node, the graph engine uses a dedicated governed adapter
to claim, complete, fail, or interrupt that node. The adapter binds the exact
Development Lifecycle Graph definition and checksum, branch-local run state and
run version, append-only event history, acting authority, and evidence records.
Every claim, complete, fail, or interrupt operation has a unique idempotent
operation ID and commits through atomic compare-and-swap; a stale run version is
rejected. After an unknown timeout or restart outcome, the adapter reads the
ledger by operation ID before retrying and never reapplies an already committed
transition. Any DLG definition mutation is a separate operation that is
previewed, approved, validated, recorded, and reversible. The main orchestrator
does not directly mutate the DLG definition, run state, or event history.

## Rationale

One engine gives both agents the same checkpoint, interrupt, context,
observability, and task-state semantics while preserving their different
ownership and capabilities.

## Rejected Alternatives

- A free-form main-agent loop plus a separate Coding Worker state machine.
- Exposing Coding Worker internal subagents directly to the orchestrator.
- Letting a model choose arbitrary graph edges without validated conditions.
- Making project graph mutation a general main-agent tool.

## Consequences

- Built-in graph definitions become product contracts with focused tests.
- Coding Worker specialist profiles remain private to the coding graph.
- Root and child task runs have explicit identifiers and evidence linkage.
- Progress events can render one nested task view in the TUI.

## Affected Graph Consumers

- `plan-implementation`
- `implement-agent-runtime`
- `implement-ingress-operations`
- `integrate-and-repair`
- `implement-sim-one-tui-work-pane`
- `review-architecture-security`
- `specify-task-lifecycle-architecture`
- `verify-release-reconciliation-specifications`

## Revisit Trigger

Revisit if a worker needs execution semantics that cannot be represented by
typed nodes, subgraphs, interrupts, and bounded feedback without weakening its
authority boundary.
