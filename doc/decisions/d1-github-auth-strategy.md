# D1 GitHub Auth Strategy

## Status

Resolved

## Context

The previous managed GitHub device-login and GitHub CLI path coupled
authentication to connector event context, did not provide a usable packaged
TUI approval flow, and required authentication before a public repository
clone. The product needs one connector-independent GitHub capability owned by
the Coding Worker while keeping authentication separate from mutation
approval.

## Decision

SIM-ONE Alpha uses the official remote GitHub MCP server at
`https://api.githubcopilot.com/mcp/`, connected through Flue
`connectMcpServer(...)` from the Coding Worker lead profile.

`GITHUB_PERSONAL_ACCESS_TOKEN` is trusted runtime configuration. The packaged
launcher loads it from the canonical runtime environment at
`<runtime-root>/.env`; future onboarding collects and writes the same setting.
The PAT is never included in model instructions, tool results, progress events,
workspace files, evidence, or general sandbox environments.

Only the official MCP read tools needed for issues and pull requests are
attached to the Coding Worker model. The MCP mutation tools remain behind the
typed internal GitHub client and SIM-ONE's action-specific approval service.
The orchestrator and other workers do not receive GitHub MCP tools.

Git repository access uses a separate bounded path:

1. Public HTTPS clone or fetch is attempted anonymously.
2. If that attempt fails and a PAT is configured, Git retries with a
   command-scoped askpass environment.
3. The helper contains no PAT, does not modify global Git configuration, and is
   stored outside the model-writable workspace.

The product has no GitHub CLI dependency and no device-login flow.

## Required Invariants

- Public HTTPS clone can proceed without GitHub authentication when the remote
  is public, while the local filesystem mutation remains approval-gated.
- Private reads and remote mutations authenticate through the selected trusted
  credential path.
- Credentials remain outside the coding-worker workspace and model-visible
  state.
- TUI and Telegram use the same trusted server-side credential and render
  connector-appropriate mutation approvals; neither connector handles the PAT.
- Clone, push, pull-request, issue, and review mutations retain action-specific
  approval and output-level verification.
- Any MCP capability is attached to the Flue profile that owns it; subagents do
  not inherit undeclared parent tools.

## Credential Lifecycle

- Onboarding or an operator supplies a GitHub PAT with only the repository and
  organization access needed for the enabled operations.
- Rotation replaces `GITHUB_PERSONAL_ACCESS_TOKEN` in the runtime environment
  and restarts the gateway so Flue reconnects with the new credential.
- Revocation occurs in GitHub and by removing the runtime setting.
- Without a PAT, public anonymous Git operations remain available while
  authenticated GitHub MCP and private repository operations report that the
  runtime credential is not configured.

## Rollback

Removing the PAT disables authenticated GitHub MCP and credentialed Git
fallback without deleting repositories or changing global Git state. Public
anonymous clone remains available. A code rollback must restore the complete
prior integration as one change; the removed device-login database and CLI
workflow are not retained as a parallel fallback.

## Resolution Evidence

The owner selected the official GitHub MCP/PAT design. Focused tests verify
Flue connection options, exact official tool names and parameters, read-only
model exposure, action approval, PAT redaction, helper isolation, and anonymous
clone before authenticated retry. The packaged relocation smoke test verifies
the canonical runtime tree and unrelated launch directory. Connector approval
coverage remains a separate release requirement.

## Affected Nodes

- `implement-coding-worker-github-flow`
