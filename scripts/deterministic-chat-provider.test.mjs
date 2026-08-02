import assert from 'node:assert/strict';
import { request } from 'node:http';
import test from 'node:test';
import { startDeterministicChatProvider } from './deterministic-chat-provider.mjs';

test('deterministic provider survives an aborted request and uses stable response ids', async () => {
  const provider = await startDeterministicChatProvider();
  try {
    await abortRequest(`${provider.baseUrl}/chat/completions`);

    const first = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: 'POST',
      body: '{}',
    });
    const second = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: 'POST',
      body: '{}',
    });

    assert.equal(first.status, 200);
    assert.equal(second.status, 200);
    assert.match(await first.text(), /chatcmpl-sim-one-1/);
    assert.match(await second.text(), /chatcmpl-sim-one-2/);
    assert.equal(provider.requestCount(), 2);
  } finally {
    await provider.close();
  }
});

async function abortRequest(url) {
  await new Promise((resolvePromise) => {
    const outgoing = request(url, {
      method: 'POST',
      headers: { 'content-length': '100' },
    });
    outgoing.on('error', resolvePromise);
    outgoing.write('{');
    outgoing.destroy();
    setTimeout(resolvePromise, 25);
  });
}
