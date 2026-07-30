# Execution Workflows

SIM-ONE Alpha combines durable agent sessions with finite Flue workflows.
Agents maintain conversational context. Workflows perform bounded operations
with explicit inputs, outputs, budgets, and completion states.

Both run inside the same orchestration envelope. Protocol loading and
approval-gated Git and GitHub mutation paths are implemented. Complete critic
scoring and a trusted fail-closed pre-execution boundary across every path
remain release gates.

## Execution Envelope

```text
Connector, TUI, Web API, or schedule
-> Authentication and request validation
-> NormalizedMessageEvent persistence
-> Orchestrator
-> Protocol loading
-> Memory or retrieval when needed
-> Tool, workflow, or worker delegation
-> Progress and evidence
-> Orchestrator synthesis and implemented approval checks
-> Response or approved side effect
```

Ingress, protocol-loading instructions, delegated execution, and orchestrator
synthesis remain present regardless of which interface started the work.
Complete protocol scoring before every response or side effect is the release
contract, not current-source behavior.

## Agents And Workflows

| Runtime primitive | Purpose |
| --- | --- |
| Agent session | Continuing context, tool use, delegation, and conversation |
| Worker child session | Specialist execution under a parent agent |
| Workflow | Finite application operation with a typed payload and result |
| Tool | One typed executable capability attached to an agent |

A workflow can initialize an agent, open a session, invoke tools, and coordinate
bounded application machinery. It does not replace the orchestrator's
governance role for user-facing work.

## Conversational Turn

```text
User message
-> Connector normalization
-> Secure gateway admission
-> Persisted event
-> Orchestrator session
-> load_protocols
-> Memory, tools, or worker delegation
-> Orchestrator synthesis
-> Connector response
```

The terminal interface, Telegram, and Web/API clients converge on the same
orchestration boundary after connector-specific authentication and
normalization. Discord is a pre-release connector gate.

## Research Execution

```text
Research request
-> Orchestrator determines source-backed evidence is required
-> Researcher child session
-> web_research workflow
-> Bounded search, fetch, cache, and evidence packing
-> Sources and retrieval limitations
-> Orchestrator synthesis
```

The standalone research workflow uses the same Researcher profile. Direct web
search remains restricted to the Researcher and research workflow.

## Memory And Document Retrieval

```text
Context request
-> Trusted event scope
-> Retrieval workflow
-> Memory router and RAG router
-> Structured memory, session memory, or document index
-> Ranked and budgeted context
-> Requesting agent
```

Retrieval returns evidence and metadata. It does not independently authorize
an action or override an active protocol.

## Coding Execution

```text
Coding request
-> Orchestrator
-> Applicable protocol bundle
-> Coding Worker lead
-> Triage and plan
-> Approved implementation
-> Verification and debug loop
-> Code review
-> Approved Git or GitHub action when requested
-> Structured result
-> Orchestrator synthesis
```

The Coding Worker owns its internal subagents and execution tools. Current file
edits are constrained by the worker workspace and sandbox but are not routed
through the approval service. Commits, pushes, and GitHub mutations use
approval-gated tools. Approval enforcement for file edits remains a release
gate. Progress events and task checkpoints make the loop observable and
recoverable.

## Scheduled Execution

```text
Owned schedule
-> Schedule manager
-> Fire and run record
-> Admission dispatch
-> Orchestrator turn
-> Orchestrator handling or governed Coding Worker delegation
-> Progress observation
-> Completion, retry, skip, or error record
```

Schedules support cron expressions, recurring intervals, one-time timestamps,
and manual runs. Ownership is derived from trusted event context for user
operations. Schedule definitions and run history are stored in SQLite.

A scheduled prompt enters the agent runtime through admission dispatch and is
observed through structured progress. Current dispatch does not persist or pass
a trusted normalized-event id, so `load_protocols` and scoped memory retrieval
are unavailable during scheduled turns. Trusted event handoff for those
controls remains a release gate.

The schedule manager observes terminal status but does not retain the
orchestrator's result content or deliver it through a connector. Scheduled
result persistence and user delivery remain release gates.

## Runtime Capability Lifecycle

Runtime-added skills, tools, workers, and MCP servers follow a managed
operational workflow:

```text
Install
-> Validate and persist
-> Registry record
-> Automatic skill enablement or explicit executable-capability enablement
-> Runtime restart
-> Startup load report
-> Governed availability to the owning agent or worker
```

Skills are instruction content and are enabled by default. Enablement grants no
independent authority: skill guidance remains subordinate to active protocols,
trusted scope, owning-agent attachment, executable-tool boundaries, sandbox
policy, and action-specific approvals. Tools, workers, and MCP servers remain
disabled until the user enables them. Registry state, validation, runtime
attachment, protocol rules, and approval policy all remain part of execution.

## GitHub MCP And Repository Access

The Coding Worker lead connects to the official remote GitHub MCP server
through Flue when `GITHUB_PERSONAL_ACCESS_TOKEN` is configured. Only selected
read tools are attached to the model. Typed SIM-ONE GitHub mutation tools call
the remaining official MCP tools only after an action-specific approval is
settled.

Raw GitHub credentials are not passed into the worker's local execution
sandbox, connector payloads, or model context. Public HTTPS Git operations run
anonymously first; private access can retry through a command-scoped askpass
environment. There is no device-login workflow or GitHub CLI fallback.

## Progress And Terminal States

The terminal event stream and schedule subsystem emit typed activity for
operations, tools, approvals, retries, and completion. The standalone Coding
Worker loop can collect typed checkpoint events, but the live Flue worker
profile does not yet attach that reporter or forward its events to the active
connector. A bounded operation ends in an explicit state such as:

```text
completed
blocked
rejected
skipped
error
```

The specific result contract depends on the workflow, but completion claims
must include the evidence required by the active protocol and task.

## Failure And Recovery

Finite workflows make failure boundaries explicit:

- retrieval reports provider and budget failures;
- research reports missing or incomplete evidence;
- coding replans within a bounded turn budget;
- approval denial prevents the side effect;
- schedules record retries, skips, and terminal errors;
- runtime capability loading reports invalid records;
- the orchestrator can reject or redelegate insufficient worker output.

Persisted sessions, task checkpoints, and schedule runs provide recovery
context without treating the model's prompt as the system of record. Live
Coding Worker checkpoint forwarding remains a release gate.

## Source Map

| Area | Source |
| --- | --- |
| Orchestrator agent | `src/agents/orchestrator.ts` |
| Application ingress | `src/app.ts` |
| Retrieval workflow | `src/workflows/retrieval.ts` |
| Research workflows | `src/workflows/research.ts`, `src/workflows/web-research.ts` |
| GitHub MCP and credential boundary | `src/engine/workers/coding-worker/github/` |
| Coding loop | `src/engine/workers/coding-worker/workflow/` |
| Schedule manager | `src/engine/schedules/schedule-manager.ts` |
| Schedule dispatch | `src/engine/schedules/schedule-dispatch.ts` |
| Coding progress | `src/engine/workers/coding-worker/events/` |
| Runtime telemetry | `src/core/telemetry/flue-telemetry.ts` |
| Capability runtime | `src/engine/capabilities/` |

## Related Documentation

- [Architecture Overview](overview.md)
- [Protocol System](protocol-system.md)
- [Worker System](worker-system.md)
- [Skill System](skill-system.md)
- [Retrieval And Research](retrieval-and-research.md)
- [Capability System](capability-system.md)
- [Registry System](registry-system.md)
