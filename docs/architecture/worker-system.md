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
-> Orchestrator synthesis
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

The Coding Worker is a lead worker for repository tasks. It runs a bounded loop
with approval-gated Git and GitHub mutations:

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
operations, and schedules. Commit, push, and GitHub mutation tools pass through
the approval service. Current write and patch tools use workspace and sandbox
boundaries but do not call the approval service; that enforcement remains a
release gate. The model cannot create its own approval.

The Coding Worker also persists task checkpoints and uses structured task
memory, including notes, todos, and checklists, to maintain execution state
outside the prompt.

The Coding Worker's file APIs use a Flue Node local session rooted at
`<runtime-root>/workspace`. Shell, Git, and verification child processes run
inside a Bubblewrap mount and process namespace that exposes the workspace
read-write, the active Node and system runtime read-only, and a private
temporary directory. The rest of the owner runtime, including
`sim-one.config`, databases, approvals, and authentication state, is not
mounted. When the host has the supported Rust toolchain, Bubblewrap mounts its
executables and rustup toolchains read-only, uses a private writable
`CARGO_HOME`, and exposes only read-only Cargo registry and Git caches. A
private Git child may additionally receive a read-only, secret-free askpass
helper and dedicated owner-only token file described in
[GitHub Authentication](github-auth-system.md); repository hooks are disabled
for those bounded remote operations. An approved commit receives
the host's global Git author and committer identity as command-scoped
environment variables; the sandbox does not mount the host home or persist
that identity in the repository. Linux execution fails closed when Bubblewrap
is unavailable; there is no unrestricted fallback on another platform.

Repositories use `repos/<slug>`, non-repository projects use
`projects/<slug>`, and handoff artifacts may use `repos/handoffs/todos/`. The
worker verifies durable writes through that host-backed boundary and reports
workspace-relative paths. The main orchestrator does not expose Flue's generic
virtual filesystem or shell tools, so an ephemeral `/home/user` readback cannot
be reported as a durable product artifact.

For capability implementation, the Coding Worker owns imported Flue skills and
typed tools for classification, workspace-scoped scaffolding, contract
validation, secret and host-path scanning, bounded tests, and reproducible
handoff. These operations require the applicable Protocol Tool bundle.
Scaffolding requires file-edit approval. The worker cannot write the runtime
capability database or managed capability directories.

### Capability Manager

The `capability-manager` is the only built-in worker that owns
agent-requested runtime capability lifecycle operations. Its typed tools cover
list, inspect, validate, add, update, enable, disable, and remove. Validation
and mutations require a persisted normalized message `eventId`; trusted
application code reloads the applicable protocol bundle from SQLite instead of
accepting model-authored protocol rules. Mutations also require a current
matching approval decision.

The manager and authenticated `sim-one` CLI call the same typed lifecycle
service. The orchestrator routes requests and validates results but has no
direct capability mutation tools.

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

The configured capability directory defaults to
`<runtime-root>/capabilities/`.
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

The standalone Coding Worker loop defines structured progress events for:

- task admission and planning;
- subagent handoffs;
- tool execution;
- approval requests and decisions;
- verification results;
- replanning and review;
- Git and GitHub actions;
- completion or blocked outcomes.

That loop can return status, summary, plan, subagent results, verification
evidence, public events, artifacts, and a task checkpoint. The live Flue Coding
Worker profile currently constructs its tools without a reporter or task id,
so `coding_progress_emit` reports unavailable and those checkpoint events are
not forwarded to the active connector. Wiring the reporter into the live
profile and connector transport is a release gate. The orchestrator still
receives the Flue task result for final synthesis.

## Security Boundaries

Worker execution follows these rules:

1. The orchestrator selects the worker after protocol loading.
2. Trusted identity and project scope come from admitted runtime context.
3. Each worker receives only its attached capabilities.
4. Internal subagents remain private to their owning worker.
5. Sandbox and command policy constrain local execution.
6. Mutating actions require approval where policy demands it.
7. Progress and results remain observable.
8. The orchestrator performs final synthesis.

This separation prevents the same model context from both performing work and
acting as the final authority over that work.

The release contract adds complete protocol scoring and orchestrator/critic
validation across each returned result. That enforcement remains a release
gate.

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
| Capability manager | `src/engine/workers/capability-manager/` |
| Capability authoring | `src/engine/workers/coding-worker/capability-authoring/` |

## Related Documentation

- [Architecture Overview](overview.md)
- [Protocol System](protocol-system.md)
- [Skill System](skill-system.md)
- [Capability System](capability-system.md)
- [Execution Workflows](execution-workflows.md)
- [Retrieval And Research](retrieval-and-research.md)
