import type { Hono } from 'hono';
import {
  isSessionCreationSlashCommand,
  isSupportedSlashCommand,
  parseSlashCommand,
  type ParsedSlashCommand,
} from '../../engine/commands/slash-commands.js';
import { normalizeWebApiMessage, type WebApiMessageInput } from '../../api/connectors/web-api.js';
import { goromboPersistenceRuntime } from '../../db.js';
import { requireApiSecret, runtimeEnvForRequest } from '../../api/middleware/api-secret.js';
import { configureRuntimeModels } from '../../core/models/index.js';
import {
  dispatchOrchestratorMessage,
  type OrchestratorDispatcher,
} from '../../engine/session/durable-orchestrator-session.js';
import {
  createSessionBudgetReport,
  type SessionBudgetReport,
} from '../../engine/session/session-budget.js';
import { renderContinuationContext } from '../../engine/session/continuation-context.js';
import {
  ChatSessionAmbiguousError,
  ChatSessionNotFoundError,
  isGuiSessionManagedConnector,
  resolveChatSession,
  SessionAccessDeniedError,
  type ChatSessionResolution,
} from '../../engine/session/session-routing.js';
import type { AgentDeliveryReference } from '../../engine/session/session-database.js';
import { createChatPrompt } from '../../api/routes/chat-prompt.js';
import { runWithTrustedMessageEvent } from '../../api/ingress/trusted-event-context.js';
import {
  agentConversationUrl,
  type FlueConversationSnapshot,
} from '../../engine/session/flue-conversation.js';
import { loadFlueConversationSnapshot } from '../../engine/session/flue-conversation-loader.js';

export interface ChatEventRouteOptions {
  dispatchOrchestrator?: OrchestratorDispatcher;
  loadConversationSnapshot?: (input: {
    instanceId: string;
    headers: Headers;
    env: Record<string, unknown>;
  }) => Promise<FlueConversationSnapshot | null>;
}

