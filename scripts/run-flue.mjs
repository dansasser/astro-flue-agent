import { spawn } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  createSanitizedRuntimeEnvironment,
  selectFlueRuntimeEnvironmentFile,
} from './runtime-configuration-files.mjs';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [command, ...commandArgs] = process.argv.slice(2);

if (!command) {
  throw new Error('Usage: node scripts/run-flue.mjs <build|dev|connect|run> [...args]');
}
if (commandArgs.some((arg) => arg === '--env' || arg.startsWith('--env='))) {
  throw new Error(
    'Do not pass --env directly. SIM-ONE Flue commands use sim-one.config.',
  );
}

const allowExample = command === 'build';
const configPath = selectFlueRuntimeEnvironmentFile({
  sourceRoot: projectRoot,
  allowExample,
});
const env = createSanitizedRuntimeEnvironment({
  sourceRoot: projectRoot,
  env: process.env,
});
if (configPath.endsWith('sim-one.config.example')) {
  env.SIM_ONE_BUILD_MODE = '1';
}

const flueExecutable = join(
  projectRoot,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'flue.cmd' : 'flue',
);
const child = spawn(
  flueExecutable,
  [command, ...commandArgs, '--env', configPath],
  {
    cwd: projectRoot,
    env,
    stdio: 'inherit',
  },
);

child.once('error', (error) => {
  throw error;
});
child.once('close', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exitCode = code ?? 1;
});
