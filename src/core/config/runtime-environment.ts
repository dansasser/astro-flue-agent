import {
  chmodSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, resolve } from 'node:path';
import { parseEnv } from 'node:util';
import {
  createGoromboRuntimePaths,
  findSourceProjectRoot,
  isPathInsideRuntimeRoot,
  resolveGoromboRuntimeRoot,
} from './runtime-root.js';

export const runtimeEnvironmentConfigFilename = 'sim-one.config';
export const runtimeEnvironmentConfigExampleFilename = 'sim-one.config.example';

export type RuntimeEnvironmentValueKind =
  | 'string'
  | 'secret'
  | 'positive-integer'
  | 'non-negative-integer'
  | 'boolean'
  | 'csv'
  | 'url'
  | 'path'
  | 'duration'
  | 'enum';

export interface RuntimeEnvironmentOnboarding {
  label: string;
  help: string;
}

export interface RuntimeEnvironmentDefinition {
  key: string;
  subsystem: string;
  kind: RuntimeEnvironmentValueKind;
  description: string;
  requiredWhen: string;
  defaultDescription: string;
  secret: boolean;
  exposure: 'trusted-runtime';
  onboarding: RuntimeEnvironmentOnboarding;
  allowedValues?: readonly string[];
  deprecatedAliases?: readonly string[];
}

export interface RuntimeEnvironmentLoadResult {
  configPath: string;
  configuredKeys: string[];
  deprecatedAliases: string[];
}

export interface RuntimeEnvironmentStatus {
  key: string;
  configured: boolean;
  secret: boolean;
  source: 'sim-one.config';
}

export interface MigrateRuntimeEnvironmentOptions {
  sourcePath: string;
  targetPath: string;
  examplePath: string;
}

export interface MigrateRuntimeEnvironmentResult {
  migratedKeys: string[];
  deprecatedAliases: string[];
  ignoredKeys: string[];
}

export interface UpdateRuntimeEnvironmentFileOptions {
  configPath: string;
  key: string;
  value?: string;
}

export interface ResolveRuntimeEnvironmentConfigOptions {
  env?: Record<string, string | undefined>;
  modulePath?: string | URL;
}

interface DefinitionOptions {
  requiredWhen?: string;
  defaultDescription?: string;
  allowedValues?: readonly string[];
  deprecatedAliases?: readonly string[];
  label?: string;
}

function define(
  key: string,
  subsystem: string,
  kind: RuntimeEnvironmentValueKind,
  description: string,
  options: DefinitionOptions = {},
): RuntimeEnvironmentDefinition {
  return {
    key,
    subsystem,
    kind,
    description,
    requiredWhen: options.requiredWhen ?? 'Optional',
    defaultDescription: options.defaultDescription ?? 'Unset',
    secret: kind === 'secret',
    exposure: 'trusted-runtime',
    onboarding: {
      label: options.label ?? key,
      help: description,
    },
    ...(options.allowedValues ? { allowedValues: options.allowedValues } : {}),
    ...(options.deprecatedAliases
      ? { deprecatedAliases: options.deprecatedAliases }
      : {}),
  };
}

