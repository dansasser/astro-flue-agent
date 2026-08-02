import {
  isSupportedSlashCommand,
  parseSlashCommand,
} from '../commands/slash-commands.js';
import type {
  ChatSessionGenerationRecord,
  GoromboSessionDatabase,
  SessionNormalizedMessageRecord,
} from './session-database.js';
import {
  readMessageText,
  type FlueConversationMessage,
  type FlueConversationPart,
  type FlueConversationSnapshot,
} from './flue-conversation.js';

export type TranscriptActivityStatus = 'running' | 'completed' | 'failed';

export interface ChatTranscriptPrompt {
  id: string;
  text: string;
  receivedAt: string;
  visibility: 'user' | 'internal';
}

export interface ChatTranscriptActivity {
  id: string;
  kind: 'operation' | 'thinking' | 'tool' | 'task' | 'log';
  name: string;
  status: TranscriptActivityStatus;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  preview?: string;
  error?: string;
}

export interface ChatTranscriptAssistantMessage {
  id: string;
  text: string;
  completedAt: string;
}

export interface ChatTranscriptExchange {
  id: string;
  submissionId: string;
  prompt?: ChatTranscriptPrompt;
  activities: ChatTranscriptActivity[];
  assistant?: ChatTranscriptAssistantMessage;
  status: TranscriptActivityStatus;
}

export interface ChatTranscriptPage {
  session: { id: string; title?: string };
  exchanges: ChatTranscriptExchange[];
  stream: { nextOffset: string; upToDate: boolean };
  page: { limit: number; hasOlder: boolean; before?: string };
}

export interface TranscriptCursorV1 {
  v: 1;
  receivedAt: string;
  eventId: string;
}

const LEGACY_STARTUP_PREFIX = 'This is an automatic SIM-ONE Alpha local Ratatui TUI startup event.';
const MAX_THINKING_PREVIEW_CHARS = 500;
const MAX_ACTIVITY_NAME_CHARS = 120;

export function encodeTranscriptCursor(cursor: TranscriptCursorV1): string {
  validateCursor(cursor);
  return Buffer.from(JSON.stringify(cursor), 'utf8').toString('base64url');
}

export function decodeTranscriptCursor(value: string): TranscriptCursorV1 {
  try {
    const parsed = JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as unknown;
    validateCursor(parsed);
    return parsed;
  } catch (error) {
    if (error instanceof TranscriptCursorError) {
      throw error;
    }
    throw new TranscriptCursorError();
  }
}

export function projectSessionTranscript(input: {
  session: { id: string; title?: string };
  prompts: SessionNormalizedMessageRecord[];
  snapshots: FlueConversationSnapshot[];
  generations?: ChatSessionGenerationRecord[];
  limit?: number;
  before?: string;
}): ChatTranscriptPage {
  const entries = buildTranscriptEntries(
    input.prompts,
    input.snapshots,
    input.generations ?? [],
  );
  const limit = input.limit ?? Math.max(1, entries.length);
  const selected = entries.slice(-limit);
  const hasOlder = entries.length > limit;
  const oldestPrompt = selected.find((entry) => entry.promptRecord)?.promptRecord;
  const before = hasOlder && oldestPrompt
    ? encodeTranscriptCursor({
        v: 1,
        receivedAt: oldestPrompt.event.receivedAt,
        eventId: oldestPrompt.event.id,
      })
    : undefined;
  const activeSnapshot = input.snapshots.at(-1);

  return {
    session: input.session,
    exchanges: selected.map((entry) => entry.exchange),
    stream: {
      nextOffset: activeSnapshot?.offset ?? '-1',
      upToDate: true,
    },
    page: {
      limit,
      hasOlder,
      ...(before ? { before } : {}),
    },
  };
}

