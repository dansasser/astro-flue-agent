import { defineTool, type ToolDefinition } from '@flue/runtime';
import * as v from 'valibot';
import { resolveRuntimePath } from '../../../core/config/runtime-root.js';
import { evaluateApproval } from '../../../engine/approvals/evaluate-approval.js';
import {
  CapabilityLifecycleService,
  type CapabilityLifecycleAddInput,
  type CapabilityLifecycleUpdateInput,
} from '../../../engine/capabilities/capability-lifecycle-service.js';
import { createCapabilityStore } from '../../../engine/capabilities/capability-store.js';
import type {
  CapabilityConfig,
  CapabilityKind,
  CapabilitySource,
} from '../../../engine/capabilities/types.js';
import type { ProtocolBundle } from '../../../core/types/index.js';
import { protocolBundleSchema } from '../../../core/protocols/protocol-bundle-schema.js';
import { compileCapabilityProtocolContext } from '../../../engine/capabilities/capability-protocol-context.js';
import type { CodingApprovalService } from '../../../engine/workers/coding-worker/approvals/approval-service.js';
import type { CodingApprovalActionType } from '../../../engine/workers/coding-worker/approvals/approval-types.js';

const kindSchema = v.picklist(['skill', 'tool', 'worker', 'mcp']);
const sourceSchema = v.picklist(['github', 'local', 'npm', 'builtin']);
const transportSchema = v.picklist(['streamable-http', 'sse']);

export interface CapabilityLifecycleServiceSession {
  service: CapabilityLifecycleService;
  close(): void;
}

export type CapabilityLifecycleServiceFactory = (
  protocolBundle?: ProtocolBundle,
) => CapabilityLifecycleServiceSession;

export interface CapabilityManagerToolsOptions {
  approvalService: CodingApprovalService;
  serviceFactory: CapabilityLifecycleServiceFactory;
}

interface CapabilityToolInputArgs {
  taskId?: string;
  protocolBundle: ProtocolBundle;
  kind: CapabilityKind;
  id: string;
  name: string;
  description?: string;
  source?: CapabilitySource;
  sourceRef?: string;
  version?: string;
  requestedEnabled?: boolean;
  mcpUrl?: string;
  mcpTransport?: 'streamable-http' | 'sse';
  mcpTokenEnv?: string;
}

export function createDefaultCapabilityLifecycleServiceFactory(
  env: Record<string, unknown> = process.env,
): CapabilityLifecycleServiceFactory {
  return (protocolBundle) => {
    const configuredDb =
      typeof env.GOROMBO_CAPABILITY_DB_PATH === 'string'
        ? env.GOROMBO_CAPABILITY_DB_PATH.trim()
        : '';
    const store = createCapabilityStore({
      dbPath: resolveRuntimePath(configuredDb || 'db/capabilities.sqlite', { env }),
    });
    return {
      service: new CapabilityLifecycleService({ store, env, protocolBundle }),
      close: () => store.close(),
    };
  };
}

