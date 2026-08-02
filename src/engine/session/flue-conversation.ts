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
    && (value.incarnation === undefined || typeof value.incarnation === 'string')
    && Array.isArray(value.messages)
    && value.messages.every(isFlueConversationMessage)
    && Array.isArray(value.settlements)
    && value.settlements.every(isFlueConversationSettlement);
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

function isFlueConversationMessage(value: unknown): value is FlueConversationMessage {
  if (!isRecord(value)) {
    return false;
  }
  return typeof value.id === 'string'
    && isOneOf(value.role, ['user', 'assistant', 'system'])
    && isOneOf(value.purpose, ['user', 'assistant', 'dispatch', 'advisory'])
    && isOneOf(value.display, ['visible', 'hidden', 'diagnostic'])
    && (value.submissionId === undefined || typeof value.submissionId === 'string')
    && (value.turnId === undefined || typeof value.turnId === 'string')
    && (value.signal === undefined || isConversationSignal(value.signal))
    && (value.settlement === undefined || (
      isRecord(value.settlement)
      && isOneOf(value.settlement.outcome, ['failed', 'aborted'])
    ))
    && Array.isArray(value.parts)
    && value.parts.every(isFlueConversationPart)
    && (value.metadata === undefined || isRecord(value.metadata));
}

function isFlueConversationSettlement(value: unknown): value is FlueConversationSettlement {
  return isRecord(value)
    && typeof value.submissionId === 'string'
    && isOneOf(value.outcome, ['completed', 'failed', 'aborted'])
    && (value.answeredBySubmissionId === undefined
      || typeof value.answeredBySubmissionId === 'string');
}

function isFlueConversationPart(value: unknown): value is FlueConversationPart {
  if (!isRecord(value) || typeof value.type !== 'string') {
    return false;
  }
  if (value.type === 'text' || value.type === 'reasoning') {
    return typeof value.text === 'string' && isOneOf(value.state, ['streaming', 'done']);
  }
  if (value.type.startsWith('data-')) {
    return true;
  }
  if (value.type === 'file') {
    return typeof value.mediaType === 'string'
      && (value.id === undefined || typeof value.id === 'string')
      && (value.size === undefined || typeof value.size === 'number')
      && (value.url === undefined || typeof value.url === 'string')
      && (value.filename === undefined || typeof value.filename === 'string');
  }
  if (value.type !== 'dynamic-tool'
    || typeof value.toolName !== 'string'
    || typeof value.toolCallId !== 'string') {
    return false;
  }
  if (value.state === 'input-available') {
    return Object.hasOwn(value, 'input');
  }
  if (value.state === 'output-available') {
    return Object.hasOwn(value, 'input')
      && Object.hasOwn(value, 'output')
      && (value.durationMs === undefined || typeof value.durationMs === 'number');
  }
  if (value.state === 'output-error') {
    return Object.hasOwn(value, 'input')
      && typeof value.errorText === 'string'
      && (value.durationMs === undefined || typeof value.durationMs === 'number');
  }
  return false;
}

function isConversationSignal(value: unknown): boolean {
  if (!isRecord(value)) {
    return false;
  }
  return (value.tagName === undefined || typeof value.tagName === 'string')
    && (value.attributes === undefined || (
      isRecord(value.attributes)
      && Object.values(value.attributes).every((attribute) => typeof attribute === 'string')
    ));
}

function isOneOf<T extends string>(value: unknown, values: readonly T[]): value is T {
  return typeof value === 'string' && values.includes(value as T);
}
