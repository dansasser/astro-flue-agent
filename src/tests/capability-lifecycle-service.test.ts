import assert from 'node:assert/strict';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';
import {
  CapabilityLifecycleService,
} from '../engine/capabilities/capability-lifecycle-service.js';
import { compileCapabilityProtocolContext } from '../engine/capabilities/capability-protocol-context.js';
import { createCapabilityStore } from '../engine/capabilities/capability-store.js';
import type { CapabilityKind } from '../engine/capabilities/types.js';

test('capability lifecycle validates and manages all four capability kinds', () => {
  const fixture = createFixture();
  try {
    for (const kind of ['skill', 'tool', 'worker'] as const) {
      const sourceRef = createSourceFixture(fixture.root, kind, `${kind}-fixture`);
      const added = fixture.service.add({
        kind,
        id: `${kind}-fixture`,
        name: `${kind} fixture`,
        description: `${kind} fixture description`,
        source: 'local',
        sourceRef,
        version: 'fixture-v1',
        requestedEnabled: kind === 'skill',
        installedBy: 'cli',
      });

      assert.equal(added.record?.kind, kind);
      assert.equal(added.record?.enabled, kind === 'skill');
      assert.equal(added.restartRequired, true);
      assert.equal(added.validation.valid, true);
      assert.match(added.contentDigest ?? '', /^[a-f0-9]{64}$/);
      assert.equal(
        added.activationState,
        kind === 'skill' ? 'enabled-pending-restart' : 'disabled',
      );
    }

    const mcp = fixture.service.add({
      kind: 'mcp',
      id: 'mcp-fixture',
      name: 'MCP fixture',
      description: 'MCP connection fixture',
      source: 'local',
      sourceRef: 'mcp://mcp-fixture',
      version: null,
      requestedEnabled: false,
      installedBy: 'cli',
      config: {
        mcpUrl: 'https://mcp.example.test/api',
        mcpTransport: 'streamable-http',
        mcpTokenEnv: 'GOROMBO_MCP_TOKEN',
      },
    });

    assert.equal(mcp.record?.enabled, false);
    assert.equal(mcp.record?.source, 'local');
    assert.equal(mcp.validation.valid, true);
    assert.equal(fixture.service.list().records.length, 4);
    assert.equal(fixture.service.inspect('worker', 'worker-fixture').record?.name, 'worker fixture');

    const enabled = fixture.service.enable('tool', 'tool-fixture');
    assert.equal(enabled.record?.enabled, true);
    assert.equal(enabled.activationState, 'enabled-pending-restart');

    const disabled = fixture.service.disable('tool', 'tool-fixture');
    assert.equal(disabled.record?.enabled, false);
    assert.equal(disabled.activationState, 'disabled');

    const removed = fixture.service.remove('mcp', 'mcp-fixture');
    assert.equal(removed.record, undefined);
    assert.equal(fixture.service.inspect('mcp', 'mcp-fixture').record, undefined);
  } finally {
    fixture.cleanup();
  }
});

