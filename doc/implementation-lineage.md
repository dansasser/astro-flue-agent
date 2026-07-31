# Release Implementation Lineage

`development-graph.json` is the executable project plan and lifecycle source of
truth. This repository artifact supplies the technical sequencing, ownership,
and acceptance detail consumed by the graph's `plan-implementation` node. It is
not a second scheduler, and external loose plans are not implementation
authority.

## Repository Planning Sources

- `development-graph.json` for dependencies, gates, evidence, invalidation, and
  release state.
- `specification-manifest.json` for specification and decision lineage.
- `decisions.json` and `doc/decisions/` for durable material choices.
- `doc/` specifications for product, architecture, acceptance, constraints, and
  open-question contracts.
- `docs/getting-started/pre-release-status.md` for stable 0.1.0 release IDs.

## Reconciled Release Members

| Release IDs | Graph member | Source |
| --- | --- | --- |
| `REL-RUNTIME-001` | `implement-runtime-root-layout` | D2 and runtime-root specifications |
| `REL-CFG-001` | `implement-runtime-configuration-consolidation` | D5 and runtime-configuration specifications |
| `REL-CW-001`, `REL-CW-003` | `implement-file-access-approval-gate` | D2, D3, structured-memory todo |
| `REL-CW-002` | `implement-coding-worker-progress` | worker-system release gap and checklist |
| `REL-CW-004` | `implement-coding-worker-github-flow` | D1 and GitHub/TUI checklist |
| `REL-CW-005` | `implement-coding-worker-scaffold-tooling` | sim-one.dev probe checklist |
| `REL-CW-006` | `implement-orchestrator-worker-verification` | D4 |
| `REL-CW-007` | `implement-coding-worker-capability-authoring` | capability authoring specification |
| `REL-TUI-001` | `implement-tui-message-queue` | structured-memory todo |
| `REL-TUI-002` | `implement-tui-status-context-meter` | structured-memory todo |
| `REL-TUI-003` | `implement-tui-prompt-editor-polish` | structured-memory cursor/caret todos |
| `REL-TUI-004` | `implement-tui-thinking-transcript` | structured-memory session note |
| `REL-APP-001` | `implement-connector-approval-controls` | D3 and TUI/Telegram approval todo |
| `REL-IMG-001` | `implement-image-reasoning-worker` | structured-memory todo |
| `REL-DOC-001` | `implement-document-index` | structured-memory todo |
| `REL-PROTO-001` through `REL-PROTO-004` | `implement-protocol-scoring` | pre-release ledger and structured-memory todo |
| `TUI-WORK-001` | `implement-sim-one-tui-work-pane` | SIM-ONE TUI work-pane graph member and repository release ledger |
| `REL-CAP-002` | `implement-capability-management-worker` | capability management specification |

## Decision Boundaries

- D1 is resolved to the official GitHub MCP/PAT and anonymous-first Git design;
  it is consumed by `implement-coding-worker-github-flow`.
- D2 is resolved and is consumed by runtime-root and workspace-dependent work.
- D3 is resolved and is consumed by file authorization and connector approval
  work.
- D4 remains open and blocks only
  `implement-orchestrator-worker-verification`.
- D5 is resolved and is consumed by runtime configuration, provider,
  connector, Coding Worker, onboarding, packaging, and delivery work.
- D6 is resolved to a slash-menu-style drop-up above the prompt. It is consumed
  by both the TUI status geometry and connector approval controls.

## TUI Status And Approval Sequence

1. `resolve-d6-tui-approval-surface-placement` records the selected drop-up
   above the prompt using the slash-command menu display pattern. It also
   records that no third status row is created.
2. `implement-tui-message-queue` remains the existing prerequisite for status
   geometry so queued-state reporting is included in the measured layout.
3. `implement-tui-status-context-meter` owns the first serialized changes to
   the Ratatui status view model, two-row geometry, authoritative context
   projection, and framebuffer/product tests.
