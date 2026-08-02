import assert from 'node:assert/strict';
import test from 'node:test';
import { defineTool } from '@flue/runtime';
import * as v from 'valibot';
import { runToolDirect } from '../engine/tools/direct-tool-runner.js';

test('direct tool runs receive unique default call ids and preserve explicit ids', async () => {
  const toolCallIds: string[] = [];
  const tool = defineTool({
    name: 'capture_call_id',
    description: 'Capture direct tool call ids.',
    input: v.object({}),
    run: ({ toolCallId }) => {
      toolCallIds.push(toolCallId);
    },
  });

  await runToolDirect(tool, {});
  await runToolDirect(tool, {});
  await runToolDirect(tool, {}, { toolCallId: 'explicit-call-id' });

  assert.match(toolCallIds[0] ?? '', /^direct:capture_call_id:/);
  assert.match(toolCallIds[1] ?? '', /^direct:capture_call_id:/);
  assert.notEqual(toolCallIds[0], toolCallIds[1]);
  assert.equal(toolCallIds[2], 'explicit-call-id');
});
