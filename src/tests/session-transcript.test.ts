import assert from 'node:assert/strict';
import test from 'node:test';
import {
  decodeTranscriptCursor,
  encodeTranscriptCursor,
  loadSessionTranscriptPage,
  projectSessionTranscript,
  TranscriptCursorError,
} from '../engine/session/session-transcript.js';
import type { FlueConversationSnapshot } from '../engine/session/flue-conversation.js';
import type {
  ChatSessionGenerationRecord,
  SessionNormalizedMessageRecord,
} from '../engine/session/session-database.js';

test('Flue 2 snapshots project prompts, thinking, tools, final response, and settlement', () => {
  const page = projectSessionTranscript({
    session: { id: 'session-1' },
    prompts: [prompt('event-1', 'submission-1', 'Explain it')],
    snapshots: [snapshot('session-1', 'submission-1', 'Final answer')],
    limit: 50,
  });
  assert.equal(page.exchanges.length, 1);
  assert.equal(page.exchanges[0]?.prompt?.text, 'Explain it');
  assert.equal(page.exchanges[0]?.assistant?.text, 'Final answer');
  assert.equal(page.exchanges[0]?.status, 'completed');
  assert.deepEqual(page.exchanges[0]?.activities.map((activity) => activity.kind), [
    'thinking',
    'tool',
    'operation',
  ]);
  assert.equal(page.stream.nextOffset, '8');
});

test('startup prompt stays hidden while its greeting remains visible', () => {
  const startup = prompt('startup', 'submission-startup', 'startup prompt');
  startup.event.context = { workflow: 'tui.startup-preflight' };
  const page = projectSessionTranscript({
    session: { id: 'session-1' },
    prompts: [startup],
    snapshots: [snapshot('session-1', 'submission-startup', 'Hello Daniel.')],
  });
  assert.equal(page.exchanges[0]?.prompt, undefined);
  assert.equal(page.exchanges[0]?.assistant?.text, 'Hello Daniel.');
});

test('manual compaction summary stays hidden and projects one completed compaction activity', () => {
  const first = snapshot('session-1', 'submission-1', 'First answer');
  first.messages.push({
    id: 'compact-signal',
    role: 'system',
    purpose: 'dispatch',
    display: 'hidden',
    submissionId: 'compact-1',
    signal: { tagName: 'session_compaction' },
    parts: [{ type: 'text', text: 'make summary', state: 'done' }],
  }, {
    id: 'compact-summary',
    role: 'assistant',
    purpose: 'assistant',
    display: 'visible',
    submissionId: 'compact-1',
    parts: [{ type: 'text', text: 'private continuation summary', state: 'done' }],
  });
  first.settlements.push({ submissionId: 'compact-1', outcome: 'completed' });
  const generations: ChatSessionGenerationRecord[] = [
    { sessionId: 'session-1', generation: 0, instanceId: 'session-1', createdAt: '2026-08-01T00:00:00.000Z' },
    {
      sessionId: 'session-1',
      generation: 1,
      instanceId: 'session-1-g1-aabbccdd',
      continuationSummary: 'private continuation summary',
      compactionSubmissionId: 'compact-1',
      createdAt: '2026-08-01T00:01:00.000Z',
    },
  ];
  const page = projectSessionTranscript({
    session: { id: 'session-1' },
    prompts: [prompt('event-1', 'submission-1', 'First')],
    snapshots: [first],
    generations,
  });
  assert.equal(page.exchanges.some((exchange) => exchange.assistant?.text.includes('private')), false);
  assert.equal(page.exchanges[0]?.activities.some((activity) => activity.name === 'session compacted'), true);
});

test('failed settlements project failed operation state', () => {
  const value = snapshot('session-1', 'submission-1', '');
  value.settlements = [{ submissionId: 'submission-1', outcome: 'failed', error: { message: 'model unavailable' } }];
  const page = projectSessionTranscript({
    session: { id: 'session-1' },
    prompts: [prompt('event-1', 'submission-1', 'Try it')],
    snapshots: [value],
  });
  assert.equal(page.exchanges[0]?.status, 'failed');
  assert.equal(page.exchanges[0]?.activities.at(-1)?.error, 'model unavailable');
});

