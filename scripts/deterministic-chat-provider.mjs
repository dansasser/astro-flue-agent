import { createServer } from 'node:http';

export async function startDeterministicChatProvider(options = {}) {
  let requestCount = 0;
  let resolveRequestStarted;
  let resolveAbortedRequest;
  let resolveUnexpectedError;
  const requestStarted = new Promise((resolvePromise) => {
    resolveRequestStarted = resolvePromise;
  });
  const abortedRequestObserved = new Promise((resolvePromise) => {
    resolveAbortedRequest = resolvePromise;
  });
  const unexpectedErrorObserved = new Promise((resolvePromise) => {
    resolveUnexpectedError = resolvePromise;
  });
  const server = createServer(async (request, response) => {
    resolveRequestStarted();
    request.once('aborted', () => resolveAbortedRequest());
    try {
      for await (const _chunk of request) {
        // Drain the request before returning the deterministic SSE response.
      }
      if (request.method !== 'POST' || request.url !== '/v1/chat/completions') {
        response.writeHead(404, { 'content-length': '0' });
        response.end();
        return;
      }
      requestCount += 1;
      await options.beforeResponse?.({ request, response, requestCount });

      const completionId = `chatcmpl-sim-one-${requestCount}`;
      const events = [
        {
          id: completionId,
          object: 'chat.completion.chunk',
          model: 'kimi-k2.6',
          choices: [
            {
              index: 0,
              delta: { role: 'assistant', content: 'Hello from SIM-ONE Alpha.' },
              finish_reason: null,
            },
          ],
        },
        {
          id: completionId,
          object: 'chat.completion.chunk',
          model: 'kimi-k2.6',
          choices: [{ index: 0, delta: {}, finish_reason: 'stop' }],
        },
      ];
      response.writeHead(200, {
        'content-type': 'text/event-stream',
        'cache-control': 'no-cache',
        connection: 'close',
      });
      response.end(`${events.map((event) => `data: ${JSON.stringify(event)}\n\n`).join('')}data: [DONE]\n\n`);
    } catch (error) {
      if (request.aborted || error?.code === 'ECONNRESET' || error?.name === 'AbortError') {
        resolveAbortedRequest();
      } else {
        resolveUnexpectedError(error);
        if (options.onUnexpectedError) {
          options.onUnexpectedError(error);
        } else {
          console.error('[deterministic-chat-provider] request failed:', error);
        }
      }
      if (!response.destroyed) {
        response.destroy();
      }
    }
  });
  await new Promise((resolvePromise, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolvePromise);
  });
  const address = server.address();
  if (!address || typeof address === 'string') {
    server.close();
    throw new Error('Deterministic chat provider did not bind a TCP port.');
  }
  return {
    baseUrl: `http://127.0.0.1:${address.port}/v1`,
    requestCount: () => requestCount,
    requestStarted,
    abortedRequestObserved,
    unexpectedErrorObserved,
    close: () =>
      new Promise((resolvePromise, reject) => {
        server.close((error) => (error ? reject(error) : resolvePromise()));
      }),
  };
}
