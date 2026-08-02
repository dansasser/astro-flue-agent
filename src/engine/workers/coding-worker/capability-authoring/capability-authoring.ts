import { createHash } from 'node:crypto';
import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
} from 'node:fs';
import { isAbsolute, relative, resolve } from 'node:path';
import type { ProtocolBundle } from '../../../../core/types/index.js';
import {
  compileCapabilityProtocolContext,
  type CapabilityProtocolContext,
} from '../../../../engine/capabilities/capability-protocol-context.js';
import {
  scanCapabilityPackage,
  type CapabilityPackageScanFinding,
} from '../../../../engine/capabilities/capability-package-security.js';
import { hasExportedFlueFactory } from '../../../../engine/capabilities/capability-flue-contract.js';
import {
  isSupportedMcpTokenEnvironmentName,
  supportedMcpTokenEnvironmentNames,
} from '../../../../engine/capabilities/mcp-token-env.js';

export type CodingCapabilityAuthoringKind =
  | 'skill'
  | 'tool'
  | 'worker'
  | 'mcp-server'
  | 'mcp-connection';

export type CodingCapabilityManagerKind = 'skill' | 'tool' | 'worker' | 'mcp';

export type CapabilityAuthoringScanFinding = CapabilityPackageScanFinding;

export interface McpConnectionHandoffConfig {
  mcpUrl: string;
  mcpTransport: 'streamable-http' | 'sse';
  mcpTokenEnv?: string;
}

export interface CapabilityAuthoringValidation {
  valid: boolean;
  authoringKind: CodingCapabilityAuthoringKind;
  managerKind: CodingCapabilityManagerKind;
  id: string;
  packagePath: string;
  contentDigest: string;
  checks: string[];
  files: string[];
  requiredConfigurationKeys: string[];
  mcpConnection?: McpConnectionHandoffConfig;
  protocolContext: CapabilityProtocolContext;
  findings: CapabilityAuthoringScanFinding[];
}

export interface CodingCapabilityHandoff {
  authoringKind: CodingCapabilityAuthoringKind;
  kind: CodingCapabilityManagerKind;
  id: string;
  name: string;
  description: string;
  source: 'local';
  sourceRef: string;
  version: string;
  contentDigest: string;
  validationEvidence: string[];
  testEvidence: CapabilityAuthoringTestEvidence;
  requiredConfigurationKeys: string[];
  mcpUrl?: string;
  mcpTransport?: 'streamable-http' | 'sse';
  mcpTokenEnv?: string;
  requestedActivation: 'enabled' | 'disabled';
  operation: 'validate' | 'add' | 'update';
  protocolContext: CapabilityProtocolContext;
}

export interface CapabilityAuthoringTestEvidence {
  status: 'passed';
  contentDigest: string;
  commandDigest: string;
  protocolDigest: string;
  exitCode: 0;
}

export interface ValidateCapabilityPackageInput {
  scopePath: string;
  packagePath: string;
  authoringKind: CodingCapabilityAuthoringKind;
  id: string;
  protocolBundle: ProtocolBundle;
  requiredConfigurationKeys?: string[];
}

