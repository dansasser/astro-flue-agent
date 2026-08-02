import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { promisify } from 'node:util';
import {
  createMcpConnection,
  defineMcpConnection,
  type McpConnection,
  type McpConnectionDefinition,
  type ToolDefinition,
} from '@flue/runtime';
import { runToolForText } from '../../../tools/direct-tool-runner.js';
import type {
  GitHubClient,
  GithubCheckSummary,
  GithubCommentSummary,
  GithubIssueSummary,
  GithubPullRequestSummary,
  GithubReviewThreadSummary,
  GithubWriteSummary,
} from './github-client.js';
import {
  createGithubGitCredentialEnv,
  githubPatFileEnvironmentKey,
  readGithubPat,
} from './github-pat.js';
import {
  githubAnonymousCredentialOptions,
  githubAuthenticatedCredentialEnvironment,
} from '../tools/github-credential-utils.js';

const execFileAsync = promisify(execFile);

export const officialGithubMcpUrl = 'https://api.githubcopilot.com/mcp/';

const readOnlyToolNames = [
  'issue_read',
  'list_issues',
  'pull_request_read',
  'list_pull_requests',
] as const;

const backendToolNames = [
  ...readOnlyToolNames,
  'actions_run_trigger',
  'add_issue_comment',
  'add_comment_to_pending_review',
  'add_reply_to_pull_request_comment',
  'create_pull_request',
  'fork_repository',
  'issue_write',
  'pull_request_review_write',
  'update_pull_request',
] as const;

type GithubMcpConnector = (
  definition: McpConnectionDefinition,
) => Promise<McpConnection>;

export interface CodingWorkerGithubMcpOptions {
  env?: Record<string, unknown>;
  connect?: GithubMcpConnector;
  connection?: McpConnection;
  gitRunner?: GitRunner;
}

export interface CodingWorkerGithubMcp {
  client?: GitHubClient;
  readTools: ToolDefinition[];
  githubGitEnv?: () => Promise<Record<string, string>>;
  unavailableReason?: string;
  close(): Promise<void>;
}

type GitRunner = (
  args: string[],
  options: { cwd: string; env?: Record<string, string> },
) => Promise<{ stdout: string; stderr: string }>;

let defaultConnection:
  | {
      fingerprint: string;
      promise: Promise<McpConnection>;
    }
  | undefined;

export async function connectCodingWorkerGithubMcp(
  options: CodingWorkerGithubMcpOptions = {},
): Promise<CodingWorkerGithubMcp> {
  const env = options.env ?? process.env;
  const token = readGithubPat(env);
  if (!token) {
    return {
      readTools: [],
      async close() {},
    };
  }

  const connection = options.connection
    ?? await connectDefaultGithubMcp(token, options.connect);
  const tools = indexTools(connection.tools);
  const readTools = readOnlyToolNames
    .map((name) => tools.get(adaptedToolName(name)))
    .filter((tool): tool is ToolDefinition => Boolean(tool));

  return {
    client: new McpGitHubClient(tools, {
      gitEnv: () => createGithubGitCredentialEnv(env),
      gitRunner: options.gitRunner,
    }),
    readTools,
    githubGitEnv: () => createGithubGitCredentialEnv(env),
    close: options.connection || options.connect
      ? () => connection.close()
      : async () => {},
  };
}

export class McpGitHubClient implements GitHubClient {
  constructor(
    private readonly tools: ReadonlyMap<string, ToolDefinition>,
    private readonly options: {
      gitEnv?: () => Promise<Record<string, string>>;
      gitRunner?: GitRunner;
    } = {},
  ) {}

  async getIssue(
    owner: string,
    repo: string,
    issueNumber: number,
  ): Promise<GithubIssueSummary> {
    const value = await this.call('issue_read', {
      method: 'get',
      owner,
      repo,
      issue_number: issueNumber,
    });
    return normalizeIssue(value);
  }

