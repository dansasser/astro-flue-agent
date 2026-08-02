import { createHash, randomUUID } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, isAbsolute } from 'node:path';
import { defineTool, type ToolDefinition } from '@flue/runtime';
import * as v from 'valibot';
import { protocolBundleSchema } from '../../../../core/protocols/protocol-bundle-schema.js';
import type { ProtocolBundle } from '../../../../core/types/index.js';
import { compileCapabilityProtocolContext } from '../../../../engine/capabilities/capability-protocol-context.js';
import { evaluateApproval } from '../../../../engine/approvals/evaluate-approval.js';
import type { CodingApprovalService } from '../../../../engine/workers/coding-worker/approvals/approval-service.js';
import type { CodingProgressReporter } from '../../../../engine/workers/coding-worker/events/progress-reporter.js';
import {
  assertInsideCodingScope,
  resolveCodingWorkspaceTarget,
  type CodingWorkspaceTargetInput,
} from '../../../../engine/workers/coding-worker/repo/workspace-target.js';
import { evaluateCodingShellCommand } from '../../../../engine/workers/coding-worker/tools/command-policy.js';
import {
  createFlueLocalCodingSandbox,
  type CodingSandboxRuntime,
} from '../../../../engine/workers/coding-worker/tools/sandbox-runtime.js';
import {
  createCapabilityHandoff,
  managerKindForAuthoringKind,
  scaffoldCapabilityFiles,
  validateCapabilityPackage,
  type CapabilityAuthoringTestEvidence,
  type CodingCapabilityAuthoringKind,
} from '../../../../engine/workers/coding-worker/capability-authoring/capability-authoring.js';

const authoringKindSchema = v.picklist([
  'skill',
  'tool',
  'worker',
  'mcp-server',
  'mcp-connection',
]);

export interface CodingCapabilityAuthoringToolsOptions
  extends CodingWorkspaceTargetInput {
  approvalService: CodingApprovalService;
  reporter?: CodingProgressReporter;
  sandbox?: CodingSandboxRuntime;
  env?: Record<string, string | undefined>;
  sessionId?: string;
}

