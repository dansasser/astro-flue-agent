# Task Lifecycle Graph Architecture

Status: accepted architecture specification; implementation is pending.

This specification defines how SIM-ONE Alpha will combine repository-level
development graph engineering with durable per-request task lifecycle graphs.
It preserves Flue as the agent runtime and extends the existing Rust/WebAssembly
Memory Helper as the shared durable task-state foundation.

## Purpose

SIM-ONE Alpha needs two graph layers with different ownership and lifetimes:

- a Development Lifecycle Graph (DLG) governs changes to a repository or other
  durable project; and
- a Task Lifecycle Graph (TLG) governs one admitted user request from intake to
  completion, failure, or human intervention.

The DLG records project intent, dependencies, artifacts, approvals,
verification, release work, and invalidation. A TLG records active task state,
node transitions, bounded retries, delegated work, approvals, evidence, and the
context supplied to each model-executed node.

These layers may reference each other, but neither may impersonate or silently
rewrite the other.

## Non-Goals

- Replacing Flue with LangGraph or another agent runtime.
- Treating a checklist alone as a complete execution graph.
- Copying the repository DLG, full transcript, or complete workspace into every
  model call.
- Making the TUI, Telegram, or another connector own agent orchestration.
- Allowing an agent to approve its own graph mutation or side effect.
- Using an application workflow function as the durable TLG scheduler. Flue 2
  has no framework workflow runtime, and ordinary TypeScript execution does not
  checkpoint arbitrary steps for resume.

## Terminology

| Term | Meaning |
| --- | --- |
| DLG | Repository-owned Development Lifecycle Graph and its separate run/evidence state. |
| TLG definition | Versioned topology for one class of admitted task, such as an orchestrator turn or coding task. |
| TLG run | One durable execution of a TLG definition. |
| task state | User-visible checklist, todo, and status information maintained by the Memory Helper. |
| execution state | Active frontier, node attempts, reducers, checkpoints, approvals, and evidence for a TLG run. |
| context envelope | Exact bounded projection supplied to one model-executed graph node. |
| capsule | Fresh Flue child-session invocation that receives one sealed context envelope. |

## Current Baseline

The existing system already provides several required foundations:

- the canonical project DLG in `development-graph.json`;
- durable Flue orchestrator sessions and child-session subagents;
- a bounded Coding Worker loop with typed steps, replanning, approvals,
  verification evidence, and task checkpoints;
- Rust/WASM checklists, nested checklist items, todos, notes, status
  validation, cycle protection, trusted scope, and SQLite durability;
- main-agent and Coding Worker tools over the same structured-memory engine;
  and
- typed progress events consumed by connector and TUI surfaces.

The current Coding Worker loop is not yet a reusable graph engine. Its topology
is hardcoded, its checkpoint is not used to resume execution, and it has no
definition checksum, reducer registry, active-frontier scheduler, or sealed
per-node context envelope.

## Required State Planes

### Project Lifecycle Plane

The project DLG remains repository-owned, canonical, and version controlled.
Its mutable run state and evidence remain separate from its definition.

A TLG may receive a DLG node contract, graph checksum, run version, lease, and
declared artifact projections as inputs. It may report node evidence back
through the governed DLG runtime adapter. It may not edit
`development-graph.json`, graph run state, or graph history directly.

### Task Definition Plane

Built-in TLG definitions are product-owned, versioned, validated contracts.
Each definition declares:

- entry and terminal nodes;
- typed state channels and reducers;
- node input and output schemas;
- deterministic, Flue-agent, Flue-subagent, tool, approval, and observation
  executors;
- normal, conditional, interrupt, and bounded feedback edges;
- maximum attempts, timeout, and retry policy;
- capability and side-effect requirements; and
- context-envelope projections for model-executed nodes.

The initial built-in definitions are:

- `orchestrator-turn`, for one admitted main-agent request; and
- `coding-task`, for one Coding Worker request.

The coding graph can run as a subgraph of the orchestrator graph while retaining
its own private state schema and explicit parent/child projections.

### Durable Task State Plane

The Rust/WASM Memory Helper is the shared task-state authority for the main
agent and Coding Worker. It will be extended rather than bypassed.

The existing checklist, todo, and session-note records remain user-facing
memory records. TLG support adds a durable task-run aggregate linked by stable
identifiers:

```text
taskId
taskGraphId
taskGraphVersion
runId
runVersion
projectId and trusted connector scope
checklistId
parentRunId and parentNodeId
status
active frontier
node states and attempts
bounded feedback counters
approval references
evidence references
context-envelope digests
createdAt and updatedAt
```

The Rust transition kernel validates legal status changes, reducer application,
attempt bounds, feedback bounds, and compare-and-swap `runVersion` updates.
The TypeScript persistence wrapper stores task runs, node checkpoints, and an
append-only hash-chained event ledger in SQLite. Existing checklist items are
the user-visible projection of graph nodes; they are not a second scheduler.

