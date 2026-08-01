import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { join, resolve } from 'node:path';
import { parseEnv } from 'node:util';

if (!existsSync('.gorombo/sim-one-alpha/server.mjs')) {
  throw new Error('.gorombo/sim-one-alpha/server.mjs does not exist. Run pnpm run build before the TUI e2e test.');
}

if (!existsSync('.gorombo/sim-one-cli/cli.js')) {
  throw new Error('.gorombo/sim-one-cli/cli.js does not exist. Run pnpm run build:cli before the TUI e2e test.');
}

const port = await getFreePort();
const baseUrl = `http://127.0.0.1:${port}`;
const runtimeRoot = resolve('.gorombo');
const runtimeConfigPath = join(runtimeRoot, 'sim-one.config');
const runtimeModelConfigPath = join(runtimeRoot, 'gorombo.config.json');
if (!existsSync(runtimeConfigPath)) {
  throw new Error(
    `${runtimeConfigPath} does not exist. Build after creating sim-one.config.`,
  );
}
const runtimeConfigValues = parseEnv(readFileSync(runtimeConfigPath, 'utf8'));
const originalRuntimeModelConfig = readFileSync(runtimeModelConfigPath, 'utf8');
const testModelCard = process.env.SIM_ONE_TEST_MODEL_CARD?.trim();
const requestSecret = process.env.GOROMBO_HTTP_TEST_API_SECRET || runtimeConfigValues.API_SECRET || 'tui-e2e-test-secret';
const nodeArgs = ['.gorombo/sim-one-alpha/server.mjs'];
const codingWorkspaceRoot = mkdtempSync(join(runtimeRoot, '.test-tui-e2e-workspace-'));

const ollamaKey = runtimeConfigValues.OLLAMA_API_KEY || runtimeConfigValues.OLLAMA_CLOUD_API_KEY;
const runpodKey = runtimeConfigValues.RUNPOD_API_KEY;
if (!ollamaKey && !runpodKey) {
  throw new Error('A supported live-model credential is required in sim-one.config for the TUI e2e test.');
}

const modelEnv = {
  ...(ollamaKey ? { OLLAMA_API_KEY: ollamaKey } : {}),
  ...(runpodKey ? { RUNPOD_API_KEY: runpodKey } : {}),
  ...(runtimeConfigValues.RUNPOD_CHAT_BASE_URL
    ? { RUNPOD_CHAT_BASE_URL: runtimeConfigValues.RUNPOD_CHAT_BASE_URL }
    : {}),
  CODEX_BRAIN_LOCAL_API_KEY: runtimeConfigValues.CODEX_BRAIN_LOCAL_API_KEY || 'tui-e2e-placeholder',
  CODEX_BRAIN_LOCAL_API_URL: runtimeConfigValues.CODEX_BRAIN_LOCAL_API_URL || 'https://dt1.example.test/v1',
};

let stderr = '';
let stdout = '';
let child;
let runtimeModelConfigChanged = false;

