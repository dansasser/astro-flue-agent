import { runToolForText as runTool } from '../engine/tools/direct-tool-runner.js';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import type { ToolDefinition } from '@flue/runtime';
import type { ProtocolBundle } from '../core/types/index.js';
import { createCodingCapabilityAuthoringTools } from '../engine/workers/coding-worker/capability-authoring/capability-authoring-tools.js';
import {
  scaffoldCapabilityFiles,
  validateCapabilityPackage,
  type CodingCapabilityAuthoringKind,
} from '../engine/workers/coding-worker/capability-authoring/capability-authoring.js';
import { createInMemoryCodingApprovalService } from '../engine/workers/coding-worker/approvals/approval-service.js';
import { InMemoryCodingProgressReporter } from '../engine/workers/coding-worker/events/progress-reporter.js';

const authoringCases: Array<{
  kind: CodingCapabilityAuthoringKind;
  managerKind: 'skill' | 'tool' | 'worker' | 'mcp';
  operation: 'add' | 'validate';
  requestedActivation: 'enabled' | 'disabled';
}> = [
  { kind: 'skill', managerKind: 'skill', operation: 'add', requestedActivation: 'enabled' },
  { kind: 'tool', managerKind: 'tool', operation: 'add', requestedActivation: 'disabled' },
  { kind: 'worker', managerKind: 'worker', operation: 'add', requestedActivation: 'disabled' },
  { kind: 'mcp-server', managerKind: 'mcp', operation: 'validate', requestedActivation: 'disabled' },
  { kind: 'mcp-connection', managerKind: 'mcp', operation: 'add', requestedActivation: 'disabled' },
];