export async function loadSessionTranscriptPage(input: {
  session: { id: string; title?: string };
  sessionDatabase: Pick<
    GoromboSessionDatabase,
    'getSessionNormalizedMessageEvent' | 'listNormalizedMessageEventsForSession'
  >;
  snapshots: FlueConversationSnapshot[];
  generations: ChatSessionGenerationRecord[];
  limit: number;
  before?: string;
}): Promise<ChatTranscriptPage> {
  const cursor = input.before ? decodeTranscriptCursor(input.before) : undefined;
  if (cursor && !input.sessionDatabase.getSessionNormalizedMessageEvent({
    sessionId: input.session.id,
    eventId: cursor.eventId,
  })) {
    throw new TranscriptCursorError();
  }

  const prompts = input.sessionDatabase.listNormalizedMessageEventsForSession({
    sessionId: input.session.id,
    limit: 1_000,
    ...(cursor ? { before: cursor.eventId } : {}),
  });
  return projectSessionTranscript({
    session: input.session,
    prompts,
    snapshots: input.snapshots,
    generations: input.generations,
    limit: input.limit,
    ...(input.before ? { before: input.before } : {}),
  });
}

interface TranscriptEntry {
  promptRecord?: SessionNormalizedMessageRecord;
  exchange: ChatTranscriptExchange;
  sequence: number;
}

function buildTranscriptEntries(
  sourcePrompts: SessionNormalizedMessageRecord[],
  snapshots: FlueConversationSnapshot[],
  generations: ChatSessionGenerationRecord[],
): TranscriptEntry[] {
  const compactSubmissions = new Set(
    generations.map((generation) => generation.compactionSubmissionId).filter(isString),
  );
  const assistantBySubmission = new Map<string, FlueConversationMessage>();
  const settlementBySubmission = new Map<string, FlueConversationSnapshot['settlements'][number]>();
  const assistantSequence = new Map<string, number>();
  let sequence = 0;

  for (const snapshot of snapshots) {
    for (const settlement of snapshot.settlements) {
      settlementBySubmission.set(settlement.submissionId, settlement);
    }
    for (const message of snapshot.messages) {
      if (message.role !== 'assistant' || message.purpose !== 'assistant' || !message.submissionId) {
        continue;
      }
      assistantBySubmission.set(message.submissionId, message);
      assistantSequence.set(message.submissionId, sequence++);
    }
  }

  const entries: TranscriptEntry[] = [];
  const consumedAssistantSubmissions = new Set<string>();
  const prompts = sourcePrompts.filter(isReplayablePrompt);
  for (const prompt of prompts) {
    const submissionId = prompt.delivery.submissionId ?? `prompt:${prompt.event.id}`;
    const settlement = prompt.delivery.submissionId
      ? settlementBySubmission.get(prompt.delivery.submissionId)
      : undefined;
    const answerSubmissionId = settlement?.answeredBySubmissionId ?? prompt.delivery.submissionId;
    const assistant = answerSubmissionId ? assistantBySubmission.get(answerSubmissionId) : undefined;
    if (answerSubmissionId && assistant) {
      consumedAssistantSubmissions.add(answerSubmissionId);
    }
    const publicPrompt = toPublicTranscriptPrompt(prompt);
    if (!publicPrompt && !assistant) {
      continue;
    }
    entries.push({
      promptRecord: prompt,
      sequence: assistantSequence.get(answerSubmissionId ?? '') ?? sequence++,
      exchange: createExchange({
        submissionId,
        prompt: publicPrompt,
        assistant,
        settlement,
      }),
    });
  }

  for (const [submissionId, assistant] of assistantBySubmission) {
    if (consumedAssistantSubmissions.has(submissionId) || compactSubmissions.has(submissionId)) {
      continue;
    }
    entries.push({
      sequence: assistantSequence.get(submissionId) ?? sequence++,
      exchange: createExchange({
        submissionId,
        assistant,
        settlement: settlementBySubmission.get(submissionId),
      }),
    });
  }

  for (const generation of generations) {
    if (!generation.compactionSubmissionId) {
      continue;
    }
    const previous = [...entries].sort((left, right) => left.sequence - right.sequence).at(-1);
    const activity: ChatTranscriptActivity = {
      id: `compaction:${generation.compactionSubmissionId}`,
      kind: 'operation',
      name: 'session compacted',
      status: 'completed',
    };
    if (previous) {
      previous.exchange.activities.push(activity);
    } else {
      entries.push({
        sequence: sequence++,
        exchange: {
          id: generation.compactionSubmissionId,
          submissionId: generation.compactionSubmissionId,
          activities: [activity],
          status: 'completed',
        },
      });
    }
  }

  return entries.sort((left, right) => left.sequence - right.sequence);
}

