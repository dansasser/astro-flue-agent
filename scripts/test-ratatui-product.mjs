import { spawn } from 'node:child_process';
import {
  chmodSync,
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { parseEnv } from 'node:util';
import { findExternalDependencyLinks } from './portable-node-modules.mjs';
import { acquireProductArtifactLock } from './product-artifact-lock.mjs';
import { createSanitizedRuntimeEnvironment } from './runtime-configuration-files.mjs';
import { startDeterministicChatProvider } from './deterministic-chat-provider.mjs';

const sourceProjectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceRuntimeRoot = join(sourceProjectRoot, '.gorombo');
const sourceServerPath = join(sourceRuntimeRoot, 'sim-one-alpha', 'server.mjs');
const tuiBinaryName = process.platform === 'win32' ? 'sim-one-ratatui-tui.exe' : 'sim-one-ratatui-tui';
const sourceTuiPath = join(sourceRuntimeRoot, 'sim-one-ratatui', tuiBinaryName);
const simOneBinaryName = process.platform === 'win32' ? 'sim-one.cmd' : 'sim-one';
const sourceSimOnePath = join(sourceRuntimeRoot, 'sim-one-cli', simOneBinaryName);
const sourceConfigPath = join(sourceRuntimeRoot, 'gorombo.config.json');
const sourceEnvironmentConfigPath = join(sourceRuntimeRoot, 'sim-one.config');
const sourceEnvironmentExamplePath = join(
  sourceRuntimeRoot,
  'sim-one.config.example',
);
const transcriptFixture = {
  greeting: 'PACKAGED_SAVED_GREETING',
  promptLineOne: 'PACKAGED_VISIBLE_PROMPT_LINE_ONE',
  promptLineTwo: 'PACKAGED_VISIBLE_PROMPT_LINE_TWO',
  thinking: 'PACKAGED_THINKING_PREVIEW',
  finalLineOne: 'PACKAGED_FINAL_LINE_ONE',
  finalLineTwo: 'PACKAGED_FINAL_LINE_TWO',
  hiddenStartup: 'PACKAGED_INTERNAL_STARTUP_INSTRUCTION',
  hiddenNested: 'PACKAGED_NESTED_WORKER_OUTPUT',
  hiddenToolResult: 'PACKAGED_RAW_TOOL_RESULT',
  hiddenEmptyAssistant: 'PACKAGED_EMPTY_ASSISTANT',
  hiddenSessionCommand: '/rename PACKAGED_PRE_LLM_COMMAND',
};

if (!existsSync(sourceServerPath)) {
  throw new Error(`${sourceServerPath} does not exist. Run pnpm run build before the Ratatui product smoke test.`);
}

if (!existsSync(sourceTuiPath)) {
  throw new Error(`${sourceTuiPath} does not exist. Run pnpm run build:tui:ratatui before the Ratatui product smoke test.`);
}

if (!existsSync(sourceSimOnePath)) {
  throw new Error(`${sourceSimOnePath} does not exist. Run pnpm run build:cli before the Ratatui product smoke test.`);
}

if (!existsSync(sourceConfigPath)) {
  throw new Error(`${sourceConfigPath} does not exist. Run pnpm run build before the Ratatui product smoke test.`);
}
if (!existsSync(sourceEnvironmentConfigPath)) {
  throw new Error(
    `${sourceEnvironmentConfigPath} does not exist. Build after creating sim-one.config.`,
  );
}
if (!existsSync(sourceEnvironmentExamplePath)) {
  throw new Error(
    `${sourceEnvironmentExamplePath} does not exist. Run pnpm run build before the Ratatui product smoke test.`,
  );
}

const port = await getFreePort();
const runtimeEnvironmentValues = parseEnv(
  readFileSync(sourceEnvironmentConfigPath, 'utf8'),
);
const ollamaKey =
  runtimeEnvironmentValues.OLLAMA_API_KEY ||
  runtimeEnvironmentValues.OLLAMA_CLOUD_API_KEY;
const runpodKey = runtimeEnvironmentValues.RUNPOD_API_KEY;
if (!ollamaKey && !runpodKey) {
  throw new Error('A supported live-model credential is required in sim-one.config for the Ratatui product prompt test.');
}
const productSmokeTestMode = process.env.GOROMBO_TEST_MODE === '1';
const productSmokeOllamaKey =
  productSmokeTestMode
    ? ollamaKey
    : 'shell-value-must-not-win';
const productSmokeRunpodKey =
  productSmokeTestMode
    ? runpodKey
    : 'shell-value-must-not-win';
const releaseArtifactLock = await acquireProductArtifactLock();
const productFixtureRoot = mkdtempSync(join(tmpdir(), 'ratatui-relocated-product-'));
const runtimeRoot = join(productFixtureRoot, '.gorombo');
const launchDirectory = mkdtempSync(join(tmpdir(), 'ratatui-arbitrary-cwd-'));
const syntheticHome = join(productFixtureRoot, 'unrelated-home');
const serverDir = join(runtimeRoot, 'sim-one-alpha');
const serverPath = join(serverDir, 'server.mjs');
const tuiPath = join(runtimeRoot, 'sim-one-ratatui', tuiBinaryName);
const simOnePath = join(runtimeRoot, 'sim-one-cli', simOneBinaryName);
const cliModulePath = join(runtimeRoot, 'sim-one-cli', 'cli.js');
const codingWorkspaceRoot = join(runtimeRoot, 'workspace');
const sessionDatabasePath = join(runtimeRoot, 'db', 'sessions.sqlite');
const flueV2DatabasePath = join(runtimeRoot, 'db', 'flue-v2.sqlite');
const tuiDiagnosticsPath = join(runtimeRoot, 'logs', 'sim-one-ratatui.jsonl');
const configPath = join(runtimeRoot, 'gorombo.config.json');
const environmentConfigPath = join(runtimeRoot, 'sim-one.config');
const environmentExamplePath = join(runtimeRoot, 'sim-one.config.example');

let stdout = '';
let stderr = '';
let child;
let deterministicChatProvider;

try {
  mkdirSync(runtimeRoot, { recursive: true });
  mkdirSync(syntheticHome, { recursive: true });
  for (const directory of ['sim-one-alpha', 'sim-one-cli', 'sim-one-ratatui']) {
    cpSync(
      join(sourceRuntimeRoot, directory),
      join(runtimeRoot, directory),
      { recursive: true, force: true, verbatimSymlinks: true },
    );
  }
  cpSync(
    sourceConfigPath,
    configPath,
    { force: true },
  );
  cpSync(sourceEnvironmentConfigPath, environmentConfigPath, { force: true });
  const productEnvironmentConfig = readFileSync(environmentConfigPath, 'utf8')
    .replace(
      /^SIM_ONE_TUI_LOG_PATH=.*$/m,
      'SIM_ONE_TUI_LOG_PATH=logs/sim-one-ratatui.jsonl',
    );
  writeFileSync(environmentConfigPath, productEnvironmentConfig);
  chmodSync(environmentConfigPath, 0o600);
  cpSync(sourceEnvironmentExamplePath, environmentExamplePath, { force: true });
  for (const packagedPath of [serverPath, tuiPath, simOnePath, cliModulePath]) {
    if (!existsSync(packagedPath)) {
      throw new Error(`relocated package is missing expected artifact: ${packagedPath}`);
    }
  }
  const externalDependencyLinks = findExternalDependencyLinks(
    join(serverDir, 'node_modules'),
  );
  if (externalDependencyLinks.length > 0) {
    throw new Error(
      `relocated package contains dependency links outside its node_modules tree: ${externalDependencyLinks
        .map((link) => `${link.path} -> ${link.target}`)
        .join(', ')}`,
    );
  }
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  const testModelCard = process.env.SIM_ONE_TEST_MODEL_CARD?.trim();
  if (testModelCard) {
    const previousPrimary = config.models?.primary;
    config.models = {
      ...config.models,
      primary: testModelCard,
      ...(config.models?.backup === testModelCard &&
      previousPrimary &&
      previousPrimary !== testModelCard
        ? { backup: previousPrimary }
        : {}),
    };
  }
  config.gateway = { ...(config.gateway ?? {}), port };
  config.storage = {
    ...(config.storage ?? {}),
    flueV2DatabasePath: 'db/flue-v2.sqlite',
    flueDatabasePath: 'db/flue.sqlite',
    sessionDatabasePath: 'db/sessions.sqlite',
    vectorStorePath: 'vector',
  };
  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);

  const childEnv = {
    ...createSanitizedRuntimeEnvironment({
      sourceRoot: sourceProjectRoot,
      env: process.env,
    }),
    PATH: productLikePath(),
    SIM_ONE_NODE: process.env.SIM_ONE_NODE || process.execPath,
    HOME: syntheticHome,
    USERPROFILE: syntheticHome,
    GOROMBO_RUNTIME_ROOT: runtimeRoot,
    SIM_ONE_PRODUCT_PATH: simOnePath,
    SIM_ONE_TUI_LOG_PATH: tuiDiagnosticsPath,
    ...(productSmokeOllamaKey ? { OLLAMA_API_KEY: productSmokeOllamaKey } : {}),
    ...(productSmokeRunpodKey ? { RUNPOD_API_KEY: productSmokeRunpodKey } : {}),
    ...(runtimeEnvironmentValues.RUNPOD_CHAT_BASE_URL
      ? { RUNPOD_CHAT_BASE_URL: runtimeEnvironmentValues.RUNPOD_CHAT_BASE_URL }
      : {}),
    GOROMBO_WORKSPACE_ROOT: join(
      launchDirectory,
      'shell-workspace-must-not-win',
    ),
  };
  if (productSmokeTestMode) {
    childEnv.CODEX_BRAIN_LOCAL_API_KEY = 'ratatui-product-placeholder';
    childEnv.CODEX_BRAIN_LOCAL_API_URL = 'https://dt1.example.test/v1';
    childEnv.GOROMBO_WORKSPACE_ROOT = codingWorkspaceRoot;
  }
  if (!childEnv.NVM_DIR && process.env.HOME) {
    childEnv.NVM_DIR = join(process.env.HOME, '.nvm');
  }

  await assertProductCommandRouting(childEnv);
  await assertDefaultProductCommandStartsCleanStartup(childEnv);
  await assertInteractivePromptInput({
    ...childEnv,
    SIM_ONE_TUI_LOG_PATH: tuiDiagnosticsPath,
  });
  await assertVisibleFinalBeforeHttpSettlement(childEnv);

  if (productSmokeTestMode && testModelCard === 'kimi-k2-6-runpod') {
    deterministicChatProvider = await startDeterministicChatProvider();
    childEnv.RUNPOD_CHAT_BASE_URL = deterministicChatProvider.baseUrl;
  }
  const firstStartup = await runFreshStartup(childEnv, 'default launch 1');
  if (
    deterministicChatProvider &&
    deterministicChatProvider.requestCount() === 0
  ) {
    throw new Error(
      'packaged gateway did not use the deterministic test-mode chat provider',
    );
  }
  const firstSessionId = firstStartup.sessionId;
  const secondStartup = await runFreshStartup(childEnv, 'default launch 2');
  const secondSessionId = secondStartup.sessionId;
  if (firstSessionId === secondSessionId) {
    throw new Error(`default TUI launch reused session ${firstSessionId}`);
  }
  assertFreshStartupDatabase(
    sessionDatabasePath,
    [firstSessionId, secondSessionId],
  );
  console.log(`[ratatui-product] default launch 1 created a fresh session ${firstSessionId}.`);
  console.log(`[ratatui-product] default launch 2 created a different fresh session ${secondSessionId}.`);
  console.log('[ratatui-product] startup emitted no lifecycle slash commands.');

  const createSessionSmoke = await runProductCommand(
    ['--port', String(port)],
    {
      ...childEnv,
      SIM_ONE_TUI_TEST_PROMPTS: [
        '/new Smoke Session',
        '/session',
        '/compact',
        '/exit',
      ].join('\n'),
    },
    240_000,
  );
  stdout = createSessionSmoke.stdout;
  stderr = createSessionSmoke.stderr;
  const sessionMatch = /Started new session (tui-[^.]+)\./.exec(stdout);
  if (!sessionMatch?.[1]) {
    throw new Error(`Ratatui product session smoke did not create a TUI session.\nstdout:\n${stdout}\nstderr:\n${stderr}`);
  }
  const sessionId = sessionMatch[1];
  assertOutputIncludes(stdout, `system: current session ${sessionId}`, 'session command did not show the active session');
  assertOutputIncludes(stdout, `assistant: Compacted session ${sessionId}.`, 'compact command did not compact the active session');
  assertOutputIncludes(stdout, `Exited SIM-ONE Alpha TUI. Session: ${sessionId}`, 'exit command did not print the new session id');

  const clearSessionSmoke = await runProductCommand(
    ['--port', String(port), '--session', sessionId],
    {
      ...childEnv,
      SIM_ONE_TUI_TEST_PROMPTS: [
        '/clear Smoke Cleared',
        '/session',
        '/sessions',
        '/exit',
      ].join('\n'),
    },
    240_000,
  );
  stdout = clearSessionSmoke.stdout;
  stderr = clearSessionSmoke.stderr;
  const clearMatch = /Cleared conversation\. Started new session (tui-[^.]+)\./.exec(stdout);
  if (!clearMatch?.[1]) {
    throw new Error(`Ratatui product session smoke did not clear into a new TUI session.\nstdout:\n${stdout}\nstderr:\n${stderr}`);
  }
  const clearedSessionId = clearMatch[1];
  if (clearedSessionId === sessionId) {
    throw new Error(`Ratatui /clear reused the old session id ${sessionId}.\nstdout:\n${stdout}\nstderr:\n${stderr}`);
  }
  assertOutputIncludes(stdout, `system: current session ${clearedSessionId}`, 'session command did not show the cleared active session');
  assertOutputIncludes(stdout, 'system: recent sessions', 'sessions command did not list scoped TUI sessions');

  const resumeSessionSmoke = await runProductCommand(
    ['--port', String(port), '--session', clearedSessionId],
    {
      ...childEnv,
      SIM_ONE_TUI_TEST_PROMPTS: [
        `/resume ${firstSessionId}`,
        '/rename Smoke Session Renamed',
        '/exit',
      ].join('\n'),
    },
    240_000,
  );
  stdout = resumeSessionSmoke.stdout;
  stderr = resumeSessionSmoke.stderr;
  assertOutputIncludes(stdout, `system: Resumed session ${firstSessionId}.`, 'resume command did not resume the first fresh session');
  assertOutputIncludes(stdout, `assistant: Renamed session ${firstSessionId} to "Smoke Session Renamed".`, 'rename command did not rename the resumed session');
  assertOutputIncludes(stdout, '\nSIM-ONE Alpha - Smoke Session Renamed\n', 'rename command did not update the product header with the explicit name');
  assertOutputIncludes(stdout, 'session: Smoke Session Renamed', 'rename command did not replace the status-bar session id with the explicit title');
  assertOutputIncludes(stdout, `Exited SIM-ONE Alpha TUI. Session: ${firstSessionId}`, 'exit command did not print the resumed session id');
  assertSessionCommandStorage(
    sessionDatabasePath,
    [firstSessionId, sessionId, clearedSessionId],
  );

  seedTranscriptFixture(
    sessionDatabasePath,
    flueV2DatabasePath,
    firstSessionId,
  );
  const eventsBeforeExplicitResume = countNormalizedEventsForSession(
    sessionDatabasePath,
    firstSessionId,
  );
  const explicitResumeSmoke = await runProductCommand(
    ['--port', String(port), '--session', firstSessionId],
    {
      ...childEnv,
      SIM_ONE_TUI_TEST_PROMPTS: '/exit',
    },
    240_000,
  );
  stdout = explicitResumeSmoke.stdout;
  stderr = explicitResumeSmoke.stderr;
  assertOutputIncludes(stdout, `preflight: resumed TUI session ${firstSessionId}`, 'explicit --session did not validate and resume the requested session');
  assertOutputIncludes(stdout, '\nSIM-ONE Alpha - Smoke Session Renamed\nSIM-ONE Alpha | session: Smoke Session Renamed |', 'explicit --session did not restore the named header and status');
  assertOutputIncludes(stdout, `Exited SIM-ONE Alpha TUI. Session: ${firstSessionId}`, 'explicit --session exit did not print the requested session id');
  if (stdout.includes('preflight: created fresh TUI session')) {
    throw new Error(`explicit --session created a fresh session.\nstdout:\n${stdout}\nstderr:\n${stderr}`);
  }
  const eventsAfterExplicitResume = countNormalizedEventsForSession(
    sessionDatabasePath,
    firstSessionId,
  );
  if (eventsAfterExplicitResume !== eventsBeforeExplicitResume) {
    throw new Error(`explicit --session appended a startup greeting to ${firstSessionId}`);
  }

  const explicitNameResumeSmoke = await runProductCommand(
    ['--port', String(port), '--session', 'Smoke Session Renamed'],
    {
      ...childEnv,
      SIM_ONE_TUI_TEST_PROMPTS: '/exit',
    },
    240_000,
  );
  stdout = explicitNameResumeSmoke.stdout;
  stderr = explicitNameResumeSmoke.stderr;
  assertOutputIncludes(stdout, `preflight: resumed TUI session ${firstSessionId}`, 'explicit --session name did not resolve to the canonical session id');
  assertOutputIncludes(stdout, '\nSIM-ONE Alpha - Smoke Session Renamed\nSIM-ONE Alpha | session: Smoke Session Renamed |', 'explicit --session name did not restore the named header and status');
  assertOutputIncludes(stdout, `Exited SIM-ONE Alpha TUI. Session: ${firstSessionId}`, 'explicit --session name did not exit with the canonical session id');
  assertPackagedTranscriptResume(stdout);
  const eventsAfterNameResume = countNormalizedEventsForSession(
    sessionDatabasePath,
    firstSessionId,
  );
  if (eventsAfterNameResume !== eventsBeforeExplicitResume) {
    throw new Error(`explicit --session name appended a startup greeting to ${firstSessionId}`);
  }

  const missingSelector = `missing-${Date.now()}`;
  const fallbackStartup = await runMissingSessionFallback(childEnv, missingSelector);
  assertFreshStartupDatabase(
    sessionDatabasePath,
    [fallbackStartup.sessionId],
  );
  assertTuiDiagnostics(
    tuiDiagnosticsPath,
    firstSessionId,
    fallbackStartup.sessionId,
    missingSelector,
  );

  console.log(`[ratatui-product] explicit --session resumed the requested session ${firstSessionId} without a greeting.`);
  console.log(`[ratatui-product] explicit --session name resolved to ${firstSessionId} without a greeting.`);
  console.log(`[ratatui-product] missing --session selector created fresh session ${fallbackStartup.sessionId}.`);
  if (existsSync(join(launchDirectory, '.gorombo'))) {
    throw new Error(`packaged launch wrote runtime state beside the caller: ${launchDirectory}`);
  }
  if (existsSync(join(syntheticHome, '.gorombo'))) {
    throw new Error(`packaged launch wrote runtime state under HOME: ${syntheticHome}`);
  }
  for (const requiredPath of [
    sessionDatabasePath,
    flueV2DatabasePath,
    join(runtimeRoot, 'db', 'capabilities.sqlite'),
    tuiDiagnosticsPath,
    codingWorkspaceRoot,
  ]) {
    if (!existsSync(requiredPath)) {
      throw new Error(`relocated product did not create expected runtime path: ${requiredPath}`);
    }
  }
  console.log(`[ratatui-product] relocated package ran from ${launchDirectory} with all state under ${runtimeRoot}.`);
  console.log('[ratatui-product] session commands and existing interactive controls passed.');
} finally {
  try {
    if (child && child.exitCode === null && child.signalCode === null) {
      child.kill('SIGKILL');
    }
  } finally {
    if (deterministicChatProvider) {
      await deterministicChatProvider.close();
    }
    rmSync(productFixtureRoot, { recursive: true, force: true });
    rmSync(launchDirectory, { recursive: true, force: true });
    await releaseArtifactLock();
  }
}

