import {
  createAgent,
  defineAgentProfile,
  type AgentProfile,
  type AgentRouteHandler,
} from '@flue/runtime';
import { local } from '@flue/runtime/node';
import { realpath } from 'node:fs/promises';
import { mkdirSync } from 'node:fs';
import { resolve as resolvePath, sep } from 'node:path';
import {
  assertPathInsideRuntimeRoot,
  createGoromboRuntimePaths,
  resolveGoromboRuntimeRoot,
  resolveRuntimePath,
} from '../../../core/config/runtime-root.js';
import { configureRuntimeModels } from '../../../core/models/index.js';
import {
  composeWorkspaceInstructions,
  resolveWorkspaceDirectory,
} from '../../../workspace-loader.js';
import {
  connectCodingWorkerGithubMcp,
  type CodingWorkerGithubMcp,
} from '../../../engine/workers/coding-worker/github/github-mcp.js';
import { githubPatEnvironmentKey } from '../../../engine/workers/coding-worker/github/github-pat.js';
import { createCodingGitHubTools } from '../../../engine/workers/coding-worker/github/github-tools.js';
import type { GitHubClient } from '../../../engine/workers/coding-worker/github/github-client.js';
import { createCodingWorkerRuntimeCapabilityBlock } from '../../../engine/workers/coding-worker/runtime-capabilities.js';
import { codingWorkerSkills, createCodingWorkerSkillCapabilityBlock } from '../../../engine/workers/coding-worker/skills.js';
import { createCodingCapabilityAuthoringTools } from '../../../engine/workers/coding-worker/capability-authoring/capability-authoring-tools.js';
import { createSharedCodingApprovalService } from '../../../engine/approvals/shared-approval-service.js';
import { createCodingWorkerInternalSubagents } from '../../../engine/workers/coding-worker/subagents/index.js';
import { createCodingCodeIntelligenceTools } from '../../../engine/workers/coding-worker/tools/code-intelligence/index.js';
import { createCodingGitTools } from '../../../engine/workers/coding-worker/tools/coding-git-tools.js';
import { createCodingPlanningTools } from '../../../engine/workers/coding-worker/tools/coding-planning-tools.js';
import { createCodingTaskMemoryTools } from '../../../engine/workers/coding-worker/tools/coding-task-memory-tools.js';
import { createCodingScheduleTools } from '../../../engine/workers/coding-worker/tools/coding-schedule-tools.js';
import { createCodingRuntimeConfigurationTools } from '../../../engine/workers/coding-worker/tools/coding-runtime-configuration-tools.js';
import { getStructuredMemoryEngine } from '../../../engine/memory/structured-memory-runtime.js';
import { createCodingRepoTools } from '../../../engine/workers/coding-worker/tools/coding-repo-tools.js';
import { createCodingRepoWorkflowTools } from '../../../engine/workers/coding-worker/tools/coding-repo-workflow-tools.js';
import { createCodingWorkerLoopDelegate } from '../../../engine/workers/coding-worker/workflow/loop.js';
import type { CodingWorkspaceTargetInput } from '../../../engine/workers/coding-worker/repo/workspace-target.js';

export const codingWorkerAgentName = 'coding-worker';
export const route: AgentRouteHandler = async (_c, next) => next();

export interface CodingWorkerSubagentOptions extends CodingWorkspaceTargetInput {
  model?: string;
  env?: Record<string, string | undefined>;
  /** Trusted metadata root. Production uses <runtime-root>/coding-worker. */
  stateRoot?: string;
  allowLocalDevFallback?: boolean;
  githubClient?: GitHubClient;
  githubMcp?: CodingWorkerGithubMcp;
  /**
   * Root directory for approval persistence. Must be outside workspaceRoot.
   * Falls back to a sibling of workspaceRoot when omitted.
   */
  approvalRoot?: string;
}

export const codingWorkerInstructions = [
  composeWorkspaceInstructions({
    workspaceDir: resolveWorkspaceDirectory('workers/coding-worker/workspace'),
    title: 'Coding Worker Workspace Instructions',
  }),
  createCodingWorkerRuntimeCapabilityBlock(),
  createCodingWorkerSkillCapabilityBlock(),
  createCodingWorkerLoopCapabilityBlock(),
].join('\n\n');

