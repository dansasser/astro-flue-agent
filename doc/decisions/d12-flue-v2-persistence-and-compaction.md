# D12 Flue 2 Persistence History And Compaction

## Status

Resolved

## Context

Flue 2 uses a reset-only persistence format and removes the beta workflow and
session-store APIs that SIM-ONE previously wrapped. The Flue 2 public agent
surface provides durable `dispatch()` / `init()` admission, reattachable
`handle.read()`, conversation snapshots and updates, automatic main-agent
compaction, and explicit compaction only for a harness or named session.
It does not expose a public operation that manually compacts an idle root-agent
conversation by instance id.

SIM-ONE separately owns product session identity, connector persistence policy,
display names, normalized prompts, memory, tasks, and transcript presentation in
`sessions.sqlite`. Those product records must survive the framework reset. The
TUI must still start fresh by default, explicit resume must retain history, and
Telegram must retain its connector-owned persistent session.

## Decision

Flue 2 writes only to `<runtime-root>/db/flue-v2.sqlite`. The beta database at
`<runtime-root>/db/flue.sqlite` is an untouched rollback archive: Flue 2 startup,
normal operation, tests, cleanup, and packaging never open, migrate, truncate,
or delete it. Rolling back the package therefore restores the beta runtime
against its original database, while rolling forward resumes the separate Flue
2 database.

`<runtime-root>/db/sessions.sqlite` remains the authoritative SIM-ONE product
session database. Existing session ids, names, connector scopes, normalized
prompts, memory records, task state, and active Telegram pointers remain valid.
Beta-only Flue conversation bodies are not imported automatically into the
Flue 2 canonical stream. Existing SIM-ONE-owned prompt and memory records remain
available, while a Flue 2 user-visible transcript begins with the first Flue 2
generation unless a separately reviewed read-only importer is implemented.

Each product chat session owns one or more ordered Flue 2 runtime generations.
The first generation uses the product session id as its Flue instance id for
compatibility. Later generations use an opaque derived instance id while the
user-visible product session id and connector routing remain unchanged.
Transcript projection reads only the public Flue 2 history snapshot for each
generation and concatenates the generations in order.

`/compact` is an app-owned generation rotation implemented only with public
Flue 2 APIs:

1. Dispatch an internal application signal to the current orchestrator
   generation instructing it to produce a concise continuation summary.
2. Await that exact submission with `handle.read()` and persist the settled
   summary in `sessions.sqlite`.
3. Create the next runtime generation and store the summary as its creation
   context.
4. Inject that stored summary through the orchestrator's Flue 2 initial-data
   hook before the next user turn.
5. Keep prior generations immutable and available to transcript projection;
   hide the internal compaction signal and summary submission from normal chat
   rendering while exposing one completed compaction activity.

This operation is explicit, awaited, restart-safe at the product database
boundary, and does not recreate `FlueSession`, use runtime internals, mutate
Flue's canonical records, or pretend automatic threshold compaction handled the
user command.

## Consequences

- Product routes must resolve the active Flue runtime instance separately from
  the user-visible product session id.
- Chat admission and schedules use public `init().dispatch()` and
  `handle.read()` receipts, `instanceId`, `submissionId`, `uid`, and settlement
  outcomes.
- Transcript history and live streaming must consume Flue 2 snapshot/update
  projections, not beta event-stream records.
- The product database needs a generation table and an atomic compact-rotation
  operation.
- A failed summary submission leaves the current generation active and reports
  command failure; no partial generation becomes active.
- Documentation and packaging must identify both database paths and the
  rollback boundary.

## Affected Nodes

- `migrate-flue-v2-execution-persistence`
- `migrate-flue-v2-connectors-clients`
- `migrate-flue-v2-product-packaging`
- `migrate-flue-v2-documentation`
- `verify-release-reconciliation-specifications`
- `plan-implementation`
