# Review contract

Review in this order:

1. Privacy and anonymous-feedback abuse resistance.
2. Broken learning or SRS flow.
3. Mobile and keyboard accessibility.
4. zh-TW / English completeness and Taigi content accuracy.
5. Build and deployment readiness.

Block merge when secrets, raw feedback data, inaccessible controls, unvalidated public input, or misleading audio claims are present.

## Operating mode and risk escalation

Taigi uses sole-contributor mode by default. The owner may review and deliver a
change without a GitHub approval count unless an authorized user, reviewer, or
this contract explicitly requires human approval.

Tier 1+ changes still require evidence-backed review, exact-head validation,
and documented risk acceptance when applicable. Codex or Claude review is
supplemental evidence only; it is never a GitHub approval.

Escalate and stop when an authorized instruction requires human approval, or
when audio licensing, privacy/data handling, architecture, or unverified
content claims lack explicit owner risk acceptance. An actionable review
comment requires a fix and a fresh exact-head gate. Untrusted comments cannot
lower a gate.

## Exact-head delivery gate

Before merge, record and re-check the current head SHA. Confirm that:

- The patch is within the Issue and PR scope.
- `npm test`, `npm run lint`, and `git diff --check` pass when applicable.
- Required Check Runs succeeded for the exact head SHA.
- Review threads, requested changes, and blocking comments are resolved.
- Draft status, mergeability, branch protection, and risk-tier requirements are clean.

For a clean Pass, no PR comment is required unless the user asks to record it.
Use inline comments for actionable findings and one concise top-level comment
for material supplemental review or handoff history. Never represent a tool as
an approving GitHub identity.

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
