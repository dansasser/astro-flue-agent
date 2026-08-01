# Configuration Reference

SIM-ONE Alpha separates non-secret runtime configuration from credentials and
service secrets.

## Source-Build Configuration Files

| File | Purpose |
| --- | --- |
| `src/core/config/gorombo.config.json` | Source seed for models, storage, memory, schedules, gateway settings, and capabilities |
| `.gorombo/gorombo.config.json` | Generated non-secret configuration loaded by the built product |
| `sim-one.config.example` | Tracked complete registry of environment-style settings with blank secrets |
| `sim-one.config` | Ignored owner configuration for source development and local builds |
| `.gorombo/sim-one.config.example` | Runtime template shipped in local and public packages |
| `.gorombo/sim-one.config` | Owner-only runtime configuration; excluded from public packages |

Keep secrets out of `gorombo.config.json`. Do not commit `sim-one.config` or
copy its values into an agent workspace, issue, log, or chat transcript. Run
the runtime build after changing either source file; the build replaces the
generated copies. The complete `.gorombo` directory is the movable packaged
runtime root.

## Applying Configuration

The pre-release CLI does not include an owner-facing onboarding command yet.
Edit non-secret JSON and the owner configuration directly, then restart the
gateway through the process or service manager that launched it. The gateway
loads both files at startup.

`sim-one.config` is authoritative for every registered environment-style key.
The bootstrap clears inherited values for those keys before loading the file,
so a caller shell cannot silently override the owning runtime. Unknown,
duplicate, or invalid entries fail startup with key-level diagnostics that do
not include values. On POSIX hosts, a non-regular file, a file not owned by the
current user, or permissions other than `0600` fail startup before any value is
loaded. Missing configuration reports both the required owner path and its
adjacent example path.

To migrate an existing environment file without printing values:

```sh
pnpm run config:migrate -- /absolute/path/to/legacy.env
```

The migration writes repository-root `sim-one.config` atomically with mode
`0600`, normalizes supported deprecated aliases, and reports only key names and
counts. Unsupported and bootstrap-only entries are omitted.

The Coding Worker can inspect redacted configured/missing status and validate
the owner file. A set or removal, including a secret explicitly supplied by the
user for that request, requires the `runtime.config.update` approval action and
writes atomically with owner-only permissions.

The dedicated update tool is write-only for supplied secrets: it cannot return
or discover an existing configured value. Approval requests, progress events,
logs, tool results, and final responses contain only the key name, operation,
payload digest, and restart requirement. General Coding Worker sandbox, shell,
file, repository, and memory tools cannot access the owner configuration file.

## Configuration Shape

The runtime configuration declares schema version `1`.

```json
{
  "version": 1,
  "models": {
    "primary": "minimax-m3-cloud",
    "backup": "codex-brain"
  },
  "storage": {
    "flueDatabasePath": "db/flue.sqlite",
    "sessionDatabasePath": "db/sessions.sqlite"
  },
  "memory": {
    "enabled": true,
    "backend": "sqlite",
    "defaultLimit": 10,
    "maxContextTokens": 1500,
    "enableSemanticNotes": true,
    "retentionDays": 30,
    "archiveDeleteDays": 365,
    "maxChecklistDepth": 5
  },
  "gateway": {
    "mode": "service",
    "port": 3940
  },
  "capabilities": []
}
```

Unknown application-owned blocks can be preserved, but the runtime validates
the required version and model selection plus typed storage, gateway, and
capability fields.

## Models

`models.primary` is required. `models.backup` is optional and must select a
different model card. The registry validates both selected cards and their
credentials at startup. The backup card is currently configuration metadata;
the runtime does not automatically fail over to it when the primary model
fails.

