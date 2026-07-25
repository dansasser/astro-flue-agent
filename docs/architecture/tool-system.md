# Tool System

Tools are typed, executable capabilities exposed to a specific Flue agent.
They are implemented with `defineTool(...)`, validate model-supplied arguments,
perform one bounded operation, and return structured results.

Tools are not protocols, skills, workers, or registries:

- protocols are mandatory SQLite-backed rules;
- skills are reusable workflow knowledge;
- workers are delegated specialist agents;
- registries describe or load available capabilities;
- tools execute capabilities.

## Tool Layers

| Layer | Registration | Examples |
| --- | --- | --- |
| Product built-ins | Explicit imports and the owning agent's `tools` array | Protocol lookup, memory, schedules, capability administration, image generation |
| Worker-local tools | Explicitly attached by a worker profile | Coding repository, shell, verification, approval, and GitHub tools |
| Runtime tools | Enabled SQLite capability records loaded with dynamic `import()` | User- or agent-added `defineTool(...)` modules |
| MCP tools | Returned by built-in or runtime MCP connections and attached to an owner | Astro Docs MCP and enabled user MCP servers |

Flue does not discover arbitrary product tools from the filesystem. Built-in
tools are imported and attached explicitly. Runtime tools become discoverable
through the SIM-ONE capability loader during orchestrator initialization.

## Ownership

### Orchestrator

The orchestrator owns tools that support coordination or bounded product
capabilities, including:

- `load_protocols`;
- memory, checklist, todo, and session-note tools;
- knowledge ingestion;
- schedules;
- image generation and artifact recording;
- Telegram replies;
- runtime capability administration;
- MCP tools attached to the orchestrator.

The orchestrator does not own web search or Coding Worker repository tools.

### Researcher

The researcher owns `web_research` and its lower-level retrieval machinery.
General web, current, external, and source-backed research stays inside this
worker boundary.

### Coding Worker

The Coding Worker lead owns repository, file, shell, test, Git, GitHub,
approval, schedule, memory-task, and code-intelligence tools. Internal coding
subagents receive only the tools assigned by the Coding Worker lead and are not
exposed to the orchestrator.

## Built-In Registration

Built-in product tools follow this path:

```text
defineTool(...)
-> export from the owning tool module
-> import into the owning agent or worker
-> attach to that profile's tools array
-> include the name in the generated built-in capability manifest
```

The generated manifest reserves names for collision checking. It does not
attach tools to an agent.

## Runtime Tool Loading

Runtime-added tools follow this path:

```text
sim-one CLI or agent capability tool
-> validate id and cross-kind collisions
-> write disabled or enabled SQLite record
-> materialize source under <configured-capability-directory>/tools/<id>/
-> gateway process restart
-> read enabled capability records
-> dynamic import of index.mjs
-> validate exported defineTool(...) definitions
-> merge loaded tools into the orchestrator tools array
```

`src/engine/capabilities/tool-loader.ts` accepts a default export, an array
export, or named exports that resolve to Flue tool definitions. A failed import
or invalid export is reported and omitted rather than granting a partially
loaded capability.

The configured capability directory defaults to project-local
`.gorombo/capabilities/` in a source checkout and
`~/.gorombo/capabilities/` for a normal installed launcher.
`GOROMBO_CAPABILITIES_DIR` overrides it.

## Enablement And Authority

Agent-added runtime tools are installed disabled. An explicit user action can
enable them through the product CLI or control surface. CLI additions may use
`--enable` because the authenticated user is the principal.

Enablement means the tool may be loaded and attached. It does not grant
unrestricted authority. A loaded tool remains constrained by:

- the active protocol bundle;
- trusted connector, actor, conversation, client, and project scope;
- the owning agent's instructions;
- argument validation;
- sandbox and filesystem boundaries;
- tool-specific approval requirements;
- orchestrator/critic result validation.

Tools must derive sensitive scope from trusted runtime state rather than
accepting model-selected authority fields.

## Side Effects And Failure

- Read-only tools return bounded structured data.
- Mutating tools use the applicable approval service when policy requires it.
- Missing configuration fails closed.
- Provider errors are normalized before they enter agent context.
- Tools do not silently mutate global state outside their documented scope.
- A successful tool call is evidence of its returned operation, not automatic
  evidence that the entire user task is complete.

## Adding A Built-In Tool

1. Add the tool under the owning subsystem.
2. Define a precise description and Valibot parameter schema.
3. Derive trusted scope outside model-selected arguments.
4. Return a structured result or bounded string.
5. Export and attach the tool only to the owning agent.
6. Add focused tests for validation, authorization, side effects, and failures.
7. Update the generated built-in registry through the normal build.
8. Update the relevant architecture and user reference.

## Example: Image Generation

```text
src/engine/tools/runpod-image/
  generate-image-tool.ts
  record-image-artifact-tool.ts
  list-image-artifacts-tool.ts
  catalog.ts
  runpod-client.ts
  artifact-store.ts
  models.yaml
```

These tools are attached directly to the orchestrator because image generation
is a bounded product capability. Artifact recording derives trusted event scope
and persists metadata separately from the generated binary.

## Source Map

| Responsibility | Source |
| --- | --- |
| Orchestrator tool attachment | `src/agents/orchestrator.ts` |
| Product built-in tools | `src/engine/tools/` |
| Runtime tool loader | `src/engine/capabilities/tool-loader.ts` |
| Capability records | `src/engine/capabilities/capability-store.ts` |
| Materialization | `src/engine/capabilities/skill-materializer.ts` |
| Built-in name manifest | `scripts/generate-builtin-registry.mjs` |
| Research tools | `src/engine/workers/researcher/` |
| Coding Worker tools | `src/engine/workers/coding-worker/tools/` |

## Related Documentation

- [Architecture Overview](overview.md)
- [Protocol System](protocol-system.md)
- [Capability System](capability-system.md)
- [Registry System](registry-system.md)
- [Skill System](skill-system.md)
- [Worker System](worker-system.md)
