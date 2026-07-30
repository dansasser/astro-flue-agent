import {
  createAgent,
  type AgentRouteHandler,
  type SandboxFactory,
} from '@flue/runtime';
import { local } from '@flue/runtime/node';
import {
  createGoromboRuntimePaths,
  resolveCodingWorkspaceRoot,
  resolveGoromboRuntimeRoot,
} from '../core/config/runtime-root.js';
import { configureRuntimeModels } from '../core/models/index.js';
import {
  composeWorkspaceInstructions,
  resolveWorkspaceDirectory,
} from '../workspace-loader.js';
import { calculateContextBudget } from '../engine/session/context-budget.js';
import {
  addKnowledgeTool,
  loadProtocolsTool,
  retrieveMemoryTool,
  generateImageTool,
  recordImageArtifactTool,
  listImageArtifactsTool,
  createChecklistTool,
  updateChecklistTool,
  addChecklistItemTool,
  updateChecklistItemTool,
  moveChecklistItemTool,
  archiveChecklistTool,
  listChecklistsTool,
  createTodoTool,
  completeTodoTool,
  updateTodoTool,
  cancelTodoTool,
  listTodosTool,
  storeSessionNoteTool,
  updateSessionNoteTool,
  archiveSessionNoteTool,
  listSessionNotesTool,
  searchMemoryRecordsTool,
  scheduleCreateTool,
  schedulePauseTool,
  scheduleResumeTool,
  scheduleUpdateTool,
  scheduleDeleteTool,
  scheduleListTool,
  scheduleGetTool,
  scheduleRunNowTool,
  scheduleRunsTool,
} from '../engine/tools/index.js';
import type { AgentModelCard } from '../core/models/types.js';
import { telegramReplyTool } from '../channels/telegram.js';
import { createCodingWorkerSubagent } from '../engine/workers/coding-worker/coding-worker.js';
import { createCapabilityManagerSubagent } from '../engine/workers/capability-manager/capability-manager.js';
import { createResearcherSubagent } from '../engine/workers/researcher/researcher.js';
import { createCapabilityStore } from '../engine/capabilities/capability-store.js';
import { loadUserCapabilities } from '../engine/capabilities/capability-loader.js';
import { materializeCapability } from '../engine/capabilities/skill-materializer.js';
import { connectUserMcpServers } from '../engine/capabilities/mcp-broker.js';
import { connectBuiltinMcpServers } from '../engine/capabilities/builtin-mcp.js';
import { loadUserTools } from '../engine/capabilities/tool-loader.js';
import { loadUserWorkers } from '../engine/capabilities/worker-loader.js';
import greetingPreflight from '../skills/greeting-preflight/SKILL.md' with { type: 'skill' };

export const route: AgentRouteHandler = async (_c, next) => next();

export const orchestratorInstructions = [
  composeWorkspaceInstructions({
    workspaceDir: resolveWorkspaceDirectory('workspace'),
    title: 'Main Agent Workspace Instructions',
  }),
  createOrchestratorRuntimeCapabilityBlock(),
].join('\n\n');

export default createAgent(async ({ env }) => {
  const models = configureRuntimeModels(env);
  const selectedModelCard = models.selectedModelCard;
  const runtimeRoot = resolveGoromboRuntimeRoot({ env });
  const runtimePaths = createGoromboRuntimePaths(runtimeRoot);
  const codingWorker = await createCodingWorkerSubagent({
    workspaceRoot: resolveCodingWorkerWorkspaceRoot(env),
    stateRoot: runtimePaths.codingWorkerState,
    env: createCodingWorkerToolEnv(env, runtimeRoot),
  });
  const capabilityManager = createCapabilityManagerSubagent({ env });
  const researcher = createResearcherSubagent();
  const sandbox = createOrchestratorSandbox(runtimePaths.packagedServer);

  const builtInTools = [
    loadProtocolsTool,
    retrieveMemoryTool,
    addKnowledgeTool,
    createChecklistTool,
    updateChecklistTool,
    addChecklistItemTool,
    updateChecklistItemTool,
    moveChecklistItemTool,
    archiveChecklistTool,
    listChecklistsTool,
    createTodoTool,
    completeTodoTool,
    updateTodoTool,
    cancelTodoTool,
    listTodosTool,
    storeSessionNoteTool,
    updateSessionNoteTool,
    archiveSessionNoteTool,
    listSessionNotesTool,
    searchMemoryRecordsTool,
    generateImageTool,
    recordImageArtifactTool,
    listImageArtifactsTool,
    scheduleCreateTool,
    schedulePauseTool,
    scheduleResumeTool,
    scheduleUpdateTool,
    scheduleDeleteTool,
    scheduleListTool,
    scheduleGetTool,
    scheduleRunNowTool,
    scheduleRunsTool,
    telegramReplyTool,
  ];
  const builtInSubagents = [capabilityManager, codingWorker, researcher];

  const userCapabilities = loadUserCapabilitiesFromStore(env);
  const [builtinMcpResult, mcpResult, toolResult, workerResult] = await Promise.all([
    connectBuiltinMcpServers(),
    connectUserMcpServers(userCapabilities.mcp, env),
    loadUserTools(userCapabilities.tools, env),
    loadUserWorkers(userCapabilities.workers, env),
  ]);
  const userTools = [...builtinMcpResult.tools, ...mcpResult.tools, ...toolResult.tools];
  const userSubagents: typeof builtInSubagents = [...workerResult.profiles];

  return {
    model: selectedModelCard.specifier,
    instructions: orchestratorInstructions,
    compaction: createFlueCompactionConfig(selectedModelCard),
    skills: [greetingPreflight],
    tools: [...builtInTools, ...userTools],
    subagents: [...builtInSubagents, ...userSubagents],
    cwd: runtimePaths.packagedServer,
    sandbox,
  };
});

