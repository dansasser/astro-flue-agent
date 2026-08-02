# Retrieval And Research

SIM-ONE Alpha retrieves context instead of relying on model context alone.
Memory, indexed documents, project files, and web research are separate
evidence sources routed through bounded retrieval workflows.

Protocols answer which rules apply. Retrieval answers which facts and prior
context apply. Both are first-class runtime layers.

## Ownership

Retrieval capabilities are assigned by responsibility:

| Capability | Owner |
| --- | --- |
| Structured memory lookup | Orchestrator |
| Session and conversation context | Memory router |
| Document and project search | Retrieval workflow and RAG router |
| Web search and page retrieval | Researcher worker |
| Source synthesis | Researcher worker |
| Final use of retrieved evidence | Orchestrator synthesis |

The orchestrator can call `retrieve_memory` for trusted memory scopes. It can
also delegate a research task to the Researcher. Web search is restricted to
the Researcher or the dedicated research workflow.

## Retrieval Flow

```text
Admitted event and query
-> Provider selection
-> Memory router and RAG router
-> Memory, document index, or researcher-owned web provider
-> Ranked RetrievedContext records
-> Optional page enrichment
-> Deduplication and context-budget packing
-> Evidence returned to the requesting agent
```

Each result identifies its provider, content, score, and metadata. Provider
errors are returned as structured failures so a partial result is not mistaken
for complete coverage.

## Retrieval Sources

### Structured Memory

Structured memory stores scoped notes, todos, checklists, facts, and task
state. Its Rust/WASM helper provides deterministic memory operations while the
TypeScript runtime handles persistence and tool integration.

Memory tools derive scope from trusted event and project context. Model input
cannot widen actor, conversation, client, project, or task authority.

### Session Memory

Session memory supplies recent conversation and session context. It is routed
through the memory provider interface and can participate in combined
retrieval with other sources.

### Document And Project Index

The document index provider searches indexed knowledge documents and project
files. Content is chunked, embedded, and stored in LanceDB through the
application persistence runtime.

The index supports:

- knowledge documents;
- repository and project files;
- background indexing;
- source metadata;
- vector similarity retrieval.

### Web Research

Current and source-backed requests are delegated to the Researcher. Its
`web_research` tool runs a finite workflow over the web provider, optionally
fetches result pages, and returns source evidence rather than an unsupported
summary.

## RAG Routing

The retrieval workflow selects providers from the request or from explicit
workflow input:

- `memory` is selected for general context retrieval;
- `document-index` is selected for project and document questions;
- `web-search` is selected for current or source-backed research and is
  caller-restricted.

The RAG router queries the selected providers, preserves provider failures, and
combines ranked results. Reciprocal rank fusion is used when results from
multiple providers must be merged.

## Embeddings

Document retrieval uses a fallback chain:

```text
Configured cloud embedding provider
-> Bundled ONNX all-MiniLM-L6-v2 model
-> Configured local embedding provider
```

The bundled ONNX model allows local document retrieval without making the
index dependent on a cloud embedding service. Provider choice and model
configuration are resolved by the application runtime, not by a model prompt.

## Research Workflow

The source-backed research path is bounded and evidence-oriented:

```text
Orchestrator
-> Researcher child session
-> web_research
-> Query plan
-> Cached web searches
-> Optional page fetches
-> Unique context packing
-> Sources, confidence, budget, and failures
-> Orchestrator synthesis
```

Complete critic scoring of retrieved evidence is part of the release
enforcement contract and remains a release gate.

Research depth is explicit:

| Depth | Use |
| --- | --- |
| `basic` | A narrow lookup with a small search budget |
| `standard` | Normal source comparison and evidence gathering |
| `deep` | Iterative queries with broader source and limitation checks |

Each run has limits for queries, fetches, iterations, result count, and context
tokens. The workflow can stop when it has enough evidence or when its budget is
exhausted.

## Cache And Freshness

Research uses both run-local and persistent cache layers. Search results and
fetched pages have separate time-to-live settings. A request can use automatic
freshness, require fresh retrieval, or prefer cached evidence.

The result reports search and page cache hits and misses. This makes the
freshness and retrieval cost of a research result visible to the caller.

## Context Budgeting

Retrieved content is packed into an explicit token budget before it is returned
to an agent. The budget report includes:

- maximum context tokens;
- used context tokens;
- truncated contexts;
- omitted contexts.

Web research also deduplicates repeated sources before packing them. These
limits keep retrieval evidence from consuming the entire model context.

## Result Contract

A web research result contains:

```text
request
status
queriesRun
sources
contexts
confidence
cache statistics
budget use
providerFailures
```

Confidence is evidence metadata, not permission to act. The orchestrator still
evaluates the result against active protocols and the user's request.

## Failure Behavior

Retrieval remains explicit when evidence is incomplete:

- unauthorized web callers are rejected;
- individual provider failures are recorded;
- failed page fetches retain the search result and mark the fetch failure;
- empty evidence returns `no_results`;
- budget truncation is reported;
- missing local embedding artifacts surface through provider failure rather
  than fabricated matches.

The final response should disclose material retrieval limitations instead of
presenting partial evidence as complete.

## Source Map

| Area | Source |
| --- | --- |
| Retrieval workflow | `src/workflows/retrieval.ts` |
| Research workflow | `src/workflows/research.ts` |
| Web research execution | `src/workflows/web-research.ts` |
| RAG router | `src/engine/rag/rag-router.ts` |
| Retrieval providers | `src/engine/rag/providers.ts` |
| Document index provider | `src/engine/rag/document-index-provider.ts` |
| Indexers | `src/engine/rag/indexers/` |
| Vector store | `src/engine/rag/vector/lance-db-store.ts` |
| Embedding chain | `src/engine/rag/embeddings.ts` |
| Researcher subagent definition | `src/engine/workers/researcher/researcher.ts` |
| Research cache | `src/engine/workers/researcher/research/` |
| Structured memory | `src/engine/memory/` |

## Related Documentation

- [Architecture Overview](overview.md)
- [Memory System](memory-system.md)
- [Model System](model-system.md)
- [Worker System](worker-system.md)
- [Protocol System](protocol-system.md)
- [Execution Workflows](execution-workflows.md)
