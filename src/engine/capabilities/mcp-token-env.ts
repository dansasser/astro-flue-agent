export const supportedMcpTokenEnvironmentNames = [
  'GOROMBO_MCP_TOKEN',
  'MCP_AUTH_TOKEN',
  'MCP_TOKEN',
] as const;

const supportedMcpTokenEnvironments = new Set<string>(
  supportedMcpTokenEnvironmentNames,
);

export function isSupportedMcpTokenEnvironmentName(
  value: string,
): boolean {
  return supportedMcpTokenEnvironments.has(value);
}
