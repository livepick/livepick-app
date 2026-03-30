---
name: impl-fullstack
description: Fullstack implementation orchestrator for features requiring both backend API and frontend UI. Defines API contracts, establishes design direction, then sequentially delegates to backend-go-developer and frontend-developer agents. Use this skill whenever a feature needs both server endpoints and client-side code — "풀스택 구현", "API+UI 같이", "백엔드+프론트", "양쪽 구현", or any feature where the user clearly needs both sides built together. For small both-side changes under 7 files total, prefer impl-light.
---

# Fullstack Feature Development

This skill is an **orchestrator** — it coordinates backend and frontend without writing code itself. Its unique value is defining the contract between the two sides and ensuring design coherence across the stack.

## Why sequential, not parallel

The frontend depends on the backend API being real and working. If the backend fails to build, starting frontend work wastes time and creates confusion about which types and endpoints actually exist.

## Workflow

### STEP 1: Feature Analysis + API Contract + Design Direction

Three outputs from this step — all needed before any code:

**API Contract**: REST endpoints, request/response shapes, error codes, status types. This is the single source of truth between backend and frontend.

**Design Direction**: Read `.claude/rules/frontend-design.md` and establish:
- Purpose and tone for the UI side of this feature
- Key UI moments (what the user will interact with most)
- Event status visualization conventions to follow
- How the data shapes from the API contract translate to UI components

**Domain Model**: Which entities are involved, what states they go through, how they relate.

### STEP 2: Integrated Plan → User Approval

Present:
- API contract (endpoints, types, errors)
- Backend file list and implementation order
- Frontend file list with design direction notes
- How the pieces connect (which frontend component calls which endpoint)

Get sign-off before any code. The user might want to adjust the API shape, add an endpoint, or change the UI approach.

### STEP 3: Backend → Agent(backend-go-developer)

Delegate with requirements + API contract. Wait for completion and verify the build passes. If the build fails, fix before proceeding — broken backend means broken frontend assumptions.

### STEP 4: Frontend → Agent(frontend-developer)

Delegate with:
- Requirements + API contract
- **Design direction** from STEP 1 (the agent needs this to produce intentional UI, not generic cards)
- Actual implemented endpoint details from STEP 3 (real URLs, real response shapes)

This ensures the frontend uses real types and URLs, and has aesthetic direction, not just functional requirements.

### STEP 5: Integration Verification

Check cross-boundary consistency:
- Frontend API calls match backend endpoint URLs and methods
- Request/response TypeScript types match Go struct shapes
- Error codes the frontend handles actually exist in the backend
- Status values used in UI match the backend's typed constants

### STEP 6: Report

Summary of all changes, both sides, with build status, integration verification results, and any notes.

## Important constraints

- Never write code directly — delegate to specialist agents who have their own quality checklists
- Never start frontend while backend is failing — broken assumptions cascade
- Never skip the API contract — it prevents the two sides from drifting apart
- Never skip design direction — without it, the frontend agent produces generic UI
- Never skip integration verification — individual reviews don't catch cross-boundary mismatches
