import {
  defineSubagent,
  type SubagentDefinition,
} from '@flue/runtime';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { resolveCapabilityPath } from '../../engine/capabilities/capability-loader.js';
import { dynamicImport } from '../../engine/capabilities/dynamic-import.js';
import {
  composeWorkspaceInstructions,
  workspaceFileOrder,
} from '../../workspace-loader.js';
import type { CapabilityRecord } from '../../engine/capabilities/types.js';

export interface WorkerLoaderResult {
  subagents: SubagentDefinition[];
  errors: Array<{ id: string; error: string }>;
}

export async function loadUserWorkers(
  workerRecords: CapabilityRecord[],
  env: Record<string, unknown> = process.env,
): Promise<WorkerLoaderResult> {
  const subagents: SubagentDefinition[] = [];
  const errors: Array<{ id: string; error: string }> = [];

  for (const record of workerRecords) {
    const modulePath = resolveCapabilityPath(env, 'worker', record.id) + '/index.mjs';
    try {
      const mod = await dynamicImport(modulePath);
      const exported = mod?.default ?? mod;
      const loaded = collectSubagents(exported, mod);

      if (loaded.length === 0) {
        const message =
          `No Flue 2 subagents found in worker module ${modulePath}. `
          + 'Expected a direct defineSubagent(...) default, array, or named export.';
        errors.push({ id: record.id, error: message });
        continue;
      }

      const workspaceDir = resolve(dirname(modulePath), 'workspace');
      if (!existsSync(workspaceDir)) {
        const message = `Worker ${record.id} has no workspace/ directory - all workers must have workspace persona files`;
        errors.push({ id: record.id, error: message });
        continue;
      }

      const existingFiles = workspaceFileOrder.filter((file) =>
        existsSync(resolve(workspaceDir, file)),
      );
      if (existingFiles.length === 0) {
        const message = `Worker ${record.id} workspace/ directory exists but contains no recognized persona files`;
        errors.push({ id: record.id, error: message });
        continue;
      }

      const workspaceInstructions = composeWorkspaceInstructions({
        workspaceDir,
        title: `Worker ${record.id} Workspace`,
        files: existingFiles,
      });

      for (const loadedSubagent of loaded) {
        subagents.push(wrapWithWorkspace(loadedSubagent, workspaceInstructions));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push({ id: record.id, error: message });
    }
  }

  return { subagents, errors };
}

function collectSubagents(
  exported: unknown,
  moduleNamespace: unknown,
): SubagentDefinition[] {
  const candidates = Array.isArray(exported)
    ? exported
    : isSubagentLike(exported)
      ? [exported]
      : moduleNamespace && typeof moduleNamespace === 'object'
        ? Object.values(moduleNamespace)
        : [];
  return candidates.filter(isSubagentLike);
}

function wrapWithWorkspace(
  subagent: SubagentDefinition,
  workspaceInstructions: string,
): SubagentDefinition {
  return defineSubagent({
    name: subagent.name,
    description: subagent.description,
    ...(subagent.model ? { model: subagent.model } : {}),
    ...(subagent.thinkingLevel
      ? { thinkingLevel: subagent.thinkingLevel }
      : {}),
    agent: function RuntimeWorkerDelegate() {
      const instructions = subagent.agent();
      return [workspaceInstructions, instructions]
        .filter((value): value is string =>
          typeof value === 'string' && value.trim().length > 0,
        )
        .join('\n\n');
    },
  });
}

function isSubagentLike(value: unknown): value is SubagentDefinition {
  return (
    typeof value === 'object'
    && value !== null
    && 'name' in value
    && typeof (value as { name: unknown }).name === 'string'
    && 'description' in value
    && typeof (value as { description: unknown }).description === 'string'
    && 'agent' in value
    && typeof (value as { agent: unknown }).agent === 'function'
  );
}
