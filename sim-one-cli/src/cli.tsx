import '../../src/core/config/runtime-environment-bootstrap.js';
import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { Command, Option } from 'commander';
import { render } from 'ink';
import React from 'react';
import {
  createGoromboRuntimePaths,
  resolveGoromboRuntimeRoot,
  resolveRuntimePath,
} from '../../src/core/config/runtime-root.js';
import { App } from './App.js';
import { ensureServerRunning, cleanupServer } from './launcher/server-manager.js';
import {
  addSkill,
  listSkills,
  inspectSkill,
  validateSkill,
  enableSkill,
  disableSkill,
  removeSkill,
  updateSkill,
  addTool,
  listTools,
  inspectTool,
  validateTool,
  enableTool,
  disableTool,
  removeTool,
  updateTool,
  addWorker,
  listWorkers,
  inspectWorker,
  validateWorker,
  enableWorker,
  disableWorker,
  removeWorker,
  updateWorker,
  addMcp,
  listMcp,
  inspectMcp,
  validateMcp,
  enableMcp,
  disableMcp,
  removeMcp,
  updateMcp,
} from './commands/index.js';

const program = new Command();

interface ProductTuiOptions {
  port?: string;
  baseUrl?: string;
  session?: string;
  serverPath?: string;
  smokeStartup?: boolean;
  ink?: boolean;
}

program
  .name('sim-one')
  .description('SIM-ONE Alpha — interactive TUI coding interface + capability management.')
  .option('--port <number>', 'server port (when launching TUI)')
  .option('--base-url <url>', 'full base url (overrides --port, when launching TUI)')
  .option('--session <id>', 'agent instance id (when launching TUI)')
  .addOption(new Option('--server-path <path>', 'built SIM-ONE Alpha server.mjs path').hideHelp())
  .addOption(new Option('--smoke-startup', 'start/connect gateway then exit').hideHelp())
  .addOption(new Option('--ink', 'launch the legacy Ink TUI fallback').hideHelp())
  .action(async (opts: ProductTuiOptions) => {
    validateTuiOptions(opts);
    if (opts.ink) {
      await launchInkTui(opts);
      return;
    }
    await launchRatatuiTui(opts);
  });

function validateTuiOptions(opts: ProductTuiOptions): void {
  if (!opts.port) {
    return;
  }
  const port = parseInt(opts.port, 10);
  if (!port || port < 1 || port > 65535 || !/^\d+$/.test(opts.port)) {
    console.error(`Invalid port: ${opts.port}. Must be a number 1-65535.`);
    process.exit(1);
  }
}

async function launchRatatuiTui(opts: ProductTuiOptions): Promise<void> {
  const runtimeRoot = resolveGoromboRuntimeRoot({ modulePath: import.meta.url });
  const tuiPath = resolveRatatuiBinary(runtimeRoot);
  if (!existsSync(tuiPath)) {
    console.error(`Ratatui TUI not found at ${tuiPath}. Run 'pnpm run build:tui:ratatui' first.`);
    process.exit(1);
  }

  const args = ratatuiArgs(opts);
  const command = windowsCommandFileInvocation(tuiPath, args);
  const child = spawn(command.file, command.args, {
    cwd: runtimeRoot,
    env: {
      ...process.env,
      GOROMBO_RUNTIME_ROOT: runtimeRoot,
    },
    stdio: 'inherit',
  });

  const exitCode = await waitForChild(child);
  process.exitCode = exitCode;
}

function windowsCommandFileInvocation(
  executable: string,
  args: string[],
): { file: string; args: string[] } {
  if (process.platform !== 'win32' || !/\.(?:cmd|bat)$/i.test(executable)) {
    return { file: executable, args };
  }
  const commandLine = [executable, ...args].map(quoteWindowsCommandToken).join(' ');
  return {
    file: process.env.ComSpec || process.env.COMSPEC || 'cmd.exe',
    args: ['/d', '/s', '/c', commandLine],
  };
}

function quoteWindowsCommandToken(value: string): string {
  return `"${value.replace(/%/g, '%%').replace(/"/g, '""')}"`;
}

