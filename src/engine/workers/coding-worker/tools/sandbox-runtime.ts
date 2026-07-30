import type { SessionEnv, ShellResult } from '@flue/runtime';
import { local } from '@flue/runtime/node';
import { execFile } from 'node:child_process';
import {
  existsSync,
  lstatSync,
  readlinkSync,
  realpathSync,
} from 'node:fs';
import { unlink } from 'node:fs/promises';
import {
  dirname,
  isAbsolute,
  join,
  parse,
  relative,
  resolve,
} from 'node:path';
import { homedir } from 'node:os';
import { promisify } from 'node:util';
import {
  assertInsideCodingScope,
  assertInsideWorkspaceRoot,
  normalizeAgentRelativePath,
  resolveCodingWorkspaceTarget,
  type CodingWorkspaceTargetInput,
  type ResolvedCodingWorkspaceTarget,
} from '../../../../engine/workers/coding-worker/repo/workspace-target.js';
import { githubPatFileEnvironmentKey } from '../../../../engine/workers/coding-worker/github/github-pat.js';
import type { CodingWorkspaceTargetKind } from '../../../../engine/workers/coding-worker/types.js';

const execFileAsync = promisify(execFile);
const baselineExecEnvKeys = ['PATH', 'HOME', 'SystemRoot', 'ComSpec'] as const;
const bubblewrapCandidates = ['/usr/bin/bwrap', '/bin/bwrap'] as const;
const sandboxSystemLinks = ['/bin', '/sbin', '/lib', '/lib64'] as const;
const sandboxEtcPaths = [
  '/etc/hosts',
  '/etc/localtime',
  '/etc/nsswitch.conf',
  '/etc/resolv.conf',
  '/etc/ssl',
] as const;
const sandboxCargoHome = '/tmp/cargo-home';

interface RustToolchainMount {
  cargoBin: string;
  cargoHome: string;
  rustupHome: string;
}

export interface CodingSandboxRuntime {
  workspaceRoot: string;
  targetKind: CodingWorkspaceTargetKind;
  projectId?: string;
  projectSlug?: string;
  projectRelativePath: string;
  scopePath: string;
  /**
   * Alias for repository-oriented support modules that operate on the selected scope.
   */
  repoPath: string;
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
  deleteFile(path: string): Promise<void>;
  readdir(path: string): Promise<string[]>;
  mkdir(path: string, options?: { recursive?: boolean }): Promise<void>;
  exists(path: string): Promise<boolean>;
  stat(path: string): Promise<{ isFile: boolean; isDirectory: boolean }>;
  exec(command: string, options?: CodingShellOptions): Promise<ShellResult>;
  execFile(file: string, args: string[], options?: CodingShellOptions): Promise<ShellResult>;
  resolveScopePath(path: string): string;
  resolveRepoPath(path: string): string;
  resolveWorkspacePath(path: string): string;
  readWorkspaceFile(path: string): Promise<string>;
  readdirWorkspace(path: string): Promise<string[]>;
  mkdirWorkspace(path: string, options?: { recursive?: boolean }): Promise<void>;
  existsWorkspace(path: string): Promise<boolean>;
  statWorkspace(path: string): Promise<{ isFile: boolean; isDirectory: boolean }>;
  writeWorkspaceFile(path: string, content: string): Promise<void>;
  deleteWorkspaceFile(path: string): Promise<void>;
}

export interface CodingShellOptions {
  cwd?: string;
  timeoutSeconds?: number;
  env?: Record<string, string>;
  signal?: AbortSignal;
}

export interface CodingSandboxOptions extends CodingWorkspaceTargetInput {
  env?: Record<string, string | undefined>;
  sessionId?: string;
}

export async function createFlueLocalCodingSandbox({
  env,
  sessionId = 'coding-worker-local',
  ...targetInput
}: CodingSandboxOptions): Promise<CodingSandboxRuntime> {
  const target = resolveCodingWorkspaceTarget(targetInput);
  const sessionEnv = await local({ cwd: target.workspaceRoot, env }).createSessionEnv({ id: sessionId });
  return new FlueLocalCodingSandboxRuntime(target, sessionEnv, env);
}

class FlueLocalCodingSandboxRuntime implements CodingSandboxRuntime {
  constructor(
    private readonly target: ResolvedCodingWorkspaceTarget,
    private readonly sessionEnv: SessionEnv,
    private readonly env?: Record<string, string | undefined>,
  ) {}

  get workspaceRoot(): string {
    return this.target.workspaceRoot;
  }

