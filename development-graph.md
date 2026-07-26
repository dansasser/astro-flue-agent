<!-- development-graph-sha256: c8dfec0a0aed3e8ab0abee3a816691e25537e20307a53496592d8b1bfe33b4ea -->
<!-- Generated from canonical JSON. Do not edit by hand. -->
# SIM-ONE Alpha Development Lifecycle

Govern future SIM-ONE Alpha changes from an authorized request through grounded design, parallel domain implementation, full project verification, approval-gated release, output-level canary and production observation, and bounded repair.

## Graph metadata

| Field | Value |
|---|---|
| Graph ID | `sim-one-alpha-lifecycle` |
| Graph version | `33` |
| Schema version | `1` |
| Status | `validated` |
| Project | sim-one-alpha |
| Project root | `/opt/ai/sim-one-alpha` |
| Context version | `snapshot:sha256:618a856c6a6fe054934a0db457566722105ab4a78d1bb9f32e1a6848113d3600` |
| Templates | discovery-to-delivery, parallel-fanout-fanin, human-gate, bounded-feedback, rollback-observation |
| Entry nodes | baseline-context |
| Terminal nodes | closeout-release |
| Canonical checksum | `c8dfec0a0aed3e8ab0abee3a816691e25537e20307a53496592d8b1bfe33b4ea` |

## Flow

```mermaid
flowchart TD
    n_baseline_context[["Bind Change To Current Project Context\\n(operation / planned)"]]
    n_install_dependencies[["Install Pinned Dependencies\\n(operation / planned)"]]
    n_fetch_embedding_model[["Fetch Bundled Embedding Model\\n(operation / planned)"]]
    n_build_wasm_memory[["Build Rust Memory WASM\\n(operation / planned)"]]
    n_define_change_contract["Define Purpose And Acceptance Contract\\n(work / planned)"]
    n_approve_beta_release_contract{{"Approve 0.1.0 Beta Release Contract\\n(human_gate / planned)"}}
    n_decide_architecture{"Resolve Architecture And Ownership\\n(decision / planned)"}
    n_plan_implementation["Plan Bounded Implementation\\n(work / planned)"]
    n_implement_core_contracts["Implement Core Contracts And Architecture\\n(work / planned)"]
    n_implement_agent_runtime["Implement Agent Runtime And Workspace Boundaries\\n(work / planned)"]
    n_implement_memory_retrieval["Implement Memory, RAG, And Embeddings\\n(work / planned)"]
    n_implement_capabilities_security["Implement Capabilities, Registries, And Security\\n(work / planned)"]
    n_implement_ingress_operations["Implement Ingress, Sessions, Schedules, And Telemetry\\n(work / planned)"]
    n_implement_sim_one_tui_work_pane["Implement SIM-ONE TUI Work Pane\\n(work / planned)"]
    n_implement_sim_one_onboarding_distribution["Implement SIM-ONE Onboarding And Distribution\\n(work / planned)"]
    n_implement_product_delivery["Implement Product Surfaces And Delivery\\n(work / planned)"]
    n_integrate_and_repair["Integrate Change And Apply Bounded Repairs\\n(work / planned)"]
    n_verify_typecheck(["Verify TypeScript Types\\n(verification / planned)"])
    n_verify_documentation(["Verify Production Documentation\\n(verification / planned)"])
    n_verify_unit_tests(["Verify Unit Test Suite\\n(verification / planned)"])
    n_verify_rust_tests(["Verify Rust Project Tests\\n(verification / planned)"])
    n_build_runtime(["Build Flue Runtime\\n(verification / planned)"])
    n_build_sim_one_tui(["Build SIM-ONE TUI\\n(verification / planned)"])
    n_build_cli(["Build SIM-ONE CLI\\n(verification / planned)"])
    n_build_release_package(["Build Versioned Release Package\\n(verification / planned)"])
    n_verify_cli_behavior(["Verify CLI Behavior\\n(verification / planned)"])
    n_verify_http_integration(["Verify Built HTTP Runtime\\n(verification / planned)"])
    n_verify_sim_one_tui(["Verify Packaged SIM-ONE TUI\\n(verification / planned)"])
    n_verify_onboarding_distribution(["Verify SIM-ONE Onboarding And Distribution\\n(verification / planned)"])
    n_verify_tui_e2e(["Verify Gateway And CLI Smoke\\n(verification / planned)"])
    n_verify_memory_smoke(["Verify Real Memory Runtime\\n(verification / planned)"])
    n_aggregate_verification(["Aggregate Verification Evidence\\n(verification / planned)"])
    n_review_architecture_security(["Review Architecture, Security, And Product Boundaries\\n(verification / planned)"])
    n_approve_release_candidate{{"Approve Release Candidate Publication\\n(human_gate / planned)"}}
    n_publish_release_candidate[["Publish And Merge Release Candidate\\n(operation / planned)"]]
    n_approve_canary{{"Approve Canary Deployment\\n(human_gate / planned)"}}
    n_deploy_canary[["Deploy Approved Canary\\n(operation / planned)"]]
    n_verify_canary_behavior(["Verify Canary Behavior\\n(observation / planned)"])
    n_approve_production_release{{"Approve Release Assets And Production\\n(human_gate / planned)"}}
    n_stage_release_assets[["Stage Approved Release Assets Privately\\n(operation / planned)"]]
    n_verify_staged_release_assets(["Verify Private Staged Release Assets\\n(verification / planned)"])
    n_release_production[["Release Approved Candidate\\n(operation / planned)"]]
    n_observe_production(["Observe Production Outcomes\\n(observation / planned)"])
    n_publish_release_assets[["Publish Verified Assets After Production\\n(operation / planned)"]]
    n_prepare_release_ledger_update["Prepare Release Ledger Update\\n(work / planned)"]
    n_approve_release_ledger_update{{"Approve Release Ledger Update\\n(human_gate / planned)"}}
    n_update_release_ledger[["Update Verified Release Ledger\\n(operation / planned)"]]
    n_closeout_release["Close Out And Preserve Evidence\\n(work / planned)"]
    n_baseline_context -- "consumes" --> n_install_dependencies
    n_install_dependencies -- "consumes" --> n_fetch_embedding_model
    n_install_dependencies -- "consumes" --> n_build_wasm_memory
    n_baseline_context -- "consumes" --> n_define_change_contract
    n_baseline_context -- "consumes" --> n_approve_beta_release_contract
    n_define_change_contract -- "consumes" --> n_approve_beta_release_contract
    n_baseline_context -- "consumes" --> n_decide_architecture
    n_approve_beta_release_contract -- "consumes" --> n_decide_architecture
    n_define_change_contract -- "consumes" --> n_decide_architecture
    n_define_change_contract -- "consumes" --> n_plan_implementation
    n_decide_architecture -- "consumes" --> n_plan_implementation
    n_approve_beta_release_contract -- "consumes" --> n_plan_implementation
    n_approve_beta_release_contract -- "consumes" --> n_implement_agent_runtime
    n_approve_beta_release_contract -- "consumes" --> n_implement_capabilities_security
    n_approve_beta_release_contract -- "consumes" --> n_implement_ingress_operations
    n_approve_beta_release_contract -- "consumes" --> n_implement_sim_one_tui_work_pane
    n_approve_beta_release_contract -- "approves" --> n_implement_sim_one_tui_work_pane
    n_approve_beta_release_contract -- "consumes" --> n_implement_sim_one_onboarding_distribution
    n_approve_beta_release_contract -- "approves" --> n_implement_sim_one_onboarding_distribution
    n_approve_beta_release_contract -- "consumes" --> n_implement_product_delivery
    n_plan_implementation -- "consumes" --> n_implement_core_contracts
    n_implement_core_contracts -- "consumes" --> n_integrate_and_repair
    n_plan_implementation -- "consumes" --> n_implement_agent_runtime
    n_implement_agent_runtime -- "consumes" --> n_integrate_and_repair
    n_plan_implementation -- "consumes" --> n_implement_memory_retrieval
    n_implement_memory_retrieval -- "consumes" --> n_integrate_and_repair
    n_plan_implementation -- "consumes" --> n_implement_capabilities_security
    n_implement_capabilities_security -- "consumes" --> n_integrate_and_repair
    n_plan_implementation -- "consumes" --> n_implement_ingress_operations
    n_implement_ingress_operations -- "consumes" --> n_integrate_and_repair
    n_plan_implementation -- "consumes" --> n_implement_sim_one_tui_work_pane
    n_plan_implementation -- "consumes" --> n_implement_sim_one_onboarding_distribution
    n_plan_implementation -- "consumes" --> n_build_release_package
    n_plan_implementation -- "consumes" --> n_implement_product_delivery
    n_implement_sim_one_tui_work_pane -- "consumes" --> n_implement_product_delivery
    n_implement_sim_one_onboarding_distribution -- "consumes" --> n_implement_product_delivery
    n_implement_product_delivery -- "consumes" --> n_integrate_and_repair
    n_install_dependencies -- "consumes" --> n_integrate_and_repair
    n_fetch_embedding_model -- "consumes" --> n_integrate_and_repair
    n_build_wasm_memory -- "consumes" --> n_integrate_and_repair
    n_integrate_and_repair -- "consumes" --> n_verify_typecheck
    n_integrate_and_repair -- "consumes" --> n_verify_documentation
    n_integrate_and_repair -- "consumes" --> n_verify_unit_tests
    n_integrate_and_repair -- "consumes" --> n_verify_rust_tests
    n_integrate_and_repair -- "consumes" --> n_build_runtime
    n_verify_typecheck -- "consumes" --> n_build_runtime
    n_verify_unit_tests -- "consumes" --> n_build_runtime
    n_verify_rust_tests -- "consumes" --> n_build_runtime
    n_integrate_and_repair -- "consumes" --> n_build_sim_one_tui
    n_build_runtime -- "consumes" --> n_build_sim_one_tui
    n_integrate_and_repair -- "consumes" --> n_build_cli
    n_build_runtime -- "consumes" --> n_build_cli
    n_build_cli -- "consumes" --> n_verify_cli_behavior
    n_build_runtime -- "consumes" --> n_verify_cli_behavior
    n_build_sim_one_tui -- "consumes" --> n_verify_cli_behavior
    n_build_runtime -- "consumes" --> n_verify_http_integration
    n_build_runtime -- "consumes" --> n_verify_sim_one_tui
    n_approve_beta_release_contract -- "consumes" --> n_verify_sim_one_tui
    n_publish_release_candidate -- "consumes" --> n_build_release_package
    n_build_runtime -- "consumes" --> n_build_release_package
    n_build_sim_one_tui -- "consumes" --> n_build_release_package
    n_build_cli -- "consumes" --> n_build_release_package
    n_approve_beta_release_contract -- "consumes" --> n_build_release_package
    n_integrate_and_repair -- "consumes" --> n_verify_onboarding_distribution
    n_build_release_package -- "consumes" --> n_verify_onboarding_distribution
    n_build_runtime -- "consumes" --> n_verify_onboarding_distribution
    n_build_sim_one_tui -- "consumes" --> n_verify_onboarding_distribution
    n_build_cli -- "consumes" --> n_verify_onboarding_distribution
    n_approve_beta_release_contract -- "consumes" --> n_verify_onboarding_distribution
    n_build_sim_one_tui -- "consumes" --> n_verify_sim_one_tui
    n_build_cli -- "consumes" --> n_verify_sim_one_tui
    n_build_runtime -- "consumes" --> n_verify_tui_e2e
    n_build_cli -- "consumes" --> n_verify_tui_e2e
    n_build_runtime -- "consumes" --> n_verify_memory_smoke
    n_build_wasm_memory -- "consumes" --> n_verify_memory_smoke
    n_fetch_embedding_model -- "consumes" --> n_verify_memory_smoke
    n_verify_typecheck -- "consumes" --> n_aggregate_verification
    n_verify_documentation -- "consumes" --> n_aggregate_verification
    n_verify_unit_tests -- "consumes" --> n_aggregate_verification
    n_verify_rust_tests -- "consumes" --> n_aggregate_verification
    n_build_runtime -- "consumes" --> n_aggregate_verification
    n_verify_sim_one_tui -- "consumes" --> n_aggregate_verification
    n_verify_cli_behavior -- "consumes" --> n_aggregate_verification
    n_verify_http_integration -- "consumes" --> n_aggregate_verification
    n_verify_tui_e2e -- "consumes" --> n_aggregate_verification
    n_verify_memory_smoke -- "consumes" --> n_aggregate_verification
    n_integrate_and_repair -- "consumes" --> n_review_architecture_security
    n_aggregate_verification -- "consumes" --> n_review_architecture_security
    n_aggregate_verification -- "consumes" --> n_approve_release_candidate
    n_review_architecture_security -- "consumes" --> n_approve_release_candidate
    n_review_architecture_security -- "consumes" --> n_publish_release_candidate
    n_approve_release_candidate -- "approves" --> n_publish_release_candidate
    n_approve_release_candidate -- "consumes" --> n_publish_release_candidate
    n_publish_release_candidate -- "consumes" --> n_approve_canary
    n_publish_release_candidate -- "consumes" --> n_deploy_canary
    n_approve_canary -- "approves" --> n_deploy_canary
    n_approve_canary -- "consumes" --> n_deploy_canary
    n_deploy_canary -- "consumes" --> n_verify_canary_behavior
    n_publish_release_candidate -- "consumes" --> n_approve_production_release
    n_build_release_package -- "consumes" --> n_approve_production_release
    n_verify_canary_behavior -- "consumes" --> n_approve_production_release
    n_verify_onboarding_distribution -- "consumes" --> n_approve_production_release
    n_publish_release_candidate -- "consumes" --> n_stage_release_assets
    n_build_release_package -- "consumes" --> n_stage_release_assets
    n_verify_onboarding_distribution -- "consumes" --> n_stage_release_assets
    n_approve_production_release -- "approves" --> n_stage_release_assets
    n_approve_production_release -- "consumes" --> n_stage_release_assets
    n_stage_release_assets -- "consumes" --> n_verify_staged_release_assets
    n_publish_release_candidate -- "consumes" --> n_release_production
    n_verify_canary_behavior -- "consumes" --> n_release_production
    n_verify_staged_release_assets -- "consumes" --> n_release_production
    n_approve_production_release -- "approves" --> n_release_production
    n_approve_production_release -- "consumes" --> n_release_production
    n_release_production -- "consumes" --> n_observe_production
    n_stage_release_assets -- "consumes" --> n_publish_release_assets
    n_verify_staged_release_assets -- "consumes" --> n_publish_release_assets
    n_release_production -- "consumes" --> n_publish_release_assets
    n_observe_production -- "consumes" --> n_publish_release_assets
    n_approve_production_release -- "approves" --> n_publish_release_assets
    n_approve_production_release -- "consumes" --> n_publish_release_assets
    n_publish_release_assets -- "consumes" --> n_prepare_release_ledger_update
    n_release_production -- "consumes" --> n_prepare_release_ledger_update
    n_observe_production -- "consumes" --> n_prepare_release_ledger_update
    n_publish_release_assets -- "consumes" --> n_approve_release_ledger_update
    n_prepare_release_ledger_update -- "consumes" --> n_approve_release_ledger_update
    n_release_production -- "consumes" --> n_approve_release_ledger_update
    n_observe_production -- "consumes" --> n_approve_release_ledger_update
    n_approve_release_ledger_update -- "approves" --> n_update_release_ledger
    n_approve_release_ledger_update -- "consumes" --> n_update_release_ledger
    n_prepare_release_ledger_update -- "consumes" --> n_update_release_ledger
    n_publish_release_assets -- "consumes" --> n_update_release_ledger
    n_release_production -- "consumes" --> n_update_release_ledger
    n_observe_production -- "consumes" --> n_update_release_ledger
    n_publish_release_candidate -- "consumes" --> n_closeout_release
    n_update_release_ledger -- "consumes" --> n_closeout_release
    n_observe_production -- "consumes" --> n_closeout_release
    n_verify_typecheck -. "feedback <= 3" .-> n_integrate_and_repair
    n_build_release_package -. "feedback <= 3" .-> n_integrate_and_repair
    n_verify_documentation -. "feedback <= 3" .-> n_integrate_and_repair
    n_verify_unit_tests -. "feedback <= 3" .-> n_integrate_and_repair
    n_verify_rust_tests -. "feedback <= 3" .-> n_integrate_and_repair
    n_build_runtime -. "feedback <= 3" .-> n_integrate_and_repair
    n_build_sim_one_tui -. "feedback <= 3" .-> n_integrate_and_repair
    n_verify_sim_one_tui -. "feedback <= 3" .-> n_integrate_and_repair
    n_verify_onboarding_distribution -. "feedback <= 3" .-> n_integrate_and_repair
    n_build_cli -. "feedback <= 3" .-> n_integrate_and_repair
    n_verify_cli_behavior -. "feedback <= 3" .-> n_integrate_and_repair
    n_verify_http_integration -. "feedback <= 3" .-> n_integrate_and_repair
    n_verify_tui_e2e -. "feedback <= 3" .-> n_integrate_and_repair
    n_verify_memory_smoke -. "feedback <= 3" .-> n_integrate_and_repair
    n_aggregate_verification -. "feedback <= 3" .-> n_integrate_and_repair
    n_review_architecture_security -. "feedback <= 3" .-> n_integrate_and_repair
    n_verify_canary_behavior -. "feedback <= 2" .-> n_integrate_and_repair
    n_observe_production -. "feedback <= 1" .-> n_integrate_and_repair
    n_verify_http_integration -. "conflicts" .-> n_verify_sim_one_tui
    n_verify_cli_behavior -. "conflicts" .-> n_verify_http_integration
    n_verify_cli_behavior -. "conflicts" .-> n_verify_sim_one_tui
    n_verify_sim_one_tui -. "conflicts" .-> n_verify_onboarding_distribution
    n_verify_cli_behavior -. "conflicts" .-> n_verify_onboarding_distribution
    n_verify_http_integration -. "conflicts" .-> n_verify_onboarding_distribution
    n_verify_tui_e2e -. "conflicts" .-> n_verify_onboarding_distribution
    n_verify_memory_smoke -. "conflicts" .-> n_verify_onboarding_distribution
    n_verify_cli_behavior -. "conflicts" .-> n_verify_tui_e2e
    n_verify_cli_behavior -. "conflicts" .-> n_verify_memory_smoke
    n_verify_http_integration -. "conflicts" .-> n_verify_tui_e2e
    n_verify_http_integration -. "conflicts" .-> n_verify_memory_smoke
    n_verify_sim_one_tui -. "conflicts" .-> n_verify_tui_e2e
    n_verify_sim_one_tui -. "conflicts" .-> n_verify_memory_smoke
    n_verify_tui_e2e -. "conflicts" .-> n_verify_memory_smoke
    n_baseline_context -. "invalidates" .-> n_define_change_contract
    n_baseline_context -. "invalidates" .-> n_approve_beta_release_contract
    n_define_change_contract -. "invalidates" .-> n_approve_beta_release_contract
    n_define_change_contract -. "invalidates" .-> n_decide_architecture
    n_decide_architecture -. "invalidates" .-> n_plan_implementation
    n_approve_beta_release_contract -. "invalidates" .-> n_decide_architecture
    n_approve_beta_release_contract -. "invalidates" .-> n_plan_implementation
    n_plan_implementation -. "invalidates" .-> n_implement_core_contracts
    n_plan_implementation -. "invalidates" .-> n_implement_agent_runtime
    n_plan_implementation -. "invalidates" .-> n_implement_memory_retrieval
    n_plan_implementation -. "invalidates" .-> n_implement_capabilities_security
    n_plan_implementation -. "invalidates" .-> n_implement_ingress_operations
    n_plan_implementation -. "invalidates" .-> n_implement_product_delivery
    n_plan_implementation -. "invalidates" .-> n_implement_sim_one_tui_work_pane
    n_plan_implementation -. "invalidates" .-> n_implement_sim_one_onboarding_distribution
    n_plan_implementation -. "invalidates" .-> n_build_release_package
    n_implement_sim_one_tui_work_pane -. "invalidates" .-> n_implement_product_delivery
    n_implement_sim_one_onboarding_distribution -. "invalidates" .-> n_implement_product_delivery
    n_integrate_and_repair -. "invalidates" .-> n_verify_typecheck
    n_integrate_and_repair -. "invalidates" .-> n_verify_documentation
    n_integrate_and_repair -. "invalidates" .-> n_verify_unit_tests
    n_integrate_and_repair -. "invalidates" .-> n_verify_rust_tests
    n_integrate_and_repair -. "invalidates" .-> n_verify_onboarding_distribution
    n_integrate_and_repair -. "invalidates" .-> n_verify_sim_one_tui
    n_approve_production_release -- "approves" --> n_observe_production
    n_approve_production_release -- "consumes" --> n_observe_production
```

## Nodes

