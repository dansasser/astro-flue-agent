import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  composeWorkspaceInstructions,
  resolveWorkspaceDirectory,
  resolveWorkspaceFilePath,
  workspaceFileOrder,
  type WorkspaceFileName,
} from '../workspace-loader.js';

test('workspace loader composes files in workspace order with section headers', () => {
  const dir = makeWorkspaceFixture();

  try {
    const instructions = composeWorkspaceInstructions({
      workspaceDir: dir,
      title: 'Test Workspace',
    });

    assert.match(instructions, /^# Test Workspace/);
    assert.ok(instructions.indexOf('## SECURITY.md') < instructions.indexOf('## AGENTS.md'));
    assert.ok(instructions.indexOf('## AGENTS.md') < instructions.indexOf('## IDENTITY.md'));
    assert.ok(instructions.includes('SECURITY.md content'));
    assert.ok(instructions.includes('HEARTBEAT.md content'));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('workspace loader reports missing workspace files clearly', () => {
  const dir = makeWorkspaceFixture();

  try {
    const missingFilePath = join(dir, 'TOOLS.md');
    rmSync(missingFilePath);

    assert.throws(
      () =>
        composeWorkspaceInstructions({
          workspaceDir: dir,
          title: 'Missing File Workspace',
        }),
      (error) =>
        error instanceof Error &&
        error.message.includes('Failed to read workspace file TOOLS.md') &&
        error.message.includes(missingFilePath),
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('workspace file resolution rejects paths outside the workspace directory', () => {
  const dir = makeWorkspaceFixture();

  try {
    assert.throws(
      () => resolveWorkspaceFilePath(dir, '../outside.md' as WorkspaceFileName),
      /outside workspace directory/,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('workspace directory resolver uses the explicitly detected source checkout', () => {
  const dir = mkdtempSync(join(tmpdir(), 'workspace-resolver-'));

  try {
    const sourceWorkspace = join(dir, 'src', 'engine', 'workers', 'researcher', 'workspace');
    const runtimeRoot = join(dir, '.gorombo');
    mkdirSync(sourceWorkspace, { recursive: true });
    mkdirSync(runtimeRoot, { recursive: true });
    writeFileSync(join(sourceWorkspace, '.keep'), '');

    assert.equal(
      resolveWorkspaceDirectory('workers/researcher/workspace', {
        runtimeRoot,
        sourceProjectRoot: dir,
      }),
      sourceWorkspace,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('workspace directory resolver falls back to packaged .gorombo runtime workspace', () => {
  const dir = mkdtempSync(join(tmpdir(), 'workspace-packaged-runtime-'));

  try {
    const packagedWorkspace = join(dir, '.gorombo', 'sim-one-alpha', 'workspace');
    mkdirSync(packagedWorkspace, { recursive: true });
    writeFileSync(join(packagedWorkspace, '.keep'), '');

    assert.equal(
      resolveWorkspaceDirectory('workspace', {
        runtimeRoot: join(dir, '.gorombo'),
        modulePath: join(packagedWorkspace, '..', 'server.mjs'),
      }),
      packagedWorkspace,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('packaged module ownership wins when source and packaged personas both exist', () => {
  const dir = mkdtempSync(join(tmpdir(), 'workspace-packaged-owner-'));

  try {
    const sourceWorkspace = join(dir, 'src', 'workspace');
    const runtimeRoot = join(dir, '.gorombo');
    const packagedWorkspace = join(runtimeRoot, 'sim-one-alpha', 'workspace');
    mkdirSync(sourceWorkspace, { recursive: true });
    mkdirSync(packagedWorkspace, { recursive: true });
    writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'sim-one-alpha' }));
    writeFileSync(join(sourceWorkspace, '.keep'), 'source');
    writeFileSync(join(packagedWorkspace, '.keep'), 'packaged');

    assert.equal(
      resolveWorkspaceDirectory('workspace', {
        runtimeRoot,
        modulePath: join(runtimeRoot, 'sim-one-alpha', 'server.mjs'),
      }),
      packagedWorkspace,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('workspace directory resolver ignores an unrelated caller workspace', () => {
  const dir = mkdtempSync(join(tmpdir(), 'workspace-packaged-precedence-'));

  try {
    const unrelatedWorkspace = join(dir, 'workspace');
    const packagedWorkspace = join(dir, '.gorombo', 'sim-one-alpha', 'workspace');
    mkdirSync(unrelatedWorkspace, { recursive: true });
    mkdirSync(packagedWorkspace, { recursive: true });
    writeFileSync(join(unrelatedWorkspace, '.keep'), '');
    writeFileSync(join(packagedWorkspace, '.keep'), '');

    assert.equal(
      resolveWorkspaceDirectory('workspace', {
        runtimeRoot: join(dir, '.gorombo'),
        modulePath: join(packagedWorkspace, '..', 'server.mjs'),
      }),
      packagedWorkspace,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('workspace directory resolver does not accept a caller-relative workspace fallback', () => {
  const dir = mkdtempSync(join(tmpdir(), 'workspace-runtime-root-'));

  try {
    const unrelatedWorkspace = join(dir, 'workers', 'researcher', 'workspace');
    const runtimeRoot = join(dir, '.gorombo');
    mkdirSync(unrelatedWorkspace, { recursive: true });
    mkdirSync(runtimeRoot, { recursive: true });
    writeFileSync(join(unrelatedWorkspace, '.keep'), '');

    assert.throws(
      () =>
        resolveWorkspaceDirectory('workers/researcher/workspace', {
          runtimeRoot,
          modulePath: join(runtimeRoot, 'sim-one-alpha', 'server.mjs'),
        }),
      /workspace directory not found/i,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

function makeWorkspaceFixture(): string {
  const dir = mkdtempSync(join(tmpdir(), 'workspace-loader-'));

  for (const fileName of workspaceFileOrder) {
    writeFileSync(join(dir, fileName), `# ${fileName}\n\n${fileName} content\n`);
  }

  return dir;
}
