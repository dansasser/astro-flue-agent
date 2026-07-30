import type { CodingSandboxRuntime } from './sandbox-runtime.js';
import { githubPatFileEnvironmentKey } from '../github/github-pat.js';

export type GithubRemoteOperation = 'fetch' | 'push';

export async function githubCredentialOptions(
  sandbox: CodingSandboxRuntime,
  remote: string,
  githubGitEnv: (() => Promise<Record<string, string>>) | undefined,
  operation: GithubRemoteOperation = 'fetch',
): Promise<{ env?: Record<string, string> }> {
  const args = [
    'remote',
    'get-url',
    ...(operation === 'push' ? ['--push'] : []),
    '--all',
    remote,
  ];
  const remoteUrls = await sandbox.execFile('git', args, { timeoutSeconds: 30 });
  const urls = remoteUrls.stdout.split(/\r?\n/).map((value) => value.trim()).filter(Boolean);
  if (urls.some(hasEmbeddedUrlCredentials)) {
    throw new Error('Git remote URLs with embedded credentials are not allowed.');
  }
  if (remoteUrls.exitCode !== 0 || urls.length === 0 || !urls.every(isManagedGithubHttpsRemote) || !githubGitEnv) {
    return { env: createNoCredentialGitEnv() };
  }
  const managedEnv = await loadManagedGithubEnv(githubGitEnv);
  return {
    env: managedEnv
      ? githubAuthenticatedCredentialEnvironment(managedEnv)
      : createNoCredentialGitEnv(),
  };
}

export async function githubUrlCredentialOptions(
  remoteUrl: string,
  githubGitEnv: (() => Promise<Record<string, string>>) | undefined,
): Promise<{ env: Record<string, string> }> {
  if (hasEmbeddedUrlCredentials(remoteUrl)) {
    throw new Error('Git remote URLs with embedded credentials are not allowed.');
  }
  if (!githubGitEnv || !isManagedGithubHttpsRemote(remoteUrl)) {
    return { env: createNoCredentialGitEnv() };
  }
  const managedEnv = await loadManagedGithubEnv(githubGitEnv);
  return {
    env: managedEnv
      ? githubAuthenticatedCredentialEnvironment(managedEnv)
      : createNoCredentialGitEnv(),
  };
}

export function githubAnonymousCredentialOptions(): { env: Record<string, string> } {
  return { env: createNoCredentialGitEnv() };
}

export function githubAuthenticatedCredentialEnvironment(
  managedEnv: Record<string, string>,
): Record<string, string> {
  const environment = createNoCredentialGitEnv();
  const askpass = managedEnv.GIT_ASKPASS;
  const tokenFile = managedEnv[githubPatFileEnvironmentKey];
  if (askpass) {
    environment.GIT_ASKPASS = askpass;
  }
  if (tokenFile) {
    environment[githubPatFileEnvironmentKey] = tokenFile;
  }
  return environment;
}

export function isManagedGithubHttpsRemote(remoteUrl: string): boolean {
  try {
    const parsed = new URL(remoteUrl);
    return parsed.protocol === 'https:' &&
      parsed.hostname === 'github.com' &&
      (parsed.port === '' || parsed.port === '443') &&
      !parsed.username &&
      !parsed.password;
  } catch {
    return false;
  }
}

function hasEmbeddedUrlCredentials(remoteUrl: string): boolean {
  try {
    const parsed = new URL(remoteUrl);
    return Boolean(parsed.username || parsed.password);
  } catch {
    return false;
  }
}

function createNoCredentialGitEnv(): Record<string, string> {
  const nullPath = process.platform === 'win32' ? 'NUL' : '/dev/null';
  return {
    GIT_CONFIG_NOSYSTEM: '1',
    GIT_CONFIG_GLOBAL: nullPath,
    GIT_CONFIG_COUNT: '2',
    GIT_CONFIG_KEY_0: 'credential.helper',
    GIT_CONFIG_VALUE_0: '',
    GIT_CONFIG_KEY_1: 'core.hooksPath',
    GIT_CONFIG_VALUE_1: nullPath,
    GIT_ASKPASS: '',
    GIT_TERMINAL_PROMPT: '0',
    [githubPatFileEnvironmentKey]: '',
  };
}

async function loadManagedGithubEnv(
  githubGitEnv: () => Promise<Record<string, string>>,
): Promise<Record<string, string> | undefined> {
  try {
    return await githubGitEnv();
  } catch (error) {
    if (error instanceof Error && error.name === 'GithubAuthenticationUnavailableError') {
      return undefined;
    }
    throw error;
  }
}
