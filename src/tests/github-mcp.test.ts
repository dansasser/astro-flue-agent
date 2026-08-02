import { runToolForText as runTool } from '../engine/tools/direct-tool-runner.js';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { escapeRegExp } from './test-utils.js';
import { defineTool, type McpConnection, type McpConnectionDefinition, type ToolDefinition } from '@flue/runtime';
import * as v from 'valibot';
import { createInMemoryCodingApprovalService } from '../engine/workers/coding-worker/approvals/approval-service.js';
import {
  connectCodingWorkerGithubMcp,
  createGitProcessEnvironment,
  McpGitHubClient,
  prepareCodingWorkerGithubMcp,
} from '../engine/workers/coding-worker/github/github-mcp.js';
import {
  createGithubGitCredentialEnv,
  readGithubPat,
} from '../engine/workers/coding-worker/github/github-pat.js';
import { createCodingGitHubTools } from '../engine/workers/coding-worker/github/github-tools.js';

test('GitHub PAT uses the official environment key only', () => {
  assert.equal(readGithubPat({ GH_TOKEN: 'legacy' }), undefined);
  assert.equal(
    readGithubPat({ GITHUB_PERSONAL_ACCESS_TOKEN: '  pat-value  ' }),
    'pat-value',
  );
});

test('Coding Worker connects through Flue and exposes only read-only GitHub MCP tools', async () => {
  const calls: McpConnectionDefinition[] = [];
  const connection = fakeConnection();
  const integration = await connectCodingWorkerGithubMcp({
    env: {
      GITHUB_PERSONAL_ACCESS_TOKEN: 'secret-pat',
      GOROMBO_RUNTIME_ROOT: '/tmp/github-mcp-test/.gorombo',
    },
    connect: async (definition) => {
      calls.push(definition);
      return connection;
    },
  });

  assert.equal(calls.length, 1);
  const definition = calls[0];
  assert.ok(definition);
  assert.equal(definition.name, 'github');
  assert.equal(await resolveMcpAuth(definition), 'secret-pat');
  const headers = new Headers(definition.headers);
  assert.equal(headers.get('authorization'), null);
  assert.match(headers.get('x-mcp-tools') ?? '', /issue_read/);
  assert.match(headers.get('x-mcp-tools') ?? '', /update_pull_request/);
  assert.match(headers.get('x-mcp-tools') ?? '', /add_comment_to_pending_review/);
  assert.doesNotMatch(
    headers.get('x-mcp-tools') ?? '',
    /add_pull_request_review_comment/,
  );
  assert.deepEqual(
    integration.readTools.map((tool) => tool.name),
    [
      'mcp__github__issue_read',
      'mcp__github__list_issues',
      'mcp__github__pull_request_read',
      'mcp__github__list_pull_requests',
    ],
  );
  assert.doesNotMatch(JSON.stringify(integration.readTools), /secret-pat/);
  assert.ok(integration.client);
});

test('missing GitHub PAT leaves MCP disconnected without falling back to gh', async () => {
  let connected = false;
  const integration = await connectCodingWorkerGithubMcp({
    env: {},
    connect: async () => {
      connected = true;
      return fakeConnection();
    },
  });
  assert.equal(connected, false);
  assert.equal(integration.client, undefined);
  assert.deepEqual(integration.readTools, []);
});

test('GitHub MCP connection errors redact the configured PAT', async () => {
  await assert.rejects(
    connectCodingWorkerGithubMcp({
      env: {
        GITHUB_PERSONAL_ACCESS_TOKEN: 'secret-pat',
        GOROMBO_RUNTIME_ROOT: '/tmp/github-mcp-test/.gorombo',
      },
      connect: async () => {
        throw new Error('upstream rejected Bearer secret-pat');
      },
    }),
    (error: unknown) => {
      assert.match(String(error), /Bearer \[redacted\]/);
      assert.doesNotMatch(String(error), /secret-pat/);
      return true;
    },
  );
});

