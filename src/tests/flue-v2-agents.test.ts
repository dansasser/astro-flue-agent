import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const agentFiles = [
  'src/agents/orchestrator.ts',
  'src/engine/workers/researcher/researcher.ts',
  'src/engine/workers/coding-worker/coding-worker.ts',
];

test('registered Flue 2 agents are synchronous hook functions', () => {
  for (const path of agentFiles) {
    const source = readFileSync(path, 'utf8');
    assert.match(source, /^['"]use agent['"];?/);
    assert.match(source, /core\/models\/runtime\.js/);
    assert.match(source, /useModel\(/);
    assert.equal(source.match(/\buseModel\(/g)?.length, 1);
    assert.doesNotMatch(source, /export async function/);
    assert.doesNotMatch(source, /\bcreateAgent\b/);
    assert.doesNotMatch(source, /\bdefineAgentProfile\b/);
    assert.doesNotMatch(source, /\bAgentProfile\b/);
    assert.doesNotMatch(source, /export default/);
  }

  assert.match(readFileSync(agentFiles[0], 'utf8'), /export function Orchestrator\(/);
  assert.match(readFileSync(agentFiles[1], 'utf8'), /export function Researcher\(/);
  assert.match(readFileSync(agentFiles[2], 'utf8'), /export function CodingWorker\(/);
  assert.match(readFileSync(agentFiles[0], 'utf8'), /Orchestrator\.agentName = 'orchestrator'/);
  assert.match(readFileSync(agentFiles[1], 'utf8'), /Researcher\.agentName = 'researcher'/);
  assert.match(readFileSync(agentFiles[2], 'utf8'), /CodingWorker\.agentName = 'coding-worker'/);
});

test('worker skill resources use Flue 2 imports and complete inline definitions', () => {
  const source = readFileSync(
    'src/engine/workers/coding-worker/skills.ts',
    'utf8',
  );

  assert.doesNotMatch(source, /with \{ type: ['"]skill['"] \}/);
  assert.match(source, /defineSkill\(\{/);
  assert.equal(source.match(/instructions:/g)?.length, 5);
});

test('orchestrator mounts only lead-worker Flue 2 delegates', () => {
  const source = readFileSync('src/agents/orchestrator.ts', 'utf8');

  assert.match(source, /subagents:\s*\[/);
  assert.match(source, /createResearcherSubagent\(/);
  assert.match(source, /createCodingWorkerSubagent\(/);
  assert.match(source, /createCapabilityManagerSubagent\(/);
  assert.match(source, /useSubagent\(subagent\)/);
  assert.doesNotMatch(source, /coding-worker-(?:triage|implementer|test-debug|code-review|github)/);
  assert.match(source, /sandbox:\s*createOrchestratorSandbox/);
  assert.match(source, /useSandbox\(composition\.sandbox/);
  assert.match(source, /tools:\s*\(\)\s*=>\s*\[\]/);
});

test('application router mounts the named orchestrator export', () => {
  const source = readFileSync('src/app.ts', 'utf8');

  assert.match(source, /import \{ Orchestrator \} from ['"]\.\/agents\/orchestrator\.js['"]/);
  assert.match(source, /createAgentRouter\(Orchestrator\)/);
});

test('worker factories return Flue 2 subagent definitions', () => {
  const workerFiles = [
    'src/engine/workers/researcher/researcher.ts',
    'src/engine/workers/capability-manager/capability-manager.ts',
    'src/engine/workers/coding-worker/coding-worker.ts',
    'src/engine/workers/coding-worker/subagents/profile-factory.ts',
  ];

  for (const path of workerFiles) {
    const source = readFileSync(path, 'utf8');
    assert.match(source, /\bdefineSubagent\b/);
    assert.match(source, /\buseTool\b/);
    assert.doesNotMatch(source, /\bdefineAgentProfile\b/);
    assert.doesNotMatch(source, /\bAgentProfile\b/);
  }
});

test('coding worker owns its nested delegates and host sandbox', () => {
  const source = readFileSync(
    'src/engine/workers/coding-worker/coding-worker.ts',
    'utf8',
  );

  assert.match(source, /useSubagent\(/);
  assert.match(source, /useSandbox\(local\(/);
  assert.match(source, /resolveCodingWorkerWorkspaceRoot\(process\.env\)/);
  assert.match(source, /runtimeCodingWorkerGithubMcp = await prepareCodingWorkerGithubMcp/);
  assert.match(source, /githubMcp: runtimeCodingWorkerGithubMcp/);
  assert.doesNotMatch(source, /export async function createCodingWorkerSubagent/);

  const orchestratorSource = readFileSync('src/agents/orchestrator.ts', 'utf8');
  assert.match(orchestratorSource, /githubMcp: runtimeCodingWorkerGithubMcp/);
});