function productLikePath() {
  const currentPath = process.env.PATH || '';
  const nodeBin = dirname(process.env.SIM_ONE_NODE || process.execPath);
  return [nodeBin, currentPath].filter(Boolean).join(delimiter);
}

async function runFreshStartup(env, label) {
  const result = await runProductCommand(
    ['--port', String(port)],
    {
      ...env,
      SIM_ONE_TUI_TEST_STARTUP: '1',
    },
    240_000,
  );
  stdout = result.stdout;
  stderr = result.stderr;
  assertOutputIncludes(stdout, 'preflight: gateway ready', `${label} did not show gateway preflight`);
  assertOutputIncludes(stdout, 'preflight: all systems go', `${label} did not show all-systems-go preflight`);
  assertOutputIncludes(stdout, 'assistant:', `${label} did not render an agent greeting`);
  const sessionMatch = /preflight: created fresh TUI session (tui-[^\s]+)/.exec(stdout);
  if (!sessionMatch?.[1]) {
    throw new Error(`${label} did not report a fresh TUI session id.\nstdout:\n${stdout}\nstderr:\n${stderr}`);
  }
  const lastStartupTranscriptLine = lastTranscriptLine(stdout);
  if (!lastStartupTranscriptLine?.startsWith('assistant:')) {
    throw new Error(`${label} did not leave the greeting as the last transcript line. Last transcript line: ${lastStartupTranscriptLine ?? '(none)'}\nstdout:\n${stdout}\nstderr:\n${stderr}`);
  }
  if (/session:\s*primary/i.test(stdout)) {
    throw new Error(`${label} rendered the old primary session default.\nstdout:\n${stdout}\nstderr:\n${stderr}`);
  }
  if (/context 0[1-9]|scroll test row|placeholder/i.test(stdout)) {
    throw new Error(`${label} rendered scaffold or placeholder transcript content.\nstdout:\n${stdout}\nstderr:\n${stderr}`);
  }
  if (stdout.includes('This is an automatic SIM-ONE Alpha local Ratatui TUI startup event')) {
    throw new Error(`${label} exposed the internal startup prompt as a session title.\nstdout:\n${stdout}\nstderr:\n${stderr}`);
  }
  assertOutputIncludes(stdout, '\nSIM-ONE Alpha\nSIM-ONE Alpha | session:', `${label} did not use the product-only header or preserve the status bar`);
  return { ...result, sessionId: sessionMatch[1] };
}