test('runtime GitHub MCP preparation fails soft without exposing credentials', async () => {
  const integration = await prepareCodingWorkerGithubMcp({
    env: {
      GITHUB_PERSONAL_ACCESS_TOKEN: 'secret-pat',
    },
    connect: async () => {
      throw new Error('upstream rejected Bearer secret-pat');
    },
  });

  assert.equal(integration.client, undefined);
  assert.deepEqual(integration.readTools, []);
  assert.match(integration.unavailableReason ?? '', /failed during runtime startup/);
  assert.doesNotMatch(JSON.stringify(integration), /secret-pat/);
});

test('MCP Git operations keep the PAT out of anonymous fetch and checkout', async () => {
  const calls: Array<{
    args: string[];
    options: { cwd: string; env?: Record<string, string> };
  }> = [];
  const client = new McpGitHubClient(new Map(), {
    gitEnv: async () => ({
      GIT_ASKPASS: '/runtime/auth/github/askpass.sh',
      SIM_ONE_GITHUB_TOKEN_FILE: '/runtime/auth/github/token',
    }),
    gitRunner: async (args, options) => {
      calls.push({ args, options });
      if (calls.length === 1) {
        throw new Error('anonymous fetch rejected');
      }
      return { stdout: '', stderr: '' };
    },
  });

  await client.createBranchFromPullRequest({
    owner: 'dansasser',
    repo: 'sim-one-alpha',
    pullRequestNumber: 76,
    branchName: 'review-fix',
    cwd: '/workspace/repo',
  });

  assert.equal(calls.length, 3);
  assert.deepEqual(calls[0]?.args, [
    'fetch',
    'https://github.com/dansasser/sim-one-alpha.git',
    'refs/pull/76/head',
  ]);
  assert.deepEqual(calls[1]?.args, calls[0]?.args);
  assert.equal(calls[0]?.options.env?.GITHUB_PERSONAL_ACCESS_TOKEN, undefined);
  assert.equal(calls[0]?.options.env?.GIT_ASKPASS, '');
  assert.equal(calls[1]?.options.env?.GITHUB_PERSONAL_ACCESS_TOKEN, undefined);
  assert.equal(
    calls[1]?.options.env?.GIT_ASKPASS,
    '/runtime/auth/github/askpass.sh',
  );
  assert.equal(
    calls[1]?.options.env?.SIM_ONE_GITHUB_TOKEN_FILE,
    '/runtime/auth/github/token',
  );
  assert.equal(calls[1]?.options.env?.GIT_CONFIG_KEY_1, 'core.hooksPath');
  assert.equal(calls[1]?.options.env?.GIT_CONFIG_VALUE_1, '/dev/null');
  assert.equal(calls[2]?.options.env?.GITHUB_PERSONAL_ACCESS_TOKEN, undefined);
  assert.equal(calls[2]?.options.env?.GIT_ASKPASS, '');
});

test('MCP PR branch creation rejects owner and repository path injection', async () => {
  const client = new McpGitHubClient(new Map(), {
    gitRunner: async () => {
      throw new Error('Git must not run for an invalid approved repository.');
    },
  });

  await assert.rejects(
    client.createBranchFromPullRequest({
      owner: 'approved-owner',
      repo: '../different-repo',
      pullRequestNumber: 76,
      branchName: 'review-fix',
      cwd: '/workspace/repo',
    }),
    /plain path segments/,
  );
});

