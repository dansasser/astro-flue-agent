import {
  init,
  type AgentReply,
  type DispatchReceipt,
} from '@flue/runtime';
import type { ScheduleRunInput, ScheduleTargetAgent } from './schedule-types.js';

export interface ScheduleDispatchResult {
  submissionId: string;
  acceptedAt: string;
  uid: string;
  instanceId: string;
  settlement: Promise<AgentReply>;
}

export interface DispatchScheduleArgs {
  instanceId: string;
  targetAgent: ScheduleTargetAgent;
  input: Omit<ScheduleRunInput, 'type' | 'instanceId' | 'targetAgent'>;
  signal?: AbortSignal;
}

export async function dispatchSchedule(args: DispatchScheduleArgs): Promise<ScheduleDispatchResult> {
  const { Orchestrator } = await import('../../agents/orchestrator.js');
  const input: ScheduleRunInput = {
    ...args.input,
    type: 'schedule',
    instanceId: args.instanceId,
    targetAgent: args.targetAgent,
  };
  const handle = init(Orchestrator, { id: args.instanceId });
  const receipt = await handle.dispatch({
    message: {
      kind: 'signal',
      type: 'schedule',
      tagName: 'scheduled_turn',
      attributes: {
        scheduleId: input.scheduleId,
        slug: input.slug,
        runId: input.runId,
        targetAgent: input.targetAgent,
      },
      body: JSON.stringify(input),
    },
    idempotencyKey: `${input.runId}:${args.instanceId}`,
    initialData: {
      scheduleId: input.scheduleId,
      runId: input.runId,
      targetAgent: input.targetAgent,
    },
  });

  return {
    submissionId: receipt.submissionId,
    acceptedAt: receipt.acceptedAt,
    uid: receipt.uid,
    instanceId: args.instanceId,
    settlement: handle.read(receipt, args.signal ? { signal: args.signal } : undefined),
  };
}

export type { DispatchReceipt };
