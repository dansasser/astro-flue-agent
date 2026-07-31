# Architecture Specification: Install-Relative Runtime Root

## Root Resolver

A shared resolver returns one absolute `runtimeRoot`:

```text
explicit absolute GOROMBO_RUNTIME_ROOT
  -> packaged owner .gorombo tree
  -> explicitly detected source checkout .gorombo tree
  -> injected test root
```

The resolver validates that the selected directory is the intended `.gorombo`
tree and returns typed child paths. Production modules do not independently
call `homedir()` or resolve operational defaults from `process.cwd()`.

## Typed Layout

```text
runtimeRoot
  packagedServer       sim-one-alpha/
  packagedCli          sim-one-cli/
  packagedTui          sim-one-ratatui/
  personaWorkspace     sim-one-alpha/workspace/
  codingWorkspace      workspace/
  databases            db/
  capabilities         capabilities/
  approvals            approvals/
  auth                 auth/
  logs                 logs/
  codingWorkerState    coding-worker/
  environment          sim-one.config
  environmentExample   sim-one.config.example
  config               gorombo.config.json
```

The Coding Worker receives only `codingWorkspace` as its default sandbox root.
Application services receive only the typed runtime paths they own.

The main orchestrator uses an explicit Flue sandbox factory with no generic
model-facing filesystem or shell tools. This replaces Flue's default in-memory
virtual sandbox tools while preserving task delegation. Durable artifact work
is delegated to the Coding Worker, whose Node local sandbox is rooted at
`codingWorkspace`. Runtime capability lifecycle work is delegated to
`capability-manager`.

## Packaged Launch

The Rust TUI and product CLI derive the owner tree from their executable path.
When either starts `sim-one-alpha/server.mjs`, it supplies the same absolute
root and sets a compatible child cwd. Direct service launch derives the root
from the packaged module path or an explicit environment value.

## Source Development

An explicitly detected repository checkout uses `<repo>/.gorombo`. Tests inject
temporary roots. Source-only paths may be used for fixtures and build inputs,
but never as packaged mutable-state defaults.

## Build Boundary

The source persona directory is copied to
`sim-one-alpha/workspace/` with `repos/`, `projects/`, dependency trees, and
other runtime-created content excluded. Mutable data is never copied into a
release archive as user state.

An existing source-created repository or handoff artifact is preserved by
copying it into the matching `codingWorkspace` path and verifying source and
destination contents before treating the runtime copy as authoritative. Source
cleanup is a separate, explicit operation.

## Compatibility

Existing absolute `GOROMBO_*` overrides remain valid. Relative overrides are
resolved against `runtimeRoot` and documented consistently. Ambiguous or
unresolvable production roots fail with a typed startup error.