export function createCapabilityManagerTools(
  options: CapabilityManagerToolsOptions,
): ToolDefinition[] {
  return [
    defineTool({
      name: 'capability_list',
      description:
        'List runtime capability records from the authoritative SIM-ONE registry, optionally filtered by kind.',
      parameters: v.object({
        kind: v.optional(kindSchema),
      }),
      execute: async (args) =>
        withService(options.serviceFactory, (service) =>
          JSON.stringify(service.list(args.kind), null, 2),
        ),
    }),
    defineTool({
      name: 'capability_inspect',
      description:
        'Inspect one runtime capability record and its current activation state without exposing credential values.',
      parameters: v.object({
        kind: kindSchema,
        id: v.string(),
      }),
      execute: async (args) =>
        withService(options.serviceFactory, (service) =>
          JSON.stringify(service.inspect(args.kind, args.id), null, 2),
        ),
    }),
    defineTool({
      name: 'capability_validate',
      description:
        'Validate a proposed skill, tool, worker, or MCP capability source and metadata without changing the registry.',
      parameters: capabilityInputSchema(false),
      execute: async (args) =>
        withService(
          options.serviceFactory,
          (service) =>
            JSON.stringify(
              service.validate(readAddInput(args as CapabilityToolInputArgs)),
              null,
              2,
            ),
          (args as CapabilityToolInputArgs).protocolBundle,
        ),
    }),
    defineTool({
      name: 'capability_add',
      description:
        'Request approval to add a validated runtime capability. Executable tools, workers, and MCP connections are always installed disabled.',
      parameters: capabilityInputSchema(true),
      execute: async (args) => {
        const typedArgs = args as CapabilityToolInputArgs & { taskId: string };
        const input = readAddInput(typedArgs);
        return executeApprovedMutation(options, {
          taskId: typedArgs.taskId,
          protocolBundle: typedArgs.protocolBundle,
          actionType: 'capability.add',
          kind: input.kind,
          id: input.id,
          source: input.source,
          sourceRef: input.sourceRef,
          version: input.version,
          requestedEnabled: input.requestedEnabled,
          config: input.config,
          run: (service) => service.add(input),
        });
      },
    }),
    defineTool({
      name: 'capability_update',
      description:
        'Request approval to update and revalidate an existing runtime capability source or non-secret metadata.',
      parameters: v.object({
        taskId: v.string(),
        protocolBundle: protocolBundleSchema(),
        kind: kindSchema,
        id: v.string(),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        source: v.optional(sourceSchema),
        sourceRef: v.optional(v.string()),
        version: v.optional(v.string()),
        mcpUrl: v.optional(v.string()),
        mcpTransport: v.optional(transportSchema),
        mcpTokenEnv: v.optional(v.string()),
      }),
      execute: async (args) => {
        const input: CapabilityLifecycleUpdateInput = {
          kind: args.kind,
          id: args.id,
          ...(args.name !== undefined ? { name: args.name } : {}),
          ...(args.description !== undefined ? { description: args.description } : {}),
          ...(args.source !== undefined ? { source: args.source } : {}),
          ...(args.sourceRef !== undefined ? { sourceRef: args.sourceRef } : {}),
          ...(args.version !== undefined ? { version: args.version || null } : {}),
          ...(hasMcpConfig(args) ? { config: readMcpConfig(args) } : {}),
        };
        return executeApprovedMutation(options, {
          taskId: args.taskId,
          protocolBundle: args.protocolBundle as unknown as ProtocolBundle,
          actionType: 'capability.update',
          kind: input.kind,
          id: input.id,
          source: input.source,
          sourceRef: input.sourceRef,
          version: input.version,
          config: input.config,
          run: (service) => service.update(input),
        });
      },
    }),
    ...(['enable', 'disable', 'remove'] as const).map((operation) =>
      defineTool({
        name: `capability_${operation}`,
        description: `Request approval to ${operation} one runtime capability.`,
        parameters: v.object({
          taskId: v.string(),
          protocolBundle: protocolBundleSchema(),
          kind: kindSchema,
          id: v.string(),
        }),
        execute: async (args) =>
          executeApprovedMutation(options, {
            taskId: args.taskId,
            protocolBundle: args.protocolBundle as unknown as ProtocolBundle,
            actionType: `capability.${operation}`,
            kind: args.kind,
            id: args.id,
            run: (service) => service[operation](args.kind, args.id),
          }),
      }),
    ),
  ];
}

function capabilityInputSchema(withTaskId: boolean) {
  return v.object({
    ...(withTaskId ? { taskId: v.string() } : {}),
    protocolBundle: protocolBundleSchema(),
    kind: kindSchema,
    id: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    source: v.optional(sourceSchema),
    sourceRef: v.optional(v.string()),
    version: v.optional(v.string()),
    requestedEnabled: v.optional(v.boolean()),
    mcpUrl: v.optional(v.string()),
    mcpTransport: v.optional(transportSchema),
    mcpTokenEnv: v.optional(v.string()),
  });
}

function readAddInput(args: {
  kind: CapabilityKind;
  id: string;
  name: string;
  description?: string;
  source?: CapabilitySource;
  sourceRef?: string;
  version?: string;
  requestedEnabled?: boolean;
  mcpUrl?: string;
  mcpTransport?: 'streamable-http' | 'sse';
  mcpTokenEnv?: string;
}): CapabilityLifecycleAddInput {
  const isMcp = args.kind === 'mcp';
  return {
    kind: args.kind,
    id: args.id,
    name: args.name,
    description: args.description ?? '',
    source: args.source ?? (isMcp ? 'builtin' : 'local'),
    sourceRef: args.sourceRef ?? (isMcp ? `mcp://${args.id}` : ''),
    version: args.version || null,
    requestedEnabled: args.requestedEnabled ?? args.kind === 'skill',
    installedBy: 'agent',
    ...(isMcp ? { config: readMcpConfig(args) } : {}),
  };
}

