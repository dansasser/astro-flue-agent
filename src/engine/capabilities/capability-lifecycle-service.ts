import { createHash, randomUUID } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
} from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { isBuiltinName } from '../../engine/capabilities/builtin-registry.js';
import {
  assertSafeCapabilityId,
  resolveCapabilitiesDir,
  resolveCapabilityPath,
} from '../../engine/capabilities/capability-loader.js';
import {
  materializeCapability,
  type MaterializeOptions,
  type MaterializeResult,
} from '../../engine/capabilities/skill-materializer.js';
import type {
  CapabilityConfig,
  CapabilityInstalledBy,
  CapabilityKind,
  CapabilityRecord,
  CapabilitySource,
  CapabilityStore,
} from '../../engine/capabilities/types.js';
import {
  compileCapabilityProtocolContext,
  type CapabilityProtocolContext,
} from '../../engine/capabilities/capability-protocol-context.js';
import type { ProtocolBundle } from '../../core/types/index.js';
import { scanCapabilityPackage } from './capability-package-security.js';
import { hasExportedFlueFactory } from './capability-flue-contract.js';

const sourceBackedKinds = new Set<CapabilityKind>(['skill', 'tool', 'worker']);
const workerWorkspaceFiles = [
  'AGENTS.md',
  'SOUL.md',
  'IDENTITY.md',
  'USER.md',
  'TOOLS.md',
  'MEMORY.md',
  'HEARTBEAT.md',
  'BOOTSTRAP.md',
];

export type CapabilityLifecycleOperation =
  | 'list'
  | 'inspect'
  | 'validate'
  | 'add'
  | 'update'
  | 'enable'
  | 'disable'
  | 'remove';

export type CapabilityActivationState =
  | 'disabled'
  | 'enabled-pending-restart'
  | 'removed-pending-restart';

export interface CapabilityLifecycleProgressEvent {
  type: 'capability.lifecycle.started' | 'capability.lifecycle.validated' | 'capability.lifecycle.completed';
  operation: CapabilityLifecycleOperation;
  kind?: CapabilityKind;
  id?: string;
  stage: 'request' | 'validation' | 'store' | 'materialization' | 'complete';
  status: 'running' | 'completed';
  summary: string;
  timestamp: string;
}

export interface CapabilityValidationResult {
  valid: boolean;
  kind: CapabilityKind;
  id: string;
  checks: string[];
  contentDigest?: string;
  materialization?: MaterializeResult;
}

export interface CapabilityLifecycleResult {
  operation: CapabilityLifecycleOperation;
  records: CapabilityRecord[];
  record?: CapabilityRecord;
  validation: CapabilityValidationResult;
  contentDigest?: string;
  activationState: CapabilityActivationState;
  restartRequired: boolean;
  progress: CapabilityLifecycleProgressEvent[];
  protocolContext?: CapabilityProtocolContext;
}

export interface CapabilityLifecycleAddInput {
  kind: CapabilityKind;
  id: string;
  name: string;
  description: string;
  source: CapabilitySource;
  sourceRef: string;
  version: string | null;
  requestedEnabled: boolean;
  installedBy: CapabilityInstalledBy;
  config?: CapabilityConfig;
}

export interface CapabilityLifecycleUpdateInput {
  kind: CapabilityKind;
  id: string;
  name?: string;
  description?: string;
  source?: CapabilitySource;
  sourceRef?: string;
  version?: string | null;
  config?: CapabilityConfig;
}

export interface CapabilityLifecycleServiceOptions {
  store: CapabilityStore;
  env?: Record<string, unknown>;
  now?: () => string;
  isBuiltin?: (kind: CapabilityKind, id: string) => boolean;
  materialize?: (options: MaterializeOptions) => MaterializeResult;
  promote?: (stagedPath: string, targetPath: string) => void;
  protocolBundle?: ProtocolBundle;
}

interface StagedCapability {
  root: string;
  path: string;
  contentDigest: string;
  materialization: MaterializeResult;
}