async function runMissingSessionFallback(env, selector) {
  const result = await runProductCommand(
    ['--port', String(port), '--session', selector],
    {
      ...env,
      SIM_ONE_TUI_TEST_STARTUP: '1',
    },
    240_000,
  );
  const fallbackLine = `preflight: session ${selector} was not found; created fresh TUI session `;
  assertOutputIncludes(result.stdout, fallbackLine, 'missing --session selector did not report fresh fallback');
  assertOutputIncludes(result.stdout, 'preflight: all systems go', 'missing --session selector did not complete preflight');
  assertOutputIncludes(result.stdout, 'assistant:', 'missing --session selector did not render the fresh greeting');
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const sessionMatch = new RegExp(
    `preflight: session ${escapedSelector} was not found; created fresh TUI session (tui-[^\\s]+)`,
  ).exec(result.stdout);
  if (!sessionMatch?.[1]) {
    throw new Error(`missing --session selector did not report its fresh session id.\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
  }
  return { ...result, sessionId: sessionMatch[1] };
}

function assertFreshStartupDatabase(databasePath, sessionIds) {
  const database = new DatabaseSync(databasePath, { readOnly: true });
  try {
    const placeholders = sessionIds.map(() => '?').join(', ');
    const rows = database
      .prepare(
        `SELECT session_id AS sessionId, text
         FROM normalized_message_events
         WHERE session_id IN (${placeholders})
         ORDER BY received_at, event_id`,
      )
      .all(...sessionIds);
    for (const sessionId of sessionIds) {
      const sessionRows = rows.filter((row) => row.sessionId === sessionId);
      if (sessionRows.length !== 1) {
        throw new Error(`fresh startup session ${sessionId} recorded ${sessionRows.length} normalized events instead of one greeting`);
      }
      const greeting = String(sessionRows[0].text);
      if (!greeting.includes('automatic SIM-ONE Alpha local Ratatui TUI startup event') || !greeting.includes('greeting-preflight')) {
        throw new Error(`fresh startup session ${sessionId} did not record the greeting as its first normal event`);
      }
    }
    const lifecycleSlash = rows.find((row) => /^\/(?:session|new|clear)(?:\s|$)/.test(String(row.text).trim()));
    if (lifecycleSlash) {
      throw new Error(`startup recorded lifecycle slash command ${lifecycleSlash.text} in ${lifecycleSlash.sessionId}`);
    }
  } finally {
    database.close();
  }
}

function assertSessionCommandStorage(databasePath, sessionIds) {
  const database = new DatabaseSync(databasePath, { readOnly: true });
  try {
    const placeholders = sessionIds.map(() => '?').join(', ');
    const rows = database
      .prepare(
        `SELECT text, delivery_kind AS deliveryKind
         FROM normalized_message_events
         WHERE session_id IN (${placeholders})
         ORDER BY received_at, event_id`,
      )
      .all(...sessionIds)
      .filter((row) => /^\/(?:new|clear|resume|rename|compact|session)(?:\s|$)/i.test(String(row.text).trim()));
    if (rows.length === 0) {
      throw new Error('Ratatui product session smoke did not persist any pre-LLM command records.');
    }
    const misclassified = rows.find((row) => row.deliveryKind !== 'session-command');
    if (misclassified) {
      throw new Error(`pre-LLM command was stored as ${misclassified.deliveryKind}: ${misclassified.text}`);
    }
  } finally {
    database.close();
  }
}

function countNormalizedEventsForSession(databasePath, sessionId) {
  const database = new DatabaseSync(databasePath, { readOnly: true });
  try {
    const row = database
      .prepare('SELECT COUNT(*) AS count FROM normalized_message_events WHERE session_id = ?')
      .get(sessionId);
    return Number(row.count);
  } finally {
    database.close();
  }
}

function seedTranscriptFixture(sessionDatabasePath, flueV2DatabasePath, sessionId) {
  const sessionDatabase = new DatabaseSync(sessionDatabasePath);
  const generation = sessionDatabase
    .prepare(
      `SELECT instance_id AS instanceId
       FROM chat_session_generations
       WHERE session_id = ?
       ORDER BY generation DESC
       LIMIT 1`,
    )
    .get(sessionId);
  if (!generation?.instanceId) {
    sessionDatabase.close();
    throw new Error(`packaged transcript fixture could not resolve the active runtime generation for ${sessionId}`);
  }

  const previousInstanceId = String(generation.instanceId);
  const instanceId = `${sessionId}-packaged-fixture`;
  const flueDatabase = new DatabaseSync(flueV2DatabasePath);
  const streamPath = `agents/orchestrator/${instanceId}`;
  const greetingSubmission = 'packaged-greeting-submission';
  const userSubmission = 'packaged-user-submission';
  const now = '2026-07-23T15:00:00.000Z';
  const conversationId = 'conv_packaged_resume_fixture';
  const usage = {
    input: 1,
    output: 1,
    cacheRead: 0,
    cacheWrite: 0,
    totalTokens: 2,
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
  };
  const modelInfo = {
    api: 'openai-responses',
    provider: 'openai',
    model: 'packaged-fixture',
  };
  const record = (id, type, timestamp, value = {}) => ({
    v: 1,
    id: `record_${id}`,
    type,
    conversationId,
    harness: 'default',
    session: 'default',
    timestamp,
    ...value,
  });
  const greetingPromptId = 'entry_packaged_startup_prompt';
  const greetingMessageId = 'entry_packaged_greeting';
  const userPromptId = 'entry_packaged_user_prompt';
  const toolMessageId = 'entry_packaged_tool_step';
  const finalMessageId = 'entry_packaged_final';
  const repositoryCallId = 'call_packaged_repository_status';
  const taskCallId = 'call_packaged_task';
  const batches = [
    [record('conversation_created', 'conversation_created', now, {
      affinityKey: 'aff_packaged_resume_fixture',
      createdAt: now,
      kind: 'root',
      uid: 'uid_packaged_resume_fixture',
    })],
    [record('greeting_prompt', 'user_message', now, {
      submissionId: greetingSubmission,
      messageId: greetingPromptId,
      parentId: null,
      content: [{ type: 'text', text: transcriptFixture.hiddenStartup }],
    })],
    [
      record('greeting_started', 'assistant_message_started', '2026-07-23T15:00:00.100Z', {
        submissionId: greetingSubmission,
        messageId: greetingMessageId,
        parentId: greetingPromptId,
        modelInfo,
      }),
      record('greeting_text_started', 'assistant_text_started', '2026-07-23T15:00:00.150Z', {
        submissionId: greetingSubmission,
        messageId: greetingMessageId,
        blockId: 'block_packaged_greeting',
        blockIndex: 0,
      }),
      record('greeting_text_delta', 'assistant_text_delta', '2026-07-23T15:00:00.200Z', {
        submissionId: greetingSubmission,
        messageId: greetingMessageId,
        blockId: 'block_packaged_greeting',
        sequence: 0,
        delta: transcriptFixture.greeting,
      }),
      record('greeting_text_completed', 'assistant_text_completed', '2026-07-23T15:00:00.250Z', {
        submissionId: greetingSubmission,
        messageId: greetingMessageId,
        blockId: 'block_packaged_greeting',
        deltaCount: 1,
      }),
      record('greeting_completed', 'assistant_message_completed', '2026-07-23T15:00:00.300Z', {
        submissionId: greetingSubmission,
        messageId: greetingMessageId,
        stopReason: 'stop',
        usage,
      }),
    ],
    [record('greeting_settled', 'submission_settled', '2026-07-23T15:00:00.350Z', {
      submissionId: greetingSubmission,
      outcome: 'completed',
    })],
    [record('user_prompt', 'user_message', '2026-07-23T15:01:00.000Z', {
      submissionId: userSubmission,
      messageId: userPromptId,
      parentId: greetingMessageId,
      content: [{
        type: 'text',
        text: `${transcriptFixture.promptLineOne}\n${transcriptFixture.promptLineTwo}`,
      }],
    })],
    [
      record('tool_message_started', 'assistant_message_started', '2026-07-23T15:01:00.100Z', {
        submissionId: userSubmission,
        messageId: toolMessageId,
        parentId: userPromptId,
        modelInfo,
      }),
      record('reasoning_started', 'assistant_reasoning_started', '2026-07-23T15:01:00.200Z', {
        submissionId: userSubmission,
        messageId: toolMessageId,
        blockId: 'block_packaged_reasoning',
        blockIndex: 0,
      }),
      record('reasoning_delta', 'assistant_reasoning_delta', '2026-07-23T15:01:00.300Z', {
        submissionId: userSubmission,
        messageId: toolMessageId,
        blockId: 'block_packaged_reasoning',
        sequence: 0,
        delta: transcriptFixture.thinking,
      }),
      record('reasoning_completed', 'assistant_reasoning_completed', '2026-07-23T15:01:00.400Z', {
        submissionId: userSubmission,
        messageId: toolMessageId,
        blockId: 'block_packaged_reasoning',
        deltaCount: 1,
      }),
      record('repository_call', 'assistant_tool_call', '2026-07-23T15:01:00.500Z', {
        submissionId: userSubmission,
        messageId: toolMessageId,
        blockId: 'block_packaged_repository_status',
        blockIndex: 1,
        toolCallId: repositoryCallId,
        name: 'repository_status',
        arguments: {},
      }),
      record('task_call', 'assistant_tool_call', '2026-07-23T15:01:00.600Z', {
        submissionId: userSubmission,
        messageId: toolMessageId,
        blockId: 'block_packaged_task',
        blockIndex: 2,
        toolCallId: taskCallId,
        name: 'task',
        arguments: { agent: 'researcher' },
      }),
      record('tool_message_completed', 'assistant_message_completed', '2026-07-23T15:01:00.700Z', {
        submissionId: userSubmission,
        messageId: toolMessageId,
        stopReason: 'toolUse',
        usage,
      }),
    ],
    [
      record('repository_outcome', 'tool_outcome', '2026-07-23T15:01:00.800Z', {
        submissionId: userSubmission,
        assistantMessageId: toolMessageId,
        toolCallId: repositoryCallId,
        toolName: 'repository_status',
        isError: false,
        content: [{ type: 'text', text: transcriptFixture.hiddenToolResult }],
        output: { ok: true },
        durationMs: 31,
      }),
      record('task_outcome', 'tool_outcome', '2026-07-23T15:01:00.900Z', {
        submissionId: userSubmission,
        assistantMessageId: toolMessageId,
        toolCallId: taskCallId,
        toolName: 'task',
        isError: false,
        content: [{ type: 'text', text: transcriptFixture.hiddenNested }],
        output: { ok: true },
        durationMs: 1_200,
      }),
      record('tool_results', 'tool_results_committed', '2026-07-23T15:01:01.000Z', {
        submissionId: userSubmission,
        assistantMessageId: toolMessageId,
        parentId: toolMessageId,
        outcomeIds: ['record_repository_outcome', 'record_task_outcome'],
      }),
    ],
    [
      record('final_started', 'assistant_message_started', '2026-07-23T15:01:01.100Z', {
        submissionId: userSubmission,
        messageId: finalMessageId,
        parentId: toolResultEntryId(toolMessageId, taskCallId),
        modelInfo,
      }),
      record('final_text_started', 'assistant_text_started', '2026-07-23T15:01:01.150Z', {
        submissionId: userSubmission,
        messageId: finalMessageId,
        blockId: 'block_packaged_final',
        blockIndex: 0,
      }),
      record('final_text_delta', 'assistant_text_delta', '2026-07-23T15:01:01.200Z', {
        submissionId: userSubmission,
        messageId: finalMessageId,
        blockId: 'block_packaged_final',
        sequence: 0,
        delta: `**${transcriptFixture.finalLineOne}**\n\n${transcriptFixture.finalLineTwo}`,
      }),
      record('final_text_completed', 'assistant_text_completed', '2026-07-23T15:01:01.250Z', {
        submissionId: userSubmission,
        messageId: finalMessageId,
        blockId: 'block_packaged_final',
        deltaCount: 1,
      }),
      record('final_completed', 'assistant_message_completed', '2026-07-23T15:01:01.300Z', {
        submissionId: userSubmission,
        messageId: finalMessageId,
        stopReason: 'stop',
        usage,
      }),
    ],
    [record('user_settled', 'submission_settled', '2026-07-23T15:01:01.350Z', {
      submissionId: userSubmission,
      outcome: 'completed',
    })],
  ];

  try {
    sessionDatabase.exec('BEGIN IMMEDIATE');
    sessionDatabase
      .prepare(
        `UPDATE chat_sessions
         SET origin = 'tui',
             actor_id = 'local-tui',
             conversation_id = 'local-tui',
             thread_id = 'local-tui',
             title = 'Smoke Session Renamed',
             explicit_name = 'Smoke Session Renamed',
             updated_at = ?
         WHERE session_id = ?`,
      )
      .run(now, sessionId);
    sessionDatabase
      .prepare(
        `UPDATE chat_session_generations
         SET instance_id = ?
         WHERE session_id = ? AND instance_id = ?`,
      )
      .run(instanceId, sessionId, previousInstanceId);
    sessionDatabase
      .prepare('DELETE FROM normalized_message_events WHERE session_id = ?')
      .run(sessionId);
    const insertPrompt = sessionDatabase.prepare(
      `INSERT INTO normalized_message_events
       (event_id, session_id, connector, message_kind, text, received_at, actor_id,
        actor_display_name, conversation_id, thread_id, client_id, project_id,
        workflow, task, delivery_kind, delivery_id, delivery_submission_id,
        delivery_stream_url, delivery_offset, accepted_at, created_at, updated_at)
       VALUES (?, ?, 'tui', 'chat.message', ?, ?, 'local-tui', 'Local TUI',
               'local-tui', 'local-tui', NULL, NULL, ?, NULL, 'direct-agent',
               ?, ?, ?, ?, ?, ?, ?)`,
    );
    insertPrompt.run(
      'packaged-greeting-event',
      sessionId,
      `This is an automatic SIM-ONE Alpha local Ratatui TUI startup event.\n${transcriptFixture.hiddenStartup}`,
      '2026-07-23T15:00:00.000Z',
      'tui.startup-preflight',
      greetingSubmission,
      greetingSubmission,
      `/${streamPath}`,
      '-1',
      '2026-07-23T15:00:00.000Z',
      now,
      now,
    );
    insertPrompt.run(
      'packaged-user-event',
      sessionId,
      `${transcriptFixture.promptLineOne}\n${transcriptFixture.promptLineTwo}`,
      '2026-07-23T15:01:00.000Z',
      null,
      userSubmission,
      userSubmission,
      `/${streamPath}`,
      formatFlueOffset(4),
      '2026-07-23T15:01:00.000Z',
      now,
      now,
    );
    insertPrompt.run(
      'packaged-legacy-command-event',
      sessionId,
      transcriptFixture.hiddenSessionCommand,
      '2026-07-23T15:02:00.000Z',
      null,
      null,
      null,
      null,
      null,
      null,
      now,
      now,
    );
    sessionDatabase.exec('COMMIT');

    flueDatabase.exec('BEGIN IMMEDIATE');
    flueDatabase
      .prepare('DELETE FROM flue_conversation_fold_checkpoint_chunks WHERE path = ?')
      .run(streamPath);
    flueDatabase
      .prepare('DELETE FROM flue_conversation_fold_checkpoints WHERE path = ?')
      .run(streamPath);
    flueDatabase
      .prepare('DELETE FROM flue_conversation_stream_batch_chunks WHERE path = ?')
      .run(streamPath);
    flueDatabase
      .prepare('DELETE FROM flue_conversation_stream_batches WHERE path = ?')
      .run(streamPath);
    flueDatabase
      .prepare('DELETE FROM flue_conversation_streams WHERE path = ?')
      .run(streamPath);
    flueDatabase
      .prepare(
        `INSERT INTO flue_conversation_streams
         (path, identity_json, next_offset, producer_id, producer_epoch,
          next_producer_sequence, incarnation)
         VALUES (?, ?, ?, 'packaged-fixture', 1, ?, 'inc-packaged-fixture')`,
      )
      .run(
        streamPath,
        JSON.stringify({ agentName: 'orchestrator', instanceId }),
        batches.length,
        batches.length,
      );
    const insertBatch = flueDatabase.prepare(
      `INSERT INTO flue_conversation_stream_batches
       (path, seq, producer_id, producer_epoch, producer_sequence, data,
        submission_id, attempt_id)
       VALUES (?, ?, 'packaged-fixture', 1, ?, ?, NULL, NULL)`,
    );
    for (const [index, batch] of batches.entries()) {
      insertBatch.run(streamPath, index, index, JSON.stringify(batch));
    }
    flueDatabase.exec('COMMIT');
  } catch (error) {
    try {
      sessionDatabase.exec('ROLLBACK');
    } catch {}
    try {
      flueDatabase.exec('ROLLBACK');
    } catch {}
    throw error;
  } finally {
    sessionDatabase.close();
    flueDatabase.close();
  }
}

function formatFlueOffset(sequence) {
  if (sequence < 0) return '-1';
  return `${'0'.repeat(16)}_${String(sequence).padStart(16, '0')}`;
}

function toolResultEntryId(assistantMessageId, toolCallId) {
  return `entry_tool_result_${encodeCanonicalId(assistantMessageId)}_${encodeCanonicalId(toolCallId)}`;
}

function encodeCanonicalId(value) {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function assertPackagedTranscriptResume(output) {
  for (const visible of [
    transcriptFixture.greeting,
    transcriptFixture.promptLineOne,
    transcriptFixture.promptLineTwo,
    transcriptFixture.thinking,
    transcriptFixture.finalLineOne,
    transcriptFixture.finalLineTwo,
    'tool: repository_status completed in 31ms',
    'task: researcher completed in 1.2s',
  ]) {
    assertOccurrenceCount(output, visible, 1, `restored transcript did not render ${visible} exactly once`);
  }
  assertOccurrenceCount(
    output,
    'operation: operation completed',
    2,
    'restored transcript did not render one completed operation per settled submission',
  );
  for (const hidden of [
    transcriptFixture.hiddenStartup,
    transcriptFixture.hiddenNested,
    transcriptFixture.hiddenToolResult,
    transcriptFixture.hiddenEmptyAssistant,
    transcriptFixture.hiddenSessionCommand,
  ]) {
    assertOccurrenceCount(output, hidden, 0, `restored transcript exposed hidden content ${hidden}`);
  }
  if (/^assistant:\s*$/m.test(output)) {
    throw new Error(`restored transcript rendered an empty assistant block.\nstdout:\n${output}`);
  }
}

function assertOccurrenceCount(output, value, expected, label) {
  const count = output.split(value).length - 1;
  if (count !== expected) {
    throw new Error(`${label}; expected ${expected}, found ${count}.\nstdout:\n${output}`);
  }
}

function assertTuiDiagnostics(path, resumedSessionId, fallbackSessionId, missingSelector) {
  if (!existsSync(path)) {
    throw new Error(`Ratatui diagnostics log was not created at ${path}.`);
  }
  const raw = readFileSync(path, 'utf8');
  const entries = raw
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
  const hasEvent = (event, predicate = () => true) =>
    entries.some((entry) => entry.event === event && predicate(entry));

  if (!hasEvent('gateway.ready')) {
    throw new Error('Ratatui diagnostics did not record gateway readiness.');
  }
  if (!hasEvent(
    'session.lifecycle.completed',
    (entry) => entry.outcome === 'name_resolved' && entry.sessionId === resumedSessionId,
  )) {
    throw new Error('Ratatui diagnostics did not record name-to-id session resolution.');
  }
  if (!hasEvent(
    'session.lifecycle.completed',
    (entry) => entry.outcome === 'fresh_fallback' && entry.sessionId === fallbackSessionId,
  )) {
    throw new Error('Ratatui diagnostics did not record missing-selector fresh fallback.');
  }
  if (process.platform !== 'win32') {
    if (!hasEvent('input.ctrl_c', (entry) => entry.action === 'copy_transcript')) {
      throw new Error('Ratatui diagnostics did not distinguish transcript copy from exit.');
    }
  }
  if (!hasEvent('application.exited')) {
    throw new Error('Ratatui diagnostics did not record application exit.');
  }
  for (const privateValue of [
    'Smoke Session Renamed',
    missingSelector,
    'first line updated',
    'keep X tail',
  ]) {
    if (raw.includes(privateValue)) {
      throw new Error(`Ratatui diagnostics persisted private prompt or selector content: ${privateValue}`);
    }
  }
}

async function assertDefaultProductCommandStartsCleanStartup(env) {
  const fakeTuiPath = join(codingWorkspaceRoot, process.platform === 'win32' ? 'fake-tui.cmd' : 'fake-tui');
  mkdirSync(codingWorkspaceRoot, { recursive: true });
  if (process.platform === 'win32') {
    writeFileSync(fakeTuiPath, `@echo off\r\n"${process.execPath}" -e "console.log(JSON.stringify(process.argv.slice(1)))" %*\r\n`);
  } else {
    writeFileSync(fakeTuiPath, `#!${process.execPath}\nconsole.log(JSON.stringify(process.argv.slice(2)));\n`);
    chmodSync(fakeTuiPath, 0o755);
  }

  const defaultLaunch = await runProductCommand(
    ['--port', String(port)],
    { ...env, SIM_ONE_TUI_PATH: fakeTuiPath },
    30_000,
  );
  const defaultArgs = parseForwardedArgs(defaultLaunch.stdout);
  if (defaultArgs.includes('--session')) {
    throw new Error(`default sim-one launch forwarded --session instead of letting Ratatui create a fresh session.\nstdout:\n${defaultLaunch.stdout}\nstderr:\n${defaultLaunch.stderr}`);
  }

  const explicitLaunch = await runProductCommand(
    ['--port', String(port), '--session', 'Named Session With Spaces'],
    { ...env, SIM_ONE_TUI_PATH: fakeTuiPath },
    30_000,
  );
  const explicitArgs = parseForwardedArgs(explicitLaunch.stdout);
  if (!explicitArgs.includes('--session') || !explicitArgs.includes('Named Session With Spaces')) {
    throw new Error(`explicit sim-one --session was not forwarded to Ratatui.\nstdout:\n${explicitLaunch.stdout}\nstderr:\n${explicitLaunch.stderr}`);
  }
}

async function assertInteractivePromptInput(env) {
  if (process.platform === 'win32') {
    console.log('[ratatui-interactive] PTY smoke skipped on Windows; Rust terminal-event integration tests remain active.');
    return;
  }

  const command = spawn('python3', [join(sourceProjectRoot, 'scripts', 'test-ratatui-interactive.py')], {
    cwd: launchDirectory,
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let commandStdout = '';
  let commandStderr = '';
  command.stdout.on('data', (chunk) => {
    commandStdout += String(chunk);
  });
  command.stderr.on('data', (chunk) => {
    commandStderr += String(chunk);
  });
  const exitCode = await waitForClose(command, 30_000);
  if (exitCode !== 0) {
    throw new Error(`Ratatui interactive product smoke failed with exit ${exitCode}\nstdout:\n${commandStdout}\nstderr:\n${commandStderr}`);
  }
  process.stdout.write(commandStdout);
}

async function assertVisibleFinalBeforeHttpSettlement(env) {
  if (process.platform === 'win32') {
    console.log('[ratatui-visible-final] PTY smoke skipped on Windows; Rust framebuffer coverage remains active.');
    return;
  }

  const command = spawn('python3', [join(sourceProjectRoot, 'scripts', 'test-ratatui-visible-final.py')], {
    cwd: launchDirectory,
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let commandStdout = '';
  let commandStderr = '';
  command.stdout.on('data', (chunk) => {
    commandStdout += String(chunk);
  });
  command.stderr.on('data', (chunk) => {
    commandStderr += String(chunk);
  });
  const exitCode = await waitForClose(command, 30_000);
  if (exitCode !== 0) {
    throw new Error(`Ratatui visible-final product smoke failed with exit ${exitCode}\nstdout:\n${commandStdout}\nstderr:\n${commandStderr}`);
  }
  process.stdout.write(commandStdout);
}

function parseForwardedArgs(stdout) {
  const line = stdout.trim().split(/\r?\n/).filter(Boolean).at(-1);
  if (!line) throw new Error(`fake TUI did not print forwarded args.\nstdout:\n${stdout}`);
  try {
    const args = JSON.parse(line);
    if (!Array.isArray(args)) throw new Error('not an array');
    return args;
  } catch (error) {
    throw new Error(`fake TUI printed invalid forwarded args: ${error.message}\nstdout:\n${stdout}`);
  }
}

function lastTranscriptLine(stdout) {
  return stdout
    .trim()
    .split(/\r?\n/)
    .filter((line) => /^(system|preflight|assistant|operation|turn|thinking|tool|task|error|you):/.test(line))
    .at(-1);
}

async function assertProductCommandRouting(env) {
  const help = await runProductCommand(['--help'], env, 30_000);
  if (help.exitCode !== 0) {
    throw new Error(`sim-one --help failed with exit ${help.exitCode}\nstdout:\n${help.stdout}\nstderr:\n${help.stderr}`);
  }
  if (!help.stdout.includes('SIM-ONE Alpha') || !help.stdout.includes('skill')) {
    throw new Error(`sim-one --help did not expose product CLI help.\nstdout:\n${help.stdout}\nstderr:\n${help.stderr}`);
  }

  for (const kind of ['skill', 'tool', 'worker', 'mcp']) {
    const result = await runProductCommand([kind, 'list'], env, 30_000);
    if (result.exitCode !== 0) {
      throw new Error(`sim-one ${kind} list failed with exit ${result.exitCode}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
    }
    let parsed;
    try {
      parsed = JSON.parse(result.stdout);
    } catch (error) {
      throw new Error(`sim-one ${kind} list did not return JSON: ${error.message}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
    }
    if (
      parsed?.operation !== 'list' ||
      !Array.isArray(parsed.records) ||
      !Array.isArray(parsed.progress)
    ) {
      throw new Error(`sim-one ${kind} list returned an invalid lifecycle envelope.\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
    }
  }
}

function spawnProductCommand(args, env) {
  const command = process.platform === 'win32' ? process.execPath : simOnePath;
  const commandArgs = process.platform === 'win32'
    ? [cliModulePath, ...args]
    : args;
  return spawn(command, commandArgs, {
    cwd: launchDirectory,
    env,
    shell: false,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

async function runProductCommand(args, env, timeoutMs) {
  const command = spawnProductCommand(args, env);
  let commandStdout = '';
  let commandStderr = '';
  command.stdout.on('data', (chunk) => {
    commandStdout += String(chunk);
  });
  command.stderr.on('data', (chunk) => {
    commandStderr += String(chunk);
  });
  const exitCode = await waitForClose(command, timeoutMs);
  if (exitCode !== 0) {
    throw new Error(
      `sim-one ${args.join(' ')} failed with exit ${exitCode}\nstdout:\n${commandStdout}\nstderr:\n${commandStderr}\ndiagnostics:\n${readDiagnosticsTail()}`,
    );
  }
  return { exitCode, stdout: commandStdout, stderr: commandStderr };
}

function readDiagnosticsTail() {
  if (!existsSync(tuiDiagnosticsPath)) {
    return '(diagnostics file not created)';
  }
  const lines = readFileSync(tuiDiagnosticsPath, 'utf8')
    .trim()
    .split(/\r?\n/);
  return lines.slice(-80).join('\n') || '(diagnostics file empty)';
}

function assertOutputIncludes(output, expected, label) {
  if (!output.includes(expected)) {
    throw new Error(`${label}; expected output to include ${JSON.stringify(expected)}.\nstdout:\n${output}\nstderr:\n${stderr}`);
  }
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

function waitForClose(childProcess, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      childProcess.kill('SIGKILL');
      reject(new Error(`Ratatui product smoke timed out after ${timeoutMs}ms.`));
    }, timeoutMs);
    let spawnError;
    childProcess.once('error', (error) => {
      spawnError = error;
    });
    childProcess.once('close', (code) => {
      clearTimeout(timeout);
      if (spawnError) {
        reject(spawnError);
      } else {
        resolve(code ?? 1);
      }
    });
  });
}
