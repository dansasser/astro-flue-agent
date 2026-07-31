import { chmod, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  createGoromboRuntimePaths,
  resolveGoromboRuntimeRoot,
} from '../../../../core/config/runtime-root.js';

export const githubPatEnvironmentKey = 'GITHUB_PERSONAL_ACCESS_TOKEN';
export const githubPatFileEnvironmentKey = 'SIM_ONE_GITHUB_TOKEN_FILE';

export function readGithubPat(
  env: Record<string, unknown> = process.env,
): string | undefined {
  const value = env[githubPatEnvironmentKey];
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

export async function createGithubGitCredentialEnv(
  env: Record<string, unknown> = process.env,
): Promise<Record<string, string>> {
  const token = readGithubPat(env);
  if (!token) {
    const error = new Error(
      `${githubPatEnvironmentKey} is required for authenticated GitHub Git operations.`,
    );
    error.name = 'GithubAuthenticationUnavailableError';
    throw error;
  }

  const runtimePaths = createGoromboRuntimePaths(
    resolveGoromboRuntimeRoot({ env }),
  );
  const helperDirectory = resolve(runtimePaths.auth, 'github');
  const helperModule = resolve(helperDirectory, 'git-askpass.mjs');
  const helperCommand = resolve(helperDirectory, 'git-askpass.cmd');
  const tokenFile = resolve(helperDirectory, 'git-token');

  await mkdir(helperDirectory, { recursive: true, mode: 0o700 });
  await chmod(helperDirectory, 0o700);
  await writeFile(helperModule, askpassModule, { mode: 0o700 });
  await chmod(helperModule, 0o700);
  await writeFile(tokenFile, `${token}\n`, { mode: 0o600 });
  await chmod(tokenFile, 0o600);

  if (process.platform === 'win32') {
    await writeFile(helperCommand, askpassCommand, { mode: 0o700 });
  }

  return {
    GIT_ASKPASS: process.platform === 'win32' ? helperCommand : helperModule,
    GIT_TERMINAL_PROMPT: '0',
    [githubPatFileEnvironmentKey]: tokenFile,
  };
}

const askpassModule = `#!/usr/bin/env node
import { readFileSync } from 'node:fs';
const prompt = process.argv.slice(2).join(' ').toLowerCase();
if (prompt.includes('username')) {
  process.stdout.write('x-access-token\\n');
} else if (prompt.includes('password')) {
  const tokenFile = process.env.SIM_ONE_GITHUB_TOKEN_FILE || '';
  const token = tokenFile ? readFileSync(tokenFile, 'utf8').trim() : '';
  process.stdout.write(token + '\\n');
}
`;

const askpassCommand = `@echo off\r
if defined SIM_ONE_NODE (\r
  "%SIM_ONE_NODE%" "%~dp0\\git-askpass.mjs" %*\r
) else (\r
  node "%~dp0\\git-askpass.mjs" %*\r
)\r
`;