export class CapabilityLifecycleService {
  readonly #store: CapabilityStore;
  readonly #env: Record<string, unknown>;
  readonly #now: () => string;
  readonly #isBuiltin: (kind: CapabilityKind, id: string) => boolean;
  readonly #materialize: (options: MaterializeOptions) => MaterializeResult;
  readonly #promote: (stagedPath: string, targetPath: string) => void;
  readonly #protocolContext: CapabilityProtocolContext | undefined;

  constructor(options: CapabilityLifecycleServiceOptions) {
    this.#store = options.store;
    this.#env = options.env ?? process.env;
    this.#now = options.now ?? (() => new Date().toISOString());
    this.#isBuiltin = options.isBuiltin ?? isBuiltinName;
    this.#materialize = options.materialize ?? materializeCapability;
    this.#promote = options.promote ?? promoteStagedDirectory;
    this.#protocolContext = options.protocolBundle
      ? compileCapabilityProtocolContext(options.protocolBundle)
      : undefined;
  }

  list(kind?: CapabilityKind): CapabilityLifecycleResult {
    const progress = this.#start('list', kind);
    const records = this.#store.list(kind ? { kind } : undefined);
    progress.push(this.#completed('list', kind, undefined, `Listed ${records.length} capability record(s).`));
    return {
      operation: 'list',
      records,
      validation: emptyValidation(kind ?? 'skill'),
      activationState: 'disabled',
      restartRequired: false,
      progress,
    };
  }

  inspect(kind: CapabilityKind, id: string): CapabilityLifecycleResult {
    assertSafeCapabilityId(id);
    const progress = this.#start('inspect', kind, id);
    const record = this.#store.get(kind, id);
    progress.push(
      this.#completed(
        'inspect',
        kind,
        id,
        record ? `Inspected ${kind} capability ${id}.` : `No ${kind} capability found for ${id}.`,
      ),
    );
    return {
      operation: 'inspect',
      records: record ? [record] : [],
      ...(record ? { record } : {}),
      validation: emptyValidation(kind, id),
      activationState: record?.enabled ? 'enabled-pending-restart' : 'disabled',
      restartRequired: false,
      progress,
    };
  }

