import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import type { ToolDefinition } from '@flue/runtime';
import type {
  NormalizedMessageEvent,
  ProtocolBundle,
} from '../core/types/index.js';
import { createCapabilityStore } from '../engine/capabilities/capability-store.js';
import { CapabilityLifecycleService } from '../engine/capabilities/capability-lifecycle-service.js';
import { createInMemoryCodingApprovalService } from '../engine/workers/coding-worker/approvals/approval-service.js';
import {
  capabilityManagerAgentName,
  createCapabilityManagerSubagent,
} from '../engine/workers/capability-manager/capability-manager.js';
import { createDefaultCapabilityProtocolBundleLoader } from '../engine/workers/capability-manager/capability-manager-tools.js';
import {
  forgetProtocolLookupEvent,
  rememberProtocolLookupEvent,
} from '../engine/tools/protocol-tool.js';

test('capability-manager owns the complete lifecycle tool surface', () => {
  const fixture = createFixture();
  try {
    const profile = createCapabilityManagerSubagent({
      approvalService: fixture.approvalService,
      serviceFactory: fixture.serviceFactory,
      protocolBundleLoader: fixture.protocolBundleLoader,
    });
    assert.equal(profile.name, capabilityManagerAgentName);
    assert.match(
      profile.instructions ?? '',
      /persisted normalized message `eventId`/,
    );
    assert.match(
      profile.instructions ?? '',
      /never accept a model-authored protocol bundle/i,
    );
    assert.deepEqual(
      (profile.tools ?? []).map((tool) => tool.name).sort(),
      [
        'capability_add',
        'capability_disable',
        'capability_enable',
        'capability_inspect',
        'capability_list',
        'capability_remove',
        'capability_update',
        'capability_validate',
      ],
    );
  } finally {
    fixture.cleanup();
  }
});

test('default capability protocol loader reloads trusted persisted event state', async () => {
  const root = mkdtempSync(join(tmpdir(), 'sim-one-capability-protocols-'));
  const runtimeRoot = join(root, '.gorombo');
  const event: NormalizedMessageEvent = {
    id: `capability-event-${Date.now()}`,
    connector: 'web-api',
    kind: 'chat.message',
    text: 'Add a runtime capability.',
    receivedAt: new Date().toISOString(),
    actor: { id: 'operator-1' },
    conversation: { id: 'conversation-1' },
    context: { task: 'capability-management' },
  };
  rememberProtocolLookupEvent(event);

  try {
    const load = createDefaultCapabilityProtocolBundleLoader({
      GOROMBO_RUNTIME_ROOT: runtimeRoot,
      GOROMBO_PROTOCOL_DB_PATH: join(
        runtimeRoot,
        'db',
        'protocols.sqlite',
      ),
    });
    const bundle = await load(event.id);

    assert.equal(bundle.eventId, event.id);
    assert.ok(bundle.protocols.length > 0);
    assert.ok(
      bundle.protocols.some(
        (protocol) => protocol.id === 'capabilities.lifecycle-routing',
      ),
    );
  } finally {
    forgetProtocolLookupEvent(event.id);
    rmSync(root, { recursive: true, force: true });
  }
});

