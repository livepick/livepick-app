---
name: design-review
description: Design document review skill. Validates a design document against project rules for logical consistency, rule compliance, missing error cases, and security gaps. Use this skill when the user has a design document and wants it reviewed — "설계 검토", "설계 리뷰", "문서 검토", "design review", or after completing design-feature and wanting a quality check before implementation.
---

# Design Review

Read a design document and verify it against project rules. Catching issues here is cheap — catching them after implementation is expensive.

## Workflow

1. **Read the design document** (typically `.claude/feat/*.md`)
2. **Read relevant rules** — `go-backend.md`, `api-design.md`, `frontend-react.md`, `frontend-design.md`, `error-handling.md` depending on scope
3. **Review against checklist**
4. **Report findings**

## Review Checklist

### Architecture
- Handler → Service → Repository layer separation maintained
- REST API patterns follow `api-design.md` (URL conventions, response format)
- Error codes follow `error-handling.md` (AppError constants, HTTP mapping)

### API Design
- Correct HTTP methods for each operation
- Consistent request/response shapes
- Pagination specified for list endpoints
- Error cases enumerated

### Frontend (if applicable)
- TanStack Query for data fetching (not useEffect)
- Design Direction section present — tone, key moments, state visualization
- Responsive design considered (mobile-first grid system)
- No "AI slop" indicators (generic purple gradients, uniform cards, no visual hierarchy)

### Completeness
- All user flows have corresponding endpoints
- Error and edge cases handled
- Empty states considered
- Auth/permissions specified where needed

## Report

```markdown
## Design Review Results
- **Verdict**: PASS / FAIL
- **Issues**: N (CRITICAL: N, WARNING: N, INFO: N)

| # | Severity | Area | Issue | Rule | Suggestion |
|---|----------|------|-------|------|------------|
```

- **CRITICAL**: Rule violation, security gap, logical contradiction → must fix
- **WARNING**: Missing item, recommended pattern not followed → should fix
- **INFO**: Improvement suggestion → optional
