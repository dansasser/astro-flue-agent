# Product Specification: Install-Relative Runtime Root

## Problem

SIM-ONE Alpha packages its server, CLI, and TUI as siblings in a `.gorombo`
tree, but runtime subsystems still derive defaults independently from
`process.cwd()`, `os.homedir()`, source paths, and workspace-relative paths.
Launching or moving the same product can therefore select the wrong mutable
state or miss packaged artifacts.

## Required Outcomes

1. One absolute `.gorombo` runtime root is resolved once and shared by the
   packaged server, CLI, TUI, scripts, and runtime services.
2. The conventional `~/.gorombo` installation remains supported without
   making HOME the authority for a moved installation.
3. Databases, capabilities, approvals, auth, logs, coding-worker metadata, and
   workspace paths are derived from that root.
4. The installed persona workspace is read-only and distinct from the
   model-writable coding workspace.
5. Coding projects live under `<runtime-root>/workspace/{repos,projects}`.
6. Runtime metadata never nests under `workspace/.gorombo/`.
7. Source builds do not package agent-created repositories or projects.
8. Relative path overrides resolve against the runtime root, not the caller
   working directory.

## Non-Goals

- Granting the model access to the whole runtime tree.
- Removing environment overrides.
- Renaming `.gorombo`, SIM-ONE Alpha, or the `sim-one` product command.
- Treating a source checkout as the production path authority.

## Release Binding

This specification is required by `REL-RUNTIME-001` and
`implement-runtime-root-layout`.
