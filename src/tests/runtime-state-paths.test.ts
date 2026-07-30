import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { SqliteProtocolProvider } from '../core/protocols/sqlite-protocol-provider.js';
import { createCapabilityStore } from '../engine/capabilities/capability-store.js';
import { materializeCapability } from '../engine/capabilities/skill-materializer.js';
import { GoromboStructuredMemoryDatabase } from '../engine/memory/structured-memory-database.js';
import { ScheduleStore } from '../engine/schedules/schedule-store.js';
import { GoromboSessionDatabase } from '../engine/session/session-database.js';
import {
  createDefaultResearchCache,
  type ResearchCache,
} from '../engine/workers/researcher/research/research-cache.js';

test('default mutable stores stay under one explicit runtime root from an unrelated cwd', async () => {
  const fixture = mkdtempSync(join(tmpdir(), 'sim-one-runtime-state-'));
  const runtimeRoot = join(fixture, 'relocated', '.gorombo');
  const launchDirectory = join(fixture, 'unrelated-launch-directory');
  const previousRoot = process.env.GOROMBO_RUNTIME_ROOT;
  const previousCwd = process.cwd();
  let researchCache: ResearchCache | undefined;

  try {
    mkdirSync(runtimeRoot, { recursive: true });
    mkdirSync(launchDirectory, { recursive: true });
    process.env.GOROMBO_RUNTIME_ROOT = runtimeRoot;
    process.chdir(launchDirectory);

    const capabilityStore = createCapabilityStore();
    capabilityStore.close();

    const protocolStore = new SqliteProtocolProvider();
    protocolStore.close();

    const structuredMemory = new GoromboStructuredMemoryDatabase();
    structuredMemory.close();

    const schedules = new ScheduleStore();
    schedules.close();

    const sessions = new GoromboSessionDatabase();
    sessions.close();

    researchCache = createDefaultResearchCache({
      GOROMBO_RUNTIME_ROOT: runtimeRoot,
      GOROMBO_RESEARCH_CACHE: 'sqlite',
    });
    await researchCache.close?.();
    researchCache = undefined;

    for (const fileName of [
      'capabilities.sqlite',
      'protocols.sqlite',
      'structured-memory.sqlite',
      'schedules.sqlite',
      'sessions.sqlite',
      'research-cache.sqlite',
    ]) {
      assert.equal(
        existsSync(join(runtimeRoot, 'db', fileName)),
        true,
        `${fileName} should be created under the relocated runtime root`,
      );
    }
    assert.equal(
      existsSync(join(launchDirectory, '.gorombo')),
      false,
      'caller cwd must not acquire runtime state',
    );
  } finally {
    await researchCache?.close?.();
    process.chdir(previousCwd);
    if (previousRoot === undefined) {
      delete process.env.GOROMBO_RUNTIME_ROOT;
    } else {
      process.env.GOROMBO_RUNTIME_ROOT = previousRoot;
    }
    rmSync(fixture, { recursive: true, force: true });
  }
});

test('relative local capability sources resolve from the runtime root', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'sim-one-runtime-capability-'));
  const runtimeRoot = join(fixture, '.gorombo');
  const sourceDirectory = join(runtimeRoot, 'incoming', 'sample-skill');
  const launchDirectory = join(fixture, 'caller');
  const previousCwd = process.cwd();

  try {
    mkdirSync(sourceDirectory, { recursive: true });
    mkdirSync(launchDirectory, { recursive: true });
    writeFileSync(join(sourceDirectory, 'SKILL.md'), '# Sample\n');
    process.chdir(launchDirectory);

    const now = new Date().toISOString();
    const result = materializeCapability({
      env: { GOROMBO_RUNTIME_ROOT: runtimeRoot },
      record: {
        id: 'sample-skill',
        kind: 'skill',
        name: 'Sample',
        description: 'Runtime-root fixture',
        source: 'local',
        sourceRef: 'incoming/sample-skill',
        version: null,
        enabled: true,
        config: {},
        installedAt: now,
        updatedAt: now,
        installedBy: 'cli',
      },
    });

    assert.equal(
      result.path,
      join(runtimeRoot, 'capabilities', 'skills', 'sample-skill'),
    );
    assert.equal(existsSync(join(result.path, 'SKILL.md')), true);
    assert.equal(existsSync(join(launchDirectory, 'capabilities')), false);
  } finally {
    process.chdir(previousCwd);
    rmSync(fixture, { recursive: true, force: true });
  }
});