export function createCodingCapabilityAuthoringTools(
  options: CodingCapabilityAuthoringToolsOptions,
): ToolDefinition[] {
  const target = resolveCodingWorkspaceTarget(options);
  const testAttestations = new Map<string, CapabilityAuthoringTestEvidence>();
  let sandboxPromise: Promise<CodingSandboxRuntime> | undefined;
  const getSandbox = async () => {
    sandboxPromise ??= options.sandbox
      ? Promise.resolve(options.sandbox)
      : createFlueLocalCodingSandbox({
          workspaceRoot: options.workspaceRoot,
          targetKind: options.targetKind,
          projectId: options.projectId,
          projectSlug: options.projectSlug,
          projectRelativePath: options.projectRelativePath,
          repoPath: options.repoPath,
          env: options.env ?? {},
          sessionId: options.sessionId ?? 'coding-worker-capability-authoring',
        });
    return sandboxPromise;
  };

  return [
    defineTool({
      name: 'coding_capability_classify',
      description:
        'Record a protocol-governed capability classification as skill, tool, worker, MCP server, or MCP connection before source authoring.',
      input: v.object({
        taskId: v.string(),
        protocolBundle: protocolBundleSchema(),
        authoringKind: authoringKindSchema,
        rationale: v.string(),
      }),
      run: async ({ data: args }) => {
        const protocolContext = compileCapabilityProtocolContext(
          args.protocolBundle as unknown as ProtocolBundle,
        );
        const result = {
          authoringKind: args.authoringKind,
          managerKind: managerKindForAuthoringKind(args.authoringKind),
          rationale: args.rationale.replace(/\s+/g, ' ').trim(),
          protocolContext,
        };
        emitProgress(options.reporter, {
          taskId: args.taskId,
          type: 'coding.action.completed',
          action: 'capability.classify',
          summary: `Classified capability source as ${args.authoringKind}.`,
          status: 'completed',
          evidence: protocolContext.directives.map((directive) => directive.id),
        });
        return JSON.stringify(result, null, 2);
      },
    }),
    defineTool({
      name: 'coding_capability_scaffold',
      description:
        'Create an approval-gated capability source package inside the selected Coding Worker project or repository. Supports skill, tool, worker, MCP server, and MCP connection packages and never writes the runtime registry.',
      input: v.object({
        taskId: v.string(),
        protocolBundle: protocolBundleSchema(),
        authoringKind: authoringKindSchema,
        id: v.string(),
        name: v.string(),
        description: v.string(),
        packagePath: v.optional(v.string()),
        requiredConfigurationKeys: v.optional(v.array(v.string())),
      }),
      run: async ({ data: args }) => {
        const protocolContext = compileCapabilityProtocolContext(
          args.protocolBundle as unknown as ProtocolBundle,
        );
        const packagePath = normalizePackagePath(
          args.packagePath ?? `capability-packages/${args.id}`,
        );
        const packageRoot = assertInsideCodingScope(target.scopePath, packagePath);
        const files = scaffoldCapabilityFiles({
          authoringKind: args.authoringKind,
          id: args.id,
          name: args.name,
          description: args.description,
          requiredConfigurationKeys: args.requiredConfigurationKeys,
        });
        if (existsSync(packageRoot)) {
          return JSON.stringify({
            status: 'existing',
            authoringKind: args.authoringKind,
            id: args.id,
            packagePath,
            files: files.map((file) => file.path),
            protocolContext,
          }, null, 2);
        }
        const contentHash = createHash('sha256')
          .update(JSON.stringify(files))
          .digest('hex');
        const approval = await evaluateApproval({
          approvalService: options.approvalService,
          taskId: args.taskId,
          actionType: 'file.edit',
          summary: `Scaffold ${args.authoringKind} capability ${args.id}.`,
          reason: 'Capability scaffolding writes source files in the selected Coding Worker target.',
          risk: 'medium',
          target: portableTargetPath(target.projectRelativePath, packagePath),
          requestedBy: 'coding-worker',
          metadata: {
            authoringKind: args.authoringKind,
            id: args.id,
            fileCount: files.length,
            contentHash,
            protocolEventId: protocolContext.eventId,
            protocolIds: JSON.stringify(
              protocolContext.directives.map((directive) => directive.id),
            ),
          },
        });
        if (!approval.evaluation.allowed) {
          emitProgress(options.reporter, {
            taskId: args.taskId,
            type: 'coding.approval.requested',
            action: 'file.edit',
            summary: approval.request.summary,
            status: approval.evaluation.status,
            evidence: [approval.request.id],
          });
          return JSON.stringify({
            blocked: true,
            request: approval.request,
            evaluation: approval.evaluation,
          }, null, 2);
        }

        const stagingRoot = assertInsideCodingScope(
          target.scopePath,
          `.capability-staging-${randomUUID()}`,
        );
        try {
          for (const file of files) {
            const destination = assertInsideCodingScope(stagingRoot, file.path);
            mkdirSync(dirname(destination), { recursive: true });
            writeFileSync(destination, file.content, { encoding: 'utf8', mode: 0o644 });
          }
          mkdirSync(dirname(packageRoot), { recursive: true });
          renameSync(stagingRoot, packageRoot);
        } catch (error) {
          rmSync(stagingRoot, { recursive: true, force: true });
          throw error;
        }
        emitProgress(options.reporter, {
          taskId: args.taskId,
          type: 'coding.action.completed',
          action: 'capability.scaffold',
          summary: `Scaffolded ${args.authoringKind} capability ${args.id}.`,
          status: 'completed',
          evidence: files.map((file) =>
            portableTargetPath(target.projectRelativePath, `${packagePath}/${file.path}`),
          ),
        });
        return JSON.stringify({
          status: 'created',
          authoringKind: args.authoringKind,
          id: args.id,
          packagePath,
          files: files.map((file) => file.path),
          protocolContext,
        }, null, 2);
      },
    }),
    defineTool({
      name: 'coding_capability_validate',
      description:
        'Validate a capability package inside the selected Coding Worker target against the applicable protocol bundle, Flue/SIM-ONE contracts, secret scan, host-path scan, and deterministic digest without touching the runtime registry.',
      input: validationSchema(),
      run: async ({ data: args }) => {
        const validation = validateCapabilityPackage({
          scopePath: target.scopePath,
          packagePath: normalizePackagePath(args.packagePath),
          authoringKind: args.authoringKind,
          id: args.id,
          protocolBundle: args.protocolBundle as unknown as ProtocolBundle,
          requiredConfigurationKeys: args.requiredConfigurationKeys,
        });
        emitProgress(options.reporter, {
          taskId: args.taskId,
          type: 'coding.verification.completed',
          action: 'capability.validate',
          summary: `Validated ${args.authoringKind} capability ${args.id}.`,
          status: 'passed',
          evidence: validation.checks,
        });
        return JSON.stringify(validation, null, 2);
      },
    }),
    defineTool({
      name: 'coding_capability_test',
      description:
        'Run a bounded test command inside a protocol-validated capability package and attest the exact content digest for handoff. Git and GitHub writes are blocked.',
      input: v.object({
        ...validationSchemaEntries(),
        command: v.string(),
        timeoutSeconds: v.optional(v.number()),
      }),
      run: async ({ data: args }) => {
        const packagePath = normalizePackagePath(args.packagePath);
        const protocolBundle = args.protocolBundle as unknown as ProtocolBundle;
        const validation = validateCapabilityPackage({
          scopePath: target.scopePath,
          packagePath,
          authoringKind: args.authoringKind,
          id: args.id,
          protocolBundle,
          requiredConfigurationKeys: args.requiredConfigurationKeys,
        });
        const policy = evaluateCodingShellCommand(args.command);
        if (!policy.allowed) {
          return JSON.stringify({
            blocked: true,
            reason: policy.reason,
            approvalAction: policy.approvalAction,
          }, null, 2);
        }
        emitProgress(options.reporter, {
          taskId: args.taskId,
          type: 'coding.verification.started',
          action: 'capability.test',
          summary: `Testing ${args.authoringKind} capability ${args.id}.`,
          status: 'running',
          evidence: [validation.contentDigest],
        });
        const sandbox = await getSandbox();
        const result = await sandbox.exec(args.command, {
          cwd: packagePath,
          timeoutSeconds: normalizeTimeout(args.timeoutSeconds),
          env: {},
        });
        const commandDigest = createHash('sha256').update(args.command).digest('hex');
        const protocolDigest = digestProtocolDirectives(validation.protocolContext);
        if (result.exitCode !== 0) {
          emitProgress(options.reporter, {
            taskId: args.taskId,
            type: 'coding.verification.completed',
            action: 'capability.test',
            summary: `Capability tests failed for ${args.authoringKind} ${args.id}.`,
            status: 'failed',
            evidence: [validation.contentDigest, commandDigest],
          });
          return JSON.stringify({
            status: 'failed',
            exitCode: result.exitCode,
            contentDigest: validation.contentDigest,
            commandDigest,
            protocolContext: validation.protocolContext,
            stdout: redactTestOutput(result.stdout),
            stderr: redactTestOutput(result.stderr),
          }, null, 2);
        }
        const evidence: CapabilityAuthoringTestEvidence = {
          status: 'passed',
          contentDigest: validation.contentDigest,
          commandDigest,
          protocolDigest,
          exitCode: 0,
        };
        testAttestations.set(
          testAttestationKey(
            args.taskId,
            args.authoringKind,
            args.id,
            packagePath,
            validation.contentDigest,
            protocolDigest,
          ),
          evidence,
        );
        emitProgress(options.reporter, {
          taskId: args.taskId,
          type: 'coding.verification.completed',
          action: 'capability.test',
          summary: `Capability tests passed for ${args.authoringKind} ${args.id}.`,
          status: 'passed',
          evidence: [validation.contentDigest, commandDigest],
        });
        return JSON.stringify({
          ...evidence,
          protocolContext: validation.protocolContext,
          stdout: redactTestOutput(result.stdout),
          stderr: redactTestOutput(result.stderr),
        }, null, 2);
      },
    }),
    defineTool({
      name: 'coding_capability_prepare_handoff',
      description:
        'Validate a workspace capability package and return the portable typed handoff consumed by capability-manager. Does not install, enable, or mutate the runtime registry.',
      input: v.object({
        ...validationSchemaEntries(),
        name: v.string(),
        description: v.string(),
        version: v.optional(v.string()),
        requestedActivation: v.optional(v.picklist(['enabled', 'disabled'])),
        operation: v.optional(v.picklist(['validate', 'add', 'update'])),
      }),
      run: async ({ data: args }) => {
        const packagePath = normalizePackagePath(args.packagePath);
        const validation = validateCapabilityPackage({
          scopePath: target.scopePath,
          packagePath,
          authoringKind: args.authoringKind,
          id: args.id,
          protocolBundle: args.protocolBundle as unknown as ProtocolBundle,
          requiredConfigurationKeys: args.requiredConfigurationKeys,
        });
        const protocolDigest = digestProtocolDirectives(validation.protocolContext);
        const testEvidence = testAttestations.get(
          testAttestationKey(
            args.taskId,
            args.authoringKind,
            args.id,
            packagePath,
            validation.contentDigest,
            protocolDigest,
          ),
        );
        if (!testEvidence) {
          throw new Error(
            'Capability handoff requires a passing coding_capability_test attestation for the current content and protocol directives.',
          );
        }
        const handoff = createCapabilityHandoff({
          validation,
          testEvidence,
          name: args.name,
          description: args.description,
          sourceRef: portableTargetPath(target.projectRelativePath, packagePath),
          version: args.version,
          requestedActivation: args.requestedActivation,
          operation: args.operation,
        });
        emitProgress(options.reporter, {
          taskId: args.taskId,
          type: 'coding.action.completed',
          action: 'capability.handoff',
          summary: `Prepared capability-manager handoff for ${args.authoringKind} ${args.id}.`,
          status: 'completed',
          evidence: [handoff.contentDigest, ...handoff.validationEvidence],
        });
        return JSON.stringify(handoff, null, 2);
      },
    }),
  ];
}

