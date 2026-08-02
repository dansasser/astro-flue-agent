import {
  agentConversationUrl,
  isFlueConversationSnapshot,
  type FlueConversationSnapshot,
} from './flue-conversation.js';

export interface FlueConversationSnapshotRequest {
  instanceId: string;
  headers: Headers;
  env: Record<string, unknown>;
}

export type FlueConversationRequester = (
  path: string,
  init: RequestInit,
  env: Record<string, unknown>,
) => Response | Promise<Response>;

export async function loadFlueConversationSnapshot(
  request: FlueConversationRequester,
  input: FlueConversationSnapshotRequest,
): Promise<FlueConversationSnapshot | null> {
  const response = await request(
    `${agentConversationUrl(input.instanceId)}?view=history`,
    { method: 'GET', headers: input.headers },
    input.env,
  );
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Flue conversation history returned HTTP ${response.status}.`);
  }
  const body = await response.json() as unknown;
  if (!isFlueConversationSnapshot(body)) {
    throw new Error('Flue conversation history returned an invalid snapshot.');
  }
  return body;
}
