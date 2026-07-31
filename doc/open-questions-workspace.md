# Open Questions: Runtime-Root Implementation

D2 is resolved. These are implementation details, not alternate architecture
choices:

1. Which shared TypeScript module exports the typed runtime paths?
2. Which launcher supplies `GOROMBO_RUNTIME_ROOT`, and which packaged modules
   can derive it directly from their own path?
3. Which legacy relative environment values require a compatibility warning?
4. Which directories are created during install versus lazily at first use?
5. Which product tests exercise a moved runtime tree on Windows and POSIX?

Answers belong in the external implementation plan and must preserve D2.
