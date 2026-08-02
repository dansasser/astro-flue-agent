import {
  defineMcpConnection,
  type McpConnectionDefinition,
} from '@flue/runtime';

export const BUILTIN_MCP_ASTRO_DOCS_ID = 'astro-docs';
const ASTRO_DOCS_URL = 'https://mcp.docs.astro.build/mcp';

export const astroDocsMcpConnection = defineMcpConnection({
  name: BUILTIN_MCP_ASTRO_DOCS_ID,
  url: ASTRO_DOCS_URL,
  transport: 'streamable-http',
  timeoutMs: 10_000,
  optional: true,
});

export function getBuiltinMcpConnections(): McpConnectionDefinition[] {
  return [astroDocsMcpConnection];
}

export function getBuiltinMcpIds(): string[] {
  return [BUILTIN_MCP_ASTRO_DOCS_ID];
}