  async listIssues(
    owner: string,
    repo: string,
    state?: string,
  ): Promise<GithubIssueSummary[]> {
    const value = await this.call('list_issues', {
      owner,
      repo,
      ...(state ? { state: state.toUpperCase() } : {}),
      perPage: 100,
      fields: ['number', 'title', 'state', 'url'],
    });
    return readArray(value, ['issues', 'items']).map(normalizeIssue);
  }

  async getPullRequest(
    owner: string,
    repo: string,
    pullRequestNumber: number,
  ): Promise<GithubPullRequestSummary> {
    const value = await this.call('pull_request_read', {
      method: 'get',
      owner,
      repo,
      pullNumber: pullRequestNumber,
    });
    return normalizePullRequest(value);
  }

  async listPullRequests(
    owner: string,
    repo: string,
    state?: string,
  ): Promise<GithubPullRequestSummary[]> {
    const value = await this.call('list_pull_requests', {
      owner,
      repo,
      ...(state ? { state: state.toLowerCase() } : {}),
      perPage: 100,
      fields: [
        'number',
        'title',
        'state',
        'html_url',
        'head',
        'base',
        'draft',
      ],
    });
    return readArray(value, ['pullRequests', 'pull_requests', 'items']).map(
      normalizePullRequest,
    );
  }

  async listPullRequestChecks(
    owner: string,
    repo: string,
    pullRequestNumber: number,
  ): Promise<GithubCheckSummary[]> {
    const value = await this.call('pull_request_read', {
      method: 'get_check_runs',
      owner,
      repo,
      pullNumber: pullRequestNumber,
      perPage: 100,
    });
    return readArray(value, ['check_runs', 'checkRuns', 'checks']).map(
      normalizeCheck,
    );
  }

  async listPullRequestComments(
    owner: string,
    repo: string,
    pullRequestNumber: number,
  ): Promise<GithubCommentSummary[]> {
    const value = await this.call('pull_request_read', {
      method: 'get_comments',
      owner,
      repo,
      pullNumber: pullRequestNumber,
      perPage: 100,
    });
    return readArray(value, ['comments', 'items']).map(normalizeComment);
  }

  async listPullRequestReviewThreads(
    owner: string,
    repo: string,
    pullRequestNumber: number,
  ): Promise<GithubReviewThreadSummary[]> {
    const value = await this.call('pull_request_read', {
      method: 'get_review_comments',
      owner,
      repo,
      pullNumber: pullRequestNumber,
      perPage: 100,
    });
    return readArray(value, ['reviewThreads', 'review_threads', 'threads']).map(
      normalizeReviewThread,
    );
  }

  async createBranchFromPullRequest(input: {
    owner: string;
    repo: string;
    pullRequestNumber: number;
    branchName: string;
    cwd?: string;
  }): Promise<GithubWriteSummary> {
    if (!input.cwd) {
      throw new Error('A coding-worker repository scope is required to create a local branch.');
    }
    const repositoryUrl = approvedGithubRepositoryUrl(input.owner, input.repo);
    const ref = `refs/pull/${input.pullRequestNumber}/head`;
    await this.runGitWithAnonymousRetry(
      ['fetch', repositoryUrl, ref],
      input.cwd,
    );
    await this.runGit(['checkout', '-b', input.branchName, 'FETCH_HEAD'], input.cwd);
    return {
      status: 'created',
      branchName: input.branchName,
    };
  }