test('capability lifecycle rejects invalid contracts and secret values', () => {
  const fixture = createFixture();
  try {
    const invalidTool = join(fixture.root, 'invalid-tool');
    mkdirSync(invalidTool, { recursive: true });
    writeFileSync(
      join(invalidTool, 'index.mjs'),
      '// defineTool() in a comment is not a Flue export.\nexport default {};\n',
    );

    assert.throws(
      () =>
        fixture.service.add({
          kind: 'tool',
          id: 'invalid-tool',
          name: 'Invalid tool',
          description: '',
          source: 'local',
          sourceRef: invalidTool,
          version: 'fixture-v1',
          requestedEnabled: false,
          installedBy: 'cli',
        }),
      /defineTool/,
    );
    assert.equal(fixture.service.inspect('tool', 'invalid-tool').record, undefined);

    assert.throws(
      () =>
        fixture.service.add({
          kind: 'mcp',
          id: 'bad-mcp-secret',
          name: 'Bad MCP',
          description: '',
          source: 'local',
          sourceRef: 'mcp://bad-mcp-secret',
          version: null,
          requestedEnabled: false,
          installedBy: 'agent',
          config: {
            mcpUrl: 'https://mcp.example.test/api',
            mcpTransport: 'sse',
            token: 'must-not-be-stored',
          },
        }),
      /configuration key names/,
    );
    assert.throws(
      () =>
        fixture.service.add({
          kind: 'mcp',
          id: 'bad-mcp-url-credentials',
          name: 'Bad MCP credentials',
          description: '',
          source: 'local',
          sourceRef: 'mcp://bad-mcp-url-credentials',
          version: null,
          requestedEnabled: false,
          installedBy: 'agent',
          config: {
            mcpUrl: 'https://user:password@mcp.example.test/api',
            mcpTransport: 'streamable-http',
          },
        }),
      /must not contain embedded credentials/,
    );

    const secretTool = createSourceFixture(
      fixture.root,
      'tool',
      'secret-tool',
    );
    writeFileSync(
      join(secretTool, 'credentials.mjs'),
      `export const apiKey = '${'A'.repeat(32)}';\n`,
    );
    assert.throws(
      () =>
        fixture.service.validate({
          kind: 'tool',
          id: 'secret-tool',
          name: 'Secret tool',
          description: '',
          source: 'local',
          sourceRef: secretTool,
          version: 'fixture-v1',
          requestedEnabled: false,
          installedBy: 'cli',
        }),
      /possible credential value/,
    );

    const hostPathWorker = createSourceFixture(
      fixture.root,
      'worker',
      'host-path-worker',
    );
    writeFileSync(
      join(hostPathWorker, 'workspace', 'TOOLS.md'),
      'Read configuration from /etc/sim-one/private.json.\n',
    );
    assert.throws(
      () =>
        fixture.service.validate({
          kind: 'worker',
          id: 'host-path-worker',
          name: 'Host path worker',
          description: '',
          source: 'local',
          sourceRef: hostPathWorker,
          version: 'fixture-v1',
          requestedEnabled: false,
          installedBy: 'cli',
        }),
      /machine-specific absolute host path/,
    );
  } finally {
    fixture.cleanup();
  }
});

test('relative local capability sources resolve beneath the coding workspace and cannot escape it', () => {
  const fixture = createFixture();
  try {
    const workspaceRoot = join(fixture.runtimeRoot, 'workspace');
    const sourceRef = createSourceFixture(
      workspaceRoot,
      'tool',
      'workspace-relative-tool',
    );
    const relativeSourceRef = 'sources/workspace-relative-tool';

    const validated = fixture.service.validate({
      kind: 'tool',
      id: 'workspace-relative-tool',
      name: 'Workspace relative tool',
      description: '',
      source: 'local',
      sourceRef: relativeSourceRef,
      version: 'fixture-v1',
      requestedEnabled: false,
      installedBy: 'agent',
    });

    assert.equal(validated.validation.valid, true);
    assert.equal(sourceRef, join(workspaceRoot, relativeSourceRef));

    const escapedSource = createSourceFixture(
      fixture.runtimeRoot,
      'tool',
      'outside-workspace-tool',
    );
    assert.equal(
      escapedSource,
      join(fixture.runtimeRoot, 'sources', 'outside-workspace-tool'),
    );
    assert.throws(
      () =>
        fixture.service.validate({
          kind: 'tool',
          id: 'outside-workspace-tool',
          name: 'Outside workspace tool',
          description: '',
          source: 'local',
          sourceRef: '../sources/outside-workspace-tool',
          version: 'fixture-v1',
          requestedEnabled: false,
          installedBy: 'agent',
        }),
      /outside the coding workspace/,
    );
  } finally {
    fixture.cleanup();
  }
});