test('Coding Worker scaffolds, validates, and prepares protocol-governed handoffs for every capability kind', async () => {
  const fixture = createFixture();
  try {
    for (const entry of authoringCases) {
      const id = `fixture-${entry.kind}`;
      const packagePath = `capability-packages/${id}`;
      const args = {
        taskId: `author-${entry.kind}`,
        protocolBundle: createProtocolBundle(`author-${entry.kind}`),
        authoringKind: entry.kind,
        id,
        name: `Fixture ${entry.kind}`,
        description: `Fixture ${entry.kind} capability.`,
        packagePath,
        requiredConfigurationKeys:
          entry.kind === 'mcp-connection' ? ['GOROMBO_MCP_TOKEN'] : [],
      };
      const classification = JSON.parse(
        await runTool(fixture.classify, {
          taskId: args.taskId,
          protocolBundle: args.protocolBundle,
          authoringKind: entry.kind,
          rationale: `The fixture exercises ${entry.kind} authoring.`,
        }),
      ) as {
        authoringKind: string;
        managerKind: string;
        protocolContext: { directives: Array<{ id: string }> };
      };
      assert.equal(classification.authoringKind, entry.kind);
      assert.equal(classification.managerKind, entry.managerKind);
      assert.deepEqual(
        classification.protocolContext.directives.map((directive) => directive.id),
        ['capabilities.lifecycle-routing'],
      );

      const pending = JSON.parse(
        await runTool(fixture.scaffold, args),
      ) as { blocked: boolean; request: { id: string; actionType: string } };
      assert.equal(pending.blocked, true);
      assert.equal(pending.request.actionType, 'file.edit');
      assert.equal(existsSync(join(fixture.workspaceRoot, packagePath)), false);

      await fixture.approvalService.recordDecision({
        requestId: pending.request.id,
        approved: true,
        decidedBy: 'operator-1',
        principal: { id: 'operator-1', roles: ['operator'] },
      });
      const created = JSON.parse(
        await runTool(fixture.scaffold, args),
      ) as { status: string };
      assert.equal(created.status, 'created');

      const firstValidation = JSON.parse(
        await runTool(fixture.validate, {
          taskId: args.taskId,
          protocolBundle: args.protocolBundle,
          authoringKind: entry.kind,
          id,
          packagePath,
          requiredConfigurationKeys: args.requiredConfigurationKeys,
        }),
      ) as {
        valid: boolean;
        managerKind: string;
        contentDigest: string;
        checks: string[];
        mcpConnection?: {
          mcpUrl: string;
          mcpTransport: string;
          mcpTokenEnv?: string;
        };
        protocolContext: { directives: Array<{ id: string; rules: string[] }> };
      };
      const secondValidation = JSON.parse(
        await runTool(fixture.validate, {
          taskId: args.taskId,
          protocolBundle: args.protocolBundle,
          authoringKind: entry.kind,
          id,
          packagePath,
          requiredConfigurationKeys: args.requiredConfigurationKeys,
        }),
      ) as typeof firstValidation;

      assert.equal(firstValidation.valid, true);
      assert.equal(firstValidation.managerKind, entry.managerKind);
      assert.equal(firstValidation.contentDigest, secondValidation.contentDigest);
      assert.ok(firstValidation.checks.includes('protocols-routed'));
      assert.deepEqual(
        firstValidation.protocolContext.directives.map((directive) => directive.id),
        ['capabilities.lifecycle-routing'],
      );
      assert.deepEqual(
        firstValidation.protocolContext.directives[0]?.rules,
        ['Route capability validation through protocols.'],
      );

      if (entry.kind === 'skill') {
        await assert.rejects(
          () =>
            runTool(fixture.handoff, {
              taskId: args.taskId,
              protocolBundle: args.protocolBundle,
              authoringKind: entry.kind,
              id,
              packagePath,
              name: args.name,
              description: args.description,
              requestedActivation: 'enabled',
              operation: 'add',
            }),
          /requires a passing coding_capability_test attestation/,
        );
      }
      const testEvidence = JSON.parse(
        await runTool(fixture.testCapability, {
          taskId: args.taskId,
          protocolBundle: args.protocolBundle,
          authoringKind: entry.kind,
          id,
          packagePath,
          requiredConfigurationKeys: args.requiredConfigurationKeys,
          command: 'node -e "process.exit(0)"',
        }),
      ) as {
        status: string;
        exitCode: number;
        contentDigest: string;
        protocolContext: { directives: Array<{ id: string }> };
      };
      assert.equal(testEvidence.status, 'passed');
      assert.equal(testEvidence.exitCode, 0);
      assert.equal(testEvidence.contentDigest, firstValidation.contentDigest);

      const handoff = JSON.parse(
        await runTool(fixture.handoff, {
          taskId: args.taskId,
          protocolBundle: args.protocolBundle,
          authoringKind: entry.kind,
          id,
          packagePath,
          name: args.name,
          description: args.description,
          requiredConfigurationKeys: args.requiredConfigurationKeys,
          requestedActivation: 'enabled',
          operation: 'add',
        }),
      ) as {
        kind: string;
        operation: string;
        sourceRef: string;
        requestedActivation: string;
        contentDigest: string;
        validationEvidence: string[];
        testEvidence: { status: string; contentDigest: string; exitCode: number };
        mcpUrl?: string;
        mcpTransport?: string;
        mcpTokenEnv?: string;
        protocolContext: { directives: Array<{ id: string }> };
      };

      assert.equal(handoff.kind, entry.managerKind);
      assert.equal(handoff.operation, entry.operation);
      assert.equal(handoff.requestedActivation, entry.requestedActivation);
      assert.equal(handoff.sourceRef, packagePath);
      assert.equal(handoff.contentDigest, firstValidation.contentDigest);
      assert.ok(handoff.validationEvidence.includes('protocols-routed'));
      assert.equal(handoff.testEvidence.status, 'passed');
      assert.equal(handoff.testEvidence.exitCode, 0);
      assert.equal(handoff.testEvidence.contentDigest, firstValidation.contentDigest);
      if (entry.kind === 'mcp-connection') {
        assert.deepEqual(firstValidation.mcpConnection, {
          mcpUrl: 'https://replace-with-mcp-endpoint.invalid/mcp',
          mcpTransport: 'streamable-http',
          mcpTokenEnv: 'GOROMBO_MCP_TOKEN',
        });
        assert.equal(
          handoff.mcpUrl,
          'https://replace-with-mcp-endpoint.invalid/mcp',
        );
        assert.equal(handoff.mcpTransport, 'streamable-http');
        assert.equal(handoff.mcpTokenEnv, 'GOROMBO_MCP_TOKEN');
      }
      assert.deepEqual(
        handoff.protocolContext.directives.map((directive) => directive.id),
        ['capabilities.lifecycle-routing'],
      );
    }

    assert.equal(existsSync(join(fixture.workspaceRoot, '.gorombo')), false);
    assert.ok(
      fixture.reporter.events().some((event) => event.action === 'capability.validate'),
    );
    assert.ok(
      fixture.reporter.events().some((event) => event.action === 'capability.classify'),
    );
    assert.ok(
      fixture.reporter.events().some((event) => event.action === 'capability.test'),
    );
    assert.ok(
      fixture.reporter.events().some((event) => event.action === 'capability.handoff'),
    );
  } finally {
    fixture.cleanup();
  }
});

