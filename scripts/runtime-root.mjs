import { dirname, isAbsolute, basename, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export function resolveScriptRuntimeRoot(env = process.env) {
  const configured = readString(env.GOROMBO_RUNTIME_ROOT);
  const runtimeRoot = configured ?? resolve(projectRoot, '.gorombo');
  if (!isAbsolute(runtimeRoot)) {
    throw new Error(`GOROMBO_RUNTIME_ROOT must be absolute: ${runtimeRoot}`);
  }
  const normalized = resolve(runtimeRoot);
  if (basename(normalized) !== '.gorombo') {
    throw new Error(`GOROMBO_RUNTIME_ROOT must end in .gorombo: ${runtimeRoot}`);
  }
  return normalized;
}

export function resolveScriptRuntimePath(filePath, env = process.env) {
  const value = String(filePath ?? '').trim();
  if (!value) {
    throw new Error('Runtime path must be a non-empty string.');
  }
  if (isAbsolute(value)) {
    return resolve(value);
  }

  const normalizedInput = value.replaceAll('\\', '/');
  if (normalizedInput === '.gorombo' || normalizedInput.startsWith('.gorombo/')) {
    throw new Error(`Relative runtime path must not include a nested .gorombo segment: ${value}`);
  }

  const runtimeRoot = resolveScriptRuntimeRoot(env);
  const resolvedPath = resolve(runtimeRoot, value);
  const relativePath = relative(runtimeRoot, resolvedPath);
  if (
    relativePath === '..' ||
    relativePath.startsWith(`..${sep}`) ||
    isAbsolute(relativePath)
  ) {
    throw new Error(`Relative runtime path resolves outside the GOROMBO runtime root: ${value}`);
  }
  return resolvedPath;
}

function readString(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}