export function createOrchestratorSandbox(packagedServerRoot: string): SandboxFactory {
  return {
    ...local({ cwd: packagedServerRoot }),
    tools: () => [],
  };
}

/**
 * Creates the orchestrator compaction policy from the selected model card budget.
 */
export function createFlueCompactionConfig(modelCard: AgentModelCard): {
  reserveTokens: number;
  keepRecentTokens: number;
  model: string;
} {
  const budget = calculateContextBudget(modelCard);

  return {
    reserveTokens: budget.compactionReserveTokens,
    keepRecentTokens: budget.keepRecentTokens,
    model: modelCard.specifier,
  };
}

export function resolveCodingWorkerWorkspaceRoot(env: Record<string, unknown>): string {
  return resolveCodingWorkspaceRoot({ env });
}

function createCodingWorkerToolEnv(
  env: Record<string, unknown>,
  runtimeRoot: string,
): Record<string, string | undefined> {
  return {
    GOROMBO_RUNTIME_ROOT: runtimeRoot,
    GITHUB_PERSONAL_ACCESS_TOKEN: readOptionalEnv(env, 'GITHUB_PERSONAL_ACCESS_TOKEN'),
  };
}

function readOptionalEnv(env: Record<string, unknown>, key: string): string | undefined {
  const value = env[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function loadUserCapabilitiesFromStore(env: Record<string, unknown>) {
  let store;
  try {
    store = createCapabilityStore({});
    const caps = loadUserCapabilities({ store });
    for (const capability of [...caps.skills, ...caps.tools, ...caps.workers]) {
      try {
        materializeCapability({ record: capability, env });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[capabilities] Failed to materialize ${capability.kind} ${capability.id}: ${message}`);
      }
    }
    return caps;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[capabilities] Failed to load user capabilities: ${message}`);
    return { skills: [], tools: [], workers: [], mcp: [] };
  } finally {
    store?.close();
  }
}

function createOrchestratorRuntimeCapabilityBlock(): string {
  return `# Runtime Capabilities

The following capabilities are actually attached to this main agent at runtime:

- Tool: \`load_protocols\`
- Tool: \`retrieve_memory\`
- Tool: \`add_knowledge\`
- Tool: \`create_checklist\` / \`update_checklist\` / \`archive_checklist\` / \`list_checklists\`
- Tool: \`add_checklist_item\` / \`update_checklist_item\` / \`move_checklist_item\`
- Tool: \`create_todo\` / \`update_todo\` / \`complete_todo\` / \`cancel_todo\` / \`list_todos\`
- Tool: \`store_session_note\` / \`update_session_note\` / \`archive_session_note\` / \`list_session_notes\`
- Tool: \`search_memory_records\`
- Tool: \`generate_image\`
- Tool: \`record_image_artifact\`
- Tool: \`list_image_artifacts\`
- Tool: \`schedule_create\` / \`schedule_pause\` / \`schedule_resume\` / \`schedule_update\` / \`schedule_delete\` / \`schedule_list\` / \`schedule_get\` / \`schedule_run_now\` / \`schedule_runs\` (scheduled/recurring/one-shot agent turns; ownerScope is derived from the trusted eventId and enforced on every non-create op)
- Tool: \`telegram_reply\` (when TELEGRAM_BOT_TOKEN is configured)
- MCP: \`astro-docs\` (built-in — search Astro framework documentation via \`mcp__astro-docs__search_astro_docs\`)
- Subagent: \`researcher\`
- Subagent: \`coding-worker\` (repository inspection/editing, shell/test/debug, code review, repository lifecycle, approval-gated git operations, and GitHub work)
- Subagent: \`capability-manager\` (validated, approval-gated runtime skill, tool, worker, and MCP lifecycle administration)

Use the configured model card from the project model registry. Worker-backed capabilities count as capabilities of this main agent. An attached capability does not establish that a specific provider account is authenticated, a repository is authorized, or an operation completed; require responsible worker/tool evidence.

For any current, external, web, source-backed, or research task, delegate with the Flue task tool using agent: "researcher". Do not perform web search directly and do not call web-capable retrieval tools from the main agent. The researcher owns \`web_research\`, including basic, standard, and deep research modes.

For coding-related work, including repository work and GitHub work through the Coding Worker, delegate with the Flue task tool using agent: "coding-worker". Do not call coding-worker internal subagents directly. The coding-worker lead decides whether triage, implementer, test-debug, code-review, GitHub/PR, or future worker-local subagents are needed. Surface coding-worker public progress events and structured results to the user when available. GitHub authentication is trusted Coding Worker runtime configuration through the official GitHub MCP; never put a PAT in delegation text or model-visible context.

For runtime capability lifecycle requests, delegate with the Flue task tool using agent: "capability-manager" and include the complete parsed \`protocolBundle\` from \`load_protocols\`. The main agent does not own direct capability mutation tools. The capability-manager owns list, inspect, validate, add, update, enable, disable, and remove through the shared lifecycle service and trusted approval service. Capability validation and mutations fail closed without the applicable protocol bundle.

Use \`load_protocols\` before final reasoning. The result is a JSON string containing a \`ProtocolBundle\`. Parse it and include the parsed object as \`protocolBundle\` in the task input when delegating to \`coding-worker\` or \`capability-manager\`. Each worker applies directives from \`protocolBundle.protocols[].rules\` to its validation and execution path.

Use \`retrieve_memory\` when stored conversation, project, or user context would materially help. Pass delegated findings into the final answer, and mention \`providerFailures\` when they affect confidence.`;
}