  validate(input: CapabilityLifecycleAddInput): CapabilityLifecycleResult {
    const protocolContext = this.#requireProtocolContext();
    this.#validateIdentity(input);
    const progress = this.#start('validate', input.kind, input.id);
    const record = this.#createRecord(input);
    const validation = this.#validateRecord(record);
    progress.push(this.#validated('validate', input.kind, input.id, validation));
    progress.push(this.#completed('validate', input.kind, input.id, `Validated ${input.kind} ${input.id}.`));
    return {
      operation: 'validate',
      records: [],
      validation,
      contentDigest: validation.contentDigest,
      activationState: input.requestedEnabled ? 'enabled-pending-restart' : 'disabled',
      restartRequired: false,
      progress,
      protocolContext,
    };
  }

  add(input: CapabilityLifecycleAddInput): CapabilityLifecycleResult {
    this.#requireProtocolContext();
    this.#validateIdentity(input);
    this.#assertNoCollision(input.kind, input.id);
    const progress = this.#start('add', input.kind, input.id);
    const record = this.#createRecord({
      ...input,
      requestedEnabled:
        input.kind === 'skill' ? input.requestedEnabled : false,
    });
    const staged = sourceBackedKinds.has(record.kind) ? this.#stage(record) : undefined;
    let inserted = false;
    let promoted = false;
    const targetPath = resolveCapabilityPath(this.#env, record.kind, record.id);

    try {
      const validation = this.#validateRecord(record, staged);
      progress.push(this.#validated('add', record.kind, record.id, validation));
      if (record.enabled && staged) {
        this.#promote(staged.path, targetPath);
        promoted = true;
      }
      this.#store.insertStrict(record);
      inserted = true;
      progress.push(this.#completed('add', record.kind, record.id, `Added ${record.kind} capability ${record.id}.`));
      return this.#mutationResult('add', record, validation, progress);
    } catch (error) {
      if (inserted) {
        this.#store.remove(record.kind, record.id);
      }
      if (promoted) {
        rmSync(targetPath, { recursive: true, force: true });
      }
      throw error;
    } finally {
      if (staged) {
        rmSync(staged.root, { recursive: true, force: true });
      }
    }
  }

  update(input: CapabilityLifecycleUpdateInput): CapabilityLifecycleResult {
    this.#requireProtocolContext();
    assertSafeCapabilityId(input.id);
    const existing = this.#requireRecord(input.kind, input.id);
    const progress = this.#start('update', input.kind, input.id);
    const next: CapabilityRecord = {
      ...existing,
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.source !== undefined ? { source: input.source } : {}),
      ...(input.sourceRef !== undefined ? { sourceRef: input.sourceRef } : {}),
      ...(input.version !== undefined ? { version: input.version } : {}),
      ...(input.config !== undefined ? { config: sanitizeConfig(input.kind, input.config) } : {}),
      enabled: existing.kind === 'skill' ? existing.enabled : false,
      updatedAt: this.#now(),
    };
    this.#validateIdentity({
      ...next,
      requestedEnabled: next.enabled,
    });
    const staged = sourceBackedKinds.has(next.kind) ? this.#stage(next) : undefined;
    const validation = this.#validateRecord(next, staged);
    progress.push(this.#validated('update', next.kind, next.id, validation));

    try {
      if (existing.enabled && !next.enabled && staged) {
        this.#replaceEnabledWithDisabled(existing, next);
      } else if (next.enabled && staged) {
        this.#replaceMaterialized(next, staged.path, () => {
          this.#store.update(next.kind, next.id, next);
        });
      } else {
        this.#store.update(next.kind, next.id, next);
      }
      progress.push(this.#completed('update', next.kind, next.id, `Updated ${next.kind} capability ${next.id}.`));
      return this.#mutationResult('update', next, validation, progress);
    } finally {
      if (staged) {
        rmSync(staged.root, { recursive: true, force: true });
      }
    }
  }

