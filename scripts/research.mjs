import { spawnSync } from 'node:child_process';
import process from 'node:process';

const text = process.argv.slice(2).join(' ').trim() || 'Research the current request.';
const payload = JSON.stringify({
  text,
  actorId: process.env.GOROMBO_RESEARCH_ACTOR_ID || 'local-user',
  conversationId: process.env.GOROMBO_RESEARCH_CONVERSATION_ID || 'local-research',
  session: process.env.GOROMBO_RESEARCH_SESSION || 'local-research',
  fetchTopK: Number(process.env.GOROMBO_RESEARCH_FETCH_TOP_K || 1),
});

const result = spawnSync(
  process.execPath,
  [
    'scripts/run-flue.mjs',
    'run',
    'research',
    '--target',
    'node',
    '--payload',
    payload,
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
