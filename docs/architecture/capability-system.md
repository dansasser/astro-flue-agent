# Capability System

The capability system lets users and agents add skills, tools, workers (subagents), and MCP servers to a running SIM-ONE Alpha instance without rebuilding.

## Overview

Built-in Flue runtime capabilities are source-time application code. Built-in Agent Skills live under `src/skills/<name>/SKILL.md`, are imported with `with { type: 'skill' }`, and are registered directly on the owning agent or workflow. Example: `src/skills/greeting-preflight/SKILL.md` is registered on `src/agents/orchestrator.ts`.

The capability registry is the post-build extension lane. Its default paths are
`<runtime-root>/db/capabilities.sqlite` and
`<runtime-root>/capabilities/`. `GOROMBO_CAPABILITY_DB_PATH` and
`GOROMBO_CAPABILITIES_DIR` can override them; relative overrides resolve under
the same canonical runtime root. `GOROMBO_CAPABILITY_DIR` remains a supported
fallback for the capability directory. The orchestrator reads the store at
agent init (`createAgent(...)`) and merges user-defined capabilities into the
same `tools`, `skills`, and `subagents` arrays that hold built-in capabilities.
A service restart picks up changes; no rebuild is needed.

Four capability kinds:

| Kind | Flue ingress | Runtime loading path |
| --- | --- | --- |
| Skill | `skills: [...]` + auto-discovery of `<cwd>/.agents/skills/<name>/` | Built-ins import from `src/skills`. Registry/user skills materialize into the discovery path. Flue loads both natively. |
| Tool | `tools: ToolDefinition[]` | Dynamic `import()` of user JS modules exporting `defineTool(...)` results. |
| Worker (subagent) | `subagents: AgentProfile[]` | Dynamic `import()` of user JS modules exporting `defineAgentProfile(...)` results. |
| MCP | `connectMcpServer(name, opts) -> { tools }` | `connectMcpServer(...)` per enabled row at init; tools spread into `tools`. |

## Architecture

```text
User CLI request
-> sim-one command
-> applicable protocol bundle
-> shared lifecycle service
-> SQLite capabilities table
-> managed capability files

Agent lifecycle request
-> orchestrator and Protocol Tool
-> capability-manager
-> approval gate for mutations
-> shared lifecycle service
-> SQLite capabilities table
-> managed capability files

Capability implementation request
-> Coding Worker authoring skills and tools
-> protocol-routed classification, validation, scan, and tests
-> typed source handoff
-> capability-manager
-> Service restart
-> createAgent(...) init
-> loadUserCapabilities(env) reads SQLite
-> materializeCapability() copies/clones skill dirs
-> connectUserMcpServers() opens MCP connections
-> merge into tools/skills/subagents arrays
-> built-in + user capabilities live together
```

## SQLite Schema

```sql
CREATE TABLE capabilities (
  id            TEXT NOT NULL,
  kind          TEXT NOT NULL,  -- 'skill' | 'tool' | 'worker' | 'mcp'
  name          TEXT NOT NULL,
  description   TEXT NOT NULL,
  source        TEXT NOT NULL,  -- 'github' | 'local' | 'npm' | 'builtin'
  source_ref    TEXT NOT NULL,  -- URL | workspace-relative path | built-in ref
  version       TEXT,
  enabled       INTEGER NOT NULL DEFAULT 0,
  config_json   TEXT NOT NULL DEFAULT '{}',
  installed_at  TEXT NOT NULL,
  updated_at    TEXT NOT NULL,
  installed_by  TEXT NOT NULL DEFAULT 'cli',
  PRIMARY KEY (kind, id)
);

CREATE INDEX IF NOT EXISTS idx_capabilities_kind_enabled
  ON capabilities(kind, enabled);

CREATE UNIQUE INDEX IF NOT EXISTS idx_capabilities_id_unique
  ON capabilities(id);
```

SQLite is authoritative. A config-file mirror (`gorombo.config.json` `capabilities` section) reconciles into SQLite on boot.

The persisted source enum retains `builtin` and the legacy `npm` value for
registry compatibility. New lifecycle requests accept only `github` and
`local`; unsupported sources fail before materialization. Relative local
sources are resolved beneath `<runtime-root>/workspace`, while authenticated
CLI callers may provide an absolute local source path.

## Product And Administration Surfaces

The `sim-one` binary is the authenticated user interface for capability
management. Agent requests are delegated to the built-in
`capability-manager`; the orchestrator has no direct capability mutation tools.
A source checkout also includes `scripts/capability-admin.mjs` as a
compatibility adapter to `sim-one`. It contains no SQLite or materialization
implementation.

All three surfaces use `CapabilityLifecycleService` for list, inspect,
validate, add, update, enable, disable, and remove. Agent mutations require a
current matching approval. Direct CLI commands are attributable to the
authenticated user and do not accept model-supplied identity.

Enabled capability records are read when the orchestrator initializes. After a
lifecycle change, restart the gateway through the process or service manager
that launched it. See the [CLI Reference](../reference/cli.md) for executable
product commands.

