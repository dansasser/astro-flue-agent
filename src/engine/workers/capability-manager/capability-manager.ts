import { defineAgentProfile, type AgentProfile } from '@flue/runtime';
import {
  composeWorkspaceInstructions,
  resolveWorkspaceDirectory,
} from '../../../workspace-loader.js';
import { createSharedCodingApprovalService } from '../../../engine/approvals/shared-approval-service.js';
import type { CodingApprovalService } from '../../../engine/workers/coding-worker/approvals/approval-service.js';
import {
  createCapabilityManagerTools,
  createDefaultCapabilityLifecycleServiceFactory,
  createDefaultCapabilityProtocolBundleLoader,
  type CapabilityLifecycleServiceFactory,
  type CapabilityProtocolBundleLoader,
} from '../../../engine/workers/capability-manager/capability-manager-tools.js';

export const capabilityManagerAgentName = 'capability-manager';

export interface CapabilityManagerSubagentOptions {
  model?: string;
  env?: Record<string, unknown>;
  approvalService?: CodingApprovalService;
  serviceFactory?: CapabilityLifecycleServiceFactory;
  protocolBundleLoader?: CapabilityProtocolBundleLoader;
}

export function createCapabilityManagerSubagent(
  options: CapabilityManagerSubagentOptions = {},
): AgentProfile {
  const env = options.env ?? process.env;
  const approvalService =
    options.approvalService ??
    createSharedCodingApprovalService(toStringEnvironment(env));
  const serviceFactory =
    options.serviceFactory ??
    createDefaultCapabilityLifecycleServiceFactory(env);
  const protocolBundleLoader =
    options.protocolBundleLoader ??
    createDefaultCapabilityProtocolBundleLoader(env);

  return defineAgentProfile({
    name: capabilityManagerAgentName,
    description:
      'Administers SIM-ONE runtime skills, tools, workers, and MCP connections through validated, approval-gated lifecycle operations.',
    ...(options.model ? { model: options.model } : {}),
    instructions: [
      composeWorkspaceInstructions({
        workspaceDir: resolveWorkspaceDirectory('workers/capability-manager/workspace'),
        title: 'Capability Manager Workspace Instructions',
        files: ['AGENTS.md'],
      }),
      `# Lifecycle Contract

Use the attached read tools for list, inspect, and validate. Use the attached mutation tools for add, update, enable, disable, and remove. Validation and mutation tools require the persisted normalized message \`eventId\` delegated by the orchestrator. Trusted application code reloads the applicable protocol bundle from SQLite for that event; never accept a model-authored protocol bundle. Mutations fail closed until the approval service returns a current matching decision.

Executable tools, workers, and MCP connections are added disabled. Enabling them is a separate approved operation. Skills may be enabled within their approved add operation, but skills never grant undeclared tool authority.

Return the lifecycle result, including validation evidence, activation state, progress, and restartRequired. Never claim a capability is active before the gateway restart reported by the lifecycle service. Never accept or return secret values; MCP records contain only canonical configuration key names.`,
    ].join('\n\n'),
    tools: createCapabilityManagerTools({
      approvalService,
      serviceFactory,
      protocolBundleLoader,
    }),
  });
}

function toStringEnvironment(
  env: Record<string, unknown>,
): Record<string, string | undefined> {
  return Object.fromEntries(
    Object.entries(env).map(([key, value]) => [
      key,
      typeof value === 'string' ? value : undefined,
    ]),
  );
}
