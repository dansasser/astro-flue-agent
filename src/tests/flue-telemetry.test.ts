import assert from 'node:assert/strict';
import test from 'node:test';
import type { FlueEvent } from '@flue/runtime';
import {
  FlueTelemetryStore,
  summarizeTelemetryExecutionFromEvents,
} from '../core/telemetry/flue-telemetry.js';

test('telemetry groups Flue 2 events by submission and preserves instance identity', () => {
  const store = new FlueTelemetryStore();
  store.record(event({ type: 'submission_running', instanceId: 'session-1', submissionId: 'sub-1' }));
  store.record(event({ type: 'task_start', instanceId: 'session-1', submissionId: 'sub-1', agent: 'researcher' }));
  store.record(event({ type: 'tool', instanceId: 'session-1', submissionId: 'sub-1', toolName: 'web_research', isError: false }));
  store.record(event({ type: 'submission_settled', instanceId: 'session-1', submissionId: 'sub-1' }));

  const summary = store.getExecutionSummary('sub-1');
  assert.equal(summary?.executionId, 'sub-1');
  assert.equal(summary?.instanceId, 'session-1');
  assert.equal(summary?.submissionId, 'sub-1');
  assert.equal(summary?.delegatedToResearcher, true);
  assert.equal(summary?.calledWebResearch, true);
  assert.equal(store.snapshot().executions.length, 1);
});

test('instance identity scopes events emitted before a submission exists', () => {
  const store = new FlueTelemetryStore();
  store.record(event({ type: 'agent_start', instanceId: 'session-early' }));
  assert.equal(store.getExecutionSummary('session-early')?.instanceId, 'session-early');
});

test('telemetry execution summaries sanitize arbitrary event arrays', () => {
  const summary = summarizeTelemetryExecutionFromEvents('sub-2', [
    event({ type: 'operation_start', instanceId: 'session-2', submissionId: 'sub-2', operationKind: 'prompt' }),
    event({ type: 'operation', instanceId: 'session-2', submissionId: 'sub-2', operationKind: 'prompt', isError: true }),
    { not: 'an event' },
  ]);
  assert.equal(summary?.errors.length, 1);
  assert.equal(summary?.events.some((item) => 'runId' in item), false);
});

test('telemetry bounds executions and memory mutation records', () => {
  const store = new FlueTelemetryStore({ maxExecutions: 1, maxMemoryMutations: 1 });
  store.record(event({ type: 'agent_start', instanceId: 'one', submissionId: 'sub-one' }));
  store.record(event({ type: 'agent_start', instanceId: 'two', submissionId: 'sub-two' }));
  assert.deepEqual(store.snapshot().executions.map((item) => item.executionId), ['sub-two']);

  store.recordMemoryMutation({
    type: 'memory_mutation',
    timestamp: '2026-08-01T00:00:00.000Z',
    toolName: 'store_session_note',
    agentName: 'orchestrator',
    recordId: 'note-1',
    kind: 'session_note',
    scopeKeys: { conversationId: 'conversation-1' },
    updatedBy: 'orchestrator',
  });
  assert.equal(store.memoryMutationSnapshot().mutations.length, 1);
});

function event(fields: Record<string, unknown>): FlueEvent {
  return {
    v: 3,
    eventIndex: 1,
    timestamp: '2026-08-01T00:00:00.000Z',
    ...fields,
  } as unknown as FlueEvent;
}