test('local capability staging rejects symlinks and mismatched handoff digests', () => {
  const fixture = createFixture();
  try {
    const symlinkedTool = createSourceFixture(
      fixture.root,
      'tool',
      'symlinked-tool',
    );
    const externalDirectory = join(fixture.root, 'external-code');
    mkdirSync(externalDirectory, { recursive: true });
    writeFileSync(join(externalDirectory, 'payload.mjs'), 'export const value = 1;\n');
    symlinkSync(externalDirectory, join(symlinkedTool, 'linked-code'), 'dir');

    assert.throws(
      () =>
        fixture.service.validate({
          kind: 'tool',
          id: 'symlinked-tool',
          name: 'Symlinked tool',
          description: '',
          source: 'local',
          sourceRef: symlinkedTool,
          version: 'fixture-v1',
          requestedEnabled: false,
          installedBy: 'agent',
        }),
      /symbolic links/,
    );

    const digestTool = createSourceFixture(
      fixture.root,
      'tool',
      'digest-bound-tool',
    );
    const expectedDigest = hashSourceFixture(digestTool);
    const added = fixture.service.add({
      kind: 'tool',
      id: 'digest-bound-tool',
      name: 'Digest-bound tool',
      description: '',
      source: 'local',
      sourceRef: digestTool,
      version: `sha256:${expectedDigest}`,
      requestedEnabled: false,
      installedBy: 'agent',
    });
    assert.equal(added.contentDigest, expectedDigest);

    const changedTool = createSourceFixture(
      fixture.root,
      'tool',
      'changed-after-handoff',
    );
    const testedDigest = hashSourceFixture(changedTool);
    writeFileSync(
      join(changedTool, 'post-test.mjs'),
      'export const changedAfterTesting = true;\n',
    );
    assert.throws(
      () =>
        fixture.service.add({
          kind: 'tool',
          id: 'changed-after-handoff',
          name: 'Changed after handoff',
          description: '',
          source: 'local',
          sourceRef: changedTool,
          version: `sha256:${testedDigest}`,
          requestedEnabled: false,
          installedBy: 'agent',
        }),
      /does not match the tested handoff digest/,
    );
  } finally {
    fixture.cleanup();
  }
});

test('partial MCP updates preserve stored connection fields before validation', () => {
  const fixture = createFixture();
  try {
    fixture.service.add({
      kind: 'mcp',
      id: 'partial-mcp',
      name: 'Partial MCP',
      description: '',
      source: 'local',
      sourceRef: 'mcp://partial-mcp',
      version: null,
      requestedEnabled: false,
      installedBy: 'agent',
      config: {
        mcpUrl: 'https://mcp.example.test/original',
        mcpTransport: 'streamable-http',
        mcpTokenEnv: 'ORIGINAL_MCP_TOKEN',
      },
    });

    const updated = fixture.service.update({
      kind: 'mcp',
      id: 'partial-mcp',
      config: {
        mcpTransport: 'sse',
      },
    });

    assert.deepEqual(updated.record?.config, {
      mcpUrl: 'https://mcp.example.test/original',
      mcpTransport: 'sse',
      mcpTokenEnv: 'ORIGINAL_MCP_TOKEN',
    });
  } finally {
    fixture.cleanup();
  }
});

test('capability protocol context rejects malformed directive objects and priorities', () => {
  assert.throws(
    () =>
      compileCapabilityProtocolContext({
        eventId: 'malformed-object',
        loadedAt: new Date().toISOString(),
        protocols: [null],
      } as never),
    /malformed protocol directive/,
  );
  assert.throws(
    () =>
      compileCapabilityProtocolContext({
        ...createProtocolBundle('malformed-priority'),
        protocols: [{
          ...createProtocolBundle('malformed-priority').protocols[0],
          priority: Number.NaN,
        }],
      }),
    /finite priority/,
  );
});

test('capability lifecycle rolls back the registry when final materialization fails', () => {
  const fixture = createFixture({
    promote: () => {
      throw new Error('simulated promote failure');
    },
  });
  try {
    const sourceRef = createSourceFixture(fixture.root, 'skill', 'rollback-skill');
    assert.throws(
      () =>
        fixture.service.add({
          kind: 'skill',
          id: 'rollback-skill',
          name: 'Rollback skill',
          description: '',
          source: 'local',
          sourceRef,
          version: 'fixture-v1',
          requestedEnabled: true,
          installedBy: 'agent',
        }),
      /simulated promote failure/,
    );
    assert.equal(fixture.service.inspect('skill', 'rollback-skill').record, undefined);
  } finally {
    fixture.cleanup();
  }
});

test('capability lifecycle rejects cross-kind collisions through the shared service', () => {
  const fixture = createFixture();
  try {
    fixture.service.add({
      kind: 'skill',
      id: 'shared-name',
      name: 'Shared name',
      description: '',
      source: 'local',
      sourceRef: createSourceFixture(fixture.root, 'skill', 'shared-name'),
      version: 'fixture-v1',
      requestedEnabled: false,
      installedBy: 'cli',
    });

    assert.throws(
      () =>
        fixture.service.add({
          kind: 'tool',
          id: 'shared-name',
          name: 'Shared name tool',
          description: '',
          source: 'local',
          sourceRef: createSourceFixture(fixture.root, 'tool', 'shared-name-tool'),
          version: 'fixture-v1',
          requestedEnabled: false,
          installedBy: 'cli',
        }),
      /already exists as a skill/,
    );
  } finally {
    fixture.cleanup();
  }
});

