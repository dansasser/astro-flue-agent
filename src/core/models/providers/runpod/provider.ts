import { registerProvider } from '@flue/runtime';
import { providerContextWindow } from '../../../../core/models/card-limits.js';
import { resolveProviderCardEnv } from '../../../../core/models/env.js';
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

  registerProvider(runpodProviderId, {
    api: 'openai-completions',
    baseUrl: resolvedEnv.baseUrl ?? runpodDefaultChatBaseUrl,
    apiKey,
    contextWindow: Math.max(...cards.map(providerContextWindow)),
    maxTokens: Math.max(...cards.map((card) => card.maxOutputTokens)),
    models: Object.fromEntries(
      cards.map((card) => [
        card.modelId,
        {
          contextWindow: providerContextWindow(card),
          maxTokens: card.maxOutputTokens,
        },
      ]),
    ),
  });
}
