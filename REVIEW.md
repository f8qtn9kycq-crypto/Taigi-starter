# Review contract

Review in this order:

1. Privacy and anonymous-feedback abuse resistance.
2. Broken learning or SRS flow.
3. Mobile and keyboard accessibility.
4. zh-TW / English completeness and Taigi content accuracy.
5. Build and deployment readiness.

Block merge when secrets, raw feedback data, inaccessible controls, unvalidated public input, or misleading audio claims are present.

## Issue lifecycle comments

When implementing or reviewing an issue, leave concise comments on the issue at these milestones:

1. Triage: confirm scope, priority, and acceptance criteria.
2. Implementation: record the branch and linked pull request.
3. Validation: list the relevant tests and checks with their result.
4. Completion: record the merged pull request or the remaining blocker.

Use this format:

```md
Progress update:

- Scope:
- Branch:
- PR:
- Validation:
- Status:
```

Do not post comments for every small intermediate action; combine related updates into one concise, evidence-based comment.
