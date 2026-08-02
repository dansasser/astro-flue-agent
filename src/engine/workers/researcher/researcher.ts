'use agent';

import {
  defineSubagent,
  type AgentProps,
  type McpConnectionDefinition,
  type SubagentDefinition,
  type ToolDefinition,
  useModel,
  useMcpConnection,
  useTool,
} from '@flue/runtime';
import '../../../core/models/runtime.js';
import { configureRuntimeModels } from '../../../core/models/index.js';
import type { AgentModelCard } from '../../../core/models/types.js';
import {
  composeWorkspaceInstructions,
  resolveWorkspaceDirectory,
} from '../../../workspace-loader.js';
import { calculateContextBudget } from '../../../engine/session/context-budget.js';
import { webResearchTool } from '../../../engine/tools/index.js';
import { astroDocsMcpConnection } from '../../capabilities/builtin-mcp.js';

export const researcherAgentName = 'researcher';
export const researcherDescription =
  'source-backed research subagent that uses the retrieval workflow and Ollama Search.';

export const researcherInstructions = [
  composeWorkspaceInstructions({
    workspaceDir: resolveWorkspaceDirectory('workers/researcher/workspace'),
    title: 'Researcher Workspace Instructions',
  }),
  createResearcherRuntimeCapabilityBlock(),
].join('\n\n');

/**
 * Creates the reusable researcher Flue 2 delegate used by the orchestrator.
 */
export function createResearcherSubagent(model?: string): SubagentDefinition {
  const composition = createResearcherComposition(model);
  return defineSubagent({
    name: composition.name,
    description: composition.description,
    ...(composition.model ? { model: composition.model } : {}),
    agent: function ResearcherDelegate() {
      mountResearcherTools(composition.tools);
      mountResearcherMcpConnections(composition.mcpConnections);
      return composition.instructions;
    },
  });
}

export interface ResearcherComposition {
  name: string;
  description: string;
  model?: string;
  instructions: string;
  tools: ToolDefinition[];
  mcpConnections: McpConnectionDefinition[];
}

export function createResearcherComposition(model?: string): ResearcherComposition {
  return {
    name: researcherAgentName,
    description: researcherDescription,
    ...(model ? { model } : {}),
    instructions: researcherInstructions,
    tools: [webResearchTool],
    mcpConnections: [astroDocsMcpConnection],
  };
}

export function Researcher(_props: AgentProps): string {
  const models = configureRuntimeModels(process.env);
  const selectedModelCard = models.selectedModelCard;
  const composition = createResearcherComposition(selectedModelCard.specifier);

  useModel(selectedModelCard.specifier, {
    compaction: createResearchCompactionConfig(selectedModelCard),
  });
  mountResearcherTools(composition.tools);
  mountResearcherMcpConnections(composition.mcpConnections);
  return composition.instructions;
}
Researcher.agentName = 'researcher';

function mountResearcherTools(tools: ToolDefinition[]): void {
  for (const tool of tools) {
    useTool(tool);
  }
}

function mountResearcherMcpConnections(
  connections: McpConnectionDefinition[],
): void {
  for (const connection of connections) {
    useMcpConnection(connection);
  }
}

/**
 * Creates the researcher compaction policy from the selected model card budget.
 */
function createResearchCompactionConfig(modelCard: AgentModelCard): {
  reserveTokens: number;
  keepRecentTokens: number;
  model: string;
} {
  const budget = calculateContextBudget(modelCard);

  return {
    reserveTokens: budget.compactionReserveTokens,
    keepRecentTokens: budget.keepRecentTokens,
    model: modelCard.specifier,
  };
}

/**
 * Describes the researcher capabilities that are actually wired at runtime.
 */
function createResearcherRuntimeCapabilityBlock(): string {
  return `# Runtime Capabilities

The following capabilities are actually attached to this researcher profile at runtime:

- Tool: \`web_research\`
- MCP: \`astro-docs\` (search Astro framework documentation)

Use only attached tools and provider capabilities. If a workspace file mentions a future capability that is not attached at runtime, report that limitation instead of pretending it exists.`;
}
