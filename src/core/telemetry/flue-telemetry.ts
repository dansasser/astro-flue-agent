import { observe, type FlueEvent } from '@flue/runtime';

export interface TelemetryEventSummary {
  type: FlueEvent['type'];
  timestamp?: string;
  eventIndex?: number;
  instanceId?: string;
  submissionId?: string;
  agentName?: string;
  harness?: string;
  session?: string;
  parentSession?: string;
  taskId?: string;
  operationId?: string;
  turnId?: string;
  agent?: string;
  toolName?: string;
  operationKind?: string;
  durationMs?: number;
  isError?: boolean;
  usage?: { input?: number; output?: number; totalTokens?: number };
}

export interface TelemetryExecutionSummary {
  executionId: string;
  instanceId?: string;
  submissionId?: string;
  eventCount: number;
  delegatedToResearcher: boolean;
  calledWebResearch: boolean;
  taskStarts: TelemetryEventSummary[];
  toolCalls: TelemetryEventSummary[];
  operations: TelemetryEventSummary[];
  errors: TelemetryEventSummary[];
  events: TelemetryEventSummary[];
}

export interface TelemetrySnapshot {
  executions: TelemetryExecutionSummary[];
  unscopedEventCount: number;
}

export interface MemoryMutationEvent {
  type: 'memory_mutation';
  timestamp: string;
  toolName: string;
  runId?: string;
  agentName: string;
  recordId: string;
  kind: 'checklist' | 'todo' | 'session_note';
  scopeKeys: {
    actorId?: string;
    conversationId?: string;
    projectId?: string;
    threadId?: string;
    global?: boolean;
  };
  updatedBy: string;
}

export interface MemoryMutationSnapshot {
  mutations: MemoryMutationEvent[];
}

export class FlueTelemetryStore {
  private readonly eventsByExecutionId = new Map<string, TelemetryEventSummary[]>();
  private readonly unscopedEvents: TelemetryEventSummary[] = [];
  private readonly memoryMutations: MemoryMutationEvent[] = [];
  private readonly pendingMutations: Array<() => void> = [];
  private mutationLocked = false;

  constructor(
    private readonly options: {
      maxExecutions?: number;
      maxEventsPerExecution?: number;
      maxUnscopedEvents?: number;
      maxMemoryMutations?: number;
    } = {},
  ) {}

  record(event: FlueEvent): void {
    this.withMutationLock(() => this.recordLocked(event));
  }

  recordMemoryMutation(event: MemoryMutationEvent): void {
    this.withMutationLock(() => {
      this.memoryMutations.push(structuredClone(event));
      trimArray(this.memoryMutations, this.options.maxMemoryMutations ?? 500);
    });
  }

  memoryMutationSnapshot(): MemoryMutationSnapshot {
    return { mutations: this.memoryMutations.map((event) => structuredClone(event)) };
  }

  getExecutionSummary(executionId: string): TelemetryExecutionSummary | undefined {
    const events = this.eventsByExecutionId.get(executionId);
    return events ? summarizeExecution(executionId, events) : undefined;
  }

  snapshot(): TelemetrySnapshot {
    return {
      executions: [...this.eventsByExecutionId.entries()].map(([executionId, events]) =>
        summarizeExecution(executionId, events)),
      unscopedEventCount: this.unscopedEvents.length,
    };
  }

  reset(): void {
    this.withMutationLock(() => {
      this.eventsByExecutionId.clear();
      this.unscopedEvents.length = 0;
      this.memoryMutations.length = 0;
    });
  }

  private recordLocked(event: FlueEvent): void {
    const summary = summarizeFlueEvent(event);
    if (!summary) {
      return;
    }
    const executionId = summary.submissionId ?? summary.instanceId;
    if (!executionId) {
      this.unscopedEvents.push(summary);
      trimArray(this.unscopedEvents, this.options.maxUnscopedEvents ?? 200);
      return;
    }
    const events = this.eventsByExecutionId.get(executionId) ?? [];
    events.push(summary);
    trimArray(events, this.options.maxEventsPerExecution ?? 500);
    this.eventsByExecutionId.delete(executionId);
    this.eventsByExecutionId.set(executionId, events);
    while (this.eventsByExecutionId.size > (this.options.maxExecutions ?? 100)) {
      const oldest = this.eventsByExecutionId.keys().next().value as string | undefined;
      if (!oldest) break;
      this.eventsByExecutionId.delete(oldest);
    }
  }