export function createCodingWorkerLoopCapabilityBlock(): string {
  return `# Lead Loop Contract

The coding-worker lead runs a bounded, approval-gated, Flue-native tool-calling loop:

1. Accept a natural-language coding task scoped to the configured workspace/project/repo.
2. Run triage to classify the task and produce a plan.
3. Run the implementer subagent to produce file edits and file writes.
4. Apply edits only after an explicit file.edit approval record exists.
5. Run the test-debug subagent to verify changes; on failure, request debug edits, apply them after approval, and rerun. If verification still fails, use the coding_plan_replan tool to update the plan with the failure context.
6. Run the code-review subagent; if rejected, use the coding_plan_replan tool to surface the findings and return to implementation, up to the configured replan budget. If rejections persist, pause with a blocked status for human review.
7. If GitHub context is present, run the github subagent to prepare commit/push/PR actions and execute them through the approval-gated git/GitHub tools.
8. Emit public progress events at every checkpoint and persist a loop checkpoint to the task-run store.

Default max turns: 10. The loop returns blocked if it exceeds the turn guard without completing. All mutating side effects (file edits, git commit, push, PR create/update) require an explicit approval record. The model cannot approve its own requests.`;
}

/**
 * Creates the reusable coding worker Flue subagent profile used by the orchestrator.
 */
