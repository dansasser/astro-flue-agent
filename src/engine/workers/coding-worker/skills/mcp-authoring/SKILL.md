---
name: mcp-authoring
description: Use when creating a local MCP server package or preparing a trusted remote MCP connection for SIM-ONE.
---

# MCP Authoring

Load and apply the applicable protocol bundle before validation.

For an MCP server, create a standards-compatible server package and validate its registered tools and transport locally. Server source remains Coding Worker output until separately packaged and deployed.

For an MCP connection, store only the HTTP or HTTPS endpoint, supported transport, and canonical configuration-key names. Never store token values in source, registry records, handoff evidence, logs, or progress events.

Use `coding_capability_scaffold`, `coding_capability_validate`, and `coding_capability_prepare_handoff`. MCP connections are installed disabled and require a separate approved enable operation through `capability-manager`. An MCP server handoff is validation evidence, not an instruction to register undeployed source as a connection.