test('capability authoring validation fails closed without an applicable protocol bundle', async () => {
  const fixture = createFixture();
  try {
    await assert.rejects(
      () =>
        runTool(fixture.validate, {
          taskId: 'missing-protocols',
          authoringKind: 'skill',
          id: 'missing-protocols',
          packagePath: 'capability-packages/missing-protocols',
        }),
      /protocolBundle/,
    );
    assert.throws(
      () =>
        validateCapabilityPackage({
          scopePath: fixture.workspaceRoot,
          packagePath: 'capability-packages/missing-protocols',
          authoringKind: 'skill',
          id: 'missing-protocols',
          protocolBundle: undefined as unknown as ProtocolBundle,
        }),
      /requires an applicable Protocol Tool bundle/,
    );
  } finally {
    fixture.cleanup();
  }
});

test('denied capability scaffolding and escaped paths never mutate the workspace', async () => {
  const fixture = createFixture();
  try {
    const args = {
      taskId: 'denied-scaffold',
      protocolBundle: createProtocolBundle('denied-scaffold'),
      authoringKind: 'tool' as const,
      id: 'denied-tool',
      name: 'Denied tool',
      description: 'Must not be created.',
      packagePath: 'capability-packages/denied-tool',
    };
    const pending = JSON.parse(
      await runTool(fixture.scaffold, args),
    ) as { request: { id: string } };
    await fixture.approvalService.recordDecision({
      requestId: pending.request.id,
      approved: false,
      decidedBy: 'operator-1',
      principal: { id: 'operator-1', roles: ['operator'] },
    });
    const denied = JSON.parse(
      await runTool(fixture.scaffold, args),
    ) as { blocked: boolean };
    assert.equal(denied.blocked, true);
    assert.equal(existsSync(join(fixture.workspaceRoot, args.packagePath)), false);

    await assert.rejects(
      () =>
        runTool(fixture.scaffold, {
          ...args,
          taskId: 'escaped-scaffold',
          packagePath: '../outside-workspace',
        }),
      /workspace-relative path/,
    );
    await assert.rejects(
      () =>
        runTool(fixture.scaffold, {
          ...args,
          taskId: 'absolute-scaffold',
          packagePath: join(tmpdir(), 'outside-workspace'),
        }),
      /workspace-relative path/,
    );
  } finally {
    fixture.cleanup();
  }
});

test('existing capability scaffolds validate protocols without creating no-op approvals', async () => {
  const fixture = createFixture();
  const packagePath = 'capability-packages/existing-tool';
  try {
    mkdirSync(join(fixture.workspaceRoot, packagePath), { recursive: true });
    const result = JSON.parse(
      await runTool(fixture.scaffold, {
        taskId: 'existing-scaffold',
        protocolBundle: createProtocolBundle('existing-scaffold'),
        authoringKind: 'tool',
        id: 'existing-tool',
        name: 'Existing tool',
        description: 'Existing fixture.',
        packagePath,
      }),
    ) as { status: string; protocolContext: { eventId: string } };
    assert.equal(result.status, 'existing');
    assert.equal(result.protocolContext.eventId, 'existing-scaffold');
    assert.deepEqual(
      await fixture.approvalService.listRecords('existing-scaffold'),
      [],
    );

    await assert.rejects(
      () =>
        runTool(fixture.scaffold, {
          taskId: 'existing-malformed-protocol',
          protocolBundle: {
            eventId: 'existing-malformed-protocol',
            loadedAt: new Date().toISOString(),
            protocols: [],
          },
          authoringKind: 'tool',
          id: 'existing-tool',
          name: 'Existing tool',
          description: 'Existing fixture.',
          packagePath,
        }),
      /requires at least one applicable protocol directive/,
    );
  } finally {
    fixture.cleanup();
  }
});

test('capability validation rejects credential values and machine-specific host paths', async () => {
  const fixture = createFixture();
  const packagePath = 'capability-packages/scanned-tool';
  try {
    await approveAndScaffold(fixture, {
      taskId: 'scan-tool',
      protocolBundle: createProtocolBundle('scan-tool'),
      authoringKind: 'tool',
      id: 'scanned-tool',
      name: 'Scanned tool',
      description: 'Security scan fixture.',
      packagePath,
    });
    const sourcePath = join(fixture.workspaceRoot, packagePath, 'index.mjs');
    const original = readFileSync(sourcePath, 'utf8');
    writeFileSync(
      sourcePath,
      `${original}\nconst token = '${'ghp_' + 'a'.repeat(24)}';\n`,
    );
    assert.throws(
      () =>
        validateCapabilityPackage({
          scopePath: fixture.workspaceRoot,
          packagePath,
          authoringKind: 'tool',
          id: 'scanned-tool',
          protocolBundle: createProtocolBundle('secret-scan'),
        }),
      /possible credential value/,
    );

    writeFileSync(
      sourcePath,
      `${original}\nconst localPath = '${['', 'home', 'operator', 'private'].join('/')}';\n`,
    );
    assert.throws(
      () =>
        validateCapabilityPackage({
          scopePath: fixture.workspaceRoot,
          packagePath,
          authoringKind: 'tool',
          id: 'scanned-tool',
          protocolBundle: createProtocolBundle('host-path-scan'),
        }),
      /machine-specific absolute host path/,
    );

    writeFileSync(
      sourcePath,
      `${original}\nconst api_key = '${'B'.repeat(32)}';\n`,
    );
    assert.throws(
      () =>
        validateCapabilityPackage({
          scopePath: fixture.workspaceRoot,
          packagePath,
          authoringKind: 'tool',
          id: 'scanned-tool',
          protocolBundle: createProtocolBundle('generic-secret-scan'),
        }),
      /possible credential value/,
    );

    writeFileSync(
      sourcePath,
      `${original}\nconst localPath = '/etc/sim-one/private.json';\n`,
    );
    assert.throws(
      () =>
        validateCapabilityPackage({
          scopePath: fixture.workspaceRoot,
          packagePath,
          authoringKind: 'tool',
          id: 'scanned-tool',
          protocolBundle: createProtocolBundle('expanded-host-path-scan'),
        }),
      /machine-specific absolute host path/,
    );
  } finally {
    fixture.cleanup();
  }
});

