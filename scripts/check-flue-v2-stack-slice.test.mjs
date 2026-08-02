import assert from 'node:assert/strict';
import test from 'node:test';

import {
  STACK_SLICES,
  runGit,
  validateCommitAncestry,
  validateSliceMetadata,
} from './check-flue-v2-stack-slice.mjs';

test('every Flue v2 stack member accepts its declared base below the file cap', () => {
  for (const [headRef, slice] of Object.entries(STACK_SLICES)) {
    assert.equal(
      validateSliceMetadata({ baseRef: slice.base, changedFiles: 99, headRef }),
      slice,
    );
  }
});

test('stack validation rejects unknown branches and incorrect bases', () => {
  assert.throws(
    () => validateSliceMetadata({ baseRef: 'main', changedFiles: 1, headRef: 'codex/other' }),
    /Unrecognized/,
  );
  assert.throws(
    () => validateSliceMetadata({
      baseRef: 'main',
      changedFiles: 1,
      headRef: 'codex/flue-v2-01-foundation',
    }),
    /must target/,
  );
});

test('stack validation enforces a non-empty diff below 100 files', () => {
  const headRef = 'codex/flue-v2-00-stack-ci';
  assert.throws(
    () => validateSliceMetadata({ baseRef: 'main', changedFiles: 0, headRef }),
    /at least one/,
  );
  assert.throws(
    () => validateSliceMetadata({ baseRef: 'main', changedFiles: 100, headRef }),
    /limit is 99/,
  );
});

test('commit ancestry validation accepts ancestors and rejects unrelated commits', () => {
  const calls = [];
  validateCommitAncestry(
    { headSha: 'head-sha', requiredCommit: 'required-sha' },
    (command, args, options) => {
      calls.push({ args, command, options });
      return { status: 0, stderr: '', stdout: '' };
    },
  );
  assert.deepEqual(calls[0].args, [
    'merge-base',
    '--is-ancestor',
    'required-sha',
    'head-sha',
  ]);
  assert.throws(
    () => validateCommitAncestry(
      { headSha: 'head-sha', requiredCommit: 'unrelated-sha' },
      () => ({ status: 1, stderr: '', stdout: '' }),
    ),
    /merge-base --is-ancestor unrelated-sha head-sha failed/,
  );
});

test('Git execution reports spawn failures without dereferencing null output', () => {
  assert.throws(
    () => runGit(
      ['status'],
      () => ({ error: new Error('git unavailable'), status: null, stderr: null, stdout: null }),
    ),
    /git status failed to run: git unavailable/,
  );
});
