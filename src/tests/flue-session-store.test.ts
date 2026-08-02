import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { linkSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import type { GoromboConfig } from '../core/config/gorombo-config.js';
import { createGoromboPersistenceRuntime } from '../engine/session/session-persistence.js';

test('Flue 2 persistence exposes the public store bundle and leaves the beta database untouched', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'sim-one-flue-v2-'));
  const legacyPath = join(directory, 'flue.sqlite');
  const v2Path = join(directory, 'flue-v2.sqlite');
  writeFileSync(legacyPath, 'beta rollback archive');
  const before = hash(readFileSync(legacyPath));
  const runtime = createRuntime(directory);

  try {
    await runtime.adapter.migrate?.();
    const stores = await runtime.adapter.connect();
    assert.ok(stores.submissionStore);
    assert.ok(stores.conversationStreamStore);
    assert.ok(stores.attachmentStore);
    assert.equal(runtime.flueV2DatabasePath, v2Path);
    assert.equal(runtime.legacyFlueDatabasePath, legacyPath);
    assert.equal(hash(readFileSync(legacyPath)), before);
  } finally {
    await runtime.adapter.close?.();
    runtime.sessionDatabase.close();
    rmSync(directory, { recursive: true, force: true });
  }
});

test('Flue 2 and beta database paths cannot alias', () => {
  const directory = mkdtempSync(join(tmpdir(), 'sim-one-flue-alias-'));
  assert.throws(() => createGoromboPersistenceRuntime(config(directory, 'same.sqlite', 'same.sqlite')),
    /must not point to the legacy Flue database/);
  rmSync(directory, { recursive: true, force: true });
});

test('Flue 2 and beta databases reject symlink and hardlink aliases', () => {
  for (const aliasKind of ['symlink', 'hardlink'] as const) {
    const directory = mkdtempSync(join(tmpdir(), `sim-one-flue-${aliasKind}-`));
    try {
      const target = join(directory, 'target.sqlite');
      const alias = join(directory, 'alias.sqlite');
      writeFileSync(target, 'existing database');
      if (aliasKind === 'symlink') {
        symlinkSync('target.sqlite', alias);
      } else {
        linkSync(target, alias);
      }
      assert.throws(
        () => createGoromboPersistenceRuntime(config(directory, 'target.sqlite', 'alias.sqlite')),
        /must not point to the legacy Flue database/,
      );
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  }
});

test('Flue 2 and beta databases reject a dangling symlink alias', () => {
  const directory = mkdtempSync(join(tmpdir(), 'sim-one-flue-dangling-alias-'));
  try {
    symlinkSync('future.sqlite', join(directory, 'legacy.sqlite'));
    assert.throws(
      () => createGoromboPersistenceRuntime(config(directory, 'future.sqlite', 'legacy.sqlite')),
      /must not point to the legacy Flue database/,
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('product sessions keep stable ids while compaction rotates Flue runtime generations', () => {
  const directory = mkdtempSync(join(tmpdir(), 'sim-one-generations-'));
  const runtime = createRuntime(directory);
  let primaryClosed = false;
  try {
    runtime.sessionDatabase.ensureChatSession({ sessionId: 'tui-session', origin: 'tui' });
    const first = runtime.sessionDatabase.getActiveRuntimeGeneration('tui-session');
    assert.equal(first?.instanceId, 'tui-session');
    assert.equal(first?.generation, 0);

    const second = runtime.sessionDatabase.rotateRuntimeGeneration({
      sessionId: 'tui-session',
      expectedInstanceId: 'tui-session',
      continuationSummary: 'Keep the active implementation decisions.',
      compactionSubmissionId: 'submission-compact-1',
    });
    assert.equal(second.generation, 1);
    assert.match(second.instanceId, /^tui-session-g1-/);
    assert.equal(runtime.sessionDatabase.getChatSession('tui-session')?.sessionId, 'tui-session');
    assert.deepEqual(
      runtime.sessionDatabase.listRuntimeGenerations('tui-session').map((item) => item.generation),
      [0, 1],
    );
    assert.throws(() => runtime.sessionDatabase.rotateRuntimeGeneration({
      sessionId: 'tui-session',
      expectedInstanceId: 'tui-session',
      continuationSummary: 'stale writer',
      compactionSubmissionId: 'submission-compact-2',
    }), /generation changed/);

    runtime.sessionDatabase.close();
    primaryClosed = true;
    const reopened = createRuntime(directory);
    try {
      assert.equal(reopened.sessionDatabase.getChatSession('tui-session')?.sessionId, 'tui-session');
      assert.deepEqual(reopened.sessionDatabase.getActiveRuntimeGeneration('tui-session'), second);
    } finally {
      reopened.sessionDatabase.close();
    }
  } finally {
    if (!primaryClosed) runtime.sessionDatabase.close();
    rmSync(directory, { recursive: true, force: true });
  }
});

function createRuntime(directory: string) {
  return createGoromboPersistenceRuntime(config(directory, 'flue-v2.sqlite', 'flue.sqlite'));
}

function config(directory: string, v2: string, legacy: string): GoromboConfig {
  return {
    version: 1,
    models: { primary: 'test' },
    storage: {
      flueV2DatabasePath: join(directory, v2),
      flueDatabasePath: join(directory, legacy),
      sessionDatabasePath: join(directory, 'sessions.sqlite'),
      vectorStorePath: join(directory, 'vector'),
    },
  };
}

function hash(value: Buffer): string {
  return createHash('sha256').update(value).digest('hex');
}