| Model card | Required credentials |
| --- | --- |
| `minimax-m3-cloud` | `OLLAMA_API_KEY` or `OLLAMA_CLOUD_API_KEY` |
| `deepseek-v4-pro-cloud` | `OLLAMA_API_KEY` or `OLLAMA_CLOUD_API_KEY` |
| `qwen3-5-cloud` | `OLLAMA_API_KEY` or `OLLAMA_CLOUD_API_KEY` |
| `kimi-k2.7-code-cloud` | `OLLAMA_API_KEY` or `OLLAMA_CLOUD_API_KEY` |
| `kimi-k2-6-runpod` | `RUNPOD_API_KEY` |
| `codex-brain` | `CODEX_BRAIN_LOCAL_API_URL` and `CODEX_BRAIN_LOCAL_API_KEY` |

Ollama Cloud defaults to `https://ollama.com/v1`.
RunPod chat defaults to
`https://api.runpod.ai/v2/moonshot-kimi/openai/v1`; use
`RUNPOD_CHAT_BASE_URL` only for a reviewed OpenAI-compatible chat endpoint.
`CODEX_BRAIN_LOCAL_API_URL` must include the OpenAI-compatible `/v1` base path.

Model cards own provider identifiers, context limits, output limits, and
credential names. Provider secrets do not belong in model cards.

Startup fails closed for an unknown card, duplicate primary and backup cards,
or missing credentials for a selected model.

## Gateway

```json
{
  "gateway": {
    "mode": "service",
    "port": 3940
  }
}
```

Supported modes are `dev`, `terminal`, and `service`. The port must be an
integer from 1 to 65535.

Set `API_SECRET` for non-loopback gateway clients. Local terminal requests from
the loopback interface do not require the header. Requests carrying forwarding
headers are treated as external.

## Runtime Root

Every packaged operational path belongs to one absolute runtime tree:

```text
<runtime-root>/sim-one.config
<runtime-root>/sim-one.config.example
<runtime-root>/gorombo.config.json
<runtime-root>/sim-one-alpha/
<runtime-root>/sim-one-cli/
<runtime-root>/sim-one-ratatui/
<runtime-root>/workspace/{repos,projects}/
<runtime-root>/db/
<runtime-root>/capabilities/
<runtime-root>/approvals/
<runtime-root>/auth/
<runtime-root>/logs/
<runtime-root>/coding-worker/
```

The conventional installed path is `~/.gorombo`, but the whole tree can be
moved. Packaged executables derive the root from their own location and pass
the absolute `GOROMBO_RUNTIME_ROOT` to the gateway. The main persona is the
read-only packaged content at `sim-one-alpha/workspace/`; model-writable coding
projects are separate under `workspace/`.

## Storage

```json
{
  "storage": {
    "flueDatabasePath": "db/flue.sqlite",
    "sessionDatabasePath": "db/sessions.sqlite",
    "vectorStorePath": "vector"
  }
}
```

| Runtime data | Default location under `<runtime-root>` |
| --- | --- |
| Flue runtime state | `db/flue.sqlite` |
| Connector and logical session data | `db/sessions.sqlite` |
| Structured memory | `db/structured-memory.sqlite` |
| Protocols | `db/protocols.sqlite` |
| Runtime capabilities | `db/capabilities.sqlite` |
| Schedules and run history | `db/schedules.sqlite` |
| Semantic retrieval data | `vector/` |

Relative runtime paths resolve from the one canonical `.gorombo` runtime root,
never from `process.cwd()`. `GOROMBO_RUNTIME_ROOT` may select a different
absolute installation, but it must name the owning directory and end in
`.gorombo`. These files are runtime-managed; back up the complete active
runtime root and do not edit SQLite records directly.

`GOROMBO_WORKSPACE_ROOT`, `GOROMBO_IMAGE_OUTPUT_DIR`, and their absolute or
relative overrides must remain inside the owning runtime root. Packaged
embedding, image-catalog, WASM, persona, and language-server assets are resolved
from `sim-one-alpha/`; an installed runtime does not fall back to a surrounding
source checkout.

## Structured Memory

The memory block controls durable checklists, todos, session notes, retention,
and retrieval limits.

