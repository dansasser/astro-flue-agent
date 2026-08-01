# Runtime Configuration Inventory

## Method

This inventory was derived from production `process.env` and injected `env`
reads, Rust `std::env` reads, model-card credential declarations, runtime MCP
token allowlists, package/launcher scripts, the legacy `.env.example`, and the
current configuration reference. Test files and source-workspace repositories
were scanned separately so test controls are not mistaken for owner settings.

No secret value was read.

## Supported User Configuration

Every key in this section belongs in the typed registry and
`sim-one.config.example`.

| Subsystem | Keys | Secret | Current owner |
| --- | --- | --- | --- |
| Gateway | `API_SECRET` | yes | External gateway authentication |
| Ollama Cloud | `OLLAMA_API_KEY`, `OLLAMA_CLOUD_API_KEY`, `OLLAMA_CLOUD_BASE_URL` | keys yes; URL no | Model cards and provider registration |
| Ollama Local | `OLLAMA_LOCAL_API_KEY`, `OLLAMA_LOCAL_BASE_URL` | key potentially; URL no | Local model and embedding provider |
| Codex Brain | `CODEX_BRAIN_LOCAL_API_KEY`, `CODEX_BRAIN_LOCAL_API_URL` | key yes; URL no | Codex Brain model card |
| Web search | `GOROMBO_WEB_SEARCH_PROVIDER`, `OLLAMA_WEB_SEARCH_BASE_URL`, `OLLAMA_WEB_SEARCH_TIMEOUT_MS` | no | RAG provider selection |
| Retrieval | `GOROMBO_RAG_MAX_CONTEXT_TOKENS`, `GOROMBO_RAG_WEB_FETCH_TOP_K` | no | Retrieval workflow |
| Research policy | `GOROMBO_RESEARCH_DEPTH`, `GOROMBO_RESEARCH_FRESHNESS`, `GOROMBO_RESEARCH_MAX_QUERIES`, `GOROMBO_RESEARCH_MAX_FETCHES`, `GOROMBO_RESEARCH_MAX_CONTEXT_TOKENS`, `GOROMBO_RESEARCH_LIMIT`, `GOROMBO_RESEARCH_WEB_FETCH`, `GOROMBO_RESEARCH_MIN_SOURCES`, `GOROMBO_RESEARCH_MAX_ITERATIONS`, `GOROMBO_RESEARCH_SEARCH_TTL_MS`, `GOROMBO_RESEARCH_PAGE_TTL_MS` | no | Research workflow |
| Research cache | `GOROMBO_RESEARCH_CACHE`, `GOROMBO_RESEARCH_CACHE_DB` | no | Research cache |
| Embeddings | `GOROMBO_EMBEDDING_MODEL_PATH`, `GOROMBO_EMBEDDING_TIMEOUT_MS` | no | Embedding model loader |
| Memory | `GOROMBO_MEMORY_BACKEND`, `GOROMBO_MEMORY_SQLITE_PATH`, `GOROMBO_MEMORY_WASM_MODULE_PATH`, `GOROMBO_MEMORY_DEFAULT_LIMIT`, `GOROMBO_MEMORY_MAX_CONTEXT_TOKENS`, `GOROMBO_MEMORY_RETENTION_DAYS`, `GOROMBO_MEMORY_ARCHIVE_DELETE_DAYS`, `GOROMBO_MEMORY_MAX_CHECKLIST_DEPTH` | no | Structured-memory runtime |
| Schedules | `GOROMBO_SKIP_SCHEDULES`, `GOROMBO_SCHEDULES_DATABASE_PATH`, `GOROMBO_SCHEDULES_MAX_CONCURRENT_RUNS`, `GOROMBO_SCHEDULES_KEEP_RUNS`, `GOROMBO_SCHEDULES_MAX_ATTEMPTS`, `GOROMBO_SCHEDULES_SHUTDOWN_GRACE_SECONDS`, `GOROMBO_SCHEDULES_PROVIDER_PREFLIGHT`, `GOROMBO_SCHEDULES_SESSION_RETENTION` | no | Schedule configuration and boot |
| Telegram | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET_TOKEN`, `TELEGRAM_APPROVED_USER_IDS`, `TELEGRAM_ADMIN_USER_IDS`, `TELEGRAM_BOT_USERNAME`, `TELEGRAM_MENTION_PATTERNS` | token and webhook secret yes | Telegram connector and admin route |
| GitHub | `GITHUB_PERSONAL_ACCESS_TOKEN` | yes | Coding Worker official GitHub MCP and private-clone fallback |
| RunPod chat and image | `RUNPOD_API_KEY`, `RUNPOD_CHAT_BASE_URL`, `RUNPOD_API_BASE_URL`, `RUNPOD_IMAGE_MODELS_PATH`, `GOROMBO_IMAGE_OUTPUT_DIR` | key yes | RunPod model provider and image tool |
| Approvals | `GOROMBO_APPROVAL_ROOT` | no | Shared approval service |
| Capabilities | `GOROMBO_CAPABILITY_DB_PATH`, `GOROMBO_CAPABILITIES_DIR` | no | Capability store and loader |
| Protocols | `GOROMBO_PROTOCOL_DB_PATH` | no | Protocol tool and provider |
| Coding workspace | `GOROMBO_WORKSPACE_ROOT` | no | Orchestrator and Coding Worker workspace |
| Knowledge | `GOROMBO_KNOWLEDGE_DEFAULT_ACTOR_ID` | no | Knowledge API default actor |
| Runtime MCP token slots | `GOROMBO_MCP_TOKEN`, `MCP_AUTH_TOKEN`, `MCP_TOKEN` | yes | Runtime MCP broker allowlist |
| TUI diagnostics | `SIM_ONE_TUI_LOG_PATH` | no | Rust TUI diagnostics |

## Supported Compatibility Aliases

These names are currently consumed but should be normalized to the canonical
registry entry and documented as compatibility aliases rather than separate
configuration concepts.

| Canonical key | Existing aliases |
| --- | --- |
| `OLLAMA_WEB_SEARCH_TIMEOUT_MS` | `GOROMBO_WEB_SEARCH_TIMEOUT_MS` |
| `GOROMBO_CAPABILITIES_DIR` | `GOROMBO_CAPABILITY_DIR` |
| `GOROMBO_WORKSPACE_ROOT` | `GOROMBO_CODING_WORKSPACE_ROOT`, `GOROMBO_CODING_REPO_PATH` |

## Launcher-Derived Or Bootstrap Values

These are required process inputs or generated values, but they are not normal
owner onboarding fields.

| Key | Classification |
| --- | --- |
| `GOROMBO_RUNTIME_ROOT` | Derived from the packaged executable; explicit override is an advanced bootstrap |
| `PORT` | Derived from `gorombo.config.json` gateway configuration and supplied to the server |
| `SIM_ONE_NODE` | Advanced host bootstrap needed to locate Node before application configuration loads |
| `SIM_ONE_SERVER_PATH` | Development/test executable override |
| `SIM_ONE_TUI_PATH` | Development/test executable override |
| `SIM_ONE_ENV_PATH` | Retired legacy env-file selector; production launchers no longer accept it |

## Command-Scoped Developer Controls

These belong to specific scripts rather than normal installed-product
onboarding:

`GOROMBO_RESEARCH_ACTOR_ID`, `GOROMBO_RESEARCH_CONVERSATION_ID`,
`GOROMBO_RESEARCH_SESSION`, `GOROMBO_RESEARCH_FETCH_TOP_K`,
`DOWNLOAD_TIMEOUT_MS`, and `CARGO_TARGET_DIR`.

## Internally Generated Command Environment

The Coding Worker creates or clears `GIT_ASKPASS`, `GIT_TERMINAL_PROMPT`,
`GIT_CONFIG_NOSYSTEM`, `GIT_CONFIG_GLOBAL`, `GIT_CONFIG_COUNT`,
`GIT_CONFIG_KEY_0`, and `GIT_CONFIG_VALUE_0` for one bounded Git command.
These are not owner configuration. Incoming `GIT_CONFIG_*` values are removed
from the general Coding Worker environment before command execution.

## Test-Only Controls

These remain explicit harness inputs and must not appear as production
integration settings:

`GOROMBO_TEST_MODE`, `GOROMBO_HTTP_SMOKE_API_SECRET`,
`GOROMBO_HTTP_SMOKE_PORT`, `GOROMBO_HTTP_TEST_API_SECRET`,
`GOROMBO_SMOKE_API_SECRET`, `GOROMBO_SMOKE_PORT`,
`GOROMBO_SMOKE_REAL_MODEL`, `CODING_WORKER_APPROVED_BASE`,
`CODING_WORKER_APPROVED_OVERRIDE`, `CODING_WORKER_SECRET_LEAK`,
`SIM_ONE_PRODUCT_PATH`, `SIM_ONE_TEST_CWD_MARKER`, `SIM_ONE_TEST_MODEL_CARD`,
`SIM_ONE_TEST_LISTEN_FD`,
`SIM_ONE_TUI_EXIT_AFTER_STARTUP`, `SIM_ONE_TUI_TEST_PROMPT`,
`SIM_ONE_TUI_TEST_PROMPTS`, and `SIM_ONE_TUI_TEST_STARTUP`.

## Operating-System Inputs

`PATH`, `HOME`, `NVM_DIR`, `NODE_ENV`, `USER`, `TEMP`, `TMP`, `SystemRoot`,
`ComSpec`, `COMSPEC`, and package-manager process variables remain host inputs.
They are not copied into `sim-one.config`.

## Deprecated, Forbidden, Or Unsupported

| Keys | Status |
| --- | --- |
| `GOROMBO_MODEL`, `GOROMBO_MODEL_BACKUP` | Deprecated and rejected; model selection belongs in `gorombo.config.json` |
| `GH_TOKEN`, `GITHUB_TOKEN`, `GH_CONFIG_DIR` | Not GitHub credential sources; stripped from the general Coding Worker environment |
| `OPENAI_API_KEY` | Present in the old example but no production consumer exists |
| `TAVILY_API_KEY`, `BRAVE_SEARCH_API_KEY` | Present in the old example but no provider consumes them |
| Gmail/Google credential names | No implemented integration or consumed key exists |
| `JINA_API_KEY` | No production consumer exists |
| MongoDB connection keys | No current production consumer exists |

Future implementation must remove unsupported placeholders from the canonical
example or add a real registry-backed capability, tests, and graph lineage.
