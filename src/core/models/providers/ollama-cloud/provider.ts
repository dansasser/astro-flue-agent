import { setProvider } from '@flue/runtime';
import { resolveProviderCardEnv } from '../../../../core/models/env.js';
import { createOpenAICompatibleProvider } from '../../../../core/models/pi-provider.js';
import { ollamaCloudProviderId } from '../../../../core/models/provider-ids.js';
import type { AgentModelCard } from '../../../../core/models/types.js';
import { ollamaCloudCards } from '../../../../core/models/providers/ollama-cloud/cards/index.js';

export const ollamaCloudDefaultBaseUrl = 'https://ollama.com/v1';

export function registerOllamaCloudProvider(
  env: Record<string, unknown> = process.env,
  cards: readonly AgentModelCard[] = ollamaCloudCards,
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
    id: ollamaCloudProviderId,
    name: 'Ollama Cloud',
    baseUrl: resolvedEnv.baseUrl ?? ollamaCloudDefaultBaseUrl,
    apiKey,
    cards,
  }));
}
