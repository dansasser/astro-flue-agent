#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const validKinds = new Set(['skill', 'tool', 'worker', 'mcp']);
const [command, kind, ...args] = process.argv.slice(2);

if (!command || ['help', '--help', '-h'].includes(command)) {
  showHelp();
  process.exit(0);
}

if (command === 'list' && !kind) {
  for (const capabilityKind of validKinds) {
    runCli([capabilityKind, 'list']);
  }
  process.exit(0);
}

if (!kind || !validKinds.has(kind)) {
  throw new Error(`Invalid capability kind: ${kind ?? '(missing)'}.`);
}

const cliArgs = translateLegacyArgs(command, kind, args);
runCli(cliArgs);

function translateLegacyArgs(operation, capabilityKind, operationArgs) {
  if (operation === 'add' || operation === 'validate') {
    return capabilityKind === 'mcp'
      ? translateMcpAdd(operation, operationArgs)
      : translateSourceAdd(operation, capabilityKind, operationArgs);
  }
  if (!['list', 'inspect', 'enable', 'disable', 'remove', 'update'].includes(operation)) {
    throw new Error(`Unknown capability operation: ${operation}.`);
  }
  return [capabilityKind, operation, ...operationArgs];
}

function translateSourceAdd(operation, capabilityKind, operationArgs) {
  const [source, id, name, ...rest] = operationArgs;
  if (!source || !id || !name) {
    throw new Error(
      `Usage: capability-admin.mjs ${operation} ${capabilityKind} <source> <id> <name> [description] [options]`,
    );
  }
  const { description, options } = splitDescription(rest);
  return [
    capabilityKind,
    operation,
    source,
    id,
    name,
    ...(description ? ['--description', description] : []),
    ...options,
  ];
}

function translateMcpAdd(operation, operationArgs) {
  const [id, name, ...rest] = operationArgs;
  if (!id || !name) {
    throw new Error(
      `Usage: capability-admin.mjs ${operation} mcp <id> <name> [description] --url <url>`,
    );
  }
  const { description, options } = splitDescription(rest);
  return [
    'mcp',
    operation,
    id,
    name,
    ...(description ? ['--description', description] : []),
    ...options,
  ];
}

function splitDescription(values) {
  if (values.length === 0 || values[0].startsWith('--')) {
    return { description: '', options: values };
  }
  return { description: values[0], options: values.slice(1) };
}

function runCli(cliArgs) {
  const builtCli = resolve('.gorombo/sim-one-cli/cli.js');
  const command = existsSync(builtCli)
    ? { file: process.execPath, args: [builtCli, ...cliArgs] }
    : {
        file: process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm',
        args: ['--filter', 'sim-one-cli', 'run', 'dev', '--', ...cliArgs],
      };
  const result = spawnSync(command.file, command.args, {
    cwd: resolve('.'),
    env: process.env,
    stdio: 'inherit',
  });
  if (result.error) {
    throw result.error;
  }
  if (result.signal) {
    throw new Error(`sim-one capability command exited from signal ${result.signal}.`);
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function showHelp() {
  console.log(`Usage: capability-admin.mjs <operation> <kind> [arguments]

This compatibility command delegates to the product sim-one CLI. Runtime
validation, registry mutation, materialization, rollback, and protocol routing
are owned by the shared capability lifecycle service.

Kinds: skill, tool, worker, mcp
Operations: list, inspect, validate, add, update, enable, disable, remove
`);
}
