import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { createInMemoryCodingApprovalService } from '../engine/workers/coding-worker/approvals/approval-service.js';
import { InMemoryCodingRepoRegistry } from '../engine/workers/coding-worker/repo/repo-registry.js';
import { createCodingRepoWorkflowTools } from '../engine/workers/coding-worker/tools/coding-repo-workflow-tools.js';
import type { CodingSandboxRuntime } from '../engine/workers/coding-worker/tools/sandbox-runtime.js';

test('public GitHub HTTPS clone succeeds anonymously without loading PAT credentials', async () => {
  const workspaceRoot = mkdtempSync(join(tmpdir(), 'github-private-clone-'));
  const approvalService = createInMemoryCodingApprovalService();
  const calls: Array<{ args: string[]; env?: Record<string, string> }> = [];
  let credentialLoads = 0;
  const sandbox = {
    workspaceRoot,
    existsWorkspace: async () => false,
    mkdirWorkspace: async () => undefined,
    resolveWorkspacePath: (path: string) => join(workspaceRoot, path),
    execFile: async (_file: string, args: string[], options?: { env?: Record<string, string> }) => {
      calls.push({ args, env: options?.env });
      return { exitCode: 0, stdout: '', stderr: '' };
    },
  } as unknown as CodingSandboxRuntime;
  const tools = createCodingRepoWorkflowTools({
    workspaceRoot,
    sandbox,
    repoRegistry: new InMemoryCodingRepoRegistry(),
    approvalService,
    githubGitEnv: async () => {
      credentialLoads += 1;
      return {
        GIT_ASKPASS: '/runtime/.gorombo/auth/github/git-askpass.mjs',
        GIT_TERMINAL_PROMPT: '0',
        GITHUB_PERSONAL_ACCESS_TOKEN: 'secret-pat',
      };
    },
  });
  const clone = getTool(tools, 'coding_repo_clone');

  try {
    const githubBlocked = JSON.parse(await clone.execute({
      taskId: 'clone-github', remoteUrl: 'https://github.com/owner/public.git', slug: 'public',
    })) as { request: { id: string } };
    await approvalService.recordDecision({
      requestId: githubBlocked.request.id,
      approved: true,
      decidedBy: 'operator-1',
      principal: { id: 'operator-1', roles: ['operator'] },
    });
    await clone.execute({ taskId: 'clone-github', remoteUrl: 'https://github.com/owner/public.git', slug: 'public' });
    assert.equal(calls.length, 1);
    assert.equal(credentialLoads, 0);
    assert.deepEqual(calls.at(-1)?.env, {
      GIT_CONFIG_NOSYSTEM: '1',
      GIT_CONFIG_GLOBAL: process.platform === 'win32' ? 'NUL' : '/dev/null',
      GIT_CONFIG_COUNT: '1',
      GIT_CONFIG_KEY_0: 'credential.helper',
      GIT_CONFIG_VALUE_0: '',
      GIT_ASKPASS: '',
      GIT_TERMINAL_PROMPT: '0',
    });
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

test('private GitHub HTTPS clone retries with command-scoped PAT credentials', async () => {
  const workspaceRoot = mkdtempSync(join(tmpdir(), 'github-private-clone-retry-'));
  const approvalService = createInMemoryCodingApprovalService();
  const calls: Array<{ env?: Record<string, string> }> = [];
  const sandbox = {
    workspaceRoot,
    existsWorkspace: async () => false,
    mkdirWorkspace: async () => undefined,
    resolveWorkspacePath: (path: string) => join(workspaceRoot, path),
    execFile: async (_file: string, _args: string[], options?: { env?: Record<string, string> }) => {
      calls.push({ env: options?.env });
      return calls.length === 1
        ? { exitCode: 128, stdout: '', stderr: 'authentication required' }
        : { exitCode: 0, stdout: '', stderr: '' };
    },
  } as unknown as CodingSandboxRuntime;
  const tools = createCodingRepoWorkflowTools({
    workspaceRoot,
    sandbox,
    repoRegistry: new InMemoryCodingRepoRegistry(),
    approvalService,
    githubGitEnv: async () => ({
      GIT_ASKPASS: '/runtime/.gorombo/auth/github/git-askpass.mjs',
      GIT_TERMINAL_PROMPT: '0',
      GITHUB_PERSONAL_ACCESS_TOKEN: 'secret-pat',
    }),
  });
  const clone = getTool(tools, 'coding_repo_clone');

  try {
    const blocked = JSON.parse(await clone.execute({
      taskId: 'clone-private',
      remoteUrl: 'https://github.com/owner/private.git',
      slug: 'private',
    })) as { request: { id: string } };
    await approvalService.recordDecision({
      requestId: blocked.request.id,
      approved: true,
      decidedBy: 'operator-1',
      principal: { id: 'operator-1', roles: ['operator'] },
    });
    await clone.execute({
      taskId: 'clone-private',
      remoteUrl: 'https://github.com/owner/private.git',
      slug: 'private',
    });

    assert.equal(calls.length, 2);
    assert.equal(calls[0]?.env?.GITHUB_PERSONAL_ACCESS_TOKEN, undefined);
    assert.equal(calls[1]?.env?.GITHUB_PERSONAL_ACCESS_TOKEN, 'secret-pat');
  } finally {
    rmSync(workspaceRoot, { recursive: true, force: true });
  }
});

function getTool(tools: unknown[], name: string): {
  execute(args: { taskId: string; remoteUrl: string; slug: string }): Promise<string>;
} {
  const tool = (tools as Array<{ name: string; execute: unknown }>).find((candidate) => candidate.name === name);
  assert.ok(tool, `Missing ${name} tool.`);
  return tool as unknown as { execute(args: { taskId: string; remoteUrl: string; slug: string }): Promise<string> };
}
