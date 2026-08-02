# Execution And Application Workflows

SIM-ONE Alpha combines durable Flue 2 agent conversations with finite
application-owned workflows. Agent conversations provide durable admission,
settlement, context, tools, and delegation. Application workflows are ordinary
TypeScript functions with explicit inputs, outputs, budgets, and ownership.

Flue 2 does not discover `src/workflows/`, mount workflow HTTP routes, or
create framework workflow-run records.

## Execution Envelope

```text
TUI, Web API, or schedule
-> authentication and request validation
-> trusted normalized event or schedule signal
-> product-session or schedule-run resolution
-> init(Orchestrator, { id })
-> dispatch(message)
-> owning application boundary applies its documented admission-persistence order
-> read(receipt) until exact settlement
-> protocols, memory, tools, MCP, or worker delegation
-> root orchestrator response or approved side effect
```

Product chat reads the exact settlement before persisting delivery correlation.
Schedules persist `submissionId` and `acceptedAt` immediately after admission,
then await settlement. The two application boundaries intentionally use
different persistence order and document it in their flows below.

## Runtime Primitives

| Primitive | Purpose |
| --- | --- |
| Flue agent instance | Durable continuing conversation addressed by agent function and instance id |
| Flue submission | One admitted message correlated by `submissionId` and `uid` |
| Flue subagent | Specialist delegate exposed to a parent through `useSubagent()` |
| Tool | Typed executable capability attached with `useTool()` |
| Application workflow | Bounded TypeScript operation called directly by product code or a tool |
| Schedule run | SIM-ONE-owned durable record for one scheduled attempt sequence |

## Conversational Turn

```text
User message
-> connector normalization
-> persist trusted event and resolve product session
-> dispatchOrchestratorMessage()
   -> init(Orchestrator, { id: activeGeneration })
   -> handle.dispatch(...)
   -> handle.read(receipt)
-> persist delivery correlation and project transcript
-> connector response
```

The TUI and Web/API surfaces converge on this product-session dispatcher after
connector-specific authentication and session policy. Telegram currently uses
Flue channel admission with a channel-derived agent instance ID; it persists
the normalized event but does not use the product session's active generation,
await settlement, or project the product-session transcript in this path.

## Research

The orchestrator delegates source-backed work to the `researcher` subagent.
The Researcher owns `web_research`, whose implementation calls application
functions in `src/workflows/web-research.ts` and
`src/workflows/retrieval.ts`.

`src/workflows/research.ts` is a direct application harness. It initializes the
addressable `Researcher`, dispatches one research prompt, awaits that exact
receipt, and returns the settled reply. It is not a public framework workflow
route.

## Memory And Retrieval

`retrieveContext()` is application machinery. It combines trusted event scope,
memory providers, document/vector retrieval, optional researcher-owned web
search, page fetch, deduplication, and token-budget packing. Retrieval returns
evidence and metadata; it does not authorize an action.

## Coding

```text
Orchestrator
-> coding-worker subagent
-> triage and plan
-> approved file changes
-> verification and debug
-> code review
-> approved Git or GitHub action when requested
-> structured result
-> orchestrator synthesis
```

The Coding Worker owns its internal subagents, tools, skills, task state,
sandbox, and approval integration. Internal workers are not public agents.

## Schedules

A schedule fire creates a SIM-ONE schedule-run record, dispatches a structured
signal to a new orchestrator instance, stores `submissionId`, and awaits that
submission's `handle.read()` promise. Admission never counts as completion.
Retry, timeout, skip, and final status remain application-owned schedule state.

## Runtime Capability Lifecycle

Runtime-added skills, tools, workers, and MCP servers follow one application
lifecycle:

```text
validated request
-> protocol and approval checks
-> SQLite capability record
-> promoted managed package or MCP definition
-> gateway restart
-> loadRuntimeCapabilitySnapshot()
-> useSkill/useTool/useSubagent/useMcpConnection
```

## Progress And Failure

Flue events expose instance, submission, operation, turn, tool, and task
activity. SIM-ONE projects those events into connector and TUI progress rows
and sanitized execution telemetry. Application workflows additionally return
typed provider failures, budgets, approvals, or verification evidence.

Completion requires the settled root result or the documented application
terminal state. A process, admission receipt, or HTTP `202` alone is not
completion evidence.

## Source Map

| Area | Source |
| --- | --- |
| Orchestrator dispatch/read | `src/engine/session/durable-orchestrator-session.ts` |
| Product chat ingress | `src/api/routes/chat-events.ts` |
| Research harness | `src/workflows/research.ts` |
| Retrieval machinery | `src/workflows/retrieval.ts` |
| Web research machinery | `src/workflows/web-research.ts` |
| Schedule dispatch | `src/engine/schedules/schedule-dispatch.ts` |
| Coding loop | `src/engine/workers/coding-worker/workflow/` |
| Runtime capabilities | `src/engine/capabilities/` |
| Flue telemetry | `src/core/telemetry/flue-telemetry.ts` |
