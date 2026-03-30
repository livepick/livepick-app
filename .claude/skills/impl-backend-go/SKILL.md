---
name: impl-backend-go
description: Go backend implementation skill for substantial API work. Pre-analyzes codebase, then delegates to the backend-go-developer agent for the full 5-step protocol (analyze → design → approve → implement → review). Use this skill when the user wants to build new REST APIs, add Go services, create endpoints, or implement server-side features touching more than 7 files. Trigger on "백엔드 구현", "API 만들어", "Go 서비스", "핸들러 추가", "서버 구현", or any request needing substantial new Go code. For smaller backend changes, prefer impl-light.
---

# Go Backend Implementation

This skill orchestrates large backend implementations by delegating to the `backend-go-developer` agent. The skill's job is pre-analysis and handoff — the agent handles implementation autonomously with its own quality checklist.

## Why pre-analysis saves time

The backend-go-developer agent will explore the codebase in its STEP 1 regardless. But if we hand it a map of related files, existing patterns, and reusable code up front, it can focus on verifying and filling gaps rather than searching from scratch. This is especially valuable in a growing codebase where Grep results can be overwhelming without context.

## Execution

1. **Parse requirements** from the user's request
2. **Pre-analyze**: Grep/Glob for related handlers, services, repositories. Note which domain packages exist, what patterns they follow, and what can be reused.
3. **Delegate to `backend-go-developer` agent** with:
   - Requirements
   - Pre-analysis (related files, patterns, reusable code)
   - "Use these results as starting point. Verify and fill gaps in STEP 1."
4. **Agent executes autonomously**: Analyze → Design → User Approval → Implement → Review
5. **Report final result**

## When to use something else

| Situation | Better choice |
|-----------|--------------|
| Under 7 files total | `/impl-light` — no agent overhead |
| Need frontend too | `/impl-fullstack` — coordinates both sides |
| Need to research approach | `/discuss` first |
| Need architecture design | `/design-feature` first |
