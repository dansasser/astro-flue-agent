# Acceptance Specification: Install-Relative Runtime Root

## ACC-ROOT-001: Arbitrary Caller Working Directory

Launch the packaged `sim-one` command from an unrelated directory. The server,
TUI, databases, workspace, approvals, capabilities, auth, and logs all resolve
under the owning `.gorombo` tree.

## ACC-ROOT-002: Moved Runtime Tree

Move or copy the complete product tree to a non-HOME installation root and
launch it. No subsystem falls back to the previous HOME path or caller cwd.

## ACC-ROOT-003: Shared Typed Paths

Server, CLI, TUI, capability commands, approval service, memory, schedules,
session persistence, GitHub auth, and Coding Worker report the same runtime
root and their expected child paths.

## ACC-ROOT-004: Workspace Separation

The installed persona is read-only at
`sim-one-alpha/workspace/`; Coding Worker output is created under
`workspace/repos/` or `workspace/projects/`; approval and auth state remain
outside that workspace.

## ACC-ROOT-005: No Nested Runtime State

Task runs, repository registry, approvals, and other service metadata do not
create `workspace/.gorombo/`.

## ACC-ROOT-006: Clean Build

The release package excludes source `src/workspace/repos/`,
`src/workspace/projects/`, dependency trees, and agent-created content while
retaining required persona files.

## ACC-ROOT-007: Override Semantics

Absolute overrides are honored. Relative overrides resolve against the runtime
root. Invalid or ambiguous roots fail closed with a useful error.

## ACC-ROOT-008: Cross-Platform Coverage

Tests cover POSIX and Windows path forms and use the same platform-specific
product filenames as the build.

## ACC-ROOT-009: No Ephemeral Orchestrator Storage

The initialized orchestrator replaces Flue's generic virtual filesystem and
shell tool set with an empty model-facing sandbox tool list. Task delegation,
declared orchestration tools, skills, and registered workers remain available.

## ACC-ROOT-010: Durable Worker Write

In a relocated temporary runtime tree, the Coding Worker writes an artifact
under `workspace/repos/handoffs/todos/`. The host reads the same bytes, a
recreated worker sandbox reads the same bytes, and neither `src/workspace/` nor
`sim-one-alpha/workspace/` receives mutable content.

## ACC-ROOT-011: Agent Routing Guidance

Main-agent instructions route durable file, repository, project, and handoff
work to `agent: "coding-worker"` and runtime capability lifecycle work to
`agent: "capability-manager"`. Coding Worker instructions define
`<runtime-root>/workspace` as the only mutable workspace root and explicitly
reject `/home/user` and persona directories as durable locations.
