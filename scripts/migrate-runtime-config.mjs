import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const sourcePath = resolve(process.argv[2] ?? '.env');
const targetPath = resolve(process.argv[3] ?? 'sim-one.config');
const examplePath = resolve('sim-one.config.example');
const compiledModulePath = resolve(
  '.tmp/tsc/core/config/runtime-environment.js',
);

if (!existsSync(sourcePath)) {
  throw new Error(`Legacy environment file does not exist: ${sourcePath}`);
}
if (!existsSync(examplePath)) {
  throw new Error(`Canonical configuration example does not exist: ${examplePath}`);
}
if (!existsSync(compiledModulePath)) {
  throw new Error(
    'Compiled configuration registry is missing. Run pnpm run typecheck:emit before config:migrate.',
  );
}

const { migrateRuntimeEnvironmentFile } = await import(compiledModulePath);
const result = migrateRuntimeEnvironmentFile({
  sourcePath,
  targetPath,
  examplePath,
});

console.log(
  `[config:migrate] Wrote ${targetPath} with ${result.migratedKeys.length} migrated registered keys (mode 0600).`,
);
if (result.deprecatedAliases.length > 0) {
  console.log(
    `[config:migrate] Normalized deprecated keys: ${result.deprecatedAliases.join(', ')}`,
  );
}
if (result.ignoredKeys.length > 0) {
  console.log(
    `[config:migrate] Ignored unsupported/bootstrap keys: ${result.ignoredKeys.join(', ')}`,
  );
}
