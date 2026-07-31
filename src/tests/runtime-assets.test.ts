import assert from 'node:assert/strict';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { resolveModelPath } from '../engine/embeddings/model-loader.js';
import { resolveMemoryWasmModulePaths } from '../engine/memory/structured-memory-runtime.js';
import { indexKnowledgeDocs } from '../engine/rag/indexers/knowledge-doc-indexer.js';
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

test('runtime copy ships the documentation consumed by packaged knowledge indexing', () => {
  const packagedRoot = resolve('.tmp/tsc');
  const packagedReadme = join(packagedRoot, 'README.md');
  const packagedArchitectureDoc = join(
    packagedRoot,
    'docs/architecture/capability-system.md',
  );

  assert.equal(existsSync(packagedReadme), true);
  assert.equal(existsSync(packagedArchitectureDoc), true);
  assert.equal(
    readFileSync(packagedReadme, 'utf8'),
    readFileSync(resolve('README.md'), 'utf8'),
  );
});

test('knowledge indexing reads architecture, source and packaged workspaces, and README', async () => {
  const fixture = mkdtempSync(join(tmpdir(), 'gorombo-packaged-knowledge-'));
  try {
    writeFixtureFile(join(fixture, 'README.md'), '# Product\n');
    writeFixtureFile(
      join(fixture, 'docs/architecture/runtime.md'),
      '# Runtime architecture\n',
    );
    writeFixtureFile(
      join(fixture, 'workspace/AGENTS.md'),
      '# Workspace persona\n',
    );
    writeFixtureFile(
      join(fixture, 'src/workspace/TOOLS.md'),
      '# Source workspace tools\n',
    );

    const records = await indexKnowledgeDocs({ projectRoot: fixture });
    assert.deepEqual(
      [...new Set(records.map((record) => record.metadata.relativePath))].sort(),
      [
        'README.md',
        'docs/architecture/runtime.md',
        'src/workspace/TOOLS.md',
        'workspace/AGENTS.md',
      ],
    );
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

function writeFixtureFile(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}