test('default Git child environment strips inherited credentials', () => {
  const anonymous = createGitProcessEnvironment(
    {
      GIT_ASKPASS: '',
      GIT_TERMINAL_PROMPT: '0',
    },
    {
      PATH: '/usr/bin',
      GITHUB_PERSONAL_ACCESS_TOKEN: 'inherited-pat',
      GITHUB_TOKEN: 'inherited-token',
      GH_TOKEN: 'inherited-gh-token',
      GH_CONFIG_DIR: '/home/user/.config/gh',
      GIT_ASKPASS: '/tmp/inherited-askpass',
      GIT_CONFIG_GLOBAL: '/tmp/inherited-gitconfig',
    },
  );
  assert.equal(anonymous.PATH, '/usr/bin');
  assert.equal(anonymous.GITHUB_PERSONAL_ACCESS_TOKEN, undefined);
  assert.equal(anonymous.GITHUB_TOKEN, undefined);
  assert.equal(anonymous.GH_TOKEN, undefined);
  assert.equal(anonymous.GH_CONFIG_DIR, undefined);
  assert.equal(anonymous.GIT_CONFIG_GLOBAL, undefined);
  assert.equal(anonymous.GIT_ASKPASS, '');

  const authenticated = createGitProcessEnvironment(
    {
      GITHUB_PERSONAL_ACCESS_TOKEN: 'command-pat',
      GIT_ASKPASS: '/runtime/auth/github/askpass.sh',
      SIM_ONE_GITHUB_TOKEN_FILE: '/runtime/auth/github/token',
    },
    {
      PATH: '/usr/bin',
      GITHUB_PERSONAL_ACCESS_TOKEN: 'inherited-pat',
    },
  );
  assert.equal(authenticated.GITHUB_PERSONAL_ACCESS_TOKEN, undefined);
  assert.equal(
    authenticated.GIT_ASKPASS,
    '/runtime/auth/github/askpass.sh',
  );
  assert.equal(
    authenticated.SIM_ONE_GITHUB_TOKEN_FILE,
    '/runtime/auth/github/token',
  );
});

test('MCP GitHub client maps issue and PR reads to official tools', async () => {
  const calls: Array<{ name: string; args: Record<string, unknown> }> = [];
  const client = new McpGitHubClient(new Map(fakeConnection(calls).tools.map((tool) => [tool.name, tool])));

  const issue = await client.getIssue('dansasser', 'sim-one-alpha', 42);
  const pr = await client.getPullRequest('dansasser', 'sim-one-alpha', 56);
  const checks = await client.listPullRequestChecks('dansasser', 'sim-one-alpha', 56);

  assert.equal(issue.number, 42);
  assert.equal(pr.baseRef, 'main');
  assert.equal(checks[0]?.name, 'CI');
  assert.deepEqual(calls.slice(0, 3).map((call) => call.args.method), [
    'get',
    'get',
    'get_check_runs',
  ]);
});

test('MCP GitHub client uses the official pending-review and thread contracts', async () => {
  const calls: Array<{ name: string; args: Record<string, unknown> }> = [];
  const client = new McpGitHubClient(
    new Map(fakeConnection(calls).tools.map((tool) => [tool.name, tool])),
  );

  const threads = await client.listPullRequestReviewThreads(
    'dansasser',
    'sim-one-alpha',
    56,
  );
  await client.createReviewComment({
    owner: 'dansasser',
    repo: 'sim-one-alpha',
    pullRequestNumber: 56,
    body: 'Please cover this branch.',
    path: 'src/example.ts',
    line: 14,
  });

  assert.equal(threads[0]?.id, 'PRRT_thread');
  assert.equal(threads[0]?.path, 'src/example.ts');
  assert.equal(threads[0]?.line, 14);
  assert.equal(threads[0]?.comments[0]?.author, 'reviewer');
  assert.equal(threads[0]?.comments[0]?.id, '12345');
  assert.deepEqual(
    calls.map((call) => call.name),
    [
      'pull_request_read',
      'pull_request_review_write',
      'add_comment_to_pending_review',
      'pull_request_review_write',
    ],
  );
  assert.equal(calls[2]?.args.subjectType, 'LINE');
});

test('approval gate blocks MCP mutation until the exact request is approved', async () => {
  let updates = 0;
  const approvalService = createInMemoryCodingApprovalService();
  const tools = createCodingGitHubTools({
    approvalService,
    client: {
      async getIssue() {
        throw new Error('unused');
      },
      async getPullRequest() {
        throw new Error('unused');
      },
      async listPullRequestChecks() {
        return [];
      },
      async updateIssue() {
        updates += 1;
        return { status: 'updated' };
      },
    },
  });
  const update = getTool(tools, 'coding_github_update_issue');
  const args = {
    taskId: 'task-mcp-approval',
    owner: 'dansasser',
    repo: 'sim-one-alpha',
    issueNumber: 7,
    title: 'Updated title',
  };
  const blocked = JSON.parse(await runTool(update, args)) as {
    actions: Array<{ payload: { request?: { id: string }; blocked?: boolean } }>;
  };
  assert.equal(updates, 0);
  const requestId = blocked.actions[0]?.payload.request?.id;
  assert.ok(requestId);
  await approvalService.recordDecision({
    requestId,
    approved: true,
    decidedBy: 'operator',
    principal: { id: 'operator', roles: ['operator'] },
  });
  await runTool(update, args);
  assert.equal(updates, 1);
});

