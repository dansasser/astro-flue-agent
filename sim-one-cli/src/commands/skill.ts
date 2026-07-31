import {
  inferCapabilitySource,
  type CapabilityLifecycleAddInput,
} from '../../../src/engine/capabilities/index.js';
import { printLifecycleResult, withLifecycleService } from './store.js';

const KIND = 'skill' as const;

export function addSkill(
  sourceRef: string,
  id: string,
  name: string,
  description = '',
  enable = true,
  version?: string,
): Promise<void> {
  return withLifecycleService((service) => {
    printLifecycleResult(
      service.add(createInput(sourceRef, id, name, description, enable, version)),
    );
  });
}

export function validateSkill(
  sourceRef: string,
  id: string,
  name: string,
  description = '',
  enable = true,
  version?: string,
): Promise<void> {
  return withLifecycleService((service) => {
    printLifecycleResult(
      service.validate(createInput(sourceRef, id, name, description, enable, version)),
    );
  });
}

export function listSkills(): Promise<void> {
  return withLifecycleService((service) => printLifecycleResult(service.list(KIND)));
}

export function inspectSkill(id: string): Promise<void> {
  return withLifecycleService((service) => printLifecycleResult(service.inspect(KIND, id)));
}

export function enableSkill(id: string): Promise<void> {
  return withLifecycleService((service) => printLifecycleResult(service.enable(KIND, id)));
}

export function disableSkill(id: string): Promise<void> {
  return withLifecycleService((service) => printLifecycleResult(service.disable(KIND, id)));
}

export function removeSkill(id: string): Promise<void> {
  return withLifecycleService((service) => printLifecycleResult(service.remove(KIND, id)));
}

export function updateSkill(id: string): Promise<void> {
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