test('capability-manager mutations fail closed and executable activation requires a second approval', async () => {
  const fixture = createFixture();
  try {
    const sourceRef = join(fixture.root, 'tool-source');
    mkdirSync(sourceRef, { recursive: true });
    writeFileSync(
      join(sourceRef, 'index.mjs'),
      "import { defineTool } from '@flue/runtime';\nexport default defineTool({ name: 'fixture', parameters: {}, execute: async () => 'ok' });\n",
    );
    const profile = createCapabilityManagerSubagent({
      approvalService: fixture.approvalService,
      serviceFactory: fixture.serviceFactory,
      protocolBundleLoader: fixture.protocolBundleLoader,
    });
    const add = getTool(profile.tools ?? [], 'capability_add');
    const addArgs = {
      taskId: 'capability-manager-test',
      eventId: 'capability-manager-add',
      protocolBundle: createProtocolBundle('fabricated-model-bundle'),
      kind: 'tool',
      id: 'approved-tool',
      name: 'Approved tool',
      description: 'Approval fixture',
      source: 'local',
      sourceRef,
      version: 'fixture-v1',
      requestedEnabled: true,
    };

    const pendingAdd = JSON.parse(await add.execute(addArgs)) as {
      blocked: boolean;
      request: { id: string; actionType: string; metadata: Record<string, unknown> };
    };
    assert.equal(pendingAdd.blocked, true);
    assert.equal(pendingAdd.request.actionType, 'capability.add');
    assert.equal(pendingAdd.request.metadata.kind, 'tool');
    assert.equal(
      pendingAdd.request.metadata.protocolEventId,
      'capability-manager-add',
    );
    assert.equal(
      pendingAdd.request.metadata.protocolIds,
      '["capabilities.lifecycle-routing"]',
    );
    assert.equal(
      pendingAdd.request.metadata.protocolRules,
      '["Route capability validation through protocols."]',
    );
    assert.equal(
      typeof pendingAdd.request.metadata.sourceRefDigest,
      'string',
    );
    assert.match(String(pendingAdd.request.metadata.sourceRefDigest), /^[a-f0-9]{64}$/);
    assert.equal(pendingAdd.request.metadata.sourceRef, undefined);
    assert.equal(fixture.serviceFactory().service.inspect('tool', 'approved-tool').record, undefined);

    await fixture.approvalService.recordDecision({
      requestId: pendingAdd.request.id,
      approved: true,
      decidedBy: 'operator-1',
      principal: { id: 'operator-1', roles: ['operator'] },
    });
    const added = JSON.parse(await add.execute(addArgs)) as {
      record: { enabled: boolean };
      restartRequired: boolean;
      progress: Array<{ type: string }>;
    };
    assert.equal(added.record.enabled, false);
    assert.equal(added.restartRequired, true);
    assert.ok(added.progress.some((event) => event.type === 'capability.lifecycle.completed'));

    const enable = getTool(profile.tools ?? [], 'capability_enable');
    const enableArgs = {
      taskId: 'capability-manager-test',
      eventId: 'capability-manager-enable',
      kind: 'tool',
      id: 'approved-tool',
    };
    const pendingEnable = JSON.parse(await enable.execute(enableArgs)) as {
      blocked: boolean;
      request: { id: string; actionType: string };
    };
    assert.equal(pendingEnable.blocked, true);
    assert.equal(pendingEnable.request.actionType, 'capability.enable');
    assert.equal(fixture.serviceFactory().service.inspect('tool', 'approved-tool').record?.enabled, false);

    await fixture.approvalService.recordDecision({
      requestId: pendingEnable.request.id,
      approved: true,
      decidedBy: 'operator-1',
      principal: { id: 'operator-1', roles: ['operator'] },
    });
    const enabled = JSON.parse(await enable.execute(enableArgs)) as {
      record: { enabled: boolean };
      activationState: string;
    };
    assert.equal(enabled.record.enabled, true);
    assert.equal(enabled.activationState, 'enabled-pending-restart');
  } finally {
    fixture.cleanup();
  }
});

test('capability-manager approvals distinguish different private local sources', async () => {
  const fixture = createFixture();
  try {
    const firstSource = createToolSource(fixture.root, 'first-source');
    const secondSource = createToolSource(fixture.root, 'second-source');
    const profile = createCapabilityManagerSubagent({
      approvalService: fixture.approvalService,
      serviceFactory: fixture.serviceFactory,
      protocolBundleLoader: fixture.protocolBundleLoader,
    });
    const add = getTool(profile.tools ?? [], 'capability_add');
    const commonArgs = {
      taskId: 'local-source-identity',
      eventId: 'local-source-identity',
      kind: 'tool',
      id: 'source-bound-tool',
      name: 'Source-bound tool',
      description: '',
      source: 'local',
      version: 'fixture-v1',
    };

    const first = JSON.parse(
      await add.execute({ ...commonArgs, sourceRef: firstSource }),
    ) as {
      request: {
        dedupeKey: string;
        metadata: Record<string, unknown>;
      };
    };
    const second = JSON.parse(
      await add.execute({ ...commonArgs, sourceRef: secondSource }),
    ) as typeof first;

    assert.notEqual(first.request.dedupeKey, second.request.dedupeKey);
    assert.notEqual(
      first.request.metadata.sourceRefDigest,
      second.request.metadata.sourceRefDigest,
    );
    assert.doesNotMatch(JSON.stringify(first.request.metadata), /first-source/);
    assert.doesNotMatch(JSON.stringify(second.request.metadata), /second-source/);
  } finally {
    fixture.cleanup();
  }
});

