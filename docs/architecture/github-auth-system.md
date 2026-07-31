# GitHub MCP And Repository Authentication

## Purpose

SIM-ONE Alpha performs repository and GitHub work through the Coding Worker.
Authentication proves access to GitHub; SIM-ONE approval separately authorizes
one bounded mutation. A configured credential never grants blanket permission
to clone, edit, commit, push, create a pull request, or change an issue.

## Architecture

```text
TUI or connector
  -> orchestrator
  -> Coding Worker lead
    -> official GitHub MCP read tools
    -> typed SIM-ONE GitHub tools
      -> action-specific approval
      -> internal GitHub MCP mutation call
    -> bounded Git tools
      -> anonymous public HTTPS first
      -> command-scoped PAT fallback when required
```

The Coding Worker connects to the official remote GitHub MCP endpoint through
Flue `connectMcpServer(...)`:

```text
https://api.githubcopilot.com/mcp/
```

The connection is declared on the Coding Worker lead profile. The main
orchestrator, researcher, general runtime capability broker, and connector
clients do not receive these tools.

## MCP Tool Boundary

The model-visible MCP subset is read-only:

```text
issue_read
list_issues
pull_request_read
list_pull_requests
```

Mutation-capable official tools are held by the internal `McpGitHubClient`.
SIM-ONE wrappers validate typed inputs, resolve repository scope, create an
approval request, validate the settled approval immediately before execution,
call the MCP tool, and return a bounded summary. The model cannot call the raw
mutation tools or approve its own request.

The official server tool allow-list is sent with `X-MCP-Tools`. Tool names and
parameter mappings are covered by contract tests so an upstream rename fails
locally instead of silently disabling GitHub at runtime.

## Credential Boundary

`GITHUB_PERSONAL_ACCESS_TOKEN` is the only supported GitHub credential key.
The packaged gateway loads it from owner-only
`<runtime-root>/sim-one.config`. Future onboarding writes the same canonical
setting without exposing the value to an agent.

The PAT is not copied into:

- model instructions or task delegation text;
- the Coding Worker's general-purpose shell/sandbox environment;
- connector events, transcripts, progress events, or evidence;
- repository files, task memory, or approval records.

For GitHub API calls, Flue receives the PAT only in the remote MCP
`Authorization` header. For private Git HTTPS, the runtime writes the PAT to a
dedicated owner-only file under `<runtime-root>/auth/github/`; the bounded Git
child receives only that file's path and a secret-free `GIT_ASKPASS` helper
path, never the token value itself. Repository hooks are disabled for bounded
remote operations. Anonymous fetch and checkout commands receive an explicit
no-credential Git environment, and the subprocess runner removes inherited
GitHub tokens and Git credential configuration before applying the allowlisted
command-scoped settings.
Connection errors redact the exact token. Operators should grant only the
repository and organization access required by enabled operations, rotate by
replacing the setting and restarting the gateway, and revoke the token in
GitHub when it is no longer trusted.

Approval-gated PR branch checkout derives an explicit
`https://github.com/<owner>/<repo>.git` fetch URL from the validated approved
repository fields. It does not fetch the PR ref from the workspace's mutable
`origin` alias.

## Git Clone And Fetch

Public GitHub HTTPS operations do not require MCP or a PAT. The Coding Worker:

1. runs the bounded Git operation anonymously;
2. returns immediately when it succeeds;
3. retries only a failed GitHub HTTPS operation when a PAT exists;
4. injects that retry through a command-scoped `GIT_ASKPASS` environment.

The askpass script lives under `<runtime-root>/auth/github/`, contains no PAT,
and reads the dedicated owner-only token file only for that child command. The
token file and helper are mounted read-only into the private Bubblewrap
namespace, while `core.hooksPath` points to the platform null path so repository
hooks cannot inherit credential state. The runtime does not install a global
credential helper, write Git credentials into repository configuration, create
SSH keys, or mutate the user's GitHub CLI profile.

Private repository access fails clearly when the PAT is absent or lacks access.
Anonymous public clone remains usable when MCP is unconfigured.

## Connector Behavior

TUI, Telegram, and future connectors share the gateway-owned GitHub
configuration. They do not run device login or transport a PAT. Connector work
still receives its own typed approval request and settled result. Authentication
state is connector-independent; approval audience and action scope are not.

## Failure And Rollback

- Missing PAT: official GitHub MCP and private Git access are unavailable;
  anonymous public Git remains available.
- Invalid or revoked PAT: connection or operation fails without falling back to
  another credential source.
- MCP transport failure: Coding Worker startup and non-GitHub repository work
  continue. GitHub API operations report the optional connection as
  unavailable when requested; no GitHub CLI fallback is attempted.
- Denied or expired approval: the mutation is not called.
- Rollback: remove the PAT and restart the gateway. This disables authenticated
  GitHub access without modifying repositories or global Git state.

## Source Map

| Responsibility | Source |
| --- | --- |
| Flue MCP connection and typed client | `src/engine/workers/coding-worker/github/github-mcp.ts` |
| PAT and command-scoped askpass | `src/engine/workers/coding-worker/github/github-pat.ts` |
| Approval-gated GitHub tools | `src/engine/workers/coding-worker/github/github-tools.ts` |
| Bounded Git tools and clone workflow | `src/engine/workers/coding-worker/tools/`, `src/engine/workers/coding-worker/repo/` |
| Worker profile attachment | `src/engine/workers/coding-worker/coding-worker.ts` |
| Contract and security tests | `src/tests/github-mcp.test.ts`, `src/tests/github-private-clone.test.ts` |

## Related Documentation

- [Worker System](worker-system.md)
- [Execution Workflows](execution-workflows.md)
- [Configuration Reference](../reference/configuration.md)
- [Product TUI Runtime](../operations/product-tui.md)