function readMcpConfig(args: {
  mcpUrl?: string;
  mcpTransport?: 'streamable-http' | 'sse';
  mcpTokenEnv?: string;
}): CapabilityConfig {
  return {
    mcpUrl: args.mcpUrl,
    mcpTransport: args.mcpTransport ?? 'streamable-http',
    ...(args.mcpTokenEnv ? { mcpTokenEnv: args.mcpTokenEnv } : {}),
  };
}

function hasMcpConfig(args: {
  mcpUrl?: string;
  mcpTransport?: 'streamable-http' | 'sse';
  mcpTokenEnv?: string;
}): boolean {
  return args.mcpUrl !== undefined || args.mcpTransport !== undefined || args.mcpTokenEnv !== undefined;
}

async function executeApprovedMutation(
  options: CapabilityManagerToolsOptions,
  input: {
    taskId: string;
    protocolBundle: ProtocolBundle;
    actionType: Extract<
      CodingApprovalActionType,
      'capability.add' | 'capability.update' | 'capability.enable' | 'capability.disable' | 'capability.remove'
    >;
    kind: CapabilityKind;
    id: string;
    source?: CapabilitySource;
    sourceRef?: string;
    version?: string | null;
    requestedEnabled?: boolean;
    config?: CapabilityConfig;
    run: (service: CapabilityLifecycleService) => unknown;
  },
): Promise<string> {
  const protocolContext = compileCapabilityProtocolContext(input.protocolBundle);
  const approval = await evaluateApproval({
    approvalService: options.approvalService,
    taskId: input.taskId,
    actionType: input.actionType,
    summary: `${input.actionType.replace('capability.', '')} ${input.kind} capability ${input.id}.`,
    reason: 'Runtime capability registry mutations change code or connections available to SIM-ONE.',
    risk: input.kind === 'skill' ? 'medium' : 'high',
    target: `${input.kind}:${input.id}`,
    requestedBy: 'capability-manager',
    metadata: {
      operation: input.actionType.replace('capability.', ''),
      kind: input.kind,
      id: input.id,
      ...(input.source ? { source: input.source } : {}),
      ...(input.sourceRef
        ? {
            sourceRef:
              input.source === 'local'
                ? '[workspace-local-source]'
                : input.sourceRef,
          }
        : {}),
      ...(input.version ? { version: input.version } : {}),
      ...(typeof input.config?.mcpUrl === 'string'
        ? { mcpUrl: input.config.mcpUrl }
        : {}),
      ...(typeof input.config?.mcpTransport === 'string'
        ? { mcpTransport: input.config.mcpTransport }
        : {}),
      ...(typeof input.config?.mcpTokenEnv === 'string'
        ? { mcpTokenEnv: input.config.mcpTokenEnv }
        : {}),
      ...(input.requestedEnabled !== undefined
        ? { requestedEnabled: input.requestedEnabled }
        : {}),
      protocolEventId: protocolContext.eventId,
      protocolIds: JSON.stringify(
        protocolContext.directives.map((directive) => directive.id),
      ),
      protocolRules: JSON.stringify(
        protocolContext.directives.flatMap((directive) => directive.rules),
      ),
    },
  });
  if (!approval.evaluation.allowed) {
    return JSON.stringify(
      {
        blocked: true,
        request: approval.request,
        evaluation: approval.evaluation,
      },
      null,
      2,
    );
  }
  return withService(
    options.serviceFactory,
    (service) => JSON.stringify(input.run(service), null, 2),
    input.protocolBundle,
  );
}

function withService<T>(
  factory: CapabilityLifecycleServiceFactory,
  run: (service: CapabilityLifecycleService) => T,
  protocolBundle?: ProtocolBundle,
): T {
  const session = factory(protocolBundle);
  try {
    return run(session.service);
  } finally {
    session.close();
  }
}
