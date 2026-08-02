import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { GoromboSessionDatabase } from '../engine/session/session-database.js';

test('app-owned session memory remains searchable independently of Flue persistence', () => {
  const directory = mkdtempSync(join(tmpdir(), 'sim-one-session-memory-'));
  const database = new GoromboSessionDatabase(join(directory, 'sessions.sqlite'));
  try {
    const now = new Date().toISOString();
    database.recordSessionMemoryChunk({
      storageKey: 'memory-1',
      harnessName: 'product',
      sessionName: 'session-1',
      entryId: 'entry-1',
      kind: 'note',
      title: 'session note',
      content: 'remember this detail',
      tokenEstimate: 4,
      metadata: { source: 'test' },
      createdAt: now,
      updatedAt: now,
    });
    const results = database.searchSessionMemory({ text: 'remember', sessionId: 'session-1' });
    assert.equal(results[0]?.content, 'remember this detail');
  } finally {
    database.close();
    rmSync(directory, { recursive: true, force: true });
  }
});

test('Flue 2 conversation snapshots populate searchable session memory', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'sim-one-flue-v2-session-memory-'));
  const database = new GoromboSessionDatabase(join(directory, 'sessions.sqlite'));
  try {
    await database.indexFlueConversationSnapshot('session-v2', {
      v: 1,
      conversationId: 'session-v2-g1',
      offset: '4',
      settlements: [{ submissionId: 'submission-1', outcome: 'completed' }],
      messages: [{
        id: 'assistant-1',
        role: 'assistant',
        purpose: 'assistant',
        display: 'visible',
        submissionId: 'submission-1',
        parts: [{ type: 'text', text: 'The migration checkpoint is verified.', state: 'done' }],
      }],
    });

    const results = database.searchSessionMemory({
      text: 'migration checkpoint',
      sessionId: 'session-v2',
    });
    assert.equal(results[0]?.content, 'The migration checkpoint is verified.');
    assert.equal(results[0]?.role, 'assistant');
  } finally {
    database.close();
    rmSync(directory, { recursive: true, force: true });
  }
});

test('unchanged Flue snapshot offsets are indexed only once', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'sim-one-flue-v2-index-offset-'));
  let embeddingCalls = 0;
  const database = new GoromboSessionDatabase(join(directory, 'sessions.sqlite'), {
    embeddingClient: {
      embedBatch: async (values: string[]) => {
        embeddingCalls += 1;
        return values.map(() => [1, 0]);
      },
    } as never,
    vectorStore: {
      upsert: async () => {},
      delete: async () => {},
    } as never,
  });
  const value = {
    v: 1 as const,
    conversationId: 'session-offset-g1',
    offset: 'same-offset',
    settlements: [{ submissionId: 'submission-1', outcome: 'completed' as const }],
    messages: [{
      id: 'assistant-1',
      role: 'assistant' as const,
      purpose: 'assistant' as const,
      display: 'visible' as const,
      submissionId: 'submission-1',
      parts: [{ type: 'text' as const, text: 'Index this once.', state: 'done' as const }],
    }],
  };
  try {
    await database.indexFlueConversationSnapshot('session-offset', value);
    await database.indexFlueConversationSnapshot('session-offset', value);
    assert.equal(embeddingCalls, 1);
  } finally {
    database.close();
    rmSync(directory, { recursive: true, force: true });
  }
});

test('Flue snapshot indexing preserves prompts beyond one thousand events', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'sim-one-flue-v2-index-pages-'));
  const database = new GoromboSessionDatabase(join(directory, 'sessions.sqlite'));
  try {
    database.ensureChatSession({ sessionId: 'long-session', origin: 'tui' });
    for (let index = 0; index < 1_001; index += 1) {
      const suffix = String(index).padStart(4, '0');
      database.recordNormalizedMessageEvent({
        sessionId: 'long-session',
        deliveryKind: 'direct-agent',
        delivery: { instanceId: 'long-session' },
        event: {
          id: `event-${suffix}`,
          connector: 'tui',
          kind: 'chat.message',
          text: index === 0 ? 'oldest unique prompt phrase' : `prompt ${suffix}`,
          receivedAt: `2026-08-01T00:${String(Math.floor(index / 60)).padStart(2, '0')}:${String(index % 60).padStart(2, '0')}.000Z`,
          actor: { id: 'dan' },
          conversation: { id: 'long-conversation' },
        },
      });
    }
    await database.indexFlueConversationSnapshot('long-session', {
      v: 1,
      conversationId: 'long-session',
      offset: '1001',
      settlements: [],
      messages: [],
    });

    const results = database.searchSessionMemory({
      text: 'oldest unique prompt phrase',
      sessionId: 'long-session',
    });
    assert.equal(results.some((record) => record.content === 'oldest unique prompt phrase'), true);
  } finally {
    database.close();
    rmSync(directory, { recursive: true, force: true });
  }
});

test('incremental Flue snapshots preserve previously indexed assistant replies', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'sim-one-flue-v2-index-history-'));
  const database = new GoromboSessionDatabase(join(directory, 'sessions.sqlite'));
  try {
    await database.indexFlueConversationSnapshot('history-session', assistantSnapshot(
      'history-instance',
      'offset-1',
      'assistant-1',
      'First durable assistant answer.',
    ));
    await database.indexFlueConversationSnapshot('history-session', assistantSnapshot(
      'history-instance',
      'offset-2',
      'assistant-2',
      'Second durable assistant answer.',
    ));

    assert.equal(database.searchSessionMemory({
      text: 'first durable assistant',
      sessionId: 'history-session',
    }).some((record) => record.content === 'First durable assistant answer.'), true);
    assert.equal(database.searchSessionMemory({
      text: 'second durable assistant',
      sessionId: 'history-session',
    }).some((record) => record.content === 'Second durable assistant answer.'), true);
  } finally {
    database.close();
    rmSync(directory, { recursive: true, force: true });
  }
});

function assistantSnapshot(
  conversationId: string,
  offset: string,
  messageId: string,
  text: string,
) {
  return {
    v: 1 as const,
    conversationId,
    offset,
    settlements: [{ submissionId: messageId, outcome: 'completed' as const }],
    messages: [{
      id: messageId,
      role: 'assistant' as const,
      purpose: 'assistant' as const,
      display: 'visible' as const,
      submissionId: messageId,
      parts: [{ type: 'text' as const, text, state: 'done' as const }],
    }],
  };
}