try {
  if (testModelCard) {
    const runtimeModelConfig = JSON.parse(originalRuntimeModelConfig);
    runtimeModelConfig.models = {
      ...runtimeModelConfig.models,
      primary: testModelCard,
    };
    writeFileSync(runtimeModelConfigPath, `${JSON.stringify(runtimeModelConfig, null, 2)}\n`);
    runtimeModelConfigChanged = true;
  }

  child = spawn(process.execPath, nodeArgs, {
    cwd: process.cwd(),
    env: {
      ...process.env,
      ...modelEnv,
      PORT: String(port),
      API_SECRET: requestSecret,
      GOROMBO_RUNTIME_ROOT: runtimeRoot,
      GOROMBO_WORKSPACE_ROOT: codingWorkspaceRoot,
      GOROMBO_TEST_MODE: '1',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stderr.on('data', (chunk) => { stderr += String(chunk); });
  child.stdout.on('data', (chunk) => { stdout += String(chunk); });

  await waitForHealth();
  console.log('[tui-e2e] Server healthy, starting tests...');

  // Test 1: Direct agent prompt (simulates TUI sendMessage path via /agents/orchestrator)
  console.log('[tui-e2e] Test 1: Direct agent prompt via /agents/orchestrator...');
  const response1 = await fetch(
    `${baseUrl}/agents/orchestrator/tui-e2e-1?wait=result`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-secret': requestSecret,
      },
      body: JSON.stringify({ message: 'Hello, what can you do?' }),
    },
  );

  assertEqual(response1.status, 200, 'direct agent prompt should return 200');
  const result1 = await response1.json();
  const responseText = result1.text ?? result1.result?.text ?? result1.result;
  assertJson(
    typeof responseText === 'string' && responseText.length > 0,
    `direct agent prompt should return text. Got: ${JSON.stringify(result1).slice(0, 500)}`,
  );
  console.log('[tui-e2e] Test 1 PASSED: agent responded with text');

  // Test 2: Verify the response is not an error
  assertJson(
    !result1.isError && !result1.result?.isError,
    `agent response should not be an error. Got: ${JSON.stringify(result1).slice(0, 500)}`,
  );
  console.log('[tui-e2e] Test 2 PASSED: response is not an error');

  // Test 3: Verify CLI binary is runnable
  console.log('[tui-e2e] Test 3: Verifying CLI binary is runnable...');
  const cliResult = await runCliCommand(['--help']);
  assertEqual(cliResult.exitCode, 0, 'CLI --help should exit 0');
  assertJson(cliResult.stdout.length > 0, 'CLI --help should produce output');
  console.log('[tui-e2e] Test 3 PASSED: CLI binary is runnable');

  console.log('\n[tui-e2e] All TUI end-to-end tests passed.');
} finally {
  if (child) {
    await stopChild(child);
  }
  if (runtimeModelConfigChanged) {
    writeFileSync(runtimeModelConfigPath, originalRuntimeModelConfig);
  }
  rmSync(codingWorkspaceRoot, { recursive: true, force: true });
}

// --- Helpers ---

function runCliCommand(args) {
  return new Promise((resolve, reject) => {
    const cliChild = spawn(process.execPath, ['.gorombo/sim-one-cli/cli.js', ...args], {
      cwd: process.cwd(),
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 10_000,
    });
    let cliStdout = '';
    let cliStderr = '';
    cliChild.stdout.on('data', (chunk) => { cliStdout += String(chunk); });
    cliChild.stderr.on('data', (chunk) => { cliStderr += String(chunk); });
    cliChild.on('error', reject);
    cliChild.on('close', (code) => resolve({ exitCode: code ?? 1, stdout: cliStdout, stderr: cliStderr }));
  });
}

async function getFreePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  await new Promise((resolve) => server.close(() => resolve()));
  if (!address || typeof address === 'string') throw new Error('Could not allocate a local HTTP test port.');
  return address.port;
}

async function waitForHealth() {
  const deadline = Date.now() + 30_000;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/health`);
      if (response.ok) return;
    } catch (error) {
      lastError = error;
    }
    await sleep(500);
  }
  throw new Error(`Server did not become healthy: ${lastError instanceof Error ? lastError.message : String(lastError)}\n${stderr}`);
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message} (got ${actual}, expected ${expected})\nstdout:\n${stdout}\nstderr:\n${stderr}`);
  }
}

function assertJson(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function stopChild(childProcess) {
  if (childProcess.exitCode !== null || childProcess.signalCode !== null) return;
  childProcess.kill('SIGTERM');
  if (await waitForChildExit(childProcess, 5_000)) return;
  childProcess.kill('SIGKILL');
  if (!(await waitForChildExit(childProcess, 5_000))) {
    throw new Error('Server child process did not exit after SIGKILL.');
  }
}

function waitForChildExit(childProcess, timeoutMs) {
  if (childProcess.exitCode !== null || childProcess.signalCode !== null) return Promise.resolve(true);
  return new Promise((resolve) => {
    const timeout = setTimeout(() => { childProcess.off('exit', onExit); resolve(false); }, timeoutMs);
    const onExit = () => { clearTimeout(timeout); resolve(true); };
    childProcess.once('exit', onExit);
  });
}
