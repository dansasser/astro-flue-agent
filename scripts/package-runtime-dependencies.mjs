import { spawnSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  findExternalDependencyLinks,
  removeExternalDependencyLinks,
} from './portable-node-modules.mjs';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourcePackagePath = join(projectRoot, 'package.json');
const runtimePackageRoot = join(projectRoot, '.gorombo', 'sim-one-alpha');
const serverPath = join(runtimePackageRoot, 'server.mjs');
const runtimeNodeModules = join(runtimePackageRoot, 'node_modules');
const stagingNodeModules = join(
  runtimePackageRoot,
  `.node_modules-${process.pid}-${Date.now()}`,
);
const deployRoot = mkdtempSync(join(tmpdir(), 'sim-one-runtime-deploy-'));

if (!existsSync(serverPath)) {
  throw new Error(
    `${serverPath} does not exist. Run the Flue Node build before packaging runtime dependencies.`,
  );
}

try {
  runPnpmDeploy(deployRoot);

  const deployedNodeModules = join(deployRoot, 'node_modules');
  if (!existsSync(deployedNodeModules)) {
    throw new Error(`pnpm deploy did not create ${deployedNodeModules}.`);
  }

  const removedLinks = removeExternalDependencyLinks(deployedNodeModules);
  for (const link of removedLinks) {
    console.log(
      `[runtime-dependencies] Removed external workspace link ${link.path} -> ${link.target}`,
    );
  }

  mkdirSync(runtimePackageRoot, { recursive: true });
  moveDirectory(deployedNodeModules, stagingNodeModules);
  rmSync(runtimeNodeModules, { recursive: true, force: true });
  renameSync(stagingNodeModules, runtimeNodeModules);
  const externalLinks = findExternalDependencyLinks(runtimeNodeModules);
  if (externalLinks.length > 0) {
    throw new Error(
      `Packaged production dependencies contain links outside ${runtimeNodeModules}: ${externalLinks
        .map((link) => `${link.path} -> ${link.target}`)
        .join(', ')}`,
    );
  }
  writeRuntimePackageManifest();

  console.log(
    `[runtime-dependencies] Packaged production dependencies at ${runtimeNodeModules}`,
  );
} finally {
  rmSync(stagingNodeModules, { recursive: true, force: true });
  rmSync(deployRoot, { recursive: true, force: true });
}

function runPnpmDeploy(target) {
  const args = [
    '--filter=sim-one-alpha',
    '--prod',
    'deploy',
    '--legacy',
    target,
  ];
  const npmExecPath = process.env.npm_execpath;
  const useCurrentPnpm =
    typeof npmExecPath === 'string' &&
    basename(npmExecPath).toLowerCase().includes('pnpm');
  const command = useCurrentPnpm
    ? process.execPath
    : process.platform === 'win32'
      ? 'pnpm.cmd'
      : 'pnpm';
  const commandArgs = useCurrentPnpm ? [npmExecPath, ...args] : args;
  const result = spawnSync(command, commandArgs, {
    cwd: projectRoot,
    env: process.env,
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }
  if (result.signal) {
    throw new Error(`pnpm deploy exited from signal ${result.signal}.`);
  }
  if (result.status !== 0) {
    throw new Error(`pnpm deploy failed with status ${result.status}.`);
  }
}

function moveDirectory(source, destination) {
  rmSync(destination, { recursive: true, force: true });
  try {
    renameSync(source, destination);
  } catch (error) {
    if (!isCrossDeviceRename(error)) {
      throw error;
    }
    cpSync(source, destination, { recursive: true, force: true });
    rmSync(source, { recursive: true, force: true });
  }
}

function writeRuntimePackageManifest() {
  const sourcePackage = JSON.parse(readFileSync(sourcePackagePath, 'utf8'));
  const runtimePackage = {
    name: sourcePackage.name,
    version: sourcePackage.version,
    private: true,
    type: 'module',
    engines: sourcePackage.engines,
    dependencies: sourcePackage.dependencies,
  };
  writeFileSync(
    join(runtimePackageRoot, 'package.json'),
    `${JSON.stringify(runtimePackage, null, 2)}\n`,
  );
}

function isCrossDeviceRename(error) {
  return error instanceof Error && 'code' in error && error.code === 'EXDEV';
}
