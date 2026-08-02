import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createResearcherComposition,
  createResearcherSubagent,
  researcherAgentName,
} from '../engine/workers/researcher/researcher.js';

test('researcher subagent has web research tools', () => {
  const subagent = createResearcherSubagent('ollama-cloud/minimax-m3');
  const composition = createResearcherComposition('ollama-cloud/minimax-m3');

  assert.equal(subagent.name, researcherAgentName);
  assert.equal(subagent.model, 'ollama-cloud/minimax-m3');
  assert.match(subagent.description ?? '', /source-backed research/);
  assert.match(composition.instructions, /Researcher Workspace Instructions/);
  assert.match(composition.instructions, /Name: Athena/);
  assert.match(composition.instructions, /web_research/);
  assert.match(composition.instructions, /providerFailures/);
  assert.match(composition.instructions, /depth: "deep"/);
  assert.match(composition.instructions, /Runtime Capabilities/);
  assert.equal(composition.tools.some((tool) => tool.name === 'web_research'), true);
  assert.equal(composition.tools.some((tool) => tool.name === 'retrieve_context'), false);
});
