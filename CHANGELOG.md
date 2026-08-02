# Changelog

All notable user-visible changes to SIM-ONE Alpha are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and SIM-ONE Alpha follows
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - RELEASE_DATE

### Beta Release

The planned first beta release of SIM-ONE Alpha provides a self-hosted,
protocol-governed AI employee runtime built with Flue and the SIM-ONE Framework.

### Added

- Flue 2 runtime architecture with Vite builds, `'use agent'` functions,
  Agent Hooks, explicit agent/channel routers, direct agent handles,
  `defineSubagent(...)` workers, and `defineMcpConnection(...)` integrations.
- Dedicated `flue-v2.sqlite` conversation storage, preserved beta rollback
  storage, and product-session generation rotation for manual compaction.
- Protocol Tool, trusted-event lookup, SQLite protocol provider, and base
  protocol records attached to the governing orchestrator. Complete release
  policies and trusted fail-closed pre-execution enforcement remain release
  gates.
- Durable sessions, memory, RAG, document retrieval, web research, schedules,
  and Rust/WebAssembly structured task memory.
- Research and coding workers that perform specialized work and report results
  to the orchestrator for validation.
- SIM-ONE terminal UI, gateway API, Telegram integration, scheduled jobs, and
  the unified `sim-one` command.
- Runtime management for user- and agent-added skills, tools, workers, and MCP
  servers without rebuilding the product.
- Approval-gated mutation paths, capability collision checks, trusted scoping,
  and governed local actions.
- Model-card configuration, local and cloud embedding support, and
  LanceDB-backed vector retrieval.
- Production installation, onboarding, configuration, usage, architecture,
  extensibility, operations, and contributor documentation.
- MIT licensing and release policies for contributions, conduct, security,
  support, and third-party attributions.