test('tool-only assistant activity without settlement remains running', () => {
  const value = snapshot('session-1', 'submission-1', '');
  value.settlements = [];
  const page = projectSessionTranscript({
    session: { id: 'session-1' },
    prompts: [prompt('event-1', 'submission-1', 'Keep working')],
    snapshots: [value],
  });

  assert.equal(page.exchanges[0]?.status, 'running');
  assert.equal(page.exchanges[0]?.assistant, undefined);
  assert.equal(page.exchanges[0]?.activities.some((activity) => activity.kind === 'tool'), true);
});

test('hidden and diagnostic assistant messages never enter the public transcript', () => {
  const value = snapshot('session-1', 'submission-1', 'private diagnostic output');
  value.messages[0]!.display = 'diagnostic';
  const page = projectSessionTranscript({
    session: { id: 'session-1' },
    prompts: [prompt('event-1', 'submission-1', 'Public prompt')],
    snapshots: [value],
  });

  assert.equal(page.exchanges[0]?.prompt?.text, 'Public prompt');
  assert.equal(page.exchanges[0]?.assistant, undefined);
  assert.equal(JSON.stringify(page).includes('private diagnostic output'), false);
});

test('multiple compaction markers stay at their generation boundaries', () => {
  const first = snapshot('session-1', 'submission-1', 'First answer');
  appendCompaction(first, 'compact-1', 'first private summary');
  const second = snapshot('session-1-g1', 'submission-2', 'Second answer');
  appendCompaction(second, 'compact-2', 'second private summary');
  const third = snapshot('session-1-g2', 'submission-3', 'Third answer');
  const generations: ChatSessionGenerationRecord[] = [
    { sessionId: 'session-1', generation: 0, instanceId: 'session-1', createdAt: '2026-08-01T00:00:00.000Z' },
    {
      sessionId: 'session-1',
      generation: 1,
      instanceId: 'session-1-g1',
      continuationSummary: 'first private summary',
      compactionSubmissionId: 'compact-1',
      createdAt: '2026-08-01T00:01:00.000Z',
    },
    {
      sessionId: 'session-1',
      generation: 2,
      instanceId: 'session-1-g2',
      continuationSummary: 'second private summary',
      compactionSubmissionId: 'compact-2',
      createdAt: '2026-08-01T00:02:00.000Z',
    },
  ];
  const page = projectSessionTranscript({
    session: { id: 'session-1' },
    prompts: [
      prompt('event-1', 'submission-1', 'First'),
      prompt('event-2', 'submission-2', 'Second'),
      prompt('event-3', 'submission-3', 'Third'),
    ],
    snapshots: [first, second, third],
    generations,
  });

  assert.deepEqual(
    page.exchanges.map((exchange) => ({
      submissionId: exchange.submissionId,
      compactions: exchange.activities.filter((activity) => activity.name === 'session compacted').length,
    })),
    [
      { submissionId: 'submission-1', compactions: 1 },
      { submissionId: 'submission-2', compactions: 1 },
      { submissionId: 'submission-3', compactions: 0 },
    ],
  );
});

test('transcript cursor validates and pagination returns newest exchanges', () => {
  const cursor = { v: 1 as const, receivedAt: '2026-08-01T00:00:00.000Z', eventId: 'event-1' };
  assert.deepEqual(decodeTranscriptCursor(encodeTranscriptCursor(cursor)), cursor);
  assert.throws(() => decodeTranscriptCursor('bad'), TranscriptCursorError);
  const page = projectSessionTranscript({
    session: { id: 'session-1' },
    prompts: [
      prompt('event-1', 'submission-1', 'one'),
      prompt('event-2', 'submission-2', 'two'),
    ],
    snapshots: [
      snapshot('session-1', 'submission-1', 'one answer'),
      snapshot('session-1-g1', 'submission-2', 'two answer'),
    ],
    limit: 1,
  });
  assert.equal(page.exchanges[0]?.assistant?.text, 'two answer');
  assert.equal(page.page.hasOlder, true);
  assert.ok(page.page.before);
});