| ID | Type | State | Executor | Goal | Outputs |
|---|---|---|---|---|---|
| `baseline-context` | `operation` | `planned` | agent: SIM-ONE project context adapter | Bind one authorized change request to the current SIM-ONE Alpha commit, applicable instructions, exact external beta source-plan digests, architecture contracts, affected domains, and external-effect boundaries. | artifact:baseline-context |
| `install-dependencies` | `operation` | `planned` | deterministic: pnpm frozen installer | Prepare the Node 22 and pnpm dependency tree from the committed lockfile without changing dependency intent. | artifact:dependency-environment |
| `fetch-embedding-model` | `operation` | `planned` | deterministic: SIM-ONE embedding model fetcher | Materialize the pinned local ONNX embedding model and tokenizer assets required by embedding and RAG verification. | artifact:embedding-model-assets |
| `build-wasm-memory` | `operation` | `planned` | deterministic: SIM-ONE wasm-pack builder | Compile the Rust structured-memory engine to the Node-compatible WASM artifact required by real memory execution. | artifact:memory-wasm |
| `define-change-contract` | `work` | `planned` | agent: SIM-ONE planning adapter | Turn the authorized request into a project-specific purpose, scope, non-goals, evidence plan, permission boundary, rollback, and user-visible progress contract. | artifact:change-contract, artifact:affected-domain-map |
| `approve-beta-release-contract` | `human_gate` | `planned` | human: SIM-ONE project owner | Bind the fixed owner decision that every remaining release item, the SIM-ONE TUI work pane, and the exact external source-plan digest manifest are required for 0.1.0 Beta before architecture and implementation planning. | artifact:beta-release-contract |
| `decide-architecture` | `decision` | `planned` | agent: SIM-ONE architecture adapter | Choose the smallest design that satisfies the change contract while preserving SIM-ONE Alpha domain ownership and Flue architecture. | artifact:architecture-decision |
| `plan-implementation` | `work` | `planned` | agent: SIM-ONE implementation planning adapter | After proving the external source plans still match the owner-approved digest manifest, produce an executable implementation sequence with file ownership, artifact handoffs, progress events, verification commands, approval scopes, and rollback. | artifact:implementation-plan |
| `implement-core-contracts` | `work` | `planned` | agent: SIM-ONE Coding Worker lead | Implement authorized changes to shared types, Valibot schemas, protocols, model cards, configuration, architecture contracts, and Flue-discovered entrypoints. | artifact:core-contracts-change |
| `implement-agent-runtime` | `work` | `planned` | agent: SIM-ONE Coding Worker lead | Implement authorized main-orchestrator, workflow, tool, skill, built-in lead-worker, worker-local internal-subagent, and persona-workspace changes while treating company-owned system instructions as read-only, preserving delegation ownership and capability isolation, and keeping the Coding Worker runtime access root separate. | artifact:agent-runtime-change |
| `implement-memory-retrieval` | `work` | `planned` | agent: SIM-ONE Coding Worker lead | Implement authorized structured memory, session memory, document indexing, knowledge storage, retrieval routing, embeddings, and Rust/WASM changes while keeping memory layers distinct. | artifact:memory-retrieval-change |
| `implement-capabilities-security` | `work` | `planned` | agent: SIM-ONE Coding Worker lead | Implement authorized capability-store, registry, MCP, approval, GitHub-auth, and policy enforcement changes with fail-closed trust boundaries. | artifact:capabilities-security-change |
| `implement-ingress-operations` | `work` | `planned` | agent: SIM-ONE Coding Worker lead | Implement authorized connector normalization, authenticated API routes, connector-specific session policy, fresh and explicit-resume TUI lifecycle, durable transcript projection, schedules, and typed progress/telemetry surfaces. | artifact:ingress-operations-change |
| `implement-sim-one-tui-work-pane` | `work` | `planned` | agent: SIM-ONE Coding Worker lead | Implement the responsive SIM-ONE TUI work pane for tasks, usage and cost, Git state, and runtime status without regressing transcript or prompt interaction. | artifact:sim-one-tui-work-pane-change |
| `implement-sim-one-onboarding-distribution` | `work` | `planned` | agent: SIM-ONE Coding Worker lead | Implement versioned SIM-ONE packaging, integrity-verified installation, packaged onboarding, configuration, diagnostics, and local or service-managed lifecycle commands. | artifact:sim-one-onboarding-distribution-change |
| `implement-product-delivery` | `work` | `planned` | agent: SIM-ONE Coding Worker lead | Integrate authorized SIM-ONE product surfaces, shared build and CI contracts, Web UI scope, and release documentation after the TUI and onboarding workstreams while preserving capability-management subcommands. | artifact:product-delivery-change |
| `integrate-and-repair` | `work` | `planned` | hybrid: SIM-ONE Coding Worker integration adapter | Combine selected domain outputs into one coherent change set, resolve cross-domain contract issues, and apply bounded repairs from verification or observation evidence. | artifact:integrated-change |
| `verify-typecheck` | `verification` | `planned` | deterministic: Verify TypeScript Types | Prove the full TypeScript project satisfies its configured no-emit type contract. | artifact:typecheck-report |
| `verify-documentation` | `verification` | `planned` | deterministic: Verify Production Documentation | Run the repository's deterministic documentation contract across root release documents, docs, and OpenWiki: local links and anchors, architecture index coverage, production TUI terminology, README section order, prohibited roadmap-style current-state language, resolvable architecture and OpenWiki source references, Markdown fence and H1 structure, and a reproducible documentation snapshot. | artifact:documentation-verification-report |
| `verify-unit-tests` | `verification` | `planned` | deterministic: Verify Unit Test Suite | Run the configured SIM-ONE Alpha unit suite with real local embedding assets and WASM available, including agent/workspace ownership, approval/progress routing, connector-scoped session lifecycle, durable transcript projection, product artifact locking, memory scoping, and telemetry-redaction contracts. | artifact:unit-test-report |
| `verify-rust-tests` | `verification` | `planned` | deterministic: Verify Rust Project Tests | Run the configured Rust project tests for the memory engine and Rust TUI crates. | artifact:rust-test-report |
| `build-runtime` | `verification` | `planned` | deterministic: Build Flue Runtime | Build the Node-target SIM-ONE Alpha Flue runtime and copy configuration, imported built-in Flue skills, registries, persona workspaces, and memory WASM into the product artifact. | artifact:runtime-build |
| `build-sim-one-tui` | `verification` | `planned` | deterministic: Build SIM-ONE TUI | Build the release-mode SIM-ONE TUI binary and copy it into the product artifact. | artifact:sim-one-tui-build |
| `build-cli` | `verification` | `planned` | deterministic: Build SIM-ONE CLI | Build the TypeScript sim-one command launcher and capability-management CLI that selects the packaged SIM-ONE TUI by default. | artifact:cli-build |
| `build-release-package` | `verification` | `planned` | hybrid: SIM-ONE release package build adapter | Rebuild the exact typed versioned SIM-ONE release package and checksum manifest from the immutable merged main-branch candidate consumed by pre-publication verification and approved GitHub release publication. | artifact:release-package |
| `verify-cli-behavior` | `verification` | `planned` | deterministic: Verify CLI Behavior | Prove the packaged sim-one launcher exposes its documented command surface and delegates startup to the built SIM-ONE TUI product path. | artifact:cli-behavior-report |
| `verify-http-integration` | `verification` | `planned` | deterministic: Verify Built HTTP Runtime | Exercise the built HTTP server routes, authentication boundaries, connector-scoped session lifecycle, durable transcript projection, and chat/runtime behavior. | artifact:http-test-report |
| `verify-sim-one-tui` | `verification` | `planned` | deterministic: Verify Packaged SIM-ONE TUI | Prove the packaged sim-one command launches the SIM-ONE TUI, manages fresh and resumed sessions, restores durable transcripts, preserves terminal interaction, submits a real prompt, and renders the authoritative assistant response. | artifact:sim-one-tui-product-report |
| `verify-onboarding-distribution` | `verification` | `planned` | hybrid: SIM-ONE packaged onboarding verification adapter | Prove the versioned SIM-ONE release candidate installs with integrity, onboards from a clean user environment, manages its runtime, and launches the finished product without a source checkout before publication. | artifact:onboarding-distribution-report |
| `verify-tui-e2e` | `verification` | `planned` | deterministic: Verify Gateway And CLI Smoke | Exercise the direct built-gateway model path and built CLI help surface without treating this narrow smoke as packaged SIM-ONE TUI end-to-end evidence. | artifact:tui-e2e-report |
| `verify-memory-smoke` | `verification` | `planned` | deterministic: Verify Real Memory Runtime | Exercise the real WASM memory engine, SQLite durability, retrieval, and Coding Worker memory path end to end. | artifact:memory-smoke-report |
| `aggregate-verification` | `verification` | `planned` | hybrid: SIM-ONE verification aggregator | Map fresh pre-merge project verification evidence to the candidate contract, preserve explicit mandatory post-merge package and onboarding gates, and identify any unproved behavior, skipped requirement, or stale artifact. | artifact:verification-summary |
| `review-architecture-security` | `verification` | `planned` | agent: SIM-ONE review adapter | Review the integrated change and verification summary for Flue ownership, instruction and persona workspace boundaries, Coding Worker runtime-root scope, trusted context, approval gates, durable progress, product identity, secret boundaries, and release-document accuracy, clarity, and scanability. | artifact:architecture-security-review |
| `approve-release-candidate` | `human_gate` | `planned` | human: SIM-ONE project owner | Let the project owner approve or reject the exact diff, verification summary, architecture/security review, commit, pull request, required-check, merge, main-readback, rollback, and GitHub effects. | artifact:release-candidate-approval |
| `publish-release-candidate` | `operation` | `planned` | hybrid: approval-gated Git and GitHub adapter | Commit the authorized change, push its branch, open and verify a non-draft pull request to main, merge it only after required checks pass, and prove the immutable candidate exists on main. | artifact:release-candidate |
| `approve-canary` | `human_gate` | `planned` | human: SIM-ONE project owner | Let the project owner approve the exact release candidate, canary target, probe plan, rollback, and observation window. | artifact:canary-approval |
| `deploy-canary` | `operation` | `planned` | hybrid: project-specific deployment adapter | Deploy the exact approved release candidate to the declared canary environment with idempotency fencing and a concrete rollback path. | artifact:canary-deployment |
| `verify-canary-behavior` | `observation` | `planned` | hybrid: SIM-ONE canary probe adapter | Prove the canary produces correct user-visible and system-visible behavior across gateway, orchestrator, protocols, memory, workers, progress, and changed product surfaces. | artifact:canary-behavior-report |
| `approve-production-release` | `human_gate` | `planned` | human: SIM-ONE project owner | Let the project owner approve or reject the exact private asset stage, production release, and post-observation public release using the candidate, canary behavior, rollback, and production observation plan. | artifact:production-release-approval |
| `stage-release-assets` | `operation` | `planned` | hybrid: approval-gated private GitHub release staging adapter | Stage the exact approved SIM-ONE release archive, installer entrypoint, and checksums in a private GitHub draft that cannot be discovered or downloaded publicly before production succeeds. | artifact:staged-release-assets |
| `verify-staged-release-assets` | `verification` | `planned` | hybrid: private staged SIM-ONE release asset verification adapter | Prove the approved private draft assets are inaccessible anonymously but authenticated-downloadable, integrity-verifiable, installable, and runnable without a source checkout. | artifact:staged-release-assets-report |
| `release-production` | `operation` | `planned` | hybrid: project-specific production deployment adapter | Release the exact approved candidate to the declared production target with idempotency fencing and recorded rollback. | artifact:production-release |
| `observe-production` | `observation` | `planned` | hybrid: SIM-ONE production observation adapter | Verify correct production behavior and durable target-system outcomes through the approved observation window. | artifact:production-observation |
| `publish-release-assets` | `operation` | `planned` | hybrid: post-production approval-gated GitHub release publication adapter | After successful production observation, expose the exact privately verified assets under the approved immutable tag and prove the resulting public GitHub release without changing staged bytes. | artifact:published-release-assets-report |
| `prepare-release-ledger-update` | `work` | `planned` | hybrid: non-mutating release ledger proposal adapter | Produce the exact immutable release-ledger diff that the owner can approve and the repository updater can apply without authoring new content after approval. | artifact:release-ledger-proposal |
| `approve-release-ledger-update` | `human_gate` | `planned` | human: SIM-ONE project owner | Let the project owner approve or reject the exact repository mutation that records the successfully published 0.1.0 Beta release. | artifact:release-ledger-update-approval |
| `update-release-ledger` | `operation` | `planned` | hybrid: approval-gated release ledger repository adapter | Record the verified 0.1.0 Beta publication in the repository-owned release ledger through an exact, separately approved, and independently verified GitHub mutation. | artifact:release-ledger-update |
| `closeout-release` | `work` | `planned` | agent: SIM-ONE release closeout adapter | Record the shipped outcome, exact commit and PR/release references, verification and observation evidence, remaining risks, rollback, and follow-up work. | artifact:release-closeout |

## Edges

