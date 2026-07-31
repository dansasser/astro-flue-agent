# D5 Canonical Runtime Configuration

## Status

Resolved

## Context

The packaged launchers resolve `<runtime-root>/.env`, but the build does not
create that file. The source checkout has a separate `.env`, test scripts read
it independently, and many runtime modules read inherited process variables.
As a result, a successful build does not prove that the packaged product has
the owner's Telegram, GitHub, model-provider, or other integration settings.

The owner requires one real file that works with local production builds, one
tracked example, complete coverage of every implemented configuration key, and
an onboarding-compatible location. The Coding Worker must be able to help with
configuration without turning the general model sandbox into a secret reader.

## Decision

SIM-ONE Alpha environment configuration uses:

```text
<source-root>/sim-one.config.example
<source-root>/sim-one.config
<runtime-root>/sim-one.config.example
<runtime-root>/sim-one.config
```

`sim-one.config.example` is tracked and contains the complete secret-free
environment contract. `sim-one.config` contains owner values and is ignored.
Local builds copy both files into the repository-local `.gorombo` tree when the
real file exists. Public release assets contain only the example; onboarding
creates the installed real file.

All SIM-ONE-owned user-configurable environment keys must be declared in one
typed registry and loaded from the canonical runtime file before Flue,
providers, connectors, tools, or workers initialize. Production does not search
source `.env`, runtime `.env`, HOME, or caller cwd for owner settings.

`gorombo.config.json` remains the typed non-environment configuration source.
Launcher-derived runtime root and port, OS process state, and explicitly
classified test controls are not normal onboarding fields.

The Coding Worker receives a dedicated trusted configuration capability. It can
list metadata and redacted status, validate the file, and make an allowlisted
atomic update only after a current backend approval. It cannot read secret
values from the file or pass the full trusted environment to general shell
tools. When the user explicitly supplies a secret for a named configuration
update, the active protocol may route that exact value to the dedicated update
tool. The value is write-only: it is not returned, rediscovered, transformed,
retained in worker memory, or emitted through approval metadata, progress,
logs, tool results, or the final response.

The `chat.runtime-configuration-routing` base protocol is the mandatory
orchestrator contract for these requests. It identifies configuration intent,
routes the request and active protocol bundle to the Coding Worker lead,
requires `runtime.config.update` approval, and prohibits general sandbox access
to `sim-one.config`.

Telegram and GitHub use this file. Gmail, Google, and future integrations must
extend the registry, example, onboarding metadata, verification, and graph
lineage before claiming configuration support.

The development graph and its repository artifacts are the project planning
authority. This decision does not create or depend on an external loose plan.

## Consequences

- Build and launcher contracts must change from `.env` to `sim-one.config`.
- Every production environment read must be registered or explicitly
  classified as bootstrap, OS, deprecated, unsupported, or test-only.
- Release packaging must prove owner configuration and secret values are absent.
- Configuration diagnostics report names and status without values.
- Onboarding and Coding Worker configuration support share one schema.
- Existing docs and graph nodes that treat external plans or `.env` files as
  authoritative must be reconciled.

## Affected Nodes

- `implement-runtime-configuration-consolidation`
- `verify-runtime-configuration-consolidation`
- `implement-runtime-root-layout`
- `implement-agent-runtime`
- `implement-capabilities-security`
- `implement-ingress-operations`
- `implement-coding-worker-github-flow`
- `implement-connector-approval-controls`
- `implement-sim-one-onboarding-distribution`
- `build-release-package`
- `verify-onboarding-distribution`
- `implement-product-delivery`
