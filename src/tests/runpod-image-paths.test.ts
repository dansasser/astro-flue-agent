import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { resolveImageOutputDir } from '../engine/tools/runpod-image/paths.js';

test('image output stays inside the canonical runtime root', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'sim-one-image-paths-'));
  const runtimeRoot = join(fixture, '.gorombo');
  const previous = {
    runtimeRoot: process.env.GOROMBO_RUNTIME_ROOT,
    workspaceRoot: process.env.GOROMBO_WORKSPACE_ROOT,
    codingWorkspaceRoot: process.env.GOROMBO_CODING_WORKSPACE_ROOT,
    imageOutputDir: process.env.GOROMBO_IMAGE_OUTPUT_DIR,
  };

  try {
    process.env.GOROMBO_RUNTIME_ROOT = runtimeRoot;
    process.env.GOROMBO_WORKSPACE_ROOT = 'workspace-custom';
    delete process.env.GOROMBO_CODING_WORKSPACE_ROOT;
    delete process.env.GOROMBO_IMAGE_OUTPUT_DIR;
    assert.equal(
      resolveImageOutputDir(),
      join(runtimeRoot, 'workspace-custom', 'images'),
    );

    process.env.GOROMBO_WORKSPACE_ROOT = join(fixture, 'external-workspace');
    assert.throws(
      () => resolveImageOutputDir(),
      /must stay inside the GOROMBO runtime root/,
    );

    process.env.GOROMBO_WORKSPACE_ROOT = 'workspace-custom';
    process.env.GOROMBO_IMAGE_OUTPUT_DIR = join(fixture, 'external-images');
    assert.throws(
      () => resolveImageOutputDir(),
      /must stay inside the GOROMBO runtime root/,
    );
  } finally {
    restoreEnv('GOROMBO_RUNTIME_ROOT', previous.runtimeRoot);
    restoreEnv('GOROMBO_WORKSPACE_ROOT', previous.workspaceRoot);
    restoreEnv('GOROMBO_CODING_WORKSPACE_ROOT', previous.codingWorkspaceRoot);
    restoreEnv('GOROMBO_IMAGE_OUTPUT_DIR', previous.imageOutputDir);
    rmSync(fixture, { recursive: true, force: true });
  }
});

function restoreEnv(key: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[key];
  } else {
    process.env[key] = value;
  }
}