  enable(kind: CapabilityKind, id: string): CapabilityLifecycleResult {
    this.#requireProtocolContext();
    assertSafeCapabilityId(id);
    const existing = this.#requireRecord(kind, id);
    const progress = this.#start('enable', kind, id);
    if (existing.enabled) {
      const validation = this.#validateRecord(existing);
      progress.push(this.#validated('enable', kind, id, validation));
      progress.push(this.#completed('enable', kind, id, `${kind} capability ${id} is already enabled.`));
      return this.#mutationResult('enable', existing, validation, progress);
    }

    const enabled = { ...existing, enabled: true, updatedAt: this.#now() };
    const staged = sourceBackedKinds.has(kind) ? this.#stage(enabled) : undefined;
    const validation = this.#validateRecord(enabled, staged);
    progress.push(this.#validated('enable', kind, id, validation));
    try {
      if (staged) {
        this.#replaceMaterialized(enabled, staged.path, () => {
          this.#store.setEnabled(kind, id, true);
        });
      } else {
        this.#store.setEnabled(kind, id, true);
      }
      progress.push(this.#completed('enable', kind, id, `Enabled ${kind} capability ${id}.`));
      return this.#mutationResult('enable', enabled, validation, progress);
    } finally {
      if (staged) {
        rmSync(staged.root, { recursive: true, force: true });
      }
    }
  }

  disable(kind: CapabilityKind, id: string): CapabilityLifecycleResult {
    this.#requireProtocolContext();
    assertSafeCapabilityId(id);
    const existing = this.#requireRecord(kind, id);
    const progress = this.#start('disable', kind, id);
    const disabled = { ...existing, enabled: false, updatedAt: this.#now() };
    const targetPath = resolveCapabilityPath(this.#env, kind, id);
    const backupPath = `${targetPath}.rollback-${randomUUID()}`;
    let backedUp = false;
    try {
      if (existsSync(targetPath)) {
        renameSync(targetPath, backupPath);
        backedUp = true;
      }
      this.#store.setEnabled(kind, id, false);
      if (backedUp) {
        rmSync(backupPath, { recursive: true, force: true });
      }
      const validation = emptyValidation(kind, id);
      progress.push(this.#completed('disable', kind, id, `Disabled ${kind} capability ${id}.`));
      return this.#mutationResult('disable', disabled, validation, progress);
    } catch (error) {
      if (backedUp && existsSync(backupPath)) {
        mkdirSync(dirname(targetPath), { recursive: true });
        renameSync(backupPath, targetPath);
      }
      throw error;
    }
  }

  remove(kind: CapabilityKind, id: string): CapabilityLifecycleResult {
    const protocolContext = this.#requireProtocolContext();
    assertSafeCapabilityId(id);
    if (this.#isBuiltin(kind, id)) {
      throw new Error(`Cannot remove built-in capability ${kind}:${id}.`);
    }
    this.#requireRecord(kind, id);
    const progress = this.#start('remove', kind, id);
    const targetPath = resolveCapabilityPath(this.#env, kind, id);
    const backupPath = `${targetPath}.rollback-${randomUUID()}`;
    let backedUp = false;
    try {
      if (existsSync(targetPath)) {
        renameSync(targetPath, backupPath);
        backedUp = true;
      }
      if (!this.#store.remove(kind, id)) {
        throw new Error(`Failed to remove ${kind} capability ${id} from the registry.`);
      }
      if (backedUp) {
        rmSync(backupPath, { recursive: true, force: true });
      }
      progress.push(this.#completed('remove', kind, id, `Removed ${kind} capability ${id}.`));
      return {
        operation: 'remove',
        records: [],
        validation: emptyValidation(kind, id),
        activationState: 'removed-pending-restart',
        restartRequired: true,
        progress,
        protocolContext,
      };
    } catch (error) {
      if (backedUp && existsSync(backupPath)) {
        mkdirSync(dirname(targetPath), { recursive: true });
        renameSync(backupPath, targetPath);
      }
      throw error;
    }
  }

  #createRecord(input: CapabilityLifecycleAddInput): CapabilityRecord {
    const now = this.#now();
    return {
      id: input.id,
      kind: input.kind,
      name: input.name.trim(),
      description: input.description.trim(),
      source: input.source,
      sourceRef: input.sourceRef.trim(),
      version: normalizeVersion(input.version),
      enabled: input.requestedEnabled,
      config: sanitizeConfig(input.kind, input.config ?? {}),
      installedAt: now,
      updatedAt: now,
      installedBy: input.installedBy,
    };
  }

  #validateIdentity(input: CapabilityLifecycleAddInput): void {
    assertSafeCapabilityId(input.id);
    if (!input.name.trim()) {
      throw new Error('Capability name is required.');
    }
    if (input.kind !== 'mcp' && !input.sourceRef.trim()) {
      throw new Error('Capability source reference is required.');
    }
    sanitizeConfig(input.kind, input.config ?? {});
  }

  #assertNoCollision(kind: CapabilityKind, id: string): void {
    if (this.#isBuiltin(kind, id)) {
      throw new Error(`Name '${id}' conflicts with a built-in capability. Choose a different name.`);
    }
    const existing = this.#store.list().find((record) => record.id === id);
    if (existing) {
      throw new Error(
        `Name '${id}' already exists as a ${existing.kind} capability. Choose a different name.`,
      );
    }
  }

  #requireRecord(kind: CapabilityKind, id: string): CapabilityRecord {
    const record = this.#store.get(kind, id);
    if (!record) {
      throw new Error(`No ${kind} capability found for ${id}.`);
    }
    return record;
  }

  #stage(record: CapabilityRecord): StagedCapability {
    const stagingRoot = resolve(
      resolveCapabilitiesDir(this.#env),
      '.staging',
      `${record.kind}-${record.id}-${randomUUID()}`,
    );
    const stagingCapabilitiesRoot = resolve(stagingRoot, 'capabilities');
    const stagingEnv = {
      ...this.#env,
      GOROMBO_CAPABILITIES_DIR: stagingCapabilitiesRoot,
    };
    const stagedRecord = { ...record, enabled: true };
    try {
      const materialization = this.#materialize({
        record: stagedRecord,
        env: stagingEnv,
      });
      const path = resolveCapabilityPath(stagingEnv, record.kind, record.id);
      if (!existsSync(path)) {
        throw new Error(`Capability source did not materialize for ${record.kind} ${record.id}.`);
      }
      return {
        root: stagingRoot,
        path,
        contentDigest: hashDirectory(path),
        materialization,
      };
    } catch (error) {
      rmSync(stagingRoot, { recursive: true, force: true });
      throw error;
    }
  }

  #validateRecord(record: CapabilityRecord, staged?: StagedCapability): CapabilityValidationResult {
    if (record.kind === 'mcp') {
      validateMcpConfig(record.config);
      return {
        valid: true,
        kind: record.kind,
        id: record.id,
        checks: ['protocols-routed', 'safe-id', 'mcp-endpoint', 'mcp-transport', 'configuration-key-references-only'],
      };
    }

    const ownedStage = staged ?? this.#stage(record);
    try {
      const findings = scanCapabilityPackage(
        ownedStage.path,
        listFiles(ownedStage.path),
      );
      if (findings.length > 0) {
        throw new Error(
          `Capability package security scan failed: ${findings
            .map(
              (finding) =>
                `${finding.path}:${finding.line} ${finding.message}`,
            )
            .join('; ')}`,
        );
      }
      const checks = validateSourceContract(record.kind, record.id, ownedStage.path);
      return {
        valid: true,
        kind: record.kind,
        id: record.id,
        checks: [
          'protocols-routed',
          'safe-id',
          'source-materialized',
          ...checks,
          'secret-scan',
          'host-path-scan',
        ],
        contentDigest: ownedStage.contentDigest,
        materialization: ownedStage.materialization,
      };
    } finally {
      if (!staged) {
        rmSync(ownedStage.root, { recursive: true, force: true });
      }
    }
  }

  #replaceMaterialized(
    record: CapabilityRecord,
    stagedPath: string,
    commitStore: () => void,
  ): void {
    const targetPath = resolveCapabilityPath(this.#env, record.kind, record.id);
    const backupPath = `${targetPath}.rollback-${randomUUID()}`;
    let backedUp = false;
    let promoted = false;
    try {
      if (existsSync(targetPath)) {
        renameSync(targetPath, backupPath);
        backedUp = true;
      }
      this.#promote(stagedPath, targetPath);
      promoted = true;
      commitStore();
      if (backedUp) {
        rmSync(backupPath, { recursive: true, force: true });
      }
    } catch (error) {
      if (promoted) {
        rmSync(targetPath, { recursive: true, force: true });
      }
      if (backedUp && existsSync(backupPath)) {
        mkdirSync(dirname(targetPath), { recursive: true });
        renameSync(backupPath, targetPath);
      }
      throw error;
    }
  }

  #replaceEnabledWithDisabled(
    existing: CapabilityRecord,
    next: CapabilityRecord,
  ): void {
    const targetPath = resolveCapabilityPath(
      this.#env,
      existing.kind,
      existing.id,
    );
    const backupPath = `${targetPath}.rollback-${randomUUID()}`;
    let backedUp = false;
    let committed = false;
    try {
      if (existsSync(targetPath)) {
        renameSync(targetPath, backupPath);
        backedUp = true;
      }
      this.#store.update(next.kind, next.id, next);
      committed = true;
      if (backedUp) {
        rmSync(backupPath, { recursive: true, force: true });
      }
    } catch (error) {
      if (committed) {
        this.#store.update(existing.kind, existing.id, existing);
      }
      if (backedUp && existsSync(backupPath)) {
        mkdirSync(dirname(targetPath), { recursive: true });
        renameSync(backupPath, targetPath);
      }
      throw error;
    }
  }

