import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { createCapabilityStore } from '../engine/capabilities/capability-store.js';
import {
  createEmptyRuntimeCapabilitySnapshot,
  loadRuntimeCapabilitySnapshot,
} from '../engine/capabilities/runtime-capability-snapshot.js';
import type { CapabilityRecord } from '../engine/capabilities/types.js';

test('runtime snapshot loads promoted Flue 2 skills and MCP definitions from its runtime root', async () => {
  const fixture = createFixture();
  try {
    const skillRoot = join(fixture.runtimeRoot, 'capabilities', 'skills', 'fixture-skill');
    mkdirSync(skillRoot, { recursive: true });
    writeFileSync(
      join(skillRoot, 'SKILL.md'),
      '---\nname: fixture-skill\ndescription: Exercise the runtime skill loader.\n---\n\nFollow the fixture procedure.\n',
    );
    writeFileSync(join(skillRoot, 'REFERENCE.md'), '# Fixture reference\n');

    const store = createCapabilityStore({ env: fixture.env });
    try {
      store.insert(record({ id: 'fixture-skill', kind: 'skill' }));
      store.insert(record({
        id: 'fixture-mcp',
        kind: 'mcp',
        config: {
          mcpUrl: 'https://mcp.example.test/api',
          mcpTransport: 'streamable-http',
          mcpTokenEnv: 'GOROMBO_MCP_TOKEN',
        },
      }));
    } finally {
      store.close();
    }

    const snapshot = await loadRuntimeCapabilitySnapshot(fixture.env);
    assert.equal(snapshot.failures.length, 0);
    assert.equal(snapshot.skills.length, 1);
    const skill = snapshot.skills[0];
    assert.ok(skill && 'instructions' in skill);
    assert.equal(skill.name, 'fixture-skill');
    assert.match(skill.instructions, /fixture procedure/);
    assert.ok(skill.files?.['REFERENCE.md'] instanceof Uint8Array);

    assert.equal(snapshot.mcpConnections.length, 1);
    const connection = snapshot.mcpConnections[0];
    assert.equal(connection?.name, 'fixture-mcp');
    assert.equal(connection?.optional, true);
    assert.equal(
      typeof connection?.auth === 'function' ? await connection.auth() : connection?.auth,
      'fixture-token',
    );
    assert.doesNotMatch(JSON.stringify(connection), /fixture-token/);
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});

test('runtime snapshot reports a mismatched skill identity without mounting it', async () => {
  const fixture = createFixture();
  try {
    const skillRoot = join(fixture.runtimeRoot, 'capabilities', 'skills', 'registry-name');
    mkdirSync(skillRoot, { recursive: true });
    writeFileSync(
      join(skillRoot, 'SKILL.md'),
      '---\nname: different-name\ndescription: Invalid identity fixture.\n---\n\nDo not mount.\n',
    );
    const store = createCapabilityStore({ env: fixture.env });
    try {
      store.insert(record({ id: 'registry-name', kind: 'skill' }));
    } finally {
      store.close();
    }

    const snapshot = await loadRuntimeCapabilitySnapshot(fixture.env);
    assert.equal(snapshot.skills.length, 0);
    assert.equal(snapshot.failures.length, 1);
    assert.equal(snapshot.failures[0]?.kind, 'skill');
    assert.match(snapshot.failures[0]?.error ?? '', /does not match registry id/);
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});

test('runtime snapshot records a capability-store open failure and remains empty', async () => {
  const fixture = createFixture();
  try {
    const snapshot = await loadRuntimeCapabilitySnapshot({
      ...fixture.env,
      GOROMBO_CAPABILITY_DB_PATH: fixture.runtimeRoot,
    });

    assert.deepEqual(snapshot, createEmptyRuntimeCapabilitySnapshot(snapshot.failures));
    assert.equal(snapshot.failures.length, 1);
    assert.equal(snapshot.failures[0]?.kind, 'registry');
    assert.equal(snapshot.failures[0]?.id, 'capability-store');
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});

function createFixture(): {
  root: string;
  runtimeRoot: string;
  env: Record<string, unknown>;
} {
  const root = mkdtempSync(join(tmpdir(), 'sim-one-runtime-capabilities-'));
  const runtimeRoot = join(root, '.gorombo');
  mkdirSync(runtimeRoot, { recursive: true });
  return {
    root,
    runtimeRoot,
    env: {
      GOROMBO_RUNTIME_ROOT: runtimeRoot,
      GOROMBO_MCP_TOKEN: 'fixture-token',
    },
  };
}

function record(input: {
  id: string;
  kind: CapabilityRecord['kind'];
  config?: CapabilityRecord['config'];
}): CapabilityRecord {
  const now = new Date().toISOString();
  return {
    id: input.id,
    kind: input.kind,
    name: input.id,
    description: 'Runtime capability fixture.',
    source: 'local',
    sourceRef: 'fixture',
    version: 'fixture-v1',
    enabled: true,
    config: input.config ?? {},
    installedAt: now,
    updatedAt: now,
    installedBy: 'cli',
  };
}
