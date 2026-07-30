import { copyFileSync, cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { copyRuntimeEnvironmentFiles } from './runtime-configuration-files.mjs';

const source = resolve('src/core/config/gorombo.config.json');
const includeTscOutput = process.argv.includes('--tsc');
const targets = includeTscOutput
  ? [resolve('.tmp/tsc/core/config/gorombo.config.json')]
  : [resolve('.gorombo/gorombo.config.json')];

if (!existsSync(source)) {
  throw new Error(`Runtime config source is missing: ${source}`);
}

for (const target of targets) {
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(source, target);
}
if (!includeTscOutput) {
  rmSync(resolve('.gorombo/sim-one-alpha/gorombo.config.json'), { force: true });
  copyRuntimeEnvironmentFiles({
    sourceRoot: resolve('.'),
    runtimeRoot: resolve('.gorombo'),
  });
}

copyTestFixtures(includeTscOutput ? resolve('.tmp/tsc') : resolve('.gorombo/sim-one-alpha'));
copySkillDirectories(includeTscOutput ? resolve('.tmp/tsc') : resolve('.gorombo/sim-one-alpha'));
copyWorkspaceDirectories(includeTscOutput ? resolve('.tmp/tsc') : resolve('.gorombo/sim-one-alpha'));
copyKnowledgeDocuments(includeTscOutput ? resolve('.tmp/tsc') : resolve('.gorombo/sim-one-alpha'));
copyModelsYaml(includeTscOutput ? resolve('.tmp/tsc') : resolve('.gorombo/sim-one-alpha'));
if (!includeTscOutput) {
  copyEmbeddingModel(resolve('.gorombo/sim-one-alpha'));
}

function copyTestFixtures(outputRoot) {
  const fixturesSource = resolve('src/tests/fixtures');
  if (!existsSync(fixturesSource)) {
    return;
  }
  const fixturesTarget = join(outputRoot, 'tests', 'fixtures');
  mkdirSync(fixturesTarget, { recursive: true });
  cpSync(fixturesSource, fixturesTarget, { recursive: true, force: true });
}

function copySkillDirectories(outputRoot) {
  copyDirectoryIfExists(resolve('src/skills'), join(outputRoot, 'skills'));
  copyNestedSkillDirectories(
    resolve('src/engine/workers'),
    join(outputRoot, 'engine/workers'),
  );
}

function copyNestedSkillDirectories(sourceRoot, targetRoot) {
  if (!existsSync(sourceRoot)) {
    return;
  }
  copyDirectoryIfExists(join(sourceRoot, 'skills'), join(targetRoot, 'skills'));
  for (const entry of readdirSync(sourceRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === 'skills') {
      continue;
    }
    copyNestedSkillDirectories(
      join(sourceRoot, entry.name),
      join(targetRoot, entry.name),
    );
  }
}

function copyWorkspaceDirectories(outputRoot) {
  const mainWorkspace = resolve('src/workspace');
  copyDirectoryIfExists(mainWorkspace, join(outputRoot, 'workspace'), {
    filter(sourcePath) {
      const relativePath = relative(mainWorkspace, sourcePath).replaceAll('\\', '/');
      if (!relativePath) {
        return true;
      }
      const segments = relativePath.split('/');
      return !segments.some((segment) =>
        segment === 'repos' ||
        segment === 'projects' ||
        segment === 'node_modules' ||
        segment === '.git'
      );
    },
  });

  const workersRoot = resolve('src/engine/workers');
  if (!existsSync(workersRoot)) {
    return;
  }

  for (const entry of readdirSync(workersRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }

    copyNestedWorkspaceDirectories(
      join(workersRoot, entry.name),
      join(outputRoot, 'workers', entry.name),
    );
  }
}

function copyNestedWorkspaceDirectories(sourceRoot, targetRoot) {
  copyDirectoryIfExists(join(sourceRoot, 'workspace'), join(targetRoot, 'workspace'));

  for (const entry of readdirSync(sourceRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === 'workspace') {
      continue;
    }

    copyNestedWorkspaceDirectories(join(sourceRoot, entry.name), join(targetRoot, entry.name));
  }
}

function copyDirectoryIfExists(sourceDir, targetDir, options = {}) {
  if (!existsSync(sourceDir)) {
    return;
  }

  rmSync(targetDir, { recursive: true, force: true });
  mkdirSync(dirname(targetDir), { recursive: true });
  cpSync(sourceDir, targetDir, {
    recursive: true,
    force: true,
    ...(options.filter ? { filter: options.filter } : {}),
  });
}

function copyKnowledgeDocuments(outputRoot) {
  const readmeSource = resolve('README.md');
  if (existsSync(readmeSource)) {
    copyFileSync(readmeSource, join(outputRoot, 'README.md'));
  }
  copyDirectoryIfExists(
    resolve('docs/architecture'),
    join(outputRoot, 'docs/architecture'),
  );
}

function copyModelsYaml(outputRoot) {
  const modelsYamlSource = resolve('src/engine/tools/runpod-image/models.yaml');
  if (!existsSync(modelsYamlSource)) {
    return;
  }

  const modelsYamlTarget = join(outputRoot, 'tools/runpod-image/models.yaml');
  mkdirSync(dirname(modelsYamlTarget), { recursive: true });
  copyFileSync(modelsYamlSource, modelsYamlTarget);
}

function copyEmbeddingModel(outputRoot) {
  const modelSource = resolve('assets/models/embeddings/all-MiniLM-L6-v2');
  if (!existsSync(modelSource)) {
    return;
  }
  copyDirectoryIfExists(
    modelSource,
    join(outputRoot, 'assets/models/embeddings/all-MiniLM-L6-v2'),
  );
}
