import { spawnSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const STACK_SLICES = Object.freeze({
  'codex/flue-v2-00-stack-ci': {
    base: 'main',
    requiredCommit: null,
    verification: 'full',
  },
  'codex/flue-v2-01-foundation': {
    base: 'codex/flue-v2-00-stack-ci',
    requiredCommit: '0c232f0fa915e5277b7e1355d454729c8b973e4d',
    verification: 'focused',
  },
  'codex/flue-v2-02-agents-workers': {
    base: 'codex/flue-v2-01-foundation',
    requiredCommit: '83cb48a',
    verification: 'focused',
  },
  'codex/flue-v2-03-capabilities': {
    base: 'codex/flue-v2-02-agents-workers',
    requiredCommit: '2ba6263',
    verification: 'focused',
  },
  'codex/flue-v2-04-execution-persistence': {
    base: 'codex/flue-v2-03-capabilities',
    requiredCommit: '768987b',
    verification: 'typecheck',
  },
  'codex/flue-v2-05-connectors-clients': {
    base: 'codex/flue-v2-04-execution-persistence',
    requiredCommit: '93a62dd',
    verification: 'typecheck',
  },
  'codex/flue-v2-06-product-packaging': {
    base: 'codex/flue-v2-05-connectors-clients',
    requiredCommit: '677d1e4',
    verification: 'typecheck',
  },
  'codex/flue-v2-07-documentation': {
    base: 'codex/flue-v2-06-product-packaging',
    requiredCommit: 'fa326ee',
    verification: 'typecheck',
  },
  'codex/flue-v2-08-production-verification': {
    base: 'codex/flue-v2-07-documentation',
    requiredCommit: 'ac46324',
    verification: 'full',
  },
});

export function validateSliceMetadata({ baseRef, changedFiles, headRef }) {
  const slice = STACK_SLICES[headRef];
  if (!slice) {
    throw new Error(`Unrecognized Flue v2 stack branch: ${headRef}`);
  }
  if (baseRef !== slice.base) {
    throw new Error(`${headRef} must target ${slice.base}, not ${baseRef}`);
  }
  if (!Number.isInteger(changedFiles) || changedFiles < 1) {
    throw new Error(`${headRef} must contain at least one changed file`);
  }
  if (changedFiles >= 100) {
    throw new Error(`${headRef} changes ${changedFiles} files; the limit is 99`);
  }
  return slice;
}

export function runGit(args, run = spawnSync) {
  const result = run('git', args, { encoding: 'utf8' });
  if (result.error) {
    throw new Error(`git ${args.join(' ')} failed to run: ${result.error.message}`);
  }
  if (result.status !== 0) {
    throw new Error((result.stderr || '').trim() || `git ${args.join(' ')} failed`);
  }
  return (result.stdout || '').trim();
}

export function validateCommitAncestry({ headSha, requiredCommit }, run = spawnSync) {
  if (!requiredCommit) {
    return;
  }
  runGit(['merge-base', '--is-ancestor', requiredCommit, headSha], run);
}

export function validateCurrentSlice(env = process.env) {
  const headRef = env.STACK_HEAD_REF;
  const baseRef = env.STACK_BASE_REF;
  const headSha = env.STACK_HEAD_SHA;
  const baseSha = env.STACK_BASE_SHA;
  if (!headRef || !baseRef || !headSha || !baseSha) {
    throw new Error('STACK_HEAD_REF, STACK_BASE_REF, STACK_HEAD_SHA, and STACK_BASE_SHA are required');
  }

  const changed = runGit(['diff', '--name-only', `${baseSha}...${headSha}`]);
  const changedFiles = changed ? changed.split('\n').length : 0;
  const slice = validateSliceMetadata({ baseRef, changedFiles, headRef });

  try {
    validateCommitAncestry({ headSha, requiredCommit: slice.requiredCommit });
  } catch {
    if (slice.requiredCommit) {
      throw new Error(`${headRef} does not retain required migration commit ${slice.requiredCommit}`);
    }
  }

  return { baseRef, changedFiles, headRef, verification: slice.verification };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = validateCurrentSlice();
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `verification=${result.verification}\n`);
  }
  process.stdout.write(`${JSON.stringify(result)}\n`);
}