export function scaffoldCapabilityFiles(input: {
  authoringKind: CodingCapabilityAuthoringKind;
  id: string;
  name: string;
  description: string;
  requiredConfigurationKeys?: string[];
}): Array<{ path: string; content: string }> {
  const name = singleLine(input.name);
  const description = singleLine(input.description) || `${name} capability.`;
  const configKeys = normalizeConfigurationKeys(input.requiredConfigurationKeys ?? []);

  switch (input.authoringKind) {
    case 'skill':
      return [{
        path: 'SKILL.md',
        content: `---\nname: ${input.id}\ndescription: ${description}\n---\n\n# ${name}\n\nFollow the applicable SIM-ONE protocol directives and use only attached tools.\n`,
      }];
    case 'tool':
      return [{
        path: 'index.mjs',
        content: `import { defineTool } from '@flue/runtime';\nimport * as v from 'valibot';\n\nexport default defineTool({\n  name: '${input.id.replace(/-/g, '_')}',\n  description: '${escapeSingleQuoted(description)}',\n  input: v.object({ input: v.string() }),\n  run: async ({ data: { input } }) => input,\n});\n`,
      }];
    case 'worker':
      return [
        {
          path: 'index.mjs',
          content: `import { defineSubagent } from '@flue/runtime';\n\nfunction WorkerDelegate() {\n  return 'Follow the applicable protocol bundle and return structured evidence.';\n}\n\nexport default defineSubagent({\n  name: '${input.id}',\n  description: '${escapeSingleQuoted(description)}',\n  agent: WorkerDelegate,\n});\n`,
        },
        {
          path: 'workspace/AGENTS.md',
          content: `# ${name}\n\nFollow applicable protocol directives. Use only profile-attached capabilities and return structured evidence.\n`,
        },
      ];
    case 'mcp-server':
      return [
        {
          path: 'package.json',
          content: `${JSON.stringify({
            name: input.id,
            private: true,
            type: 'module',
            dependencies: {
              '@modelcontextprotocol/sdk': '^1.0.0',
            },
          }, null, 2)}\n`,
        },
        {
          path: 'src/index.mjs',
          content: `import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';\nimport { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';\n\nconst server = new McpServer({ name: '${input.id}', version: '0.1.0' });\nserver.registerTool('status', { description: '${escapeSingleQuoted(description)}', inputSchema: {} }, async () => ({ content: [{ type: 'text', text: 'ready' }] }));\nawait server.connect(new StdioServerTransport());\n`,
        },
      ];
    case 'mcp-connection':
      return [{
        path: 'mcp-connection.json',
        content: `${JSON.stringify({
          id: input.id,
          name,
          description,
          endpoint: 'https://replace-with-mcp-endpoint.invalid/mcp',
          transport: 'streamable-http',
          requiredConfigurationKeys: configKeys,
          ...(configKeys[0]
            ? { tokenEnvironmentVariable: configKeys[0] }
            : {}),
        }, null, 2)}\n`,
      }];
  }
}

export function validateCapabilityPackage(
  input: ValidateCapabilityPackageInput,
): CapabilityAuthoringValidation {
  const protocolContext = compileCapabilityProtocolContext(input.protocolBundle);
  const root = resolveInsideScope(input.scopePath, input.packagePath);
  if (!existsSync(root) || !statSync(root).isDirectory()) {
    throw new Error(`Capability package does not exist: ${input.packagePath}`);
  }
  const files = listFiles(root);
  if (files.length === 0) {
    throw new Error(`Capability package is empty: ${input.packagePath}`);
  }
  const relativeFiles = files.map((file) => normalizePath(relative(root, file)));
  const checks = validateKindContract(input.authoringKind, input.id, root);
  const findings = scanCapabilityPackage(root, files);
  if (findings.length > 0) {
    throw new Error(
      `Capability package security scan failed: ${findings.map((finding) => `${finding.path}:${finding.line} ${finding.message}`).join('; ')}`,
    );
  }
  const requiredConfigurationKeys = normalizeConfigurationKeys(
    input.requiredConfigurationKeys ?? readMcpConnectionConfigKeys(input.authoringKind, root),
  );
  const mcpConnection =
    input.authoringKind === 'mcp-connection'
      ? readMcpConnection(root, requiredConfigurationKeys)
      : undefined;

  return {
    valid: true,
    authoringKind: input.authoringKind,
    managerKind: managerKindForAuthoringKind(input.authoringKind),
    id: input.id,
    packagePath: normalizePath(input.packagePath),
    contentDigest: hashFiles(root, files),
    checks: [
      'protocols-routed',
      ...checks,
      'secret-scan',
      'host-path-scan',
      'content-digest',
    ],
    files: relativeFiles,
    requiredConfigurationKeys,
    ...(mcpConnection ? { mcpConnection } : {}),
    protocolContext,
    findings: [],
  };
}

