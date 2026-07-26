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

These identifiers are the stable release contract used by
`development-graph.json`. Every item is required for `0.1.0 Beta`. Changing
that scope requires a new explicit owner decision and graph revision; there is
no per-run deferral path.

| ID | Release dependency | Pre-release status | Graph owner | Scope |
| --- | --- | --- | --- | --- |
| `REL-PKG-001` | Release archive, `sim-one.sh`, and checksums | Not published | `implement-sim-one-onboarding-distribution` | Required |
| `REL-PKG-002` | Integrity-verified packaged installation | Awaits versioned release assets | `implement-sim-one-onboarding-distribution` | Required |
| `REL-ONB-001` | Packaged onboarding interface and `sim-one install` | Unavailable in the current CLI | `implement-sim-one-onboarding-distribution` | Required |
| `REL-OPS-001` | `sim-one config`, `doctor`, `status`, `start`, `restart`, and `stop` | Unavailable in the current CLI | `implement-sim-one-onboarding-distribution` | Required |
| `TUI-WORK-001` | Responsive right-side work pane with independently scrollable task checklist, usage and cost, Git state, and runtime status | Planned | `implement-sim-one-tui-work-pane` | Required |
| `REL-WEB-001` | Web UI | Absent from the source checkout | `implement-product-delivery` | Required |
| `REL-DISCORD-001` | Discord connector | Absent from the source checkout | `implement-ingress-operations` | Required |
| `REL-TG-001` | Telegram unknown-user pairing request creation and delivery | Pending-pairing storage and approval routes exist; webhook creation/delivery is not wired | `implement-ingress-operations` | Required |
| `REL-TG-002` | Telegram `disabled` policy scope | The setting is named `dmPolicy`, but current ingress rejects both direct and group messages | `implement-ingress-operations` | Required |
| `REL-SEC-001` | Gateway ingress rate limiting | Authentication and validation exist; request throttling is not implemented | `implement-ingress-operations` | Required |
| `REL-CW-001` | Coding Worker file-edit approval enforcement | Workspace and sandbox boundaries exist; current write/patch tools do not call the approval service | `implement-capabilities-security` | Required |
| `REL-CW-002` | Live Coding Worker checkpoint progress over active connectors | Event types and standalone reporter exist; the live Flue worker profile does not attach or forward them | `implement-agent-runtime` | Required |
| `REL-SCH-001` | Scheduled trusted-event context handoff | Scheduled turns reach the orchestrator, but dispatch does not persist or pass the event id required by protocol and scoped-memory tools | `implement-ingress-operations` | Required |
| `REL-SCH-002` | Scheduled result persistence and user delivery | The manager records terminal status and errors but does not persist result content or deliver it through a connector | `implement-ingress-operations` | Required |
| `REL-CAP-001` | Reliable capability source version pinning | `--version` is stored, but current materialization shallow-clones the remote default branch and cannot reliably select another branch, tag, or commit | `implement-capabilities-security` | Required |
| `REL-MCP-001` | In-place MCP connection updates | `mcp update` changes only `updated_at`; connection, name, and description changes require remove and re-add | `implement-capabilities-security` | Required |
| `REL-PROTO-001` | Complete release protocol policy records | Base records exist; release policy coverage remains incomplete | `implement-capabilities-security` | Required |
| `REL-PROTO-002` | Fail-closed protocol enforcement before every reasoning, tool, delegation, and response path | Tool attachment and mandatory orchestration instructions exist; trusted pre-execution enforcement is not activated | `implement-capabilities-security` | Required |
| `REL-PROTO-003` | Orchestrator/critic protocol scoring for every stage | Release enforcement integration remains incomplete | `implement-agent-runtime` | Required |
| `REL-REL-001` | Release date | Set by `release-production` when `0.1.0 Beta` is published | `release-production` | Required publication step |

## Plan Lineage

The repository owns the stable release IDs, current status, graph ownership,
acceptance requirements, and delivery lineage above. Detailed working plans
remain in the mandatory external plan directory:

- SIM-ONE TUI plan:
  `/opt/ai/plans/sim-one-ratatui-tui/plan.md`
- SIM-ONE TUI work-pane addendum:
  `/opt/ai/plans/sim-one-ratatui-tui/work-pane-addendum.md`
- Product build and runtime structure:
  `/opt/ai/plans/sim-one-build-structure/plan.md`
- Onboarding and distribution research and implementation detail:
  `/opt/ai/plans/agent-tui/plan.md`

The external files are source plans, not release status. Changes to their scope
must update this ledger and the canonical development graph before execution.

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
