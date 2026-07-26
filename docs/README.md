# SIM-ONE Alpha Documentation

This directory contains the canonical product, operations, reference, and
architecture documentation for SIM-ONE Alpha.

## Start Here

| Goal | Documentation |
| --- | --- |
| Check pre-release availability | [Pre-Release Status](getting-started/pre-release-status.md) |
| Install the product | [Installation](getting-started/installation.md) |
| Complete first-run setup | [Onboarding](getting-started/onboarding.md) |
| Use the terminal interface and durable sessions | [Terminal And Session Guide](guides/terminal-and-sessions.md) |
| Configure models, credentials, storage, memory, and services | [Configuration Reference](reference/configuration.md) |
| Connect Telegram, the Web API, or another connector | [Connectors And Pairing](guides/connectors.md) |
| Add skills, tools, workers, or MCP servers | [Extending SIM-ONE Alpha](guides/extending-sim-one.md) |
| Look up product commands | [CLI Reference](reference/cli.md) |
| Integrate with the gateway | [HTTP API Reference](reference/http-api.md) |
| Understand governance and execution | [Architecture Overview](architecture/overview.md) |
| Trace protocols, workers, retrieval, and workflows | [Execution Workflows](architecture/execution-workflows.md) |
| Diagnose an installed system | [Troubleshooting](operations/troubleshooting.md) |

## Interactive Codebase Explorer

[SIM-ONE Alpha on DeepWiki](https://deepwiki.com/dansasser/sim-one-alpha)
provides generated architecture diagrams, source-linked explanations, and Ask
Devin for repository-grounded questions.

DeepWiki is generated from repository source and serves as an interactive
exploration companion. The versioned documentation in this repository remains
the authoritative product and architecture contract.

## Product Guides

- [Pre-Release Status](getting-started/pre-release-status.md) separates
  source-available behavior from the remaining `0.1.0 Beta` release gates.
- [Installation](getting-started/installation.md) covers the packaged installer,
  source builds, installed paths, and verification.
- [Onboarding](getting-started/onboarding.md) covers credentials,
  authorization, first chat, and connector pairing.
- [Terminal And Session Guide](guides/terminal-and-sessions.md) covers the
  terminal layout, explicit session lifecycle, restored history, compaction,
  and slash commands.
- [Connectors And Pairing](guides/connectors.md) covers trusted connector
  ingress, Telegram pairing and allow lists, groups, Web API access, and
  scheduled execution.
- [Extending SIM-ONE Alpha](guides/extending-sim-one.md) covers built-in and
  runtime capability layers, sources, versions, approvals, and lifecycle.

## Reference

- [Configuration Reference](reference/configuration.md)
- [CLI Reference](reference/cli.md)
- [HTTP API Reference](reference/http-api.md)

## Architecture

- [Architecture Index](architecture/README.md)
- [Architecture Overview](architecture/overview.md)
- [Flue Architecture Contract](architecture/flue-architecture.md)
- [Orchestrator Flow](architecture/orchestrator-flow.md)
- [Protocol System](architecture/protocol-system.md)
- [Tool System](architecture/tool-system.md)
- [Skill System](architecture/skill-system.md)
- [Worker System](architecture/worker-system.md)
- [Retrieval And Research](architecture/retrieval-and-research.md)
- [Execution Workflows](architecture/execution-workflows.md)
- [Capability System](architecture/capability-system.md)
- [Registry System](architecture/registry-system.md)
- [Memory System](architecture/memory-system.md)
- [Model System](architecture/model-system.md)
- [Schedules System](architecture/schedules-system.md)

## Operations

- [Troubleshooting](operations/troubleshooting.md)
- [Telegram Connector Operations](operations/telegram-connector.md)
- [Product TUI Operations](operations/product-tui.md)

## Framework Documentation

- [SIM-ONE Framework](https://simoneframework.org/)
- [Flue](https://flueframework.com/)

The in-repository guides are versioned with the product. Framework sites explain
the underlying governance and runtime models.

## Documentation Boundaries

Product users should begin with the guides and references above. Detailed
source maps, implementation plans, generated research snapshots, agent process
instructions, and archived documents are maintained for engineering history;
they are not the installed-product contract.
