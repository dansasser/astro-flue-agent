import {
  defineMcpConnection,
  type McpConnectionDefinition,
} from '@flue/runtime';
import { isSupportedMcpTokenEnvironmentName } from './mcp-token-env.js';
import type { CapabilityRecord } from '../../engine/capabilities/types.js';

export interface McpBrokerResult {
  connections: McpConnectionDefinition[];
  failures: Array<{ id: string; error: string }>;
}

export function createUserMcpConnections(
  mcpRecords: CapabilityRecord[],
  env: Record<string, unknown> = process.env,
): McpBrokerResult {
  const connections: McpConnectionDefinition[] = [];
  const failures: Array<{ id: string; error: string }> = [];

  for (const record of mcpRecords) {
    const url = record.config.mcpUrl;
    if (!url) {
      failures.push({ id: record.id, error: 'MCP capability is missing mcpUrl.' });
      continue;
    }

    const tokenEnv = record.config.mcpTokenEnv;
    if (tokenEnv && !isSupportedMcpTokenEnvironmentName(tokenEnv)) {
      failures.push({
        id: record.id,
        error: `MCP token env var "${tokenEnv}" is not in the allowlist`,
      });
      continue;
    }

    try {
      connections.push(
        defineMcpConnection({
          name: record.id,
          url,
          transport: record.config.mcpTransport ?? 'streamable-http',
          timeoutMs: 10_000,
          optional: true,
          ...(tokenEnv
            ? {
                auth: () => {
                  const token = readEnv(env, tokenEnv);
                  if (!token) {
                    throw new Error(
                      `MCP credential ${tokenEnv} is not configured for ${record.id}.`,
                    );
                  }
                  return token;
                },
              }
            : {}),
        }),
      );
    } catch (error) {
      failures.push({
        id: record.id,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return { connections, failures };
}

function readEnv(env: Record<string, unknown>, key: string): string | undefined {
  const value = env[key];
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : undefined;
}
