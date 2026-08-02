import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const toolSourceFiles = [
  'src/channels/telegram-client.ts',
  'src/engine/tools/knowledge-tool.ts',
  'src/engine/tools/memory-checklist-tools.ts',
  'src/engine/tools/memory-note-tools.ts',
  'src/engine/tools/memory-search-tools.ts',
  'src/engine/tools/memory-todo-tools.ts',
  'src/engine/tools/memory-tool.ts',
  'src/engine/tools/protocol-tool.ts',
  'src/engine/tools/rag-tool.ts',
  'src/engine/tools/runpod-image/generate-image-tool.ts',
  'src/engine/tools/runpod-image/list-image-artifacts-tool.ts',
  'src/engine/tools/runpod-image/record-image-artifact-tool.ts',
  'src/engine/tools/schedule-tools.ts',
  'src/engine/tools/web-research-tool.ts',
  'src/engine/workers/capability-manager/capability-manager-tools.ts',
  'src/engine/workers/coding-worker/capability-authoring/capability-authoring-tools.ts',
  'src/engine/workers/coding-worker/capability-authoring/capability-authoring.ts',
  'src/engine/workers/coding-worker/github/github-tools.ts',
  'src/engine/workers/coding-worker/tools/code-intelligence/code-intelligence-tools.ts',
  'src/engine/workers/coding-worker/tools/code-intelligence/lsp/lsp-tools.ts',
  'src/engine/workers/coding-worker/tools/coding-git-tools.ts',
  'src/engine/workers/coding-worker/tools/coding-implementer-tools.ts',
  'src/engine/workers/coding-worker/tools/coding-planning-tools.ts',
  'src/engine/workers/coding-worker/tools/coding-repo-tools.ts',
  'src/engine/workers/coding-worker/tools/coding-repo-workflow-tools.ts',
  'src/engine/workers/coding-worker/tools/coding-runtime-configuration-tools.ts',
  'src/engine/workers/coding-worker/tools/coding-schedule-tools.ts',
  'src/engine/workers/coding-worker/tools/coding-task-memory-tools.ts',
  'src/engine/workers/coding-worker/tools/coding-test-debug-tools.ts',
  'src/engine/workers/coding-worker/tools/coding-triage-tools.ts',
];

test('owned tool definitions use the Flue 2 contract', () => {
  for (const path of toolSourceFiles) {
    const source = readFileSync(path, 'utf8');
    assert.match(source, /defineTool\s*\(/, `${path} must define a Flue tool`);
    assert.doesNotMatch(source, /\bparameters\s*:/, `${path} still declares parameters`);
    assert.doesNotMatch(source, /\bexecute\s*:/, `${path} still declares execute`);
  }
});

test('generated runtime tool forms use input and run', () => {
  for (const path of [
    'scripts/generate-builtin-registry.mjs',
    'scripts/test-capability-product.mjs',
    'src/tests/fixtures/capabilities/test-tool/index.mjs',
  ]) {
    const source = readFileSync(path, 'utf8');
    assert.doesNotMatch(source, /\bparameters\s*:/, `${path} still emits parameters`);
    assert.doesNotMatch(source, /\bexecute\s*:/, `${path} still emits execute`);
  }
});

test('MCP resources use Flue 2 connection definitions and hooks', () => {
  const builtins = readFileSync('src/engine/capabilities/builtin-mcp.ts', 'utf8');
  const broker = readFileSync('src/engine/capabilities/mcp-broker.ts', 'utf8');
  const github = readFileSync(
    'src/engine/workers/coding-worker/github/github-mcp.ts',
    'utf8',
  );
  const orchestrator = readFileSync('src/agents/orchestrator.ts', 'utf8');

  for (const [path, source] of [
    ['src/engine/capabilities/builtin-mcp.ts', builtins],
    ['src/engine/capabilities/mcp-broker.ts', broker],
    ['src/engine/workers/coding-worker/github/github-mcp.ts', github],
  ] as const) {
    assert.doesNotMatch(source, /\bconnectMcpServer\b/, `${path} uses the beta MCP connector`);
  }
  assert.match(builtins, /defineMcpConnection/);
  assert.match(broker, /defineMcpConnection/);
  assert.match(github, /defineMcpConnection/);
  assert.match(orchestrator, /useMcpConnection/);
});

test('orchestrator restores authorized runtime capability mounts', () => {
  const source = readFileSync('src/agents/orchestrator.ts', 'utf8');

  assert.match(source, /useRuntimeCapabilities/);
  assert.match(source, /useTool\(/);
  assert.match(source, /useSubagent\(/);
  assert.match(source, /useMcpConnection\(/);
});
