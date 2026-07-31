# Protocol System

SIM-ONE Alpha uses protocols as mandatory runtime rules. Protocols govern what
the orchestrator and its workers may do for a specific admitted event.

Protocols are not prompts, skills, tools, or model-generated policy. They are
stored outside model context in SQLite and are loaded through the
`load_protocols` tool from trusted event data.

The implemented source path includes tool attachment, trusted-event
rehydration, selector derivation, SQLite matching, base records, and mandatory
orchestration instructions. The complete release policy set and a trusted
fail-closed pre-execution boundary are release gates. See
[Pre-Release Status](../getting-started/pre-release-status.md).

## Responsibilities

The protocol system provides:

- product-owned base rules;
- operator-owned user rules;
- event-scoped rule selection;
- deterministic priority ordering;
- a structured `ProtocolBundle` for the active turn;
- enforcement guidance for orchestration, delegation, approval, verification,
  and output.

Protocols define mandatory behavior. Skills provide reusable process guidance,
tools execute actions, and workers perform delegated work. None of those
capability types can replace or override a protocol.

## Runtime Flow

```text
Connector, TUI, Web API, or schedule
-> Secure gateway
-> Persisted NormalizedMessageEvent
-> Orchestrator
-> load_protocols(eventId)
-> SQLite protocol provider
-> Applicable ProtocolBundle
-> Orchestrator
-> Reasoning, retrieval, tool use, delegation, or response synthesis
```

The gateway persists the normalized event before the orchestrator uses the
protocol tool. The tool accepts an `eventId`, loads the corresponding event
from the session database, and derives protocol selectors from that trusted
record.

Model-supplied connector, actor, conversation, client, project, workflow, or
task values do not replace the persisted event values.

The release enforcement contract adds trusted admission and result scoring
around this implemented lookup path.

## Storage

The default protocol database is:

```text
<runtime-root>/db/protocols.sqlite
```

Deployments can set `GOROMBO_PROTOCOL_DB_PATH` to another runtime-managed
location. Relative overrides remain under the same canonical `.gorombo` root.

Each protocol record contains:

| Field | Purpose |
| --- | --- |
| `id` | Stable protocol identifier |
| `name` | Human-readable name |
| `description` | Reason and intended boundary |
| `scope` | `base` for product rules or `user` for operator rules |
| `enabled` | Whether a user protocol participates in matching |
| `priority` | Descending application order |
| `selector_json` | Event fields that must match |
| `rules_json` | Ordered mandatory directives |
| `source` | Record origin: `seed`, `sqlite`, or `file` |
| `tags` | Classification metadata |
| timestamps | Creation and update history |

SQLite uses write-ahead logging and an index over enabled state and priority.
Protocol records are runtime data and should be managed through product
interfaces rather than edited directly.

## Base And User Protocols

### Base Protocols

Base protocols ship with SIM-ONE Alpha. They establish system invariants such
as:

- load protocols before final reasoning or action;
- keep substantive execution in specialized workers;
- route coding through the Coding Worker lead;
- require planning, verification, review, and approval for coding mutations;
- emit public progress throughout long-running work;
- return required completion evidence.

The `chat.runtime-configuration-routing` base protocol governs configuration
requests from chat connectors. It requires the orchestrator to delegate
inspection and writes to the Coding Worker lead's dedicated configuration
tools. A secret may be forwarded only when the user explicitly supplied it for
the current key and operation. Stored values remain unreadable, every mutation
requires `runtime.config.update` approval, and no supplied value may be echoed
through approval metadata, progress, logs, tool results, or the final response.

The `capabilities.lifecycle-routing` base protocol governs runtime extension
work. It routes lifecycle requests to `capability-manager`, routes Coding
Worker classification, validation, security checks, tests, packaging, and
handoff through protocol directives, requires approval for agent mutations,
keeps executable additions disabled, and requires redacted protocol evidence.

Base protocols are seeded into SQLite during provider initialization. Product
updates reconcile seed-owned fields while preserving a user protocol that uses
the same id as an override. Stale seed records are removed when they are no
longer part of the product seed set.

Base protocols cannot be disabled or deleted through the user protocol
operations.

### User Protocols

