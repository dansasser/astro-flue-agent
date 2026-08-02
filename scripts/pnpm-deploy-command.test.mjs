import assert from 'node:assert/strict';
import test from 'node:test';
import { resolvePnpmDeployCommand } from './pnpm-deploy-command.mjs';

test('npm builds resolve the pinned pnpm deploy through npm exec', () => {
  const invocation = resolvePnpmDeployCommand({
    args: ['--prod', 'deploy', '/tmp/runtime'],
    npmExecPath: '/usr/lib/node_modules/npm/bin/npm-cli.js',
    packageManager: 'pnpm@10.10.0',
    execPath: '/usr/bin/node',
    platform: 'linux',
  });

  assert.equal(invocation.command, '/usr/bin/node');
  assert.deepEqual(invocation.args, [
    '/usr/lib/node_modules/npm/bin/npm-cli.js',
    'exec',
    '--yes',
    '--package=pnpm@10.10.0',
    '--',
    'pnpm',
    '--prod',
    'deploy',
    '/tmp/runtime',
  ]);
});

test('pnpm builds reuse the active package-manager executable', () => {
  const invocation = resolvePnpmDeployCommand({
    args: ['deploy'],
    npmExecPath: 'C:\\pnpm\\pnpm.cjs',
    packageManager: 'pnpm@10.10.0',
    execPath: 'C:\\node\\node.exe',
    platform: 'win32',
  });

  assert.equal(invocation.command, 'C:\\node\\node.exe');
  assert.deepEqual(invocation.args, ['C:\\pnpm\\pnpm.cjs', 'deploy']);
});
