---
name: skill-authoring
description: Use when creating or revising an application-owned or runtime-installable Flue Agent Skill for SIM-ONE.
---

# Skill Authoring

Load and apply the applicable protocol bundle before validation.

Create an Agent Skills-compatible directory whose name matches the `name` in `SKILL.md` frontmatter. Keep the name lowercase and hyphenated. Write a specific description that states when the skill applies.

Skills contain reusable workflow knowledge. They do not implement executable capability, mandatory runtime rules, or protocols. Reference attached tools when execution is required.

Use `coding_capability_scaffold` for a new package, `coding_capability_validate` for deterministic checks, and `coding_capability_prepare_handoff` for the typed `capability-manager` handoff. Preserve protocol evidence and keep source references portable and workspace-relative.
