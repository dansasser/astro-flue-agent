import { spawnSync } from 'node:child_process';
import {
  chmodSync,
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { acquireProductArtifactLock } from './product-artifact-lock.mjs';
import { createSanitizedRuntimeEnvironment } from './runtime-configuration-files.mjs';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceRuntimeRoot = join(projectRoot, '.gorombo');
const sourceServerRoot = join(sourceRuntimeRoot, 'sim-one-alpha');
const sourceCliRoot = join(sourceRuntimeRoot, 'sim-one-cli');
const sourceConfigPath = join(sourceRuntimeRoot, 'gorombo.config.json');
const sourceEnvironmentExamplePath = join(
  sourceRuntimeRoot,
  'sim-one.config.example',
);

for (const artifact of [
  join(sourceServerRoot, 'server.mjs'),
  join(sourceServerRoot, 'builtin-capabilities.json'),
  join(sourceCliRoot, 'cli.js'),
  sourceConfigPath,
  sourceEnvironmentExamplePath,
]) {
  if (!existsSync(artifact)) {
    throw new Error(
      `${artifact} does not exist. Run pnpm run build and pnpm run build:cli before the capability product smoke test.`,
    );
  }
}

const releaseArtifactLock = await acquireProductArtifactLock();
const fixtureRoot = mkdtempSync(join(tmpdir(), 'sim-one-capability-product-'));
const runtimeRoot = join(fixtureRoot, '.gorombo');
const launchDirectory = join(fixtureRoot, 'arbitrary-launch-directory');
const sourceRoot = join(fixtureRoot, 'capability-sources');
const cliPath = join(runtimeRoot, 'sim-one-cli', 'cli.js');
const capabilitiesRoot = join(runtimeRoot, 'capabilities');

try {
  mkdirSync(runtimeRoot, { recursive: true });
  mkdirSync(launchDirectory, { recursive: true });
  mkdirSync(sourceRoot, { recursive: true });
  cpSync(sourceServerRoot, join(runtimeRoot, 'sim-one-alpha'), {
    recursive: true,
    force: true,
    verbatimSymlinks: true,
  });
  cpSync(sourceCliRoot, join(runtimeRoot, 'sim-one-cli'), {
    recursive: true,
    force: true,
    verbatimSymlinks: true,
  });
  cpSync(sourceConfigPath, join(runtimeRoot, 'gorombo.config.json'));
  cpSync(
    sourceEnvironmentExamplePath,
    join(runtimeRoot, 'sim-one.config.example'),
  );
  cpSync(sourceEnvironmentExamplePath, join(runtimeRoot, 'sim-one.config'));
  chmodSync(join(runtimeRoot, 'sim-one.config'), 0o600);

  const sources = {
    skill: createSource('skill', 'product-skill'),
    tool: createSource('tool', 'product-tool'),
    worker: createSource('worker', 'product-worker'),
  };
  const env = {
    ...createSanitizedRuntimeEnvironment({
      sourceRoot: projectRoot,
      env: process.env,
    }),
    HOME: join(fixtureRoot, 'unrelated-home'),
    USERPROFILE: join(fixtureRoot, 'unrelated-home'),
    GOROMBO_RUNTIME_ROOT: runtimeRoot,
  };

  for (const [kind, source] of Object.entries(sources)) {
    const result = runCli([
      kind,
      'validate',
      source,
      `product-${kind}`,
      `Product ${kind}`,
      '--disable',
      '--version',
      'fixture-v1',
    ], env);
    assertOperation(result, 'validate');
    assertProtocolValidation(result);
  }
  const mcpValidation = runCli([
    'mcp',
    'validate',
    'product-mcp',
    'Product MCP',
    '--url',
    'https://mcp.example.test/api',
    '--transport',
    'streamable-http',
    '--token-env',
    'GOROMBO_MCP_TOKEN',
  ], env);
  assertOperation(mcpValidation, 'validate');
  assertProtocolValidation(mcpValidation);
  const adapterValidation = runCompatibilityCli([
    'validate',
    'skill',
    sources.skill,
    'product-skill',
    'Product skill',
    '--disable',
    '--version',
    'fixture-v1',
  ], env);
  assertOperation(adapterValidation, 'validate');
  assertProtocolValidation(adapterValidation);

  for (const kind of ['skill', 'tool', 'worker', 'mcp']) {
    const listed = runCli([kind, 'list'], env);
    if (listed.records.length !== 0) {
      throw new Error(`${kind} validation mutated the packaged registry.`);
    }
  }

  for (const [kind, source] of Object.entries(sources)) {
    const added = runCli([
      kind,
      'add',
      source,
      `product-${kind}`,
      `Product ${kind}`,
      '--disable',
      '--version',
      'fixture-v1',
    ], env);
    assertOperation(added, 'add');
    assertProtocolValidation(added);
    assertRecord(added, kind, `product-${kind}`, false);
  }
  const cliEnabledTool = runCli([
    'tool',
    'add',
    sources.tool,
    'product-cli-enabled-tool',
    'Product CLI enabled tool',
    '--enable',
    '--version',
    'fixture-v1',
  ], env);
  assertOperation(cliEnabledTool, 'add');
  assertProtocolValidation(cliEnabledTool);
  assertRecord(cliEnabledTool, 'tool', 'product-cli-enabled-tool', true);
  assertMaterialized('tool', 'product-cli-enabled-tool');
  const addedMcp = runCli([
    'mcp',
    'add',
    'product-mcp',
    'Product MCP',
    '--url',
    'https://mcp.example.test/api',
    '--transport',
    'streamable-http',
    '--token-env',
    'GOROMBO_MCP_TOKEN',
  ], env);
  assertOperation(addedMcp, 'add');
  assertProtocolValidation(addedMcp);
  assertRecord(addedMcp, 'mcp', 'product-mcp', false);
  if (addedMcp.record?.source !== 'local') {
    throw new Error(
      `Packaged MCP add classified a runtime registry record as ${String(addedMcp.record?.source)} instead of local.`,
    );
  }

  for (const kind of ['skill', 'tool', 'worker', 'mcp']) {
    const inspected = runCli([kind, 'inspect', `product-${kind}`], env);
    assertOperation(inspected, 'inspect');
    assertRecord(inspected, kind, `product-${kind}`, false);
  }

  const enabledBeforeUpdate = runCli(
    ['tool', 'enable', 'product-tool'],
    env,
  );
  assertRecord(enabledBeforeUpdate, 'tool', 'product-tool', true);
  assertMaterialized('tool', 'product-tool');
  const disabledByUpdate = runCli(
    ['tool', 'update', 'product-tool'],
    env,
  );
  assertOperation(disabledByUpdate, 'update');
  assertProtocolValidation(disabledByUpdate);
  assertRecord(disabledByUpdate, 'tool', 'product-tool', false);
  assertNotMaterialized('tool', 'product-tool');

  for (const kind of ['skill', 'worker']) {
    const updated = runCli([kind, 'update', `product-${kind}`], env);
    assertOperation(updated, 'update');
    assertProtocolValidation(updated);
  }
  const updatedMcp = runCli([
    'mcp',
    'update',
    'product-mcp',
    '--url',
    'https://mcp.example.test/v2',
    '--transport',
    'sse',
  ], env);
  assertOperation(updatedMcp, 'update');
  assertProtocolValidation(updatedMcp);
  if (
    updatedMcp.record?.config?.mcpUrl !== 'https://mcp.example.test/v2' ||
    updatedMcp.record?.config?.mcpTransport !== 'sse'
  ) {
    throw new Error('Packaged MCP update did not persist endpoint metadata.');
  }

  for (const kind of ['skill', 'tool', 'worker', 'mcp']) {
    const enabled = runCli([kind, 'enable', `product-${kind}`], env);
    assertOperation(enabled, 'enable');
    assertProtocolValidation(enabled);
    assertRecord(enabled, kind, `product-${kind}`, true);
    if (kind !== 'mcp') {
      assertMaterialized(kind, `product-${kind}`);
    }

    const disabled = runCli([kind, 'disable', `product-${kind}`], env);
    assertOperation(disabled, 'disable');
    assertProtocolValidation(disabled);
    assertRecord(disabled, kind, `product-${kind}`, false);
    if (kind !== 'mcp') {
      assertNotMaterialized(kind, `product-${kind}`);
    }
  }

  for (const kind of ['skill', 'tool', 'worker', 'mcp']) {
    const removed = runCli([kind, 'remove', `product-${kind}`], env);
    assertOperation(removed, 'remove');
    assertProtocolValidation(removed);
    if (removed.records.length !== 0) {
      throw new Error(`${kind} removal left a registry record behind.`);
    }
    if (kind !== 'mcp') {
      const installedPath = join(
        capabilitiesRoot,
        `${kind}s`,
        `product-${kind}`,
      );
      if (existsSync(installedPath)) {
        throw new Error(`${kind} removal left ${installedPath} behind.`);
      }
    }
  }
  const removedCliEnabledTool = runCli(
    ['tool', 'remove', 'product-cli-enabled-tool'],
    env,
  );
  assertOperation(removedCliEnabledTool, 'remove');
  assertProtocolValidation(removedCliEnabledTool);
  assertNotMaterialized('tool', 'product-cli-enabled-tool');

  console.log(
    '[capability-product] PASS validation and lifecycle operations used the relocated packaged CLI with protocol evidence.',
  );
} finally {
  rmSync(fixtureRoot, {
    recursive: true,
    force: true,
    maxRetries: 5,
    retryDelay: 50,
  });
  await releaseArtifactLock();
}

function runCli(args, env) {
  const result = spawnSync(process.execPath, [cliPath, ...args], {
    cwd: launchDirectory,
    env,
    encoding: 'utf8',
    timeout: 120_000,
    maxBuffer: 10 * 1024 * 1024,
  });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(
      `Packaged CLI failed (${args.join(' ')}).\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
    );
  }
  try {
    return JSON.parse(result.stdout.trim());
  } catch {
    throw new Error(
      `Packaged CLI returned non-JSON output (${args.join(' ')}).\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
    );
  }
}

