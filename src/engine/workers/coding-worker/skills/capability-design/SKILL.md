---
name: capability-design
description: Use when classifying a SIM-ONE extension as a skill, tool, worker, MCP server, or MCP connection and preparing a protocol-governed authoring plan.
---

# Capability Design

Load the applicable protocol bundle before classifying or validating capability work. If the bundle is missing or malformed, stop and report the protocol-routing failure.

Classify the requested extension by responsibility:

- A skill is reusable process knowledge and instructions.
- A tool is executable capability exposed to an owning agent.
- A worker is a specialized Flue agent profile with its own workspace.
- An MCP server implements MCP tools behind a transport.
- An MCP connection registers a trusted remote MCP endpoint and configuration-key references.

Keep authoring separate from runtime lifecycle. Build and validate source inside the selected Coding Worker workspace. Hand validated output to `capability-manager`; never write the capability registry or managed runtime capability directories directly.

Record the applied protocol IDs and rules in validation and handoff evidence. Never place secret values, machine-specific absolute paths, or unrestricted credentials in a package.