export function registerChatEventRoutes(app: Hono, options: ChatEventRouteOptions = {}): void {
  const dispatchOrchestrator = options.dispatchOrchestrator ?? dispatchOrchestratorMessage;
  const loadConversationSnapshot = options.loadConversationSnapshot
    ?? ((input) => loadFlueConversationSnapshot(
      (path, init, env) => app.request(path, init, env),
      input,
    ));

  app.post('/api/chat/events', requireApiSecret, async (c) => {
    const headers = new Headers(c.req.raw.headers);
    headers.set('content-type', 'application/json');
    let payload: unknown;

    try {
      payload = await c.req.json();
    } catch {
      return c.json({ error: 'Invalid JSON payload' }, 400);
    }

    const event = normalizeWebApiMessage(payload as WebApiMessageInput);
    const slashCommand = parseSlashCommand(event.text);

    if (slashCommand && !isSupportedSlashCommand(slashCommand)) {
      goromboPersistenceRuntime.sessionDatabase.recordNormalizedMessageEvent({ event });
      return c.json(createCommandResponse({
        eventId: event.id,
        command: slashCommand,
        text: `Unknown command "${slashCommand.raw}". Supported commands are /new, /clear, /resume, /rename, /compact, and /session.`,
      }));
    }

    if (slashCommand && isGuiSessionManagedConnector(event.connector) && isSessionCreationSlashCommand(slashCommand)) {
      goromboPersistenceRuntime.sessionDatabase.recordNormalizedMessageEvent({ event });
      return c.json(createCommandResponse({
        eventId: event.id,
        command: slashCommand,
        text: `${slashCommand.raw} is handled by the web client session controls. Use the new chat action instead.`,
      }));
    }

    if (slashCommand?.name === 'resume' && !slashCommand.args) {
      goromboPersistenceRuntime.sessionDatabase.recordNormalizedMessageEvent({ event });
      return c.json(createCommandResponse({
        eventId: event.id,
        command: slashCommand,
        text: 'Usage: /resume <session-id-or-name>',
      }), 400);
    }

    if (slashCommand?.name === 'rename' && !slashCommand.args) {
      goromboPersistenceRuntime.sessionDatabase.recordNormalizedMessageEvent({ event });
      return c.json(createCommandResponse({
        eventId: event.id,
        command: slashCommand,
        text: 'Usage: /rename <title>',
      }), 400);
    }

    const requestedSessionId = slashCommand?.name === 'resume'
      ? slashCommand.args
      : typeof (payload as { session?: unknown }).session === 'string'
        ? (payload as { session: string }).session
        : undefined;

    let sessionResolution: ChatSessionResolution;
    try {
      sessionResolution = resolveChatSession({
        event,
        requestedSessionId,
        forceNew: slashCommand ? isSessionCreationSlashCommand(slashCommand) : false,
        title: slashCommand && isSessionCreationSlashCommand(slashCommand) && slashCommand.args
          ? slashCommand.args
          : undefined,
        displayName: slashCommand && isSessionCreationSlashCommand(slashCommand) && slashCommand.args
          ? slashCommand.args
          : undefined,
      });
    } catch (error) {
      goromboPersistenceRuntime.sessionDatabase.recordNormalizedMessageEvent({ event });
      if (error instanceof SessionAccessDeniedError) {
        return c.json({ error: error.message, eventId: event.id }, 403);
      }
      if (error instanceof ChatSessionNotFoundError) {
        return c.json({ error: error.message, eventId: event.id }, 404);
      }
      if (error instanceof ChatSessionAmbiguousError) {
        return c.json({ error: error.message, eventId: event.id }, 409);
      }
      throw error;
    }

    goromboPersistenceRuntime.sessionDatabase.recordNormalizedMessageEvent({
      event,
      sessionId: sessionResolution.sessionId,
      deliveryKind: slashCommand ? 'session-command' : 'direct-agent',
    });

    if (slashCommand?.name === 'new') {
      return c.json(createCommandResponse({
        eventId: event.id,
        sessionResolution,
        command: slashCommand,
        text: `Started new session ${sessionResolution.sessionId}.`,
        ...(slashCommand.args ? { sessionTitle: slashCommand.args } : {}),
      }));
    }

    if (slashCommand?.name === 'clear') {
      return c.json(createCommandResponse({
        eventId: event.id,
        sessionResolution,
        command: slashCommand,
        text: `Cleared conversation. Started new session ${sessionResolution.sessionId}.`,
        ...(slashCommand.args ? { sessionTitle: slashCommand.args } : {}),
      }));
    }

    if (slashCommand?.name === 'resume') {
      return c.json(createCommandResponse({
        eventId: event.id,
        sessionResolution,
        command: slashCommand,
        text: `Resumed session ${sessionResolution.sessionId}.`,
      }));
    }

    if (slashCommand?.name === 'session') {
      return c.json(createCommandResponse({
        eventId: event.id,
        sessionResolution,
        command: slashCommand,
        text: `Current session ${sessionResolution.sessionId}.`,
      }));
    }

    if (slashCommand?.name === 'rename') {
      goromboPersistenceRuntime.sessionDatabase.renameChatSession(
        sessionResolution.sessionId,
        slashCommand.args,
      );

      return c.json(createCommandResponse({
        eventId: event.id,
        sessionResolution,
        command: slashCommand,
        text: `Renamed session ${sessionResolution.sessionId} to "${slashCommand.args}".`,
        sessionTitle: slashCommand.args,
      }));
    }

    if (slashCommand?.name === 'compact') {
      const runtimeEnv = runtimeEnvForRequest(c.env as Record<string, unknown> | undefined);
      const compacted = await runWithTrustedMessageEvent(event, () => compactDurableChatSession({
        sessionResolution,
        command: slashCommand,
        env: runtimeEnv,
        eventId: event.id,
        headers,
        dispatchOrchestrator,
        loadConversationSnapshot,
      }));

      return c.json(createCommandResponse({
        eventId: event.id,
        sessionResolution,
        command: slashCommand,
        text: `Compacted session ${sessionResolution.sessionId}.`,
        contextBudget: compacted.contextBudget,
        streamUrl: compacted.streamUrl,
      }));
    }

    const runtimeEnv = runtimeEnvForRequest(c.env as Record<string, unknown> | undefined);
    const generation = goromboPersistenceRuntime.sessionDatabase.ensureRuntimeGeneration(
      sessionResolution.sessionId,
    );
    const chatPrompt = createChatPrompt(event);
    const dispatchMessage = generation.continuationSummary
      ? `${renderContinuationContext({
          productSessionId: sessionResolution.sessionId,
          generation: generation.generation,
          continuationSummary: generation.continuationSummary,
        })}\n\n${chatPrompt}`
      : chatPrompt;
    const dispatchResult = await runWithTrustedMessageEvent(event, () => dispatchOrchestrator({
      instanceId: generation.instanceId,
      message: dispatchMessage,
      idempotencyKey: event.id,
      initialData: {
        productSessionId: sessionResolution.sessionId,
        generation: generation.generation,
        ...(generation.continuationSummary
          ? { continuationSummary: generation.continuationSummary }
          : {}),
      },
    }));
    const delivery: AgentDeliveryReference = {
      submissionId: dispatchResult.receipt.submissionId,
      instanceId: generation.instanceId,
      uid: dispatchResult.receipt.uid,
      streamUrl: agentConversationUrl(generation.instanceId),
    };
    goromboPersistenceRuntime.sessionDatabase.recordNormalizedMessageEvent({
      event,
      sessionId: sessionResolution.sessionId,
      deliveryKind: 'direct-agent',
      deliveryId: dispatchResult.receipt.submissionId,
      delivery,
      acceptedAt: dispatchResult.receipt.acceptedAt,
    });
    const contextProjection = await createContextUsageProjection({
      sessionId: sessionResolution.sessionId,
      env: runtimeEnv,
      headers,
      loadConversationSnapshot,
    });
    if (contextProjection.snapshot) {
      scheduleConversationIndexing(
        sessionResolution.sessionId,
        contextProjection.snapshot,
      );
    }

    return c.json({
      result: {
        text: dispatchResult.reply.text,
        data: dispatchResult.reply.data,
        ...(dispatchResult.reply.metadata ? { metadata: dispatchResult.reply.metadata } : {}),
      },
      submissionId: dispatchResult.receipt.submissionId,
      submission: {
        id: dispatchResult.receipt.submissionId,
        acceptedAt: dispatchResult.receipt.acceptedAt,
        uid: dispatchResult.receipt.uid,
      },
      streamUrl: delivery.streamUrl,
      event: {
        id: event.id,
        connector: event.connector,
        messageKind: event.kind,
        receivedAt: event.receivedAt,
      },
      session: {
        id: sessionResolution.sessionId,
        surface: sessionResolution.surface,
        created: sessionResolution.created,
      },
      contextUsage: contextProjection.contextUsage,
    });
  });
}

