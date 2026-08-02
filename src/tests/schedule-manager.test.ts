import assert from 'node:assert/strict';
import { rmSync } from 'node:fs';
import test from 'node:test';
import type { AgentReply } from '@flue/runtime';
import { resolveScheduleConfig } from '../engine/schedules/schedule-config.js';
import type {
  DispatchScheduleArgs,
  ScheduleDispatchResult,
} from '../engine/schedules/schedule-dispatch.js';
import {
  classifyError,
  intervalToCron,
  ScheduleManager,
} from '../engine/schedules/schedule-manager.js';
import { ScheduleStore } from '../engine/schedules/schedule-store.js';

test('interval schedules convert to Croner expressions', () => {
  assert.equal(intervalToCron('1s'), '*/1 * * * * *');
  assert.equal(intervalToCron('20m'), '*/20 * * * *');
  assert.equal(intervalToCron('2h'), '0 */2 * * *');
  assert.equal(intervalToCron('0m'), null);
});

test('scheduled turn records Flue 2 admission and exact settled reply', async () => {
  const fixture = createFixture(async (args) => settled(args));
  try {
    fixture.manager.store.upsert({ slug: 'ok', kind: 'cron', schedule: '0 9 * * *', prompt: 'run' });
    const runId = fixture.manager.fireNow('ok')?.runId;
    assert.ok(runId);
    const run = await waitForRun(fixture.store, runId!, ['ok']);
    assert.equal(run.status, 'ok');
    assert.match(run.submissionId ?? '', /^sub-schedule:/);
  } finally {
    await fixture.cleanup();
  }
});

test('failed Flue 2 settlement is classified and recorded', async () => {
  const fixture = createFixture(async (args) => settled(
    args,
    () => Promise.reject(new Error('validation failed')),
  ));
  try {
    fixture.manager.store.upsert({
      slug: 'bad',
      kind: 'cron',
      schedule: '0 9 * * *',
      prompt: 'run',
      maxAttempts: 0,
    });
    const runId = fixture.manager.fireNow('bad')?.runId;
    const run = await waitForRun(fixture.store, runId!, ['skipped']);
    assert.equal(run.status, 'skipped');
    assert.match(run.error ?? '', /validation failed/);
  } finally {
    await fixture.cleanup();
  }
});

test('settlement timeout is terminal without treating admission as completion', async () => {
  const fixture = createFixture(async (args) => settled(args, rejectWhenAborted), 15);
  try {
    fixture.manager.store.upsert({ slug: 'slow', kind: 'cron', schedule: '0 9 * * *', prompt: 'run' });
    const runId = fixture.manager.fireNow('slow')?.runId;
    const run = await waitForRun(fixture.store, runId!, ['timeout']);
    assert.equal(run.status, 'timeout');
  } finally {
    await fixture.cleanup();
  }
});

test('settlement timeout starts after dispatch admission completes', async () => {
  const admissionDelayMs = 40;
  const settlementTimeoutMs = 25;
  const fixture = createFixture(async (args) => {
    await wait(admissionDelayMs);
    return settled(args, rejectWhenAborted);
  }, settlementTimeoutMs);
  try {
    fixture.manager.store.upsert({ slug: 'slow-admission', kind: 'cron', schedule: '0 9 * * *', prompt: 'run' });
    const startedAt = Date.now();
    const runId = fixture.manager.fireNow('slow-admission')?.runId;
    const run = await waitForRun(fixture.store, runId!, ['timeout']);
    assert.equal(run.status, 'timeout');
    assert.ok(
      Date.now() - startedAt >= admissionDelayMs + settlementTimeoutMs - 10,
      'the full settlement timeout remains available after admission',
    );
  } finally {
    await fixture.cleanup();
  }
});

