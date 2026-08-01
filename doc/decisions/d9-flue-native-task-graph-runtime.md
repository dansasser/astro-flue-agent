# D9: Use A Flue-Native Application Graph Coordinator

Status: accepted for specification; implementation pending.

## Question

Should SIM-ONE Alpha add LangGraph as a second agent runtime, use a Flue
workflow as the graph scheduler, or build the task coordinator around Flue's
existing agent surfaces?

## Decision

Build a small application-owned TypeScript task-graph coordinator and use Flue
agents, subagents, tools, skills, MCP connections, sessions, streams, and
persistence as node executors.

Do not add LangGraph as a runtime dependency. Borrow its proven architectural
mechanisms where they fit: typed state channels and reducers, partial updates,
conditional edges, checkpointed threads, interrupts, private subgraph state,
and explicit runtime context.

Do not use a Flue workflow as the TLG scheduler. Flue workflows may package
bounded operations, but interrupted workflow functions do not resume from an
arbitrary completed step. The SIM-ONE coordinator and Memory Helper own
checkpoint and resume behavior.

## Rationale

SIM-ONE Alpha is a Flue product. A second agent runtime would duplicate model,
tool, subagent, persistence, event, and deployment concerns. A narrow
coordinator supplies the missing graph semantics without weakening Flue
ownership.

## Rejected Alternatives

- Adding `@langchain/langgraph` and routing model work outside Flue.
- Encoding the graph entirely in prompt instructions.
- Running the whole task as one non-resumable Flue workflow.
- Keeping one hardcoded `while` loop per worker.

## Consequences

- The coordinator must have validated definitions, a scheduler, reducer
  registry, checkpointer, interrupt handling, and executor adapters.
- Model execution still goes through Flue.
- Task state and recovery remain application-owned and testable without a live
  model.
- Flue version-matched documentation remains authoritative for agent and
  subagent behavior.

## Affected Graph Consumers

- `plan-implementation`
- `implement-core-contracts`
- `implement-agent-runtime`
- `implement-ingress-operations`
- `integrate-and-repair`
- `review-architecture-security`
- `specify-task-lifecycle-architecture`
- `verify-release-reconciliation-specifications`

## Revisit Trigger

Revisit if Flue adds a durable, resumable, step-checkpointed graph API that
satisfies the same state, interrupt, context, and evidence contracts without
duplicating the SIM-ONE coordinator.
