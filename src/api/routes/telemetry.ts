import type { Hono } from 'hono';
import { requireApiSecret } from '../../api/middleware/api-secret.js';
import { flueTelemetryStore } from '../../core/telemetry/flue-telemetry.js';

/**
 * Registers protected HTTP routes for inspecting sanitized Flue telemetry.
 */
export function registerTelemetryRoutes(app: Hono): void {
  app.get('/api/telemetry/executions/:executionId', requireApiSecret, (c) => {
    const executionId = c.req.param('executionId');
    const summary = flueTelemetryStore.getExecutionSummary(executionId);

    if (!summary) {
      return c.json({ error: 'Telemetry execution not found', executionId }, 404);
    }

    return c.json(summary);
  });

  app.get('/api/telemetry/executions', requireApiSecret, (c) =>
    c.json(flueTelemetryStore.snapshot()));
}