export const runtimeEnvironmentDefinitions: readonly RuntimeEnvironmentDefinition[] = [
  define('API_SECRET', 'gateway', 'secret', 'Authenticates non-loopback gateway clients.', {
    requiredWhen: 'External gateway clients are enabled',
  }),

  define('OLLAMA_API_KEY', 'ollama-cloud', 'secret', 'Primary Ollama Cloud credential.', {
    requiredWhen: 'An Ollama Cloud model or web search is selected',
  }),
  define(
    'OLLAMA_CLOUD_API_KEY',
    'ollama-cloud',
    'secret',
    'Compatibility credential used when OLLAMA_API_KEY is unset.',
    { requiredWhen: 'An Ollama Cloud model is selected and OLLAMA_API_KEY is unset' },
  ),
  define('OLLAMA_CLOUD_BASE_URL', 'ollama-cloud', 'url', 'OpenAI-compatible Ollama Cloud base URL.', {
    defaultDescription: 'https://ollama.com/v1',
  }),
  define('OLLAMA_LOCAL_API_KEY', 'ollama-local', 'secret', 'Optional local Ollama credential.'),
  define('OLLAMA_LOCAL_BASE_URL', 'ollama-local', 'url', 'OpenAI-compatible local Ollama base URL.', {
    defaultDescription: 'http://localhost:11434/v1',
  }),

  define('CODEX_BRAIN_LOCAL_API_KEY', 'codex-brain', 'secret', 'Codex Brain API credential.', {
    requiredWhen: 'The codex-brain model card is selected',
  }),
  define('CODEX_BRAIN_LOCAL_API_URL', 'codex-brain', 'url', 'OpenAI-compatible Codex Brain base URL.', {
    requiredWhen: 'The codex-brain model card is selected',
  }),

  define('GOROMBO_WEB_SEARCH_PROVIDER', 'web-search', 'enum', 'Default web-search provider.', {
    defaultDescription: 'ollama',
    allowedValues: ['ollama'],
  }),
  define('OLLAMA_WEB_SEARCH_BASE_URL', 'web-search', 'url', 'Ollama web-search API base URL.', {
    defaultDescription: 'https://ollama.com',
  }),
  define('OLLAMA_WEB_SEARCH_TIMEOUT_MS', 'web-search', 'positive-integer', 'Web-search request timeout in milliseconds.', {
    defaultDescription: '8000',
    deprecatedAliases: ['GOROMBO_WEB_SEARCH_TIMEOUT_MS'],
  }),
  define('GOROMBO_RAG_MAX_CONTEXT_TOKENS', 'retrieval', 'positive-integer', 'Maximum retrieval context token budget.', {
    defaultDescription: '4000',
  }),
  define('GOROMBO_RAG_WEB_FETCH_TOP_K', 'retrieval', 'non-negative-integer', 'Number of web results to fetch in full.', {
    defaultDescription: '1',
  }),

  define('GOROMBO_RESEARCH_DEPTH', 'research', 'enum', 'Default research depth.', {
    defaultDescription: 'standard',
    allowedValues: ['quick', 'standard', 'deep'],
  }),
  define('GOROMBO_RESEARCH_FRESHNESS', 'research', 'enum', 'Default research freshness policy.', {
    defaultDescription: 'Derived from the request and depth',
    allowedValues: ['fresh', 'recent', 'any'],
  }),
  define('GOROMBO_RESEARCH_MAX_QUERIES', 'research', 'positive-integer', 'Maximum search queries per research run.', {
    defaultDescription: 'Derived from research depth',
  }),
  define('GOROMBO_RESEARCH_MAX_FETCHES', 'research', 'non-negative-integer', 'Maximum full-page fetches per research run.', {
    defaultDescription: 'Derived from research depth',
  }),
  define('GOROMBO_RESEARCH_MAX_CONTEXT_TOKENS', 'research', 'positive-integer', 'Maximum research context token budget.', {
    defaultDescription: 'Derived from research depth',
  }),
  define('GOROMBO_RESEARCH_LIMIT', 'research', 'positive-integer', 'Maximum search results per query.', {
    defaultDescription: 'Derived from research depth',
  }),
  define('GOROMBO_RESEARCH_WEB_FETCH', 'research', 'enum', 'Full-page fetch policy.', {
    defaultDescription: 'Derived from research depth',
    allowedValues: ['auto', 'always', 'never'],
  }),
  define('GOROMBO_RESEARCH_MIN_SOURCES', 'research', 'positive-integer', 'Minimum source target for research.', {
    defaultDescription: 'Derived from research depth',
  }),
  define('GOROMBO_RESEARCH_MAX_ITERATIONS', 'research', 'positive-integer', 'Maximum research refinement iterations.', {
    defaultDescription: 'Derived from research depth',
  }),
  define('GOROMBO_RESEARCH_SEARCH_TTL_MS', 'research', 'non-negative-integer', 'Search-result cache TTL in milliseconds.', {
    defaultDescription: 'Derived from freshness policy',
  }),
  define('GOROMBO_RESEARCH_PAGE_TTL_MS', 'research', 'non-negative-integer', 'Fetched-page cache TTL in milliseconds.', {
    defaultDescription: 'Derived from freshness policy',
  }),
  define('GOROMBO_RESEARCH_CACHE', 'research-cache', 'enum', 'Research cache backend.', {
    defaultDescription: 'sqlite',
    allowedValues: ['sqlite', 'memory'],
  }),
  define('GOROMBO_RESEARCH_CACHE_DB', 'research-cache', 'path', 'Research cache database path within the runtime root.', {
    defaultDescription: 'db/research-cache.sqlite',
  }),

  define('GOROMBO_EMBEDDING_MODEL_PATH', 'embeddings', 'path', 'Bundled embedding model directory override.', {
    defaultDescription: 'Packaged all-MiniLM-L6-v2 model',
  }),
  define('GOROMBO_EMBEDDING_TIMEOUT_MS', 'embeddings', 'positive-integer', 'Embedding request timeout in milliseconds.', {
    defaultDescription: '30000',
  }),

  define('GOROMBO_MEMORY_BACKEND', 'memory', 'enum', 'Structured-memory backend.', {
    defaultDescription: 'sqlite',
    allowedValues: ['sqlite', 'lancedb', 'memory'],
  }),
  define('GOROMBO_MEMORY_SQLITE_PATH', 'memory', 'path', 'Structured-memory SQLite path within the runtime root.', {
    defaultDescription: 'Derived from gorombo.config.json',
  }),
  define('GOROMBO_MEMORY_WASM_MODULE_PATH', 'memory', 'path', 'Rust memory WASM module path within the runtime root.', {
    defaultDescription: 'Packaged gorombo_memory.js',
  }),
  define('GOROMBO_MEMORY_DEFAULT_LIMIT', 'memory', 'positive-integer', 'Default number of memory records returned.', {
    defaultDescription: '10',
  }),
  define('GOROMBO_MEMORY_MAX_CONTEXT_TOKENS', 'memory', 'positive-integer', 'Maximum memory context token budget.', {
    defaultDescription: '1500',
  }),
  define('GOROMBO_MEMORY_RETENTION_DAYS', 'memory', 'non-negative-integer', 'Active memory retention in days.', {
    defaultDescription: '30',
  }),
  define('GOROMBO_MEMORY_ARCHIVE_DELETE_DAYS', 'memory', 'non-negative-integer', 'Archived memory deletion age in days.', {
    defaultDescription: '365',
  }),
  define('GOROMBO_MEMORY_MAX_CHECKLIST_DEPTH', 'memory', 'positive-integer', 'Maximum nested checklist depth.', {
    defaultDescription: '5',
  }),

  define('GOROMBO_SKIP_SCHEDULES', 'schedules', 'boolean', 'Disable schedule startup.', {
    defaultDescription: 'false',
  }),
  define('GOROMBO_SCHEDULES_DATABASE_PATH', 'schedules', 'path', 'Schedule database path within the runtime root.', {
    defaultDescription: 'db/schedules.sqlite',
  }),
  define('GOROMBO_SCHEDULES_MAX_CONCURRENT_RUNS', 'schedules', 'positive-integer', 'Maximum concurrent schedule runs.', {
    defaultDescription: '8',
  }),
  define('GOROMBO_SCHEDULES_KEEP_RUNS', 'schedules', 'non-negative-integer', 'Run-history entries retained per schedule.', {
    defaultDescription: '200',
  }),
  define('GOROMBO_SCHEDULES_MAX_ATTEMPTS', 'schedules', 'positive-integer', 'Maximum attempts per scheduled run.', {
    defaultDescription: '3',
  }),
  define('GOROMBO_SCHEDULES_SHUTDOWN_GRACE_SECONDS', 'schedules', 'non-negative-integer', 'Grace period for schedule shutdown.', {
    defaultDescription: '60',
  }),
  define('GOROMBO_SCHEDULES_PROVIDER_PREFLIGHT', 'schedules', 'boolean', 'Check provider availability before scheduled runs.', {
    defaultDescription: 'true',
  }),
  define('GOROMBO_SCHEDULES_SESSION_RETENTION', 'schedules', 'duration', 'Retention duration for isolated schedule sessions.', {
    defaultDescription: '24h',
  }),

  define('TELEGRAM_BOT_TOKEN', 'telegram', 'secret', 'Telegram bot token.', {
    requiredWhen: 'The Telegram connector is enabled',
  }),
  define('TELEGRAM_WEBHOOK_SECRET_TOKEN', 'telegram', 'secret', 'Telegram webhook verification secret.', {
    requiredWhen: 'The Telegram webhook endpoint is enabled',
  }),
  define('TELEGRAM_APPROVED_USER_IDS', 'telegram', 'csv', 'Telegram user IDs allowed to message the bot.'),
  define('TELEGRAM_ADMIN_USER_IDS', 'telegram', 'csv', 'Telegram user IDs allowed to perform admin actions.'),
  define('TELEGRAM_BOT_USERNAME', 'telegram', 'string', 'Telegram bot username without the at-sign.'),
  define('TELEGRAM_MENTION_PATTERNS', 'telegram', 'csv', 'Additional comma-separated Telegram mention patterns.'),

  define('GITHUB_PERSONAL_ACCESS_TOKEN', 'github', 'secret', 'Fine-grained PAT for the Coding Worker GitHub MCP.', {
    requiredWhen: 'Coding Worker GitHub operations are requested',
  }),

  define('RUNPOD_API_KEY', 'runpod-image', 'secret', 'Runpod API credential.', {
    requiredWhen: 'Runpod image generation is requested',
  }),
  define('RUNPOD_API_BASE_URL', 'runpod-image', 'url', 'Runpod API base URL.', {
    defaultDescription: 'Runpod SDK default',
  }),
  define('RUNPOD_IMAGE_MODELS_PATH', 'runpod-image', 'path', 'Runpod model catalog path within the runtime root.', {
    defaultDescription: 'Packaged image model catalog',
  }),
  define('GOROMBO_IMAGE_OUTPUT_DIR', 'runpod-image', 'path', 'Generated image output directory within the runtime root.', {
    defaultDescription: 'workspace/images',
  }),

  define('GOROMBO_APPROVAL_ROOT', 'approvals', 'path', 'Approval database directory within the runtime root.', {
    defaultDescription: 'approvals',
  }),
  define('GOROMBO_CAPABILITY_DB_PATH', 'capabilities', 'path', 'Capability registry database path within the runtime root.', {
    defaultDescription: 'db/capabilities.sqlite',
  }),
  define('GOROMBO_CAPABILITIES_DIR', 'capabilities', 'path', 'Runtime capability directory within the runtime root.', {
    defaultDescription: 'capabilities',
    deprecatedAliases: ['GOROMBO_CAPABILITY_DIR'],
  }),
  define('GOROMBO_PROTOCOL_DB_PATH', 'protocols', 'path', 'Protocol database path within the runtime root.', {
    defaultDescription: 'db/protocols.sqlite',
  }),
  define('GOROMBO_WORKSPACE_ROOT', 'coding-workspace', 'path', 'Coding Worker workspace root within the runtime root.', {
    defaultDescription: 'workspace',
    deprecatedAliases: ['GOROMBO_CODING_WORKSPACE_ROOT', 'GOROMBO_CODING_REPO_PATH'],
  }),
  define('GOROMBO_KNOWLEDGE_DEFAULT_ACTOR_ID', 'knowledge', 'string', 'Default actor ID for knowledge API requests.', {
    defaultDescription: 'api',
  }),

  define('GOROMBO_MCP_TOKEN', 'mcp', 'secret', 'Primary runtime MCP bearer-token slot.'),
  define('MCP_AUTH_TOKEN', 'mcp', 'secret', 'Compatibility runtime MCP bearer-token slot.'),
  define('MCP_TOKEN', 'mcp', 'secret', 'Compatibility runtime MCP bearer-token slot.'),

  define('SIM_ONE_TUI_LOG_PATH', 'tui', 'path', 'TUI diagnostics log path within the runtime root.', {
    defaultDescription: 'logs/sim-one-ratatui.jsonl',
  }),
];

