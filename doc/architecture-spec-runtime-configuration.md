# Architecture Specification: Canonical Runtime Configuration

## File Contract

```text
source checkout
  sim-one.config.example       tracked, secret-free contract
  sim-one.config               owner values, gitignored

packaged runtime root
  sim-one.config.example       onboarding and repair template
  sim-one.config               active owner values, mode 0600
  gorombo.config.json          typed non-environment runtime settings
```

`sim-one.config` uses Node-compatible dotenv syntax:

```text
KEY=value
```

The example contains every supported user-configurable key exactly once,
grouped by subsystem, with comments for type, requirement, default, and secret
handling. It contains no working credential.

## Typed Registry

A single application-owned registry declares, for every supported key:

```text
name
subsystem
value type
required condition
default or derived behavior
secret classification
runtime exposure policy
onboarding metadata
deprecated aliases
```

The registry drives parsing, validation, missing-key diagnostics, example-file
coverage tests, onboarding fields, and Coding Worker status tools. Production
code must not add a new SIM-ONE-owned environment read without registering it.

## Resolution And Loading

1. The launcher derives the owning `.gorombo` runtime root.
2. The active file is `<runtime-root>/sim-one.config`.
3. Source development uses `<repo>/sim-one.config`; build copies it into the
   repository-local runtime tree.
4. The launcher loads and validates the active file before importing the Flue
   application or any module that reads provider or connector configuration.
5. Registry values populate the trusted gateway environment for compatibility
   with Flue and provider APIs.
6. Packaged runtime modules do not search for `.env`, a source checkout, HOME,
   or caller cwd.

The configuration file is authoritative for registered user settings.
Launcher-derived values such as `GOROMBO_RUNTIME_ROOT` and `PORT`, operating
system process values, and explicitly classified test controls remain outside
the owner configuration contract.

## Build And Release Boundary

Local `build` and `build:all` behavior:

- always copy `sim-one.config.example` to the runtime root;
- copy ignored `sim-one.config` when present;
- never synthesize owner values from an unrelated shell or source `.env`;
- fail with an actionable message when a requested production test requires a
  missing configured provider.

Release-archive behavior:

- include `sim-one.config.example`;
- exclude `sim-one.config`, `.env`, databases, logs, auth state, and other user
  data;
- scan final archive bytes and file names for forbidden owner configuration;
- require onboarding to create the installed `sim-one.config`.

## Coding Worker Boundary

The general Coding Worker sandbox remains rooted at
`<runtime-root>/workspace`. It does not receive the configuration file or a
copy of the gateway environment.

The `chat.runtime-configuration-routing` base protocol is selected for
`chat.message` events. It requires the main orchestrator to recognize
configuration inspection or mutation intent, delegate the request and parsed
protocol bundle to the Coding Worker lead, and keep all configuration access
inside the dedicated tools. If the user supplied a value for the current
request, the orchestrator may forward that exact value only for the named key
and operation.

A dedicated trusted configuration capability may:

- enumerate registry metadata;
- return set, missing, invalid, or deprecated status without values;
- validate syntax and subsystem requirements;
- write, update, or remove an allowed key after a current backend approval;
- accept a secret value explicitly supplied by the user for the current named
  update without returning or retaining it;
- use atomic replacement and preserve mode `0600`.

It may not return secret values, run arbitrary commands with the full trusted
environment, read an existing value, accept unknown key names, or write outside
the canonical file. Approval metadata binds a digest of the key, operation, and
supplied value without storing the value itself. Tool results and progress
report only the key, operation, and restart requirement. This is an explicit
D3-compatible capability, not a general exception to the Coding Worker
file-access gate.

## Integration Ownership

- Model cards keep declaring credential key names; values come from
  `sim-one.config`.
- Telegram reads its token, webhook secret, identities, and matching settings
  from the same loaded registry.
- The official GitHub MCP receives its PAT only from the trusted loaded
  configuration.
- Runtime MCP records may select only registered and allowlisted token keys.
- Provider, research, image, memory, schedule, approval, protocol, capability,
  and workspace overrides use the same contract.
- Gmail and Google currently have no implemented key. Their future capability
  must extend the registry, example, onboarding metadata, tests, and graph
  lineage in one change.

## Migration

`.env` and `<runtime-root>/.env` cease to be production inputs. The migration
must:

1. create `sim-one.config.example` from the verified registry;
2. create the owner's ignored `sim-one.config` without committing values;
3. update source, CLI, TUI, service, test, and package entrypoints;
4. remove or reject silent fallback to old env-file locations;
5. preserve explicitly classified command-scoped test overrides;
6. update documentation and diagnostics to name `sim-one.config`.

Deprecated or unsupported keys produce a named diagnostic. They are not copied
silently into the canonical file.

## Security

- Real configuration is Git-ignored and release-excluded.
- Secret-bearing files use owner-only permissions where supported.
- Diagnostics show key names and status, never values.
- Progress events, assistant/tool transcript rows, exceptions, and test
  snapshots never echo registered secrets supplied for an update.
- Config writes are atomic and approval-gated.
- The release gate scans tracked files and archives for real configuration and
  known fixture-secret leakage.