  async createReviewComment(input: {
    owner: string;
    repo: string;
    pullRequestNumber: number;
    body: string;
    path: string;
    line: number;
    side?: string;
    commitId?: string;
    inReplyTo?: string;
  }): Promise<GithubWriteSummary> {
    if (input.inReplyTo) {
      const commentId = Number(input.inReplyTo);
      if (!Number.isSafeInteger(commentId) || commentId <= 0) {
        throw new Error('GitHub review reply comment id must be a positive integer.');
      }
      const value = await this.call('add_reply_to_pull_request_comment', {
        owner: input.owner,
        repo: input.repo,
        pullNumber: input.pullRequestNumber,
        commentId,
        body: input.body,
      });
      return normalizeWrite(value, 'created');
    }

    await this.call('pull_request_review_write', {
      method: 'create',
      owner: input.owner,
      repo: input.repo,
      pullNumber: input.pullRequestNumber,
      ...(input.commitId ? { commitID: input.commitId } : {}),
    });
    try {
      await this.call('add_comment_to_pending_review', {
        owner: input.owner,
        repo: input.repo,
        pullNumber: input.pullRequestNumber,
        path: input.path,
        line: input.line,
        side: (input.side ?? 'RIGHT').toUpperCase(),
        subjectType: 'LINE',
        body: input.body,
      });
      const value = await this.call('pull_request_review_write', {
        method: 'submit_pending',
        owner: input.owner,
        repo: input.repo,
        pullNumber: input.pullRequestNumber,
        event: 'COMMENT',
      });
      return normalizeWrite(value, 'created');
    } catch (error) {
      await this.call('pull_request_review_write', {
        method: 'delete_pending',
        owner: input.owner,
        repo: input.repo,
        pullNumber: input.pullRequestNumber,
      }).catch(() => undefined);
      throw error;
    }
  }

  async rerunCheck(input: {
    owner: string;
    repo: string;
    runId: string;
    rerunFailedJobs?: boolean;
  }): Promise<GithubWriteSummary> {
    const runId = Number(input.runId);
    if (!Number.isSafeInteger(runId) || runId <= 0) {
      throw new Error('GitHub Actions run id must be a positive integer.');
    }
    const value = await this.call('actions_run_trigger', {
      method: input.rerunFailedJobs ? 'rerun_failed_jobs' : 'rerun_workflow_run',
      owner: input.owner,
      repo: input.repo,
      run_id: runId,
    });
    return {
      ...normalizeWrite(value, 'rerun'),
      runId: input.runId,
    };
  }

  async forkRepository(input: {
    owner: string;
    repo: string;
    organization?: string;
  }): Promise<GithubWriteSummary> {
    const value = await this.call('fork_repository', {
      owner: input.owner,
      repo: input.repo,
      ...(input.organization ? { organization: input.organization } : {}),
    });
    return {
      ...normalizeWrite(value, 'created'),
      forkName: readString(readRecord(value), ['full_name', 'name']),
    };
  }

  async createPullRequest(input: {
    owner: string;
    repo: string;
    title: string;
    body: string;
    base: string;
    head: string;
    draft: boolean;
  }): Promise<GithubWriteSummary> {
    const value = await this.call('create_pull_request', {
      owner: input.owner,
      repo: input.repo,
      title: input.title,
      body: input.body,
      base: input.base,
      head: input.head,
      draft: input.draft,
    });
    return normalizeWrite(value, 'created');
  }

  async updatePullRequest(input: {
    owner: string;
    repo: string;
    pullRequestNumber: number;
    title?: string;
    body?: string;
    base?: string;
  }): Promise<GithubWriteSummary> {
    const value = await this.call('update_pull_request', {
      owner: input.owner,
      repo: input.repo,
      pullNumber: input.pullRequestNumber,
      ...(input.title ? { title: input.title } : {}),
      ...(input.body !== undefined ? { body: input.body } : {}),
      ...(input.base ? { base: input.base } : {}),
    });
    return normalizeWrite(value, 'updated');
  }

  async setPullRequestReady(input: {
    owner: string;
    repo: string;
    pullRequestNumber: number;
    ready: boolean;
  }): Promise<GithubWriteSummary> {
    const value = await this.call('update_pull_request', {
      owner: input.owner,
      repo: input.repo,
      pullNumber: input.pullRequestNumber,
      draft: !input.ready,
    });
    return normalizeWrite(value, 'updated');
  }