  #mutationResult(
    operation: Exclude<CapabilityLifecycleOperation, 'list' | 'inspect' | 'validate' | 'remove'>,
    record: CapabilityRecord,
    validation: CapabilityValidationResult,
    progress: CapabilityLifecycleProgressEvent[],
  ): CapabilityLifecycleResult {
    return {
      operation,
      records: [record],
      record,
      validation,
      contentDigest: validation.contentDigest,
      activationState: record.enabled ? 'enabled-pending-restart' : 'disabled',
      restartRequired: true,
      progress,
      ...(this.#protocolContext ? { protocolContext: this.#protocolContext } : {}),
    };
  }

  #requireProtocolContext(): CapabilityProtocolContext {
    if (!this.#protocolContext) {
      throw new Error(
        'Capability validation and mutation require the applicable Protocol Tool bundle.',
      );
    }
    return this.#protocolContext;
  }

  #start(
    operation: CapabilityLifecycleOperation,
    kind?: CapabilityKind,
    id?: string,
  ): CapabilityLifecycleProgressEvent[] {
    return [{
      type: 'capability.lifecycle.started',
      operation,
      ...(kind ? { kind } : {}),
      ...(id ? { id } : {}),
      stage: 'request',
      status: 'running',
      summary: `Started capability ${operation}${kind ? ` for ${kind}` : ''}${id ? ` ${id}` : ''}.`,
      timestamp: this.#now(),
    }];
  }

  #validated(
    operation: CapabilityLifecycleOperation,
    kind: CapabilityKind,
    id: string,
    validation: CapabilityValidationResult,
  ): CapabilityLifecycleProgressEvent {
    return {
      type: 'capability.lifecycle.validated',
      operation,
      kind,
      id,
      stage: 'validation',
      status: 'completed',
      summary: `Validated ${kind} capability ${id}: ${validation.checks.join(', ')}.`,
      timestamp: this.#now(),
    };
  }

  #completed(
    operation: CapabilityLifecycleOperation,
    kind: CapabilityKind | undefined,
    id: string | undefined,
    summary: string,
  ): CapabilityLifecycleProgressEvent {
    return {
      type: 'capability.lifecycle.completed',
      operation,
      ...(kind ? { kind } : {}),
      ...(id ? { id } : {}),
      stage: 'complete',
      status: 'completed',
      summary,
      timestamp: this.#now(),
    };
  }
}

