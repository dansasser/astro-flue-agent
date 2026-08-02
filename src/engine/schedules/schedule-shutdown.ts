/**
 * Graceful shutdown for the schedules subsystem (plan §7 shutdown flow).
 *
 * On SIGTERM/SIGINT (covers `pm2 stop` / `systemctl stop`), emit a
 * `schedule.shutdown` event, stop accepting new Croner fires, stop all Croner
 * jobs, and resolve any in-flight observations as `timeout` (the underlying
 * Flue agent submissions are aborted at the turn boundary by Flue's own
 * graceful-shutdown path and left reclaimable — see the durable-execution doc;
 * we do not duplicate that reconciliation here).
 *
 * The manager waits for the configured grace window, then aborts any remaining
 * exact-submission reads so every admitted run reaches a durable terminal state.
 */

import type { ScheduleManager } from '../../engine/schedules/schedule-manager.js';
import { scheduleProgressEmitter } from '../../engine/schedules/schedule-manager.js';

export interface ScheduleShutdownOptions {
  /** Grace window in seconds before remaining settlements are aborted. */
  graceSeconds?: number;
  /** Logger; defaults to console.error. */
  log?: (message: string) => void;
}

let installed = false;

/**
 * Register SIGTERM/SIGINT handlers that drain the ScheduleManager. Idempotent.
 */
export function registerScheduleShutdown(
  manager: ScheduleManager,
  options: ScheduleShutdownOptions = {},
): void {
  if (installed) {
    return;
  }
  installed = true;
  const log = options.log ?? ((msg) => console.error(`[schedules] ${msg}`));
  const graceSeconds = options.graceSeconds ?? 60;

  const handler = async (signal: NodeJS.Signals) => {
    scheduleProgressEmitter('schedule.shutdown', { signal, graceSeconds });
    log(`received ${signal}; draining schedule manager (grace ${graceSeconds}s)`);
    try {
      await manager.stop(graceSeconds * 1_000);
    } catch (error) {
      log(`schedule manager stop error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  process.once('SIGTERM', handler);
  process.once('SIGINT', handler);
}
