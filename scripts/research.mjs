import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import process from 'node:process';

const text = process.argv.slice(2).join(' ').trim() || 'Research the current request.';
const session = process.env.GOROMBO_RESEARCH_SESSION || 'local-research';
const initialData = JSON.stringify({
  operationId: randomUUID(),
  actorId: process.env.GOROMBO_RESEARCH_ACTOR_ID || 'local-user',
  conversationId: process.env.GOROMBO_RESEARCH_CONVERSATION_ID || 'local-research',
});

const result = spawnSync(
  process.execPath,
  [
    'scripts/run-flue.mjs',
    'run',
    'src/engine/workers/researcher/researcher.ts',
    '--name',
    'researcher',
    '--message',
    text,
    '--id',
    session,
    '--data',
    initialData,
  ],
  {
    stdio: 'inherit',
    shell: false,
  },
);

if (result.error) {
  console.error(result.error);
}

process.exit(result.status ?? 1);