| ID | From | Type | To | Condition | Artifacts | Bound / exit |
|---|---|---|---|---|---|---|
| `baseline-to-install` | `baseline-context` | `consumes` | `install-dependencies` | Upstream artifacts are current, accepted, and bound to this run. | artifact:baseline-context | — |
| `install-to-embedding-model` | `install-dependencies` | `consumes` | `fetch-embedding-model` | Upstream artifacts are current, accepted, and bound to this run. | artifact:dependency-environment | — |
| `install-to-wasm-build` | `install-dependencies` | `consumes` | `build-wasm-memory` | Upstream artifacts are current, accepted, and bound to this run. | artifact:dependency-environment | — |
| `baseline-to-change-contract` | `baseline-context` | `consumes` | `define-change-contract` | Upstream artifacts are current, accepted, and bound to this run. | artifact:baseline-context | — |
| `baseline-to-beta-release-contract` | `baseline-context` | `consumes` | `approve-beta-release-contract` | The current source state, release ledger, and exact external source-plan digest manifest are bound to the same authorized run. | artifact:baseline-context | — |
| `contract-to-beta-release-contract` | `define-change-contract` | `consumes` | `approve-beta-release-contract` | The requested change and affected domains are explicit enough to bind the fixed 0.1.0 Beta contract. | artifact:change-contract, artifact:affected-domain-map | — |
| `context-and-contract-to-architecture` | `baseline-context` | `consumes` | `decide-architecture` | Upstream artifacts are current, accepted, and bound to this run. | artifact:baseline-context | — |
| `beta-release-contract-to-architecture` | `approve-beta-release-contract` | `consumes` | `decide-architecture` | The owner has approved every stable release and planned-work ID as required for 0.1.0 Beta. | artifact:beta-release-contract | — |
| `contract-to-architecture` | `define-change-contract` | `consumes` | `decide-architecture` | Upstream artifacts are current, accepted, and bound to this run. | artifact:change-contract, artifact:affected-domain-map | — |
| `contract-to-implementation-plan` | `define-change-contract` | `consumes` | `plan-implementation` | Upstream artifacts are current, accepted, and bound to this run. | artifact:change-contract | — |
| `architecture-to-implementation-plan` | `decide-architecture` | `consumes` | `plan-implementation` | Upstream artifacts are current, accepted, and bound to this run. | artifact:architecture-decision | — |
| `beta-release-contract-to-implementation-plan` | `approve-beta-release-contract` | `consumes` | `plan-implementation` | The fixed owner-approved 0.1.0 Beta contract and external source-plan digest manifest are current and bound to this run. | artifact:beta-release-contract | — |
| `beta-release-contract-to-implement-agent-runtime` | `approve-beta-release-contract` | `consumes` | `implement-agent-runtime` | The owner-approved release requirements assigned to the agent-runtime lane are current. | artifact:beta-release-contract | — |
| `beta-release-contract-to-implement-capabilities-security` | `approve-beta-release-contract` | `consumes` | `implement-capabilities-security` | The owner-approved release requirements assigned to the capabilities and security lane are current. | artifact:beta-release-contract | — |
| `beta-release-contract-to-implement-ingress-operations` | `approve-beta-release-contract` | `consumes` | `implement-ingress-operations` | The owner-approved connector, schedule, and ingress release requirements are current. | artifact:beta-release-contract | — |
| `beta-release-contract-to-implement-sim-one-tui-work-pane` | `approve-beta-release-contract` | `consumes` | `implement-sim-one-tui-work-pane` | The required TUI work-pane contract is current and bound to this run. | artifact:beta-release-contract | — |
| `beta-release-contract-approves-sim-one-tui-work-pane` | `approve-beta-release-contract` | `approves` | `implement-sim-one-tui-work-pane` | The owner authorizes entering the bounded TUI work-pane mutation scope; every individual repository write remains fail-closed on a current Coding Worker approval-service decision. | artifact:beta-release-contract | — |
| `beta-release-contract-to-implement-sim-one-onboarding-distribution` | `approve-beta-release-contract` | `consumes` | `implement-sim-one-onboarding-distribution` | The owner-approved packaging, onboarding, and lifecycle release requirements are current. | artifact:beta-release-contract | — |
| `beta-release-contract-approves-sim-one-onboarding-distribution` | `approve-beta-release-contract` | `approves` | `implement-sim-one-onboarding-distribution` | The owner authorizes entering the bounded onboarding and distribution mutation scope; every individual repository write remains fail-closed on a current Coding Worker approval-service decision. | artifact:beta-release-contract | — |
| `beta-release-contract-to-implement-product-delivery` | `approve-beta-release-contract` | `consumes` | `implement-product-delivery` | The owner-approved product-surface and release-document requirements are current. | artifact:beta-release-contract | — |
| `plan-to-implement-core-contracts` | `plan-implementation` | `consumes` | `implement-core-contracts` | Upstream artifacts are current, accepted, and bound to this run. | artifact:implementation-plan | — |
| `implement-core-contracts-to-integration` | `implement-core-contracts` | `consumes` | `integrate-and-repair` | Upstream artifacts are current, accepted, and bound to this run. | artifact:core-contracts-change | — |
| `plan-to-implement-agent-runtime` | `plan-implementation` | `consumes` | `implement-agent-runtime` | Upstream artifacts are current, accepted, and bound to this run. | artifact:implementation-plan | — |
| `implement-agent-runtime-to-integration` | `implement-agent-runtime` | `consumes` | `integrate-and-repair` | Upstream artifacts are current, accepted, and bound to this run. | artifact:agent-runtime-change | — |
| `plan-to-implement-memory-retrieval` | `plan-implementation` | `consumes` | `implement-memory-retrieval` | Upstream artifacts are current, accepted, and bound to this run. | artifact:implementation-plan | — |
| `implement-memory-retrieval-to-integration` | `implement-memory-retrieval` | `consumes` | `integrate-and-repair` | Upstream artifacts are current, accepted, and bound to this run. | artifact:memory-retrieval-change | — |
| `plan-to-implement-capabilities-security` | `plan-implementation` | `consumes` | `implement-capabilities-security` | Upstream artifacts are current, accepted, and bound to this run. | artifact:implementation-plan | — |
| `implement-capabilities-security-to-integration` | `implement-capabilities-security` | `consumes` | `integrate-and-repair` | Upstream artifacts are current, accepted, and bound to this run. | artifact:capabilities-security-change | — |
| `plan-to-implement-ingress-operations` | `plan-implementation` | `consumes` | `implement-ingress-operations` | Upstream artifacts are current, accepted, and bound to this run. | artifact:implementation-plan | — |
| `implement-ingress-operations-to-integration` | `implement-ingress-operations` | `consumes` | `integrate-and-repair` | Upstream artifacts are current, accepted, and bound to this run. | artifact:ingress-operations-change | — |
| `plan-to-implement-sim-one-tui-work-pane` | `plan-implementation` | `consumes` | `implement-sim-one-tui-work-pane` | The implementation plan assigns disjoint files for the required TUI work-pane member. | artifact:implementation-plan | — |
| `plan-to-implement-sim-one-onboarding-distribution` | `plan-implementation` | `consumes` | `implement-sim-one-onboarding-distribution` | The implementation plan assigns disjoint onboarding and distribution files. | artifact:implementation-plan | — |
| `plan-to-release-package-build` | `plan-implementation` | `consumes` | `build-release-package` | The implementation plan declares the exact packaging argv, output paths, file ownership, and verification bindings for the release-package build. | artifact:implementation-plan | — |
| `plan-to-implement-product-delivery` | `plan-implementation` | `consumes` | `implement-product-delivery` | Upstream artifacts are current, accepted, and bound to this run. | artifact:implementation-plan | — |
| `sim-one-tui-work-pane-to-product-delivery` | `implement-sim-one-tui-work-pane` | `consumes` | `implement-product-delivery` | The required TUI work-pane output is complete. | artifact:sim-one-tui-work-pane-change | — |
| `sim-one-onboarding-distribution-to-product-delivery` | `implement-sim-one-onboarding-distribution` | `consumes` | `implement-product-delivery` | The onboarding and distribution output is complete and ready for product integration. | artifact:sim-one-onboarding-distribution-change | — |
| `implement-product-delivery-to-integration` | `implement-product-delivery` | `consumes` | `integrate-and-repair` | Upstream artifacts are current, accepted, and bound to this run. | artifact:product-delivery-change | — |
| `dependencies-to-integration` | `install-dependencies` | `consumes` | `integrate-and-repair` | Upstream artifacts are current, accepted, and bound to this run. | artifact:dependency-environment | — |
| `embedding-model-to-integration` | `fetch-embedding-model` | `consumes` | `integrate-and-repair` | Upstream artifacts are current, accepted, and bound to this run. | artifact:embedding-model-assets | — |
| `wasm-to-integration` | `build-wasm-memory` | `consumes` | `integrate-and-repair` | Upstream artifacts are current, accepted, and bound to this run. | artifact:memory-wasm | — |
| `integration-to-verify-typecheck` | `integrate-and-repair` | `consumes` | `verify-typecheck` | Upstream artifacts are current, accepted, and bound to this run. | artifact:integrated-change | — |
| `integration-to-verify-documentation` | `integrate-and-repair` | `consumes` | `verify-documentation` | Upstream artifacts are current, accepted, and bound to this run. | artifact:integrated-change | — |
| `integration-to-verify-unit-tests` | `integrate-and-repair` | `consumes` | `verify-unit-tests` | Upstream artifacts are current, accepted, and bound to this run. | artifact:integrated-change | — |
| `integration-to-verify-rust-tests` | `integrate-and-repair` | `consumes` | `verify-rust-tests` | Upstream artifacts are current, accepted, and bound to this run. | artifact:integrated-change | — |
| `integration-to-runtime-build` | `integrate-and-repair` | `consumes` | `build-runtime` | Upstream artifacts are current, accepted, and bound to this run. | artifact:integrated-change | — |
| `typecheck-to-runtime-build` | `verify-typecheck` | `consumes` | `build-runtime` | Upstream artifacts are current, accepted, and bound to this run. | artifact:typecheck-report | — |
| `unit-tests-to-runtime-build` | `verify-unit-tests` | `consumes` | `build-runtime` | Upstream artifacts are current, accepted, and bound to this run. | artifact:unit-test-report | — |
| `rust-tests-to-runtime-build` | `verify-rust-tests` | `consumes` | `build-runtime` | Upstream artifacts are current, accepted, and bound to this run. | artifact:rust-test-report | — |
| `integration-to-sim-one-tui-build` | `integrate-and-repair` | `consumes` | `build-sim-one-tui` | Upstream artifacts are current, accepted, and bound to this run. | artifact:integrated-change | — |
| `runtime-to-sim-one-tui-build` | `build-runtime` | `consumes` | `build-sim-one-tui` | Upstream artifacts are current, accepted, and bound to this run. | artifact:runtime-build | — |
| `integration-to-cli-build` | `integrate-and-repair` | `consumes` | `build-cli` | Upstream artifacts are current, accepted, and bound to this run. | artifact:integrated-change | — |
| `runtime-to-cli-build` | `build-runtime` | `consumes` | `build-cli` | Upstream artifacts are current, accepted, and bound to this run. | artifact:runtime-build | — |
| `cli-build-to-cli-behavior` | `build-cli` | `consumes` | `verify-cli-behavior` | Upstream artifacts are current, accepted, and bound to this run. | artifact:cli-build | — |
| `runtime-to-cli-behavior` | `build-runtime` | `consumes` | `verify-cli-behavior` | Upstream artifacts are current, accepted, and bound to this run. | artifact:runtime-build | — |
| `sim-one-tui-build-to-cli-behavior` | `build-sim-one-tui` | `consumes` | `verify-cli-behavior` | Upstream artifacts are current, accepted, and bound to this run. | artifact:sim-one-tui-build | — |
| `runtime-to-http-tests` | `build-runtime` | `consumes` | `verify-http-integration` | Upstream artifacts are current, accepted, and bound to this run. | artifact:runtime-build | — |
| `runtime-to-sim-one-tui-product` | `build-runtime` | `consumes` | `verify-sim-one-tui` | Upstream artifacts are current, accepted, and bound to this run. | artifact:runtime-build | — |
| `beta-release-contract-to-verify-sim-one-tui` | `approve-beta-release-contract` | `consumes` | `verify-sim-one-tui` | The required TUI work-pane contract is current and bound to the packaged-product probe. | artifact:beta-release-contract | — |
| `merged-candidate-to-release-package-build` | `publish-release-candidate` | `consumes` | `build-release-package` | The candidate pull request has passed required checks, merged to main, and been read back as the immutable source of the release-package build. | artifact:release-candidate | — |
| `runtime-to-release-package-build` | `build-runtime` | `consumes` | `build-release-package` | The reviewed packaged runtime is current and included in the exact versioned release package. | artifact:runtime-build | — |
| `sim-one-tui-to-release-package-build` | `build-sim-one-tui` | `consumes` | `build-release-package` | The reviewed packaged SIM-ONE TUI is current and included in the exact versioned release package. | artifact:sim-one-tui-build | — |
| `cli-to-release-package-build` | `build-cli` | `consumes` | `build-release-package` | The reviewed sim-one command and platform launchers are current and included in the exact versioned release package. | artifact:cli-build | — |
| `beta-release-contract-to-release-package-build` | `approve-beta-release-contract` | `consumes` | `build-release-package` | The fixed 0.1.0 Beta packaging and integrity contract is current and bound to the release-package build. | artifact:beta-release-contract | — |
| `integration-to-verify-onboarding-distribution` | `integrate-and-repair` | `consumes` | `verify-onboarding-distribution` | The integrated product includes the required onboarding and distribution contract. | artifact:integrated-change | — |
| `release-package-to-verify-onboarding-distribution` | `build-release-package` | `consumes` | `verify-onboarding-distribution` | The exact typed versioned archive, sim-one.sh entrypoint, checksum manifest, paths, sizes, modes, and digests are current and bound to the isolated onboarding probe. | artifact:release-package | — |
| `runtime-to-verify-onboarding-distribution` | `build-runtime` | `consumes` | `verify-onboarding-distribution` | The packaged runtime is current and bound to the onboarding candidate. | artifact:runtime-build | — |
| `sim-one-tui-build-to-verify-onboarding-distribution` | `build-sim-one-tui` | `consumes` | `verify-onboarding-distribution` | The packaged TUI is current and available to the installer and first-run flow. | artifact:sim-one-tui-build | — |
| `cli-build-to-verify-onboarding-distribution` | `build-cli` | `consumes` | `verify-onboarding-distribution` | The packaged CLI is current and exposes the required onboarding and lifecycle commands. | artifact:cli-build | — |
| `beta-release-contract-to-verify-onboarding-distribution` | `approve-beta-release-contract` | `consumes` | `verify-onboarding-distribution` | The required packaging, onboarding, and lifecycle contract is current and bound to the isolated probe. | artifact:beta-release-contract | — |
| `sim-one-tui-build-to-product-test` | `build-sim-one-tui` | `consumes` | `verify-sim-one-tui` | Upstream artifacts are current, accepted, and bound to this run. | artifact:sim-one-tui-build | — |
| `cli-build-to-sim-one-tui-product` | `build-cli` | `consumes` | `verify-sim-one-tui` | Upstream artifacts are current, accepted, and bound to this run. | artifact:cli-build | — |
| `runtime-to-tui-e2e` | `build-runtime` | `consumes` | `verify-tui-e2e` | Upstream artifacts are current, accepted, and bound to this run. | artifact:runtime-build | — |
| `cli-build-to-tui-e2e` | `build-cli` | `consumes` | `verify-tui-e2e` | Upstream artifacts are current, accepted, and bound to this run. | artifact:cli-build | — |
| `runtime-to-memory-smoke` | `build-runtime` | `consumes` | `verify-memory-smoke` | Upstream artifacts are current, accepted, and bound to this run. | artifact:runtime-build | — |
| `wasm-to-memory-smoke` | `build-wasm-memory` | `consumes` | `verify-memory-smoke` | Upstream artifacts are current, accepted, and bound to this run. | artifact:memory-wasm | — |
| `embedding-model-to-memory-smoke` | `fetch-embedding-model` | `consumes` | `verify-memory-smoke` | Upstream artifacts are current, accepted, and bound to this run. | artifact:embedding-model-assets | — |
| `verify-typecheck-to-verification-summary` | `verify-typecheck` | `consumes` | `aggregate-verification` | Upstream artifacts are current, accepted, and bound to this run. | artifact:typecheck-report | — |
| `verify-documentation-to-verification-summary` | `verify-documentation` | `consumes` | `aggregate-verification` | Upstream artifacts are current, accepted, and bound to this run. | artifact:documentation-verification-report | — |
| `verify-unit-tests-to-verification-summary` | `verify-unit-tests` | `consumes` | `aggregate-verification` | Upstream artifacts are current, accepted, and bound to this run. | artifact:unit-test-report | — |
| `verify-rust-tests-to-verification-summary` | `verify-rust-tests` | `consumes` | `aggregate-verification` | Upstream artifacts are current, accepted, and bound to this run. | artifact:rust-test-report | — |
| `build-runtime-to-verification-summary` | `build-runtime` | `consumes` | `aggregate-verification` | Upstream artifacts are current, accepted, and bound to this run. | artifact:runtime-build | — |
| `verify-sim-one-tui-to-verification-summary` | `verify-sim-one-tui` | `consumes` | `aggregate-verification` | Upstream artifacts are current, accepted, and bound to this run. | artifact:sim-one-tui-product-report | — |
| `verify-cli-behavior-to-verification-summary` | `verify-cli-behavior` | `consumes` | `aggregate-verification` | Upstream artifacts are current, accepted, and bound to this run. | artifact:cli-behavior-report | — |
| `verify-http-integration-to-verification-summary` | `verify-http-integration` | `consumes` | `aggregate-verification` | Upstream artifacts are current, accepted, and bound to this run. | artifact:http-test-report | — |
| `verify-tui-e2e-to-verification-summary` | `verify-tui-e2e` | `consumes` | `aggregate-verification` | Upstream artifacts are current, accepted, and bound to this run. | artifact:tui-e2e-report | — |
| `verify-memory-smoke-to-verification-summary` | `verify-memory-smoke` | `consumes` | `aggregate-verification` | Upstream artifacts are current, accepted, and bound to this run. | artifact:memory-smoke-report | — |
| `integration-to-architecture-review` | `integrate-and-repair` | `consumes` | `review-architecture-security` | Upstream artifacts are current, accepted, and bound to this run. | artifact:integrated-change | — |
| `verification-summary-to-architecture-review` | `aggregate-verification` | `consumes` | `review-architecture-security` | Upstream artifacts are current, accepted, and bound to this run. | artifact:verification-summary | — |
| `verification-summary-to-candidate-approval` | `aggregate-verification` | `consumes` | `approve-release-candidate` | Upstream artifacts are current, accepted, and bound to this run. | artifact:verification-summary | — |
| `architecture-review-to-candidate-approval` | `review-architecture-security` | `consumes` | `approve-release-candidate` | Upstream artifacts are current, accepted, and bound to this run. | artifact:architecture-security-review | — |
| `architecture-review-to-candidate-publication` | `review-architecture-security` | `consumes` | `publish-release-candidate` | Upstream artifacts are current, accepted, and bound to this run. | artifact:architecture-security-review | — |
| `candidate-approval-to-publication` | `approve-release-candidate` | `approves` | `publish-release-candidate` | The owner approved the exact candidate and GitHub mutation scope. | artifact:release-candidate-approval | — |
| `candidate-approval-artifact-to-publication` | `approve-release-candidate` | `consumes` | `publish-release-candidate` | Upstream artifacts are current, accepted, and bound to this run. | artifact:release-candidate-approval | — |
| `candidate-to-canary-approval` | `publish-release-candidate` | `consumes` | `approve-canary` | Upstream artifacts are current, accepted, and bound to this run. | artifact:release-candidate | — |
| `candidate-to-canary-deployment` | `publish-release-candidate` | `consumes` | `deploy-canary` | Upstream artifacts are current, accepted, and bound to this run. | artifact:release-candidate | — |
| `canary-approval-to-deployment` | `approve-canary` | `approves` | `deploy-canary` | The owner approved the exact candidate, canary target, probes, observation window, and rollback. | artifact:canary-approval | — |
| `canary-approval-artifact-to-deployment` | `approve-canary` | `consumes` | `deploy-canary` | Upstream artifacts are current, accepted, and bound to this run. | artifact:canary-approval | — |
| `canary-deployment-to-behavior` | `deploy-canary` | `consumes` | `verify-canary-behavior` | Upstream artifacts are current, accepted, and bound to this run. | artifact:canary-deployment | — |
| `candidate-to-production-approval` | `publish-release-candidate` | `consumes` | `approve-production-release` | Upstream artifacts are current, accepted, and bound to this run. | artifact:release-candidate | — |
| `release-package-to-production-approval` | `build-release-package` | `consumes` | `approve-production-release` | The owner approval binds the exact typed archive, installer, checksum manifest, candidate commit, paths, sizes, modes, and digests. | artifact:release-package | — |
| `canary-behavior-to-production-approval` | `verify-canary-behavior` | `consumes` | `approve-production-release` | Upstream artifacts are current, accepted, and bound to this run. | artifact:canary-behavior-report | — |
| `onboarding-distribution-to-production-approval` | `verify-onboarding-distribution` | `consumes` | `approve-production-release` | The owner reviews the exact release-candidate archive, checksum manifest, installation evidence, and documented publication contract. | artifact:onboarding-distribution-report | — |
| `candidate-to-staged-release-assets` | `publish-release-candidate` | `consumes` | `stage-release-assets` | The exact approved candidate commit is the immutable source of the privately staged release assets. | artifact:release-candidate | — |
| `release-package-to-staged-release-assets` | `build-release-package` | `consumes` | `stage-release-assets` | Private GitHub draft staging uploads only the exact typed package bytes and checksum manifest approved for this run. | artifact:release-package | — |
| `onboarding-distribution-to-staged-release-assets` | `verify-onboarding-distribution` | `consumes` | `stage-release-assets` | The locally verified archive and checksum manifest are current and bound to the exact approved candidate. | artifact:onboarding-distribution-report | — |
| `production-approval-to-staged-release-assets` | `approve-production-release` | `approves` | `stage-release-assets` | The owner approved the exact private draft stage, immutable tag, release target, archive and checksum manifest, candidate commit, and final publication scope. | artifact:production-release-approval | — |
| `production-approval-artifact-to-staged-release-assets` | `approve-production-release` | `consumes` | `stage-release-assets` | The private release-asset staging approval is current, accepted, and bound to this run. | artifact:production-release-approval | — |
| `staged-release-assets-to-verification` | `stage-release-assets` | `consumes` | `verify-staged-release-assets` | The private GitHub draft-release record exposes the exact approved versioned assets only through authenticated staging endpoints. | artifact:staged-release-assets | — |
| `candidate-to-production-release` | `publish-release-candidate` | `consumes` | `release-production` | Upstream artifacts are current, accepted, and bound to this run. | artifact:release-candidate | — |
| `canary-behavior-to-production-release` | `verify-canary-behavior` | `consumes` | `release-production` | Upstream artifacts are current, accepted, and bound to this run. | artifact:canary-behavior-report | — |
| `staged-release-assets-verification-to-production-release` | `verify-staged-release-assets` | `consumes` | `release-production` | The privately staged package is authenticated-downloadable, checksum-verified, installable, and runnable before production deployment begins. | artifact:staged-release-assets-report | — |
| `production-approval-to-release` | `approve-production-release` | `approves` | `release-production` | The owner approved the exact production candidate, target, observation plan, and rollback. | artifact:production-release-approval | — |
| `production-approval-artifact-to-release` | `approve-production-release` | `consumes` | `release-production` | Upstream artifacts are current, accepted, and bound to this run. | artifact:production-release-approval | — |
| `production-release-to-observation` | `release-production` | `consumes` | `observe-production` | Upstream artifacts are current, accepted, and bound to this run. | artifact:production-release | — |
| `staged-release-assets-to-publication` | `stage-release-assets` | `consumes` | `publish-release-assets` | The exact private draft release, asset IDs, candidate commit, and checksums remain unchanged after production observation. | artifact:staged-release-assets | — |
| `staged-release-assets-verification-to-publication` | `verify-staged-release-assets` | `consumes` | `publish-release-assets` | Authenticated clean-install verification of the private draft assets passed without unresolved platform gaps. | artifact:staged-release-assets-report | — |
| `production-release-to-release-assets` | `release-production` | `consumes` | `publish-release-assets` | The production deployment record remains bound to the exact staged candidate and rollback authority. | artifact:production-release | — |
| `production-observation-to-release-assets` | `observe-production` | `consumes` | `publish-release-assets` | The full observation window passed with the candidate still deployed, no rollback, and no unresolved regression; rollback or failed observation blocks public release. | artifact:production-observation | — |
| `production-approval-to-release-assets` | `approve-production-release` | `approves` | `publish-release-assets` | The owner approval explicitly authorizes final public tag and release publication only after successful production observation. | artifact:production-release-approval | — |
| `production-approval-artifact-to-release-assets` | `approve-production-release` | `consumes` | `publish-release-assets` | The final publication approval is current and bound to the exact staged assets, production deployment, observation plan, tag, and release target. | artifact:production-release-approval | — |
| `published-release-assets-to-ledger-proposal` | `publish-release-assets` | `consumes` | `prepare-release-ledger-update` | The non-mutating ledger proposal derives release fields from the verified immutable asset record. | artifact:published-release-assets-report | — |
| `production-release-to-ledger-proposal` | `release-production` | `consumes` | `prepare-release-ledger-update` | The non-mutating ledger proposal binds the immutable production release record. | artifact:production-release | — |
| `production-observation-to-ledger-proposal` | `observe-production` | `consumes` | `prepare-release-ledger-update` | The non-mutating ledger proposal is created only after successful production observation. | artifact:production-observation | — |
| `published-release-assets-to-ledger-approval` | `publish-release-assets` | `consumes` | `approve-release-ledger-update` | The release-ledger approval must bind the verified immutable asset record. | artifact:published-release-assets-report | — |
| `release-ledger-proposal-to-approval` | `prepare-release-ledger-update` | `consumes` | `approve-release-ledger-update` | The owner approves the exact precomputed single-file diff, expected base commit, immutable release fields, and proposal digest without authoring new content. | artifact:release-ledger-proposal | — |
| `production-release-to-ledger-approval` | `release-production` | `consumes` | `approve-release-ledger-update` | The release-ledger approval must bind the immutable production release record. | artifact:production-release | — |
| `production-observation-to-ledger-approval` | `observe-production` | `consumes` | `approve-release-ledger-update` | The release ledger may be updated only after the approved production observation completes successfully. | artifact:production-observation | — |
| `release-ledger-approval-to-update` | `approve-release-ledger-update` | `approves` | `update-release-ledger` | The owner approved the exact file, diff, release date, immutable release references, GitHub mutation scope, and rollback. | artifact:release-ledger-update-approval | — |
| `release-ledger-approval-artifact-to-update` | `approve-release-ledger-update` | `consumes` | `update-release-ledger` | The repository mutation approval is current, accepted, and bound to the exact proposed ledger diff. | artifact:release-ledger-update-approval | — |
| `release-ledger-proposal-to-update` | `prepare-release-ledger-update` | `consumes` | `update-release-ledger` | The repository updater applies only the exact proposal digest reviewed by the owner and recorded in the approval artifact. | artifact:release-ledger-proposal | — |
| `published-release-assets-to-ledger-update` | `publish-release-assets` | `consumes` | `update-release-ledger` | The repository ledger must match the verified immutable tag, release URL, candidate commit, and asset digests. | artifact:published-release-assets-report | — |
| `production-release-to-ledger-update` | `release-production` | `consumes` | `update-release-ledger` | The repository ledger must match the immutable production release record. | artifact:production-release | — |
| `production-observation-to-ledger-update` | `observe-production` | `consumes` | `update-release-ledger` | The repository ledger mutation proceeds only after verified production observation. | artifact:production-observation | — |
| `candidate-to-closeout` | `publish-release-candidate` | `consumes` | `closeout-release` | Upstream artifacts are current, accepted, and bound to this run. | artifact:release-candidate | — |
| `release-ledger-update-to-closeout` | `update-release-ledger` | `consumes` | `closeout-release` | Closeout requires the verified repository ledger update bound to the immutable release record. | artifact:release-ledger-update | — |
| `production-observation-to-closeout` | `observe-production` | `consumes` | `closeout-release` | Upstream artifacts are current, accepted, and bound to this run. | artifact:production-observation | — |
| `verify-typecheck-feedback-to-integration` | `verify-typecheck` | `feedback` | `integrate-and-repair` | The evidence identifies a correctable implementation or integration failure. | artifact:typecheck-report | max 3; The failed criterion passes with fresh evidence, or three repair traversals exhaust and the run moves to needs_human. |
| `build-release-package-feedback-to-integration` | `build-release-package` | `feedback` | `integrate-and-repair` | The release-package evidence identifies a correctable packaging, archive-scope, checksum, mode, or integration failure. | artifact:release-package | max 3; The failed criterion passes with fresh evidence, or three repair traversals exhaust and the run moves to needs_human. |
| `verify-documentation-feedback-to-integration` | `verify-documentation` | `feedback` | `integrate-and-repair` | The evidence identifies a correctable documentation or integration failure. | artifact:documentation-verification-report | max 3; The failed criterion passes with fresh evidence, or three repair traversals exhaust and the run moves to needs_human. |
| `verify-unit-tests-feedback-to-integration` | `verify-unit-tests` | `feedback` | `integrate-and-repair` | The evidence identifies a correctable implementation or integration failure. | artifact:unit-test-report | max 3; The failed criterion passes with fresh evidence, or three repair traversals exhaust and the run moves to needs_human. |
| `verify-rust-tests-feedback-to-integration` | `verify-rust-tests` | `feedback` | `integrate-and-repair` | The evidence identifies a correctable implementation or integration failure. | artifact:rust-test-report | max 3; The failed criterion passes with fresh evidence, or three repair traversals exhaust and the run moves to needs_human. |
| `build-runtime-feedback-to-integration` | `build-runtime` | `feedback` | `integrate-and-repair` | The evidence identifies a correctable implementation or integration failure. | artifact:runtime-build | max 3; The failed criterion passes with fresh evidence, or three repair traversals exhaust and the run moves to needs_human. |
| `build-sim-one-tui-feedback-to-integration` | `build-sim-one-tui` | `feedback` | `integrate-and-repair` | The evidence identifies a correctable implementation or integration failure. | artifact:sim-one-tui-build | max 3; The failed criterion passes with fresh evidence, or three repair traversals exhaust and the run moves to needs_human. |
| `verify-sim-one-tui-feedback-to-integration` | `verify-sim-one-tui` | `feedback` | `integrate-and-repair` | The evidence identifies a correctable implementation or integration failure. | artifact:sim-one-tui-product-report | max 3; The failed criterion passes with fresh evidence, or three repair traversals exhaust and the run moves to needs_human. |
| `verify-onboarding-distribution-feedback-to-integration` | `verify-onboarding-distribution` | `feedback` | `integrate-and-repair` | The isolated packaged onboarding or distribution evidence identifies a correctable implementation or integration failure. | artifact:onboarding-distribution-report | max 3; The failed criterion passes with fresh evidence, or three repair traversals exhaust and the run moves to needs_human. |
| `build-cli-feedback-to-integration` | `build-cli` | `feedback` | `integrate-and-repair` | The evidence identifies a correctable implementation or integration failure. | artifact:cli-build | max 3; The failed criterion passes with fresh evidence, or three repair traversals exhaust and the run moves to needs_human. |
| `verify-cli-behavior-feedback-to-integration` | `verify-cli-behavior` | `feedback` | `integrate-and-repair` | The evidence identifies a correctable implementation or integration failure. | artifact:cli-behavior-report | max 3; The failed criterion passes with fresh evidence, or three repair traversals exhaust and the run moves to needs_human. |
| `verify-http-integration-feedback-to-integration` | `verify-http-integration` | `feedback` | `integrate-and-repair` | The evidence identifies a correctable implementation or integration failure. | artifact:http-test-report | max 3; The failed criterion passes with fresh evidence, or three repair traversals exhaust and the run moves to needs_human. |
| `verify-tui-e2e-feedback-to-integration` | `verify-tui-e2e` | `feedback` | `integrate-and-repair` | The evidence identifies a correctable implementation or integration failure. | artifact:tui-e2e-report | max 3; The failed criterion passes with fresh evidence, or three repair traversals exhaust and the run moves to needs_human. |
| `verify-memory-smoke-feedback-to-integration` | `verify-memory-smoke` | `feedback` | `integrate-and-repair` | The evidence identifies a correctable implementation or integration failure. | artifact:memory-smoke-report | max 3; The failed criterion passes with fresh evidence, or three repair traversals exhaust and the run moves to needs_human. |
| `aggregate-verification-feedback-to-integration` | `aggregate-verification` | `feedback` | `integrate-and-repair` | The evidence identifies a correctable implementation or integration failure. | artifact:verification-summary | max 3; The failed criterion passes with fresh evidence, or three repair traversals exhaust and the run moves to needs_human. |
| `review-architecture-security-feedback-to-integration` | `review-architecture-security` | `feedback` | `integrate-and-repair` | The evidence identifies a correctable implementation or integration failure. | artifact:architecture-security-review | max 3; The failed criterion passes with fresh evidence, or three repair traversals exhaust and the run moves to needs_human. |
| `canary-feedback-to-integration` | `verify-canary-behavior` | `feedback` | `integrate-and-repair` | The canary exposes a correctable release regression and the recorded canary rollback has been invoked when required. | artifact:canary-behavior-report | max 2; Fresh canary evidence passes after repair, or two traversals exhaust and the run moves to needs_human. |
| `production-feedback-to-integration` | `observe-production` | `feedback` | `integrate-and-repair` | Production observation exposes a correctable regression and the recorded rollback has been invoked. | artifact:production-observation | max 1; Fresh verification and canary evidence pass after one repair traversal, or the run remains needs_human. |
| `verify-http-integration-conflicts-verify-sim-one-tui` | `verify-http-integration` | `conflicts` | `verify-sim-one-tui` | Both probes require exclusive use of the local built runtime and mutable test configuration. | — | — |
| `verify-cli-behavior-conflicts-verify-http-integration` | `verify-cli-behavior` | `conflicts` | `verify-http-integration` | Both probes require exclusive use of the local built runtime and mutable test state. | — | — |
| `verify-cli-behavior-conflicts-verify-sim-one-tui` | `verify-cli-behavior` | `conflicts` | `verify-sim-one-tui` | Both probes require exclusive use of the local built runtime and mutable test state. | — | — |
| `verify-sim-one-tui-conflicts-verify-onboarding-distribution` | `verify-sim-one-tui` | `conflicts` | `verify-onboarding-distribution` | Both probes require exclusive use of the packaged CLI, TUI, and mutable isolated runtime root. | — | — |
| `verify-cli-behavior-conflicts-verify-onboarding-distribution` | `verify-cli-behavior` | `conflicts` | `verify-onboarding-distribution` | Both probes require exclusive use of the packaged CLI and mutable isolated runtime root. | — | — |
| `verify-http-integration-conflicts-verify-onboarding-distribution` | `verify-http-integration` | `conflicts` | `verify-onboarding-distribution` | Both probes require exclusive use of the built runtime and mutable isolated runtime configuration. | — | — |
| `verify-tui-e2e-conflicts-verify-onboarding-distribution` | `verify-tui-e2e` | `conflicts` | `verify-onboarding-distribution` | The pre-merge TUI end-to-end probe completes before the post-merge onboarding probe because both require exclusive use of the built runtime, packaged CLI, and mutable isolated runtime root. | — | — |
| `verify-memory-smoke-conflicts-verify-onboarding-distribution` | `verify-memory-smoke` | `conflicts` | `verify-onboarding-distribution` | The pre-merge memory smoke probe completes before the post-merge onboarding probe because both require exclusive use of the built runtime and mutable isolated runtime configuration. | — | — |
| `verify-cli-behavior-conflicts-verify-tui-e2e` | `verify-cli-behavior` | `conflicts` | `verify-tui-e2e` | Both probes require exclusive use of the local built runtime and mutable test state. | — | — |
| `verify-cli-behavior-conflicts-verify-memory-smoke` | `verify-cli-behavior` | `conflicts` | `verify-memory-smoke` | Both probes require exclusive use of the local built runtime and mutable test state. | — | — |
| `verify-http-integration-conflicts-verify-tui-e2e` | `verify-http-integration` | `conflicts` | `verify-tui-e2e` | Both probes require exclusive use of the local built runtime and mutable test configuration. | — | — |
| `verify-http-integration-conflicts-verify-memory-smoke` | `verify-http-integration` | `conflicts` | `verify-memory-smoke` | Both probes require exclusive use of the local built runtime and mutable test configuration. | — | — |
| `verify-sim-one-tui-conflicts-verify-tui-e2e` | `verify-sim-one-tui` | `conflicts` | `verify-tui-e2e` | Both probes require exclusive use of the local built runtime and mutable test configuration. | — | — |
| `verify-sim-one-tui-conflicts-verify-memory-smoke` | `verify-sim-one-tui` | `conflicts` | `verify-memory-smoke` | Both probes require exclusive use of the local built runtime and mutable test configuration. | — | — |
| `verify-tui-e2e-conflicts-verify-memory-smoke` | `verify-tui-e2e` | `conflicts` | `verify-memory-smoke` | Both probes require exclusive use of the local built runtime and mutable test configuration. | — | — |
| `baseline-invalidates-change-contract` | `baseline-context` | `invalidates` | `define-change-contract` | A changed commit, instruction, or authorized request makes the former contract stale. | artifact:change-contract, artifact:affected-domain-map | — |
| `baseline-invalidates-beta-release-contract` | `baseline-context` | `invalidates` | `approve-beta-release-contract` | A changed commit, release ledger, external source-plan path, byte size, SHA-256 digest, or authorized request makes the former beta contract approval stale. | artifact:beta-release-contract | — |
| `change-contract-invalidates-beta-release-contract` | `define-change-contract` | `invalidates` | `approve-beta-release-contract` | A changed purpose, scope, non-goal, or affected-domain map makes the former beta contract approval stale. | artifact:beta-release-contract | — |
| `change-contract-invalidates-architecture` | `define-change-contract` | `invalidates` | `decide-architecture` | A changed purpose, scope, non-goal, or acceptance criterion makes the former architecture decision stale. | artifact:architecture-decision | — |
| `architecture-invalidates-plan` | `decide-architecture` | `invalidates` | `plan-implementation` | A changed architecture decision makes the former implementation plan stale. | artifact:implementation-plan | — |
| `beta-release-contract-invalidates-architecture` | `approve-beta-release-contract` | `invalidates` | `decide-architecture` | A changed owner-approved beta contract invalidates architecture and planning assumptions for affected members. | artifact:architecture-decision | — |
| `beta-release-contract-invalidates-plan` | `approve-beta-release-contract` | `invalidates` | `plan-implementation` | A changed owner-approved beta contract or external source-plan digest manifest invalidates the implementation sequence and file-ownership map. | artifact:implementation-plan | — |
| `plan-invalidates-implement-core-contracts` | `plan-implementation` | `invalidates` | `implement-core-contracts` | A changed implementation plan invalidates the affected domain output. | artifact:core-contracts-change | — |
| `plan-invalidates-implement-agent-runtime` | `plan-implementation` | `invalidates` | `implement-agent-runtime` | A changed implementation plan invalidates the affected domain output. | artifact:agent-runtime-change | — |
| `plan-invalidates-implement-memory-retrieval` | `plan-implementation` | `invalidates` | `implement-memory-retrieval` | A changed implementation plan invalidates the affected domain output. | artifact:memory-retrieval-change | — |
| `plan-invalidates-implement-capabilities-security` | `plan-implementation` | `invalidates` | `implement-capabilities-security` | A changed implementation plan invalidates the affected domain output. | artifact:capabilities-security-change | — |
| `plan-invalidates-implement-ingress-operations` | `plan-implementation` | `invalidates` | `implement-ingress-operations` | A changed implementation plan invalidates the affected domain output. | artifact:ingress-operations-change | — |
| `plan-invalidates-implement-product-delivery` | `plan-implementation` | `invalidates` | `implement-product-delivery` | A changed implementation plan invalidates the affected domain output. | artifact:product-delivery-change | — |
| `plan-invalidates-implement-sim-one-tui-work-pane` | `plan-implementation` | `invalidates` | `implement-sim-one-tui-work-pane` | A changed implementation plan invalidates the required TUI work-pane output. | artifact:sim-one-tui-work-pane-change | — |
| `plan-invalidates-implement-sim-one-onboarding-distribution` | `plan-implementation` | `invalidates` | `implement-sim-one-onboarding-distribution` | A changed implementation plan invalidates the onboarding and distribution output. | artifact:sim-one-onboarding-distribution-change | — |
| `plan-invalidates-release-package-build` | `plan-implementation` | `invalidates` | `build-release-package` | A changed implementation plan, packaging argv, output path, file-ownership assignment, or verification binding invalidates the release-package record. | artifact:release-package | — |
| `sim-one-tui-work-pane-invalidates-product-delivery` | `implement-sim-one-tui-work-pane` | `invalidates` | `implement-product-delivery` | A changed TUI work-pane output invalidates product integration and release documentation. | artifact:product-delivery-change | — |
| `sim-one-onboarding-distribution-invalidates-product-delivery` | `implement-sim-one-onboarding-distribution` | `invalidates` | `implement-product-delivery` | A changed onboarding and distribution output invalidates product integration and release documentation. | artifact:product-delivery-change | — |
| `integration-invalidates-verify-typecheck` | `integrate-and-repair` | `invalidates` | `verify-typecheck` | A changed integrated diff invalidates prior verification evidence. | artifact:typecheck-report | — |
| `integration-invalidates-verify-documentation` | `integrate-and-repair` | `invalidates` | `verify-documentation` | A changed integrated diff invalidates prior documentation verification evidence. | artifact:documentation-verification-report | — |
| `integration-invalidates-verify-unit-tests` | `integrate-and-repair` | `invalidates` | `verify-unit-tests` | A changed integrated diff invalidates prior verification evidence. | artifact:unit-test-report | — |
| `integration-invalidates-verify-rust-tests` | `integrate-and-repair` | `invalidates` | `verify-rust-tests` | A changed integrated diff invalidates prior verification evidence. | artifact:rust-test-report | — |
| `integration-invalidates-verify-onboarding-distribution` | `integrate-and-repair` | `invalidates` | `verify-onboarding-distribution` | A changed integrated diff invalidates prior packaged onboarding and distribution evidence. | artifact:onboarding-distribution-report | — |
| `integration-invalidates-verify-sim-one-tui` | `integrate-and-repair` | `invalidates` | `verify-sim-one-tui` | A changed integrated diff invalidates prior packaged SIM-ONE TUI session, transcript, interaction, prompt, and visible-final evidence. | artifact:sim-one-tui-product-report | — |
| `production-approval-to-observation` | `approve-production-release` | `approves` | `observe-production` | The owner approved the exact production target, candidate, observation plan, and recorded rollback authority. | artifact:production-release-approval | — |
| `production-approval-artifact-to-observation` | `approve-production-release` | `consumes` | `observe-production` | The rollback authority is current, accepted, and bound to the exact production release and this run. | artifact:production-release-approval | — |

