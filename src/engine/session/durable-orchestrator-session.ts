import {
  init,
  type AgentReadOptions,
  type AgentReply,
  type DeliveredMessageInput,
  type DispatchReceipt,
} from '@flue/runtime';
import type { OrchestratorInitialData } from './direct-agent-session.js';

export interface OrchestratorDispatchInput {
  instanceId: string;
  message: DeliveredMessageInput;
  initialData?: OrchestratorInitialData;
  idempotencyKey?: string;
  onEvent?: AgentReadOptions['onEvent'];
  signal?: AbortSignal;
}

export interface OrchestratorDispatchResult {
  instanceId: string;
  receipt: DispatchReceipt;
  reply: AgentReply;
}

export type OrchestratorDispatcher = (
  input: OrchestratorDispatchInput,
) => Promise<OrchestratorDispatchResult>;

export const dispatchOrchestratorMessage: OrchestratorDispatcher = async (input) => {
  const { Orchestrator } = await import('../../agents/orchestrator.js');
  const handle = init(Orchestrator, { id: input.instanceId });
  const receipt = await handle.dispatch({
    message: input.message,
    ...(input.initialData ? { initialData: input.initialData } : {}),
    ...(input.idempotencyKey ? { idempotencyKey: input.idempotencyKey } : {}),
  });
  const reply = await handle.read(receipt, {
    ...(input.onEvent ? { onEvent: input.onEvent } : {}),
    ...(input.signal ? { signal: input.signal } : {}),
  });

  return {
    instanceId: input.instanceId,
    receipt,
    reply,
  };
};
