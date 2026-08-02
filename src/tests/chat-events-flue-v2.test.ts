import assert from 'node:assert/strict';
import test from 'node:test';
import type { DeliveredMessageInput } from '@flue/runtime';
import { Hono } from 'hono';
import { registerChatEventRoutes } from '../api/routes/chat-events.js';
import { goromboPersistenceRuntime } from '../db.js';
import type { FlueConversationSnapshot } from '../engine/session/flue-conversation.js';

test('chat facade dispatches and reads one exact Flue 2 submission', async () => {
  const fixture = createFixture();
  try {
    const response = await fixture.post({
      connector: 'tui',
      text: 'Hello from the Flue 2 facade.',
      actorId: fixture.actorId,
      conversationId: fixture.conversationId,
    });
    assert.equal(response.status, 200);
    const body = await response.json() as {
      result?: { text?: string };
      submissionId?: string;
      session?: { id?: string };
      contextUsage?: { available?: boolean; usedTokens?: number };
      event?: { id?: string };
    };
    fixture.eventIds.push(body.event?.id ?? '');
    fixture.sessionId = body.session?.id;

    assert.equal(body.result?.text, 'Flue 2 reply');
    assert.equal(body.submissionId, 'submission-1');
    assert.equal(fixture.dispatches.length, 1);
    assert.equal(fixture.dispatches[0]?.instanceId, body.session?.id);
    assert.match(JSON.stringify(fixture.dispatches[0]?.message), /Hello from the Flue 2 facade/);
    assert.equal(body.contextUsage?.available, true);
    assert.equal(body.contextUsage?.usedTokens, 600);

    const stored = goromboPersistenceRuntime.sessionDatabase
      .listNormalizedMessageEventsForSession({ sessionId: body.session?.id ?? '' })[0];
    assert.deepEqual(stored?.delivery, {
      submissionId: 'submission-1',
      instanceId: body.session?.id,
      uid: 'uid-1',
      streamUrl: `/agents/orchestrator/${body.session?.id}`,
    });
  } finally {
    fixture.cleanup();
  }
});

test('/compact preserves the product session and rotates its Flue 2 runtime generation', async () => {
  const fixture = createFixture();
  try {
    const initial = await fixture.post({
      connector: 'tui',
      text: 'Start this session.',
      actorId: fixture.actorId,
      conversationId: fixture.conversationId,
    });
    const initialBody = await initial.json() as { session?: { id?: string }; event?: { id?: string } };
    fixture.sessionId = initialBody.session?.id;
    fixture.eventIds.push(initialBody.event?.id ?? '');
    assert.ok(fixture.sessionId);

    const compacted = await fixture.post({
      connector: 'tui',
      text: '/compact',
      actorId: fixture.actorId,
      conversationId: fixture.conversationId,
      session: fixture.sessionId,
    });
    assert.equal(compacted.status, 200);
    const compactedBody = await compacted.json() as {
      result?: { command?: { name?: string }; contextBudget?: { compactedBeforePrompt?: boolean } };
      session?: { id?: string };
      event?: { id?: string };
    };
    fixture.eventIds.push(compactedBody.event?.id ?? '');

    assert.equal(compactedBody.session?.id, fixture.sessionId);
    assert.equal(compactedBody.result?.command?.name, 'compact');
    assert.equal(compactedBody.result?.contextBudget?.compactedBeforePrompt, true);
    assert.equal(fixture.dispatches.length, 2);
    assert.equal(fixture.dispatches[1]?.instanceId, fixture.sessionId);
    assert.match(JSON.stringify(fixture.dispatches[1]?.message), /sim_one_compact/);

    const generations = goromboPersistenceRuntime.sessionDatabase
      .listRuntimeGenerations(fixture.sessionId!);
    assert.equal(generations.length, 2);
    assert.equal(generations[0]?.instanceId, fixture.sessionId);
    assert.equal(generations[1]?.generation, 1);
    assert.equal(generations[1]?.compactionSubmissionId, 'submission-2');
    assert.equal(generations[1]?.continuationSummary, 'Continuation summary');
    assert.notEqual(generations[1]?.instanceId, fixture.sessionId);
  } finally {
    fixture.cleanup();
  }
});