## Node contracts

### `baseline-context` — Bind Change To Current Project Context

- Goal: Bind one authorized change request to the current SIM-ONE Alpha commit, applicable instructions, exact external beta source-plan digests, architecture contracts, affected domains, and external-effect boundaries.
- Executor instructions: Read the authorized request, current Git state, AGENTS.md, architecture documents, manifests, relevant history, and every external beta source plan declared by external:release-source-plans. Record a canonical path, byte size, and SHA-256 digest for each exact plan before approval. Do not mark historical implementation as verified. Classify every workspace-related path as company-owned system instructions, the main-agent persona workspace, a lead-worker persona workspace, a worker-local internal-subagent workspace, or the Coding Worker runtime access root. Before any executable node is claimed, compare the active checkout containing development-graph.json with project.root. If they differ, record explicit operator authority for canonical-root execution or stop; never silently execute against another checkout.
- Inputs: external:authorized-change-request, external:repository-checkout, external:release-source-plans
- Resources: —
- Permissions: read [AGENTS.md, docs/architecture/, package.json, pnpm-lock.yaml, .github/workflows/, current Git metadata, src/AGENTS.md, src/workspace-loader.ts, src/agents/orchestrator.ts, src/workspace/, src/engine/workers/*/workspace/, src/engine/workers/coding-worker/subagents/*/workspace/, /opt/ai/plans/sim-one-ratatui-tui/plan.md, /opt/ai/plans/sim-one-ratatui-tui/work-pane-addendum.md, /opt/ai/plans/sim-one-build-structure/plan.md, /opt/ai/plans/agent-tui/plan.md]; write [—]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `45` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `none` — Produces evidence without mutating project or external state.
- Rollback: none
- Approval required: `false`
- Acceptance:
  - `context-bound-to-commit` (artifact): The context record names the exact Git commit, instruction files, requested outcome, explicit non-goals, affected domains, and external effects. Evidence: `runtime:evidence/baseline-context/context.json`
  - `external-plan-digests-bound` (policy): The context record includes a canonical manifest of the exact external beta source-plan paths, byte sizes, and SHA-256 digests; a missing, added, or changed source plan invalidates the baseline and blocks reuse of its approval. Evidence: `runtime:evidence/baseline-context/external-plan-digests.json`
  - `boundaries-confirmed` (review): The context preserves Flue discovery paths; company-owned src/AGENTS.md authority; main-agent, lead-worker, and worker-local internal-subagent workspace ownership; Coding Worker runtime-root scope; orchestrator/worker ownership; protocol/tool/skill separation; and project naming rules. Evidence: `runtime:evidence/baseline-context/boundary-review.json`
  - `execution-root-authorized` (policy): The context record proves that the checkout containing development-graph.json matches the declared canonical project.root, or records explicit operator authority to execute against that canonical root; an unapproved worktree/CI mismatch blocks executable claims. Evidence: `runtime:evidence/baseline-context/execution-root.json`

### `install-dependencies` — Install Pinned Dependencies

- Goal: Prepare the Node 22 and pnpm dependency tree from the committed lockfile without changing dependency intent.
- Executor instructions: Run the pinned package-manager install and retain complete output, including any blocked build-script warning.
- Inputs: artifact:baseline-context
- Resources: project:node-modules
- Permissions: read [package.json, pnpm-lock.yaml, pnpm-workspace.yaml, pnpm store]; write [node_modules/]; external [package registry downloads]; destructive `false`
- Execution: max `2` attempt(s), `20` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Populates the gitignored node_modules dependency tree.
- Rollback: Re-run the pinned install from the prior reviewed lockfile to restore the prior dependency tree.
- Approval required: `false`
- Acceptance:
  - `frozen-install-passed` (test): pnpm install --frozen-lockfile exits successfully under Node 22 and does not modify pnpm-lock.yaml. Evidence: `runtime:evidence/install-dependencies/result.json`
  - `build-scripts-reviewed` (policy): Any ignored dependency build scripts are explicitly reviewed and approved before later nodes rely on their artifacts. Evidence: `runtime:evidence/install-dependencies/stdout.log`

### `fetch-embedding-model` — Fetch Bundled Embedding Model

- Goal: Materialize the pinned local ONNX embedding model and tokenizer assets required by embedding and RAG verification.
- Executor instructions: Use the repository fetch script and digest the downloaded model assets.
- Inputs: artifact:dependency-environment
- Resources: project:embedding-model-assets
- Permissions: read [scripts/fetch-embedding-model.mjs, package.json]; write [assets/models/embeddings/all-MiniLM-L6-v2/]; external [Hugging Face model download]; destructive `false`
- Execution: max `2` attempt(s), `15` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Writes gitignored embedding model assets under assets/models/embeddings.
- Rollback: Restore the previously reviewed model asset snapshot from the local cache or rerun the pinned fetch script.
- Approval required: `false`
- Acceptance:
  - `model-assets-present` (artifact): model.onnx, tokenizer.json, tokenizer configuration, vocabulary, and model configuration exist at the documented project path. Evidence: `assets/models/embeddings/all-MiniLM-L6-v2/`
  - `model-assets-digested` (policy): The runtime evidence records sizes and SHA-256 digests for the downloaded model assets. Evidence: `runtime:evidence/fetch-embedding-model/result.json`

### `build-wasm-memory` — Build Rust Memory WASM

- Goal: Compile the Rust structured-memory engine to the Node-compatible WASM artifact required by real memory execution.
- Executor instructions: Run the repository WASM build under the pinned Rust toolchain and retain the generated artifact digest.
- Inputs: artifact:dependency-environment
- Resources: project:memory-wasm-output
- Permissions: read [crates/gorombo-memory/, rust-toolchain.toml, Cargo.toml, scripts/wasm-build.mjs]; write [crates/gorombo-memory/pkg/, target/]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `20` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Writes gitignored Rust target and WASM package artifacts.
- Rollback: Rebuild the WASM package from the prior reviewed Rust source and toolchain.
- Approval required: `false`
- Acceptance:
  - `wasm-build-passed` (test): The wasm-pack build exits successfully for wasm32-unknown-unknown. Evidence: `runtime:evidence/build-wasm-memory/result.json`
  - `wasm-artifact-present` (artifact): crates/gorombo-memory/pkg/gorombo_memory_bg.wasm exists and its digest is recorded. Evidence: `crates/gorombo-memory/pkg/gorombo_memory_bg.wasm`

### `define-change-contract` — Define Purpose And Acceptance Contract

- Goal: Turn the authorized request into a project-specific purpose, scope, non-goals, evidence plan, permission boundary, rollback, and user-visible progress contract.
- Executor instructions: Create or update /opt/ai/plans/<topic>/plan.md and name every behavioral acceptance test, external effect, approval gate, and rollback. When workspace-related behavior is in scope, distinguish instruction/persona ownership from Coding Worker sandbox and project-root access.
- Inputs: artifact:baseline-context
- Resources: plans:<topic>
- Permissions: read [artifact:baseline-context, AGENTS.md, /opt/ai/plans/, src/AGENTS.md, docs/architecture/flue-architecture.md, docs/architecture/gorombo-flue-map.md]; write [/opt/ai/plans/<topic>/plan.md]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `45` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Creates or updates the task plan in the mandatory plans directory.
- Rollback: Restore the previous plan version from version control or its retained prior revision.
- Approval required: `false`
- Acceptance:
  - `plan-location-correct` (artifact): The plan exists at /opt/ai/plans/<topic>/plan.md and does not use memory or the repository as a substitute plan location. Evidence: `/opt/ai/plans/<topic>/plan.md`
  - `acceptance-is-behavioral` (review): Success criteria prove correct outputs or target-system effects; process, port, file existence, and zero exit alone are not treated as behavioral proof. Evidence: `runtime:evidence/define-change-contract/acceptance-review.json`
  - `authority-is-bounded` (policy): The contract lists exact authorized mutations and separates read-only discovery from local, GitHub, deployment, sending, spending, and destructive effects. Evidence: `runtime:evidence/define-change-contract/authority.json`
  - `workspace-scope-explicit` (policy): A workspace-affecting contract names whether it changes company-owned instructions, the main-agent persona workspace, a lead-worker persona workspace, an internal-subagent workspace, or the Coding Worker runtime access root; non-workspace changes explicitly record this criterion as not applicable. Evidence: `runtime:evidence/define-change-contract/workspace-scope.json`

### `approve-beta-release-contract` — Approve 0.1.0 Beta Release Contract

- Goal: Bind the fixed owner decision that every remaining release item, the SIM-ONE TUI work pane, and the exact external source-plan digest manifest are required for 0.1.0 Beta before architecture and implementation planning.
- Executor instructions: Review the stable release ledger, the exact external source plans, the canonical plan-digest manifest in artifact:baseline-context, and the bounded mutation scopes for the TUI work-pane and onboarding/distribution workstreams. Approve the fixed contract only with fail-closed per-write Coding Worker approval-service enforcement. Every listed ID and source-plan digest is required for 0.1.0 Beta. Any source-plan change, scope reduction, digest mismatch, or approval-service bypass requires a fresh owner decision and graph revision rather than a runtime deferral.
- Inputs: artifact:baseline-context, artifact:change-contract, artifact:affected-domain-map
- Resources: —
- Permissions: read [artifact:baseline-context, artifact:change-contract, artifact:affected-domain-map, docs/getting-started/pre-release-status.md, /opt/ai/plans/sim-one-ratatui-tui/plan.md, /opt/ai/plans/sim-one-ratatui-tui/work-pane-addendum.md, /opt/ai/plans/sim-one-build-structure/plan.md, /opt/ai/plans/agent-tui/plan.md]; write [—]; external [—]; destructive `false`
- Execution: max `1` attempt(s), `1440` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `none` — Produces an owner-bound approval of the fixed 0.1.0 Beta contract without mutating project or external state.
- Rollback: none
- Approval required: `false`
- Acceptance:
  - `all-release-items-required` (manual): The owner approval records every stable ID in docs/getting-started/pre-release-status.md as required for 0.1.0 Beta with no deferred or optional branch. Evidence: `runtime:evidence/approve-beta-release-contract/approval.json`
  - `release-ledger-covered` (review): The fixed contract covers REL-PKG-001, REL-PKG-002, REL-ONB-001, REL-OPS-001, REL-WEB-001, REL-DISCORD-001, REL-TG-001, REL-TG-002, REL-SEC-001, REL-CW-001, REL-CW-002, REL-SCH-001, REL-SCH-002, REL-CAP-001, REL-MCP-001, REL-PROTO-001, REL-PROTO-002, REL-PROTO-003, REL-REL-001, and TUI-WORK-001 without silently dropping a ledger entry. Evidence: `runtime:evidence/approve-beta-release-contract/coverage.json`
  - `external-plan-lineage-bound` (policy): The decision binds repository release IDs to the exact path, byte size, and SHA-256 digest manifest for the detailed SIM-ONE TUI, work-pane, build-structure, and onboarding source plans without moving those plans into the repository or treating stale implementation names as product identity. Evidence: `runtime:evidence/approve-beta-release-contract/plan-lineage.json`
  - `new-workstream-mutation-policy-approved` (manual): The owner authorizes the bounded TUI work-pane and onboarding/distribution workstreams only under the project approval service; each repository write must produce a current path- and mutation-bound decision and fail closed when approval is denied, missing, expired, or mismatched. Evidence: `runtime:evidence/approve-beta-release-contract/workstream-mutation-policy.json`

### `decide-architecture` — Resolve Architecture And Ownership

- Goal: Choose the smallest design that satisfies the change contract while preserving SIM-ONE Alpha domain ownership and Flue architecture.
- Executor instructions: Read local architecture sources before version-matched Flue docs. Record alternatives, evidence, ownership, consequences, and revisit triggers; write an ADR only when material.
- Inputs: artifact:baseline-context, artifact:change-contract, artifact:affected-domain-map, artifact:beta-release-contract
- Resources: architecture-decision:<topic>
- Permissions: read [docs/architecture/, src/, version-matched Flue documentation]; write [docs/adr/ or /opt/ai/plans/<topic>/plan.md]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `60` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Records the reviewed architecture decision in the project ADR area or task plan.
- Rollback: Restore the prior decision record and invalidate downstream work that consumed the superseded decision.
- Approval required: `false`
- Acceptance:
  - `alternatives-recorded` (review): The decision records alternatives, decision criteria, supporting evidence, the selected approach, consequences, and a revisit trigger. Evidence: `runtime:evidence/decide-architecture/decision.json`
  - `ownership-preserved` (policy): The decision keeps app.ts thin, protocols in SQLite through the Protocol Tool, executable capabilities as tools, workflow knowledge as skills, specialists as workers, and registries outside orchestrator logic. Evidence: `runtime:evidence/decide-architecture/ownership-review.json`
  - `research-boundary-preserved` (policy): The researcher owns web/current/source-backed retrieval and neither the orchestrator nor Coding Worker gains a direct web-capable path. Evidence: `runtime:evidence/decide-architecture/research-boundary.json`

### `plan-implementation` — Plan Bounded Implementation

