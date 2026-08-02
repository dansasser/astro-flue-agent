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
