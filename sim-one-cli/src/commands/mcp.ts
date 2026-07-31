import type {
  CapabilityLifecycleAddInput,
  CapabilityLifecycleUpdateInput,
} from '../../../src/engine/capabilities/index.js';
import { printLifecycleResult, withLifecycleService } from './store.js';

const KIND = 'mcp' as const;

export interface McpUpdateOptions {
  name?: string;
  description?: string;
  url?: string;
  transport?: 'streamable-http' | 'sse';
  tokenEnv?: string;
}

export function addMcp(
  id: string,
  name: string,
  url: string,
  description = '',
  transport: 'streamable-http' | 'sse' = 'streamable-http',
  tokenEnv?: string,
  enable = false,
): Promise<void> {
  return withLifecycleService((service) => {
    printLifecycleResult(
      service.add(createInput(id, name, url, description, transport, tokenEnv, enable)),
    );
  });
}

export function validateMcp(
  id: string,
  name: string,
  url: string,
  description = '',
  transport: 'streamable-http' | 'sse' = 'streamable-http',
  tokenEnv?: string,
  enable = false,
): Promise<void> {
  return withLifecycleService((service) => {
    printLifecycleResult(
      service.validate(createInput(id, name, url, description, transport, tokenEnv, enable)),
    );
  });
}

export function listMcp(): Promise<void> {
  return withLifecycleService((service) => printLifecycleResult(service.list(KIND)));
}

export function inspectMcp(id: string): Promise<void> {
  return withLifecycleService((service) => printLifecycleResult(service.inspect(KIND, id)));
}

export function enableMcp(id: string): Promise<void> {
  return withLifecycleService((service) => printLifecycleResult(service.enable(KIND, id)));
}

export function disableMcp(id: string): Promise<void> {
  return withLifecycleService((service) => printLifecycleResult(service.disable(KIND, id)));
}

export function removeMcp(id: string): Promise<void> {
  return withLifecycleService((service) => printLifecycleResult(service.remove(KIND, id)));
}

export function updateMcp(id: string, options: McpUpdateOptions = {}): Promise<void> {
  return withLifecycleService((service) => {
    const existing = service.inspect(KIND, id).record;
    if (!existing) {
      throw new Error(`No mcp capability found for ${id}.`);
    }
    const input: CapabilityLifecycleUpdateInput = {
      kind: KIND,
      id,
      ...(options.name !== undefined ? { name: options.name } : {}),
      ...(options.description !== undefined ? { description: options.description } : {}),
      config: {
        mcpUrl: options.url ?? existing.config.mcpUrl,
        mcpTransport: options.transport ?? existing.config.mcpTransport,
        mcpTokenEnv: options.tokenEnv ?? existing.config.mcpTokenEnv,
      },
    };
    printLifecycleResult(service.update(input));
  });
}

function createInput(
  id: string,
  name: string,
  url: string,
  description: string,
  transport: 'streamable-http' | 'sse',
  tokenEnv: string | undefined,
  enable: boolean,
): CapabilityLifecycleAddInput {
  return {
    kind: KIND,
    id,
    name,
    description,
    source: 'local',
    sourceRef: `mcp://${id}`,
    version: null,
    requestedEnabled: enable,
    installedBy: 'cli',
    config: {
      mcpUrl: url,
      mcpTransport: transport,
      ...(tokenEnv ? { mcpTokenEnv: tokenEnv } : {}),
    },
  };
}