export function createCapabilityHandoff(input: {
  validation: CapabilityAuthoringValidation;
  testEvidence: CapabilityAuthoringTestEvidence;
  name: string;
  description: string;
  sourceRef: string;
  version?: string;
  requestedActivation?: 'enabled' | 'disabled';
  operation?: 'validate' | 'add' | 'update';
}): CodingCapabilityHandoff {
  if (
    input.testEvidence.status !== 'passed' ||
    input.testEvidence.exitCode !== 0 ||
    input.testEvidence.contentDigest !== input.validation.contentDigest
  ) {
    throw new Error('Capability handoff requires passing test evidence for the current content digest.');
  }
  const protocolDigest = createHash('sha256')
    .update(JSON.stringify(input.validation.protocolContext.directives))
    .digest('hex');
  if (input.testEvidence.protocolDigest !== protocolDigest) {
    throw new Error(
      'Capability handoff test evidence does not match the current protocol directives.',
    );
  }
  const requestedActivation =
    input.validation.managerKind === 'skill'
      ? input.requestedActivation ?? 'enabled'
      : 'disabled';
  const operation =
    input.validation.authoringKind === 'mcp-server'
      ? 'validate'
      : input.operation ?? 'add';
  const sourceRef = normalizePortableSourceRef(input.sourceRef);
  return {
    authoringKind: input.validation.authoringKind,
    kind: input.validation.managerKind,
    id: input.validation.id,
    name: singleLine(input.name),
    description: singleLine(input.description),
    source: 'local',
    sourceRef,
    version:
      input.version && input.version !== 'latest'
        ? input.version
        : `sha256:${input.validation.contentDigest}`,
    contentDigest: input.validation.contentDigest,
    validationEvidence: [
      ...input.validation.checks,
      `test-passed:${input.testEvidence.commandDigest}`,
    ],
    testEvidence: input.testEvidence,
    requiredConfigurationKeys: [...input.validation.requiredConfigurationKeys],
    ...(input.validation.mcpConnection ?? {}),
    requestedActivation,
    operation,
    protocolContext: input.validation.protocolContext,
  };
}

function validateKindContract(
  kind: CodingCapabilityAuthoringKind,
  id: string,
  root: string,
): string[] {
  switch (kind) {
    case 'skill': {
      const path = resolve(root, 'SKILL.md');
      const content = requireFile(path, 'Skill packages require SKILL.md.');
      const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!frontmatter) {
        throw new Error('Skill SKILL.md requires frontmatter.');
      }
      if (frontmatter[1].match(/^name:\s*(.+)$/m)?.[1]?.trim() !== id) {
        throw new Error(`Skill frontmatter name must match ${id}.`);
      }
      if (!frontmatter[1].match(/^description:\s*(\S.+)$/m)) {
        throw new Error('Skill frontmatter requires a description.');
      }
      return ['skill-frontmatter', 'skill-name-matches-id'];
    }
    case 'tool': {
      const content = requireFile(resolve(root, 'index.mjs'), 'Tool packages require index.mjs.');
      if (!hasExportedFlueFactory(content, 'defineTool')) {
        throw new Error('Tool index.mjs must export a Flue defineTool(...) definition.');
      }
      return ['tool-index', 'flue-define-tool-export'];
    }
    case 'worker': {
      const content = requireFile(resolve(root, 'index.mjs'), 'Worker packages require index.mjs.');
      if (!hasExportedFlueFactory(content, 'defineSubagent')) {
        throw new Error('Worker index.mjs must export a Flue defineSubagent(...) definition.');
      }
      requireFile(resolve(root, 'workspace', 'AGENTS.md'), 'Worker packages require workspace/AGENTS.md.');
      return ['worker-index', 'flue-subagent-export', 'worker-workspace'];
    }
    case 'mcp-server': {
      const content = requireFile(resolve(root, 'src', 'index.mjs'), 'MCP server packages require src/index.mjs.');
      if (!/\bMcpServer\b/.test(content) || !/\.registerTool\s*\(/.test(content)) {
        throw new Error('MCP server entry must create McpServer and register at least one tool.');
      }
      requireFile(resolve(root, 'package.json'), 'MCP server packages require package.json.');
      return ['mcp-server-entry', 'mcp-server-tool-registration'];
    }
    case 'mcp-connection': {
      readMcpConnection(root);
      return ['mcp-connection-manifest', 'mcp-endpoint', 'mcp-transport'];
    }
  }
}