test('capability lifecycle materializes the exact requested Git tag', () => {
  const fixture = createFixture();
  try {
    const repository = join(fixture.root, 'versioned-skill');
    const gitOptions = {
      cwd: repository,
      env: {
        ...process.env,
        GIT_CONFIG_GLOBAL: '/dev/null',
        GIT_CONFIG_NOSYSTEM: '1',
      },
    };
    mkdirSync(repository, { recursive: true });
    execFileSync('git', ['init', '--initial-branch=main'], gitOptions);
    execFileSync('git', ['config', 'user.name', 'SIM-ONE Test'], gitOptions);
    execFileSync('git', ['config', 'user.email', 'sim-one@example.test'], gitOptions);
    writeFileSync(
      join(repository, 'SKILL.md'),
      '---\nname: versioned-skill\ndescription: Version one.\n---\n\nversion one\n',
    );
    execFileSync('git', ['add', 'SKILL.md'], gitOptions);
    execFileSync('git', ['commit', '-m', 'version one'], gitOptions);
    execFileSync('git', ['tag', 'v1'], gitOptions);
    writeFileSync(
      join(repository, 'SKILL.md'),
      '---\nname: versioned-skill\ndescription: Version two.\n---\n\nversion two\n',
    );
    execFileSync('git', ['commit', '-am', 'version two'], gitOptions);

    fixture.service.add({
      kind: 'skill',
      id: 'versioned-skill',
      name: 'Versioned skill',
      description: '',
      source: 'github',
      sourceRef: pathToFileURL(repository).href,
      version: 'v1',
      requestedEnabled: true,
      installedBy: 'cli',
    });

    const installed = readFileSync(
      join(fixture.runtimeRoot, 'capabilities', 'skills', 'versioned-skill', 'SKILL.md'),
      'utf8',
    );
    assert.match(installed, /version one/);
    assert.doesNotMatch(installed, /version two/);
  } finally {
    fixture.cleanup();
  }
});

test('capability update disables changed executable sources until explicit enable', () => {
  const fixture = createFixture();
  try {
    fixture.service.add({
      kind: 'tool',
      id: 'updated-tool',
      name: 'Updated tool',
      description: '',
      source: 'local',
      sourceRef: createSourceFixture(fixture.root, 'tool', 'updated-tool-v1'),
      version: 'fixture-v1',
      requestedEnabled: false,
      installedBy: 'cli',
    });
    fixture.service.enable('tool', 'updated-tool');
    const installedPath = join(
      fixture.runtimeRoot,
      'capabilities',
      'tools',
      'updated-tool',
    );
    assert.equal(existsSync(installedPath), true);

    const updated = fixture.service.update({
      kind: 'tool',
      id: 'updated-tool',
      sourceRef: createSourceFixture(
        fixture.root,
        'tool',
        'updated-tool-v2',
      ),
      version: 'fixture-v2',
    });

    assert.equal(updated.record?.enabled, false);
    assert.equal(updated.activationState, 'disabled');
    assert.equal(existsSync(installedPath), false);
  } finally {
    fixture.cleanup();
  }
});

test('capability lifecycle refuses to remove a persisted built-in record', () => {
  const fixture = createFixture();
  const builtinService = new CapabilityLifecycleService({
    store: fixture.store,
    env: {
      GOROMBO_RUNTIME_ROOT: fixture.runtimeRoot,
      GOROMBO_CAPABILITIES_DIR: join(
        fixture.runtimeRoot,
        'capabilities',
      ),
    },
    isBuiltin: (_kind, id) => id === 'persisted-builtin',
    protocolBundle: createProtocolBundle('builtin-remove'),
  });
  try {
    fixture.store.insertStrict({
      id: 'persisted-builtin',
      kind: 'tool',
      name: 'Persisted built-in',
      description: '',
      source: 'builtin',
      sourceRef: 'builtin://persisted-builtin',
      version: null,
      enabled: true,
      config: {},
      installedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      installedBy: 'seed',
    });

    assert.throws(
      () => builtinService.remove('tool', 'persisted-builtin'),
      /built-in capability/,
    );
    assert.ok(fixture.store.get('tool', 'persisted-builtin'));
  } finally {
    fixture.cleanup();
  }
});

