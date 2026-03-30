---
name: fix-light
description: Lightweight bug fix skill. Investigates bugs through code tracing, identifies root cause, and fixes directly in main context. Use this skill when the user reports a bug, error, or unexpected behavior — "버그 수정", "에러 나", "이거 안돼", "왜 안되지", "TypeError", "500 에러", "안 보여", or anything that suggests something isn't working as expected. For bugs spanning more than 5 files or requiring architectural changes, escalate to design-feature + impl-*.
---

# Bug Fix

Investigate and fix bugs by tracing the code to find the root cause. The goal is fixing the actual problem — not just suppressing the symptom with a null check or try-catch.

## Why root cause matters

A symptom patch (adding `|| []`, wrapping in try-catch) creates debt that compounds. The same class of bug will reappear in a different place. Finding the actual cause takes slightly longer but prevents recurring issues.

## Workflow

### STEP 1: Investigate

1. **Collect symptoms**: error message, stack trace, reproduction conditions
2. **Read relevant rules** for the domain being fixed
3. **Trace the code**: from the error point, trace backward (caller → caller's caller) and forward (where the result goes). Use Grep to find all call sites.
4. **Form hypotheses**: at least 1, ideally 2-3. For each, note what evidence would confirm it.
5. **Search for same pattern**: Grep for the same bug pattern elsewhere — if it exists in one place, it probably exists in others

If the bug spans 5+ files or needs structural changes → escalate to `/design-feature` + `/impl-*`.

### STEP 2: Fix Plan → User Approval

Present:
- **Root cause**: what's wrong and why, with code evidence
- **Same-pattern search results**: other places with the same issue
- **Fix plan**: files, changes, reasons

Get approval before changing anything — the user might know context that changes the approach.

### STEP 3: Fix

Apply the approved changes. Also fix same-pattern occurrences found in STEP 1. Run the build to verify.

### STEP 4: Verify + Report

- Build passes
- Related tests pass (if they exist)
- Same-pattern fixes applied
- Report: what was wrong, what was changed, verification status
