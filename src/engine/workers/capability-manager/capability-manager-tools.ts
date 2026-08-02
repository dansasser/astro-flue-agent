import { createHash } from 'node:crypto';
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
import {
  SqliteProtocolProvider,
  defaultProtocolDatabasePath,
} from '../../../core/protocols/sqlite-protocol-provider.js';
import { compileCapabilityProtocolContext } from '../../../engine/capabilities/capability-protocol-context.js';
import { createProtocolLookupEvent } from '../../../engine/tools/protocol-tool.js';
import type { CodingApprovalService } from '../../../engine/workers/coding-worker/approvals/approval-service.js';
import type { CodingApprovalActionType } from '../../../engine/workers/coding-worker/approvals/approval-types.js';

const kindSchema = v.picklist(['skill', 'tool', 'worker', 'mcp']);
const sourceSchema = v.picklist(['github', 'local']);
const transportSchema = v.picklist(['streamable-http', 'sse']);
const capabilityInputEntries = {
  eventId: v.string(),
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
};
const capabilityValidationInputSchema = v.object(capabilityInputEntries);
const capabilityMutationInputSchema = v.object({
  taskId: v.string(),
  ...capabilityInputEntries,
});

export interface CapabilityLifecycleServiceSession {
  service: CapabilityLifecycleService;
  close(): void;
}

export type CapabilityLifecycleServiceFactory = (
  protocolBundle?: ProtocolBundle,
) => CapabilityLifecycleServiceSession;

export type CapabilityProtocolBundleLoader = (
  eventId: string,
) => Promise<ProtocolBundle>;

export interface CapabilityManagerToolsOptions {
  approvalService: CodingApprovalService;
  serviceFactory: CapabilityLifecycleServiceFactory;
  protocolBundleLoader: CapabilityProtocolBundleLoader;
}

interface CapabilityToolInputArgs {
  taskId?: string;
  eventId: string;
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

export function createDefaultCapabilityProtocolBundleLoader(
  env: Record<string, unknown> = process.env,
): CapabilityProtocolBundleLoader {
  return async (eventId) => {
    const configuredDb =
      typeof env.GOROMBO_PROTOCOL_DB_PATH === 'string'
        ? env.GOROMBO_PROTOCOL_DB_PATH.trim()
        : '';
    const provider = new SqliteProtocolProvider(
      resolveRuntimePath(configuredDb || defaultProtocolDatabasePath, { env }),
    );
    try {
      return await provider.loadApplicable(
        createProtocolLookupEvent({ eventId }),
      );
    } finally {
      provider.close();
    }
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
      input: v.object({
        kind: v.optional(kindSchema),
      }),
      run: async ({ data: args }) =>
        withService(options.serviceFactory, (service) =>
          JSON.stringify(service.list(args.kind), null, 2),
        ),
    }),
    defineTool({
      name: 'capability_inspect',
      description:
        'Inspect one runtime capability record and its current activation state without exposing credential values.',
      input: v.object({
        kind: kindSchema,
        id: v.string(),
      }),
      run: async ({ data: args }) =>
        withService(options.serviceFactory, (service) =>
          JSON.stringify(service.inspect(args.kind, args.id), null, 2),
        ),
    }),
    defineTool({
      name: 'capability_validate',
      description:
        'Validate a proposed skill, tool, worker, or MCP capability source and metadata without changing the registry.',
      input: capabilityValidationInputSchema,
      run: async ({ data: args }) => {
        const typedArgs = args as CapabilityToolInputArgs;
        const protocolBundle = await loadTrustedProtocolBundle(
          options.protocolBundleLoader,
          typedArgs.eventId,
        );
        return withService(
          options.serviceFactory,
          (service) =>
            JSON.stringify(
              service.validate(readAddInput(typedArgs)),
              null,
              2,
            ),
          protocolBundle,
        );
      },
    }),
    defineTool({
      name: 'capability_add',
      description:
        'Request approval to add a validated runtime capability. Executable tools, workers, and MCP connections are always installed disabled.',
      input: capabilityMutationInputSchema,
      run: async ({ data: args }) => {
        const typedArgs = args as CapabilityToolInputArgs & { taskId: string };
        const input = readAddInput(typedArgs);
        return executeApprovedMutation(options, {
          taskId: typedArgs.taskId,
          eventId: typedArgs.eventId,
          actionType: 'capability.add',
          kind: input.kind,
          id: input.id,
          source: input.source,
          sourceRef: input.sourceRef,
          version: input.version,
          requestedEnabled: input.requestedEnabled,
          config: input.config,
          approvalPayload: input,
          run: (service) => service.add(input),
        });
      },
    }),
    defineTool({
      name: 'capability_update',
      description:
        'Request approval to update and revalidate an existing runtime capability source or non-secret metadata.',
      input: v.object({
        taskId: v.string(),
        eventId: v.string(),
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
      run: async ({ data: args }) => {
        const input: CapabilityLifecycleUpdateInput = {
          kind: args.kind,
          id: args.id,
          ...(args.name !== undefined ? { name: args.name } : {}),
          ...(args.description !== undefined ? { description: args.description } : {}),
          ...(args.source !== undefined ? { source: args.source } : {}),
          ...(args.sourceRef !== undefined ? { sourceRef: args.sourceRef } : {}),
          ...(args.version !== undefined ? { version: args.version || null } : {}),
          ...(hasMcpConfig(args)
            ? { config: readMcpConfig(args, false) }
            : {}),
        };
        return executeApprovedMutation(options, {
          taskId: args.taskId,
          eventId: args.eventId,
          actionType: 'capability.update',
          kind: input.kind,
          id: input.id,
          source: input.source,
          sourceRef: input.sourceRef,
          version: input.version,
          config: input.config,
          approvalPayload: input,
          run: (service) => service.update(input),
        });
      },
    }),
    ...(['enable', 'disable', 'remove'] as const).map((operation) =>
      defineTool({
        name: `capability_${operation}`,
        description: `Request approval to ${operation} one runtime capability.`,
        input: v.object({
          taskId: v.string(),
          eventId: v.string(),
          kind: kindSchema,
          id: v.string(),
        }),
        run: async ({ data: args }) =>
          executeApprovedMutation(options, {
            taskId: args.taskId,
            eventId: args.eventId,
            actionType: `capability.${operation}`,
            kind: args.kind,
            id: args.id,
            run: (service) => service[operation](args.kind, args.id),
          }),
      }),
    ),
  ];
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
    source: args.source ?? 'local',
    sourceRef: args.sourceRef ?? (isMcp ? `mcp://${args.id}` : ''),
    version: args.version || null,
    requestedEnabled: args.requestedEnabled ?? args.kind === 'skill',
    installedBy: 'agent',
    ...(isMcp ? { config: readMcpConfig(args, true) } : {}),
  };
}

