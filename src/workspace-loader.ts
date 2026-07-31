import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  createGoromboRuntimePaths,
  findSourceProjectRoot,
  resolveGoromboRuntimeRoot,
  type ResolveGoromboRuntimeRootOptions,
} from './core/config/runtime-root.js';

export const workspaceFileOrder = [
  'SECURITY.md',
  'AGENTS.md',
  'IDENTITY.md',
  'SOUL.md',
  'USER.md',
  'TOOLS.md',
  'MEMORY.md',
  'HEARTBEAT.md',
] as const;

export type WorkspaceFileName = (typeof workspaceFileOrder)[number];

export interface ComposeWorkspaceInstructionsOptions {
  workspaceDir: string | URL;
  title: string;
  files?: readonly WorkspaceFileName[];
}

export interface ResolveWorkspaceDirectoryOptions extends ResolveGoromboRuntimeRootOptions {
  runtimeRoot?: string;
  sourceProjectRoot?: string;
}

/**
 * Builds an instruction block from the ordered markdown files in a persona workspace.
 */
export function composeWorkspaceInstructions({
  workspaceDir,
  title,
  files = workspaceFileOrder,
}: ComposeWorkspaceInstructionsOptions): string {
  const workspacePath = resolveWorkspaceDir(workspaceDir);
  const sections = files.map((fileName) => {
    const filePath = resolveWorkspaceFilePath(workspacePath, fileName);
    const content = readWorkspaceFile(filePath, fileName).trim();

    return `## ${fileName}\n\n${content}`;
  });

  return [`# ${title}`, ...sections].join('\n\n');
}

/**
 * Resolves a workspace file path while rejecting path traversal outside the workspace.
 */
export function resolveWorkspaceFilePath(workspacePath: string, fileName: string): string {
  const normalizedWorkspacePath = resolve(workspacePath);
  const filePath = resolve(normalizedWorkspacePath, fileName);
  const relativePath = relative(normalizedWorkspacePath, filePath);

  if (!relativePath || relativePath.startsWith('..') || isAbsolute(relativePath)) {
    throw new Error(`Workspace file resolves outside workspace directory: ${fileName}`);
  }

  return filePath;
}

/**
 * Resolves an application-owned persona workspace from either the source
 * checkout or the packaged server directory.
 */
export function resolveWorkspaceDirectory(
  relativeWorkspacePath: string,
  options: ResolveWorkspaceDirectoryOptions = {},
): string {
  if (isAbsolute(relativeWorkspacePath)) {
    throw new Error(`Workspace directory must be relative: ${relativeWorkspacePath}`);
  }

  const normalizedWorkspacePath = relativeWorkspacePath.replaceAll('\\', '/');
  const runtimeRoot = options.runtimeRoot ?? resolveGoromboRuntimeRoot(options);
  const packagedCandidate = resolveWorkspaceCandidate(
    createGoromboRuntimePaths(runtimeRoot).packagedServer,
    normalizedWorkspacePath,
  );
  const modulePath = resolveModulePath(options.modulePath ?? import.meta.url);
  const packagedModule = isWithin(runtimeRoot, modulePath);
  if (packagedModule) {
    if (existsSync(packagedCandidate)) {
      return packagedCandidate;
    }
    throw new Error(`Packaged workspace directory not found: ${packagedCandidate}`);
  }

  const sourceRoot =
    options.sourceProjectRoot ??
    findSourceProjectRoot(modulePath);
  const sourceCandidate = sourceRoot
    ? resolveSourceWorkspaceCandidate(sourceRoot, normalizedWorkspacePath)
    : undefined;

  if (sourceCandidate && existsSync(sourceCandidate)) {
    return sourceCandidate;
  }
  if (existsSync(packagedCandidate)) {
    return packagedCandidate;
  }

  throw new Error(
    `Workspace directory not found. Checked: ${[
      ...(sourceCandidate ? [sourceCandidate] : []),
      packagedCandidate,
    ].join(', ')}`,
  );
}

/**
 * Normalizes string and URL workspace directory inputs into filesystem paths.
 */
function resolveWorkspaceDir(workspaceDir: string | URL): string {
  return workspaceDir instanceof URL ? fileURLToPath(workspaceDir) : workspaceDir;
}

function resolveModulePath(modulePath: string | URL): string {
  if (modulePath instanceof URL) {
    return fileURLToPath(modulePath);
  }
  return modulePath.startsWith('file:') ? fileURLToPath(modulePath) : resolve(modulePath);
}

function isWithin(rootPath: string, candidatePath: string): boolean {
  const relativePath = relative(resolve(rootPath), resolve(candidatePath));
  return (
    relativePath === '' ||
    (!relativePath.startsWith('..') && !isAbsolute(relativePath))
  );
}

/**
 * Resolves a workspace directory candidate under one runtime root and rejects escapes.
 */
function resolveWorkspaceCandidate(rootPath: string, relativeWorkspacePath: string): string {
  const workspacePath = resolve(rootPath, relativeWorkspacePath);
  const relativePath = relative(rootPath, workspacePath);

  if (!relativePath || relativePath.startsWith('..') || isAbsolute(relativePath)) {
    throw new Error(`Workspace directory resolves outside ${rootPath}: ${relativeWorkspacePath}`);
  }

  return workspacePath;
}

function resolveSourceWorkspaceCandidate(
  sourceProjectRoot: string,
  relativeWorkspacePath: string,
): string {
  if (relativeWorkspacePath === 'workspace') {
    return resolveWorkspaceCandidate(
      resolve(sourceProjectRoot, 'src'),
      relativeWorkspacePath,
    );
  }

  if (relativeWorkspacePath.startsWith('workers/')) {
    return resolveWorkspaceCandidate(
      resolve(sourceProjectRoot, 'src/engine'),
      relativeWorkspacePath,
    );
  }

  throw new Error(`Unsupported source workspace path: ${relativeWorkspacePath}`);
}

/**
 * Reads a workspace file and rethrows failures with the file name and resolved path.
 */
function readWorkspaceFile(filePath: string, fileName: WorkspaceFileName): string {
  try {
    return readFileSync(filePath, 'utf8');
  } catch (error) {
    throw new Error(
      `Failed to read workspace file ${fileName} at ${filePath}: ${
        error instanceof Error ? error.message : String(error)
      }`,
      { cause: error },
    );
  }
}
