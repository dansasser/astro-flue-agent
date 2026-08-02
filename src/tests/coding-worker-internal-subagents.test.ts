import assert from 'node:assert/strict';
import test from 'node:test';

import { createCodingWorkerInternalSubagents } from '../engine/workers/coding-worker/subagents/index.js';
import { getCodingInternalSubagentComposition } from '../engine/workers/coding-worker/subagents/profile-factory.js';
import type { SubagentDefinition } from '@flue/runtime';

const MEMORY_TOOL_PREFIX = 'coding_task_';

function collectToolNames(profiles: SubagentDefinition[] | undefined, into: Set<string>): void {
  if (!profiles) return;
  for (const profile of profiles) {
    const composition = getCodingInternalSubagentComposition(profile);
    for (const tool of composition.tools) {
      if (typeof tool.name === 'string') {
        into.add(tool.name);
      }
    }
  }
}

test('coding-worker internal subagents do not receive Memory Helper tools (lead-only boundary)', () => {
  const profiles = createCodingWorkerInternalSubagents({
    workspaceRoot: '/tmp/cw-workspace',
    targetKind: 'project',
    projectId: 'proj-b',
    projectSlug: 'slug-b',
    projectRelativePath: 'projects/slug-b',
    env: {},
  });
  const names = new Set<string>();
  collectToolNames(profiles, names);
  const leaked = [...names].filter((n) => n.startsWith(MEMORY_TOOL_PREFIX));
  assert.deepEqual(leaked, [], `internal subagents must not expose memory tools, found: ${leaked.join(', ')}`);
});
