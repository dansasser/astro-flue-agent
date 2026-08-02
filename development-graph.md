<!-- development-graph-sha256: f88bcf472b396d00b4bcd46bc17ff90c5450489ee54046a9a8bce718067ea02e -->
<!-- Generated from canonical JSON. Do not edit by hand. -->
# SIM-ONE Alpha Development Lifecycle

Govern future SIM-ONE Alpha changes from an authorized request through grounded design, parallel domain implementation, full project verification, approval-gated release, output-level canary and production observation, and bounded repair.

## Graph metadata

| Field | Value |
|---|---|
| Graph ID | `sim-one-alpha-lifecycle` |
| Graph version | `75` |
| Schema version | `1` |
| Status | `validated` |
| Project | sim-one-alpha |
| Project root | `.` |
| Context version | `flue-v2-tui-e2e-repair:2026-08-02` |
| Templates | discovery-to-delivery, parallel-fanout-fanin, human-gate, bounded-feedback, rollback-observation, specification-to-delivery |
| Entry nodes | baseline-context |
| Terminal nodes | closeout-release |
| Canonical checksum | `f88bcf472b396d00b4bcd46bc17ff90c5450489ee54046a9a8bce718067ea02e` |

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
    n_resolve_d1_github_auth_strategy{"Resolve D1 GitHub Auth Strategy\\n(decision / planned)"}
    n_resolve_d2_workspace_root_isolation{"Resolve D2 Install-Relative Runtime Root\\n(decision / planned)"}
    n_resolve_d3_file_access_gate{"Resolve D3 File Access Gate\\n(decision / planned)"}
    n_resolve_d4_orchestrator_history_visibility{"Resolve D4 Orchestrator Worker Verification\\n(decision / needs_human)"}
    n_specify_release_reconciliation["Specify Reconciled 0.1.0 Release Work\\n(work / planned)"]
    n_verify_release_reconciliation_specifications(["Verify Reconciled Release Specifications\\n(verification / planned)"])
    n_implement_runtime_root_layout["Implement Install-Relative Runtime Root\\n(work / planned)"]
    n_implement_file_access_approval_gate["Implement File Access Approval Gate\\n(work / planned)"]
    n_implement_coding_worker_progress["Implement Live Coding Worker Progress\\n(work / planned)"]
    n_implement_coding_worker_github_flow["Implement Owner-Selected GitHub Flow\\n(work / planned)"]
    n_implement_coding_worker_scaffold_tooling["Implement Coding Scaffold Tooling\\n(work / planned)"]
    n_implement_orchestrator_worker_verification["Implement Orchestrator Worker Verification\\n(work / planned)"]
    n_implement_tui_message_queue["Implement TUI Message Queue\\n(work / planned)"]
    n_implement_tui_status_context_meter["Implement TUI Status And Context Meter\\n(work / planned)"]
    n_implement_tui_prompt_editor_polish["Implement TUI Prompt Cursor And Caret\\n(work / planned)"]
    n_implement_tui_thinking_transcript["Implement Persistent Thinking Transcript\\n(work / planned)"]
    n_implement_connector_approval_controls["Implement Connector Approval Controls\\n(work / planned)"]
    n_implement_image_reasoning_worker["Implement Image Reasoning Worker\\n(work / planned)"]
    n_implement_document_index["Implement Per-Database Document Index\\n(work / planned)"]
    n_implement_protocol_scoring["Implement Protocol Enforcement And Scoring\\n(work / planned)"]
    n_resolve_d5_canonical_runtime_configuration{"Resolve D5 Canonical Runtime Configuration\\n(decision / planned)"}
    n_implement_runtime_configuration_consolidation["Implement Canonical Runtime Configuration\\n(work / planned)"]
    n_verify_runtime_configuration_consolidation(["Verify Canonical Runtime Configuration\\n(verification / planned)"])
    n_resolve_d6_tui_approval_surface_placement{"Resolve D6 TUI Approval Surface Placement\\n(decision / planned)"}
    n_implement_capability_management_worker["Implement Capability Management Worker\\n(work / planned)"]
    n_implement_coding_worker_capability_authoring["Implement Coding Worker Capability Authoring\\n(work / planned)"]
    n_resolve_d7_separate_project_and_task_graphs{"Separate Project And Task Lifecycle Graphs\\n(decision / planned)"}
    n_resolve_d8_memory_helper_task_runs{"Extend Memory Helper For Durable Task Runs\\n(decision / planned)"}
    n_resolve_d9_flue_native_task_graph_runtime{"Use Flue-Native Task Graph Runtime\\n(decision / planned)"}
    n_resolve_d10_sealed_node_context{"Seal Per-Node Context Envelopes\\n(decision / planned)"}
    n_resolve_d11_shared_task_graph_engine{"Share Task Graph Engine Across Agents\\n(decision / planned)"}
    n_specify_task_lifecycle_architecture["Specify Task Lifecycle Graph Architecture\\n(work / planned)"]
    n_specify_flue_v2_migration["Specify Flue 2 Migration\\n(work / planned)"]
    n_migrate_flue_v2_foundation["Migrate Flue 2 Foundation\\n(work / planned)"]
    n_migrate_flue_v2_agents_workers["Migrate Flue 2 Agents And Workers\\n(work / planned)"]
    n_migrate_flue_v2_capabilities["Migrate Flue 2 Tools Skills MCP And Registries\\n(work / planned)"]
    n_migrate_flue_v2_execution_persistence["Migrate Flue 2 Execution Persistence And Observability\\n(work / planned)"]
    n_migrate_flue_v2_connectors_clients["Migrate Flue 2 Connectors And Clients\\n(work / planned)"]
    n_migrate_flue_v2_product_packaging["Migrate Flue 2 Product Packaging\\n(work / planned)"]
    n_migrate_flue_v2_documentation["Update Flue 2 Documentation\\n(work / planned)"]
    n_verify_flue_v2_production_migration(["Verify Flue 2 Production Migration\\n(verification / planned)"])
    n_resolve_d12_flue_v2_persistence_and_compaction{"Resolve Flue 2 Persistence History And Compaction\\n(decision / planned)"}
    n_repair_flue_v2_verification_regressions["Repair Flue 2 Verification Regressions\\n(work / planned)"]
    n_repair_flue_v2_memory_smoke_harness["Repair Flue 2 Memory Smoke Harness\\n(work / planned)"]
    n_repair_flue_v2_tui_e2e_harness["Repair Flue 2 TUI E2E Harness\\n(work / planned)"]
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
    n_approve_beta_release_contract -- "consumes" --> n_implement_core_contracts
    n_approve_beta_release_contract -- "consumes" --> n_implement_memory_retrieval
    n_approve_beta_release_contract -- "consumes" --> n_integrate_and_repair
    n_approve_beta_release_contract -- "approves" --> n_implement_core_contracts
    n_approve_beta_release_contract -- "approves" --> n_implement_agent_runtime
    n_approve_beta_release_contract -- "approves" --> n_implement_memory_retrieval
    n_approve_beta_release_contract -- "approves" --> n_implement_capabilities_security
    n_approve_beta_release_contract -- "approves" --> n_implement_ingress_operations
    n_approve_beta_release_contract -- "approves" --> n_implement_product_delivery
    n_approve_beta_release_contract -- "approves" --> n_integrate_and_repair
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
    n_integrate_and_repair -- "consumes" --> n_build_release_package
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
    n_approve_beta_release_contract -- "consumes" --> n_prepare_release_ledger_update
    n_aggregate_verification -- "consumes" --> n_prepare_release_ledger_update
    n_verify_onboarding_distribution -- "consumes" --> n_prepare_release_ledger_update
    n_build_release_package -- "consumes" --> n_prepare_release_ledger_update
    n_release_production -- "consumes" --> n_prepare_release_ledger_update
    n_observe_production -- "consumes" --> n_prepare_release_ledger_update
    n_publish_release_assets -- "consumes" --> n_approve_release_ledger_update
    n_approve_beta_release_contract -- "consumes" --> n_approve_release_ledger_update
    n_aggregate_verification -- "consumes" --> n_approve_release_ledger_update
    n_verify_onboarding_distribution -- "consumes" --> n_approve_release_ledger_update
    n_build_release_package -- "consumes" --> n_approve_release_ledger_update
    n_prepare_release_ledger_update -- "consumes" --> n_approve_release_ledger_update
    n_release_production -- "consumes" --> n_approve_release_ledger_update
    n_observe_production -- "consumes" --> n_approve_release_ledger_update
    n_approve_release_ledger_update -- "approves" --> n_update_release_ledger
    n_approve_release_ledger_update -- "consumes" --> n_update_release_ledger
    n_prepare_release_ledger_update -- "consumes" --> n_update_release_ledger
    n_publish_release_assets -- "consumes" --> n_update_release_ledger
    n_approve_beta_release_contract -- "consumes" --> n_update_release_ledger
    n_aggregate_verification -- "consumes" --> n_update_release_ledger
    n_verify_onboarding_distribution -- "consumes" --> n_update_release_ledger
    n_build_release_package -- "consumes" --> n_update_release_ledger
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
    n_integrate_and_repair -. "invalidates" .-> n_build_release_package
    n_integrate_and_repair -. "invalidates" .-> n_aggregate_verification
    n_integrate_and_repair -. "invalidates" .-> n_review_architecture_security
    n_integrate_and_repair -. "invalidates" .-> n_approve_release_candidate
    n_integrate_and_repair -. "invalidates" .-> n_publish_release_candidate
    n_integrate_and_repair -. "invalidates" .-> n_verify_documentation
    n_integrate_and_repair -. "invalidates" .-> n_verify_unit_tests
    n_integrate_and_repair -. "invalidates" .-> n_verify_rust_tests
    n_integrate_and_repair -. "invalidates" .-> n_verify_onboarding_distribution
    n_integrate_and_repair -. "invalidates" .-> n_verify_sim_one_tui
    n_approve_production_release -- "approves" --> n_observe_production
    n_approve_production_release -- "consumes" --> n_observe_production
    n_baseline_context -- "consumes" --> n_specify_release_reconciliation
    n_baseline_context -. "invalidates" .-> n_specify_release_reconciliation
    n_baseline_context -- "consumes" --> n_resolve_d1_github_auth_strategy
    n_baseline_context -. "invalidates" .-> n_resolve_d1_github_auth_strategy
    n_specify_release_reconciliation -- "consumes" --> n_resolve_d1_github_auth_strategy
    n_specify_release_reconciliation -. "invalidates" .-> n_resolve_d1_github_auth_strategy
    n_specify_release_reconciliation -- "consumes" --> n_resolve_d1_github_auth_strategy
    n_specify_release_reconciliation -. "invalidates" .-> n_resolve_d1_github_auth_strategy
    n_specify_release_reconciliation -- "consumes" --> n_resolve_d1_github_auth_strategy
    n_specify_release_reconciliation -. "invalidates" .-> n_resolve_d1_github_auth_strategy
    n_specify_release_reconciliation -- "consumes" --> n_resolve_d1_github_auth_strategy
    n_specify_release_reconciliation -. "invalidates" .-> n_resolve_d1_github_auth_strategy
    n_specify_release_reconciliation -- "consumes" --> n_resolve_d1_github_auth_strategy
    n_specify_release_reconciliation -. "invalidates" .-> n_resolve_d1_github_auth_strategy
    n_baseline_context -- "consumes" --> n_resolve_d2_workspace_root_isolation
    n_baseline_context -. "invalidates" .-> n_resolve_d2_workspace_root_isolation
    n_specify_release_reconciliation -- "consumes" --> n_resolve_d2_workspace_root_isolation
    n_specify_release_reconciliation -. "invalidates" .-> n_resolve_d2_workspace_root_isolation
    n_specify_release_reconciliation -- "consumes" --> n_resolve_d2_workspace_root_isolation
    n_specify_release_reconciliation -. "invalidates" .-> n_resolve_d2_workspace_root_isolation
    n_specify_release_reconciliation -- "consumes" --> n_resolve_d2_workspace_root_isolation
    n_specify_release_reconciliation -. "invalidates" .-> n_resolve_d2_workspace_root_isolation
    n_specify_release_reconciliation -- "consumes" --> n_resolve_d2_workspace_root_isolation
    n_specify_release_reconciliation -. "invalidates" .-> n_resolve_d2_workspace_root_isolation
    n_baseline_context -- "consumes" --> n_resolve_d3_file_access_gate
    n_baseline_context -. "invalidates" .-> n_resolve_d3_file_access_gate
    n_specify_release_reconciliation -- "consumes" --> n_resolve_d3_file_access_gate
    n_specify_release_reconciliation -. "invalidates" .-> n_resolve_d3_file_access_gate
    n_specify_release_reconciliation -- "consumes" --> n_resolve_d3_file_access_gate
    n_specify_release_reconciliation -. "invalidates" .-> n_resolve_d3_file_access_gate
    n_specify_release_reconciliation -- "consumes" --> n_resolve_d3_file_access_gate
    n_specify_release_reconciliation -. "invalidates" .-> n_resolve_d3_file_access_gate
    n_specify_release_reconciliation -- "consumes" --> n_resolve_d3_file_access_gate
    n_specify_release_reconciliation -. "invalidates" .-> n_resolve_d3_file_access_gate
    n_baseline_context -- "consumes" --> n_resolve_d4_orchestrator_history_visibility
    n_baseline_context -. "invalidates" .-> n_resolve_d4_orchestrator_history_visibility
    n_specify_release_reconciliation -- "consumes" --> n_resolve_d4_orchestrator_history_visibility
    n_specify_release_reconciliation -. "invalidates" .-> n_resolve_d4_orchestrator_history_visibility
    n_specify_release_reconciliation -- "consumes" --> n_resolve_d4_orchestrator_history_visibility
    n_specify_release_reconciliation -. "invalidates" .-> n_resolve_d4_orchestrator_history_visibility
    n_specify_release_reconciliation -- "consumes" --> n_resolve_d4_orchestrator_history_visibility
    n_specify_release_reconciliation -. "invalidates" .-> n_resolve_d4_orchestrator_history_visibility
    n_specify_release_reconciliation -- "consumes" --> n_resolve_d4_orchestrator_history_visibility
    n_specify_release_reconciliation -. "invalidates" .-> n_resolve_d4_orchestrator_history_visibility
    n_specify_release_reconciliation -- "consumes" --> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -. "invalidates" .-> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -- "consumes" --> n_plan_implementation
    n_specify_release_reconciliation -. "invalidates" .-> n_plan_implementation
    n_specify_release_reconciliation -- "consumes" --> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -. "invalidates" .-> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -- "consumes" --> n_plan_implementation
    n_specify_release_reconciliation -. "invalidates" .-> n_plan_implementation
    n_specify_release_reconciliation -- "consumes" --> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -. "invalidates" .-> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -- "consumes" --> n_plan_implementation
    n_specify_release_reconciliation -. "invalidates" .-> n_plan_implementation
    n_specify_release_reconciliation -- "consumes" --> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -. "invalidates" .-> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -- "consumes" --> n_plan_implementation
    n_specify_release_reconciliation -. "invalidates" .-> n_plan_implementation
    n_specify_release_reconciliation -- "consumes" --> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -. "invalidates" .-> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -- "consumes" --> n_plan_implementation
    n_specify_release_reconciliation -. "invalidates" .-> n_plan_implementation
    n_specify_release_reconciliation -- "consumes" --> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -. "invalidates" .-> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -- "consumes" --> n_plan_implementation
    n_specify_release_reconciliation -. "invalidates" .-> n_plan_implementation
    n_specify_release_reconciliation -- "consumes" --> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -. "invalidates" .-> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -- "consumes" --> n_plan_implementation
    n_specify_release_reconciliation -. "invalidates" .-> n_plan_implementation
    n_specify_release_reconciliation -- "consumes" --> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -. "invalidates" .-> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -- "consumes" --> n_plan_implementation
    n_specify_release_reconciliation -. "invalidates" .-> n_plan_implementation
    n_specify_release_reconciliation -- "consumes" --> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -. "invalidates" .-> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -- "consumes" --> n_plan_implementation
    n_specify_release_reconciliation -. "invalidates" .-> n_plan_implementation
    n_specify_release_reconciliation -- "consumes" --> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -. "invalidates" .-> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -- "consumes" --> n_plan_implementation
    n_specify_release_reconciliation -. "invalidates" .-> n_plan_implementation
    n_specify_release_reconciliation -- "consumes" --> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -. "invalidates" .-> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -- "consumes" --> n_plan_implementation
    n_specify_release_reconciliation -. "invalidates" .-> n_plan_implementation
    n_specify_release_reconciliation -- "consumes" --> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -. "invalidates" .-> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -- "consumes" --> n_plan_implementation
    n_specify_release_reconciliation -. "invalidates" .-> n_plan_implementation
    n_specify_release_reconciliation -- "consumes" --> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -. "invalidates" .-> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -- "consumes" --> n_plan_implementation
    n_specify_release_reconciliation -. "invalidates" .-> n_plan_implementation
    n_resolve_d2_workspace_root_isolation -- "consumes" --> n_verify_release_reconciliation_specifications
    n_resolve_d2_workspace_root_isolation -. "invalidates" .-> n_verify_release_reconciliation_specifications
    n_resolve_d2_workspace_root_isolation -- "consumes" --> n_plan_implementation
    n_resolve_d2_workspace_root_isolation -. "invalidates" .-> n_plan_implementation
    n_resolve_d3_file_access_gate -- "consumes" --> n_verify_release_reconciliation_specifications
    n_resolve_d3_file_access_gate -. "invalidates" .-> n_verify_release_reconciliation_specifications
    n_resolve_d3_file_access_gate -- "consumes" --> n_plan_implementation
    n_resolve_d3_file_access_gate -. "invalidates" .-> n_plan_implementation
    n_verify_release_reconciliation_specifications -- "consumes" --> n_approve_beta_release_contract
    n_verify_release_reconciliation_specifications -- "validates" --> n_approve_beta_release_contract
    n_approve_beta_release_contract -- "approves" --> n_plan_implementation
    n_plan_implementation -- "consumes" --> n_implement_runtime_root_layout
    n_plan_implementation -. "invalidates" .-> n_implement_runtime_root_layout
    n_approve_beta_release_contract -- "consumes" --> n_implement_runtime_root_layout
    n_approve_beta_release_contract -. "invalidates" .-> n_implement_runtime_root_layout
    n_approve_beta_release_contract -- "approves" --> n_implement_runtime_root_layout
    n_plan_implementation -- "consumes" --> n_implement_file_access_approval_gate
    n_plan_implementation -. "invalidates" .-> n_implement_file_access_approval_gate
    n_approve_beta_release_contract -- "consumes" --> n_implement_file_access_approval_gate
    n_approve_beta_release_contract -. "invalidates" .-> n_implement_file_access_approval_gate
    n_approve_beta_release_contract -- "approves" --> n_implement_file_access_approval_gate
    n_plan_implementation -- "consumes" --> n_implement_coding_worker_progress
    n_plan_implementation -. "invalidates" .-> n_implement_coding_worker_progress
    n_approve_beta_release_contract -- "consumes" --> n_implement_coding_worker_progress
    n_approve_beta_release_contract -. "invalidates" .-> n_implement_coding_worker_progress
    n_approve_beta_release_contract -- "approves" --> n_implement_coding_worker_progress
    n_plan_implementation -- "consumes" --> n_implement_coding_worker_github_flow
    n_plan_implementation -. "invalidates" .-> n_implement_coding_worker_github_flow
    n_approve_beta_release_contract -- "consumes" --> n_implement_coding_worker_github_flow
    n_approve_beta_release_contract -. "invalidates" .-> n_implement_coding_worker_github_flow
    n_approve_beta_release_contract -- "approves" --> n_implement_coding_worker_github_flow
    n_plan_implementation -- "consumes" --> n_implement_coding_worker_scaffold_tooling
    n_plan_implementation -. "invalidates" .-> n_implement_coding_worker_scaffold_tooling
    n_approve_beta_release_contract -- "consumes" --> n_implement_coding_worker_scaffold_tooling
    n_approve_beta_release_contract -. "invalidates" .-> n_implement_coding_worker_scaffold_tooling
    n_approve_beta_release_contract -- "approves" --> n_implement_coding_worker_scaffold_tooling
    n_plan_implementation -- "consumes" --> n_implement_orchestrator_worker_verification
    n_plan_implementation -. "invalidates" .-> n_implement_orchestrator_worker_verification
    n_approve_beta_release_contract -- "consumes" --> n_implement_orchestrator_worker_verification
    n_approve_beta_release_contract -. "invalidates" .-> n_implement_orchestrator_worker_verification
    n_approve_beta_release_contract -- "approves" --> n_implement_orchestrator_worker_verification
    n_plan_implementation -- "consumes" --> n_implement_tui_message_queue
    n_plan_implementation -. "invalidates" .-> n_implement_tui_message_queue
    n_approve_beta_release_contract -- "consumes" --> n_implement_tui_message_queue
    n_approve_beta_release_contract -. "invalidates" .-> n_implement_tui_message_queue
    n_approve_beta_release_contract -- "approves" --> n_implement_tui_message_queue
    n_plan_implementation -- "consumes" --> n_implement_tui_status_context_meter
    n_plan_implementation -. "invalidates" .-> n_implement_tui_status_context_meter
    n_approve_beta_release_contract -- "consumes" --> n_implement_tui_status_context_meter
    n_approve_beta_release_contract -. "invalidates" .-> n_implement_tui_status_context_meter
    n_approve_beta_release_contract -- "approves" --> n_implement_tui_status_context_meter
    n_plan_implementation -- "consumes" --> n_implement_tui_prompt_editor_polish
    n_plan_implementation -. "invalidates" .-> n_implement_tui_prompt_editor_polish
    n_approve_beta_release_contract -- "consumes" --> n_implement_tui_prompt_editor_polish
    n_approve_beta_release_contract -. "invalidates" .-> n_implement_tui_prompt_editor_polish
    n_approve_beta_release_contract -- "approves" --> n_implement_tui_prompt_editor_polish
    n_plan_implementation -- "consumes" --> n_implement_tui_thinking_transcript
    n_plan_implementation -. "invalidates" .-> n_implement_tui_thinking_transcript
    n_approve_beta_release_contract -- "consumes" --> n_implement_tui_thinking_transcript
    n_approve_beta_release_contract -. "invalidates" .-> n_implement_tui_thinking_transcript
    n_approve_beta_release_contract -- "approves" --> n_implement_tui_thinking_transcript
    n_plan_implementation -- "consumes" --> n_implement_connector_approval_controls
    n_plan_implementation -. "invalidates" .-> n_implement_connector_approval_controls
    n_approve_beta_release_contract -- "consumes" --> n_implement_connector_approval_controls
    n_approve_beta_release_contract -. "invalidates" .-> n_implement_connector_approval_controls
    n_approve_beta_release_contract -- "approves" --> n_implement_connector_approval_controls
    n_plan_implementation -- "consumes" --> n_implement_image_reasoning_worker
    n_plan_implementation -. "invalidates" .-> n_implement_image_reasoning_worker
    n_approve_beta_release_contract -- "consumes" --> n_implement_image_reasoning_worker
    n_approve_beta_release_contract -. "invalidates" .-> n_implement_image_reasoning_worker
    n_approve_beta_release_contract -- "approves" --> n_implement_image_reasoning_worker
    n_plan_implementation -- "consumes" --> n_implement_document_index
    n_plan_implementation -. "invalidates" .-> n_implement_document_index
    n_approve_beta_release_contract -- "consumes" --> n_implement_document_index
    n_approve_beta_release_contract -. "invalidates" .-> n_implement_document_index
    n_approve_beta_release_contract -- "approves" --> n_implement_document_index
    n_plan_implementation -- "consumes" --> n_implement_protocol_scoring
    n_plan_implementation -. "invalidates" .-> n_implement_protocol_scoring
    n_approve_beta_release_contract -- "consumes" --> n_implement_protocol_scoring
    n_approve_beta_release_contract -. "invalidates" .-> n_implement_protocol_scoring
    n_approve_beta_release_contract -- "approves" --> n_implement_protocol_scoring
    n_implement_core_contracts -- "consumes" --> n_implement_runtime_root_layout
    n_implement_core_contracts -. "invalidates" .-> n_implement_runtime_root_layout
    n_implement_agent_runtime -- "consumes" --> n_implement_runtime_root_layout
    n_implement_agent_runtime -. "invalidates" .-> n_implement_runtime_root_layout
    n_implement_capabilities_security -- "consumes" --> n_implement_runtime_root_layout
    n_implement_capabilities_security -. "invalidates" .-> n_implement_runtime_root_layout
    n_implement_ingress_operations -- "consumes" --> n_implement_runtime_root_layout
    n_implement_ingress_operations -. "invalidates" .-> n_implement_runtime_root_layout
    n_implement_runtime_root_layout -- "consumes" --> n_implement_file_access_approval_gate
    n_implement_runtime_root_layout -. "invalidates" .-> n_implement_file_access_approval_gate
    n_implement_capabilities_security -- "consumes" --> n_implement_file_access_approval_gate
    n_implement_capabilities_security -. "invalidates" .-> n_implement_file_access_approval_gate
    n_implement_agent_runtime -- "consumes" --> n_implement_coding_worker_progress
    n_implement_agent_runtime -. "invalidates" .-> n_implement_coding_worker_progress
    n_implement_runtime_root_layout -- "consumes" --> n_implement_coding_worker_github_flow
    n_implement_runtime_root_layout -. "invalidates" .-> n_implement_coding_worker_github_flow
    n_implement_agent_runtime -- "consumes" --> n_implement_coding_worker_github_flow
    n_implement_agent_runtime -. "invalidates" .-> n_implement_coding_worker_github_flow
    n_implement_capabilities_security -- "consumes" --> n_implement_coding_worker_github_flow
    n_implement_capabilities_security -. "invalidates" .-> n_implement_coding_worker_github_flow
    n_implement_runtime_root_layout -- "consumes" --> n_implement_coding_worker_scaffold_tooling
    n_implement_runtime_root_layout -. "invalidates" .-> n_implement_coding_worker_scaffold_tooling
    n_implement_agent_runtime -- "consumes" --> n_implement_coding_worker_scaffold_tooling
    n_implement_agent_runtime -. "invalidates" .-> n_implement_coding_worker_scaffold_tooling
    n_implement_runtime_root_layout -- "consumes" --> n_implement_orchestrator_worker_verification
    n_implement_runtime_root_layout -. "invalidates" .-> n_implement_orchestrator_worker_verification
    n_implement_agent_runtime -- "consumes" --> n_implement_orchestrator_worker_verification
    n_implement_agent_runtime -. "invalidates" .-> n_implement_orchestrator_worker_verification
    n_implement_ingress_operations -- "consumes" --> n_implement_tui_message_queue
    n_implement_ingress_operations -. "invalidates" .-> n_implement_tui_message_queue
    n_implement_agent_runtime -- "consumes" --> n_implement_tui_message_queue
    n_implement_agent_runtime -. "invalidates" .-> n_implement_tui_message_queue
    n_implement_tui_message_queue -- "consumes" --> n_implement_tui_status_context_meter
    n_implement_tui_message_queue -. "invalidates" .-> n_implement_tui_status_context_meter
    n_implement_tui_status_context_meter -- "consumes" --> n_implement_tui_prompt_editor_polish
    n_implement_tui_status_context_meter -. "invalidates" .-> n_implement_tui_prompt_editor_polish
    n_implement_tui_prompt_editor_polish -- "consumes" --> n_implement_tui_thinking_transcript
    n_implement_tui_prompt_editor_polish -. "invalidates" .-> n_implement_tui_thinking_transcript
    n_implement_agent_runtime -- "consumes" --> n_implement_tui_thinking_transcript
    n_implement_agent_runtime -. "invalidates" .-> n_implement_tui_thinking_transcript
    n_implement_file_access_approval_gate -- "consumes" --> n_implement_connector_approval_controls
    n_implement_file_access_approval_gate -. "invalidates" .-> n_implement_connector_approval_controls
    n_implement_ingress_operations -- "consumes" --> n_implement_connector_approval_controls
    n_implement_ingress_operations -. "invalidates" .-> n_implement_connector_approval_controls
    n_implement_tui_thinking_transcript -- "consumes" --> n_implement_connector_approval_controls
    n_implement_tui_thinking_transcript -. "invalidates" .-> n_implement_connector_approval_controls
    n_implement_runtime_root_layout -- "consumes" --> n_implement_image_reasoning_worker
    n_implement_runtime_root_layout -. "invalidates" .-> n_implement_image_reasoning_worker
    n_implement_agent_runtime -- "consumes" --> n_implement_image_reasoning_worker
    n_implement_agent_runtime -. "invalidates" .-> n_implement_image_reasoning_worker
    n_implement_runtime_root_layout -- "consumes" --> n_implement_document_index
    n_implement_runtime_root_layout -. "invalidates" .-> n_implement_document_index
    n_implement_memory_retrieval -- "consumes" --> n_implement_document_index
    n_implement_memory_retrieval -. "invalidates" .-> n_implement_document_index
    n_implement_capabilities_security -- "consumes" --> n_implement_protocol_scoring
    n_implement_capabilities_security -. "invalidates" .-> n_implement_protocol_scoring
    n_implement_agent_runtime -- "consumes" --> n_implement_protocol_scoring
    n_implement_agent_runtime -. "invalidates" .-> n_implement_protocol_scoring
    n_resolve_d1_github_auth_strategy -- "consumes" --> n_implement_coding_worker_github_flow
    n_resolve_d1_github_auth_strategy -. "invalidates" .-> n_implement_coding_worker_github_flow
    n_resolve_d2_workspace_root_isolation -- "consumes" --> n_implement_runtime_root_layout
    n_resolve_d2_workspace_root_isolation -. "invalidates" .-> n_implement_runtime_root_layout
    n_resolve_d2_workspace_root_isolation -- "consumes" --> n_implement_file_access_approval_gate
    n_resolve_d2_workspace_root_isolation -. "invalidates" .-> n_implement_file_access_approval_gate
    n_resolve_d2_workspace_root_isolation -- "consumes" --> n_implement_coding_worker_github_flow
    n_resolve_d2_workspace_root_isolation -. "invalidates" .-> n_implement_coding_worker_github_flow
    n_resolve_d2_workspace_root_isolation -- "consumes" --> n_implement_coding_worker_scaffold_tooling
    n_resolve_d2_workspace_root_isolation -. "invalidates" .-> n_implement_coding_worker_scaffold_tooling
    n_resolve_d2_workspace_root_isolation -- "consumes" --> n_implement_orchestrator_worker_verification
    n_resolve_d2_workspace_root_isolation -. "invalidates" .-> n_implement_orchestrator_worker_verification
    n_resolve_d3_file_access_gate -- "consumes" --> n_implement_file_access_approval_gate
    n_resolve_d3_file_access_gate -. "invalidates" .-> n_implement_file_access_approval_gate
    n_resolve_d3_file_access_gate -- "consumes" --> n_implement_connector_approval_controls
    n_resolve_d3_file_access_gate -. "invalidates" .-> n_implement_connector_approval_controls
    n_resolve_d4_orchestrator_history_visibility -- "consumes" --> n_implement_orchestrator_worker_verification
    n_resolve_d4_orchestrator_history_visibility -. "invalidates" .-> n_implement_orchestrator_worker_verification
    n_implement_connector_approval_controls -- "consumes" --> n_implement_sim_one_tui_work_pane
    n_implement_connector_approval_controls -. "invalidates" .-> n_implement_sim_one_tui_work_pane
    n_implement_runtime_root_layout -- "consumes" --> n_implement_sim_one_onboarding_distribution
    n_implement_runtime_root_layout -. "invalidates" .-> n_implement_sim_one_onboarding_distribution
    n_implement_coding_worker_progress -- "consumes" --> n_integrate_and_repair
    n_implement_coding_worker_progress -. "invalidates" .-> n_integrate_and_repair
    n_implement_coding_worker_github_flow -- "consumes" --> n_integrate_and_repair
    n_implement_coding_worker_github_flow -. "invalidates" .-> n_integrate_and_repair
    n_implement_coding_worker_scaffold_tooling -- "consumes" --> n_integrate_and_repair
    n_implement_coding_worker_scaffold_tooling -. "invalidates" .-> n_integrate_and_repair
    n_implement_orchestrator_worker_verification -- "consumes" --> n_integrate_and_repair
    n_implement_orchestrator_worker_verification -. "invalidates" .-> n_integrate_and_repair
    n_implement_image_reasoning_worker -- "consumes" --> n_integrate_and_repair
    n_implement_image_reasoning_worker -. "invalidates" .-> n_integrate_and_repair
    n_implement_document_index -- "consumes" --> n_integrate_and_repair
    n_implement_document_index -. "invalidates" .-> n_integrate_and_repair
    n_implement_protocol_scoring -- "consumes" --> n_integrate_and_repair
    n_implement_protocol_scoring -. "invalidates" .-> n_integrate_and_repair
    n_resolve_d1_github_auth_strategy -- "consumes" --> n_verify_release_reconciliation_specifications
    n_resolve_d1_github_auth_strategy -. "invalidates" .-> n_verify_release_reconciliation_specifications
    n_resolve_d1_github_auth_strategy -- "consumes" --> n_plan_implementation
    n_resolve_d1_github_auth_strategy -. "invalidates" .-> n_plan_implementation
    n_baseline_context -- "consumes" --> n_resolve_d5_canonical_runtime_configuration
    n_specify_release_reconciliation -- "consumes" --> n_resolve_d5_canonical_runtime_configuration
    n_specify_release_reconciliation -. "invalidates" .-> n_resolve_d5_canonical_runtime_configuration
    n_specify_release_reconciliation -- "consumes" --> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -. "invalidates" .-> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -- "consumes" --> n_plan_implementation
    n_specify_release_reconciliation -. "invalidates" .-> n_plan_implementation
    n_specify_release_reconciliation -- "consumes" --> n_resolve_d5_canonical_runtime_configuration
    n_specify_release_reconciliation -. "invalidates" .-> n_resolve_d5_canonical_runtime_configuration
    n_specify_release_reconciliation -- "consumes" --> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -. "invalidates" .-> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -- "consumes" --> n_plan_implementation
    n_specify_release_reconciliation -. "invalidates" .-> n_plan_implementation
    n_specify_release_reconciliation -- "consumes" --> n_resolve_d5_canonical_runtime_configuration
    n_specify_release_reconciliation -. "invalidates" .-> n_resolve_d5_canonical_runtime_configuration
    n_specify_release_reconciliation -- "consumes" --> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -. "invalidates" .-> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -- "consumes" --> n_plan_implementation
    n_specify_release_reconciliation -. "invalidates" .-> n_plan_implementation
    n_specify_release_reconciliation -- "consumes" --> n_resolve_d5_canonical_runtime_configuration
    n_specify_release_reconciliation -. "invalidates" .-> n_resolve_d5_canonical_runtime_configuration
    n_specify_release_reconciliation -- "consumes" --> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -. "invalidates" .-> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -- "consumes" --> n_plan_implementation
    n_specify_release_reconciliation -. "invalidates" .-> n_plan_implementation
    n_specify_release_reconciliation -- "consumes" --> n_resolve_d5_canonical_runtime_configuration
    n_specify_release_reconciliation -. "invalidates" .-> n_resolve_d5_canonical_runtime_configuration
    n_specify_release_reconciliation -- "consumes" --> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -. "invalidates" .-> n_verify_release_reconciliation_specifications
    n_specify_release_reconciliation -- "consumes" --> n_plan_implementation
    n_specify_release_reconciliation -. "invalidates" .-> n_plan_implementation
    n_resolve_d5_canonical_runtime_configuration -- "consumes" --> n_verify_release_reconciliation_specifications
    n_resolve_d5_canonical_runtime_configuration -. "invalidates" .-> n_verify_release_reconciliation_specifications
    n_resolve_d5_canonical_runtime_configuration -- "consumes" --> n_plan_implementation
    n_resolve_d5_canonical_runtime_configuration -. "invalidates" .-> n_plan_implementation
    n_resolve_d5_canonical_runtime_configuration -- "consumes" --> n_implement_runtime_configuration_consolidation
    n_resolve_d5_canonical_runtime_configuration -. "invalidates" .-> n_implement_runtime_configuration_consolidation
    n_resolve_d5_canonical_runtime_configuration -- "consumes" --> n_verify_runtime_configuration_consolidation
    n_resolve_d5_canonical_runtime_configuration -. "invalidates" .-> n_verify_runtime_configuration_consolidation
    n_resolve_d5_canonical_runtime_configuration -- "consumes" --> n_implement_runtime_root_layout
    n_resolve_d5_canonical_runtime_configuration -. "invalidates" .-> n_implement_runtime_root_layout
    n_resolve_d5_canonical_runtime_configuration -- "consumes" --> n_implement_agent_runtime
    n_resolve_d5_canonical_runtime_configuration -. "invalidates" .-> n_implement_agent_runtime
    n_resolve_d5_canonical_runtime_configuration -- "consumes" --> n_implement_capabilities_security
    n_resolve_d5_canonical_runtime_configuration -. "invalidates" .-> n_implement_capabilities_security
    n_resolve_d5_canonical_runtime_configuration -- "consumes" --> n_implement_ingress_operations
    n_resolve_d5_canonical_runtime_configuration -. "invalidates" .-> n_implement_ingress_operations
    n_resolve_d5_canonical_runtime_configuration -- "consumes" --> n_implement_coding_worker_github_flow
    n_resolve_d5_canonical_runtime_configuration -. "invalidates" .-> n_implement_coding_worker_github_flow
    n_resolve_d5_canonical_runtime_configuration -- "consumes" --> n_implement_connector_approval_controls
    n_resolve_d5_canonical_runtime_configuration -. "invalidates" .-> n_implement_connector_approval_controls
    n_resolve_d5_canonical_runtime_configuration -- "consumes" --> n_implement_sim_one_onboarding_distribution
    n_resolve_d5_canonical_runtime_configuration -. "invalidates" .-> n_implement_sim_one_onboarding_distribution
    n_resolve_d5_canonical_runtime_configuration -- "consumes" --> n_build_release_package
    n_resolve_d5_canonical_runtime_configuration -. "invalidates" .-> n_build_release_package
    n_resolve_d5_canonical_runtime_configuration -- "consumes" --> n_verify_onboarding_distribution
    n_resolve_d5_canonical_runtime_configuration -. "invalidates" .-> n_verify_onboarding_distribution
    n_resolve_d5_canonical_runtime_configuration -- "consumes" --> n_implement_product_delivery
    n_resolve_d5_canonical_runtime_configuration -. "invalidates" .-> n_implement_product_delivery
    n_plan_implementation -- "consumes" --> n_implement_runtime_configuration_consolidation
    n_approve_beta_release_contract -- "consumes" --> n_implement_runtime_configuration_consolidation
    n_approve_beta_release_contract -- "approves" --> n_implement_runtime_configuration_consolidation
    n_implement_core_contracts -- "consumes" --> n_implement_runtime_configuration_consolidation
    n_implement_core_contracts -. "invalidates" .-> n_implement_runtime_configuration_consolidation
    n_implement_agent_runtime -- "consumes" --> n_implement_runtime_configuration_consolidation
    n_implement_agent_runtime -. "invalidates" .-> n_implement_runtime_configuration_consolidation
    n_implement_capabilities_security -- "consumes" --> n_implement_runtime_configuration_consolidation
    n_implement_capabilities_security -. "invalidates" .-> n_implement_runtime_configuration_consolidation
    n_implement_ingress_operations -- "consumes" --> n_implement_runtime_configuration_consolidation
    n_implement_ingress_operations -. "invalidates" .-> n_implement_runtime_configuration_consolidation
    n_implement_runtime_root_layout -- "consumes" --> n_implement_runtime_configuration_consolidation
    n_implement_runtime_root_layout -. "invalidates" .-> n_implement_runtime_configuration_consolidation
    n_implement_runtime_configuration_consolidation -- "consumes" --> n_implement_coding_worker_github_flow
    n_implement_runtime_configuration_consolidation -. "invalidates" .-> n_implement_coding_worker_github_flow
    n_implement_runtime_configuration_consolidation -- "consumes" --> n_implement_connector_approval_controls
    n_implement_runtime_configuration_consolidation -. "invalidates" .-> n_implement_connector_approval_controls
    n_implement_runtime_configuration_consolidation -- "consumes" --> n_implement_sim_one_onboarding_distribution
    n_implement_runtime_configuration_consolidation -. "invalidates" .-> n_implement_sim_one_onboarding_distribution
    n_implement_runtime_configuration_consolidation -- "consumes" --> n_implement_product_delivery
    n_implement_runtime_configuration_consolidation -. "invalidates" .-> n_implement_product_delivery
    n_implement_runtime_configuration_consolidation -- "consumes" --> n_integrate_and_repair
    n_implement_runtime_configuration_consolidation -. "invalidates" .-> n_integrate_and_repair
    n_implement_runtime_configuration_consolidation -- "consumes" --> n_verify_runtime_configuration_consolidation
    n_implement_runtime_configuration_consolidation -. "invalidates" .-> n_verify_runtime_configuration_consolidation
    n_integrate_and_repair -- "consumes" --> n_verify_runtime_configuration_consolidation
    n_integrate_and_repair -. "invalidates" .-> n_verify_runtime_configuration_consolidation
    n_build_runtime -- "consumes" --> n_verify_runtime_configuration_consolidation
    n_build_runtime -. "invalidates" .-> n_verify_runtime_configuration_consolidation
    n_build_sim_one_tui -- "consumes" --> n_verify_runtime_configuration_consolidation
    n_build_sim_one_tui -. "invalidates" .-> n_verify_runtime_configuration_consolidation
    n_build_cli -- "consumes" --> n_verify_runtime_configuration_consolidation
    n_build_cli -. "invalidates" .-> n_verify_runtime_configuration_consolidation
    n_verify_runtime_configuration_consolidation -- "consumes" --> n_aggregate_verification
    n_verify_runtime_configuration_consolidation -. "invalidates" .-> n_aggregate_verification
    n_verify_runtime_configuration_consolidation -- "consumes" --> n_build_release_package
    n_verify_runtime_configuration_consolidation -. "invalidates" .-> n_build_release_package
    n_verify_runtime_configuration_consolidation -- "consumes" --> n_verify_onboarding_distribution
    n_verify_runtime_configuration_consolidation -. "invalidates" .-> n_verify_onboarding_distribution
    n_baseline_context -- "consumes" --> n_resolve_d6_tui_approval_surface_placement
    n_baseline_context -. "invalidates" .-> n_resolve_d6_tui_approval_surface_placement
    n_specify_release_reconciliation -- "consumes" --> n_resolve_d6_tui_approval_surface_placement
    n_specify_release_reconciliation -. "invalidates" .-> n_resolve_d6_tui_approval_surface_placement
    n_specify_release_reconciliation -- "consumes" --> n_resolve_d6_tui_approval_surface_placement
    n_specify_release_reconciliation -. "invalidates" .-> n_resolve_d6_tui_approval_surface_placement
    n_specify_release_reconciliation -- "consumes" --> n_resolve_d6_tui_approval_surface_placement
    n_specify_release_reconciliation -. "invalidates" .-> n_resolve_d6_tui_approval_surface_placement
    n_specify_release_reconciliation -- "consumes" --> n_resolve_d6_tui_approval_surface_placement
    n_specify_release_reconciliation -. "invalidates" .-> n_resolve_d6_tui_approval_surface_placement
    n_resolve_d6_tui_approval_surface_placement -- "consumes" --> n_implement_tui_status_context_meter
    n_resolve_d6_tui_approval_surface_placement -. "invalidates" .-> n_implement_tui_status_context_meter
    n_resolve_d6_tui_approval_surface_placement -- "consumes" --> n_implement_connector_approval_controls
    n_resolve_d6_tui_approval_surface_placement -. "invalidates" .-> n_implement_connector_approval_controls
    n_implement_tui_status_context_meter -- "consumes" --> n_implement_connector_approval_controls
    n_implement_tui_status_context_meter -. "invalidates" .-> n_implement_connector_approval_controls
    n_resolve_d6_tui_approval_surface_placement -- "consumes" --> n_verify_release_reconciliation_specifications
    n_resolve_d6_tui_approval_surface_placement -. "invalidates" .-> n_verify_release_reconciliation_specifications
    n_resolve_d6_tui_approval_surface_placement -- "consumes" --> n_plan_implementation
    n_resolve_d6_tui_approval_surface_placement -. "invalidates" .-> n_plan_implementation
    n_plan_implementation -- "consumes" --> n_implement_capability_management_worker
    n_plan_implementation -. "invalidates" .-> n_implement_capability_management_worker
    n_approve_beta_release_contract -- "consumes" --> n_implement_capability_management_worker
    n_approve_beta_release_contract -- "approves" --> n_implement_capability_management_worker
    n_approve_beta_release_contract -. "invalidates" .-> n_implement_capability_management_worker
    n_implement_capabilities_security -- "consumes" --> n_implement_capability_management_worker
    n_implement_capabilities_security -. "invalidates" .-> n_implement_capability_management_worker
    n_implement_agent_runtime -- "consumes" --> n_implement_capability_management_worker
    n_implement_agent_runtime -. "invalidates" .-> n_implement_capability_management_worker
    n_resolve_d5_canonical_runtime_configuration -- "consumes" --> n_implement_capability_management_worker
    n_resolve_d5_canonical_runtime_configuration -. "invalidates" .-> n_implement_capability_management_worker
    n_implement_capability_management_worker -- "consumes" --> n_integrate_and_repair
    n_implement_capability_management_worker -. "invalidates" .-> n_integrate_and_repair
    n_plan_implementation -- "consumes" --> n_implement_coding_worker_capability_authoring
    n_plan_implementation -. "invalidates" .-> n_implement_coding_worker_capability_authoring
    n_approve_beta_release_contract -- "consumes" --> n_implement_coding_worker_capability_authoring
    n_approve_beta_release_contract -- "approves" --> n_implement_coding_worker_capability_authoring
    n_approve_beta_release_contract -. "invalidates" .-> n_implement_coding_worker_capability_authoring
    n_implement_capabilities_security -- "consumes" --> n_implement_coding_worker_capability_authoring
    n_implement_capabilities_security -. "invalidates" .-> n_implement_coding_worker_capability_authoring
    n_implement_coding_worker_scaffold_tooling -- "consumes" --> n_implement_coding_worker_capability_authoring
    n_implement_coding_worker_scaffold_tooling -. "invalidates" .-> n_implement_coding_worker_capability_authoring
    n_implement_file_access_approval_gate -- "consumes" --> n_implement_coding_worker_capability_authoring
    n_implement_file_access_approval_gate -. "invalidates" .-> n_implement_coding_worker_capability_authoring
    n_resolve_d2_workspace_root_isolation -- "consumes" --> n_implement_coding_worker_capability_authoring
    n_resolve_d2_workspace_root_isolation -. "invalidates" .-> n_implement_coding_worker_capability_authoring
    n_resolve_d5_canonical_runtime_configuration -- "consumes" --> n_implement_coding_worker_capability_authoring
    n_resolve_d5_canonical_runtime_configuration -. "invalidates" .-> n_implement_coding_worker_capability_authoring
    n_implement_coding_worker_capability_authoring -- "consumes" --> n_integrate_and_repair
    n_implement_coding_worker_capability_authoring -. "invalidates" .-> n_integrate_and_repair
    n_resolve_d7_separate_project_and_task_graphs -- "consumes" --> n_specify_task_lifecycle_architecture
    n_resolve_d8_memory_helper_task_runs -- "consumes" --> n_specify_task_lifecycle_architecture
    n_resolve_d9_flue_native_task_graph_runtime -- "consumes" --> n_specify_task_lifecycle_architecture
    n_resolve_d10_sealed_node_context -- "consumes" --> n_specify_task_lifecycle_architecture
    n_resolve_d11_shared_task_graph_engine -- "consumes" --> n_specify_task_lifecycle_architecture
    n_resolve_d7_separate_project_and_task_graphs -- "consumes" --> n_plan_implementation
    n_resolve_d7_separate_project_and_task_graphs -- "consumes" --> n_implement_core_contracts
    n_resolve_d7_separate_project_and_task_graphs -- "consumes" --> n_implement_agent_runtime
    n_resolve_d7_separate_project_and_task_graphs -- "consumes" --> n_implement_ingress_operations
    n_resolve_d7_separate_project_and_task_graphs -- "consumes" --> n_review_architecture_security
    n_resolve_d8_memory_helper_task_runs -- "consumes" --> n_plan_implementation
    n_resolve_d8_memory_helper_task_runs -- "consumes" --> n_implement_core_contracts
    n_resolve_d8_memory_helper_task_runs -- "consumes" --> n_implement_memory_retrieval
    n_resolve_d8_memory_helper_task_runs -- "consumes" --> n_implement_agent_runtime
    n_resolve_d8_memory_helper_task_runs -- "consumes" --> n_implement_sim_one_tui_work_pane
    n_resolve_d8_memory_helper_task_runs -- "consumes" --> n_verify_memory_smoke
    n_resolve_d8_memory_helper_task_runs -- "consumes" --> n_review_architecture_security
    n_resolve_d9_flue_native_task_graph_runtime -- "consumes" --> n_plan_implementation
    n_resolve_d9_flue_native_task_graph_runtime -- "consumes" --> n_implement_core_contracts
    n_resolve_d9_flue_native_task_graph_runtime -- "consumes" --> n_implement_agent_runtime
    n_resolve_d9_flue_native_task_graph_runtime -- "consumes" --> n_implement_ingress_operations
    n_resolve_d9_flue_native_task_graph_runtime -- "consumes" --> n_integrate_and_repair
    n_resolve_d9_flue_native_task_graph_runtime -- "consumes" --> n_review_architecture_security
    n_resolve_d10_sealed_node_context -- "consumes" --> n_plan_implementation
    n_resolve_d10_sealed_node_context -- "consumes" --> n_implement_core_contracts
    n_resolve_d10_sealed_node_context -- "consumes" --> n_implement_agent_runtime
    n_resolve_d10_sealed_node_context -- "consumes" --> n_implement_memory_retrieval
    n_resolve_d10_sealed_node_context -- "consumes" --> n_implement_capabilities_security
    n_resolve_d10_sealed_node_context -- "consumes" --> n_implement_ingress_operations
    n_resolve_d10_sealed_node_context -- "consumes" --> n_review_architecture_security
    n_resolve_d11_shared_task_graph_engine -- "consumes" --> n_plan_implementation
    n_resolve_d11_shared_task_graph_engine -- "consumes" --> n_implement_agent_runtime
    n_resolve_d11_shared_task_graph_engine -- "consumes" --> n_implement_ingress_operations
    n_resolve_d11_shared_task_graph_engine -- "consumes" --> n_integrate_and_repair
    n_resolve_d11_shared_task_graph_engine -- "consumes" --> n_implement_sim_one_tui_work_pane
    n_resolve_d11_shared_task_graph_engine -- "consumes" --> n_review_architecture_security
    n_specify_task_lifecycle_architecture -- "consumes" --> n_plan_implementation
    n_baseline_context -- "consumes" --> n_resolve_d10_sealed_node_context
    n_baseline_context -. "invalidates" .-> n_resolve_d10_sealed_node_context
    n_baseline_context -- "consumes" --> n_resolve_d11_shared_task_graph_engine
    n_baseline_context -. "invalidates" .-> n_resolve_d11_shared_task_graph_engine
    n_baseline_context -- "consumes" --> n_resolve_d7_separate_project_and_task_graphs
    n_baseline_context -. "invalidates" .-> n_resolve_d7_separate_project_and_task_graphs
    n_baseline_context -- "consumes" --> n_resolve_d8_memory_helper_task_runs
    n_baseline_context -. "invalidates" .-> n_resolve_d8_memory_helper_task_runs
    n_baseline_context -- "consumes" --> n_resolve_d9_flue_native_task_graph_runtime
    n_baseline_context -. "invalidates" .-> n_resolve_d9_flue_native_task_graph_runtime
    n_resolve_d9_flue_native_task_graph_runtime -. "invalidates" .-> n_implement_agent_runtime
    n_resolve_d9_flue_native_task_graph_runtime -. "invalidates" .-> n_implement_core_contracts
    n_resolve_d9_flue_native_task_graph_runtime -. "invalidates" .-> n_implement_ingress_operations
    n_resolve_d9_flue_native_task_graph_runtime -. "invalidates" .-> n_integrate_and_repair
    n_resolve_d9_flue_native_task_graph_runtime -. "invalidates" .-> n_plan_implementation
    n_resolve_d9_flue_native_task_graph_runtime -. "invalidates" .-> n_review_architecture_security
    n_resolve_d9_flue_native_task_graph_runtime -. "invalidates" .-> n_specify_task_lifecycle_architecture
    n_resolve_d8_memory_helper_task_runs -. "invalidates" .-> n_implement_agent_runtime
    n_resolve_d8_memory_helper_task_runs -. "invalidates" .-> n_implement_core_contracts
    n_resolve_d8_memory_helper_task_runs -. "invalidates" .-> n_implement_memory_retrieval
    n_resolve_d8_memory_helper_task_runs -. "invalidates" .-> n_implement_sim_one_tui_work_pane
    n_resolve_d8_memory_helper_task_runs -. "invalidates" .-> n_plan_implementation
    n_resolve_d8_memory_helper_task_runs -. "invalidates" .-> n_review_architecture_security
    n_resolve_d8_memory_helper_task_runs -. "invalidates" .-> n_specify_task_lifecycle_architecture
    n_resolve_d8_memory_helper_task_runs -. "invalidates" .-> n_verify_memory_smoke
    n_resolve_d7_separate_project_and_task_graphs -. "invalidates" .-> n_implement_agent_runtime
    n_resolve_d7_separate_project_and_task_graphs -. "invalidates" .-> n_implement_core_contracts
    n_resolve_d7_separate_project_and_task_graphs -. "invalidates" .-> n_implement_ingress_operations
    n_resolve_d7_separate_project_and_task_graphs -. "invalidates" .-> n_plan_implementation
    n_resolve_d7_separate_project_and_task_graphs -. "invalidates" .-> n_review_architecture_security
    n_resolve_d7_separate_project_and_task_graphs -. "invalidates" .-> n_specify_task_lifecycle_architecture
    n_resolve_d10_sealed_node_context -. "invalidates" .-> n_implement_agent_runtime
    n_resolve_d10_sealed_node_context -. "invalidates" .-> n_implement_capabilities_security
    n_resolve_d10_sealed_node_context -. "invalidates" .-> n_implement_core_contracts
    n_resolve_d10_sealed_node_context -. "invalidates" .-> n_implement_ingress_operations
    n_resolve_d10_sealed_node_context -. "invalidates" .-> n_implement_memory_retrieval
    n_resolve_d10_sealed_node_context -. "invalidates" .-> n_plan_implementation
    n_resolve_d10_sealed_node_context -. "invalidates" .-> n_review_architecture_security
    n_resolve_d10_sealed_node_context -. "invalidates" .-> n_specify_task_lifecycle_architecture
    n_resolve_d11_shared_task_graph_engine -. "invalidates" .-> n_implement_agent_runtime
    n_resolve_d11_shared_task_graph_engine -. "invalidates" .-> n_implement_ingress_operations
    n_resolve_d11_shared_task_graph_engine -. "invalidates" .-> n_implement_sim_one_tui_work_pane
    n_resolve_d11_shared_task_graph_engine -. "invalidates" .-> n_integrate_and_repair
    n_resolve_d11_shared_task_graph_engine -. "invalidates" .-> n_plan_implementation
    n_resolve_d11_shared_task_graph_engine -. "invalidates" .-> n_review_architecture_security
    n_resolve_d11_shared_task_graph_engine -. "invalidates" .-> n_specify_task_lifecycle_architecture
    n_specify_task_lifecycle_architecture -. "invalidates" .-> n_plan_implementation
    n_specify_task_lifecycle_architecture -- "consumes" --> n_review_architecture_security
    n_specify_task_lifecycle_architecture -. "invalidates" .-> n_review_architecture_security
    n_specify_task_lifecycle_architecture -- "consumes" --> n_verify_release_reconciliation_specifications
    n_specify_task_lifecycle_architecture -. "invalidates" .-> n_verify_release_reconciliation_specifications
    n_resolve_d7_separate_project_and_task_graphs -- "consumes" --> n_verify_release_reconciliation_specifications
    n_resolve_d7_separate_project_and_task_graphs -. "invalidates" .-> n_verify_release_reconciliation_specifications
    n_resolve_d8_memory_helper_task_runs -- "consumes" --> n_verify_release_reconciliation_specifications
    n_resolve_d8_memory_helper_task_runs -. "invalidates" .-> n_verify_release_reconciliation_specifications
    n_resolve_d9_flue_native_task_graph_runtime -- "consumes" --> n_verify_release_reconciliation_specifications
    n_resolve_d9_flue_native_task_graph_runtime -. "invalidates" .-> n_verify_release_reconciliation_specifications
    n_resolve_d10_sealed_node_context -- "consumes" --> n_verify_release_reconciliation_specifications
    n_resolve_d10_sealed_node_context -. "invalidates" .-> n_verify_release_reconciliation_specifications
    n_resolve_d11_shared_task_graph_engine -- "consumes" --> n_verify_release_reconciliation_specifications
    n_resolve_d11_shared_task_graph_engine -. "invalidates" .-> n_verify_release_reconciliation_specifications
    n_specify_task_lifecycle_architecture -- "consumes" --> n_integrate_and_repair
    n_specify_task_lifecycle_architecture -. "invalidates" .-> n_integrate_and_repair
    n_resolve_d7_separate_project_and_task_graphs -- "consumes" --> n_integrate_and_repair
    n_resolve_d7_separate_project_and_task_graphs -. "invalidates" .-> n_integrate_and_repair
    n_resolve_d8_memory_helper_task_runs -- "consumes" --> n_integrate_and_repair
    n_resolve_d8_memory_helper_task_runs -. "invalidates" .-> n_integrate_and_repair
    n_resolve_d10_sealed_node_context -- "consumes" --> n_integrate_and_repair
    n_resolve_d10_sealed_node_context -. "invalidates" .-> n_integrate_and_repair
    n_baseline_context -- "consumes" --> n_specify_task_lifecycle_architecture
    n_baseline_context -. "invalidates" .-> n_specify_task_lifecycle_architecture
    n_baseline_context -- "consumes" --> n_specify_flue_v2_migration
    n_baseline_context -. "invalidates" .-> n_specify_flue_v2_migration
    n_specify_flue_v2_migration -- "consumes" --> n_verify_release_reconciliation_specifications
    n_specify_flue_v2_migration -. "invalidates" .-> n_verify_release_reconciliation_specifications
    n_specify_flue_v2_migration -- "consumes" --> n_plan_implementation
    n_specify_flue_v2_migration -. "invalidates" .-> n_plan_implementation
    n_specify_flue_v2_migration -- "consumes" --> n_review_architecture_security
    n_specify_flue_v2_migration -. "invalidates" .-> n_review_architecture_security
    n_specify_flue_v2_migration -- "consumes" --> n_integrate_and_repair
    n_specify_flue_v2_migration -. "invalidates" .-> n_integrate_and_repair
    n_specify_flue_v2_migration -- "consumes" --> n_migrate_flue_v2_foundation
    n_specify_flue_v2_migration -. "invalidates" .-> n_migrate_flue_v2_foundation
    n_migrate_flue_v2_foundation -- "consumes" --> n_migrate_flue_v2_agents_workers
    n_migrate_flue_v2_foundation -. "invalidates" .-> n_migrate_flue_v2_agents_workers
    n_migrate_flue_v2_agents_workers -- "consumes" --> n_migrate_flue_v2_capabilities
    n_migrate_flue_v2_agents_workers -. "invalidates" .-> n_migrate_flue_v2_capabilities
    n_migrate_flue_v2_capabilities -- "consumes" --> n_migrate_flue_v2_execution_persistence
    n_migrate_flue_v2_capabilities -. "invalidates" .-> n_migrate_flue_v2_execution_persistence
    n_migrate_flue_v2_execution_persistence -- "consumes" --> n_migrate_flue_v2_connectors_clients
    n_migrate_flue_v2_execution_persistence -. "invalidates" .-> n_migrate_flue_v2_connectors_clients
    n_migrate_flue_v2_connectors_clients -- "consumes" --> n_migrate_flue_v2_product_packaging
    n_migrate_flue_v2_connectors_clients -. "invalidates" .-> n_migrate_flue_v2_product_packaging
    n_migrate_flue_v2_product_packaging -- "consumes" --> n_migrate_flue_v2_documentation
    n_migrate_flue_v2_product_packaging -. "invalidates" .-> n_migrate_flue_v2_documentation
    n_migrate_flue_v2_documentation -- "consumes" --> n_verify_flue_v2_production_migration
    n_migrate_flue_v2_documentation -. "invalidates" .-> n_verify_flue_v2_production_migration
    n_baseline_context -- "consumes" --> n_migrate_flue_v2_foundation
    n_baseline_context -. "invalidates" .-> n_migrate_flue_v2_foundation
    n_baseline_context -- "consumes" --> n_resolve_d12_flue_v2_persistence_and_compaction
    n_baseline_context -. "invalidates" .-> n_resolve_d12_flue_v2_persistence_and_compaction
    n_resolve_d12_flue_v2_persistence_and_compaction -- "consumes" --> n_migrate_flue_v2_execution_persistence
    n_resolve_d12_flue_v2_persistence_and_compaction -- "consumes" --> n_migrate_flue_v2_connectors_clients
    n_resolve_d12_flue_v2_persistence_and_compaction -- "consumes" --> n_migrate_flue_v2_product_packaging
    n_resolve_d12_flue_v2_persistence_and_compaction -- "consumes" --> n_migrate_flue_v2_documentation
    n_resolve_d12_flue_v2_persistence_and_compaction -- "consumes" --> n_verify_release_reconciliation_specifications
    n_resolve_d12_flue_v2_persistence_and_compaction -- "consumes" --> n_plan_implementation
    n_migrate_flue_v2_agents_workers -- "consumes" --> n_repair_flue_v2_verification_regressions
    n_migrate_flue_v2_execution_persistence -- "consumes" --> n_repair_flue_v2_verification_regressions
    n_migrate_flue_v2_documentation -- "consumes" --> n_repair_flue_v2_verification_regressions
    n_repair_flue_v2_verification_regressions -- "consumes" --> n_verify_flue_v2_production_migration
    n_migrate_flue_v2_capabilities -- "consumes" --> n_repair_flue_v2_memory_smoke_harness
    n_migrate_flue_v2_execution_persistence -- "consumes" --> n_repair_flue_v2_memory_smoke_harness
    n_repair_flue_v2_memory_smoke_harness -- "consumes" --> n_verify_flue_v2_production_migration
    n_migrate_flue_v2_connectors_clients -- "consumes" --> n_repair_flue_v2_tui_e2e_harness
    n_migrate_flue_v2_product_packaging -- "consumes" --> n_repair_flue_v2_tui_e2e_harness
    n_repair_flue_v2_tui_e2e_harness -- "consumes" --> n_verify_flue_v2_production_migration
```

## Nodes

| ID | Type | State | Executor | Goal | Outputs |
|---|---|---|---|---|---|
| `baseline-context` | `operation` | `planned` | agent: SIM-ONE project context adapter | Bind one authorized change request to the current SIM-ONE Alpha commit, applicable instructions, graph-owned planning artifacts, architecture contracts, affected domains, and external-effect boundaries. | artifact:baseline-context |
| `install-dependencies` | `operation` | `planned` | deterministic: pnpm frozen installer | Prepare the Node 22 and pnpm dependency tree from the committed lockfile without changing dependency intent. | artifact:dependency-environment |
| `fetch-embedding-model` | `operation` | `planned` | deterministic: SIM-ONE embedding model fetcher | Materialize the pinned local ONNX embedding model and tokenizer assets required by embedding and RAG verification. | artifact:embedding-model-assets |
| `build-wasm-memory` | `operation` | `planned` | deterministic: SIM-ONE wasm-pack builder | Compile the Rust structured-memory engine to the Node-compatible WASM artifact required by real memory execution. | artifact:memory-wasm |
| `define-change-contract` | `work` | `planned` | agent: SIM-ONE planning adapter | Turn the authorized request into a project-specific purpose, scope, non-goals, evidence plan, permission boundary, rollback, and user-visible progress contract. | artifact:change-contract, artifact:affected-domain-map |
| `approve-beta-release-contract` | `human_gate` | `planned` | human: SIM-ONE project owner | Bind the fixed owner decision that every stable release-ledger item and reconciled specification member is required for 0.1.0 Beta before architecture and implementation planning. | artifact:beta-release-contract |
| `decide-architecture` | `decision` | `planned` | agent: SIM-ONE architecture adapter | Choose the smallest design that satisfies the change contract while preserving SIM-ONE Alpha domain ownership and Flue architecture. | artifact:architecture-decision |
| `plan-implementation` | `work` | `planned` | agent: SIM-ONE implementation planning adapter | Produce the repository-owned executable implementation lineage for every required 0.1.0 member, with exact file ownership, decision boundaries, evidence, approval scopes, and rollback under the development graph. | artifact:implementation-plan |
| `implement-core-contracts` | `work` | `planned` | agent: SIM-ONE Coding Worker lead | Implement authorized changes to shared types, Valibot schemas, protocols, model cards, configuration, architecture contracts, and Flue-discovered entrypoints. | artifact:core-contracts-change |
| `implement-agent-runtime` | `work` | `planned` | agent: SIM-ONE Coding Worker lead | Implement authorized main-orchestrator, workflow, tool, skill, built-in lead-worker, worker-local internal-subagent, and persona-workspace changes while preventing ephemeral Flue sandbox storage from being represented as durable product storage and preserving delegation ownership and capability isolation. Add a canonical RunPod OpenAI-compatible chat provider and model card without changing the shipped primary model. | artifact:agent-runtime-change |
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
| `resolve-d1-github-auth-strategy` | `decision` | `planned` | agent: SIM-ONE architecture adapter | Record the supported GitHub credential and public/private repository access strategy without conflating authentication with mutation approval. | decision:d1-github-auth-strategy |
| `resolve-d2-workspace-root-isolation` | `decision` | `planned` | agent: SIM-ONE architecture adapter | Record the single movable .gorombo runtime-root contract and its separation of packaged persona, mutable state, and model-writable workspace. | decision:d2-workspace-root-isolation |
| `resolve-d3-file-access-gate` | `decision` | `planned` | agent: SIM-ONE architecture adapter | Record fail-closed structured path and sandbox containment with exact allow-once/session approval escalation. | decision:d3-file-access-gate |
| `resolve-d4-orchestrator-history-visibility` | `decision` | `needs_human` | human: SIM-ONE owner decision | Select authoritative typed worker evidence alone or an additional scoped service over Flue durable task events. | decision:d4-orchestrator-history-visibility |
| `specify-release-reconciliation` | `work` | `planned` | agent: SIM-ONE specification adapter | Maintain the neutral product, architecture, acceptance, risk, and open-question documents that bind the reconciled 0.1.0 release graph without fabricating open decisions. | artifact:product-spec, artifact:constraints-and-risks, artifact:architecture-spec, artifact:acceptance-spec, artifact:open-questions, artifact:product-spec-workspace, artifact:architecture-spec-workspace, artifact:acceptance-spec-workspace, artifact:open-questions-workspace, artifact:product-spec-file-access, artifact:architecture-spec-file-access, artifact:acceptance-spec-file-access, artifact:open-questions-file-access, artifact:product-spec-runtime-configuration, artifact:architecture-spec-runtime-configuration, artifact:acceptance-spec-runtime-configuration, artifact:open-questions-runtime-configuration, artifact:runtime-configuration-inventory |
| `verify-release-reconciliation-specifications` | `verification` | `planned` | deterministic: Graph specification verifier | Verify graph/schema/manifest lineage, document containment, resolved-decision coverage, open-decision isolation, and release-ledger completeness. | artifact:release-reconciliation-specification-verification |
| `implement-runtime-root-layout` | `work` | `planned` | agent: SIM-ONE Coding Worker lead | Implement one typed, movable .gorombo runtime root across packaged launchers, Node runtime, CLI, stores, scripts, worker metadata, and tests. | artifact:runtime-root-layout-change |
| `implement-file-access-approval-gate` | `work` | `planned` | agent: SIM-ONE Coding Worker lead | Enforce workspace containment for every Coding Worker filesystem and shell operation and provide exact allow-once/session escalation. | artifact:file-access-approval-gate-change |
| `implement-coding-worker-progress` | `work` | `planned` | agent: SIM-ONE Coding Worker lead | Attach the existing typed checkpoint reporter to the live Flue Coding Worker and route sanitized progress to active connectors. | artifact:coding-worker-progress-change |
| `implement-coding-worker-github-flow` | `work` | `planned` | agent: SIM-ONE Coding Worker lead | Implement the resolved D1 credential strategy, anonymous public clone, action approvals, and packaged TUI/connector result delivery. | artifact:coding-worker-github-flow-change |
| `implement-coding-worker-scaffold-tooling` | `work` | `planned` | agent: SIM-ONE Coding Worker lead | Add profile-owned Astro documentation capability, repository-scoped scaffold wrappers, and noninteractive post-scaffold verification setup. | artifact:coding-worker-scaffold-tooling-change |
| `implement-orchestrator-worker-verification` | `work` | `planned` | agent: SIM-ONE Coding Worker lead | Implement the owner-selected D4 boundary for independently checking typed Coding Worker evidence before final synthesis. | artifact:orchestrator-worker-verification-change |
| `implement-tui-message-queue` | `work` | `planned` | agent: SIM-ONE Coding Worker lead | Queue prompts submitted while a turn is active, display their state, and admit them to the same session in deterministic order. | artifact:tui-message-queue-change |
| `implement-tui-status-context-meter` | `work` | `planned` | agent: SIM-ONE Coding Worker lead | Render a stable two-row status surface split at the messages marker, with authoritative context-left percentage and overflow state on row two. | artifact:tui-status-context-meter-change |
| `implement-tui-prompt-editor-polish` | `work` | `planned` | agent: SIM-ONE Coding Worker lead | Make spaces move the caret immediately and render a slim visibly active cursor without regressing Unicode, selection, multiline, or scrolling behavior. | artifact:tui-prompt-editor-polish-change |
| `implement-tui-thinking-transcript` | `work` | `planned` | agent: SIM-ONE Coding Worker lead | Keep root thinking progress in its own persistent dimmed region and final assistant output in a separate authoritative region. | artifact:tui-thinking-transcript-change |
| `implement-connector-approval-controls` | `work` | `planned` | agent: SIM-ONE Coding Worker lead | Render and settle action approvals in a TUI drop-up matching the slash-command menu display pattern and in Telegram with connector-aware identity, explicit allow scopes, and fail-closed unavailable states. | artifact:connector-approval-controls-change |
| `implement-image-reasoning-worker` | `work` | `planned` | agent: SIM-ONE Coding Worker lead | Add a dedicated Flue worker for image inspection and reasoning with typed requests, bounded artifacts, and verified results. | artifact:image-reasoning-worker-change |
| `implement-document-index` | `work` | `planned` | agent: SIM-ONE Coding Worker lead | Implement governed per-database document storage, drop-folder ingestion, indexing, provenance, retrieval, and rebuild behavior. | artifact:document-index-change |
| `implement-protocol-scoring` | `work` | `planned` | agent: SIM-ONE Coding Worker lead | Complete release protocol records, activate fail-closed pre-execution enforcement, and implement orchestrator/critic plus Sasser Theorem scoring. | artifact:protocol-scoring-change |
| `resolve-d5-canonical-runtime-configuration` | `decision` | `planned` | agent: SIM-ONE architecture adapter | Record one canonical, install-relative environment-file contract for source builds, packaged runtime, providers, connectors, tools, workers, and future onboarding. | decision:d5-canonical-runtime-configuration |
| `implement-runtime-configuration-consolidation` | `work` | `planned` | agent: SIM-ONE Coding Worker lead | Consolidate all implemented SIM-ONE-owned environment configuration into one typed, install-relative, package-safe runtime contract with controlled Coding Worker assistance. | artifact:runtime-configuration-consolidation-change |
| `verify-runtime-configuration-consolidation` | `verification` | `planned` | hybrid: SIM-ONE runtime configuration verification adapter | Prove the integrated SIM-ONE build uses one complete, relocatable, secret-safe runtime configuration contract across product and worker surfaces. | artifact:runtime-configuration-consolidation-report |
| `resolve-d6-tui-approval-surface-placement` | `decision` | `planned` | agent: SIM-ONE architecture adapter | Record the owner-selected drop-up approval interface above the prompt, following the slash-command menu display pattern while keeping the status surface at two rows. | decision:d6-tui-approval-surface-placement |
| `implement-capability-management-worker` | `work` | `planned` | agent: SIM-ONE Coding Worker lead | Create the dedicated capability-manager worker and shared lifecycle service that safely administer user- and agent-added skills, tools, workers, and MCP servers through the existing runtime registry. | artifact:capability-management-worker-change |
| `implement-coding-worker-capability-authoring` | `work` | `planned` | agent: SIM-ONE Coding Worker lead | Give the Coding Worker the skills and tools to design, build, validate, test, and package every supported capability kind while leaving runtime installation and activation to the capability-manager worker. | artifact:coding-worker-capability-authoring-change |
| `resolve-d7-separate-project-and-task-graphs` | `decision` | `planned` | agent: SIM-ONE architecture adapter | Keep repository development governance separate from per-request task execution while defining a governed cross-graph adapter. | decision:d7-separate-project-and-task-graphs |
| `resolve-d8-memory-helper-task-runs` | `decision` | `planned` | agent: SIM-ONE architecture adapter | Make the Rust/WASM Memory Helper the shared durable task-state authority and eliminate competing task-run state. | decision:d8-memory-helper-task-runs |
| `resolve-d9-flue-native-task-graph-runtime` | `decision` | `planned` | agent: SIM-ONE architecture adapter | Add application-owned task graph coordination while preserving Flue as the only agent runtime. | decision:d9-flue-native-task-graph-runtime |
| `resolve-d10-sealed-node-context` | `decision` | `planned` | agent: SIM-ONE architecture adapter | Make exact bounded context envelopes and capability absence enforceable for every model-executed task graph node. | decision:d10-sealed-node-context |
| `resolve-d11-shared-task-graph-engine` | `decision` | `planned` | agent: SIM-ONE architecture adapter | Use one graph engine for orchestrator and Coding Worker definitions while preserving private worker subgraphs and DLG authority. | decision:d11-shared-task-graph-engine |
| `specify-task-lifecycle-architecture` | `work` | `planned` | agent: SIM-ONE architecture adapter | Synthesize the five accepted architecture decisions into one implementation-independent task lifecycle graph contract. | artifact:task-lifecycle-architecture-spec |
| `specify-flue-v2-migration` | `work` | `planned` | agent: SIM-ONE Flue migration architect | Translate the official Flue 2.0.1 migration contract and SIM-ONE current implementation into one implementation-ready, graph-bound migration specification. | artifact:flue-v2-migration-spec |
| `migrate-flue-v2-foundation` | `work` | `planned` | agent: SIM-ONE Flue foundation migrator | Establish checklist items 1 through 3 and the provider foundation from item 9: coordinated package pins, Vite build/config, explicit routing, and Pi provider registration, with exact handoff diagnostics for dependent source conversions. | artifact:flue-v2-foundation-change |
| `migrate-flue-v2-agents-workers` | `work` | `planned` | agent: SIM-ONE Flue agent migrator | Convert the orchestrator and built-in worker hierarchy to synchronous Flue 2 agent functions, hooks, subagent definitions, explicit sandbox ownership, and the named application router binding. | artifact:flue-v2-agents-workers-change |
| `migrate-flue-v2-capabilities` | `work` | `planned` | agent: SIM-ONE Flue capability migrator | Convert built-in and runtime-extensible capability contracts to Flue 2 tools, skills, MCP connections, registries, scaffolds, approval-preserving adapters, and authorized agent mounts. | artifact:flue-v2-capabilities-change |
| `migrate-flue-v2-execution-persistence` | `work` | `planned` | agent: SIM-ONE Flue execution migrator | Replace removed workflows and beta session stores with public Flue 2 dispatch/read, distinct persistence, session/history compatibility, schedules, submission observability, and the minimal connector compile bridge required to verify them. | artifact:flue-v2-execution-persistence-change |
| `migrate-flue-v2-connectors-clients` | `work` | `planned` | agent: SIM-ONE Flue client migrator | Migrate Telegram, Ratatui, CLI, and remaining clients to conversation-scoped Flue 2 identities, submissions, history, and update streams. | artifact:flue-v2-connectors-clients-change |
| `migrate-flue-v2-product-packaging` | `work` | `planned` | agent: SIM-ONE Flue product packager | Stage the Vite Node output into the movable .gorombo product runtime and preserve launcher, dependency, configuration, service, and arbitrary-cwd behavior. | artifact:flue-v2-product-packaging-change |
| `migrate-flue-v2-documentation` | `work` | `planned` | agent: SIM-ONE Flue documentation migrator | Update every affected current-state architecture, guide, operations, OpenWiki, example, diagram, and release document after the implementation behavior is verified. | artifact:flue-v2-documentation-change |
| `verify-flue-v2-production-migration` | `verification` | `planned` | hybrid: SIM-ONE Flue production verifier | Prove the complete Flue 2 migration through static scans, full automated suites, standalone product flows, persistence boundaries, connector behavior, and graph/documentation parity. | artifact:flue-v2-production-verification |
| `resolve-d12-flue-v2-persistence-and-compaction` | `decision` | `planned` | agent: SIM-ONE Flue migration architect | Bind Flue 2 to a separate persistence namespace while preserving SIM-ONE product sessions and implementing explicit compaction through public runtime generations. | decision:d12-flue-v2-persistence-and-compaction |
| `repair-flue-v2-verification-regressions` | `work` | `planned` | hybrid: SIM-ONE Flue verification repair | Repair the four bounded regressions found by the final Flue 2 verification without changing migrated runtime architecture. | artifact:flue-v2-verification-repair |
| `repair-flue-v2-memory-smoke-harness` | `work` | `planned` | hybrid: SIM-ONE Flue 2 memory smoke repair | Migrate the deterministic structured-memory product smoke from removed beta tool execution to the Flue 2 tool contract. | artifact:flue-v2-memory-smoke-repair |
| `repair-flue-v2-tui-e2e-harness` | `work` | `planned` | hybrid: SIM-ONE Flue 2 TUI E2E repair | Migrate the TUI end-to-end product harness from the removed beta synchronous HTTP contract to the Flue 2 conversation client contract. | artifact:flue-v2-tui-e2e-repair |

## Edges

| ID | From | Type | To | Condition | Artifacts | Bound / exit |
|---|---|---|---|---|---|---|
| `baseline-to-install` | `baseline-context` | `consumes` | `install-dependencies` | Upstream artifacts are current, accepted, and bound to this run. | artifact:baseline-context | — |
| `install-to-embedding-model` | `install-dependencies` | `consumes` | `fetch-embedding-model` | Upstream artifacts are current, accepted, and bound to this run. | artifact:dependency-environment | — |
| `install-to-wasm-build` | `install-dependencies` | `consumes` | `build-wasm-memory` | Upstream artifacts are current, accepted, and bound to this run. | artifact:dependency-environment | — |
| `baseline-to-change-contract` | `baseline-context` | `consumes` | `define-change-contract` | Upstream artifacts are current, accepted, and bound to this run. | artifact:baseline-context | — |
| `baseline-to-beta-release-contract` | `baseline-context` | `consumes` | `approve-beta-release-contract` | The current source state, release ledger, and repository planning-artifact digest manifest are bound to the same authorized run. | artifact:baseline-context | — |
| `contract-to-beta-release-contract` | `define-change-contract` | `consumes` | `approve-beta-release-contract` | The requested change and affected domains are explicit enough to bind the fixed 0.1.0 Beta contract. | artifact:change-contract, artifact:affected-domain-map | — |
| `context-and-contract-to-architecture` | `baseline-context` | `consumes` | `decide-architecture` | Upstream artifacts are current, accepted, and bound to this run. | artifact:baseline-context | — |
| `beta-release-contract-to-architecture` | `approve-beta-release-contract` | `consumes` | `decide-architecture` | The owner has approved every stable release and planned-work ID as required for 0.1.0 Beta. | artifact:beta-release-contract | — |
| `contract-to-architecture` | `define-change-contract` | `consumes` | `decide-architecture` | Upstream artifacts are current, accepted, and bound to this run. | artifact:change-contract, artifact:affected-domain-map | — |
| `contract-to-implementation-plan` | `define-change-contract` | `consumes` | `plan-implementation` | Upstream artifacts are current, accepted, and bound to this run. | artifact:change-contract | — |
| `architecture-to-implementation-plan` | `decide-architecture` | `consumes` | `plan-implementation` | Upstream artifacts are current, accepted, and bound to this run. | artifact:architecture-decision | — |
| `beta-release-contract-to-implementation-plan` | `approve-beta-release-contract` | `consumes` | `plan-implementation` | The fixed owner-approved 0.1.0 Beta contract and repository planning-artifact lineage are current and bound to this run. | artifact:beta-release-contract | — |
| `beta-release-contract-to-implement-agent-runtime` | `approve-beta-release-contract` | `consumes` | `implement-agent-runtime` | The owner-approved release requirements assigned to the agent-runtime lane are current. | artifact:beta-release-contract | — |
| `beta-release-contract-to-implement-capabilities-security` | `approve-beta-release-contract` | `consumes` | `implement-capabilities-security` | The owner-approved release requirements assigned to the capabilities and security lane are current. | artifact:beta-release-contract | — |
| `beta-release-contract-to-implement-ingress-operations` | `approve-beta-release-contract` | `consumes` | `implement-ingress-operations` | The owner-approved connector, schedule, and ingress release requirements are current. | artifact:beta-release-contract | — |
| `beta-release-contract-to-implement-sim-one-tui-work-pane` | `approve-beta-release-contract` | `consumes` | `implement-sim-one-tui-work-pane` | The required TUI work-pane contract is current and bound to this run. | artifact:beta-release-contract | — |
| `beta-release-contract-approves-sim-one-tui-work-pane` | `approve-beta-release-contract` | `approves` | `implement-sim-one-tui-work-pane` | The owner authorizes entering the bounded TUI work-pane mutation scope; every individual repository write remains fail-closed on a current Coding Worker approval-service decision. | artifact:beta-release-contract | — |
| `beta-release-contract-to-implement-sim-one-onboarding-distribution` | `approve-beta-release-contract` | `consumes` | `implement-sim-one-onboarding-distribution` | The owner-approved packaging, onboarding, and lifecycle release requirements are current. | artifact:beta-release-contract | — |
| `beta-release-contract-approves-sim-one-onboarding-distribution` | `approve-beta-release-contract` | `approves` | `implement-sim-one-onboarding-distribution` | The owner authorizes entering the bounded onboarding and distribution mutation scope; every individual repository write remains fail-closed on a current Coding Worker approval-service decision. | artifact:beta-release-contract | — |
| `beta-release-contract-to-implement-product-delivery` | `approve-beta-release-contract` | `consumes` | `implement-product-delivery` | The owner-approved product-surface and release-document requirements are current. | artifact:beta-release-contract | — |
| `beta-release-contract-to-implement-core-contracts` | `approve-beta-release-contract` | `consumes` | `implement-core-contracts` | The fixed owner-approved beta contract and repository-mutation policy are current for the core-contracts workstream. | artifact:beta-release-contract | — |
| `beta-release-contract-to-implement-memory-retrieval` | `approve-beta-release-contract` | `consumes` | `implement-memory-retrieval` | The fixed owner-approved beta contract and repository-mutation policy are current for the memory-retrieval workstream. | artifact:beta-release-contract | — |
| `beta-release-contract-to-integration-and-repair` | `approve-beta-release-contract` | `consumes` | `integrate-and-repair` | The fixed owner-approved beta contract and repository-mutation policy are current for integration and repair. | artifact:beta-release-contract | — |
| `beta-release-contract-approves-core-contracts` | `approve-beta-release-contract` | `approves` | `implement-core-contracts` | The owner authorizes entering the bounded core-contracts mutation scope; every repository write remains fail-closed on a current Coding Worker approval-service decision. | artifact:beta-release-contract | — |
| `beta-release-contract-approves-agent-runtime` | `approve-beta-release-contract` | `approves` | `implement-agent-runtime` | The owner authorizes entering the bounded agent-runtime mutation scope; every repository write remains fail-closed on a current Coding Worker approval-service decision. | artifact:beta-release-contract | — |
| `beta-release-contract-approves-memory-retrieval` | `approve-beta-release-contract` | `approves` | `implement-memory-retrieval` | The owner authorizes entering the bounded memory-retrieval mutation scope; every repository write remains fail-closed on a current Coding Worker approval-service decision. | artifact:beta-release-contract | — |
| `beta-release-contract-approves-capabilities-security` | `approve-beta-release-contract` | `approves` | `implement-capabilities-security` | The owner authorizes entering the bounded capabilities/security mutation scope, including its first approval-enforcement bootstrap write; every repository write remains fail-closed on a current approval-service decision. | artifact:beta-release-contract | — |
| `beta-release-contract-approves-ingress-operations` | `approve-beta-release-contract` | `approves` | `implement-ingress-operations` | The owner authorizes entering the bounded ingress/operations mutation scope; every repository write remains fail-closed on a current Coding Worker approval-service decision. | artifact:beta-release-contract | — |
| `beta-release-contract-approves-product-delivery` | `approve-beta-release-contract` | `approves` | `implement-product-delivery` | The owner authorizes entering the serialized product-delivery mutation scope; every repository write remains fail-closed on a current Coding Worker approval-service decision. | artifact:beta-release-contract | — |
| `beta-release-contract-approves-integration-and-repair` | `approve-beta-release-contract` | `approves` | `integrate-and-repair` | The owner authorizes bounded integration and repair; every repository write remains fail-closed on a current Coding Worker approval-service decision tied to the failed evidence and exact mutation. | artifact:beta-release-contract | — |
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
| `integration-to-release-package-build` | `integrate-and-repair` | `consumes` | `build-release-package` | The latest integrated diff is current, and the merged release candidate must contain that exact diff before release packaging can run. | artifact:integrated-change | — |
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
| `beta-release-contract-to-ledger-proposal` | `approve-beta-release-contract` | `consumes` | `prepare-release-ledger-update` | The ledger proposal must preserve exact set equality with every owner-approved stable beta ID. | artifact:beta-release-contract | — |
| `verification-summary-to-ledger-proposal` | `aggregate-verification` | `consumes` | `prepare-release-ledger-update` | The ledger proposal derives pre-merge release-ID completion only from the accepted verification summary. | artifact:verification-summary | — |
| `onboarding-distribution-to-ledger-proposal` | `verify-onboarding-distribution` | `consumes` | `prepare-release-ledger-update` | The ledger proposal derives post-merge packaging, onboarding, and lifecycle status only from the accepted isolated verification report. | artifact:onboarding-distribution-report | — |
| `release-package-to-ledger-proposal` | `build-release-package` | `consumes` | `prepare-release-ledger-update` | The ledger proposal binds package and integrity status to the exact versioned package record. | artifact:release-package | — |
| `production-release-to-ledger-proposal` | `release-production` | `consumes` | `prepare-release-ledger-update` | The non-mutating ledger proposal binds the immutable production release record. | artifact:production-release | — |
| `production-observation-to-ledger-proposal` | `observe-production` | `consumes` | `prepare-release-ledger-update` | The non-mutating ledger proposal is created only after successful production observation. | artifact:production-observation | — |
| `published-release-assets-to-ledger-approval` | `publish-release-assets` | `consumes` | `approve-release-ledger-update` | The release-ledger approval must bind the verified immutable asset record. | artifact:published-release-assets-report | — |
| `beta-release-contract-to-ledger-approval` | `approve-beta-release-contract` | `consumes` | `approve-release-ledger-update` | The owner compares the proposed final ledger against every approved stable beta ID. | artifact:beta-release-contract | — |
| `verification-summary-to-ledger-approval` | `aggregate-verification` | `consumes` | `approve-release-ledger-update` | The owner compares every proposed pre-merge completion status with the accepted verification summary. | artifact:verification-summary | — |
| `onboarding-distribution-to-ledger-approval` | `verify-onboarding-distribution` | `consumes` | `approve-release-ledger-update` | The owner compares every proposed post-merge onboarding and lifecycle status with the accepted isolated verification report. | artifact:onboarding-distribution-report | — |
| `release-package-to-ledger-approval` | `build-release-package` | `consumes` | `approve-release-ledger-update` | The owner compares proposed package and integrity status with the exact versioned package record. | artifact:release-package | — |
| `release-ledger-proposal-to-approval` | `prepare-release-ledger-update` | `consumes` | `approve-release-ledger-update` | The owner approves the exact precomputed single-file diff, expected base commit, immutable release fields, and proposal digest without authoring new content. | artifact:release-ledger-proposal | — |
| `production-release-to-ledger-approval` | `release-production` | `consumes` | `approve-release-ledger-update` | The release-ledger approval must bind the immutable production release record. | artifact:production-release | — |
| `production-observation-to-ledger-approval` | `observe-production` | `consumes` | `approve-release-ledger-update` | The release ledger may be updated only after the approved production observation completes successfully. | artifact:production-observation | — |
| `release-ledger-approval-to-update` | `approve-release-ledger-update` | `approves` | `update-release-ledger` | The owner approved the exact file, diff, release date, immutable release references, GitHub mutation scope, and rollback. | artifact:release-ledger-update-approval | — |
| `release-ledger-approval-artifact-to-update` | `approve-release-ledger-update` | `consumes` | `update-release-ledger` | The repository mutation approval is current, accepted, and bound to the exact proposed ledger diff. | artifact:release-ledger-update-approval | — |
| `release-ledger-proposal-to-update` | `prepare-release-ledger-update` | `consumes` | `update-release-ledger` | The repository updater applies only the exact proposal digest reviewed by the owner and recorded in the approval artifact. | artifact:release-ledger-proposal | — |
| `published-release-assets-to-ledger-update` | `publish-release-assets` | `consumes` | `update-release-ledger` | The repository ledger must match the verified immutable tag, release URL, candidate commit, and asset digests. | artifact:published-release-assets-report | — |
| `beta-release-contract-to-ledger-update` | `approve-beta-release-contract` | `consumes` | `update-release-ledger` | The repository updater must prove the merged ledger has exact set equality with every approved stable beta ID. | artifact:beta-release-contract | — |
| `verification-summary-to-ledger-update` | `aggregate-verification` | `consumes` | `update-release-ledger` | The repository updater must prove every merged pre-merge status matches the accepted verification summary. | artifact:verification-summary | — |
| `onboarding-distribution-to-ledger-update` | `verify-onboarding-distribution` | `consumes` | `update-release-ledger` | The repository updater must prove every merged post-merge onboarding and lifecycle status matches the accepted isolated verification report. | artifact:onboarding-distribution-report | — |
| `release-package-to-ledger-update` | `build-release-package` | `consumes` | `update-release-ledger` | The repository updater must prove merged package and integrity status matches the exact versioned package record. | artifact:release-package | — |
| `production-release-to-ledger-update` | `release-production` | `consumes` | `update-release-ledger` | The repository ledger must match the immutable production release record. | artifact:production-release | — |
| `production-observation-to-ledger-update` | `observe-production` | `consumes` | `update-release-ledger` | The repository ledger mutation proceeds only after verified production observation. | artifact:production-observation | — |
| `candidate-to-closeout` | `publish-release-candidate` | `consumes` | `closeout-release` | Upstream artifacts are current, accepted, and bound to this run. | artifact:release-candidate | — |
| `release-ledger-update-to-closeout` | `update-release-ledger` | `consumes` | `closeout-release` | Closeout requires the verified repository ledger update bound to the immutable release record. | artifact:release-ledger-update | — |
| `production-observation-to-closeout` | `observe-production` | `consumes` | `closeout-release` | Upstream artifacts are current, accepted, and bound to this run. | artifact:production-observation | — |
| `verify-typecheck-feedback-to-integration` | `verify-typecheck` | `feedback` | `integrate-and-repair` | The evidence identifies a correctable implementation or integration failure. | artifact:typecheck-report | max 3; The failed criterion passes with fresh evidence, or three repair traversals exhaust and the run moves to needs_human. |
| `build-release-package-feedback-to-integration` | `build-release-package` | `feedback` | `integrate-and-repair` | The release-package evidence identifies a correctable packaging, archive-scope, checksum, mode, or integration failure; any source repair supersedes the merged candidate and must traverse fresh verification, architecture review, owner approval, pull-request checks, merge, and main readback. | artifact:release-package | max 3; A newer artifact:release-candidate containing the repaired integrated diff is merged and read back from main and the failed package criterion passes with fresh evidence, or three repair traversals exhaust and the run moves to needs_human. |
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
| `baseline-invalidates-beta-release-contract` | `baseline-context` | `invalidates` | `approve-beta-release-contract` | A changed commit, release ledger, repository planning artifact, artifact digest, or authorized request makes the former beta contract approval stale. | artifact:beta-release-contract | — |
| `change-contract-invalidates-beta-release-contract` | `define-change-contract` | `invalidates` | `approve-beta-release-contract` | A changed purpose, scope, non-goal, or affected-domain map makes the former beta contract approval stale. | artifact:beta-release-contract | — |
| `change-contract-invalidates-architecture` | `define-change-contract` | `invalidates` | `decide-architecture` | A changed purpose, scope, non-goal, or acceptance criterion makes the former architecture decision stale. | artifact:architecture-decision | — |
| `architecture-invalidates-plan` | `decide-architecture` | `invalidates` | `plan-implementation` | A changed architecture decision makes the former implementation plan stale. | artifact:implementation-plan | — |
| `beta-release-contract-invalidates-architecture` | `approve-beta-release-contract` | `invalidates` | `decide-architecture` | A changed owner-approved beta contract invalidates architecture and planning assumptions for affected members. | artifact:architecture-decision | — |
| `beta-release-contract-invalidates-plan` | `approve-beta-release-contract` | `invalidates` | `plan-implementation` | A changed owner-approved beta contract or repository planning-artifact lineage invalidates the implementation sequence and file-ownership map. | artifact:implementation-plan | — |
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
| `integration-invalidates-release-package-build` | `integrate-and-repair` | `invalidates` | `build-release-package` | A changed integrated diff invalidates every package record built from an earlier candidate generation. | artifact:release-package | — |
| `integration-invalidates-aggregate-verification` | `integrate-and-repair` | `invalidates` | `aggregate-verification` | A changed integrated diff invalidates the prior pre-merge verification summary and requires fresh evidence aggregation. | artifact:verification-summary | — |
| `integration-invalidates-architecture-review` | `integrate-and-repair` | `invalidates` | `review-architecture-security` | A changed integrated diff invalidates the prior architecture and security review. | artifact:architecture-security-review | — |
| `integration-invalidates-release-candidate-approval` | `integrate-and-repair` | `invalidates` | `approve-release-candidate` | A changed integrated diff invalidates owner approval of the superseded candidate tree and GitHub mutation scope. | artifact:release-candidate-approval | — |
| `integration-invalidates-release-candidate` | `integrate-and-repair` | `invalidates` | `publish-release-candidate` | A changed integrated diff invalidates the superseded merged candidate; downstream post-merge work must wait for a newly approved, checked, merged, and read-back candidate. | artifact:release-candidate | — |
| `integration-invalidates-verify-documentation` | `integrate-and-repair` | `invalidates` | `verify-documentation` | A changed integrated diff invalidates prior documentation verification evidence. | artifact:documentation-verification-report | — |
| `integration-invalidates-verify-unit-tests` | `integrate-and-repair` | `invalidates` | `verify-unit-tests` | A changed integrated diff invalidates prior verification evidence. | artifact:unit-test-report | — |
| `integration-invalidates-verify-rust-tests` | `integrate-and-repair` | `invalidates` | `verify-rust-tests` | A changed integrated diff invalidates prior verification evidence. | artifact:rust-test-report | — |
| `integration-invalidates-verify-onboarding-distribution` | `integrate-and-repair` | `invalidates` | `verify-onboarding-distribution` | A changed integrated diff invalidates prior packaged onboarding and distribution evidence. | artifact:onboarding-distribution-report | — |
| `integration-invalidates-verify-sim-one-tui` | `integrate-and-repair` | `invalidates` | `verify-sim-one-tui` | A changed integrated diff invalidates prior packaged SIM-ONE TUI session, transcript, interaction, prompt, and visible-final evidence. | artifact:sim-one-tui-product-report | — |
| `production-approval-to-observation` | `approve-production-release` | `approves` | `observe-production` | The owner approved the exact production target, candidate, observation plan, and recorded rollback authority. | artifact:production-release-approval | — |
| `production-approval-artifact-to-observation` | `approve-production-release` | `consumes` | `observe-production` | The rollback authority is current, accepted, and bound to the exact production release and this run. | artifact:production-release-approval | — |
| `baseline-to-release-spec-consumes` | `baseline-context` | `consumes` | `specify-release-reconciliation` | specify-release-reconciliation requires the current artifact:baseline-context artifact. | artifact:baseline-context | — |
| `baseline-to-release-spec-invalidates` | `baseline-context` | `invalidates` | `specify-release-reconciliation` | A material change to artifact:baseline-context invalidates artifact:product-spec. | artifact:product-spec | — |
| `baseline-to-resolve-d1-github-auth-strategy-consumes` | `baseline-context` | `consumes` | `resolve-d1-github-auth-strategy` | resolve-d1-github-auth-strategy requires the current artifact:baseline-context artifact. | artifact:baseline-context | — |
| `baseline-to-resolve-d1-github-auth-strategy-invalidates` | `baseline-context` | `invalidates` | `resolve-d1-github-auth-strategy` | A material change to artifact:baseline-context invalidates decision:d1-github-auth-strategy. | decision:d1-github-auth-strategy | — |
| `release-spec-to-resolve-d1-github-auth-strategy-0-consumes` | `specify-release-reconciliation` | `consumes` | `resolve-d1-github-auth-strategy` | resolve-d1-github-auth-strategy requires the current artifact:product-spec artifact. | artifact:product-spec | — |
| `release-spec-to-resolve-d1-github-auth-strategy-0-invalidates` | `specify-release-reconciliation` | `invalidates` | `resolve-d1-github-auth-strategy` | A material change to artifact:product-spec invalidates decision:d1-github-auth-strategy. | decision:d1-github-auth-strategy | — |
| `release-spec-to-resolve-d1-github-auth-strategy-1-consumes` | `specify-release-reconciliation` | `consumes` | `resolve-d1-github-auth-strategy` | resolve-d1-github-auth-strategy requires the current artifact:constraints-and-risks artifact. | artifact:constraints-and-risks | — |
| `release-spec-to-resolve-d1-github-auth-strategy-1-invalidates` | `specify-release-reconciliation` | `invalidates` | `resolve-d1-github-auth-strategy` | A material change to artifact:constraints-and-risks invalidates decision:d1-github-auth-strategy. | decision:d1-github-auth-strategy | — |
| `release-spec-to-resolve-d1-github-auth-strategy-2-consumes` | `specify-release-reconciliation` | `consumes` | `resolve-d1-github-auth-strategy` | resolve-d1-github-auth-strategy requires the current artifact:architecture-spec artifact. | artifact:architecture-spec | — |
| `release-spec-to-resolve-d1-github-auth-strategy-2-invalidates` | `specify-release-reconciliation` | `invalidates` | `resolve-d1-github-auth-strategy` | A material change to artifact:architecture-spec invalidates decision:d1-github-auth-strategy. | decision:d1-github-auth-strategy | — |
| `release-spec-to-resolve-d1-github-auth-strategy-3-consumes` | `specify-release-reconciliation` | `consumes` | `resolve-d1-github-auth-strategy` | resolve-d1-github-auth-strategy requires the current artifact:acceptance-spec artifact. | artifact:acceptance-spec | — |
| `release-spec-to-resolve-d1-github-auth-strategy-3-invalidates` | `specify-release-reconciliation` | `invalidates` | `resolve-d1-github-auth-strategy` | A material change to artifact:acceptance-spec invalidates decision:d1-github-auth-strategy. | decision:d1-github-auth-strategy | — |
| `release-spec-to-resolve-d1-github-auth-strategy-4-consumes` | `specify-release-reconciliation` | `consumes` | `resolve-d1-github-auth-strategy` | resolve-d1-github-auth-strategy requires the current artifact:open-questions artifact. | artifact:open-questions | — |
| `release-spec-to-resolve-d1-github-auth-strategy-4-invalidates` | `specify-release-reconciliation` | `invalidates` | `resolve-d1-github-auth-strategy` | A material change to artifact:open-questions invalidates decision:d1-github-auth-strategy. | decision:d1-github-auth-strategy | — |
| `baseline-to-resolve-d2-workspace-root-isolation-consumes` | `baseline-context` | `consumes` | `resolve-d2-workspace-root-isolation` | resolve-d2-workspace-root-isolation requires the current artifact:baseline-context artifact. | artifact:baseline-context | — |
| `baseline-to-resolve-d2-workspace-root-isolation-invalidates` | `baseline-context` | `invalidates` | `resolve-d2-workspace-root-isolation` | A material change to artifact:baseline-context invalidates decision:d2-workspace-root-isolation. | decision:d2-workspace-root-isolation | — |
| `release-spec-to-resolve-d2-workspace-root-isolation-0-consumes` | `specify-release-reconciliation` | `consumes` | `resolve-d2-workspace-root-isolation` | resolve-d2-workspace-root-isolation requires the current artifact:product-spec-workspace artifact. | artifact:product-spec-workspace | — |
| `release-spec-to-resolve-d2-workspace-root-isolation-0-invalidates` | `specify-release-reconciliation` | `invalidates` | `resolve-d2-workspace-root-isolation` | A material change to artifact:product-spec-workspace invalidates decision:d2-workspace-root-isolation. | decision:d2-workspace-root-isolation | — |
| `release-spec-to-resolve-d2-workspace-root-isolation-1-consumes` | `specify-release-reconciliation` | `consumes` | `resolve-d2-workspace-root-isolation` | resolve-d2-workspace-root-isolation requires the current artifact:architecture-spec-workspace artifact. | artifact:architecture-spec-workspace | — |
| `release-spec-to-resolve-d2-workspace-root-isolation-1-invalidates` | `specify-release-reconciliation` | `invalidates` | `resolve-d2-workspace-root-isolation` | A material change to artifact:architecture-spec-workspace invalidates decision:d2-workspace-root-isolation. | decision:d2-workspace-root-isolation | — |
| `release-spec-to-resolve-d2-workspace-root-isolation-2-consumes` | `specify-release-reconciliation` | `consumes` | `resolve-d2-workspace-root-isolation` | resolve-d2-workspace-root-isolation requires the current artifact:acceptance-spec-workspace artifact. | artifact:acceptance-spec-workspace | — |
| `release-spec-to-resolve-d2-workspace-root-isolation-2-invalidates` | `specify-release-reconciliation` | `invalidates` | `resolve-d2-workspace-root-isolation` | A material change to artifact:acceptance-spec-workspace invalidates decision:d2-workspace-root-isolation. | decision:d2-workspace-root-isolation | — |
| `release-spec-to-resolve-d2-workspace-root-isolation-3-consumes` | `specify-release-reconciliation` | `consumes` | `resolve-d2-workspace-root-isolation` | resolve-d2-workspace-root-isolation requires the current artifact:open-questions-workspace artifact. | artifact:open-questions-workspace | — |
| `release-spec-to-resolve-d2-workspace-root-isolation-3-invalidates` | `specify-release-reconciliation` | `invalidates` | `resolve-d2-workspace-root-isolation` | A material change to artifact:open-questions-workspace invalidates decision:d2-workspace-root-isolation. | decision:d2-workspace-root-isolation | — |
| `baseline-to-resolve-d3-file-access-gate-consumes` | `baseline-context` | `consumes` | `resolve-d3-file-access-gate` | resolve-d3-file-access-gate requires the current artifact:baseline-context artifact. | artifact:baseline-context | — |
| `baseline-to-resolve-d3-file-access-gate-invalidates` | `baseline-context` | `invalidates` | `resolve-d3-file-access-gate` | A material change to artifact:baseline-context invalidates decision:d3-file-access-gate. | decision:d3-file-access-gate | — |
| `release-spec-to-resolve-d3-file-access-gate-0-consumes` | `specify-release-reconciliation` | `consumes` | `resolve-d3-file-access-gate` | resolve-d3-file-access-gate requires the current artifact:product-spec-file-access artifact. | artifact:product-spec-file-access | — |
| `release-spec-to-resolve-d3-file-access-gate-0-invalidates` | `specify-release-reconciliation` | `invalidates` | `resolve-d3-file-access-gate` | A material change to artifact:product-spec-file-access invalidates decision:d3-file-access-gate. | decision:d3-file-access-gate | — |
| `release-spec-to-resolve-d3-file-access-gate-1-consumes` | `specify-release-reconciliation` | `consumes` | `resolve-d3-file-access-gate` | resolve-d3-file-access-gate requires the current artifact:architecture-spec-file-access artifact. | artifact:architecture-spec-file-access | — |
| `release-spec-to-resolve-d3-file-access-gate-1-invalidates` | `specify-release-reconciliation` | `invalidates` | `resolve-d3-file-access-gate` | A material change to artifact:architecture-spec-file-access invalidates decision:d3-file-access-gate. | decision:d3-file-access-gate | — |
| `release-spec-to-resolve-d3-file-access-gate-2-consumes` | `specify-release-reconciliation` | `consumes` | `resolve-d3-file-access-gate` | resolve-d3-file-access-gate requires the current artifact:acceptance-spec-file-access artifact. | artifact:acceptance-spec-file-access | — |
| `release-spec-to-resolve-d3-file-access-gate-2-invalidates` | `specify-release-reconciliation` | `invalidates` | `resolve-d3-file-access-gate` | A material change to artifact:acceptance-spec-file-access invalidates decision:d3-file-access-gate. | decision:d3-file-access-gate | — |
| `release-spec-to-resolve-d3-file-access-gate-3-consumes` | `specify-release-reconciliation` | `consumes` | `resolve-d3-file-access-gate` | resolve-d3-file-access-gate requires the current artifact:open-questions-file-access artifact. | artifact:open-questions-file-access | — |
| `release-spec-to-resolve-d3-file-access-gate-3-invalidates` | `specify-release-reconciliation` | `invalidates` | `resolve-d3-file-access-gate` | A material change to artifact:open-questions-file-access invalidates decision:d3-file-access-gate. | decision:d3-file-access-gate | — |
| `baseline-to-resolve-d4-orchestrator-history-visibility-consumes` | `baseline-context` | `consumes` | `resolve-d4-orchestrator-history-visibility` | resolve-d4-orchestrator-history-visibility requires the current artifact:baseline-context artifact. | artifact:baseline-context | — |
| `baseline-to-resolve-d4-orchestrator-history-visibility-invalidates` | `baseline-context` | `invalidates` | `resolve-d4-orchestrator-history-visibility` | A material change to artifact:baseline-context invalidates decision:d4-orchestrator-history-visibility. | decision:d4-orchestrator-history-visibility | — |
| `release-spec-to-resolve-d4-orchestrator-history-visibility-0-consumes` | `specify-release-reconciliation` | `consumes` | `resolve-d4-orchestrator-history-visibility` | resolve-d4-orchestrator-history-visibility requires the current artifact:product-spec-file-access artifact. | artifact:product-spec-file-access | — |
| `release-spec-to-resolve-d4-orchestrator-history-visibility-0-invalidates` | `specify-release-reconciliation` | `invalidates` | `resolve-d4-orchestrator-history-visibility` | A material change to artifact:product-spec-file-access invalidates decision:d4-orchestrator-history-visibility. | decision:d4-orchestrator-history-visibility | — |
| `release-spec-to-resolve-d4-orchestrator-history-visibility-1-consumes` | `specify-release-reconciliation` | `consumes` | `resolve-d4-orchestrator-history-visibility` | resolve-d4-orchestrator-history-visibility requires the current artifact:architecture-spec-file-access artifact. | artifact:architecture-spec-file-access | — |
| `release-spec-to-resolve-d4-orchestrator-history-visibility-1-invalidates` | `specify-release-reconciliation` | `invalidates` | `resolve-d4-orchestrator-history-visibility` | A material change to artifact:architecture-spec-file-access invalidates decision:d4-orchestrator-history-visibility. | decision:d4-orchestrator-history-visibility | — |
| `release-spec-to-resolve-d4-orchestrator-history-visibility-2-consumes` | `specify-release-reconciliation` | `consumes` | `resolve-d4-orchestrator-history-visibility` | resolve-d4-orchestrator-history-visibility requires the current artifact:acceptance-spec-file-access artifact. | artifact:acceptance-spec-file-access | — |
| `release-spec-to-resolve-d4-orchestrator-history-visibility-2-invalidates` | `specify-release-reconciliation` | `invalidates` | `resolve-d4-orchestrator-history-visibility` | A material change to artifact:acceptance-spec-file-access invalidates decision:d4-orchestrator-history-visibility. | decision:d4-orchestrator-history-visibility | — |
| `release-spec-to-resolve-d4-orchestrator-history-visibility-3-consumes` | `specify-release-reconciliation` | `consumes` | `resolve-d4-orchestrator-history-visibility` | resolve-d4-orchestrator-history-visibility requires the current artifact:open-questions-file-access artifact. | artifact:open-questions-file-access | — |
| `release-spec-to-resolve-d4-orchestrator-history-visibility-3-invalidates` | `specify-release-reconciliation` | `invalidates` | `resolve-d4-orchestrator-history-visibility` | A material change to artifact:open-questions-file-access invalidates decision:d4-orchestrator-history-visibility. | decision:d4-orchestrator-history-visibility | — |
| `release-spec-to-verification-0-consumes` | `specify-release-reconciliation` | `consumes` | `verify-release-reconciliation-specifications` | verify-release-reconciliation-specifications requires the current artifact:product-spec artifact. | artifact:product-spec | — |
| `release-spec-to-verification-0-invalidates` | `specify-release-reconciliation` | `invalidates` | `verify-release-reconciliation-specifications` | A material change to artifact:product-spec invalidates artifact:release-reconciliation-specification-verification. | artifact:release-reconciliation-specification-verification | — |
| `release-spec-to-plan-0-consumes` | `specify-release-reconciliation` | `consumes` | `plan-implementation` | plan-implementation requires the current artifact:product-spec artifact. | artifact:product-spec | — |
| `release-spec-to-plan-0-invalidates` | `specify-release-reconciliation` | `invalidates` | `plan-implementation` | A material change to artifact:product-spec invalidates artifact:implementation-plan. | artifact:implementation-plan | — |
| `release-spec-to-verification-1-consumes` | `specify-release-reconciliation` | `consumes` | `verify-release-reconciliation-specifications` | verify-release-reconciliation-specifications requires the current artifact:constraints-and-risks artifact. | artifact:constraints-and-risks | — |
| `release-spec-to-verification-1-invalidates` | `specify-release-reconciliation` | `invalidates` | `verify-release-reconciliation-specifications` | A material change to artifact:constraints-and-risks invalidates artifact:release-reconciliation-specification-verification. | artifact:release-reconciliation-specification-verification | — |
| `release-spec-to-plan-1-consumes` | `specify-release-reconciliation` | `consumes` | `plan-implementation` | plan-implementation requires the current artifact:constraints-and-risks artifact. | artifact:constraints-and-risks | — |
| `release-spec-to-plan-1-invalidates` | `specify-release-reconciliation` | `invalidates` | `plan-implementation` | A material change to artifact:constraints-and-risks invalidates artifact:implementation-plan. | artifact:implementation-plan | — |
| `release-spec-to-verification-2-consumes` | `specify-release-reconciliation` | `consumes` | `verify-release-reconciliation-specifications` | verify-release-reconciliation-specifications requires the current artifact:architecture-spec artifact. | artifact:architecture-spec | — |
| `release-spec-to-verification-2-invalidates` | `specify-release-reconciliation` | `invalidates` | `verify-release-reconciliation-specifications` | A material change to artifact:architecture-spec invalidates artifact:release-reconciliation-specification-verification. | artifact:release-reconciliation-specification-verification | — |
| `release-spec-to-plan-2-consumes` | `specify-release-reconciliation` | `consumes` | `plan-implementation` | plan-implementation requires the current artifact:architecture-spec artifact. | artifact:architecture-spec | — |
| `release-spec-to-plan-2-invalidates` | `specify-release-reconciliation` | `invalidates` | `plan-implementation` | A material change to artifact:architecture-spec invalidates artifact:implementation-plan. | artifact:implementation-plan | — |
| `release-spec-to-verification-3-consumes` | `specify-release-reconciliation` | `consumes` | `verify-release-reconciliation-specifications` | verify-release-reconciliation-specifications requires the current artifact:acceptance-spec artifact. | artifact:acceptance-spec | — |
| `release-spec-to-verification-3-invalidates` | `specify-release-reconciliation` | `invalidates` | `verify-release-reconciliation-specifications` | A material change to artifact:acceptance-spec invalidates artifact:release-reconciliation-specification-verification. | artifact:release-reconciliation-specification-verification | — |
| `release-spec-to-plan-3-consumes` | `specify-release-reconciliation` | `consumes` | `plan-implementation` | plan-implementation requires the current artifact:acceptance-spec artifact. | artifact:acceptance-spec | — |
| `release-spec-to-plan-3-invalidates` | `specify-release-reconciliation` | `invalidates` | `plan-implementation` | A material change to artifact:acceptance-spec invalidates artifact:implementation-plan. | artifact:implementation-plan | — |
| `release-spec-to-verification-4-consumes` | `specify-release-reconciliation` | `consumes` | `verify-release-reconciliation-specifications` | verify-release-reconciliation-specifications requires the current artifact:open-questions artifact. | artifact:open-questions | — |
| `release-spec-to-verification-4-invalidates` | `specify-release-reconciliation` | `invalidates` | `verify-release-reconciliation-specifications` | A material change to artifact:open-questions invalidates artifact:release-reconciliation-specification-verification. | artifact:release-reconciliation-specification-verification | — |
| `release-spec-to-plan-4-consumes` | `specify-release-reconciliation` | `consumes` | `plan-implementation` | plan-implementation requires the current artifact:open-questions artifact. | artifact:open-questions | — |
| `release-spec-to-plan-4-invalidates` | `specify-release-reconciliation` | `invalidates` | `plan-implementation` | A material change to artifact:open-questions invalidates artifact:implementation-plan. | artifact:implementation-plan | — |
| `release-spec-to-verification-5-consumes` | `specify-release-reconciliation` | `consumes` | `verify-release-reconciliation-specifications` | verify-release-reconciliation-specifications requires the current artifact:product-spec-workspace artifact. | artifact:product-spec-workspace | — |
| `release-spec-to-verification-5-invalidates` | `specify-release-reconciliation` | `invalidates` | `verify-release-reconciliation-specifications` | A material change to artifact:product-spec-workspace invalidates artifact:release-reconciliation-specification-verification. | artifact:release-reconciliation-specification-verification | — |
| `release-spec-to-plan-5-consumes` | `specify-release-reconciliation` | `consumes` | `plan-implementation` | plan-implementation requires the current artifact:product-spec-workspace artifact. | artifact:product-spec-workspace | — |
| `release-spec-to-plan-5-invalidates` | `specify-release-reconciliation` | `invalidates` | `plan-implementation` | A material change to artifact:product-spec-workspace invalidates artifact:implementation-plan. | artifact:implementation-plan | — |
| `release-spec-to-verification-6-consumes` | `specify-release-reconciliation` | `consumes` | `verify-release-reconciliation-specifications` | verify-release-reconciliation-specifications requires the current artifact:architecture-spec-workspace artifact. | artifact:architecture-spec-workspace | — |
| `release-spec-to-verification-6-invalidates` | `specify-release-reconciliation` | `invalidates` | `verify-release-reconciliation-specifications` | A material change to artifact:architecture-spec-workspace invalidates artifact:release-reconciliation-specification-verification. | artifact:release-reconciliation-specification-verification | — |
| `release-spec-to-plan-6-consumes` | `specify-release-reconciliation` | `consumes` | `plan-implementation` | plan-implementation requires the current artifact:architecture-spec-workspace artifact. | artifact:architecture-spec-workspace | — |
| `release-spec-to-plan-6-invalidates` | `specify-release-reconciliation` | `invalidates` | `plan-implementation` | A material change to artifact:architecture-spec-workspace invalidates artifact:implementation-plan. | artifact:implementation-plan | — |
| `release-spec-to-verification-7-consumes` | `specify-release-reconciliation` | `consumes` | `verify-release-reconciliation-specifications` | verify-release-reconciliation-specifications requires the current artifact:acceptance-spec-workspace artifact. | artifact:acceptance-spec-workspace | — |
| `release-spec-to-verification-7-invalidates` | `specify-release-reconciliation` | `invalidates` | `verify-release-reconciliation-specifications` | A material change to artifact:acceptance-spec-workspace invalidates artifact:release-reconciliation-specification-verification. | artifact:release-reconciliation-specification-verification | — |
| `release-spec-to-plan-7-consumes` | `specify-release-reconciliation` | `consumes` | `plan-implementation` | plan-implementation requires the current artifact:acceptance-spec-workspace artifact. | artifact:acceptance-spec-workspace | — |
| `release-spec-to-plan-7-invalidates` | `specify-release-reconciliation` | `invalidates` | `plan-implementation` | A material change to artifact:acceptance-spec-workspace invalidates artifact:implementation-plan. | artifact:implementation-plan | — |
| `release-spec-to-verification-8-consumes` | `specify-release-reconciliation` | `consumes` | `verify-release-reconciliation-specifications` | verify-release-reconciliation-specifications requires the current artifact:open-questions-workspace artifact. | artifact:open-questions-workspace | — |
| `release-spec-to-verification-8-invalidates` | `specify-release-reconciliation` | `invalidates` | `verify-release-reconciliation-specifications` | A material change to artifact:open-questions-workspace invalidates artifact:release-reconciliation-specification-verification. | artifact:release-reconciliation-specification-verification | — |
| `release-spec-to-plan-8-consumes` | `specify-release-reconciliation` | `consumes` | `plan-implementation` | plan-implementation requires the current artifact:open-questions-workspace artifact. | artifact:open-questions-workspace | — |
| `release-spec-to-plan-8-invalidates` | `specify-release-reconciliation` | `invalidates` | `plan-implementation` | A material change to artifact:open-questions-workspace invalidates artifact:implementation-plan. | artifact:implementation-plan | — |
| `release-spec-to-verification-9-consumes` | `specify-release-reconciliation` | `consumes` | `verify-release-reconciliation-specifications` | verify-release-reconciliation-specifications requires the current artifact:product-spec-file-access artifact. | artifact:product-spec-file-access | — |
| `release-spec-to-verification-9-invalidates` | `specify-release-reconciliation` | `invalidates` | `verify-release-reconciliation-specifications` | A material change to artifact:product-spec-file-access invalidates artifact:release-reconciliation-specification-verification. | artifact:release-reconciliation-specification-verification | — |
| `release-spec-to-plan-9-consumes` | `specify-release-reconciliation` | `consumes` | `plan-implementation` | plan-implementation requires the current artifact:product-spec-file-access artifact. | artifact:product-spec-file-access | — |
| `release-spec-to-plan-9-invalidates` | `specify-release-reconciliation` | `invalidates` | `plan-implementation` | A material change to artifact:product-spec-file-access invalidates artifact:implementation-plan. | artifact:implementation-plan | — |
| `release-spec-to-verification-10-consumes` | `specify-release-reconciliation` | `consumes` | `verify-release-reconciliation-specifications` | verify-release-reconciliation-specifications requires the current artifact:architecture-spec-file-access artifact. | artifact:architecture-spec-file-access | — |
| `release-spec-to-verification-10-invalidates` | `specify-release-reconciliation` | `invalidates` | `verify-release-reconciliation-specifications` | A material change to artifact:architecture-spec-file-access invalidates artifact:release-reconciliation-specification-verification. | artifact:release-reconciliation-specification-verification | — |
| `release-spec-to-plan-10-consumes` | `specify-release-reconciliation` | `consumes` | `plan-implementation` | plan-implementation requires the current artifact:architecture-spec-file-access artifact. | artifact:architecture-spec-file-access | — |
| `release-spec-to-plan-10-invalidates` | `specify-release-reconciliation` | `invalidates` | `plan-implementation` | A material change to artifact:architecture-spec-file-access invalidates artifact:implementation-plan. | artifact:implementation-plan | — |
| `release-spec-to-verification-11-consumes` | `specify-release-reconciliation` | `consumes` | `verify-release-reconciliation-specifications` | verify-release-reconciliation-specifications requires the current artifact:acceptance-spec-file-access artifact. | artifact:acceptance-spec-file-access | — |
| `release-spec-to-verification-11-invalidates` | `specify-release-reconciliation` | `invalidates` | `verify-release-reconciliation-specifications` | A material change to artifact:acceptance-spec-file-access invalidates artifact:release-reconciliation-specification-verification. | artifact:release-reconciliation-specification-verification | — |
| `release-spec-to-plan-11-consumes` | `specify-release-reconciliation` | `consumes` | `plan-implementation` | plan-implementation requires the current artifact:acceptance-spec-file-access artifact. | artifact:acceptance-spec-file-access | — |
| `release-spec-to-plan-11-invalidates` | `specify-release-reconciliation` | `invalidates` | `plan-implementation` | A material change to artifact:acceptance-spec-file-access invalidates artifact:implementation-plan. | artifact:implementation-plan | — |
| `release-spec-to-verification-12-consumes` | `specify-release-reconciliation` | `consumes` | `verify-release-reconciliation-specifications` | verify-release-reconciliation-specifications requires the current artifact:open-questions-file-access artifact. | artifact:open-questions-file-access | — |
| `release-spec-to-verification-12-invalidates` | `specify-release-reconciliation` | `invalidates` | `verify-release-reconciliation-specifications` | A material change to artifact:open-questions-file-access invalidates artifact:release-reconciliation-specification-verification. | artifact:release-reconciliation-specification-verification | — |
| `release-spec-to-plan-12-consumes` | `specify-release-reconciliation` | `consumes` | `plan-implementation` | plan-implementation requires the current artifact:open-questions-file-access artifact. | artifact:open-questions-file-access | — |
| `release-spec-to-plan-12-invalidates` | `specify-release-reconciliation` | `invalidates` | `plan-implementation` | A material change to artifact:open-questions-file-access invalidates artifact:implementation-plan. | artifact:implementation-plan | — |
| `resolve-d2-workspace-root-isolation-to-spec-verification-consumes` | `resolve-d2-workspace-root-isolation` | `consumes` | `verify-release-reconciliation-specifications` | verify-release-reconciliation-specifications requires the current decision:d2-workspace-root-isolation artifact. | decision:d2-workspace-root-isolation | — |
| `resolve-d2-workspace-root-isolation-to-spec-verification-invalidates` | `resolve-d2-workspace-root-isolation` | `invalidates` | `verify-release-reconciliation-specifications` | A material change to decision:d2-workspace-root-isolation invalidates artifact:release-reconciliation-specification-verification. | artifact:release-reconciliation-specification-verification | — |
| `resolve-d2-workspace-root-isolation-to-plan-consumes` | `resolve-d2-workspace-root-isolation` | `consumes` | `plan-implementation` | plan-implementation requires the current decision:d2-workspace-root-isolation artifact. | decision:d2-workspace-root-isolation | — |
| `resolve-d2-workspace-root-isolation-to-plan-invalidates` | `resolve-d2-workspace-root-isolation` | `invalidates` | `plan-implementation` | A material change to decision:d2-workspace-root-isolation invalidates artifact:implementation-plan. | artifact:implementation-plan | — |
| `resolve-d3-file-access-gate-to-spec-verification-consumes` | `resolve-d3-file-access-gate` | `consumes` | `verify-release-reconciliation-specifications` | verify-release-reconciliation-specifications requires the current decision:d3-file-access-gate artifact. | decision:d3-file-access-gate | — |
| `resolve-d3-file-access-gate-to-spec-verification-invalidates` | `resolve-d3-file-access-gate` | `invalidates` | `verify-release-reconciliation-specifications` | A material change to decision:d3-file-access-gate invalidates artifact:release-reconciliation-specification-verification. | artifact:release-reconciliation-specification-verification | — |
| `resolve-d3-file-access-gate-to-plan-consumes` | `resolve-d3-file-access-gate` | `consumes` | `plan-implementation` | plan-implementation requires the current decision:d3-file-access-gate artifact. | decision:d3-file-access-gate | — |
| `resolve-d3-file-access-gate-to-plan-invalidates` | `resolve-d3-file-access-gate` | `invalidates` | `plan-implementation` | A material change to decision:d3-file-access-gate invalidates artifact:implementation-plan. | artifact:implementation-plan | — |
| `release-specification-to-beta-contract-consumes` | `verify-release-reconciliation-specifications` | `consumes` | `approve-beta-release-contract` | approve-beta-release-contract requires the current artifact:release-reconciliation-specification-verification artifact. | artifact:release-reconciliation-specification-verification | — |
| `release-specification-validates-beta-contract` | `verify-release-reconciliation-specifications` | `validates` | `approve-beta-release-contract` | The reconciled release specifications and decision lineage pass deterministic validation. | artifact:release-reconciliation-specification-verification | — |
| `beta-contract-approves-implementation-plan` | `approve-beta-release-contract` | `approves` | `plan-implementation` | The owner approves the complete fixed 0.1.0 release contract for planning. | artifact:beta-release-contract | — |
| `plan-to-implement-runtime-root-layout-consumes` | `plan-implementation` | `consumes` | `implement-runtime-root-layout` | implement-runtime-root-layout requires the current artifact:implementation-plan artifact. | artifact:implementation-plan | — |
| `plan-to-implement-runtime-root-layout-invalidates` | `plan-implementation` | `invalidates` | `implement-runtime-root-layout` | A material change to artifact:implementation-plan invalidates artifact:runtime-root-layout-change. | artifact:runtime-root-layout-change | — |
| `beta-contract-to-implement-runtime-root-layout-consumes` | `approve-beta-release-contract` | `consumes` | `implement-runtime-root-layout` | implement-runtime-root-layout requires the current artifact:beta-release-contract artifact. | artifact:beta-release-contract | — |
| `beta-contract-to-implement-runtime-root-layout-invalidates` | `approve-beta-release-contract` | `invalidates` | `implement-runtime-root-layout` | A material change to artifact:beta-release-contract invalidates artifact:runtime-root-layout-change. | artifact:runtime-root-layout-change | — |
| `beta-contract-approves-implement-runtime-root-layout` | `approve-beta-release-contract` | `approves` | `implement-runtime-root-layout` | The current owner-approved beta contract authorizes this bounded reversible implementation member. | artifact:beta-release-contract | — |
| `plan-to-implement-file-access-approval-gate-consumes` | `plan-implementation` | `consumes` | `implement-file-access-approval-gate` | implement-file-access-approval-gate requires the current artifact:implementation-plan artifact. | artifact:implementation-plan | — |
| `plan-to-implement-file-access-approval-gate-invalidates` | `plan-implementation` | `invalidates` | `implement-file-access-approval-gate` | A material change to artifact:implementation-plan invalidates artifact:file-access-approval-gate-change. | artifact:file-access-approval-gate-change | — |
| `beta-contract-to-implement-file-access-approval-gate-consumes` | `approve-beta-release-contract` | `consumes` | `implement-file-access-approval-gate` | implement-file-access-approval-gate requires the current artifact:beta-release-contract artifact. | artifact:beta-release-contract | — |
| `beta-contract-to-implement-file-access-approval-gate-invalidates` | `approve-beta-release-contract` | `invalidates` | `implement-file-access-approval-gate` | A material change to artifact:beta-release-contract invalidates artifact:file-access-approval-gate-change. | artifact:file-access-approval-gate-change | — |
| `beta-contract-approves-implement-file-access-approval-gate` | `approve-beta-release-contract` | `approves` | `implement-file-access-approval-gate` | The current owner-approved beta contract authorizes this bounded reversible implementation member. | artifact:beta-release-contract | — |
| `plan-to-implement-coding-worker-progress-consumes` | `plan-implementation` | `consumes` | `implement-coding-worker-progress` | implement-coding-worker-progress requires the current artifact:implementation-plan artifact. | artifact:implementation-plan | — |
| `plan-to-implement-coding-worker-progress-invalidates` | `plan-implementation` | `invalidates` | `implement-coding-worker-progress` | A material change to artifact:implementation-plan invalidates artifact:coding-worker-progress-change. | artifact:coding-worker-progress-change | — |
| `beta-contract-to-implement-coding-worker-progress-consumes` | `approve-beta-release-contract` | `consumes` | `implement-coding-worker-progress` | implement-coding-worker-progress requires the current artifact:beta-release-contract artifact. | artifact:beta-release-contract | — |
| `beta-contract-to-implement-coding-worker-progress-invalidates` | `approve-beta-release-contract` | `invalidates` | `implement-coding-worker-progress` | A material change to artifact:beta-release-contract invalidates artifact:coding-worker-progress-change. | artifact:coding-worker-progress-change | — |
| `beta-contract-approves-implement-coding-worker-progress` | `approve-beta-release-contract` | `approves` | `implement-coding-worker-progress` | The current owner-approved beta contract authorizes this bounded reversible implementation member. | artifact:beta-release-contract | — |
| `plan-to-implement-coding-worker-github-flow-consumes` | `plan-implementation` | `consumes` | `implement-coding-worker-github-flow` | implement-coding-worker-github-flow requires the current artifact:implementation-plan artifact. | artifact:implementation-plan | — |
| `plan-to-implement-coding-worker-github-flow-invalidates` | `plan-implementation` | `invalidates` | `implement-coding-worker-github-flow` | A material change to artifact:implementation-plan invalidates artifact:coding-worker-github-flow-change. | artifact:coding-worker-github-flow-change | — |
| `beta-contract-to-implement-coding-worker-github-flow-consumes` | `approve-beta-release-contract` | `consumes` | `implement-coding-worker-github-flow` | implement-coding-worker-github-flow requires the current artifact:beta-release-contract artifact. | artifact:beta-release-contract | — |
| `beta-contract-to-implement-coding-worker-github-flow-invalidates` | `approve-beta-release-contract` | `invalidates` | `implement-coding-worker-github-flow` | A material change to artifact:beta-release-contract invalidates artifact:coding-worker-github-flow-change. | artifact:coding-worker-github-flow-change | — |
| `beta-contract-approves-implement-coding-worker-github-flow` | `approve-beta-release-contract` | `approves` | `implement-coding-worker-github-flow` | The current owner-approved beta contract authorizes this bounded reversible implementation member. | artifact:beta-release-contract | — |
| `plan-to-implement-coding-worker-scaffold-tooling-consumes` | `plan-implementation` | `consumes` | `implement-coding-worker-scaffold-tooling` | implement-coding-worker-scaffold-tooling requires the current artifact:implementation-plan artifact. | artifact:implementation-plan | — |
| `plan-to-implement-coding-worker-scaffold-tooling-invalidates` | `plan-implementation` | `invalidates` | `implement-coding-worker-scaffold-tooling` | A material change to artifact:implementation-plan invalidates artifact:coding-worker-scaffold-tooling-change. | artifact:coding-worker-scaffold-tooling-change | — |
| `beta-contract-to-implement-coding-worker-scaffold-tooling-consumes` | `approve-beta-release-contract` | `consumes` | `implement-coding-worker-scaffold-tooling` | implement-coding-worker-scaffold-tooling requires the current artifact:beta-release-contract artifact. | artifact:beta-release-contract | — |
| `beta-contract-to-implement-coding-worker-scaffold-tooling-invalidates` | `approve-beta-release-contract` | `invalidates` | `implement-coding-worker-scaffold-tooling` | A material change to artifact:beta-release-contract invalidates artifact:coding-worker-scaffold-tooling-change. | artifact:coding-worker-scaffold-tooling-change | — |
| `beta-contract-approves-implement-coding-worker-scaffold-tooling` | `approve-beta-release-contract` | `approves` | `implement-coding-worker-scaffold-tooling` | The current owner-approved beta contract authorizes this bounded reversible implementation member. | artifact:beta-release-contract | — |
| `plan-to-implement-orchestrator-worker-verification-consumes` | `plan-implementation` | `consumes` | `implement-orchestrator-worker-verification` | implement-orchestrator-worker-verification requires the current artifact:implementation-plan artifact. | artifact:implementation-plan | — |
| `plan-to-implement-orchestrator-worker-verification-invalidates` | `plan-implementation` | `invalidates` | `implement-orchestrator-worker-verification` | A material change to artifact:implementation-plan invalidates artifact:orchestrator-worker-verification-change. | artifact:orchestrator-worker-verification-change | — |
| `beta-contract-to-implement-orchestrator-worker-verification-consumes` | `approve-beta-release-contract` | `consumes` | `implement-orchestrator-worker-verification` | implement-orchestrator-worker-verification requires the current artifact:beta-release-contract artifact. | artifact:beta-release-contract | — |
| `beta-contract-to-implement-orchestrator-worker-verification-invalidates` | `approve-beta-release-contract` | `invalidates` | `implement-orchestrator-worker-verification` | A material change to artifact:beta-release-contract invalidates artifact:orchestrator-worker-verification-change. | artifact:orchestrator-worker-verification-change | — |
| `beta-contract-approves-implement-orchestrator-worker-verification` | `approve-beta-release-contract` | `approves` | `implement-orchestrator-worker-verification` | The current owner-approved beta contract authorizes this bounded reversible implementation member. | artifact:beta-release-contract | — |
| `plan-to-implement-tui-message-queue-consumes` | `plan-implementation` | `consumes` | `implement-tui-message-queue` | implement-tui-message-queue requires the current artifact:implementation-plan artifact. | artifact:implementation-plan | — |
| `plan-to-implement-tui-message-queue-invalidates` | `plan-implementation` | `invalidates` | `implement-tui-message-queue` | A material change to artifact:implementation-plan invalidates artifact:tui-message-queue-change. | artifact:tui-message-queue-change | — |
| `beta-contract-to-implement-tui-message-queue-consumes` | `approve-beta-release-contract` | `consumes` | `implement-tui-message-queue` | implement-tui-message-queue requires the current artifact:beta-release-contract artifact. | artifact:beta-release-contract | — |
| `beta-contract-to-implement-tui-message-queue-invalidates` | `approve-beta-release-contract` | `invalidates` | `implement-tui-message-queue` | A material change to artifact:beta-release-contract invalidates artifact:tui-message-queue-change. | artifact:tui-message-queue-change | — |
| `beta-contract-approves-implement-tui-message-queue` | `approve-beta-release-contract` | `approves` | `implement-tui-message-queue` | The current owner-approved beta contract authorizes this bounded reversible implementation member. | artifact:beta-release-contract | — |
| `plan-to-implement-tui-status-context-meter-consumes` | `plan-implementation` | `consumes` | `implement-tui-status-context-meter` | implement-tui-status-context-meter requires the current artifact:implementation-plan artifact. | artifact:implementation-plan | — |
| `plan-to-implement-tui-status-context-meter-invalidates` | `plan-implementation` | `invalidates` | `implement-tui-status-context-meter` | A material change to artifact:implementation-plan invalidates artifact:tui-status-context-meter-change. | artifact:tui-status-context-meter-change | — |
| `beta-contract-to-implement-tui-status-context-meter-consumes` | `approve-beta-release-contract` | `consumes` | `implement-tui-status-context-meter` | implement-tui-status-context-meter requires the current artifact:beta-release-contract artifact. | artifact:beta-release-contract | — |
| `beta-contract-to-implement-tui-status-context-meter-invalidates` | `approve-beta-release-contract` | `invalidates` | `implement-tui-status-context-meter` | A material change to artifact:beta-release-contract invalidates artifact:tui-status-context-meter-change. | artifact:tui-status-context-meter-change | — |
| `beta-contract-approves-implement-tui-status-context-meter` | `approve-beta-release-contract` | `approves` | `implement-tui-status-context-meter` | The current owner-approved beta contract authorizes this bounded reversible implementation member. | artifact:beta-release-contract | — |
| `plan-to-implement-tui-prompt-editor-polish-consumes` | `plan-implementation` | `consumes` | `implement-tui-prompt-editor-polish` | implement-tui-prompt-editor-polish requires the current artifact:implementation-plan artifact. | artifact:implementation-plan | — |
| `plan-to-implement-tui-prompt-editor-polish-invalidates` | `plan-implementation` | `invalidates` | `implement-tui-prompt-editor-polish` | A material change to artifact:implementation-plan invalidates artifact:tui-prompt-editor-polish-change. | artifact:tui-prompt-editor-polish-change | — |
| `beta-contract-to-implement-tui-prompt-editor-polish-consumes` | `approve-beta-release-contract` | `consumes` | `implement-tui-prompt-editor-polish` | implement-tui-prompt-editor-polish requires the current artifact:beta-release-contract artifact. | artifact:beta-release-contract | — |
| `beta-contract-to-implement-tui-prompt-editor-polish-invalidates` | `approve-beta-release-contract` | `invalidates` | `implement-tui-prompt-editor-polish` | A material change to artifact:beta-release-contract invalidates artifact:tui-prompt-editor-polish-change. | artifact:tui-prompt-editor-polish-change | — |
| `beta-contract-approves-implement-tui-prompt-editor-polish` | `approve-beta-release-contract` | `approves` | `implement-tui-prompt-editor-polish` | The current owner-approved beta contract authorizes this bounded reversible implementation member. | artifact:beta-release-contract | — |
| `plan-to-implement-tui-thinking-transcript-consumes` | `plan-implementation` | `consumes` | `implement-tui-thinking-transcript` | implement-tui-thinking-transcript requires the current artifact:implementation-plan artifact. | artifact:implementation-plan | — |
| `plan-to-implement-tui-thinking-transcript-invalidates` | `plan-implementation` | `invalidates` | `implement-tui-thinking-transcript` | A material change to artifact:implementation-plan invalidates artifact:tui-thinking-transcript-change. | artifact:tui-thinking-transcript-change | — |
| `beta-contract-to-implement-tui-thinking-transcript-consumes` | `approve-beta-release-contract` | `consumes` | `implement-tui-thinking-transcript` | implement-tui-thinking-transcript requires the current artifact:beta-release-contract artifact. | artifact:beta-release-contract | — |
| `beta-contract-to-implement-tui-thinking-transcript-invalidates` | `approve-beta-release-contract` | `invalidates` | `implement-tui-thinking-transcript` | A material change to artifact:beta-release-contract invalidates artifact:tui-thinking-transcript-change. | artifact:tui-thinking-transcript-change | — |
| `beta-contract-approves-implement-tui-thinking-transcript` | `approve-beta-release-contract` | `approves` | `implement-tui-thinking-transcript` | The current owner-approved beta contract authorizes this bounded reversible implementation member. | artifact:beta-release-contract | — |
| `plan-to-implement-connector-approval-controls-consumes` | `plan-implementation` | `consumes` | `implement-connector-approval-controls` | implement-connector-approval-controls requires the current artifact:implementation-plan artifact. | artifact:implementation-plan | — |
| `plan-to-implement-connector-approval-controls-invalidates` | `plan-implementation` | `invalidates` | `implement-connector-approval-controls` | A material change to artifact:implementation-plan invalidates artifact:connector-approval-controls-change. | artifact:connector-approval-controls-change | — |
| `beta-contract-to-implement-connector-approval-controls-consumes` | `approve-beta-release-contract` | `consumes` | `implement-connector-approval-controls` | implement-connector-approval-controls requires the current artifact:beta-release-contract artifact. | artifact:beta-release-contract | — |
| `beta-contract-to-implement-connector-approval-controls-invalidates` | `approve-beta-release-contract` | `invalidates` | `implement-connector-approval-controls` | A material change to artifact:beta-release-contract invalidates artifact:connector-approval-controls-change. | artifact:connector-approval-controls-change | — |
| `beta-contract-approves-implement-connector-approval-controls` | `approve-beta-release-contract` | `approves` | `implement-connector-approval-controls` | The current owner-approved beta contract authorizes this bounded reversible implementation member. | artifact:beta-release-contract | — |
| `plan-to-implement-image-reasoning-worker-consumes` | `plan-implementation` | `consumes` | `implement-image-reasoning-worker` | implement-image-reasoning-worker requires the current artifact:implementation-plan artifact. | artifact:implementation-plan | — |
| `plan-to-implement-image-reasoning-worker-invalidates` | `plan-implementation` | `invalidates` | `implement-image-reasoning-worker` | A material change to artifact:implementation-plan invalidates artifact:image-reasoning-worker-change. | artifact:image-reasoning-worker-change | — |
| `beta-contract-to-implement-image-reasoning-worker-consumes` | `approve-beta-release-contract` | `consumes` | `implement-image-reasoning-worker` | implement-image-reasoning-worker requires the current artifact:beta-release-contract artifact. | artifact:beta-release-contract | — |
| `beta-contract-to-implement-image-reasoning-worker-invalidates` | `approve-beta-release-contract` | `invalidates` | `implement-image-reasoning-worker` | A material change to artifact:beta-release-contract invalidates artifact:image-reasoning-worker-change. | artifact:image-reasoning-worker-change | — |
| `beta-contract-approves-implement-image-reasoning-worker` | `approve-beta-release-contract` | `approves` | `implement-image-reasoning-worker` | The current owner-approved beta contract authorizes this bounded reversible implementation member. | artifact:beta-release-contract | — |
| `plan-to-implement-document-index-consumes` | `plan-implementation` | `consumes` | `implement-document-index` | implement-document-index requires the current artifact:implementation-plan artifact. | artifact:implementation-plan | — |
| `plan-to-implement-document-index-invalidates` | `plan-implementation` | `invalidates` | `implement-document-index` | A material change to artifact:implementation-plan invalidates artifact:document-index-change. | artifact:document-index-change | — |
| `beta-contract-to-implement-document-index-consumes` | `approve-beta-release-contract` | `consumes` | `implement-document-index` | implement-document-index requires the current artifact:beta-release-contract artifact. | artifact:beta-release-contract | — |
| `beta-contract-to-implement-document-index-invalidates` | `approve-beta-release-contract` | `invalidates` | `implement-document-index` | A material change to artifact:beta-release-contract invalidates artifact:document-index-change. | artifact:document-index-change | — |
| `beta-contract-approves-implement-document-index` | `approve-beta-release-contract` | `approves` | `implement-document-index` | The current owner-approved beta contract authorizes this bounded reversible implementation member. | artifact:beta-release-contract | — |
| `plan-to-implement-protocol-scoring-consumes` | `plan-implementation` | `consumes` | `implement-protocol-scoring` | implement-protocol-scoring requires the current artifact:implementation-plan artifact. | artifact:implementation-plan | — |
| `plan-to-implement-protocol-scoring-invalidates` | `plan-implementation` | `invalidates` | `implement-protocol-scoring` | A material change to artifact:implementation-plan invalidates artifact:protocol-scoring-change. | artifact:protocol-scoring-change | — |
| `beta-contract-to-implement-protocol-scoring-consumes` | `approve-beta-release-contract` | `consumes` | `implement-protocol-scoring` | implement-protocol-scoring requires the current artifact:beta-release-contract artifact. | artifact:beta-release-contract | — |
| `beta-contract-to-implement-protocol-scoring-invalidates` | `approve-beta-release-contract` | `invalidates` | `implement-protocol-scoring` | A material change to artifact:beta-release-contract invalidates artifact:protocol-scoring-change. | artifact:protocol-scoring-change | — |
| `beta-contract-approves-implement-protocol-scoring` | `approve-beta-release-contract` | `approves` | `implement-protocol-scoring` | The current owner-approved beta contract authorizes this bounded reversible implementation member. | artifact:beta-release-contract | — |
| `implement-core-contracts-to-implement-runtime-root-layout-3-consumes` | `implement-core-contracts` | `consumes` | `implement-runtime-root-layout` | implement-runtime-root-layout requires the current artifact:core-contracts-change artifact. | artifact:core-contracts-change | — |
| `implement-core-contracts-to-implement-runtime-root-layout-3-invalidates` | `implement-core-contracts` | `invalidates` | `implement-runtime-root-layout` | A material change to artifact:core-contracts-change invalidates artifact:runtime-root-layout-change. | artifact:runtime-root-layout-change | — |
| `implement-agent-runtime-to-implement-runtime-root-layout-4-consumes` | `implement-agent-runtime` | `consumes` | `implement-runtime-root-layout` | implement-runtime-root-layout requires the current artifact:agent-runtime-change artifact. | artifact:agent-runtime-change | — |
| `implement-agent-runtime-to-implement-runtime-root-layout-4-invalidates` | `implement-agent-runtime` | `invalidates` | `implement-runtime-root-layout` | A material change to artifact:agent-runtime-change invalidates artifact:runtime-root-layout-change. | artifact:runtime-root-layout-change | — |
| `implement-capabilities-security-to-implement-runtime-root-layout-5-consumes` | `implement-capabilities-security` | `consumes` | `implement-runtime-root-layout` | implement-runtime-root-layout requires the current artifact:capabilities-security-change artifact. | artifact:capabilities-security-change | — |
| `implement-capabilities-security-to-implement-runtime-root-layout-5-invalidates` | `implement-capabilities-security` | `invalidates` | `implement-runtime-root-layout` | A material change to artifact:capabilities-security-change invalidates artifact:runtime-root-layout-change. | artifact:runtime-root-layout-change | — |
| `implement-ingress-operations-to-implement-runtime-root-layout-6-consumes` | `implement-ingress-operations` | `consumes` | `implement-runtime-root-layout` | implement-runtime-root-layout requires the current artifact:ingress-operations-change artifact. | artifact:ingress-operations-change | — |
| `implement-ingress-operations-to-implement-runtime-root-layout-6-invalidates` | `implement-ingress-operations` | `invalidates` | `implement-runtime-root-layout` | A material change to artifact:ingress-operations-change invalidates artifact:runtime-root-layout-change. | artifact:runtime-root-layout-change | — |
| `implement-runtime-root-layout-to-implement-file-access-approval-gate-2-consumes` | `implement-runtime-root-layout` | `consumes` | `implement-file-access-approval-gate` | implement-file-access-approval-gate requires the current artifact:runtime-root-layout-change artifact. | artifact:runtime-root-layout-change | — |
| `implement-runtime-root-layout-to-implement-file-access-approval-gate-2-invalidates` | `implement-runtime-root-layout` | `invalidates` | `implement-file-access-approval-gate` | A material change to artifact:runtime-root-layout-change invalidates artifact:file-access-approval-gate-change. | artifact:file-access-approval-gate-change | — |
| `implement-capabilities-security-to-implement-file-access-approval-gate-3-consumes` | `implement-capabilities-security` | `consumes` | `implement-file-access-approval-gate` | implement-file-access-approval-gate requires the current artifact:capabilities-security-change artifact. | artifact:capabilities-security-change | — |
| `implement-capabilities-security-to-implement-file-access-approval-gate-3-invalidates` | `implement-capabilities-security` | `invalidates` | `implement-file-access-approval-gate` | A material change to artifact:capabilities-security-change invalidates artifact:file-access-approval-gate-change. | artifact:file-access-approval-gate-change | — |
| `implement-agent-runtime-to-implement-coding-worker-progress-2-consumes` | `implement-agent-runtime` | `consumes` | `implement-coding-worker-progress` | implement-coding-worker-progress requires the current artifact:agent-runtime-change artifact. | artifact:agent-runtime-change | — |
| `implement-agent-runtime-to-implement-coding-worker-progress-2-invalidates` | `implement-agent-runtime` | `invalidates` | `implement-coding-worker-progress` | A material change to artifact:agent-runtime-change invalidates artifact:coding-worker-progress-change. | artifact:coding-worker-progress-change | — |
| `implement-runtime-root-layout-to-implement-coding-worker-github-flow-2-consumes` | `implement-runtime-root-layout` | `consumes` | `implement-coding-worker-github-flow` | implement-coding-worker-github-flow requires the current artifact:runtime-root-layout-change artifact. | artifact:runtime-root-layout-change | — |
| `implement-runtime-root-layout-to-implement-coding-worker-github-flow-2-invalidates` | `implement-runtime-root-layout` | `invalidates` | `implement-coding-worker-github-flow` | A material change to artifact:runtime-root-layout-change invalidates artifact:coding-worker-github-flow-change. | artifact:coding-worker-github-flow-change | — |
| `implement-agent-runtime-to-implement-coding-worker-github-flow-3-consumes` | `implement-agent-runtime` | `consumes` | `implement-coding-worker-github-flow` | implement-coding-worker-github-flow requires the current artifact:agent-runtime-change artifact. | artifact:agent-runtime-change | — |
| `implement-agent-runtime-to-implement-coding-worker-github-flow-3-invalidates` | `implement-agent-runtime` | `invalidates` | `implement-coding-worker-github-flow` | A material change to artifact:agent-runtime-change invalidates artifact:coding-worker-github-flow-change. | artifact:coding-worker-github-flow-change | — |
| `implement-capabilities-security-to-implement-coding-worker-github-flow-4-consumes` | `implement-capabilities-security` | `consumes` | `implement-coding-worker-github-flow` | implement-coding-worker-github-flow requires the current artifact:capabilities-security-change artifact. | artifact:capabilities-security-change | — |
| `implement-capabilities-security-to-implement-coding-worker-github-flow-4-invalidates` | `implement-capabilities-security` | `invalidates` | `implement-coding-worker-github-flow` | A material change to artifact:capabilities-security-change invalidates artifact:coding-worker-github-flow-change. | artifact:coding-worker-github-flow-change | — |
| `implement-runtime-root-layout-to-implement-coding-worker-scaffold-tooling-2-consumes` | `implement-runtime-root-layout` | `consumes` | `implement-coding-worker-scaffold-tooling` | implement-coding-worker-scaffold-tooling requires the current artifact:runtime-root-layout-change artifact. | artifact:runtime-root-layout-change | — |
| `implement-runtime-root-layout-to-implement-coding-worker-scaffold-tooling-2-invalidates` | `implement-runtime-root-layout` | `invalidates` | `implement-coding-worker-scaffold-tooling` | A material change to artifact:runtime-root-layout-change invalidates artifact:coding-worker-scaffold-tooling-change. | artifact:coding-worker-scaffold-tooling-change | — |
| `implement-agent-runtime-to-implement-coding-worker-scaffold-tooling-3-consumes` | `implement-agent-runtime` | `consumes` | `implement-coding-worker-scaffold-tooling` | implement-coding-worker-scaffold-tooling requires the current artifact:agent-runtime-change artifact. | artifact:agent-runtime-change | — |
| `implement-agent-runtime-to-implement-coding-worker-scaffold-tooling-3-invalidates` | `implement-agent-runtime` | `invalidates` | `implement-coding-worker-scaffold-tooling` | A material change to artifact:agent-runtime-change invalidates artifact:coding-worker-scaffold-tooling-change. | artifact:coding-worker-scaffold-tooling-change | — |
| `implement-runtime-root-layout-to-implement-orchestrator-worker-verification-2-consumes` | `implement-runtime-root-layout` | `consumes` | `implement-orchestrator-worker-verification` | implement-orchestrator-worker-verification requires the current artifact:runtime-root-layout-change artifact. | artifact:runtime-root-layout-change | — |
| `implement-runtime-root-layout-to-implement-orchestrator-worker-verification-2-invalidates` | `implement-runtime-root-layout` | `invalidates` | `implement-orchestrator-worker-verification` | A material change to artifact:runtime-root-layout-change invalidates artifact:orchestrator-worker-verification-change. | artifact:orchestrator-worker-verification-change | — |
| `implement-agent-runtime-to-implement-orchestrator-worker-verification-3-consumes` | `implement-agent-runtime` | `consumes` | `implement-orchestrator-worker-verification` | implement-orchestrator-worker-verification requires the current artifact:agent-runtime-change artifact. | artifact:agent-runtime-change | — |
| `implement-agent-runtime-to-implement-orchestrator-worker-verification-3-invalidates` | `implement-agent-runtime` | `invalidates` | `implement-orchestrator-worker-verification` | A material change to artifact:agent-runtime-change invalidates artifact:orchestrator-worker-verification-change. | artifact:orchestrator-worker-verification-change | — |
| `implement-ingress-operations-to-implement-tui-message-queue-2-consumes` | `implement-ingress-operations` | `consumes` | `implement-tui-message-queue` | implement-tui-message-queue requires the current artifact:ingress-operations-change artifact. | artifact:ingress-operations-change | — |
| `implement-ingress-operations-to-implement-tui-message-queue-2-invalidates` | `implement-ingress-operations` | `invalidates` | `implement-tui-message-queue` | A material change to artifact:ingress-operations-change invalidates artifact:tui-message-queue-change. | artifact:tui-message-queue-change | — |
| `implement-agent-runtime-to-implement-tui-message-queue-3-consumes` | `implement-agent-runtime` | `consumes` | `implement-tui-message-queue` | implement-tui-message-queue requires the current artifact:agent-runtime-change artifact. | artifact:agent-runtime-change | — |
| `implement-agent-runtime-to-implement-tui-message-queue-3-invalidates` | `implement-agent-runtime` | `invalidates` | `implement-tui-message-queue` | A material change to artifact:agent-runtime-change invalidates artifact:tui-message-queue-change. | artifact:tui-message-queue-change | — |
| `implement-tui-message-queue-to-implement-tui-status-context-meter-2-consumes` | `implement-tui-message-queue` | `consumes` | `implement-tui-status-context-meter` | implement-tui-status-context-meter requires the current artifact:tui-message-queue-change artifact. | artifact:tui-message-queue-change | — |
| `implement-tui-message-queue-to-implement-tui-status-context-meter-2-invalidates` | `implement-tui-message-queue` | `invalidates` | `implement-tui-status-context-meter` | A material change to artifact:tui-message-queue-change invalidates artifact:tui-status-context-meter-change. | artifact:tui-status-context-meter-change | — |
| `implement-tui-status-context-meter-to-implement-tui-prompt-editor-polish-2-consumes` | `implement-tui-status-context-meter` | `consumes` | `implement-tui-prompt-editor-polish` | implement-tui-prompt-editor-polish requires the current artifact:tui-status-context-meter-change artifact. | artifact:tui-status-context-meter-change | — |
| `implement-tui-status-context-meter-to-implement-tui-prompt-editor-polish-2-invalidates` | `implement-tui-status-context-meter` | `invalidates` | `implement-tui-prompt-editor-polish` | A material change to artifact:tui-status-context-meter-change invalidates artifact:tui-prompt-editor-polish-change. | artifact:tui-prompt-editor-polish-change | — |
| `implement-tui-prompt-editor-polish-to-implement-tui-thinking-transcript-2-consumes` | `implement-tui-prompt-editor-polish` | `consumes` | `implement-tui-thinking-transcript` | implement-tui-thinking-transcript requires the current artifact:tui-prompt-editor-polish-change artifact. | artifact:tui-prompt-editor-polish-change | — |
| `implement-tui-prompt-editor-polish-to-implement-tui-thinking-transcript-2-invalidates` | `implement-tui-prompt-editor-polish` | `invalidates` | `implement-tui-thinking-transcript` | A material change to artifact:tui-prompt-editor-polish-change invalidates artifact:tui-thinking-transcript-change. | artifact:tui-thinking-transcript-change | — |
| `implement-agent-runtime-to-implement-tui-thinking-transcript-3-consumes` | `implement-agent-runtime` | `consumes` | `implement-tui-thinking-transcript` | implement-tui-thinking-transcript requires the current artifact:agent-runtime-change artifact. | artifact:agent-runtime-change | — |
| `implement-agent-runtime-to-implement-tui-thinking-transcript-3-invalidates` | `implement-agent-runtime` | `invalidates` | `implement-tui-thinking-transcript` | A material change to artifact:agent-runtime-change invalidates artifact:tui-thinking-transcript-change. | artifact:tui-thinking-transcript-change | — |
| `implement-file-access-approval-gate-to-implement-connector-approval-controls-2-consumes` | `implement-file-access-approval-gate` | `consumes` | `implement-connector-approval-controls` | implement-connector-approval-controls requires the current artifact:file-access-approval-gate-change artifact. | artifact:file-access-approval-gate-change | — |
| `implement-file-access-approval-gate-to-implement-connector-approval-controls-2-invalidates` | `implement-file-access-approval-gate` | `invalidates` | `implement-connector-approval-controls` | A material change to artifact:file-access-approval-gate-change invalidates artifact:connector-approval-controls-change. | artifact:connector-approval-controls-change | — |
| `implement-ingress-operations-to-implement-connector-approval-controls-3-consumes` | `implement-ingress-operations` | `consumes` | `implement-connector-approval-controls` | implement-connector-approval-controls requires the current artifact:ingress-operations-change artifact. | artifact:ingress-operations-change | — |
| `implement-ingress-operations-to-implement-connector-approval-controls-3-invalidates` | `implement-ingress-operations` | `invalidates` | `implement-connector-approval-controls` | A material change to artifact:ingress-operations-change invalidates artifact:connector-approval-controls-change. | artifact:connector-approval-controls-change | — |
| `implement-tui-thinking-transcript-to-implement-connector-approval-controls-4-consumes` | `implement-tui-thinking-transcript` | `consumes` | `implement-connector-approval-controls` | implement-connector-approval-controls requires the current artifact:tui-thinking-transcript-change artifact. | artifact:tui-thinking-transcript-change | — |
| `implement-tui-thinking-transcript-to-implement-connector-approval-controls-4-invalidates` | `implement-tui-thinking-transcript` | `invalidates` | `implement-connector-approval-controls` | A material change to artifact:tui-thinking-transcript-change invalidates artifact:connector-approval-controls-change. | artifact:connector-approval-controls-change | — |
| `implement-runtime-root-layout-to-implement-image-reasoning-worker-2-consumes` | `implement-runtime-root-layout` | `consumes` | `implement-image-reasoning-worker` | implement-image-reasoning-worker requires the current artifact:runtime-root-layout-change artifact. | artifact:runtime-root-layout-change | — |
| `implement-runtime-root-layout-to-implement-image-reasoning-worker-2-invalidates` | `implement-runtime-root-layout` | `invalidates` | `implement-image-reasoning-worker` | A material change to artifact:runtime-root-layout-change invalidates artifact:image-reasoning-worker-change. | artifact:image-reasoning-worker-change | — |
| `implement-agent-runtime-to-implement-image-reasoning-worker-3-consumes` | `implement-agent-runtime` | `consumes` | `implement-image-reasoning-worker` | implement-image-reasoning-worker requires the current artifact:agent-runtime-change artifact. | artifact:agent-runtime-change | — |
| `implement-agent-runtime-to-implement-image-reasoning-worker-3-invalidates` | `implement-agent-runtime` | `invalidates` | `implement-image-reasoning-worker` | A material change to artifact:agent-runtime-change invalidates artifact:image-reasoning-worker-change. | artifact:image-reasoning-worker-change | — |
| `implement-runtime-root-layout-to-implement-document-index-2-consumes` | `implement-runtime-root-layout` | `consumes` | `implement-document-index` | implement-document-index requires the current artifact:runtime-root-layout-change artifact. | artifact:runtime-root-layout-change | — |
| `implement-runtime-root-layout-to-implement-document-index-2-invalidates` | `implement-runtime-root-layout` | `invalidates` | `implement-document-index` | A material change to artifact:runtime-root-layout-change invalidates artifact:document-index-change. | artifact:document-index-change | — |
| `implement-memory-retrieval-to-implement-document-index-3-consumes` | `implement-memory-retrieval` | `consumes` | `implement-document-index` | implement-document-index requires the current artifact:memory-retrieval-change artifact. | artifact:memory-retrieval-change | — |
| `implement-memory-retrieval-to-implement-document-index-3-invalidates` | `implement-memory-retrieval` | `invalidates` | `implement-document-index` | A material change to artifact:memory-retrieval-change invalidates artifact:document-index-change. | artifact:document-index-change | — |
| `implement-capabilities-security-to-implement-protocol-scoring-2-consumes` | `implement-capabilities-security` | `consumes` | `implement-protocol-scoring` | implement-protocol-scoring requires the current artifact:capabilities-security-change artifact. | artifact:capabilities-security-change | — |
| `implement-capabilities-security-to-implement-protocol-scoring-2-invalidates` | `implement-capabilities-security` | `invalidates` | `implement-protocol-scoring` | A material change to artifact:capabilities-security-change invalidates artifact:protocol-scoring-change. | artifact:protocol-scoring-change | — |
| `implement-agent-runtime-to-implement-protocol-scoring-3-consumes` | `implement-agent-runtime` | `consumes` | `implement-protocol-scoring` | implement-protocol-scoring requires the current artifact:agent-runtime-change artifact. | artifact:agent-runtime-change | — |
| `implement-agent-runtime-to-implement-protocol-scoring-3-invalidates` | `implement-agent-runtime` | `invalidates` | `implement-protocol-scoring` | A material change to artifact:agent-runtime-change invalidates artifact:protocol-scoring-change. | artifact:protocol-scoring-change | — |
| `resolve-d1-github-auth-strategy-to-implement-coding-worker-github-flow-consumes` | `resolve-d1-github-auth-strategy` | `consumes` | `implement-coding-worker-github-flow` | implement-coding-worker-github-flow requires the current decision:d1-github-auth-strategy artifact. | decision:d1-github-auth-strategy | — |
| `resolve-d1-github-auth-strategy-to-implement-coding-worker-github-flow-invalidates` | `resolve-d1-github-auth-strategy` | `invalidates` | `implement-coding-worker-github-flow` | A material change to decision:d1-github-auth-strategy invalidates artifact:coding-worker-github-flow-change. | artifact:coding-worker-github-flow-change | — |
| `resolve-d2-workspace-root-isolation-to-implement-runtime-root-layout-consumes` | `resolve-d2-workspace-root-isolation` | `consumes` | `implement-runtime-root-layout` | implement-runtime-root-layout requires the current decision:d2-workspace-root-isolation artifact. | decision:d2-workspace-root-isolation | — |
| `resolve-d2-workspace-root-isolation-to-implement-runtime-root-layout-invalidates` | `resolve-d2-workspace-root-isolation` | `invalidates` | `implement-runtime-root-layout` | A material change to decision:d2-workspace-root-isolation invalidates artifact:runtime-root-layout-change. | artifact:runtime-root-layout-change | — |
| `resolve-d2-workspace-root-isolation-to-implement-file-access-approval-gate-consumes` | `resolve-d2-workspace-root-isolation` | `consumes` | `implement-file-access-approval-gate` | implement-file-access-approval-gate requires the current decision:d2-workspace-root-isolation artifact. | decision:d2-workspace-root-isolation | — |
| `resolve-d2-workspace-root-isolation-to-implement-file-access-approval-gate-invalidates` | `resolve-d2-workspace-root-isolation` | `invalidates` | `implement-file-access-approval-gate` | A material change to decision:d2-workspace-root-isolation invalidates artifact:file-access-approval-gate-change. | artifact:file-access-approval-gate-change | — |
| `resolve-d2-workspace-root-isolation-to-implement-coding-worker-github-flow-consumes` | `resolve-d2-workspace-root-isolation` | `consumes` | `implement-coding-worker-github-flow` | implement-coding-worker-github-flow requires the current decision:d2-workspace-root-isolation artifact. | decision:d2-workspace-root-isolation | — |
| `resolve-d2-workspace-root-isolation-to-implement-coding-worker-github-flow-invalidates` | `resolve-d2-workspace-root-isolation` | `invalidates` | `implement-coding-worker-github-flow` | A material change to decision:d2-workspace-root-isolation invalidates artifact:coding-worker-github-flow-change. | artifact:coding-worker-github-flow-change | — |
| `resolve-d2-workspace-root-isolation-to-implement-coding-worker-scaffold-tooling-consumes` | `resolve-d2-workspace-root-isolation` | `consumes` | `implement-coding-worker-scaffold-tooling` | implement-coding-worker-scaffold-tooling requires the current decision:d2-workspace-root-isolation artifact. | decision:d2-workspace-root-isolation | — |
| `resolve-d2-workspace-root-isolation-to-implement-coding-worker-scaffold-tooling-invalidates` | `resolve-d2-workspace-root-isolation` | `invalidates` | `implement-coding-worker-scaffold-tooling` | A material change to decision:d2-workspace-root-isolation invalidates artifact:coding-worker-scaffold-tooling-change. | artifact:coding-worker-scaffold-tooling-change | — |
| `resolve-d2-workspace-root-isolation-to-implement-orchestrator-worker-verification-consumes` | `resolve-d2-workspace-root-isolation` | `consumes` | `implement-orchestrator-worker-verification` | implement-orchestrator-worker-verification requires the current decision:d2-workspace-root-isolation artifact. | decision:d2-workspace-root-isolation | — |
| `resolve-d2-workspace-root-isolation-to-implement-orchestrator-worker-verification-invalidates` | `resolve-d2-workspace-root-isolation` | `invalidates` | `implement-orchestrator-worker-verification` | A material change to decision:d2-workspace-root-isolation invalidates artifact:orchestrator-worker-verification-change. | artifact:orchestrator-worker-verification-change | — |
| `resolve-d3-file-access-gate-to-implement-file-access-approval-gate-consumes` | `resolve-d3-file-access-gate` | `consumes` | `implement-file-access-approval-gate` | implement-file-access-approval-gate requires the current decision:d3-file-access-gate artifact. | decision:d3-file-access-gate | — |
| `resolve-d3-file-access-gate-to-implement-file-access-approval-gate-invalidates` | `resolve-d3-file-access-gate` | `invalidates` | `implement-file-access-approval-gate` | A material change to decision:d3-file-access-gate invalidates artifact:file-access-approval-gate-change. | artifact:file-access-approval-gate-change | — |
| `resolve-d3-file-access-gate-to-implement-connector-approval-controls-consumes` | `resolve-d3-file-access-gate` | `consumes` | `implement-connector-approval-controls` | implement-connector-approval-controls requires the current decision:d3-file-access-gate artifact. | decision:d3-file-access-gate | — |
| `resolve-d3-file-access-gate-to-implement-connector-approval-controls-invalidates` | `resolve-d3-file-access-gate` | `invalidates` | `implement-connector-approval-controls` | A material change to decision:d3-file-access-gate invalidates artifact:connector-approval-controls-change. | artifact:connector-approval-controls-change | — |
| `resolve-d4-orchestrator-history-visibility-to-implement-orchestrator-worker-verification-consumes` | `resolve-d4-orchestrator-history-visibility` | `consumes` | `implement-orchestrator-worker-verification` | implement-orchestrator-worker-verification requires the current decision:d4-orchestrator-history-visibility artifact. | decision:d4-orchestrator-history-visibility | — |
| `resolve-d4-orchestrator-history-visibility-to-implement-orchestrator-worker-verification-invalidates` | `resolve-d4-orchestrator-history-visibility` | `invalidates` | `implement-orchestrator-worker-verification` | A material change to decision:d4-orchestrator-history-visibility invalidates artifact:orchestrator-worker-verification-change. | artifact:orchestrator-worker-verification-change | — |
| `connector-approvals-to-tui-work-pane-consumes` | `implement-connector-approval-controls` | `consumes` | `implement-sim-one-tui-work-pane` | implement-sim-one-tui-work-pane requires the current artifact:connector-approval-controls-change artifact. | artifact:connector-approval-controls-change | — |
| `connector-approvals-to-tui-work-pane-invalidates` | `implement-connector-approval-controls` | `invalidates` | `implement-sim-one-tui-work-pane` | A material change to artifact:connector-approval-controls-change invalidates artifact:sim-one-tui-work-pane-change. | artifact:sim-one-tui-work-pane-change | — |
| `runtime-root-to-onboarding-consumes` | `implement-runtime-root-layout` | `consumes` | `implement-sim-one-onboarding-distribution` | implement-sim-one-onboarding-distribution requires the current artifact:runtime-root-layout-change artifact. | artifact:runtime-root-layout-change | — |
| `runtime-root-to-onboarding-invalidates` | `implement-runtime-root-layout` | `invalidates` | `implement-sim-one-onboarding-distribution` | A material change to artifact:runtime-root-layout-change invalidates artifact:sim-one-onboarding-distribution-change. | artifact:sim-one-onboarding-distribution-change | — |
| `implement-coding-worker-progress-to-integration-consumes` | `implement-coding-worker-progress` | `consumes` | `integrate-and-repair` | integrate-and-repair requires the current artifact:coding-worker-progress-change artifact. | artifact:coding-worker-progress-change | — |
| `implement-coding-worker-progress-to-integration-invalidates` | `implement-coding-worker-progress` | `invalidates` | `integrate-and-repair` | A material change to artifact:coding-worker-progress-change invalidates artifact:integrated-change. | artifact:integrated-change | — |
| `implement-coding-worker-github-flow-to-integration-consumes` | `implement-coding-worker-github-flow` | `consumes` | `integrate-and-repair` | integrate-and-repair requires the current artifact:coding-worker-github-flow-change artifact. | artifact:coding-worker-github-flow-change | — |
| `implement-coding-worker-github-flow-to-integration-invalidates` | `implement-coding-worker-github-flow` | `invalidates` | `integrate-and-repair` | A material change to artifact:coding-worker-github-flow-change invalidates artifact:integrated-change. | artifact:integrated-change | — |
| `implement-coding-worker-scaffold-tooling-to-integration-consumes` | `implement-coding-worker-scaffold-tooling` | `consumes` | `integrate-and-repair` | integrate-and-repair requires the current artifact:coding-worker-scaffold-tooling-change artifact. | artifact:coding-worker-scaffold-tooling-change | — |
| `implement-coding-worker-scaffold-tooling-to-integration-invalidates` | `implement-coding-worker-scaffold-tooling` | `invalidates` | `integrate-and-repair` | A material change to artifact:coding-worker-scaffold-tooling-change invalidates artifact:integrated-change. | artifact:integrated-change | — |
| `implement-orchestrator-worker-verification-to-integration-consumes` | `implement-orchestrator-worker-verification` | `consumes` | `integrate-and-repair` | integrate-and-repair requires the current artifact:orchestrator-worker-verification-change artifact. | artifact:orchestrator-worker-verification-change | — |
| `implement-orchestrator-worker-verification-to-integration-invalidates` | `implement-orchestrator-worker-verification` | `invalidates` | `integrate-and-repair` | A material change to artifact:orchestrator-worker-verification-change invalidates artifact:integrated-change. | artifact:integrated-change | — |
| `implement-image-reasoning-worker-to-integration-consumes` | `implement-image-reasoning-worker` | `consumes` | `integrate-and-repair` | integrate-and-repair requires the current artifact:image-reasoning-worker-change artifact. | artifact:image-reasoning-worker-change | — |
| `implement-image-reasoning-worker-to-integration-invalidates` | `implement-image-reasoning-worker` | `invalidates` | `integrate-and-repair` | A material change to artifact:image-reasoning-worker-change invalidates artifact:integrated-change. | artifact:integrated-change | — |
| `implement-document-index-to-integration-consumes` | `implement-document-index` | `consumes` | `integrate-and-repair` | integrate-and-repair requires the current artifact:document-index-change artifact. | artifact:document-index-change | — |
| `implement-document-index-to-integration-invalidates` | `implement-document-index` | `invalidates` | `integrate-and-repair` | A material change to artifact:document-index-change invalidates artifact:integrated-change. | artifact:integrated-change | — |
| `implement-protocol-scoring-to-integration-consumes` | `implement-protocol-scoring` | `consumes` | `integrate-and-repair` | integrate-and-repair requires the current artifact:protocol-scoring-change artifact. | artifact:protocol-scoring-change | — |
| `implement-protocol-scoring-to-integration-invalidates` | `implement-protocol-scoring` | `invalidates` | `integrate-and-repair` | A material change to artifact:protocol-scoring-change invalidates artifact:integrated-change. | artifact:integrated-change | — |
| `resolve-d1-github-auth-strategy-to-spec-verification-consumes` | `resolve-d1-github-auth-strategy` | `consumes` | `verify-release-reconciliation-specifications` | verify-release-reconciliation-specifications requires the current decision:d1-github-auth-strategy artifact. | decision:d1-github-auth-strategy | — |
| `resolve-d1-github-auth-strategy-to-spec-verification-invalidates` | `resolve-d1-github-auth-strategy` | `invalidates` | `verify-release-reconciliation-specifications` | A material change to decision:d1-github-auth-strategy invalidates artifact:release-reconciliation-specification-verification. | artifact:release-reconciliation-specification-verification | — |
| `resolve-d1-github-auth-strategy-to-plan-consumes` | `resolve-d1-github-auth-strategy` | `consumes` | `plan-implementation` | plan-implementation requires the current decision:d1-github-auth-strategy artifact. | decision:d1-github-auth-strategy | — |
| `resolve-d1-github-auth-strategy-to-plan-invalidates` | `resolve-d1-github-auth-strategy` | `invalidates` | `plan-implementation` | A material change to decision:d1-github-auth-strategy invalidates artifact:implementation-plan. | artifact:implementation-plan | — |
| `baseline-to-resolve-d5-canonical-runtime-configuration` | `baseline-context` | `consumes` | `resolve-d5-canonical-runtime-configuration` | The canonical configuration decision is bound to the current project context and repository planning artifacts. | artifact:baseline-context | — |
| `release-spec-to-d5-13-consumes` | `specify-release-reconciliation` | `consumes` | `resolve-d5-canonical-runtime-configuration` | resolve-d5-canonical-runtime-configuration requires the current artifact:product-spec-runtime-configuration artifact. | artifact:product-spec-runtime-configuration | — |
| `release-spec-to-d5-13-invalidates` | `specify-release-reconciliation` | `invalidates` | `resolve-d5-canonical-runtime-configuration` | A material change to artifact:product-spec-runtime-configuration invalidates decision:d5-canonical-runtime-configuration. | decision:d5-canonical-runtime-configuration | — |
| `release-spec-to-verification-13-consumes` | `specify-release-reconciliation` | `consumes` | `verify-release-reconciliation-specifications` | verify-release-reconciliation-specifications requires the current artifact:product-spec-runtime-configuration artifact. | artifact:product-spec-runtime-configuration | — |
| `release-spec-to-verification-13-invalidates` | `specify-release-reconciliation` | `invalidates` | `verify-release-reconciliation-specifications` | A material change to artifact:product-spec-runtime-configuration invalidates artifact:release-reconciliation-specification-verification. | artifact:release-reconciliation-specification-verification | — |
| `release-spec-to-plan-13-consumes` | `specify-release-reconciliation` | `consumes` | `plan-implementation` | plan-implementation requires the current artifact:product-spec-runtime-configuration artifact. | artifact:product-spec-runtime-configuration | — |
| `release-spec-to-plan-13-invalidates` | `specify-release-reconciliation` | `invalidates` | `plan-implementation` | A material change to artifact:product-spec-runtime-configuration invalidates artifact:implementation-plan. | artifact:implementation-plan | — |
| `release-spec-to-d5-14-consumes` | `specify-release-reconciliation` | `consumes` | `resolve-d5-canonical-runtime-configuration` | resolve-d5-canonical-runtime-configuration requires the current artifact:architecture-spec-runtime-configuration artifact. | artifact:architecture-spec-runtime-configuration | — |
| `release-spec-to-d5-14-invalidates` | `specify-release-reconciliation` | `invalidates` | `resolve-d5-canonical-runtime-configuration` | A material change to artifact:architecture-spec-runtime-configuration invalidates decision:d5-canonical-runtime-configuration. | decision:d5-canonical-runtime-configuration | — |
| `release-spec-to-verification-14-consumes` | `specify-release-reconciliation` | `consumes` | `verify-release-reconciliation-specifications` | verify-release-reconciliation-specifications requires the current artifact:architecture-spec-runtime-configuration artifact. | artifact:architecture-spec-runtime-configuration | — |
| `release-spec-to-verification-14-invalidates` | `specify-release-reconciliation` | `invalidates` | `verify-release-reconciliation-specifications` | A material change to artifact:architecture-spec-runtime-configuration invalidates artifact:release-reconciliation-specification-verification. | artifact:release-reconciliation-specification-verification | — |
| `release-spec-to-plan-14-consumes` | `specify-release-reconciliation` | `consumes` | `plan-implementation` | plan-implementation requires the current artifact:architecture-spec-runtime-configuration artifact. | artifact:architecture-spec-runtime-configuration | — |
| `release-spec-to-plan-14-invalidates` | `specify-release-reconciliation` | `invalidates` | `plan-implementation` | A material change to artifact:architecture-spec-runtime-configuration invalidates artifact:implementation-plan. | artifact:implementation-plan | — |
| `release-spec-to-d5-15-consumes` | `specify-release-reconciliation` | `consumes` | `resolve-d5-canonical-runtime-configuration` | resolve-d5-canonical-runtime-configuration requires the current artifact:acceptance-spec-runtime-configuration artifact. | artifact:acceptance-spec-runtime-configuration | — |
| `release-spec-to-d5-15-invalidates` | `specify-release-reconciliation` | `invalidates` | `resolve-d5-canonical-runtime-configuration` | A material change to artifact:acceptance-spec-runtime-configuration invalidates decision:d5-canonical-runtime-configuration. | decision:d5-canonical-runtime-configuration | — |
| `release-spec-to-verification-15-consumes` | `specify-release-reconciliation` | `consumes` | `verify-release-reconciliation-specifications` | verify-release-reconciliation-specifications requires the current artifact:acceptance-spec-runtime-configuration artifact. | artifact:acceptance-spec-runtime-configuration | — |
| `release-spec-to-verification-15-invalidates` | `specify-release-reconciliation` | `invalidates` | `verify-release-reconciliation-specifications` | A material change to artifact:acceptance-spec-runtime-configuration invalidates artifact:release-reconciliation-specification-verification. | artifact:release-reconciliation-specification-verification | — |
| `release-spec-to-plan-15-consumes` | `specify-release-reconciliation` | `consumes` | `plan-implementation` | plan-implementation requires the current artifact:acceptance-spec-runtime-configuration artifact. | artifact:acceptance-spec-runtime-configuration | — |
| `release-spec-to-plan-15-invalidates` | `specify-release-reconciliation` | `invalidates` | `plan-implementation` | A material change to artifact:acceptance-spec-runtime-configuration invalidates artifact:implementation-plan. | artifact:implementation-plan | — |
| `release-spec-to-d5-16-consumes` | `specify-release-reconciliation` | `consumes` | `resolve-d5-canonical-runtime-configuration` | resolve-d5-canonical-runtime-configuration requires the current artifact:open-questions-runtime-configuration artifact. | artifact:open-questions-runtime-configuration | — |
| `release-spec-to-d5-16-invalidates` | `specify-release-reconciliation` | `invalidates` | `resolve-d5-canonical-runtime-configuration` | A material change to artifact:open-questions-runtime-configuration invalidates decision:d5-canonical-runtime-configuration. | decision:d5-canonical-runtime-configuration | — |
| `release-spec-to-verification-16-consumes` | `specify-release-reconciliation` | `consumes` | `verify-release-reconciliation-specifications` | verify-release-reconciliation-specifications requires the current artifact:open-questions-runtime-configuration artifact. | artifact:open-questions-runtime-configuration | — |
| `release-spec-to-verification-16-invalidates` | `specify-release-reconciliation` | `invalidates` | `verify-release-reconciliation-specifications` | A material change to artifact:open-questions-runtime-configuration invalidates artifact:release-reconciliation-specification-verification. | artifact:release-reconciliation-specification-verification | — |
| `release-spec-to-plan-16-consumes` | `specify-release-reconciliation` | `consumes` | `plan-implementation` | plan-implementation requires the current artifact:open-questions-runtime-configuration artifact. | artifact:open-questions-runtime-configuration | — |
| `release-spec-to-plan-16-invalidates` | `specify-release-reconciliation` | `invalidates` | `plan-implementation` | A material change to artifact:open-questions-runtime-configuration invalidates artifact:implementation-plan. | artifact:implementation-plan | — |
| `release-spec-to-d5-17-consumes` | `specify-release-reconciliation` | `consumes` | `resolve-d5-canonical-runtime-configuration` | resolve-d5-canonical-runtime-configuration requires the current artifact:runtime-configuration-inventory artifact. | artifact:runtime-configuration-inventory | — |
| `release-spec-to-d5-17-invalidates` | `specify-release-reconciliation` | `invalidates` | `resolve-d5-canonical-runtime-configuration` | A material change to artifact:runtime-configuration-inventory invalidates decision:d5-canonical-runtime-configuration. | decision:d5-canonical-runtime-configuration | — |
| `release-spec-to-verification-17-consumes` | `specify-release-reconciliation` | `consumes` | `verify-release-reconciliation-specifications` | verify-release-reconciliation-specifications requires the current artifact:runtime-configuration-inventory artifact. | artifact:runtime-configuration-inventory | — |
| `release-spec-to-verification-17-invalidates` | `specify-release-reconciliation` | `invalidates` | `verify-release-reconciliation-specifications` | A material change to artifact:runtime-configuration-inventory invalidates artifact:release-reconciliation-specification-verification. | artifact:release-reconciliation-specification-verification | — |
| `release-spec-to-plan-17-consumes` | `specify-release-reconciliation` | `consumes` | `plan-implementation` | plan-implementation requires the current artifact:runtime-configuration-inventory artifact. | artifact:runtime-configuration-inventory | — |
| `release-spec-to-plan-17-invalidates` | `specify-release-reconciliation` | `invalidates` | `plan-implementation` | A material change to artifact:runtime-configuration-inventory invalidates artifact:implementation-plan. | artifact:implementation-plan | — |
| `resolve-d5-canonical-runtime-configuration-to-verify-release-reconciliation-specifications-consumes` | `resolve-d5-canonical-runtime-configuration` | `consumes` | `verify-release-reconciliation-specifications` | verify-release-reconciliation-specifications requires the current decision:d5-canonical-runtime-configuration artifact. | decision:d5-canonical-runtime-configuration | — |
| `resolve-d5-canonical-runtime-configuration-to-verify-release-reconciliation-specifications-invalidates` | `resolve-d5-canonical-runtime-configuration` | `invalidates` | `verify-release-reconciliation-specifications` | A material change to decision:d5-canonical-runtime-configuration invalidates artifact:release-reconciliation-specification-verification. | artifact:release-reconciliation-specification-verification | — |
| `resolve-d5-canonical-runtime-configuration-to-plan-implementation-consumes` | `resolve-d5-canonical-runtime-configuration` | `consumes` | `plan-implementation` | plan-implementation requires the current decision:d5-canonical-runtime-configuration artifact. | decision:d5-canonical-runtime-configuration | — |
| `resolve-d5-canonical-runtime-configuration-to-plan-implementation-invalidates` | `resolve-d5-canonical-runtime-configuration` | `invalidates` | `plan-implementation` | A material change to decision:d5-canonical-runtime-configuration invalidates artifact:implementation-plan. | artifact:implementation-plan | — |
| `resolve-d5-canonical-runtime-configuration-to-implement-runtime-configuration-consolidation-consumes` | `resolve-d5-canonical-runtime-configuration` | `consumes` | `implement-runtime-configuration-consolidation` | implement-runtime-configuration-consolidation requires the current decision:d5-canonical-runtime-configuration artifact. | decision:d5-canonical-runtime-configuration | — |
| `resolve-d5-canonical-runtime-configuration-to-implement-runtime-configuration-consolidation-invalidates` | `resolve-d5-canonical-runtime-configuration` | `invalidates` | `implement-runtime-configuration-consolidation` | A material change to decision:d5-canonical-runtime-configuration invalidates artifact:runtime-configuration-consolidation-change. | artifact:runtime-configuration-consolidation-change | — |
| `resolve-d5-canonical-runtime-configuration-to-verify-runtime-configuration-consolidation-consumes` | `resolve-d5-canonical-runtime-configuration` | `consumes` | `verify-runtime-configuration-consolidation` | verify-runtime-configuration-consolidation requires the current decision:d5-canonical-runtime-configuration artifact. | decision:d5-canonical-runtime-configuration | — |
| `resolve-d5-canonical-runtime-configuration-to-verify-runtime-configuration-consolidation-invalidates` | `resolve-d5-canonical-runtime-configuration` | `invalidates` | `verify-runtime-configuration-consolidation` | A material change to decision:d5-canonical-runtime-configuration invalidates artifact:runtime-configuration-consolidation-report. | artifact:runtime-configuration-consolidation-report | — |
| `resolve-d5-canonical-runtime-configuration-to-implement-runtime-root-layout-consumes` | `resolve-d5-canonical-runtime-configuration` | `consumes` | `implement-runtime-root-layout` | implement-runtime-root-layout requires the current decision:d5-canonical-runtime-configuration artifact. | decision:d5-canonical-runtime-configuration | — |
| `resolve-d5-canonical-runtime-configuration-to-implement-runtime-root-layout-invalidates` | `resolve-d5-canonical-runtime-configuration` | `invalidates` | `implement-runtime-root-layout` | A material change to decision:d5-canonical-runtime-configuration invalidates artifact:runtime-root-layout-change. | artifact:runtime-root-layout-change | — |
| `resolve-d5-canonical-runtime-configuration-to-implement-agent-runtime-consumes` | `resolve-d5-canonical-runtime-configuration` | `consumes` | `implement-agent-runtime` | implement-agent-runtime requires the current decision:d5-canonical-runtime-configuration artifact. | decision:d5-canonical-runtime-configuration | — |
| `resolve-d5-canonical-runtime-configuration-to-implement-agent-runtime-invalidates` | `resolve-d5-canonical-runtime-configuration` | `invalidates` | `implement-agent-runtime` | A material change to decision:d5-canonical-runtime-configuration invalidates artifact:agent-runtime-change. | artifact:agent-runtime-change | — |
| `resolve-d5-canonical-runtime-configuration-to-implement-capabilities-security-consumes` | `resolve-d5-canonical-runtime-configuration` | `consumes` | `implement-capabilities-security` | implement-capabilities-security requires the current decision:d5-canonical-runtime-configuration artifact. | decision:d5-canonical-runtime-configuration | — |
| `resolve-d5-canonical-runtime-configuration-to-implement-capabilities-security-invalidates` | `resolve-d5-canonical-runtime-configuration` | `invalidates` | `implement-capabilities-security` | A material change to decision:d5-canonical-runtime-configuration invalidates artifact:capabilities-security-change. | artifact:capabilities-security-change | — |
| `resolve-d5-canonical-runtime-configuration-to-implement-ingress-operations-consumes` | `resolve-d5-canonical-runtime-configuration` | `consumes` | `implement-ingress-operations` | implement-ingress-operations requires the current decision:d5-canonical-runtime-configuration artifact. | decision:d5-canonical-runtime-configuration | — |
| `resolve-d5-canonical-runtime-configuration-to-implement-ingress-operations-invalidates` | `resolve-d5-canonical-runtime-configuration` | `invalidates` | `implement-ingress-operations` | A material change to decision:d5-canonical-runtime-configuration invalidates artifact:ingress-operations-change. | artifact:ingress-operations-change | — |
| `resolve-d5-canonical-runtime-configuration-to-implement-coding-worker-github-flow-consumes` | `resolve-d5-canonical-runtime-configuration` | `consumes` | `implement-coding-worker-github-flow` | implement-coding-worker-github-flow requires the current decision:d5-canonical-runtime-configuration artifact. | decision:d5-canonical-runtime-configuration | — |
| `resolve-d5-canonical-runtime-configuration-to-implement-coding-worker-github-flow-invalidates` | `resolve-d5-canonical-runtime-configuration` | `invalidates` | `implement-coding-worker-github-flow` | A material change to decision:d5-canonical-runtime-configuration invalidates artifact:coding-worker-github-flow-change. | artifact:coding-worker-github-flow-change | — |
| `resolve-d5-canonical-runtime-configuration-to-implement-connector-approval-controls-consumes` | `resolve-d5-canonical-runtime-configuration` | `consumes` | `implement-connector-approval-controls` | implement-connector-approval-controls requires the current decision:d5-canonical-runtime-configuration artifact. | decision:d5-canonical-runtime-configuration | — |
| `resolve-d5-canonical-runtime-configuration-to-implement-connector-approval-controls-invalidates` | `resolve-d5-canonical-runtime-configuration` | `invalidates` | `implement-connector-approval-controls` | A material change to decision:d5-canonical-runtime-configuration invalidates artifact:connector-approval-controls-change. | artifact:connector-approval-controls-change | — |
| `resolve-d5-canonical-runtime-configuration-to-implement-sim-one-onboarding-distribution-consumes` | `resolve-d5-canonical-runtime-configuration` | `consumes` | `implement-sim-one-onboarding-distribution` | implement-sim-one-onboarding-distribution requires the current decision:d5-canonical-runtime-configuration artifact. | decision:d5-canonical-runtime-configuration | — |
| `resolve-d5-canonical-runtime-configuration-to-implement-sim-one-onboarding-distribution-invalidates` | `resolve-d5-canonical-runtime-configuration` | `invalidates` | `implement-sim-one-onboarding-distribution` | A material change to decision:d5-canonical-runtime-configuration invalidates artifact:sim-one-onboarding-distribution-change. | artifact:sim-one-onboarding-distribution-change | — |
| `resolve-d5-canonical-runtime-configuration-to-build-release-package-consumes` | `resolve-d5-canonical-runtime-configuration` | `consumes` | `build-release-package` | build-release-package requires the current decision:d5-canonical-runtime-configuration artifact. | decision:d5-canonical-runtime-configuration | — |
| `resolve-d5-canonical-runtime-configuration-to-build-release-package-invalidates` | `resolve-d5-canonical-runtime-configuration` | `invalidates` | `build-release-package` | A material change to decision:d5-canonical-runtime-configuration invalidates artifact:release-package. | artifact:release-package | — |
| `resolve-d5-canonical-runtime-configuration-to-verify-onboarding-distribution-consumes` | `resolve-d5-canonical-runtime-configuration` | `consumes` | `verify-onboarding-distribution` | verify-onboarding-distribution requires the current decision:d5-canonical-runtime-configuration artifact. | decision:d5-canonical-runtime-configuration | — |
| `resolve-d5-canonical-runtime-configuration-to-verify-onboarding-distribution-invalidates` | `resolve-d5-canonical-runtime-configuration` | `invalidates` | `verify-onboarding-distribution` | A material change to decision:d5-canonical-runtime-configuration invalidates artifact:onboarding-distribution-report. | artifact:onboarding-distribution-report | — |
| `resolve-d5-canonical-runtime-configuration-to-implement-product-delivery-consumes` | `resolve-d5-canonical-runtime-configuration` | `consumes` | `implement-product-delivery` | implement-product-delivery requires the current decision:d5-canonical-runtime-configuration artifact. | decision:d5-canonical-runtime-configuration | — |
| `resolve-d5-canonical-runtime-configuration-to-implement-product-delivery-invalidates` | `resolve-d5-canonical-runtime-configuration` | `invalidates` | `implement-product-delivery` | A material change to decision:d5-canonical-runtime-configuration invalidates artifact:product-delivery-change. | artifact:product-delivery-change | — |
| `plan-to-implement-runtime-configuration-consolidation` | `plan-implementation` | `consumes` | `implement-runtime-configuration-consolidation` | The implementation plan assigns one serialized owner for canonical configuration files and every affected consumer. | artifact:implementation-plan | — |
| `beta-release-contract-to-implement-runtime-configuration-consolidation` | `approve-beta-release-contract` | `consumes` | `implement-runtime-configuration-consolidation` | The owner-approved 0.1.0 Beta configuration, packaging, and secret-boundary requirements are current. | artifact:beta-release-contract | — |
| `beta-release-contract-approves-runtime-configuration-consolidation` | `approve-beta-release-contract` | `approves` | `implement-runtime-configuration-consolidation` | The owner authorizes entering the bounded canonical configuration mutation scope; each write remains separately approval-gated. | artifact:beta-release-contract | — |
| `implement-core-contracts-to-runtime-configuration-1-consumes` | `implement-core-contracts` | `consumes` | `implement-runtime-configuration-consolidation` | implement-runtime-configuration-consolidation requires the current artifact:core-contracts-change artifact. | artifact:core-contracts-change | — |
| `implement-core-contracts-to-runtime-configuration-1-invalidates` | `implement-core-contracts` | `invalidates` | `implement-runtime-configuration-consolidation` | A material change to artifact:core-contracts-change invalidates artifact:runtime-configuration-consolidation-change. | artifact:runtime-configuration-consolidation-change | — |
| `implement-agent-runtime-to-runtime-configuration-2-consumes` | `implement-agent-runtime` | `consumes` | `implement-runtime-configuration-consolidation` | implement-runtime-configuration-consolidation requires the current artifact:agent-runtime-change artifact. | artifact:agent-runtime-change | — |
| `implement-agent-runtime-to-runtime-configuration-2-invalidates` | `implement-agent-runtime` | `invalidates` | `implement-runtime-configuration-consolidation` | A material change to artifact:agent-runtime-change invalidates artifact:runtime-configuration-consolidation-change. | artifact:runtime-configuration-consolidation-change | — |
| `implement-capabilities-security-to-runtime-configuration-3-consumes` | `implement-capabilities-security` | `consumes` | `implement-runtime-configuration-consolidation` | implement-runtime-configuration-consolidation requires the current artifact:capabilities-security-change artifact. | artifact:capabilities-security-change | — |
| `implement-capabilities-security-to-runtime-configuration-3-invalidates` | `implement-capabilities-security` | `invalidates` | `implement-runtime-configuration-consolidation` | A material change to artifact:capabilities-security-change invalidates artifact:runtime-configuration-consolidation-change. | artifact:runtime-configuration-consolidation-change | — |
| `implement-ingress-operations-to-runtime-configuration-4-consumes` | `implement-ingress-operations` | `consumes` | `implement-runtime-configuration-consolidation` | implement-runtime-configuration-consolidation requires the current artifact:ingress-operations-change artifact. | artifact:ingress-operations-change | — |
| `implement-ingress-operations-to-runtime-configuration-4-invalidates` | `implement-ingress-operations` | `invalidates` | `implement-runtime-configuration-consolidation` | A material change to artifact:ingress-operations-change invalidates artifact:runtime-configuration-consolidation-change. | artifact:runtime-configuration-consolidation-change | — |
| `implement-runtime-root-layout-to-runtime-configuration-5-consumes` | `implement-runtime-root-layout` | `consumes` | `implement-runtime-configuration-consolidation` | implement-runtime-configuration-consolidation requires the current artifact:runtime-root-layout-change artifact. | artifact:runtime-root-layout-change | — |
| `implement-runtime-root-layout-to-runtime-configuration-5-invalidates` | `implement-runtime-root-layout` | `invalidates` | `implement-runtime-configuration-consolidation` | A material change to artifact:runtime-root-layout-change invalidates artifact:runtime-configuration-consolidation-change. | artifact:runtime-configuration-consolidation-change | — |
| `runtime-configuration-to-implement-coding-worker-github-flow-consumes` | `implement-runtime-configuration-consolidation` | `consumes` | `implement-coding-worker-github-flow` | implement-coding-worker-github-flow requires the current artifact:runtime-configuration-consolidation-change artifact. | artifact:runtime-configuration-consolidation-change | — |
| `runtime-configuration-to-implement-coding-worker-github-flow-invalidates` | `implement-runtime-configuration-consolidation` | `invalidates` | `implement-coding-worker-github-flow` | A material change to artifact:runtime-configuration-consolidation-change invalidates artifact:coding-worker-github-flow-change. | artifact:coding-worker-github-flow-change | — |
| `runtime-configuration-to-implement-connector-approval-controls-consumes` | `implement-runtime-configuration-consolidation` | `consumes` | `implement-connector-approval-controls` | implement-connector-approval-controls requires the current artifact:runtime-configuration-consolidation-change artifact. | artifact:runtime-configuration-consolidation-change | — |
| `runtime-configuration-to-implement-connector-approval-controls-invalidates` | `implement-runtime-configuration-consolidation` | `invalidates` | `implement-connector-approval-controls` | A material change to artifact:runtime-configuration-consolidation-change invalidates artifact:connector-approval-controls-change. | artifact:connector-approval-controls-change | — |
| `runtime-configuration-to-implement-sim-one-onboarding-distribution-consumes` | `implement-runtime-configuration-consolidation` | `consumes` | `implement-sim-one-onboarding-distribution` | implement-sim-one-onboarding-distribution requires the current artifact:runtime-configuration-consolidation-change artifact. | artifact:runtime-configuration-consolidation-change | — |
| `runtime-configuration-to-implement-sim-one-onboarding-distribution-invalidates` | `implement-runtime-configuration-consolidation` | `invalidates` | `implement-sim-one-onboarding-distribution` | A material change to artifact:runtime-configuration-consolidation-change invalidates artifact:sim-one-onboarding-distribution-change. | artifact:sim-one-onboarding-distribution-change | — |
| `runtime-configuration-to-implement-product-delivery-consumes` | `implement-runtime-configuration-consolidation` | `consumes` | `implement-product-delivery` | implement-product-delivery requires the current artifact:runtime-configuration-consolidation-change artifact. | artifact:runtime-configuration-consolidation-change | — |
| `runtime-configuration-to-implement-product-delivery-invalidates` | `implement-runtime-configuration-consolidation` | `invalidates` | `implement-product-delivery` | A material change to artifact:runtime-configuration-consolidation-change invalidates artifact:product-delivery-change. | artifact:product-delivery-change | — |
| `runtime-configuration-to-integration-consumes` | `implement-runtime-configuration-consolidation` | `consumes` | `integrate-and-repair` | integrate-and-repair requires the current canonical runtime configuration change. | artifact:runtime-configuration-consolidation-change | — |
| `runtime-configuration-to-integration-invalidates` | `implement-runtime-configuration-consolidation` | `invalidates` | `integrate-and-repair` | A material change to the canonical runtime configuration invalidates the integrated change. | artifact:integrated-change | — |
| `implement-runtime-configuration-consolidation-to-runtime-configuration-verification-1-consumes` | `implement-runtime-configuration-consolidation` | `consumes` | `verify-runtime-configuration-consolidation` | verify-runtime-configuration-consolidation requires the current artifact:runtime-configuration-consolidation-change artifact. | artifact:runtime-configuration-consolidation-change | — |
| `implement-runtime-configuration-consolidation-to-runtime-configuration-verification-1-invalidates` | `implement-runtime-configuration-consolidation` | `invalidates` | `verify-runtime-configuration-consolidation` | A material change to artifact:runtime-configuration-consolidation-change invalidates artifact:runtime-configuration-consolidation-report. | artifact:runtime-configuration-consolidation-report | — |
| `integrate-and-repair-to-runtime-configuration-verification-2-consumes` | `integrate-and-repair` | `consumes` | `verify-runtime-configuration-consolidation` | verify-runtime-configuration-consolidation requires the current artifact:integrated-change artifact. | artifact:integrated-change | — |
| `integrate-and-repair-to-runtime-configuration-verification-2-invalidates` | `integrate-and-repair` | `invalidates` | `verify-runtime-configuration-consolidation` | A material change to artifact:integrated-change invalidates artifact:runtime-configuration-consolidation-report. | artifact:runtime-configuration-consolidation-report | — |
| `build-runtime-to-runtime-configuration-verification-3-consumes` | `build-runtime` | `consumes` | `verify-runtime-configuration-consolidation` | verify-runtime-configuration-consolidation requires the current artifact:runtime-build artifact. | artifact:runtime-build | — |
| `build-runtime-to-runtime-configuration-verification-3-invalidates` | `build-runtime` | `invalidates` | `verify-runtime-configuration-consolidation` | A material change to artifact:runtime-build invalidates artifact:runtime-configuration-consolidation-report. | artifact:runtime-configuration-consolidation-report | — |
| `build-sim-one-tui-to-runtime-configuration-verification-4-consumes` | `build-sim-one-tui` | `consumes` | `verify-runtime-configuration-consolidation` | verify-runtime-configuration-consolidation requires the current artifact:sim-one-tui-build artifact. | artifact:sim-one-tui-build | — |
| `build-sim-one-tui-to-runtime-configuration-verification-4-invalidates` | `build-sim-one-tui` | `invalidates` | `verify-runtime-configuration-consolidation` | A material change to artifact:sim-one-tui-build invalidates artifact:runtime-configuration-consolidation-report. | artifact:runtime-configuration-consolidation-report | — |
| `build-cli-to-runtime-configuration-verification-5-consumes` | `build-cli` | `consumes` | `verify-runtime-configuration-consolidation` | verify-runtime-configuration-consolidation requires the current artifact:cli-build artifact. | artifact:cli-build | — |
| `build-cli-to-runtime-configuration-verification-5-invalidates` | `build-cli` | `invalidates` | `verify-runtime-configuration-consolidation` | A material change to artifact:cli-build invalidates artifact:runtime-configuration-consolidation-report. | artifact:runtime-configuration-consolidation-report | — |
| `runtime-configuration-verification-to-aggregate-verification-consumes` | `verify-runtime-configuration-consolidation` | `consumes` | `aggregate-verification` | aggregate-verification requires the current artifact:runtime-configuration-consolidation-report artifact. | artifact:runtime-configuration-consolidation-report | — |
| `runtime-configuration-verification-to-aggregate-verification-invalidates` | `verify-runtime-configuration-consolidation` | `invalidates` | `aggregate-verification` | A material change to artifact:runtime-configuration-consolidation-report invalidates artifact:verification-summary. | artifact:verification-summary | — |
| `runtime-configuration-verification-to-build-release-package-consumes` | `verify-runtime-configuration-consolidation` | `consumes` | `build-release-package` | build-release-package requires the current artifact:runtime-configuration-consolidation-report artifact. | artifact:runtime-configuration-consolidation-report | — |
| `runtime-configuration-verification-to-build-release-package-invalidates` | `verify-runtime-configuration-consolidation` | `invalidates` | `build-release-package` | A material change to artifact:runtime-configuration-consolidation-report invalidates artifact:release-package. | artifact:release-package | — |
| `runtime-configuration-verification-to-verify-onboarding-distribution-consumes` | `verify-runtime-configuration-consolidation` | `consumes` | `verify-onboarding-distribution` | verify-onboarding-distribution requires the current artifact:runtime-configuration-consolidation-report artifact. | artifact:runtime-configuration-consolidation-report | — |
| `runtime-configuration-verification-to-verify-onboarding-distribution-invalidates` | `verify-runtime-configuration-consolidation` | `invalidates` | `verify-onboarding-distribution` | A material change to artifact:runtime-configuration-consolidation-report invalidates artifact:onboarding-distribution-report. | artifact:onboarding-distribution-report | — |
| `baseline-to-resolve-d6-tui-approval-surface-placement-consumes` | `baseline-context` | `consumes` | `resolve-d6-tui-approval-surface-placement` | resolve-d6-tui-approval-surface-placement requires the current artifact:baseline-context artifact. | artifact:baseline-context | — |
| `baseline-to-resolve-d6-tui-approval-surface-placement-invalidates` | `baseline-context` | `invalidates` | `resolve-d6-tui-approval-surface-placement` | A material change to artifact:baseline-context invalidates decision:d6-tui-approval-surface-placement. | decision:d6-tui-approval-surface-placement | — |
| `release-spec-to-resolve-d6-tui-approval-surface-placement-0-consumes` | `specify-release-reconciliation` | `consumes` | `resolve-d6-tui-approval-surface-placement` | resolve-d6-tui-approval-surface-placement requires the current artifact:product-spec artifact. | artifact:product-spec | — |
| `release-spec-to-resolve-d6-tui-approval-surface-placement-0-invalidates` | `specify-release-reconciliation` | `invalidates` | `resolve-d6-tui-approval-surface-placement` | A material change to artifact:product-spec invalidates decision:d6-tui-approval-surface-placement. | decision:d6-tui-approval-surface-placement | — |
| `release-spec-to-resolve-d6-tui-approval-surface-placement-1-consumes` | `specify-release-reconciliation` | `consumes` | `resolve-d6-tui-approval-surface-placement` | resolve-d6-tui-approval-surface-placement requires the current artifact:architecture-spec artifact. | artifact:architecture-spec | — |
| `release-spec-to-resolve-d6-tui-approval-surface-placement-1-invalidates` | `specify-release-reconciliation` | `invalidates` | `resolve-d6-tui-approval-surface-placement` | A material change to artifact:architecture-spec invalidates decision:d6-tui-approval-surface-placement. | decision:d6-tui-approval-surface-placement | — |
| `release-spec-to-resolve-d6-tui-approval-surface-placement-2-consumes` | `specify-release-reconciliation` | `consumes` | `resolve-d6-tui-approval-surface-placement` | resolve-d6-tui-approval-surface-placement requires the current artifact:acceptance-spec artifact. | artifact:acceptance-spec | — |
| `release-spec-to-resolve-d6-tui-approval-surface-placement-2-invalidates` | `specify-release-reconciliation` | `invalidates` | `resolve-d6-tui-approval-surface-placement` | A material change to artifact:acceptance-spec invalidates decision:d6-tui-approval-surface-placement. | decision:d6-tui-approval-surface-placement | — |
| `release-spec-to-resolve-d6-tui-approval-surface-placement-3-consumes` | `specify-release-reconciliation` | `consumes` | `resolve-d6-tui-approval-surface-placement` | resolve-d6-tui-approval-surface-placement requires the current artifact:open-questions artifact. | artifact:open-questions | — |
| `release-spec-to-resolve-d6-tui-approval-surface-placement-3-invalidates` | `specify-release-reconciliation` | `invalidates` | `resolve-d6-tui-approval-surface-placement` | A material change to artifact:open-questions invalidates decision:d6-tui-approval-surface-placement. | decision:d6-tui-approval-surface-placement | — |
| `resolve-d6-tui-approval-surface-placement-to-implement-tui-status-context-meter-consumes` | `resolve-d6-tui-approval-surface-placement` | `consumes` | `implement-tui-status-context-meter` | implement-tui-status-context-meter requires the current decision:d6-tui-approval-surface-placement artifact. | decision:d6-tui-approval-surface-placement | — |
| `resolve-d6-tui-approval-surface-placement-to-implement-tui-status-context-meter-invalidates` | `resolve-d6-tui-approval-surface-placement` | `invalidates` | `implement-tui-status-context-meter` | A material change to decision:d6-tui-approval-surface-placement invalidates artifact:tui-status-context-meter-change. | artifact:tui-status-context-meter-change | — |
| `resolve-d6-tui-approval-surface-placement-to-implement-connector-approval-controls-consumes` | `resolve-d6-tui-approval-surface-placement` | `consumes` | `implement-connector-approval-controls` | implement-connector-approval-controls requires the current decision:d6-tui-approval-surface-placement artifact. | decision:d6-tui-approval-surface-placement | — |
| `resolve-d6-tui-approval-surface-placement-to-implement-connector-approval-controls-invalidates` | `resolve-d6-tui-approval-surface-placement` | `invalidates` | `implement-connector-approval-controls` | A material change to decision:d6-tui-approval-surface-placement invalidates artifact:connector-approval-controls-change. | artifact:connector-approval-controls-change | — |
| `tui-status-context-meter-to-connector-approval-controls-consumes` | `implement-tui-status-context-meter` | `consumes` | `implement-connector-approval-controls` | implement-connector-approval-controls requires the current stable two-row TUI status geometry. | artifact:tui-status-context-meter-change | — |
| `tui-status-context-meter-to-connector-approval-controls-invalidates` | `implement-tui-status-context-meter` | `invalidates` | `implement-connector-approval-controls` | A material change to artifact:tui-status-context-meter-change invalidates artifact:connector-approval-controls-change. | artifact:connector-approval-controls-change | — |
| `resolve-d6-tui-approval-surface-placement-to-spec-verification-consumes` | `resolve-d6-tui-approval-surface-placement` | `consumes` | `verify-release-reconciliation-specifications` | verify-release-reconciliation-specifications requires the current resolved decision:d6-tui-approval-surface-placement artifact. | decision:d6-tui-approval-surface-placement | — |
| `resolve-d6-tui-approval-surface-placement-to-spec-verification-invalidates` | `resolve-d6-tui-approval-surface-placement` | `invalidates` | `verify-release-reconciliation-specifications` | A material change to decision:d6-tui-approval-surface-placement invalidates artifact:release-reconciliation-specification-verification. | artifact:release-reconciliation-specification-verification | — |
| `resolve-d6-tui-approval-surface-placement-to-plan-consumes` | `resolve-d6-tui-approval-surface-placement` | `consumes` | `plan-implementation` | plan-implementation requires the current resolved decision:d6-tui-approval-surface-placement artifact. | decision:d6-tui-approval-surface-placement | — |
| `resolve-d6-tui-approval-surface-placement-to-plan-invalidates` | `resolve-d6-tui-approval-surface-placement` | `invalidates` | `plan-implementation` | A material change to decision:d6-tui-approval-surface-placement invalidates artifact:implementation-plan. | artifact:implementation-plan | — |
| `plan-to-implement-capability-management-worker-consumes` | `plan-implementation` | `consumes` | `implement-capability-management-worker` | The dedicated capability-management worker requires the current bounded implementation plan. | artifact:implementation-plan | — |
| `plan-invalidates-implement-capability-management-worker` | `plan-implementation` | `invalidates` | `implement-capability-management-worker` | A material implementation-plan change invalidates the capability-management worker change. | artifact:capability-management-worker-change | — |
| `beta-contract-to-implement-capability-management-worker-consumes` | `approve-beta-release-contract` | `consumes` | `implement-capability-management-worker` | The dedicated capability-management worker requires the current owner-approved beta contract. | artifact:beta-release-contract | — |
| `beta-contract-approves-implement-capability-management-worker` | `approve-beta-release-contract` | `approves` | `implement-capability-management-worker` | The current owner-approved beta contract authorizes this bounded reversible implementation member; each runtime mutation still requires its own trusted approval. | artifact:beta-release-contract | — |
| `beta-contract-invalidates-implement-capability-management-worker` | `approve-beta-release-contract` | `invalidates` | `implement-capability-management-worker` | A material beta-contract change invalidates the capability-management worker change. | artifact:capability-management-worker-change | — |
| `capabilities-security-to-capability-management-worker-consumes` | `implement-capabilities-security` | `consumes` | `implement-capability-management-worker` | The capability-manager consumes the current registry, validation, materialization, and security foundation. | artifact:capabilities-security-change | — |
| `capabilities-security-invalidates-capability-management-worker` | `implement-capabilities-security` | `invalidates` | `implement-capability-management-worker` | A material capability-security change invalidates the capability-management worker change. | artifact:capability-management-worker-change | — |
| `agent-runtime-to-capability-management-worker-consumes` | `implement-agent-runtime` | `consumes` | `implement-capability-management-worker` | The capability-manager consumes the current Flue worker registration and orchestrator-routing foundation. | artifact:agent-runtime-change | — |
| `agent-runtime-invalidates-capability-management-worker` | `implement-agent-runtime` | `invalidates` | `implement-capability-management-worker` | A material agent-runtime change invalidates the capability-management worker change. | artifact:capability-management-worker-change | — |
| `d5-to-capability-management-worker-consumes` | `resolve-d5-canonical-runtime-configuration` | `consumes` | `implement-capability-management-worker` | Capability and MCP configuration references require the resolved canonical runtime configuration decision. | decision:d5-canonical-runtime-configuration | — |
| `d5-invalidates-capability-management-worker` | `resolve-d5-canonical-runtime-configuration` | `invalidates` | `implement-capability-management-worker` | A material D5 change invalidates the capability-management worker change. | artifact:capability-management-worker-change | — |
| `capability-management-worker-to-integration-consumes` | `implement-capability-management-worker` | `consumes` | `integrate-and-repair` | Integration requires the dedicated capability-management worker change. | artifact:capability-management-worker-change | — |
| `capability-management-worker-invalidates-integration` | `implement-capability-management-worker` | `invalidates` | `integrate-and-repair` | A material capability-management worker change invalidates the integrated change. | artifact:integrated-change | — |
| `plan-to-coding-worker-capability-authoring-consumes` | `plan-implementation` | `consumes` | `implement-coding-worker-capability-authoring` | Coding Worker capability authoring requires the current bounded implementation plan. | artifact:implementation-plan | — |
| `plan-invalidates-coding-worker-capability-authoring` | `plan-implementation` | `invalidates` | `implement-coding-worker-capability-authoring` | A material implementation-plan change invalidates Coding Worker capability authoring. | artifact:coding-worker-capability-authoring-change | — |
| `beta-contract-to-coding-worker-capability-authoring-consumes` | `approve-beta-release-contract` | `consumes` | `implement-coding-worker-capability-authoring` | Coding Worker capability authoring requires the current owner-approved beta contract. | artifact:beta-release-contract | — |
| `beta-contract-approves-coding-worker-capability-authoring` | `approve-beta-release-contract` | `approves` | `implement-coding-worker-capability-authoring` | The current owner-approved beta contract authorizes this bounded reversible implementation member; each workspace write still requires file-edit approval. | artifact:beta-release-contract | — |
| `beta-contract-invalidates-coding-worker-capability-authoring` | `approve-beta-release-contract` | `invalidates` | `implement-coding-worker-capability-authoring` | A material beta-contract change invalidates Coding Worker capability authoring. | artifact:coding-worker-capability-authoring-change | — |
| `capabilities-security-to-coding-worker-capability-authoring-consumes` | `implement-capabilities-security` | `consumes` | `implement-coding-worker-capability-authoring` | Capability authoring consumes the current capability formats, validation, and collision contracts. | artifact:capabilities-security-change | — |
| `capabilities-security-invalidates-coding-worker-capability-authoring` | `implement-capabilities-security` | `invalidates` | `implement-coding-worker-capability-authoring` | A material capability-contract change invalidates Coding Worker capability authoring. | artifact:coding-worker-capability-authoring-change | — |
| `scaffold-tooling-to-coding-worker-capability-authoring-consumes` | `implement-coding-worker-scaffold-tooling` | `consumes` | `implement-coding-worker-capability-authoring` | Capability authoring extends the verified Coding Worker scaffold and documentation tooling. | artifact:coding-worker-scaffold-tooling-change | — |
| `scaffold-tooling-invalidates-coding-worker-capability-authoring` | `implement-coding-worker-scaffold-tooling` | `invalidates` | `implement-coding-worker-capability-authoring` | A material scaffold-tooling change invalidates Coding Worker capability authoring. | artifact:coding-worker-capability-authoring-change | — |
| `file-access-gate-to-coding-worker-capability-authoring-consumes` | `implement-file-access-approval-gate` | `consumes` | `implement-coding-worker-capability-authoring` | Capability source generation requires the current Coding Worker file-approval boundary. | artifact:file-access-approval-gate-change | — |
| `file-access-gate-invalidates-coding-worker-capability-authoring` | `implement-file-access-approval-gate` | `invalidates` | `implement-coding-worker-capability-authoring` | A material file-approval change invalidates Coding Worker capability authoring. | artifact:coding-worker-capability-authoring-change | — |
| `d2-to-coding-worker-capability-authoring-consumes` | `resolve-d2-workspace-root-isolation` | `consumes` | `implement-coding-worker-capability-authoring` | Capability authoring requires the resolved workspace-root isolation decision. | decision:d2-workspace-root-isolation | — |
| `d2-invalidates-coding-worker-capability-authoring` | `resolve-d2-workspace-root-isolation` | `invalidates` | `implement-coding-worker-capability-authoring` | A material D2 change invalidates Coding Worker capability authoring. | artifact:coding-worker-capability-authoring-change | — |
| `d5-to-coding-worker-capability-authoring-consumes` | `resolve-d5-canonical-runtime-configuration` | `consumes` | `implement-coding-worker-capability-authoring` | MCP and capability configuration manifests require the resolved canonical runtime configuration decision. | decision:d5-canonical-runtime-configuration | — |
| `d5-invalidates-coding-worker-capability-authoring` | `resolve-d5-canonical-runtime-configuration` | `invalidates` | `implement-coding-worker-capability-authoring` | A material D5 change invalidates Coding Worker capability authoring. | artifact:coding-worker-capability-authoring-change | — |
| `coding-worker-capability-authoring-to-integration-consumes` | `implement-coding-worker-capability-authoring` | `consumes` | `integrate-and-repair` | Integration requires the Coding Worker capability-authoring change. | artifact:coding-worker-capability-authoring-change | — |
| `coding-worker-capability-authoring-invalidates-integration` | `implement-coding-worker-capability-authoring` | `invalidates` | `integrate-and-repair` | A material Coding Worker capability-authoring change invalidates the integrated change. | artifact:integrated-change | — |
| `decide-project-task-graph-separation-to-task-graph-spec` | `resolve-d7-separate-project-and-task-graphs` | `consumes` | `specify-task-lifecycle-architecture` | The decision record is current, accepted, and bound to this run. | decision:d7-separate-project-and-task-graphs | — |
| `decide-memory-helper-task-runs-to-task-graph-spec` | `resolve-d8-memory-helper-task-runs` | `consumes` | `specify-task-lifecycle-architecture` | The decision record is current, accepted, and bound to this run. | decision:d8-memory-helper-task-runs | — |
| `decide-flue-native-task-graph-runtime-to-task-graph-spec` | `resolve-d9-flue-native-task-graph-runtime` | `consumes` | `specify-task-lifecycle-architecture` | The decision record is current, accepted, and bound to this run. | decision:d9-flue-native-task-graph-runtime | — |
| `decide-sealed-node-context-to-task-graph-spec` | `resolve-d10-sealed-node-context` | `consumes` | `specify-task-lifecycle-architecture` | The decision record is current, accepted, and bound to this run. | decision:d10-sealed-node-context | — |
| `decide-shared-task-graph-engine-to-task-graph-spec` | `resolve-d11-shared-task-graph-engine` | `consumes` | `specify-task-lifecycle-architecture` | The decision record is current, accepted, and bound to this run. | decision:d11-shared-task-graph-engine | — |
| `decide-project-task-graph-separation-to-plan-implementation` | `resolve-d7-separate-project-and-task-graphs` | `consumes` | `plan-implementation` | The architecture decision is current, accepted, and bound to this run. | decision:d7-separate-project-and-task-graphs | — |
| `decide-project-task-graph-separation-to-implement-core-contracts` | `resolve-d7-separate-project-and-task-graphs` | `consumes` | `implement-core-contracts` | The architecture decision is current, accepted, and bound to this run. | decision:d7-separate-project-and-task-graphs | — |
| `decide-project-task-graph-separation-to-implement-agent-runtime` | `resolve-d7-separate-project-and-task-graphs` | `consumes` | `implement-agent-runtime` | The architecture decision is current, accepted, and bound to this run. | decision:d7-separate-project-and-task-graphs | — |
| `decide-project-task-graph-separation-to-implement-ingress-operations` | `resolve-d7-separate-project-and-task-graphs` | `consumes` | `implement-ingress-operations` | The architecture decision is current, accepted, and bound to this run. | decision:d7-separate-project-and-task-graphs | — |
| `decide-project-task-graph-separation-to-review-architecture-security` | `resolve-d7-separate-project-and-task-graphs` | `consumes` | `review-architecture-security` | The architecture decision is current, accepted, and bound to this run. | decision:d7-separate-project-and-task-graphs | — |
| `decide-memory-helper-task-runs-to-plan-implementation` | `resolve-d8-memory-helper-task-runs` | `consumes` | `plan-implementation` | The architecture decision is current, accepted, and bound to this run. | decision:d8-memory-helper-task-runs | — |
| `decide-memory-helper-task-runs-to-implement-core-contracts` | `resolve-d8-memory-helper-task-runs` | `consumes` | `implement-core-contracts` | The architecture decision is current, accepted, and bound to this run. | decision:d8-memory-helper-task-runs | — |
| `decide-memory-helper-task-runs-to-implement-memory-retrieval` | `resolve-d8-memory-helper-task-runs` | `consumes` | `implement-memory-retrieval` | The architecture decision is current, accepted, and bound to this run. | decision:d8-memory-helper-task-runs | — |
| `decide-memory-helper-task-runs-to-implement-agent-runtime` | `resolve-d8-memory-helper-task-runs` | `consumes` | `implement-agent-runtime` | The architecture decision is current, accepted, and bound to this run. | decision:d8-memory-helper-task-runs | — |
| `decide-memory-helper-task-runs-to-implement-sim-one-tui-work-pane` | `resolve-d8-memory-helper-task-runs` | `consumes` | `implement-sim-one-tui-work-pane` | The architecture decision is current, accepted, and bound to this run. | decision:d8-memory-helper-task-runs | — |
| `decide-memory-helper-task-runs-to-verify-memory-smoke` | `resolve-d8-memory-helper-task-runs` | `consumes` | `verify-memory-smoke` | The architecture decision is current, accepted, and bound to this run. | decision:d8-memory-helper-task-runs | — |
| `decide-memory-helper-task-runs-to-review-architecture-security` | `resolve-d8-memory-helper-task-runs` | `consumes` | `review-architecture-security` | The architecture decision is current, accepted, and bound to this run. | decision:d8-memory-helper-task-runs | — |
| `decide-flue-native-task-graph-runtime-to-plan-implementation` | `resolve-d9-flue-native-task-graph-runtime` | `consumes` | `plan-implementation` | The architecture decision is current, accepted, and bound to this run. | decision:d9-flue-native-task-graph-runtime | — |
| `decide-flue-native-task-graph-runtime-to-implement-core-contracts` | `resolve-d9-flue-native-task-graph-runtime` | `consumes` | `implement-core-contracts` | The architecture decision is current, accepted, and bound to this run. | decision:d9-flue-native-task-graph-runtime | — |
| `decide-flue-native-task-graph-runtime-to-implement-agent-runtime` | `resolve-d9-flue-native-task-graph-runtime` | `consumes` | `implement-agent-runtime` | The architecture decision is current, accepted, and bound to this run. | decision:d9-flue-native-task-graph-runtime | — |
| `decide-flue-native-task-graph-runtime-to-implement-ingress-operations` | `resolve-d9-flue-native-task-graph-runtime` | `consumes` | `implement-ingress-operations` | The architecture decision is current, accepted, and bound to this run. | decision:d9-flue-native-task-graph-runtime | — |
| `decide-flue-native-task-graph-runtime-to-integrate-and-repair` | `resolve-d9-flue-native-task-graph-runtime` | `consumes` | `integrate-and-repair` | The architecture decision is current, accepted, and bound to this run. | decision:d9-flue-native-task-graph-runtime | — |
| `decide-flue-native-task-graph-runtime-to-review-architecture-security` | `resolve-d9-flue-native-task-graph-runtime` | `consumes` | `review-architecture-security` | The architecture decision is current, accepted, and bound to this run. | decision:d9-flue-native-task-graph-runtime | — |
| `decide-sealed-node-context-to-plan-implementation` | `resolve-d10-sealed-node-context` | `consumes` | `plan-implementation` | The architecture decision is current, accepted, and bound to this run. | decision:d10-sealed-node-context | — |
| `decide-sealed-node-context-to-implement-core-contracts` | `resolve-d10-sealed-node-context` | `consumes` | `implement-core-contracts` | The architecture decision is current, accepted, and bound to this run. | decision:d10-sealed-node-context | — |
| `decide-sealed-node-context-to-implement-agent-runtime` | `resolve-d10-sealed-node-context` | `consumes` | `implement-agent-runtime` | The architecture decision is current, accepted, and bound to this run. | decision:d10-sealed-node-context | — |
| `decide-sealed-node-context-to-implement-memory-retrieval` | `resolve-d10-sealed-node-context` | `consumes` | `implement-memory-retrieval` | The architecture decision is current, accepted, and bound to this run. | decision:d10-sealed-node-context | — |
| `decide-sealed-node-context-to-implement-capabilities-security` | `resolve-d10-sealed-node-context` | `consumes` | `implement-capabilities-security` | The architecture decision is current, accepted, and bound to this run. | decision:d10-sealed-node-context | — |
| `decide-sealed-node-context-to-implement-ingress-operations` | `resolve-d10-sealed-node-context` | `consumes` | `implement-ingress-operations` | The architecture decision is current, accepted, and bound to this run. | decision:d10-sealed-node-context | — |
| `decide-sealed-node-context-to-review-architecture-security` | `resolve-d10-sealed-node-context` | `consumes` | `review-architecture-security` | The architecture decision is current, accepted, and bound to this run. | decision:d10-sealed-node-context | — |
| `decide-shared-task-graph-engine-to-plan-implementation` | `resolve-d11-shared-task-graph-engine` | `consumes` | `plan-implementation` | The architecture decision is current, accepted, and bound to this run. | decision:d11-shared-task-graph-engine | — |
| `decide-shared-task-graph-engine-to-implement-agent-runtime` | `resolve-d11-shared-task-graph-engine` | `consumes` | `implement-agent-runtime` | The architecture decision is current, accepted, and bound to this run. | decision:d11-shared-task-graph-engine | — |
| `decide-shared-task-graph-engine-to-implement-ingress-operations` | `resolve-d11-shared-task-graph-engine` | `consumes` | `implement-ingress-operations` | The architecture decision is current, accepted, and bound to this run. | decision:d11-shared-task-graph-engine | — |
| `decide-shared-task-graph-engine-to-integrate-and-repair` | `resolve-d11-shared-task-graph-engine` | `consumes` | `integrate-and-repair` | The architecture decision is current, accepted, and bound to this run. | decision:d11-shared-task-graph-engine | — |
| `decide-shared-task-graph-engine-to-implement-sim-one-tui-work-pane` | `resolve-d11-shared-task-graph-engine` | `consumes` | `implement-sim-one-tui-work-pane` | The architecture decision is current, accepted, and bound to this run. | decision:d11-shared-task-graph-engine | — |
| `decide-shared-task-graph-engine-to-review-architecture-security` | `resolve-d11-shared-task-graph-engine` | `consumes` | `review-architecture-security` | The architecture decision is current, accepted, and bound to this run. | decision:d11-shared-task-graph-engine | — |
| `task-graph-spec-to-plan-implementation` | `specify-task-lifecycle-architecture` | `consumes` | `plan-implementation` | The task lifecycle architecture specification is current, accepted, and bound to this run. | artifact:task-lifecycle-architecture-spec | — |
| `baseline-to-resolve-d10-sealed-node-context-consumes` | `baseline-context` | `consumes` | `resolve-d10-sealed-node-context` | The grounded repository baseline is current and bound to this specification decision. | artifact:baseline-context | — |
| `baseline-to-resolve-d10-sealed-node-context-invalidates` | `baseline-context` | `invalidates` | `resolve-d10-sealed-node-context` | A changed repository baseline invalidates the decision record and requires fresh resolution. | decision:d10-sealed-node-context | — |
| `baseline-to-resolve-d11-shared-task-graph-engine-consumes` | `baseline-context` | `consumes` | `resolve-d11-shared-task-graph-engine` | The grounded repository baseline is current and bound to this specification decision. | artifact:baseline-context | — |
| `baseline-to-resolve-d11-shared-task-graph-engine-invalidates` | `baseline-context` | `invalidates` | `resolve-d11-shared-task-graph-engine` | A changed repository baseline invalidates the decision record and requires fresh resolution. | decision:d11-shared-task-graph-engine | — |
| `baseline-to-resolve-d7-separate-project-and-task-graphs-consumes` | `baseline-context` | `consumes` | `resolve-d7-separate-project-and-task-graphs` | The grounded repository baseline is current and bound to this specification decision. | artifact:baseline-context | — |
| `baseline-to-resolve-d7-separate-project-and-task-graphs-invalidates` | `baseline-context` | `invalidates` | `resolve-d7-separate-project-and-task-graphs` | A changed repository baseline invalidates the decision record and requires fresh resolution. | decision:d7-separate-project-and-task-graphs | — |
| `baseline-to-resolve-d8-memory-helper-task-runs-consumes` | `baseline-context` | `consumes` | `resolve-d8-memory-helper-task-runs` | The grounded repository baseline is current and bound to this specification decision. | artifact:baseline-context | — |
| `baseline-to-resolve-d8-memory-helper-task-runs-invalidates` | `baseline-context` | `invalidates` | `resolve-d8-memory-helper-task-runs` | A changed repository baseline invalidates the decision record and requires fresh resolution. | decision:d8-memory-helper-task-runs | — |
| `baseline-to-resolve-d9-flue-native-task-graph-runtime-consumes` | `baseline-context` | `consumes` | `resolve-d9-flue-native-task-graph-runtime` | The grounded repository baseline is current and bound to this specification decision. | artifact:baseline-context | — |
| `baseline-to-resolve-d9-flue-native-task-graph-runtime-invalidates` | `baseline-context` | `invalidates` | `resolve-d9-flue-native-task-graph-runtime` | A changed repository baseline invalidates the decision record and requires fresh resolution. | decision:d9-flue-native-task-graph-runtime | — |
| `decide-flue-native-task-graph-runtime-to-implement-agent-runtime-invalidates` | `resolve-d9-flue-native-task-graph-runtime` | `invalidates` | `implement-agent-runtime` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:agent-runtime-change | — |
| `decide-flue-native-task-graph-runtime-to-implement-core-contracts-invalidates` | `resolve-d9-flue-native-task-graph-runtime` | `invalidates` | `implement-core-contracts` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:core-contracts-change | — |
| `decide-flue-native-task-graph-runtime-to-implement-ingress-operations-invalidates` | `resolve-d9-flue-native-task-graph-runtime` | `invalidates` | `implement-ingress-operations` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:ingress-operations-change | — |
| `decide-flue-native-task-graph-runtime-to-integrate-and-repair-invalidates` | `resolve-d9-flue-native-task-graph-runtime` | `invalidates` | `integrate-and-repair` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:integrated-change | — |
| `decide-flue-native-task-graph-runtime-to-plan-implementation-invalidates` | `resolve-d9-flue-native-task-graph-runtime` | `invalidates` | `plan-implementation` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:implementation-plan | — |
| `decide-flue-native-task-graph-runtime-to-review-architecture-security-invalidates` | `resolve-d9-flue-native-task-graph-runtime` | `invalidates` | `review-architecture-security` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:architecture-security-review | — |
| `decide-flue-native-task-graph-runtime-to-task-graph-spec-invalidates` | `resolve-d9-flue-native-task-graph-runtime` | `invalidates` | `specify-task-lifecycle-architecture` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:task-lifecycle-architecture-spec | — |
| `decide-memory-helper-task-runs-to-implement-agent-runtime-invalidates` | `resolve-d8-memory-helper-task-runs` | `invalidates` | `implement-agent-runtime` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:agent-runtime-change | — |
| `decide-memory-helper-task-runs-to-implement-core-contracts-invalidates` | `resolve-d8-memory-helper-task-runs` | `invalidates` | `implement-core-contracts` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:core-contracts-change | — |
| `decide-memory-helper-task-runs-to-implement-memory-retrieval-invalidates` | `resolve-d8-memory-helper-task-runs` | `invalidates` | `implement-memory-retrieval` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:memory-retrieval-change | — |
| `decide-memory-helper-task-runs-to-implement-sim-one-tui-work-pane-invalidates` | `resolve-d8-memory-helper-task-runs` | `invalidates` | `implement-sim-one-tui-work-pane` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:sim-one-tui-work-pane-change | — |
| `decide-memory-helper-task-runs-to-plan-implementation-invalidates` | `resolve-d8-memory-helper-task-runs` | `invalidates` | `plan-implementation` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:implementation-plan | — |
| `decide-memory-helper-task-runs-to-review-architecture-security-invalidates` | `resolve-d8-memory-helper-task-runs` | `invalidates` | `review-architecture-security` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:architecture-security-review | — |
| `decide-memory-helper-task-runs-to-task-graph-spec-invalidates` | `resolve-d8-memory-helper-task-runs` | `invalidates` | `specify-task-lifecycle-architecture` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:task-lifecycle-architecture-spec | — |
| `decide-memory-helper-task-runs-to-verify-memory-smoke-invalidates` | `resolve-d8-memory-helper-task-runs` | `invalidates` | `verify-memory-smoke` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:memory-smoke-report | — |
| `decide-project-task-graph-separation-to-implement-agent-runtime-invalidates` | `resolve-d7-separate-project-and-task-graphs` | `invalidates` | `implement-agent-runtime` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:agent-runtime-change | — |
| `decide-project-task-graph-separation-to-implement-core-contracts-invalidates` | `resolve-d7-separate-project-and-task-graphs` | `invalidates` | `implement-core-contracts` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:core-contracts-change | — |
| `decide-project-task-graph-separation-to-implement-ingress-operations-invalidates` | `resolve-d7-separate-project-and-task-graphs` | `invalidates` | `implement-ingress-operations` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:ingress-operations-change | — |
| `decide-project-task-graph-separation-to-plan-implementation-invalidates` | `resolve-d7-separate-project-and-task-graphs` | `invalidates` | `plan-implementation` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:implementation-plan | — |
| `decide-project-task-graph-separation-to-review-architecture-security-invalidates` | `resolve-d7-separate-project-and-task-graphs` | `invalidates` | `review-architecture-security` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:architecture-security-review | — |
| `decide-project-task-graph-separation-to-task-graph-spec-invalidates` | `resolve-d7-separate-project-and-task-graphs` | `invalidates` | `specify-task-lifecycle-architecture` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:task-lifecycle-architecture-spec | — |
| `decide-sealed-node-context-to-implement-agent-runtime-invalidates` | `resolve-d10-sealed-node-context` | `invalidates` | `implement-agent-runtime` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:agent-runtime-change | — |
| `decide-sealed-node-context-to-implement-capabilities-security-invalidates` | `resolve-d10-sealed-node-context` | `invalidates` | `implement-capabilities-security` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:capabilities-security-change | — |
| `decide-sealed-node-context-to-implement-core-contracts-invalidates` | `resolve-d10-sealed-node-context` | `invalidates` | `implement-core-contracts` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:core-contracts-change | — |
| `decide-sealed-node-context-to-implement-ingress-operations-invalidates` | `resolve-d10-sealed-node-context` | `invalidates` | `implement-ingress-operations` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:ingress-operations-change | — |
| `decide-sealed-node-context-to-implement-memory-retrieval-invalidates` | `resolve-d10-sealed-node-context` | `invalidates` | `implement-memory-retrieval` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:memory-retrieval-change | — |
| `decide-sealed-node-context-to-plan-implementation-invalidates` | `resolve-d10-sealed-node-context` | `invalidates` | `plan-implementation` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:implementation-plan | — |
| `decide-sealed-node-context-to-review-architecture-security-invalidates` | `resolve-d10-sealed-node-context` | `invalidates` | `review-architecture-security` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:architecture-security-review | — |
| `decide-sealed-node-context-to-task-graph-spec-invalidates` | `resolve-d10-sealed-node-context` | `invalidates` | `specify-task-lifecycle-architecture` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:task-lifecycle-architecture-spec | — |
| `decide-shared-task-graph-engine-to-implement-agent-runtime-invalidates` | `resolve-d11-shared-task-graph-engine` | `invalidates` | `implement-agent-runtime` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:agent-runtime-change | — |
| `decide-shared-task-graph-engine-to-implement-ingress-operations-invalidates` | `resolve-d11-shared-task-graph-engine` | `invalidates` | `implement-ingress-operations` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:ingress-operations-change | — |
| `decide-shared-task-graph-engine-to-implement-sim-one-tui-work-pane-invalidates` | `resolve-d11-shared-task-graph-engine` | `invalidates` | `implement-sim-one-tui-work-pane` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:sim-one-tui-work-pane-change | — |
| `decide-shared-task-graph-engine-to-integrate-and-repair-invalidates` | `resolve-d11-shared-task-graph-engine` | `invalidates` | `integrate-and-repair` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:integrated-change | — |
| `decide-shared-task-graph-engine-to-plan-implementation-invalidates` | `resolve-d11-shared-task-graph-engine` | `invalidates` | `plan-implementation` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:implementation-plan | — |
| `decide-shared-task-graph-engine-to-review-architecture-security-invalidates` | `resolve-d11-shared-task-graph-engine` | `invalidates` | `review-architecture-security` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:architecture-security-review | — |
| `decide-shared-task-graph-engine-to-task-graph-spec-invalidates` | `resolve-d11-shared-task-graph-engine` | `invalidates` | `specify-task-lifecycle-architecture` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:task-lifecycle-architecture-spec | — |
| `task-graph-spec-to-plan-implementation-invalidates` | `specify-task-lifecycle-architecture` | `invalidates` | `plan-implementation` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:implementation-plan | — |
| `task-graph-spec-to-review-architecture-security-consumes` | `specify-task-lifecycle-architecture` | `consumes` | `review-architecture-security` | The task lifecycle architecture specification is current, accepted, and bound to this run. | artifact:task-lifecycle-architecture-spec | — |
| `task-graph-spec-to-review-architecture-security-invalidates` | `specify-task-lifecycle-architecture` | `invalidates` | `review-architecture-security` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:architecture-security-review | — |
| `task-graph-spec-to-verify-release-reconciliation-specifications-consumes` | `specify-task-lifecycle-architecture` | `consumes` | `verify-release-reconciliation-specifications` | The task lifecycle architecture specification is current, accepted, and bound to this run. | artifact:task-lifecycle-architecture-spec | — |
| `task-graph-spec-to-verify-release-reconciliation-specifications-invalidates` | `specify-task-lifecycle-architecture` | `invalidates` | `verify-release-reconciliation-specifications` | A material change to the consumed task-lifecycle decision or specification invalidates this downstream output and requires fresh execution. | artifact:release-reconciliation-specification-verification | — |
| `resolve-d7-separate-project-and-task-graphs-to-verify-release-reconciliation-specifications-consumes` | `resolve-d7-separate-project-and-task-graphs` | `consumes` | `verify-release-reconciliation-specifications` | The resolved task-lifecycle decision is current and bound to specification verification. | decision:d7-separate-project-and-task-graphs | — |
| `resolve-d7-separate-project-and-task-graphs-to-verify-release-reconciliation-specifications-invalidates` | `resolve-d7-separate-project-and-task-graphs` | `invalidates` | `verify-release-reconciliation-specifications` | A material decision change invalidates specification verification and requires fresh evidence. | artifact:release-reconciliation-specification-verification | — |
| `resolve-d8-memory-helper-task-runs-to-verify-release-reconciliation-specifications-consumes` | `resolve-d8-memory-helper-task-runs` | `consumes` | `verify-release-reconciliation-specifications` | The resolved task-lifecycle decision is current and bound to specification verification. | decision:d8-memory-helper-task-runs | — |
| `resolve-d8-memory-helper-task-runs-to-verify-release-reconciliation-specifications-invalidates` | `resolve-d8-memory-helper-task-runs` | `invalidates` | `verify-release-reconciliation-specifications` | A material decision change invalidates specification verification and requires fresh evidence. | artifact:release-reconciliation-specification-verification | — |
| `resolve-d9-flue-native-task-graph-runtime-to-verify-release-reconciliation-specifications-consumes` | `resolve-d9-flue-native-task-graph-runtime` | `consumes` | `verify-release-reconciliation-specifications` | The resolved task-lifecycle decision is current and bound to specification verification. | decision:d9-flue-native-task-graph-runtime | — |
| `resolve-d9-flue-native-task-graph-runtime-to-verify-release-reconciliation-specifications-invalidates` | `resolve-d9-flue-native-task-graph-runtime` | `invalidates` | `verify-release-reconciliation-specifications` | A material decision change invalidates specification verification and requires fresh evidence. | artifact:release-reconciliation-specification-verification | — |
| `resolve-d10-sealed-node-context-to-verify-release-reconciliation-specifications-consumes` | `resolve-d10-sealed-node-context` | `consumes` | `verify-release-reconciliation-specifications` | The resolved task-lifecycle decision is current and bound to specification verification. | decision:d10-sealed-node-context | — |
| `resolve-d10-sealed-node-context-to-verify-release-reconciliation-specifications-invalidates` | `resolve-d10-sealed-node-context` | `invalidates` | `verify-release-reconciliation-specifications` | A material decision change invalidates specification verification and requires fresh evidence. | artifact:release-reconciliation-specification-verification | — |
| `resolve-d11-shared-task-graph-engine-to-verify-release-reconciliation-specifications-consumes` | `resolve-d11-shared-task-graph-engine` | `consumes` | `verify-release-reconciliation-specifications` | The resolved task-lifecycle decision is current and bound to specification verification. | decision:d11-shared-task-graph-engine | — |
| `resolve-d11-shared-task-graph-engine-to-verify-release-reconciliation-specifications-invalidates` | `resolve-d11-shared-task-graph-engine` | `invalidates` | `verify-release-reconciliation-specifications` | A material decision change invalidates specification verification and requires fresh evidence. | artifact:release-reconciliation-specification-verification | — |
| `task-graph-spec-to-integrate-and-repair` | `specify-task-lifecycle-architecture` | `consumes` | `integrate-and-repair` | The task-lifecycle decision or specification is current, accepted, and bound to this run. | artifact:task-lifecycle-architecture-spec | — |
| `task-graph-spec-to-integrate-and-repair-invalidates` | `specify-task-lifecycle-architecture` | `invalidates` | `integrate-and-repair` | A material change to the consumed task-lifecycle decision or specification invalidates integration and requires fresh execution. | artifact:integrated-change | — |
| `decide-project-task-graph-separation-to-integrate-and-repair` | `resolve-d7-separate-project-and-task-graphs` | `consumes` | `integrate-and-repair` | The task-lifecycle decision or specification is current, accepted, and bound to this run. | decision:d7-separate-project-and-task-graphs | — |
| `decide-project-task-graph-separation-to-integrate-and-repair-invalidates` | `resolve-d7-separate-project-and-task-graphs` | `invalidates` | `integrate-and-repair` | A material change to the consumed task-lifecycle decision or specification invalidates integration and requires fresh execution. | artifact:integrated-change | — |
| `decide-memory-helper-task-runs-to-integrate-and-repair` | `resolve-d8-memory-helper-task-runs` | `consumes` | `integrate-and-repair` | The task-lifecycle decision or specification is current, accepted, and bound to this run. | decision:d8-memory-helper-task-runs | — |
| `decide-memory-helper-task-runs-to-integrate-and-repair-invalidates` | `resolve-d8-memory-helper-task-runs` | `invalidates` | `integrate-and-repair` | A material change to the consumed task-lifecycle decision or specification invalidates integration and requires fresh execution. | artifact:integrated-change | — |
| `decide-sealed-node-context-to-integrate-and-repair` | `resolve-d10-sealed-node-context` | `consumes` | `integrate-and-repair` | The task-lifecycle decision or specification is current, accepted, and bound to this run. | decision:d10-sealed-node-context | — |
| `decide-sealed-node-context-to-integrate-and-repair-invalidates` | `resolve-d10-sealed-node-context` | `invalidates` | `integrate-and-repair` | A material change to the consumed task-lifecycle decision or specification invalidates integration and requires fresh execution. | artifact:integrated-change | — |
| `baseline-context-to-specify-task-lifecycle-architecture` | `baseline-context` | `consumes` | `specify-task-lifecycle-architecture` | Grounded project context is current and bound before the task-lifecycle specification is maintained. | artifact:baseline-context | — |
| `baseline-context-invalidates-task-lifecycle-architecture` | `baseline-context` | `invalidates` | `specify-task-lifecycle-architecture` | A changed grounded baseline invalidates the task-lifecycle architecture specification. | artifact:task-lifecycle-architecture-spec | — |
| `baseline-context-to-specify-flue-v2-migration` | `baseline-context` | `consumes` | `specify-flue-v2-migration` | Grounded project context is current and bound before the Flue 2 migration specification is maintained. | artifact:baseline-context | — |
| `baseline-context-invalidates-flue-v2-migration` | `baseline-context` | `invalidates` | `specify-flue-v2-migration` | A changed grounded baseline invalidates the Flue 2 migration specification. | artifact:flue-v2-migration-spec | — |
| `flue-v2-spec-to-verify-release-reconciliation-specifications-consumes` | `specify-flue-v2-migration` | `consumes` | `verify-release-reconciliation-specifications` | The Flue 2 migration specification is current and bound to this run. | artifact:flue-v2-migration-spec | — |
| `flue-v2-spec-to-verify-release-reconciliation-specifications-invalidates` | `specify-flue-v2-migration` | `invalidates` | `verify-release-reconciliation-specifications` | A material change to the Flue 2 migration specification invalidates this downstream output. | artifact:release-reconciliation-specification-verification | — |
| `flue-v2-spec-to-plan-implementation-consumes` | `specify-flue-v2-migration` | `consumes` | `plan-implementation` | The Flue 2 migration specification is current and bound to this run. | artifact:flue-v2-migration-spec | — |
| `flue-v2-spec-to-plan-implementation-invalidates` | `specify-flue-v2-migration` | `invalidates` | `plan-implementation` | A material change to the Flue 2 migration specification invalidates this downstream output. | artifact:implementation-plan | — |
| `flue-v2-spec-to-review-architecture-security-consumes` | `specify-flue-v2-migration` | `consumes` | `review-architecture-security` | The Flue 2 migration specification is current and bound to this run. | artifact:flue-v2-migration-spec | — |
| `flue-v2-spec-to-review-architecture-security-invalidates` | `specify-flue-v2-migration` | `invalidates` | `review-architecture-security` | A material change to the Flue 2 migration specification invalidates this downstream output. | artifact:architecture-security-review | — |
| `flue-v2-spec-to-integrate-and-repair-consumes` | `specify-flue-v2-migration` | `consumes` | `integrate-and-repair` | The Flue 2 migration specification is current and bound to this run. | artifact:flue-v2-migration-spec | — |
| `flue-v2-spec-to-integrate-and-repair-invalidates` | `specify-flue-v2-migration` | `invalidates` | `integrate-and-repair` | A material change to the Flue 2 migration specification invalidates this downstream output. | artifact:integrated-change | — |
| `specify-flue-v2-migration-to-migrate-flue-v2-foundation-consumes` | `specify-flue-v2-migration` | `consumes` | `migrate-flue-v2-foundation` | The upstream Flue 2 migration milestone is verified and its artifact is current. | artifact:flue-v2-migration-spec | — |
| `specify-flue-v2-migration-to-migrate-flue-v2-foundation-invalidates` | `specify-flue-v2-migration` | `invalidates` | `migrate-flue-v2-foundation` | A material upstream migration change invalidates the dependent milestone. | artifact:flue-v2-foundation-change | — |
| `migrate-flue-v2-foundation-to-migrate-flue-v2-agents-workers-consumes` | `migrate-flue-v2-foundation` | `consumes` | `migrate-flue-v2-agents-workers` | The upstream Flue 2 migration milestone is verified and its artifact is current. | artifact:flue-v2-foundation-change | — |
| `migrate-flue-v2-foundation-to-migrate-flue-v2-agents-workers-invalidates` | `migrate-flue-v2-foundation` | `invalidates` | `migrate-flue-v2-agents-workers` | A material upstream migration change invalidates the dependent milestone. | artifact:flue-v2-agents-workers-change | — |
| `migrate-flue-v2-agents-workers-to-migrate-flue-v2-capabilities-consumes` | `migrate-flue-v2-agents-workers` | `consumes` | `migrate-flue-v2-capabilities` | The upstream Flue 2 migration milestone is verified and its artifact is current. | artifact:flue-v2-agents-workers-change | — |
| `migrate-flue-v2-agents-workers-to-migrate-flue-v2-capabilities-invalidates` | `migrate-flue-v2-agents-workers` | `invalidates` | `migrate-flue-v2-capabilities` | A material upstream migration change invalidates the dependent milestone. | artifact:flue-v2-capabilities-change | — |
| `migrate-flue-v2-capabilities-to-migrate-flue-v2-execution-persistence-consumes` | `migrate-flue-v2-capabilities` | `consumes` | `migrate-flue-v2-execution-persistence` | The upstream Flue 2 migration milestone is verified and its artifact is current. | artifact:flue-v2-capabilities-change | — |
| `migrate-flue-v2-capabilities-to-migrate-flue-v2-execution-persistence-invalidates` | `migrate-flue-v2-capabilities` | `invalidates` | `migrate-flue-v2-execution-persistence` | A material upstream migration change invalidates the dependent milestone. | artifact:flue-v2-execution-persistence-change | — |
| `migrate-flue-v2-execution-persistence-to-migrate-flue-v2-connectors-clients-consumes` | `migrate-flue-v2-execution-persistence` | `consumes` | `migrate-flue-v2-connectors-clients` | The upstream Flue 2 migration milestone is verified and its artifact is current. | artifact:flue-v2-execution-persistence-change | — |
| `migrate-flue-v2-execution-persistence-to-migrate-flue-v2-connectors-clients-invalidates` | `migrate-flue-v2-execution-persistence` | `invalidates` | `migrate-flue-v2-connectors-clients` | A material upstream migration change invalidates the dependent milestone. | artifact:flue-v2-connectors-clients-change | — |
| `migrate-flue-v2-connectors-clients-to-migrate-flue-v2-product-packaging-consumes` | `migrate-flue-v2-connectors-clients` | `consumes` | `migrate-flue-v2-product-packaging` | The upstream Flue 2 migration milestone is verified and its artifact is current. | artifact:flue-v2-connectors-clients-change | — |
| `migrate-flue-v2-connectors-clients-to-migrate-flue-v2-product-packaging-invalidates` | `migrate-flue-v2-connectors-clients` | `invalidates` | `migrate-flue-v2-product-packaging` | A material upstream migration change invalidates the dependent milestone. | artifact:flue-v2-product-packaging-change | — |
| `migrate-flue-v2-product-packaging-to-migrate-flue-v2-documentation-consumes` | `migrate-flue-v2-product-packaging` | `consumes` | `migrate-flue-v2-documentation` | The upstream Flue 2 migration milestone is verified and its artifact is current. | artifact:flue-v2-product-packaging-change | — |
| `migrate-flue-v2-product-packaging-to-migrate-flue-v2-documentation-invalidates` | `migrate-flue-v2-product-packaging` | `invalidates` | `migrate-flue-v2-documentation` | A material upstream migration change invalidates the dependent milestone. | artifact:flue-v2-documentation-change | — |
| `migrate-flue-v2-documentation-to-verify-flue-v2-production-migration-consumes` | `migrate-flue-v2-documentation` | `consumes` | `verify-flue-v2-production-migration` | The upstream Flue 2 migration milestone is verified and its artifact is current. | artifact:flue-v2-documentation-change | — |
| `migrate-flue-v2-documentation-to-verify-flue-v2-production-migration-invalidates` | `migrate-flue-v2-documentation` | `invalidates` | `verify-flue-v2-production-migration` | A material upstream migration change invalidates the dependent milestone. | artifact:flue-v2-production-verification | — |
| `baseline-to-flue-v2-foundation` | `baseline-context` | `consumes` | `migrate-flue-v2-foundation` | Grounded repository context is verified before implementation. | artifact:baseline-context | — |
| `baseline-invalidates-flue-v2-foundation` | `baseline-context` | `invalidates` | `migrate-flue-v2-foundation` | A changed repository baseline invalidates the migration foundation. | artifact:flue-v2-foundation-change | — |
| `baseline-to-resolve-d12-flue-v2-persistence-and-compaction-consumes` | `baseline-context` | `consumes` | `resolve-d12-flue-v2-persistence-and-compaction` | The grounded repository and installed Flue 2 baseline are current and bound to this decision. | artifact:baseline-context | — |
| `baseline-to-resolve-d12-flue-v2-persistence-and-compaction-invalidates` | `baseline-context` | `invalidates` | `resolve-d12-flue-v2-persistence-and-compaction` | A changed runtime or framework baseline invalidates the persistence decision. | decision:d12-flue-v2-persistence-and-compaction | — |
| `resolve-d12-flue-v2-persistence-and-compaction-to-migrate-flue-v2-execution-persistence-consumes` | `resolve-d12-flue-v2-persistence-and-compaction` | `consumes` | `migrate-flue-v2-execution-persistence` | The resolved Flue 2 persistence and compaction decision is current and bound to this consumer. | decision:d12-flue-v2-persistence-and-compaction | — |
| `resolve-d12-flue-v2-persistence-and-compaction-to-migrate-flue-v2-connectors-clients-consumes` | `resolve-d12-flue-v2-persistence-and-compaction` | `consumes` | `migrate-flue-v2-connectors-clients` | The resolved Flue 2 persistence and compaction decision is current and bound to this consumer. | decision:d12-flue-v2-persistence-and-compaction | — |
| `resolve-d12-flue-v2-persistence-and-compaction-to-migrate-flue-v2-product-packaging-consumes` | `resolve-d12-flue-v2-persistence-and-compaction` | `consumes` | `migrate-flue-v2-product-packaging` | The resolved Flue 2 persistence and compaction decision is current and bound to this consumer. | decision:d12-flue-v2-persistence-and-compaction | — |
| `resolve-d12-flue-v2-persistence-and-compaction-to-migrate-flue-v2-documentation-consumes` | `resolve-d12-flue-v2-persistence-and-compaction` | `consumes` | `migrate-flue-v2-documentation` | The resolved Flue 2 persistence and compaction decision is current and bound to this consumer. | decision:d12-flue-v2-persistence-and-compaction | — |
| `resolve-d12-flue-v2-persistence-and-compaction-to-verify-release-reconciliation-specifications-consumes` | `resolve-d12-flue-v2-persistence-and-compaction` | `consumes` | `verify-release-reconciliation-specifications` | The resolved Flue 2 persistence and compaction decision is current and bound to this consumer. | decision:d12-flue-v2-persistence-and-compaction | — |
| `resolve-d12-flue-v2-persistence-and-compaction-to-plan-implementation-consumes` | `resolve-d12-flue-v2-persistence-and-compaction` | `consumes` | `plan-implementation` | The resolved Flue 2 persistence and compaction decision is current and bound to this consumer. | decision:d12-flue-v2-persistence-and-compaction | — |
| `migrate-flue-v2-agents-workers-to-repair-flue-v2-verification-regressions-consumes` | `migrate-flue-v2-agents-workers` | `consumes` | `repair-flue-v2-verification-regressions` | The verified agent and Coding Worker migration remains current. | artifact:flue-v2-agents-workers-change | — |
| `migrate-flue-v2-execution-persistence-to-repair-flue-v2-verification-regressions-consumes` | `migrate-flue-v2-execution-persistence` | `consumes` | `repair-flue-v2-verification-regressions` | The verified execution migration remains current. | artifact:flue-v2-execution-persistence-change | — |
| `migrate-flue-v2-documentation-to-repair-flue-v2-verification-regressions-consumes` | `migrate-flue-v2-documentation` | `consumes` | `repair-flue-v2-verification-regressions` | The verified documentation migration remains current. | artifact:flue-v2-documentation-change | — |
| `repair-flue-v2-verification-regressions-to-verify-flue-v2-production-migration-consumes` | `repair-flue-v2-verification-regressions` | `consumes` | `verify-flue-v2-production-migration` | The bounded final-verification repair is verified before production verification resumes. | artifact:flue-v2-verification-repair | — |
| `migrate-flue-v2-capabilities-to-repair-flue-v2-memory-smoke-harness-consumes` | `migrate-flue-v2-capabilities` | `consumes` | `repair-flue-v2-memory-smoke-harness` | The verified Flue 2 capability definitions remain current. | artifact:flue-v2-capabilities-change | — |
| `migrate-flue-v2-execution-persistence-to-repair-flue-v2-memory-smoke-harness-consumes` | `migrate-flue-v2-execution-persistence` | `consumes` | `repair-flue-v2-memory-smoke-harness` | The verified Flue 2 structured-memory execution and persistence migration remains current. | artifact:flue-v2-execution-persistence-change | — |
| `repair-flue-v2-memory-smoke-harness-to-verify-flue-v2-production-migration-consumes` | `repair-flue-v2-memory-smoke-harness` | `consumes` | `verify-flue-v2-production-migration` | The deterministic memory smoke repair is verified before final production verification resumes. | artifact:flue-v2-memory-smoke-repair | — |
| `migrate-flue-v2-connectors-clients-to-repair-flue-v2-tui-e2e-harness-consumes` | `migrate-flue-v2-connectors-clients` | `consumes` | `repair-flue-v2-tui-e2e-harness` | The verified Flue 2 client integration remains current. | artifact:flue-v2-connectors-clients-change | — |
| `migrate-flue-v2-product-packaging-to-repair-flue-v2-tui-e2e-harness-consumes` | `migrate-flue-v2-product-packaging` | `consumes` | `repair-flue-v2-tui-e2e-harness` | The verified Flue 2 product package remains current. | artifact:flue-v2-product-packaging-change | — |
| `repair-flue-v2-tui-e2e-harness-to-verify-flue-v2-production-migration-consumes` | `repair-flue-v2-tui-e2e-harness` | `consumes` | `verify-flue-v2-production-migration` | The TUI E2E harness repair is verified before final production verification resumes. | artifact:flue-v2-tui-e2e-repair | — |

## Node contracts

### `baseline-context` — Bind Change To Current Project Context

- Goal: Bind one authorized change request to the current SIM-ONE Alpha commit, applicable instructions, graph-owned planning artifacts, architecture contracts, affected domains, and external-effect boundaries.
- Executor instructions: Read the authorized request, current Git state, AGENTS.md, architecture documents, development graph, specification manifest, decision catalog, repository specifications, implementation lineage, release ledger, and relevant history. Record project-relative paths and SHA-256 digests for the graph-owned planning artifacts before approval. Do not mark historical implementation as verified. Classify every workspace-related path as company-owned system instructions, the main-agent persona workspace, a lead-worker persona workspace, a worker-local internal-subagent workspace, or the Coding Worker runtime access root. Before any executable node is claimed, compare the active checkout containing development-graph.json with project.root. If they differ, record explicit operator authority for canonical-root execution or stop; never silently execute against another checkout.
- Inputs: external:authorized-change-request, external:repository-checkout
- Resources: —
- Permissions: read [AGENTS.md, docs/architecture/, package.json, pnpm-lock.yaml, .github/workflows/, current Git metadata, src/AGENTS.md, src/workspace-loader.ts, src/agents/orchestrator.ts, src/workspace/, src/engine/workers/*/workspace/, src/engine/workers/coding-worker/subagents/*/workspace/, development-graph.json, specification-manifest.json, decisions.json, doc/, doc/implementation-lineage.md, docs/getting-started/pre-release-status.md]; write [—]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `45` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `none` — Produces evidence without mutating project or external state.
- Rollback: none
- Approval required: `false`
- Acceptance:
  - `context-bound-to-commit` (artifact): The context record names the exact Git commit, instruction files, requested outcome, explicit non-goals, affected domains, and external effects. Evidence: `runtime:evidence/baseline-context/context.json`
  - `repository-planning-artifacts-bound` (policy): The context record binds the current development graph, specification manifest, decision catalog, repository specifications, implementation lineage, and release ledger by project-relative path and SHA-256 digest; a changed planning artifact invalidates the baseline and blocks reuse of its approval. Evidence: `runtime:evidence/baseline-context/repository-planning-digests.json`
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
- Executor instructions: Create or update repository specification, decision, acceptance, and implementation-lineage artifacts and name every behavioral acceptance test, external effect, approval gate, and rollback. When workspace-related behavior is in scope, distinguish instruction/persona ownership from Coding Worker sandbox and project-root access. Do not create an external plan as a second scheduler.
- Inputs: artifact:baseline-context
- Resources: project:implementation-lineage
- Permissions: read [artifact:baseline-context, AGENTS.md, src/AGENTS.md, docs/architecture/flue-architecture.md, docs/architecture/gorombo-flue-map.md, development-graph.json, specification-manifest.json, decisions.json, doc/, docs/getting-started/pre-release-status.md]; write [doc/implementation-lineage.md]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `45` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Updates the repository-owned change contract and implementation lineage.
- Rollback: Restore the prior repository artifacts and invalidate downstream work that consumed the superseded contract.
- Approval required: `false`
- Acceptance:
  - `graph-owned-change-contract` (artifact): The requested change is represented by graph-owned specification, decision, acceptance, and implementation-lineage artifacts rather than an external loose plan. Evidence: `runtime:evidence/define-change-contract/graph-owned-change-contract.json`
  - `acceptance-is-behavioral` (review): Success criteria prove correct outputs or target-system effects; process, port, file existence, and zero exit alone are not treated as behavioral proof. Evidence: `runtime:evidence/define-change-contract/acceptance-review.json`
  - `authority-is-bounded` (policy): The contract lists exact authorized mutations and separates read-only discovery from local, GitHub, deployment, sending, spending, and destructive effects. Evidence: `runtime:evidence/define-change-contract/authority.json`
  - `workspace-scope-explicit` (policy): A workspace-affecting contract names whether it changes company-owned instructions, the main-agent persona workspace, a lead-worker persona workspace, an internal-subagent workspace, or the Coding Worker runtime access root; non-workspace changes explicitly record this criterion as not applicable. Evidence: `runtime:evidence/define-change-contract/workspace-scope.json`

### `approve-beta-release-contract` — Approve 0.1.0 Beta Release Contract

- Goal: Bind the fixed owner decision that every stable release-ledger item and reconciled specification member is required for 0.1.0 Beta before architecture and implementation planning.
- Executor instructions: Review the stable release ledger, current development graph, specification manifest, decision catalog, repository specifications, implementation lineage, and every repository-mutating Coding Worker implementation and integration scope. Approve the fixed contract only with fail-closed per-write approval-service enforcement, including the first write that implements or changes approval enforcement itself. Every listed release ID is required for 0.1.0 Beta. Any repository planning-artifact change, scope reduction, lineage mismatch, or approval-service bypass requires a fresh owner decision and graph revision rather than a runtime deferral.
- Inputs: artifact:baseline-context, artifact:change-contract, artifact:affected-domain-map, artifact:release-reconciliation-specification-verification
- Resources: —
- Permissions: read [artifact:baseline-context, artifact:change-contract, artifact:affected-domain-map, docs/getting-started/pre-release-status.md, artifact:release-reconciliation-specification-verification, specification-manifest.json, decisions.json, doc/product-spec.md, doc/constraints-and-risks.md, doc/architecture-spec.md, doc/acceptance-spec.md, doc/open-questions.md, doc/product-spec-workspace.md, doc/architecture-spec-workspace.md, doc/acceptance-spec-workspace.md, doc/open-questions-workspace.md, doc/product-spec-file-access-history.md, doc/architecture-spec-file-access-history.md, doc/acceptance-spec-file-access-history.md, doc/open-questions-file-access-history.md, development-graph.json, doc/implementation-lineage.md]; write [—]; external [—]; destructive `false`
- Execution: max `1` attempt(s), `1440` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `none` — Produces an owner-bound approval of the fixed 0.1.0 Beta contract without mutating project or external state.
- Rollback: none
- Approval required: `false`
- Acceptance:
  - `all-release-items-required` (manual): The owner approval records every stable ID in docs/getting-started/pre-release-status.md as required for 0.1.0 Beta with no deferred or optional branch. Evidence: `runtime:evidence/approve-beta-release-contract/approval.json`
  - `release-ledger-covered` (review): The owner-approved contract covers every stable release ID in docs/getting-started/pre-release-status.md with no deferred or optional branch: REL-PKG-001, REL-PKG-002, REL-ONB-001, REL-OPS-001, REL-RUNTIME-001, TUI-WORK-001, REL-TUI-001, REL-TUI-002, REL-TUI-003, REL-TUI-004, REL-APP-001, REL-WEB-001, REL-DISCORD-001, REL-TG-001, REL-TG-002, REL-SEC-001, REL-CW-001, REL-CW-002, REL-CW-003, REL-CW-004, REL-CW-005, REL-CW-006, REL-CW-007, REL-SCH-001, REL-SCH-002, REL-CAP-001, REL-CAP-002, REL-MCP-001, REL-DOC-001, REL-IMG-001, REL-PROTO-001, REL-PROTO-002, REL-PROTO-003, REL-PROTO-004, REL-REL-001. Evidence: `runtime:evidence/approve-beta-release-contract/coverage.json`
  - `repository-planning-lineage-bound` (policy): The decision binds every repository release ID to the current development graph, specification manifest, decision catalog, repository specifications, and implementation lineage without relying on an external plan directory. Evidence: `runtime:evidence/approve-beta-release-contract/repository-planning-lineage.json`
  - `implementation-mutation-policy-approved` (manual): The owner authorizes every repository-mutating Coding Worker implementation and integration lane only under the project approval service, including the capabilities/security lane's first bootstrap write; each repository write must produce a current path- and mutation-bound decision and fail closed when approval is denied, missing, expired, or mismatched. Evidence: `runtime:evidence/approve-beta-release-contract/workstream-mutation-policy.json`

### `decide-architecture` — Resolve Architecture And Ownership

- Goal: Choose the smallest design that satisfies the change contract while preserving SIM-ONE Alpha domain ownership and Flue architecture.
- Executor instructions: Read local architecture sources before version-matched Flue docs. Record alternatives, evidence, ownership, consequences, and revisit triggers; write an ADR only when material.
- Inputs: artifact:baseline-context, artifact:change-contract, artifact:affected-domain-map, artifact:beta-release-contract
- Resources: architecture-decision:<topic>
- Permissions: read [docs/architecture/, src/, version-matched Flue documentation]; write [docs/adr/]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `60` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Records the reviewed architecture decision in the project ADR area or task plan.
- Rollback: Restore the prior decision record and invalidate downstream work that consumed the superseded decision.
- Approval required: `false`
- Acceptance:
  - `alternatives-recorded` (review): The decision records alternatives, decision criteria, supporting evidence, the selected approach, consequences, and a revisit trigger. Evidence: `runtime:evidence/decide-architecture/decision.json`
  - `ownership-preserved` (policy): The decision keeps app.ts thin, protocols in SQLite through the Protocol Tool, executable capabilities as tools, workflow knowledge as skills, specialists as workers, and registries outside orchestrator logic. Evidence: `runtime:evidence/decide-architecture/ownership-review.json`
  - `research-boundary-preserved` (policy): The researcher owns web/current/source-backed retrieval and neither the orchestrator nor Coding Worker gains a direct web-capable path. Evidence: `runtime:evidence/decide-architecture/research-boundary.json`

### `plan-implementation` — Plan Bounded Implementation

- Goal: Produce the repository-owned executable implementation lineage for every required 0.1.0 member, with exact file ownership, decision boundaries, evidence, approval scopes, and rollback under the development graph.
- Executor instructions: Verify the current graph, manifest, decision catalog, repository specifications, implementation lineage, and release ledger against artifact:baseline-context and artifact:beta-release-contract; stop on any missing, added, or changed planning artifact. Then map the decision to bounded workstreams. Keep shared types and contracts ahead of dependent implementation, name the exact scripts from package.json, classify every workspace-related change by instruction/persona/runtime-root ownership, and assign every changed file and focused test file to exactly one workstream before parallel execution. Update doc/implementation-lineage.md; do not create an external plan.
- Inputs: artifact:change-contract, artifact:architecture-decision, artifact:beta-release-contract, artifact:product-spec, artifact:constraints-and-risks, artifact:architecture-spec, artifact:acceptance-spec, artifact:open-questions, artifact:product-spec-workspace, artifact:architecture-spec-workspace, artifact:acceptance-spec-workspace, artifact:open-questions-workspace, artifact:product-spec-file-access, artifact:architecture-spec-file-access, artifact:acceptance-spec-file-access, artifact:open-questions-file-access, decision:d1-github-auth-strategy, decision:d2-workspace-root-isolation, decision:d3-file-access-gate, artifact:product-spec-runtime-configuration, artifact:architecture-spec-runtime-configuration, artifact:acceptance-spec-runtime-configuration, artifact:open-questions-runtime-configuration, artifact:runtime-configuration-inventory, decision:d5-canonical-runtime-configuration, decision:d6-tui-approval-surface-placement, artifact:task-lifecycle-architecture-spec, decision:d10-sealed-node-context, decision:d11-shared-task-graph-engine, decision:d7-separate-project-and-task-graphs, decision:d8-memory-helper-task-runs, decision:d9-flue-native-task-graph-runtime, artifact:flue-v2-migration-spec, decision:d12-flue-v2-persistence-and-compaction
- Resources: project:implementation-lineage
- Permissions: read [artifact:change-contract, artifact:architecture-decision, artifact:beta-release-contract, decision:d1-github-auth-strategy, docs/getting-started/pre-release-status.md, package.json, .github/workflows/ci.yml, src/AGENTS.md, src/workspace-loader.ts, src/agents/orchestrator.ts, src/engine/workers/, docs/architecture/flue-architecture.md, docs/architecture/gorombo-flue-map.md, src/tests/architecture-contract.test.ts, src/tests/workspace-loader.test.ts, specification-manifest.json, decisions.json, doc/decisions/d1-github-auth-strategy.md, doc/product-spec.md, doc/constraints-and-risks.md, doc/architecture-spec.md, doc/acceptance-spec.md, doc/open-questions.md, doc/product-spec-workspace.md, doc/architecture-spec-workspace.md, doc/acceptance-spec-workspace.md, doc/open-questions-workspace.md, doc/product-spec-file-access-history.md, doc/architecture-spec-file-access-history.md, doc/acceptance-spec-file-access-history.md, doc/open-questions-file-access-history.md, development-graph.json, doc/implementation-lineage.md, doc/product-spec-runtime-configuration.md, doc/architecture-spec-runtime-configuration.md, doc/acceptance-spec-runtime-configuration.md, doc/open-questions-runtime-configuration.md, doc/runtime-configuration-inventory.md, doc/decisions/d5-canonical-runtime-configuration.md, decision:d6-tui-approval-surface-placement, doc/decisions/d6-tui-approval-surface-placement.md, artifact:task-lifecycle-architecture-spec, decision:d10-sealed-node-context, decision:d11-shared-task-graph-engine, decision:d7-separate-project-and-task-graphs, decision:d8-memory-helper-task-runs, decision:d9-flue-native-task-graph-runtime, docs/architecture/flue-v2-migration.md]; write [doc/implementation-lineage.md]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `60` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Updates the repository-owned implementation lineage consumed by the development graph.
- Rollback: Restore the prior implementation-lineage revision and invalidate downstream work that consumed it.
- Approval required: `false`
- Acceptance:
  - `workstreams-bounded` (review): Each workstream has one clear purpose, exact owned source/documentation/test files, declared inputs and outputs, no file concurrently owned by another parallel branch, and no hidden dependency on another branch; collisions are ordered or assigned to integration. Evidence: `runtime:evidence/plan-implementation/workstreams.json`
  - `verification-mapped` (test): The plan maps each acceptance criterion to a focused check and the full applicable project verification matrix. Evidence: `runtime:evidence/plan-implementation/verification-map.json`
  - `progress-events-required` (policy): Every tool execution, worker handoff, plan update, verification result, and state transition has a durable typed progress-event expectation. Evidence: `runtime:evidence/plan-implementation/progress-contract.json`
  - `file-ownership-disjoint` (policy): The file-ownership matrix assigns every planned source, documentation, generated-definition, and focused-test mutation to exactly one producer; shared files are serialized or deferred to integration. Evidence: `runtime:evidence/plan-implementation/file-ownership.json`
  - `workspace-layers-mapped` (review): The plan distinguishes src/AGENTS.md, src/workspace/, built-in lead-worker workspaces, Coding Worker internal-subagent workspaces, runtime-loaded user workers, and the Coding Worker runtime access root whenever those layers are affected. Evidence: `runtime:evidence/plan-implementation/workspace-layers.json`
  - `release-ledger-mapped` (review): The implementation plan and doc/implementation-lineage.md map every stable release ID to one producing member, one behavioral verification path, and one exclusive or serialized file owner. Evidence: `runtime:evidence/plan-implementation/release-ledger-map.json`
  - `repository-planning-lineage-preserved` (policy): Before producing any implementation workstream, the planner verifies current graph, manifest, decision, specification, implementation-lineage, and release-ledger bindings; a mismatch stops planning and requires a fresh baseline and approval. Evidence: `runtime:evidence/plan-implementation/repository-planning-lineage.json`
  - `runtime-configuration-lineage-mapped` (policy): REL-CFG-001 is assigned to one serialized configuration implementation member and one integrated-build verification member; every environment-sensitive downstream member consumes D5 or the consolidated configuration artifact without parallel file ownership. Evidence: `runtime:evidence/plan-implementation/runtime-configuration-lineage.json`
  - `tui-status-approval-lineage-mapped` (policy): REL-TUI-002 and REL-APP-001 use separate serialized members: the status member owns the exact two-row split through messages: N and context remaining, then the approval member consumes that geometry and owns the slash-menu-style drop-up interface. Evidence: `runtime:evidence/plan-implementation/tui-status-approval-lineage.json`
  - `flue-v2-migration-bound` (review): The current Flue 2 migration specification is consumed and its applicable requirements are reflected in this node output. Evidence: `runtime:evidence/plan-implementation/flue-v2-migration.json`

### `implement-core-contracts` — Implement Core Contracts And Architecture

- Goal: Implement authorized changes to shared types, Valibot schemas, protocols, model cards, configuration, architecture contracts, and Flue-discovered entrypoints.
- Executor instructions: Use the Coding Worker lead and only its worker-local internal specialists. Before every repository mutation, call the already active Coding Worker approval service with the exact run, file path, proposed mutation or command, and scope; stop fail-closed on denied, missing, expired, or mismatched approval and record the decision. Emit typed progress events for every handoff, tool call, edit group, and verification result. If the domain is unaffected, produce an evidence-backed no-change record. Follow the implementation plan's exact file-ownership matrix. Stop and replan before editing a file assigned to another parallel workstream; shared or cross-domain files must be serialized or reconciled by the integration node.
- Inputs: artifact:implementation-plan, artifact:beta-release-contract, decision:d10-sealed-node-context, decision:d7-separate-project-and-task-graphs, decision:d8-memory-helper-task-runs, decision:d9-flue-native-task-graph-runtime
- Resources: project:core-contracts
- Permissions: read [artifact:implementation-plan, artifact:beta-release-contract, authorized project files, decision:d10-sealed-node-context, decision:d7-separate-project-and-task-graphs, decision:d8-memory-helper-task-runs, decision:d9-flue-native-task-graph-runtime]; write [src/core/, src/app.ts, src/db.ts, docs/architecture/, flue.config.ts, src/tests/ files assigned exclusively to this workstream by artifact:implementation-plan, src/index.ts]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `180` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes only approval-service-authorized files in the core-contracts workstream.
- Rollback: Restore this workstream's files from the pre-change Git commit while preserving unrelated workstreams.
- Approval required: `true`
- Acceptance:
  - `scope-obeyed` (policy): The patch or no-change record stays inside the authorized domain, contains only files assigned to this workstream by the implementation plan, has no concurrent file owner in another parallel branch, and preserves the architecture decision. Evidence: `runtime:evidence/implement-core-contracts/scope-review.json`
  - `core-contract-mutations-approved` (policy): Every repository write is preceded by a fail-closed Coding Worker approval-service decision bound to the exact run, file path, proposed mutation or command, approval scope, approver, and time; denied, missing, expired, or mismatched approval prevents the write. Evidence: `runtime:evidence/implement-core-contracts/mutation-approvals.json`
  - `focused-verification-recorded` (test): Focused tests for changed behavior pass, or the no-change record proves why no focused test is applicable. Evidence: `runtime:evidence/implement-core-contracts/focused-verification.json`
  - `progress-visible` (artifact): Typed durable progress events cover implementation, internal specialist handoffs, tool execution, and verification. Evidence: `runtime:evidence/implement-core-contracts/progress-events.jsonl`

### `implement-agent-runtime` — Implement Agent Runtime And Workspace Boundaries

- Goal: Implement authorized main-orchestrator, workflow, tool, skill, built-in lead-worker, worker-local internal-subagent, and persona-workspace changes while preventing ephemeral Flue sandbox storage from being represented as durable product storage and preserving delegation ownership and capability isolation. Add a canonical RunPod OpenAI-compatible chat provider and model card without changing the shipped primary model.
- Executor instructions: Use the Coding Worker lead and only its worker-local internal specialists. Before every repository mutation, call the already active Coding Worker approval service with the exact run, file path, proposed mutation or command, and scope; stop fail-closed on denied, missing, expired, or mismatched approval and record the decision. Treat src/AGENTS.md as company-owned system instructions; src/workspace/ as the main-agent persona source; <runtime-root>/sim-one-alpha/workspace as the packaged persona copy; <runtime-root>/workspace as the persistent Coding Worker access root; src/engine/workers/<name>/workspace/ as built-in lead-worker persona guidance; and src/engine/workers/coding-worker/subagents/<name>/workspace/ as Coding Worker internal-subagent guidance. Do not expose the main orchestrator to Flue's generic virtual-sandbox file or shell tools. Route durable file, repository, generated-project, and handoff work to the Coding Worker, and route runtime capability lifecycle work to capability-manager. Runtime-loaded user workers remain capability profiles rather than built-in workspace directories. The orchestrator owns worker routing and exposes only lead workers; lead workers own internal-subagent selection. Emit typed progress events for every handoff, tool call, edit group, and verification result. If the domain is unaffected, produce an evidence-backed no-change record. Follow the implementation plan's exact file-ownership matrix and stop for replan before any parallel file collision.
- Inputs: artifact:implementation-plan, artifact:beta-release-contract, decision:d5-canonical-runtime-configuration, decision:d10-sealed-node-context, decision:d11-shared-task-graph-engine, decision:d7-separate-project-and-task-graphs, decision:d8-memory-helper-task-runs, decision:d9-flue-native-task-graph-runtime
- Resources: project:agent-runtime
- Permissions: read [artifact:implementation-plan, authorized project files, src/AGENTS.md, src/workspace-loader.ts, docs/architecture/flue-architecture.md, docs/architecture/gorombo-flue-map.md, docs/architecture/worker-system.md, docs/reference/configuration.md, openwiki/architecture/runtime.md, openwiki/workflows/product-and-agent-workflows.md, src/tests/architecture-contract.test.ts, src/tests/workspace-loader.test.ts, src/tests/coding-worker.test.ts, src/tests/coding-worker-internal-subagents.test.ts, src/tests/research-agent.test.ts, decision:d2-workspace-root-isolation, doc/decisions/d2-workspace-root-isolation.md, decision:d5-canonical-runtime-configuration, doc/decisions/d5-canonical-runtime-configuration.md, flue-docs:guide/sandboxes, decision:d10-sealed-node-context, decision:d11-shared-task-graph-engine, decision:d7-separate-project-and-task-graphs, decision:d8-memory-helper-task-runs, decision:d9-flue-native-task-graph-runtime, flue-docs:api/provider-api, flue-docs:guide/models, https://docs.runpod.io/public-endpoints/models/moonshot-kimi]; write [src/agents/, src/workflows/, src/workspace/, src/engine/tools/, src/skills/, src/engine/workers/, src/tests/ files assigned exclusively to this workstream by artifact:implementation-plan, scripts/ focused product verification assigned exclusively to this workstream, docs/ and openwiki/ files assigned exclusively to this workstream, src/workspace-loader.ts, src/core/models/, src/core/config/runtime-environment.ts, sim-one.config.example, src/tests/models.test.ts, src/tests/runtime-environment.test.ts]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `180` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes only approval-service-authorized files in the agent-runtime workstream.
- Rollback: Restore this workstream's files from the pre-change Git commit while preserving unrelated workstreams and the persistent runtime workspace.
- Approval required: `true`
- Acceptance:
  - `scope-obeyed` (policy): The patch or no-change record stays inside the authorized domain, contains only files assigned to this workstream by the implementation plan, has no concurrent file owner in another parallel branch, and preserves the architecture decision. Evidence: `runtime:evidence/implement-agent-runtime/scope-review.json`
  - `agent-runtime-mutations-approved` (policy): Every repository write is preceded by a fail-closed Coding Worker approval-service decision bound to the exact run, file path, proposed mutation or command, approval scope, approver, and time; denied, missing, expired, or mismatched approval prevents the write. Evidence: `runtime:evidence/implement-agent-runtime/mutation-approvals.json`
  - `focused-verification-recorded` (test): Focused tests for changed behavior pass, or the no-change record proves why no focused test is applicable. Evidence: `runtime:evidence/implement-agent-runtime/focused-verification.json`
  - `progress-visible` (artifact): Typed durable progress events cover implementation, internal specialist handoffs, tool execution, and verification. Evidence: `runtime:evidence/implement-agent-runtime/progress-events.jsonl`
  - `persona-workspace-ownership-preserved` (policy): Company instructions remain in src/AGENTS.md; the orchestrator composes only src/workspace/ as its persona; each built-in lead worker composes its own src/engine/workers/<name>/workspace/; Coding Worker internal subagents compose only their worker-local workspace; and persona content does not rename architecture paths. Evidence: `runtime:evidence/implement-agent-runtime/workspace-ownership.json`
  - `runtime-root-separated` (policy): The Coding Worker runtime access root and project/repository scope are treated as sandbox authorization boundaries, not as worker persona-instruction ownership; approval and managed-auth state remain outside that root. Evidence: `runtime:evidence/implement-agent-runtime/runtime-root-boundary.json`
  - `delegation-boundary-preserved` (test): The main orchestrator exposes built-in lead workers but no Coding Worker internal subagent; each profile receives only its declared instructions, tools, skills, and subagents under Flue inheritance rules. Evidence: `runtime:evidence/implement-agent-runtime/delegation-boundary.json`
  - `company-instructions-human-gated` (policy): src/AGENTS.md remains read-only in this ordinary Coding Worker workstream. Any authorized change to company-owned system instructions uses a separately scoped lifecycle with an explicit owner human gate before implementation. Evidence: `runtime:evidence/implement-agent-runtime/company-instruction-gate.json`
  - `canonical-config-consumers` (test): Agent, workflow, provider, tool, skill, worker, memory, and RAG initialization consumes the canonical loaded configuration and does not independently search for production .env files. Evidence: `runtime:evidence/implement-agent-runtime/canonical-config-consumers.json`
  - `orchestrator-scratch-tools-removed` (test): The main orchestrator replaces Flue's default virtual-sandbox tool surface with an explicit adapter that exposes no generic model-facing bash, read, write, edit, or filesystem mutation tools while retaining Flue task delegation, packaged-skill activation, and declared typed application tools. Evidence: `runtime:evidence/implement-agent-runtime/orchestrator-tool-surface.json`
  - `durable-work-delegated` (policy): Every durable file, repository, generated-project, and handoff request is delegated to the Coding Worker and resolved below <runtime-root>/workspace; capability installation, activation, update, and removal requests are delegated to capability-manager. Evidence: `runtime:evidence/implement-agent-runtime/durable-routing-contract.json`
  - `persistent-workspace-product-proof` (test): Product verification writes a probe through the Coding Worker workspace, reads the same bytes from the host, reopens the workspace after a runtime restart, repeats under a relocated .gorombo root, and proves that neither src/workspace nor <runtime-root>/sim-one-alpha/workspace receives runtime project writes. Evidence: `runtime:evidence/implement-agent-runtime/persistent-workspace-product-test.json`
  - `workspace-guidance-correct` (review): Main-agent and Coding Worker TOOLS.md guidance distinguish persona source, packaged persona workspace, persistent Coding Worker workspace, and Flue virtual scratch storage and prohibit success claims without host-visible persistence evidence. Evidence: `runtime:evidence/implement-agent-runtime/workspace-guidance.json`
  - `runpod-chat-provider-contract` (test): A RunPod Kimi K2.6 model card and Flue custom provider use the canonical RUNPOD_API_KEY with a dedicated chat base URL, preserve MiniMax M3 as the shipped primary, and expose a test-scoped selector for live CI without introducing automatic production failover. Evidence: `runtime:evidence/implement-agent-runtime/runpod-chat-provider.json`

### `implement-memory-retrieval` — Implement Memory, RAG, And Embeddings

- Goal: Implement authorized structured memory, session memory, document indexing, knowledge storage, retrieval routing, embeddings, and Rust/WASM changes while keeping memory layers distinct.
- Executor instructions: Use the Coding Worker lead and only its worker-local internal specialists. Before every repository mutation, call the already active Coding Worker approval service with the exact run, file path, proposed mutation or command, and scope; stop fail-closed on denied, missing, expired, or mismatched approval and record the decision. Emit typed progress events for every handoff, tool call, edit group, and verification result. If the domain is unaffected, produce an evidence-backed no-change record. Follow the implementation plan's exact file-ownership matrix. Stop and replan before editing a file assigned to another parallel workstream; shared or cross-domain files must be serialized or reconciled by the integration node.
- Inputs: artifact:implementation-plan, artifact:beta-release-contract, decision:d10-sealed-node-context, decision:d8-memory-helper-task-runs
- Resources: project:memory-retrieval
- Permissions: read [artifact:implementation-plan, artifact:beta-release-contract, authorized project files, decision:d10-sealed-node-context, decision:d8-memory-helper-task-runs]; write [src/engine/memory/, src/engine/rag/, src/engine/embeddings/, crates/gorombo-memory/, src/tests/ files assigned exclusively to this workstream by artifact:implementation-plan]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `180` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes only approval-service-authorized files in the memory-retrieval workstream.
- Rollback: Restore this workstream's files from the pre-change Git commit while preserving unrelated workstreams.
- Approval required: `true`
- Acceptance:
  - `scope-obeyed` (policy): The patch or no-change record stays inside the authorized domain, contains only files assigned to this workstream by the implementation plan, has no concurrent file owner in another parallel branch, and preserves the architecture decision. Evidence: `runtime:evidence/implement-memory-retrieval/scope-review.json`
  - `memory-retrieval-mutations-approved` (policy): Every repository write is preceded by a fail-closed Coding Worker approval-service decision bound to the exact run, file path, proposed mutation or command, approval scope, approver, and time; denied, missing, expired, or mismatched approval prevents the write. Evidence: `runtime:evidence/implement-memory-retrieval/mutation-approvals.json`
  - `focused-verification-recorded` (test): Focused tests for changed behavior pass, or the no-change record proves why no focused test is applicable. Evidence: `runtime:evidence/implement-memory-retrieval/focused-verification.json`
  - `progress-visible` (artifact): Typed durable progress events cover implementation, internal specialist handoffs, tool execution, and verification. Evidence: `runtime:evidence/implement-memory-retrieval/progress-events.jsonl`

### `implement-capabilities-security` — Implement Capabilities, Registries, And Security

- Goal: Implement authorized capability-store, registry, MCP, approval, GitHub-auth, and policy enforcement changes with fail-closed trust boundaries.
- Executor instructions: Use the Coding Worker lead and only its worker-local internal specialists. Before the capabilities/security lane's first bootstrap write and every later repository mutation, call the already active Coding Worker approval service with the exact run, file path, proposed mutation or command, and scope; never rely on approval code this lane is about to implement, and stop fail-closed on denied, missing, expired, or mismatched approval. Record every decision. Emit typed progress events for every handoff, tool call, edit group, and verification result. If the domain is unaffected, produce an evidence-backed no-change record. Follow the implementation plan's exact file-ownership matrix. Stop and replan before editing a file assigned to another parallel workstream; shared or cross-domain files must be serialized or reconciled by the integration node.
- Inputs: artifact:implementation-plan, artifact:beta-release-contract, decision:d5-canonical-runtime-configuration, decision:d10-sealed-node-context
- Resources: project:capabilities-security
- Permissions: read [artifact:implementation-plan, authorized project files, decision:d5-canonical-runtime-configuration, doc/decisions/d5-canonical-runtime-configuration.md, decision:d10-sealed-node-context]; write [src/engine/capabilities/, src/engine/registries/, src/engine/approvals/, src/api/ingress/, docs/architecture/github-auth-system.md, src/tests/ files assigned exclusively to this workstream by artifact:implementation-plan]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `180` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes only approval-service-authorized files in the capabilities/security workstream, including the first bootstrap mutation.
- Rollback: Restore this workstream's files from the pre-change Git commit while preserving unrelated workstreams.
- Approval required: `true`
- Acceptance:
  - `scope-obeyed` (policy): The patch or no-change record stays inside the authorized domain, contains only files assigned to this workstream by the implementation plan, has no concurrent file owner in another parallel branch, and preserves the architecture decision. Evidence: `runtime:evidence/implement-capabilities-security/scope-review.json`
  - `capabilities-security-bootstrap-mutations-approved` (policy): Before the first bootstrap write and every later repository mutation, an already active fail-closed Coding Worker approval-service path records a decision bound to the exact run, file path, proposed mutation or command, approval scope, approver, and time; the lane must not rely on the approval code it is about to implement. Evidence: `runtime:evidence/implement-capabilities-security/mutation-approvals.json`
  - `focused-verification-recorded` (test): Focused tests for changed behavior pass, or the no-change record proves why no focused test is applicable. Evidence: `runtime:evidence/implement-capabilities-security/focused-verification.json`
  - `progress-visible` (artifact): Typed durable progress events cover implementation, internal specialist handoffs, tool execution, and verification. Evidence: `runtime:evidence/implement-capabilities-security/progress-events.jsonl`
  - `rel-cap-001-version-pinning` (test): REL-CAP-001: capability materialization resolves and records an exact requested branch, tag, or commit instead of shallow-cloning the remote default branch. Evidence: `runtime:evidence/implement-capabilities-security/rel-cap-001-version-pinning.json`
  - `rel-mcp-001-in-place-update` (test): REL-MCP-001: mcp update changes validated connection, name, and description fields in place while preserving identity, audit data, and secret handling. Evidence: `runtime:evidence/implement-capabilities-security/rel-mcp-001-in-place-update.json`
  - `canonical-config-security` (policy): Capability, registry, MCP token-slot, approval, and Coding Worker configuration access preserves D5 validation, redaction, and fail-closed secret boundaries. Evidence: `runtime:evidence/implement-capabilities-security/canonical-config-security.json`

### `implement-ingress-operations` — Implement Ingress, Sessions, Schedules, And Telemetry

- Goal: Implement authorized connector normalization, authenticated API routes, connector-specific session policy, fresh and explicit-resume TUI lifecycle, durable transcript projection, schedules, and typed progress/telemetry surfaces.
- Executor instructions: Use the Coding Worker lead and only its worker-local internal specialists. Before every repository mutation, call the already active Coding Worker approval service with the exact run, file path, proposed mutation or command, and scope; stop fail-closed on denied, missing, expired, or mismatched approval and record the decision. Emit typed progress events for every handoff, tool call, edit group, and verification result. If the domain is unaffected, produce an evidence-backed no-change record. Follow the implementation plan's exact file-ownership matrix. Stop and replan before editing a file assigned to another parallel workstream; shared or cross-domain files must be serialized or reconciled by the integration node.
- Inputs: artifact:implementation-plan, artifact:beta-release-contract, decision:d5-canonical-runtime-configuration, decision:d10-sealed-node-context, decision:d11-shared-task-graph-engine, decision:d7-separate-project-and-task-graphs, decision:d9-flue-native-task-graph-runtime
- Resources: project:ingress-operations
- Permissions: read [artifact:implementation-plan, authorized project files, decision:d5-canonical-runtime-configuration, doc/decisions/d5-canonical-runtime-configuration.md, decision:d10-sealed-node-context, decision:d11-shared-task-graph-engine, decision:d7-separate-project-and-task-graphs, decision:d9-flue-native-task-graph-runtime]; write [src/api/, src/channels/, src/engine/session/, src/engine/schedules/, src/core/telemetry/, docs/operations/ files assigned exclusively to this workstream by artifact:implementation-plan, docs/architecture/tui-cli-session-flow.md when assigned exclusively to this workstream by artifact:implementation-plan, src/tests/ files assigned exclusively to this workstream by artifact:implementation-plan]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `180` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes only approval-service-authorized files in the ingress/operations workstream.
- Rollback: Restore this workstream's files from the pre-change Git commit while preserving unrelated workstreams.
- Approval required: `true`
- Acceptance:
  - `scope-obeyed` (policy): The patch or no-change record stays inside the authorized domain, contains only files assigned to this workstream by the implementation plan, has no concurrent file owner in another parallel branch, and preserves the architecture decision. Evidence: `runtime:evidence/implement-ingress-operations/scope-review.json`
  - `ingress-operations-mutations-approved` (policy): Every repository write is preceded by a fail-closed Coding Worker approval-service decision bound to the exact run, file path, proposed mutation or command, approval scope, approver, and time; denied, missing, expired, or mismatched approval prevents the write. Evidence: `runtime:evidence/implement-ingress-operations/mutation-approvals.json`
  - `focused-verification-recorded` (test): Focused tests for changed behavior pass, or the no-change record proves why no focused test is applicable. Evidence: `runtime:evidence/implement-ingress-operations/focused-verification.json`
  - `progress-visible` (artifact): Typed durable progress events cover implementation, internal specialist handoffs, tool execution, and verification. Evidence: `runtime:evidence/implement-ingress-operations/progress-events.jsonl`
  - `rel-tg-001-pairing-delivery` (test): REL-TG-001: an unknown Telegram user creates a durable pending pairing request and receives the intended connector response without bypassing approval. Evidence: `runtime:evidence/implement-ingress-operations/rel-tg-001-pairing.json`
  - `rel-tg-002-disabled-policy` (test): REL-TG-002: Telegram disabled-policy semantics distinguish direct-message policy from group-message policy and enforce the documented scope. Evidence: `runtime:evidence/implement-ingress-operations/rel-tg-002-disabled-policy.json`
  - `rel-sec-001-rate-limiting` (test): REL-SEC-001: authenticated gateway ingress applies bounded request throttling with actor-aware keys, observable rejection evidence, and tests for bypass and reset behavior. Evidence: `runtime:evidence/implement-ingress-operations/rel-sec-001-rate-limiting.json`
  - `rel-sch-001-context-handoff` (test): REL-SCH-001: scheduled dispatch persists and passes the trusted event id required by protocol and scoped-memory retrieval through the orchestrator handoff. Evidence: `runtime:evidence/implement-ingress-operations/rel-sch-001-context-handoff.json`
  - `rel-sch-002-result-delivery` (test): REL-SCH-002: scheduled results persist durable content and deliver through the selected connector with idempotent retry and terminal failure evidence. Evidence: `runtime:evidence/implement-ingress-operations/rel-sch-002-result-delivery.json`
  - `rel-discord-001-resolved` (policy): REL-DISCORD-001: the Discord connector normalizes authenticated events, uses connector-owned session policy, and delivers responses through the gateway. Evidence: `runtime:evidence/implement-ingress-operations/rel-discord-001.json`
  - `canonical-config-ingress` (test): Gateway, Telegram, schedules, and operational services consume typed canonical configuration after bootstrap and report missing values without exposing secrets. Evidence: `runtime:evidence/implement-ingress-operations/canonical-config-ingress.json`

### `implement-sim-one-tui-work-pane` — Implement SIM-ONE TUI Work Pane

- Goal: Implement the responsive SIM-ONE TUI work pane for tasks, usage and cost, Git state, and runtime status without regressing transcript or prompt interaction.
- Executor instructions: Follow the SIM-ONE TUI work-pane graph contract, repository specifications, release ledger, and artifact:implementation-plan using SIM-ONE TUI product terminology. Before every repository mutation, call the Coding Worker approval service with the exact run, file path, proposed mutation or command, and scope; stop fail-closed on denied, missing, expired, or mismatched approval and record the decision. Keep transcript, prompt, and work-pane viewport state independent. Assign every Rust, WASM, TypeScript, documentation, and focused-test file to this member or serialize it through product integration before editing.
- Inputs: artifact:implementation-plan, artifact:beta-release-contract, artifact:connector-approval-controls-change, decision:d11-shared-task-graph-engine, decision:d8-memory-helper-task-runs
- Resources: project:sim-one-tui-work-pane
- Permissions: read [artifact:implementation-plan, artifact:beta-release-contract, docs/architecture/tui-cli-session-flow.md, docs/operations/product-tui.md, docs/tui/, tui/ratatui/, crates/, doc/implementation-lineage.md, docs/getting-started/pre-release-status.md, decision:d11-shared-task-graph-engine, decision:d8-memory-helper-task-runs]; write [tui/ratatui/ files assigned exclusively to this member by artifact:implementation-plan, Rust/WASM helper files assigned exclusively to this member by artifact:implementation-plan, focused test files assigned exclusively to this member by artifact:implementation-plan]; external [—]; destructive `false`
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
- Executor instructions: Use the current runtime-root, onboarding, configuration, packaging, and acceptance specifications plus artifact:implementation-plan as the implementation authority. Before every repository mutation, call the Coding Worker approval service with the exact run, file path, proposed mutation or command, and scope; stop fail-closed on denied, missing, expired, or mismatched approval and record the decision. Keep install and service probes isolated from host production services.
- Inputs: artifact:implementation-plan, artifact:beta-release-contract, artifact:runtime-root-layout-change, decision:d5-canonical-runtime-configuration, artifact:runtime-configuration-consolidation-change
- Resources: project:sim-one-onboarding-distribution
- Permissions: read [artifact:implementation-plan, artifact:beta-release-contract, sim-one-cli/, scripts/, package.json, docs/getting-started/, docs/operations/, doc/implementation-lineage.md, docs/getting-started/pre-release-status.md, doc/product-spec-workspace.md, doc/architecture-spec-workspace.md, doc/acceptance-spec-workspace.md, decision:d5-canonical-runtime-configuration, doc/decisions/d5-canonical-runtime-configuration.md, artifact:runtime-configuration-consolidation-change]; write [sim-one-cli/ files assigned exclusively to this member by artifact:implementation-plan, release packaging and service files assigned exclusively to this member by artifact:implementation-plan, focused test files assigned exclusively to this member by artifact:implementation-plan]; external [—]; destructive `false`
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
  - `rel-cfg-001-onboarding` (test): REL-CFG-001: onboarding creates or updates owner-only sim-one.config from sim-one.config.example through typed validation, while source builds and public packages preserve the D5 copy/exclusion boundary. Evidence: `runtime:evidence/implement-sim-one-onboarding-distribution/rel-cfg-001-onboarding.json`

### `implement-product-delivery` — Implement Product Surfaces And Delivery

- Goal: Integrate authorized SIM-ONE product surfaces, shared build and CI contracts, Web UI scope, and release documentation after the TUI and onboarding workstreams while preserving capability-management subcommands.
- Executor instructions: Use the Coding Worker lead and only its worker-local internal specialists. Before every repository mutation, call the already active Coding Worker approval service with the exact run, file path, proposed mutation or command, and scope; stop fail-closed on denied, missing, expired, or mismatched approval and record the decision. Emit typed progress events for every handoff, tool call, edit group, and verification result. If the domain is unaffected, produce an evidence-backed no-change record. Follow the implementation plan's exact file-ownership matrix. Stop and replan before editing a file assigned to another parallel workstream; shared or cross-domain files must be serialized or reconciled by the integration node.
- Inputs: artifact:implementation-plan, artifact:beta-release-contract, artifact:sim-one-tui-work-pane-change, artifact:sim-one-onboarding-distribution-change, decision:d5-canonical-runtime-configuration, artifact:runtime-configuration-consolidation-change
- Resources: project:product-delivery
- Permissions: read [artifact:implementation-plan, artifact:beta-release-contract, artifact:sim-one-tui-work-pane-change, artifact:sim-one-onboarding-distribution-change, authorized project files, decision:d5-canonical-runtime-configuration, doc/decisions/d5-canonical-runtime-configuration.md, artifact:runtime-configuration-consolidation-change]; write [shared product integration files assigned exclusively to this serialized member by artifact:implementation-plan, .github/workflows/, docs/architecture/product-flow.md, docs/architecture/tui-cli-session-flow.md when assigned exclusively to this workstream by artifact:implementation-plan, docs/operations/product-tui.md, docs/tui/, README.md, src/tests/ files assigned exclusively to this workstream by artifact:implementation-plan, package.json documentation-check script when assigned exclusively to this workstream by artifact:implementation-plan, scripts/check-documentation.py, AUTHORS.md, CHANGELOG.md, CODE_OF_CONDUCT.md, CONTRIBUTING.md, LICENSE, SECURITY.md, SUPPORT.md, THIRD_PARTY_NOTICES.md, docs/README.md, docs/getting-started/, docs/guides/, docs/reference/, docs/operations/telegram-connector.md, docs/operations/troubleshooting.md, docs/archive/readme-before-release-rewrite.md, docs/superpowers/plans/ documentation link maintenance when assigned exclusively to this workstream by artifact:implementation-plan, openwiki/, sim-one.config.example, scripts/test-ratatui-product.mjs, scripts/test-tui-e2e.mjs, scripts/runtime-configuration-files.test.mjs, src/core/config/runtime-environment.ts, src/core/models/, src/tests/models.test.ts, src/tests/runtime-environment.test.ts]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `180` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes only approval-service-authorized files in the serialized product-delivery workstream.
- Rollback: Restore this workstream's files from the pre-change Git commit while preserving unrelated workstreams.
- Approval required: `true`
- Acceptance:
  - `scope-obeyed` (policy): The patch or no-change record stays inside the authorized domain, contains only files assigned to this workstream by the implementation plan, has no concurrent file owner in another parallel branch, and preserves the architecture decision. Evidence: `runtime:evidence/implement-product-delivery/scope-review.json`
  - `product-delivery-mutations-approved` (policy): Every repository write is preceded by a fail-closed Coding Worker approval-service decision bound to the exact run, file path, proposed mutation or command, approval scope, approver, and time; denied, missing, expired, or mismatched approval prevents the write. Evidence: `runtime:evidence/implement-product-delivery/mutation-approvals.json`
  - `focused-verification-recorded` (test): Focused tests for changed behavior pass, or the no-change record proves why no focused test is applicable. Evidence: `runtime:evidence/implement-product-delivery/focused-verification.json`
  - `progress-visible` (artifact): Typed durable progress events cover implementation, internal specialist handoffs, tool execution, and verification. Evidence: `runtime:evidence/implement-product-delivery/progress-events.jsonl`
  - `product-workstreams-integrated` (review): The product integration consumes the required SIM-ONE TUI work-pane and onboarding/distribution outputs, preserves the sim-one capability command families, and resolves every shared-file owner before mutation. Evidence: `runtime:evidence/implement-product-delivery/product-workstream-integration.json`
  - `rel-web-001-resolved` (policy): REL-WEB-001: the Web UI uses the authenticated gateway, connector-owned session policy, durable progress, and packaged configuration. Evidence: `runtime:evidence/implement-product-delivery/rel-web-001.json`
  - `release-ledger-current` (review): docs/getting-started/pre-release-status.md retains every stable release ID, current implementation status, graph owner, and approved scope after product integration. Evidence: `runtime:evidence/implement-product-delivery/release-ledger.json`
  - `canonical-configuration-documentation` (review): Product documentation, CLI/TUI behavior, CI, and release metadata consistently name the D5 canonical files, supported key registry, migration behavior, and secret boundary without documenting scattered production .env sources. Evidence: `runtime:evidence/implement-product-delivery/canonical-configuration-documentation.json`
  - `runpod-live-ci-selection` (test): Trusted CI maps the repository secret RUN_POD_API_KEY to canonical runtime RUNPOD_API_KEY, selects the RunPod card only inside live-model smoke processes, and leaves the shipped gorombo.config.json primary on MiniMax M3. Evidence: `runtime:evidence/implement-product-delivery/runpod-live-ci-selection.json`

### `integrate-and-repair` — Integrate Change And Apply Bounded Repairs

- Goal: Combine selected domain outputs into one coherent change set, resolve cross-domain contract issues, and apply bounded repairs from verification or observation evidence.
- Executor instructions: Integrate only authorized outputs. Before every integration or repair mutation, call the already active Coding Worker approval service with the exact run, failed evidence, file path, proposed mutation or command, and scope; stop fail-closed on denied, missing, expired, or mismatched approval and record the decision. Preserve unrelated verified branches, route failures to the owning domain, and emit a complete diff plus typed progress record. Reconcile the implementation plan's exact file-ownership matrix before combining changes; a file with multiple parallel producers is a failed integration precondition, not an automatic merge.
- Inputs: artifact:beta-release-contract, artifact:core-contracts-change, artifact:agent-runtime-change, artifact:memory-retrieval-change, artifact:capabilities-security-change, artifact:ingress-operations-change, artifact:product-delivery-change, artifact:dependency-environment, artifact:embedding-model-assets, artifact:memory-wasm, artifact:typecheck-report, artifact:unit-test-report, artifact:documentation-verification-report, artifact:rust-test-report, artifact:runtime-build, artifact:sim-one-tui-build, artifact:sim-one-tui-product-report, artifact:onboarding-distribution-report, artifact:release-package, artifact:cli-build, artifact:cli-behavior-report, artifact:http-test-report, artifact:tui-e2e-report, artifact:memory-smoke-report, artifact:verification-summary, artifact:architecture-security-review, artifact:canary-behavior-report, artifact:production-observation, artifact:coding-worker-progress-change, artifact:coding-worker-github-flow-change, artifact:coding-worker-scaffold-tooling-change, artifact:orchestrator-worker-verification-change, artifact:image-reasoning-worker-change, artifact:document-index-change, artifact:protocol-scoring-change, artifact:runtime-configuration-consolidation-change, artifact:capability-management-worker-change, artifact:coding-worker-capability-authoring-change, decision:d11-shared-task-graph-engine, decision:d9-flue-native-task-graph-runtime, artifact:task-lifecycle-architecture-spec, decision:d7-separate-project-and-task-graphs, decision:d8-memory-helper-task-runs, decision:d10-sealed-node-context, artifact:flue-v2-migration-spec
- Resources: project:core-contracts, project:agent-runtime, project:memory-retrieval, project:capabilities-security, project:ingress-operations, project:product-delivery
- Permissions: read [artifact:beta-release-contract, authorized project tree, domain change artifacts, verification evidence, artifact:runtime-configuration-consolidation-change, decision:d11-shared-task-graph-engine, decision:d9-flue-native-task-graph-runtime, artifact:task-lifecycle-architecture-spec, docs/architecture/task-lifecycle-graphs.md, decision:d7-separate-project-and-task-graphs, doc/decisions/d7-separate-project-and-task-graphs.md, decision:d8-memory-helper-task-runs, doc/decisions/d8-memory-helper-task-runs.md, doc/decisions/d9-flue-native-task-graph-runtime.md, decision:d10-sealed-node-context, doc/decisions/d10-sealed-node-context.md, doc/decisions/d11-shared-task-graph-engine.md, docs/architecture/flue-v2-migration.md]; write [authorized project files across affected domains, excluding src/AGENTS.md]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `180` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Integrates and repairs only approval-service-authorized project files in the isolated worktree.
- Rollback: Restore the affected files from the pre-integration Git commit while preserving unrelated branches and evidence.
- Approval required: `true`
- Acceptance:
  - `diff-authorized` (policy): The integrated Git diff contains only authorized files and no dependency-approval, generated-asset, secret, or unrelated worktree fallout. Evidence: `runtime:evidence/integrate-and-repair/diff-scope.json`
  - `integration-repair-mutations-approved` (policy): Every integration or repair write is preceded by a fail-closed Coding Worker approval-service decision bound to the exact run, failed evidence, file path, proposed mutation or command, approval scope, approver, and time; denied, missing, expired, or mismatched approval prevents the write. Evidence: `runtime:evidence/integrate-and-repair/mutation-approvals.json`
  - `contracts-consistent` (schema): Shared types, schemas, registries, handoff contracts, docs, and consumers agree across every changed domain. Evidence: `runtime:evidence/integrate-and-repair/contract-check.json`
  - `repair-bounded` (policy): Each repair cites the failed evidence, preserves unrelated verified work, and remains within the declared feedback and attempt bounds. Evidence: `runtime:evidence/integrate-and-repair/repair-ledger.json`
  - `post-merge-repair-republication-required` (policy): A repair caused by post-merge package or onboarding evidence records the superseded merged candidate and cannot return to post-merge verification until the repaired integrated diff completes fresh pre-merge verification, architecture review, owner approval, non-draft pull request checks, merge, and main-branch readback as a new artifact:release-candidate. Evidence: `runtime:evidence/integrate-and-repair/post-merge-republication.json`
  - `parallel-file-ownership-reconciled` (policy): Every changed file has one recorded producer; shared or cross-domain files were serialized or assigned to integration, and no parallel branch silently overwrote another branch. Evidence: `runtime:evidence/integrate-and-repair/file-ownership.json`
  - `company-instruction-exclusion-preserved` (policy): Integration and repair never writes src/AGENTS.md. Any company-owned system-instruction change remains outside this ordinary lifecycle and requires a separately scoped owner-approved gate. Evidence: `runtime:evidence/integrate-and-repair/company-instruction-exclusion.json`
  - `flue-v2-migration-bound` (review): The current Flue 2 migration specification is consumed and its applicable requirements are reflected in this node output. Evidence: `runtime:evidence/integrate-and-repair/flue-v2-migration.json`

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
- Permissions: read [authorized project tree, node_modules/, src/tests/architecture-contract.test.ts, src/tests/workspace-loader.test.ts, src/tests/coding-worker.test.ts, src/tests/coding-worker-internal-subagents.test.ts, src/tests/research-agent.test.ts, src/tests/approval-ingress.test.ts, src/tests/flue-session-store.test.ts, src/tests/memory-tool.test.ts, src/tests/memory-telemetry.test.ts, src/tests/trusted-event-admission.test.ts, src/tests/flue-telemetry.test.ts, src/tests/http-endpoints.test.ts, src/tests/session-routing.test.ts, src/tests/session-transcript.test.ts, src/tests/build-script-regressions.test.ts, scripts/product-artifact-lock.test.mjs]; write [.tmp/tsc/, .gorombo test runtime state, external:tmp/sim-one-unit-test-roots]; external [—]; destructive `false`
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
- Executor instructions: Bind the exact packaging argv and output paths introduced by artifact:implementation-plan before execution. Prove the immutable merged main-branch commit recorded by artifact:release-candidate contains the exact latest artifact:integrated-change. If package feedback produced a repair, require a newer release-candidate generation with fresh verification, architecture review, owner approval, non-draft pull request checks, merge, and main readback; refuse the superseded candidate. Check out only the current immutable candidate, rebuild the runtime, SIM-ONE TUI, and CLI using the verified build contracts, create sim-one.sh and the versioned archive, generate the checksum manifest from final bytes, and record candidate commit, tree digest, paths, sizes, modes, and SHA-256 digests. Refuse a worktree or build output not provably bound to that commit, plus undeclared files, mutable runtime state, configuration, databases, and secrets.
- Inputs: artifact:implementation-plan, artifact:integrated-change, artifact:release-candidate, artifact:runtime-build, artifact:sim-one-tui-build, artifact:cli-build, artifact:beta-release-contract, decision:d5-canonical-runtime-configuration, artifact:runtime-configuration-consolidation-report
- Resources: project:release-package-output
- Permissions: read [artifact:implementation-plan, artifact:integrated-change, artifact:release-candidate, artifact:runtime-build, artifact:sim-one-tui-build, artifact:cli-build, artifact:beta-release-contract, release packaging files assigned exclusively by artifact:implementation-plan, decision:d5-canonical-runtime-configuration, doc/decisions/d5-canonical-runtime-configuration.md, artifact:runtime-configuration-consolidation-report]; write [release-package staging files assigned exclusively by artifact:implementation-plan]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `30` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Writes only generated release-package staging files and checksum evidence.
- Rollback: Remove the generated staging files and rebuild the package from the same reviewed commit and typed build artifacts.
- Approval required: `false`
- Acceptance:
  - `release-package-assembled` (artifact): The exact versioned release-candidate archive is rebuilt from the immutable merged main-branch commit and contains the reviewed runtime, SIM-ONE TUI, sim-one command, sim-one.sh entrypoint, service assets, and required metadata without user data, runtime databases, local configuration, or secrets. Evidence: `runtime:evidence/build-release-package/archive.json`
  - `release-package-checksums-bound` (policy): The checksum manifest covers every distributed archive and installer byte, binds their SHA-256 digests to the exact merged main-branch candidate commit, tree digest, and version, and is recorded together with archive paths, sizes, executable modes, and platform scope. Evidence: `runtime:evidence/build-release-package/checksums.json`
  - `post-merge-repair-candidate-republished` (policy): The merged release-candidate tree contains the exact latest artifact:integrated-change. After any package-feedback repair, the candidate record must have a newer generation, fresh owner approval, a new checked and merged pull request, and main-branch readback; rebuilding the superseded commit is forbidden. Evidence: `runtime:evidence/build-release-package/repair-candidate-lineage.json`
  - `release-package-configuration-boundary` (artifact): The release archive includes sim-one.config.example and excludes sim-one.config, every .env file, secret value, and owner-specific configuration while retaining executable permissions and documented runtime placement. Evidence: `runtime:evidence/build-release-package/configuration-boundary.json`

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
- Permissions: read [authorized project tree, node_modules/]; write [.gorombo test runtime state, external:tmp/sim-one-http-runtime-root]; external [—]; destructive `false`
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
- Permissions: read [authorized project tree, node_modules/]; write [.gorombo test runtime configuration, external:tmp/sim-one-tui-product-runtime-root]; external [configured model-provider HTTPS endpoint declared by project model cards]; destructive `false`
- Execution: max `2` attempt(s), `15` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Writes only documented generated build or test artifacts.
- Rollback: Regenerate the documented build or test artifacts from the prior reviewed commit.
- Approval required: `false`
- Acceptance:
  - `verification-passed` (test): The product smoke selects its declared test model card, records a real assistant response of valid content through that card, and proves the response is not a provider error; binary or process existence alone is insufficient. Evidence: `runtime:evidence/verify-sim-one-tui/result.json`
  - `packaged-launch-and-session-lifecycle-passed` (test): The product smoke launches through .gorombo/sim-one-cli/sim-one, proves consecutive default launches create distinct fresh durable sessions, verifies workspace-derived greeting-preflight behavior, and resumes an exact owned id or explicit name without sending a second greeting. Evidence: `runtime:evidence/verify-sim-one-tui/packaged-session-lifecycle.json`
  - `transcript-replay-live-convergence-passed` (test): The product smoke restores newest and older transcript pages, attaches strictly after snapshot nextOffset, preserves completed exchanges, deduplicates reconnect replay, hides private and nested output, and renders one authoritative Markdown final in terminal order. Evidence: `runtime:evidence/verify-sim-one-tui/transcript-replay-live-convergence.json`
  - `interactive-terminal-controls-passed` (test): On the canonical POSIX host, the packaged PTY evidence proves prompt editing and multiline submission remain active during transcript scrollback, command-palette selection works, mouse selection and copy do not exit, history prepend preserves the visible anchor, and scrollbar/live-tail controls reach the true transcript ends; cross-platform terminal-event coverage remains separately owned by verify-rust-tests. Evidence: `runtime:evidence/verify-sim-one-tui/interactive-terminal-controls.json`
  - `session-command-surface-passed` (test): The product smoke proves /new, /clear, /session, /sessions, /compact, /resume, /rename, and /exit operate through the active TUI connector session and preserve the documented header, status, and exit identity behavior. Evidence: `runtime:evidence/verify-sim-one-tui/session-command-surface.json`
  - `work-pane-product-behavior-passed` (test): Packaged terminal evidence proves the required work pane renders at supported widths, uses the planned constrained-terminal view, scrolls independently, mutates durable task state, and leaves transcript and prompt interaction intact. Evidence: `runtime:evidence/verify-sim-one-tui/work-pane-product-behavior.json`

### `verify-onboarding-distribution` — Verify SIM-ONE Onboarding And Distribution

- Goal: Prove the versioned SIM-ONE release candidate installs with integrity, onboards from a clean user environment, manages its runtime, and launches the finished product without a source checkout before publication.
- Executor instructions: Run the exact isolated packaging, installer, onboarding, command, and service-adapter probes introduced by the implementation plan. Bind their argv commands and expected artifacts before execution. Use temporary HOME and runtime roots; do not install or restart the host production service. Preserve full stdout, stderr, exit status, timing, digests, and output-level health evidence.
- Inputs: artifact:integrated-change, artifact:runtime-build, artifact:sim-one-tui-build, artifact:cli-build, artifact:beta-release-contract, artifact:release-package, decision:d5-canonical-runtime-configuration, artifact:runtime-configuration-consolidation-report
- Resources: local-runtime-probe, isolated-packaged-install-probe
- Permissions: read [authorized project tree, artifact:beta-release-contract, artifact:release-package, node_modules/, release-package paths and digests declared by artifact:release-package, decision:d5-canonical-runtime-configuration, doc/decisions/d5-canonical-runtime-configuration.md, artifact:runtime-configuration-consolidation-report]; write [external:tmp/sim-one-onboarding-test-home, external:tmp/sim-one-packaged-runtime-root, isolated service-manager test state]; external [configured model-provider HTTPS endpoint declared by project model cards]; destructive `false`
- Execution: max `2` attempt(s), `45` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Creates only isolated temporary installation, onboarding, runtime, and service-test state.
- Rollback: Remove the isolated test roots and regenerate the package from the reviewed commit.
- Approval required: `false`
- Acceptance:
  - `package-install-passed` (test): A pre-publication isolated clean-home probe reads the exact versioned release-candidate archive and checksum manifest, verifies checksums before extraction, installs without a source checkout, and launches the packaged product from an arbitrary working directory. Evidence: `runtime:evidence/verify-onboarding-distribution/package-install.json`
  - `packaged-onboarding-passed` (test): REL-ONB-001: the packaged sim-one install flow validates configuration, protects secrets, obtains a real model response, and opens the first secure SIM-ONE TUI session with output-level evidence. Evidence: `runtime:evidence/verify-onboarding-distribution/onboarding.json`
  - `lifecycle-commands-passed` (test): REL-OPS-001: isolated command probes prove config, doctor, status, start, restart, and stop behavior for local-process and service-managed modes without mutating the host production service. Evidence: `runtime:evidence/verify-onboarding-distribution/lifecycle-commands.json`
  - `distribution-evidence-honest` (policy): The verification records exact platform coverage, archive and binary digests, temporary runtime roots, provider response evidence, and any unproved platform or service behavior that must block release. Evidence: `runtime:evidence/verify-onboarding-distribution/evidence-scope.json`
  - `rel-cfg-001-clean-install` (test): REL-CFG-001: an isolated clean-home install creates validated owner-only sim-one.config, launches from arbitrary cwd without repository .env or shell-only configuration, and leaves the distributed example non-secret. Evidence: `runtime:evidence/verify-onboarding-distribution/rel-cfg-001-clean-install.json`

### `verify-tui-e2e` — Verify Gateway And CLI Smoke

- Goal: Exercise the direct built-gateway model path and built CLI help surface without treating this narrow smoke as packaged SIM-ONE TUI end-to-end evidence.
- Executor instructions: Execute the exact repository script as an argv array and retain full stdout, stderr, exit status, timing, and declared artifact digests.
- Inputs: artifact:runtime-build, artifact:cli-build
- Resources: local-runtime-probe
- Permissions: read [authorized project tree, node_modules/]; write [.gorombo test runtime state, external:tmp/sim-one-tui-test-runtime-root]; external [configured model-provider HTTPS endpoint declared by project model cards]; destructive `false`
- Execution: max `2` attempt(s), `15` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Writes only documented generated build or test artifacts.
- Rollback: Regenerate the documented build or test artifacts from the prior reviewed commit.
- Approval required: `false`
- Acceptance:
  - `gateway-prompt-passed` (test): The configured smoke selects its declared test model card, posts through the built gateway agent route, and receives a nonempty, non-error assistant response from that provider. Evidence: `runtime:evidence/verify-tui-e2e/gateway-prompt.json`
  - `cli-smoke-passed` (test): The built CLI --help command exits zero and returns a nonempty command surface. Evidence: `runtime:evidence/verify-tui-e2e/cli-smoke.json`
  - `evidence-scope-honest` (policy): This node reports only direct gateway prompt and CLI-help behavior. Packaged sim-one/SIM-ONE TUI launch, sessions, transcript replay, interaction, and visible-final behavior belong to verify-sim-one-tui; approval routing and typed progress belong to unit evidence; missing user-visible approval or subagent end-to-end proof remains an architecture-review blocker. Evidence: `runtime:evidence/verify-tui-e2e/evidence-scope.json`

### `verify-memory-smoke` — Verify Real Memory Runtime

- Goal: Exercise the real WASM memory engine, SQLite durability, retrieval, and Coding Worker memory path end to end.
- Executor instructions: Execute the exact repository script as an argv array and retain full stdout, stderr, exit status, timing, and declared artifact digests.
- Inputs: artifact:runtime-build, artifact:memory-wasm, artifact:embedding-model-assets, decision:d8-memory-helper-task-runs
- Resources: local-runtime-probe
- Permissions: read [authorized project tree, node_modules/, decision:d8-memory-helper-task-runs]; write [.tmp/tsc/, .gorombo test memory state, external:tmp/sim-one-memory-smoke-runtime-root]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `20` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Writes only documented generated build or test artifacts.
- Rollback: Regenerate the documented build or test artifacts from the prior reviewed commit.
- Approval required: `false`
- Acceptance:
  - `verification-passed` (test): The deterministic memory smoke proves mutation, restart durability, scoped retrieval, and Coding Worker integration through the real WASM path. Evidence: `runtime:evidence/verify-memory-smoke/result.json`

### `aggregate-verification` — Aggregate Verification Evidence

- Goal: Map fresh pre-merge project verification evidence to the candidate contract, preserve explicit mandatory post-merge package and onboarding gates, and identify any unproved behavior, skipped requirement, or stale artifact.
- Executor instructions: Inspect full outputs and target behavior. Reject coverage claims based only on a narrow test, successful command, process, port, or artifact existence.
- Inputs: artifact:typecheck-report, artifact:unit-test-report, artifact:documentation-verification-report, artifact:rust-test-report, artifact:runtime-build, artifact:sim-one-tui-product-report, artifact:cli-behavior-report, artifact:http-test-report, artifact:tui-e2e-report, artifact:memory-smoke-report, artifact:runtime-configuration-consolidation-report
- Resources: —
- Permissions: read [all verification evidence, artifact:change-contract, Git diff, artifact:runtime-configuration-consolidation-report]; write [—]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `60` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `none` — Produces evidence without mutating project or external state.
- Rollback: none
- Approval required: `false`
- Acceptance:
  - `all-criteria-mapped` (review): Every change-contract criterion names current direct evidence or is explicitly marked unproved and blocks release. Evidence: `runtime:evidence/aggregate-verification/coverage-map.json`
  - `no-false-positive-status` (policy): Positive status claims rely on correct current output or target-system effects, not process, port, session, file, or command existence. Evidence: `runtime:evidence/aggregate-verification/output-proof-review.json`
  - `product-evidence-scopes-separated` (review): The coverage map keeps direct gateway/CLI smoke, built HTTP session/transcript behavior, Rust TUI state/rendering, packaged sim-one/SIM-ONE TUI PTY behavior, and post-merge isolated onboarding/distribution probes as distinct evidence scopes and rejects claims that exceed the probe that produced them. Evidence: `runtime:evidence/aggregate-verification/product-evidence-scope.json`
  - `release-ledger-coverage-complete` (review): Every required release and planned-work ID maps to one producing member and mandatory verification path. Candidate merge requires complete pre-merge evidence, while REL-PKG-001, REL-PKG-002, REL-ONB-001, and REL-OPS-001 remain fail-closed on the explicit post-merge package build and onboarding/distribution verification path before production approval. Evidence: `runtime:evidence/aggregate-verification/release-ledger-coverage.json`
  - `runtime-configuration-coverage` (review): REL-CFG-001 maps to current integrated-build configuration evidence and preserves separate mandatory post-merge release-package and clean-install verification. Evidence: `runtime:evidence/aggregate-verification/runtime-configuration-coverage.json`

### `review-architecture-security` — Review Architecture, Security, And Product Boundaries

- Goal: Review the integrated change and verification summary for Flue ownership, instruction and persona workspace boundaries, Coding Worker runtime-root scope, trusted context, approval gates, durable progress, product identity, secret boundaries, and release-document accuracy, clarity, and scanability.
- Executor instructions: Perform a fresh review independent of implementation self-report. Confirm user-visible behavior, fail-closed mutations, research ownership, workspace instruction composition, lead-only worker exposure, internal-subagent ownership, runtime-root scoping, disjoint parallel file ownership, documented rollback, and release-document accuracy and readability.
- Inputs: artifact:integrated-change, artifact:verification-summary, decision:d10-sealed-node-context, decision:d11-shared-task-graph-engine, decision:d7-separate-project-and-task-graphs, decision:d8-memory-helper-task-runs, decision:d9-flue-native-task-graph-runtime, artifact:task-lifecycle-architecture-spec, artifact:flue-v2-migration-spec
- Resources: —
- Permissions: read [artifact:integrated-change, artifact:verification-summary, AGENTS.md, AUTHORS.md, CHANGELOG.md, CODE_OF_CONDUCT.md, CONTRIBUTING.md, LICENSE, README.md, SECURITY.md, SUPPORT.md, THIRD_PARTY_NOTICES.md, docs/README.md, docs/architecture/, docs/getting-started/, docs/guides/, docs/operations/, docs/reference/, docs/tui/, openwiki/, src/AGENTS.md, src/workspace-loader.ts, src/agents/orchestrator.ts, src/workspace/, src/engine/workers/*/workspace/, src/engine/workers/coding-worker/subagents/*/workspace/, src/tests/architecture-contract.test.ts, src/tests/workspace-loader.test.ts, src/tests/coding-worker.test.ts, src/tests/coding-worker-internal-subagents.test.ts, src/tests/research-agent.test.ts, decision:d10-sealed-node-context, decision:d11-shared-task-graph-engine, decision:d7-separate-project-and-task-graphs, decision:d8-memory-helper-task-runs, decision:d9-flue-native-task-graph-runtime, artifact:task-lifecycle-architecture-spec, docs/architecture/task-lifecycle-graphs.md, docs/architecture/flue-v2-migration.md]; write [—]; external [—]; destructive `false`
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
  - `release-lineage-consistent` (review): The release ledger, graph members, owner scope decision, repository specification lineage, and verification summary contain the same complete set of stable release IDs and no required item is hidden by a generic workstream. Evidence: `runtime:evidence/review-architecture-security/release-lineage.json`
  - `flue-v2-migration-bound` (review): The current Flue 2 migration specification is consumed and its applicable requirements are reflected in this node output. Evidence: `runtime:evidence/review-architecture-security/flue-v2-migration.json`

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
- Permissions: read [artifact:staged-release-assets, 0.1.0 Beta packaging and installation contract]; write [external:tmp/sim-one-staged-release-download-root, external:tmp/sim-one-staged-release-install-home, external:tmp/sim-one-staged-release-runtime-root]; external [approved authenticated GitHub draft-release asset API endpoints, anonymous GitHub release and tag read probes]; destructive `false`
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
- Executor instructions: Read artifact:beta-release-contract, the complete pre-merge verification summary, post-merge onboarding/distribution and release-package evidence, verified published-release, production-release, and production-observation records, plus the current main-branch release ledger. Require exact set equality for every stable beta ID. Construct the exact single-file patch so every pre-release status cell becomes a completed and verified 0.1.0 Beta state with owning evidence, and record the expected base commit and proposal SHA-256. Refuse any omitted or still pre-release row. Do not modify the worktree, Git state, GitHub state, or release ledger.
- Inputs: artifact:beta-release-contract, artifact:verification-summary, artifact:onboarding-distribution-report, artifact:release-package, artifact:published-release-assets-report, artifact:production-release, artifact:production-observation
- Resources: —
- Permissions: read [artifact:beta-release-contract, artifact:verification-summary, artifact:onboarding-distribution-report, artifact:release-package, artifact:published-release-assets-report, artifact:production-release, artifact:production-observation, docs/getting-started/pre-release-status.md at the recorded main-branch commit]; write [—]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `30` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `none` — Produces a proposal artifact without mutating project or external state.
- Rollback: none
- Approval required: `false`
- Acceptance:
  - `release-ledger-proposal-bound` (artifact): The proposal contains the exact docs/getting-started/pre-release-status.md patch, expected base commit, target main branch, complete final status map for every stable ID in artifact:beta-release-contract, 0.1.0 Beta release date, immutable tag, release URL, candidate commit, asset digests, production release identifier, and proposal SHA-256. Evidence: `runtime:evidence/prepare-release-ledger-update/proposal.json`
  - `release-ledger-final-status-map-complete` (policy): The proposal has exact set equality with every stable beta ID and changes each pre-release status cell to a completed and verified 0.1.0 Beta state backed by the owning verification-summary, post-merge onboarding/distribution, release-package, publication, and production evidence. No required row remains absent, unavailable, awaiting, pending, planned, incomplete, or otherwise pre-release. Evidence: `runtime:evidence/prepare-release-ledger-update/final-status-map.json`
  - `release-ledger-proposal-non-mutating` (policy): The proposal changes only the repository-owned release ledger, derives every release field from the accepted immutable records, performs no repository or GitHub mutation, and is independently consumable without being regenerated by the approver or updater. Evidence: `runtime:evidence/prepare-release-ledger-update/scope.json`

### `approve-release-ledger-update` — Approve Release Ledger Update

- Goal: Let the project owner approve or reject the exact repository mutation that records the successfully published 0.1.0 Beta release.
- Executor instructions: Review artifact:release-ledger-proposal and compare its expected base commit, canonical diff, proposal SHA-256, exact stable-ID set, every final status/evidence mapping, and release fields with artifact:beta-release-contract, artifact:verification-summary, artifact:onboarding-distribution-report, artifact:release-package, and the immutable published-release, production-release, and production-observation records. Reject any omitted row or status that remains absent, unavailable, awaiting, pending, planned, incomplete, or otherwise pre-release. Approval is repository-specific, file-specific, proposal-digest-bound, evidence-bound, release-record-bound, and time-bound. Do not author or alter the diff in this gate.
- Inputs: artifact:beta-release-contract, artifact:verification-summary, artifact:onboarding-distribution-report, artifact:release-package, artifact:published-release-assets-report, artifact:production-release, artifact:production-observation, artifact:release-ledger-proposal
- Resources: —
- Permissions: read [artifact:beta-release-contract, artifact:verification-summary, artifact:onboarding-distribution-report, artifact:release-package, artifact:published-release-assets-report, artifact:production-release, artifact:production-observation, artifact:release-ledger-proposal, docs/getting-started/pre-release-status.md, release-ledger diff and digest declared by artifact:release-ledger-proposal]; write [—]; external [—]; destructive `false`
- Execution: max `1` attempt(s), `1440` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `none` — Produces evidence without mutating project or external state.
- Rollback: none
- Approval required: `false`
- Acceptance:
  - `release-ledger-authority-recorded` (manual): The owner explicitly approves or rejects artifact:release-ledger-proposal by its exact proposal SHA-256, expected base commit, single-file diff, exact complete stable-ID set, final completed/verified status and owning evidence for every required beta row, 0.1.0 Beta release date, immutable tag, release URL, candidate commit, asset digests, production release record, target repository, and rollback. Approval is forbidden while any row remains in a pre-release state. Evidence: `runtime:approval/approve-release-ledger-update`

### `update-release-ledger` — Update Verified Release Ledger

- Goal: Record the verified 0.1.0 Beta publication in the repository-owned release ledger through an exact, separately approved, and independently verified GitHub mutation.
- Executor instructions: Verify artifact:release-ledger-proposal matches the proposal SHA-256 and base commit authorized by artifact:release-ledger-update-approval. Parse the proposal and compare its exact stable-ID set and every final status/evidence mapping with artifact:beta-release-contract, artifact:verification-summary, artifact:onboarding-distribution-report, and artifact:release-package; refuse omitted IDs or any still pre-release status. Apply that diff byte-for-byte without regeneration. Use non-interactive Git and GitHub commands to commit the single authorized file, push an authorized branch, open a non-draft pull request to main, verify required checks, merge only that exact approved change, and read main back to re-prove all stable statuses plus the recorded date, tag, URL, commit, and digests against immutable release records. Stop on any drift or approval mismatch.
- Inputs: artifact:beta-release-contract, artifact:verification-summary, artifact:onboarding-distribution-report, artifact:release-package, artifact:published-release-assets-report, artifact:production-release, artifact:production-observation, artifact:release-ledger-update-approval, artifact:release-ledger-proposal
- Resources: external:github-repository
- Permissions: read [artifact:beta-release-contract, artifact:verification-summary, artifact:onboarding-distribution-report, artifact:release-package, artifact:published-release-assets-report, artifact:production-release, artifact:production-observation, artifact:release-ledger-update-approval, artifact:release-ledger-proposal, docs/getting-started/pre-release-status.md, Git and GitHub repository metadata]; write [docs/getting-started/pre-release-status.md, authorized Git branch, GitHub pull request, approved main-branch merge of the exact release-ledger mutation]; external [Git remote push, GitHub API pull request write, GitHub API approval-bound pull request merge after required checks]; destructive `false`
- Execution: max `2` attempt(s), `120` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Commits, pushes, reviews, and merges the exact approved post-publication release-ledger mutation.
- Rollback: Use a separately approved follow-up pull request to correct the ledger while preserving the original release and repository history.
- Approval required: `true`
- Acceptance:
  - `rel-rel-001-release-date-recorded` (probe): REL-REL-001: docs/getting-started/pre-release-status.md records the 0.1.0 Beta release date only after successful asset publication and production observation, and its date, tag, release URL, candidate commit, and asset digests match the immutable release records. Evidence: `runtime:evidence/update-release-ledger/rel-rel-001.json`
  - `all-release-gates-recorded-complete` (probe): A fresh parse of the proposed and merged ledger proves exact set equality with artifact:beta-release-contract and shows every stable release ID exactly once with a completed and verified 0.1.0 Beta status backed by its owning evidence; no required row retains absent, unavailable, awaiting, pending, planned, incomplete, or other pre-release language. Evidence: `runtime:evidence/update-release-ledger/all-release-gates-closed.json`
  - `release-ledger-mutation-verified` (policy): The repository mutation applies artifact:release-ledger-proposal byte-for-byte at its approved base and exactly matches the proposal SHA-256 recorded by artifact:release-ledger-update-approval; it changes only the authorized release ledger, is committed on an authorized branch, passes required checks in a non-draft pull request to main, and is merged before completion. Evidence: `runtime:evidence/update-release-ledger/repository-mutation.json`
  - `release-ledger-main-state-verified` (probe): A fresh read of main proves the committed release ledger matches the immutable GitHub release and production release records rather than merely proving that a process, push, or pull request exists. Evidence: `runtime:evidence/update-release-ledger/main-ledger.json`

### `closeout-release` — Close Out And Preserve Evidence

- Goal: Record the shipped outcome, exact commit and PR/release references, verification and observation evidence, remaining risks, rollback, and follow-up work.
- Executor instructions: Update the task handoff and issue/PR records without erasing superseded evidence. Confirm the final graph-bound evidence and leave unrelated future work explicit.
- Inputs: artifact:release-candidate, artifact:production-observation, artifact:release-ledger-update
- Resources: project:release-handoff, external:github-repository
- Permissions: read [all graph evidence, Git and GitHub state, development-graph.json, specification-manifest.json, decisions.json, doc/implementation-lineage.md]; write [doc/release-handoff.md, authorized issue or pull-request closeout fields]; external [GitHub issue or pull-request metadata write]; destructive `false`
- Execution: max `2` attempt(s), `60` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Writes the durable task handoff and authorized GitHub closeout metadata.
- Rollback: Restore the prior handoff revision and amend GitHub metadata while preserving the audit history.
- Approval required: `false`
- Acceptance:
  - `handoff-complete` (artifact): The closeout names files changed, commands and tests run, pass/fail results, approvals, PR/release URLs, immutable release assets, the verified repository ledger update, production evidence, assumptions, risks, rollback, and next step. Evidence: `runtime:evidence/closeout-release/handoff.json`
  - `history-preserved` (policy): Superseded evidence and failed attempts remain addressable through the append-only graph ledger and version control. Evidence: `runtime:evidence/closeout-release/history.json`
  - `release-ledger-complete-at-closeout` (probe): The verified main-branch release ledger contains every stable beta ID exactly once in a completed and verified state; closeout is blocked if any required row still describes absent, unavailable, awaiting, pending, planned, incomplete, or otherwise pre-release behavior. Evidence: `runtime:evidence/closeout-release/release-ledger-complete.json`

### `resolve-d1-github-auth-strategy` — Resolve D1 GitHub Auth Strategy

- Goal: Record the supported GitHub credential and public/private repository access strategy without conflating authentication with mutation approval.
- Executor instructions: Record and verify the owner-established official GitHub MCP, fine-grained PAT, anonymous-first public clone, command-scoped private clone, and separate mutation-approval decision in doc/decisions/d1-github-auth-strategy.md.
- Inputs: artifact:baseline-context, artifact:product-spec, artifact:constraints-and-risks, artifact:architecture-spec, artifact:acceptance-spec, artifact:open-questions
- Resources: project:resolve-d1-github-auth-strategy
- Permissions: read [artifact:baseline-context, artifact:product-spec, artifact:constraints-and-risks, artifact:architecture-spec, artifact:acceptance-spec, artifact:open-questions, doc/decisions/d1-github-auth-strategy.md, decisions.json, specification-manifest.json]; write [doc/decisions/d1-github-auth-strategy.md]; external [—]; destructive `false`
- Execution: max `1` attempt(s), `60` minute(s); The recorded owner decision and all status surfaces agree.
- Side effects: `reversible` — Produces or updates one owner-visible decision record.
- Rollback: Restore the prior decision record and invalidate only its declared affected nodes.
- Approval required: `false`
- Acceptance:
  - `decision-status-consistent` (policy): doc/decisions/d1-github-auth-strategy.md, decisions.json, specification-manifest.json, and runtime evidence all record Resolved without an implicit alternate selection. Evidence: `runtime:evidence/resolve-d1-github-auth-strategy/decision-status.json`

### `resolve-d2-workspace-root-isolation` — Resolve D2 Install-Relative Runtime Root

- Goal: Record the single movable .gorombo runtime-root contract and its separation of packaged persona, mutable state, and model-writable workspace.
- Executor instructions: Record and verify the owner-established Resolve D2 Install-Relative Runtime Root decision in doc/decisions/d2-workspace-root-isolation.md.
- Inputs: artifact:baseline-context, artifact:product-spec-workspace, artifact:architecture-spec-workspace, artifact:acceptance-spec-workspace, artifact:open-questions-workspace
- Resources: project:resolve-d2-workspace-root-isolation
- Permissions: read [artifact:baseline-context, artifact:product-spec-workspace, artifact:architecture-spec-workspace, artifact:acceptance-spec-workspace, artifact:open-questions-workspace, doc/decisions/d2-workspace-root-isolation.md, decisions.json, specification-manifest.json]; write [doc/decisions/d2-workspace-root-isolation.md]; external [—]; destructive `false`
- Execution: max `1` attempt(s), `60` minute(s); The recorded owner decision and all status surfaces agree.
- Side effects: `reversible` — Produces or updates one owner-visible decision record.
- Rollback: Restore the prior decision record and invalidate only its declared affected nodes.
- Approval required: `false`
- Acceptance:
  - `decision-status-consistent` (policy): doc/decisions/d2-workspace-root-isolation.md, decisions.json, specification-manifest.json, and runtime evidence all record Resolved without an implicit alternate selection. Evidence: `runtime:evidence/resolve-d2-workspace-root-isolation/decision-status.json`

### `resolve-d3-file-access-gate` — Resolve D3 File Access Gate

- Goal: Record fail-closed structured path and sandbox containment with exact allow-once/session approval escalation.
- Executor instructions: Record and verify the owner-established Resolve D3 File Access Gate decision in doc/decisions/d3-file-access-gate.md.
- Inputs: artifact:baseline-context, artifact:product-spec-file-access, artifact:architecture-spec-file-access, artifact:acceptance-spec-file-access, artifact:open-questions-file-access
- Resources: project:resolve-d3-file-access-gate
- Permissions: read [artifact:baseline-context, artifact:product-spec-file-access, artifact:architecture-spec-file-access, artifact:acceptance-spec-file-access, artifact:open-questions-file-access, doc/decisions/d3-file-access-gate.md, decisions.json, specification-manifest.json]; write [doc/decisions/d3-file-access-gate.md]; external [—]; destructive `false`
- Execution: max `1` attempt(s), `60` minute(s); The recorded owner decision and all status surfaces agree.
- Side effects: `reversible` — Produces or updates one owner-visible decision record.
- Rollback: Restore the prior decision record and invalidate only its declared affected nodes.
- Approval required: `false`
- Acceptance:
  - `decision-status-consistent` (policy): doc/decisions/d3-file-access-gate.md, decisions.json, specification-manifest.json, and runtime evidence all record Resolved without an implicit alternate selection. Evidence: `runtime:evidence/resolve-d3-file-access-gate/decision-status.json`

### `resolve-d4-orchestrator-history-visibility` — Resolve D4 Orchestrator Worker Verification

- Goal: Select authoritative typed worker evidence alone or an additional scoped service over Flue durable task events.
- Executor instructions: Obtain and record the owner's selection for Resolve D4 Orchestrator Worker Verification in doc/decisions/d4-orchestrator-history-visibility.md; do not fabricate a choice.
- Inputs: artifact:baseline-context, artifact:product-spec-file-access, artifact:architecture-spec-file-access, artifact:acceptance-spec-file-access, artifact:open-questions-file-access
- Resources: project:resolve-d4-orchestrator-history-visibility
- Permissions: read [artifact:baseline-context, artifact:product-spec-file-access, artifact:architecture-spec-file-access, artifact:acceptance-spec-file-access, artifact:open-questions-file-access, doc/decisions/d4-orchestrator-history-visibility.md, decisions.json, specification-manifest.json]; write [doc/decisions/d4-orchestrator-history-visibility.md]; external [—]; destructive `false`
- Execution: max `1` attempt(s), `60` minute(s); The owner explicitly selects an option and all status surfaces are updated.
- Side effects: `reversible` — Produces or updates one owner-visible decision record.
- Rollback: Restore the prior decision record and invalidate only its declared affected nodes.
- Approval required: `false`
- Acceptance:
  - `decision-status-consistent` (policy): doc/decisions/d4-orchestrator-history-visibility.md, decisions.json, specification-manifest.json, and runtime evidence all record Open without an implicit alternate selection. Evidence: `runtime:evidence/resolve-d4-orchestrator-history-visibility/decision-status.json`

### `specify-release-reconciliation` — Specify Reconciled 0.1.0 Release Work

- Goal: Maintain the neutral product, architecture, acceptance, risk, and open-question documents that bind the reconciled 0.1.0 release graph without fabricating open decisions.
- Executor instructions: Maintain the reconciled repository specification documents, decision catalog, specification manifest, and implementation lineage. Preserve open decisions and development-graph authority. Do not create or depend on an external plan.
- Inputs: artifact:baseline-context
- Resources: project:release-reconciliation-specification
- Permissions: read [artifact:baseline-context, decisions.json, docs/getting-started/pre-release-status.md, development-graph.json, specification-manifest.json, doc/implementation-lineage.md]; write [doc/product-spec.md, doc/constraints-and-risks.md, doc/architecture-spec.md, doc/acceptance-spec.md, doc/open-questions.md, doc/product-spec-workspace.md, doc/architecture-spec-workspace.md, doc/acceptance-spec-workspace.md, doc/open-questions-workspace.md, doc/product-spec-file-access-history.md, doc/architecture-spec-file-access-history.md, doc/acceptance-spec-file-access-history.md, doc/open-questions-file-access-history.md, doc/product-spec-runtime-configuration.md, doc/architecture-spec-runtime-configuration.md, doc/acceptance-spec-runtime-configuration.md, doc/open-questions-runtime-configuration.md, doc/runtime-configuration-inventory.md]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `90` minute(s); Every required document exists, is status-consistent, and maps to graph lineage.
- Side effects: `reversible` — Updates repository specification documents without product implementation.
- Rollback: Restore the previous specification documents and invalidate their consumers.
- Approval required: `false`
- Acceptance:
  - `decision-neutrality` (policy): D1, D2, D3, and D5 state only the owner-established resolved decisions, while D4 remains explicitly open and blocks only its named consumer. Evidence: `runtime:evidence/specify-release-reconciliation/decision-neutrality.json`
  - `memory-work-promoted` (review): Every pending structured-memory todo and checklist item is mapped to one stable release ID and explicit graph member. Evidence: `runtime:evidence/specify-release-reconciliation/memory-work-promoted.json`
  - `runtime-root-install-relative` (review): The runtime-root specification is movable, install-relative, and separates packaged persona, mutable state, and model-writable workspace. Evidence: `runtime:evidence/specify-release-reconciliation/runtime-root-install-relative.json`
  - `runtime-configuration-inventory-complete` (review): The runtime-configuration inventory classifies every implemented SIM-ONE-owned environment key, alias, bootstrap input, test-only control, deprecated placeholder, and intentionally absent integration without inventing unsupported Gmail or Google configuration. Evidence: `runtime:evidence/specify-release-reconciliation/runtime-configuration-inventory.json`

### `verify-release-reconciliation-specifications` — Verify Reconciled Release Specifications

- Goal: Verify graph/schema/manifest lineage, document containment, resolved-decision coverage, open-decision isolation, and release-ledger completeness.
- Executor instructions: Run the graph and specification validators and retain their bounded JSON result.
- Inputs: artifact:product-spec, artifact:constraints-and-risks, artifact:architecture-spec, artifact:acceptance-spec, artifact:open-questions, artifact:product-spec-workspace, artifact:architecture-spec-workspace, artifact:acceptance-spec-workspace, artifact:open-questions-workspace, artifact:product-spec-file-access, artifact:architecture-spec-file-access, artifact:acceptance-spec-file-access, artifact:open-questions-file-access, decision:d1-github-auth-strategy, decision:d2-workspace-root-isolation, decision:d3-file-access-gate, artifact:product-spec-runtime-configuration, artifact:architecture-spec-runtime-configuration, artifact:acceptance-spec-runtime-configuration, artifact:open-questions-runtime-configuration, artifact:runtime-configuration-inventory, decision:d5-canonical-runtime-configuration, decision:d6-tui-approval-surface-placement, artifact:task-lifecycle-architecture-spec, decision:d7-separate-project-and-task-graphs, decision:d8-memory-helper-task-runs, decision:d9-flue-native-task-graph-runtime, decision:d10-sealed-node-context, decision:d11-shared-task-graph-engine, artifact:flue-v2-migration-spec, decision:d12-flue-v2-persistence-and-compaction
- Resources: —
- Permissions: read [doc/product-spec.md, doc/constraints-and-risks.md, doc/architecture-spec.md, doc/acceptance-spec.md, doc/open-questions.md, doc/product-spec-workspace.md, doc/architecture-spec-workspace.md, doc/acceptance-spec-workspace.md, doc/open-questions-workspace.md, doc/product-spec-file-access-history.md, doc/architecture-spec-file-access-history.md, doc/acceptance-spec-file-access-history.md, doc/open-questions-file-access-history.md, doc/decisions/d1-github-auth-strategy.md, development-graph.json, development-graph.md, specification-manifest.json, decisions.json, docs/getting-started/pre-release-status.md, doc/product-spec-runtime-configuration.md, doc/architecture-spec-runtime-configuration.md, doc/acceptance-spec-runtime-configuration.md, doc/open-questions-runtime-configuration.md, doc/runtime-configuration-inventory.md, doc/decisions/d5-canonical-runtime-configuration.md, decision:d6-tui-approval-surface-placement, doc/decisions/d6-tui-approval-surface-placement.md, artifact:task-lifecycle-architecture-spec, docs/architecture/task-lifecycle-graphs.md, decision:d7-separate-project-and-task-graphs, doc/decisions/d7-separate-project-and-task-graphs.md, decision:d8-memory-helper-task-runs, doc/decisions/d8-memory-helper-task-runs.md, decision:d9-flue-native-task-graph-runtime, doc/decisions/d9-flue-native-task-graph-runtime.md, decision:d10-sealed-node-context, doc/decisions/d10-sealed-node-context.md, decision:d11-shared-task-graph-engine, doc/decisions/d11-shared-task-graph-engine.md, docs/architecture/flue-v2-migration.md]; write [—]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `30` minute(s); Graph and specification validation pass with no errors or warnings.
- Side effects: `none` — Produces deterministic verification evidence without project mutation.
- Rollback: none
- Approval required: `false`
- Acceptance:
  - `specctl-pass` (schema): specctl verify passes against the current graph, Markdown, manifest, decisions, and project root. Evidence: `runtime:evidence/verify-release-reconciliation-specifications/specctl-pass.json`
  - `open-decisions-isolated` (policy): D4 remains the only open owner decision and blocks only its named consumer; resolved D1-D3 and D5-D11 are consumed by specification, planning, verification, and every declared affected implementation or release member. Evidence: `runtime:evidence/verify-release-reconciliation-specifications/open-decisions-isolated.json`
  - `release-ledger-complete` (review): Every stable 0.1.0 release ID has one producing graph member and behavioral acceptance evidence. Evidence: `runtime:evidence/verify-release-reconciliation-specifications/release-ledger-complete.json`
  - `flue-v2-migration-bound` (test): The current Flue 2 migration specification is consumed and its applicable requirements are reflected in this node output. Evidence: `runtime:evidence/verify-release-reconciliation-specifications/flue-v2-migration.json`

### `implement-runtime-root-layout` — Implement Install-Relative Runtime Root

- Goal: Implement one typed, movable .gorombo runtime root across packaged launchers, Node runtime, CLI, stores, scripts, worker metadata, and tests.
- Executor instructions: Implement D2 without independent HOME or cwd production fallbacks. Keep the installed persona read-only and mutable state outside the coding workspace. Follow artifact:implementation-plan exactly, use only worker-local internal specialists, emit durable typed progress, and stop before any unassigned file or unapproved mutation.
- Inputs: artifact:implementation-plan, artifact:beta-release-contract, decision:d2-workspace-root-isolation, artifact:core-contracts-change, artifact:agent-runtime-change, artifact:capabilities-security-change, artifact:ingress-operations-change, decision:d5-canonical-runtime-configuration
- Resources: project:runtime-root-layout
- Permissions: read [artifact:implementation-plan, artifact:beta-release-contract, decision:d2-workspace-root-isolation, doc/architecture-spec-workspace.md, docs/architecture/product-flow.md, docs/architecture/tui-cli-session-flow.md, sim-one-cli/, tui/ratatui/, src/core/config/, decision:d5-canonical-runtime-configuration, doc/decisions/d5-canonical-runtime-configuration.md]; write [src/core/config/ files assigned to this member, runtime-path consumers assigned to this member, sim-one-cli/ files assigned to this member, tui/ratatui/ launcher files assigned to this member, scripts/ files assigned to this member, focused runtime-path tests and documentation assigned to this member]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `240` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes approval-service-authorized files for Implement Install-Relative Runtime Root.
- Rollback: Restore this member's exclusively owned files from the pre-change Git commit while preserving unrelated members.
- Approval required: `true`
- Acceptance:
  - `scope-and-file-ownership` (policy): The change stays inside this member's implementation-plan file ownership; shared files are serialized and no parallel member edits the same file. Evidence: `runtime:evidence/implement-runtime-root-layout/scope-and-file-ownership.json`
  - `repository-mutations-approved` (policy): Every repository write has a current fail-closed approval-service decision bound to the exact path, mutation or command digest, run, scope, approver, and time. Evidence: `runtime:evidence/implement-runtime-root-layout/repository-mutations-approved.json`
  - `progress-visible` (artifact): Durable typed progress covers work admission, handoffs, tool execution, approval, verification, blockers, and completion. Evidence: `runtime:evidence/implement-runtime-root-layout/progress-visible.json`
  - `focused-verification` (test): Focused automated tests and output-level product evidence pass for every changed behavior. Evidence: `runtime:evidence/implement-runtime-root-layout/focused-verification.json`
  - `rel-runtime-001-moved-tree` (test): REL-RUNTIME-001: packaged launch from an unrelated cwd and a moved non-HOME .gorombo tree selects the same expected server, workspace, db, capability, approval, auth, log, and coding-worker paths. Evidence: `runtime:evidence/implement-runtime-root-layout/rel-runtime-001-moved-tree.json`
  - `runtime-layout-separated` (policy): Persona, coding workspace, mutable services, and packaged binaries occupy the exact D2 sibling layout with no workspace/.gorombo metadata. Evidence: `runtime:evidence/implement-runtime-root-layout/runtime-layout-separated.json`
  - `build-excludes-runtime-projects` (test): Release packaging excludes source persona repos/projects and agent-created dependency trees while preserving required persona files. Evidence: `runtime:evidence/implement-runtime-root-layout/build-excludes-runtime-projects.json`
  - `rel-cfg-001-config-paths` (test): REL-CFG-001: the movable runtime-root contract names <runtime-root>/sim-one.config and <runtime-root>/sim-one.config.example explicitly and provides no production HOME, cwd, repository .env, or shell-only fallback. Evidence: `runtime:evidence/implement-runtime-root-layout/rel-cfg-001-config-paths.json`

### `implement-file-access-approval-gate` — Implement File Access Approval Gate

- Goal: Enforce workspace containment for every Coding Worker filesystem and shell operation and provide exact allow-once/session escalation.
- Executor instructions: Implement D3 with canonical structured paths and a real sandbox boundary. Regex scanning may diagnose but cannot authorize. Follow artifact:implementation-plan exactly, use only worker-local internal specialists, emit durable typed progress, and stop before any unassigned file or unapproved mutation.
- Inputs: artifact:implementation-plan, artifact:beta-release-contract, artifact:runtime-root-layout-change, artifact:capabilities-security-change, decision:d2-workspace-root-isolation, decision:d3-file-access-gate
- Resources: project:file-access-approval-gate
- Permissions: read [artifact:implementation-plan, artifact:beta-release-contract, decision:d2-workspace-root-isolation, decision:d3-file-access-gate, doc/architecture-spec-file-access-history.md, src/engine/workers/coding-worker/, src/engine/approvals/]; write [src/engine/workers/coding-worker/tools/ files assigned to this member, src/engine/workers/coding-worker/approvals/ files assigned to this member, src/engine/approvals/ files assigned to this member, focused containment and approval tests assigned to this member]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `240` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes approval-service-authorized files for Implement File Access Approval Gate.
- Rollback: Restore this member's exclusively owned files from the pre-change Git commit while preserving unrelated members.
- Approval required: `true`
- Acceptance:
  - `scope-and-file-ownership` (policy): The change stays inside this member's implementation-plan file ownership; shared files are serialized and no parallel member edits the same file. Evidence: `runtime:evidence/implement-file-access-approval-gate/scope-and-file-ownership.json`
  - `repository-mutations-approved` (policy): Every repository write has a current fail-closed approval-service decision bound to the exact path, mutation or command digest, run, scope, approver, and time. Evidence: `runtime:evidence/implement-file-access-approval-gate/repository-mutations-approved.json`
  - `progress-visible` (artifact): Durable typed progress covers work admission, handoffs, tool execution, approval, verification, blockers, and completion. Evidence: `runtime:evidence/implement-file-access-approval-gate/progress-visible.json`
  - `focused-verification` (test): Focused automated tests and output-level product evidence pass for every changed behavior. Evidence: `runtime:evidence/implement-file-access-approval-gate/focused-verification.json`
  - `rel-cw-001-write-approval` (test): REL-CW-001: every write/edit/patch path validates a trusted approval and fails closed when it is absent or unavailable. Evidence: `runtime:evidence/implement-file-access-approval-gate/rel-cw-001-write-approval.json`
  - `rel-cw-003-containment` (test): REL-CW-003: traversal, symlink, missing-parent, quoted, expanded, subprocess, Unix, and Windows escape attempts are contained or exactly approved. Evidence: `runtime:evidence/implement-file-access-approval-gate/rel-cw-003-containment.json`
  - `approval-scope-replay-safe` (test): Allow-once cannot replay; allow-for-session expires on session change; changed path, operation, command, principal, or task requires a new decision. Evidence: `runtime:evidence/implement-file-access-approval-gate/approval-scope-replay-safe.json`

### `implement-coding-worker-progress` — Implement Live Coding Worker Progress

- Goal: Attach the existing typed checkpoint reporter to the live Flue Coding Worker and route sanitized progress to active connectors.
- Executor instructions: Use Flue task/tool/operation correlation and the SIM-ONE progress schema; do not expose hidden thinking or internal prompts. Follow artifact:implementation-plan exactly, use only worker-local internal specialists, emit durable typed progress, and stop before any unassigned file or unapproved mutation.
- Inputs: artifact:implementation-plan, artifact:beta-release-contract, artifact:agent-runtime-change
- Resources: project:coding-worker-progress
- Permissions: read [artifact:implementation-plan, artifact:beta-release-contract, artifact:agent-runtime-change, docs/architecture/worker-system.md, src/engine/workers/coding-worker/events/]; write [src/engine/workers/coding-worker/ files assigned to this member, connector progress bridge files assigned to this member, focused progress tests assigned to this member]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `240` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes approval-service-authorized files for Implement Live Coding Worker Progress.
- Rollback: Restore this member's exclusively owned files from the pre-change Git commit while preserving unrelated members.
- Approval required: `true`
- Acceptance:
  - `scope-and-file-ownership` (policy): The change stays inside this member's implementation-plan file ownership; shared files are serialized and no parallel member edits the same file. Evidence: `runtime:evidence/implement-coding-worker-progress/scope-and-file-ownership.json`
  - `repository-mutations-approved` (policy): Every repository write has a current fail-closed approval-service decision bound to the exact path, mutation or command digest, run, scope, approver, and time. Evidence: `runtime:evidence/implement-coding-worker-progress/repository-mutations-approved.json`
  - `progress-visible` (artifact): Durable typed progress covers work admission, handoffs, tool execution, approval, verification, blockers, and completion. Evidence: `runtime:evidence/implement-coding-worker-progress/progress-visible.json`
  - `focused-verification` (test): Focused automated tests and output-level product evidence pass for every changed behavior. Evidence: `runtime:evidence/implement-coding-worker-progress/focused-verification.json`
  - `rel-cw-002-live-progress` (test): REL-CW-002: the live Flue profile emits task, handoff, tool, approval, verification, replan, Git/GitHub, blocked, and completion checkpoints through the active connector. Evidence: `runtime:evidence/implement-coding-worker-progress/rel-cw-002-live-progress.json`
  - `progress-replay-sanitized` (test): Durable replay preserves ordering and correlation while excluding secrets, hidden reasoning, and unrelated child-session payloads. Evidence: `runtime:evidence/implement-coding-worker-progress/progress-replay-sanitized.json`

### `implement-coding-worker-github-flow` — Implement Owner-Selected GitHub Flow

- Goal: Implement the resolved D1 credential strategy, anonymous public clone, action approvals, and packaged TUI/connector result delivery.
- Executor instructions: Do not begin until D1 is resolved. Preserve Flue profile ownership and separate authentication from mutation approval. Follow artifact:implementation-plan exactly, use only worker-local internal specialists, emit durable typed progress, and stop before any unassigned file or unapproved mutation.
- Inputs: artifact:implementation-plan, artifact:beta-release-contract, artifact:runtime-root-layout-change, artifact:agent-runtime-change, artifact:capabilities-security-change, decision:d1-github-auth-strategy, decision:d2-workspace-root-isolation, decision:d5-canonical-runtime-configuration, artifact:runtime-configuration-consolidation-change
- Resources: project:coding-worker-github-flow
- Permissions: read [artifact:implementation-plan, artifact:beta-release-contract, decision:d1-github-auth-strategy, decision:d2-workspace-root-isolation, doc/architecture-spec.md, src/engine/workers/coding-worker/github/, src/engine/workers/coding-worker/repo/, decision:d5-canonical-runtime-configuration, doc/decisions/d5-canonical-runtime-configuration.md, artifact:runtime-configuration-consolidation-change]; write [Coding Worker Git/GitHub files assigned to this member, GitHub capability/MCP configuration assigned to this member, focused GitHub and packaged clone tests assigned to this member]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `240` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes approval-service-authorized files for Implement Owner-Selected GitHub Flow.
- Rollback: Restore this member's exclusively owned files from the pre-change Git commit while preserving unrelated members.
- Approval required: `true`
- Acceptance:
  - `scope-and-file-ownership` (policy): The change stays inside this member's implementation-plan file ownership; shared files are serialized and no parallel member edits the same file. Evidence: `runtime:evidence/implement-coding-worker-github-flow/scope-and-file-ownership.json`
  - `repository-mutations-approved` (policy): Every repository write has a current fail-closed approval-service decision bound to the exact path, mutation or command digest, run, scope, approver, and time. Evidence: `runtime:evidence/implement-coding-worker-github-flow/repository-mutations-approved.json`
  - `progress-visible` (artifact): Durable typed progress covers work admission, handoffs, tool execution, approval, verification, blockers, and completion. Evidence: `runtime:evidence/implement-coding-worker-github-flow/progress-visible.json`
  - `focused-verification` (test): Focused automated tests and output-level product evidence pass for every changed behavior. Evidence: `runtime:evidence/implement-coding-worker-github-flow/focused-verification.json`
  - `rel-cw-004-public-clone` (test): REL-CW-004: the packaged TUI clones a public repository anonymously with local mutation approval and verifies canonical path, remote, branch, and status. Evidence: `runtime:evidence/implement-coding-worker-github-flow/rel-cw-004-public-clone.json`
  - `private-auth-secret-safe` (test): Private access uses the selected trusted credential path without serializing secrets into workspace, progress, transcript, evidence, or graph state. Evidence: `runtime:evidence/implement-coding-worker-github-flow/private-auth-secret-safe.json`
  - `github-mutations-separately-approved` (test): Authentication does not bypass action-specific approval for clone/register, push, PR, issue, comment, or review mutations. Evidence: `runtime:evidence/implement-coding-worker-github-flow/github-mutations-separately-approved.json`
  - `canonical-github-pat` (test): The official GitHub MCP PAT resolves only through the canonical runtime configuration and is never serialized into workspace, command argv, progress, transcript, logs, graph state, or evidence. Evidence: `runtime:evidence/implement-coding-worker-github-flow/canonical-github-pat.json`

### `implement-coding-worker-scaffold-tooling` — Implement Coding Scaffold Tooling

- Goal: Add profile-owned Astro documentation capability, repository-scoped scaffold wrappers, and noninteractive post-scaffold verification setup.
- Executor instructions: Honor Flue profile capability inheritance and create projects only under the D2 workspace repositories/projects contract. Follow artifact:implementation-plan exactly, use only worker-local internal specialists, emit durable typed progress, and stop before any unassigned file or unapproved mutation.
- Inputs: artifact:implementation-plan, artifact:beta-release-contract, artifact:runtime-root-layout-change, artifact:agent-runtime-change, decision:d2-workspace-root-isolation
- Resources: project:coding-worker-scaffold-tooling
- Permissions: read [artifact:implementation-plan, artifact:beta-release-contract, decision:d2-workspace-root-isolation, src/engine/workers/coding-worker/, external:sim-one.dev-probe-checklist]; write [Coding Worker capability/scaffold files assigned to this member, worker workspace guidance assigned to this member, focused scaffold product tests assigned to this member]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `240` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes approval-service-authorized files for Implement Coding Scaffold Tooling.
- Rollback: Restore this member's exclusively owned files from the pre-change Git commit while preserving unrelated members.
- Approval required: `true`
- Acceptance:
  - `scope-and-file-ownership` (policy): The change stays inside this member's implementation-plan file ownership; shared files are serialized and no parallel member edits the same file. Evidence: `runtime:evidence/implement-coding-worker-scaffold-tooling/scope-and-file-ownership.json`
  - `repository-mutations-approved` (policy): Every repository write has a current fail-closed approval-service decision bound to the exact path, mutation or command digest, run, scope, approver, and time. Evidence: `runtime:evidence/implement-coding-worker-scaffold-tooling/repository-mutations-approved.json`
  - `progress-visible` (artifact): Durable typed progress covers work admission, handoffs, tool execution, approval, verification, blockers, and completion. Evidence: `runtime:evidence/implement-coding-worker-scaffold-tooling/progress-visible.json`
  - `focused-verification` (test): Focused automated tests and output-level product evidence pass for every changed behavior. Evidence: `runtime:evidence/implement-coding-worker-scaffold-tooling/focused-verification.json`
  - `rel-cw-005-astro-mcp` (test): REL-CW-005: the owning Coding Worker profile can invoke the configured Astro docs MCP while undeclared profiles cannot. Evidence: `runtime:evidence/implement-coding-worker-scaffold-tooling/rel-cw-005-astro-mcp.json`
  - `scaffold-under-repos` (test): Framework CLIs create only under workspace/repos/<slug> or workspace/projects/<slug> and return the canonical selected repository. Evidence: `runtime:evidence/implement-coding-worker-scaffold-tooling/scaffold-under-repos.json`
  - `post-scaffold-verification` (test): The post-scaffold helper configures required type/check tooling noninteractively and returns verified command results. Evidence: `runtime:evidence/implement-coding-worker-scaffold-tooling/post-scaffold-verification.json`

### `implement-orchestrator-worker-verification` — Implement Orchestrator Worker Verification

- Goal: Implement the owner-selected D4 boundary for independently checking typed Coding Worker evidence before final synthesis.
- Executor instructions: Do not query raw Flue SQLite or expose unbounded history. Use typed worker evidence and, only if D4 selects it, a scoped service over Flue durable events. Follow artifact:implementation-plan exactly, use only worker-local internal specialists, emit durable typed progress, and stop before any unassigned file or unapproved mutation.
- Inputs: artifact:implementation-plan, artifact:beta-release-contract, artifact:runtime-root-layout-change, artifact:agent-runtime-change, decision:d2-workspace-root-isolation, decision:d4-orchestrator-history-visibility
- Resources: project:orchestrator-worker-verification
- Permissions: read [artifact:implementation-plan, artifact:beta-release-contract, decision:d2-workspace-root-isolation, decision:d4-orchestrator-history-visibility, doc/architecture-spec-file-access-history.md, docs/architecture/worker-system.md, src/agents/orchestrator.ts]; write [typed worker result/evidence files assigned to this member, orchestrator verification files assigned to this member, scoped Flue event projection files assigned to this member when selected, focused isolation and replay tests assigned to this member]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `240` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes approval-service-authorized files for Implement Orchestrator Worker Verification.
- Rollback: Restore this member's exclusively owned files from the pre-change Git commit while preserving unrelated members.
- Approval required: `true`
- Acceptance:
  - `scope-and-file-ownership` (policy): The change stays inside this member's implementation-plan file ownership; shared files are serialized and no parallel member edits the same file. Evidence: `runtime:evidence/implement-orchestrator-worker-verification/scope-and-file-ownership.json`
  - `repository-mutations-approved` (policy): Every repository write has a current fail-closed approval-service decision bound to the exact path, mutation or command digest, run, scope, approver, and time. Evidence: `runtime:evidence/implement-orchestrator-worker-verification/repository-mutations-approved.json`
  - `progress-visible` (artifact): Durable typed progress covers work admission, handoffs, tool execution, approval, verification, blockers, and completion. Evidence: `runtime:evidence/implement-orchestrator-worker-verification/progress-visible.json`
  - `focused-verification` (test): Focused automated tests and output-level product evidence pass for every changed behavior. Evidence: `runtime:evidence/implement-orchestrator-worker-verification/focused-verification.json`
  - `rel-cw-006-evidence-verified` (test): REL-CW-006: final synthesis distinguishes worker self-report from checked file, Git, test, approval, checkpoint, and artifact evidence. Evidence: `runtime:evidence/implement-orchestrator-worker-verification/rel-cw-006-evidence-verified.json`
  - `history-scope-isolated` (test): Cross-session, cross-task, nested-worker, secret, hidden-reasoning, and raw-database access is denied. Evidence: `runtime:evidence/implement-orchestrator-worker-verification/history-scope-isolated.json`

### `implement-tui-message-queue` — Implement TUI Message Queue

- Goal: Queue prompts submitted while a turn is active, display their state, and admit them to the same session in deterministic order.
- Executor instructions: Keep the TUI a connector client. Queue admission and durable settlement use typed gateway/session contracts. Follow artifact:implementation-plan exactly, use only worker-local internal specialists, emit durable typed progress, and stop before any unassigned file or unapproved mutation.
- Inputs: artifact:implementation-plan, artifact:beta-release-contract, artifact:ingress-operations-change, artifact:agent-runtime-change
- Resources: project:tui-message-queue
- Permissions: read [artifact:implementation-plan, artifact:beta-release-contract, artifact:ingress-operations-change, artifact:agent-runtime-change, tui/ratatui/, docs/architecture/tui-cli-session-flow.md]; write [tui/ratatui/ files assigned to this member, typed gateway queue files assigned to this member, focused queue and packaged-product tests assigned to this member]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `240` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes approval-service-authorized files for Implement TUI Message Queue.
- Rollback: Restore this member's exclusively owned files from the pre-change Git commit while preserving unrelated members.
- Approval required: `true`
- Acceptance:
  - `scope-and-file-ownership` (policy): The change stays inside this member's implementation-plan file ownership; shared files are serialized and no parallel member edits the same file. Evidence: `runtime:evidence/implement-tui-message-queue/scope-and-file-ownership.json`
  - `repository-mutations-approved` (policy): Every repository write has a current fail-closed approval-service decision bound to the exact path, mutation or command digest, run, scope, approver, and time. Evidence: `runtime:evidence/implement-tui-message-queue/repository-mutations-approved.json`
  - `progress-visible` (artifact): Durable typed progress covers work admission, handoffs, tool execution, approval, verification, blockers, and completion. Evidence: `runtime:evidence/implement-tui-message-queue/progress-visible.json`
  - `focused-verification` (test): Focused automated tests and output-level product evidence pass for every changed behavior. Evidence: `runtime:evidence/implement-tui-message-queue/focused-verification.json`
  - `rel-tui-001-ordered-queue` (test): REL-TUI-001: multiple send-while-thinking prompts remain visible, preserve order, settle once, and stay bound to the active session across success and failure. Evidence: `runtime:evidence/implement-tui-message-queue/rel-tui-001-ordered-queue.json`
  - `queue-does-not-corrupt-editor` (test): Queue updates do not steal prompt focus, transcript scroll, selection, or slash-menu state. Evidence: `runtime:evidence/implement-tui-message-queue/queue-does-not-corrupt-editor.json`

### `implement-tui-status-context-meter` — Implement TUI Status And Context Meter

- Goal: Render a stable two-row status surface split at the messages marker, with authoritative context-left percentage and overflow state on row two.
- Executor instructions: Use typed gateway/Flue usage data, preserve the prompt and transcript geometry, keep the status surface exactly two rows, end row one at messages: N, and start row two with authoritative context remaining before overflow state. Follow artifact:implementation-plan exactly, use only worker-local internal specialists, emit durable typed progress, and stop before any unassigned file or unapproved mutation.
- Inputs: artifact:implementation-plan, artifact:beta-release-contract, artifact:tui-message-queue-change, decision:d6-tui-approval-surface-placement
- Resources: project:tui-status-context-meter
- Permissions: read [artifact:implementation-plan, artifact:beta-release-contract, artifact:tui-message-queue-change, tui/ratatui/, src/engine/session/, decision:d6-tui-approval-surface-placement, doc/decisions/d6-tui-approval-surface-placement.md]; write [tui/ratatui/ files assigned to this member, typed context/usage status files assigned to this member, focused framebuffer and product tests assigned to this member]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `240` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes approval-service-authorized files for Implement TUI Status And Context Meter.
- Rollback: Restore this member's exclusively owned files from the pre-change Git commit while preserving unrelated members.
- Approval required: `true`
- Acceptance:
  - `scope-and-file-ownership` (policy): The change stays inside this member's implementation-plan file ownership; shared files are serialized and no parallel member edits the same file. Evidence: `runtime:evidence/implement-tui-status-context-meter/scope-and-file-ownership.json`
  - `repository-mutations-approved` (policy): Every repository write has a current fail-closed approval-service decision bound to the exact path, mutation or command digest, run, scope, approver, and time. Evidence: `runtime:evidence/implement-tui-status-context-meter/repository-mutations-approved.json`
  - `progress-visible` (artifact): Durable typed progress covers work admission, handoffs, tool execution, approval, verification, blockers, and completion. Evidence: `runtime:evidence/implement-tui-status-context-meter/progress-visible.json`
  - `focused-verification` (test): Focused automated tests and output-level product evidence pass for every changed behavior. Evidence: `runtime:evidence/implement-tui-status-context-meter/focused-verification.json`
  - `rel-tui-002-two-row-status` (test): REL-TUI-002: two status rows fit supported widths without overlapping prompt, transcript, slash palette, or work pane. Evidence: `runtime:evidence/implement-tui-status-context-meter/rel-tui-002-two-row-status.json`
  - `context-left-authoritative` (test): Context-left percentage derives from the selected model/session budget and reports unavailable instead of estimating when authoritative data is missing. Evidence: `runtime:evidence/implement-tui-status-context-meter/context-left-authoritative.json`
  - `approval-surface-layout-contract` (test): The status surface stays exactly two rows: row one preserves the established field order and ends with messages: N, while row two starts with authoritative context remaining and carries overflow state including pending approval status; the separate approval drop-up does not change this geometry. Evidence: `runtime:evidence/implement-tui-status-context-meter/approval-surface-layout-contract.json`

### `implement-tui-prompt-editor-polish` — Implement TUI Prompt Cursor And Caret

- Goal: Make spaces move the caret immediately and render a slim visibly active cursor without regressing Unicode, selection, multiline, or scrolling behavior.
- Executor instructions: Preserve the existing display-column-aware editor and prove behavior through framebuffer and packaged PTY tests. Follow artifact:implementation-plan exactly, use only worker-local internal specialists, emit durable typed progress, and stop before any unassigned file or unapproved mutation.
- Inputs: artifact:implementation-plan, artifact:beta-release-contract, artifact:tui-status-context-meter-change
- Resources: project:tui-prompt-editor-polish
- Permissions: read [artifact:implementation-plan, artifact:beta-release-contract, artifact:tui-status-context-meter-change, tui/ratatui/]; write [tui/ratatui/ prompt/input files assigned to this member, focused input, framebuffer, and PTY tests assigned to this member]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `240` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes approval-service-authorized files for Implement TUI Prompt Cursor And Caret.
- Rollback: Restore this member's exclusively owned files from the pre-change Git commit while preserving unrelated members.
- Approval required: `true`
- Acceptance:
  - `scope-and-file-ownership` (policy): The change stays inside this member's implementation-plan file ownership; shared files are serialized and no parallel member edits the same file. Evidence: `runtime:evidence/implement-tui-prompt-editor-polish/scope-and-file-ownership.json`
  - `repository-mutations-approved` (policy): Every repository write has a current fail-closed approval-service decision bound to the exact path, mutation or command digest, run, scope, approver, and time. Evidence: `runtime:evidence/implement-tui-prompt-editor-polish/repository-mutations-approved.json`
  - `progress-visible` (artifact): Durable typed progress covers work admission, handoffs, tool execution, approval, verification, blockers, and completion. Evidence: `runtime:evidence/implement-tui-prompt-editor-polish/progress-visible.json`
  - `focused-verification` (test): Focused automated tests and output-level product evidence pass for every changed behavior. Evidence: `runtime:evidence/implement-tui-prompt-editor-polish/focused-verification.json`
  - `rel-tui-003-space-caret` (test): REL-TUI-003: inserting a space updates the visible caret in the same frame at line start, middle, end, and wrapped/multiline positions. Evidence: `runtime:evidence/implement-tui-prompt-editor-polish/rel-tui-003-space-caret.json`
  - `active-cursor-visible` (test): The focused prompt renders a slim active cursor with deterministic fallback when terminal cursor-shape control is unavailable. Evidence: `runtime:evidence/implement-tui-prompt-editor-polish/active-cursor-visible.json`

### `implement-tui-thinking-transcript` — Implement Persistent Thinking Transcript

- Goal: Keep root thinking progress in its own persistent dimmed region and final assistant output in a separate authoritative region.
- Executor instructions: Use Flue thinking events for best-effort progress and root message_end for authoritative assistant text; nested workers remain internal. Follow artifact:implementation-plan exactly, use only worker-local internal specialists, emit durable typed progress, and stop before any unassigned file or unapproved mutation.
- Inputs: artifact:implementation-plan, artifact:beta-release-contract, artifact:tui-prompt-editor-polish-change, artifact:agent-runtime-change
- Resources: project:tui-thinking-transcript
- Permissions: read [artifact:implementation-plan, artifact:beta-release-contract, artifact:tui-prompt-editor-polish-change, artifact:agent-runtime-change, tui/ratatui/, docs/architecture/tui-cli-session-flow.md]; write [tui/ratatui/ event reducer/transcript files assigned to this member, semantic transcript projection files assigned to this member, focused replay/live/framebuffer/product tests assigned to this member]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `240` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes approval-service-authorized files for Implement Persistent Thinking Transcript.
- Rollback: Restore this member's exclusively owned files from the pre-change Git commit while preserving unrelated members.
- Approval required: `true`
- Acceptance:
  - `scope-and-file-ownership` (policy): The change stays inside this member's implementation-plan file ownership; shared files are serialized and no parallel member edits the same file. Evidence: `runtime:evidence/implement-tui-thinking-transcript/scope-and-file-ownership.json`
  - `repository-mutations-approved` (policy): Every repository write has a current fail-closed approval-service decision bound to the exact path, mutation or command digest, run, scope, approver, and time. Evidence: `runtime:evidence/implement-tui-thinking-transcript/repository-mutations-approved.json`
  - `progress-visible` (artifact): Durable typed progress covers work admission, handoffs, tool execution, approval, verification, blockers, and completion. Evidence: `runtime:evidence/implement-tui-thinking-transcript/progress-visible.json`
  - `focused-verification` (test): Focused automated tests and output-level product evidence pass for every changed behavior. Evidence: `runtime:evidence/implement-tui-thinking-transcript/focused-verification.json`
  - `rel-tui-004-separate-sinks` (test): REL-TUI-004: thinking and assistant deltas never share a replacement anchor; final assistant settlement preserves the completed thinking block. Evidence: `runtime:evidence/implement-tui-thinking-transcript/rel-tui-004-separate-sinks.json`
  - `stream-replay-parity` (test): Live rendering and resumed transcript projection produce the same ordered thinking, operation, and final-assistant document without duplication or hidden final lines. Evidence: `runtime:evidence/implement-tui-thinking-transcript/stream-replay-parity.json`

### `implement-connector-approval-controls` — Implement Connector Approval Controls

- Goal: Render and settle action approvals in a TUI drop-up matching the slash-command menu display pattern and in Telegram with connector-aware identity, explicit allow scopes, and fail-closed unavailable states.
- Executor instructions: Bridge the shared approval service through typed gateway/connector contracts; do not put orchestration or approval authority in the TUI. Implement the TUI selector as a drop-up above the prompt using the slash-command menu display pattern, never as a third status row. Follow artifact:implementation-plan exactly, use only worker-local internal specialists, emit durable typed progress, and stop before any unassigned file or unapproved mutation.
- Inputs: artifact:implementation-plan, artifact:beta-release-contract, artifact:file-access-approval-gate-change, artifact:ingress-operations-change, artifact:tui-thinking-transcript-change, decision:d3-file-access-gate, decision:d5-canonical-runtime-configuration, artifact:runtime-configuration-consolidation-change, decision:d6-tui-approval-surface-placement, artifact:tui-status-context-meter-change
- Resources: project:connector-approval-controls
- Permissions: read [artifact:implementation-plan, artifact:beta-release-contract, artifact:file-access-approval-gate-change, artifact:ingress-operations-change, artifact:tui-thinking-transcript-change, decision:d3-file-access-gate, src/api/, src/channels/, tui/ratatui/, decision:d5-canonical-runtime-configuration, doc/decisions/d5-canonical-runtime-configuration.md, artifact:runtime-configuration-consolidation-change, decision:d6-tui-approval-surface-placement, doc/decisions/d6-tui-approval-surface-placement.md, artifact:tui-status-context-meter-change]; write [approval ingress/route files assigned to this member, Telegram approval delivery files assigned to this member, tui/ratatui/ approval UI files assigned to this member, focused connector and packaged approval tests assigned to this member]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `240` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes approval-service-authorized files for Implement Connector Approval Controls.
- Rollback: Restore this member's exclusively owned files from the pre-change Git commit while preserving unrelated members.
- Approval required: `true`
- Acceptance:
  - `scope-and-file-ownership` (policy): The change stays inside this member's implementation-plan file ownership; shared files are serialized and no parallel member edits the same file. Evidence: `runtime:evidence/implement-connector-approval-controls/scope-and-file-ownership.json`
  - `repository-mutations-approved` (policy): Every repository write has a current fail-closed approval-service decision bound to the exact path, mutation or command digest, run, scope, approver, and time. Evidence: `runtime:evidence/implement-connector-approval-controls/repository-mutations-approved.json`
  - `progress-visible` (artifact): Durable typed progress covers work admission, handoffs, tool execution, approval, verification, blockers, and completion. Evidence: `runtime:evidence/implement-connector-approval-controls/progress-visible.json`
  - `focused-verification` (test): Focused automated tests and output-level product evidence pass for every changed behavior. Evidence: `runtime:evidence/implement-connector-approval-controls/focused-verification.json`
  - `rel-app-001-actionable-controls` (test): REL-APP-001: TUI and Telegram create, display, approve, deny, expire, and settle the same typed request under their own connector identity. Evidence: `runtime:evidence/implement-connector-approval-controls/rel-app-001-actionable-controls.json`
  - `connector-awareness` (test): The response and control surface use the current trusted connector and never describe Telegram behavior to a TUI request or vice versa. Evidence: `runtime:evidence/implement-connector-approval-controls/connector-awareness.json`
  - `missing-surface-fails-closed` (test): A connector that cannot render or settle an approval leaves the mutation blocked and reports an actionable non-secret status. Evidence: `runtime:evidence/implement-connector-approval-controls/missing-surface-fails-closed.json`
  - `canonical-telegram-config` (test): Telegram connector credentials and approval behavior resolve through canonical typed configuration without connector-local .env discovery or secret-bearing status output. Evidence: `runtime:evidence/implement-connector-approval-controls/canonical-telegram-config.json`
  - `tui-approval-selector-placement` (test): The TUI renders a drop-up approval selector above the prompt using the slash-command menu display pattern, with Deny, Allow once, and Allow for session choices while preserving the fixed two-row status bar, prompt input, transcript scrolling and selection, slash-command navigation, resize behavior, and visible pending state. Evidence: `runtime:evidence/implement-connector-approval-controls/tui-approval-selector-placement.json`
  - `approval-scope-semantics` (test): Deny blocks the exact request, allow_once settles only the exact approved operation and cannot replay, and allow_for_session expires when the bound session changes; unavailable or ambiguous selector state remains fail-closed. Evidence: `runtime:evidence/implement-connector-approval-controls/approval-scope-semantics.json`

### `implement-image-reasoning-worker` — Implement Image Reasoning Worker

- Goal: Add a dedicated Flue worker for image inspection and reasoning with typed requests, bounded artifacts, and verified results.
- Executor instructions: Keep image generation and image reasoning distinct. Attach only the tools and model capabilities declared by the worker profile. Follow artifact:implementation-plan exactly, use only worker-local internal specialists, emit durable typed progress, and stop before any unassigned file or unapproved mutation.
- Inputs: artifact:implementation-plan, artifact:beta-release-contract, artifact:runtime-root-layout-change, artifact:agent-runtime-change
- Resources: project:image-reasoning-worker
- Permissions: read [artifact:implementation-plan, artifact:beta-release-contract, artifact:runtime-root-layout-change, artifact:agent-runtime-change, src/engine/workers/, src/engine/tools/]; write [image-reasoning worker files assigned to this member, worker registry/schema/docs files assigned to this member, focused image worker tests assigned to this member]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `240` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes approval-service-authorized files for Implement Image Reasoning Worker.
- Rollback: Restore this member's exclusively owned files from the pre-change Git commit while preserving unrelated members.
- Approval required: `true`
- Acceptance:
  - `scope-and-file-ownership` (policy): The change stays inside this member's implementation-plan file ownership; shared files are serialized and no parallel member edits the same file. Evidence: `runtime:evidence/implement-image-reasoning-worker/scope-and-file-ownership.json`
  - `repository-mutations-approved` (policy): Every repository write has a current fail-closed approval-service decision bound to the exact path, mutation or command digest, run, scope, approver, and time. Evidence: `runtime:evidence/implement-image-reasoning-worker/repository-mutations-approved.json`
  - `progress-visible` (artifact): Durable typed progress covers work admission, handoffs, tool execution, approval, verification, blockers, and completion. Evidence: `runtime:evidence/implement-image-reasoning-worker/progress-visible.json`
  - `focused-verification` (test): Focused automated tests and output-level product evidence pass for every changed behavior. Evidence: `runtime:evidence/implement-image-reasoning-worker/focused-verification.json`
  - `rel-img-001-worker-contract` (test): REL-IMG-001: the orchestrator delegates image reasoning to one registered lead worker that returns schema-valid observations, confidence, provenance, and artifacts. Evidence: `runtime:evidence/implement-image-reasoning-worker/rel-img-001-worker-contract.json`
  - `image-data-bounded` (policy): Raw image bytes and secrets are not copied into progress/event evidence; durable artifacts use governed paths and metadata. Evidence: `runtime:evidence/implement-image-reasoning-worker/image-data-bounded.json`

### `implement-document-index` — Implement Per-Database Document Index

- Goal: Implement governed per-database document storage, drop-folder ingestion, indexing, provenance, retrieval, and rebuild behavior.
- Executor instructions: Keep source documents, index artifacts, retrieved context, session memory, and durable project memory distinct. Follow artifact:implementation-plan exactly, use only worker-local internal specialists, emit durable typed progress, and stop before any unassigned file or unapproved mutation.
- Inputs: artifact:implementation-plan, artifact:beta-release-contract, artifact:runtime-root-layout-change, artifact:memory-retrieval-change
- Resources: project:document-index
- Permissions: read [artifact:implementation-plan, artifact:beta-release-contract, artifact:runtime-root-layout-change, artifact:memory-retrieval-change, src/engine/memory/, src/engine/rag/]; write [document-index source files assigned to this member, ingest/retrieval schemas and routes assigned to this member, focused index, rebuild, and retrieval tests assigned to this member]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `240` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes approval-service-authorized files for Implement Per-Database Document Index.
- Rollback: Restore this member's exclusively owned files from the pre-change Git commit while preserving unrelated members.
- Approval required: `true`
- Acceptance:
  - `scope-and-file-ownership` (policy): The change stays inside this member's implementation-plan file ownership; shared files are serialized and no parallel member edits the same file. Evidence: `runtime:evidence/implement-document-index/scope-and-file-ownership.json`
  - `repository-mutations-approved` (policy): Every repository write has a current fail-closed approval-service decision bound to the exact path, mutation or command digest, run, scope, approver, and time. Evidence: `runtime:evidence/implement-document-index/repository-mutations-approved.json`
  - `progress-visible` (artifact): Durable typed progress covers work admission, handoffs, tool execution, approval, verification, blockers, and completion. Evidence: `runtime:evidence/implement-document-index/progress-visible.json`
  - `focused-verification` (test): Focused automated tests and output-level product evidence pass for every changed behavior. Evidence: `runtime:evidence/implement-document-index/focused-verification.json`
  - `rel-doc-001-ingest-retrieve` (test): REL-DOC-001: each configured database ingests its owned drop folder, records source hash/provenance, retrieves only scoped documents, and handles duplicate/change/delete deterministically. Evidence: `runtime:evidence/implement-document-index/rel-doc-001-ingest-retrieve.json`
  - `index-rebuildable` (test): Index artifacts can be rebuilt from durable source records without becoming the source of truth. Evidence: `runtime:evidence/implement-document-index/index-rebuildable.json`

### `implement-protocol-scoring` — Implement Protocol Enforcement And Scoring

- Goal: Complete release protocol records, activate fail-closed pre-execution enforcement, and implement orchestrator/critic plus Sasser Theorem scoring.
- Executor instructions: Preserve protocols as SQLite runtime rules loaded through the Protocol Tool. Do not turn protocols into skills or hardcode them in the orchestrator. Follow artifact:implementation-plan exactly, use only worker-local internal specialists, emit durable typed progress, and stop before any unassigned file or unapproved mutation.
- Inputs: artifact:implementation-plan, artifact:beta-release-contract, artifact:capabilities-security-change, artifact:agent-runtime-change
- Resources: project:protocol-scoring
- Permissions: read [artifact:implementation-plan, artifact:beta-release-contract, artifact:capabilities-security-change, artifact:agent-runtime-change, docs/architecture/protocol-system.md, src/core/protocols/]; write [protocol records/provider/tool files assigned to this member, orchestrator/critic scoring files assigned to this member, Sasser Theorem specification/fixtures assigned to this member, focused enforcement and evaluation tests assigned to this member]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `240` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes approval-service-authorized files for Implement Protocol Enforcement And Scoring.
- Rollback: Restore this member's exclusively owned files from the pre-change Git commit while preserving unrelated members.
- Approval required: `true`
- Acceptance:
  - `scope-and-file-ownership` (policy): The change stays inside this member's implementation-plan file ownership; shared files are serialized and no parallel member edits the same file. Evidence: `runtime:evidence/implement-protocol-scoring/scope-and-file-ownership.json`
  - `repository-mutations-approved` (policy): Every repository write has a current fail-closed approval-service decision bound to the exact path, mutation or command digest, run, scope, approver, and time. Evidence: `runtime:evidence/implement-protocol-scoring/repository-mutations-approved.json`
  - `progress-visible` (artifact): Durable typed progress covers work admission, handoffs, tool execution, approval, verification, blockers, and completion. Evidence: `runtime:evidence/implement-protocol-scoring/progress-visible.json`
  - `focused-verification` (test): Focused automated tests and output-level product evidence pass for every changed behavior. Evidence: `runtime:evidence/implement-protocol-scoring/focused-verification.json`
  - `rel-proto-001-policy-records` (artifact): REL-PROTO-001: complete enabled release records cover global, connector, project, workflow, task, output, safety, approval, and progress behavior. Evidence: `runtime:evidence/implement-protocol-scoring/rel-proto-001-policy-records.json`
  - `rel-proto-002-fail-closed` (test): REL-PROTO-002: reasoning, tool execution, delegation, and final response cannot proceed without a current valid Protocol Tool result. Evidence: `runtime:evidence/implement-protocol-scoring/rel-proto-002-fail-closed.json`
  - `rel-proto-003-stage-scoring` (test): REL-PROTO-003: orchestrator and critic scoring cover every required stage and fail closed on missing, invalid, or rejected evidence. Evidence: `runtime:evidence/implement-protocol-scoring/rel-proto-003-stage-scoring.json`
  - `rel-proto-004-sasser-theorem` (test): REL-PROTO-004: the approved Sasser Theorem contract has versioned dimensions, fixtures, thresholds, deterministic scoring evidence, and release evaluation. Evidence: `runtime:evidence/implement-protocol-scoring/rel-proto-004-sasser-theorem.json`

### `resolve-d5-canonical-runtime-configuration` — Resolve D5 Canonical Runtime Configuration

- Goal: Record one canonical, install-relative environment-file contract for source builds, packaged runtime, providers, connectors, tools, workers, and future onboarding.
- Executor instructions: Record and verify the owner-established canonical sim-one.config.example and sim-one.config contract, runtime-root loading behavior, package secret boundary, controlled Coding Worker assistance, and onboarding ownership in doc/decisions/d5-canonical-runtime-configuration.md.
- Inputs: artifact:baseline-context, artifact:product-spec-runtime-configuration, artifact:architecture-spec-runtime-configuration, artifact:acceptance-spec-runtime-configuration, artifact:open-questions-runtime-configuration, artifact:runtime-configuration-inventory
- Resources: project:resolve-d5-canonical-runtime-configuration
- Permissions: read [artifact:baseline-context, artifact:product-spec-runtime-configuration, artifact:architecture-spec-runtime-configuration, artifact:acceptance-spec-runtime-configuration, artifact:open-questions-runtime-configuration, artifact:runtime-configuration-inventory, doc/product-spec-runtime-configuration.md, doc/architecture-spec-runtime-configuration.md, doc/acceptance-spec-runtime-configuration.md, doc/open-questions-runtime-configuration.md, doc/runtime-configuration-inventory.md, doc/decisions/d5-canonical-runtime-configuration.md, decisions.json, specification-manifest.json]; write [doc/decisions/d5-canonical-runtime-configuration.md]; external [—]; destructive `false`
- Execution: max `1` attempt(s), `60` minute(s); The recorded owner decision and all status surfaces agree.
- Side effects: `reversible` — Produces or updates one owner-visible decision record.
- Rollback: Restore the prior decision record and invalidate only its declared affected nodes.
- Approval required: `false`
- Acceptance:
  - `decision-status-consistent` (policy): doc/decisions/d5-canonical-runtime-configuration.md, decisions.json, specification-manifest.json, and runtime evidence all record Resolved without an implicit alternate selection. Evidence: `runtime:evidence/resolve-d5-canonical-runtime-configuration/decision-status.json`

### `implement-runtime-configuration-consolidation` — Implement Canonical Runtime Configuration

- Goal: Consolidate all implemented SIM-ONE-owned environment configuration into one typed, install-relative, package-safe runtime contract with controlled Coding Worker assistance.
- Executor instructions: Implement D5 as one serialized cross-domain configuration workstream after the shared core, agent, capability, ingress, and runtime-root contracts. Follow artifact:implementation-plan file ownership exactly. Use the Coding Worker lead and worker-local specialists, request fail-closed approval before every write, never expose secret values in progress or evidence, and stop before unassigned files or a second production configuration source.
- Inputs: artifact:implementation-plan, artifact:beta-release-contract, decision:d5-canonical-runtime-configuration, artifact:core-contracts-change, artifact:agent-runtime-change, artifact:capabilities-security-change, artifact:ingress-operations-change, artifact:runtime-root-layout-change
- Resources: project:runtime-configuration
- Permissions: read [artifact:implementation-plan, artifact:beta-release-contract, decision:d5-canonical-runtime-configuration, doc/product-spec-runtime-configuration.md, doc/architecture-spec-runtime-configuration.md, doc/acceptance-spec-runtime-configuration.md, doc/open-questions-runtime-configuration.md, doc/runtime-configuration-inventory.md, doc/decisions/d5-canonical-runtime-configuration.md, .env.example, .gitignore, package.json, src/core/config/, src/agents/, src/channels/, src/engine/, sim-one-cli/, tui/ratatui/, scripts/, docs/reference/configuration.md]; write [sim-one.config.example, .env.example migration/deprecation content assigned exclusively to this member, .gitignore entries assigned exclusively to this member, src/core/config/ files assigned exclusively to this member, environment consumers assigned exclusively to this member, sim-one-cli/ configuration files assigned exclusively to this member, tui/ratatui/ configuration launcher files assigned exclusively to this member, scripts/ configuration build and package files assigned exclusively to this member, focused configuration tests and documentation assigned exclusively to this member]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `300` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes only approval-service-authorized canonical configuration, consumer, launcher, build, package, test, and documentation files assigned to this serialized member.
- Rollback: Restore this member files from the pre-change Git commit while preserving the last valid owner configuration outside Git.
- Approval required: `true`
- Acceptance:
  - `rel-cfg-001-canonical-files` (test): REL-CFG-001: tracked sim-one.config.example and ignored owner sim-one.config are the only supported SIM-ONE environment-file pair; the packaged runtime resolves <runtime-root>/sim-one.config without HOME, cwd, repository .env, or shell inheritance as a production fallback. Evidence: `runtime:evidence/implement-runtime-configuration-consolidation/rel-cfg-001-canonical-files.json`
  - `key-registry-complete` (schema): A typed registry covers every implemented key in doc/runtime-configuration-inventory.md, including Telegram, GitHub PAT, model providers, web research, memory, RAG, schedules, approvals, capabilities, protocols, Runpod, and MCP token slots; aliases and test controls remain explicitly classified. Evidence: `runtime:evidence/implement-runtime-configuration-consolidation/key-registry-coverage.json`
  - `canonical-load-order` (test): The canonical configuration loads before Flue agents, provider registration, connectors, stores, schedules, CLI/TUI launchers, and worker capabilities consume environment values; production consumers no longer discover scattered .env files independently. Evidence: `runtime:evidence/implement-runtime-configuration-consolidation/load-order-and-consumers.json`
  - `build-and-package-secret-boundary` (test): Local owner builds copy sim-one.config into the movable runtime root with owner-only permissions, while public release assembly includes sim-one.config.example and excludes sim-one.config, .env files, secret values, and local runtime data. Evidence: `runtime:evidence/implement-runtime-configuration-consolidation/build-and-package-boundary.json`
  - `coding-worker-config-boundary` (policy): Coding Worker configuration assistance is governed by the chat.runtime-configuration-routing base protocol and uses a dedicated trusted capability with redacted reads, schema validation, fail-closed approval-bound atomic writes, no general sandbox access, and only exact secret values explicitly supplied by the user for the current update without readback or value-bearing output. Evidence: `runtime:evidence/implement-runtime-configuration-consolidation/coding-worker-config-boundary.json`
  - `runtime-configuration-protocol-routing` (policy): The chat.runtime-configuration-routing base protocol applies to chat messages, requires orchestrator delegation to the Coding Worker lead with the active protocol bundle, routes all configuration access through the dedicated tools, and prohibits secret echo or reuse. Evidence: `runtime:evidence/implement-runtime-configuration-consolidation/runtime-configuration-protocol.json`
  - `approval-and-progress-visible` (policy): Every repository mutation is approved through the current fail-closed Coding Worker approval service, and typed progress records implementation, handoffs, tool execution, verification, blockers, and completion. Evidence: `runtime:evidence/implement-runtime-configuration-consolidation/approval-and-progress.json`

### `verify-runtime-configuration-consolidation` — Verify Canonical Runtime Configuration

- Goal: Prove the integrated SIM-ONE build uses one complete, relocatable, secret-safe runtime configuration contract across product and worker surfaces.
- Executor instructions: Run the exact focused tests, integrated build checks, arbitrary-cwd and moved-runtime-root probes, archive inspections, key-inventory coverage checks, and redaction/approval tests declared by artifact:implementation-plan. Use fixture secrets only, retain bounded output evidence, and do not call live providers.
- Inputs: artifact:runtime-configuration-consolidation-change, decision:d5-canonical-runtime-configuration, artifact:integrated-change, artifact:runtime-build, artifact:sim-one-tui-build, artifact:cli-build
- Resources: isolated-runtime-configuration-probe
- Permissions: read [authorized project tree, artifact:runtime-configuration-consolidation-change, decision:d5-canonical-runtime-configuration, artifact:integrated-change, artifact:runtime-build, artifact:sim-one-tui-build, artifact:cli-build, doc/product-spec-runtime-configuration.md, doc/architecture-spec-runtime-configuration.md, doc/acceptance-spec-runtime-configuration.md, doc/open-questions-runtime-configuration.md, doc/runtime-configuration-inventory.md, sim-one.config.example]; write [external:tmp/sim-one-configuration-test-home, external:tmp/sim-one-configuration-runtime-root, isolated configuration test artifacts]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `90` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Creates only isolated configuration fixtures and verification evidence.
- Rollback: Remove the isolated fixture roots and rerun against the same integrated build.
- Approval required: `false`
- Acceptance:
  - `configuration-suite-passed` (test): The focused configuration suite proves registry completeness, parse and validation behavior, aliases, redacted diagnostics, load order, and absence of independent production .env discovery. Evidence: `runtime:evidence/verify-runtime-configuration-consolidation/configuration-suite.json`
  - `local-build-runtime-passed` (test): A local-owner build fixture copies sim-one.config with owner-only permissions and launches Node, sim-one, and the SIM-ONE TUI from an arbitrary cwd and moved non-HOME runtime tree using the same values. Evidence: `runtime:evidence/verify-runtime-configuration-consolidation/local-build-runtime.json`
  - `public-package-boundary-passed` (test): A public-package fixture includes sim-one.config.example but excludes sim-one.config, all .env files, secret values, databases, logs, and user data. Evidence: `runtime:evidence/verify-runtime-configuration-consolidation/public-package-boundary.json`
  - `implemented-integration-coverage` (review): Telegram, GitHub PAT, implemented providers, tools, workers, memory, RAG, schedules, approvals, and MCP slots resolve through the canonical registry; Gmail and Google remain explicitly absent until an implementation consumes named keys. Evidence: `runtime:evidence/verify-runtime-configuration-consolidation/integration-coverage.json`
  - `coding-worker-secret-boundary-passed` (test): Coding Worker configuration reads remain redacted; user-supplied secret writes fail closed without exact approval, reject unknown or invalid keys, use atomic replacement, preserve mode 0600, never expose stored values, and never echo supplied values in approval metadata, progress, logs, tool results, or final responses. Evidence: `runtime:evidence/verify-runtime-configuration-consolidation/coding-worker-secret-boundary.json`
  - `runtime-configuration-protocol-passed` (test): Protocol tests prove chat.runtime-configuration-routing is selected for chat messages but not unrelated event kinds, both main and Coding Worker workspace contracts instruct the exact route, and the Coding Worker receives the protocol bundle. Evidence: `runtime:evidence/verify-runtime-configuration-consolidation/runtime-configuration-protocol.json`

### `resolve-d6-tui-approval-surface-placement` — Resolve D6 TUI Approval Surface Placement

- Goal: Record the owner-selected drop-up approval interface above the prompt, following the slash-command menu display pattern while keeping the status surface at two rows.
- Executor instructions: Record and verify the owner-selected drop-up approval interface above the prompt. Preserve a fixed two-row status surface and do not retain the temporary-row alternative as an open option.
- Inputs: artifact:baseline-context, artifact:product-spec, artifact:architecture-spec, artifact:acceptance-spec, artifact:open-questions
- Resources: project:resolve-d6-tui-approval-surface-placement
- Permissions: read [artifact:baseline-context, artifact:product-spec, artifact:architecture-spec, artifact:acceptance-spec, artifact:open-questions, doc/product-spec.md, doc/architecture-spec.md, doc/acceptance-spec.md, doc/open-questions.md, doc/decisions/d6-tui-approval-surface-placement.md, decisions.json, specification-manifest.json, tui/ratatui/src/ui.rs, tui/ratatui/src/app.rs]; write [doc/decisions/d6-tui-approval-surface-placement.md]; external [—]; destructive `false`
- Execution: max `1` attempt(s), `60` minute(s); The drop-up placement decision and all status surfaces agree.
- Side effects: `reversible` — Produces or updates one owner-visible TUI layout decision record.
- Rollback: Restore the prior decision record and invalidate only the two declared TUI consumers.
- Approval required: `false`
- Acceptance:
  - `decision-status-consistent` (policy): doc/decisions/d6-tui-approval-surface-placement.md, decisions.json, specification-manifest.json, and runtime evidence all record Resolved with the drop-up approval interface selected. Evidence: `runtime:evidence/resolve-d6-tui-approval-surface-placement/decision-status.json`
  - `drop-up-contract-recorded` (review): The decision fixes a two-row status surface and a separate approval drop-up above the prompt using the slash-command menu display pattern, with no temporary third status row. Evidence: `runtime:evidence/resolve-d6-tui-approval-surface-placement/drop-up-contract.json`

### `implement-capability-management-worker` — Implement Capability Management Worker

- Goal: Create the dedicated capability-manager worker and shared lifecycle service that safely administer user- and agent-added skills, tools, workers, and MCP servers through the existing runtime registry.
- Executor instructions: Implement the built-in capability-manager as a Flue lead worker owned by the orchestrator. Reuse one typed lifecycle service from both worker tools and the sim-one CLI. Preserve the runtime capability registry as authority, keep secrets in canonical runtime configuration, require trusted approvals for agent-driven mutations, emit public typed progress, and stop before any unassigned file or approval boundary. Require the applicable Protocol Tool bundle for validation and mutation requests, apply its directives before deterministic lifecycle checks, and preserve protocol ids and applied rules in redacted lifecycle evidence.
- Inputs: artifact:implementation-plan, artifact:beta-release-contract, artifact:capabilities-security-change, artifact:agent-runtime-change, decision:d5-canonical-runtime-configuration
- Resources: project:capability-management-worker
- Permissions: read [artifact:implementation-plan, artifact:beta-release-contract, artifact:capabilities-security-change, artifact:agent-runtime-change, decision:d5-canonical-runtime-configuration, src/engine/capabilities/, src/engine/approvals/, src/agents/orchestrator.ts, sim-one-cli/, scripts/capability-admin.mjs, docs/architecture/capability-system.md, docs/architecture/registry-system.md, docs/architecture/worker-system.md, src/core/types/core.ts, src/core/protocols/, src/engine/tools/protocol-tool.ts]; write [src/engine/workers/capability-manager/, shared capability lifecycle service files assigned to this member, serialized orchestrator and sim-one CLI capability-routing files assigned to this member, focused capability-manager tests and documentation assigned to this member]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `300` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes approval-service-authorized files for the dedicated capability-management worker and shared lifecycle service.
- Rollback: Restore this member's exclusively owned files from the pre-change Git commit and restore the prior orchestrator/CLI routing after disabling the new worker.
- Approval required: `true`
- Acceptance:
  - `scope-and-file-ownership` (policy): The change stays inside this member's implementation-plan file ownership; shared orchestrator, capability-service, CLI, documentation, and test files are serialized after their existing owners. Evidence: `runtime:evidence/implement-capability-management-worker/scope-and-file-ownership.json`
  - `registry-mutations-approved` (policy): Every agent-requested registry mutation has a current fail-closed approval-service decision bound to actor, session, capability kind/id, operation, source/version or MCP endpoint metadata, scope, approver, and time. Evidence: `runtime:evidence/implement-capability-management-worker/registry-mutations-approved.json`
  - `rel-cap-002-dedicated-worker` (test): REL-CAP-002: capability lifecycle requests from the orchestrator are delegated to one built-in capability-manager worker; the orchestrator no longer owns direct add/update/remove/enable/disable capability tools, while authenticated users retain the sim-one CLI. Evidence: `runtime:evidence/implement-capability-management-worker/rel-cap-002-dedicated-worker.json`
  - `shared-lifecycle-service` (test): The capability-manager worker and sim-one CLI use one typed lifecycle service for list, inspect, validate, add, update, enable, disable, and remove across skill, tool, worker, and MCP records; neither surface reimplements SQLite or materialization rules. Evidence: `runtime:evidence/implement-capability-management-worker/shared-lifecycle-service.json`
  - `enablement-policy` (policy): Agent-added executable tools, workers, and MCP servers remain disabled until an explicit enable approval; skills may activate only inside the approved installation transaction and remain subordinate to protocols and attached capabilities. Evidence: `runtime:evidence/implement-capability-management-worker/enablement-policy.json`
  - `capability-validation` (test): Capability validation enforces safe ids, cross-kind and built-in collision checks, exact source version resolution, expected Flue export/skill contracts, managed runtime-root paths, and rollback of partial registry/materialization failures. Evidence: `runtime:evidence/implement-capability-management-worker/capability-validation.json`
  - `mcp-secret-boundary` (policy): MCP records store endpoint, transport, and canonical configuration key references without storing credential values; results, progress, approval evidence, and diagnostics remain redacted. Evidence: `runtime:evidence/implement-capability-management-worker/mcp-secret-boundary.json`
  - `progress-and-result` (artifact): Every lifecycle operation emits durable typed progress and returns the resulting record, materialization/connection validation, activation state, and whether a gateway restart is required. Evidence: `runtime:evidence/implement-capability-management-worker/progress-and-result.json`
  - `focused-verification` (test): Focused service, worker-routing, CLI-parity, approval, restart, rollback, and packaged-product tests pass for all four capability kinds. Evidence: `runtime:evidence/implement-capability-management-worker/focused-verification.json`
  - `protocol-routed-validation` (policy): Every capability-manager validate or mutation request consumes the applicable Protocol Tool bundle, fails closed when that bundle is absent or malformed, applies the bundle directives before deterministic lifecycle validation, and records protocol ids plus applied rules in redacted lifecycle evidence. Evidence: `runtime:evidence/implement-capability-management-worker/protocol-routed-validation.json`

### `implement-coding-worker-capability-authoring` — Implement Coding Worker Capability Authoring

- Goal: Give the Coding Worker the skills and tools to design, build, validate, test, and package every supported capability kind while leaving runtime installation and activation to the capability-manager worker.
- Executor instructions: Extend only the Coding Worker authoring surface. Add worker-local skills and typed scaffold/validation/handoff tools for skills, tools, workers, and MCP packages. Keep all source changes inside the selected repository/project, use current Flue contracts, emit public progress, and hand validated artifacts to the capability-manager instead of mutating the runtime registry. Route classification, validation, security checks, tests, packaging, and handoff through the applicable Protocol Tool bundle and include protocol ids plus applied rules in the typed handoff.
- Inputs: artifact:implementation-plan, artifact:beta-release-contract, artifact:capabilities-security-change, artifact:coding-worker-scaffold-tooling-change, artifact:file-access-approval-gate-change, decision:d2-workspace-root-isolation, decision:d5-canonical-runtime-configuration
- Resources: project:coding-worker-capability-authoring
- Permissions: read [artifact:implementation-plan, artifact:beta-release-contract, artifact:capabilities-security-change, artifact:coding-worker-scaffold-tooling-change, artifact:file-access-approval-gate-change, decision:d2-workspace-root-isolation, decision:d5-canonical-runtime-configuration, src/engine/workers/coding-worker/, docs/architecture/capability-system.md, docs/architecture/skill-system.md, docs/architecture/tool-system.md, docs/architecture/worker-system.md, Flue documentation through the worker-owned documentation capability, src/core/types/core.ts, src/core/protocols/, src/engine/tools/protocol-tool.ts]; write [Coding Worker capability-authoring skills and tools assigned to this member, Coding Worker workspace guidance assigned to this member, selected workspace repo/project capability source files after file-edit approval, focused capability-authoring fixtures and tests assigned to this member]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `300` minute(s); Every acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Changes approval-service-authorized Coding Worker authoring files and selected workspace capability source files.
- Rollback: Restore this member's exclusively owned Coding Worker files and generated workspace source changes from their pre-change revisions without altering the runtime capability registry.
- Approval required: `true`
- Acceptance:
  - `scope-and-file-ownership` (policy): The change stays inside this member's implementation-plan file ownership and is serialized after Coding Worker scaffold tooling and file-approval enforcement for every shared worker file. Evidence: `runtime:evidence/implement-coding-worker-capability-authoring/scope-and-file-ownership.json`
  - `authoring-boundary` (policy): Every generated or edited capability source file is scoped to the selected workspace repository/project and has a current file-edit approval; the authoring member cannot write the runtime capability database or managed capability directory. Evidence: `runtime:evidence/implement-coding-worker-capability-authoring/authoring-boundary.json`
  - `rel-cw-007-authoring-skills` (test): REL-CW-007: the Coding Worker owns registered process skills for capability classification/design plus skill, tool, worker, and MCP authoring, validation, testing, and handoff. Evidence: `runtime:evidence/implement-coding-worker-capability-authoring/rel-cw-007-authoring-skills.json`
  - `scaffold-and-validate-tools` (test): Worker-local typed tools scaffold and validate SKILL.md packages, defineTool modules, defineAgentProfile worker packages, and MCP server/connection packages without requiring direct registry access. Evidence: `runtime:evidence/implement-coding-worker-capability-authoring/scaffold-and-validate-tools.json`
  - `reproducible-handoff` (test): Authoring validation uses current Flue and SIM-ONE contracts, verifies imports/exports and tests in the selected repository, scans for secrets and unsafe host paths, and produces a reproducible source/version/content-digest handoff. Evidence: `runtime:evidence/implement-coding-worker-capability-authoring/reproducible-handoff.json`
  - `mcp-authoring-boundary` (policy): MCP authoring distinguishes building an MCP server from registering an MCP connection; credentials are represented only by canonical configuration key names and never written into source or handoff artifacts. Evidence: `runtime:evidence/implement-coding-worker-capability-authoring/mcp-authoring-boundary.json`
  - `handoff-contract` (schema): The final handoff names kind, id, display metadata, source reference, exact version, content digest, validation evidence, required configuration keys, requested activation state, and the capability-manager operation to perform. Evidence: `runtime:evidence/implement-coding-worker-capability-authoring/handoff-contract.json`
  - `progress-visible` (artifact): Durable typed progress covers classification, scaffold, edits, tests, security validation, packaging, and handoff without exposing hidden reasoning or secrets. Evidence: `runtime:evidence/implement-coding-worker-capability-authoring/progress-visible.json`
  - `focused-verification` (test): Focused tests generate, validate, package, and hand off fixtures for each capability kind and prove the capability-manager, not the Coding Worker, owns runtime installation and activation. Evidence: `runtime:evidence/implement-coding-worker-capability-authoring/focused-verification.json`
  - `protocol-routed-authoring-validation` (policy): Coding Worker capability classification, source validation, security checks, tests, packaging, and handoff consume the applicable Protocol Tool bundle; the handoff records protocol ids and applied rules and cannot substitute worker-local policy for protocol directives. Evidence: `runtime:evidence/implement-coding-worker-capability-authoring/protocol-routed-authoring-validation.json`

### `resolve-d7-separate-project-and-task-graphs` — Separate Project And Task Lifecycle Graphs

- Goal: Keep repository development governance separate from per-request task execution while defining a governed cross-graph adapter.
- Executor instructions: Verify and preserve doc/decisions/d7-separate-project-and-task-graphs.md. Compare the current source and version-matched Flue documentation against the grounded baseline context. Record alternatives, consequences, affected consumers, and revisit triggers without claiming implementation.
- Inputs: artifact:baseline-context
- Resources: doc/decisions/d7-separate-project-and-task-graphs.md
- Permissions: read [artifact:baseline-context, AGENTS.md, docs/architecture/, src/, crates/gorombo-memory/, version-matched Flue documentation, doc/decisions/d7-separate-project-and-task-graphs.md, decisions.json, specification-manifest.json]; write [doc/decisions/d7-separate-project-and-task-graphs.md]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `45` minute(s); The decision record is source-grounded, internally consistent, and bound to every affected consumer.
- Side effects: `reversible` — Creates or updates doc/decisions/d7-separate-project-and-task-graphs.md.
- Rollback: Restore doc/decisions/d7-separate-project-and-task-graphs.md from version control and invalidate its affected consumers.
- Approval required: `false`
- Acceptance:
  - `decision-record-complete` (artifact): The decision records its question, selected approach, rationale, rejected alternatives, consequences, affected graph consumers, and revisit trigger without overstating current implementation. Evidence: `doc/decisions/d7-separate-project-and-task-graphs.md`

### `resolve-d8-memory-helper-task-runs` — Extend Memory Helper For Durable Task Runs

- Goal: Make the Rust/WASM Memory Helper the shared durable task-state authority and eliminate competing task-run state.
- Executor instructions: Verify and preserve doc/decisions/d8-memory-helper-task-runs.md. Compare the current source and version-matched Flue documentation against the grounded baseline context. Record alternatives, consequences, affected consumers, and revisit triggers without claiming implementation.
- Inputs: artifact:baseline-context
- Resources: doc/decisions/d8-memory-helper-task-runs.md
- Permissions: read [artifact:baseline-context, AGENTS.md, docs/architecture/, src/, crates/gorombo-memory/, version-matched Flue documentation, doc/decisions/d8-memory-helper-task-runs.md, decisions.json, specification-manifest.json]; write [doc/decisions/d8-memory-helper-task-runs.md]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `45` minute(s); The decision record is source-grounded, internally consistent, and bound to every affected consumer.
- Side effects: `reversible` — Creates or updates doc/decisions/d8-memory-helper-task-runs.md.
- Rollback: Restore doc/decisions/d8-memory-helper-task-runs.md from version control and invalidate its affected consumers.
- Approval required: `false`
- Acceptance:
  - `decision-record-complete` (artifact): The decision records its question, selected approach, rationale, rejected alternatives, consequences, affected graph consumers, and revisit trigger without overstating current implementation. Evidence: `doc/decisions/d8-memory-helper-task-runs.md`

### `resolve-d9-flue-native-task-graph-runtime` — Use Flue-Native Task Graph Runtime

- Goal: Add application-owned task graph coordination while preserving Flue as the only agent runtime.
- Executor instructions: Verify and preserve doc/decisions/d9-flue-native-task-graph-runtime.md. Compare the current source and version-matched Flue documentation against the grounded baseline context. Record alternatives, consequences, affected consumers, and revisit triggers without claiming implementation.
- Inputs: artifact:baseline-context
- Resources: doc/decisions/d9-flue-native-task-graph-runtime.md
- Permissions: read [artifact:baseline-context, AGENTS.md, docs/architecture/, src/, crates/gorombo-memory/, version-matched Flue documentation, doc/decisions/d9-flue-native-task-graph-runtime.md, decisions.json, specification-manifest.json]; write [doc/decisions/d9-flue-native-task-graph-runtime.md]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `45` minute(s); The decision record is source-grounded, internally consistent, and bound to every affected consumer.
- Side effects: `reversible` — Creates or updates doc/decisions/d9-flue-native-task-graph-runtime.md.
- Rollback: Restore doc/decisions/d9-flue-native-task-graph-runtime.md from version control and invalidate its affected consumers.
- Approval required: `false`
- Acceptance:
  - `decision-record-complete` (artifact): The decision records its question, selected approach, rationale, rejected alternatives, consequences, affected graph consumers, and revisit trigger without overstating current implementation. Evidence: `doc/decisions/d9-flue-native-task-graph-runtime.md`

### `resolve-d10-sealed-node-context` — Seal Per-Node Context Envelopes

- Goal: Make exact bounded context envelopes and capability absence enforceable for every model-executed task graph node.
- Executor instructions: Verify and preserve doc/decisions/d10-sealed-node-context.md. Compare the current source and version-matched Flue documentation against the grounded baseline context. Record alternatives, consequences, affected consumers, and revisit triggers without claiming implementation.
- Inputs: artifact:baseline-context
- Resources: doc/decisions/d10-sealed-node-context.md
- Permissions: read [artifact:baseline-context, AGENTS.md, docs/architecture/, src/, crates/gorombo-memory/, version-matched Flue documentation, doc/decisions/d10-sealed-node-context.md, decisions.json, specification-manifest.json]; write [doc/decisions/d10-sealed-node-context.md]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `45` minute(s); The decision record is source-grounded, internally consistent, and bound to every affected consumer.
- Side effects: `reversible` — Creates or updates doc/decisions/d10-sealed-node-context.md.
- Rollback: Restore doc/decisions/d10-sealed-node-context.md from version control and invalidate its affected consumers.
- Approval required: `false`
- Acceptance:
  - `decision-record-complete` (artifact): The decision records its question, selected approach, rationale, rejected alternatives, consequences, affected graph consumers, and revisit trigger without overstating current implementation. Evidence: `doc/decisions/d10-sealed-node-context.md`

### `resolve-d11-shared-task-graph-engine` — Share Task Graph Engine Across Agents

- Goal: Use one graph engine for orchestrator and Coding Worker definitions while preserving private worker subgraphs and DLG authority.
- Executor instructions: Verify and preserve doc/decisions/d11-shared-task-graph-engine.md. Compare the current source and version-matched Flue documentation against the grounded baseline context. Record alternatives, consequences, affected consumers, and revisit triggers without claiming implementation.
- Inputs: artifact:baseline-context
- Resources: doc/decisions/d11-shared-task-graph-engine.md
- Permissions: read [artifact:baseline-context, AGENTS.md, docs/architecture/, src/, crates/gorombo-memory/, version-matched Flue documentation, doc/decisions/d11-shared-task-graph-engine.md, decisions.json, specification-manifest.json]; write [doc/decisions/d11-shared-task-graph-engine.md]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `45` minute(s); The decision record is source-grounded, internally consistent, and bound to every affected consumer.
- Side effects: `reversible` — Creates or updates doc/decisions/d11-shared-task-graph-engine.md.
- Rollback: Restore doc/decisions/d11-shared-task-graph-engine.md from version control and invalidate its affected consumers.
- Approval required: `false`
- Acceptance:
  - `decision-record-complete` (artifact): The decision records its question, selected approach, rationale, rejected alternatives, consequences, affected graph consumers, and revisit trigger without overstating current implementation. Evidence: `doc/decisions/d11-shared-task-graph-engine.md`

### `specify-task-lifecycle-architecture` — Specify Task Lifecycle Graph Architecture

- Goal: Synthesize the five accepted architecture decisions into one implementation-independent task lifecycle graph contract.
- Executor instructions: Maintain docs/architecture/task-lifecycle-graphs.md as the normative architecture specification. Keep current behavior, accepted target behavior, implementation boundaries, acceptance evidence, and graph ownership explicit.
- Inputs: artifact:baseline-context, decision:d7-separate-project-and-task-graphs, decision:d8-memory-helper-task-runs, decision:d9-flue-native-task-graph-runtime, decision:d10-sealed-node-context, decision:d11-shared-task-graph-engine
- Resources: docs/architecture/task-lifecycle-graphs.md
- Permissions: read [artifact:baseline-context, docs/architecture/task-lifecycle-graphs.md, docs/architecture/README.md, docs/architecture/overview.md, decision:d7-separate-project-and-task-graphs, doc/decisions/d7-separate-project-and-task-graphs.md, decision:d8-memory-helper-task-runs, doc/decisions/d8-memory-helper-task-runs.md, decision:d9-flue-native-task-graph-runtime, doc/decisions/d9-flue-native-task-graph-runtime.md, decision:d10-sealed-node-context, doc/decisions/d10-sealed-node-context.md, decision:d11-shared-task-graph-engine, doc/decisions/d11-shared-task-graph-engine.md]; write [docs/architecture/task-lifecycle-graphs.md]; external [—]; destructive `false`
- Execution: max `2` attempt(s), `60` minute(s); Every architecture acceptance criterion has durable, independently inspectable evidence.
- Side effects: `reversible` — Creates or updates the task lifecycle graph architecture specification.
- Rollback: Restore docs/architecture/task-lifecycle-graphs.md from version control and invalidate downstream planning and implementation.
- Approval required: `false`
- Acceptance:
  - `dual-graph-boundary-complete` (policy): The specification keeps DLG and TLG definitions, run state, authority, mutation, and evidence separate while defining a governed adapter. Evidence: `docs/architecture/task-lifecycle-graphs.md`
  - `memory-helper-boundary-complete` (review): The specification uses the Rust/WASM Memory Helper as shared durable task state and distinguishes user-visible checklist projection from execution state. Evidence: `docs/architecture/task-lifecycle-graphs.md`
  - `flue-context-boundary-complete` (policy): The specification preserves Flue ownership and requires sealed per-node context envelopes, typed broker requests, interrupts, checkpoints, and bounded recovery. Evidence: `docs/architecture/task-lifecycle-graphs.md`
  - `shared-engine-boundary-complete` (policy): The specification requires one shared graph engine with separate validated definitions and private worker subgraph state while preserving DLG definition, run-state, mutation, and evidence authority through retry-safe compare-and-swap, stale-version rejection, idempotent operation identity, and unknown-outcome recovery. Evidence: `docs/architecture/task-lifecycle-graphs.md`

### `specify-flue-v2-migration` — Specify Flue 2 Migration

- Goal: Translate the official Flue 2.0.1 migration contract and SIM-ONE current implementation into one implementation-ready, graph-bound migration specification.
- Executor instructions: Maintain the normative Flue 2 migration specification from official Flue 2.0.1 sources and observed SIM-ONE beta.1 behavior. Do not rewrite current-state architecture documents as if migration were already implemented.
- Inputs: artifact:baseline-context
- Resources: docs/architecture/flue-v2-migration.md, specification-manifest.json, docs/architecture/README.md
- Permissions: read [artifact:baseline-context, package.json, pnpm-lock.yaml, flue.config.ts, src/, sim-one-cli/, tui/ratatui/, scripts/, .github/workflows/, docs/, openwiki/, development-graph.json, development-graph.md, specification-manifest.json, decisions.json]; write [docs/architecture/flue-v2-migration.md, specification-manifest.json, docs/architecture/README.md]; external [https://flueframework.com/docs/guide/migration/, https://flueframework.com/docs/, https://github.com/withastro/flue/blob/main/CHANGELOG.md, https://www.npmjs.com/package/@flue/runtime]; destructive `false`
- Execution: max `2` attempt(s), `120` minute(s); Every migration acceptance criterion is represented in the specification and the specification manifest verifies against the current graph.
- Side effects: `reversible` — Creates or updates the Flue 2 migration specification and its manifest binding.
- Rollback: Restore the specification and manifest from version control, then invalidate downstream planning and implementation.
- Approval required: `false`
- Acceptance:
  - `official-checklist-mapped` (review): All 13 official Flue 2 migration checklist items are mapped to observed SIM-ONE beta.1 source, runtime, packaging, documentation, and test surfaces with required changes and evidence. Evidence: `docs/architecture/flue-v2-migration.md`
  - `product-contracts-preserved` (policy): The target preserves Flue ownership, protocol-first orchestration, runtime capability registries, connector-owned session policy, approval boundaries, the movable .gorombo product runtime, and the SIM-ONE TUI product contract. Evidence: `docs/architecture/flue-v2-migration.md`
  - `reset-boundary-explicit` (policy): The reset-only Flue persistence boundary is explicit, no beta database is silently reused or deleted, and any unresolved history-retention choice is recorded before implementation crosses the storage boundary. Evidence: `docs/architecture/flue-v2-migration.md`
  - `delivery-slices-bounded` (review): Implementation is sequenced into dependency-ordered, stackable milestones whose pull requests each remain below 100 changed files, with shared contracts landing before dependent slices. Evidence: `docs/architecture/flue-v2-migration.md`
  - `verification-and-docs-mapped` (test): The specification names focused and full production verification for agents, tools, providers, persistence, sessions, HTTP, Telegram, TUI streaming, packaging, and documentation. Evidence: `docs/architecture/flue-v2-migration.md`
  - `architecture-indexed` (review): The migration specification is registered in the architecture documentation index and the repository documentation checker passes. Evidence: `docs/architecture/README.md`

### `migrate-flue-v2-foundation` — Migrate Flue 2 Foundation

- Goal: Establish checklist items 1 through 3 and the provider foundation from item 9: coordinated package pins, Vite build/config, explicit routing, and Pi provider registration, with exact handoff diagnostics for dependent source conversions.
- Executor instructions: Establish official Flue 2 checklist items 1-3 and provider requirements without compatibility shims. Use tests first, preserve product routes, record exact downstream compiler/build diagnostics, and stop before agent/tool conversion. Full repository green status belongs to the final stacked verification node.
- Inputs: artifact:baseline-context, artifact:flue-v2-migration-spec
- Resources: package.json, pnpm-lock.yaml, vite.config.ts, flue.config.ts, scripts/run-flue.mjs, src/app.ts, src/core/models/, sim-one-cli/package.json, docs/architecture/flue-v2-migration.md
- Permissions: read [artifact:baseline-context, artifact:flue-v2-migration-spec, package.json, pnpm-lock.yaml, flue.config.ts, scripts/, src/app.ts, src/core/models/, src/tests/, docs/architecture/flue-v2-migration.md, sim-one-cli/package.json]; write [package.json, pnpm-lock.yaml, vite.config.ts, flue.config.ts, scripts/run-flue.mjs, src/app.ts, src/core/models/, src/tests/models.test.ts, src/tests/build-script-regressions.test.ts, src/tests/architecture-contract.test.ts, sim-one-cli/package.json, docs/architecture/flue-v2-migration.md]; external [https://flueframework.com/docs/guide/migration/, https://flueframework.com/docs/guide/models/, https://flueframework.com/docs/guide/routing/, https://flueframework.com/docs/guide/node-target/, https://www.npmjs.com/]; destructive `false`
- Execution: max `3` attempt(s), `240` minute(s); All focused foundation acceptance evidence passes, downstream migration diagnostics are recorded, and the changed-file count is below 100.
- Side effects: `reversible` — Migrates the dependency, build, route, and provider foundation in the authorized worktree.
- Rollback: Restore milestone files from the prior Git commit.
- Approval required: `false`
- Acceptance:
  - `foundation-under-file-cap` (policy): The milestone changes fewer than 100 tracked files and records the exact changed-file count before commit or PR preparation. Evidence: `runtime:evidence/migrate-flue-v2-foundation/file-count.json`
  - `flue-2-pins` (test): All coordinated @flue packages are pinned to the same verified 2.0.1 release and required Vite, Pi, and sandbox dependencies are declared without a beta Flue package remaining in the lockfile. Evidence: `runtime:evidence/migrate-flue-v2-foundation/package-pins.json`
  - `vite-build-contract` (test): Vite owns dev/build, flue.config.ts uses @flue/runtime/config without root/output, and Vite resolves the Node project through the foundation into an exact downstream migration diagnostic; executable server artifact verification is reserved for the final stacked verification node. Evidence: `runtime:evidence/migrate-flue-v2-foundation/vite-build.json`
  - `explicit-routing-contract` (test): src/app.ts explicitly mounts the orchestrator agent router while preserving health, auth, custom API routes, schedules, telemetry, approvals, and Telegram administration. Evidence: `runtime:evidence/migrate-flue-v2-foundation/routing.json`
  - `pi-provider-contract` (test): RunPod, Ollama cloud/local, and Codex Brain providers use Pi createProvider plus Flue setProvider while preserving model-card metadata and canonical runtime credential lookup. Evidence: `runtime:evidence/migrate-flue-v2-foundation/providers.json`
  - `foundation-focused-verification` (test): Focused package, routing, provider, and configuration checks pass; repository-wide typecheck and Vite build diagnostics are captured as explicit downstream handoff evidence rather than hidden or bypassed. Evidence: `runtime:evidence/migrate-flue-v2-foundation/verification.json`

### `migrate-flue-v2-agents-workers` — Migrate Flue 2 Agents And Workers

- Goal: Convert the orchestrator and built-in worker hierarchy to synchronous Flue 2 agent functions, hooks, subagent definitions, explicit sandbox ownership, and the named application router binding.
- Executor instructions: Convert only agents, worker composition, and the explicit named-agent router import. Preserve protocol-first orchestration, worker ownership, progress, and workspace boundaries. Record exact beta tool diagnostics for the following capability stack instead of adding compatibility shims.
- Inputs: artifact:flue-v2-foundation-change
- Resources: src/app.ts, src/agents/, src/engine/workers/, src/workspace-loader.ts
- Permissions: read [artifact:flue-v2-foundation-change, src/app.ts, src/agents/, src/engine/workers/, src/workspace/, src/workspace-loader.ts, src/engine/registries/, src/tests/, docs/architecture/flue-v2-migration.md]; write [src/app.ts, src/agents/, src/engine/workers/, src/workspace-loader.ts, src/tests/ files assigned exclusively to agent and worker migration]; external [https://flueframework.com/docs/guide/agents/, https://flueframework.com/docs/guide/agent-hooks/, https://flueframework.com/docs/guide/subagents/, https://flueframework.com/docs/guide/sandboxes/, https://flueframework.com/docs/guide/routing/]; destructive `false`
- Execution: max `3` attempt(s), `300` minute(s); All focused built-in agent, router, and worker contracts pass, the exact downstream capability compiler boundary is recorded, and the changed-file count is below 100.
- Side effects: `reversible` — Migrates built-in agent and worker composition plus the named application router binding.
- Rollback: Restore milestone files from the prior stacked commit.
- Approval required: `false`
- Acceptance:
  - `agents-under-file-cap` (policy): The milestone changes fewer than 100 tracked files and records the exact changed-file count. Evidence: `runtime:evidence/migrate-flue-v2-agents-workers/file-count.json`
  - `agent-function-contract` (test): Every built-in agent is a discovered exported capitalized synchronous function in a use-agent module with exactly one root useModel declaration and supported statics. Evidence: `runtime:evidence/migrate-flue-v2-agents-workers/agents.json`
  - `agent-router-contract` (test): The explicit application router imports and mounts the named orchestrator agent function required by Flue 2. Evidence: `runtime:evidence/migrate-flue-v2-agents-workers/routing.json`
  - `worker-ownership-preserved` (test): The orchestrator exposes only lead workers; worker-internal subagents remain worker-owned; runtime-added worker definitions have one validated Flue 2 adapter. Evidence: `runtime:evidence/migrate-flue-v2-agents-workers/workers.json`
  - `sandbox-boundaries-preserved` (test): The orchestrator has no generic mutable filesystem surface and coding workers retain explicit runtime-root-scoped sandbox access. Evidence: `runtime:evidence/migrate-flue-v2-agents-workers/sandboxes.json`
  - `agents-focused-verification` (test): Focused orchestrator, worker, delegation, workspace, routing, and type checks pass; compiler diagnostics owned by the following capability stack are recorded exactly as handoff evidence. Evidence: `runtime:evidence/migrate-flue-v2-agents-workers/verification.json`

### `migrate-flue-v2-capabilities` — Migrate Flue 2 Tools Skills MCP And Registries

- Goal: Convert built-in and runtime-extensible capability contracts to Flue 2 tools, skills, MCP connections, registries, scaffolds, approval-preserving adapters, and authorized agent mounts.
- Executor instructions: Convert tools, skills, MCP connections, registries, runtime package contracts, and their agent mount points consistently. Preserve protocol-first routing, capability ownership, credentials, and approval boundaries. Do not add beta compatibility shims or migrate session, workflow, and connector lifecycle APIs assigned to later stacks.
- Inputs: artifact:flue-v2-agents-workers-change
- Resources: src/agents/orchestrator.ts, src/engine/tools/, src/skills/, src/engine/capabilities/, src/engine/registries/, src/engine/workers/capability-manager/, src/engine/workers/coding-worker/
- Permissions: read [artifact:flue-v2-agents-workers-change, package.json, node_modules/@flue/, src/agents/orchestrator.ts, src/channels/telegram.ts, src/engine/tools/, src/skills/, src/engine/capabilities/, src/engine/registries/, src/engine/workers/capability-manager/, src/engine/workers/coding-worker/, scripts/, src/tests/, docs/architecture/flue-v2-migration.md]; write [src/agents/orchestrator.ts, src/channels/telegram.ts tool definition only, src/engine/tools/, src/skills/, src/engine/capabilities/, src/engine/registries/, src/engine/workers/capability-manager/, src/engine/workers/coding-worker/coding-worker.ts, src/engine/workers/coding-worker/runtime-capabilities.ts, src/engine/workers/coding-worker/skills.ts, src/engine/workers/coding-worker/capability-authoring/, src/engine/workers/coding-worker/github/, src/engine/workers/coding-worker/skills/, src/engine/workers/coding-worker/tools/, scripts/generate-builtin-registry.mjs, scripts/capability-admin.mjs, scripts/test-capability-product.mjs, src/tests/ files assigned exclusively to capability migration]; external [https://flueframework.com/docs/guide/tools/, https://flueframework.com/docs/guide/skills/, https://flueframework.com/docs/guide/mcp/]; destructive `false`
- Execution: max `3` attempt(s), `360` minute(s); All owned capability contracts, mounts, and generated forms pass focused verification below the file cap, with exact later-stack diagnostics recorded.
- Side effects: `reversible` — Migrates capability contracts, registries, generated forms, and authorized agent mounts.
- Rollback: Restore milestone files from the prior stacked commit.
- Approval required: `false`
- Acceptance:
  - `capabilities-under-file-cap` (policy): The milestone changes fewer than 100 tracked files and records the exact changed-file count. Evidence: `runtime:evidence/migrate-flue-v2-capabilities/file-count.json`
  - `tool-contract-complete` (test): Every built-in, worker-owned, and generated tool uses input, run({ data }), and valid result envelopes; no beta parameters or execute definition marker remains in the owned capability surface. Evidence: `runtime:evidence/migrate-flue-v2-capabilities/tools.json`
  - `skill-contract-complete` (test): Skill imports and inline skills use Flue 2 SKILL.md and defineSkill semantics without removed import attributes or protocol leakage. Evidence: `runtime:evidence/migrate-flue-v2-capabilities/skills.json`
  - `mcp-contract-complete` (test): Built-in, GitHub, and runtime-added MCP connections use supported Flue 2 connection definitions and hooks while preserving canonical config, ownership, credential, and approval controls. Evidence: `runtime:evidence/migrate-flue-v2-capabilities/mcp.json`
  - `capability-mounts-complete` (test): The orchestrator and coding worker mount their authorized dynamic capability resources without exposing worker-internal agents or bypassing approval gates. Evidence: `runtime:evidence/migrate-flue-v2-capabilities/mounts.json`
  - `runtime-scaffolds-complete` (test): Capability package schemas, validators, scaffolds, CLI add flows, fixtures, and authoring instructions agree on the Flue 2 contracts. Evidence: `runtime:evidence/migrate-flue-v2-capabilities/runtime-packages.json`
  - `capabilities-focused-verification` (test): Focused capability, registry, approval, generated-package, MCP, agent-mount, and type checks pass; exact diagnostics owned by later migration stacks are retained as handoff evidence. Evidence: `runtime:evidence/migrate-flue-v2-capabilities/verification.json`

### `migrate-flue-v2-execution-persistence` — Migrate Flue 2 Execution Persistence And Observability

- Goal: Replace removed workflows and beta session stores with public Flue 2 dispatch/read, distinct persistence, session/history compatibility, schedules, submission observability, and the minimal connector compile bridge required to verify them.
- Executor instructions: Replace removed execution and persistence APIs using only public Flue 2 contracts. Preserve connector-owned sessions and never reuse beta Flue storage. Implement D12 exactly: use db/flue-v2.sqlite, leave beta db/flue.sqlite untouched, preserve sessions.sqlite, and rotate public Flue instance generations for explicit compaction. In src/channels/telegram.ts, change only the named orchestrator export, stable connector session id, and public AgentDispatchRequest shape required for Stack 4 compilation; Stack 5 owns all remaining connector and client behavior. In src/engine/workers/coding-worker/skills.ts, mechanically replace dots in the five built-in process skill ids with single hyphens so Flue 2 validation passes; do not change instructions or behavior.
- Inputs: artifact:flue-v2-capabilities-change, decision:d12-flue-v2-persistence-and-compaction
- Resources: src/workflows/, src/api/routes/chat-events.ts, src/api/routes/chat-sessions.ts, src/engine/session/, src/engine/schedules/, src/core/telemetry/, src/agents/orchestrator.ts, src/channels/telegram.ts, src/engine/workers/coding-worker/skills.ts, src/db.ts, src/core/config/gorombo-config.ts, src/core/config/gorombo.config.json
- Permissions: read [artifact:flue-v2-capabilities-change, src/workflows/, src/api/, src/engine/session/, src/engine/schedules/, src/core/telemetry/, src/tests/, docs/architecture/flue-v2-migration.md, decision:d12-flue-v2-persistence-and-compaction, src/agents/orchestrator.ts, src/channels/telegram.ts, src/engine/workers/coding-worker/skills.ts, src/db.ts, src/core/config/gorombo-config.ts, src/core/config/gorombo.config.json]; write [src/workflows/, src/api/routes/chat-events.ts, src/api/routes/chat-sessions.ts, src/engine/session/, src/engine/schedules/, src/core/telemetry/, src/tests/ files assigned exclusively to execution and persistence migration, src/agents/orchestrator.ts, src/channels/telegram.ts minimal Flue 2 compile bridge only, src/engine/workers/coding-worker/skills.ts Flue 2 id validation bridge only, src/db.ts, src/core/config/gorombo-config.ts, src/core/config/gorombo.config.json]; external [https://flueframework.com/docs/guide/migration/, https://flueframework.com/docs/guide/workflows/, https://flueframework.com/docs/guide/database/, https://flueframework.com/docs/reference/events/]; destructive `false`
- Execution: max `3` attempt(s), `360` minute(s); Execution, persistence, session, and observability checks pass below the file cap.
- Side effects: `reversible` — Migrates execution and persistence contracts without deleting beta data.
- Rollback: Restore code and point runtime back to the prior package; preserve both persistence namespaces.
- Approval required: `false`
- Acceptance:
  - `execution-under-file-cap` (policy): The milestone changes fewer than 100 tracked files and records the exact changed-file count. Evidence: `runtime:evidence/migrate-flue-v2-execution-persistence/file-count.json`
  - `workflow-removal-complete` (test): No removed Flue workflow or FlueSession API remains; each behavior uses an awaited agent handle, durable tool, or app-owned orchestrator. Evidence: `runtime:evidence/migrate-flue-v2-execution-persistence/workflows.json`
  - `persistence-reset-boundary` (test): Flue 2 uses a distinct persistence path, never opens or deletes beta persistence, and app-owned session/history data follows the recorded compatibility decision. Evidence: `runtime:evidence/migrate-flue-v2-execution-persistence/persistence.json`
  - `chat-facade-contract` (test): The product chat facade uses public dispatch/read behavior and preserves TUI submission semantics without ?wait=result or runtime-internal imports. Evidence: `runtime:evidence/migrate-flue-v2-execution-persistence/chat-facade.json`
  - `observability-contract` (test): Progress and telemetry correlate instanceId and submissionId and settlement outcomes without beta run fields. Evidence: `runtime:evidence/migrate-flue-v2-execution-persistence/observability.json`
  - `execution-focused-verification` (test): Focused session, history, compact, schedules, telemetry, HTTP, restart, and type checks pass. Evidence: `runtime:evidence/migrate-flue-v2-execution-persistence/verification.json`

### `migrate-flue-v2-connectors-clients` — Migrate Flue 2 Connectors And Clients

- Goal: Migrate Telegram, Ratatui, CLI, and remaining clients to conversation-scoped Flue 2 identities, submissions, history, and update streams.
- Executor instructions: Migrate connector and client contracts to conversation-scoped Flue 2 behavior while preserving product UX and connector session policy.
- Inputs: artifact:flue-v2-execution-persistence-change, decision:d12-flue-v2-persistence-and-compaction
- Resources: src/app.ts, src/channels/, src/api/routes/chat-client-facade, sim-one-cli/, tui/, product-packaging
- Permissions: read [artifact:flue-v2-execution-persistence-change, src/app.ts, src/channels/, src/api/routes/chat-events.ts, src/api/routes/chat-sessions.ts, src/api/routes/telegram-admin.ts, src/engine/session/session-transcript.ts, sim-one-cli/, tui/, scripts/test-tui-e2e.mjs, scripts/test-ratatui-product.mjs, src/tests/, docs/architecture/flue-v2-migration.md, package.json, vite.config.ts, scripts/test-ratatui-interactive.py, scripts/test-ratatui-visible-final.py]; write [src/app.ts, src/channels/, src/api/routes/chat-events.ts, src/api/routes/chat-sessions.ts, src/api/routes/telegram-admin.ts, src/engine/session/session-transcript.ts, sim-one-cli/, tui/, scripts/test-tui-e2e.mjs, scripts/test-ratatui-product.mjs, src/tests/ files assigned exclusively to connector and client migration, package.json, vite.config.ts, scripts/test-ratatui-interactive.py, scripts/test-ratatui-visible-final.py]; external [https://flueframework.com/docs/guide/channels/, https://flueframework.com/docs/sdk/create-flue-client/, https://flueframework.com/docs/sdk/flue-client/, https://flueframework.com/docs/reference/streaming-protocol/]; destructive `false`
- Execution: max `3` attempt(s), `420` minute(s); All connector and client tests pass below the file cap.
- Side effects: `reversible` — Migrates connectors, CLI, and terminal clients.
- Rollback: Restore milestone files and prior packaged binaries.
- Approval required: `false`
- Acceptance:
  - `clients-under-file-cap` (policy): The milestone changes fewer than 100 tracked files and records the exact changed-file count. Evidence: `runtime:evidence/migrate-flue-v2-connectors-clients/file-count.json`
  - `telegram-instance-contract` (test): Telegram uses instanceId semantics and preserves its persistent connector-owned conversation policy, pairing, approvals, and restart behavior. Evidence: `runtime:evidence/migrate-flue-v2-connectors-clients/telegram.json`
  - `tui-stream-contract` (test): Ratatui consumes materialized history and conversation update chunks with offset replay, SSE reconnect, UTF-8 safety, deduplication, settlement, reasoning, and tool lifecycle rendering. Evidence: `runtime:evidence/migrate-flue-v2-connectors-clients/tui-stream.json`
  - `tui-session-contract` (test): The packaged TUI starts fresh by default, resumes explicitly, preserves rename/new/compact/exit behavior, starts or reuses the gateway, and shows one final response. Evidence: `runtime:evidence/migrate-flue-v2-connectors-clients/tui-session.json`
  - `client-contract-complete` (test): CLI, SDK, and remaining React/Ink clients use conversation-scoped Flue 2 APIs or have an explicit verified non-production disposition. Evidence: `runtime:evidence/migrate-flue-v2-connectors-clients/clients.json`
  - `clients-focused-verification` (test): Focused Telegram, Rust, CLI, packaged TUI, reconnect, and multi-turn tests pass. Evidence: `runtime:evidence/migrate-flue-v2-connectors-clients/verification.json`

### `migrate-flue-v2-product-packaging` — Migrate Flue 2 Product Packaging

- Goal: Stage the Vite Node output into the movable .gorombo product runtime and preserve launcher, dependency, configuration, service, and arbitrary-cwd behavior.
- Executor instructions: Integrate Vite output into the existing movable product package without changing product names or runtime-root behavior.
- Inputs: artifact:flue-v2-connectors-clients-change, decision:d12-flue-v2-persistence-and-compaction
- Resources: package.json, scripts/, sim-one-cli/
- Permissions: read [artifact:flue-v2-connectors-clients-change, package.json, scripts/, sim-one-cli/, tui/, src/tests/, docs/architecture/flue-v2-migration.md]; write [package.json, pnpm-lock.yaml, scripts/ product build, staging, launcher, and smoke files, sim-one-cli/ packaging files, src/tests/ files assigned exclusively to product packaging]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `360` minute(s); The standalone packaged product passes all product smoke checks below the file cap.
- Side effects: `reversible` — Migrates build staging and product packaging.
- Rollback: Restore packaging files and regenerate the prior product artifact.
- Approval required: `false`
- Acceptance:
  - `packaging-under-file-cap` (policy): The milestone changes fewer than 100 tracked files and records the exact changed-file count. Evidence: `runtime:evidence/migrate-flue-v2-product-packaging/file-count.json`
  - `movable-runtime-contract` (test): The product stages verified Vite Node output under .gorombo/sim-one-alpha and resolves all runtime state from the owner of the movable .gorombo tree, never caller cwd. Evidence: `runtime:evidence/migrate-flue-v2-product-packaging/runtime-root.json`
  - `launcher-parity` (test): sim-one and the packaged TUI start or reuse the gateway, preserve service/local-process detection, and work from an arbitrary directory. Evidence: `runtime:evidence/migrate-flue-v2-product-packaging/launcher.json`
  - `package-content-contract` (test): The package includes required runtime dependencies, workspaces, capability seeds, config example, WASM, and assets without secrets or source-machine absolute paths. Evidence: `runtime:evidence/migrate-flue-v2-product-packaging/package-content.json`
  - `packaging-focused-verification` (test): Build-all, HTTP, CLI, capability-product, arbitrary-cwd, and packaged Ratatui smoke checks pass. Evidence: `runtime:evidence/migrate-flue-v2-product-packaging/verification.json`

### `migrate-flue-v2-documentation` — Update Flue 2 Documentation

- Goal: Update every affected current-state architecture, guide, operations, OpenWiki, example, diagram, and release document after the implementation behavior is verified.
- Executor instructions: Document only verified Flue 2 behavior. Update all affected repo documentation and examples without presenting unimplemented behavior as current.
- Inputs: artifact:flue-v2-product-packaging-change, decision:d12-flue-v2-persistence-and-compaction
- Resources: docs/, openwiki/, README.md
- Permissions: read [artifact:flue-v2-product-packaging-change, docs/, openwiki/, README.md, CONTRIBUTING.md, src/, scripts/, package.json]; write [docs/, openwiki/, README.md, CONTRIBUTING.md, CHANGELOG.md, docs/agent-flow.svg]; external [https://flueframework.com/docs/guide/migration/, https://flueframework.com/docs/]; destructive `false`
- Execution: max `3` attempt(s), `300` minute(s); All documentation and graph checks pass below the file cap.
- Side effects: `reversible` — Updates documentation to match the verified migration.
- Rollback: Restore documentation from the prior stacked commit.
- Approval required: `false`
- Acceptance:
  - `docs-under-file-cap` (policy): The milestone changes fewer than 100 tracked files and records the exact changed-file count. Evidence: `runtime:evidence/migrate-flue-v2-documentation/file-count.json`
  - `current-state-docs` (review): Architecture, Flue map, source maps, session/TUI, connectors, models, tools, skills, workers, registries, build, packaging, installation, and operations docs describe verified Flue 2 behavior with no beta API examples. Evidence: `runtime:evidence/migrate-flue-v2-documentation/current-state.json`
  - `openwiki-current` (review): OpenWiki architecture, workflows, operations, integrations, testing, and source maps match the verified implementation. Evidence: `runtime:evidence/migrate-flue-v2-documentation/openwiki.json`
  - `documentation-verification` (test): Documentation index, links, source references, graph/manifest parity, examples, terminology, and release status checks pass. Evidence: `runtime:evidence/migrate-flue-v2-documentation/verification.json`

### `verify-flue-v2-production-migration` — Verify Flue 2 Production Migration

- Goal: Prove the complete Flue 2 migration through static scans, full automated suites, standalone product flows, persistence boundaries, connector behavior, and graph/documentation parity.
- Executor instructions: Run every configured check and real product flow. Do not infer working status from a process or port. Retain output-level evidence.
- Inputs: artifact:flue-v2-documentation-change, artifact:flue-v2-verification-repair, artifact:flue-v2-memory-smoke-repair, artifact:flue-v2-tui-e2e-repair
- Resources: authorized project tree, .gorombo/, runtime:evidence/verify-flue-v2-production-migration/
- Permissions: read [authorized project tree, node_modules/, artifact:flue-v2-documentation-change, artifact:flue-v2-verification-repair, artifact:flue-v2-memory-smoke-repair, artifact:flue-v2-tui-e2e-repair]; write [.gorombo/, .tmp/, dist/, target/, crates/gorombo-memory/pkg/, runtime:evidence/verify-flue-v2-production-migration/]; external [configured model providers for authorized production smoke tests, loopback gateway]; destructive `false`
- Execution: max `3` attempt(s), `600` minute(s); Every migration acceptance criterion passes and all prospective PR slices remain below 100 files.
- Side effects: `reversible` — Builds and exercises local product artifacts without opening a PR or publishing.
- Rollback: Stop local test processes and remove only generated test/build artifacts.
- Approval required: `false`
- Acceptance:
  - `no-beta-api-remains` (test): A repository-wide static scan finds no removed beta Flue API or beta package pin in production source, scaffolds, fixtures, clients, or documentation examples. Evidence: `runtime:evidence/verify-flue-v2-production-migration/static-scan.json`
  - `all-configured-checks-pass` (test): WASM build, typecheck, unit, Rust, Vite build, CLI, capability product, HTTP, Ratatui, TUI E2E, memory, documentation, graph, and ledger checks all pass. Evidence: `runtime:evidence/verify-flue-v2-production-migration/checks.json`
  - `production-output-proof` (probe): A real packaged multi-turn TUI flow produces correct greeting, tool/worker progress, final responses, session commands, restart history, and clean shutdown from an arbitrary cwd. Evidence: `runtime:evidence/verify-flue-v2-production-migration/tui-product.json`
  - `connector-output-proof` (probe): A real connector flow proves Telegram instance persistence, gateway restart recovery, and correct response delivery. Evidence: `runtime:evidence/verify-flue-v2-production-migration/telegram-product.json`
  - `persistence-proof` (probe): Flue 2 persistence survives restart, beta storage remains untouched, and app-owned session/history behavior matches the approved migration decision. Evidence: `runtime:evidence/verify-flue-v2-production-migration/persistence.json`
  - `stack-ready` (policy): Each dependency-ordered prospective PR remains below 100 changed files, has a detailed commit, and is ready for a stacked non-draft PR only after explicit user approval. Evidence: `runtime:evidence/verify-flue-v2-production-migration/stack.json`

### `resolve-d12-flue-v2-persistence-and-compaction` — Resolve Flue 2 Persistence History And Compaction

- Goal: Bind Flue 2 to a separate persistence namespace while preserving SIM-ONE product sessions and implementing explicit compaction through public runtime generations.
- Executor instructions: Verify and preserve D12 against the installed Flue 2.0.1 public APIs and the SIM-ONE product-session contract. Keep beta Flue storage untouched and bind every affected migration consumer.
- Inputs: artifact:baseline-context
- Resources: doc/decisions/d12-flue-v2-persistence-and-compaction.md
- Permissions: read [artifact:baseline-context, AGENTS.md, docs/architecture/flue-v2-migration.md, docs/architecture/session-context-budget.md, src/engine/session/, src/api/routes/chat-events.ts, version-matched Flue documentation, doc/decisions/d12-flue-v2-persistence-and-compaction.md, decisions.json, specification-manifest.json]; write [doc/decisions/d12-flue-v2-persistence-and-compaction.md]; external [https://flueframework.com/docs/guide/database/, https://flueframework.com/docs/reference/agent-api/, https://flueframework.com/docs/reference/streaming-protocol/]; destructive `false`
- Execution: max `2` attempt(s), `45` minute(s); The decision record is source-grounded, internally consistent, and bound to every affected consumer.
- Side effects: `reversible` — Creates or updates the Flue 2 persistence and compaction decision record.
- Rollback: Restore the decision record and invalidate only its declared migration consumers.
- Approval required: `false`
- Acceptance:
  - `flue-v2-persistence-decision-complete` (artifact): The decision records the exact Flue 2 database path, beta rollback archive, app-owned session/history boundary, public dispatch/read compaction rotation, failure behavior, and affected consumers. Evidence: `doc/decisions/d12-flue-v2-persistence-and-compaction.md`

### `repair-flue-v2-verification-regressions` — Repair Flue 2 Verification Regressions

- Goal: Repair the four bounded regressions found by the final Flue 2 verification without changing migrated runtime architecture.
- Executor instructions: Apply only the three verified corrections exposed by final unit verification, run focused checks first, then typecheck and documentation/graph checks, and preserve the project-scoped Coding Worker boundary.
- Inputs: artifact:flue-v2-agents-workers-change, artifact:flue-v2-execution-persistence-change, artifact:flue-v2-documentation-change
- Resources: src/workflows/research.ts, src/tests/coding-worker.test.ts, docs/architecture/flue-architecture.md
- Permissions: read [artifact:flue-v2-agents-workers-change, artifact:flue-v2-execution-persistence-change, artifact:flue-v2-documentation-change, src/engine/workers/coding-worker/, src/workflows/research.ts, src/tests/coding-worker.test.ts, src/tests/research-workflow.test.ts, src/tests/architecture-contract.test.ts, docs/architecture/flue-architecture.md]; write [src/workflows/research.ts, src/tests/coding-worker.test.ts, docs/architecture/flue-architecture.md, runtime:evidence/repair-flue-v2-verification-regressions/]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `120` minute(s); All four failed contracts pass with no unrelated source changes and the repair milestone is committed and pushed.
- Side effects: `reversible` — Repairs three tracked files and writes local verification evidence.
- Rollback: Revert the bounded repair commit and restore the prior three tracked files.
- Approval required: `false`
- Acceptance:
  - `research-contract-restored` (test): The research workflow prompt preserves explicit providerFailures reporting and tells the researcher to omit unspecified budget controls so depth defaults remain authoritative. Evidence: `runtime:evidence/repair-flue-v2-verification-regressions/research.json`
  - `project-scope-test-corrected` (test): The coding-worker ownership test invokes project-scoped tools with project-root-relative paths while continuing to prove that repository execution is available only through the coding-worker lead. Evidence: `runtime:evidence/repair-flue-v2-verification-regressions/coding-worker.json`
  - `research-ownership-explicit` (test): The current Flue architecture contract explicitly states that the orchestrator must not directly call web search and the architecture contract test passes. Evidence: `runtime:evidence/repair-flue-v2-verification-regressions/documentation.json`
  - `repair-verification-green` (test): Focused tests, typecheck, documentation checks, graph validation, specification verification, and ledger verification pass, and the repair changes fewer than 100 tracked files. Evidence: `runtime:evidence/repair-flue-v2-verification-regressions/verification.json`

### `repair-flue-v2-memory-smoke-harness` — Repair Flue 2 Memory Smoke Harness

- Goal: Migrate the deterministic structured-memory product smoke from removed beta tool execution to the Flue 2 tool contract.
- Executor instructions: Replace only stale beta direct tool invocations in the deterministic memory smoke with the project's shared Flue 2 direct-tool runner, then prove the entire smoke and focused memory contracts.
- Inputs: artifact:flue-v2-capabilities-change, artifact:flue-v2-execution-persistence-change
- Resources: scripts/smoke-memory-helper.mjs, src/engine/tools/direct-tool-runner.ts
- Permissions: read [artifact:flue-v2-capabilities-change, artifact:flue-v2-execution-persistence-change, scripts/smoke-memory-helper.mjs, src/engine/tools/direct-tool-runner.ts, src/engine/tools/, src/engine/workers/coding-worker/tools/, src/tests/, node_modules/@flue/runtime/docs/]; write [scripts/smoke-memory-helper.mjs, runtime:evidence/repair-flue-v2-memory-smoke-harness/]; external [—]; destructive `false`
- Execution: max `3` attempt(s), `120` minute(s); The deterministic memory smoke passes end to end under the Flue 2 tool contract and the bounded milestone is committed and pushed.
- Side effects: `reversible` — Repairs one deterministic product smoke harness and writes local verification evidence.
- Rollback: Revert the bounded memory-smoke repair commit and restore the prior harness.
- Approval required: `false`
- Acceptance:
  - `memory-smoke-uses-flue-v2-tool-contract` (test): The deterministic memory smoke invokes every orchestrator and Coding Worker Flue 2 tool through the shared direct-tool runner and contains no beta execute calls. Evidence: `runtime:evidence/repair-flue-v2-memory-smoke-harness/static-scan.json`
  - `memory-smoke-passes` (probe): The complete memory smoke creates, retrieves, restarts, and verifies orchestrator and Coding Worker structured-memory records with the Flue 2 tool contract. Evidence: `runtime:evidence/repair-flue-v2-memory-smoke-harness/memory-smoke.log`
  - `memory-smoke-repair-verified` (test): Typecheck, focused memory tests, graph validation, specification verification, and ledger verification pass, and the repair changes fewer than 100 tracked files. Evidence: `runtime:evidence/repair-flue-v2-memory-smoke-harness/verification.json`

### `repair-flue-v2-tui-e2e-harness` — Repair Flue 2 TUI E2E Harness

- Goal: Migrate the TUI end-to-end product harness from the removed beta synchronous HTTP contract to the Flue 2 conversation client contract.
- Executor instructions: Replace only the stale beta direct-agent request in scripts/test-tui-e2e.mjs with the installed Flue 2 SDK conversation client, retain the existing live-model and CLI assertions, and prove the built product path.
- Inputs: artifact:flue-v2-connectors-clients-change, artifact:flue-v2-product-packaging-change
- Resources: scripts/test-tui-e2e.mjs, package.json, pnpm-lock.yaml
- Permissions: read [artifact:flue-v2-connectors-clients-change, artifact:flue-v2-product-packaging-change, scripts/test-tui-e2e.mjs, package.json, pnpm-lock.yaml, node_modules/@flue/runtime/docs/, node_modules/@flue/cli/docs/]; write [scripts/test-tui-e2e.mjs, package.json, pnpm-lock.yaml, runtime:evidence/repair-flue-v2-tui-e2e-harness/]; external [configured model provider for authorized TUI E2E smoke, loopback gateway]; destructive `false`
- Execution: max `3` attempt(s), `180` minute(s); The built TUI E2E product path passes through the Flue 2 client contract and the bounded milestone is committed and pushed.
- Side effects: `reversible` — Repairs one product E2E harness, adds the direct Flue 2 SDK dependency, and runs a configured live-model smoke.
- Rollback: Revert the bounded TUI E2E repair commit and restore the prior harness and dependency manifest.
- Approval required: `false`
- Acceptance:
  - `tui-e2e-uses-flue-v2-client-contract` (test): The TUI E2E harness uses the Flue 2 conversation client contract: structured user-message admission followed by durable reply read, with no ?wait query or beta string message body. Evidence: `runtime:evidence/repair-flue-v2-tui-e2e-harness/static-scan.json`
  - `tui-e2e-passes` (probe): The built server accepts the direct agent prompt, settles it through the Flue 2 stream, returns a non-error assistant reply, and the packaged CLI remains runnable. Evidence: `runtime:evidence/repair-flue-v2-tui-e2e-harness/tui-e2e.log`
  - `tui-e2e-repair-verified` (test): Typecheck, graph validation, specification verification, ledger verification, and the TUI E2E product test pass, and the repair changes fewer than 100 tracked files. Evidence: `runtime:evidence/repair-flue-v2-tui-e2e-harness/verification.json`

## Assumptions

- Each runtime run governs one explicitly authorized change against a named Git commit.
- The current commit is project context, not proof that historical implementation is verified.
- The project owner supplies target-specific authority for GitHub, private release-asset staging, irreversible post-observation public release, release-ledger, canary, and production mutations at the declared gates.
- Canary and production deployment commands remain adapter bindings until the project documents an approved deployment mechanism.
- Full live-model TUI probes require valid provider credentials supplied through the canonical runtime configuration, never stored in this graph.
- Every changed source, documentation, generated-definition, and focused-test file is assigned to exactly one implementation workstream; overlapping files are serialized or reconciled by integration.
- development-graph.json is the executable project plan; specification-manifest.json, decisions.json, repository doc/ artifacts, doc/implementation-lineage.md, and docs/getting-started/pre-release-status.md are its bound planning sources. Historical external plans are non-authoritative reference evidence and are not graph inputs.
- Every stable release and planned-work ID in docs/getting-started/pre-release-status.md is required for 0.1.0 Beta; changing that fixed scope requires a new explicit owner decision and graph revision.
- The checked-in definition is deliberately bound to the canonical host checkout . under the project-local graph contract; review worktrees and CI clones may validate or render it, but executable claims require an explicit canonical-root authorization or a separately reviewed rebind.
- The configured pnpm run test:tui smoke proves only the direct built-gateway prompt path and CLI help surface; pnpm run test:tui:ratatui owns packaged sim-one/SIM-ONE TUI session, transcript, interaction, and visible-final evidence, while TypeScript and Rust suites own their narrower contracts.
- Company-owned src/AGENTS.md is an immutable input to ordinary implementation workstreams; changing it requires a separately scoped lifecycle and explicit owner human gate.
- A snapshot:sha256 project context version hashes a newline-delimited manifest of sorted Git-tracked and nonignored untracked project inputs, excluding development-graph.json, generated development-graph.md, specification-manifest.json, ignored build/runtime state, and missing tracked paths; each record contains project-relative path, NUL, file SHA-256, and newline.

## Risks

- Architecture documents or Flue behavior may drift from the context commit; a changed instruction or dependency invalidates downstream evidence.
- A parallel domain may discover a shared contract overlap; the integration node must serialize the repair and preserve unrelated verified branches.
- External GitHub or deployment actions can have uncertain outcomes; adapters must use idempotency fencing, keep release assets private until production observation succeeds, and verify resulting state.
- The full verification matrix is intentionally expensive; omitting a required check requires explicit evidence and human review.
- The graph coordinator is not an operating-system sandbox or distributed scheduler; untrusted commands require an approved isolation layer.
- Current source and documentation still contain mixed persona, workspace, HOME, cwd, and nested runtime-path defaults; REL-RUNTIME-001 must prove one install-relative root and preserve the model-write boundary before release.
- Executing deterministic nodes from a review worktree while project.root names the canonical main checkout could operate on the wrong tree; baseline evidence must reject any unapproved root mismatch before claims.
- External source plans contain historical implementation and package names and can change outside repository history; execution must verify their owner-approved digest manifest, then reconcile them against the repository release ledger, current architecture, and SIM-ONE TUI product terminology before assigning files or behavior.
- Current gateway and packaged SIM-ONE TUI probes do not by themselves prove user-visible approval or complete subagent progress; release review must require separate applicable evidence and reject overclaims.
- Release documentation may conflate implemented Git and GitHub approval with release-gated file write and patch approval, or overstate current critic, connector transport, scheduled trusted-event context or output delivery, verification, configuration, or admin-surface behavior; independent review must compare each current-source claim and documented setting with the exact runtime call path, route registration, trusted-context handoff, persisted result fields, connector delivery path, and configured test command while labeling unimplemented release contracts explicitly.

## Provenance and validation

Project instructions: AGENTS.md, src/AGENTS.md, docs/architecture/README.md, docs/architecture/overview.md, docs/architecture/execution-workflows.md, docs/architecture/protocol-system.md, docs/architecture/retrieval-and-research.md, docs/architecture/skill-system.md, docs/architecture/worker-system.md, docs/architecture/flue-architecture.md, docs/architecture/gorombo-flue-map.md, docs/architecture/product-flow.md, docs/architecture/registry-system.md, docs/architecture/tool-system.md, docs/architecture/capability-system.md, docs/architecture/memory-system.md, docs/architecture/tui-cli-session-flow.md, docs/operations/product-tui.md, docs/tui/ratatui.md, docs/tui/session-management.md, docs/getting-started/pre-release-status.md, .github/workflows/ci.yml

Canonical source: `development-graph.json`

Run these commands from the `graph-development` skill root after setting `PROJECT_ROOT` to this project's root:

```bash
: "${PROJECT_ROOT:?set PROJECT_ROOT to this project directory}"
python3 scripts/validate_graph.py "$PROJECT_ROOT/development-graph.json"
python3 scripts/render_graph.py "$PROJECT_ROOT/development-graph.json" --output "$PROJECT_ROOT/development-graph.md"
python3 scripts/validate_graph.py "$PROJECT_ROOT/development-graph.json" --markdown "$PROJECT_ROOT/development-graph.md"
```
