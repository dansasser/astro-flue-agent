import assert from 'node:assert/strict';
import { join } from 'node:path';
import test from 'node:test';
import {
  resolveScriptRuntimePath,
  resolveScriptRuntimeRoot,
} from './runtime-root.mjs';

test('script runtime paths follow an explicit relocatable root', () => {
  const runtimeRoot = join('/tmp', 'sim-one-script-runtime', '.gorombo');
  const env = { GOROMBO_RUNTIME_ROOT: runtimeRoot };

  assert.equal(resolveScriptRuntimeRoot(env), runtimeRoot);
  assert.equal(
    resolveScriptRuntimePath('db/protocols.sqlite', env),
    join(runtimeRoot, 'db', 'protocols.sqlite'),
  );
});

test('script runtime paths reject nested roots and traversal', () => {
  const env = { GOROMBO_RUNTIME_ROOT: '/tmp/sim-one-script-runtime/.gorombo' };

  assert.throws(
    () => resolveScriptRuntimePath('.gorombo/db/protocols.sqlite', env),
    /nested \.gorombo/,
  );
  assert.throws(
    () => resolveScriptRuntimePath('../outside.sqlite', env),
    /outside the GOROMBO runtime root/,
  );
});
