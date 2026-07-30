import type { ProtocolBundle } from '../../core/types/index.js';

export interface CapabilityProtocolDirective {
  id: string;
  priority: number;
  rules: string[];
}

export interface CapabilityProtocolContext {
  eventId: string;
  loadedAt: string;
  directives: CapabilityProtocolDirective[];
}

export function compileCapabilityProtocolContext(
  bundle: ProtocolBundle,
): CapabilityProtocolContext {
  if (!bundle || typeof bundle !== 'object') {
    throw new Error('Capability validation requires an applicable Protocol Tool bundle.');
  }
  if (typeof bundle.eventId !== 'string' || !bundle.eventId.trim()) {
    throw new Error('Capability validation requires a Protocol Tool bundle with an eventId.');
  }
  if (
    typeof bundle.loadedAt !== 'string' ||
    !bundle.loadedAt.trim() ||
    Number.isNaN(Date.parse(bundle.loadedAt))
  ) {
    throw new Error('Capability validation requires a Protocol Tool bundle with a valid loadedAt timestamp.');
  }
  if (!Array.isArray(bundle.protocols) || bundle.protocols.length === 0) {
    throw new Error('Capability validation requires at least one applicable protocol directive.');
  }

  const directives = bundle.protocols.map((protocol) => {
    if (
      !protocol ||
      typeof protocol !== 'object' ||
      typeof protocol.id !== 'string' ||
      !protocol.id.trim() ||
      !Array.isArray(protocol.rules) ||
      protocol.rules.some((rule) => typeof rule !== 'string' || !rule.trim())
    ) {
      throw new Error('Capability validation received a malformed protocol directive.');
    }
    if (!Number.isFinite(protocol.priority)) {
      throw new Error(
        `Capability validation requires a finite priority for protocol ${protocol.id}.`,
      );
    }
    return {
      id: protocol.id,
      priority: protocol.priority,
      rules: [...protocol.rules],
    };
  });
  directives.sort((left, right) => right.priority - left.priority || left.id.localeCompare(right.id));

  return {
    eventId: bundle.eventId,
    loadedAt: bundle.loadedAt,
    directives,
  };
}
