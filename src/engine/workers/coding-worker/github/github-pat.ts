import { chmod, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  createGoromboRuntimePaths,
  resolveGoromboRuntimeRoot,
} from '../../../../core/config/runtime-root.js';

export const githubPatEnvironmentKey = 'GITHUB_PERSONAL_ACCESS_TOKEN';

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

  await mkdir(helperDirectory, { recursive: true, mode: 0o700 });
  await writeFile(helperModule, askpassModule, { mode: 0o700 });
  await chmod(helperModule, 0o700);

  if (process.platform === 'win32') {
    await writeFile(helperCommand, askpassCommand, { mode: 0o700 });
  }

  return {
    GIT_ASKPASS: process.platform === 'win32' ? helperCommand : helperModule,
    GIT_TERMINAL_PROMPT: '0',
    GITHUB_PERSONAL_ACCESS_TOKEN: token,
  };
}

const askpassModule = `#!/usr/bin/env node
const prompt = process.argv.slice(2).join(' ').toLowerCase();
if (prompt.includes('username')) {
  process.stdout.write('x-access-token\\n');
} else if (prompt.includes('password')) {
  process.stdout.write((process.env.GITHUB_PERSONAL_ACCESS_TOKEN || '') + '\\n');
}
`;

const askpassCommand = `@echo off\r
if defined SIM_ONE_NODE (\r
  "%SIM_ONE_NODE%" "%~dp0\\git-askpass.mjs" %*\r
) else (\r
  node "%~dp0\\git-askpass.mjs" %*\r
)\r
`;
