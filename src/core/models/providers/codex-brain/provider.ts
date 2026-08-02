import { setProvider } from '@flue/runtime';
import { resolveProviderCardEnv } from '../../../../core/models/env.js';
import { createOpenAICompatibleProvider } from '../../../../core/models/pi-provider.js';
import { codexBrainProviderId } from '../../../../core/models/provider-ids.js';
import type { AgentModelCard } from '../../../../core/models/types.js';
import { codexBrainCards } from '../../../../core/models/providers/codex-brain/cards/index.js';

export function registerCodexBrainProvider(
  env: Record<string, unknown> = process.env,
  cards: readonly AgentModelCard[] = codexBrainCards,
): void {
  const resolvedEnv = resolveProviderCardEnv(cards, env);
  if (!resolvedEnv.apiKey || !resolvedEnv.baseUrl) {
    return;
  }

  setProvider(createOpenAICompatibleProvider({
    id: codexBrainProviderId,
    name: 'Codex Brain',
    baseUrl: resolvedEnv.baseUrl,
    apiKey: resolvedEnv.apiKey,
    cards,
  }));
}
