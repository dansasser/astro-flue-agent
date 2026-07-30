---
name: tool-authoring
description: Use when creating or revising a Flue defineTool capability package for SIM-ONE.
---

# Tool Authoring

Load and apply the applicable protocol bundle before validation.

Define a focused Flue tool with `defineTool(...)`, a unique action-oriented name, a Valibot parameter schema, and an application-controlled execution boundary. Treat model-selected arguments as untrusted input, not authorization.

Do not embed credentials, runtime roots, tenant authority, or unrestricted destinations in tool arguments or source. Keep trusted values in application configuration and approval services.

Use `coding_capability_scaffold`, then implement and test the behavior in the selected workspace. Run `coding_capability_validate` and prepare a typed handoff. Runtime tools are installed disabled and require a separate approved enable operation through `capability-manager`.
