import {
  defineSubagent,
  type SubagentDefinition,
  type ToolDefinition,
  useTool,
} from '@flue/runtime';
import {
  composeWorkspaceInstructions,
  resolveWorkspaceDirectory,
} from '../../../../workspace-loader.js';
import type { CodingSubagentKind } from '../../../../engine/workers/coding-worker/types.js';

export interface CodingInternalSubagentConfig {
  kind: CodingSubagentKind;
  name: string;
  description: string;
  workspacePath: string;
  runtimeRole: string;
  model?: string;
  tools?: ToolDefinition[];
}

export interface CodingInternalSubagentComposition {
  instructions: string;
  tools: ToolDefinition[];
}

const compositionBySubagent = new WeakMap<
  SubagentDefinition,
  CodingInternalSubagentComposition
>();

export function createCodingInternalSubagent(
  config: CodingInternalSubagentConfig,
): SubagentDefinition {
  const composition = createCodingInternalSubagentComposition(config);
  const subagent = defineSubagent({
    name: config.name,
    description: config.description,
    ...(config.model ? { model: config.model } : {}),
    agent: function CodingInternalDelegate() {
      for (const tool of composition.tools) {
        useTool(tool);
      }
      return composition.instructions;
    },
  });
  compositionBySubagent.set(subagent, composition);
  return subagent;
}

export function createCodingInternalSubagentComposition(
  config: CodingInternalSubagentConfig,
): CodingInternalSubagentComposition {
  const instructions = [
    composeWorkspaceInstructions({
      workspaceDir: resolveWorkspaceDirectory(config.workspacePath),
      title: `${config.name} Workspace Instructions`,
    }),
    createInternalRuntimeBlock(config),
  ].join('\n\n');

  return {
    instructions,
    tools: config.tools ?? [],
  };
}

export function getCodingInternalSubagentComposition(
  subagent: SubagentDefinition,
): CodingInternalSubagentComposition {
  const composition = compositionBySubagent.get(subagent);
  if (!composition) {
    throw new Error(`Unknown coding-worker internal subagent: ${subagent.name}`);
  }
  return composition;
}

function createInternalRuntimeBlock(config: CodingInternalSubagentConfig): string {
  return `# Runtime Capabilities

This is a worker-local internal subagent owned by the coding-worker lead.

Role: ${config.runtimeRole}

The main orchestrator must not call this subagent directly. The coding-worker lead decides when this subagent is needed and passes focused context into its child session.

Return structured findings, evidence, risks, and next actions to the coding-worker lead. Emit public trace summaries through the lead; do not expose raw hidden thinking or full internal prompts.`;
}
