import {
  defineSkill,
  type Skill,
} from '@flue/runtime';
import {
  lstatSync,
  readFileSync,
  readdirSync,
} from 'node:fs';
import { relative, resolve, sep } from 'node:path';
import { load as loadYaml } from 'js-yaml';
import { resolveCapabilityPath } from './capability-loader.js';
import type { CapabilityRecord } from './types.js';

export interface SkillLoaderResult {
  skills: Skill[];
  errors: Array<{ id: string; error: string }>;
}

export function loadUserSkills(
  skillRecords: CapabilityRecord[],
  env: Record<string, unknown> = process.env,
): SkillLoaderResult {
  const skills: Skill[] = [];
  const errors: Array<{ id: string; error: string }> = [];

  for (const record of skillRecords) {
    try {
      const root = resolveCapabilityPath(env, 'skill', record.id);
      const skillPath = resolve(root, 'SKILL.md');
      const content = readFileSync(skillPath, 'utf8');
      const { fields, instructions } = parseSkill(content, skillPath);
      if (fields.name !== record.id) {
        throw new Error(
          `Skill frontmatter name ${fields.name} does not match registry id ${record.id}.`,
        );
      }

      skills.push(
        defineSkill({
          name: fields.name,
          description: fields.description,
          instructions,
          ...(fields.license ? { license: fields.license } : {}),
          ...(fields.compatibility
            ? { compatibility: fields.compatibility }
            : {}),
          ...(fields.metadata ? { metadata: fields.metadata } : {}),
          ...(fields.allowedTools ? { allowedTools: fields.allowedTools } : {}),
          files: loadSupportingFiles(root),
        }),
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push({ id: record.id, error: message });
      console.error(`[capabilities] Skill loader failed for ${record.id}: ${message}`);
    }
  }

  return { skills, errors };
}

interface SkillFields {
  name: string;
  description: string;
  license?: string;
  compatibility?: string;
  metadata?: Record<string, string>;
  allowedTools?: string;
}

function parseSkill(
  content: string,
  path: string,
): { fields: SkillFields; instructions: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(content);
  if (!match) {
    throw new Error(`SKILL.md is missing YAML frontmatter: ${path}`);
  }
  const parsed = loadYaml(match[1] ?? '', { filename: path });
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`SKILL.md has invalid YAML frontmatter: ${path}`);
  }
  const record = parsed as Record<string, unknown>;
  const name = readRequiredString(record, 'name', path);
  const description = readRequiredString(record, 'description', path);
  const metadata = readMetadata(record.metadata, path);

  return {
    fields: {
      name,
      description,
      ...readOptionalString(record, 'license'),
      ...readOptionalString(record, 'compatibility'),
      ...(metadata ? { metadata } : {}),
      ...(typeof record['allowed-tools'] === 'string'
        ? { allowedTools: record['allowed-tools'] }
        : {}),
    },
    instructions: content.slice(match[0].length),
  };
}

function loadSupportingFiles(root: string): Record<string, Uint8Array> {
  const files: Record<string, Uint8Array> = {};
  visit(root);
  return files;

  function visit(directory: string): void {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.name === '.git' || entry.name === 'node_modules') {
        continue;
      }
      const path = resolve(directory, entry.name);
      const stat = lstatSync(path);
      if (stat.isSymbolicLink()) {
        throw new Error(`Runtime skill packages must not contain symbolic links: ${path}`);
      }
      if (stat.isDirectory()) {
        visit(path);
        continue;
      }
      if (!stat.isFile() || path === resolve(root, 'SKILL.md')) {
        continue;
      }
      files[relative(root, path).split(sep).join('/')] = readFileSync(path);
    }
  }
}

function readRequiredString(
  record: Record<string, unknown>,
  key: string,
  path: string,
): string {
  const value = record[key];
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`SKILL.md frontmatter must define ${key}: ${path}`);
  }
  return value.trim();
}

function readOptionalString(
  record: Record<string, unknown>,
  key: 'license' | 'compatibility',
): Partial<Pick<SkillFields, 'license' | 'compatibility'>> {
  const value = record[key];
  return typeof value === 'string' && value.trim().length > 0
    ? { [key]: value.trim() }
    : {};
}

function readMetadata(
  value: unknown,
  path: string,
): Record<string, string> | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`SKILL.md metadata must be a string map: ${path}`);
  }
  const entries = Object.entries(value);
  if (!entries.every(([, entry]) => typeof entry === 'string')) {
    throw new Error(`SKILL.md metadata must be a string map: ${path}`);
  }
  return Object.fromEntries(entries) as Record<string, string>;
}