function validationSchema() {
  return v.object(validationSchemaEntries());
}

function validationSchemaEntries() {
  return {
    taskId: v.string(),
    protocolBundle: protocolBundleSchema(),
    authoringKind: authoringKindSchema,
    id: v.string(),
    packagePath: v.string(),
    requiredConfigurationKeys: v.optional(v.array(v.string())),
  };
}

function normalizePackagePath(value: string): string {
  const trimmed = value.trim();
  if (
    !trimmed ||
    isAbsolute(trimmed) ||
    trimmed.startsWith('\\') ||
    /^[A-Za-z]:[\\/]/.test(trimmed)
  ) {
    throw new Error('Capability packagePath must be a non-empty workspace-relative path.');
  }
  const segments = trimmed.split(/[\\/]+/).filter(Boolean);
  if (segments.length === 0 || segments.some((segment) => segment === '.' || segment === '..')) {
    throw new Error('Capability packagePath must be a non-empty workspace-relative path.');
  }
  const normalized = segments.join('/');
  return normalized;
}

function normalizeTimeout(value: number | undefined): number {
  if (value === undefined) {
    return 120;
  }
  if (!Number.isInteger(value) || value < 1 || value > 900) {
    throw new Error('Capability test timeoutSeconds must be an integer from 1 to 900.');
  }
  return value;
}