const definitionByKey = new Map(
  runtimeEnvironmentDefinitions.map((definition) => [definition.key, definition]),
);
const aliasToDefinition = new Map<string, RuntimeEnvironmentDefinition>();
for (const definition of runtimeEnvironmentDefinitions) {
  for (const alias of definition.deprecatedAliases ?? []) {
    aliasToDefinition.set(alias, definition);
  }
}

export function resolveRuntimeEnvironmentConfigPath(
  options: ResolveRuntimeEnvironmentConfigOptions = {},
): string {
  const env = options.env ?? process.env;
  const modulePath = options.modulePath ?? import.meta.url;
  const runtimeRoot = resolveGoromboRuntimeRoot({ env, modulePath });
  const configuredRuntimeRoot =
    typeof env.GOROMBO_RUNTIME_ROOT === 'string' &&
    env.GOROMBO_RUNTIME_ROOT.trim().length > 0;

  if (
    configuredRuntimeRoot ||
    isPathInsideRuntimeRoot(modulePath, runtimeRoot)
  ) {
    return createGoromboRuntimePaths(runtimeRoot).environmentConfig;
  }

  const sourceRoot = findSourceProjectRoot(modulePath);
  if (!sourceRoot) {
    throw new Error(
      'Could not resolve the SIM-ONE source root for sim-one.config.',
    );
  }
  return resolve(sourceRoot, runtimeEnvironmentConfigFilename);
}