export async function createCodingWorkerSubagent(options: CodingWorkerSubagentOptions = {}): Promise<AgentProfile> {
  const resolvedOptions = options;
  const workspaceRoot = resolveSubagentWorkspaceRoot(resolvedOptions);
  const stateRoot = resolveCodingWorkerStateRoot(resolvedOptions);
  const approvalRoot = resolveApprovalRoot(resolvedOptions, workspaceRoot);
  if (!approvalRoot) {
    throw new Error('Missing coding-worker approval storage root configuration.');
  }
  await assertApprovalRootOutsideWorkspace(approvalRoot, workspaceRoot);
  const approvalService = createSharedCodingApprovalService({ GOROMBO_APPROVAL_ROOT: approvalRoot });
  const githubMcp = resolvedOptions.githubMcp
    ?? await connectCodingWorkerGithubMcp({ env: resolvedOptions.env });
  const githubClient = resolvedOptions.githubClient ?? githubMcp.client;
  const githubGitEnv = githubMcp.githubGitEnv;
  const executionEnv = withoutGithubCredentials(resolvedOptions.env);
  const runtimeConfigPath = createGoromboRuntimePaths(
    resolveGoromboRuntimeRoot({ env: resolvedOptions.env ?? process.env }),
  ).environmentConfig;

  return defineAgentProfile({
    name: codingWorkerAgentName,
    description:
      'coding worker lead that coordinates worker-local triage, implementation, test/debug, code review, and GitHub subagents.',
    ...(resolvedOptions.model ? { model: resolvedOptions.model } : {}),
    instructions: codingWorkerInstructions,
    tools: [
      ...createCodingRepoTools({
        workspaceRoot,
        targetKind: resolvedOptions.targetKind,
        projectId: resolvedOptions.projectId,
        projectSlug: resolvedOptions.projectSlug,
        projectRelativePath: resolvedOptions.projectRelativePath,
        repoPath: resolvedOptions.repoPath,
        env: executionEnv,
        sessionId: 'coding-worker-profile-tools',
      }),
      ...createCodingCodeIntelligenceTools({
        workspaceRoot,
        targetKind: resolvedOptions.targetKind,
        projectId: resolvedOptions.projectId,
        projectSlug: resolvedOptions.projectSlug,
        projectRelativePath: resolvedOptions.projectRelativePath,
        repoPath: resolvedOptions.repoPath,
        env: executionEnv,
        sessionId: 'coding-worker-code-intelligence-tools',
      }),
      ...createCodingGitTools({
        workspaceRoot,
        targetKind: resolvedOptions.targetKind,
        projectId: resolvedOptions.projectId,
        projectSlug: resolvedOptions.projectSlug,
        projectRelativePath: resolvedOptions.projectRelativePath,
        repoPath: resolvedOptions.repoPath,
        env: executionEnv,
        sessionId: 'coding-worker-git-tools',
        approvalService,
        githubGitEnv,
        githubClient,
      }),
      ...createCodingRepoWorkflowTools({
        workspaceRoot,
        targetKind: resolvedOptions.targetKind,
        projectId: resolvedOptions.projectId,
        projectSlug: resolvedOptions.projectSlug,
        projectRelativePath: resolvedOptions.projectRelativePath,
        repoPath: resolvedOptions.repoPath,
        env: executionEnv,
        sessionId: 'coding-worker-repo-workflow-tools',
        stateRoot,
        approvalService,
        githubGitEnv,
      }),
      ...createCodingGitHubTools({
        workspaceRoot,
        targetKind: resolvedOptions.targetKind,
        projectId: resolvedOptions.projectId,
        projectSlug: resolvedOptions.projectSlug,
        projectRelativePath: resolvedOptions.projectRelativePath,
        repoPath: resolvedOptions.repoPath,
        client: githubClient,
        approvalService,
      }),
      ...githubMcp.readTools,
      ...createCodingPlanningTools(),
      ...createCodingTaskMemoryTools({
        engineLoader: () => getStructuredMemoryEngine(),
        projectId: resolvedOptions.projectId,
        projectSlug: resolvedOptions.projectSlug,
        projectRelativePath: resolvedOptions.projectRelativePath,
        repoPath: resolvedOptions.repoPath,
        workspaceRoot,
        stateRoot,
        approvalService,
      }),
      ...createCodingScheduleTools({
        projectId: resolvedOptions.projectId,
      }),
      ...createCodingRuntimeConfigurationTools({
        configPath: runtimeConfigPath,
        approvalService,
      }),
      ...createCodingCapabilityAuthoringTools({
        workspaceRoot,
        targetKind: resolvedOptions.targetKind,
        projectId: resolvedOptions.projectId,
        projectSlug: resolvedOptions.projectSlug,
        projectRelativePath: resolvedOptions.projectRelativePath,
        repoPath: resolvedOptions.repoPath,
        approvalService,
      }),
    ],
    skills: codingWorkerSkills,
    subagents: createCodingWorkerInternalSubagents({
      model: resolvedOptions.model,
      workspaceRoot,
      stateRoot,
      targetKind: resolvedOptions.targetKind,
      projectId: resolvedOptions.projectId,
      projectSlug: resolvedOptions.projectSlug,
      projectRelativePath: resolvedOptions.projectRelativePath,
      repoPath: resolvedOptions.repoPath,
      env: executionEnv,
      approvalService,
      githubClient,
    }),
  });
}

export default createAgent(async ({ env }) => {
  const models = configureRuntimeModels(env);
  const selectedModelCard = models.selectedModelCard;
  const runtimeRoot = resolveGoromboRuntimeRoot({ env });
  const runtimePaths = createGoromboRuntimePaths(runtimeRoot);
  const workspaceRoot = resolveCodingWorkerWorkspaceRoot(env);
  mkdirSync(workspaceRoot, { recursive: true });

  return {
    profile: await createCodingWorkerSubagent({
      model: selectedModelCard.specifier,
      workspaceRoot,
      stateRoot: runtimePaths.codingWorkerState,
      approvalRoot: readOptionalEnv(env, 'GOROMBO_APPROVAL_ROOT'),
      env: createCodingWorkerToolEnv(env, runtimeRoot),
    }),
    model: selectedModelCard.specifier,
    cwd: workspaceRoot,
    sandbox: local({
      cwd: workspaceRoot,
      env: {},
    }),
  };
});

