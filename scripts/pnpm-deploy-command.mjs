import { posix, win32 } from 'node:path';

export function resolvePnpmDeployCommand({
  args,
  npmExecPath,
  packageManager,
  execPath = process.execPath,
  platform = process.platform,
}) {
  const pathApi = platform === 'win32' ? win32 : posix;
  const currentManager = typeof npmExecPath === 'string'
    ? pathApi.basename(npmExecPath).toLowerCase()
    : '';

  if (currentManager.includes('pnpm')) {
    return { command: execPath, args: [npmExecPath, ...args] };
  }

  if (currentManager.includes('npm')) {
    const pnpmVersion = /^pnpm@(.+)$/.exec(packageManager ?? '')?.[1];
    if (!pnpmVersion) {
      throw new Error('package.json must declare packageManager as pnpm@<version>.');
    }
    return {
      command: execPath,
      args: [
        npmExecPath,
        'exec',
        '--yes',
        `--package=pnpm@${pnpmVersion}`,
        '--',
        'pnpm',
        ...args,
      ],
    };
  }

  return {
    command: platform === 'win32' ? 'pnpm.cmd' : 'pnpm',
    args,
  };
}
