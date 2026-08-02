---
name: worker-authoring
description: Use when creating or revising a specialized Flue worker profile and workspace for SIM-ONE.
---

# Worker Authoring

Load and apply the applicable protocol bundle before validation.

Create a Flue 2 `defineSubagent(...)` entrypoint and a worker-owned `workspace/AGENTS.md`. Keep the worker specialized, attach only capabilities it owns, and return structured results and public progress rather than hidden internal reasoning.

Workers are invoked by the main orchestrator. Internal worker subagents remain private to their owning worker and must not be exposed as top-level orchestrator capabilities.

Use the Coding Worker authoring tools for scaffold, deterministic validation, and typed handoff. Runtime workers are installed disabled and require a separate approved enable operation through `capability-manager`.
