---
name: impl-frontend
description: Frontend implementation skill for large UI features. Pre-analyzes codebase, then delegates to the frontend-developer agent for the full 5-step protocol (analyze → plan → approve → implement → review). Use this skill when the user wants to build UI components, add pages, create hooks, or implement frontend features that touch more than 7 files. Trigger on "프론트엔드 구현", "컴포넌트 만들어", "페이지 추가", "UI 구현", "프론트 피처", or any request that clearly requires substantial new React/TypeScript code. For smaller frontend changes, prefer impl-light.
---

# Frontend Implementation

This skill orchestrates large frontend implementations by delegating to the `frontend-developer` agent after thorough pre-analysis. The skill's job is context gathering and handoff — the agent handles the actual implementation.

## Why pre-analysis matters

The frontend-developer agent has its own checklist (TanStack Query, useEffect restrictions, Tailwind patterns). But it doesn't know about the design direction or which existing patterns to follow unless we tell it. Good pre-analysis means the agent spends time implementing, not re-discovering the codebase.

## Execution

### 1. Parse requirements from the user's request

### 2. Design Direction

Before any code analysis, establish the visual direction. Read `.claude/rules/frontend-design.md` and answer:

- **Purpose**: What problem does this UI solve? Who uses it?
- **Tone**: What feeling should this feature convey? (LivePick default: energetic + trustworthy)
- **Key UI moment**: What's the one interaction the user will remember?
- **State visualization**: Which event/participation states need visual treatment?

This prevents the agent from producing generic UI. Include the design direction in the delegation prompt so the agent implements with aesthetic intent, not just functional correctness.

### 3. Pre-analyze the codebase

Search for related components, hooks, pages with Grep/Glob. Identify:
- Existing component patterns to replicate
- Shared hooks and utilities to reuse
- Design tokens and styling conventions already in use

### 4. Delegate to `frontend-developer` agent

Include in the delegation:
- Requirements
- Design direction from step 2
- Pre-analysis results (related files, patterns, reusable code)
- Instruction: "Use pre-analysis as starting point. Read `frontend-design.md` rules for visual guidelines. Verify and fill gaps rather than searching from scratch."

### 5. Report the final result to the user

## When to use something else

| Situation | Better choice |
|-----------|--------------|
| Under 7 files total | `/impl-light` — faster, no agent overhead |
| Need backend too | `/impl-fullstack` — coordinates both sides |
| Need to research approach | `/discuss` first |
| Need architecture design | `/design-feature` first |
