# Capability System

The capability system lets users and agents add skills, tools, workers (subagents), and MCP servers to a running SIM-ONE Alpha instance without rebuilding.

## Overview

Built-in Flue runtime capabilities are source-time application code. Built-in Agent Skills live under `src/skills/<name>/SKILL.md`, are imported with `with { type: 'skill' }`, and are registered directly on the owning agent or workflow. Example: `src/skills/greeting-preflight/SKILL.md` is registered on `src/agents/orchestrator.ts`.

The capability registry is the post-build extension lane. Its default paths are `~/.gorombo/db/capabilities.sqlite` and `~/.gorombo/capabilities/`, resolved from the user's home directory. `GOROMBO_CAPABILITY_DB_PATH` and `GOROMBO_CAPABILITIES_DIR` can override them; `GOROMBO_CAPABILITY_DIR` remains a supported fallback for the capability directory. The orchestrator reads the store at agent init (`createAgent(...)`) and merges user-defined capabilities into the same `tools`, `skills`, and `subagents` arrays that hold built-in capabilities. A service restart picks up changes — no rebuild needed.

Four capability kinds:

| Kind | Flue ingress | Runtime loading path |
| --- | --- | --- |
| Skill | `skills: [...]` + auto-discovery of `<cwd>/.agents/skills/<name>/` | Built-ins import from `src/skills`. Registry/user skills materialize into the discovery path. Flue loads both natively. |
| Tool | `tools: ToolDefinition[]` | Dynamic `import()` of user JS modules exporting `defineTool(...)` results. |
| Worker (subagent) | `subagents: AgentProfile[]` | Dynamic `import()` of user JS modules exporting `defineAgentProfile(...)` results. |
| MCP | `connectMcpServer(name, opts) -> { tools }` | `connectMcpServer(...)` per enabled row at init; tools spread into `tools`. |

## Architecture

```text
User/Agent adds capability
-> sim-one CLI or agent capability tool
-> SQLite capabilities table
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
  source_ref    TEXT NOT NULL,  -- URL | path | pkg name
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

## Product And Administration Surfaces

The `sim-one` binary is the product interface for capability management. A
source checkout also includes `scripts/capability-admin.mjs` for repository
administration. Both surfaces validate and mutate the same registry contract;
neither bypasses enablement, collision checks, protocol rules, ownership, or
approval requirements.

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

The default is `~/.gorombo/capabilities/`, resolved from the user's home
directory. `GOROMBO_CAPABILITIES_DIR` overrides it;
`GOROMBO_CAPABILITY_DIR` is the fallback override. Capabilities live outside
`dist/` and survive upgrades.

## Source Code

```text
src/engine/capabilities/
  types.ts                 CapabilityRecord, CapabilityStore interfaces
  capability-store.ts      SQLite CRUD
  capability-loader.ts     loadUserCapabilities(env) — reads SQLite, returns grouped by kind
  skill-materializer.ts    copies/github-clones user skill dirs into Flue's discovery path
  mcp-broker.ts            connectUserMcpServers() — opens MCP connections, returns tools
  index.ts                 barrel exports

scripts/
  capability-admin.mjs     CLI admin script (add/list/enable/disable/remove/update)

src/agents/
  orchestrator.ts          Modified — calls loadUserCapabilitiesFromStore(env) at init,
                            merges user tools/MCP into tools array, user workers into subagents
```

## Reload At Initialization

Adding a capability writes to SQLite. When the gateway process restarts,
`createAgent(...)` initialization re-reads SQLite and re-scans the capability
directory. No product rebuild is required.
User-defined capabilities live in SQLite and
`~/.gorombo/capabilities/`, outside the packaged application artifact.

## Enablement And Approval

Agent-added skills are enabled automatically because they contain instructions
and supporting content rather than executable code. Agent-added tools, workers,
and MCP servers are installed disabled and require user enablement through the
product control surface before they can enter the runtime. Direct CLI actions
use the authenticated user as the principal.

After enablement, executable capabilities remain subject to protocols, trusted
scope, owning-agent attachment, sandbox policy, and action-specific approval
requirements.

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