function readMcpConfig(args: {
  mcpUrl?: string;
  mcpTransport?: 'streamable-http' | 'sse';
  mcpTokenEnv?: string;
}, defaultTransport: boolean): CapabilityConfig {
  return {
    ...(args.mcpUrl !== undefined ? { mcpUrl: args.mcpUrl } : {}),
    ...(args.mcpTransport !== undefined
      ? { mcpTransport: args.mcpTransport }
      : defaultTransport
        ? { mcpTransport: 'streamable-http' as const }
        : {}),
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
    eventId: string;
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
    approvalPayload?: unknown;
    run: (service: CapabilityLifecycleService) => unknown;
  },
): Promise<string> {
  const protocolBundle = await loadTrustedProtocolBundle(
    options.protocolBundleLoader,
    input.eventId,
  );
  const protocolContext = compileCapabilityProtocolContext(protocolBundle);
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
        ? input.source === 'local'
          ? {
              sourceRefDigest: createHash('sha256')
                .update(input.sourceRef.trim())
                .digest('hex'),
            }
          : { sourceRef: input.sourceRef }
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
      ...(input.approvalPayload !== undefined
        ? { mutationDigest: hashCapabilityMutation(input.approvalPayload) }
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
    protocolBundle,
  );
}

function hashCapabilityMutation(value: unknown): string {
  return createHash('sha256')
    .update(JSON.stringify(stableMutationValue(value)))
    .digest('hex');
}

function stableMutationValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stableMutationValue);
  }
  if (!value || typeof value !== 'object') {
    return value;
  }
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([, entry]) => entry !== undefined)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => [key, stableMutationValue(entry)]),
  );
}

async function loadTrustedProtocolBundle(
  loader: CapabilityProtocolBundleLoader,
  eventId: string,
): Promise<ProtocolBundle> {
  const trustedEventId = eventId.trim();
  if (!trustedEventId) {
    throw new Error('Capability lifecycle operations require a persisted eventId.');
  }
  const bundle = await loader(trustedEventId);
  if (bundle.eventId !== trustedEventId) {
    throw new Error(
      `Trusted protocol bundle eventId mismatch: expected ${trustedEventId}.`,
    );
  }
  return bundle;
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
