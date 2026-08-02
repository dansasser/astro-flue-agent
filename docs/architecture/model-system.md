# Model System

Flue agents reference models with string specifiers:

```text
provider-id/model-id
```

Built-in providers such as OpenAI and Anthropic can be referenced directly when their provider credentials are available. Non-built-in or OpenAI-compatible providers, such as Ollama and local model gateways, must be registered in project code before an agent references them.

This project keeps model cards under their owning provider directories in `src/core/models/providers/<provider>/cards` so the orchestrator does not hardcode model IDs, context limits, or provider-specific capabilities.

## Why Cards Exist

Cards are the boundary between model selection and runtime behavior. They make model metadata explicit before the agent, session manager, RAG router, or compaction layer makes token-budget decisions.

The same provider can expose models with very different limits. MiniMax M3, DeepSeek V4 Pro, and Qwen 3.5 all run through `ollama-cloud`, but they do not have the same context window, output ceiling, modalities, or long-context reliability notes. Keeping those facts in card files lets downstream systems ask the selected card for limits instead of spreading hardcoded numbers across the codebase.

Cards also preserve conflicting-but-useful metadata. For example, MiniMax advertises M3 as a 1M-context model with a guaranteed 512K minimum, while Ollama Cloud currently reports 524288. The card stores each value separately so session budgeting can choose the conservative operational budget while still retaining the advertised/native capability.

## Runtime Use

Runtime setup has two layers:

1. Provider modules in `src/core/models/providers/<provider>` create Pi providers and register them with Flue 2 through `setProvider(...)` during runtime bootstrap.
2. Model cards in each provider's `cards/` directory provide the model IDs and per-model metadata used by those provider registrations and by the orchestrator model registry.
3. The shipped `gorombo.config.json` runtime file selects active project model card keys for the running deployment.
4. `src/core/models/catalog.ts` aggregates provider-owned cards for lookup by Flue model specifier.

The orchestrator should not register providers itself. Runtime config selects a primary project model card and an optional backup card. The durable orchestrator agent uses the active card's specifier as the Flue model string. Session-budget and compaction code uses the selected card before estimating, reserving, or compacting context.

## Ollama Cloud, Ollama Local, Codex Brain, And RunPod

Ollama has two different API paths:

- Direct Ollama Cloud API uses `https://ollama.com/v1` with `OLLAMA_API_KEY`.
- Local Ollama uses `http://localhost:11434/v1` or another real Ollama local endpoint.
- Codex Brain is a separate DT1/provider path, not an Ollama Local model. Its configured base URL must include `/v1`.
- RunPod chat uses its OpenAI-compatible public endpoint with `RUNPOD_API_KEY`; its chat base URL is separate from image-generation transport configuration.

The provider IDs intentionally reflect that split:

```text
ollama-cloud  -> direct Ollama Cloud API
ollama-local  -> local Ollama endpoint
codex-brain   -> DT1 Codex Brain endpoint
runpod        -> RunPod OpenAI-compatible public endpoint
```

Cloud model cards use the direct Ollama Cloud model IDs, such as `minimax-m3` and `deepseek-v4-pro`. The `:cloud` suffix is for the local Ollama CLI/daemon path.

## Current Cards

`src/core/models/catalog.ts` aggregates nine enabled cards:

| Card key | Flue specifier | Role |
| --- | --- | --- |
| `minimax-m3-cloud` | `ollama-cloud/minimax-m3` | Agentic chat |
| `deepseek-v4-pro-cloud` | `ollama-cloud/deepseek-v4-pro` | Agentic chat |
| `qwen3-5-cloud` | `ollama-cloud/qwen3.5:397b` | Agentic chat |
| `kimi-k2.7-code-cloud` | `ollama-cloud/kimi-k2.7-code:cloud` | Agentic chat |
| `codex-brain` | `codex-brain/gpt-5.5` | Agentic chat |
| `kimi-k2-6-runpod` | `runpod/kimi-k2.6` | Agentic chat |
| `nomic-embed-text-cloud` | `ollama-cloud/nomic-embed-text` | Embedding |
| `nomic-embed-text-local` | `ollama-local/nomic-embed-text` | Embedding |
| `all-minilm-l6-v2-onnx` | `onnx-local/all-minilm-l6-v2` | Embedding |

`minimax-m3-cloud` is the default agentic-chat card. The runtime chat registry
uses the eight provider-backed chat and embedding cards from
`createModelCards()`. The embedding chain reads the complete catalog so the
bundled ONNX card participates in cloud-to-local fallback.

