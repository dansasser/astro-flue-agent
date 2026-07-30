import { existsSync, readFileSync, statSync } from 'node:fs';
import { isAbsolute, basename, dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const runtimeRootDirectoryName = '.gorombo';
const projectPackageName = 'sim-one-alpha';

export interface ResolveGoromboRuntimeRootOptions {
  env?: Record<string, unknown>;
  modulePath?: string | URL;
  testRoot?: string;
}

export interface ResolveRuntimePathOptions extends ResolveGoromboRuntimeRootOptions {
  runtimeRoot?: string;
}

export interface GoromboRuntimePaths {
  runtimeRoot: string;
  packagedServer: string;
  packagedCli: string;
  packagedTui: string;
  personaWorkspace: string;
  codingWorkspace: string;
  codingRepos: string;
  codingProjects: string;
  databases: string;
  capabilities: string;
  approvals: string;
  auth: string;
  logs: string;
  codingWorkerState: string;
  environmentConfig: string;
  environmentConfigExample: string;
  config: string;
}

export function resolveGoromboRuntimeRoot(
  options: ResolveGoromboRuntimeRootOptions = {},
): string {
  const env = options.env ?? process.env;
  const configuredRoot = readString(env.GOROMBO_RUNTIME_ROOT);
  if (configuredRoot) {
    return validateRuntimeRoot(configuredRoot, 'GOROMBO_RUNTIME_ROOT');
  }

  const modulePath = normalizeModulePath(options.modulePath ?? import.meta.url);
  const packagedRoot = findAncestorNamed(modulePath, runtimeRootDirectoryName);
  if (packagedRoot) {
    return validateRuntimeRoot(packagedRoot, 'packaged module owner');
  }

  const sourceRoot = findSourceProjectRoot(modulePath);
  if (sourceRoot) {
    return validateRuntimeRoot(resolve(sourceRoot, runtimeRootDirectoryName), 'source checkout');
  }

  if (options.testRoot) {
    return validateRuntimeRoot(options.testRoot, 'test runtime root');
  }

  throw new Error(
    'Could not resolve the GOROMBO runtime root. Set GOROMBO_RUNTIME_ROOT to the absolute path of the owning .gorombo directory.',
  );
}

export function createGoromboRuntimePaths(runtimeRoot: string): GoromboRuntimePaths {
  const root = validateRuntimeRoot(runtimeRoot, 'runtime root');
  const packagedServer = resolve(root, 'sim-one-alpha');
  const codingWorkspace = resolve(root, 'workspace');

  return {
    runtimeRoot: root,
    packagedServer,
    packagedCli: resolve(root, 'sim-one-cli'),
    packagedTui: resolve(root, 'sim-one-ratatui'),
    personaWorkspace: resolve(packagedServer, 'workspace'),
    codingWorkspace,
    codingRepos: resolve(codingWorkspace, 'repos'),
    codingProjects: resolve(codingWorkspace, 'projects'),
    databases: resolve(root, 'db'),
    capabilities: resolve(root, 'capabilities'),
    approvals: resolve(root, 'approvals'),
    auth: resolve(root, 'auth'),
    logs: resolve(root, 'logs'),
    codingWorkerState: resolve(root, 'coding-worker'),
    environmentConfig: resolve(root, 'sim-one.config'),
    environmentConfigExample: resolve(root, 'sim-one.config.example'),
    config: resolve(root, 'gorombo.config.json'),
  };
}

export function resolveRuntimePath(
  filePath: string,
  options: ResolveRuntimePathOptions = {},
): string {
  const value = filePath.trim();
  if (!value) {
    throw new Error('Runtime path must be a non-empty string.');
  }

  if (isAbsolute(value)) {
    return resolve(value);
  }

  const normalized = value.replaceAll('\\', '/');
  if (normalized === runtimeRootDirectoryName || normalized.startsWith(`${runtimeRootDirectoryName}/`)) {
    throw new Error(
      `Relative runtime path must not include a nested .gorombo segment: ${filePath}`,
    );
  }

  const runtimeRoot = options.runtimeRoot
    ? validateRuntimeRoot(options.runtimeRoot, 'runtime root')
    : resolveGoromboRuntimeRoot(options);
  const resolvedPath = resolve(runtimeRoot, value);
  const relativePath = relative(runtimeRoot, resolvedPath);
  if (
    relativePath === '..' ||
    relativePath.startsWith(`..${sep}`) ||
    isAbsolute(relativePath)
  ) {
    throw new Error(
      `Relative runtime path resolves outside the GOROMBO runtime root: ${filePath}`,
    );
  }

  return resolvedPath;
}

export function assertPathInsideRuntimeRoot(
  filePath: string,
  runtimeRoot: string,
  label = 'Runtime path',
): string {
  const root = validateRuntimeRoot(runtimeRoot, 'runtime root');
  const resolvedPath = resolve(filePath);
  const relativePath = relative(root, resolvedPath);
  if (
    !relativePath ||
    relativePath === '..' ||
    relativePath.startsWith(`..${sep}`) ||
    isAbsolute(relativePath)
  ) {
    throw new Error(
      `${label} must stay inside the GOROMBO runtime root: ${filePath}`,
    );
  }
  return resolvedPath;
}

export function isPathInsideRuntimeRoot(
  filePath: string | URL,
  runtimeRoot: string,
): boolean {
  const root = validateRuntimeRoot(runtimeRoot, 'runtime root');
  const resolvedPath = normalizeModulePath(filePath);
  const relativePath = relative(root, resolvedPath);
  return (
    relativePath === '' ||
    (!relativePath.startsWith(`..${sep}`) &&
      relativePath !== '..' &&
      !isAbsolute(relativePath))
  );
}

export function findSourceProjectRoot(modulePath: string | URL): string | undefined {
  let current = normalizeModulePath(modulePath);
  if (!existsSync(current) || !isDirectoryLike(current)) {
    current = dirname(current);
  }

  while (true) {
    const packagePath = resolve(current, 'package.json');
    if (existsSync(packagePath) && isSimOnePackage(packagePath)) {
      return current;
    }

    const parent = dirname(current);
    if (parent === current) {
      return undefined;
    }
    current = parent;
  }
}

function validateRuntimeRoot(value: string, source: string): string {
  if (!isAbsolute(value)) {
    throw new Error(`${source} must be absolute: ${value}`);
  }

  const normalized = resolve(value);
  if (basename(normalized) !== runtimeRootDirectoryName) {
    throw new Error(`${source} must end in .gorombo: ${value}`);
  }

  return normalized;
}

function normalizeModulePath(value: string | URL): string {
  if (value instanceof URL) {
    return fileURLToPath(value);
  }
  if (value.startsWith('file:')) {
    return fileURLToPath(value);
  }
  return resolve(value);
}

function findAncestorNamed(startPath: string, name: string): string | undefined {
  let current = isDirectoryLike(startPath) ? startPath : dirname(startPath);

  while (true) {
    if (basename(current) === name) {
      return current;
    }

    const parent = dirname(current);
    if (parent === current) {
      return undefined;
    }
    current = parent;
  }
}

function isDirectoryLike(filePath: string): boolean {
  try {
    return statSync(filePath).isDirectory();
  } catch {
    return false;
  }
}

function isSimOnePackage(packagePath: string): boolean {
  try {
    const parsed = JSON.parse(readFileSync(packagePath, 'utf8')) as { name?: unknown };
    return parsed.name === projectPackageName;
  } catch {
    return false;
  }
}

function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}
