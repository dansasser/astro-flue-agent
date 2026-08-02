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