  private withMutationLock(mutation: () => void): void {
    if (this.mutationLocked) {
      this.pendingMutations.push(mutation);
      return;
    }
    this.mutationLocked = true;
    try {
      mutation();
      let pending = this.pendingMutations.shift();
      while (pending) {
        pending();
        pending = this.pendingMutations.shift();
      }
    } finally {
      this.mutationLocked = false;
    }
  }
}

export const flueTelemetryStore = new FlueTelemetryStore();

export function recordMemoryMutationEvent(event: MemoryMutationEvent): void {
  flueTelemetryStore.recordMemoryMutation(event);
}

export function summarizeTelemetryExecutionFromEvents(
  executionId: string,
  events: unknown[],
): TelemetryExecutionSummary | undefined {
  const summaries = events
    .filter(isFlueEvent)
    .map(summarizeFlueEvent)
    .filter((event): event is TelemetryEventSummary => Boolean(event));
  return summaries.length ? summarizeExecution(executionId, summaries) : undefined;
}

let observerUnsubscribe: (() => void) | undefined;

export function registerFlueTelemetryObserver(): void {
  if (!observerUnsubscribe) {
    observerUnsubscribe = observe((event) => flueTelemetryStore.record(event));
  }
}

function summarizeExecution(
  executionId: string,
  events: TelemetryEventSummary[],
): TelemetryExecutionSummary {
  const taskStarts = events.filter((event) => event.type === 'task_start');
  const toolCalls = events.filter((event) => event.type === 'tool_start' || event.type === 'tool');
  const operations = events.filter((event) =>
    event.type === 'operation_start' || event.type === 'operation');
  return {
    executionId,
    ...(events.find((event) => event.instanceId)?.instanceId
      ? { instanceId: events.find((event) => event.instanceId)?.instanceId }
      : {}),
    ...(events.find((event) => event.submissionId)?.submissionId
      ? { submissionId: events.find((event) => event.submissionId)?.submissionId }
      : {}),
    eventCount: events.length,
    delegatedToResearcher: taskStarts.some((event) => event.agent === 'researcher'),
    calledWebResearch: toolCalls.some((event) => event.toolName === 'web_research'),
    taskStarts,
    toolCalls,
    operations,
    errors: events.filter((event) => event.isError),
    events,
  };
}

function summarizeFlueEvent(event: FlueEvent): TelemetryEventSummary | undefined {
  if (!shouldKeepEvent(event)) {
    return undefined;
  }
  return {
    type: event.type,
    timestamp: event.timestamp,
    eventIndex: event.eventIndex,
    instanceId: event.instanceId,
    submissionId: event.submissionId,
    agentName: event.agentName,
    harness: event.harness,
    session: event.session,
    parentSession: event.parentSession,
    taskId: event.taskId,
    operationId: event.operationId,
    turnId: event.turnId,
    agent: readEventString(event, 'agent'),
    toolName: readEventString(event, 'toolName'),
    operationKind: readEventString(event, 'operationKind'),
    durationMs: readEventNumber(event, 'durationMs'),
    isError: readEventBoolean(event, 'isError'),
    usage: readUsage(event),
  };
}

function shouldKeepEvent(event: FlueEvent): boolean {
  return [
    'submission_queued',
    'submission_running',
    'submission_recovery',
    'submission_settled',
    'agent_start',
    'agent_end',
    'turn_start',
    'turn_request',
    'turn',
    'tool_start',
    'tool',
    'task_start',
    'task',
    'operation_start',
    'operation',
    'compaction_start',
    'compaction',
    'log',
  ].includes(event.type);
}

function readUsage(event: FlueEvent): TelemetryEventSummary['usage'] {
  const usage = 'usage' in event ? event.usage : undefined;
  return usage ? {
    input: usage.input,
    output: usage.output,
    totalTokens: usage.totalTokens,
  } : undefined;
}

function readEventString(event: FlueEvent, key: string): string | undefined {
  const value = (event as Record<string, unknown>)[key];
  return typeof value === 'string' ? value : undefined;
}

function readEventNumber(event: FlueEvent, key: string): number | undefined {
  const value = (event as Record<string, unknown>)[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function readEventBoolean(event: FlueEvent, key: string): boolean | undefined {
  const value = (event as Record<string, unknown>)[key];
  return typeof value === 'boolean' ? value : undefined;
}

function isFlueEvent(event: unknown): event is FlueEvent {
  return Boolean(event && typeof event === 'object' && !Array.isArray(event)
    && typeof (event as { type?: unknown }).type === 'string');
}

function trimArray<T>(values: T[], maxLength: number): void {
  if (values.length > maxLength) {
    values.splice(0, values.length - maxLength);
  }
}
