# Product Specification: Canonical Runtime Configuration

## Problem

SIM-ONE Alpha currently reads user-supplied environment variables from several
places: a source-checkout `.env`, inherited shell state, launcher overrides,
test harnesses, model-card names, and a runtime `.gorombo/.env` path that the
build does not create. A packaged product can therefore start without the
credentials and integration settings the owner expected.

The product needs one owner-visible environment configuration contract that
works in a source checkout, in the locally built `.gorombo` tree, after the
runtime tree is moved, and later through onboarding.

## Actors

- The owner maintains real credentials and integration settings.
- The build system produces a locally testable packaged runtime.
- The CLI and SIM-ONE TUI launch the gateway from the owning runtime tree.
- Onboarding creates or updates the installed runtime configuration.
- The Coding Worker helps inspect, validate, and update configuration through a
  bounded trusted capability.
- Release packaging distributes a safe template without owner secrets.

## Required Outcomes

### CFG-PROD-001: One Environment Configuration File

Every SIM-ONE-owned user-configurable environment variable is declared in
`sim-one.config.example` and receives its runtime value from
`<runtime-root>/sim-one.config`.

### CFG-PROD-002: Owner Configuration Works In Local Builds

A repository-root `sim-one.config` is ignored by Git and copied to
`.gorombo/sim-one.config` for a local packaged build. The resulting `sim-one`
command and SIM-ONE TUI use those values without requiring the caller to source
the repository `.env`.

### CFG-PROD-003: Safe Distribution

Release assets include `sim-one.config.example` but never include the owner's
`sim-one.config`. Onboarding creates the installed file with restrictive
permissions.

### CFG-PROD-004: Complete Integration Coverage

The configuration registry covers every implemented provider, connector,
worker, tool, storage override, and runtime service. This includes Telegram and
GitHub now. Gmail, Google, or another future integration must register its
configuration keys before runtime code may consume them.

### CFG-PROD-005: Actionable Missing-Configuration Behavior

When a requested capability lacks required configuration, SIM-ONE identifies
the missing key names and the responsible integration without printing secret
values. Optional unconfigured integrations remain disabled rather than
breaking unrelated TUI or HTTP use.

### CFG-PROD-006: Coding Worker Assistance

The Coding Worker can list supported keys, report configured or missing status,
validate the file, and perform explicitly approved updates. A secret explicitly
supplied by the user for a named update may pass only through the dedicated
configuration capability. Existing stored values are never returned, and the
supplied value is not echoed into assistant output, approval metadata, logs,
progress events, tool results, memory, or repository content.

### CFG-PROD-007: Relocatable Runtime

Configuration resolution is independent of `process.cwd()`, HOME, and the
source checkout. Moving the complete `.gorombo` tree preserves the selected
configuration.

## Scope

- Environment-style configuration and its schema, template, loading,
  packaging, validation, migration, and onboarding boundary.
- Runtime-secret handling and Coding Worker configuration assistance.
- Classification of bootstrap, OS, deprecated, unsupported, and test-only
  variables.

## Non-Goals

- Replacing `gorombo.config.json`, which continues to own typed non-environment
  model selection, storage, memory, gateway, and capability seed settings.
- Implementing Gmail or Google integration before such a capability exists.
- Putting arbitrary host environment variables into the product template.
- Exposing stored secret values to an agent workspace or general Coding Worker
  shell.
