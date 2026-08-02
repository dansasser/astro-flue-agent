import type {
  FlueLogger,
  JsonValue,
  ToolDefinition,
  ToolRunEnvelope,
} from '@flue/runtime';
import * as v from 'valibot';

const silentLogger: FlueLogger = {
  info() {},
  warn() {},
  error() {},
};

export interface DirectToolRunOptions {
  signal?: AbortSignal;
  toolCallId?: string;
  log?: FlueLogger;
}

export async function runToolDirect(
  tool: ToolDefinition,
  data: Record<string, unknown>,
  options: DirectToolRunOptions = {},
): Promise<string | ToolRunEnvelope<undefined> | void> {
  const parsedData = tool.input ? v.parse(tool.input, data) : data;
  return tool.run({
    data: parsedData,
    toolCallId: options.toolCallId ?? `direct:${tool.name}`,
    signal: options.signal,
    log: options.log ?? silentLogger,
  } as never);
}

export async function runToolForText(
  tool: ToolDefinition,
  data: Record<string, unknown>,
  options: DirectToolRunOptions = {},
): Promise<string> {
  const result = await runToolDirect(tool, data, options);
  const output = typeof result === 'string' ? result : result?.output;

  if (typeof output === 'string') {
    return output;
  }
  if (output === undefined) {
    return '';
  }
  return JSON.stringify(output satisfies JsonValue);
}
