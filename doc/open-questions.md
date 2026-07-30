# Open Questions: GitHub And Repository Access

## D1: Credential Strategy

Status: resolved.

The owner selected the official remote GitHub MCP server with
`GITHUB_PERSONAL_ACCESS_TOKEN`, plus anonymous-first HTTPS for public Git
operations. See `doc/decisions/d1-github-auth-strategy.md`.

## Resolved Answers

1. TUI, Telegram, and future connectors use one trusted gateway runtime
   credential; connectors never receive the PAT.
2. The transport is the official remote endpoint
   `https://api.githubcopilot.com/mcp/` through Flue `connectMcpServer(...)`.
3. Operators grant only the GitHub repository and organization access needed by
   enabled operations.
4. Rotation or revocation replaces or removes the runtime environment setting
   and restarts the gateway.
5. Public HTTPS clone and fetch attempt anonymous access before credentialed
   retry; mutation approval remains independent.
6. The Coding Worker lead owns the MCP connection and GitHub tools.
7. Focused contract and security tests plus the moved-package production smoke
   prove the implemented path; connector approval tests remain separately
   tracked.

## D6: TUI Approval Surface Placement

Status: resolved.

The owner selected an anchored drop-up above the prompt following the existing
slash-command menu display pattern. The normal status surface remains exactly
two rows. The approval drop-up belongs to the separate connector approval node
and consumes the status node's completed geometry.

Implementation evidence must still cover narrow, normal, and wide terminal
sizes, multiline prompt growth, transcript scroll and text selection,
slash-menu state, keyboard and mouse focus, multiple pending approvals, and the
future right-side work pane. See
`doc/decisions/d6-tui-approval-surface-placement.md`.

## Capability Management Worker

Status: specified with no unresolved product decision.

The owner established these boundaries:

1. Runtime capability administration belongs to one dedicated worker.
2. The Coding Worker must know how to build skills, tools, workers/subagents,
   and MCP packages through attached tools and worker-local skills.
3. The Coding Worker authors and validates source; the capability-manager owns
   runtime registration and activation.
4. Users retain the direct `sim-one` capability command families.
5. The existing runtime capability registry remains authoritative.

The implementation may resolve these non-product discoveries without a new
decision as long as acceptance behavior does not change:

- the internal module split for the shared lifecycle service;
- the exact names of typed authoring helper tools;
- whether one authoring skill routes to four kind-specific skills or registers
  all five explicitly;
- the test fixture packaging layout;
- the compact progress wording used by connectors.

Hot reload is not assumed. The current restart-on-initialization contract
remains authoritative. A future request to activate executable capability code
without restarting would require a separate architecture decision and
invalidation of loader, lifecycle, security, and packaged-product evidence.