function createFixture() {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const actorId = `flue-v2-actor-${suffix}`;
  const conversationId = `flue-v2-conversation-${suffix}`;
  const eventIds: string[] = [];
  const dispatches: Array<{ instanceId: string; message: DeliveredMessageInput }> = [];
  let dispatchCount = 0;
  let sessionId: string | undefined;
  const app = new Hono();

  registerChatEventRoutes(app, {
    dispatchOrchestrator: async (input) => {
      dispatchCount += 1;
      dispatches.push({ instanceId: input.instanceId, message: input.message });
      const submissionId = `submission-${dispatchCount}`;
      const compact = JSON.stringify(input.message).includes('sim_one_compact');
      return {
        instanceId: input.instanceId,
        receipt: {
          submissionId,
          acceptedAt: '2026-08-01T00:00:00.000Z',
          uid: `uid-${dispatchCount}`,
        },
        reply: {
          text: compact ? 'Continuation summary' : 'Flue 2 reply',
          data: {},
          submissionId,
        },
      };
    },
    loadConversationSnapshot: async ({ instanceId }) => snapshot(instanceId, dispatchCount),
  });

  const previous = {
    API_SECRET: process.env.API_SECRET,
    OLLAMA_API_KEY: process.env.OLLAMA_API_KEY,
    CODEX_BRAIN_LOCAL_API_KEY: process.env.CODEX_BRAIN_LOCAL_API_KEY,
    CODEX_BRAIN_LOCAL_API_URL: process.env.CODEX_BRAIN_LOCAL_API_URL,
  };
  process.env.API_SECRET = 'test-secret';
  process.env.OLLAMA_API_KEY = 'test-key';
  process.env.CODEX_BRAIN_LOCAL_API_KEY = 'test-key';
  process.env.CODEX_BRAIN_LOCAL_API_URL = 'https://codex-brain.example.test/v1';

  return {
    actorId,
    conversationId,
    eventIds,
    dispatches,
    get sessionId() { return sessionId; },
    set sessionId(value: string | undefined) { sessionId = value; },
    post(body: Record<string, unknown>) {
      return app.request('/api/chat/events', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-api-secret': 'test-secret' },
        body: JSON.stringify(body),
      });
    },
    cleanup() {
      for (const eventId of eventIds.filter(Boolean)) {
        goromboPersistenceRuntime.sessionDatabase.deleteNormalizedMessageEvent(eventId);
      }
      if (sessionId) goromboPersistenceRuntime.sessionDatabase.deleteChatSession(sessionId);
      restoreEnv('API_SECRET', previous.API_SECRET);
      restoreEnv('OLLAMA_API_KEY', previous.OLLAMA_API_KEY);
      restoreEnv('CODEX_BRAIN_LOCAL_API_KEY', previous.CODEX_BRAIN_LOCAL_API_KEY);
      restoreEnv('CODEX_BRAIN_LOCAL_API_URL', previous.CODEX_BRAIN_LOCAL_API_URL);
    },
  };
}

function snapshot(conversationId: string, count: number): FlueConversationSnapshot {
  const submissionId = `submission-${Math.max(1, count)}`;
  return {
    v: 1,
    conversationId,
    offset: String(count),
    settlements: [{ submissionId, outcome: 'completed' }],
    messages: [{
      id: `assistant-${submissionId}`,
      role: 'assistant',
      purpose: 'assistant',
      display: 'visible',
      submissionId,
      parts: [{ type: 'text', text: 'Flue 2 reply', state: 'done' }],
      metadata: { simOne: { usage: { totalTokens: 600 } } },
    }],
  };
}

function restoreEnv(name: string, value: string | undefined): void {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}
