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
