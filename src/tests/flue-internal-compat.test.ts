import assert from 'node:assert/strict';
import test from 'node:test';
import {
  init,
  useInitialData,
  useInstruction,
  useResponseFinish,
} from '@flue/runtime';

test('Flue 2 public execution hooks and handle API are available', () => {
  assert.equal(typeof init, 'function');
  assert.equal(typeof useInitialData, 'function');
  assert.equal(typeof useInstruction, 'function');
  assert.equal(typeof useResponseFinish, 'function');
});