4. `implement-connector-approval-controls` consumes the status artifact and
   owns the later serialized changes that add the approval client,
   slash-menu-style drop-up selector, explicit scope settlement, connector
   delivery, and packaged approval tests.
5. Shared Ratatui files such as `tui/ratatui/src/app.rs`,
   `tui/ratatui/src/ui.rs`, `tui/ratatui/tests/app_state.rs`, and
   `tui/ratatui/tests/ui_render.rs` are changed in graph order, never by
   parallel branches.
6. Backend approval types, ingress, routes, Telegram controls, and focused
   TypeScript tests belong to `implement-connector-approval-controls`; the
   status member may consume typed read-only projections but does not own
   approval authority.
7. Product verification must use the packaged `sim-one` launcher and prove
   two-row geometry plus deny, allow-once, and allow-for-session behavior from
   the rendered TUI.

## Runtime Configuration Sequence

1. `implement-core-contracts`, `implement-agent-runtime`,
   `implement-capabilities-security`, and `implement-ingress-operations`
   produce the shared contracts and current environment-sensitive consumers;
   the latter three consume D5 directly.
2. `implement-runtime-root-layout` establishes the movable location consumed by
   the canonical configuration member.
3. `implement-runtime-configuration-consolidation` serially creates the typed
   registry, source and runtime files, loader, build copy, consumer migration,
   and Coding Worker configuration boundary.
4. GitHub, Telegram/connector controls, onboarding, and product delivery
   consume the consolidated configuration change without parallel ownership.
5. Integration and product builds precede
   `verify-runtime-configuration-consolidation`, which proves completeness,
   relocation, redaction, approval, and release-secret exclusion.
6. Release packaging and clean-install onboarding verification consume the
   resulting D5 decision and verification evidence.

## Capability Management Sequence

1. `implement-capabilities-security` owns the underlying store,
   materialization, collision, source-version, MCP-update, and security
   contracts.
2. `implement-agent-runtime` owns the preceding shared Flue worker-registration
   and orchestrator-runtime foundation.
3. `implement-capability-management-worker` consumes both artifacts and D5,
   then serially owns `src/engine/workers/capability-manager/`, the shared
   lifecycle-service extraction, direct capability-tool routing removal from
   the orchestrator, CLI adaptation, and focused lifecycle tests.
4. `implement-coding-worker-scaffold-tooling` establishes the worker-owned
   documentation and generic scaffold helpers.
5. `implement-file-access-approval-gate` establishes the required source-write
   authorization boundary.
6. `implement-coding-worker-capability-authoring` consumes those artifacts,
   D2, D5, and the capability contracts, then serially owns Coding Worker
   capability-authoring skills, typed scaffold/validation/handoff tools,
   workspace guidance, and focused fixtures.
7. The Coding Worker authoring member cannot write runtime capability storage.
   Its output is source plus a typed handoff consumed operationally by
   `capability-manager`.
8. Both implementation artifacts join at `integrate-and-repair`; the normal
   typecheck, unit, documentation, build, CLI, HTTP, architecture/security, and
   packaged-product verification branches prove the combined workflow.
9. `capabilities.lifecycle-routing` binds both members to Protocol Tool output:
   manager validation/mutation and Coding Worker classification, validation,
   security checks, tests, packaging, and handoff all fail closed without the
   applicable bundle and retain redacted directive evidence.
10. Shared package validation parses exported Flue factory contracts without
    executing source, applies one credential and host-path scanner in both
    authoring and lifecycle paths, and returns executable updates to disabled
    state before they can be re-enabled.

Shared files are serialized by graph dependencies. The capability-manager
member follows `implement-agent-runtime` before changing orchestrator
registration. The Coding Worker authoring member follows scaffold tooling and
file-access approval before changing shared Coding Worker files.

## Planning Contract

The graph member `plan-implementation` produces this repository artifact. It
must assign every source, documentation, generated-definition, and test file to
one work member, serialize overlaps, map every release ID to behavioral
evidence, and consume every current resolved decision and required
specification. No external plan digest or plan directory is an execution
dependency.
