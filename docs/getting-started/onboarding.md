# Onboarding

This document defines the packaged onboarding contract for SIM-ONE Alpha
`0.1.0 Beta`. The onboarding interface and `sim-one install` command are not
available in the pre-release source checkout. See
[Pre-Release Status](pre-release-status.md).

## Release Entry Point

The signed packaged installer opens onboarding automatically. The release
command can reopen it when an integration needs interactive authorization:

```bash
sim-one install
```

Do not use this command until the packaged release is published. Source builds
currently use file-based configuration and launch the terminal interface
directly.

## Onboarding Flow

The release onboarding interface:

1. Validates the runtime location and installed assets.
2. Selects primary and optional backup models.
3. Collects model-provider API keys.
4. Collects agent and service tokens for enabled integrations.
5. Completes Gmail application authorization when Gmail is enabled.
6. Collects optional research, image-generation, and external-service credentials.
7. Starts the local gateway and performs functional health checks.
8. Opens the first secure terminal session with SIM-ONE Alpha.

Secrets are written to `~/.gorombo/.env` or the configured deployment secret
store. Model selection and non-secret runtime behavior are written to
`~/.gorombo/sim-one-alpha/gorombo.config.json`. Secrets are not written into
the agent workspace or stored as conversation text.

## First Conversation

After validation, onboarding opens the SIM-ONE terminal interface. The first
session is the secure local control point for finishing setup.

The user can:

- verify that the selected model responds;
- confirm the agent identity and workspace context;
- connect communication channels;
- approve connector users and conversations;
- add optional capabilities.

The local terminal session is established before remote connector pairing so
connector access can be admitted from an authenticated local surface.

## Pair Connectors

The release onboarding contract continues from the first terminal session into
conversational connector setup. Telegram pairing is backed by the current
connector runtime. Discord remains a pre-release gate.

Connector credentials remain in the runtime secret store. Pairing and
allow-list records remain in product-owned storage outside the model context.
See [Connectors And Pairing](../guides/connectors.md).

## Release Validation

Onboarding is complete only when:

- installed assets and configuration pass functional checks;
- the gateway responds correctly;
- the terminal interface can create a fresh durable session;
- the orchestrator returns an end-to-end response;
- each enabled remote connector accepts only paired or allowed users.

A running process or listening port does not satisfy this contract by itself.

## Related Documentation

- [Pre-Release Status](pre-release-status.md)
- [Installation](installation.md)
- [Configuration Reference](../reference/configuration.md)
- [Terminal And Session Guide](../guides/terminal-and-sessions.md)
- [Connectors And Pairing](../guides/connectors.md)
- [Troubleshooting](../operations/troubleshooting.md)