export function initializeRuntimeEnvironment(
  options: ResolveRuntimeEnvironmentConfigOptions = {},
): RuntimeEnvironmentLoadResult | undefined {
  const env = options.env ?? process.env;
  if (
    env.GOROMBO_TEST_MODE === '1' ||
    env.NODE_ENV === 'test' ||
    env.SIM_ONE_BUILD_MODE === '1'
  ) {
    return undefined;
  }

  const configPath = resolveRuntimeEnvironmentConfigPath({
    env,
    modulePath: options.modulePath,
  });
  if (!existsSync(configPath)) {
    const examplePath = resolve(
      configPath,
      '..',
      runtimeEnvironmentConfigExampleFilename,
    );
    throw new Error(
      `SIM-ONE runtime configuration is missing at ${configPath}. Create it from ${examplePath}; legacy .env files and inherited owner settings are not production configuration sources.`,
    );
  }

  return applyRuntimeEnvironmentFile(configPath, env);
}

export function migrateRuntimeEnvironmentFile(
  options: MigrateRuntimeEnvironmentOptions,
): MigrateRuntimeEnvironmentResult {
  const source = parseEnv(readFileSync(options.sourcePath, 'utf8'));
  const example = parseEnv(readFileSync(options.examplePath, 'utf8'));
  const values = new Map<string, string>();

  for (const definition of runtimeEnvironmentDefinitions) {
    values.set(definition.key, example[definition.key] ?? '');
  }

  const migratedKeys: string[] = [];
  const deprecatedAliases: string[] = [];
  const ignoredKeys: string[] = [];
  const seen = new Set<string>();

  for (const [inputKey, parsedValue] of Object.entries(source)) {
    const definition = definitionByKey.get(inputKey) ?? aliasToDefinition.get(inputKey);
    if (!definition) {
      ignoredKeys.push(inputKey);
      continue;
    }
    if (seen.has(definition.key)) {
      throw new Error(
        `SIM-ONE runtime configuration key ${definition.key} is configured more than once through canonical or deprecated names.`,
      );
    }
    const value = parsedValue ?? '';
    validateValue(definition, value);
    values.set(definition.key, value);
    seen.add(definition.key);
    migratedKeys.push(definition.key);
    if (inputKey !== definition.key) {
      deprecatedAliases.push(inputKey);
    }
  }

  const contents = `${runtimeEnvironmentDefinitions
    .map((definition) => {
      const value = values.get(definition.key) ?? '';
      return `${definition.key}=${serializeEnvironmentValue(value)}`;
    })
    .join('\n')}\n`;
  const targetPath = resolve(options.targetPath);
  const temporaryPath = `${targetPath}.tmp-${process.pid}-${Date.now()}`;
  mkdirSync(dirname(targetPath), { recursive: true });
  try {
    writeFileSync(temporaryPath, contents, { mode: 0o600, flag: 'wx' });
    renameSync(temporaryPath, targetPath);
    chmodSync(targetPath, 0o600);
  } finally {
    rmSync(temporaryPath, { force: true });
  }

  migratedKeys.sort();
  deprecatedAliases.sort();
  ignoredKeys.sort();
  return { migratedKeys, deprecatedAliases, ignoredKeys };
}

