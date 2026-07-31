import { existsSync, mkdirSync, statSync } from 'node:fs';
import { resolve, isAbsolute, sep } from 'node:path';
import {
  assertPathInsideRuntimeRoot,
  createGoromboRuntimePaths,
  resolveGoromboRuntimeRoot,
  resolveRuntimePath,
} from '../../../core/config/runtime-root.js';

function readStringEnv(key: string): string | undefined {
  const value = process.env[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export function resolveImageOutputDir(): string {
  const configuredDir = readStringEnv('GOROMBO_IMAGE_OUTPUT_DIR');
  const runtimeRoot = resolveGoromboRuntimeRoot();
  const runtimePaths = createGoromboRuntimePaths(runtimeRoot);
  const configuredWorkspace =
    readStringEnv('GOROMBO_WORKSPACE_ROOT') ??
    readStringEnv('GOROMBO_CODING_WORKSPACE_ROOT');
  const workspaceRoot = configuredWorkspace
    ? assertPathInsideRuntimeRoot(
        resolveRuntimePath(configuredWorkspace, { runtimeRoot }),
        runtimeRoot,
        'Image workspace root',
      )
    : runtimePaths.codingWorkspace;
  const candidate = configuredDir
    ? resolveRuntimePath(configuredDir, { runtimeRoot })
    : resolve(workspaceRoot, 'images');
  const dir = assertPathInsideRuntimeRoot(
    candidate,
    runtimeRoot,
    'Image output root',
  );
  if (existsSync(dir)) {
    if (!statSync(dir).isDirectory()) {
      throw new Error(`Image output path ${dir} exists but is not a directory.`);
    }
  } else {
    mkdirSync(dir, { recursive: true });
  }
  return dir;
}

export function resolveImageArtifactFilePath(filePath: string): string {
  const root = resolve(resolveImageOutputDir());
  const resolved = isAbsolute(filePath) ? resolve(filePath) : resolve(root, filePath);
  if (resolved !== root && !resolved.startsWith(root + sep)) {
    throw new Error(`Image artifact path ${resolved} is outside the configured image output root ${root}.`);
  }
  return resolved;
}
