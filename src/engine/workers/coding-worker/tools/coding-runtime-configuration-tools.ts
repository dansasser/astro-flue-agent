import { createHash } from 'node:crypto';
import { basename } from 'node:path';
import { defineTool, type ToolDefinition } from '@flue/runtime';
import * as v from 'valibot';
import {
  inspectRuntimeEnvironmentFile,
  runtimeEnvironmentDefinitions,
  runtimeEnvironmentStatus,
  updateRuntimeEnvironmentFile,
  validateRuntimeEnvironmentValue,
} from '../../../../core/config/runtime-environment.js';
import type { CodingApprovalService } from '../approvals/approval-service.js';
import type { CodingProgressReporter } from '../events/progress-reporter.js';
import { evaluateGitApproval } from './coding-git-tools.js';

export interface CodingRuntimeConfigurationToolsOptions {
  configPath: string;
  approvalService: CodingApprovalService;
  reporter?: CodingProgressReporter;
}

export function createCodingRuntimeConfigurationTools(
  options: CodingRuntimeConfigurationToolsOptions,
): ToolDefinition[] {
  return [
    defineTool({
      name: 'coding_runtime_config_status',
      description:
        'List supported SIM-ONE runtime configuration metadata and redacted configured/missing status. Never returns values.',
      parameters: v.object({}),
      execute: async () => {
        const loadResult = inspectRuntimeEnvironmentFile(options.configPath);
        const statuses = new Map(
          runtimeEnvironmentStatus(loadResult).map((status) => [
            status.key,
            status,
          ]),
        );
        return JSON.stringify(
          {
            file: basename(options.configPath),
            valid: true,
            deprecatedAliases: loadResult.deprecatedAliases,
            keys: runtimeEnvironmentDefinitions.map((definition) => ({
              key: definition.key,
              subsystem: definition.subsystem,
              kind: definition.kind,
              secret: definition.secret,
              configured: statuses.get(definition.key)?.configured ?? false,
              requiredWhen: definition.requiredWhen,
              defaultDescription: definition.defaultDescription,
              deprecatedAliases: definition.deprecatedAliases ?? [],
            })),
          },
          null,
          2,
        );
      },
    }),
    defineTool({
      name: 'coding_runtime_config_validate',
      description:
        'Validate the canonical SIM-ONE runtime configuration and return only redacted counts, key names, and deprecated aliases.',
      parameters: v.object({}),
      execute: async () => {
        const loadResult = inspectRuntimeEnvironmentFile(options.configPath);
        return JSON.stringify(
          {
            file: basename(options.configPath),
            valid: true,
            configuredKeys: loadResult.configuredKeys,
            missingKeys: runtimeEnvironmentDefinitions
              .map((definition) => definition.key)
              .filter((key) => !loadResult.configuredKeys.includes(key)),
            deprecatedAliases: loadResult.deprecatedAliases,
          },
          null,
          2,
        );
      },
    }),
    defineTool({
      name: 'coding_runtime_config_update',
      description:
        'Request an approval-gated update or removal of one registered SIM-ONE runtime configuration key. A secret set may use only the exact value the user explicitly supplied for this requested change; the tool never returns configured values.',
      parameters: v.object({
        taskId: v.string(),
        key: v.string(),
        operation: v.picklist(['set', 'remove']),
        value: v.optional(v.string()),
      }),
      execute: async (args) => {
        const value = args.operation === 'remove' ? '' : args.value;
        if (args.operation === 'set' && value === undefined) {
          throw new Error('value is required for a set operation.');
        }
        const definition = validateRuntimeEnvironmentValue(args.key, value ?? '');

        const payloadHash = createHash('sha256')
          .update(`${definition.key}\0${args.operation}\0${value ?? ''}`)
          .digest('hex')
          .slice(0, 16);
        const approval = await evaluateGitApproval(
          { reporter: options.reporter },
          {
            approvalService: options.approvalService,
            taskId: args.taskId,
            actionType: 'runtime.config.update',
            summary: `${args.operation === 'remove' ? 'Remove' : 'Update'} SIM-ONE runtime configuration key ${definition.key}.`,
            reason:
              'Runtime configuration changes alter trusted provider, connector, or service behavior.',
            risk: definition.secret ? 'high' : 'medium',
            target: basename(options.configPath),
            metadata: {
              key: definition.key,
              operation: args.operation,
              payloadHash,
            },
          },
        );
        if (!approval.evaluation.allowed) {
          return JSON.stringify(
            {
              blocked: true,
              request: approval.request,
              evaluation: approval.evaluation,
            },
            null,
            2,
          );
        }

        updateRuntimeEnvironmentFile({
          configPath: options.configPath,
          key: definition.key,
          value,
        });
        options.reporter?.emit({
          type: 'coding.action.completed',
          taskId: args.taskId,
          action: 'runtime.config.update',
          summary: `${args.operation === 'remove' ? 'Removed' : 'Updated'} runtime configuration key ${definition.key}.`,
          status: 'completed',
          evidence: [definition.key],
        });
        return JSON.stringify({
          updated: true,
          key: definition.key,
          operation: args.operation,
          restartRequired: true,
        });
      },
    }),
  ];
}
