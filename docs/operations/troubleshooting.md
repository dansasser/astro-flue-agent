# Troubleshooting

The packaged diagnostic and service commands are not available in the
pre-release CLI. Verify behavior at the output level: inspect the launcher
error, request `/health`, open `sim-one`, submit a prompt, and confirm the
expected response or side effect.

## Installation Problems

The packaged installer is not published. Do not execute mutable `latest`
content through `curl | sh`. Release installation uses a version-pinned
download and checksum verification as documented in
[Installation](../getting-started/installation.md).

For a source build, compare prerequisites and commands with
[Installation](../getting-started/installation.md).

## Gateway Does Not Start

Confirm:

- `src/core/config/gorombo.config.json` is valid JSON before a source build,
  or `<runtime-root>/gorombo.config.json` is valid JSON in a
  packaged installation;
- `gateway.port` is an integer from 1 to 65535;
- the port is not occupied by another service;
- selected model cards have their required credentials;
- installed runtime files are readable by the current user.

Restart the gateway through the process or service manager that launched it.
Do not treat a running process or listening port as proof that the gateway is
working. Request `/health`, then submit a real terminal prompt and confirm the
orchestrator responds correctly.

## Terminal Cannot Connect

Start the terminal interface with `sim-one` and preserve the exact connection
error.

When connecting to a non-default gateway:

```bash
sim-one --port <number>
sim-one --base-url <url>
```

`--base-url` overrides `--port`. The current terminal client supports a
loopback HTTP endpoint and does not send `x-api-secret`; it cannot connect
directly to a non-loopback gateway protected by external API authentication.
Use an SSH tunnel that exposes the remote gateway on a local loopback port.

## Model Or Credential Failure

Read `models.primary` and optional `models.backup` from
`<runtime-root>/gorombo.config.json`, then verify the matching credentials are
configured in `<runtime-root>/sim-one.config`.

For a source checkout, edit `src/core/config/gorombo.config.json`, rebuild to
refresh `.gorombo/gorombo.config.json`, and keep environment-style settings in
the ignored checkout `sim-one.config`. The build copies it to
`.gorombo/sim-one.config` with mode `0600`. The product wrapper uses only the
canonical files in its owning runtime root and does not search legacy `.env`
locations.

| Model family | Credentials |
| --- | --- |
| Ollama Cloud cards | `OLLAMA_API_KEY` or `OLLAMA_CLOUD_API_KEY` |
| Codex Brain | `CODEX_BRAIN_LOCAL_API_URL` and `CODEX_BRAIN_LOCAL_API_KEY` |

The Codex Brain URL must include `/v1`. Remove an unused backup card when its
provider is intentionally not configured. The current runtime validates backup
metadata and credentials but does not automatically fail over from the primary
card.

After changes, restart the gateway through its launcher and verify a real model
response.

## Session Cannot Be Resumed

List recent sessions inside the terminal:

```text
/sessions
```

Resume by exact id or explicit name:

```text
/resume <session-id-or-name>
```

or:

```bash
sim-one --session <session-id-or-name>
```

A session is available only to its owning connector, actor, and conversation.
Duplicate explicit names are rejected rather than guessed.

## Telegram Does Not Respond

Check:

- `TELEGRAM_BOT_TOKEN` is present;
- `TELEGRAM_WEBHOOK_SECRET_TOKEN` matches the configured webhook;
- the stored Telegram DM policy is `pairing`, `allowlist`, or `disabled`;
- the user has completed pairing or appears in the allow list;
- group mention and user restrictions admit the message.

Use the authenticated local terminal session to inspect or approve pending
pairings. Do not place bot tokens or webhook secrets into a chat prompt.

See [Connectors And Pairing](../guides/connectors.md).

## Capability Does Not Appear

List the capability:

```bash
sim-one skill list
sim-one tool list
sim-one worker list
sim-one mcp list
```

Confirm that it is enabled, restart the gateway through its launcher, and open
a new terminal session to verify that the capability is attached.

Tools, workers, and MCP servers are disabled by default unless explicitly
enabled. Name collisions and unsafe ids fail without changing the registry.

## External API Returns `401` Or `503`

For non-loopback requests:

- configure `API_SECRET`;
- send it in the `x-api-secret` header;
- do not rely on forwarded loopback addresses to bypass authentication.

`401` means the supplied secret is wrong. `503` means external API
authentication is not configured.

See [HTTP API Reference](../reference/http-api.md).

## Memory Or Retrieval Problems

Check that the runtime can read the configured databases and bundled retrieval
assets. Source-build defaults are:

```text
.gorombo/db/
.gorombo/vector/
.gorombo/db/capabilities.sqlite
```

Every relative path resolves from the owning `.gorombo` runtime root.
Packaged installs conventionally use `~/.gorombo`, but a moved tree keeps all
of these locations together. Do not edit the databases directly. Restore
related state from a consistent backup when recovery is required.

## Logs And Diagnostics

The SIM-ONE terminal UI writes privacy-safe, rotating JSONL diagnostics to:

```text
<runtime-root>/logs/sim-one-ratatui.jsonl
```

This TUI log is bounded and omits prompt text, responses, selected text,
secrets, session names, and raw errors. For the gateway and workers, preserve
stdout/stderr from the launcher or service manager and inspect the protected
`/api/telemetry/runs` and `/api/telemetry/runs/:runId` endpoints. Use event
categories, session ids, run ids, and timestamps to correlate failures across
those surfaces.

## Recovery Order

Use this order:

1. Preserve the exact terminal or launcher error.
2. Validate configuration and required credentials.
3. Restart through the launcher or service manager.
4. Request `/health`.
5. Reproduce from the local terminal with a real prompt.
6. Check connector, session, run, or telemetry identifiers.
7. Repair the installation only after preserving the complete active
   `.gorombo` runtime root.

## Related Documentation

- [Installation](../getting-started/installation.md)
- [Onboarding](../getting-started/onboarding.md)
- [Configuration Reference](../reference/configuration.md)
- [Terminal And Session Guide](../guides/terminal-and-sessions.md)
- [CLI Reference](../reference/cli.md)
