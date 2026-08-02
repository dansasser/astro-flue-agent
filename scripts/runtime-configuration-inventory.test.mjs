import assert from 'node:assert/strict';
import {
  readdirSync,
  readFileSync,
  statSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { parseEnv } from 'node:util';

const projectRoot = resolve('.');
const scanRoots = ['src', 'scripts', 'sim-one-cli/src', 'tui/ratatui/src'];
const extensions = new Set(['.ts', '.tsx', '.mjs', '.rs']);
const excludedSegments = new Set([
  'node_modules',
  'tests',
  'workspace',
  'dist',
  '.tmp',
]);
const excludedFiles = new Set([
  resolve('src/core/config/runtime-environment.ts'),
  resolve('scripts/runtime-configuration-inventory.test.mjs'),
  resolve('scripts/runtime-configuration-files.test.mjs'),
]);
const classifiedNonOwnerKeys = new Set([
  'GOROMBO_CAPABILITY_DIR',
  'GOROMBO_CODING_REPO_PATH',
  'GOROMBO_CODING_WORKSPACE_ROOT',
  'GOROMBO_HTTP_SMOKE_API_SECRET',
  'GOROMBO_HTTP_SMOKE_PORT',
  'GOROMBO_HTTP_TEST_API_SECRET',
  'GOROMBO_MODEL',
  'GOROMBO_MODEL_BACKUP',
  'GOROMBO_RESEARCH_ACTOR_ID',
  'GOROMBO_RESEARCH_CONVERSATION_ID',
  'GOROMBO_RESEARCH_FETCH_TOP_K',
  'GOROMBO_RESEARCH_OPERATION_ID',
  'GOROMBO_RESEARCH_SESSION',
  'GOROMBO_RUNTIME_ROOT',
  'GOROMBO_SMOKE_API_SECRET',
  'GOROMBO_SMOKE_PORT',
  'GOROMBO_SMOKE_REAL_MODEL',
  'GOROMBO_TEST_MODE',
  'GOROMBO_WEB_SEARCH_TIMEOUT_MS',
  'SIM_ONE_BUILD_MODE',
  'SIM_ONE_GITHUB_TOKEN_FILE',
  'SIM_ONE_NODE',
  'SIM_ONE_PRODUCT_PATH',
  'SIM_ONE_SERVER_PATH',
  'SIM_ONE_TEST_MODEL_CARD',
  'SIM_ONE_TUI_EXIT_AFTER_STARTUP',
  'SIM_ONE_TUI_PATH',
  'SIM_ONE_TUI_TEST_PROMPT',
  'SIM_ONE_TUI_TEST_PROMPTS',
  'SIM_ONE_TUI_TEST_STARTUP',
  'TELEGRAM_API_BASE',
]);

test('production configuration keys are registered and represented in the canonical example', () => {
  const registered = new Set(
    Object.keys(
      parseEnv(readFileSync(resolve('sim-one.config.example'), 'utf8')),
    ),
  );
  const discovered = new Set();

  for (const root of scanRoots) {
    for (const file of walk(resolve(projectRoot, root))) {
      if (excludedFiles.has(file)) {
        continue;
      }
      const source = readFileSync(file, 'utf8');
      for (const match of source.matchAll(
        /\b(?:GOROMBO_[A-Z0-9_]+|SIM_ONE_[A-Z0-9_]+|OLLAMA_[A-Z0-9_]+|CODEX_BRAIN_[A-Z0-9_]+|TELEGRAM_[A-Z0-9_]+|RUNPOD_[A-Z0-9_]+|MCP_AUTH_TOKEN|MCP_TOKEN|API_SECRET|GITHUB_PERSONAL_ACCESS_TOKEN)\b/g,
      )) {
        const key = match[0];
        if (!key.endsWith('_') && !classifiedNonOwnerKeys.has(key)) {
          discovered.add(key);
        }
      }
    }
  }

  assert.deepEqual(
    [...discovered].filter((key) => !registered.has(key)).sort(),
    [],
    'production code references unregistered owner configuration keys',
  );
  assert.deepEqual(
    [...registered].filter((key) => !discovered.has(key)).sort(),
    [],
    'registry/example declares keys with no production consumer',
  );
});

function* walk(root) {
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (excludedSegments.has(entry.name)) {
      continue;
    }
    const path = join(root, entry.name);
    if (entry.isDirectory()) {
      yield* walk(path);
      continue;
    }
    const extension = entry.name.slice(entry.name.lastIndexOf('.'));
    if (
      extensions.has(extension) &&
      statSync(path).isFile() &&
      !entry.name.includes('.test.')
    ) {
      yield path;
    }
  }
}