export function applyRuntimeEnvironmentFile(
  configPath: string,
  targetEnv: Record<string, string | undefined> = process.env,
): RuntimeEnvironmentLoadResult {
  assertOwnerOnlyRuntimeConfig(configPath);
  const parsed = parseEnv(readFileSync(configPath, 'utf8'));
  const normalized = new Map<string, string>();
  const deprecatedAliases: string[] = [];

  for (const [inputKey, parsedValue] of Object.entries(parsed)) {
    const definition = definitionByKey.get(inputKey) ?? aliasToDefinition.get(inputKey);
    if (!definition) {
      throw new Error(`Unknown SIM-ONE runtime configuration key: ${inputKey}`);
    }
    if (normalized.has(definition.key)) {
      throw new Error(
        `SIM-ONE runtime configuration key ${definition.key} is configured more than once through canonical or deprecated names.`,
      );
    }
    const value = parsedValue ?? '';
    validateValue(definition, value);
    normalized.set(definition.key, value);
    if (inputKey !== definition.key) {
      deprecatedAliases.push(inputKey);
    }
  }

  for (const definition of runtimeEnvironmentDefinitions) {
    delete targetEnv[definition.key];
    for (const alias of definition.deprecatedAliases ?? []) {
      delete targetEnv[alias];
    }
  }

  const configuredKeys: string[] = [];
  for (const [key, value] of normalized) {
    if (!value.trim()) {
      continue;
    }
    targetEnv[key] = value;
    configuredKeys.push(key);
  }
  configuredKeys.sort();
  deprecatedAliases.sort();

  return { configPath, configuredKeys, deprecatedAliases };
}

