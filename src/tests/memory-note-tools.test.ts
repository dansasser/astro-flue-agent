import { runToolForText as runTool } from '../engine/tools/direct-tool-runner.js';
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  archiveSessionNoteTool,
  listSessionNotesTool,
  storeSessionNoteTool,
  updateSessionNoteTool,
} from '../engine/tools/memory-note-tools.js';
import { setupMemoryToolTest } from './helpers/memory-tool-test-setup.js';

test('note tools store/list/archive through the trusted event scope', async () => {
  const { event, cleanup } = await setupMemoryToolTest({ projectId: 'proj-note' });
  try {
    const stored = JSON.parse(
      await runTool(storeSessionNoteTool, { eventId: event.id, title: 'Decision', content: 'flat store', importance: 'high' }),
    ) as { note: { id: string; status: string; importance: string } };
    assert.equal(stored.note.status, 'active');
    assert.equal(stored.note.importance, 'high');

    const updated = JSON.parse(
      await runTool(updateSessionNoteTool, { eventId: event.id, id: stored.note.id, content: 'updated' }),
    ) as { note: { content: string } };
    assert.equal(updated.note.content, 'updated');

    const archived = JSON.parse(
      await runTool(archiveSessionNoteTool, { eventId: event.id, id: stored.note.id }),
    ) as { note: { status: string } };
    assert.equal(archived.note.status, 'archived');

    const active = JSON.parse(await runTool(listSessionNotesTool, { eventId: event.id })) as {
      notes: { id: string }[];
    };
    assert.ok(!active.notes.some((n) => n.id === stored.note.id));

    const withArchived = JSON.parse(
      await runTool(listSessionNotesTool, { eventId: event.id, includeArchived: true }),
    ) as { notes: { id: string }[] };
    assert.ok(withArchived.notes.some((n) => n.id === stored.note.id));
  } finally {
    cleanup();
  }
});