test('stream offset belongs to the active generation or resets when its snapshot is missing', () => {
  const generations: ChatSessionGenerationRecord[] = [
    {
      sessionId: 'session-1',
      generation: 0,
      instanceId: 'session-1',
      createdAt: '2026-08-01T00:00:00.000Z',
    },
    {
      sessionId: 'session-1',
      generation: 1,
      instanceId: 'session-1-g1-aabbccdd',
      createdAt: '2026-08-01T00:01:00.000Z',
    },
  ];
  const page = projectSessionTranscript({
    session: { id: 'session-1' },
    prompts: [prompt('event-1', 'submission-1', 'before compaction')],
    snapshots: [snapshot('session-1', 'submission-1', 'old generation answer')],
    generations,
  });

  assert.equal(page.stream.instanceId, 'session-1-g1-aabbccdd');
  assert.equal(page.stream.nextOffset, '-1');
});

test('backward transcript pages exclude assistants outside the prompt cursor window', async () => {
  const olderPrompt = prompt('event-1', 'submission-1', 'one');
  const newerPrompt = prompt('event-2', 'submission-2', 'two');
  const page = await loadSessionTranscriptPage({
    session: { id: 'session-1' },
    sessionDatabase: {
      getSessionNormalizedMessageEvent: () => newerPrompt,
      listNormalizedMessageEventsForSession: () => [olderPrompt],
    },
    snapshots: [
      snapshot('session-1', 'submission-1', 'one answer'),
      snapshot('session-1-g1', 'submission-2', 'two answer'),
    ],
    generations: [],
    limit: 1,
    before: encodeTranscriptCursor({
      v: 1,
      receivedAt: newerPrompt.event.receivedAt,
      eventId: newerPrompt.event.id,
    }),
  });

  assert.deepEqual(page.exchanges.map((exchange) => exchange.assistant?.text), [
    'one answer',
  ]);
});

function prompt(eventId: string, submissionId: string, text: string): SessionNormalizedMessageRecord {
  return {
    sessionId: 'session-1',
    event: {
      id: eventId,
      connector: 'web-api',
      kind: 'chat.message',
      text,
      receivedAt: `2026-08-01T00:00:0${eventId.endsWith('2') ? '2' : '1'}.000Z`,
      actor: { id: 'dan' },
      conversation: { id: 'conversation-1' },
    },
    delivery: { submissionId, instanceId: 'session-1' },
  };
}

function snapshot(
  conversationId: string,
  submissionId: string,
  answer: string,
): FlueConversationSnapshot {
  return {
    v: 1,
    conversationId,
    offset: '8',
    settlements: [{ submissionId, outcome: 'completed' }],
    messages: [{
      id: `${submissionId}-assistant`,
      role: 'assistant',
      purpose: 'assistant',
      display: 'visible',
      submissionId,
      parts: [
        { type: 'reasoning', text: 'checking context', state: 'done' },
        {
          type: 'dynamic-tool',
          toolName: 'load_protocols',
          toolCallId: `${submissionId}-tool`,
          state: 'output-available',
          input: {},
          output: { ok: true },
          durationMs: 10,
        },
        { type: 'text', text: answer, state: 'done' },
      ],
    }],
  };
}

function appendCompaction(
  value: FlueConversationSnapshot,
  submissionId: string,
  summary: string,
): void {
  value.messages.push({
    id: `${submissionId}-signal`,
    role: 'system',
    purpose: 'dispatch',
    display: 'hidden',
    submissionId,
    signal: { tagName: 'session_compaction' },
    parts: [{ type: 'text', text: 'compact', state: 'done' }],
  }, {
    id: `${submissionId}-assistant`,
    role: 'assistant',
    purpose: 'assistant',
    display: 'visible',
    submissionId,
    parts: [{ type: 'text', text: summary, state: 'done' }],
  });
  value.settlements.push({ submissionId, outcome: 'completed' });
}
