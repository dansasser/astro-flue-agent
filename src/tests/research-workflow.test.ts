import assert from 'node:assert/strict';
import test from 'node:test';
import { goromboPersistenceRuntime } from '../db.js';
import * as researchWorkflow from '../workflows/research.js';

const { createResearchPrompt } = researchWorkflow;

test('research workflow prompt instructs the researcher to use retrieval controls', () => {
  const prompt = createResearchPrompt({
    operationId: 'official-docs-lookup',
    text: 'Find the official Ollama web search API docs URL.',
    actorId: 'user-1',
    conversationId: 'thread-1',
    depth: 'deep',
    maxContextTokens: 2_000,
    webFetch: 'always',
    fetchTopK: 2,
  });

  assert.match(prompt, /web_research/);
  assert.match(prompt, /depth: "deep"/);
  assert.match(prompt, /maxContextTokens: 2000/);
  assert.match(prompt, /webFetch: "always"/);
  assert.match(prompt, /maxFetches: 2/);
  assert.match(prompt, /Compare sources/);
  assert.match(prompt, /providerFailures/);
  assert.match(prompt, /source URLs/);
  assert.match(prompt, /Find the official Ollama web search API docs URL/);
});

test('research workflow prompt lets deep web research use depth defaults', () => {
  const prompt = createResearchPrompt({
    operationId: 'deep-current-search',
    text: 'Do deep research on current AI search options.',
    depth: 'deep',
  });

  assert.match(prompt, /depth: "deep"/);
  assert.match(prompt, /omit it so web_research applies the selected depth defaults/);
  assert.doesNotMatch(prompt, /maxContextTokens:/);
  assert.doesNotMatch(prompt, /maxFetches:/);
  assert.doesNotMatch(prompt, /webFetch:/);
});

test('research dispatch plans reuse one trusted event and idempotency key per operation', () => {
  const createResearchDispatchPlan = (
    researchWorkflow as unknown as {
      createResearchDispatchPlan?: (payload: {
        operationId: string;
        text: string;
        actorId: string;
        conversationId: string;
        session: string;
      }) => { event: { id: string }; idempotencyKey: string; message: string };
    }
  ).createResearchDispatchPlan;
  assert.equal(typeof createResearchDispatchPlan, 'function');
  if (!createResearchDispatchPlan) return;

  const payload = {
    operationId: 'stable-operation',
    text: 'Find the source.',
    actorId: 'trusted-user',
    conversationId: 'trusted-conversation',
    session: 'research-session',
  };
  const first = createResearchDispatchPlan(payload);
  const retry = createResearchDispatchPlan(payload);
  const separate = createResearchDispatchPlan({ ...payload, operationId: 'separate-operation' });

  assert.equal(retry.event.id, first.event.id);
  assert.equal(retry.idempotencyKey, first.idempotencyKey);
  assert.notEqual(separate.event.id, first.event.id);
  assert.notEqual(separate.idempotencyKey, first.idempotencyKey);
  assert.match(first.message, new RegExp(`eventId: "${first.event.id}"`));
});

test('research workflow persists trusted scope and dispatch admission', async () => {
  const payload = {
    operationId: `trusted-workflow-${Date.now()}`,
    text: 'Research the current migration guide.',
    actorId: 'trusted-user',
    conversationId: 'trusted-conversation',
    session: 'trusted-research-session',
  };
  const plan = researchWorkflow.createResearchDispatchPlan(payload);
  const dispatches: Array<{
    instanceId: string;
    idempotencyKey: string;
    message: string;
  }> = [];
  try {
    const result = await researchWorkflow.runResearchWorkflow(payload, {
      initialize: (instanceId) => ({
        dispatch: async (input) => {
          dispatches.push({
            instanceId,
            idempotencyKey: input.idempotencyKey,
            message: input.message,
          });
          return {
            submissionId: 'research-submission',
            acceptedAt: '2026-08-02T00:00:00.000Z',
            uid: 'research-uid',
          };
        },
        read: async (receipt) => ({
          text: 'Research complete.',
          data: {},
          submissionId: receipt.submissionId,
        }),
      }),
    });

    assert.equal(result.eventId, plan.event.id);
    assert.deepEqual(dispatches, [{
      instanceId: plan.instanceId,
      idempotencyKey: plan.idempotencyKey,
      message: plan.message,
    }]);
    const persisted = goromboPersistenceRuntime.sessionDatabase
      .getNormalizedMessageEvent(plan.event.id);
    assert.equal(persisted?.actor.id, payload.actorId);
    assert.equal(persisted?.conversation.id, payload.conversationId);
    assert.equal(persisted?.context?.workflow, 'research');
    assert.equal(persisted?.context?.task, payload.operationId);
  } finally {
    goromboPersistenceRuntime.sessionDatabase.deleteNormalizedMessageEvent(plan.event.id);
  }
});
