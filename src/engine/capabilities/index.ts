export type {
  CapabilityConfig,
  CapabilityInstalledBy,
  CapabilityKind,
  CapabilityRecord,
  CapabilitySource,
  CapabilityStore,
} from '../../engine/capabilities/types.js';
export { createCapabilityStore } from '../../engine/capabilities/capability-store.js';
export type { CreateCapabilityStoreOptions } from '../../engine/capabilities/capability-store.js';
export {
  loadPromotedUserCapabilities,
  loadUserCapabilities,
  resolveCapabilitiesDir,
  resolveCapabilityPath,
  assertSafeCapabilityId,
} from '../../engine/capabilities/capability-loader.js';
export type {
  CapabilityLoadFailure,
  CapabilityLoaderOptions,
  LoadedPromotedUserCapabilities,
  LoadedUserCapabilities,
  PromotedCapabilityLoaderOptions,
} from '../../engine/capabilities/capability-loader.js';
export { materializeCapability } from '../../engine/capabilities/skill-materializer.js';
export type { MaterializeOptions, MaterializeResult } from '../../engine/capabilities/skill-materializer.js';
export { connectUserMcpServers } from '../../engine/capabilities/mcp-broker.js';
export type { McpBrokerResult } from '../../engine/capabilities/mcp-broker.js';
export { loadUserTools } from '../../engine/capabilities/tool-loader.js';
export type { ToolLoaderResult } from '../../engine/capabilities/tool-loader.js';
export { loadUserWorkers } from '../../engine/capabilities/worker-loader.js';
export type { WorkerLoaderResult } from '../../engine/capabilities/worker-loader.js';
export { reconcileCapabilitiesFromConfig } from '../../engine/capabilities/capability-config-reconcile.js';
export type { ReconcileResult } from '../../engine/capabilities/capability-config-reconcile.js';
export { loadBuiltinRegistry, isBuiltinName, getBuiltinNames, resetBuiltinRegistryCache } from '../../engine/capabilities/builtin-registry.js';
export type { BuiltinRegistry } from '../../engine/capabilities/builtin-registry.js';
export { checkNameCollision } from '../../engine/capabilities/collision-check.js';
export type { CollisionResult } from '../../engine/capabilities/collision-check.js';
export { connectBuiltinMcpServers, getBuiltinMcpIds, BUILTIN_MCP_ASTRO_DOCS_ID } from '../../engine/capabilities/builtin-mcp.js';
export type { BuiltinMcpResult } from '../../engine/capabilities/builtin-mcp.js';
export {
  CapabilityLifecycleService,
  inferCapabilitySource,
} from '../../engine/capabilities/capability-lifecycle-service.js';
export { compileCapabilityProtocolContext } from '../../engine/capabilities/capability-protocol-context.js';
export type {
  CapabilityProtocolContext,
  CapabilityProtocolDirective,
} from '../../engine/capabilities/capability-protocol-context.js';
export type {
  CapabilityActivationState,
  CapabilityLifecycleAddInput,
  CapabilityLifecycleOperation,
  CapabilityLifecycleProgressEvent,
  CapabilityLifecycleResult,
  CapabilityLifecycleServiceOptions,
  CapabilityLifecycleUpdateInput,
  CapabilityValidationResult,
} from '../../engine/capabilities/capability-lifecycle-service.js';
