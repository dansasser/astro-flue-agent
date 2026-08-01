# D8: Extend The Memory Helper For Durable Task Runs

Status: accepted for specification; implementation pending.

## Question

Where should durable task graph state live, given the existing Rust/WebAssembly
Memory Helper already maintains project-scoped checklists, todos, notes, and
task handoffs?

## Decision

Extend the existing Memory Helper subsystem to own durable TLG run state. Do not
introduce an unrelated task database or leave the Coding Worker JSON task-run
store as a competing source of truth.

The Rust transition kernel will validate task-run and node-state transitions,
bounded attempts and feedback, reducer application, and compare-and-swap run
versions. The TypeScript persistence wrapper will store task runs, checkpoints,
and an append-only hash-chained event ledger in SQLite.

Existing checklists and todos remain the user-visible task projection. A task
run links to one checklist, and graph transitions update linked checklist items
through the governed task-state boundary.

## Rationale

The Memory Helper already provides trusted project scope, deterministic Rust
validation, SQLite durability, restart hydration, task identifiers, nested
items, statuses, and shared access from the main agent and Coding Worker.
Building around it preserves one durable task model for agents and the TUI.

## Rejected Alternatives

- A new standalone TypeScript JSON task-run store.
- Treating Flue conversation history as task state.
- Treating checklist parent-child structure as the complete execution graph.
- Letting the TUI mutate SQLite directly.

## Consequences

- The memory schemas, WASM API, TypeScript engine contract, SQLite schema, and
  smoke tests must expand together.
- Checklist projection and graph execution state remain distinct but linked.
- Existing Coding Worker task-run records require an explicit migration or
  compatibility boundary.
- The TUI reads typed task projections through gateway APIs.

## Affected Graph Consumers

- `plan-implementation`
- `implement-core-contracts`
- `implement-memory-retrieval`
- `implement-agent-runtime`
- `implement-sim-one-tui-work-pane`
- `verify-memory-smoke`
- `review-architecture-security`

## Revisit Trigger

Revisit if measured WASM transition overhead or SQLite contention prevents the
required task throughput, while preserving one canonical task authority and the
same trust boundary.