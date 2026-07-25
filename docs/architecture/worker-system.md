# Worker System

SIM-ONE Alpha uses workers as governed specialist executors. The main
orchestrator decides when work should be delegated, supplies the applicable
protocols and trusted context, and evaluates the returned evidence before a
response or action is accepted.

Workers are internal subsystems of SIM-ONE Alpha. They are not standalone
products, public endpoints, or independent authorities.

## Runtime Flow

```text
Admitted event
-> Orchestrator
-> Protocol and context loading
-> Worker selection
-> Flue child session
-> Worker tools, skills, and internal subagents
-> Structured result and progress events
-> Orchestrator/critic validation
-> Response, revision, or rejection
```

The orchestrator remains between the user-facing connector and every worker.
A worker performs the delegated task, but it does not admit the original
request, redefine the active protocol bundle, or approve its own result.

## Flue Worker Profiles

Each worker is a Flue subagent profile with a distinct execution context. A
profile can own:

- workspace instructions;
- a selected model;
- tools;
- skills;
- internal subagents;
- compaction settings;
- a sandbox and working directory.

Delegation opens a child session under the orchestrator's run. This keeps a
worker's working context separate while preserving the parent-child execution
relationship and the orchestrator's final review boundary.

## Built-In Workers

### Researcher

The Researcher performs source-backed web research. It owns the
`web_research` tool and returns evidence that includes source URLs, retrieved
context, confidence, cache statistics, budget use, and provider failures.

The orchestrator can decide that current or source-backed information is
needed, but web research is delegated to the Researcher. The orchestrator does
not directly own the web-search path.

### Coding Worker

The Coding Worker is a lead worker for repository tasks. It runs a bounded,
approval-gated loop:

```text
Triage
-> Plan
-> Implement
-> Verify and debug
-> Review
-> Git and GitHub actions when requested
-> Structured completion result
```

The worker owns the tools needed for repository inspection, code intelligence,
planning, task memory, file changes, verification, Git operations, GitHub
operations, and schedules. Mutating actions pass through the approval service.
The model cannot create its own approval.

The Coding Worker also persists task checkpoints and uses structured task
memory, including notes, todos, and checklists, to maintain execution state
outside the prompt.

## Internal Coding Subagents

The Coding Worker coordinates five worker-local profiles:

| Profile | Responsibility |
| --- | --- |
| Triage | Classify the task, inspect the repository, and establish the plan |
| Implementer | Produce scoped file edits |
| Test/Debug | Run verification, diagnose failures, and propose corrections |
| Code Review | Evaluate correctness, regressions, risk, and missing tests |
| GitHub | Prepare and execute approved repository publication actions |

These profiles are private to the Coding Worker. They are not registered as
top-level orchestrator workers and cannot be selected directly by a connector
or user request.

## Worker Skills And Tools

A worker's profile defines the capabilities available inside its execution
boundary:

- tools execute typed operations;
- skills provide repeatable process guidance;
- internal subagents divide specialist responsibilities;
- workspace files define the worker's persona and operating instructions.

Possessing a tool does not grant unconditional authority to use it. Trusted
event scope, active protocols, command policy, sandbox boundaries, and approval
records still apply.

## Runtime-Added Workers

Workers can also be installed through the runtime capability system. A
runtime-added worker is stored in the capability registry and materialized
under:

```text
<configured-capability-directory>/workers/<id>/
```

The configured capability directory defaults to `~/.gorombo/capabilities/`.
`GOROMBO_CAPABILITIES_DIR` overrides it; `GOROMBO_CAPABILITY_DIR` is the
fallback override.

Installed workers are disabled until explicitly enabled. At startup, enabled
worker records are validated and attached through the same Flue subagent
surface as built-in workers. Invalid or unavailable records are reported as
capability load failures rather than silently exposed.

Runtime installation does not bypass the orchestrator. Added workers remain
delegated executors under the same protocol, progress, trust, and validation
boundaries.

## Progress And Results

Long-running worker activity emits structured progress events for:

- task admission and planning;
- subagent handoffs;
- tool execution;
- approval requests and decisions;
- verification results;
- replanning and review;
- Git and GitHub actions;
- completion or blocked outcomes.

The Coding Worker returns a structured result containing status, summary,
plan, subagent results, verification evidence, public events, artifacts, and a
task checkpoint when applicable. The orchestrator/critic uses that evidence to
accept, revise, redelegate, or reject the result.

## Security Boundaries

Worker execution follows these rules:

1. The orchestrator selects the worker after protocol loading.
2. Trusted identity and project scope come from admitted runtime context.
3. Each worker receives only its attached capabilities.
4. Internal subagents remain private to their owning worker.
5. Sandbox and command policy constrain local execution.
6. Mutating actions require approval where policy demands it.
7. Progress and results remain observable.
8. The orchestrator/critic performs final validation.

This separation prevents the same model context from both performing work and
acting as the final authority over that work.

## Source Map

| Area | Source |
| --- | --- |
| Orchestrator registration | `src/agents/orchestrator.ts` |
| Researcher profile | `src/engine/workers/researcher/researcher.ts` |
| Coding Worker lead | `src/engine/workers/coding-worker/coding-worker.ts` |
| Internal coding profiles | `src/engine/workers/coding-worker/subagents/` |
| Worker skills | `src/engine/workers/coding-worker/skills/` |
| Coding execution loop | `src/engine/workers/coding-worker/workflow/` |
| Approval service | `src/engine/workers/coding-worker/approvals/` |
| Progress events | `src/engine/workers/coding-worker/events/` |
| Runtime worker loading | `src/engine/capabilities/worker-loader.ts` |

## Related Documentation

- [Architecture Overview](overview.md)
- [Protocol System](protocol-system.md)
- [Skill System](skill-system.md)
- [Capability System](capability-system.md)
- [Execution Workflows](execution-workflows.md)
- [Retrieval And Research](retrieval-and-research.md)