test('capability-manager rejects malformed protocols before creating approval records', async () => {
  const fixture = createFixture();
  try {
    const profile = createCapabilityManagerSubagent({
      approvalService: fixture.approvalService,
      serviceFactory: fixture.serviceFactory,
      protocolBundleLoader: async (eventId) => ({
        eventId,
        loadedAt: new Date().toISOString(),
        protocols: [],
      }),
    });
    const add = getTool(profile.tools ?? [], 'capability_add');
    await assert.rejects(
      () =>
        add.execute({
          taskId: 'malformed-protocols',
          eventId: 'malformed-protocols',
          kind: 'mcp',
          id: 'malformed-protocols',
          name: 'Malformed protocols',
          mcpUrl: 'https://mcp.example.test/api',
          mcpTransport: 'streamable-http',
        }),
      /requires at least one applicable protocol directive/,
    );
    assert.deepEqual(
      await fixture.approvalService.listRecords('malformed-protocols'),
      [],
    );
  } finally {
    fixture.cleanup();
  }
});

test('capability-manager stores MCP connections in the runtime capability registry', async () => {
  const fixture = createFixture();
  try {
    const profile = createCapabilityManagerSubagent({
      approvalService: fixture.approvalService,
      serviceFactory: fixture.serviceFactory,
      protocolBundleLoader: fixture.protocolBundleLoader,
    });
    const add = getTool(profile.tools ?? [], 'capability_add');
    const addArgs = {
      taskId: 'runtime-mcp-registry',
      eventId: 'runtime-mcp-registry',
      kind: 'mcp',
      id: 'runtime-mcp',
      name: 'Runtime MCP',
      description: 'Runtime MCP registry fixture',
      mcpUrl: 'https://mcp.example.test/api',
      mcpTransport: 'streamable-http',
    };

    const pending = JSON.parse(await add.execute(addArgs)) as {
      blocked: boolean;
      request: { id: string };
    };
    assert.equal(pending.blocked, true);
    await fixture.approvalService.recordDecision({
      requestId: pending.request.id,
      approved: true,
      decidedBy: 'operator-1',
      principal: { id: 'operator-1', roles: ['operator'] },
    });

    const added = JSON.parse(await add.execute(addArgs)) as {
      record: { kind: string; source: string; enabled: boolean };
      protocolContext: { directives: Array<{ id: string }> };
    };
    assert.equal(added.record.kind, 'mcp');
    assert.equal(added.record.source, 'local');
    assert.equal(added.record.enabled, false);
    assert.ok(
      added.protocolContext.directives.some(
        (directive) => directive.id === 'capabilities.lifecycle-routing',
      ),
    );

    const stored = fixture.serviceFactory().service.inspect('mcp', 'runtime-mcp').record;
    assert.equal(stored?.source, 'local');
  } finally {
    fixture.cleanup();
  }
});

