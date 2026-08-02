import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createTelegramReplyTool,
  resolveTelegramDelivery,
} from '../channels/telegram-client.js';
import { runToolForText } from '../engine/tools/direct-tool-runner.js';
import type { NormalizedMessageEvent } from '../core/types/index.js';

test('Telegram reply tool binds destination from the trusted current event', async () => {
  const calls: Array<{ chatId: string | number; text: string; options: unknown }> = [];
  const event = telegramEvent('telegram:42');
  const tool = createTelegramReplyTool({ connector: 'telegram', chatId: 9001 }, {
    eventId: event.id,
    replyToMessageId: 77,
  }, {
    loadEvent: (eventId) => (eventId === event.id ? event : undefined),
    client: {
      sendMessage: (async (chatId: string | number, text: string, options: unknown) => {
        calls.push({ chatId, text, options });
        return {} as never;
      }) as never,
    },
  });

  assert.equal(
    await runToolForText(tool, { text: 'Bound reply', format: 'markdownv2' }),
    'sent',
  );
  assert.deepEqual(calls, [
    {
      chatId: 9001,
      text: 'Bound reply',
      options: {
        reply_to_message_id: 77,
        message_thread_id: undefined,
        direct_messages_topic_id: undefined,
        parse_mode: 'MarkdownV2',
      },
    },
  ]);
});

test('Telegram reply tool rejects non-Telegram delivery context', async () => {
  const tool = createTelegramReplyTool(undefined, undefined, {
    loadEvent: () => undefined,
    client: { sendMessage: (async () => ({} as never)) as never },
  });

  await assert.rejects(
    runToolForText(tool, { text: 'must not send' }),
    /missing the Telegram conversation bound at instance creation/,
  );
});

test('Telegram delivery binding derives event and reply ids only from the verified signal', () => {
  assert.deepEqual(
    resolveTelegramDelivery({
      kind: 'signal',
      type: 'telegram.message',
      attributes: { eventId: 'telegram:55', messageId: '81' },
    }),
    { eventId: 'telegram:55', replyToMessageId: 81 },
  );
  assert.equal(resolveTelegramDelivery({ kind: 'user' }), undefined);
  assert.equal(
    resolveTelegramDelivery({ kind: 'signal', type: 'slack.message', attributes: { eventId: 'other:1' } }),
    undefined,
  );
});

test('Telegram reply tool chunks long messages and replies only from the first chunk', async () => {
  const calls: Array<{ chatId: string | number; text: string; options: Record<string, unknown> }> = [];
  const event = telegramEvent('telegram:43');
  const tool = createTelegramReplyTool({
    connector: 'telegram',
    chatId: 9001,
    messageThreadId: 12,
  }, {
    eventId: event.id,
    replyToMessageId: 78,
  }, {
    loadEvent: (eventId) => (eventId === event.id ? event : undefined),
    client: {
      sendMessage: (async (chatId: string | number, text: string, options: Record<string, unknown>) => {
        calls.push({ chatId, text, options });
        return {} as never;
      }) as never,
    },
  });

  assert.equal(await runToolForText(tool, { text: 'a'.repeat(5_000) }), 'sent');
  assert.equal(calls.length, 2);
  assert.ok(calls.every((call) => call.text.length <= 4_096));
  assert.equal(calls[0]?.options.reply_to_message_id, 78);
  assert.equal(calls[1]?.options.reply_to_message_id, undefined);
  assert.ok(calls.every((call) => call.options.message_thread_id === 12));
});

test('Telegram reply tool reports partial delivery without hiding delivered chunks', async () => {
  let attempts = 0;
  const event = telegramEvent('telegram:44');
  const tool = createTelegramReplyTool({ connector: 'telegram', chatId: 9001 }, {
    eventId: event.id,
  }, {
    loadEvent: (eventId) => (eventId === event.id ? event : undefined),
    client: {
      sendMessage: (async () => {
        attempts += 1;
        if (attempts === 2) {
          throw new Error('provider unavailable');
        }
        return {} as never;
      }) as never,
    },
  });

  await assert.rejects(
    runToolForText(tool, { text: 'a'.repeat(5_000) }),
    /partially delivered 1 of 2 chunks; do not retry the full response/i,
  );
  assert.equal(attempts, 2);
});

function telegramEvent(id: string): NormalizedMessageEvent {
  return {
    id,
    connector: 'telegram',
    kind: 'chat.message',
    text: 'hello',
    receivedAt: '2026-08-02T00:00:00.000Z',
    actor: { id: '42' },
    conversation: { id: '9001' },
  };
}
