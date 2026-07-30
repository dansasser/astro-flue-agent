import { randomUUID } from 'node:crypto';
import { createCapabilityStore } from '../../../src/engine/capabilities/index.js';
import { resolveRuntimePath } from '../../../src/core/config/runtime-root.js';
import type { CapabilityStore } from '../../../src/engine/capabilities/index.js';
import {
  CapabilityLifecycleService,
  type CapabilityLifecycleResult,
} from '../../../src/engine/capabilities/index.js';
import { SqliteProtocolProvider } from '../../../src/core/protocols/sqlite-protocol-provider.js';

/**
 * Resolve the capability SQLite database path using the same rules as the
 * runtime {@link createCapabilityStore}: honor `GOROMBO_CAPABILITY_DB_PATH`
 * (default `db/capabilities.sqlite`), resolving relative to the canonical
 * GOROMBO runtime root.
 */
export function resolveCapabilityDbPath(env: Record<string, unknown> = process.env): string {
  const configured =
    typeof env.GOROMBO_CAPABILITY_DB_PATH === 'string'
      ? env.GOROMBO_CAPABILITY_DB_PATH.trim()
      : undefined;
  return resolveRuntimePath(configured ?? 'db/capabilities.sqlite', {
    env,
    modulePath: import.meta.url,
  });
}

/**
 * Create a {@link CapabilityStore} backed by the SQLite database resolved
 * from the environment. The directory is created if missing.
 */
export function createStore(): CapabilityStore {
  return createCapabilityStore({ dbPath: resolveCapabilityDbPath() });
}

/**
 * Run an operation against a fresh {@link CapabilityStore} and close it when
 * done, even on errors. Exits with code 1 on uncaught errors.
 */
export async function withLifecycleService<T>(
  fn: (service: CapabilityLifecycleService) => T | Promise<T>,
): Promise<T> {
  const protocolDbPath = resolveRuntimePath(
    process.env.GOROMBO_PROTOCOL_DB_PATH ?? 'db/protocols.sqlite',
    { env: process.env },
  );
  const provider = new SqliteProtocolProvider(protocolDbPath);
  const store = createStore();
  try {
    const protocolBundle = await provider.loadApplicable({
      id: `cli-capability-${randomUUID()}`,
      connector: 'unknown',
      kind: 'command',
      text: 'sim-one capability lifecycle command',
      receivedAt: new Date().toISOString(),
      actor: { id: 'authenticated-cli-user' },
      conversation: { id: 'sim-one-cli' },
      context: {
        workflow: 'capability-management',
        task: 'capability-validation',
      },
    });
    return await fn(
      new CapabilityLifecycleService({
        store,
        env: process.env,
        protocolBundle,
      }),
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  } finally {
    store.close();
    provider.close();
  }
}

export function printLifecycleResult(result: CapabilityLifecycleResult): void {
  console.log(JSON.stringify(result, null, 2));
}