test('capability-manager applies partial MCP updates without resending the stored URL', async () => {
  const fixture = createFixture();
  try {
    const profile = createCapabilityManagerSubagent({
      approvalService: fixture.approvalService,
      serviceFactory: fixture.serviceFactory,
      protocolBundleLoader: fixture.protocolBundleLoader,
    });
    const add = getTool(profile.tools ?? [], 'capability_add');
    const addArgs = {
      taskId: 'partial-mcp-manager',
      eventId: 'partial-mcp-manager-add',
      kind: 'mcp',
      id: 'partial-manager-mcp',
      name: 'Partial manager MCP',
      mcpUrl: 'https://mcp.example.test/original',
      mcpTransport: 'streamable-http',
      mcpTokenEnv: 'PARTIAL_MCP_TOKEN',
    };
    const pendingAdd = JSON.parse(await add.execute(addArgs)) as {
      request: { id: string };
    };
    await fixture.approvalService.recordDecision({
      requestId: pendingAdd.request.id,
      approved: true,
      decidedBy: 'operator-1',
      principal: { id: 'operator-1', roles: ['operator'] },
    });
    await add.execute(addArgs);

    const update = getTool(profile.tools ?? [], 'capability_update');
    const updateArgs = {
      taskId: 'partial-mcp-manager',
      eventId: 'partial-mcp-manager-update',
      kind: 'mcp',
      id: 'partial-manager-mcp',
      mcpTransport: 'sse',
    };
    const pendingUpdate = JSON.parse(await update.execute(updateArgs)) as {
      request: { id: string };
    };
    await fixture.approvalService.recordDecision({
      requestId: pendingUpdate.request.id,
      approved: true,
      decidedBy: 'operator-1',
      principal: { id: 'operator-1', roles: ['operator'] },
    });
    const updated = JSON.parse(await update.execute(updateArgs)) as {
      record: { config: Record<string, unknown> };
    };

    assert.deepEqual(updated.record.config, {
      mcpUrl: 'https://mcp.example.test/original',
      mcpTransport: 'sse',
      mcpTokenEnv: 'PARTIAL_MCP_TOKEN',
    });

    const tokenUpdateArgs = {
      taskId: 'partial-mcp-manager',
      eventId: 'partial-mcp-manager-token-update',
      kind: 'mcp',
      id: 'partial-manager-mcp',
      mcpTokenEnv: 'REPLACEMENT_MCP_TOKEN',
    };
    const pendingTokenUpdate = JSON.parse(
      await update.execute(tokenUpdateArgs),
    ) as {
      request: { id: string };
    };
    await fixture.approvalService.recordDecision({
      requestId: pendingTokenUpdate.request.id,
      approved: true,
      decidedBy: 'operator-1',
      principal: { id: 'operator-1', roles: ['operator'] },
    });
    const tokenUpdated = JSON.parse(
      await update.execute(tokenUpdateArgs),
    ) as {
      record: { config: Record<string, unknown> };
    };
    assert.deepEqual(tokenUpdated.record.config, {
      mcpUrl: 'https://mcp.example.test/original',
      mcpTransport: 'sse',
      mcpTokenEnv: 'REPLACEMENT_MCP_TOKEN',
    });
  } finally {
    fixture.cleanup();
  }
});

test('capability-manager rejects unsupported npm lifecycle sources', async () => {
  const fixture = createFixture();
  try {
    const profile = createCapabilityManagerSubagent({
      approvalService: fixture.approvalService,
      serviceFactory: fixture.serviceFactory,
      protocolBundleLoader: fixture.protocolBundleLoader,
    });
    const validate = getTool(profile.tools ?? [], 'capability_validate');

    await assert.rejects(
      () =>
        validate.execute({
          eventId: 'unsupported-npm-source',
          kind: 'skill',
          id: 'unsupported-npm-source',
          name: 'Unsupported npm source',
          source: 'npm',
          sourceRef: '@example/unsupported-skill',
        }),
      /Expected \("github" \| "local"\) but received "npm"/,
    );
  } finally {
    fixture.cleanup();
  }
});

function createFixture() {
  const root = mkdtempSync(join(tmpdir(), 'sim-one-capability-manager-'));
  const runtimeRoot = join(root, '.gorombo');
  const dbPath = join(runtimeRoot, 'db', 'capabilities.sqlite');
  const env = {
    GOROMBO_RUNTIME_ROOT: runtimeRoot,
    GOROMBO_CAPABILITIES_DIR: join(runtimeRoot, 'capabilities'),
  };
  const approvalService = createInMemoryCodingApprovalService();
  const protocolBundleLoader = async (eventId: string) =>
    createProtocolBundle(eventId);
  const stores = new Set<ReturnType<typeof createCapabilityStore>>();
  const serviceFactory = (protocolBundle?: ProtocolBundle) => {
    const store = createCapabilityStore({ dbPath });
    stores.add(store);
    return {
      service: new CapabilityLifecycleService({
        store,
        env,
        isBuiltin: () => false,
        protocolBundle,
      }),
      close: () => {
        store.close();
        stores.delete(store);
      },
    };
  };
  return {
    root,
    approvalService,
    serviceFactory,
    protocolBundleLoader,
    cleanup() {
      for (const store of stores) {
        store.close();
      }
      rmSync(root, { recursive: true, force: true });
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

function createToolSource(root: string, name: string): string {
  const source = join(root, name);
  mkdirSync(source, { recursive: true });
  writeFileSync(
    join(source, 'index.mjs'),
    "import { defineTool } from '@flue/runtime';\nexport default defineTool({ name: 'fixture', parameters: {}, execute: async () => 'ok' });\n",
  );
  return source;
}

function getTool(tools: ToolDefinition[], name: string): ToolDefinition {
  const tool = tools.find((candidate) => candidate.name === name);
  assert.ok(tool, `Expected tool ${name}`);
  return tool;
}