User protocols add operator-owned rules for a connector, user, client,
project, workflow, task, or message type. They can be created, listed, enabled,
disabled, updated, and removed through the protocol provider's managed
operations.

A user protocol can use the same id as a base seed. In that case the user
record remains authoritative for that id and seed reconciliation does not
silently overwrite it.

## Selectors

Protocol selectors can match:

```text
connector
message kind
user id
client id
project id
workflow
task
```

An omitted selector field is a wildcard. A supplied field must exactly match
the corresponding value from the persisted `NormalizedMessageEvent`.

Examples:

```json
{
  "workflow": "coding"
}
```

```json
{
  "connector": "telegram",
  "projectId": "customer-portal",
  "task": "release"
}
```

All enabled records are ordered by descending priority before selector
matching. The resulting bundle preserves that order so broad rules and
specific rules can be evaluated consistently.

## Protocol Bundle

The tool returns a JSON-encoded `ProtocolBundle`:

```ts
interface ProtocolBundle {
  eventId: string;
  protocols: ProtocolDefinition[];
  loadedAt: string;
}
```

Each definition includes its selector, priority, rules, scope, source, and
tags. The bundle is tied to one persisted event and is not reusable as
authority for an unrelated turn.

When the orchestrator delegates to the Coding Worker, it includes the parsed
bundle in the delegated task. The worker lead applies
`protocolBundle.protocols[].rules` to its bounded execution loop.

Capability validation is fail-closed. Coding Worker authoring tools require a
complete parsed bundle. Capability-manager tools instead accept the persisted
normalized message `eventId`, reload its applicable bundle from the SQLite
provider in trusted application code, compile ordered directives before
deterministic checks, and retain protocol ids and rules in result evidence.
Missing events and malformed or mismatched bundles cannot fall through to
local policy.

## Release Enforcement Contract

The release orchestrator/critic remains the final authority for the turn. It
uses the active protocol bundle to evaluate:

- whether the request is admitted;
- whether retrieval is required;
- which worker, tool, workflow, or MCP capability is permitted;
- whether an action requires approval;
- whether worker evidence satisfies the requested outcome;
- whether revision or redelegation is required;
- whether the final response can be returned.

Workers do not approve their own actions or final results. They return work and
evidence to the orchestrator/critic for evaluation under the same protocol
bundle.

The current source has the protocol lookup and delegation path, but trusted
pre-execution enforcement and complete critic scoring are not activated across
every direct response, alternate tool call, and delegation path.

## Failure Behavior

Once invoked, protocol lookup fails closed when:

- `eventId` is missing or empty;
- the event was not persisted;
- trusted event context cannot be recovered;
- a base protocol mutation is attempted through user operations.

Invalid optional JSON fields are normalized to empty selectors or rule lists
rather than granting additional authority. A protocol lookup failure must not
be treated as permission to continue without governance. The release
pre-execution boundary must also prevent the orchestrator from bypassing the
lookup entirely.

## Adding A User Protocol

A protocol should:

1. express one enforceable operating boundary;
2. use the narrowest trustworthy selector set;
3. use a stable namespaced id;
4. state rules as direct, testable requirements;
5. assign priority relative to broader and narrower rules;
6. avoid embedding credentials, private data, or transient conversation text;
7. be tested against matching and non-matching events.

Use protocols for mandatory runtime rules. Use a skill when the content
describes a reusable method, and use a tool when the system must execute code
or call a service.

## Source Map

| Area | Source |
| --- | --- |
| Protocol types | `src/core/types/core.ts` |
| SQLite schema | `src/core/protocols/schema.ts` |
| Base protocol seeds | `src/core/protocols/protocol-provider.ts` |
| Matching and user operations | `src/core/protocols/sqlite-protocol-provider.ts` |
| Model-callable lookup | `src/engine/tools/protocol-tool.ts` |
| Trusted event persistence | `src/engine/session/session-database.ts` |
| Orchestrator attachment | `src/agents/orchestrator.ts` |

## Related Documentation

- [Architecture Overview](overview.md)
- [Orchestrator Flow](orchestrator-flow.md)
- [Worker System](worker-system.md)
- [Skill System](skill-system.md)
- [Execution Workflows](execution-workflows.md)