  get targetKind(): CodingWorkspaceTargetKind {
    return this.target.targetKind;
  }

  get projectId(): string | undefined {
    return this.target.projectId;
  }

  get projectSlug(): string | undefined {
    return this.target.projectSlug;
  }

  get projectRelativePath(): string {
    return this.target.projectRelativePath;
  }

  get scopePath(): string {
    return this.target.scopePath;
  }

  get repoPath(): string {
    return this.target.repoPath;
  }

  async readFile(path: string): Promise<string> {
    return this.sessionEnv.readFile(this.resolveScopePath(path));
  }

  async writeFile(path: string, content: string): Promise<void> {
    await this.sessionEnv.writeFile(this.resolveScopePath(path), content);
  }

  async deleteFile(path: string): Promise<void> {
    await unlink(this.resolveScopePath(path));
  }

  async readdir(path: string): Promise<string[]> {
    return this.sessionEnv.readdir(this.resolveScopePath(path));
  }

  async mkdir(path: string, options?: { recursive?: boolean }): Promise<void> {
    await this.sessionEnv.mkdir(this.resolveScopePath(path), options);
  }

  async exists(path: string): Promise<boolean> {
    return this.sessionEnv.exists(this.resolveScopePath(path));
  }

  async stat(path: string): Promise<{ isFile: boolean; isDirectory: boolean }> {
    const stat = await this.sessionEnv.stat(this.resolveScopePath(path));
    return {
      isFile: stat.isFile,
      isDirectory: stat.isDirectory,
    };
  }

  async exec(command: string, options: CodingShellOptions = {}): Promise<ShellResult> {
    return this.runSandboxedProcess(
      ['/bin/sh', '-lc', command],
      options,
    );
  }

  async execFile(file: string, args: string[], options: CodingShellOptions = {}): Promise<ShellResult> {
    return this.runSandboxedProcess([file, ...args], options);
  }

  private async runSandboxedProcess(
    command: string[],
    options: CodingShellOptions,
  ): Promise<ShellResult> {
    const bubblewrapPath = resolveBubblewrapPath();
    if (!bubblewrapPath) {
      return {
        stdout: '',
        stderr:
          'Coding Worker shell isolation is unavailable. SIM-ONE requires Bubblewrap on Linux and fails closed without it.',
        exitCode: 1,
      };
    }

    const cwd = options.cwd
      ? this.resolveScopePath(options.cwd)
      : this.scopePath;
    const sandbox = createBubblewrapCommand({
      workspaceRoot: this.workspaceRoot,
      cwd,
      baseEnv: this.env,
      overrideEnv: options.env,
      command,
    });

    try {
      const result = await execFileAsync(bubblewrapPath, sandbox.args, {
        cwd: this.workspaceRoot,
        env: createBaselineExecEnv(),
        windowsHide: true,
        timeout: options.timeoutSeconds ? options.timeoutSeconds * 1_000 : undefined,
        signal: options.signal,
        encoding: 'utf8',
        maxBuffer: 64 * 1024 * 1024,
      });
      return {
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: 0,
      };
    } catch (error) {
      if (isExecFileError(error)) {
        return {
          stdout: typeof error.stdout === 'string' ? error.stdout : '',
          stderr: typeof error.stderr === 'string' ? error.stderr : String(error.message ?? ''),
          exitCode: typeof error.code === 'number' ? error.code : 1,
        };
      }
      throw error;
    }
  }

  resolveScopePath(path: string): string {
    return assertInsideCodingScope(this.scopePath, path);
  }

  resolveRepoPath(path: string): string {
    return this.resolveScopePath(path);
  }

  resolveWorkspacePath(path: string): string {
    return assertInsideWorkspaceRoot(this.workspaceRoot, path);
  }

  async readWorkspaceFile(path: string): Promise<string> {
    return this.sessionEnv.readFile(this.resolveWorkspacePath(path));
  }

  async readdirWorkspace(path: string): Promise<string[]> {
    return this.sessionEnv.readdir(this.resolveWorkspacePath(path));
  }

  async mkdirWorkspace(path: string, options?: { recursive?: boolean }): Promise<void> {
    await this.sessionEnv.mkdir(this.resolveWorkspacePath(path), options);
  }

  async existsWorkspace(path: string): Promise<boolean> {
    return this.sessionEnv.exists(this.resolveWorkspacePath(path));
  }

  async statWorkspace(path: string): Promise<{ isFile: boolean; isDirectory: boolean }> {
    const stat = await this.sessionEnv.stat(this.resolveWorkspacePath(path));
    return {
      isFile: stat.isFile,
      isDirectory: stat.isDirectory,
    };
  }

