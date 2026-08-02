import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { join, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { startDeterministicTelegramFixtures } from './deterministic-telegram-provider.mjs';
import { acquireProductArtifactLock } from './product-artifact-lock.mjs';

const runtimeRoot = resolve('.gorombo');
const serverPath = join(runtimeRoot, 'sim-one-alpha', 'server.mjs');
const configPath = join(runtimeRoot, 'gorombo.config.json');
if (!existsSync(serverPath) || !existsSync(configPath)) {
  throw new Error('Packaged server/config missing. Run pnpm run build before the Telegram product test.');
}

const releaseArtifactLock = await acquireProductArtifactLock();
const workspaceRoot = mkdtempSync(join(runtimeRoot, '.test-telegram-product-'));
const flueV2DatabasePath = join(workspaceRoot, 'flue-v2.sqlite');
const sessionDatabasePath = join(workspaceRoot, 'sessions.sqlite');
const originalConfig = readFileSync(configPath, 'utf8');
const fixtures = await startDeterministicTelegramFixtures();
let child;
let stderr = '';
let stdout = '';

try {
  const config = JSON.parse(originalConfig);
  const previousPrimary = config.models?.primary;
  config.models = {
    ...config.models,
    primary: 'kimi-k2-6-runpod',
    ...(config.models?.backup === 'kimi-k2-6-runpod' && previousPrimary !== 'kimi-k2-6-runpod'
      ? { backup: previousPrimary }
      : {}),
  };
  config.storage = {
    ...config.storage,
    flueV2DatabasePath,
    flueDatabasePath: join(workspaceRoot, 'flue-beta.sqlite'),
    sessionDatabasePath,
    vectorStorePath: join(workspaceRoot, 'vectors'),
  };
  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);

  child = await startGateway();
  await postTelegramUpdate(child.port, 100, 500, 'first message');
  await waitFor(() => fixtures.telegramMessages().length === 1, 'first Telegram reply');
  await stopGateway(child.process);
  child = undefined;

  child = await startGateway();
  await postTelegramUpdate(child.port, 101, 501, 'second message after restart');
  await waitFor(() => fixtures.telegramMessages().length === 2, 'second Telegram reply');
  await stopGateway(child.process);
  child = undefined;

  const outbound = fixtures.telegramMessages();
  assert(outbound.length === 2, `expected two outbound Telegram messages, got ${outbound.length}`);
  assert(outbound.every((message) => String(message.chat_id) === '9001'), 'outbound Telegram destination changed');
  assert(String(outbound[0].text).includes('telegram:100'), 'first reply did not correspond to update 100');
  assert(String(outbound[1].text).includes('telegram:101'), 'second reply did not correspond to update 101');

  const database = new DatabaseSync(flueV2DatabasePath, { readOnly: true });
  const submissions = database.prepare(`
    SELECT submission_id, session_key, status
    FROM flue_agent_submissions
    ORDER BY sequence
  `).all();
  database.close();
  assert(submissions.length === 2, `expected two persisted Telegram submissions, got ${submissions.length}`);
  assert(new Set(submissions.map((row) => row.session_key)).size === 1, 'Telegram restart created a second Flue instance');
  assert(submissions.every((row) => row.status === 'settled'), 'Telegram submission did not settle');
  assert(String(submissions[0].session_key).includes('telegram:'), 'persisted instance is not Telegram-scoped');

  console.log('[telegram-product] authenticated webhooks admitted before and after gateway restart.');
  console.log('[telegram-product] outbound Bot API replies reached the same bound chat.');
  console.log(`[telegram-product] one persisted Flue session handled ${submissions.length} settled submissions.`);
  console.log('[telegram-product] PASS');
} finally {
  if (child) {
    await stopGateway(child.process);
  }
  await fixtures.close();
  writeFileSync(configPath, originalConfig);
  rmSync(workspaceRoot, { recursive: true, force: true });
  await releaseArtifactLock();
}

