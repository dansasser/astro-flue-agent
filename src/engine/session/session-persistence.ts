import { sqlite } from '@flue/runtime/node';
import type { PersistenceAdapter } from '@flue/runtime/adapter';
import type { GoromboConfig } from '../../core/config/gorombo-config.js';
import {
  createGoromboRuntimePaths,
  resolveGoromboRuntimeRoot,
  resolveRuntimePath,
} from '../../core/config/runtime-root.js';
import { createEmbeddingClient } from '../../engine/rag/embeddings.js';
import { runBackgroundIndexing } from '../../engine/rag/indexers/background-indexer.js';
import {
  defaultVectorStorePath,
  LanceDbVectorStore,
} from '../../engine/rag/vector/index.js';
import {
  defaultSessionDatabasePath,
  GoromboSessionDatabase,
} from '../../engine/session/session-database.js';

export const defaultFlueV2DatabasePath = 'db/flue-v2.sqlite';
export const legacyFlueDatabasePath = 'db/flue.sqlite';

export interface GoromboPersistenceRuntime {
  adapter: PersistenceAdapter;
  sessionDatabase: GoromboSessionDatabase;
  vectorStore: LanceDbVectorStore;
  embeddingClient: ReturnType<typeof createEmbeddingClient>;
  flueV2DatabasePath: string;
  legacyFlueDatabasePath: string;
}

export function createGoromboPersistenceRuntime(config: GoromboConfig): GoromboPersistenceRuntime {
  const runtimePaths = createGoromboRuntimePaths(resolveGoromboRuntimeRoot());
  const flueV2DatabasePath = resolveRuntimePath(
    config.storage?.flueV2DatabasePath ?? defaultFlueV2DatabasePath,
    { runtimeRoot: runtimePaths.runtimeRoot },
  );
  const legacyDatabasePath = resolveRuntimePath(
    config.storage?.flueDatabasePath ?? legacyFlueDatabasePath,
    { runtimeRoot: runtimePaths.runtimeRoot },
  );
  const sessionDatabasePath = resolveRuntimePath(
    config.storage?.sessionDatabasePath ?? defaultSessionDatabasePath,
    { runtimeRoot: runtimePaths.runtimeRoot },
  );
  const vectorStorePath = resolveRuntimePath(
    config.storage?.vectorStorePath ?? defaultVectorStorePath,
    { runtimeRoot: runtimePaths.runtimeRoot },
  );

  if (flueV2DatabasePath === legacyDatabasePath) {
    throw new Error('storage.flueV2DatabasePath must not point to the legacy Flue database.');
  }

  const vectorStore = new LanceDbVectorStore({ path: vectorStorePath });
  const embeddingClient = createEmbeddingClient();
  const sessionDatabase = new GoromboSessionDatabase(sessionDatabasePath, { vectorStore, embeddingClient });

  if (process.env.GOROMBO_TEST_MODE !== '1' && process.env.NODE_ENV !== 'test') {
    runBackgroundIndexing({
      vectorStore,
      embeddingClient,
      projectRoot: runtimePaths.packagedServer,
      workspaceRoot: runtimePaths.codingWorkspace,
    }).catch((error) =>
      console.error('[WARN] Background vector indexing failed:', error instanceof Error ? error.message : String(error)),
    );
  }

  return {
    adapter: sqlite(flueV2DatabasePath),
    sessionDatabase,
    vectorStore,
    embeddingClient,
    flueV2DatabasePath,
    legacyFlueDatabasePath: legacyDatabasePath,
  };
}
