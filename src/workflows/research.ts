import { createHash } from 'node:crypto';
import {
  init,
  type AgentReply,
  type DispatchReceipt,
} from '@flue/runtime';
import { goromboPersistenceRuntime } from '../db.js';
import type { NormalizedMessageEvent } from '../core/types/index.js';
import { Researcher } from '../engine/workers/researcher/researcher.js';
import type { ResearchDepth } from './web-research.js';
import type { WebFetchMode } from './retrieval.js';

export interface ResearchWorkflowPayload {
  operationId: string;
  text: string;
  actorId?: string;
  conversationId?: string;
  session?: string;
  depth?: ResearchDepth;
  maxContextTokens?: number;
  webFetch?: WebFetchMode;
  fetchTopK?: number;
}

export interface ResearchWorkflowResponse {
  eventId: string;
  text: string;
  data: AgentReply['data'];
  metadata?: AgentReply['metadata'];
  submissionId: string;
}

interface ResearchAgentHandle {
  dispatch(input: {
    message: string;
    idempotencyKey: string;
    initialData: Record<string, unknown>;
  }): Promise<DispatchReceipt>;
  read(receipt: DispatchReceipt): Promise<AgentReply>;
}

export interface ResearchWorkflowDependencies {
  initialize?: (instanceId: string) => ResearchAgentHandle;
}

export interface ResearchDispatchPlan {
  event: NormalizedMessageEvent;
  idempotencyKey: string;
  initialData: Record<string, unknown>;
  instanceId: string;
  message: string;
}

export async function runResearchWorkflow(
  payload: ResearchWorkflowPayload,
  dependencies: ResearchWorkflowDependencies = {},
): Promise<ResearchWorkflowResponse> {
  const plan = createResearchDispatchPlan(payload);
  const database = goromboPersistenceRuntime.sessionDatabase;
  const persisted = database.getNormalizedMessageEvent(plan.event.id);
  if (persisted && !sameResearchOperation(persisted, plan.event)) {
    throw new Error(`Research operation ${payload.operationId} conflicts with its persisted scope.`);
  }
  const event = persisted ?? plan.event;
  database.recordNormalizedMessageEvent({ event, deliveryKind: 'direct-agent' });

  const handle = dependencies.initialize?.(plan.instanceId)
    ?? init(Researcher, { id: plan.instanceId });
  const receipt = await handle.dispatch({
    message: plan.message,
    idempotencyKey: plan.idempotencyKey,
    initialData: plan.initialData,
  });
  database.recordNormalizedMessageEvent({
    event,
    deliveryKind: 'direct-agent',
    delivery: {
      submissionId: receipt.submissionId,
      instanceId: plan.instanceId,
      ...(receipt.uid ? { uid: receipt.uid } : {}),
    },
    acceptedAt: receipt.acceptedAt,
  });
  const reply = await handle.read(receipt);
  return {
    eventId: event.id,
    text: reply.text,
    data: reply.data,
    ...(reply.metadata ? { metadata: reply.metadata } : {}),
    submissionId: reply.submissionId,
  };
}

export function createResearchDispatchPlan(
  payload: ResearchWorkflowPayload,
): ResearchDispatchPlan {
  const instanceId = payload.session ?? payload.conversationId ?? 'research';
  const eventId = createResearchEventId(instanceId, payload.operationId);
  const event: NormalizedMessageEvent = {
    id: eventId,
    connector: 'scheduled-job',
    kind: 'workflow.event',
    text: payload.text,
    receivedAt: new Date().toISOString(),
    actor: { id: payload.actorId ?? 'local-research-user' },
    conversation: { id: payload.conversationId ?? payload.session ?? 'local-research' },
    context: { workflow: 'research', task: payload.operationId },
  };
  return {
    event,
    idempotencyKey: `research:${instanceId}:${payload.operationId}`,
    initialData: {
      operationId: payload.operationId,
      eventId,
      depth: payload.depth ?? 'standard',
    },
    instanceId,
    message: createResearchPrompt(payload, eventId),
  };
}

export function createResearchPrompt(
  payload: ResearchWorkflowPayload,
  eventId = createResearchEventId(
    payload.session ?? payload.conversationId ?? 'research',
    payload.operationId,
  ),
): string {
  const depth = payload.depth ?? 'standard';
  const webResearchControls = [`eventId: "${eventId}"`, `depth: "${depth}"`];
  if (payload.maxContextTokens !== undefined) webResearchControls.push(`maxContextTokens: ${payload.maxContextTokens}`);
  if (payload.webFetch !== undefined) webResearchControls.push(`webFetch: "${payload.webFetch}"`);
  if (payload.fetchTopK !== undefined) webResearchControls.push(`maxFetches: ${payload.fetchTopK}`);

  return `Use web_research for source-backed research before answering.
Call web_research with ${webResearchControls.join(', ')}, and enough maxQueries for the task complexity.
When a budget or fetch option is not listed, omit it so web_research applies the selected depth defaults.
Compare sources, preserve source URLs, and report providerFailures when they affect confidence.

Research request:
${JSON.stringify({
  eventId,
  text: payload.text,
}, null, 2)}`;
}

function createResearchEventId(instanceId: string, operationId: string): string {
  const operationKey = `${instanceId}\u0000${operationId}`;
  return `research:${createHash('sha256').update(operationKey).digest('hex').slice(0, 24)}`;
}

function sameResearchOperation(
  persisted: NormalizedMessageEvent,
  expected: NormalizedMessageEvent,
): boolean {
  return persisted.connector === expected.connector
    && persisted.kind === expected.kind
    && persisted.text === expected.text
    && persisted.actor.id === expected.actor.id
    && persisted.conversation.id === expected.conversation.id
    && persisted.context?.workflow === expected.context?.workflow
    && persisted.context?.task === expected.context?.task;
}
