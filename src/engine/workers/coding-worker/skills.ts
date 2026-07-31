import type { Skill } from '@flue/runtime';
import capabilityDesign from './skills/capability-design/SKILL.md' with { type: 'skill' };
import mcpAuthoring from './skills/mcp-authoring/SKILL.md' with { type: 'skill' };
import skillAuthoring from './skills/skill-authoring/SKILL.md' with { type: 'skill' };
import toolAuthoring from './skills/tool-authoring/SKILL.md' with { type: 'skill' };
import workerAuthoring from './skills/worker-authoring/SKILL.md' with { type: 'skill' };

export const codingWorkerSkills: Skill[] = [
  {
    name: 'coding-worker.triage-loop',
    description:
      'Worker-local process guidance for classifying coding tasks, deciding which internal coding subagents are needed, and producing a public triage summary.',
  },
  {
    name: 'coding-worker.code-change-loop',
    description:
      'Worker-local process guidance for planning, editing, focused verification, debugging, and packaging code changes.',
  },
  {
    name: 'coding-worker.ci-debug-loop',
    description:
      'Worker-local process guidance for reading check failures, choosing focused reruns, debugging, and escalating unresolved CI blockers.',
  },
  {
    name: 'coding-worker.code-review-loop',
    description:
      'Worker-local process guidance for an independent diff review that checks requirements, regression risk, and verification evidence.',
  },
  {
    name: 'coding-worker.github-pr-loop',
    description:
      'Worker-local process guidance for GitHub issue, PR, checks, comments, branch, commit, push, and approval-aware publishing workflows.',
  },
  capabilityDesign,
  skillAuthoring,
  toolAuthoring,
  workerAuthoring,
  mcpAuthoring,
];

export function createCodingWorkerSkillCapabilityBlock(): string {
  return `# Worker-Local Skills

The coding worker has these process skills registered as worker-local guidance:

- coding-worker.triage-loop
- coding-worker.code-change-loop
- coding-worker.ci-debug-loop
- coding-worker.code-review-loop
- coding-worker.github-pr-loop
- capability-design
- skill-authoring
- tool-authoring
- worker-authoring
- mcp-authoring

The capability-authoring skills require the applicable protocol bundle before classification, validation, security checks, packaging, or handoff. Skills describe process and judgment. They do not replace tools, the Flue local sandbox, verification evidence, approval gates, or public progress events.`;
}
