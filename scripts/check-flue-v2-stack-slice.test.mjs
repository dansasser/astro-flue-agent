import assert from 'node:assert/strict';
import test from 'node:test';

import {
  STACK_SLICES,
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