async function startGateway() {
  const port = await getFreePort();
  stderr = '';
  stdout = '';
  const processHandle = spawn(process.execPath, [serverPath], {
    cwd: runtimeRoot,
    env: {
      ...process.env,
      PORT: String(port),
      API_SECRET: 'telegram-product-api-secret',
      GOROMBO_RUNTIME_ROOT: runtimeRoot,
      GOROMBO_WORKSPACE_ROOT: workspaceRoot,
      GOROMBO_TEST_MODE: '1',
      RUNPOD_API_KEY: 'telegram-product-model-key',
      RUNPOD_CHAT_BASE_URL: fixtures.modelBaseUrl,
      CODEX_BRAIN_LOCAL_API_KEY: 'telegram-product-placeholder',
      CODEX_BRAIN_LOCAL_API_URL: 'https://dt1.example.test/v1',
      TELEGRAM_BOT_TOKEN: 'telegram-product-token',
      TELEGRAM_WEBHOOK_SECRET_TOKEN: 'telegram-product-webhook-secret',
      TELEGRAM_APPROVED_USER_IDS: '42',
      TELEGRAM_API_ROOT: fixtures.telegramApiRoot,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  processHandle.stdout.on('data', (chunk) => {
    stdout += String(chunk);
  });
  processHandle.stderr.on('data', (chunk) => {
    stderr += String(chunk);
  });
  await waitForHealth(port, processHandle);
  return { process: processHandle, port };
}

async function postTelegramUpdate(port, updateId, messageId, text) {
  const response = await fetch(`http://127.0.0.1:${port}/channels/telegram/webhook`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-telegram-bot-api-secret-token': 'telegram-product-webhook-secret',
    },
    body: JSON.stringify({
      update_id: updateId,
      message: {
        message_id: messageId,
        date: Math.floor(Date.now() / 1000),
        text,
        chat: { id: 9001, type: 'private', first_name: 'Dan' },
        from: { id: 42, is_bot: false, first_name: 'Dan', username: 'dan' },
      },
    }),
  });
  const body = await response.text();
  assert(response.status === 200, `Telegram webhook returned ${response.status}: ${body}\n${stderr}`);
}

async function waitForHealth(port, processHandle) {
  await waitFor(async () => {
    if (processHandle.exitCode !== null) {
      throw new Error(`gateway exited before health check (${processHandle.exitCode})\n${stderr}`);
    }
    try {
      const response = await fetch(`http://127.0.0.1:${port}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }, 'gateway health', 45_000);
}

async function waitFor(predicate, label, timeoutMs = 90_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await predicate()) {
      return;
    }
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 200));
  }
  throw new Error(`Timed out waiting for ${label}.\n${diagnosticState()}`);
}

function diagnosticState() {
  let submissions = [];
  if (existsSync(flueV2DatabasePath)) {
    const database = new DatabaseSync(flueV2DatabasePath, { readOnly: true });
    submissions = database.prepare(`
      SELECT submission_id, session_key, status, error
      FROM flue_agent_submissions
      ORDER BY sequence
    `).all();
    database.close();
  }
  const modelRequests = fixtures.modelRequests();
  return JSON.stringify({
    submissions,
    modelRequestCount: modelRequests.length,
    modelRequestLastRoles: modelRequests.map((request) =>
      Array.isArray(request.messages) ? request.messages.slice(-3).map((message) => ({
        role: message.role,
        toolCallId: message.tool_call_id,
        content: typeof message.content === 'string' ? message.content.slice(0, 500) : message.content,
      })) : []),
    telegramRequests: fixtures.telegramRequests(),
    telegramMessages: fixtures.telegramMessages(),
    stdout: stdout.slice(-4000),
    stderr: stderr.slice(-4000),
  }, null, 2);
}

async function stopGateway(processHandle) {
  if (processHandle.exitCode !== null || processHandle.signalCode !== null) {
    return;
  }
  processHandle.kill('SIGTERM');
  if (await waitForExit(processHandle, 10_000)) {
    return;
  }
  processHandle.kill('SIGKILL');
  if (!(await waitForExit(processHandle, 5_000))) {
    throw new Error('Telegram product gateway did not exit after SIGKILL.');
  }
}

function waitForExit(processHandle, timeoutMs) {
  if (processHandle.exitCode !== null || processHandle.signalCode !== null) {
    return Promise.resolve(true);
  }
  return new Promise((resolvePromise) => {
    const timeout = setTimeout(() => {
      processHandle.off('exit', onExit);
      resolvePromise(false);
    }, timeoutMs);
    const onExit = () => {
      clearTimeout(timeout);
      resolvePromise(true);
    };
    processHandle.once('exit', onExit);
  });
}

async function getFreePort() {
  const server = createServer();
  await new Promise((resolvePromise, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolvePromise);
  });
  const address = server.address();
  await new Promise((resolvePromise) => server.close(resolvePromise));
  if (!address || typeof address === 'string') {
    throw new Error('Could not allocate a local Telegram product port.');
  }
  return address.port;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