function digestProtocolDirectives(
  context: ReturnType<typeof compileCapabilityProtocolContext>,
): string {
  return createHash('sha256')
    .update(JSON.stringify(context.directives))
    .digest('hex');
}

function testAttestationKey(
  taskId: string,
  kind: CodingCapabilityAuthoringKind,
  id: string,
  packagePath: string,
  contentDigest: string,
  protocolDigest: string,
): string {
  return [taskId, kind, id, packagePath, contentDigest, protocolDigest].join('\0');
}

function redactTestOutput(value: string): string {
  return value
    .slice(0, 16_384)
    .replace(/\b(?:gh[opusr]_|sk-(?:proj-)?)[A-Za-z0-9_-]{12,}\b/g, '[REDACTED]')
    .replace(/(?:^|[\s"'`])\/(?:opt|root|home)\/[A-Za-z0-9._/-]+/g, ' [HOST_PATH_REDACTED]');
}

function portableTargetPath(projectRelativePath: string, packagePath: string): string {
  const joined = [projectRelativePath === '.' ? '' : projectRelativePath, packagePath]
    .filter(Boolean)
    .join('/');
  if (joined.startsWith('/') || /^[A-Za-z]:[\\/]/.test(joined)) {
    throw new Error('Capability source path must remain relative to the runtime workspace.');
  }
  return joined;
}

function emitProgress(
  reporter: CodingProgressReporter | undefined,
  event: Parameters<CodingProgressReporter['emit']>[0],
): void {
  reporter?.emit(event);
}
