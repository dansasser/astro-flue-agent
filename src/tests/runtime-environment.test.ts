import assert from 'node:assert/strict';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { parseEnv } from 'node:util';
import {
  applyRuntimeEnvironmentFile,
  initializeRuntimeEnvironment,
  migrateRuntimeEnvironmentFile,
  resolveRuntimeEnvironmentConfigPath,
  runtimeEnvironmentDefinitions,
  runtimeEnvironmentStatus,
} from '../core/config/runtime-environment.js';

test('canonical runtime configuration overrides registered shell keys without exposing secrets', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'sim-one-runtime-environment-'));
  const configPath = join(fixture, 'sim-one.config');
  const targetEnv: Record<string, string | undefined> = {
    OLLAMA_API_KEY: 'shell-secret',
    GOROMBO_WEB_SEARCH_TIMEOUT_MS: '7000',
    GOROMBO_TEST_MODE: '1',
    PATH: '/test/bin',
  };

  try {
    writeFileSync(
      configPath,
      [
        'OLLAMA_API_KEY=file-secret',
        'GOROMBO_WEB_SEARCH_TIMEOUT_MS=9000',
        'TELEGRAM_APPROVED_USER_IDS=1001,1002',
        '',
      ].join('\n'),
      { mode: 0o600 },
    );

    const result = applyRuntimeEnvironmentFile(configPath, targetEnv);

    assert.equal(result.configPath, configPath);
    assert.deepEqual(result.configuredKeys, [
      'OLLAMA_API_KEY',
      'OLLAMA_WEB_SEARCH_TIMEOUT_MS',
      'TELEGRAM_APPROVED_USER_IDS',
    ]);
    assert.deepEqual(result.deprecatedAliases, ['GOROMBO_WEB_SEARCH_TIMEOUT_MS']);
    assert.equal(targetEnv.OLLAMA_API_KEY, 'file-secret');
    assert.equal(targetEnv.OLLAMA_WEB_SEARCH_TIMEOUT_MS, '9000');
    assert.equal(targetEnv.GOROMBO_WEB_SEARCH_TIMEOUT_MS, undefined);
    assert.equal(targetEnv.TELEGRAM_APPROVED_USER_IDS, '1001,1002');
    assert.equal(targetEnv.GOROMBO_TEST_MODE, '1');
    assert.equal(targetEnv.PATH, '/test/bin');

    const status = runtimeEnvironmentStatus(result);
    const ollama = status.find((entry) => entry.key === 'OLLAMA_API_KEY');
    assert.deepEqual(ollama, {
      key: 'OLLAMA_API_KEY',
      configured: true,
      secret: true,
      source: 'sim-one.config',
    });
    assert.doesNotMatch(JSON.stringify(status), /file-secret|shell-secret/);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test('canonical runtime configuration rejects unknown and invalid keys without echoing values', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'sim-one-runtime-environment-'));
  const configPath = join(fixture, 'sim-one.config');

  try {
    writeFileSync(configPath, 'OLLAMA_API_KEE=do-not-echo\n', { mode: 0o600 });
    assert.throws(
      () => applyRuntimeEnvironmentFile(configPath, {}),
      (error: unknown) =>
        error instanceof Error &&
        /Unknown SIM-ONE runtime configuration key: OLLAMA_API_KEE/.test(error.message) &&
        !error.message.includes('do-not-echo'),
    );

    writeFileSync(configPath, 'GOROMBO_WEB_SEARCH_TIMEOUT_MS=not-a-number\n', {
      mode: 0o600,
    });
    assert.throws(
      () => applyRuntimeEnvironmentFile(configPath, {}),
      (error: unknown) =>
        error instanceof Error &&
        /OLLAMA_WEB_SEARCH_TIMEOUT_MS must be a positive integer/.test(error.message) &&
        !error.message.includes('not-a-number'),
    );
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test('tracked example contains exactly the typed owner configuration registry', () => {
  const examplePath = resolve('sim-one.config.example');
  const parsed = parseEnv(readFileSync(examplePath, 'utf8'));
  const expectedKeys = runtimeEnvironmentDefinitions
    .map((definition) => definition.key)
    .sort();

  assert.deepEqual(Object.keys(parsed).sort(), expectedKeys);
  for (const definition of runtimeEnvironmentDefinitions) {
    if (definition.secret) {
      assert.equal(parsed[definition.key], '');
    }
  }
  for (const unsupported of [
    'OPENAI_API_KEY',
    'TAVILY_API_KEY',
    'BRAVE_SEARCH_API_KEY',
    'JINA_API_KEY',
    'GOROMBO_RUNTIME_ROOT',
    'GOROMBO_TEST_MODE',
    'PORT',
  ]) {
    assert.equal(unsupported in parsed, false);
  }
});

test('source and packaged modules resolve only their owning canonical configuration', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'sim-one-runtime-resolution-'));
  const sourceRoot = join(fixture, 'source');
  const sourceModule = join(sourceRoot, 'src', 'app.ts');
  const runtimeRoot = join(fixture, '.gorombo');
  const packagedModule = join(runtimeRoot, 'sim-one-alpha', 'server.mjs');

  try {
    mkdirSync(join(sourceRoot, 'src'), { recursive: true });
    writeFileSync(
      join(sourceRoot, 'package.json'),
      JSON.stringify({ name: 'sim-one-alpha' }),
    );
    writeFileSync(sourceModule, '');
    mkdirSync(join(runtimeRoot, 'sim-one-alpha'), { recursive: true });
    writeFileSync(packagedModule, '');

    assert.equal(
      resolveRuntimeEnvironmentConfigPath({
        env: {},
        modulePath: sourceModule,
      }),
      join(sourceRoot, 'sim-one.config'),
    );
    assert.equal(
      resolveRuntimeEnvironmentConfigPath({
        env: { GOROMBO_RUNTIME_ROOT: runtimeRoot },
        modulePath: packagedModule,
      }),
      join(runtimeRoot, 'sim-one.config'),
    );
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test('runtime initialization fails clearly without canonical config and never falls back to .env', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'sim-one-runtime-missing-'));
  const runtimeRoot = join(fixture, '.gorombo');
  const packagedModule = join(runtimeRoot, 'sim-one-alpha', 'server.mjs');
  const targetEnv: Record<string, string | undefined> = {
    GOROMBO_RUNTIME_ROOT: runtimeRoot,
    OLLAMA_API_KEY: 'shell-only-secret',
  };

  try {
    mkdirSync(join(runtimeRoot, 'sim-one-alpha'), { recursive: true });
    writeFileSync(packagedModule, '');
    writeFileSync(join(runtimeRoot, '.env'), 'OLLAMA_API_KEY=legacy-secret\n', {
      mode: 0o600,
    });

    assert.throws(
      () =>
        initializeRuntimeEnvironment({
          env: targetEnv,
          modulePath: packagedModule,
        }),
      (error: unknown) =>
        error instanceof Error &&
        error.message.includes(join(runtimeRoot, 'sim-one.config')) &&
        error.message.includes(join(runtimeRoot, 'sim-one.config.example')) &&
        !error.message.includes('shell-only-secret') &&
        !error.message.includes('legacy-secret'),
    );
    assert.equal(targetEnv.OLLAMA_API_KEY, 'shell-only-secret');
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test('test mode keeps command-scoped fixture environment separate from production loading', () => {
  const targetEnv: Record<string, string | undefined> = {
    GOROMBO_TEST_MODE: '1',
    OLLAMA_API_KEY: 'test-fixture-key',
  };

  assert.equal(initializeRuntimeEnvironment({ env: targetEnv }), undefined);
  assert.equal(targetEnv.OLLAMA_API_KEY, 'test-fixture-key');
});

test('application bootstraps canonical configuration before runtime consumers', () => {
  const appSource = readFileSync(resolve('src/app.ts'), 'utf8');
  const bootstrapImport = appSource.indexOf(
    "import './core/config/runtime-environment-bootstrap.js';",
  );
  const modelImport = appSource.indexOf("import './core/models/runtime.js';");
  const scheduleImport = appSource.indexOf(
    "import './engine/schedules/boot.js';",
  );

  assert.ok(bootstrapImport >= 0);
  assert.ok(modelImport > bootstrapImport);
  assert.ok(scheduleImport > bootstrapImport);
});

test('legacy environment migration is atomic, filtered, canonical, and owner-only', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'sim-one-runtime-migration-'));
  const sourcePath = join(fixture, '.env');
  const targetPath = join(fixture, 'sim-one.config');

  try {
    writeFileSync(
      sourcePath,
      [
        'OLLAMA_API_KEY=migration-secret',
        'GOROMBO_WEB_SEARCH_TIMEOUT_MS=9100',
        'OPENAI_API_KEY=unsupported-secret',
        'GOROMBO_RUNTIME_ROOT=/not-owner-config',
        '',
      ].join('\n'),
      { mode: 0o600 },
    );

    const result = migrateRuntimeEnvironmentFile({
      sourcePath,
      targetPath,
      examplePath: resolve('sim-one.config.example'),
    });
    const parsed = parseEnv(readFileSync(targetPath, 'utf8'));

    assert.deepEqual(result.migratedKeys, [
      'OLLAMA_API_KEY',
      'OLLAMA_WEB_SEARCH_TIMEOUT_MS',
    ]);
    assert.deepEqual(result.deprecatedAliases, [
      'GOROMBO_WEB_SEARCH_TIMEOUT_MS',
    ]);
    assert.deepEqual(result.ignoredKeys, [
      'GOROMBO_RUNTIME_ROOT',
      'OPENAI_API_KEY',
    ]);
    assert.equal(parsed.OLLAMA_API_KEY, 'migration-secret');
    assert.equal(parsed.OLLAMA_WEB_SEARCH_TIMEOUT_MS, '9100');
    assert.equal('GOROMBO_WEB_SEARCH_TIMEOUT_MS' in parsed, false);
    assert.equal('OPENAI_API_KEY' in parsed, false);
    assert.deepEqual(
      Object.keys(parsed).sort(),
      runtimeEnvironmentDefinitions.map((definition) => definition.key).sort(),
    );
    assert.equal(statSync(targetPath).mode & 0o777, 0o600);
    assert.doesNotMatch(
      JSON.stringify(result),
      /migration-secret|unsupported-secret/,
    );
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});
