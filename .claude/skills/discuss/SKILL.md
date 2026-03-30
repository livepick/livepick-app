---
name: discuss
description: Technical investigation and analysis skill. Runs code analysis and external research in parallel, then delivers a structured report with current state, option comparison, and recommendation. Use this skill when the user wants to explore a technical question before deciding on an approach — "이거 어떻게 하면 좋을까", "방법 비교", "기술 조사", "설계 방향", "어떤 라이브러리", "장단점", or any question where the user is weighing options rather than asking for code. Also trigger when the user seems uncertain about implementation approach, even if they don't explicitly ask for research. This skill investigates and recommends but never writes code.
---

# Discuss — Investigation + Analysis Report

Take a technical question, investigate it with evidence, and deliver a structured report. This skill produces analysis, not code — hand off to `/impl-*` skills when the user is ready to build.

## Why report-first

Starting with "which direction do you prefer?" wastes a round-trip. The user asked because they want analysis. Investigate immediately, present findings, then refine based on their reaction. The report itself starts the conversation.

## Execution

### Phase 1: Investigate (immediately, in parallel where possible)

Read the question and decide what's needed:

| Need | Action |
|------|--------|
| Understand existing code | Delegate to `codebase-analyst` agent |
| Research external docs/practices | Delegate to `tech-researcher` agent |
| Both | Launch both in parallel (`run_in_background`) |
| Neither (pure reasoning) | Proceed directly to Phase 2 |

### Phase 2: Synthesize + Report

```markdown
## Current State
### Code (if investigated)
- [file:line] How things work today, gaps or issues found

### Technical Context (if researched)
- Key findings from official docs / best practices

## Options
| Criteria | Option A | Option B |
|----------|----------|----------|
| Complexity | ... | ... |
| Performance | ... | ... |
| LivePick fit | ... | ... |

## Recommendation
**Recommended**: [Option] — [evidence-based reasoning]
**Next step**: → `/design-feature` or `/impl-*`
```

### Phase 3: Follow-up (only if user asks)

"Dig deeper on X" → targeted investigation. "Let's go with this" → point to the right implementation skill.

## Quality principles

- Every claim needs a code reference (`file:line`) or doc citation — "it seems like..." is not analysis
- Frame against LivePick's actual stack (Go REST + React + Cloudflare + AWS EC2)
- Present at least 2 options with tradeoffs, unless the answer is genuinely obvious
- Never change code in this skill — hand off to `/impl-*` or `/fix-light`