function runCompatibilityCli(args, env) {
  const result = spawnSync(
    process.execPath,
    [join(projectRoot, 'scripts', 'capability-admin.mjs'), ...args],
    {
      cwd: projectRoot,
      env,
      encoding: 'utf8',
      timeout: 120_000,
      maxBuffer: 10 * 1024 * 1024,
    },
  );
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(
      `Compatibility capability command failed (${args.join(' ')}).\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
    );
  }
  try {
    return JSON.parse(result.stdout.trim());
  } catch {
    throw new Error(
      `Compatibility capability command returned non-JSON output (${args.join(' ')}).\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
    );
  }
}

function assertOperation(result, expected) {
  if (result.operation !== expected) {
    throw new Error(
      `Expected operation ${expected}, received ${String(result.operation)}.`,
    );
  }
}

function assertProtocolValidation(result) {
  const directive = result.protocolContext?.directives?.find(
    (candidate) => candidate.id === 'capabilities.lifecycle-routing',
  );
  if (!directive) {
    throw new Error(
      `${result.operation} did not retain capabilities.lifecycle-routing evidence.`,
    );
  }
  if (
    !directive.rules.some((rule) =>
      rule.toLowerCase().includes('validation'),
    )
  ) {
    throw new Error(
      `${result.operation} protocol evidence did not include a validation rule.`,
    );
  }
}

