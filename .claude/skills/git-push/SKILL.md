---
name: git-push
description: Git commit and push automation. Reviews changes, generates a conventional commit message, and pushes after user approval. Use when the user wants to save work to remote — "커밋해줘", "푸시해줘", "커밋하고 푸시", "변경사항 올려줘", "git push", or when a task is done and the user wants to ship it.
---

# Git Push

Review changes, craft a commit message, and push — with user approval at every step.

## Workflow

1. **Scan**: `git status` + `git diff` to understand what changed
2. **Safety check**: flag sensitive files (.env, credentials, keys) — refuse to commit these
3. **Generate message**: analyze the diff, write a conventional commit message
   - Type: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`
   - Lowercase, present tense, max 72 chars
4. **Show user**: commit message + changed file list for approval
5. **On approval**: stage specific files by name (not `git add .`), commit, push

Staging files by name prevents accidentally including sensitive files or unrelated changes that happen to be in the working directory.