test('Git credential helper stores no PAT and lives under the canonical runtime auth root', async () => {
  const fixture = mkdtempSync(join(tmpdir(), 'sim-one-github-pat-'));
  const runtimeRoot = join(fixture, '.gorombo');
  mkdirSync(runtimeRoot, { recursive: true });
  try {
    const env = await createGithubGitCredentialEnv({
      GOROMBO_RUNTIME_ROOT: runtimeRoot,
      GITHUB_PERSONAL_ACCESS_TOKEN: 'secret-pat',
    });
    assert.equal(env.GITHUB_PERSONAL_ACCESS_TOKEN, undefined);
    assert.match(env.GIT_ASKPASS, new RegExp(`^${escapeRegExp(join(runtimeRoot, 'auth', 'github'))}`));
    assert.match(
      env.SIM_ONE_GITHUB_TOKEN_FILE,
      new RegExp(`^${escapeRegExp(join(runtimeRoot, 'auth', 'github'))}`),
    );
    assert.doesNotMatch(readFileSync(env.GIT_ASKPASS, 'utf8'), /secret-pat/);
    assert.equal(
      readFileSync(env.SIM_ONE_GITHUB_TOKEN_FILE, 'utf8').trim(),
      'secret-pat',
    );
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

function fakeConnection(
  calls: Array<{ name: string; args: Record<string, unknown> }> = [],
): McpConnection {
  const outputs: Record<string, (args: Record<string, unknown>) => unknown> = {
    issue_read: (args) => ({
      number: args.issue_number,
      title: 'Issue',
      state: 'OPEN',
      url: 'https://github.com/dansasser/sim-one-alpha/issues/42',
    }),
    list_issues: () => ({ issues: [] }),
    pull_request_read: (args) => args.method === 'get_check_runs'
      ? { check_runs: [{ name: 'CI', status: 'completed', conclusion: 'success' }] }
      : args.method === 'get_review_comments'
        ? {
            review_threads: [{
              id: 'PRRT_thread',
              is_resolved: false,
              is_outdated: false,
              comments: [{
                author: 'reviewer',
                body: 'Please cover this branch.',
                path: 'src/example.ts',
                line: 14,
                html_url: 'https://github.com/dansasser/sim-one-alpha/pull/56#discussion_r12345',
              }],
            }],
          }
        : {
          number: args.pullNumber,
          title: 'PR',
          state: 'OPEN',
          base: { ref: 'main' },
          head: { ref: 'feature' },
          draft: false,
        },
    list_pull_requests: () => [],
  };
  const names = [
    'issue_read',
    'list_issues',
    'pull_request_read',
    'list_pull_requests',
    'actions_run_trigger',
    'add_issue_comment',
    'add_comment_to_pending_review',
    'add_reply_to_pull_request_comment',
    'create_pull_request',
    'fork_repository',
    'issue_write',
    'pull_request_review_write',
    'update_pull_request',
  ];
  return {
    name: 'github',
    tools: names.map((name): ToolDefinition => defineTool({
      name: `mcp__github__${name}`,
      description: name,
      input: v.looseObject({}),
      async run({ data }) {
        const args = data as Record<string, unknown>;
        calls.push({ name, args });
        return JSON.stringify(outputs[name]?.(args) ?? { id: 'result-id' });
      },
    })),
    async close() {},
  };
}

function getTool(tools: ToolDefinition[], name: string): ToolDefinition {
  const tool = tools.find((candidate) => candidate.name === name);
  assert.ok(tool, `Missing tool ${name}`);
  return tool;
}


async function resolveMcpAuth(definition: McpConnectionDefinition): Promise<string | undefined> {
  return typeof definition.auth === 'function'
    ? definition.auth()
    : definition.auth;
}
