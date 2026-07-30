import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findAbsolutePathOutsideWorkspace } from '../engine/workers/coding-worker/tools/sandbox-runtime.js';

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