export function resolveCodingWorkerWorkspaceRoot(env: Record<string, unknown>): string {
  const runtimeRoot = resolveGoromboRuntimeRoot({ env });
  const configuredRoot =
    readOptionalEnv(env, 'GOROMBO_WORKSPACE_ROOT') ??
    readOptionalEnv(env, 'GOROMBO_CODING_WORKSPACE_ROOT') ??
    readOptionalEnv(env, 'GOROMBO_CODING_REPO_PATH');
  const workspaceRoot = resolveRuntimePath(configuredRoot ?? 'workspace', {
    env,
    runtimeRoot,
  });
  return assertPathInsideRuntimeRoot(
    workspaceRoot,
    runtimeRoot,
    'Coding-worker workspace root',
  );
}

function resolveCodingWorkerStateRoot(options: CodingWorkerSubagentOptions): string {
  const runtimeRoot = resolveGoromboRuntimeRoot({ env: options.env });
  const stateRoot = resolveRuntimePath(options.stateRoot ?? 'coding-worker', {
    env: options.env,
    runtimeRoot,
  });
  return assertPathInsideRuntimeRoot(
    stateRoot,
    runtimeRoot,
    'Coding-worker state root',
  );
}

function resolveApprovalRoot(
  options: CodingWorkerSubagentOptions,
  workspaceRoot: string | undefined,
): string | undefined {
  if (options.approvalRoot) {
    return resolveRuntimePath(options.approvalRoot, { env: options.env });
  }
  return createGoromboRuntimePaths(
    resolveGoromboRuntimeRoot({ env: options.env }),
  ).approvals;
}

async function assertApprovalRootOutsideWorkspace(approvalRoot: string, workspaceRoot: string | undefined): Promise<void> {
  if (!workspaceRoot) {
    return;
  }
  const resolvedApproval = await realpath(resolvePath(approvalRoot)).catch(() => resolvePath(approvalRoot));
  const resolvedWorkspace = await realpath(resolvePath(workspaceRoot)).catch(() => resolvePath(workspaceRoot));
  const workspacePrefix = resolvedWorkspace.endsWith(sep) ? resolvedWorkspace : resolvedWorkspace + sep;
  const isInside = pathsEqual(resolvedApproval, resolvedWorkspace) || resolvedApproval.startsWith(workspacePrefix);
  if (isInside) {
    throw new Error(
      'Approval persistence root must be outside the coding-worker workspace root to prevent model tampering. ' +
        `approvalRoot=${approvalRoot} workspaceRoot=${workspaceRoot}`,
    );
  }
}

function pathsEqual(left: string, right: string): boolean {
  if (process.platform === 'win32' || process.platform === 'darwin') {
    return left.toLowerCase() === right.toLowerCase();
  }
  return left === right;
}

function resolveSubagentWorkspaceRoot(options: CodingWorkerSubagentOptions): string {
  if (options.workspaceRoot || options.repoPath) {
    return resolveRuntimePath(options.workspaceRoot ?? options.repoPath!, {
      env: options.env,
    });
  }
  if (options.allowLocalDevFallback) {
    return resolveRuntimePath('workspace', { env: options.env });
  }
  throw new Error('Missing coding-worker workspace root configuration.');
}

function createCodingWorkerToolEnv(
  env: Record<string, unknown>,
  runtimeRoot: string,
): Record<string, string | undefined> {
  return {
    GOROMBO_RUNTIME_ROOT: runtimeRoot,
    GITHUB_PERSONAL_ACCESS_TOKEN: readOptionalEnv(env, githubPatEnvironmentKey),
  };
}

function withoutGithubCredentials(
  env: Record<string, string | undefined> | undefined,
): Record<string, string | undefined> | undefined {
  if (!env) return undefined;
  const filtered = { ...env };
  delete filtered.GITHUB_PERSONAL_ACCESS_TOKEN;
  delete filtered.GH_TOKEN;
  delete filtered.GITHUB_TOKEN;
  delete filtered.GH_CONFIG_DIR;
  for (const key of Object.keys(filtered)) {
    if (key.startsWith('GIT_CONFIG_')) {
      delete filtered[key];
    }
  }
  return filtered;
}

export { createCodingWorkerLoopDelegate } from '../../../engine/workers/coding-worker/workflow/loop.js';

function readOptionalEnv(env: Record<string, unknown>, key: string): string | undefined {
  const value = env[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}