function assertRecord(result, kind, id, enabled) {
  if (
    result.record?.kind !== kind ||
    result.record?.id !== id ||
    result.record?.enabled !== enabled
  ) {
    throw new Error(
      `Unexpected ${kind} record for ${id}: ${JSON.stringify(result.record)}`,
    );
  }
}

function assertMaterialized(kind, id) {
  const expectedFile = {
    skill: 'SKILL.md',
    tool: 'index.mjs',
    worker: 'index.mjs',
  }[kind];
  const installedPath = join(capabilitiesRoot, `${kind}s`, id, expectedFile);
  if (!existsSync(installedPath)) {
    throw new Error(`Packaged ${kind} add did not create ${installedPath}.`);
  }
}

function assertNotMaterialized(kind, id) {
  const installedPath = join(capabilitiesRoot, `${kind}s`, id);
  if (existsSync(installedPath)) {
    throw new Error(`Packaged ${kind} disable left ${installedPath} active.`);
  }
}

function createSource(kind, id) {
  const source = join(sourceRoot, id);
  mkdirSync(source, { recursive: true });
  switch (kind) {
    case 'skill':
      writeFileSync(
        join(source, 'SKILL.md'),
        `---\nname: ${id}\ndescription: Packaged product fixture.\n---\n\n# ${id}\n`,
      );
      break;
    case 'tool':
      writeFileSync(
        join(source, 'index.mjs'),
        "import { defineTool } from '@flue/runtime';\nexport default defineTool({ name: 'product-tool', parameters: {}, execute: async () => 'ok' });\n",
      );
      break;
    case 'worker':
      writeFileSync(
        join(source, 'index.mjs'),
        "import { defineAgentProfile } from '@flue/runtime';\nexport default defineAgentProfile({ name: 'product-worker', instructions: 'Product fixture.' });\n",
      );
      mkdirSync(join(source, 'workspace'), { recursive: true });
      writeFileSync(
        join(source, 'workspace', 'AGENTS.md'),
        '# Product worker fixture\n',
      );
      break;
    default:
      throw new Error(`Unsupported source fixture kind: ${kind}`);
  }
  return source;
}
