import assert from 'node:assert/strict';
import test from 'node:test';
import { loadFlueConversationSnapshot } from '../engine/session/flue-conversation-loader.js';

test('shared conversation loader handles valid, missing, malformed, and failed responses', async () => {
  const valid = {
    v: 1,
    conversationId: 'session-1',
    offset: '4',
    messages: [],
    settlements: [],
  };
  assert.deepEqual(
    await loadFlueConversationSnapshot(async () => Response.json(valid), {
      instanceId: 'session-1',
      headers: new Headers(),
      env: {},
    }),
    valid,
  );
  assert.equal(
    await loadFlueConversationSnapshot(async () => new Response(null, { status: 404 }), {
      instanceId: 'missing',
      headers: new Headers(),
      env: {},
    }),
    null,
  );
  await assert.rejects(
    loadFlueConversationSnapshot(async () => Response.json({ v: 1 }), {
      instanceId: 'malformed',
      headers: new Headers(),
      env: {},
    }),
    /invalid snapshot/,
  );
  await assert.rejects(
    loadFlueConversationSnapshot(async () => new Response(null, { status: 503 }), {
      instanceId: 'failed',
      headers: new Headers(),
      env: {},
    }),
    /HTTP 503/,
  );
});