export function inferCapabilitySource(sourceRef: string): CapabilitySource {
  return /^(?:https?:\/\/|ssh:\/\/|git@)/i.test(sourceRef) ? 'github' : 'local';
}

function sanitizeConfig(kind: CapabilityKind, config: CapabilityConfig): CapabilityConfig {
  const clone = structuredClone(config);
  if (kind === 'mcp') {
    const allowed = new Set(['mcpUrl', 'mcpTransport', 'mcpTokenEnv']);
    const unknown = Object.keys(clone).filter((key) => !allowed.has(key));
    if (unknown.length > 0) {
      throw new Error(
        `MCP capability configuration accepts endpoint, transport, and canonical configuration key names only; unsupported keys: ${unknown.join(', ')}.`,
      );
    }
    validateMcpConfig(clone);
  }
  return clone;
}

function validateMcpConfig(config: CapabilityConfig): void {
  const url = config.mcpUrl;
  if (typeof url !== 'string') {
    throw new Error('MCP capability requires an HTTP(S) endpoint.');
  }
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`Invalid MCP URL '${url}'. Must be a valid HTTP(S) URL.`);
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`Invalid MCP URL '${url}'. Must be a valid HTTP(S) URL.`);
  }
  if (parsed.username || parsed.password) {
    throw new Error('MCP URL must not contain embedded credentials.');
  }
  if (config.mcpTransport !== 'streamable-http' && config.mcpTransport !== 'sse') {
    throw new Error("MCP transport must be 'streamable-http' or 'sse'.");
  }
  if (
    config.mcpTokenEnv !== undefined &&
    (typeof config.mcpTokenEnv !== 'string' || !/^[A-Z_][A-Z0-9_]*$/.test(config.mcpTokenEnv))
  ) {
    throw new Error('MCP token configuration must be a canonical uppercase configuration key name.');
  }
}

