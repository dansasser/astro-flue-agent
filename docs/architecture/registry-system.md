# Registry System

SIM-ONE Alpha uses three registry mechanisms with different ownership and
runtime purposes. They must not be treated as one interchangeable store.

## Registry Layers

| Layer | Authority | Purpose |
| --- | --- | --- |
| Typed default registries | Source-defined `InMemoryRegistry<T>` values | Stable typed definitions for base tools, skills, agents, and protocol seeds |
| Generated built-in registry | Build-generated JSON manifest | Reserve built-in names and prevent runtime capability collisions |
| Runtime capability registry | SQLite plus managed capability files | Store and load user- or agent-added skills, tools, workers, and MCP servers |

Protocols use a separate SQLite protocol provider and the Protocol Tool. They
are not runtime capabilities and are not loaded from the capability registry.

## Typed Default Registries

`src/engine/registries/generic-registry.ts` implements a typed in-memory
registry with:

- unique stable ids;
- enabled filtering;
- typed lookup results;
- cloned reads so callers do not mutate stored definitions.

`src/engine/registries/default-registries.ts` supplies base definitions for:

- orchestration-support tool metadata;
- base skill metadata;
- the main orchestrator, researcher, and Coding Worker;
- base protocol seeds.

These registries are exported through `src/index.ts` and provide typed
architecture definitions. They are not the mechanism that dynamically attaches
user code to the running orchestrator.

## Generated Built-In Registry

After `vite build`, the `postbuild` script runs
`scripts/generate-builtin-registry.mjs`, which scans:

- `defineTool(...)` declarations under `src/engine/tools/` and `src/channels/`;
- exported Flue 2 worker definitions, excluding worker-internal subagents;
- imported Agent Skills;
- seeded default-registry ids;
- reserved built-in MCP server names.

It writes:

```text
.gorombo/sim-one-alpha/builtin-capabilities.json
```

The manifest groups `tools`, `subagents`, `skills`, and `mcpServers`.
`src/engine/capabilities/builtin-registry.ts` reads it for collision checks.
It is a name-reservation manifest, not a model-callable discovery service.

## Runtime Capability Registry

The runtime registry is authoritative for post-build extensions:

```text
<runtime-root>/db/capabilities.sqlite
<runtime-root>/capabilities/
```

Each `CapabilityRecord` includes:

```text
id
kind
name
description
source and sourceRef
version
enabled
kind-specific config
installedAt and updatedAt
installedBy
```

The store enforces `PRIMARY KEY(kind, id)` and a unique index on `id`, so a
runtime id cannot be reused across capability kinds.

At orchestrator initialization:

```text
read enabled SQLite records
-> load runtime tools
-> load runtime subagent definitions
-> create enabled runtime MCP connection definitions
-> parse runtime skills into Flue Skill definitions
-> register definitions beside built-ins through Agent Hooks
```

Runtime records do not become active merely because they exist. They must be
enabled, load successfully, avoid built-in/runtime collisions, and be attached
to an owning agent.

## Protocol Access Boundary

Base and user protocols live in the protocol database, not the capability
store. The Protocol Tool:

1. receives the trusted current event id;
2. recovers the persisted normalized event;
3. derives connector, user, client, project, workflow, and task selectors;
4. asks the SQLite protocol provider for the applicable bundle;
5. returns that bundle to the orchestrator.

The typed default protocol registry is metadata for base definitions. Runtime
protocol authority remains the SQLite provider and the bundle loaded for the
current turn.

## Collision And Trust Rules

- Runtime ids must be safe slugs.
- A runtime id cannot collide with any built-in tool, skill, worker, or MCP
  server name.
- Runtime ids are unique across capability kinds.
- Agent-added skills are enabled by default because they are instruction
  content.
- Agent-added executable tools, workers, and MCP servers remain disabled until
  user enablement.
- Enablement does not override protocols, trusted scope, owning-agent
  boundaries, sandbox policy, or action-specific approvals.
- Capability-manager validation and mutation tools receive a persisted event
  id and reload applicable protocols from SQLite. A model-supplied protocol
  object is not an authority boundary.

## Source Map

| Responsibility | Source |
| --- | --- |
| Generic typed registry | `src/engine/registries/generic-registry.ts` |
| Default definitions | `src/engine/registries/default-registries.ts` |
| Built-in manifest generation | `scripts/generate-builtin-registry.mjs` |
| Built-in manifest reader | `src/engine/capabilities/builtin-registry.ts` |
| Cross-kind collision checks | `src/engine/capabilities/collision-check.ts` |
| SQLite capability store | `src/engine/capabilities/capability-store.ts` |
| Runtime capability loading | `src/engine/capabilities/capability-loader.ts` |
| Shared lifecycle service | `src/engine/capabilities/capability-lifecycle-service.ts` |
| Protocol validation context | `src/engine/capabilities/capability-protocol-context.ts` |
| Agent lifecycle owner | `src/engine/workers/capability-manager/` |
| Source authoring and handoff | `src/engine/workers/coding-worker/capability-authoring/` |
| Orchestrator attachment | `src/agents/orchestrator.ts` |
| SQLite protocol provider | `src/core/protocols/sqlite-protocol-provider.ts` |

## Related Documentation

- [Architecture Overview](overview.md)
- [Protocol System](protocol-system.md)
- [Tool System](tool-system.md)
- [Skill System](skill-system.md)
- [Worker System](worker-system.md)
- [Capability System](capability-system.md)
