# Skill System

Skills give SIM-ONE Alpha reusable instructions, procedures, and supporting
resources. They help an agent apply a repeatable method without granting an
executable capability.

A skill can direct an agent to use an available tool, workflow, or worker, but
the skill does not create that capability and does not override protocols,
trusted scope, approval requirements, or orchestrator validation.

## Skill Layers

SIM-ONE Alpha supports three skill sources:

| Source | Ownership | Lifecycle |
| --- | --- | --- |
| Product skill | Imported and registered with a product agent or workflow | Built and shipped with the product |
| Worker-local skill | Registered only on its owning worker profile | Built and shipped with that worker |
| Runtime skill | Added by a user or agent through the capability registry | Stored outside the product and loaded after restart |

All three become Flue skills for the agent that owns them. Their installation
source does not give them additional authority.

## Product Skills

Product skills are application-owned Agent Skills. A skill directory contains
a required `SKILL.md` and can include supporting resources:

```text
src/skills/example-skill/
  SKILL.md
  references/
    checklist.md
```

The owning agent or workflow imports `SKILL.md` with the JavaScript
`type: "skill"` import attribute and registers the imported reference in its
Flue `skills` configuration.

SIM-ONE Alpha currently registers `greeting-preflight` on the main
orchestrator. It provides the startup greeting procedure without becoming a
tool or a protocol.

## Worker-Local Skills

Worker-local skills belong only to the worker that uses them. The Coding Worker
registers five process skills:

| Skill | Purpose |
| --- | --- |
| `coding-worker.triage-loop` | Classify work and produce the execution plan |
| `coding-worker.code-change-loop` | Plan, edit, verify, debug, and package changes |
| `coding-worker.ci-debug-loop` | Diagnose and resolve failing checks |
| `coding-worker.code-review-loop` | Perform independent requirements and regression review |
| `coding-worker.github-pr-loop` | Manage approval-aware Git and GitHub workflows |

These skills guide the Coding Worker lead and its internal specialists. They do
not replace the local sandbox, typed tools, verification evidence, approval
service, or progress events.

The orchestrator does not inherit worker-local skills. Flue subagent profiles
own their own tools, skills, subagents, and instructions.

## Runtime Skills

Users and the agent can add a skill without rebuilding SIM-ONE Alpha:

```bash
sim-one skill add <source> <id> "<name>" \
  [--description "<text>"] [--version <version-or-git-ref>] [--enable]
```

Runtime skill records are stored in:

```text
~/.gorombo/db/capabilities.sqlite
```

Enabled skill files are materialized under:

```text
~/.gorombo/capabilities/skills/<id>/
```

Sources can be HTTPS Git repositories, other supported Git remotes, or local
directories. A version can pin a remote tag, branch, or revision. Local
directory sources are copied from their resolved path.

The runtime loader validates ids and collisions, materializes enabled files,
and merges valid skills into the orchestrator's Flue skill surface during
initialization. A gateway restart reloads capability changes.

## Agent Skills Format

Flue validates imported and discovered `SKILL.md` files against the Agent
Skills format. The required frontmatter fields are:

```yaml
---
name: example-skill
description: Explain what the skill does and when the agent should use it.
---
```

The declared name:

- uses lowercase letters, numbers, and hyphens;
- has no leading, trailing, or consecutive hyphens;
- is at most 64 characters;
- matches the skill directory name.

The description is non-empty, at most 1024 characters, and should give the
agent clear selection guidance.

Optional fields such as `license`, `compatibility`, and string metadata are
informational. Flue accepts `allowed-tools`, but it does not enforce that field
as an authorization boundary.

## Discovery And Registration

Product skills are available because an owning agent or workflow imports and
registers them. A source directory alone does not attach a skill.

Runtime skills enter through the SIM-ONE capability registry:

```text
User or agent requests skill addition
-> Validate id, source, and name collisions
-> Store capability record in SQLite
-> Materialize the skill directory
-> Restart gateway
-> Load enabled skill
-> Register it on the orchestrator's Flue skill surface
```

Flue also supports Agent Skills discovered in a configured sandbox under
`.agents/skills/`. The SIM-ONE product registry remains the managed
installation surface for user- and agent-added product skills.

Duplicate names fail instead of selecting one definition implicitly. SIM-ONE
also blocks ids that collide with built-in tools, skills, workers, or MCP
servers.

## Enablement And Trust

Runtime skills are enabled when added because their contract is instruction and
supporting content rather than executable code. This lower activation barrier
does not make skill content authoritative.

Every skill remains subordinate to:

- the active SQLite protocol bundle;
- the owning agent's instructions;
- trusted connector, actor, conversation, and project scope;
- the tools and workers actually attached to the owning agent;
- approval gates on executable or mutating work;
- orchestrator/critic evaluation.

Skill directories must not contain credentials, private keys, access tokens, or
runtime secrets. Imported skill content is packaged with the application, and
runtime skill content becomes available to an agent context.

## Skill Lifecycle

Runtime skills support:

```text
add
list
enable
disable
update
remove
```

Updating re-fetches or recopies the recorded source. Disabling removes the
materialized active copy while preserving the registry record. Removing
deletes both the registry record and managed files.

Restart the running gateway through its process or service manager after a
lifecycle change so the orchestrator initializes with the updated skill set.

## Authoring Guidance

A project skill should:

1. solve a repeatable process problem;
2. state when it should and should not be used;
3. reference tools by capability rather than assuming they exist;
4. separate instructions from executable implementation;
5. keep mandatory policy in protocols;
6. keep secrets and private runtime data outside the skill directory;
7. include only supporting resources needed for the method;
8. use a stable, collision-free name.

Use a tool for typed executable behavior. Use a worker for isolated specialist
execution. Use a protocol for mandatory runtime governance.

## Source Map

| Area | Source |
| --- | --- |
| Product skills | `src/skills/` |
| Coding Worker skill registration | `src/engine/workers/coding-worker/skills.ts` |
| Coding Worker skill content | `src/engine/workers/coding-worker/skills/` |
| Capability records | `src/engine/capabilities/capability-store.ts` |
| Skill materialization | `src/engine/capabilities/skill-materializer.ts` |
| Runtime loading | `src/engine/capabilities/capability-loader.ts` |
| Collision checks | `src/engine/capabilities/collision-check.ts` |
| Orchestrator registration | `src/agents/orchestrator.ts` |

## Related Documentation

- [Architecture Overview](overview.md)
- [Flue Architecture Contract](flue-architecture.md)
- [Capability System](capability-system.md)
- [Worker System](worker-system.md)
- [Tool System](tool-system.md)
- [Extending SIM-ONE Alpha](../guides/extending-sim-one.md)
