import {
  inferCapabilitySource,
  type CapabilityLifecycleAddInput,
} from '../../../src/engine/capabilities/index.js';
import { printLifecycleResult, withLifecycleService } from './store.js';

const KIND = 'tool' as const;

export function addTool(
  sourceRef: string,
  id: string,
  name: string,
  description = '',
  enable = false,
  version?: string,
): Promise<void> {
  return withLifecycleService((service) => {
    printLifecycleResult(
      service.add(createInput(sourceRef, id, name, description, enable, version)),
    );
  });
}

export function validateTool(
  sourceRef: string,
  id: string,
  name: string,
  description = '',
  enable = false,
  version?: string,
): Promise<void> {
  return withLifecycleService((service) => {
    printLifecycleResult(
      service.validate(createInput(sourceRef, id, name, description, enable, version)),
    );
  });
}

export function listTools(): Promise<void> {
  return withLifecycleService((service) => printLifecycleResult(service.list(KIND)));
}

export function inspectTool(id: string): Promise<void> {
  return withLifecycleService((service) => printLifecycleResult(service.inspect(KIND, id)));
}

export function enableTool(id: string): Promise<void> {
  return withLifecycleService((service) => printLifecycleResult(service.enable(KIND, id)));
}

export function disableTool(id: string): Promise<void> {
  return withLifecycleService((service) => printLifecycleResult(service.disable(KIND, id)));
}

export function removeTool(id: string): Promise<void> {
  return withLifecycleService((service) => printLifecycleResult(service.remove(KIND, id)));
}

export function updateTool(id: string): Promise<void> {
  return withLifecycleService((service) =>
    printLifecycleResult(service.update({ kind: KIND, id })),
  );
}

function createInput(
  sourceRef: string,
  id: string,
  name: string,
  description: string,
  enable: boolean,
  version?: string,
): CapabilityLifecycleAddInput {
  return {
    kind: KIND,
    id,
    name,
    description,
    source: inferCapabilitySource(sourceRef),
    sourceRef,
    version: version ?? null,
    requestedEnabled: enable,
    installedBy: 'cli',
  };
}