  async writeWorkspaceFile(path: string, content: string): Promise<void> {
    await this.sessionEnv.writeFile(this.resolveWorkspacePath(path), content);
  }

  async deleteWorkspaceFile(path: string): Promise<void> {
    await unlink(this.resolveWorkspacePath(path));
  }
}

function createBubblewrapCommand(input: {
  workspaceRoot: string;
  cwd: string;
  baseEnv?: Record<string, string | undefined>;
  overrideEnv?: Record<string, string>;
  command: string[];
}): { args: string[] } {
  const workspaceTarget = resolve(input.workspaceRoot);
  const workspaceSource = realpathSync(workspaceTarget);
  const nodeRoot = dirname(dirname(realpathSync(process.execPath)));
  const rustToolchain = resolveRustToolchainMount();
  const args = [
    '--die-with-parent',
    '--new-session',
    '--unshare-all',
    '--share-net',
    '--cap-drop',
    'ALL',
    '--proc',
    '/proc',
    '--dev',
    '/dev',
    '--tmpfs',
    '/tmp',
    '--ro-bind',
    '/usr',
    '/usr',
  ];

  appendSystemLinks(args);
  appendReadOnlyEtcPaths(args);
  appendMountParentDirectories(args, nodeRoot);
  args.push('--ro-bind', nodeRoot, nodeRoot);
  appendRustToolchainMounts(args, rustToolchain);
  appendMountParentDirectories(args, workspaceTarget);
  args.push('--bind', workspaceSource, workspaceTarget);

  const environment = mergeSandboxEnvironment(
    input.baseEnv,
    input.overrideEnv,
    nodeRoot,
  );
  appendApprovedExternalHelpers(args, environment, workspaceTarget);
  const path = createSandboxPath(nodeRoot, rustToolchain);

  args.push(
    '--chdir',
    input.cwd,
    '--clearenv',
    '--setenv',
    'HOME',
    '/tmp/home',
    '--setenv',
    'TMPDIR',
    '/tmp',
    '--setenv',
    'PATH',
    path,
    '--setenv',
    'LANG',
    'C.UTF-8',
    '--setenv',
    'LC_ALL',
    'C.UTF-8',
    '--dir',
    '/tmp/home',
  );
  if (rustToolchain) {
    args.push(
      '--setenv',
      'CARGO_HOME',
      sandboxCargoHome,
      '--setenv',
      'RUSTUP_HOME',
      rustToolchain.rustupHome,
    );
  }

  for (const [key, value] of Object.entries(environment)) {
    if (
      [
        'HOME',
        'TMPDIR',
        'PATH',
        'LANG',
        'LC_ALL',
        'CARGO_HOME',
        'RUSTUP_HOME',
      ].includes(key)
    ) {
      continue;
    }
    assertSafeEnvironmentEntry(key, value);
    args.push('--setenv', key, value);
  }

  args.push('--', ...input.command);
  return { args };
}

function resolveRustToolchainMount(): RustToolchainMount | undefined {
  const cargoHome = resolve(
    process.env.CARGO_HOME?.trim() || join(homedir(), '.cargo'),
  );
  const rustupHome = resolve(
    process.env.RUSTUP_HOME?.trim() || join(homedir(), '.rustup'),
  );
  const cargoBin = join(cargoHome, 'bin');
  if (
    !existsSync(join(cargoBin, 'cargo'))
    || !existsSync(join(cargoBin, 'rustup'))
    || !existsSync(join(cargoBin, 'wasm-pack'))
    || !existsSync(join(rustupHome, 'toolchains'))
  ) {
    return undefined;
  }
  return { cargoBin, cargoHome, rustupHome };
}

function appendRustToolchainMounts(
  args: string[],
  toolchain: RustToolchainMount | undefined,
): void {
  if (!toolchain) {
    return;
  }
  appendMountParentDirectories(args, toolchain.cargoBin);
  args.push('--ro-bind', toolchain.cargoBin, toolchain.cargoBin);
  appendMountParentDirectories(args, toolchain.rustupHome);
  args.push('--ro-bind', toolchain.rustupHome, toolchain.rustupHome);
  args.push('--dir', sandboxCargoHome);
  for (const cache of ['registry', 'git']) {
    const source = join(toolchain.cargoHome, cache);
    if (existsSync(source)) {
      args.push('--ro-bind', source, join(sandboxCargoHome, cache));
    }
  }
}

