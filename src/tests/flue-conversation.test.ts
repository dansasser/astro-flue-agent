import assert from 'node:assert/strict';
import test from 'node:test';
import { isFlueConversationSnapshot } from '../engine/session/flue-conversation.js';

test('Flue conversation snapshots validate nested messages, parts, and settlements', () => {
  const valid = {
    v: 1,
    conversationId: 'session-1',
    offset: '4',
    messages: [{
      id: 'assistant-1',
      role: 'assistant',
      purpose: 'assistant',
      display: 'visible',
      submissionId: 'submission-1',
      parts: [{ type: 'text', text: 'done', state: 'done' }],
    }],
    settlements: [{ submissionId: 'submission-1', outcome: 'completed' }],
  };
  assert.equal(isFlueConversationSnapshot(valid), true);

  for (const malformed of [
    { ...valid, messages: [{ ...valid.messages[0], role: 'intruder' }] },
    { ...valid, messages: [{ ...valid.messages[0], parts: [{ type: 'text', text: 42, state: 'done' }] }] },
    { ...valid, messages: [{ ...valid.messages[0], parts: [{ type: 'dynamic-tool', toolName: 'x', toolCallId: '1', state: 'output-error', input: {}, errorText: 42 }] }] },
    { ...valid, messages: [{ ...valid.messages[0], parts: [{ type: 'dynamic-tool', toolName: 'x', toolCallId: '1', state: 'input-available' }] }] },
    { ...valid, messages: [{ ...valid.messages[0], parts: [{ type: 'dynamic-tool', toolName: 'x', toolCallId: '1', state: 'output-available', input: {} }] }] },
    { ...valid, messages: [{ ...valid.messages[0], parts: [{ type: 'dynamic-tool', toolName: 'x', toolCallId: '1', state: 'output-error', errorText: 'failed' }] }] },
    { ...valid, settlements: [{ submissionId: 42, outcome: 'completed' }] },
    { ...valid, settlements: [{ submissionId: 'submission-1', outcome: 'unknown' }] },
  ]) {
    assert.equal(isFlueConversationSnapshot(malformed), false);
  }
});