test('stop drains a settlement that completes within the grace window', async () => {
  let resolveSettlement!: (reply: AgentReply) => void;
  const settlement = new Promise<AgentReply>((resolve) => {
    resolveSettlement = resolve;
  });
  const fixture = createFixture(async (args) => settled(args, () => settlement));
  try {
    fixture.manager.store.upsert({ slug: 'drain', kind: 'cron', schedule: '0 9 * * *', prompt: 'run' });
    const runId = fixture.manager.fireNow('drain')?.runId;
    await waitForRun(fixture.store, runId!, ['admitted']);
    const stopping = fixture.manager.stop(250);
    resolveSettlement({ text: 'done', data: {}, submissionId: `sub-${runId}` });
    await stopping;
    assert.equal(fixture.store.getRun(runId!)?.status, 'ok');
  } finally {
    await fixture.cleanup();
  }
});

test('stop aborts a settlement that exceeds the grace window', async () => {
  const fixture = createFixture(async (args) => settled(args, rejectWhenAborted));
  try {
    fixture.manager.store.upsert({ slug: 'abort', kind: 'cron', schedule: '0 9 * * *', prompt: 'run' });
    const runId = fixture.manager.fireNow('abort')?.runId;
    await waitForRun(fixture.store, runId!, ['admitted']);
    await fixture.manager.stop(0);
    assert.equal(fixture.store.getRun(runId!)?.status, 'timeout');
  } finally {
    await fixture.cleanup();
  }
});

test('dispatch admission failures are recorded as errors', async () => {
  const fixture = createFixture(async () => { throw new Error('database unavailable'); });
  try {
    fixture.manager.store.upsert({ slug: 'admit', kind: 'cron', schedule: '0 9 * * *', prompt: 'run' });
    const runId = fixture.manager.fireNow('admit')?.runId;
    const run = await waitForRun(fixture.store, runId!, ['error']);
    assert.match(run.error ?? '', /database unavailable/);
  } finally {
    await fixture.cleanup();
  }
});

test('error classifier preserves transient and permanent categories', () => {
  assert.equal(classifyError('rate limit exceeded'), 'rate_limit');
  assert.equal(classifyError('provider unavailable'), 'provider-unavailable');
  assert.equal(classifyError('validation failed'), 'validation');
});

function createFixture(
  dispatch: (args: DispatchScheduleArgs) => Promise<ScheduleDispatchResult>,
  timeoutMs = 1_000,
) {
  const path = `/tmp/sim-one-schedule-${Date.now()}-${Math.random()}.sqlite`;
  const store = new ScheduleStore(path);
  const manager = new ScheduleManager({
    store,
    config: resolveScheduleConfig({}, {}),
    dispatch,
    settlementTimeoutMs: timeoutMs,
  });
  manager.start();
  return {
    manager,
    store,
    async cleanup() {
      await manager.stop();
      store.close();
      rmSync(path, { force: true });
    },
  };
}

function rejectWhenAborted(signal: AbortSignal | undefined): Promise<AgentReply> {
  return new Promise((_, reject) => {
    if (!signal) return;
    if (signal.aborted) {
      reject(signal.reason);
      return;
    }
    signal.addEventListener('abort', () => reject(signal.reason), { once: true });
  });
}

function settled(
  args: DispatchScheduleArgs,
  settle: (signal?: AbortSignal) => Promise<AgentReply> = () => Promise.resolve({
      text: 'done',
      data: {},
      submissionId: `sub-${args.instanceId}`,
    }),
): ScheduleDispatchResult {
  return {
    submissionId: `sub-${args.instanceId}`,
    acceptedAt: new Date().toISOString(),
    uid: `uid-${args.instanceId}`,
    instanceId: args.instanceId,
    settle,
  };
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForRun(
  store: ScheduleStore,
  runId: string,
  statuses: string[],
) {
  const deadline = Date.now() + 2_000;
  while (Date.now() < deadline) {
    const run = store.getRun(runId);
    if (run && statuses.includes(run.status)) return run;
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  throw new Error(`run ${runId} did not reach ${statuses.join(', ')}`);
}
