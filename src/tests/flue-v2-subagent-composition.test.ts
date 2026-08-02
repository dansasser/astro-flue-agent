import assert from 'node:assert/strict';
import test from 'node:test';
import { defineTool } from '@flue/runtime';
import {
  createCodingInternalSubagent,
  getCodingInternalSubagentComposition,
} from '../engine/workers/coding-worker/subagents/profile-factory.js';

test('coding-worker internal delegates are valid Flue 2 definitions with separate composition data', () => {
  const tool = defineTool({
    name: 'inspect_fixture',
    description: 'Inspects a test fixture.',
    run: () => 'fixture inspected',
  });
  const subagent = createCodingInternalSubagent({
    kind: 'triage',
    name: 'coding-worker-fixture',
    description: 'Fixture delegate for the Flue 2 composition contract.',
    workspacePath: 'workers/coding-worker/subagents/triage/workspace',
    runtimeRole: 'Inspect the fixture and return structured findings.',
    model: 'ollama-cloud/minimax-m3',
    tools: [tool],
  });
  const composition = getCodingInternalSubagentComposition(subagent);

  assert.equal(subagent.name, 'coding-worker-fixture');
  assert.equal(subagent.model, 'ollama-cloud/minimax-m3');
  assert.equal(typeof subagent.agent, 'function');
  assert.equal(Object.isFrozen(subagent), true);
  assert.deepEqual(composition.tools.map((entry) => entry.name), [
    'inspect_fixture',
  ]);
  assert.match(composition.instructions, /worker-local internal subagent/);
  assert.equal('tools' in subagent, false);
  assert.equal('instructions' in subagent, false);
});