  async commentOnPullRequest(input: {
    owner: string;
    repo: string;
    pullRequestNumber: number;
    body: string;
  }): Promise<GithubWriteSummary> {
    const value = await this.call('add_issue_comment', {
      owner: input.owner,
      repo: input.repo,
      issue_number: input.pullRequestNumber,
      body: input.body,
    });
    return normalizeWrite(value, 'created');
  }

  async updateIssue(input: {
    owner: string;
    repo: string;
    issueNumber: number;
    title?: string;
    body?: string;
  }): Promise<GithubWriteSummary> {
    const value = await this.call('issue_write', {
      method: 'update',
      owner: input.owner,
      repo: input.repo,
      issue_number: input.issueNumber,
      ...(input.title ? { title: input.title } : {}),
      ...(input.body !== undefined ? { body: input.body } : {}),
    });
    return normalizeWrite(value, 'updated');
  }

  async updateReviewThread(input: {
    owner: string;
    repo: string;
    pullRequestNumber: number;
    threadId: string;
    commentId?: number;
    replyBody?: string;
    resolve?: boolean;
  }): Promise<GithubWriteSummary> {
    let result: unknown;
    if (input.replyBody) {
      if (!Number.isSafeInteger(input.commentId) || (input.commentId ?? 0) <= 0) {
        throw new Error('A positive review comment id is required to reply to a GitHub review thread.');
      }
      result = await this.call('add_reply_to_pull_request_comment', {
        owner: input.owner,
        repo: input.repo,
        pullNumber: input.pullRequestNumber,
        commentId: input.commentId,
        body: input.replyBody,
      });
    }
    if (input.resolve !== undefined) {
      result = await this.call('pull_request_review_write', {
        method: input.resolve ? 'resolve_thread' : 'unresolve_thread',
        owner: input.owner,
        repo: input.repo,
        pullNumber: input.pullRequestNumber,
        threadId: input.threadId,
      });
    }
    if (result === undefined) {
      throw new Error('GitHub review thread update requires a reply or resolution change.');
    }
    return normalizeWrite(result, 'updated');
  }

  private async call(name: string, args: Record<string, unknown>): Promise<unknown> {
    const tool = this.tools.get(adaptedToolName(name));
    if (!tool) {
      throw new Error(`Official GitHub MCP tool is unavailable: ${name}`);
    }
    return parseMcpToolResult(await runToolForText(tool, args));
  }

  private async runGit(args: string[], cwd: string): Promise<void> {
    const runner = this.options.gitRunner ?? defaultGitRunner;
    await runner(args, {
      cwd,
      env: githubAnonymousCredentialOptions().env,
    });
  }

  private async runGitWithAnonymousRetry(args: string[], cwd: string): Promise<void> {
    const runner = this.options.gitRunner ?? defaultGitRunner;
    const anonymousEnv = githubAnonymousCredentialOptions().env;
    try {
      await runner(args, { cwd, env: anonymousEnv });
      return;
    } catch (anonymousError) {
      if (!this.options.gitEnv) {
        throw anonymousError;
      }
      await runner(args, {
        cwd,
        env: githubAuthenticatedCredentialEnvironment(
          await this.options.gitEnv(),
        ),
      });
    }
  }
}

export function resetGithubMcpConnectionForTest(): void {
  defaultConnection = undefined;
}

async function connectDefaultGithubMcp(
  token: string,
  connector: GithubMcpConnector | undefined,
): Promise<McpConnection> {
  const definition = createOfficialGithubMcpDefinition(token);
  if (connector) {
    try {
      return await connector(definition);
    } catch (error) {
      throw new Error(
        `Official GitHub MCP connection failed: ${safeErrorMessage(error, token)}`,
      );
    }
  }
  const fingerprint = createHash('sha256').update(token).digest('hex');
  if (!defaultConnection || defaultConnection.fingerprint !== fingerprint) {
    defaultConnection = {
      fingerprint,
      promise: createMcpConnection(definition).catch((error: unknown) => {
        defaultConnection = undefined;
        throw new Error(
          `Official GitHub MCP connection failed: ${safeErrorMessage(error, token)}`,
        );
      }),
    };
  }
  return defaultConnection.promise;
}

