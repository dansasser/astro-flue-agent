import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import type { ToolDefinition } from '@flue/runtime';
import type { ProtocolBundle } from '../core/types/index.js';
import { createCapabilityStore } from '../engine/capabilities/capability-store.js';
import { CapabilityLifecycleService } from '../engine/capabilities/capability-lifecycle-service.js';
import { createInMemoryCodingApprovalService } from '../engine/workers/coding-worker/approvals/approval-service.js';
import {
  capabilityManagerAgentName,
  createCapabilityManagerSubagent,
} from '../engine/workers/capability-manager/capability-manager.js';

test('capability-manager owns the complete lifecycle tool surface', () => {
  const fixture = createFixture();
  try {
    const profile = createCapabilityManagerSubagent({
      approvalService: fixture.approvalService,
      serviceFactory: fixture.serviceFactory,
    });
    assert.equal(profile.name, capabilityManagerAgentName);
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
    });
    const add = getTool(profile.tools ?? [], 'capability_add');
    const addArgs = {
      taskId: 'capability-manager-test',
      protocolBundle: createProtocolBundle('capability-manager-add'),
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
      pendingAdd.request.metadata.sourceRef,
      '[workspace-local-source]',
    );
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
      protocolBundle: createProtocolBundle('capability-manager-enable'),
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

test('capability-manager rejects malformed protocols before creating approval records', async () => {
  const fixture = createFixture();
  try {
    const profile = createCapabilityManagerSubagent({
      approvalService: fixture.approvalService,
      serviceFactory: fixture.serviceFactory,
    });
    const add = getTool(profile.tools ?? [], 'capability_add');
    await assert.rejects(
      () =>
        add.execute({
          taskId: 'malformed-protocols',
          protocolBundle: {
            eventId: 'malformed-protocols',
            loadedAt: new Date().toISOString(),
            protocols: [],
          },
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

function createFixture() {
  const root = mkdtempSync(join(tmpdir(), 'sim-one-capability-manager-'));
  const runtimeRoot = join(root, '.gorombo');
  const dbPath = join(runtimeRoot, 'db', 'capabilities.sqlite');
  const env = {
    GOROMBO_RUNTIME_ROOT: runtimeRoot,
    GOROMBO_CAPABILITIES_DIR: join(runtimeRoot, 'capabilities'),
  };
  const approvalService = createInMemoryCodingApprovalService();
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

function getTool(tools: ToolDefinition[], name: string): ToolDefinition {
  const tool = tools.find((candidate) => candidate.name === name);
  assert.ok(tool, `Expected tool ${name}`);
  return tool;
}
