# Runtime Configuration Questions And Boundaries

## Resolved

- The owner-selected environment file names are `sim-one.config.example` and
  `sim-one.config`.
- The active packaged file is `<runtime-root>/sim-one.config`.
- The real source file is ignored; the example is tracked.
- Local builds may copy the owner's real file into the local `.gorombo` product
  tree.
- Public release assets contain only the example; onboarding creates the real
  installed file.
- Telegram, GitHub, providers, and every other implemented integration use the
  same registered environment-variable contract.
- `gorombo.config.json` remains the typed non-environment configuration file.
- Coding Worker assistance uses a bounded trusted capability and does not expose
  secret values to the model or general sandbox.
- The development graph and repository specification artifacts are the
  implementation authority; external loose plans are not a second scheduler.

## Deferred Until A Capability Exists

Gmail and Google currently have no implemented runtime integration or consumed
configuration key. Their authentication method and exact keys must be decided
with that capability. No placeholder may claim the integration is configured
or working before then.

## Implementation Discoveries That Do Not Reopen D5

- A platform may require different APIs for enforcing owner-only file modes.
- Test harnesses may retain explicit command-scoped overrides when they do not
  become production fallbacks.
- Backward-compatible diagnostics may recognize legacy key names solely to
  report migration instructions.
- Future integrations extend the registry and graph lineage rather than adding
  another environment file.