export function createOfficialGithubMcpDefinition(
  token: string,
): McpConnectionDefinition {
  return defineMcpConnection({
    name: 'github',
    url: officialGithubMcpUrl,
    auth: () => token,
    headers: {
      'X-MCP-Tools': backendToolNames.join(','),
    },
    tools: [...backendToolNames],
    timeoutMs: 60_000,
  });
}

function indexTools(tools: ToolDefinition[]): Map<string, ToolDefinition> {
  return new Map(tools.map((tool) => [tool.name, tool]));
}

function adaptedToolName(name: string): string {
  return `mcp__github__${name}`;
}

function parseMcpToolResult(text: string): unknown {
  const trimmed = text.trim();
  const structuredPrefix = 'Structured content:\n';
  if (trimmed.startsWith(structuredPrefix)) {
    const structured = trimmed.slice(structuredPrefix.length);
    const separator = structured.indexOf('\n\n');
    return JSON.parse(separator >= 0 ? structured.slice(0, separator) : structured);
  }
  try {
    return JSON.parse(trimmed);
  } catch {
    return { text: trimmed };
  }
}

function normalizeIssue(value: unknown): GithubIssueSummary {
  const record = readRecord(value);
  return {
    number: readNumber(record, ['number', 'issue_number']) ?? 0,
    title: readString(record, ['title']) ?? '',
    state: readString(record, ['state']) ?? 'UNKNOWN',
    url: readString(record, ['url', 'html_url']),
  };
}

function normalizePullRequest(value: unknown): GithubPullRequestSummary {
  const record = readRecord(value);
  const head = readRecord(record.head);
  const base = readRecord(record.base);
  return {
    number: readNumber(record, ['number', 'pullNumber']) ?? 0,
    title: readString(record, ['title']) ?? '',
    state: readString(record, ['state']) ?? 'UNKNOWN',
    url: readString(record, ['url', 'html_url']),
    headRef:
      readString(record, ['headRef', 'headRefName', 'head_ref'])
      ?? readString(head, ['ref']),
    baseRef:
      readString(record, ['baseRef', 'baseRefName', 'base_ref'])
      ?? readString(base, ['ref']),
    isDraft: readBoolean(record, ['isDraft', 'draft']),
  };
}

function normalizeCheck(value: unknown): GithubCheckSummary {
  const record = readRecord(value);
  return {
    name: readString(record, ['name']) ?? '',
    status: readString(record, ['status', 'state']) ?? 'UNKNOWN',
    conclusion: readString(record, ['conclusion']),
    detailsUrl: readString(record, ['detailsUrl', 'details_url', 'html_url']),
  };
}

function normalizeComment(value: unknown): GithubCommentSummary {
  const record = readRecord(value);
  const author = readRecord(record.author ?? record.user);
  const htmlUrl = readString(record, ['html_url', 'url']);
  return {
    id: String(
      readString(record, ['id', 'node_id'])
      ?? readNumber(record, ['id'])
      ?? reviewCommentIdFromUrl(htmlUrl)
      ?? '',
    ),
    author:
      readString(record, ['author'])
      ?? readString(author, ['login', 'name']),
    body: readString(record, ['body']) ?? '',
    createdAt: readString(record, ['createdAt', 'created_at']),
    updatedAt: readString(record, ['updatedAt', 'updated_at']),
  };
}

