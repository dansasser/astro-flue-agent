import type {
  McpConnectionDefinition,
  Skill,
  SubagentDefinition,
  ToolDefinition,
} from '@flue/runtime';
import { createCapabilityStore } from './capability-store.js';
import { loadPromotedUserCapabilities } from './capability-loader.js';
import { loadUserSkills } from './skill-loader.js';
import { loadUserTools } from './tool-loader.js';
import { loadUserWorkers } from './worker-loader.js';
import { createUserMcpConnections } from './mcp-broker.js';

export interface RuntimeCapabilitySnapshot {
  skills: Skill[];
  tools: ToolDefinition[];
  subagents: SubagentDefinition[];
  mcpConnections: McpConnectionDefinition[];
  failures: Array<{ kind: string; id: string; error: string }>;
}

export async function loadRuntimeCapabilitySnapshot(
  env: Record<string, unknown> = process.env,
): Promise<RuntimeCapabilitySnapshot> {
  const store = createCapabilityStore({ env });
  let records;
  try {
    records = loadPromotedUserCapabilities({ store, env });
  } finally {
    store.close();
  }

  const [toolResult, workerResult] = await Promise.all([
    loadUserTools(records.tools, env),
    loadUserWorkers(records.workers, env),
  ]);
  const skillResult = loadUserSkills(records.skills, env);
  const mcpResult = createUserMcpConnections(records.mcp, env);
  const failures = [
    ...records.failures,
    ...skillResult.errors.map((failure) => ({ kind: 'skill', ...failure })),
    ...toolResult.errors.map((failure) => ({ kind: 'tool', ...failure })),
    ...workerResult.errors.map((failure) => ({ kind: 'worker', ...failure })),
    ...mcpResult.failures.map((failure) => ({ kind: 'mcp', ...failure })),
  ];

  for (const failure of failures) {
    console.error(
      `[capabilities] Failed to load ${failure.kind} ${failure.id}: ${failure.error}`,
    );
  }

  return {
    skills: skillResult.skills,
    tools: toolResult.tools,
    subagents: workerResult.subagents,
    mcpConnections: mcpResult.connections,
    failures,
  };
}
