# D10: Seal Per-Node Context Envelopes

Status: accepted for specification; implementation pending.

## Question

How should graph state manipulate model context without passing the complete
conversation, project graph, workspace, retrieval store, and tool history into
every agent node?

## Decision

Every model-executed TLG node runs in a fresh Flue child-session capsule over a
sealed, versioned context envelope assembled by an application-owned context
controller.

The envelope includes mandatory direct inputs, protocols, authority, approvals,
safety constraints, accepted upstream evidence, declared capabilities, and
budgeted optional context. It records inclusion and omission reasons, token
accounting, provenance, and a digest.

The capsule has no undeclared generic filesystem, graph, transcript, retrieval,
web, or credential access. Additional information or action requires a typed
broker request and a newly sealed envelope.

## Rationale

Typed graph state alone does not bound an LLM prompt. Context control requires
an enforced adapter boundary that determines the exact payload and capability
surface for each invocation.

## Rejected Alternatives

- Prompting the model to ignore irrelevant history.
- Passing all transitive ancestor artifacts.
- Using semantic retrieval as the authority for mandatory context.
- Trimming messages without recording provenance or fidelity.
- Letting each node call arbitrary tools to repair missing context.

## Consequences

- Mandatory context is selected before optional retrieval and cannot be ranked
  away.
- Protocol, authority, safety, and approval changes invalidate affected
  envelopes.
- Same-run replay and cross-run cache reuse require exact envelope identities.
- The outer durable connector session remains separate from node-local model
  working context.

## Affected Graph Consumers

- `plan-implementation`
- `implement-core-contracts`
- `implement-agent-runtime`
- `implement-memory-retrieval`
- `implement-capabilities-security`
- `implement-ingress-operations`
- `integrate-and-repair`
- `review-architecture-security`
- `specify-task-lifecycle-architecture`
- `verify-release-reconciliation-specifications`

## Revisit Trigger

Revisit only when another mechanism can prove the exact model payload,
capability absence, provenance, mandatory closure, and invalidation behavior at
least as strongly.
