# Session Persistence, Context Budget, And Compaction

## Storage Boundary

SIM-ONE Alpha keeps framework conversation state and product session state
separate:

| Store | Owner | Purpose |
| --- | --- | --- |
| `<runtime-root>/db/flue-v2.sqlite` | Flue 2 | Canonical agent instances, submissions, messages, snapshots, and updates |
| `<runtime-root>/db/flue.sqlite` | Flue beta archive | Read-never rollback archive retained unchanged during the migration |
| `<runtime-root>/db/sessions.sqlite` | SIM-ONE | Product session identity, names, ownership, active connector pointers, normalized events, generation mapping, memory indexes, and compaction summaries |

`src/db.ts` exports the Flue 2 SQLite adapter. Startup rejects configuration
that points the Flue 2 database at the beta database.

## Flue 2 Conversation Model

Normal chat uses the public agent-handle contract:

```text
handle = init(Orchestrator, { id: instanceId })
receipt = await handle.dispatch({ message, initialData?, idempotencyKey? })
reply = await handle.read(receipt, { onEvent?, signal? })
```

`dispatch()` is durable admission. `read()` waits for that exact submission's
settlement and can reattach after a process restart. Product code persists
`instanceId`, `submissionId`, and `uid` correlation in SIM-ONE-owned state.

Flue 2 conversation history is consumed through public snapshot and update
payloads. SIM-ONE normalizes those payloads in
`src/engine/session/flue-conversation.ts`; the TUI never reads either database
directly.

## Product Sessions And Generations

A user-visible product session owns one or more ordered Flue 2 runtime
generations. The first generation uses the product session id as its Flue
instance id. Later generations use derived opaque ids while the visible session
id, name, and connector ownership remain unchanged.

The product transcript concatenates visible content from those generations in
order. Internal compaction signals, nested worker results, and hidden advisory
messages are excluded from the public projection.

Default TUI startup creates a fresh product session. `--session` and
`/resume` resolve an exact owned id or explicit name. Telegram alone keeps an
active connector-conversation pointer until its session is changed or cleared.

## Context Budget

The selected project model card defines:

- provider/model specifier;
- advertised, guaranteed, and provider-reported context limits;
- output reserve;
- automatic compaction reserve and retained recent-token budget.

`src/engine/session/context-budget.ts` calculates the enforced context window,
usable input, warning threshold, compaction threshold, and hard stop.
`src/engine/session/session-budget.ts` derives history usage from public Flue 2
conversation snapshots and response metadata. When provider usage is absent, it
uses deterministic text/tool estimates.

The budget report is advisory application state for status display and RAG
packing. Flue 2 remains authoritative for model execution and automatic
compaction.

## Automatic Compaction

`Orchestrator` passes card-derived compaction settings to:

```text
useModel(modelSpecifier, {
  compaction: { reserveTokens, keepRecentTokens, model }
})
```

Flue may compact the active agent context at its threshold or during overflow
recovery. SIM-ONE records usage metadata with `useResponseFinish()` so later
budget projections can use provider-reported values.

## Explicit `/compact`

Flue 2 does not expose a public operation that manually compacts an idle root
agent instance. SIM-ONE therefore implements `/compact` as restart-safe product
generation rotation:

1. Dispatch a hidden `sim_one_compact` signal to the current generation.
2. Await the exact summary submission with `handle.read()`.
3. Persist the continuation summary and submission id in `sessions.sqlite`.
4. Atomically create the next generation.
5. Supply the summary as trusted `initialData` when the next generation first
   renders.
6. Preserve prior generations for transcript history while hiding the internal
   summary operation from normal chat rendering.

If the summary submission fails, the current generation remains active and no
partial generation is exposed.

## RAG Allocation

RAG and memory results must fit after system instructions, protocols, history,
the current message, and output reserve. The application retrieval functions
accept explicit context budgets and report truncated or omitted contexts.
Web search remains researcher-owned.

## Source Map

| Responsibility | Source |
| --- | --- |
| Flue adapter and database separation | `src/engine/session/session-persistence.ts` |
| Product sessions and generations | `src/engine/session/session-database.ts` |
| Agent dispatch/read | `src/engine/session/durable-orchestrator-session.ts` |
| Flue snapshot normalization | `src/engine/session/flue-conversation.ts` |
| Transcript projection | `src/engine/session/session-transcript.ts` |
| Context calculations | `src/engine/session/context-budget.ts` |
| Snapshot budget projection | `src/engine/session/session-budget.ts` |
| Explicit compaction route | `src/api/routes/chat-events.ts` |
| Decision record | `doc/decisions/d12-flue-v2-persistence-and-compaction.md` |
