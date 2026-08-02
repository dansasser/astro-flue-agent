# Astro Docs MCP

SIM-ONE Alpha includes a built-in connection to the public Astro Docs MCP
server:

```text
https://mcp.docs.astro.build/mcp
```

## Runtime Ownership

`src/engine/capabilities/builtin-mcp.ts` defines the connection, and the
Researcher mounts it during agent initialization. The main orchestrator does
not receive this source-backed retrieval capability; it delegates applicable
work to the Researcher.

The built-in server exposes:

```text
mcp__astro-docs__search_astro_docs
```

This is a focused framework-document lookup tool. It supports Astro development
and provides a built-in example of Flue MCP integration.

## Registry And Collision Behavior

The build-generated `builtin-capabilities.json` manifest reserves the
`astro-docs` name under `mcpServers`. Runtime capabilities cannot reuse that id
for a skill, tool, worker, or MCP server.

The built-in MCP connection is separate from runtime-added MCP records:

```text
built-in astro-docs definition
-> Researcher Flue MCP connection
-> MCP tools attached to Researcher

enabled runtime MCP record
-> connectUserMcpServers()
-> authenticated MCP connection
-> MCP tools attached to orchestrator
```

## Security Boundary

- The built-in endpoint is fixed in product source.
- A failed connection is reported and contributes no tools.
- User-defined MCP servers require a capability record and enablement.
- MCP tool attachment does not override protocols, trusted scope, or
  action-specific approval requirements.
- The Researcher remains the owner of general web, current, external, and
  source-backed research.
- The Coding Worker and its internal subagents do not receive this MCP
  connection in the current runtime.

## Source Map

| Responsibility | Source |
| --- | --- |
| Built-in MCP connection | `src/engine/capabilities/builtin-mcp.ts` |
| User MCP broker | `src/engine/capabilities/mcp-broker.ts` |
| Researcher attachment | `src/engine/workers/researcher/researcher.ts` |
| Built-in manifest generation | `scripts/generate-builtin-registry.mjs` |
| Collision checks | `src/engine/capabilities/collision-check.ts` |

## Related Documentation

- [Capability System](capability-system.md)
- [Registry System](registry-system.md)
- [Tool System](tool-system.md)
- [Worker System](worker-system.md)
