import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

test('SKILL.md loader accepts CRLF frontmatter', () => {
  const script = [
    "import { parseFrontmatter } from './scripts/skill-md-loader.mjs';",
    "const value = parseFrontmatter('---\\r\\nname: windows-skill\\r\\ndescription: CRLF works\\r\\n---\\r\\nBody\\r\\n', 'fixture');",
    'process.stdout.write(JSON.stringify(value));',
  ].join('');
  const result = spawnSync(process.execPath, ['--input-type=module', '--eval', script], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    name: 'windows-skill',
    description: 'CRLF works',
  });
});

test('SKILL.md loader parses YAML scalar styles and comments', () => {
  const script = [
    "import { parseFrontmatter } from './scripts/skill-md-loader.mjs';",
    "const value = parseFrontmatter('---\\nname: \"yaml-skill\" # display id\\ndescription: >\\n  First line\\n  continues here.\\n---\\nBody\\n', 'fixture');",
    'process.stdout.write(JSON.stringify(value));',
  ].join('');
  const result = spawnSync(process.execPath, ['--input-type=module', '--eval', script], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), {
    name: 'yaml-skill',
    description: 'First line continues here.\n',
  });
});

test('built-in registry reserves a Markdown skill by parent directory name', () => {
  const result = spawnSync(process.execPath, ['scripts/generate-builtin-registry.mjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr);

  const registry = JSON.parse(
    readFileSync('.gorombo/sim-one-alpha/builtin-capabilities.json', 'utf8'),
  ) as { skills?: string[] };
  assert.equal(registry.skills?.includes('greeting-preflight'), true);
  assert.equal(registry.skills?.includes('SKILL.md'), false);
});

test('Flue 2 foundation uses coordinated package pins and Vite build commands', () => {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
    scripts: Record<string, string>;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };

  assert.equal(packageJson.dependencies['@flue/runtime'], '2.0.1');
  assert.equal(packageJson.dependencies['@flue/telegram'], '2.0.1');
  assert.equal(packageJson.devDependencies['@flue/cli'], '2.0.1');
  assert.equal(packageJson.devDependencies['@flue/vite'], '2.0.1');
  assert.equal(packageJson.dependencies['@earendil-works/pi-ai'], '0.83.0');
  assert.equal(packageJson.dependencies['just-bash'], '3.2.0');
  assert.equal(packageJson.devDependencies.vite, '8.2.0');
  assert.match(packageJson.scripts.build, /^vite build/);
  assert.equal(packageJson.scripts.dev, 'vite dev');

  const flueConfig = readFileSync('flue.config.ts', 'utf8');
  assert.match(flueConfig, /from '@flue\/runtime\/config'/);
  assert.doesNotMatch(flueConfig, /\b(?:root|output)\s*:/);

  const viteConfig = readFileSync('vite.config.ts', 'utf8');
  assert.match(viteConfig, /from '@flue\/vite'/);
  assert.match(viteConfig, /plugins:\s*\[flue\(/);

  const cliPackageJson = JSON.parse(readFileSync('sim-one-cli/package.json', 'utf8')) as {
    dependencies: Record<string, string>;
  };
  assert.equal(cliPackageJson.dependencies['@flue/sdk'], '2.0.1');
  assert.equal(cliPackageJson.dependencies['@flue/react'], '2.0.1');
});

test('application mounts the orchestrator with the explicit Flue 2 router', () => {
  const appSource = readFileSync('src/app.ts', 'utf8');

  assert.match(appSource, /createAgentRouter/);
  assert.match(appSource, /app\.route\('\/agents\/orchestrator', createAgentRouter\(Orchestrator\)\)/);
  assert.doesNotMatch(appSource, /app\.route\('\/', flue\(\)\)/);
  for (const preservedRoute of [
    "app.get('/health'",
    'registerChatEventRoutes(app)',
    'registerChatSessionRoutes(app)',
    'registerKnowledgeRoutes(app)',
    'registerSchedulesRoutes(app)',
    'registerTelemetryRoutes(app)',
    'registerApprovalRoutes(app)',
    'registerTelegramAdminRoutes(app)',
  ]) {
    assert.match(appSource, new RegExp(escapeRegExp(preservedRoute)));
  }
});

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

test('custom model providers use Pi provider objects and Flue setProvider', () => {
  const providerPaths = [
    'src/core/models/providers/codex-brain/provider.ts',
    'src/core/models/providers/ollama-cloud/provider.ts',
    'src/core/models/providers/ollama-local/provider.ts',
    'src/core/models/providers/runpod/provider.ts',
  ];

  for (const providerPath of providerPaths) {
    const source = readFileSync(providerPath, 'utf8');
    assert.match(source, /createOpenAICompatibleProvider/);
    assert.match(source, /setProvider/);
    assert.doesNotMatch(source, /registerProvider/);
  }

  const sharedProviderSource = readFileSync('src/core/models/pi-provider.ts', 'utf8');
  assert.match(sharedProviderSource, /createProvider/);
  assert.match(sharedProviderSource, /openAICompletionsApi/);
});
