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
