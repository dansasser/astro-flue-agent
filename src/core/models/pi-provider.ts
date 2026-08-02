import {
  createProvider,
  type Model,
  type Provider,
} from '@earendil-works/pi-ai';
import { openAICompletionsApi } from '@earendil-works/pi-ai/api/openai-completions.lazy';
import { providerContextWindow } from './card-limits.js';
import type { AgentModelCard } from './types.js';

const unknownCost = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
} as const;

export function createOpenAICompatibleProvider(options: {
  id: string;
  name: string;
  baseUrl: string;
  apiKey: string;
  cards: readonly AgentModelCard[];
}): Provider<'openai-completions'> {
  return createProvider({
    id: options.id,
    name: options.name,
    baseUrl: options.baseUrl,
    auth: {
      apiKey: {
        name: `${options.name} API key`,
        resolve: async () => ({
          auth: { apiKey: options.apiKey },
          source: 'SIM-ONE runtime configuration',
        }),
      },
    },
    models: options.cards.map((card) => agentModelCardToPiModel(card, options.baseUrl)),
    api: openAICompletionsApi(),
  });
}

export function agentModelCardToPiModel(
  card: AgentModelCard,
  baseUrl: string,
): Model<'openai-completions'> {
  return {
    id: card.modelId,
    name: card.displayName,
    api: 'openai-completions',
    provider: card.providerId,
    baseUrl,
    reasoning: card.capabilities.includes('thinking'),
    input: card.capabilities.includes('vision') ? ['text', 'image'] : ['text'],
    cost: unknownCost,
    contextWindow: providerContextWindow(card),
    maxTokens: card.maxOutputTokens,
  };
}