function createSandboxPath(
  nodeRoot: string,
  rustToolchain: RustToolchainMount | undefined,
): string {
  return [
    ...(rustToolchain ? [rustToolchain.cargoBin] : []),
    `${nodeRoot}/bin`,
    '/usr/local/bin',
    '/usr/bin',
    '/bin',
  ].join(':');
}

function mergeSandboxEnvironment(
  base: Record<string, string | undefined> | undefined,
  override: Record<string, string> | undefined,
  nodeRoot: string,
): Record<string, string> {
  const merged: Record<string, string> = {
    HOME: '/tmp/home',
    TMPDIR: '/tmp',
    PATH: `${nodeRoot}/bin:/usr/local/bin:/usr/bin:/bin`,
    LANG: 'C.UTF-8',
    LC_ALL: 'C.UTF-8',
  };
  for (const [key, value] of Object.entries(base ?? {})) {
    if (value === undefined) {
      delete merged[key];
    } else {
      merged[key] = value;
    }
  }
  for (const [key, value] of Object.entries(override ?? {})) {
    merged[key] = value;
  }
  return merged;
}

function appendSystemLinks(args: string[]): void {
  for (const path of sandboxSystemLinks) {
    if (!existsSync(path)) {
      continue;
    }
    const stats = lstatSync(path);
    if (stats.isSymbolicLink()) {
      args.push('--symlink', readlinkSync(path), path);
    } else {
      args.push('--ro-bind', path, path);
    }
  }
}

function appendReadOnlyEtcPaths(args: string[]): void {
  args.push('--dir', '/etc');
  for (const path of sandboxEtcPaths) {
    if (existsSync(path)) {
      args.push('--ro-bind', path, path);
    }
  }
}

function appendApprovedExternalHelpers(
  args: string[],
  environment: Record<string, string>,
  workspaceRoot: string,
): void {
  const askpassPath = environment.GIT_ASKPASS;
  if (askpassPath) {
    appendApprovedExternalFile(args, askpassPath, workspaceRoot, true);
  }
  const tokenPath = environment[githubPatFileEnvironmentKey];
  if (tokenPath) {
    appendApprovedExternalFile(args, tokenPath, workspaceRoot, false);
  }
}

function appendApprovedExternalFile(
  args: string[],
  path: string,
  workspaceRoot: string,
  allowSymlink: boolean,
): void {
  if (
    !isAbsolute(path)
    || isInsidePath(workspaceRoot, path)
    || !existsSync(path)
  ) {
    throw new Error('Approved external credential path is invalid.');
  }
  const stats = lstatSync(path);
  if (!stats.isFile() && !(allowSymlink && stats.isSymbolicLink())) {
    throw new Error('Approved external credential path must reference a regular file.');
  }
  appendMountParentDirectories(args, path);
  args.push('--ro-bind', realpathSync(path), path);
}

function appendMountParentDirectories(args: string[], targetPath: string): void {
  const root = parse(targetPath).root;
  const parents: string[] = [];
  let current = dirname(targetPath);
  while (current !== root) {
    parents.push(current);
    current = dirname(current);
  }
  for (const path of parents.reverse()) {
    args.push('--dir', path);
  }
}

function isInsidePath(rootPath: string, candidatePath: string): boolean {
  const rel = relative(resolve(rootPath), resolve(candidatePath));
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel));
}

function assertSafeEnvironmentEntry(key: string, value: string): void {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key) || key.includes('\0')) {
    throw new Error(`Invalid sandbox environment key: ${key}`);
  }
  if (value.includes('\0')) {
    throw new Error(`Sandbox environment value for ${key} contains a null byte.`);
  }
}

function resolveBubblewrapPath(): string | undefined {
  if (process.platform !== 'linux') {
    return undefined;
  }
  return bubblewrapCandidates.find((candidate) => existsSync(candidate));
}

function createBaselineExecEnv(): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = {};
  for (const key of baselineExecEnvKeys) {
    const value = process.env[key];
    if (typeof value === 'string' && value.length > 0) {
      env[key] = value;
    }
  }
  return env;
}

function isExecFileError(error: unknown): error is Error & {
  code?: number | string;
  stdout?: string;
  stderr?: string;
} {
  return Boolean(error && typeof error === 'object' && 'code' in error);
}

export function assertInsideRepo(repoPath: string, path: string): string {
  return assertInsideCodingScope(repoPath, path);
}

export function normalizeRepoRelativePath(repoPath: string, path: string): string {
  const resolvedPath = assertInsideRepo(repoPath, path);
  const relativePath = relative(resolve(repoPath), resolvedPath);
  return normalizeAgentRelativePath(relativePath || '.');
}