- Goal: After proving the external source plans still match the owner-approved digest manifest, produce an executable implementation sequence with file ownership, artifact handoffs, progress events, verification commands, approval scopes, and rollback.
- Executor instructions: Before mapping workstreams, recompute every external beta source-plan path, byte size, and SHA-256 digest and compare the canonical manifest with artifact:baseline-context and artifact:beta-release-contract; stop on any missing, added, or changed plan. Then map the decision to bounded workstreams. Keep shared types and contracts ahead of dependent implementation, name the exact scripts from package.json, classify every workspace-related change by instruction/persona/runtime-root ownership, and assign every changed file and focused test file to exactly one workstream before parallel execution.
- Inputs: artifact:change-contract, artifact:architecture-decision, artifact:beta-release-contract
- Resources: plans:<topic>
- Permissions: read [artifact:change-contract, artifact:architecture-decision, artifact:beta-release-contract, docs/getting-started/pre-release-status.md, /opt/ai/plans/sim-one-ratatui-tui/plan.md, /opt/ai/plans/sim-one-ratatui-tui/work-pane-addendum.md, /opt/ai/plans/sim-one-build-structure/plan.md, /opt/ai/plans/agent-tui/plan.md, package.json, .github/workflows/ci.yml, src/AGENTS.md, src/workspace-loader.ts, src/agents/orchestrator.ts, src/engine/workers/, docs/architecture/flue-architecture.md, docs/architecture/gorombo-flue-map.md, src/tests/architecture-contract.test.ts, src/tests/workspace-loader.test.ts]; write [/opt/ai/plans/<topic>/plan.md]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `60` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Updates the authorized task plan with the reviewed implementation sequence.
- Rollback: Restore the prior plan revision and invalidate downstream work that consumed the superseded plan.
- Approval required: `false`
- Acceptance:
  - `workstreams-bounded` (review): Each workstream has one clear purpose, exact owned source/documentation/test files, declared inputs and outputs, no file concurrently owned by another parallel branch, and no hidden dependency on another branch; collisions are ordered or assigned to integration. Evidence: `runtime:evidence/plan-implementation/workstreams.json`
  - `verification-mapped` (test): The plan maps each acceptance criterion to a focused check and the full applicable project verification matrix. Evidence: `runtime:evidence/plan-implementation/verification-map.json`
  - `progress-events-required` (policy): Every tool execution, worker handoff, plan update, verification result, and state transition has a durable typed progress-event expectation. Evidence: `runtime:evidence/plan-implementation/progress-contract.json`
  - `file-ownership-disjoint` (policy): The file-ownership matrix assigns every planned source, documentation, generated-definition, and focused-test mutation to exactly one producer; shared files are serialized or deferred to integration. Evidence: `runtime:evidence/plan-implementation/file-ownership.json`
  - `workspace-layers-mapped` (review): The plan distinguishes src/AGENTS.md, src/workspace/, built-in lead-worker workspaces, Coding Worker internal-subagent workspaces, runtime-loaded user workers, and the Coding Worker runtime access root whenever those layers are affected. Evidence: `runtime:evidence/plan-implementation/workspace-layers.json`
  - `release-ledger-mapped` (review): The implementation plan maps every required release and planned-work ID to one producing graph member, one verification path, and one file owner with no deferred or optional branch. Evidence: `runtime:evidence/plan-implementation/release-ledger-map.json`
  - `source-plan-lineage-preserved` (policy): Before producing any implementation workstream, the planner recomputes the path, byte size, and SHA-256 digest of every external beta source plan and proves an exact match with the manifest bound into artifact:baseline-context and artifact:beta-release-contract; a mismatch stops planning and requires a fresh baseline and approval. Evidence: `runtime:evidence/plan-implementation/source-plan-lineage.json`

### `implement-core-contracts` — Implement Core Contracts And Architecture

- Goal: Implement authorized changes to shared types, Valibot schemas, protocols, model cards, configuration, architecture contracts, and Flue-discovered entrypoints.
- Executor instructions: Use the Coding Worker lead and only its worker-local internal specialists. Emit typed progress events for every handoff, tool call, edit group, and verification result. If the domain is unaffected, produce an evidence-backed no-change record. Follow the implementation plan's exact file-ownership matrix. Stop and replan before editing a file assigned to another parallel workstream; shared or cross-domain files must be serialized or reconciled by the integration node.
- Inputs: artifact:implementation-plan
- Resources: project:core-contracts
- Permissions: read [artifact:implementation-plan, authorized project files]; write [src/core/, src/app.ts, src/db.ts, docs/architecture/, flue.config.ts, src/tests/ files assigned exclusively to this workstream by artifact:implementation-plan, src/index.ts]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `180` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes only the authorized files in this domain workstream.
- Rollback: Restore this workstream's files from the pre-change Git commit while preserving unrelated workstreams.
- Approval required: `false`
- Acceptance:
  - `scope-obeyed` (policy): The patch or no-change record stays inside the authorized domain, contains only files assigned to this workstream by the implementation plan, has no concurrent file owner in another parallel branch, and preserves the architecture decision. Evidence: `runtime:evidence/implement-core-contracts/scope-review.json`
  - `focused-verification-recorded` (test): Focused tests for changed behavior pass, or the no-change record proves why no focused test is applicable. Evidence: `runtime:evidence/implement-core-contracts/focused-verification.json`
  - `progress-visible` (artifact): Typed durable progress events cover implementation, internal specialist handoffs, tool execution, and verification. Evidence: `runtime:evidence/implement-core-contracts/progress-events.jsonl`

### `implement-agent-runtime` — Implement Agent Runtime And Workspace Boundaries

- Goal: Implement authorized main-orchestrator, workflow, tool, skill, built-in lead-worker, worker-local internal-subagent, and persona-workspace changes while treating company-owned system instructions as read-only, preserving delegation ownership and capability isolation, and keeping the Coding Worker runtime access root separate.
- Executor instructions: Use the Coding Worker lead and only its worker-local internal specialists. Treat src/AGENTS.md as company-owned system instructions; src/workspace/ as the main-agent persona workspace and default Coding Worker runtime access root; src/engine/workers/<name>/workspace/ as built-in lead-worker persona guidance; and src/engine/workers/coding-worker/subagents/<name>/workspace/ as Coding Worker internal-subagent guidance. Runtime-loaded user workers remain capability profiles rather than built-in workspace directories. The orchestrator owns worker routing and exposes only lead workers; lead workers own internal-subagent selection. Emit typed progress events for every handoff, tool call, edit group, and verification result. If the domain is unaffected, produce an evidence-backed no-change record. Follow the implementation plan's exact file-ownership matrix and stop for replan before any parallel file collision.
- Inputs: artifact:implementation-plan, artifact:beta-release-contract
- Resources: project:agent-runtime
- Permissions: read [artifact:implementation-plan, authorized project files, src/AGENTS.md, src/workspace-loader.ts, docs/architecture/flue-architecture.md, docs/architecture/gorombo-flue-map.md, src/tests/architecture-contract.test.ts, src/tests/workspace-loader.test.ts, src/tests/coding-worker.test.ts, src/tests/coding-worker-internal-subagents.test.ts, src/tests/research-agent.test.ts]; write [src/agents/, src/workflows/, src/workspace/, src/engine/tools/, src/skills/, src/engine/workers/, src/tests/ files assigned exclusively to this workstream by artifact:implementation-plan, src/workspace-loader.ts]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `180` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes only the authorized files in this domain workstream.
- Rollback: Restore this workstream's files from the pre-change Git commit while preserving unrelated workstreams.
- Approval required: `false`
- Acceptance:
  - `scope-obeyed` (policy): The patch or no-change record stays inside the authorized domain, contains only files assigned to this workstream by the implementation plan, has no concurrent file owner in another parallel branch, and preserves the architecture decision. Evidence: `runtime:evidence/implement-agent-runtime/scope-review.json`
  - `focused-verification-recorded` (test): Focused tests for changed behavior pass, or the no-change record proves why no focused test is applicable. Evidence: `runtime:evidence/implement-agent-runtime/focused-verification.json`
  - `progress-visible` (artifact): Typed durable progress events cover implementation, internal specialist handoffs, tool execution, and verification. Evidence: `runtime:evidence/implement-agent-runtime/progress-events.jsonl`
  - `persona-workspace-ownership-preserved` (policy): Company instructions remain in src/AGENTS.md; the orchestrator composes only src/workspace/ as its persona; each built-in lead worker composes its own src/engine/workers/<name>/workspace/; Coding Worker internal subagents compose only their worker-local workspace; and persona content does not rename architecture paths. Evidence: `runtime:evidence/implement-agent-runtime/workspace-ownership.json`
  - `runtime-root-separated` (policy): The Coding Worker runtime access root and project/repository scope are treated as sandbox authorization boundaries, not as worker persona-instruction ownership; approval and managed-auth state remain outside that root. Evidence: `runtime:evidence/implement-agent-runtime/runtime-root-boundary.json`
  - `delegation-boundary-preserved` (test): The main orchestrator exposes built-in lead workers but no Coding Worker internal subagent; each profile receives only its declared instructions, tools, skills, and subagents under Flue inheritance rules. Evidence: `runtime:evidence/implement-agent-runtime/delegation-boundary.json`
  - `company-instructions-human-gated` (policy): src/AGENTS.md remains read-only in this ordinary Coding Worker workstream. Any authorized change to company-owned system instructions uses a separately scoped lifecycle with an explicit owner human gate before implementation. Evidence: `runtime:evidence/implement-agent-runtime/company-instruction-gate.json`
  - `rel-cw-002-live-checkpoint-progress` (test): REL-CW-002: the live Flue Coding Worker profile attaches checkpoint reporting and forwards durable typed progress through active connector routes; a standalone reporter or unit-only event type is insufficient. Evidence: `runtime:evidence/implement-agent-runtime/rel-cw-002-live-progress.json`
  - `rel-proto-003-stage-scoring` (test): REL-PROTO-003: orchestrator and critic scoring cover every required protocol stage with fail-closed handling for missing, invalid, or rejected stage evidence. Evidence: `runtime:evidence/implement-agent-runtime/rel-proto-003-stage-scoring.json`

### `implement-memory-retrieval` — Implement Memory, RAG, And Embeddings

- Goal: Implement authorized structured memory, session memory, document indexing, knowledge storage, retrieval routing, embeddings, and Rust/WASM changes while keeping memory layers distinct.
- Executor instructions: Use the Coding Worker lead and only its worker-local internal specialists. Emit typed progress events for every handoff, tool call, edit group, and verification result. If the domain is unaffected, produce an evidence-backed no-change record. Follow the implementation plan's exact file-ownership matrix. Stop and replan before editing a file assigned to another parallel workstream; shared or cross-domain files must be serialized or reconciled by the integration node.
- Inputs: artifact:implementation-plan
- Resources: project:memory-retrieval
- Permissions: read [artifact:implementation-plan, authorized project files]; write [src/engine/memory/, src/engine/rag/, src/engine/embeddings/, crates/gorombo-memory/, src/tests/ files assigned exclusively to this workstream by artifact:implementation-plan]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `180` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes only the authorized files in this domain workstream.
- Rollback: Restore this workstream's files from the pre-change Git commit while preserving unrelated workstreams.
- Approval required: `false`
- Acceptance:
  - `scope-obeyed` (policy): The patch or no-change record stays inside the authorized domain, contains only files assigned to this workstream by the implementation plan, has no concurrent file owner in another parallel branch, and preserves the architecture decision. Evidence: `runtime:evidence/implement-memory-retrieval/scope-review.json`
  - `focused-verification-recorded` (test): Focused tests for changed behavior pass, or the no-change record proves why no focused test is applicable. Evidence: `runtime:evidence/implement-memory-retrieval/focused-verification.json`
  - `progress-visible` (artifact): Typed durable progress events cover implementation, internal specialist handoffs, tool execution, and verification. Evidence: `runtime:evidence/implement-memory-retrieval/progress-events.jsonl`

### `implement-capabilities-security` — Implement Capabilities, Registries, And Security

- Goal: Implement authorized capability-store, registry, MCP, approval, GitHub-auth, and policy enforcement changes with fail-closed trust boundaries.
- Executor instructions: Use the Coding Worker lead and only its worker-local internal specialists. Emit typed progress events for every handoff, tool call, edit group, and verification result. If the domain is unaffected, produce an evidence-backed no-change record. Follow the implementation plan's exact file-ownership matrix. Stop and replan before editing a file assigned to another parallel workstream; shared or cross-domain files must be serialized or reconciled by the integration node.
- Inputs: artifact:implementation-plan, artifact:beta-release-contract
- Resources: project:capabilities-security
- Permissions: read [artifact:implementation-plan, authorized project files]; write [src/engine/capabilities/, src/engine/registries/, src/engine/approvals/, src/api/ingress/, docs/architecture/github-auth-system.md, src/tests/ files assigned exclusively to this workstream by artifact:implementation-plan]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `180` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes only the authorized files in this domain workstream.
- Rollback: Restore this workstream's files from the pre-change Git commit while preserving unrelated workstreams.
- Approval required: `false`
- Acceptance:
  - `scope-obeyed` (policy): The patch or no-change record stays inside the authorized domain, contains only files assigned to this workstream by the implementation plan, has no concurrent file owner in another parallel branch, and preserves the architecture decision. Evidence: `runtime:evidence/implement-capabilities-security/scope-review.json`
  - `focused-verification-recorded` (test): Focused tests for changed behavior pass, or the no-change record proves why no focused test is applicable. Evidence: `runtime:evidence/implement-capabilities-security/focused-verification.json`
  - `progress-visible` (artifact): Typed durable progress events cover implementation, internal specialist handoffs, tool execution, and verification. Evidence: `runtime:evidence/implement-capabilities-security/progress-events.jsonl`
  - `rel-cw-001-edit-approval-enforced` (test): REL-CW-001: every Coding Worker write and patch path calls the approval service with trusted project and repository scope and fails closed when approval is missing or unavailable. Evidence: `runtime:evidence/implement-capabilities-security/rel-cw-001-edit-approval.json`
  - `rel-cap-001-version-pinning` (test): REL-CAP-001: capability materialization resolves and records an exact requested branch, tag, or commit instead of shallow-cloning the remote default branch. Evidence: `runtime:evidence/implement-capabilities-security/rel-cap-001-version-pinning.json`
  - `rel-mcp-001-in-place-update` (test): REL-MCP-001: mcp update changes validated connection, name, and description fields in place while preserving identity, audit data, and secret handling. Evidence: `runtime:evidence/implement-capabilities-security/rel-mcp-001-in-place-update.json`
  - `rel-proto-001-policy-records` (artifact): REL-PROTO-001: the release policy set contains complete enabled records for global, connector, project, workflow, task, output, approval, and progress behavior. Evidence: `runtime:evidence/implement-capabilities-security/rel-proto-001-policy-records.json`
  - `rel-proto-002-fail-closed` (test): REL-PROTO-002: trusted pre-execution enforcement blocks reasoning, tool execution, worker delegation, and final response when the required Protocol Tool result is absent, invalid, or incomplete. Evidence: `runtime:evidence/implement-capabilities-security/rel-proto-002-fail-closed.json`

### `implement-ingress-operations` — Implement Ingress, Sessions, Schedules, And Telemetry

- Goal: Implement authorized connector normalization, authenticated API routes, connector-specific session policy, fresh and explicit-resume TUI lifecycle, durable transcript projection, schedules, and typed progress/telemetry surfaces.
- Executor instructions: Use the Coding Worker lead and only its worker-local internal specialists. Emit typed progress events for every handoff, tool call, edit group, and verification result. If the domain is unaffected, produce an evidence-backed no-change record. Follow the implementation plan's exact file-ownership matrix. Stop and replan before editing a file assigned to another parallel workstream; shared or cross-domain files must be serialized or reconciled by the integration node.
- Inputs: artifact:implementation-plan, artifact:beta-release-contract
- Resources: project:ingress-operations
- Permissions: read [artifact:implementation-plan, authorized project files]; write [src/api/, src/channels/, src/engine/session/, src/engine/schedules/, src/core/telemetry/, docs/operations/ files assigned exclusively to this workstream by artifact:implementation-plan, docs/architecture/tui-cli-session-flow.md when assigned exclusively to this workstream by artifact:implementation-plan, src/tests/ files assigned exclusively to this workstream by artifact:implementation-plan]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `180` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes only the authorized files in this domain workstream.
- Rollback: Restore this workstream's files from the pre-change Git commit while preserving unrelated workstreams.
- Approval required: `false`
- Acceptance:
  - `scope-obeyed` (policy): The patch or no-change record stays inside the authorized domain, contains only files assigned to this workstream by the implementation plan, has no concurrent file owner in another parallel branch, and preserves the architecture decision. Evidence: `runtime:evidence/implement-ingress-operations/scope-review.json`
  - `focused-verification-recorded` (test): Focused tests for changed behavior pass, or the no-change record proves why no focused test is applicable. Evidence: `runtime:evidence/implement-ingress-operations/focused-verification.json`
  - `progress-visible` (artifact): Typed durable progress events cover implementation, internal specialist handoffs, tool execution, and verification. Evidence: `runtime:evidence/implement-ingress-operations/progress-events.jsonl`
  - `rel-tg-001-pairing-delivery` (test): REL-TG-001: an unknown Telegram user creates a durable pending pairing request and receives the intended connector response without bypassing approval. Evidence: `runtime:evidence/implement-ingress-operations/rel-tg-001-pairing.json`
  - `rel-tg-002-disabled-policy` (test): REL-TG-002: Telegram disabled-policy semantics distinguish direct-message policy from group-message policy and enforce the documented scope. Evidence: `runtime:evidence/implement-ingress-operations/rel-tg-002-disabled-policy.json`
  - `rel-sec-001-rate-limiting` (test): REL-SEC-001: authenticated gateway ingress applies bounded request throttling with actor-aware keys, observable rejection evidence, and tests for bypass and reset behavior. Evidence: `runtime:evidence/implement-ingress-operations/rel-sec-001-rate-limiting.json`
  - `rel-sch-001-context-handoff` (test): REL-SCH-001: scheduled dispatch persists and passes the trusted event id required by protocol and scoped-memory retrieval through the orchestrator handoff. Evidence: `runtime:evidence/implement-ingress-operations/rel-sch-001-context-handoff.json`
  - `rel-sch-002-result-delivery` (test): REL-SCH-002: scheduled results persist durable content and deliver through the selected connector with idempotent retry and terminal failure evidence. Evidence: `runtime:evidence/implement-ingress-operations/rel-sch-002-result-delivery.json`
  - `rel-discord-001-resolved` (policy): REL-DISCORD-001: the Discord connector normalizes authenticated events, uses connector-owned session policy, and delivers responses through the gateway. Evidence: `runtime:evidence/implement-ingress-operations/rel-discord-001.json`

### `implement-sim-one-tui-work-pane` — Implement SIM-ONE TUI Work Pane

- Goal: Implement the responsive SIM-ONE TUI work pane for tasks, usage and cost, Git state, and runtime status without regressing transcript or prompt interaction.
- Executor instructions: Follow /opt/ai/plans/sim-one-ratatui-tui/work-pane-addendum.md using SIM-ONE TUI product terminology. Before every repository mutation, call the Coding Worker approval service with the exact run, file path, proposed mutation or command, and scope; stop fail-closed on denied, missing, expired, or mismatched approval and record the decision. Keep transcript, prompt, and work-pane viewport state independent. Assign every Rust, WASM, TypeScript, documentation, and focused-test file to this member or serialize it through product integration before editing.
- Inputs: artifact:implementation-plan, artifact:beta-release-contract
- Resources: project:sim-one-tui-work-pane
- Permissions: read [artifact:implementation-plan, artifact:beta-release-contract, /opt/ai/plans/sim-one-ratatui-tui/plan.md, /opt/ai/plans/sim-one-ratatui-tui/work-pane-addendum.md, docs/architecture/tui-cli-session-flow.md, docs/operations/product-tui.md, docs/tui/, tui/ratatui/, crates/]; write [tui/ratatui/ files assigned exclusively to this member by artifact:implementation-plan, Rust/WASM helper files assigned exclusively to this member by artifact:implementation-plan, focused test files assigned exclusively to this member by artifact:implementation-plan]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `240` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes only approval-service-authorized TUI work-pane implementation files and exclusively assigned tests.
- Rollback: Restore this member's files from the pre-change Git commit while preserving the existing two-pane TUI and unrelated workstreams.
- Approval required: `true`
- Acceptance:
  - `tui-work-001-scope-obeyed` (policy): TUI-WORK-001 implements the required SIM-ONE TUI work pane without regressing the existing transcript and prompt interaction. Evidence: `runtime:evidence/implement-sim-one-tui-work-pane/scope.json`
  - `tui-work-pane-mutations-approved` (policy): Every repository write is preceded by a fail-closed Coding Worker approval-service decision bound to the exact run, file path, proposed mutation or command, approval scope, approver, and time; denied, missing, expired, or mismatched approval prevents the write. Evidence: `runtime:evidence/implement-sim-one-tui-work-pane/mutation-approvals.json`
  - `responsive-work-pane-rendered` (test): At supported widths, the SIM-ONE TUI renders transcript and prompt with a right-side work pane near 30 percent width; constrained terminals use the planned overlay or alternate view without overlap or inaccessible content. Evidence: `runtime:evidence/implement-sim-one-tui-work-pane/responsive-layout.json`
  - `task-checklist-independent` (test): The task checklist has independent focus and scrolling, displays stable checkboxes, persists task state through the Rust/WASM helper contract, and never steals transcript or prompt scrolling. Evidence: `runtime:evidence/implement-sim-one-tui-work-pane/task-checklist.json`
  - `work-pane-data-real` (test): Usage input, output, total spend, Git status, and runtime status are sourced from typed data rather than decorative placeholders and remain readable in loading, unavailable, empty, error, and populated states. Evidence: `runtime:evidence/implement-sim-one-tui-work-pane/work-pane-data.json`
  - `work-pane-tests-passed` (test): Focused Rust state, framebuffer, interaction, persistence/WASM, and packaged-product tests cover pane sizing, focus, independent scrolling, task mutations, data states, and narrow-terminal behavior. Evidence: `runtime:evidence/implement-sim-one-tui-work-pane/focused-verification.json`

### `implement-sim-one-onboarding-distribution` — Implement SIM-ONE Onboarding And Distribution

- Goal: Implement versioned SIM-ONE packaging, integrity-verified installation, packaged onboarding, configuration, diagnostics, and local or service-managed lifecycle commands.
- Executor instructions: Use /opt/ai/plans/sim-one-build-structure/plan.md as the current runtime and packaging foundation and /opt/ai/plans/agent-tui/plan.md as onboarding research, correcting stale framework, package, authentication, and product naming assumptions against current repository architecture. Before every repository mutation, call the Coding Worker approval service with the exact run, file path, proposed mutation or command, and scope; stop fail-closed on denied, missing, expired, or mismatched approval and record the decision. Keep the install and service probes isolated from host production services.
- Inputs: artifact:implementation-plan, artifact:beta-release-contract
- Resources: project:sim-one-onboarding-distribution
- Permissions: read [artifact:implementation-plan, artifact:beta-release-contract, /opt/ai/plans/sim-one-build-structure/plan.md, /opt/ai/plans/agent-tui/plan.md, sim-one-cli/, scripts/, package.json, docs/getting-started/, docs/operations/]; write [sim-one-cli/ files assigned exclusively to this member by artifact:implementation-plan, release packaging and service files assigned exclusively to this member by artifact:implementation-plan, focused test files assigned exclusively to this member by artifact:implementation-plan]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `300` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes only approval-service-authorized onboarding, packaging, installer, lifecycle, and focused-test files assigned to this member.
- Rollback: Restore this member's files from the pre-change Git commit and retain the last verified packaged runtime for recovery.
- Approval required: `true`
- Acceptance:
  - `rel-pkg-001-release-archive` (artifact): REL-PKG-001: the packaging implementation can assemble a versioned release archive containing the documented runtime, sim-one command, sim-one.sh entrypoint, service assets, and checksum manifest. Evidence: `runtime:evidence/implement-sim-one-onboarding-distribution/rel-pkg-001-release-archive.json`
  - `onboarding-distribution-mutations-approved` (policy): Every repository write is preceded by a fail-closed Coding Worker approval-service decision bound to the exact run, file path, proposed mutation or command, approval scope, approver, and time; denied, missing, expired, or mismatched approval prevents the write. Evidence: `runtime:evidence/implement-sim-one-onboarding-distribution/mutation-approvals.json`
  - `rel-pkg-002-integrity-install` (test): REL-PKG-002: installation verifies checksums before materializing the runtime, refuses mismatches, uses the runtime owner directory independent of caller cwd, and leaves a recoverable prior installation. Evidence: `runtime:evidence/implement-sim-one-onboarding-distribution/rel-pkg-002-integrity-install.json`
  - `rel-onb-001-packaged-onboarding` (test): REL-ONB-001: sim-one install runs packaged onboarding, stores validated configuration and secrets in documented user-owned locations, verifies a real model response, and enters the first secure SIM-ONE TUI session. Evidence: `runtime:evidence/implement-sim-one-onboarding-distribution/rel-onb-001-onboarding.json`
  - `rel-ops-001-lifecycle-commands` (test): REL-OPS-001: sim-one config, doctor, status, start, restart, and stop expose documented behavior for local-process and service-managed runtime modes, with output-level health evidence and idempotent lifecycle handling. Evidence: `runtime:evidence/implement-sim-one-onboarding-distribution/rel-ops-001-lifecycle-commands.json`
  - `onboarding-secrets-and-recovery-safe` (policy): Onboarding and lifecycle output never prints secret values, distinguishes warnings from blockers, and provides actionable recovery without requiring a source checkout or Cargo command. Evidence: `runtime:evidence/implement-sim-one-onboarding-distribution/secret-and-recovery-review.json`

