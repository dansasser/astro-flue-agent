import assert from 'node:assert/strict';
import { request } from 'node:http';
import test from 'node:test';
import { startDeterministicChatProvider } from './deterministic-chat-provider.mjs';

test('deterministic provider survives an aborted request and uses stable response ids', async () => {
  const provider = await startDeterministicChatProvider();
  try {
    await abortRequest(`${provider.baseUrl}/chat/completions`, provider.requestStarted);
    assert.ok(provider.abortedRequestObserved instanceof Promise);
    await withTimeout(provider.abortedRequestObserved, 'provider did not observe aborted request');

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

test('deterministic provider exposes unexpected handler failures', async () => {
  const failure = new Error('injected provider failure');
  const provider = await startDeterministicChatProvider({
    beforeResponse: () => {
      throw failure;
    },
    onUnexpectedError: () => {},
  });
  try {
    assert.ok(provider.unexpectedErrorObserved instanceof Promise);
    await assert.rejects(
      fetch(`${provider.baseUrl}/chat/completions`, {
        method: 'POST',
        body: '{}',
      }),
    );
    assert.equal(
      await withTimeout(provider.unexpectedErrorObserved, 'provider hid unexpected failure'),
      failure,
    );
  } finally {
    await provider.close();
  }
});

async function abortRequest(url, requestStarted) {
  const outgoing = request(url, {
    method: 'POST',
    headers: { 'content-length': '100' },
  });
  const closed = new Promise((resolvePromise) => {
    outgoing.on('error', resolvePromise);
    outgoing.on('close', resolvePromise);
  });
  outgoing.write('{');
  await withTimeout(requestStarted, 'provider did not accept request before abort');
  outgoing.destroy();
  await withTimeout(closed, 'client did not observe aborted request');
}

async function withTimeout(promise, message) {
  let timeout;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timeout = setTimeout(() => reject(new Error(message)), 1_000);
      }),
    ]);
  } finally {
    clearTimeout(timeout);
  }
}