| Card key | Advertised context | Guaranteed or provider-reported context | Output limit or embedding dimensions |
| --- | ---: | ---: | ---: |
| `minimax-m3-cloud` | 1,000,000 | guaranteed 512,000; provider 524,288 | 131,072 |
| `deepseek-v4-pro-cloud` | 1,048,576 | provider 1,048,576 | 1,048,576 |
| `qwen3-5-cloud` | 262,144 | provider 262,144 | 65,536 |
| `kimi-k2.7-code-cloud` | 1,000,000 | guaranteed 256,000; provider 262,144 | 32,768 |
| `codex-brain` | 128,000 | not separately reported | 32,000 |
| `kimi-k2-6-runpod` | 262,144 | provider 262,144 | 32,768 |
| `nomic-embed-text-cloud` | 8,192 | not separately reported | 768 dimensions |
| `nomic-embed-text-local` | 8,192 | not separately reported | 768 dimensions |
| `all-minilm-l6-v2-onnx` | 256 | not separately reported | 384 dimensions |

MiniMax M3 intentionally tracks more than one limit because MiniMax advertises 1M context with a guaranteed 512K minimum, while Ollama Cloud currently reports 524288 for both direct `/api/show` and local `minimax-m3:cloud` metadata.

## Selection Rules

1. The shipped `gorombo.config.json` runtime file is the source of truth for model choice.
2. `models.primary` selects the primary project-owned model card key.
3. `models.backup` optionally selects a different backup model card key.
4. `GOROMBO_MODEL` and `GOROMBO_MODEL_BACKUP` are rejected.
5. Raw Flue model specifiers are not accepted as configuration.
6. If a requested card key is missing, startup fails instead of choosing an unreviewed fallback.

The shipped primary remains `minimax-m3-cloud`. Trusted live-model tests may
set `SIM_ONE_TEST_MODEL_CARD` to select another reviewed card inside the test
process; production runtime model selection still comes only from
`gorombo.config.json`.

Current default runtime config:

```json
{
  "version": 1,
  "models": {
    "primary": "minimax-m3-cloud",
    "backup": "codex-brain"
  }
}
```

## Adding Models

Add a card file under the provider that owns the model, such as `src/core/models/providers/ollama-cloud/cards/new-model.ts`, including:

- provider id
- model id
- Flue specifier
- roles
- capabilities
- context window
- guaranteed or provider-reported context limits when they differ from the advertised limit
- max output tokens
- provider env requirements

Provider transport belongs in `src/core/models/providers/<provider>/provider.ts`. Register custom providers from `src/app.ts` through the model runtime bootstrap before any agent uses the card specifier.

Embedding selection is role-based. The current chain tries
`nomic-embed-text-cloud`, then the bundled `all-minilm-l6-v2-onnx`, then
`nomic-embed-text-local`.

## Budget Policy

The session-management layer uses cards in this order:

1. Resolve the primary and backup model cards from runtime config.
2. Use the provider-reported context window for safety when available.
3. Reserve output tokens before calculating usable input budget.
4. Warn before the prompt approaches the compaction threshold.
5. Derive current usage from Flue 2 conversation snapshots and response metadata when available.
6. On explicit `/compact`, ask the active generation for a continuation summary and rotate the product session to a new Flue instance.
7. Give RAG only the remaining context budget after system instructions, protocol context, memory, current user input, and output reserve are accounted for.

The durable orchestrator agent prompts with the primary card. Backup cards
remain explicit model metadata and are not a reason to bypass context
budgeting.

RAG should come after this budget layer because retrieved context must fit into the selected card's remaining budget.

The default web retrieval provider is Ollama Search through `POST https://ollama.com/api/web_search`, authenticated with the existing Ollama key resolved from model-card/provider env bindings. Web search is owned by the researcher subagent. The researcher-facing `web_research` tool calls the application-owned web-research function, which plans searches, uses cache, optionally expands top web results through fetch, packs contexts to a token budget, and records non-fatal provider failures. Other providers can be added behind the same RAG provider interface.

The main orchestrator registers a Flue 2 subagent named `researcher` with
`useSubagent(...)`. The orchestrator must not call web search or web-capable
retrieval directly. The researcher may use application workflow functions and
tools to decide whether one search, many searches, page fetches, or cache hits
are enough.

## Related Documentation

- [Architecture Overview](overview.md)
- [Retrieval And Research](retrieval-and-research.md)
- [Worker System](worker-system.md)
- [Flue Architecture Contract](flue-architecture.md)