test('Coding Worker capability authoring source has no runtime registry mutation dependency', () => {
  const source = readFileSync(
    resolve(
      'src/engine/workers/coding-worker/capability-authoring/capability-authoring-tools.ts',
    ),
    'utf8',
  );
  assert.doesNotMatch(
    source,
    /capability-(?:store|lifecycle-service|loader|materializer)|resolveCapabilitiesDir/,
  );
});

test('capability scaffolds serialize arbitrary ids as valid JavaScript strings', () => {
  const id = "fixture-'quoted'\\path\nnext-line";
  for (const authoringKind of ['tool', 'worker'] as const) {
    const module = scaffoldCapabilityFiles({
      authoringKind,
      id,
      name: 'Serialized identifier fixture',
      description: 'Generated source remains valid.',
    }).find((file) => file.path === 'index.mjs');
    assert.ok(module);

    const result = spawnSync(process.execPath, ['--check', '--input-type=module'], {
      input: module.content,
      encoding: 'utf8',
    });
    assert.equal(result.status, 0, result.stderr);
    const expectedId = authoringKind === 'tool' ? id.replace(/-/g, '_') : id;
    assert.match(
      module.content,
      new RegExp(JSON.stringify(expectedId).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    );
  }
});

function createFixture() {
  const root = mkdtempSync(join(tmpdir(), 'sim-one-capability-authoring-'));
  const workspaceRoot = join(root, 'workspace');
  const approvalService = createInMemoryCodingApprovalService();
  const reporter = new InMemoryCodingProgressReporter();
  const tools = createCodingCapabilityAuthoringTools({
    workspaceRoot,
    approvalService,
    reporter,
  });
  return {
    root,
    workspaceRoot,
    approvalService,
    reporter,
    classify: getTool(tools, 'coding_capability_classify'),
    scaffold: getTool(tools, 'coding_capability_scaffold'),
    validate: getTool(tools, 'coding_capability_validate'),
    testCapability: getTool(tools, 'coding_capability_test'),
    handoff: getTool(tools, 'coding_capability_prepare_handoff'),
    cleanup: () => rmSync(root, { recursive: true, force: true }),
  };
}

async function approveAndScaffold(
  fixture: ReturnType<typeof createFixture>,
  args: {
    taskId: string;
    protocolBundle: ProtocolBundle;
    authoringKind: CodingCapabilityAuthoringKind;
    id: string;
    name: string;
    description: string;
    packagePath: string;
  },
): Promise<void> {
  const pending = JSON.parse(
    await runTool(fixture.scaffold, args),
  ) as { request: { id: string } };
  await fixture.approvalService.recordDecision({
    requestId: pending.request.id,
    approved: true,
    decidedBy: 'operator-1',
    principal: { id: 'operator-1', roles: ['operator'] },
  });
  await runTool(fixture.scaffold, args);
}

function createProtocolBundle(eventId: string): ProtocolBundle {
  return {
    eventId,
    loadedAt: new Date().toISOString(),
    protocols: [{
      id: 'capabilities.lifecycle-routing',
      name: 'Capability lifecycle routing',
      description: 'Test protocol.',
      scope: 'base',
      enabled: true,
      priority: 88,
      appliesTo: {},
      rules: ['Route capability validation through protocols.'],
      source: 'seed',
      tags: ['capabilities'],
    }],
  };
}

function getTool(tools: ToolDefinition[], name: string): ToolDefinition {
  const tool = tools.find((candidate) => candidate.name === name);
  assert.ok(tool, `Expected tool ${name}`);
  return tool;
}
