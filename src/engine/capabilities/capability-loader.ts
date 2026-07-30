import { existsSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';
import {
  createGoromboRuntimePaths,
  resolveGoromboRuntimeRoot,
  resolveRuntimePath,
} from '../../core/config/runtime-root.js';
import type { CapabilityKind, CapabilityRecord, CapabilityStore } from '../../engine/capabilities/types.js';

export interface LoadedUserCapabilities {
  skills: CapabilityRecord[];
  tools: CapabilityRecord[];
  workers: CapabilityRecord[];
  mcp: CapabilityRecord[];
}

export interface CapabilityLoaderOptions {
  store: CapabilityStore;
}

export interface PromotedCapabilityLoaderOptions
  extends CapabilityLoaderOptions {
  env?: Record<string, unknown>;
}

export interface CapabilityLoadFailure {
  id: string;
  kind: Exclude<CapabilityKind, 'mcp'>;
  error: string;
}

export interface LoadedPromotedUserCapabilities
  extends LoadedUserCapabilities {
  failures: CapabilityLoadFailure[];
}

export function loadUserCapabilities(options: CapabilityLoaderOptions): LoadedUserCapabilities {
  const { store } = options;
  const all = store.list({ enabledOnly: true });

  return {
    skills: all.filter((r) => r.kind === 'skill'),
    tools: all.filter((r) => r.kind === 'tool'),
    workers: all.filter((r) => r.kind === 'worker'),
    mcp: all.filter((r) => r.kind === 'mcp'),
  };
}

export function loadPromotedUserCapabilities(
  options: PromotedCapabilityLoaderOptions,
): LoadedPromotedUserCapabilities {
  const capabilities = loadUserCapabilities(options);
  const env = options.env ?? process.env;
  const failures: CapabilityLoadFailure[] = [];
  const retainPromoted =
    (kind: Exclude<CapabilityKind, 'mcp'>) =>
    (record: CapabilityRecord): boolean => {
      if (existsSync(resolveCapabilityPath(env, kind, record.id))) {
        return true;
      }
      failures.push({
        id: record.id,
        kind,
        error: 'Promoted capability package is missing.',
      });
      return false;
    };

  return {
    skills: capabilities.skills.filter(retainPromoted('skill')),
    tools: capabilities.tools.filter(retainPromoted('tool')),
    workers: capabilities.workers.filter(retainPromoted('worker')),
    mcp: capabilities.mcp,
    failures,
  };
}

export function resolveCapabilitiesDir(env: Record<string, unknown> = process.env): string {
  const configured =
    readEnv(env, 'GOROMBO_CAPABILITIES_DIR') ??
    readEnv(env, 'GOROMBO_CAPABILITY_DIR');

  if (configured) {
    return resolveRuntimePath(configured, { env });
  }

  return createGoromboRuntimePaths(resolveGoromboRuntimeRoot({ env })).capabilities;
}

export function resolveCapabilityPath(
  env: Record<string, unknown>,
  kind: CapabilityKind,
  id: string,
): string {
  assertSafeCapabilityId(id);
  return resolve(resolveCapabilitiesDir(env), kind + 's', id);
}

/**
 * Reject capability ids that could escape the capabilities root via path
 * traversal or absolute paths. Capability ids are opaque slugs (e.g.
 * "my-jira-skill"), never filesystem paths.
 */
export function assertSafeCapabilityId(id: string): void {
  if (typeof id !== 'string' || id.length === 0) {
    throw new Error(`Invalid capability id: empty`);
  }
  if (id.includes('/') || id.includes('\\') || id.includes('\0')) {
    throw new Error(`Invalid capability id "${id}": must not contain path separators`);
  }
  if (id === '.' || id === '..' || id.includes('..')) {
    throw new Error(`Invalid capability id "${id}": must not contain traversal sequences`);
  }
  if (isAbsolute(id)) {
    throw new Error(`Invalid capability id "${id}": must not be an absolute path`);
  }
}

function readEnv(env: Record<string, unknown>, key: string): string | undefined {
  const value = env[key];
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}
