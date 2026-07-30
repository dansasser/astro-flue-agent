import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  createFlueLocalCodingSandbox,
  findAbsolutePathOutsideWorkspace,
} from '../engine/workers/coding-worker/tools/sandbox-runtime.js';
import { resolveCodingWorkerWorkspaceRoot } from '../engine/workers/coding-worker/coding-worker.js';

test('findAbsolutePathOutsideWorkspace: rejects absolute path outside workspace root', () => {
  const result = findAbsolutePathOutsideWorkspace(
    'mkdir -p /home/user/repos/test',
    '/root/.gorombo/workspace',
  );
  assert.equal(result, '/home/user/repos/test');
});

test('findAbsolutePathOutsideWorkspace: allows relative paths', () => {
  const result = findAbsolutePathOutsideWorkspace(
    'mkdir -p repos/test',
    '/root/.gorombo/workspace',
  );
  assert.equal(result, null);
});

test('findAbsolutePathOutsideWorkspace: allows absolute path inside workspace root', () => {
  const result = findAbsolutePathOutsideWorkspace(
    'ls /root/.gorombo/workspace/repos/test',
    '/root/.gorombo/workspace',
  );
  assert.equal(result, null);
});

test('findAbsolutePathOutsideWorkspace: rejects /tmp path', () => {
  const result = findAbsolutePathOutsideWorkspace(
    'echo hello > /tmp/outside.txt',
    '/root/.gorombo/workspace',
  );
  assert.equal(result, '/tmp/outside.txt');
});

test('findAbsolutePathOutsideWorkspace: allows no path', () => {
  const result = findAbsolutePathOutsideWorkspace(
    'echo hello',
    '/root/.gorombo/workspace',
  );
  assert.equal(result, null);
});

test('findAbsolutePathOutsideWorkspace: catches path after semicolon', () => {
  const result = findAbsolutePathOutsideWorkspace(
    'echo hi; cat /etc/passwd',
    '/root/.gorombo/workspace',
  );
  assert.equal(result, '/etc/passwd');
});

test('coding workspace persists across sandbox recreation under a relocated runtime root', async () => {
  const fixture = mkdtempSync(join(tmpdir(), 'coding-workspace-persistence-'));
  const runtimeRoot = join(fixture, 'portable-install', '.gorombo');
  const sourceWorkspace = join(fixture, 'source', 'src', 'workspace');
  const packagedPersonaWorkspace = join(runtimeRoot, 'sim-one-alpha', 'workspace');
  const workspaceRoot = resolveCodingWorkerWorkspaceRoot({
    GOROMBO_RUNTIME_ROOT: runtimeRoot,
  });
  const relativeProbe = 'repos/handoffs/todos/persistence-probe.md';
  const content = 'persistent coding workspace probe\n';

  try {
    const firstSandbox = await createFlueLocalCodingSandbox({ workspaceRoot });
    await firstSandbox.writeWorkspaceFile(relativeProbe, content);

    assert.equal(
      readFileSync(join(workspaceRoot, relativeProbe), 'utf8'),
      content,
    );

    const restartedSandbox = await createFlueLocalCodingSandbox({ workspaceRoot });
    assert.equal(await restartedSandbox.readWorkspaceFile(relativeProbe), content);
    assert.equal(existsSync(join(sourceWorkspace, 'repos')), false);
    assert.equal(existsSync(join(packagedPersonaWorkspace, 'repos')), false);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});