function createCommandResponse(input: {
  eventId: string;
  command: ParsedSlashCommand;
  text: string;
  sessionResolution?: ChatSessionResolution;
  sessionTitle?: string;
  contextBudget?: DurableChatContextBudget;
  streamUrl?: string;
}): {
  result: {
    text: string;
    command: {
      name: string;
      handled: boolean;
    };
    contextBudget?: DurableChatContextBudget;
  };
  event: {
    id: string;
  };
  session?: {
    id: string;
    surface: ChatSessionResolution['surface'];
    created: boolean;
    title?: string;
  };
  contextUsage?: ContextUsageProjection;
  streamUrl?: string;
} {
  const sessionTitle = input.sessionTitle ?? input.sessionResolution?.session.displayName;
  return {
    result: {
      text: input.text,
      command: {
        name: input.command.name,
        handled: true,
      },
      ...(input.contextBudget ? { contextBudget: input.contextBudget } : {}),
    },
    event: {
      id: input.eventId,
    },
    ...(input.contextBudget
      ? { contextUsage: projectContextUsage(input.contextBudget) }
      : {}),
    ...(input.streamUrl ? { streamUrl: input.streamUrl } : {}),
    ...(input.sessionResolution
      ? {
          session: {
            id: input.sessionResolution.sessionId,
            surface: input.sessionResolution.surface,
            created: input.sessionResolution.created,
            ...(sessionTitle ? { title: sessionTitle } : {}),
          },
        }
      : {}),
  };
}

interface DurableChatContextBudget extends SessionBudgetReport {
  compactedBeforePrompt: boolean;
  prePromptStatus: SessionBudgetReport['status'];
  prePromptEstimatedUsedTokens: number;
  lastPromptEstimateTokens: number;
}

type ContextUsageProjection =
  | {
      available: false;
    }
  | {
      available: true;
      source: 'session-budget';
      modelSpecifier: string;
      usedTokens: number;
      capacityTokens: number;
    };

