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
| `REL-RUNTIME-001` | One install-relative `.gorombo` runtime root for packaged artifacts and mutable state | Implemented and verified on the current branch across Node, CLI, Rust launcher, stores, scripts, package-owned assets/dependencies, persona loading, and worker metadata; product smoke copies the complete tree, launches from an unrelated working directory, and proves all state remains under the moved root | `implement-runtime-root-layout` | Required |
| `REL-CFG-001` | Canonical `sim-one.config` environment contract, tracked example, local build copy, packaged runtime loading, protocol-governed secret-safe Coding Worker assistance, and onboarding schema | Implemented and verified on the current branch: the typed registry and tracked example are complete, startup is canonical and authoritative, local builds copy the owner file mode `0600`, the relocated product smoke ignores HOME/cwd/shell conflicts, the public package excludes owner configuration and secret bytes, and the chat-scoped runtime configuration protocol plus Coding Worker tests prove redacted status, approval-gated user-supplied secret writes, denial behavior, and owner-only permissions. Installed owner-file creation remains part of `REL-ONB-001` | `implement-runtime-configuration-consolidation` | Required |
| `TUI-WORK-001` | Responsive right-side work pane with independently scrollable task checklist, usage and cost, Git state, and runtime status | Planned | `implement-sim-one-tui-work-pane` | Required |
| `REL-TUI-001` | Send-while-thinking TUI message queue with ordered settlement and visible queued state | Absent | `implement-tui-message-queue` | Required |
| `REL-TUI-002` | Two-row TUI status surface with authoritative context-left percentage | Absent | `implement-tui-status-context-meter` | Required |
| `REL-TUI-003` | Immediate caret movement for spaces plus a slim active prompt cursor | Current prompt behavior has unresolved caret/cursor defects | `implement-tui-prompt-editor-polish` | Required |
| `REL-TUI-004` | Persistent, separately labeled thinking and final-assistant transcript regions | Current release-test evidence reports thinking can share or lose the assistant render target | `implement-tui-thinking-transcript` | Required |
| `REL-APP-001` | Actionable approval controls in TUI and Telegram with connector-aware delivery | Approval routes exist; complete connector controls and outside-workspace scopes are absent | `implement-connector-approval-controls` | Required |
| `REL-WEB-001` | Web UI | Absent from the source checkout | `implement-product-delivery` | Required |
| `REL-DISCORD-001` | Discord connector | Absent from the source checkout | `implement-ingress-operations` | Required |
| `REL-TG-001` | Telegram unknown-user pairing request creation and delivery | Pending-pairing storage and approval routes exist; webhook creation/delivery is not wired | `implement-ingress-operations` | Required |
| `REL-TG-002` | Telegram `disabled` policy scope | The setting is named `dmPolicy`, but current ingress rejects both direct and group messages | `implement-ingress-operations` | Required |
| `REL-SEC-001` | Gateway ingress rate limiting | Authentication and validation exist; request throttling is not implemented | `implement-ingress-operations` | Required |
| `REL-CW-001` | Coding Worker file-edit approval enforcement | Workspace and sandbox boundaries exist; current write/patch tools do not call the approval service | `implement-file-access-approval-gate` | Required |
| `REL-CW-002` | Live Coding Worker checkpoint progress over active connectors | Event types and standalone reporter exist; the live Flue worker profile does not attach or forward them | `implement-coding-worker-progress` | Required |
| `REL-CW-003` | Complete fail-closed filesystem and shell containment with allow-once/session escalation | General shell, Git, and verification processes now run in a Bubblewrap namespace that excludes sibling owner runtime state and fails closed when isolation is unavailable. File-edit approval enforcement and allow-once/session escalation remain required | `implement-file-access-approval-gate` | Required |
| `REL-CW-004` | Owner-selected GitHub auth plus public anonymous clone and packaged TUI clone verification | D1 resolved to official GitHub MCP/PAT; read-only Flue ownership, approval-gated mutations, secret isolation, anonymous-first Git, and the full packaged product matrix are verified on the current branch. A live owner-PAT GitHub acceptance run remains a release-environment check | `implement-coding-worker-github-flow` | Required |
| `REL-CW-005` | Coding scaffold tooling with profile-owned Astro MCP, repository wrapper, and noninteractive post-scaffold checks | Identified by the sim-one.dev probe; absent | `implement-coding-worker-scaffold-tooling` | Required |
| `REL-CW-006` | Orchestrator verification of typed Coding Worker evidence under the owner-selected D4 boundary | D4 is open; no approved verification projection is implemented | `implement-orchestrator-worker-verification` | Required |
| `REL-CW-007` | Coding Worker capability authoring skills, scaffold/validation tools, and reproducible handoff for skills, tools, workers, and MCP packages | Five imported Flue authoring skills and protocol-gated classify/scaffold/validate/test/handoff tools are attached; focused fixtures cover every package kind and digest-bound test evidence | `implement-coding-worker-capability-authoring` | Required |
| `REL-SCH-001` | Scheduled trusted-event context handoff | Scheduled turns reach the orchestrator, but dispatch does not persist or pass the event id required by protocol and scoped-memory tools | `implement-ingress-operations` | Required |
| `REL-SCH-002` | Scheduled result persistence and user delivery | The manager records terminal status and errors but does not persist result content or deliver it through a connector | `implement-ingress-operations` | Required |
| `REL-CAP-001` | Reliable capability source version pinning | The shared lifecycle service resolves exact Git branch, tag, or commit versions; focused coverage proves tag selection and rollback | `implement-capabilities-security` | Required |
| `REL-CAP-002` | Dedicated capability-manager worker with shared CLI/agent lifecycle service and approval-gated runtime administration | The orchestrator delegates to `capability-manager`; direct mutation tools are removed; manager and CLI share the protocol-routed lifecycle service; relocated product CLI lifecycle verification passes for all four kinds | `implement-capability-management-worker` | Required |
| `REL-MCP-001` | In-place MCP connection updates | `sim-one mcp update` validates and changes connection URL, transport, canonical token-key name, display name, and description in place | `implement-capabilities-security` | Required |
| `REL-DOC-001` | Per-database document index with drop-folder ingest and governed retrieval | Planned; no release subsystem exists | `implement-document-index` | Required |
| `REL-IMG-001` | Dedicated image-reasoning worker with typed input, artifact, and verification contracts | Planned; current image generation is a tool rather than a reasoning worker | `implement-image-reasoning-worker` | Required |
| `REL-PROTO-001` | Complete release protocol policy records | Base records exist; release policy coverage remains incomplete | `implement-protocol-scoring` | Required |
| `REL-PROTO-002` | Fail-closed protocol enforcement before every reasoning, tool, delegation, and response path | Tool attachment and mandatory orchestration instructions exist; trusted pre-execution enforcement is not activated | `implement-protocol-scoring` | Required |
| `REL-PROTO-003` | Orchestrator/critic protocol scoring for every stage | Release enforcement integration remains incomplete | `implement-protocol-scoring` | Required |
| `REL-PROTO-004` | Sasser Theorem scoring contract, fixtures, thresholds, and release evaluation | Planned; no approved scoring specification or implementation exists | `implement-protocol-scoring` | Required |
| `REL-REL-001` | Release date | Set by `update-release-ledger` after verified publication and production observation | `update-release-ledger` | Required publication step |

## Graph Lineage

The repository owns the complete release lifecycle. `development-graph.json`
is the executable project plan; `specification-manifest.json`, `decisions.json`,
the `doc/` specification set, and this release ledger are its bound artifacts.
Implementation sequencing and file ownership live in
`doc/implementation-lineage.md`.

Historical loose plans may remain as reference evidence, but they are not
execution authority, are not graph inputs, and do not form a second scheduler.
Changes to release scope must update the repository specifications, this
ledger, and the canonical graph through a governed mutation before execution.

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
