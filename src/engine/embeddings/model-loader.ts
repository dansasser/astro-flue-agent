import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  createGoromboRuntimePaths,
  findSourceProjectRoot,
  isPathInsideRuntimeRoot,
  resolveGoromboRuntimeRoot,
  resolveRuntimePath,
} from '../../core/config/runtime-root.js';

export interface ResolveModelPathOptions {
  modelPath?: string;
  env?: Record<string, unknown>;
  modulePath?: string | URL;
}

export function resolveModelPath(options: ResolveModelPathOptions = {}): string {
  const env = options.env ?? process.env;
  const configured = options.modelPath ?? readString(env.GOROMBO_EMBEDDING_MODEL_PATH);
  if (configured) {
    return resolveRuntimePath(configured, { env, modulePath: options.modulePath });
  }

  const modulePath = options.modulePath ?? import.meta.url;
  const runtimeRoot = resolveGoromboRuntimeRoot({ env, modulePath });
  const runtimePaths = createGoromboRuntimePaths(runtimeRoot);
  const packagedModel = resolve(
    runtimePaths.packagedServer,
    'assets/models/embeddings/all-MiniLM-L6-v2',
  );
  if (isPathInsideRuntimeRoot(modulePath, runtimeRoot)) {
    return packagedModel;
  }

  const sourceRoot = findSourceProjectRoot(modulePath);
  const sourceModel = sourceRoot
    ? resolve(sourceRoot, 'assets/models/embeddings/all-MiniLM-L6-v2')
    : undefined;

  return sourceModel && existsSync(sourceModel) ? sourceModel : packagedModel;
}

export function assertModelFilesExist(modelPath: string): void {
  const modelFile = resolve(modelPath, 'model.onnx');
  const tokenizerFile = resolve(modelPath, 'tokenizer.json');

  if (!existsSync(modelFile) || !existsSync(tokenizerFile)) {
    throw new Error(
      `Local embedding model not found at ${modelPath}. Run "pnpm fetch-embedding-model".`,
    );
  }
}

export function getModelError(modelPath: string): string {
  return `Local embedding model not found at ${modelPath}. Run "pnpm fetch-embedding-model".`;
}

function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}
