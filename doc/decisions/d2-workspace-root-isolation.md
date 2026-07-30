# D2 Workspace Root Isolation

## Status

Resolved

## Context

The packaged product is one movable `.gorombo` runtime tree. Existing
subsystems independently derive mutable paths from `process.cwd()`,
`os.homedir()`, workspace-relative `.gorombo` directories, and package
locations. That permits the same build to select different databases,
capabilities, approvals, auth state, logs, or workspaces depending on where it
is launched.

The Ratatui launcher already demonstrates the intended packaged behavior by
locating its owning `.gorombo` tree and starting the sibling server from that
owner. The remaining runtime must use the same root contract.

## Decision

SIM-ONE Alpha has one absolute runtime root whose final path component is
`.gorombo`. The conventional installation is `~/.gorombo`, but the product
must remain correct when that complete tree is installed or moved elsewhere.

Resolution precedence is:

1. an explicit absolute `GOROMBO_RUNTIME_ROOT`;
2. the `.gorombo` tree that owns the packaged executable or `server.mjs`;
3. the repository-local `.gorombo` tree in an explicitly detected source
   checkout;
4. an injected temporary root in tests.

Production operational paths must not fall back independently to
`process.cwd()` or `os.homedir()`. Relative `GOROMBO_*` path overrides resolve
against the single runtime root.

```text
<runtime-root>/
  .env
  gorombo.config.json
  sim-one-alpha/
  sim-one-cli/
  sim-one-ratatui/
  workspace/
    repos/
    projects/
  db/
  capabilities/
  approvals/
  auth/
  logs/
  coding-worker/
```

The installed main-agent persona remains read-only under
`<runtime-root>/sim-one-alpha/workspace/`. The model-writable coding workspace
is `<runtime-root>/workspace/`. Approval, auth, database, capability, log, and
coding-worker metadata are siblings of that workspace and are not model-write
targets.

Build packaging must exclude runtime-created `repos/` and `projects/` from the
source persona copy. Coding-worker task-run and repository-registry metadata
must live under `<runtime-root>/coding-worker/`, never under
`workspace/.gorombo/`.

## Consequences

- A shared runtime-path resolver becomes the authority for Node runtime, CLI,
  scripts, and tests.
- The Rust launcher passes or derives the same absolute runtime root.
- Every subsystem-specific environment override is tested against that root.
- Product tests launch from an unrelated working directory and from a moved
  runtime tree, then verify every selected operational path.
- Local source development remains supported without making source paths a
  production fallback.

## Affected Nodes

- `implement-runtime-root-layout`
- `implement-file-access-approval-gate`
- `implement-coding-worker-github-flow`
- `implement-coding-worker-scaffold-tooling`
- `implement-orchestrator-worker-verification`
