import { runpodProviderId } from '../../../../../core/models/provider-ids.js';
import type { AgentModelCard } from '../../../../../core/models/types.js';

export const kimiK26RunpodCard: AgentModelCard = {
  key: 'kimi-k2-6-runpod',
  providerId: runpodProviderId,
  modelId: 'kimi-k2.6',
  specifier: `${runpodProviderId}/kimi-k2.6`,
  displayName: 'Kimi K2.6 on RunPod',
  description: 'RunPod-hosted general-purpose agentic model with thinking and tool use.',
  roles: ['agentic-chat', 'tool-use', 'coding', 'rag', 'protocol-reasoning'],
  capabilities: ['tools', 'thinking', 'coding', 'long-context', 'vision', 'cloud'],
  contextWindow: 262_144,
  providerReportedContextWindow: 262_144,
  maxOutputTokens: 32_768,
  maxTokens: 32_768,
  enabled: true,
  env: {
    apiKey: 'RUNPOD_API_KEY',
    baseUrl: 'RUNPOD_CHAT_BASE_URL',
  },
  source: {
    name: 'RunPod Moonshot Kimi public endpoint reference',
    url: 'https://docs.runpod.io/public-endpoints/models/moonshot-kimi',
    checkedAt: '2026-08-01',
    notes:
      'RunPod reports a 262144-token context window for Kimi K2.6. The 32768-token output limit is a conservative project ceiling for agent execution.',
  },
};
