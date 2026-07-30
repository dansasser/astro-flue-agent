import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { parseEnv } from 'node:util';

const compiledRegistryPath = resolve(
  '.tmp/tsc/core/config/runtime-environment.js',
);
if (!existsSync(compiledRegistryPath)) {
  throw new Error(
    'Compiled runtime configuration registry is missing. Run pnpm run typecheck:emit first.',
  );
}

const pack = spawnSync(
  'npm',
  ['pack', '--dry-run', '--json', '--ignore-scripts'],
  {
    cwd: resolve('.'),
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  },
);
if (pack.status !== 0) {
  throw new Error(
    `npm pack --dry-run failed: ${pack.stderr || pack.stdout}`,
  );
}
const report = JSON.parse(pack.stdout);
const files = report[0]?.files?.map((entry) => entry.path) ?? [];
for (const required of [
  'sim-one.config.example',
  '.gorombo/sim-one.config.example',
]) {
  if (!files.includes(required)) {
    throw new Error(`Public package is missing ${required}.`);
  }
}

const forbiddenPaths = files.filter((path) => {
  const name = basename(path);
  return (
    name === 'sim-one.config' ||
    name === '.env' ||
    name.startsWith('.env.')
  );
});
if (forbiddenPaths.length > 0) {
  throw new Error(
    `Public package contains forbidden owner configuration paths: ${forbiddenPaths.join(', ')}`,
  );
}

const { runtimeEnvironmentDefinitions } = await import(compiledRegistryPath);
const ownerPath = resolve('sim-one.config');
if (existsSync(ownerPath)) {
  const owner = parseEnv(readFileSync(ownerPath, 'utf8'));
  const configuredSecrets = runtimeEnvironmentDefinitions
    .filter((definition) => definition.secret)
    .map((definition) => ({
      key: definition.key,
      value: owner[definition.key] ?? '',
    }))
    .filter((entry) => entry.value.length > 0);

  for (const path of files) {
    const absolutePath = resolve(path);
    if (!existsSync(absolutePath)) {
      continue;
    }
    const contents = readFileSync(absolutePath);
    for (const secret of configuredSecrets) {
      if (contents.includes(Buffer.from(secret.value))) {
        throw new Error(
          `Public package file ${path} contains configured secret ${secret.key}.`,
        );
      }
    }
  }
}

console.log(
  `[package-config] ${files.length} public files checked; canonical example included and owner configuration, .env files, and configured secret values excluded.`,
);
