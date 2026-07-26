# Pre-Release Status

SIM-ONE Alpha `0.1.0 Beta` is not published. This page separates behavior
available in the source checkout from release dependencies that must be
completed before the README installation and onboarding contract becomes
runnable.

## Available In Source

- Flue-based gateway and durable orchestrator sessions.
- SIM-ONE terminal interface and the `sim-one` launch command.
- `skill`, `tool`, `worker`, and `mcp` capability command families.
- SQLite capability, protocol, session, schedule, and structured-memory stores.
- Protocol Tool attachment, trusted-event rehydration, SQLite protocol lookup,
  and base protocol records.
- Memory/RAG, researcher and coding workers, schedules, approvals, Telegram,
  and app-owned HTTP routes.
- Source builds with equivalent npm and pnpm command paths.

## Release Gates

| Release dependency | Pre-release status |
| --- | --- |
| Release archive, `sim-one.sh`, and checksums | Not published |
| Integrity-verified packaged installation | Awaits versioned release assets |
| Packaged onboarding interface and `sim-one install` | Unavailable in the current CLI |
| `sim-one config`, `doctor`, `status`, `start`, `restart`, and `stop` | Unavailable in the current CLI |
| Web UI | Absent from the source checkout |
| Discord connector | Absent from the source checkout |
| Telegram unknown-user pairing request creation and delivery | Pending-pairing storage and approval routes exist; webhook creation/delivery is not wired |
| Telegram `disabled` policy scope | The setting is named `dmPolicy`, but current ingress rejects both direct and group messages |
| Gateway ingress rate limiting | Authentication and validation exist; request throttling is not implemented |
| Coding Worker file-edit approval enforcement | Workspace and sandbox boundaries exist; current write/patch tools do not call the approval service |
| Live Coding Worker checkpoint progress over active connectors | Event types and standalone reporter exist; the live Flue worker profile does not attach or forward them |
| Scheduled trusted-event context handoff | Scheduled turns reach the orchestrator, but dispatch does not persist or pass the event id required by protocol and scoped-memory tools |
| Reliable capability source version pinning | `--version` is stored, but current materialization shallow-clones the remote default branch and cannot reliably select another branch, tag, or commit |
| In-place MCP connection updates | `mcp update` changes only `updated_at`; connection, name, and description changes require remove and re-add |
| Complete release protocol policy records | Base records exist; release policy coverage remains incomplete |
| Fail-closed protocol enforcement before every reasoning, tool, delegation, and response path | Tool attachment and mandatory orchestration instructions exist; trusted pre-execution enforcement is not activated |
| Orchestrator/critic protocol scoring for every stage | Release enforcement integration remains incomplete |
| Release date | Set when `0.1.0 Beta` is published |

## Protocol Boundary

The protocol architecture is present. `src/agents/orchestrator.ts` attaches
`load_protocols`; chat ingress requires the tool before answering; the tool
rehydrates a persisted trusted event and derives protected selectors from that
event; and the SQLite provider returns enabled matching records. Base records
cover global protocol loading, delegation, chat, coding verification, approval,
and progress behavior.

This does not yet equal complete release enforcement. The remaining release
work is to author the full policy set and activate a trusted fail-closed
pre-execution boundary so a model cannot bypass protocol loading by answering,
calling another tool, or delegating first. Documentation therefore describes
the implemented path separately from the enforcement contract required for
publication.

## Release Contract

At publication, a version-pinned and checksum-verified installer opens
onboarding, collects provider and integration credentials, validates the
gateway with a real model response, and enters the first secure terminal
session. Connector pairing follows from that authenticated session.

Until those release gates are complete, use
[Build From Source](installation.md#build-from-source) and treat package-only
commands as unavailable.