## Directory Layout

```text
<configured-capability-directory>/
  skills/<id>/SKILL.md + supporting files
  tools/<id>/index.mjs
  workers/<id>/index.mjs
```

The default is `<runtime-root>/capabilities/`.
`GOROMBO_CAPABILITIES_DIR` overrides it; relative overrides remain under the
same canonical root. `GOROMBO_CAPABILITY_DIR` is the fallback override.
Capabilities live outside the compiled server and survive upgrades.

## Source Code

```text
src/engine/capabilities/
  types.ts                 CapabilityRecord, CapabilityStore interfaces
  capability-lifecycle-service.ts
                           shared validation, mutation, rollback, and result contract
  capability-protocol-context.ts
                           fail-closed Protocol Tool bundle compiler
  capability-store.ts      SQLite CRUD
  capability-loader.ts     loadUserCapabilities(env) — reads SQLite, returns grouped by kind
  skill-materializer.ts    copies/github-clones user skill dirs into Flue's discovery path
  mcp-broker.ts            connectUserMcpServers() — opens MCP connections, returns tools
  index.ts                 barrel exports

scripts/
  capability-admin.mjs     compatibility adapter to the sim-one CLI

src/engine/workers/
  capability-manager/      Flue lifecycle owner for agent requests
  coding-worker/
    capability-authoring/  scoped scaffold, validation, test, and handoff tools
    skills/                imported capability authoring skills

src/agents/
  orchestrator.ts          Modified — calls loadUserCapabilitiesFromStore(env) at init,
                            merges user tools/MCP into tools array, user workers into subagents
```

## Reload At Initialization

Adding a capability writes to SQLite. When the gateway process restarts,
`createAgent(...)` initialization re-reads SQLite and re-scans the capability
directory. No product rebuild is required.
User-defined capabilities live in SQLite and
`<runtime-root>/capabilities/`, outside the packaged application artifact.

## Enablement And Approval

Agent-added skills may be enabled inside the approved add transaction because
they contain instructions and supporting content rather than executable code.
Agent-added tools, workers, and MCP connections are installed disabled and
require a separate approved enable operation before they can enter the runtime.
Updating an executable tool, worker, or MCP connection also returns it to the
disabled state; the changed capability requires a separate enable operation.
Direct CLI actions use the authenticated user as the principal.

After enablement, executable capabilities remain subject to protocols, trusted
scope, owning-agent attachment, sandbox policy, and action-specific approval
requirements.

## Protocol-Routed Validation

The `capabilities.lifecycle-routing` base protocol governs capability work.
Coding Worker classification, source validation, security scanning, tests,
packaging, and handoff require the applicable Protocol Tool bundle.
Capability-manager validation and every mutation require it as well.

These paths fail closed when the bundle is missing or malformed. Successful
validation and handoff results include redacted protocol context with applied
protocol ids and rules. Deterministic checks do not replace protocols; they run
after protocol directives have been compiled. Source-backed validation uses a
non-executing TypeScript syntax check for exported Flue factories and a shared
package scan for credential values and machine-specific absolute paths.

## Coding Worker Authoring

The Coding Worker owns source development inside the selected
`workspace/projects/<slug>` or `workspace/repos/<slug>` target. It imports
Flue skills for capability design, skill authoring, tool authoring, worker
authoring, and MCP authoring. Its typed tools classify, approval-gate
scaffolding, validate contracts, scan for secrets and machine host paths, run
bounded tests, and prepare a content-digest-bound handoff.

A handoff requires passing test evidence for the current content digest and
protocol directives. Local approval metadata includes a SHA-256 source identity
instead of the private path itself, so an approval cannot be reused for a
different local source. Staging rejects symbolic links and verifies
`sha256:<digest>` handoffs against the exact materialized package before
promotion.

MCP connection handoffs carry the validated endpoint, transport, and optional
canonical token configuration key. Partial MCP updates merge defined fields
with the stored connection before validation, so changing transport or token
configuration does not discard the endpoint.

The Coding Worker never imports the capability store, lifecycle service,
materializer, or managed capability path resolver.

## Config-File Mirror

`gorombo.config.json` has a `capabilities` array that reconciles into SQLite on boot (in `src/db.ts`, at server startup — before any agent request). Config is additive: entries in config but missing from SQLite get inserted with `installedBy: "seed"`; entries already in SQLite are skipped (idempotent). Removal is a CLI/db operation, not a config edit.

```json
{
  "version": 1,
  "models": { "primary": "..." },
  "capabilities": [
    {
      "id": "my-skill",
      "kind": "skill",
      "name": "My Skill",
      "description": "...",
      "source": "github",
      "sourceRef": "https://github.com/user/my-skill",
      "enabled": true
    }
  ]
}
```

## Related Documentation

- [Architecture Overview](overview.md)
- [Skill System](skill-system.md)
- [Worker System](worker-system.md)
- [Registry System](registry-system.md)
- [Execution Workflows](execution-workflows.md)
