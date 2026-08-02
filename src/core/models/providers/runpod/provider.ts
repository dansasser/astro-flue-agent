import { setProvider } from '@flue/runtime';
import { resolveProviderCardEnv } from '../../../../core/models/env.js';
import { createOpenAICompatibleProvider } from '../../../../core/models/pi-provider.js';
import { runpodProviderId } from '../../../../core/models/provider-ids.js';
import type { AgentModelCard } from '../../../../core/models/types.js';
import { runpodCards } from '../../../../core/models/providers/runpod/cards/index.js';

export const runpodDefaultChatBaseUrl =
  'https://api.runpod.ai/v2/moonshot-kimi/openai/v1';

export function registerRunpodProvider(
  env: Record<string, unknown> = process.env,
  cards: readonly AgentModelCard[] = runpodCards,
): void {
  if (!cards.length) {
    return;
  }

  const resolvedEnv = resolveProviderCardEnv(cards, env);
  const apiKey = resolvedEnv.apiKey;
  if (!apiKey) {
    return;
  }

  setProvider(createOpenAICompatibleProvider({
    id: runpodProviderId,
    name: 'RunPod',
    baseUrl: resolvedEnv.baseUrl ?? runpodDefaultChatBaseUrl,
    apiKey,
    cards,
  }));
}