function ratatuiArgs(opts: ProductTuiOptions): string[] {
  const args: string[] = [];
  if (opts.port && !opts.baseUrl) args.push('--port', opts.port);
  if (opts.baseUrl) args.push('--base-url', opts.baseUrl);
  if (opts.session) args.push('--session', opts.session);
  if (opts.serverPath) args.push('--server-path', opts.serverPath);
  if (opts.smokeStartup) args.push('--smoke-startup');
  return args;
}

function resolveRatatuiBinary(runtimeRoot: string): string {
  if (process.env.SIM_ONE_TUI_PATH) {
    return resolveRuntimePath(process.env.SIM_ONE_TUI_PATH, { runtimeRoot });
  }

  const binaryName = process.platform === 'win32' ? 'sim-one-ratatui-tui.exe' : 'sim-one-ratatui-tui';
  return `${createGoromboRuntimePaths(runtimeRoot).packagedTui}/${binaryName}`;
}

function waitForChild(child: ChildProcess): Promise<number> {
  return new Promise((resolveExitCode, reject) => {
    child.once('error', reject);
    child.once('close', (code) => resolveExitCode(code ?? 1));
  });
}

async function launchInkTui(opts: ProductTuiOptions): Promise<void> {
  const session = opts.session ?? 'legacy-ink';

  if (opts.baseUrl) {
    const instance = render(<App baseUrl={opts.baseUrl} session={session} />, {
      exitOnCtrlC: true,
    });
    await instance.waitUntilExit();
    return;
  }

  const port = opts.port ? parseInt(opts.port, 10) : undefined;
  const result = await ensureServerRunning({ port });

  const baseUrl = result.baseUrl;
  const { started } = result;

  try {
    const instance = render(<App baseUrl={baseUrl} session={session} />, {
      exitOnCtrlC: true,
    });
    await instance.waitUntilExit();
  } finally {
    if (started) {
      try {
        await cleanupServer();
      } catch {
      }
    }
  }
}

function addKindCommands(program: Command, kind: 'skill' | 'tool' | 'worker'): void {
  const fns = {
    skill: { add: addSkill, validate: validateSkill, list: listSkills, inspect: inspectSkill, enable: enableSkill, disable: disableSkill, remove: removeSkill, update: updateSkill },
    tool: { add: addTool, validate: validateTool, list: listTools, inspect: inspectTool, enable: enableTool, disable: disableTool, remove: removeTool, update: updateTool },
    worker: { add: addWorker, validate: validateWorker, list: listWorkers, inspect: inspectWorker, enable: enableWorker, disable: disableWorker, remove: removeWorker, update: updateWorker },
  }[kind];

  const cmd = program.command(kind).description(`Manage ${kind}s${kind === 'worker' ? ' (subagents)' : ''}`);

  cmd
    .command('add <source> <id> <name>')
    .description(`Add a ${kind} from a GitHub URL or local directory path`)
    .option('--description <text>', `${kind} description`)
    .option('--enable', `enable the ${kind} immediately`)
    .option('--disable', `add the ${kind} disabled`)
    .option('--version <ver>', 'pin to a specific version or git ref')
    .action((source: string, id: string, name: string, opts: { description?: string; enable?: boolean; disable?: boolean; version?: string }) => {
      if (opts.enable && opts.disable) {
        throw new Error('--enable and --disable cannot be used together.');
      }
      const requestedEnabled =
        kind === 'skill' ? (opts.disable ? false : opts.enable ?? true) : (opts.enable ?? false);
      return fns.add(source, id, name, opts.description ?? '', requestedEnabled, opts.version);
    });

  cmd.command('list').description(`List all ${kind} capabilities`).action(() => fns.list());

  cmd.command('inspect <id>').description(`Inspect a ${kind} capability`).action((id: string) => fns.inspect(id));

  cmd
    .command('validate <source> <id> <name>')
    .description(`Validate a ${kind} source without changing the registry`)
    .option('--description <text>', `${kind} description`)
    .option('--enable', `validate requested ${kind} activation`)
    .option('--disable', `validate the ${kind} as disabled`)
    .option('--version <ver>', 'pin to a specific version or git ref')
    .action((source: string, id: string, name: string, opts: { description?: string; enable?: boolean; disable?: boolean; version?: string }) => {
      if (opts.enable && opts.disable) {
        throw new Error('--enable and --disable cannot be used together.');
      }
      const requestedEnabled =
        kind === 'skill' ? (opts.disable ? false : opts.enable ?? true) : (opts.enable ?? false);
      return fns.validate(source, id, name, opts.description ?? '', requestedEnabled, opts.version);
    });

  cmd.command('enable <id>').description(`Enable a ${kind} capability`).action((id: string) => fns.enable(id));

  cmd.command('disable <id>').description(`Disable a ${kind} capability`).action((id: string) => fns.disable(id));

  cmd.command('remove <id>').description(`Remove a ${kind} capability and delete its files`).action((id: string) => fns.remove(id));

  cmd.command('update <id>').description(`Re-fetch a ${kind} from its source`).action((id: string) => fns.update(id));
}

