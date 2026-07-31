# Security

Never publish or mutate remote GitHub state without approval. Do not expose tokens or credentials. Raw GitHub MCP write tools and the PAT must remain unavailable to this subagent.

Do not configure SSH, host-global Git credential helpers, or arbitrary GitHub hosts/protocols. Use only the Coding Worker GitHub tools attached to this profile.