### `implement-product-delivery` — Implement Product Surfaces And Delivery

- Goal: Integrate authorized SIM-ONE product surfaces, shared build and CI contracts, Web UI scope, and release documentation after the TUI and onboarding workstreams while preserving capability-management subcommands.
- Executor instructions: Use the Coding Worker lead and only its worker-local internal specialists. Emit typed progress events for every handoff, tool call, edit group, and verification result. If the domain is unaffected, produce an evidence-backed no-change record. Follow the implementation plan's exact file-ownership matrix. Stop and replan before editing a file assigned to another parallel workstream; shared or cross-domain files must be serialized or reconciled by the integration node.
- Inputs: artifact:implementation-plan, artifact:beta-release-contract, artifact:sim-one-tui-work-pane-change, artifact:sim-one-onboarding-distribution-change
- Resources: project:product-delivery
- Permissions: read [artifact:implementation-plan, artifact:beta-release-contract, artifact:sim-one-tui-work-pane-change, artifact:sim-one-onboarding-distribution-change, authorized project files]; write [shared product integration files assigned exclusively to this serialized member by artifact:implementation-plan, .github/workflows/, docs/architecture/product-flow.md, docs/architecture/tui-cli-session-flow.md when assigned exclusively to this workstream by artifact:implementation-plan, docs/operations/product-tui.md, docs/tui/, README.md, src/tests/ files assigned exclusively to this workstream by artifact:implementation-plan, package.json documentation-check script when assigned exclusively to this workstream by artifact:implementation-plan, scripts/check-documentation.py, AUTHORS.md, CHANGELOG.md, CODE_OF_CONDUCT.md, CONTRIBUTING.md, LICENSE, SECURITY.md, SUPPORT.md, THIRD_PARTY_NOTICES.md, docs/README.md, docs/getting-started/, docs/guides/, docs/reference/, docs/operations/telegram-connector.md, docs/operations/troubleshooting.md, docs/archive/readme-before-release-rewrite.md, docs/superpowers/plans/ documentation link maintenance when assigned exclusively to this workstream by artifact:implementation-plan, openwiki/]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `180` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes only the authorized files in this domain workstream.
- Rollback: Restore this workstream's files from the pre-change Git commit while preserving unrelated workstreams.
- Approval required: `false`
- Acceptance:
  - `scope-obeyed` (policy): The patch or no-change record stays inside the authorized domain, contains only files assigned to this workstream by the implementation plan, has no concurrent file owner in another parallel branch, and preserves the architecture decision. Evidence: `runtime:evidence/implement-product-delivery/scope-review.json`
  - `focused-verification-recorded` (test): Focused tests for changed behavior pass, or the no-change record proves why no focused test is applicable. Evidence: `runtime:evidence/implement-product-delivery/focused-verification.json`
  - `progress-visible` (artifact): Typed durable progress events cover implementation, internal specialist handoffs, tool execution, and verification. Evidence: `runtime:evidence/implement-product-delivery/progress-events.jsonl`
  - `product-workstreams-integrated` (review): The product integration consumes the required SIM-ONE TUI work-pane and onboarding/distribution outputs, preserves the sim-one capability command families, and resolves every shared-file owner before mutation. Evidence: `runtime:evidence/implement-product-delivery/product-workstream-integration.json`
  - `rel-web-001-resolved` (policy): REL-WEB-001: the Web UI uses the authenticated gateway, connector-owned session policy, durable progress, and packaged configuration. Evidence: `runtime:evidence/implement-product-delivery/rel-web-001.json`
  - `release-ledger-current` (review): docs/getting-started/pre-release-status.md retains every stable release ID, current implementation status, graph owner, and approved scope after product integration. Evidence: `runtime:evidence/implement-product-delivery/release-ledger.json`

### `integrate-and-repair` — Integrate Change And Apply Bounded Repairs

- Goal: Combine selected domain outputs into one coherent change set, resolve cross-domain contract issues, and apply bounded repairs from verification or observation evidence.
- Executor instructions: Integrate only authorized outputs. Preserve unrelated verified branches, route failures to the owning domain, and emit a complete diff plus typed progress record. Reconcile the implementation plan's exact file-ownership matrix before combining changes; a file with multiple parallel producers is a failed integration precondition, not an automatic merge.
- Inputs: artifact:core-contracts-change, artifact:agent-runtime-change, artifact:memory-retrieval-change, artifact:capabilities-security-change, artifact:ingress-operations-change, artifact:product-delivery-change, artifact:dependency-environment, artifact:embedding-model-assets, artifact:memory-wasm, artifact:typecheck-report, artifact:unit-test-report, artifact:documentation-verification-report, artifact:rust-test-report, artifact:runtime-build, artifact:sim-one-tui-build, artifact:sim-one-tui-product-report, artifact:onboarding-distribution-report, artifact:release-package, artifact:cli-build, artifact:cli-behavior-report, artifact:http-test-report, artifact:tui-e2e-report, artifact:memory-smoke-report, artifact:verification-summary, artifact:architecture-security-review, artifact:canary-behavior-report, artifact:production-observation
- Resources: project:core-contracts, project:agent-runtime, project:memory-retrieval, project:capabilities-security, project:ingress-operations, project:product-delivery
- Permissions: read [authorized project tree, domain change artifacts, verification evidence]; write [authorized project files across affected domains, excluding src/AGENTS.md]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `180` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Integrates and repairs authorized project files in the isolated worktree.
- Rollback: Restore the affected files from the pre-integration Git commit while preserving unrelated branches and evidence.
- Approval required: `false`
- Acceptance:
  - `diff-authorized` (policy): The integrated Git diff contains only authorized files and no dependency-approval, generated-asset, secret, or unrelated worktree fallout. Evidence: `runtime:evidence/integrate-and-repair/diff-scope.json`
  - `contracts-consistent` (schema): Shared types, schemas, registries, handoff contracts, docs, and consumers agree across every changed domain. Evidence: `runtime:evidence/integrate-and-repair/contract-check.json`
  - `repair-bounded` (policy): Each repair cites the failed evidence, preserves unrelated verified work, and remains within the declared feedback and attempt bounds. Evidence: `runtime:evidence/integrate-and-repair/repair-ledger.json`
  - `parallel-file-ownership-reconciled` (policy): Every changed file has one recorded producer; shared or cross-domain files were serialized or assigned to integration, and no parallel branch silently overwrote another branch. Evidence: `runtime:evidence/integrate-and-repair/file-ownership.json`
  - `company-instruction-exclusion-preserved` (policy): Integration and repair never writes src/AGENTS.md. Any company-owned system-instruction change remains outside this ordinary lifecycle and requires a separately scoped owner-approved gate. Evidence: `runtime:evidence/integrate-and-repair/company-instruction-exclusion.json`

### `verify-typecheck` — Verify TypeScript Types

- Goal: Prove the full TypeScript project satisfies its configured no-emit type contract.
- Executor instructions: Execute the exact repository script as an argv array and retain full stdout, stderr, exit status, timing, and declared artifact digests.
- Inputs: artifact:integrated-change
- Resources: —
- Permissions: read [authorized project tree, node_modules/]; write [—]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `20` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `none` — Produces verification evidence without mutating project or external state.
- Rollback: none
- Approval required: `false`
- Acceptance:
  - `verification-passed` (test): The configured TypeScript compiler exits zero with no diagnostics. Evidence: `runtime:evidence/verify-typecheck/result.json`

### `verify-documentation` — Verify Production Documentation

- Goal: Run the repository's deterministic documentation contract across root release documents, docs, and OpenWiki: local links and anchors, architecture index coverage, production TUI terminology, README section order, prohibited roadmap-style current-state language, resolvable architecture and OpenWiki source references, Markdown fence and H1 structure, and a reproducible documentation snapshot.
- Executor instructions: Execute the configured pnpm run docs:check command exactly as the declared argv array and retain full stdout, stderr, exit status, timing, counts, and the complete checked-documentation snapshot digest.
- Inputs: artifact:integrated-change
- Resources: —
- Permissions: read [.env.example, README.md, AUTHORS.md, CHANGELOG.md, CODE_OF_CONDUCT.md, CONTRIBUTING.md, SECURITY.md, SUPPORT.md, THIRD_PARTY_NOTICES.md, docs/, openwiki/, package.json, scripts/check-documentation.py]; write [—]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `10` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `none` — Reads repository documentation and emits validation evidence without changing project state.
- Rollback: none
- Approval required: `false`
- Acceptance:
  - `documentation-contract-passed` (test): The exact pnpm run docs:check command passes and reports the discovered Markdown count, local links and anchors checked, architecture documents indexed, architecture and OpenWiki source references checked, and documentation snapshot digest. Its passing status also proves production TUI terminology, README section order, prohibited roadmap-style current-state language, Markdown fence balance, and required single-H1 structure satisfy scripts/check-documentation.py. Evidence: `runtime:evidence/verify-documentation/result.json`

### `verify-unit-tests` — Verify Unit Test Suite

- Goal: Run the configured SIM-ONE Alpha unit suite with real local embedding assets and WASM available, including agent/workspace ownership, approval/progress routing, connector-scoped session lifecycle, durable transcript projection, product artifact locking, memory scoping, and telemetry-redaction contracts.
- Executor instructions: Execute the exact repository script as an argv array and retain full stdout, stderr, exit status, timing, and declared artifact digests.
- Inputs: artifact:integrated-change
- Resources: project:typescript-test-output
- Permissions: read [authorized project tree, node_modules/, src/tests/architecture-contract.test.ts, src/tests/workspace-loader.test.ts, src/tests/coding-worker.test.ts, src/tests/coding-worker-internal-subagents.test.ts, src/tests/research-agent.test.ts, src/tests/approval-ingress.test.ts, src/tests/flue-session-store.test.ts, src/tests/memory-tool.test.ts, src/tests/memory-telemetry.test.ts, src/tests/trusted-event-admission.test.ts, src/tests/flue-telemetry.test.ts, src/tests/http-endpoints.test.ts, src/tests/session-routing.test.ts, src/tests/session-transcript.test.ts, src/tests/build-script-regressions.test.ts, scripts/product-artifact-lock.test.mjs]; write [.tmp/tsc/, .gorombo test runtime state, /tmp SIM-ONE unit-test runtime roots]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `40` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Writes only documented generated build or test artifacts.
- Rollback: Regenerate the documented build or test artifacts from the prior reviewed commit.
- Approval required: `false`
- Acceptance:
  - `verification-passed` (test): All required unit tests pass; any skips are recorded and do not hide a missing required model or WASM artifact. Evidence: `runtime:evidence/verify-unit-tests/result.json`
  - `workspace-boundary-tests-passed` (test): The unit report proves architecture-contract.test.ts, workspace-loader.test.ts, coding-worker.test.ts, coding-worker-internal-subagents.test.ts, and research-agent.test.ts passed, including main/worker/internal workspace composition, runtime-root scoping, and lead-only delegation. Evidence: `runtime:evidence/verify-unit-tests/workspace-boundary-tests.json`
  - `approval-progress-routing-passed` (test): The unit report proves approval-ingress.test.ts and coding-worker.test.ts passed, covering typed approval/progress events, durable routing, tool execution progress, and worker handoffs without claiming TUI rendering that these TypeScript tests do not exercise. Evidence: `runtime:evidence/verify-unit-tests/approval-progress-tests.json`
  - `session-memory-privacy-passed` (test): The unit report proves flue-session-store.test.ts, memory-tool.test.ts, memory-telemetry.test.ts, trusted-event-admission.test.ts, flue-telemetry.test.ts, and http-endpoints.test.ts passed, including actor/conversation scoping, trusted-event admission, raw-payload omission, and telemetry redaction. Evidence: `runtime:evidence/verify-unit-tests/session-memory-privacy-tests.json`
  - `tui-session-transcript-contracts-passed` (test): The unit report proves session-routing.test.ts, session-transcript.test.ts, and http-endpoints.test.ts passed, including fresh default TUI sessions, owner-scoped exact resume, missing-selector fallback, chronological transcript paging, immutable completed exchanges, stream-offset handoff, and exclusion of private startup, tool, and nested-worker content. Evidence: `runtime:evidence/verify-unit-tests/tui-session-transcript-tests.json`
  - `product-build-contracts-passed` (test): The unit report proves build-script-regressions.test.ts and product-artifact-lock.test.mjs passed, including imported built-in Flue skill discovery and serialized packaged-product test artifacts. Evidence: `runtime:evidence/verify-unit-tests/product-build-contract-tests.json`

### `verify-rust-tests` — Verify Rust Project Tests

- Goal: Run the configured Rust project tests for the memory engine and Rust TUI crates.
- Executor instructions: Execute the exact repository script as an argv array and retain full stdout, stderr, exit status, timing, and declared artifact digests.
- Inputs: artifact:integrated-change
- Resources: project:rust-target
- Permissions: read [authorized project tree, node_modules/, tui/ratatui/tests/agent_client.rs, tui/ratatui/tests/event_reducer.rs, tui/ratatui/tests/history_client.rs, tui/ratatui/tests/input_mapping.rs, tui/ratatui/tests/terminal_interaction.rs, tui/ratatui/tests/ui_render.rs, tui/ratatui/tests/app_state.rs]; write [target/]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `40` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Writes only documented generated build or test artifacts.
- Rollback: Regenerate the documented build or test artifacts from the prior reviewed commit.
- Approval required: `false`
- Acceptance:
  - `verification-passed` (test): Every configured Rust project test passes under the pinned toolchain. Evidence: `runtime:evidence/verify-rust-tests/result.json`
  - `tui-progress-rendering-passed` (test): The Rust report proves the TUI event reducer and application state handle thinking, tool, and delegated-task progress, while the rendered terminal surface proves thinking and tool rows and preserves stream state; delegated-task rendering and approval UI require separate evidence. Evidence: `runtime:evidence/verify-rust-tests/tui-progress-rendering.json`
  - `tui-session-transcript-interaction-passed` (test): The Rust report proves durable transcript pages and live events converge in one document, completed responses remain immutable, newest and prepended history preserve viewport anchors, live-tail reaches the rendered bottom, and keyboard, multiline prompt, command-palette, mouse selection, copy, and scrollbar behavior remain covered. Evidence: `runtime:evidence/verify-rust-tests/tui-session-transcript-interaction.json`
  - `tui-work-pane-passed` (test): Rust state, rendering, and interaction tests prove the required TUI work pane has responsive sizing, constrained-terminal behavior, independent task scrolling, task mutation, and transcript/prompt focus isolation. Evidence: `runtime:evidence/verify-rust-tests/tui-work-pane.json`

### `build-runtime` — Build Flue Runtime

- Goal: Build the Node-target SIM-ONE Alpha Flue runtime and copy configuration, imported built-in Flue skills, registries, persona workspaces, and memory WASM into the product artifact.
- Executor instructions: Execute the exact repository script as an argv array and retain full stdout, stderr, exit status, timing, and declared artifact digests.
- Inputs: artifact:integrated-change, artifact:typecheck-report, artifact:unit-test-report, artifact:rust-test-report
- Resources: project:runtime-build-output
- Permissions: read [authorized project tree, node_modules/]; write [.gorombo/sim-one-alpha/, .tmp/, dist-flue/, crates/gorombo-memory/pkg/, target/]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `40` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Writes only documented generated build or test artifacts.
- Rollback: Regenerate the documented build or test artifacts from the prior reviewed commit.
- Approval required: `false`
- Acceptance:
  - `verification-passed` (test): The Flue Node build succeeds and the runtime server, config, builtin registry, imported greeting-preflight skill, main persona workspace, and WASM memory artifact are present with recorded digests. Evidence: `runtime:evidence/build-runtime/result.json`

### `build-sim-one-tui` — Build SIM-ONE TUI

- Goal: Build the release-mode SIM-ONE TUI binary and copy it into the product artifact.
- Executor instructions: Execute the exact repository script as an argv array and retain full stdout, stderr, exit status, timing, and declared artifact digests.
- Inputs: artifact:integrated-change, artifact:runtime-build
- Resources: project:sim-one-tui-build-output
- Permissions: read [authorized project tree, node_modules/]; write [target/release/, .gorombo/sim-one-ratatui/]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `40` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Writes only documented generated build or test artifacts.
- Rollback: Regenerate the documented build or test artifacts from the prior reviewed commit.
- Approval required: `false`
- Acceptance:
  - `verification-passed` (test): The SIM-ONE TUI release build succeeds and the product binary exists with an executable mode and recorded digest. Evidence: `runtime:evidence/build-sim-one-tui/result.json`

### `build-cli` — Build SIM-ONE CLI

- Goal: Build the TypeScript sim-one command launcher and capability-management CLI that selects the packaged SIM-ONE TUI by default.
- Executor instructions: Execute the exact repository script as an argv array and retain full stdout, stderr, exit status, timing, and declared artifact digests.
- Inputs: artifact:integrated-change, artifact:runtime-build
- Resources: project:cli-build-output
- Permissions: read [authorized project tree, node_modules/]; write [.gorombo/sim-one-cli/]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `25` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Writes only documented generated build or test artifacts.
- Rollback: Regenerate the documented build or test artifacts from the prior reviewed commit.
- Approval required: `false`
- Acceptance:
  - `verification-passed` (test): The CLI build succeeds and cli.js plus the platform launchers sim-one and sim-one.cmd have recorded digests. Evidence: `runtime:evidence/build-cli/result.json`

### `build-release-package` — Build Versioned Release Package

- Goal: Rebuild the exact typed versioned SIM-ONE release package and checksum manifest from the immutable merged main-branch candidate consumed by pre-publication verification and approved GitHub release publication.
- Executor instructions: Bind the exact packaging argv and output paths introduced by artifact:implementation-plan before execution. Check out the immutable merged main-branch commit recorded by artifact:release-candidate, rebuild the runtime, SIM-ONE TUI, and CLI using the verified build contracts, create sim-one.sh and the versioned archive, generate the checksum manifest from final bytes, and record candidate commit, tree digest, paths, sizes, modes, and SHA-256 digests. Refuse a worktree or build output not provably bound to that commit, plus undeclared files, mutable runtime state, configuration, databases, and secrets.
- Inputs: artifact:implementation-plan, artifact:release-candidate, artifact:runtime-build, artifact:sim-one-tui-build, artifact:cli-build, artifact:beta-release-contract
- Resources: project:release-package-output
- Permissions: read [artifact:implementation-plan, artifact:release-candidate, artifact:runtime-build, artifact:sim-one-tui-build, artifact:cli-build, artifact:beta-release-contract, release packaging files assigned exclusively by artifact:implementation-plan]; write [release-package staging files assigned exclusively by artifact:implementation-plan]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `30` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Writes only generated release-package staging files and checksum evidence.
- Rollback: Remove the generated staging files and rebuild the package from the same reviewed commit and typed build artifacts.
- Approval required: `false`
- Acceptance:
  - `release-package-assembled` (artifact): The exact versioned release-candidate archive is rebuilt from the immutable merged main-branch commit and contains the reviewed runtime, SIM-ONE TUI, sim-one command, sim-one.sh entrypoint, service assets, and required metadata without user data, runtime databases, local configuration, or secrets. Evidence: `runtime:evidence/build-release-package/archive.json`
  - `release-package-checksums-bound` (policy): The checksum manifest covers every distributed archive and installer byte, binds their SHA-256 digests to the exact merged main-branch candidate commit, tree digest, and version, and is recorded together with archive paths, sizes, executable modes, and platform scope. Evidence: `runtime:evidence/build-release-package/checksums.json`

### `verify-cli-behavior` — Verify CLI Behavior

- Goal: Prove the packaged sim-one launcher exposes its documented command surface and delegates startup to the built SIM-ONE TUI product path.
- Executor instructions: Execute the exact repository script as an argv array and retain full stdout, stderr, exit status, timing, and declared artifact digests.
- Inputs: artifact:runtime-build, artifact:sim-one-tui-build, artifact:cli-build
- Resources: local-runtime-probe
- Permissions: read [authorized project tree, node_modules/]; write [.gorombo test runtime state]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `5` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — May write temporary local packaged-runtime state while exercising SIM-ONE TUI startup.
- Rollback: Remove the isolated test runtime state or regenerate it from the reviewed build.
- Approval required: `false`
- Acceptance:
  - `verification-passed` (test): The platform sim-one launcher exits zero for --help, prints the documented SIM-ONE Alpha capability-management surface, and completes --smoke-startup through the packaged SIM-ONE TUI launcher rather than merely proving cli.js exists. Evidence: `runtime:evidence/verify-cli-behavior/result.json`

### `verify-http-integration` — Verify Built HTTP Runtime

