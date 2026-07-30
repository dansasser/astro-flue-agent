import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { resolveModelPath } from '../engine/embeddings/model-loader.js';
import { resolveMemoryWasmModulePaths } from '../engine/memory/structured-memory-runtime.js';
import { resolveRunpodImageCatalogPath } from '../engine/tools/runpod-image/catalog.js';
import { resolveLspPackageRoots } from '../engine/workers/coding-worker/tools/code-intelligence/lsp/lsp-server-registry.js';

test('packaged modules do not reach into a surrounding source checkout for runtime assets', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'gorombo-runtime-assets-'));
  const runtimeRoot = join(fixture, '.gorombo');
  const packagedServer = join(runtimeRoot, 'sim-one-alpha');
  const packagedModule = join(packagedServer, 'server.mjs');
  const packagedModel = join(
    packagedServer,
    'assets/models/embeddings/all-MiniLM-L6-v2',
  );
  const packagedCatalog = join(packagedServer, 'tools/runpod-image/models.yaml');
  const packagedWasm = join(packagedServer, 'memory/gorombo_memory.js');

  try {
    writeFixtureFile(
      join(fixture, 'package.json'),
      JSON.stringify({ name: 'sim-one-alpha', type: 'module' }),
    );
    writeFixtureFile(
      join(fixture, 'assets/models/embeddings/all-MiniLM-L6-v2/model.onnx'),
      'source model',
    );
    writeFixtureFile(
      join(fixture, 'src/engine/tools/runpod-image/models.yaml'),
      'source catalog',
    );
    writeFixtureFile(
      join(fixture, 'crates/gorombo-memory/pkg/gorombo_memory.js'),
      'source wasm',
    );
    writeFixtureFile(packagedModule, '');
    writeFixtureFile(join(packagedModel, 'model.onnx'), 'packaged model');
    writeFixtureFile(packagedCatalog, 'packaged catalog');
    writeFixtureFile(packagedWasm, 'packaged wasm');

    const options = {
      env: {},
      modulePath: packagedModule,
    };
    assert.equal(resolveModelPath(options), resolve(packagedModel));
    assert.equal(resolveRunpodImageCatalogPath(options), resolve(packagedCatalog));
    assert.deepEqual(
      resolveMemoryWasmModulePaths({}, options),
      [resolve(packagedWasm)],
    );
    assert.deepEqual(
      resolveLspPackageRoots(options),
      [resolve(packagedServer)],
    );
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

function writeFixtureFile(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}
