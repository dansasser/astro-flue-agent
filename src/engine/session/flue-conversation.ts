import { estimateTextTokens } from './context-budget.js';

export function agentConversationUrl(instanceId: string): string {
  return `/agents/orchestrator/${encodeURIComponent(instanceId)}`;
}

export interface FlueConversationSettlement {
  submissionId: string;
  outcome: 'completed' | 'failed' | 'aborted';
  error?: unknown;
  answeredBySubmissionId?: string;
}

export interface FlueConversationSnapshot {
  v: 1;
  conversationId: string;
  offset: string;
  incarnation?: string;
  messages: FlueConversationMessage[];
  settlements: FlueConversationSettlement[];
}

export interface FlueConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  purpose: 'user' | 'assistant' | 'dispatch' | 'advisory';
  display: 'visible' | 'hidden' | 'diagnostic';
  submissionId?: string;
  turnId?: string;
  signal?: { tagName?: string; attributes?: Record<string, string> };
  settlement?: { outcome: 'failed' | 'aborted' };
  parts: FlueConversationPart[];
  metadata?: Record<string, unknown>;
}

export type FlueConversationPart =
  | { type: 'text'; text: string; state: 'streaming' | 'done' }
  | { type: 'reasoning'; text: string; state: 'streaming' | 'done' }
  | { type: `data-${string}`; data: unknown }
  | { type: 'file'; mediaType: string; id?: string; size?: number; url?: string; filename?: string }
  | {
      type: 'dynamic-tool';
      toolName: string;
      toolCallId: string;
      state: 'input-available';
      input: unknown;
    }
  | {
      type: 'dynamic-tool';
      toolName: string;
      toolCallId: string;
      state: 'output-available';
      input: unknown;
      output: unknown;
      durationMs?: number;
    }
  | {
      type: 'dynamic-tool';
      toolName: string;
      toolCallId: string;
      state: 'output-error';
      input: unknown;
      errorText: string;
      durationMs?: number;
    };

export function isFlueConversationSnapshot(value: unknown): value is FlueConversationSnapshot {
  if (!isRecord(value)) {
    return false;
  }
  return value.v === 1
    && typeof value.conversationId === 'string'
    && typeof value.offset === 'string'
    && Array.isArray(value.messages)
    && Array.isArray(value.settlements);
}

export function readMessageText(message: FlueConversationMessage): string {
  return message.parts
    .filter((part): part is Extract<FlueConversationPart, { type: 'text' }> => part.type === 'text')
    .map((part) => part.text)
    .join('');
}

export function estimateConversationTokens(snapshots: readonly FlueConversationSnapshot[]): number {
  return snapshots.reduce(
    (total, snapshot) => total + snapshot.messages.reduce(
      (messageTotal, message) => messageTotal + message.parts.reduce((partTotal, part) => {
        if (part.type === 'text' || part.type === 'reasoning') {
          return partTotal + estimateTextTokens(part.text);
        }
        if (part.type === 'dynamic-tool') {
          return partTotal + estimateTextTokens(JSON.stringify({
            toolName: part.toolName,
            input: part.input,
            ...('output' in part ? { output: part.output } : {}),
            ...('errorText' in part ? { error: part.errorText } : {}),
          }));
        }
        return partTotal;
      }, 0),
      0,
    ),
    0,
  );
}

export function readConversationUsageTokens(snapshots: readonly FlueConversationSnapshot[]): number {
  let maximum = 0;
  for (const snapshot of snapshots) {
    for (const message of snapshot.messages) {
      const usage = readNestedUsage(message.metadata);
      maximum = Math.max(maximum, usage);
    }
  }
  return maximum;
}

function readNestedUsage(metadata: Record<string, unknown> | undefined): number {
  const simOne = isRecord(metadata?.simOne) ? metadata.simOne : undefined;
  const usage = isRecord(simOne?.usage) ? simOne.usage : undefined;
  return Math.max(
    readTokenCount(usage?.totalTokens),
    readTokenCount(usage?.input)
      + readTokenCount(usage?.output)
      + readTokenCount(usage?.cacheRead)
      + readTokenCount(usage?.cacheWrite),
  );
}

function readTokenCount(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
