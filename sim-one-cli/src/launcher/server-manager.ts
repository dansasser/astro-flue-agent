import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import {
  createGoromboRuntimePaths,
  resolveGoromboRuntimeRoot,
  resolveRuntimePath,
} from '../../../src/core/config/runtime-root.js';
import { runtimeEnvironmentDefinitions } from '../../../src/core/config/runtime-environment.js';

export interface ServerManagerOptions {
  port?: number;
  serverPath?: string;
}

export interface ServerManagerResult {
  started: boolean;
  pid?: number;
  port: number;
  baseUrl: string;
}

const HEALTH_POLL_INTERVAL_MS = 2000;
const HEALTH_TIMEOUT_MS = 120_000;

export async function ensureServerRunning(options: ServerManagerOptions = {}): Promise<ServerManagerResult> {
  const runtimeRoot = resolveGoromboRuntimeRoot({ modulePath: import.meta.url });
  const port = options.port ?? readGatewayPort(runtimeRoot) ?? 3000;
  const baseUrl = `http://127.0.0.1:${port}`;

  const healthOk = await checkHealth(baseUrl);
  if (healthOk) {
    return { started: false, port, baseUrl };
  }

  const serverPath = resolveServerPath(runtimeRoot, options.serverPath);
  if (!existsSync(serverPath)) {
    console.error(`Agent package not found at ${serverPath}. Run 'sim-one install' first.`);
    process.exit(1);
  }

  const child = startServer(serverPath, port, runtimeRoot);
  serverChild = child;

  try {
    await waitForHealth(baseUrl, child);
  } catch (err) {
    await stopServer(child);
    serverChild = undefined;
    throw err;
  }

  (child as any).__detachLogs?.();

  return { started: true, pid: child.pid ?? undefined, port, baseUrl };
}

export async function stopServer(child: ChildProcess): Promise<void> {
  if (child.exitCode !== null || child.signalCode !== null) return;

  child.kill('SIGTERM');
  const exited = await waitForExit(child, 5000);
  if (exited) return;

  child.kill('SIGKILL');
  await waitForExit(child, 5000);
}

let serverChild: ChildProcess | undefined;

export function setServerChild(child: ChildProcess): void {
  serverChild = child;
}

export async function cleanupServer(): Promise<void> {
  if (serverChild) {
    await stopServer(serverChild);
    serverChild = undefined;
  }
}

function resolveServerPath(runtimeRoot: string, explicitPath?: string): string {
  const configuredPath = explicitPath ?? process.env.SIM_ONE_SERVER_PATH;
  if (configuredPath) {
    return resolveRuntimePath(configuredPath, { runtimeRoot });
  }
  return createGoromboRuntimePaths(runtimeRoot).packagedServer + '/server.mjs';
}

function readGatewayPort(runtimeRoot: string): number | undefined {
  const configPath = createGoromboRuntimePaths(runtimeRoot).config;
  if (!existsSync(configPath)) {
    return undefined;
  }
  try {
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    if (typeof config.gateway?.port === 'number') {
      return config.gateway.port;
    }
  } catch {
  }
  return undefined;
}

function startServer(
  serverPath: string,
  port: number,
  runtimeRoot: string,
): ChildProcess {
  const childEnv = { ...process.env };
  for (const definition of runtimeEnvironmentDefinitions) {
    delete childEnv[definition.key];
    for (const alias of definition.deprecatedAliases ?? []) {
      delete childEnv[alias];
    }
  }
  childEnv.GOROMBO_RUNTIME_ROOT = runtimeRoot;
  childEnv.PORT = String(port);

  const child = spawn(process.execPath, [serverPath], {
    cwd: runtimeRoot,
    env: childEnv,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  child.on('error', (err) => {
    console.error(`Failed to start server: ${err.message}`);
    (child as any).__spawnError = err;
  });

  const stdoutListener = (chunk: Buffer) => { process.stdout.write(chunk); };
  const stderrListener = (chunk: Buffer) => { process.stderr.write(chunk); };
  child.stdout?.on('data', stdoutListener);
  child.stderr?.on('data', stderrListener);

  (child as any).__detachLogs = () => {
    child.stdout?.off('data', stdoutListener);
    child.stderr?.off('data', stderrListener);
  };

  return child;
}

async function checkHealth(baseUrl: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const resp = await fetch(`${baseUrl}/health`, { signal: controller.signal });
    clearTimeout(timeout);
    return resp.ok;
  } catch {
    return false;
  }
}

async function waitForHealth(baseUrl: string, child?: ChildProcess): Promise<void> {
  const deadline = Date.now() + HEALTH_TIMEOUT_MS;

  while (Date.now() < deadline) {
    if (child) {
      const spawnError = (child as any).__spawnError;
      if (spawnError) {
        throw new Error(`Failed to start server: ${spawnError.message}`);
      }
      if (child.exitCode !== null || child.signalCode !== null) {
        throw new Error(`Server exited unexpectedly with code ${child.exitCode} before becoming healthy.`);
      }
    }
    if (await checkHealth(baseUrl)) return;
    await sleep(HEALTH_POLL_INTERVAL_MS);
  }

  throw new Error(`Server did not become healthy within ${HEALTH_TIMEOUT_MS / 1000}s. Check the server output above.`);
}

function waitForExit(child: ChildProcess, timeoutMs: number): Promise<boolean> {
  if (child.exitCode !== null || child.signalCode !== null) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      child.off('exit', onExit);
      resolve(false);
    }, timeoutMs);
    const onExit = () => {
      clearTimeout(timer);
      resolve(true);
    };
    child.once('exit', onExit);
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