test('capability lifecycle validation and mutations fail closed without protocols', () => {
  const root = mkdtempSync(join(tmpdir(), 'sim-one-capability-no-protocols-'));
  const runtimeRoot = join(root, '.gorombo');
  const store = createCapabilityStore({
    dbPath: join(runtimeRoot, 'db', 'capabilities.sqlite'),
  });
  try {
    const service = new CapabilityLifecycleService({
      store,
      env: {
        GOROMBO_RUNTIME_ROOT: runtimeRoot,
        GOROMBO_CAPABILITIES_DIR: join(runtimeRoot, 'capabilities'),
      },
      isBuiltin: () => false,
    });
    const sourceRef = createSourceFixture(root, 'skill', 'missing-protocols');
    const input = {
      kind: 'skill' as const,
      id: 'missing-protocols',
      name: 'Missing protocols',
      description: 'Protocol routing fixture.',
      source: 'local' as const,
      sourceRef,
      version: 'fixture-v1',
      requestedEnabled: false,
      installedBy: 'cli' as const,
    };

    assert.throws(
      () => service.validate(input),
      /require the applicable Protocol Tool bundle/,
    );
    assert.throws(
      () => service.add(input),
      /require the applicable Protocol Tool bundle/,
    );
  } finally {
    store.close();
    rmSync(root, { recursive: true, force: true, maxRetries: 5, retryDelay: 25 });
  }
});

function createFixture(overrides: {
  promote?: ConstructorParameters<typeof CapabilityLifecycleService>[0]['promote'];
} = {}) {
  const root = mkdtempSync(join(tmpdir(), 'sim-one-capability-lifecycle-'));
  const runtimeRoot = join(root, '.gorombo');
  const capabilitiesDir = join(runtimeRoot, 'capabilities');
  const store = createCapabilityStore({
    dbPath: join(runtimeRoot, 'db', 'capabilities.sqlite'),
  });
  const service = new CapabilityLifecycleService({
    store,
    env: {
      GOROMBO_RUNTIME_ROOT: runtimeRoot,
      GOROMBO_CAPABILITIES_DIR: capabilitiesDir,
    },
    isBuiltin: () => false,
    protocolBundle: createProtocolBundle('lifecycle-test'),
    ...overrides,
  });

  return {
    root,
    runtimeRoot,
    store,
    service,
    cleanup() {
      store.close();
      rmSync(root, { recursive: true, force: true, maxRetries: 5, retryDelay: 25 });
    },
  };
}

function createProtocolBundle(eventId: string) {
  return {
    eventId,
    loadedAt: new Date().toISOString(),
    protocols: [{
      id: 'capabilities.lifecycle-routing',
      name: 'Capability lifecycle routing',
      description: 'Test protocol.',
      scope: 'base' as const,
      enabled: true,
      priority: 88,
      appliesTo: {},
      rules: ['Route capability validation through protocols.'],
      source: 'seed' as const,
      tags: ['capabilities'],
    }],
  };
}

function createSourceFixture(root: string, kind: Exclude<CapabilityKind, 'mcp'>, id: string): string {
  const source = join(root, 'sources', id);
  mkdirSync(source, { recursive: true });
  switch (kind) {
    case 'skill':
      writeFileSync(
        join(source, 'SKILL.md'),
        `---\nname: ${id}\ndescription: Test skill fixture.\n---\n\n# ${id}\n`,
      );
      break;
    case 'tool':
      writeFileSync(
        join(source, 'index.mjs'),
        "import { defineTool } from '@flue/runtime';\nexport default defineTool({ name: 'fixture', parameters: {}, execute: async () => 'ok' });\n",
      );
      break;
    case 'worker':
      writeFileSync(
        join(source, 'index.mjs'),
        "import { defineAgentProfile } from '@flue/runtime';\nexport default defineAgentProfile({ name: 'fixture', instructions: 'test' });\n",
      );
      mkdirSync(join(source, 'workspace'), { recursive: true });
      writeFileSync(join(source, 'workspace', 'AGENTS.md'), '# Fixture worker\n');
      break;
  }
  return source;
}

function hashSourceFixture(root: string): string {
  const hash = createHash('sha256');
  const files = ['index.mjs'];
  for (const file of files) {
    hash.update(file);
    hash.update('\0');
    hash.update(readFileSync(join(root, file)));
    hash.update('\0');
  }
  return hash.digest('hex');
}
