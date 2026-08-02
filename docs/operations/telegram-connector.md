# Telegram Connector Operations

SIM-ONE Alpha uses Flue's Telegram channel for authenticated webhook ingress
and the Telegram Bot API for replies and administrative notifications.

## Runtime Behavior

- Flue authenticates webhook requests with `TELEGRAM_WEBHOOK_SECRET_TOKEN`.
- SIM-ONE normalizes admitted updates and persists trusted event context.
- Direct-message and group admission runs before orchestrator dispatch.
- The durable orchestrator receives admitted messages.
- The orchestrator binds `telegram_reply` to the trusted event id on the
  current Flue delivery; the model supplies response text, not a destination.
- Pairing, allow-list, group, and policy records live in the session database.

## Configuration

Set the required values in the runtime secret environment:

```bash
TELEGRAM_BOT_TOKEN=<bot-api-token>
TELEGRAM_WEBHOOK_SECRET_TOKEN=<random-webhook-secret>
```

Optional admission settings:

```bash
TELEGRAM_APPROVED_USER_IDS=<comma-separated-user-ids>
TELEGRAM_ADMIN_USER_IDS=<comma-separated-admin-ids>
TELEGRAM_BOT_USERNAME=<bot-username>
TELEGRAM_MENTION_PATTERNS=<comma-separated-patterns>
TELEGRAM_API_ROOT=<optional-bot-api-root>
```

`TELEGRAM_API_ROOT` defaults to `https://api.telegram.org`. Set it only for a
self-hosted Bot API server or a deterministic test endpoint.

Omit `TELEGRAM_BOT_TOKEN` to run without Telegram. When the bot token is set,
`TELEGRAM_WEBHOOK_SECRET_TOKEN` is required and startup fails without it.

The current connector normalizes message metadata but does not download
Telegram attachments into a local inbox.

## Direct-Message Policies

| Policy | Behavior |
| --- | --- |
| `pairing` | Admits users after a stored pairing request is approved |
| `allowlist` | Admits only stored or configured users |
| `disabled` | Rejects all Telegram messages in the current connector |

The stored policy is authoritative; the default is `pairing`. Change it through
`POST /api/connectors/telegram/policy`.
Although the setting is named `dmPolicy`, the current source checks `disabled`
before distinguishing direct messages from groups.
Pending-pairing storage and the pair/deny admin routes are implemented. The
current webhook path does not yet create and deliver a pairing code when an
unknown user is rejected. That release connection is tracked in
[Pre-Release Status](../getting-started/pre-release-status.md). Use the
authenticated `allow` route for current source deployments.

## Group Admission

A group must have a stored group record. Its record can require a bot mention
and restrict triggering users with `allowFrom`. The sender must also be in the
stored or configured user allow list.

## Admin API

All admin routes require the external API authentication contract documented in
the [HTTP API Reference](../reference/http-api.md).

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/connectors/telegram/status` | List policy, users, pending pairings, and groups |
| `GET` | `/api/connectors/telegram/health` | Return connector counters and last-update state |
| `POST` | `/api/connectors/telegram/pair` | Approve an existing pending pairing code |
| `POST` | `/api/connectors/telegram/deny` | Deny a pending pairing code |
| `POST` | `/api/connectors/telegram/allow` | Add an allowed user |
| `POST` | `/api/connectors/telegram/remove` | Remove an allowed user |
| `POST` | `/api/connectors/telegram/policy` | Change the direct-message policy |
| `GET` | `/api/connectors/telegram/groups` | List configured groups |
| `POST` | `/api/connectors/telegram/group` | Add or update a group |
| `DELETE` | `/api/connectors/telegram/group/:groupId` | Remove a group |

Example approval request:

```http
POST /api/connectors/telegram/pair
x-api-secret: <API_SECRET>
content-type: application/json

{"code":"a4f91c"}
```

This request succeeds only for a pending record that already exists. Automatic
creation and delivery of that record from webhook ingress is a release gate.
For current source deployments, admit a user directly:

```http
POST /api/connectors/telegram/allow
x-api-secret: <API_SECRET>
content-type: application/json

{"userId":"123456789","chatId":"123456789"}
```

## Functional Verification

Do not treat a process, port, or health payload alone as proof that Telegram is
working.

1. Send a webhook update with Telegram's configured secret token.
2. Confirm `/api/connectors/telegram/health` records a recent update.
3. Send a message from an allowed user.
4. Confirm the orchestrator handles it and a Telegram reply arrives.
5. Confirm an unknown or disallowed user is rejected by the admission policy.

## Security Boundary

- Webhook authentication occurs before update handling.
- Connector identity comes from the Telegram channel, not a model-supplied
  field.
- Admission uses stored policy and trusted sender/chat identifiers.
- The reply tool rehydrates trusted event context and cannot select an
  arbitrary Telegram conversation.
- Tokens and webhook secrets stay in the runtime secret environment.
