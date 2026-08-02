import { init, type AgentReply } from '@flue/runtime';
import { Researcher } from '../engine/workers/researcher/researcher.js';
import type { ResearchDepth } from './web-research.js';
import type { WebFetchMode } from './retrieval.js';

export interface ResearchWorkflowPayload {
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
  text: string;
  data: AgentReply['data'];
  metadata?: AgentReply['metadata'];
  submissionId: string;
}

export async function runResearchWorkflow(
  payload: ResearchWorkflowPayload,
): Promise<ResearchWorkflowResponse> {
  const instanceId = payload.session ?? payload.conversationId ?? 'research';
  const handle = init(Researcher, { id: instanceId });
  const receipt = await handle.dispatch({
    message: createResearchPrompt(payload),
    idempotencyKey: `research:${instanceId}:${Date.now()}`,
    initialData: {
      actorId: payload.actorId,
      conversationId: payload.conversationId,
      depth: payload.depth ?? 'standard',
    },
  });
  const reply = await handle.read(receipt);
  return {
    text: reply.text,
    data: reply.data,
    ...(reply.metadata ? { metadata: reply.metadata } : {}),
    submissionId: reply.submissionId,
  };
}

export function createResearchPrompt(payload: ResearchWorkflowPayload): string {
  const depth = payload.depth ?? 'standard';
  const webResearchControls = [`depth: "${depth}"`];
  if (payload.maxContextTokens !== undefined) webResearchControls.push(`maxContextTokens: ${payload.maxContextTokens}`);
  if (payload.webFetch !== undefined) webResearchControls.push(`webFetch: "${payload.webFetch}"`);
  if (payload.fetchTopK !== undefined) webResearchControls.push(`maxFetches: ${payload.fetchTopK}`);

  return `Use web_research for source-backed research before answering.
Call web_research with ${webResearchControls.join(', ')}, and enough maxQueries for the task complexity.
When a budget or fetch option is not listed, omit it so web_research applies the selected depth defaults.
Compare sources, preserve source URLs, and report providerFailures when they affect confidence.

Research request:
${JSON.stringify({
  text: payload.text,
  actorId: payload.actorId ?? 'research-user',
  conversationId: payload.conversationId ?? payload.session ?? 'research',
}, null, 2)}`;
}