function readMcpConnection(
  root: string,
  requiredConfigurationKeys?: string[],
): McpConnectionHandoffConfig {
  const content = requireFile(
    resolve(root, 'mcp-connection.json'),
    'MCP connection packages require mcp-connection.json.',
  );
  const parsed = JSON.parse(content) as {
    endpoint?: unknown;
    transport?: unknown;
    tokenEnvironmentVariable?: unknown;
  };
  if (typeof parsed.endpoint !== 'string' || !/^https?:\/\//.test(parsed.endpoint)) {
    throw new Error('MCP connection endpoint must be HTTP(S).');
  }
  const endpoint = new URL(parsed.endpoint);
  if (endpoint.username || endpoint.password) {
    throw new Error('MCP connection endpoint must not contain embedded credentials.');
  }
  if (parsed.transport !== 'streamable-http' && parsed.transport !== 'sse') {
    throw new Error("MCP connection transport must be 'streamable-http' or 'sse'.");
  }

  const tokenEnvironmentVariable =
    typeof parsed.tokenEnvironmentVariable === 'string'
      ? parsed.tokenEnvironmentVariable.trim()
      : undefined;
  if (
    tokenEnvironmentVariable &&
    !/^[A-Z_][A-Z0-9_]*$/.test(tokenEnvironmentVariable)
  ) {
    throw new Error(
      `Invalid canonical configuration key name: ${tokenEnvironmentVariable}`,
    );
  }
  if (
    tokenEnvironmentVariable
    && !isSupportedMcpTokenEnvironmentName(tokenEnvironmentVariable)
  ) {
    throw new Error(
      `MCP token environment variable must use one of: ${supportedMcpTokenEnvironmentNames.join(', ')}.`,
    );
  }
  if (
    tokenEnvironmentVariable &&
    requiredConfigurationKeys &&
    !requiredConfigurationKeys.includes(tokenEnvironmentVariable)
  ) {
    throw new Error(
      'MCP token environment variable must be listed in requiredConfigurationKeys.',
    );
  }

  return {
    mcpUrl: parsed.endpoint,
    mcpTransport: parsed.transport,
    ...(tokenEnvironmentVariable
      ? { mcpTokenEnv: tokenEnvironmentVariable }
      : {}),
  };
}

function readMcpConnectionConfigKeys(
  kind: CodingCapabilityAuthoringKind,
  root: string,
): string[] {
  if (kind !== 'mcp-connection') {
    return [];
  }
  const parsed = JSON.parse(readFileSync(resolve(root, 'mcp-connection.json'), 'utf8')) as {
    requiredConfigurationKeys?: unknown;
  };
  return Array.isArray(parsed.requiredConfigurationKeys)
    ? parsed.requiredConfigurationKeys.map(String)
    : [];
}

function normalizeConfigurationKeys(keys: string[]): string[] {
  const normalized = [...new Set(keys.map((key) => key.trim()).filter(Boolean))].sort();
  for (const key of normalized) {
    if (!/^[A-Z_][A-Z0-9_]*$/.test(key)) {
      throw new Error(`Invalid canonical configuration key name: ${key}`);
    }
  }
  return normalized;
}

export function managerKindForAuthoringKind(
  kind: CodingCapabilityAuthoringKind,
): CodingCapabilityManagerKind {
  return kind === 'mcp-server' || kind === 'mcp-connection' ? 'mcp' : kind;
}

function normalizePortableSourceRef(value: string): string {
  const normalized = normalizePath(value.trim()).replace(/^\.\/+/, '');
  if (!normalized || normalized.startsWith('/') || /^[A-Za-z]:\//.test(normalized) || normalized.includes('../')) {
    throw new Error('Capability handoff sourceRef must be portable and relative to the runtime workspace.');
  }
  return normalized;
}

function listFiles(root: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (['.git', 'node_modules', '.tmp'].includes(entry.name)) {
      continue;
    }
    const path = resolve(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(path));
    } else if (entry.isFile()) {
      files.push(path);
    }
  }
  return files.sort();
}

function hashFiles(root: string, files: string[]): string {
  const hash = createHash('sha256');
  for (const file of files) {
    hash.update(normalizePath(relative(root, file)));
    hash.update('\0');
    hash.update(readFileSync(file));
    hash.update('\0');
  }
  return hash.digest('hex');
}

function requireFile(path: string, message: string): string {
  if (!existsSync(path) || !statSync(path).isFile()) {
    throw new Error(message);
  }
  return readFileSync(path, 'utf8');
}

function singleLine(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function escapeSingleQuoted(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function normalizePath(value: string): string {
  return value.split('\\').join('/');
}

function resolveInsideScope(scopePath: string, packagePath: string): string {
  const root = resolve(scopePath);
  const target = resolve(root, packagePath);
  const relativePath = relative(root, target);
  if (
    !relativePath ||
    relativePath === '..' ||
    relativePath.startsWith('../') ||
    relativePath.startsWith('..\\') ||
    isAbsolute(relativePath)
  ) {
    throw new Error('Capability packagePath must identify a directory inside the selected workspace.');
  }
  return target;
}