function createExchange(input: {
  submissionId: string;
  prompt?: ChatTranscriptPrompt;
  assistant?: FlueConversationMessage;
  settlement?: FlueConversationSnapshot['settlements'][number];
}): ChatTranscriptExchange {
  const activities = input.assistant ? projectActivities(input.assistant) : [];
  const text = input.assistant ? readMessageText(input.assistant) : '';
  const status = input.settlement?.outcome === 'failed' || input.settlement?.outcome === 'aborted'
    ? 'failed'
    : input.settlement?.outcome === 'completed' || input.assistant
      ? 'completed'
      : 'running';
  if (input.settlement) {
    activities.push({
      id: `operation:${input.submissionId}`,
      kind: 'operation',
      name: 'operation',
      status,
      ...(status === 'failed' ? { error: settlementError(input.settlement.error) } : {}),
    });
  }

  return {
    id: input.submissionId,
    submissionId: input.submissionId,
    ...(input.prompt ? { prompt: input.prompt } : {}),
    activities,
    ...(input.assistant && text
      ? {
          assistant: {
            id: input.assistant.id,
            text,
            completedAt: '',
          },
        }
      : {}),
    status,
  };
}

function projectActivities(message: FlueConversationMessage): ChatTranscriptActivity[] {
  const activities: ChatTranscriptActivity[] = [];
  for (const part of message.parts) {
    if (part.type === 'reasoning' && part.text.trim()) {
      activities.push({
        id: `${message.id}:thinking:${activities.length}`,
        kind: 'thinking',
        name: 'thinking',
        status: part.state === 'done' ? 'completed' : 'running',
        preview: boundedText(part.text, MAX_THINKING_PREVIEW_CHARS),
      });
      continue;
    }
    if (part.type === 'dynamic-tool') {
      activities.push(projectToolActivity(part));
    }
  }
  return activities;
}

function projectToolActivity(
  part: Extract<FlueConversationPart, { type: 'dynamic-tool' }>,
): ChatTranscriptActivity {
  const failed = part.state === 'output-error';
  const completed = part.state === 'output-available';
  return {
    id: part.toolCallId,
    kind: 'tool',
    name: boundedText(part.toolName, MAX_ACTIVITY_NAME_CHARS),
    status: failed ? 'failed' : completed ? 'completed' : 'running',
    ...('durationMs' in part && typeof part.durationMs === 'number'
      ? { durationMs: part.durationMs }
      : {}),
    ...(failed ? { error: part.errorText } : {}),
  };
}

function isReplayablePrompt(prompt: SessionNormalizedMessageRecord): boolean {
  if (prompt.delivery.submissionId || prompt.delivery.instanceId) {
    return true;
  }
  const command = parseSlashCommand(prompt.event.text);
  return !command || !isSupportedSlashCommand(command);
}

function toPublicTranscriptPrompt(
  prompt: SessionNormalizedMessageRecord,
): ChatTranscriptPrompt | undefined {
  const internal = prompt.event.context?.workflow === 'tui.startup-preflight'
    || prompt.event.text.startsWith(LEGACY_STARTUP_PREFIX);
  if (internal) {
    return undefined;
  }
  return {
    id: prompt.event.id,
    text: prompt.event.text,
    receivedAt: prompt.event.receivedAt,
    visibility: 'user',
  };
}

function settlementError(error: unknown): string {
  if (typeof error === 'string' && error.trim()) {
    return error;
  }
  if (isRecord(error) && typeof error.message === 'string' && error.message.trim()) {
    return error.message;
  }
  return 'Operation failed.';
}

function boundedText(value: string, limit: number): string {
  const characters = [...value];
  return characters.length <= limit
    ? value
    : `${characters.slice(0, Math.max(0, limit - 3)).join('')}...`;
}

export class TranscriptCursorError extends Error {
  constructor() {
    super('Transcript cursor is invalid.');
    this.name = 'TranscriptCursorError';
  }
}

function validateCursor(value: unknown): asserts value is TranscriptCursorV1 {
  if (!isRecord(value)
    || value.v !== 1
    || !isNonEmptyString(value.receivedAt)
    || !isIsoTimestamp(value.receivedAt)
    || !isNonEmptyString(value.eventId)) {
    throw new TranscriptCursorError();
  }
}

function isIsoTimestamp(value: string): boolean {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && new Date(parsed).toISOString() === value;
}

function isString(value: string | undefined): value is string {
  return typeof value === 'string';
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