export function runtimeEnvironmentStatus(
  result: RuntimeEnvironmentLoadResult,
): RuntimeEnvironmentStatus[] {
  const configured = new Set(result.configuredKeys);
  return runtimeEnvironmentDefinitions.map((definition) => ({
    key: definition.key,
    configured: configured.has(definition.key),
    secret: definition.secret,
    source: 'sim-one.config',
  }));
}

export function inspectRuntimeEnvironmentFile(
  configPath: string,
): RuntimeEnvironmentLoadResult {
  return applyRuntimeEnvironmentFile(configPath, {});
}

export function validateRuntimeEnvironmentValue(
  key: string,
  value: string,
): RuntimeEnvironmentDefinition {
  const definition = definitionByKey.get(key);
  if (!definition) {
    throw new Error(`Unknown SIM-ONE runtime configuration key: ${key}`);
  }
  validateValue(definition, value);
  return definition;
}

export function updateRuntimeEnvironmentFile(
  options: UpdateRuntimeEnvironmentFileOptions,
): RuntimeEnvironmentLoadResult {
  assertOwnerOnlyRuntimeConfig(options.configPath);
  const parsed = parseEnv(readFileSync(options.configPath, 'utf8'));
  const normalized = new Map<string, string>();
  const deprecatedAliases: string[] = [];

  for (const [inputKey, parsedValue] of Object.entries(parsed)) {
    const definition = definitionByKey.get(inputKey) ?? aliasToDefinition.get(inputKey);
    if (!definition) {
      throw new Error(`Unknown SIM-ONE runtime configuration key: ${inputKey}`);
    }
    if (normalized.has(definition.key)) {
      throw new Error(
        `SIM-ONE runtime configuration key ${definition.key} is configured more than once through canonical or deprecated names.`,
      );
    }
    const value = parsedValue ?? '';
    validateValue(definition, value);
    normalized.set(definition.key, value);
    if (inputKey !== definition.key) {
      deprecatedAliases.push(inputKey);
    }
  }

  const definition = validateRuntimeEnvironmentValue(
    options.key,
    options.value ?? '',
  );
  normalized.set(definition.key, options.value ?? '');
  const contents = `${runtimeEnvironmentDefinitions
    .map((entry) => {
      const value = normalized.get(entry.key) ?? '';
      return `${entry.key}=${serializeEnvironmentValue(value)}`;
    })
    .join('\n')}\n`;
  writeOwnerOnlyFile(options.configPath, contents);

  const configuredKeys = [...normalized]
    .filter(([, value]) => value.trim().length > 0)
    .map(([key]) => key)
    .sort();
  deprecatedAliases.sort();
  return {
    configPath: options.configPath,
    configuredKeys,
    deprecatedAliases,
  };
}

