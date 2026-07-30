import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
import { parseEnv } from 'node:util';

export const deprecatedRuntimeEnvironmentAliases = [
  'GOROMBO_WEB_SEARCH_TIMEOUT_MS',
  'GOROMBO_CAPABILITY_DIR',
  'GOROMBO_CODING_WORKSPACE_ROOT',
  'GOROMBO_CODING_REPO_PATH',
];

export function copyRuntimeEnvironmentFiles({
  sourceRoot,
  runtimeRoot,
}) {
  const source = resolve(sourceRoot);
  const runtime = resolve(runtimeRoot);
  const sourceExample = join(source, 'sim-one.config.example');
  const sourceOwner = join(source, 'sim-one.config');
  const runtimeExample = join(runtime, 'sim-one.config.example');
  const runtimeOwner = join(runtime, 'sim-one.config');

  if (!existsSync(sourceExample)) {
    throw new Error(
      `Canonical runtime configuration example is missing: ${sourceExample}`,
    );
  }

  mkdirSync(runtime, { recursive: true });
  copyFileSync(sourceExample, runtimeExample);
  chmodSync(runtimeExample, 0o644);

  if (existsSync(sourceOwner)) {
    copyFileSync(sourceOwner, runtimeOwner);
    chmodSync(runtimeOwner, 0o600);
    return { exampleCopied: true, ownerCopied: true };
  }

  rmSync(runtimeOwner, { force: true });
  return { exampleCopied: true, ownerCopied: false };
}

export function selectFlueRuntimeEnvironmentFile({
  sourceRoot,
  allowExample,
}) {
  const source = resolve(sourceRoot);
  const ownerPath = join(source, 'sim-one.config');
  if (existsSync(ownerPath)) {
    return ownerPath;
  }

  const examplePath = join(source, 'sim-one.config.example');
  if (allowExample && existsSync(examplePath)) {
    return examplePath;
  }

  throw new Error(
    `SIM-ONE runtime configuration is missing at ${ownerPath}. Create it from ${examplePath}.`,
  );
}

export function createSanitizedRuntimeEnvironment({
  sourceRoot,
  env,
}) {
  const examplePath = join(resolve(sourceRoot), 'sim-one.config.example');
  if (!existsSync(examplePath)) {
    throw new Error(
      `Canonical runtime configuration example is missing: ${examplePath}`,
    );
  }

  const sanitized = { ...env };
  for (const key of Object.keys(parseEnv(readFileSync(examplePath, 'utf8')))) {
    delete sanitized[key];
  }
  for (const alias of deprecatedRuntimeEnvironmentAliases) {
    delete sanitized[alias];
  }
  return sanitized;
}

export function loadScriptRuntimeEnvironment({
  sourceRoot,
  env = process.env,
}) {
  const source = resolve(sourceRoot);
  const examplePath = join(source, 'sim-one.config.example');
  const ownerPath = join(source, 'sim-one.config');
  if (!existsSync(examplePath)) {
    throw new Error(
      `Canonical runtime configuration example is missing: ${examplePath}`,
    );
  }
  if (!existsSync(ownerPath)) {
    throw new Error(
      `SIM-ONE runtime configuration is missing at ${ownerPath}. Create it from ${examplePath}.`,
    );
  }

  const registered = new Set(
    Object.keys(parseEnv(readFileSync(examplePath, 'utf8'))),
  );
  const owner = parseEnv(readFileSync(ownerPath, 'utf8'));
  for (const key of Object.keys(owner)) {
    if (!registered.has(key)) {
      throw new Error(`Unknown SIM-ONE runtime configuration key: ${key}`);
    }
  }
  for (const key of registered) {
    delete env[key];
  }
  for (const alias of deprecatedRuntimeEnvironmentAliases) {
    delete env[alias];
  }

  const configuredKeys = [];
  for (const [key, value] of Object.entries(owner)) {
    if (!value?.trim()) {
      continue;
    }
    env[key] = value;
    configuredKeys.push(key);
  }
  configuredKeys.sort();
  return { configPath: ownerPath, configuredKeys };
}