- Goal: Exercise the built HTTP server routes, authentication boundaries, connector-scoped session lifecycle, durable transcript projection, and chat/runtime behavior.
- Executor instructions: Execute the exact repository script as an argv array and retain full stdout, stderr, exit status, timing, and declared artifact digests.
- Inputs: artifact:runtime-build
- Resources: local-runtime-probe
- Permissions: read [authorized project tree, node_modules/]; write [.gorombo test runtime state, /tmp SIM-ONE HTTP test runtime root]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `20` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Writes only documented generated build or test artifacts.
- Rollback: Regenerate the documented build or test artifacts from the prior reviewed commit.
- Approval required: `false`
- Acceptance:
  - `verification-passed` (test): The configured built-HTTP integration suite passes and proves response behavior, not only that a process or port exists. Evidence: `runtime:evidence/verify-http-integration/result.json`
  - `session-resume-boundary-passed` (test): The built HTTP suite rejects an explicit session resume from a different actor/conversation and returns the expected authorization failure. Evidence: `runtime:evidence/verify-http-integration/session-resume-boundary.json`
  - `tui-session-lifecycle-passed` (test): The built HTTP suite proves fresh TUI session creation, exact owned id-or-name resume, missing-selector fresh fallback, duplicate-name rejection, and separation from Telegram connector persistence. Evidence: `runtime:evidence/verify-http-integration/tui-session-lifecycle.json`
  - `durable-transcript-projection-passed` (test): The built HTTP suite returns newest chronological transcript pages with stable cursors and nextOffset while preserving prompt/final correlation and excluding private startup instructions, raw tool results, and nested-worker responses. Evidence: `runtime:evidence/verify-http-integration/durable-transcript-projection.json`

### `verify-sim-one-tui` — Verify Packaged SIM-ONE TUI

- Goal: Prove the packaged sim-one command launches the SIM-ONE TUI, manages fresh and resumed sessions, restores durable transcripts, preserves terminal interaction, submits a real prompt, and renders the authoritative assistant response.
- Executor instructions: Execute the exact repository script as an argv array and retain full stdout, stderr, exit status, timing, and declared artifact digests.
- Inputs: artifact:runtime-build, artifact:sim-one-tui-build, artifact:cli-build, artifact:beta-release-contract
- Resources: local-runtime-probe
- Permissions: read [authorized project tree, node_modules/]; write [.gorombo test runtime configuration, /tmp SIM-ONE TUI product runtime root]; external [configured model-provider HTTPS endpoint declared by project model cards]; destructive `false`
- Execution: max `2` attempt(s), `15` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Writes only documented generated build or test artifacts.
- Rollback: Regenerate the documented build or test artifacts from the prior reviewed commit.
- Approval required: `false`
- Acceptance:
  - `verification-passed` (test): The product smoke records a real assistant response of valid content; binary or process existence alone is insufficient. Evidence: `runtime:evidence/verify-sim-one-tui/result.json`
  - `packaged-launch-and-session-lifecycle-passed` (test): The product smoke launches through .gorombo/sim-one-cli/sim-one, proves consecutive default launches create distinct fresh durable sessions, verifies workspace-derived greeting-preflight behavior, and resumes an exact owned id or explicit name without sending a second greeting. Evidence: `runtime:evidence/verify-sim-one-tui/packaged-session-lifecycle.json`
  - `transcript-replay-live-convergence-passed` (test): The product smoke restores newest and older transcript pages, attaches strictly after snapshot nextOffset, preserves completed exchanges, deduplicates reconnect replay, hides private and nested output, and renders one authoritative Markdown final in terminal order. Evidence: `runtime:evidence/verify-sim-one-tui/transcript-replay-live-convergence.json`
  - `interactive-terminal-controls-passed` (test): On the canonical POSIX host, the packaged PTY evidence proves prompt editing and multiline submission remain active during transcript scrollback, command-palette selection works, mouse selection and copy do not exit, history prepend preserves the visible anchor, and scrollbar/live-tail controls reach the true transcript ends; cross-platform terminal-event coverage remains separately owned by verify-rust-tests. Evidence: `runtime:evidence/verify-sim-one-tui/interactive-terminal-controls.json`
  - `session-command-surface-passed` (test): The product smoke proves /new, /clear, /session, /sessions, /compact, /resume, /rename, and /exit operate through the active TUI connector session and preserve the documented header, status, and exit identity behavior. Evidence: `runtime:evidence/verify-sim-one-tui/session-command-surface.json`
  - `work-pane-product-behavior-passed` (test): Packaged terminal evidence proves the required work pane renders at supported widths, uses the planned constrained-terminal view, scrolls independently, mutates durable task state, and leaves transcript and prompt interaction intact. Evidence: `runtime:evidence/verify-sim-one-tui/work-pane-product-behavior.json`

### `verify-onboarding-distribution` — Verify SIM-ONE Onboarding And Distribution

- Goal: Prove the versioned SIM-ONE release candidate installs with integrity, onboards from a clean user environment, manages its runtime, and launches the finished product without a source checkout before publication.
- Executor instructions: Run the exact isolated packaging, installer, onboarding, command, and service-adapter probes introduced by the implementation plan. Bind their argv commands and expected artifacts before execution. Use temporary HOME and runtime roots; do not install or restart the host production service. Preserve full stdout, stderr, exit status, timing, digests, and output-level health evidence.
- Inputs: artifact:integrated-change, artifact:runtime-build, artifact:sim-one-tui-build, artifact:cli-build, artifact:beta-release-contract, artifact:release-package
- Resources: local-runtime-probe, isolated-packaged-install-probe
- Permissions: read [authorized project tree, artifact:beta-release-contract, artifact:release-package, node_modules/, release-package paths and digests declared by artifact:release-package]; write [/tmp SIM-ONE onboarding test home, /tmp SIM-ONE packaged runtime root, isolated service-manager test state]; external [configured model-provider HTTPS endpoint declared by project model cards]; destructive `false`
- Execution: max `2` attempt(s), `45` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Creates only isolated temporary installation, onboarding, runtime, and service-test state.
- Rollback: Remove the isolated test roots and regenerate the package from the reviewed commit.
- Approval required: `false`
- Acceptance:
  - `package-install-passed` (test): A pre-publication isolated clean-home probe reads the exact versioned release-candidate archive and checksum manifest, verifies checksums before extraction, installs without a source checkout, and launches the packaged product from an arbitrary working directory. Evidence: `runtime:evidence/verify-onboarding-distribution/package-install.json`
  - `packaged-onboarding-passed` (test): REL-ONB-001: the packaged sim-one install flow validates configuration, protects secrets, obtains a real model response, and opens the first secure SIM-ONE TUI session with output-level evidence. Evidence: `runtime:evidence/verify-onboarding-distribution/onboarding.json`
  - `lifecycle-commands-passed` (test): REL-OPS-001: isolated command probes prove config, doctor, status, start, restart, and stop behavior for local-process and service-managed modes without mutating the host production service. Evidence: `runtime:evidence/verify-onboarding-distribution/lifecycle-commands.json`
  - `distribution-evidence-honest` (policy): The verification records exact platform coverage, archive and binary digests, temporary runtime roots, provider response evidence, and any unproved platform or service behavior that must block release. Evidence: `runtime:evidence/verify-onboarding-distribution/evidence-scope.json`

### `verify-tui-e2e` — Verify Gateway And CLI Smoke

- Goal: Exercise the direct built-gateway model path and built CLI help surface without treating this narrow smoke as packaged SIM-ONE TUI end-to-end evidence.
- Executor instructions: Execute the exact repository script as an argv array and retain full stdout, stderr, exit status, timing, and declared artifact digests.
- Inputs: artifact:runtime-build, artifact:cli-build
- Resources: local-runtime-probe
- Permissions: read [authorized project tree, node_modules/]; write [.gorombo test runtime state, /tmp SIM-ONE TUI test runtime root]; external [configured model-provider HTTPS endpoint declared by project model cards]; destructive `false`
- Execution: max `2` attempt(s), `15` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Writes only documented generated build or test artifacts.
- Rollback: Regenerate the documented build or test artifacts from the prior reviewed commit.
- Approval required: `false`
- Acceptance:
  - `gateway-prompt-passed` (test): The configured smoke posts through the built gateway agent route and receives a nonempty, non-error assistant response. Evidence: `runtime:evidence/verify-tui-e2e/gateway-prompt.json`
  - `cli-smoke-passed` (test): The built CLI --help command exits zero and returns a nonempty command surface. Evidence: `runtime:evidence/verify-tui-e2e/cli-smoke.json`
  - `evidence-scope-honest` (policy): This node reports only direct gateway prompt and CLI-help behavior. Packaged sim-one/SIM-ONE TUI launch, sessions, transcript replay, interaction, and visible-final behavior belong to verify-sim-one-tui; approval routing and typed progress belong to unit evidence; missing user-visible approval or subagent end-to-end proof remains an architecture-review blocker. Evidence: `runtime:evidence/verify-tui-e2e/evidence-scope.json`

### `verify-memory-smoke` — Verify Real Memory Runtime

- Goal: Exercise the real WASM memory engine, SQLite durability, retrieval, and Coding Worker memory path end to end.
- Executor instructions: Execute the exact repository script as an argv array and retain full stdout, stderr, exit status, timing, and declared artifact digests.
- Inputs: artifact:runtime-build, artifact:memory-wasm, artifact:embedding-model-assets
- Resources: local-runtime-probe
- Permissions: read [authorized project tree, node_modules/]; write [.tmp/tsc/, .gorombo test memory state, /tmp SIM-ONE memory smoke runtime root]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `20` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Writes only documented generated build or test artifacts.
- Rollback: Regenerate the documented build or test artifacts from the prior reviewed commit.
- Approval required: `false`
- Acceptance:
  - `verification-passed` (test): The deterministic memory smoke proves mutation, restart durability, scoped retrieval, and Coding Worker integration through the real WASM path. Evidence: `runtime:evidence/verify-memory-smoke/result.json`

### `aggregate-verification` — Aggregate Verification Evidence

- Goal: Map fresh pre-merge project verification evidence to the candidate contract, preserve explicit mandatory post-merge package and onboarding gates, and identify any unproved behavior, skipped requirement, or stale artifact.
- Executor instructions: Inspect full outputs and target behavior. Reject coverage claims based only on a narrow test, successful command, process, port, or artifact existence.
- Inputs: artifact:typecheck-report, artifact:unit-test-report, artifact:documentation-verification-report, artifact:rust-test-report, artifact:runtime-build, artifact:sim-one-tui-product-report, artifact:cli-behavior-report, artifact:http-test-report, artifact:tui-e2e-report, artifact:memory-smoke-report
- Resources: —
- Permissions: read [all verification evidence, artifact:change-contract, Git diff]; write [—]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `60` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `none` — Produces evidence without mutating project or external state.
- Rollback: none
- Approval required: `false`
- Acceptance:
  - `all-criteria-mapped` (review): Every change-contract criterion names current direct evidence or is explicitly marked unproved and blocks release. Evidence: `runtime:evidence/aggregate-verification/coverage-map.json`
  - `no-false-positive-status` (policy): Positive status claims rely on correct current output or target-system effects, not process, port, session, file, or command existence. Evidence: `runtime:evidence/aggregate-verification/output-proof-review.json`
  - `product-evidence-scopes-separated` (review): The coverage map keeps direct gateway/CLI smoke, built HTTP session/transcript behavior, Rust TUI state/rendering, packaged sim-one/SIM-ONE TUI PTY behavior, and post-merge isolated onboarding/distribution probes as distinct evidence scopes and rejects claims that exceed the probe that produced them. Evidence: `runtime:evidence/aggregate-verification/product-evidence-scope.json`
  - `release-ledger-coverage-complete` (review): Every required release and planned-work ID maps to one producing member and mandatory verification path. Candidate merge requires complete pre-merge evidence, while REL-PKG-001, REL-PKG-002, REL-ONB-001, and REL-OPS-001 remain fail-closed on the explicit post-merge package build and onboarding/distribution verification path before production approval. Evidence: `runtime:evidence/aggregate-verification/release-ledger-coverage.json`

### `review-architecture-security` — Review Architecture, Security, And Product Boundaries

- Goal: Review the integrated change and verification summary for Flue ownership, instruction and persona workspace boundaries, Coding Worker runtime-root scope, trusted context, approval gates, durable progress, product identity, secret boundaries, and release-document accuracy, clarity, and scanability.
- Executor instructions: Perform a fresh review independent of implementation self-report. Confirm user-visible behavior, fail-closed mutations, research ownership, workspace instruction composition, lead-only worker exposure, internal-subagent ownership, runtime-root scoping, disjoint parallel file ownership, documented rollback, and release-document accuracy and readability.
- Inputs: artifact:integrated-change, artifact:verification-summary
- Resources: —
- Permissions: read [artifact:integrated-change, artifact:verification-summary, AGENTS.md, AUTHORS.md, CHANGELOG.md, CODE_OF_CONDUCT.md, CONTRIBUTING.md, LICENSE, README.md, SECURITY.md, SUPPORT.md, THIRD_PARTY_NOTICES.md, docs/README.md, docs/architecture/, docs/getting-started/, docs/guides/, docs/operations/, docs/reference/, docs/tui/, openwiki/, src/AGENTS.md, src/workspace-loader.ts, src/agents/orchestrator.ts, src/workspace/, src/engine/workers/*/workspace/, src/engine/workers/coding-worker/subagents/*/workspace/, src/tests/architecture-contract.test.ts, src/tests/workspace-loader.test.ts, src/tests/coding-worker.test.ts, src/tests/coding-worker-internal-subagents.test.ts, src/tests/research-agent.test.ts]; write [—]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `90` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `none` — Produces evidence without mutating project or external state.
- Rollback: none
- Approval required: `false`
- Acceptance:
  - `architecture-contract-passes` (policy): The change preserves the local Flue map, company/main-agent/lead-worker/internal-subagent instruction ownership, orchestrator/worker/tool/skill/protocol/registry boundaries, and required typed contracts. Evidence: `runtime:evidence/review-architecture-security/architecture.json`
  - `trust-boundaries-pass` (policy): Model-selected inputs cannot choose trusted actor, project, repository, credential, approval, or external destination boundaries. Evidence: `runtime:evidence/review-architecture-security/security.json`
  - `progress-contract-passes` (review): Every tool execution, subagent delegation, verification, approval, and state transition reaches the user through durable typed progress events. Evidence: `runtime:evidence/review-architecture-security/progress.json`
  - `workspace-boundaries-pass` (policy): src/AGENTS.md remains company-owned; src/workspace/ remains the main-agent persona workspace even when used as the default Coding Worker runtime root; built-in lead workers and Coding Worker internal subagents compose only their own workspace guidance; runtime-loaded user workers remain capability profiles; and only lead workers are orchestrator-addressable. Evidence: `runtime:evidence/review-architecture-security/workspaces.json`
  - `parallel-ownership-passes` (review): The final diff matches the plan's one-producer-per-file matrix; any shared file was serialized or reconciled by integration with no hidden parallel overwrite. Evidence: `runtime:evidence/review-architecture-security/file-ownership.json`
  - `verification-claims-match-probes` (review): Every release claim is mapped to a probe that actually exercises it. Direct gateway/CLI smoke, built HTTP session/transcript tests, TypeScript approval/progress tests, Rust TUI state/rendering tests, packaged SIM-ONE TUI PTY tests, isolated onboarding/distribution tests, and any user-visible approval/subagent end-to-end evidence remain distinct; missing applicable evidence blocks approval. Evidence: `runtime:evidence/review-architecture-security/probe-claim-map.json`
  - `release-documentation-reviewed` (review): Release documentation is source-accurate, uses clear topic and paragraph boundaries, remains scannable, and distinguishes current behavior, required release gates, and owner-scoped planned product work without making speculative promises. Evidence: `runtime:evidence/review-architecture-security/release-documentation.json`
  - `release-lineage-consistent` (review): The release ledger, graph members, owner scope decision, external plan lineage, and verification summary contain the same complete set of stable release IDs and no required item is hidden by a generic workstream. Evidence: `runtime:evidence/review-architecture-security/release-lineage.json`

### `approve-release-candidate` — Approve Release Candidate Publication

- Goal: Let the project owner approve or reject the exact diff, verification summary, architecture/security review, commit, pull request, required-check, merge, main-readback, rollback, and GitHub effects.
- Executor instructions: Review the exact candidate tree and diff, evidence, target main branch, required checks, merge strategy, and rollback. Approval is bound to this run, graph checksum, candidate tree digest, GitHub mutation scope, approver, and time.
- Inputs: artifact:verification-summary, artifact:architecture-security-review
- Resources: —
- Permissions: read [artifact:verification-summary, artifact:architecture-security-review, Git diff]; write [—]; external [—]; destructive `false`
- Execution: max `1` attempt(s), `1440` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `none` — Produces evidence without mutating project or external state.
- Rollback: none
- Approval required: `false`
- Acceptance:
  - `owner-decision-recorded` (manual): The owner explicitly approves or rejects the exact candidate tree and diff, evidence digest, target main branch, commit creation, non-draft pull request, required-check policy, merge strategy, main-branch readback, and rollback. Evidence: `runtime:approval/approve-release-candidate`

### `publish-release-candidate` — Publish And Merge Release Candidate

- Goal: Commit the authorized change, push its branch, open and verify a non-draft pull request to main, merge it only after required checks pass, and prove the immutable candidate exists on main.
- Executor instructions: Use non-interactive Git and GitHub commands only after current graph-bound approval. Create the exact approved commit, push its branch, open a non-draft pull request to main, verify base, head, tree digest, required checks, merge strategy, and URL, merge only after all required checks pass, then fetch and read main back to bind the immutable merged commit and tree digest. Stop on drift, failed checks, approval mismatch, or an unexpected merge result.
- Inputs: artifact:release-candidate-approval, artifact:architecture-security-review
- Resources: external:github-repository
- Permissions: read [authorized worktree, artifact:release-candidate-approval, GitHub repository metadata]; write [authorized Git branch, GitHub pull request, approved main-branch merge of the exact candidate]; external [Git remote push, GitHub API pull request write, GitHub API approval-bound pull request merge after required checks]; destructive `false`
- Execution: max `2` attempt(s), `30` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Creates the approved Git commit, remote branch, pull request, and required-check-gated main-branch merge.
- Rollback: Before merge, close the pull request; after merge, use a separately approved revert pull request while preserving Git and review history.
- Approval required: `true`
- Acceptance:
  - `commit-scope-correct` (policy): The candidate commit contains only authorized files and generated/source artifacts intended for review, and its tree digest exactly matches the owner-approved diff. Evidence: `runtime:evidence/publish-release-candidate/commit-scope.json`
  - `pull-request-verified` (probe): The candidate pull request is non-draft, targets main, uses the expected head branch and approved merge strategy, exposes a stable URL, and has every required check completed successfully before merge. Evidence: `runtime:evidence/publish-release-candidate/pr-view.json`
  - `candidate-merged-and-read-back` (probe): The candidate pull request is merged only after required checks pass, and a fresh main-branch readback binds the immutable merged commit, tree digest, PR URL, merge strategy, and approval without relying on an open PR or submitted merge request as success. Evidence: `runtime:evidence/publish-release-candidate/main-readback.json`

### `approve-canary` — Approve Canary Deployment

- Goal: Let the project owner approve the exact release candidate, canary target, probe plan, rollback, and observation window.
- Executor instructions: Review the candidate and canary contract. Approval is target-specific and expires when the graph or candidate changes.
- Inputs: artifact:release-candidate
- Resources: —
- Permissions: read [artifact:release-candidate, canary deployment contract]; write [—]; external [—]; destructive `false`
- Execution: max `1` attempt(s), `1440` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `none` — Produces evidence without mutating project or external state.
- Rollback: none
- Approval required: `false`
- Acceptance:
  - `canary-authority-recorded` (manual): The owner explicitly approves or rejects the exact candidate, target, probe, rollback, and observation window. Evidence: `runtime:approval/approve-canary`

### `deploy-canary` — Deploy Approved Canary

- Goal: Deploy the exact approved release candidate to the declared canary environment with idempotency fencing and a concrete rollback path.
- Executor instructions: Use only the deployment adapter and target approved for this run. Record candidate digest, target, deployment ID, previous release, and rollback command.
- Inputs: artifact:release-candidate, artifact:canary-approval
- Resources: external:canary-environment
- Permissions: read [artifact:release-candidate, artifact:canary-approval, approved deployment credentials]; write [approved canary environment]; external [canary deployment API]; destructive `false`
- Execution: max `2` attempt(s), `60` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes the approved canary environment to the candidate release.
- Rollback: Use the recorded deployment adapter and previous-release identifier to restore the prior canary release.
- Approval required: `true`
- Acceptance:
  - `canary-deployment-bound` (policy): The deployment record binds the exact candidate digest, target, idempotency key, previous release, and rollback procedure. Evidence: `runtime:evidence/deploy-canary/deployment.json`
  - `deployment-admitted` (artifact): The target accepted the deployment, without treating submission or process existence as behavioral success. Evidence: `runtime:evidence/deploy-canary/admission.json`

### `verify-canary-behavior` — Verify Canary Behavior

- Goal: Prove the canary produces correct user-visible and system-visible behavior across gateway, orchestrator, protocols, memory, workers, progress, and changed product surfaces.
- Executor instructions: Run the approved output-level probes against the canary. Inspect responses, durable side effects, telemetry, and connector/UI visibility; do not infer health from a process or port.
- Inputs: artifact:canary-deployment
- Resources: —
- Permissions: read [artifact:canary-deployment, approved probe credentials, canary telemetry]; write [—]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `240` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `none` — Produces evidence without mutating project or external state.
- Rollback: none
- Approval required: `false`
- Acceptance:
  - `changed-behavior-proved` (probe): Every changed user-visible behavior and required target-system side effect passes against the canary. Evidence: `runtime:evidence/verify-canary-behavior/behavior.json`
  - `runtime-boundaries-proved` (probe): Protocol loading, trusted context, memory/RAG ownership, worker delegation, and progress delivery behave correctly in the running canary. Evidence: `runtime:evidence/verify-canary-behavior/runtime-boundaries.json`
  - `canary-observation-window-complete` (policy): The approved observation window completes without unresolved regression, security, durability, or telemetry evidence. Evidence: `runtime:evidence/verify-canary-behavior/window.json`

### `approve-production-release` — Approve Release Assets And Production

- Goal: Let the project owner approve or reject the exact private asset stage, production release, and post-observation public release using the candidate, canary behavior, rollback, and production observation plan.
- Executor instructions: Review current canary evidence, the exact release-candidate archive and checksum manifest, private GitHub draft target, immutable version tag, production risk, and the rule that public release is forbidden until successful production observation. Approval is target-specific, graph-bound, candidate-bound, manifest-bound, staged-release-bound, and time-bound.
- Inputs: artifact:release-candidate, artifact:canary-behavior-report, artifact:onboarding-distribution-report, artifact:release-package
- Resources: —
- Permissions: read [artifact:release-candidate, artifact:canary-behavior-report, artifact:onboarding-distribution-report, artifact:release-package, production release contract]; write [—]; external [—]; destructive `false`
- Execution: max `1` attempt(s), `1440` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `none` — Produces evidence without mutating project or external state.
- Rollback: none
- Approval required: `false`
- Acceptance:
  - `production-authority-recorded` (manual): The owner explicitly approves or rejects the exact candidate, production target, private draft staging scope, immutable version tag, release-asset manifest and checksums, irreversible post-observation public GitHub release publication, production rollback, and publication compensation plan, acknowledging that downloaded bytes and the immutable tag cannot be retracted. Evidence: `runtime:approval/approve-production-release`