function assertOwnerOnlyRuntimeConfig(configPath: string): void {
  const stats = lstatSync(configPath);
  if (!stats.isFile() || stats.isSymbolicLink()) {
    throw new Error(
      `SIM-ONE runtime configuration must be a regular owner-only file: ${configPath}`,
    );
  }
  if (process.platform === 'win32') {
    return;
  }
  const mode = stats.mode & 0o777;
  if (mode !== 0o600) {
    throw new Error(
      `SIM-ONE runtime configuration must use owner-only permissions (mode 0600): ${configPath}`,
    );
  }
  if (
    typeof process.getuid === 'function' &&
    stats.uid !== process.getuid()
  ) {
    throw new Error(
      `SIM-ONE runtime configuration must be owned by the current user: ${configPath}`,
    );
  }
}

function validateValue(
  definition: RuntimeEnvironmentDefinition,
  value: string,
): void {
  if (!value.trim()) {
    return;
  }

  const invalid = (expectation: string): never => {
    throw new Error(
      `SIM-ONE runtime configuration key ${definition.key} must be ${expectation}.`,
    );
  };

  switch (definition.kind) {
    case 'positive-integer':
      if (!/^\d+$/.test(value) || Number(value) < 1) {
        invalid('a positive integer');
      }
      break;
    case 'non-negative-integer':
      if (!/^\d+$/.test(value)) {
        invalid('a non-negative integer');
      }
      break;
    case 'boolean':
      if (!['0', '1', 'false', 'true'].includes(value.toLowerCase())) {
        invalid('one of: true, false, 1, 0');
      }
      break;
    case 'csv':
      if (value.split(',').some((entry) => !entry.trim())) {
        invalid('a comma-separated list without empty entries');
      }
      break;
    case 'url':
      try {
        const url = new URL(value);
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
          invalid('an http or https URL');
        }
      } catch {
        invalid('an http or https URL');
      }
      break;
    case 'duration':
      if (!/^\d+(?:\.\d+)?(?:ms|s|m|h|d)?$/i.test(value)) {
        invalid('a duration such as 500ms, 30m, 24h, or 7d');
      }
      break;
    case 'enum':
      if (!definition.allowedValues?.includes(value)) {
        invalid(`one of: ${definition.allowedValues?.join(', ') ?? ''}`);
      }
      break;
    case 'path':
    case 'secret':
    case 'string':
      break;
  }
}

function serializeEnvironmentValue(value: string): string {
  if (!value) {
    return '';
  }
  if (/^[A-Za-z0-9_./:@,+-]+$/.test(value)) {
    return value;
  }
  return JSON.stringify(value);
}

function writeOwnerOnlyFile(targetFile: string, contents: string): void {
  const targetPath = resolve(targetFile);
  const temporaryPath = `${targetPath}.tmp-${process.pid}-${Date.now()}`;
  mkdirSync(dirname(targetPath), { recursive: true });
  try {
    writeFileSync(temporaryPath, contents, { mode: 0o600, flag: 'wx' });
    renameSync(temporaryPath, targetPath);
    chmodSync(targetPath, 0o600);
  } finally {
    rmSync(temporaryPath, { force: true });
  }
}