addKindCommands(program, 'skill');
addKindCommands(program, 'tool');
addKindCommands(program, 'worker');

const mcpCmd = program.command('mcp').description('Manage MCP servers');

mcpCmd
  .command('add <id> <name>')
  .description('Add an MCP server connection')
  .option('--url <url>', 'MCP server endpoint URL')
  .option('--transport <type>', 'transport type (streamable-http or sse)', 'streamable-http')
  .option('--token-env <env>', 'environment variable name containing the auth token')
  .option('--description <text>', 'MCP server description')
  .option('--enable', 'enable the MCP server immediately')
  .action((id: string, name: string, opts: { url?: string; transport?: 'streamable-http' | 'sse'; tokenEnv?: string; description?: string; enable?: boolean }) => {
    if (!opts.url) {
      console.error('Error: --url is required for mcp add');
      process.exit(1);
    }
    return addMcp(id, name, opts.url, opts.description ?? '', opts.transport ?? 'streamable-http', opts.tokenEnv, opts.enable ?? false);
  });

mcpCmd.command('list').description('List all MCP server capabilities').action(() => listMcp());
mcpCmd.command('inspect <id>').description('Inspect an MCP server capability').action((id: string) => inspectMcp(id));
mcpCmd
  .command('validate <id> <name>')
  .description('Validate an MCP server connection without changing the registry')
  .requiredOption('--url <url>', 'MCP server endpoint URL')
  .option('--transport <type>', 'transport type (streamable-http or sse)', 'streamable-http')
  .option('--token-env <env>', 'canonical configuration key containing the auth token')
  .option('--description <text>', 'MCP server description')
  .option('--enable', 'validate requested MCP activation')
  .action((id: string, name: string, opts: { url: string; transport?: 'streamable-http' | 'sse'; tokenEnv?: string; description?: string; enable?: boolean }) => {
    return validateMcp(id, name, opts.url, opts.description ?? '', opts.transport ?? 'streamable-http', opts.tokenEnv, opts.enable ?? false);
  });
mcpCmd.command('enable <id>').description('Enable an MCP server capability').action((id: string) => enableMcp(id));
mcpCmd.command('disable <id>').description('Disable an MCP server capability').action((id: string) => disableMcp(id));
mcpCmd.command('remove <id>').description('Remove an MCP server capability').action((id: string) => removeMcp(id));
mcpCmd
  .command('update <id>')
  .description('Update an MCP server configuration')
  .option('--name <name>', 'MCP server display name')
  .option('--description <text>', 'MCP server description')
  .option('--url <url>', 'MCP server endpoint URL')
  .option('--transport <type>', 'transport type (streamable-http or sse)')
  .option('--token-env <env>', 'canonical configuration key containing the auth token')
  .action((id: string, opts: { name?: string; description?: string; url?: string; transport?: 'streamable-http' | 'sse'; tokenEnv?: string }) => updateMcp(id, opts));

program.parseAsync().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
