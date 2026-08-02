import { createServer } from 'node:http';

export async function startDeterministicTelegramFixtures({ botToken = 'telegram-product-token' } = {}) {
  const modelRequests = [];
  const telegramMessages = [];
  const telegramRequests = [];
  let toolSequence = 0;

  const modelServer = createServer(async (request, response) => {
    const body = await readJsonBody(request);
    if (request.method !== 'POST' || request.url !== '/v1/chat/completions') {
      respondJson(response, 404, { error: 'not found' });
      return;
    }
    modelRequests.push(body);
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const lastMessage = messages.at(-1) ?? {};
    const lastToolCallId = String(lastMessage.tool_call_id ?? '');
    const eventIds = JSON.stringify(messages).match(/telegram:\d+/g) ?? [];
    const eventId = eventIds.at(-1);

    if (lastMessage.role === 'tool' && lastToolCallId.includes('telegram_reply')) {
      sendAssistantText(response, 'Telegram response delivered.');
      return;
    }

    toolSequence += 1;
    if (lastMessage.role === 'tool' && lastToolCallId.includes('load_protocols')) {
      sendToolCall(response, {
        id: `call_telegram_reply_${toolSequence}`,
        name: 'telegram_reply',
        arguments: { text: `Telegram reply for ${eventId ?? 'unknown event'}` },
      });
      return;
    }

    if (!eventId) {
      respondJson(response, 400, { error: 'Telegram event id missing from model context' });
      return;
    }
    sendToolCall(response, {
      id: `call_load_protocols_${toolSequence}`,
      name: 'load_protocols',
      arguments: { eventId },
    });
  });

  const telegramServer = createServer(async (request, response) => {
    telegramRequests.push({ method: request.method, url: request.url });
    const expectedPath = `/bot${botToken}/sendMessage`;
    if (request.method !== 'POST' || request.url !== expectedPath) {
      respondJson(response, 404, { ok: false, description: 'not found' });
      return;
    }
    const body = await readJsonBody(request);
    telegramMessages.push(body);
    respondJson(response, 200, {
      ok: true,
      result: {
        message_id: telegramMessages.length,
        date: Math.floor(Date.now() / 1000),
        chat: { id: Number(body.chat_id), type: 'private' },
        text: body.text,
      },
    });
  });

  try {
    await Promise.all([listen(modelServer), listen(telegramServer)]);
  } catch (error) {
    await Promise.allSettled([closeIfListening(modelServer), closeIfListening(telegramServer)]);
    throw error;
  }
  return {
    modelBaseUrl: `http://127.0.0.1:${serverPort(modelServer)}/v1`,
    telegramApiRoot: `http://127.0.0.1:${serverPort(telegramServer)}`,
    modelRequests: () => structuredClone(modelRequests),
    telegramMessages: () => structuredClone(telegramMessages),
    telegramRequests: () => structuredClone(telegramRequests),
    close: async () => {
      await Promise.all([close(modelServer), close(telegramServer)]);
    },
  };
}

function sendToolCall(response, toolCall) {
  const completionId = `chatcmpl-telegram-${Date.now()}`;
  sendSse(response, [
    {
      id: completionId,
      object: 'chat.completion.chunk',
      model: 'kimi-k2.6',
      choices: [
        {
          index: 0,
          delta: {
            role: 'assistant',
            tool_calls: [
              {
                index: 0,
                id: toolCall.id,
                type: 'function',
                function: {
                  name: toolCall.name,
                  arguments: JSON.stringify(toolCall.arguments),
                },
              },
            ],
          },
          finish_reason: null,
        },
      ],
    },
    {
      id: completionId,
      object: 'chat.completion.chunk',
      model: 'kimi-k2.6',
      choices: [{ index: 0, delta: {}, finish_reason: 'tool_calls' }],
    },
  ]);
}

function sendAssistantText(response, text) {
  const completionId = `chatcmpl-telegram-${Date.now()}`;
  sendSse(response, [
    {
      id: completionId,
      object: 'chat.completion.chunk',
      model: 'kimi-k2.6',
      choices: [{ index: 0, delta: { role: 'assistant', content: text }, finish_reason: null }],
    },
    {
      id: completionId,
      object: 'chat.completion.chunk',
      model: 'kimi-k2.6',
      choices: [{ index: 0, delta: {}, finish_reason: 'stop' }],
    },
  ]);
}

function sendSse(response, events) {
  response.writeHead(200, {
    'content-type': 'text/event-stream',
    'cache-control': 'no-cache',
    connection: 'close',
  });
  response.end(`${events.map((event) => `data: ${JSON.stringify(event)}\n\n`).join('')}data: [DONE]\n\n`);
}

async function readJsonBody(request) {
  let body = '';
  for await (const chunk of request) {
    body += String(chunk);
  }
  return body ? JSON.parse(body) : {};
}

function respondJson(response, status, body) {
  const text = JSON.stringify(body);
  response.writeHead(status, {
    'content-type': 'application/json',
    'content-length': Buffer.byteLength(text),
  });
  response.end(text);
}

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
}

function close(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

function closeIfListening(server) {
  return server.listening ? close(server) : Promise.resolve();
}

function serverPort(server) {
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Deterministic fixture did not bind a TCP port.');
  }
  return address.port;
}
