import { runToolForText as runTool } from '../engine/tools/direct-tool-runner.js';
import assert from 'node:assert/strict';
import {
  chmodSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { parseEnv } from 'node:util';
import type { ToolDefinition } from '@flue/runtime';
import { createInMemoryCodingApprovalService } from '../engine/workers/coding-worker/approvals/approval-service.js';
import { InMemoryCodingProgressReporter } from '../engine/workers/coding-worker/events/progress-reporter.js';
import { createCodingRuntimeConfigurationTools } from '../engine/workers/coding-worker/tools/coding-runtime-configuration-tools.js';

test('Coding Worker runtime configuration status is complete and redacted', async () => {
  const fixture = createFixture();
  try {
    const tools = createCodingRuntimeConfigurationTools({
      configPath: fixture.configPath,
      approvalService: createInMemoryCodingApprovalService(),
    });
    const status = JSON.parse(
      await runTool(getTool(tools, 'coding_runtime_config_status'), {}),
    ) as {
      file: string;
      valid: boolean;
      keys: Array<{ key: string; secret: boolean; configured: boolean }>;
    };

    assert.equal(status.file, 'sim-one.config');
    assert.equal(status.valid, true);
    assert.equal(
      status.keys.find((entry) => entry.key === 'OLLAMA_API_KEY')?.configured,
      true,
    );
    assert.equal(
      status.keys.find((entry) => entry.key === 'OLLAMA_API_KEY')?.secret,
      true,
    );
    assert.doesNotMatch(JSON.stringify(status), /owner-secret/);
  } finally {
    fixture.cleanup();
  }
});

test('Coding Worker runtime configuration updates require matching approval and remain redacted', async () => {
  const fixture = createFixture();
  const approvalService = createInMemoryCodingApprovalService();
  const reporter = new InMemoryCodingProgressReporter();
  try {
    const tools = createCodingRuntimeConfigurationTools({
      configPath: fixture.configPath,
      approvalService,
      reporter,
    });
    const update = getTool(tools, 'coding_runtime_config_update');
    const args = {
      taskId: 'runtime-config-task',
      key: 'GOROMBO_RESEARCH_DEPTH',
      operation: 'set' as const,
      value: 'deep',
    };

    const pending = JSON.parse(await runTool(update, args)) as {
      blocked: boolean;
      request: { id: string };
    };
    assert.equal(pending.blocked, true);
    assert.equal(
      parseEnv(readFileSync(fixture.configPath, 'utf8')).GOROMBO_RESEARCH_DEPTH,
      'standard',
    );

    await approvalService.recordDecision({
      requestId: pending.request.id,
      approved: true,
      decidedBy: 'operator-1',
      principal: { id: 'operator-1', roles: ['operator'] },
    });
    const completed = JSON.parse(await runTool(update, args)) as {
      updated: boolean;
      key: string;
      operation: string;
    };

    assert.deepEqual(completed, {
      updated: true,
      key: 'GOROMBO_RESEARCH_DEPTH',
      operation: 'set',
      restartRequired: true,
    });
    const parsed = parseEnv(readFileSync(fixture.configPath, 'utf8'));
    assert.equal(parsed.GOROMBO_RESEARCH_DEPTH, 'deep');
    assert.equal(parsed.OLLAMA_API_KEY, 'owner-secret');
    assert.equal(statSync(fixture.configPath).mode & 0o777, 0o600);
    assert.doesNotMatch(
      JSON.stringify({ pending, completed, events: reporter.events() }),
      /owner-secret/,
    );
  } finally {
    fixture.cleanup();
  }
});

test('Coding Worker runtime configuration writes user-supplied secrets only after matching approval', async () => {
  const fixture = createFixture();
  const approvalService = createInMemoryCodingApprovalService();
  const reporter = new InMemoryCodingProgressReporter();
  const suppliedSecret = 'github-pat-from-user-chat';
  try {
    const update = getTool(
      createCodingRuntimeConfigurationTools({
        configPath: fixture.configPath,
        approvalService,
        reporter,
      }),
      'coding_runtime_config_update',
    );
    const args = {
      taskId: 'secret-write',
      key: 'GITHUB_PERSONAL_ACCESS_TOKEN',
      operation: 'set' as const,
      value: suppliedSecret,
    };
    const pending = JSON.parse(await runTool(update, args)) as {
      blocked: boolean;
      request: { id: string };
    };

    assert.equal(pending.blocked, true);
    assert.equal(
      parseEnv(readFileSync(fixture.configPath, 'utf8'))
        .GITHUB_PERSONAL_ACCESS_TOKEN,
      '',
    );
    assert.doesNotMatch(
      JSON.stringify({
        pending,
        records: await approvalService.listRecords(),
        events: reporter.events(),
      }),
      new RegExp(suppliedSecret),
    );

    await approvalService.recordDecision({
      requestId: pending.request.id,
      approved: true,
      decidedBy: 'operator-1',
      principal: { id: 'operator-1', roles: ['operator'] },
    });
    const completed = JSON.parse(await runTool(update, args)) as {
      updated: boolean;
      key: string;
      operation: string;
      restartRequired: boolean;
    };

    assert.deepEqual(completed, {
      updated: true,
      key: 'GITHUB_PERSONAL_ACCESS_TOKEN',
      operation: 'set',
      restartRequired: true,
    });
    assert.equal(
      parseEnv(readFileSync(fixture.configPath, 'utf8'))
        .GITHUB_PERSONAL_ACCESS_TOKEN,
      suppliedSecret,
    );
    assert.equal(statSync(fixture.configPath).mode & 0o777, 0o600);
    assert.doesNotMatch(
      JSON.stringify({
        completed,
        records: await approvalService.listRecords(),
        events: reporter.events(),
      }),
      new RegExp(suppliedSecret),
    );
  } finally {
    fixture.cleanup();
  }
});

test('Coding Worker runtime configuration denial never writes the supplied secret', async () => {
  const fixture = createFixture();
  const approvalService = createInMemoryCodingApprovalService();
  const suppliedSecret = 'denied-user-secret';
  try {
    const update = getTool(
      createCodingRuntimeConfigurationTools({
        configPath: fixture.configPath,
        approvalService,
      }),
      'coding_runtime_config_update',
    );
    const args = {
      taskId: 'secret-write-denied',
      key: 'GITHUB_PERSONAL_ACCESS_TOKEN',
      operation: 'set' as const,
      value: suppliedSecret,
    };
    const pending = JSON.parse(await runTool(update, args)) as {
      blocked: boolean;
      request: { id: string };
    };

    await approvalService.recordDecision({
      requestId: pending.request.id,
      approved: false,
      decidedBy: 'operator-1',
      principal: { id: 'operator-1', roles: ['operator'] },
      reason: 'Do not change this credential.',
    });
    const denied = JSON.parse(await runTool(update, args)) as {
      blocked: boolean;
    };

    assert.equal(denied.blocked, true);
    assert.equal(
      parseEnv(readFileSync(fixture.configPath, 'utf8'))
        .GITHUB_PERSONAL_ACCESS_TOKEN,
      '',
    );
    assert.doesNotMatch(
      JSON.stringify({
        denied,
        records: await approvalService.listRecords(),
      }),
      new RegExp(suppliedSecret),
    );
  } finally {
    fixture.cleanup();
  }
});

function createFixture(): { configPath: string; cleanup(): void } {
  const root = mkdtempSync(join(tmpdir(), 'sim-one-config-tools-'));
  const configPath = join(root, 'sim-one.config');
  writeFileSync(
    configPath,
    [
      'OLLAMA_API_KEY=owner-secret',
      'GOROMBO_RESEARCH_DEPTH=standard',
      'GITHUB_PERSONAL_ACCESS_TOKEN=',
      '',
    ].join('\n'),
    { mode: 0o600 },
  );
  chmodSync(configPath, 0o600);
  return {
    configPath,
    cleanup: () => rmSync(root, { recursive: true, force: true }),
  };
}

function getTool(tools: ToolDefinition[], name: string): ToolDefinition {
  const tool = tools.find((entry) => entry.name === name);
  assert.ok(tool, `Missing tool: ${name}`);
  return tool;
}