Every graph-node transition updates its linked checklist item through the same
transaction boundary or records a repairable projection failure. A user or
connector may update exposed task controls only through authorized commands
that become typed graph inputs or interrupts.

### Context-Envelope Plane

Durable graph state is not automatically model context. Before every
model-executed node, a context controller constructs a sealed envelope
containing:

- the active node contract and task objective;
- required direct input projections;
- applicable protocol, authority, approval, safety, and capability records;
- accepted upstream evidence references and bounded projections;
- selected optional memory or retrieval results;
- token accounting and output reserve;
- included and omitted item manifests;
- definition, run, node, model, tokenizer, and projection versions; and
- a digest covering the ordered payload and result-affecting identities.

Mandatory inputs cannot be ranked away. Optional retrieval happens only after
mandatory closure. Full transcripts, raw tool output, the complete project
graph, generic filesystem access, credentials, and undeclared retrieval remain
outside the envelope.

A capsule that needs more information returns a typed context or action
request. The controller checks graph permission, trusted scope, current
authority, approval, provenance, and token budget before creating a new
envelope. The model does not acquire context or capabilities by requesting
them in prose.

### Flue Execution Plane

Flue remains responsible for models, tools, skills, subagents, sessions,
streaming events, persistence adapters, and connector-facing agent events.

The SIM-ONE task-graph coordinator is application-owned TypeScript machinery.
It schedules ready nodes and invokes Flue surfaces as node executors:

- deterministic application code for validation and state reduction;
- fresh Flue child sessions for model capsules;
- named Flue subagent definitions for bounded specialist nodes;
- registered Flue tools and MCP capabilities through the broker;
- durable approval interrupts; and
- typed observation nodes for progress and completion.

Application workflow functions may package bounded operations, but they are
not the TLG checkpointer or scheduler because interrupted functions do not
resume from arbitrary completed steps.

### Evidence And Observation Plane

Every run records:

- definition and context checksums;
- accepted task and trusted-scope identifiers;
- node claims, attempts, results, and failures;
- reducer updates and active-frontier changes;
- approval and interrupt decisions;
- Flue operation, tool, and child-session references;
- context-envelope and output digests;
- checklist projection changes;
- bounded retry and feedback traversal counts; and
- terminal status.

Events are safe typed summaries. Raw secrets, hidden reasoning, complete
prompts, and unbounded tool payloads are not stored in the graph event ledger.

## Orchestrator Turn Graph

The target main-agent topology is:

```text
admit normalized event
-> load protocols through trusted event scope
-> classify task and required resources
-> resolve bounded session, memory, and project context
-> assemble and seal root context envelope
-> execute orchestration capsule
-> conditionally invoke tools, researcher, coding graph, or other workers
-> validate structured results and protocol evidence
-> interrupt for approval when required
-> synthesize final response
-> completion gate
-> completed | failed | needs-human
```

Connector session persistence and TLG persistence remain separate. Telegram
may retain one connector conversation while each admitted message receives its
own task run. The TUI may start a fresh conversation by default while its tasks
remain queryable by their durable task and project scope.

## Coding Task Graph

The existing Coding Worker loop becomes a built-in graph definition:

```text
accept and bind task scope
-> repository preflight
-> triage and plan
-> implementation capsule
-> approval interrupt for mutations
-> atomic edit application
-> focused verification
-> debug and bounded replan feedback
-> independent code review
-> conditional Git and GitHub approval/action path
-> completion gate
-> completed | blocked | failed | needs-human
```

Each specialist receives only its node projection. For example, code review
receives the task acceptance contract, relevant diff, verification evidence,
and applicable rules, not every earlier transcript or unrelated task-memory
record.

### Coding Worker Task-Run Migration

The current `JsonFileCodingTaskRunStore` file is schema version 0 migration
input. Import maps each record's `taskId`, status, session plan, plan, events,
verification evidence, checkpoint, and timestamps into one versioned
`coding-task` TLG run, its node/checkpoint state, and evidence references. The
import records the source-file checksum and a per-record migration identity so
retries are idempotent and conflicting duplicates fail closed.

During compatibility rollout, the JSON store remains the read/write authority
and the new store receives validated imports only. Terminal records import as
historical completed, blocked, or failed runs. Non-terminal records import as
interrupted runs: a complete validated checkpoint may be offered for explicit
resume, while a missing, stale, or invalid checkpoint becomes `needs-human` and
must not replay model, tool, approval, Git, or GitHub effects automatically.

The Rust/WASM-backed task-run store becomes authoritative only after migration
tests prove complete record accounting, field and status mapping, idempotent
re-import, schema-version rejection, active-run recovery, restart hydration,
event/evidence preservation, and rollback from the pre-cutover backup. At
cutover the JSON file is retained read-only for audit and compatibility; all
writers switch atomically to the new store. The JSON store is removed only in a
later separately approved migration after the rollback window closes.

