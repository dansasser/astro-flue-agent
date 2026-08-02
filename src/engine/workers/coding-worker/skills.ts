import { defineSkill, type Skill } from '@flue/runtime';
import capabilityDesign from './skills/capability-design/SKILL.md';
import mcpAuthoring from './skills/mcp-authoring/SKILL.md';
import skillAuthoring from './skills/skill-authoring/SKILL.md';
import toolAuthoring from './skills/tool-authoring/SKILL.md';
import workerAuthoring from './skills/worker-authoring/SKILL.md';

export const codingWorkerSkills: Skill[] = [
  defineSkill({
    name: 'coding-worker-triage-loop',
    description:
      'Worker-local process guidance for classifying coding tasks, deciding which internal coding subagents are needed, and producing a public triage summary.',
    instructions:
      'Classify the request, identify the minimum required context, select only the necessary worker-local subagents, and emit a concise public triage summary before implementation.',
  }),
  defineSkill({
    name: 'coding-worker-code-change-loop',
    description:
      'Worker-local process guidance for planning, editing, focused verification, debugging, and packaging code changes.',
    instructions:
      'Plan the scoped change, use approval-gated edit tools, run focused verification first, debug failures within the bounded loop, and package exact evidence with the result.',
  }),
  defineSkill({
    name: 'coding-worker-ci-debug-loop',
    description:
      'Worker-local process guidance for reading check failures, choosing focused reruns, debugging, and escalating unresolved CI blockers.',
    instructions:
      'Read the complete failing check output, reproduce the narrow failure locally when possible, verify the root cause before editing, rerun the focused check, and escalate with exact evidence when blocked.',
  }),
  defineSkill({
    name: 'coding-worker-code-review-loop',
    description:
      'Worker-local process guidance for an independent diff review that checks requirements, regression risk, and verification evidence.',
    instructions:
      'Review the resulting diff independently against the request, architecture contracts, regression risks, and recorded verification. Return structured findings and reject completion while blockers remain.',
  }),
  defineSkill({
    name: 'coding-worker-github-pr-loop',
    description:
      'Worker-local process guidance for GitHub issue, PR, checks, comments, branch, commit, push, and approval-aware publishing workflows.',
    instructions:
      'Use the official GitHub capability for repository context and publishing. Keep commits focused, verify checks and review threads, require approval for writes, and never expose credentials.',
  }),
  capabilityDesign,
  skillAuthoring,
  toolAuthoring,
  workerAuthoring,
  mcpAuthoring,
];

export function createCodingWorkerSkillCapabilityBlock(): string {
  return `# Worker-Local Skills

The coding worker has these process skills registered as worker-local guidance:

- coding-worker-triage-loop
- coding-worker-code-change-loop
- coding-worker-ci-debug-loop
- coding-worker-code-review-loop
- coding-worker-github-pr-loop
- capability-design
- skill-authoring
- tool-authoring
- worker-authoring
- mcp-authoring

The capability-authoring skills require the applicable protocol bundle before classification, validation, security checks, packaging, or handoff. Skills describe process and judgment. They do not replace tools, the Flue local sandbox, verification evidence, approval gates, or public progress events.`;
}
