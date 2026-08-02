import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import process from 'node:process';

const text = process.argv.slice(2).join(' ').trim() || 'Research the current request.';
const session = process.env.GOROMBO_RESEARCH_SESSION || 'local-research';
const compile = spawnSync(
  process.execPath,
  [
    'node_modules/typescript/bin/tsc',
    '-p',
    'tsconfig.json',
  ],
  {
    stdio: 'inherit',
    shell: false,
  },
);

if (compile.error) {
  console.error(compile.error);
  process.exit(1);
}
if (compile.status !== 0) {
  process.exit(compile.status ?? 1);
}

try {
  const { runResearchWorkflow } = await import(
    new URL('../.tmp/tsc/workflows/research.js', import.meta.url)
  );
  const result = await runResearchWorkflow({
    operationId: process.env.GOROMBO_RESEARCH_OPERATION_ID || randomUUID(),
    text,
    actorId: process.env.GOROMBO_RESEARCH_ACTOR_ID || 'local-user',
    conversationId: process.env.GOROMBO_RESEARCH_CONVERSATION_ID || 'local-research',
    session,
  });
  process.stdout.write(`${result.text}\n`);
} catch (error) {
  console.error(error);
  process.exit(1);
}
