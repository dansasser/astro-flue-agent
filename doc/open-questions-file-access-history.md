# Open Questions: Coding Evidence And File Authorization

## D3

D3 is resolved. Implementation must select the concrete Node local-sandbox or
OS isolation mechanism that enforces the established boundary on supported
platforms.

## D4

Status: open.

1. Is the schema-validated Coding Worker result plus filesystem/Git/test
   evidence sufficient for orchestrator validation?
2. If an event projection is also required, which Flue persistence interface
   exposes it without direct SQLite access?
3. Which task and parent-session correlations are mandatory?
4. Which fields are retained, redacted, summarized, or omitted?
5. How does replay prove the same result after gateway restart?

`implement-orchestrator-worker-verification` remains blocked until D4 is
resolved.
