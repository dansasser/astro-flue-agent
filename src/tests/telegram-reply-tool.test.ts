import assert from 'node:assert/strict';
import test from 'node:test';
import { createTelegramReplyTool } from '../channels/telegram-client.js';
import { resolveTelegramEventId } from '../agents/orchestrator.js';
import { runToolForText } from '../engine/tools/direct-tool-runner.js';
import type { NormalizedMessageEvent } from '../core/types/index.js';

test('Telegram reply tool binds destination from the trusted current event', async () => {
  const calls: Array<{ chatId: string | number; text: string; options: unknown }> = [];
  const event = telegramEvent('telegram:42');
  const tool = createTelegramReplyTool({ connector: 'telegram', chatId: 9001 }, event.id, {
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

test('orchestrator derives Telegram event id only from the verified signal', () => {
  assert.equal(
    resolveTelegramEventId({
      kind: 'signal',
      type: 'telegram.message',
      attributes: { eventId: 'telegram:55' },
    }),
    'telegram:55',
  );
  assert.equal(resolveTelegramEventId({ kind: 'user' }), undefined);
  assert.equal(
    resolveTelegramEventId({ kind: 'signal', type: 'slack.message', attributes: { eventId: 'other:1' } }),
    undefined,
  );
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
    raw: { message: { message_id: 77 } },
  };
}