function validateSourceContract(
  kind: Exclude<CapabilityKind, 'mcp'>,
  id: string,
  path: string,
): string[] {
  switch (kind) {
    case 'skill': {
      const skillPath = resolve(path, 'SKILL.md');
      if (!existsSync(skillPath)) {
        throw new Error(`Skill capability ${id} must include SKILL.md.`);
      }
      const content = readFileSync(skillPath, 'utf8');
      const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!frontmatter) {
        throw new Error(`Skill capability ${id} must include valid SKILL.md frontmatter.`);
      }
      const declaredName = frontmatter[1].match(/^name:\s*["']?([^"'\r\n]+)["']?\s*$/m)?.[1]?.trim();
      const description = frontmatter[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();
      if (declaredName !== id) {
        throw new Error(`Skill capability ${id} must declare frontmatter name: ${id}.`);
      }
      if (!description) {
        throw new Error(`Skill capability ${id} must declare a frontmatter description.`);
      }
      return ['skill-frontmatter', 'skill-name-matches-id'];
    }
    case 'tool': {
      const modulePath = resolve(path, 'index.mjs');
      if (!existsSync(modulePath)) {
        throw new Error(`Tool capability ${id} must include index.mjs.`);
      }
      const content = readFileSync(modulePath, 'utf8');
      if (!hasExportedFlueFactory(content, 'defineTool')) {
        throw new Error(`Tool capability ${id} must export a Flue defineTool(...) definition.`);
      }
      return ['tool-index', 'flue-define-tool-export'];
    }
    case 'worker': {
      const modulePath = resolve(path, 'index.mjs');
      if (!existsSync(modulePath)) {
        throw new Error(`Worker capability ${id} must include index.mjs.`);
      }
      const content = readFileSync(modulePath, 'utf8');
      if (!hasExportedFlueFactory(content, 'defineAgentProfile')) {
        throw new Error(`Worker capability ${id} must export a Flue defineAgentProfile(...) definition.`);
      }
      const workspace = resolve(path, 'workspace');
      if (
        !existsSync(workspace) ||
        !workerWorkspaceFiles.some((filename) => existsSync(resolve(workspace, filename)))
      ) {
        throw new Error(
          `Worker capability ${id} must include a workspace directory with a recognized persona file.`,
        );
      }
      return ['worker-index', 'flue-agent-profile-export', 'worker-workspace'];
    }
  }
}

function promoteStagedDirectory(stagedPath: string, targetPath: string): void {
  mkdirSync(dirname(targetPath), { recursive: true });
  renameSync(stagedPath, targetPath);
}

function normalizeVersion(version: string | null): string | null {
  const normalized = version?.trim();
  return normalized && normalized !== 'latest' ? normalized : null;
}

function hashDirectory(root: string): string {
  const hash = createHash('sha256');
  for (const file of listFiles(root)) {
    hash.update(relative(root, file).split('\\').join('/'));
    hash.update('\0');
    hash.update(readFileSync(file));
    hash.update('\0');
  }
  return hash.digest('hex');
}

function listFiles(root: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (entry.name === '.git') {
      continue;
    }
    const path = resolve(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(path));
    } else if (entry.isFile() || statSync(path).isFile()) {
      files.push(path);
    }
  }
  return files.sort();
}

function emptyValidation(kind: CapabilityKind, id = ''): CapabilityValidationResult {
  return {
    valid: true,
    kind,
    id,
    checks: [],
  };
}
