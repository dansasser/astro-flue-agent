# SIM-ONE Alpha Architecture

This directory contains the product architecture, subsystem contracts, and
engineering implementation references for SIM-ONE Alpha. Start with the
[Architecture Overview](overview.md), then use the sections below to follow a
runtime flow or inspect a specific subsystem.

## Product Architecture

| Document | Scope |
| --- | --- |
| [Architecture Overview](overview.md) | High-level product identity, governed runtime flow, Flue foundation, SIM-ONE governance, persistence, and security boundaries |
| [Execution Workflows](execution-workflows.md) | End-to-end conversational, research, memory, coding, scheduled, capability, and authentication execution flows |
| [Flue Architecture Contract](flue-architecture.md) | Required ownership boundaries for Flue agents, workflows, tools, skills, subagents, models, and application ingress |
| [Flue 2 Migration Specification](flue-v2-migration.md) | Implementation contract for migrating the beta runtime, clients, packaging, persistence, tests, and documentation to Flue 2 |
| [SIM-ONE Alpha Flue Map](gorombo-flue-map.md) | Detailed source ownership map from repository paths to Flue and SIM-ONE responsibilities |

## Governance And Execution

| Document | Scope |
| --- | --- |
| [Orchestrator Flow](orchestrator-flow.md) | Concise connector-to-orchestrator execution path |
| [Protocol System](protocol-system.md) | SQLite protocol storage, trusted selectors, loading, matching, enforcement, and failure behavior |
| [Worker System](worker-system.md) | Researcher, Coding Worker, internal subagents, runtime-added workers, progress, and authority boundaries |
| [Task Lifecycle Graph Architecture](task-lifecycle-graphs.md) | Separate project and task graph authority, durable task state, sealed node context, recovery, and migration contracts |
| [Schedules System](schedules-system.md) | Durable schedule definitions, in-process firing, dispatch, retries, run history, and management surfaces |
| [GitHub MCP And Repository Authentication](github-auth-system.md) | Coding Worker MCP ownership, PAT isolation, anonymous Git, and mutation approvals |

## Capabilities And Extensibility

| Document | Scope |
| --- | --- |
| [Capability System](capability-system.md) | Built-in and runtime-added skills, tools, workers, and MCP servers |
| [Registry System](registry-system.md) | Typed built-in registries and runtime capability discoverability |
| [Tool System](tool-system.md) | Model-callable tool ownership, registration, implementation, and side-effect boundaries |
| [Skill System](skill-system.md) | Product, worker-local, and runtime skill discovery, trust, lifecycle, and authoring |
| [Astro Docs MCP](astro-docs-mcp.md) | Built-in Astro documentation MCP connection, registry behavior, and security boundary |

## Context, Retrieval, And Models

| Document | Scope |
| --- | --- |
| [Memory System](memory-system.md) | Rust/WebAssembly structured memory, SQLite durability, trusted scope, retrieval, and tests |
| [Retrieval And Research](retrieval-and-research.md) | RAG ownership, document indexing, embeddings, web research, caching, and context packing |
| [Model System](model-system.md) | Provider registration, model cards, runtime selection, and context-budget metadata |
| [Session Context Budget](session-context-budget.md) | Durable Flue sessions, persistence, compaction, retrieval allocation, and session commands |

## Product And Interface Engineering

| Document | Scope |
| --- | --- |
| [Product Runtime And Interface Flow](product-flow.md) | Current gateway, product surface, command, capability, session, response, and trust flow |
| [TUI, CLI, And Session Flow](tui-cli-session-flow.md) | Technical command routing, terminal implementation, durable transcript replay, streams, and slash commands |

## Engineering Standards

| Document | Scope |
| --- | --- |
| [Schema Strategy](schema-strategy.md) | Valibot schema placement, derived types, shared contracts, and runtime validation rules |

## Documentation Boundaries

- Product-facing installation, configuration, command, and usage instructions
  live in the [documentation hub](../README.md).
- Architecture documents explain system contracts and implementation ownership;
  they do not replace user guides or API references.
- Technical interface documents may name implementation technologies such as
  Ratatui. Product-facing documentation uses SIM-ONE terminal UI or TUI.
- Repository source and tests are authoritative when an implementation detail
  differs from a document.
