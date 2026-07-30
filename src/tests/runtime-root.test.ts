import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import {
  createGoromboRuntimePaths,
  resolveGoromboRuntimeRoot,
  resolveRuntimePath,
} from '../core/config/runtime-root.js';

test('explicit absolute GOROMBO_RUNTIME_ROOT wins over the packaged owner', () => {
  const fixture = makeRuntimeFixture();
  const explicitRoot = join(fixture, 'explicit', '.gorombo');
  const packagedModule = join(fixture, 'package-owner', '.gorombo', 'sim-one-alpha', 'server.mjs');

  try {
    mkdirSync(explicitRoot, { recursive: true });
    mkdirSync(join(packagedModule, '..'), { recursive: true });
    writeFileSync(packagedModule, '');

    assert.equal(
      resolveGoromboRuntimeRoot({
        env: { GOROMBO_RUNTIME_ROOT: explicitRoot },
        modulePath: packagedModule,
      }),
      resolve(explicitRoot),
    );
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test('packaged module ownership resolves the movable .gorombo tree', () => {
  const fixture = makeRuntimeFixture();
  const runtimeRoot = join(fixture, 'installed-anywhere', '.gorombo');
  const packagedModule = join(runtimeRoot, 'sim-one-alpha', 'server.mjs');

  try {
    mkdirSync(join(packagedModule, '..'), { recursive: true });
    writeFileSync(packagedModule, '');

    assert.equal(
      resolveGoromboRuntimeRoot({ env: {}, modulePath: packagedModule }),
      resolve(runtimeRoot),
    );
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test('source checkout detection selects the checkout-local .gorombo tree', () => {
  const fixture = makeRuntimeFixture();
  const sourceModule = join(fixture, 'src', 'core', 'config', 'runtime-root.ts');

  try {
    mkdirSync(join(sourceModule, '..'), { recursive: true });
    writeFileSync(
      join(fixture, 'package.json'),
      JSON.stringify({ name: 'sim-one-alpha', type: 'module' }),
    );
    writeFileSync(sourceModule, '');

    assert.equal(
      resolveGoromboRuntimeRoot({ env: {}, modulePath: sourceModule }),
      resolve(fixture, '.gorombo'),
    );
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test('runtime layout separates packaged persona, mutable workspace, and service state', () => {
  const fixture = makeRuntimeFixture();
  const runtimeRoot = join(fixture, '.gorombo');

  try {
    mkdirSync(runtimeRoot);
    const paths = createGoromboRuntimePaths(runtimeRoot);

    assert.equal(paths.runtimeRoot, resolve(runtimeRoot));
    assert.equal(paths.packagedServer, join(resolve(runtimeRoot), 'sim-one-alpha'));
    assert.equal(paths.personaWorkspace, join(resolve(runtimeRoot), 'sim-one-alpha', 'workspace'));
    assert.equal(paths.codingWorkspace, join(resolve(runtimeRoot), 'workspace'));
    assert.equal(paths.codingWorkerState, join(resolve(runtimeRoot), 'coding-worker'));
    assert.equal(paths.databases, join(resolve(runtimeRoot), 'db'));
    assert.equal(paths.approvals, join(resolve(runtimeRoot), 'approvals'));
    assert.equal(paths.capabilities, join(resolve(runtimeRoot), 'capabilities'));
    assert.equal(
      paths.environmentConfig,
      join(resolve(runtimeRoot), 'sim-one.config'),
    );
    assert.equal(
      paths.environmentConfigExample,
      join(resolve(runtimeRoot), 'sim-one.config.example'),
    );
    assert.equal(paths.config, join(resolve(runtimeRoot), 'gorombo.config.json'));
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test('relative operational paths resolve inside runtime root and cannot escape it', () => {
  const fixture = makeRuntimeFixture();
  const runtimeRoot = join(fixture, '.gorombo');
  const absoluteOverride = join(fixture, 'external', 'custom.sqlite');

  try {
    mkdirSync(runtimeRoot);

    assert.equal(
      resolveRuntimePath('db/sessions.sqlite', { runtimeRoot }),
      join(resolve(runtimeRoot), 'db', 'sessions.sqlite'),
    );
    assert.equal(
      resolveRuntimePath(absoluteOverride, { runtimeRoot }),
      resolve(absoluteOverride),
    );
    assert.throws(
      () => resolveRuntimePath('../outside.sqlite', { runtimeRoot }),
      /outside the GOROMBO runtime root/,
    );
    assert.throws(
      () => resolveRuntimePath('.gorombo/db/nested.sqlite', { runtimeRoot }),
      /must not include a nested \.gorombo segment/,
    );
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test('invalid explicit roots fail closed instead of falling back to HOME or cwd', () => {
  assert.throws(
    () =>
      resolveGoromboRuntimeRoot({
        env: { GOROMBO_RUNTIME_ROOT: 'relative/.gorombo' },
        modulePath: '/unowned/server.mjs',
      }),
    /GOROMBO_RUNTIME_ROOT must be absolute/,
  );
  assert.throws(
    () =>
      resolveGoromboRuntimeRoot({
        env: { GOROMBO_RUNTIME_ROOT: '/tmp/not-the-runtime-root' },
        modulePath: '/unowned/server.mjs',
      }),
    /must end in \.gorombo/,
  );
  assert.throws(
    () => resolveGoromboRuntimeRoot({ env: {}, modulePath: '/unowned/server.mjs' }),
    /Could not resolve the GOROMBO runtime root/,
  );
});

function makeRuntimeFixture(): string {
  return mkdtempSync(join(tmpdir(), 'sim-one-runtime-root-'));
}
