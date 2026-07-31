# Constraints And Risks

## Runtime Constraints

- Node.js must satisfy the repository engine requirement.
- All persistent paths derive from the single D2 runtime root.
- Secrets, auth state, approvals, databases, and capability metadata remain
  outside `<runtime-root>/workspace/`.
- The TUI is a connector client; it invokes typed gateway operations and never
  reads runtime databases or GitHub credentials.
- Flue subagent profiles receive only their declared tools, skills, subagents,
  and instructions.

## Security Constraints

- Public anonymous reads do not authorize local or remote mutations.
- Every mutating Git/GitHub action validates trusted approval immediately
  before execution.
- Credential material is never serialized into graph evidence, progress
  events, transcripts, or worker results.
- Connector event identity comes from persisted trusted ingress context, not a
  model-supplied `eventId`.

## Delivery Risks

- A PAT does not replace connector approval controls; the user must still be
  able to approve or deny each bounded mutation from the active connector.
- Broad PAT permissions increase blast radius; onboarding and documentation
  must require the least repository and organization access needed.
- An MCP integration attached to the wrong Flue profile silently leaves the
  owning worker without the capability.
- Treating public clone as unapproved because it is unauthenticated would
  conflate credential policy with local filesystem authorization.
- Designing approval controls after the status layout would create competing
  terminal geometry and shared-file ownership.
- The approval drop-up can cover transcript content or conflict with the slash
  palette if its focus, stacking, and mutual-exclusion rules are unclear.
- Character-level truncation can hide pending approval, context, or task state
  while making the status surface appear complete.
- An unlabeled `Approve` action can grant broader scope than the user intended.
- Estimating context remaining from rendered transcript content can misstate the
  actual model budget and cause unsafe session-management decisions.
- Keeping model-callable capability mutations on the orchestrator would mix
  routing with registry authority and make worker-specific permissions
  impossible to audit.
- Letting the Coding Worker install what it just authored would collapse source
  implementation, validation, approval, and runtime activation into one trust
  boundary.
- Separate CLI and worker mutation implementations can drift on collisions,
  version pinning, enablement, rollback, and secret redaction.
- A successful registry write does not prove a capability is active; the
  initialization-time loader may still require a gateway restart or reject the
  source contract.
- MCP connection metadata can leak credentials if source handoffs or
  capability records accept token values instead of canonical key names.

## Required Mitigations

The D1 implementation must retain credential lifecycle guidance, Flue
capability ownership, connector behavior, public/private clone policy, mutation
approvals, secret redaction, and packaged end-to-end verification.

The TUI implementation must consume resolved D6, establish the stable two-row
status geometry before connector approval controls, render approvals through
the slash-menu-style drop-up, use explicit approval scopes, keep unavailable
states fail-closed, preserve terminal interaction state, and verify the
packaged product at multiple terminal sizes.

Capability management must use one shared typed lifecycle service, route
agent-requested administration through `capability-manager`, keep direct CLI
actions attributable to the authenticated user, gate agent mutations through
the approval service, keep executable capabilities disabled until explicitly
enabled, roll back partial store/materialization failure, and verify activation
only after the required gateway restart and loader result.

Capability authoring must remain under the Coding Worker selected
repository/project, use file-edit approvals, scan source and handoff artifacts
for secrets and host-specific paths, and stop at a reproducible typed handoff to
the capability-manager.
