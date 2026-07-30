import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createFlueLocalCodingSandbox } from '../engine/workers/coding-worker/tools/sandbox-runtime.js';
import { resolveCodingWorkerWorkspaceRoot } from '../engine/workers/coding-worker/coding-worker.js';

test('coding shell cannot read runtime-owner files through traversal, quoting, or symlinks', async () => {
  const fixture = mkdtempSync(join(tmpdir(), 'coding-workspace-confinement-'));
  const runtimeRoot = join(fixture, '.gorombo');
  const workspaceRoot = join(runtimeRoot, 'workspace');
  const configPath = join(runtimeRoot, 'sim-one.config');
  const secret = 'OLLAMA_API_KEY=must-not-leak';

  try {
    mkdirSync(workspaceRoot, { recursive: true });
    writeFileSync(configPath, `${secret}\n`, { mode: 0o600 });
    writeFileSync(join(workspaceRoot, 'probe.js'), "console.log('workspace-ok');\n");
    symlinkSync(configPath, join(workspaceRoot, 'config-link'));
    const askpassPath = join(runtimeRoot, 'auth', 'github', 'git-askpass.mjs');
    mkdirSync(join(runtimeRoot, 'auth', 'github'), { recursive: true });
    writeFileSync(
      askpassPath,
      "#!/usr/bin/env node\nconsole.log('askpass-ok');\n",
      { mode: 0o700 },
    );

    const sandbox = await createFlueLocalCodingSandbox({
      workspaceRoot,
      targetKind: 'workspace',
    });
    const allowed = await sandbox.exec('node probe.js');
    assert.equal(allowed.exitCode, 0);
    assert.match(allowed.stdout, /workspace-ok/);

    const approvedHelper = await sandbox.execFile(askpassPath, [], {
      env: { GIT_ASKPASS: askpassPath },
    });
    assert.equal(approvedHelper.exitCode, 0);
    assert.match(approvedHelper.stdout, /askpass-ok/);

    for (const command of [
      'cat ../sim-one.config',
      `cat "${configPath}"`,
      'cat config-link',
    ]) {
      const blocked = await sandbox.exec(command);
      assert.notEqual(blocked.exitCode, 0, command);
      assert.doesNotMatch(`${blocked.stdout}\n${blocked.stderr}`, /must-not-leak/);
    }
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
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
