import assert from 'node:assert/strict';
import test from 'node:test';
import { startDeterministicTelegramFixtures } from './deterministic-telegram-provider.mjs';

test('deterministic Telegram fixture accepts only the configured bot token', async () => {
  const fixtures = await startDeterministicTelegramFixtures({
    botToken: 'expected-token',
  });
  try {
    const wrong = await fetch(`${fixtures.telegramApiRoot}/botwrong-token/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: 1, text: 'wrong' }),
    });
    assert.equal(wrong.status, 404);

    const correct = await fetch(`${fixtures.telegramApiRoot}/botexpected-token/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: 1, text: 'correct' }),
    });
    assert.equal(correct.status, 200);
    assert.deepEqual(fixtures.telegramMessages().map((message) => message.text), ['correct']);
  } finally {
    await fixtures.close();
  }
});