function normalizeReviewThread(value: unknown): GithubReviewThreadSummary {
  const record = readRecord(value);
  const commentValues = readArray(record, ['comments', 'nodes']);
  const firstComment = readRecord(commentValues[0]);
  return {
    id: readString(record, ['id', 'threadId']) ?? '',
    isResolved: readBoolean(record, ['isResolved', 'is_resolved']) ?? false,
    isOutdated: readBoolean(record, ['isOutdated', 'is_outdated']) ?? false,
    path:
      readString(record, ['path'])
      ?? readString(firstComment, ['path']),
    line:
      readNumber(record, ['line'])
      ?? readNumber(firstComment, ['line']),
    originalLine:
      readNumber(record, ['originalLine', 'original_line'])
      ?? readNumber(firstComment, ['originalLine', 'original_line']),
    comments: commentValues.map(normalizeComment),
  };
}

function reviewCommentIdFromUrl(url: string | undefined): string | undefined {
  return url?.match(/#discussion_r(\d+)$/)?.[1];
}

function normalizeWrite(value: unknown, status: string): GithubWriteSummary {
  const record = readRecord(value);
  return {
    status,
    url: readString(record, ['url', 'html_url']),
    id: String(readString(record, ['id', 'node_id']) ?? readNumber(record, ['id']) ?? '') || undefined,
  };
}

function readArray(value: unknown, keys: string[]): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }
  const record = readRecord(value);
  for (const key of keys) {
    const candidate = record[key];
    if (Array.isArray(candidate)) {
      return candidate;
    }
    const nested = readRecord(candidate);
    if (Array.isArray(nested.nodes)) {
      return nested.nodes;
    }
  }
  return [];
}

function readRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function readString(
  record: Record<string, unknown>,
  keys: string[],
): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  }
  return undefined;
}

function readNumber(
  record: Record<string, unknown>,
  keys: string[],
): number | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
  }
  return undefined;
}

function readBoolean(
  record: Record<string, unknown>,
  keys: string[],
): boolean | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'boolean') {
      return value;
    }
  }
  return undefined;
}

async function defaultGitRunner(
  args: string[],
  options: { cwd: string; env?: Record<string, string> },
): Promise<{ stdout: string; stderr: string }> {
  return execFileAsync('git', args, {
    cwd: options.cwd,
    timeout: 120_000,
    env: createGitProcessEnvironment(options.env),
  });
}

export function createGitProcessEnvironment(
  explicitEnv: Record<string, string> | undefined,
  inherited: NodeJS.ProcessEnv = process.env,
): NodeJS.ProcessEnv {
  const environment = { ...inherited };
  for (const key of Object.keys(environment)) {
    if (
      key === 'GITHUB_PERSONAL_ACCESS_TOKEN'
      || key === 'GITHUB_TOKEN'
      || key === 'GH_TOKEN'
      || key === 'GH_CONFIG_DIR'
      || key === 'GIT_ASKPASS'
      || key === githubPatFileEnvironmentKey
      || key.startsWith('GIT_CONFIG_')
    ) {
      delete environment[key];
    }
  }
  const merged = {
    ...environment,
    ...explicitEnv,
  };
  delete merged.GITHUB_PERSONAL_ACCESS_TOKEN;
  delete merged.GITHUB_TOKEN;
  delete merged.GH_TOKEN;
  return merged;
}

function safeErrorMessage(error: unknown, token: string): string {
  const message = error instanceof Error ? error.message : String(error);
  return message.replaceAll(token, '[redacted]');
}

function approvedGithubRepositoryUrl(owner: string, repo: string): string {
  const segmentPattern = /^[A-Za-z0-9_.-]+$/;
  if (
    !segmentPattern.test(owner)
    || !segmentPattern.test(repo)
    || owner === '.'
    || owner === '..'
    || repo === '.'
    || repo === '..'
  ) {
    throw new Error('GitHub owner and repository must be plain path segments.');
  }
  return `https://github.com/${owner}/${repo}.git`;
}