## Development Graph Adapter

Project graph engineering remains a Coding Worker responsibility. The main
orchestrator may recognize that a request concerns a repository DLG and
delegate it, but it does not mutate repository graph artifacts directly.

The adapter flow is:

```text
validate repository DLG and current checksum
-> inspect DLG run status and ready node
-> bind one authorized DLG node contract to a coding TLG run
-> execute through the coding graph
-> verify declared outputs and evidence
-> complete, fail, or interrupt the DLG node through its runtime API
-> preserve both ledgers and their cross-reference
```

A proposed DLG topology change remains a governed graph mutation with preview,
checksum and run-version bindings, acting authority, validation, evidence,
rollback, and targeted invalidation. It is separately approved from the TLG
run. Every adapter transition and topology mutation uses atomic compare-and-swap,
rejects stale versions, and carries a unique idempotent operation ID. If a
timeout or restart leaves the outcome unknown, recovery reads the append-only
ledger by operation ID and reconciles the committed version before any retry;
it never reapplies a transition whose commit already exists. A TLG may recommend
that mutation but never applies it silently.

## State And Reducer Rules

State channels declare one reducer:

- replace for current scalar status;
- append with content-addressed deduplication for evidence;
- set union for invalidations and capability requirements;
- strictest-wins for policy and authority;
- immutable append for approvals and audit events;
- bounded merge for plans and checklist projections; or
- reject on conflicting concurrent writes without a registered resolver.

Node output is a partial typed update. Updates become visible only after the
current execution step validates and checkpoints. Parallel nodes cannot observe
each other's uncommitted writes.

## Interrupts, Resume, And Recovery

Approval, missing authority, mandatory context overflow, uncertain side
effects, and explicit user input suspend a run at a durable checkpoint.

Resume requires the same run identity and a compare-and-swap run version. A
changed definition, node contract, mandatory artifact, protocol set, approval,
or context envelope invalidates the affected checkpoint and requires
recomputation or renewed approval.

Completed idempotent nodes can replay from accepted checkpoint results.
External side effects require application-owned idempotency keys. A started
side effect with an unknown result is not automatically repeated.

## Security And Ownership

- Trusted actor, connector, conversation, thread, project, and repository scope
  come from admitted runtime context, never model arguments.
- The main orchestrator owns root task admission, worker selection, result
  validation, and final response authority.
- The Coding Worker owns repository execution and its internal coding subgraph.
- The Researcher continues to own web and source-backed research.
- The Memory Helper owns durable task state and its trusted scope checks.
- The context controller owns model-input assembly.
- The capability broker owns tool and external-resource admission.
- Human approval remains external to the model and bound to exact graph state.
- Connectors and the TUI render typed task projections but do not read runtime
  databases or schedule graph nodes directly.

## Acceptance Contract

Implementation is not complete until tests prove:

1. The DLG and TLG definitions, run stores, and ledgers cannot be confused.
2. Main-agent and Coding Worker tasks use the same Rust/WASM-backed task-state
   authority.
3. A process restart resumes an interrupted task from its accepted checkpoint
   without repeating accepted work.
4. Illegal transitions, stale run versions, exceeded retries, and exceeded
   feedback bounds fail closed.
5. Each model node receives only its sealed envelope and declared capability
   schemas.
6. Protocol, authority, approval, and required artifact inputs cannot be omitted
   by context ranking or compaction.
7. Coding Worker checklist state remains synchronized with graph-node state.
8. The TUI can independently scroll and display the active checklist without
   becoming a scheduler or persistence client.
9. A coding TLG can execute one authorized ready DLG node and report evidence
   without directly editing graph run state.
10. Typed progress and terminal events remain observable through current
    connector and TUI streams.
11. The orchestrator and Coding Worker use one shared graph engine with separate
    validated definitions and private worker subgraph state, while DLG
    definition, run-state, mutation, and evidence authority remains separate.

## Decisions

- [D7: Separate Project And Task Lifecycle Graphs](../../doc/decisions/d7-separate-project-and-task-graphs.md)
- [D8: Extend The Memory Helper For Durable Task Runs](../../doc/decisions/d8-memory-helper-task-runs.md)
- [D9: Use A Flue-Native Application Graph Coordinator](../../doc/decisions/d9-flue-native-task-graph-runtime.md)
- [D10: Seal Per-Node Context Envelopes](../../doc/decisions/d10-sealed-node-context.md)
- [D11: Share One Graph Engine Across Orchestrator And Coding Worker](../../doc/decisions/d11-shared-task-graph-engine.md)

## Implementation Boundary

This document specifies the target architecture. It does not add the task-graph
runtime, migrate Coding Worker checkpoints, change main-agent prompt execution,
or initialize a graph run. Those changes remain governed by the repository
Development Lifecycle Graph and its human approval gates.
