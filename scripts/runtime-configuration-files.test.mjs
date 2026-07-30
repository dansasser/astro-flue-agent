import assert from 'node:assert/strict';
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import {
  copyRuntimeEnvironmentFiles,
  createSanitizedRuntimeEnvironment,
  deprecatedRuntimeEnvironmentAliases,
  loadScriptRuntimeEnvironment,
  selectFlueRuntimeEnvironmentFile,
} from './runtime-configuration-files.mjs';

test('local runtime copy always ships the example and copies owner config mode 0600', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'sim-one-config-copy-'));
  const sourceRoot = join(fixture, 'source');
  const runtimeRoot = join(fixture, '.gorombo');

  try {
    mkdirSync(sourceRoot, { recursive: true });
    writeFileSync(join(sourceRoot, 'sim-one.config.example'), 'API_SECRET=\n');
    writeFileSync(join(sourceRoot, 'sim-one.config'), 'API_SECRET=owner\n', {
      mode: 0o644,
    });

    const result = copyRuntimeEnvironmentFiles({ sourceRoot, runtimeRoot });

    assert.deepEqual(result, { exampleCopied: true, ownerCopied: true });
    assert.equal(
      readFileSync(join(runtimeRoot, 'sim-one.config.example'), 'utf8'),
      'API_SECRET=\n',
    );
    assert.equal(
      readFileSync(join(runtimeRoot, 'sim-one.config'), 'utf8'),
      'API_SECRET=owner\n',
    );
    assert.equal(statSync(join(runtimeRoot, 'sim-one.config')).mode & 0o777, 0o600);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test('local runtime copy removes a stale owner file when source owner config is absent', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'sim-one-config-copy-'));
  const sourceRoot = join(fixture, 'source');
  const runtimeRoot = join(fixture, '.gorombo');

  try {
    mkdirSync(sourceRoot, { recursive: true });
    mkdirSync(runtimeRoot, { recursive: true });
    writeFileSync(join(sourceRoot, 'sim-one.config.example'), 'API_SECRET=\n');
    writeFileSync(join(runtimeRoot, 'sim-one.config'), 'API_SECRET=stale\n');

    const result = copyRuntimeEnvironmentFiles({ sourceRoot, runtimeRoot });

    assert.deepEqual(result, { exampleCopied: true, ownerCopied: false });
    assert.equal(existsSync(join(runtimeRoot, 'sim-one.config')), false);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test('Flue invocation strips registered shell values and selects only canonical files', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'sim-one-config-flue-'));
  const sourceRoot = join(fixture, 'source');
  const examplePath = join(sourceRoot, 'sim-one.config.example');
  const ownerPath = join(sourceRoot, 'sim-one.config');

  try {
    mkdirSync(sourceRoot, { recursive: true });
    writeFileSync(
      examplePath,
      'OLLAMA_API_KEY=\nGOROMBO_WORKSPACE_ROOT=\n',
    );

    assert.equal(
      selectFlueRuntimeEnvironmentFile({ sourceRoot, allowExample: true }),
      examplePath,
    );
    assert.throws(
      () =>
        selectFlueRuntimeEnvironmentFile({
          sourceRoot,
          allowExample: false,
        }),
      /sim-one\.config/,
    );

    writeFileSync(ownerPath, 'OLLAMA_API_KEY=owner\n', { mode: 0o600 });
    assert.equal(
      selectFlueRuntimeEnvironmentFile({ sourceRoot, allowExample: false }),
      ownerPath,
    );

    const sanitized = createSanitizedRuntimeEnvironment({
      sourceRoot,
      env: {
        OLLAMA_API_KEY: 'shell-secret',
        GOROMBO_WORKSPACE_ROOT: 'shell-workspace',
        GOROMBO_CAPABILITY_DIR: 'shell-capabilities',
        GOROMBO_TEST_MODE: '1',
        PATH: '/test/bin',
      },
    });
    assert.equal(sanitized.OLLAMA_API_KEY, undefined);
    assert.equal(sanitized.GOROMBO_WORKSPACE_ROOT, undefined);
    assert.equal(sanitized.GOROMBO_CAPABILITY_DIR, undefined);
    assert.equal(sanitized.GOROMBO_TEST_MODE, '1');
    assert.equal(sanitized.PATH, '/test/bin');
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test('source scripts replace registered shell settings from sim-one.config', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'sim-one-config-script-'));
  const sourceRoot = join(fixture, 'source');
  const env = {
    API_SECRET: 'shell-secret',
    GOROMBO_PROTOCOL_DB_PATH: 'shell.sqlite',
    GOROMBO_CAPABILITY_DIR: 'shell-capabilities',
    PATH: '/test/bin',
  };

  try {
    mkdirSync(sourceRoot, { recursive: true });
    writeFileSync(
      join(sourceRoot, 'sim-one.config.example'),
      'API_SECRET=\nGOROMBO_PROTOCOL_DB_PATH=\n',
    );
    writeFileSync(
      join(sourceRoot, 'sim-one.config'),
      'API_SECRET=file-secret\nGOROMBO_PROTOCOL_DB_PATH=db/protocols.sqlite\n',
      { mode: 0o600 },
    );

    const result = loadScriptRuntimeEnvironment({ sourceRoot, env });
    assert.deepEqual(result.configuredKeys, [
      'API_SECRET',
      'GOROMBO_PROTOCOL_DB_PATH',
    ]);
    assert.equal(env.API_SECRET, 'file-secret');
    assert.equal(env.GOROMBO_PROTOCOL_DB_PATH, 'db/protocols.sqlite');
    assert.equal(env.GOROMBO_CAPABILITY_DIR, undefined);
    assert.equal(env.PATH, '/test/bin');

    writeFileSync(
      join(sourceRoot, 'sim-one.config'),
      'UNKNOWN_OWNER_KEY=hidden\n',
      { mode: 0o600 },
    );
    assert.throws(
      () => loadScriptRuntimeEnvironment({ sourceRoot, env }),
      /UNKNOWN_OWNER_KEY/,
    );
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test('CI builds the Ratatui product smoke with canonical owner configuration', () => {
  const workflow = readFileSync(resolve('.github/workflows/ci.yml'), 'utf8');
  const ratatuiStep = workflow.match(
    /      - name: Ratatui TUI product smoke\n[\s\S]*?(?=\n      - name: )/,
  )?.[0];

  assert.match(workflow, /- name: Create CI runtime configuration/);
  assert.match(workflow, /printf 'OLLAMA_API_KEY=%s\\n'/);
  assert.match(workflow, /chmod 600 sim-one\.config/);
  assert.ok(ratatuiStep, 'Ratatui product smoke step is missing');
  assert.doesNotMatch(ratatuiStep, /GOROMBO_TEST_MODE/);
});

test('script sanitization covers every documented compatibility alias', () => {
  assert.deepEqual(
    [...deprecatedRuntimeEnvironmentAliases].sort(),
    [
      'GOROMBO_CAPABILITY_DIR',
      'GOROMBO_CODING_REPO_PATH',
      'GOROMBO_CODING_WORKSPACE_ROOT',
      'GOROMBO_WEB_SEARCH_TIMEOUT_MS',
    ],
  );
});
