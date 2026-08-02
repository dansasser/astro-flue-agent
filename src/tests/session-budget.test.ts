import assert from 'node:assert/strict';
import test from 'node:test';
import { minimaxM3Card } from '../core/models/catalog.js';
import { calculateContextBudget } from '../engine/session/context-budget.js';
import {
  InMemorySessionBudgetStore,
  createSessionBudgetReport,
  deriveSessionBudgetStateFromSnapshots,
  recordManualCompaction,
  recordPromptUsage,
} from '../engine/session/session-budget.js';
import type { FlueConversationSnapshot } from '../engine/session/flue-conversation.js';

test('session budget requests compaction before an oversized next prompt', () => {
  const store = new InMemorySessionBudgetStore();
  const budget = calculateContextBudget(minimaxM3Card);
  store.setForTest({
    sessionId: 'support',
    modelSpecifier: minimaxM3Card.specifier,
    estimatedHistoryTokens: budget.compactionTokens - 10,
    turns: 3,
    compactions: 0,
  });
  const report = createSessionBudgetReport({
    sessionId: 'support',
    modelCard: minimaxM3Card,
    promptText: 'x'.repeat(100),
    store,
  });
  assert.equal(report.status, 'compact');
  assert.equal(report.shouldCompactBeforePrompt, true);
});

test('session budget derives history, usage, turns, and compactions from Flue 2 snapshots', () => {
  const snapshot = conversationSnapshot();
  const state = deriveSessionBudgetStateFromSnapshots({
    sessionId: 'support',
    modelSpecifier: minimaxM3Card.specifier,
    snapshots: [snapshot],
    compactions: 2,
  });
  assert.equal(state.estimatedHistoryTokens, 1_200);
  assert.equal(state.turns, 1);
  assert.equal(state.compactions, 2);
});

test('provider usage and manual compaction update fallback budget state', () => {
  const store = new InMemorySessionBudgetStore();
  recordPromptUsage({
    sessionId: 'support',
    modelSpecifier: minimaxM3Card.specifier,
    promptEstimateTokens: 100,
    usage: {
      input: 1_000,
      output: 200,
      cacheRead: 0,
      cacheWrite: 0,
      totalTokens: 1_200,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
    },
    store,
  });
  assert.equal(store.get('support', minimaxM3Card.specifier).estimatedHistoryTokens, 1_200);
  recordManualCompaction({
    sessionId: 'support',
    modelSpecifier: minimaxM3Card.specifier,
    budget: calculateContextBudget(minimaxM3Card),
    store,
  });
  assert.equal(store.get('support', minimaxM3Card.specifier).compactions, 1);
});

function conversationSnapshot(): FlueConversationSnapshot {
  return {
    v: 1,
    conversationId: 'support',
    offset: '4',
    settlements: [{ submissionId: 'submission-1', outcome: 'completed' }],
    messages: [
      {
        id: 'user-1',
        role: 'user',
        purpose: 'user',
        display: 'visible',
        submissionId: 'submission-1',
        parts: [{ type: 'text', text: 'hello', state: 'done' }],
      },
      {
        id: 'assistant-1',
        role: 'assistant',
        purpose: 'assistant',
        display: 'visible',
        submissionId: 'submission-1',
        metadata: {
          simOne: {
            usage: { input: 1_000, output: 200, cacheRead: 0, cacheWrite: 0, totalTokens: 1_200 },
          },
        },
        parts: [{ type: 'text', text: 'Hi there.', state: 'done' }],
      },
    ],
  };
}
