import {
  inferCapabilitySource,
  type CapabilityLifecycleAddInput,
} from '../../../src/engine/capabilities/index.js';
import { printLifecycleResult, withLifecycleService } from './store.js';

const KIND = 'worker' as const;

export function addWorker(
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

export function validateWorker(
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

export function listWorkers(): Promise<void> {
  return withLifecycleService((service) => printLifecycleResult(service.list(KIND)));
}

export function inspectWorker(id: string): Promise<void> {
  return withLifecycleService((service) => printLifecycleResult(service.inspect(KIND, id)));
}

export function enableWorker(id: string): Promise<void> {
  return withLifecycleService((service) => printLifecycleResult(service.enable(KIND, id)));
}

export function disableWorker(id: string): Promise<void> {
  return withLifecycleService((service) => printLifecycleResult(service.disable(KIND, id)));
}

export function removeWorker(id: string): Promise<void> {
  return withLifecycleService((service) => printLifecycleResult(service.remove(KIND, id)));
}

export function updateWorker(id: string): Promise<void> {
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
