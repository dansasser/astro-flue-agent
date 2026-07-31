import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, isAbsolute, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { resolveCodingWorkspacePath } from '../../core/config/runtime-root.js';
import type { CapabilityKind, CapabilityRecord } from '../../engine/capabilities/types.js';
import { resolveCapabilityPath } from '../../engine/capabilities/capability-loader.js';

export interface MaterializeOptions {
  record: CapabilityRecord;
  env?: Record<string, unknown>;
  gitRunner?: GitRunner;
}

export interface MaterializeResult {
  path: string;
  action: 'cloned' | 'copied' | 'skipped' | 'removed';
}

export type GitRunner = (
  args: string[],
  options: {
    stdio: 'pipe';
    timeout: number;
  },
) => void;

export function materializeCapability(options: MaterializeOptions): MaterializeResult {
  const {
    record,
    env = process.env,
    gitRunner = defaultGitRunner,
  } = options;
  const targetPath = resolveCapabilityPath(env, record.kind, record.id);

  if (!record.enabled) {
    if (existsSync(targetPath)) {
      rmSync(targetPath, { recursive: true, force: true });
      return { path: targetPath, action: 'removed' };
    }
    return { path: targetPath, action: 'skipped' };
  }

  mkdirSync(dirname(targetPath), { recursive: true });

  switch (record.source) {
    case 'github':
      return materializeFromGithub(record, targetPath, gitRunner);
    case 'local':
      return materializeFromLocal(record, targetPath, env);
    default:
      return { path: targetPath, action: 'skipped' };
  }
}

function materializeFromGithub(
  record: CapabilityRecord,
  targetPath: string,
  gitRunner: GitRunner,
): MaterializeResult {
  assertGithubCapabilitySourceRef(record.sourceRef);
  if (existsSync(targetPath)) {
    rmSync(targetPath, { recursive: true, force: true });
  }

  try {
    if (record.version && isCommitReference(record.version)) {
      gitRunner(['clone', '--no-checkout', record.sourceRef, targetPath], {
        stdio: 'pipe',
        timeout: 30_000,
      });
      gitRunner(['-C', targetPath, 'fetch', '--depth', '1', 'origin', record.version], {
        stdio: 'pipe',
        timeout: 30_000,
      });
      gitRunner(['-C', targetPath, 'checkout', '--detach', 'FETCH_HEAD'], {
        stdio: 'pipe',
        timeout: 10_000,
      });
    } else {
      const args = ['clone', '--depth', '1'];
      if (record.version && record.version !== 'latest') {
        args.push('--branch', record.version);
      }
      args.push(record.sourceRef, targetPath);
      gitRunner(args, {
        stdio: 'pipe',
        timeout: 30_000,
      });
    }
  } catch (error) {
    rmSync(targetPath, { recursive: true, force: true });
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Failed to materialize version "${record.version ?? 'latest'}" for capability "${record.id}": ${message}`,
    );
  }

  rmSync(resolve(targetPath, '.git'), { recursive: true, force: true });
  return { path: targetPath, action: 'cloned' };
}

export function assertGithubCapabilitySourceRef(sourceRef: string): void {
  const value = sourceRef.trim();
  const scpStyle =
    /^git@github\.com:[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\.git)?$/;
  if (scpStyle.test(value)) {
    return;
  }

  try {
    const parsed = new URL(value);
    const protocolAllowed =
      parsed.protocol === 'https:' || parsed.protocol === 'ssh:';
    const usernameAllowed =
      parsed.protocol === 'https:'
        ? parsed.username === ''
        : parsed.username === '' || parsed.username === 'git';
    const segments = parsed.pathname.split('/').filter(Boolean);
    if (
      protocolAllowed
      && parsed.hostname.toLowerCase() === 'github.com'
      && usernameAllowed
      && parsed.password === ''
      && parsed.port === ''
      && parsed.search === ''
      && parsed.hash === ''
      && segments.length === 2
      && /^[A-Za-z0-9_.-]+$/.test(segments[0] ?? '')
      && /^[A-Za-z0-9_.-]+(?:\.git)?$/.test(segments[1] ?? '')
    ) {
      return;
    }
  } catch {
    // Fall through to the bounded validation error.
  }

  throw new Error(
    'GitHub capability source must be a github.com HTTPS or SSH repository URL.',
  );
}

function materializeFromLocal(
  record: CapabilityRecord,
  targetPath: string,
  env: Record<string, unknown>,
): MaterializeResult {
  const sourcePath = isAbsolute(record.sourceRef)
    ? record.sourceRef
    : resolveCodingWorkspacePath(record.sourceRef, { env });

  if (!existsSync(sourcePath)) {
    throw new Error(`Local capability source not found: ${sourcePath}`);
  }

  if (existsSync(targetPath)) {
    rmSync(targetPath, { recursive: true, force: true });
  }

  cpSync(sourcePath, targetPath, { recursive: true, force: true });
  return { path: targetPath, action: 'copied' };
}

function defaultGitRunner(
  args: string[],
  options: {
    stdio: 'pipe';
    timeout: number;
  },
): void {
  execFileSync('git', args, options);
}

function isCommitReference(value: string): boolean {
  return /^[a-f0-9]{7,40}$/i.test(value);
}
