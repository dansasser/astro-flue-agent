# Connectors And Pairing

Connectors let SIM-ONE Alpha receive messages outside the local terminal
interface. Every connector normalizes external input into a trusted internal
event and sends it through the same governed orchestrator.

## Pair From The Local Terminal

The packaged release contract starts connector pairing from the first
authenticated terminal session after
[Onboarding](../getting-started/onboarding.md). That conversational setup flow
is a pre-release gate. The current source checkout includes Telegram and the
generic Web API; it does not include Discord.

The connector setup flow:

1. Configure connector credentials in the runtime secret store.
2. Start or validate the connector.
3. Receive a pairing request from the external account.
4. Bind approval to the connector, actor, and conversation.
5. Record the allow-list or pairing decision outside model context.
6. Confirm access from the external channel.

Connectors normalize and deliver messages. They do not bypass the orchestrator,
protocol system, approvals, or worker boundaries.

## Telegram

Telegram requires:

| Setting | Purpose |
| --- | --- |
| `TELEGRAM_BOT_TOKEN` | Bot API credential |
| `TELEGRAM_WEBHOOK_SECRET_TOKEN` | Verifies webhook delivery |
| `TELEGRAM_DM_POLICY` | Direct-message admission mode |
| `TELEGRAM_ADMIN_USER_IDS` | Optional connector administrators |
| `TELEGRAM_APPROVED_USER_IDS` | Optional pre-approved users |
| `TELEGRAM_BOT_USERNAME` | Optional bot username for mention handling |
| `TELEGRAM_MENTION_PATTERNS` | Optional group mention patterns |

The default direct-message policy is `pairing`.

| Policy | Behavior |
| --- | --- |
| `pairing` | Unknown users receive a time-limited pairing flow |
| `allowlist` | Only stored or configured allowed users are admitted |
| `disabled` | Direct messages are rejected |

### Pair A Telegram User

1. Send a direct message to the configured bot.
2. Receive the pairing code or request.
3. Approve the pending request through the authenticated Telegram admin API.
4. Confirm that the request is bound to the expected user and chat.
5. Send another Telegram message after approval.

Pairing codes expire and are accepted only for the pending request they
identify. Approval creates an allow-list record for the Telegram user and chat.

### Telegram Groups

Group access is configured per group. A group can require a bot mention and can
restrict messages to an explicit user list.

Group configuration is stored in the connector database, not in prompt text.
Removing a group or user takes effect at the connector admission layer.

## Web API

External applications can use the Secure Web API. Non-loopback clients send
the configured `API_SECRET` in the `x-api-secret` header. The generic chat
ingress accepts `web-api` and `tui`; authenticated callers may select either
identity and must provide stable ownership fields. Callers cannot claim
Telegram or another trusted connector by changing a JSON field.

See the [HTTP API Reference](../reference/http-api.md) for routes and request
requirements.

## Scheduled Execution

Scheduled jobs enter through the orchestrator and use the same protocols,
memory, capability boundaries, and progress reporting as interactive work.
Schedule definitions and run history are stored in SQLite.

## Connector Security

- Pairing and allow lists are enforced before model execution.
- Connector identity comes from verified ingress, not model-selected text.
- Secrets remain in the runtime environment or secret manager.
- The orchestrator loads applicable protocols before acting.
- Mutating work still uses approval-gated execution paths.
- Connector-specific replies return through the initiating channel.

## Related Documentation

- [Onboarding](../getting-started/onboarding.md)
- [Configuration Reference](../reference/configuration.md)
- [HTTP API Reference](../reference/http-api.md)
- [Telegram Operations](../operations/telegram-connector.md)
- [Architecture Overview](../architecture/overview.md)
- [Troubleshooting](../operations/troubleshooting.md)
