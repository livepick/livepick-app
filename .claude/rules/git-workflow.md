---
paths:
  - "**"
---

# Git Workflow

## Branch Strategy

- Main: `main`
- Feature: `feat/<name>`
- Bug fix: `fix/<issue>`
- Hotfix: `hotfix/<issue>`

---

## Commit Message

### Patterns
```bash
feat: add event creation API
fix: resolve follower count mismatch
chore: update dependencies
refactor: extract event validation logic
docs: add API documentation
```

### Rules
- Lowercase after type prefix
- Present tense (`add`, `fix`, `update` — NOT `added`, `fixed`)
- Max 72 characters
- Type prefix: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `style`, `ci`

---

## Prohibited Actions

| Prohibited | Reason |
|------------|--------|
| Force push to main | Team work loss |
| Commit secrets/credentials | Security breach |
| Large binary files in git | Repo bloat |
| Commit node_modules or vendor | Use .gitignore |
