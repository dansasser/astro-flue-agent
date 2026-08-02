# Extending SIM-ONE Alpha

SIM-ONE Alpha combines product-shipped Flue capabilities with runtime
capabilities added by a user or the agent.

## Two Capability Layers

| Layer | Contents | Lifecycle |
| --- | --- | --- |
| Built-in Flue layer | Product skills, tools, subagents, and MCP connections | Shipped with the product |
| SIM-ONE runtime registry | User- or agent-added skills, tools, workers, and MCP servers | Stored outside the product artifact and loaded after restart |

Both layers enter the same Flue 2 skill, tool, subagent, and MCP connection
surfaces through Agent Hooks. The runtime
registry adds extensibility without giving installed capabilities authority
over protocols or approvals.

## Capability Types

| Type | Purpose | Default |
| --- | --- | --- |
| Skill | Reusable instructions, procedures, and supporting resources | Enabled when added |
| Tool | Typed executable action attached to an owning agent | Disabled unless enabled |
| Worker | Specialized executor loaded as a Flue `SubagentDefinition` | Disabled unless enabled |
| MCP server | Remote HTTP or HTTPS service contributing tools | Disabled unless enabled |

Protocols are not capabilities. Protocols are mandatory runtime rules stored in
SQLite and loaded through the Protocol Tool.

## Registry And Files

The authoritative registry is:

```text
<runtime-root>/db/capabilities.sqlite
```

File-backed capabilities are materialized under:

```text
<runtime-root>/capabilities/skills/<id>/
<runtime-root>/capabilities/tools/<id>/
<runtime-root>/capabilities/workers/<id>/
```

MCP definitions store their endpoint, transport, and token
environment-variable name in SQLite. MCP tokens remain in the environment.

Capability records and managed files live outside the installed product
artifact, so product upgrades preserve runtime additions.

## Sources And Versions

Skills, tools, and workers accept:

- a `github.com` HTTPS or SSH repository URL;
- a local directory path from the authenticated CLI;
- a coding-workspace-relative local directory from an agent handoff.

The CLI resolves an exact requested branch, tag, or commit from `--version`
before validation and materialization. Local directory sources are
content-digested for reproducible handoff and lifecycle evidence.

Capability ids must be safe slugs and cannot collide with built-in or existing
runtime capability names.

## Add A Skill

```bash
sim-one skill add <source> <id> "<name>" \
  [--description "<text>"] [--version <requested-version>] [--enable|--disable]
```

Skills are enabled when added because they contain workflow knowledge rather
than executable capability.

## Add A Tool

```bash
sim-one tool add <source> <id> "<name>" \
  [--description "<text>"] [--version <requested-version>] [--enable]
```

Tools remain disabled unless explicitly enabled.

## Add A Worker

```bash
sim-one worker add <source> <id> "<name>" \
  [--description "<text>"] [--version <requested-version>] [--enable]
```

Workers remain disabled unless explicitly enabled.

## Add An MCP Server

```bash
sim-one mcp add <id> "<name>" --url <url> \
  [--transport <streamable-http|sse>] [--token-env <ENV_NAME>] \
  [--description "<text>"] [--enable]
```

The URL must use HTTP or HTTPS. `streamable-http` is the default transport.
`--token-env` records the name of the secret-bearing environment variable.
Supported canonical slots are `GOROMBO_MCP_TOKEN`, `MCP_AUTH_TOKEN`, and
`MCP_TOKEN`.

## Manage Capabilities

Each capability family supports:

```text
list
inspect <id>
validate ...
enable <id>
disable <id>
update <id>
remove <id>
```

Updating a skill, tool, or worker re-fetches and revalidates its recorded
source. MCP update validates connection, name, and description changes in
place. Updating a tool, worker, or MCP connection disables it and removes its
active materialization until a separate `enable` command succeeds. Removal
deletes the registry record and managed files.

Apply lifecycle changes by restarting the gateway through the process or
service manager that launched it. Startup loads the package promoted by the
lifecycle transaction and never recopies or reclones its mutable source.

## Agent-Added Capabilities

The agent can propose runtime capability lifecycle work through the dedicated
`capability-manager`:

- skills can be enabled immediately;
- executable tools, workers, and MCP servers require approval before
  activation;
- all additions are checked for identity, scope, source validity, and name
  collisions.
- validation and mutations require the applicable Protocol Tool bundle and
  retain applied protocol ids and rules in redacted evidence.
- source packages must pass non-executing Flue export checks, credential-value
  scanning, and machine-specific absolute-path scanning.
- agent local source paths must stay relative to the coding workspace, and
  GitHub-labeled sources must use a `github.com` HTTPS or SSH repository URL.
- executable modules must export direct `defineTool(...)` or
  `defineSubagent(...)` results rather than wrapper functions.

Capability source implementation is delegated to the Coding Worker. Its
capability authoring skills and tools classify, scaffold, validate, scan, test,
and prepare a content-digest-bound handoff inside the selected workspace. It
cannot write the runtime registry or managed capability directories.

Registration does not grant unrestricted authority. Enabled capabilities
remain subject to:

- trusted connector, actor, conversation, and project scope;
- typed tool boundaries;
- worker ownership and isolation;
- approval-gated Git and GitHub mutations.

The release contract also subjects every capability path to active protocol
scoring and orchestrator/critic enforcement. Complete activation of that
boundary remains a release gate.

## Verify An Addition

```bash
sim-one <skill|tool|worker|mcp> list
```

Restart the gateway, then open a new terminal session and confirm the
capability is available to its owning agent.

## Related Documentation

- [CLI Reference](../reference/cli.md)
- [Configuration Reference](../reference/configuration.md)
- [Architecture Overview](../architecture/overview.md)