async function createContextUsageProjection(input: {
  sessionId: string;
  env: Record<string, unknown>;
  headers: Headers;
  loadConversationSnapshot: NonNullable<ChatEventRouteOptions['loadConversationSnapshot']>;
}): Promise<{
  contextUsage: ContextUsageProjection;
  snapshot?: FlueConversationSnapshot;
}> {
  try {
    const generations = goromboPersistenceRuntime.sessionDatabase.listRuntimeGenerations(input.sessionId);
    const active = generations.at(-1);
    if (!active) {
      return { contextUsage: unavailableContextUsage() };
    }
    const snapshot = await input.loadConversationSnapshot({
      instanceId: active.instanceId,
      headers: input.headers,
      env: input.env,
    });
    if (!snapshot) {
      return { contextUsage: unavailableContextUsage() };
    }
    const modelCard = configureRuntimeModels(input.env).selectedModelCard;
    return {
      contextUsage: projectContextUsage(createSessionBudgetReport({
        sessionId: input.sessionId,
        modelCard,
        snapshots: [snapshot],
        compactions: Math.max(0, generations.length - 1),
      })),
      snapshot,
    };
  } catch {
    return { contextUsage: unavailableContextUsage() };
  }
}

function scheduleConversationIndexing(
  sessionId: string,
  snapshot: FlueConversationSnapshot,
): void {
  void goromboPersistenceRuntime.sessionDatabase.indexFlueConversationSnapshot(
    sessionId,
    snapshot,
  ).catch((error) => {
    console.error(
      '[WARN] Flue 2 session memory indexing failed:',
      error instanceof Error ? error.message : String(error),
    );
  });
}

function projectContextUsage(report: SessionBudgetReport): ContextUsageProjection {
  if (!Number.isFinite(report.usableInputTokens) || report.usableInputTokens <= 0) {
    return unavailableContextUsage();
  }

  return {
    available: true,
    source: 'session-budget',
    modelSpecifier: report.modelSpecifier,
    usedTokens: Math.min(
      Math.max(0, Math.floor(report.estimatedUsedTokens)),
      report.usableInputTokens,
    ),
    capacityTokens: report.usableInputTokens,
  };
}

function unavailableContextUsage(): ContextUsageProjection {
  return { available: false };
}

async function compactDurableChatSession(input: {
  sessionResolution: ChatSessionResolution;
  command: ParsedSlashCommand;
  env: Record<string, unknown>;
  eventId: string;
  headers: Headers;
  dispatchOrchestrator: OrchestratorDispatcher;
  loadConversationSnapshot: NonNullable<ChatEventRouteOptions['loadConversationSnapshot']>;
}): Promise<{ contextBudget: DurableChatContextBudget; streamUrl: string }> {
  const modelCard = configureRuntimeModels(input.env).selectedModelCard;
  const sessionId = input.sessionResolution.sessionId;
  const active = goromboPersistenceRuntime.sessionDatabase.ensureRuntimeGeneration(sessionId);
  const result = await input.dispatchOrchestrator({
    instanceId: active.instanceId,
    message: {
      kind: 'signal',
      type: 'sim_one_compact',
      tagName: 'session_compaction',
      attributes: {
        productSessionId: sessionId,
        generation: String(active.generation),
      },
      body: `Create a concise continuation summary for the next runtime generation of this product session. Preserve user decisions, active tasks, constraints, names, paths, and unresolved work. Return only the summary text. Command: ${input.command.raw}`,
    },
    idempotencyKey: `compact:${input.eventId}`,
    initialData: {
      productSessionId: sessionId,
      generation: active.generation,
      ...(active.continuationSummary ? { continuationSummary: active.continuationSummary } : {}),
    },
  });
  const generation = goromboPersistenceRuntime.sessionDatabase.rotateRuntimeGeneration({
    sessionId,
    expectedInstanceId: active.instanceId,
    continuationSummary: result.reply.text,
    compactionSubmissionId: result.receipt.submissionId,
  });

  const contextBudget = createSessionBudgetReport({
    sessionId,
    modelCard,
    snapshots: [],
    compactions: generation.generation,
    additionalHistoryText: renderContinuationContext({
      productSessionId: sessionId,
      generation: generation.generation,
      continuationSummary: result.reply.text,
    }),
  });

  return {
    contextBudget: {
      ...contextBudget,
      compactedBeforePrompt: true,
      prePromptStatus: contextBudget.status,
      prePromptEstimatedUsedTokens: contextBudget.estimatedUsedTokens,
      lastPromptEstimateTokens: contextBudget.estimatedPromptTokens,
    },
    streamUrl: agentConversationUrl(generation.instanceId),
  };
}