### `stage-release-assets` — Stage Approved Release Assets Privately

- Goal: Stage the exact approved SIM-ONE release archive, installer entrypoint, and checksums in a private GitHub draft that cannot be discovered or downloaded publicly before production succeeds.
- Executor instructions: Use only the GitHub release adapter authorized by artifact:production-release-approval. Refuse any existing public or mismatched version tag or release. Create a new draft GitHub release without pushing the public tag, upload the exact archive, sim-one.sh, and checksum manifest, then read the draft through authenticated APIs and prove anonymous discovery and download are unavailable. Record the draft release ID, proposed tag, target commit, asset IDs, names, sizes, and digests.
- Inputs: artifact:release-candidate, artifact:onboarding-distribution-report, artifact:production-release-approval, artifact:release-package
- Resources: external:github-repository
- Permissions: read [artifact:release-candidate, artifact:onboarding-distribution-report, artifact:production-release-approval, artifact:release-package, GitHub repository, tag, draft release, and asset metadata]; write [approved private GitHub draft release, approved private GitHub draft release assets]; external [GitHub Releases API private draft release and asset write]; destructive `false`
- Execution: max `2` attempt(s), `60` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Creates a private draft release and private staged assets without creating a public tag or release.
- Rollback: Delete the private draft release and its staged assets by recorded draft and asset IDs while preserving the staging evidence; no public tag or release exists to withdraw.
- Approval required: `true`
- Acceptance:
  - `staged-release-assets-bound` (policy): The GitHub release record remains draft and non-public, no public version tag is pushed, and the private record binds the proposed tag, exact candidate commit, approval, draft asset IDs, archive names, byte sizes, and SHA-256 digests. Evidence: `runtime:evidence/stage-release-assets/draft-release.json`
  - `release-assets-staged-privately` (artifact): The approved private draft contains the exact versioned SIM-ONE archive, sim-one.sh entrypoint, and checksum manifest, exposes them only through authenticated staging APIs, and proves anonymous users cannot download or discover them. Evidence: `runtime:evidence/stage-release-assets/private-assets.json`

### `verify-staged-release-assets` — Verify Private Staged Release Assets

- Goal: Prove the approved private draft assets are inaccessible anonymously but authenticated-downloadable, integrity-verifiable, installable, and runnable without a source checkout.
- Executor instructions: Download only through the authenticated draft-release asset endpoints recorded by artifact:staged-release-assets. Verify draft state, proposed tag, target candidate commit, asset IDs, and anonymous inaccessibility; reconstruct and check the staged checksum chain before extraction; execute the installer and packaged product with temporary HOME and runtime roots from an arbitrary working directory; and preserve output-level evidence. Do not accept local build artifacts or public release state as staging proof.
- Inputs: artifact:staged-release-assets
- Resources: external:github-draft-release-assets, isolated-packaged-install-probe
- Permissions: read [artifact:staged-release-assets, 0.1.0 Beta packaging and installation contract]; write [/tmp SIM-ONE staged-release download root, /tmp SIM-ONE staged-release install home, /tmp SIM-ONE staged-release runtime root]; external [approved authenticated GitHub draft-release asset API endpoints, anonymous GitHub release and tag read probes]; destructive `false`
- Execution: max `2` attempt(s), `45` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Downloads private staged release assets through authenticated APIs and creates only isolated temporary installation and runtime state.
- Rollback: Remove the isolated download, installation, and runtime roots while preserving the private-stage verification evidence.
- Approval required: `false`
- Acceptance:
  - `private-release-stage-verified` (probe): The authenticated GitHub draft-release API exposes the documented archive, sim-one.sh entrypoint, and checksum manifest for the exact approved candidate while anonymous access and public tag lookup remain unavailable. Evidence: `runtime:evidence/verify-staged-release-assets/private-stage.json`
  - `rel-pkg-002-install-verified` (test): REL-PKG-002: an isolated clean-home probe downloads the private draft archive and checksum manifest through authenticated asset APIs, verifies checksums before extraction, rejects a tampered copy, installs without a source checkout, and launches the packaged product from an arbitrary working directory. Evidence: `runtime:evidence/verify-staged-release-assets/rel-pkg-002.json`
  - `staged-assets-evidence-honest` (policy): The report records authenticated API endpoints, anonymous-access probes, HTTP status, downloaded byte counts, proposed tag and commit identity, draft and asset IDs, archive and binary digests, platform coverage, temporary runtime roots, launch output, and every unproved platform behavior that must block production release. Evidence: `runtime:evidence/verify-staged-release-assets/evidence-scope.json`

### `release-production` — Release Approved Candidate

- Goal: Release the exact approved candidate to the declared production target with idempotency fencing and recorded rollback.
- Executor instructions: Use only the approved production adapter after private staged release-asset verification passes. Record candidate and staged-asset digests, deployment ID, previous release, idempotency key, and concrete rollback. Do not publish the GitHub release or mutate the repository release ledger.
- Inputs: artifact:release-candidate, artifact:canary-behavior-report, artifact:production-release-approval, artifact:staged-release-assets-report
- Resources: external:production-environment
- Permissions: read [approved candidate and production credentials, artifact:production-release-approval, artifact:staged-release-assets-report]; write [approved production environment]; external [production deployment API]; destructive `false`
- Execution: max `2` attempt(s), `90` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes the approved production environment to the candidate release.
- Rollback: Use the recorded production adapter and previous-release identifier to restore the prior production release.
- Approval required: `true`
- Acceptance:
  - `production-release-bound` (policy): The release record binds the exact candidate, verified private staged assets, target, approval, deployment ID, prior release, idempotency key, and rollback without making the release assets public. Evidence: `runtime:evidence/release-production/release.json`

### `observe-production` — Observe Production Outcomes

- Goal: Verify correct production behavior and durable target-system outcomes through the approved observation window.
- Executor instructions: Inspect real response behavior, connector delivery, durable state, worker progress, error rates, and changed product surfaces. On a verified release regression, invoke only the concrete rollback recorded in artifact:production-release under the owner authority recorded in artifact:production-release-approval; record the rollback deployment and output-level result, and move to needs_human if the rollback cannot be verified.
- Inputs: artifact:production-release, artifact:production-release-approval
- Resources: external:production-environment
- Permissions: read [artifact:production-release, artifact:production-release-approval, production probes, production telemetry]; write [approved production environment when the recorded rollback condition is met]; external [production deployment API for the pre-approved recorded rollback]; destructive `false`
- Execution: max `2` attempt(s), `1440` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Observes production and, only on a verified release regression, changes the approved production environment back to the recorded previous release.
- Rollback: Invoke the recorded rollback idempotently with the previous-release identifier; if restoration cannot be verified, stop further mutation, preserve evidence, and move the run to needs_human.
- Approval required: `true`
- Acceptance:
  - `production-behavior-proved` (probe): Changed behavior and required side effects are correct in production; process, port, deployment-job, or submission status alone is rejected. Evidence: `runtime:evidence/observe-production/behavior.json`
  - `production-window-complete` (policy): The approved observation window completes without unresolved regression, durability, security, or telemetry evidence. Evidence: `runtime:evidence/observe-production/window.json`
  - `production-rollback-accounted` (policy): The observation proves either that no rollback condition occurred or that the exact pre-approved recorded rollback was invoked, its deployment result was recorded, and the restored production behavior was verified before repair begins. Evidence: `runtime:evidence/observe-production/rollback.json`

### `publish-release-assets` — Publish Verified Assets After Production

- Goal: After successful production observation, expose the exact privately verified assets under the approved immutable tag and prove the resulting public GitHub release without changing staged bytes.
- Executor instructions: Use only the Git and GitHub release adapter authorized by artifact:production-release-approval. Re-read artifact:staged-release-assets, artifact:staged-release-assets-report, artifact:production-release, and artifact:production-observation. Refuse publication if the candidate was rolled back, observation failed, the draft or any asset changed, the proposed tag exists with a mismatched commit, or approval drifted. Push the approved immutable version tag, publish the exact existing draft without replacing asset bytes, then perform unauthenticated tag, release, and asset readback; download each public asset and prove its digest matches the staged record.
- Inputs: artifact:staged-release-assets, artifact:staged-release-assets-report, artifact:production-release, artifact:production-observation, artifact:production-release-approval
- Resources: external:github-repository, external:github-release-assets
- Permissions: read [artifact:staged-release-assets, artifact:staged-release-assets-report, artifact:production-release, artifact:production-observation, artifact:production-release-approval, GitHub repository, tag, draft release, public release, and asset metadata]; write [approved immutable version tag, approved public GitHub release state]; external [Git remote immutable version-tag push, GitHub Releases API approved draft publication, anonymous GitHub release asset download endpoints]; destructive `true`
- Execution: max `2` attempt(s), `60` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `destructive` — Irreversibly makes the approved immutable tag and previously private release assets publicly discoverable and downloadable after successful production observation; downloaded bytes cannot be retracted.
- Rollback: Compensation only: mark a defective public release as withdrawn and publish a corrected successor under separate approval; never claim rollback, rewrite the immutable version tag, replace published asset bytes, or erase publication evidence.
- Approval required: `true`
- Acceptance:
  - `production-success-gates-publication` (policy): Public release is blocked unless the complete production observation proves the exact candidate remains deployed, the observation window passed, no rollback occurred, and no unresolved regression, durability, security, or telemetry condition remains. Evidence: `runtime:evidence/publish-release-assets/production-gate.json`
  - `release-assets-published-from-stage` (artifact): The immutable version tag resolves to the exact staged candidate commit, the previously verified draft is published without changing any asset bytes or IDs, and the public GitHub release record binds tag, commit, approval, release URL, archive names, byte sizes, and SHA-256 digests. Evidence: `runtime:evidence/publish-release-assets/release.json`
  - `rel-pkg-001-publication-verified` (probe): REL-PKG-001 publication: anonymous GitHub tag, release, archive, sim-one.sh, and checksum-manifest requests succeed for the exact approved candidate, and downloaded byte digests exactly match the privately staged verification record. Evidence: `runtime:evidence/publish-release-assets/public-readback.json`

### `prepare-release-ledger-update` — Prepare Release Ledger Update

- Goal: Produce the exact immutable release-ledger diff that the owner can approve and the repository updater can apply without authoring new content after approval.
- Executor instructions: Read the verified published-release, production-release, and production-observation records plus the current main-branch release ledger. Construct the exact single-file patch and canonical proposal record with expected base commit and SHA-256. Do not modify the worktree, Git state, GitHub state, or release ledger.
- Inputs: artifact:published-release-assets-report, artifact:production-release, artifact:production-observation
- Resources: —
- Permissions: read [artifact:published-release-assets-report, artifact:production-release, artifact:production-observation, docs/getting-started/pre-release-status.md at the recorded main-branch commit]; write [—]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `30` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `none` — Produces a proposal artifact without mutating project or external state.
- Rollback: none
- Approval required: `false`
- Acceptance:
  - `release-ledger-proposal-bound` (artifact): The proposal contains the exact docs/getting-started/pre-release-status.md patch, expected base commit, target main branch, 0.1.0 Beta release date, immutable tag, release URL, candidate commit, asset digests, production release identifier, and proposal SHA-256. Evidence: `runtime:evidence/prepare-release-ledger-update/proposal.json`
  - `release-ledger-proposal-non-mutating` (policy): The proposal changes only the repository-owned release ledger, derives every release field from the accepted immutable records, performs no repository or GitHub mutation, and is independently consumable without being regenerated by the approver or updater. Evidence: `runtime:evidence/prepare-release-ledger-update/scope.json`

### `approve-release-ledger-update` — Approve Release Ledger Update

- Goal: Let the project owner approve or reject the exact repository mutation that records the successfully published 0.1.0 Beta release.
- Executor instructions: Review artifact:release-ledger-proposal and compare its expected base commit, canonical diff, proposal SHA-256, and release fields with the immutable published-release, production-release, and production-observation records. Approval is repository-specific, file-specific, proposal-digest-bound, release-record-bound, and time-bound. Do not author or alter the diff in this gate.
- Inputs: artifact:published-release-assets-report, artifact:production-release, artifact:production-observation, artifact:release-ledger-proposal
- Resources: —
- Permissions: read [artifact:published-release-assets-report, artifact:production-release, artifact:production-observation, artifact:release-ledger-proposal, docs/getting-started/pre-release-status.md, release-ledger diff and digest declared by artifact:release-ledger-proposal]; write [—]; external [—]; destructive `false`
- Execution: max `1` attempt(s), `1440` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `none` — Produces evidence without mutating project or external state.
- Rollback: none
- Approval required: `false`
- Acceptance:
  - `release-ledger-authority-recorded` (manual): The owner explicitly approves or rejects artifact:release-ledger-proposal by its exact proposal SHA-256, expected base commit, single-file diff, 0.1.0 Beta release date, immutable tag, release URL, candidate commit, asset digests, production release record, target repository, and rollback. Evidence: `runtime:approval/approve-release-ledger-update`

### `update-release-ledger` — Update Verified Release Ledger

- Goal: Record the verified 0.1.0 Beta publication in the repository-owned release ledger through an exact, separately approved, and independently verified GitHub mutation.
- Executor instructions: Verify artifact:release-ledger-proposal matches the proposal SHA-256 and base commit authorized by artifact:release-ledger-update-approval, then apply that diff byte-for-byte without regeneration. Use non-interactive Git and GitHub commands to commit the single authorized file, push an authorized branch, open a non-draft pull request to main, verify required checks, merge only that exact approved change, and read main back to compare the recorded date, tag, URL, commit, and digests with the immutable release records. Stop on any drift or approval mismatch.
- Inputs: artifact:published-release-assets-report, artifact:production-release, artifact:production-observation, artifact:release-ledger-update-approval, artifact:release-ledger-proposal
- Resources: external:github-repository
- Permissions: read [artifact:published-release-assets-report, artifact:production-release, artifact:production-observation, artifact:release-ledger-update-approval, artifact:release-ledger-proposal, docs/getting-started/pre-release-status.md, Git and GitHub repository metadata]; write [docs/getting-started/pre-release-status.md, authorized Git branch, GitHub pull request, approved main-branch merge of the exact release-ledger mutation]; external [Git remote push, GitHub API pull request write, GitHub API approval-bound pull request merge after required checks]; destructive `false`
- Execution: max `2` attempt(s), `120` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Commits, pushes, reviews, and merges the exact approved post-publication release-ledger mutation.
- Rollback: Use a separately approved follow-up pull request to correct the ledger while preserving the original release and repository history.
- Approval required: `true`
- Acceptance:
  - `rel-rel-001-release-date-recorded` (probe): REL-REL-001: docs/getting-started/pre-release-status.md records the 0.1.0 Beta release date only after successful asset publication and production observation, and its date, tag, release URL, candidate commit, and asset digests match the immutable release records. Evidence: `runtime:evidence/update-release-ledger/rel-rel-001.json`
  - `release-ledger-mutation-verified` (policy): The repository mutation applies artifact:release-ledger-proposal byte-for-byte at its approved base and exactly matches the proposal SHA-256 recorded by artifact:release-ledger-update-approval; it changes only the authorized release ledger, is committed on an authorized branch, passes required checks in a non-draft pull request to main, and is merged before completion. Evidence: `runtime:evidence/update-release-ledger/repository-mutation.json`
  - `release-ledger-main-state-verified` (probe): A fresh read of main proves the committed release ledger matches the immutable GitHub release and production release records rather than merely proving that a process, push, or pull request exists. Evidence: `runtime:evidence/update-release-ledger/main-ledger.json`

### `closeout-release` — Close Out And Preserve Evidence

- Goal: Record the shipped outcome, exact commit and PR/release references, verification and observation evidence, remaining risks, rollback, and follow-up work.
- Executor instructions: Update the task handoff and issue/PR records without erasing superseded evidence. Confirm the final graph-bound evidence and leave unrelated future work explicit.
- Inputs: artifact:release-candidate, artifact:production-observation, artifact:release-ledger-update
- Resources: plans:<topic>, external:github-repository
- Permissions: read [all graph evidence, Git and GitHub state, /opt/ai/plans/<topic>/]; write [/opt/ai/plans/<topic>/handoff.md, authorized issue or pull-request closeout fields]; external [GitHub issue or pull-request metadata write]; destructive `false`
- Execution: max `2` attempt(s), `60` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Writes the durable task handoff and authorized GitHub closeout metadata.
- Rollback: Restore the prior handoff revision and amend GitHub metadata while preserving the audit history.
- Approval required: `false`
- Acceptance:
  - `handoff-complete` (artifact): The closeout names files changed, commands and tests run, pass/fail results, approvals, PR/release URLs, immutable release assets, the verified repository ledger update, production evidence, assumptions, risks, rollback, and next step. Evidence: `runtime:evidence/closeout-release/handoff.json`
  - `history-preserved` (policy): Superseded evidence and failed attempts remain addressable through the append-only graph ledger and version control. Evidence: `runtime:evidence/closeout-release/history.json`

## Assumptions

- Each runtime run governs one explicitly authorized change against a named Git commit.
- The current commit is project context, not proof that historical implementation is verified.
- The project owner supplies target-specific authority for GitHub, private release-asset staging, irreversible post-observation public release, release-ledger, canary, and production mutations at the declared gates.
- Canary and production deployment commands remain adapter bindings until the project documents an approved deployment mechanism.
- Full live-model TUI probes require valid provider credentials supplied through the runtime environment, never stored in this graph.
- Every changed source, documentation, generated-definition, and focused-test file is assigned to exactly one implementation workstream; overlapping files are serialized or reconciled by integration.
- docs/getting-started/pre-release-status.md is the repository-owned stable release ledger; /opt/ai/plans/sim-one-ratatui-tui/, /opt/ai/plans/sim-one-build-structure/, and /opt/ai/plans/agent-tui/ remain detailed external source plans whose exact paths, byte sizes, and SHA-256 digests are bound into the baseline and beta approval rather than copied into the repository.
- Every stable release and planned-work ID in docs/getting-started/pre-release-status.md is required for 0.1.0 Beta; changing that fixed scope requires a new explicit owner decision and graph revision.
- The checked-in definition is deliberately bound to the canonical host checkout /opt/ai/sim-one-alpha under the project-local graph contract; review worktrees and CI clones may validate or render it, but executable claims require an explicit canonical-root authorization or a separately reviewed rebind.
- The configured pnpm run test:tui smoke proves only the direct built-gateway prompt path and CLI help surface; pnpm run test:tui:ratatui owns packaged sim-one/SIM-ONE TUI session, transcript, interaction, and visible-final evidence, while TypeScript and Rust suites own their narrower contracts.
- Company-owned src/AGENTS.md is an immutable input to ordinary implementation workstreams; changing it requires a separately scoped lifecycle and explicit owner human gate.
- A snapshot:sha256 project context version hashes a newline-delimited manifest of sorted Git-tracked and nonignored untracked files, excluding development-graph.json and development-graph.md; each record contains the project-relative path, a NUL separator, and the file SHA-256.

## Risks

- Architecture documents or Flue behavior may drift from the context commit; a changed instruction or dependency invalidates downstream evidence.
- A parallel domain may discover a shared contract overlap; the integration node must serialize the repair and preserve unrelated verified branches.
- External GitHub or deployment actions can have uncertain outcomes; adapters must use idempotency fencing, keep release assets private until production observation succeeds, and verify resulting state.
- The full verification matrix is intentionally expensive; omitting a required check requires explicit evidence and human review.
- The graph coordinator is not an operating-system sandbox or distributed scheduler; untrusted commands require an approved isolation layer.
- The path src/workspace/ is both the main-agent persona workspace and, by default, the Coding Worker runtime access root; lifecycle evidence must distinguish instruction ownership from sandbox/project scope and from worker-local persona workspaces.
- Executing deterministic nodes from a review worktree while project.root names the canonical main checkout could operate on the wrong tree; baseline evidence must reject any unapproved root mismatch before claims.
- External source plans contain historical implementation and package names and can change outside repository history; execution must verify their owner-approved digest manifest, then reconcile them against the repository release ledger, current architecture, and SIM-ONE TUI product terminology before assigning files or behavior.
- Current gateway and packaged SIM-ONE TUI probes do not by themselves prove user-visible approval or complete subagent progress; release review must require separate applicable evidence and reject overclaims.
- Release documentation may conflate implemented Git and GitHub approval with release-gated file write and patch approval, or overstate current critic, connector transport, scheduled trusted-event context or output delivery, verification, configuration, or admin-surface behavior; independent review must compare each current-source claim and documented setting with the exact runtime call path, route registration, trusted-context handoff, persisted result fields, connector delivery path, and configured test command while labeling unimplemented release contracts explicitly.

## Provenance and validation

Project instructions: /opt/ai/sim-one-alpha/AGENTS.md, /opt/ai/sim-one-alpha/src/AGENTS.md, /opt/ai/sim-one-alpha/docs/architecture/README.md, /opt/ai/sim-one-alpha/docs/architecture/overview.md, /opt/ai/sim-one-alpha/docs/architecture/execution-workflows.md, /opt/ai/sim-one-alpha/docs/architecture/protocol-system.md, /opt/ai/sim-one-alpha/docs/architecture/retrieval-and-research.md, /opt/ai/sim-one-alpha/docs/architecture/skill-system.md, /opt/ai/sim-one-alpha/docs/architecture/worker-system.md, /opt/ai/sim-one-alpha/docs/architecture/flue-architecture.md, /opt/ai/sim-one-alpha/docs/architecture/gorombo-flue-map.md, /opt/ai/sim-one-alpha/docs/architecture/product-flow.md, /opt/ai/sim-one-alpha/docs/architecture/registry-system.md, /opt/ai/sim-one-alpha/docs/architecture/tool-system.md, /opt/ai/sim-one-alpha/docs/architecture/capability-system.md, /opt/ai/sim-one-alpha/docs/architecture/memory-system.md, /opt/ai/sim-one-alpha/docs/architecture/tui-cli-session-flow.md, /opt/ai/sim-one-alpha/docs/operations/product-tui.md, /opt/ai/sim-one-alpha/docs/tui/ratatui.md, /opt/ai/sim-one-alpha/docs/tui/session-management.md, /opt/ai/sim-one-alpha/docs/getting-started/pre-release-status.md, /opt/ai/sim-one-alpha/.github/workflows/ci.yml

Canonical source: `development-graph.json`

Run these commands from the `graph-development` skill root after setting `PROJECT_ROOT` to this project's root:

```bash
: "${PROJECT_ROOT:?set PROJECT_ROOT to this project directory}"
python3 scripts/validate_graph.py "$PROJECT_ROOT/development-graph.json"
python3 scripts/render_graph.py "$PROJECT_ROOT/development-graph.json" --output "$PROJECT_ROOT/development-graph.md"
python3 scripts/validate_graph.py "$PROJECT_ROOT/development-graph.json" --markdown "$PROJECT_ROOT/development-graph.md"
```