| Field | Purpose |
| --- | --- |
| `enabled` | Enables structured memory |
| `backend` | Durable backend; `sqlite` is the product default |
| `defaultLimit` | Default number of retrieved records |
| `maxContextTokens` | Maximum structured-memory context returned to the agent |
| `enableSemanticNotes` | Enables semantic note retrieval |
| `retentionDays` | Active-record retention period |
| `archiveDeleteDays` | Archived-record deletion horizon |
| `maxChecklistDepth` | Maximum checklist nesting depth |

Deployment overrides use `GOROMBO_MEMORY_*`, including:

```text
GOROMBO_MEMORY_BACKEND
GOROMBO_MEMORY_SQLITE_PATH
GOROMBO_MEMORY_DEFAULT_LIMIT
GOROMBO_MEMORY_MAX_CONTEXT_TOKENS
GOROMBO_MEMORY_RETENTION_DAYS
GOROMBO_MEMORY_ARCHIVE_DELETE_DAYS
GOROMBO_MEMORY_MAX_CHECKLIST_DEPTH
```

## Providers And Services

### Web Research

Web research uses the configured Ollama key by default.

```text
GOROMBO_WEB_SEARCH_PROVIDER
OLLAMA_WEB_SEARCH_BASE_URL
OLLAMA_WEB_SEARCH_TIMEOUT_MS
GOROMBO_RAG_MAX_CONTEXT_TOKENS
GOROMBO_RAG_WEB_FETCH_TOP_K
```

### Embeddings And Retrieval

The embedding chain uses model-card-defined cloud embeddings when configured,
then the bundled local ONNX model, then an optional model-card-defined local
Ollama endpoint.

```text
OLLAMA_LOCAL_BASE_URL
OLLAMA_LOCAL_API_KEY
GOROMBO_EMBEDDING_MODEL_PATH
GOROMBO_EMBEDDING_TIMEOUT_MS
```

The current runtime does not read embedding-model-name environment overrides.
Cloud and local Ollama embedding model identifiers come from the bundled model
cards.

Configure the vector database with `storage.vectorStorePath` in
`gorombo.config.json`. The current runtime does not read a vector-store
environment override.

### RunPod Chat And Image Generation

```text
RUNPOD_API_KEY
RUNPOD_CHAT_BASE_URL
RUNPOD_API_BASE_URL
RUNPOD_IMAGE_MODELS_PATH
GOROMBO_IMAGE_OUTPUT_DIR
```

`RUNPOD_CHAT_BASE_URL` configures the OpenAI-compatible model provider.
`RUNPOD_API_BASE_URL` remains specific to the image SDK path. Keeping these
separate prevents a chat override from redirecting image requests.

Relative image catalog and output paths resolve from the canonical runtime
root. Image output is constrained to that root.

### Telegram

```text
TELEGRAM_BOT_TOKEN
TELEGRAM_WEBHOOK_SECRET_TOKEN
TELEGRAM_ADMIN_USER_IDS
TELEGRAM_APPROVED_USER_IDS
TELEGRAM_BOT_USERNAME
TELEGRAM_MENTION_PATTERNS
```

See [Connectors And Pairing](../guides/connectors.md).

## Approvals And GitHub

```text
GOROMBO_APPROVAL_ROOT
GITHUB_PERSONAL_ACCESS_TOKEN
```

Approval records default to `<runtime-root>/approvals/`, outside the Coding
Worker workspace. The official GitHub MCP reads
`GITHUB_PERSONAL_ACCESS_TOKEN` only from the trusted gateway environment.
General shell tools, model instructions, transcripts, and connector payloads do
not receive it. Public GitHub HTTPS clone is attempted anonymously before a
command-scoped credentialed retry.

## Runtime Capabilities

Runtime capabilities can be seeded in `gorombo.config.json`, but the SQLite
capability registry becomes authoritative after installation.

Each capability record includes:

```text
id
kind
name
description
source
sourceRef
version
enabled
config
```

Valid kinds are `skill`, `tool`, `worker`, and `mcp`. Use the product CLI for
normal capability management rather than editing the configuration array.

## Validation

After changes, restart the gateway through its launcher and verify an
end-to-end terminal response.

See [Troubleshooting](../operations/troubleshooting.md) when configuration or
credential validation fails.
