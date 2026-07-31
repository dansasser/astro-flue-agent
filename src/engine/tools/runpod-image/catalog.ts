import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { load } from 'js-yaml';
import * as v from 'valibot';
import {
  createGoromboRuntimePaths,
  findSourceProjectRoot,
  isPathInsideRuntimeRoot,
  resolveGoromboRuntimeRoot,
  resolveRuntimePath,
} from '../../../core/config/runtime-root.js';
import {
  RunpodImageCatalogSchema,
  type RunpodImageCatalog,
  type RunpodImageModel,
} from '../../../core/schemas/runpod-image.js';

export interface CatalogLoaderOptions {
  modelsPath?: string;
  env?: Record<string, unknown>;
  modulePath?: string | URL;
}

const catalogCache = new Map<string, RunpodImageCatalog>();

export function loadRunpodImageCatalog(options: CatalogLoaderOptions = {}): RunpodImageCatalog {
  const path = resolveRunpodImageCatalogPath(options);
  const cached = catalogCache.get(path);
  if (cached) {
    return cached;
  }

  const raw = readFileSync(path, 'utf8');
  const parsed = load(raw) as unknown;

  const result = v.safeParse(RunpodImageCatalogSchema, parsed);
  if (!result.success) {
    throw new Error(`Invalid Runpod image model catalog at ${path}: ${JSON.stringify(v.flatten(result.issues))}`);
  }

  catalogCache.set(path, result.output);
  return result.output;
}

export function getRunpodImageModel(
  catalog: RunpodImageCatalog,
  modelId: string,
): RunpodImageModel | undefined {
  return catalog.models.find((m) => m.enabled !== false && m.id === modelId);
}

export function getDefaultRunpodImageModel(catalog: RunpodImageCatalog): RunpodImageModel {
  const model = getRunpodImageModel(catalog, catalog.defaultModel);
  if (!model) {
    throw new Error(`Default Runpod image model "${catalog.defaultModel}" is not enabled or not found.`);
  }
  return model;
}

export function resolveRunpodImageCatalogPath(
  options: CatalogLoaderOptions = {},
): string {
  const env = options.env ?? process.env;
  const modulePath = options.modulePath ?? import.meta.url;
  if (options.modelsPath) {
    return resolveRuntimePath(options.modelsPath, { env, modulePath });
  }

  const envPath = env.RUNPOD_IMAGE_MODELS_PATH;
  if (envPath) {
    if (typeof envPath !== 'string') {
      throw new Error('RUNPOD_IMAGE_MODELS_PATH must be a string.');
    }
    return resolveRuntimePath(envPath, { env, modulePath });
  }

  const runtimeRoot = resolveGoromboRuntimeRoot({ env, modulePath });
  const runtimePaths = createGoromboRuntimePaths(runtimeRoot);
  const sourceRoot = findSourceProjectRoot(modulePath);
  const sourceCandidate = sourceRoot
    ? resolve(sourceRoot, 'src/engine/tools/runpod-image/models.yaml')
    : undefined;
  const bundleCandidate = resolve(runtimePaths.packagedServer, 'tools/runpod-image/models.yaml');

  if (isPathInsideRuntimeRoot(modulePath, runtimeRoot)) {
    if (existsSync(bundleCandidate)) return bundleCandidate;
    throw new Error(`Packaged runpod-image models.yaml not found: ${bundleCandidate}`);
  }
  if (sourceCandidate && existsSync(sourceCandidate)) return sourceCandidate;
  if (existsSync(bundleCandidate)) return bundleCandidate;

  throw new Error(
    `Could not find runpod-image models.yaml. Checked: ${[
      ...(sourceCandidate ? [sourceCandidate] : []),
      bundleCandidate,
    ].join(', ')}`,
  );
}
