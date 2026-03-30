---
name: design-feature
description: Feature design skill that produces architecture documents ready for implementation. Creates design docs through code analysis, tech research, and iterative review. Use this skill whenever the user asks to design a feature, create a design document, plan architecture, or asks "how should we implement X" for any non-trivial feature. Trigger on "피처 설계", "설계 문서", "아키텍처 설계", "이 기능 어떻게 구현", "설계해줘", or when a feature clearly needs upfront planning before coding — new domain entities, multi-page flows, or features touching both backend and frontend.
---

# Feature Design

Produce an architecture design document for the requested feature. The deliverable is a finalized `.claude/feat/<feature-name>.md` file that implementation skills (`/impl-*`) can consume directly.

## Why design before code

Jumping straight into code for non-trivial features leads to rework. This skill forces a structured pass through requirements → analysis → research → design → review. Each step requires user approval because unvalidated design decisions compound into expensive mistakes downstream.

## Workflow

```
STEP 1: Requirements  →  STEP 2: Code Analysis  →  STEP 3: Tech Research
    ↓ [confirm]             ↓ [confirm]               ↓ [confirm]
STEP 4: Design Draft  →  STEP 5: Review  →  STEP 6: Final
    ↓ [confirm]             ↓ [confirm]
```

### STEP 1: Requirements Agreement

Clarify the feature with the user. Extract:
- Goal, user scenarios, scope (included/excluded), I/O, constraints, target (BE/FE/Both)
- Ask up to 4 specific questions at a time — "What's the scope?" is too vague; "Should closed events still show the join button (disabled)?" is useful
- Record "decide later" items as Open Items with current assumptions

### STEP 2: Code Analysis

Delegate to `codebase-analyst` agent. Before delegating:
1. Extract key symbols from STEP 1 requirements
2. Run 2-3 Grep searches to find entry points
3. Pass these to the agent with the confirmed requirements

Report: related files, impact scope, reusable assets, patterns to follow.

### STEP 3: Tech Research (skip if unnecessary)

Delegate to `tech-researcher` agent for decisions needing external evidence — library choices, API patterns, security approaches. If the feature fits entirely within established patterns, skip this step (user confirms).

### STEP 4: Design Draft

Synthesize STEP 2 + STEP 3 into a design document. For features with UI:
- Read `.claude/rules/frontend-design.md` and include a **Design Direction** section
- Specify the tone, key UI moments, and state visualization approach
- This ensures implementation agents produce intentional UI, not generic output

Document structure:
```markdown
# [Feature Name]
## 1. Overview (goal, scope, modules)
## 2. Design Direction (tone, key moments — for UI features)
## 3. Technical Decisions (choice + rationale)
## 4. API Design (endpoints, request/response, errors)
## 5. DB Design (schema, indexes — if applicable)
## 6. Frontend Design (components, state, flow)
## 7. Implementation Plan (files, order)
## 8. Security, Error Handling, Edge Cases
```

Save to `.claude/feat/<feature-name>.md`.

### STEP 5: Review

Check against `.claude/rules/*` for rule compliance, logical consistency, missing error cases, security gaps. Fix and re-review until clean.

### STEP 6: Final

Deliver the document path. Implementation starts in a **separate session** — point user to `/impl-fullstack`, `/impl-backend-go`, `/impl-frontend`, or `/impl-light`.

## Important constraints

- Never advance without user approval
- Never design without reading existing code first
- Never implement in the same session — context pollution degrades quality
- Always include Design Direction for features with UI
