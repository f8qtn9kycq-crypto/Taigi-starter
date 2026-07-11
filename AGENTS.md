# Taigi Start — Shared AI Project Contract

## Product purpose

Taigi Start is a mobile-first Taiwanese language learning product for total
beginners of all ages. It should feel warm, trustworthy, and culturally
grounded, and its first screen should be understandable within 3–5 seconds.

Primary language is Taiwan Traditional Chinese (`zh-Hant-TW`); never introduce
Simplified Chinese. English is the supported secondary interface language.
Taiwanese content uses Ministry of Education Tâi-lô as the primary
romanization; POJ may be shown as an optional comparison.

## Product priorities

1. Accurate, attributable Taiwanese content and unmodified licensed audio.
2. A truthful Hear → See → Say → Remember → Use learning loop.
3. Clear mobile interactions, large touch targets, and low cognitive load.
4. Explainable review scheduling and device-local progress.
5. Private, low-friction product feedback.
6. More lessons only after the first lesson is reliable and tested.

Never present a timer, animation, or state toggle as real audio, recording, or
learning feedback. Clearly label unavailable capabilities. Keep the MVP at $0
and use open-licensed content only. Do not add paid voice, paid backends, AI
speech scoring, social features, or speculative gamification.

## Architecture

- Preserve the existing vinext, React, TypeScript, Tailwind, D1, and Sites setup.
- Keep components under 200 lines whenever practical.
- Put shared models in `app/types`, hooks in `app/hooks`, pure logic in
  `app/utils`, and storage adapters in `app/services`.
- Keep scheduling and other learning logic pure and independently tested.
- Avoid `any`, inline styles, duplicated content, and business logic in UI.
- Local recordings are temporary browser data and must not be uploaded or
  persisted without an explicit product decision.
- Persist local learning state with a versioned schema and safe migration.
- Treat feedback as private product research. Never expose raw comments through
  a public route or commit exports, credentials, or tester information.

## Content and licensing

- Verify Taiwanese orthography and pronunciation against an authoritative
  source before shipping.
- Store source, speaker when known, license, and canonical URL near every audio
  asset or in a central attribution record.
- Do not trim, remix, normalize, or otherwise alter CC BY-ND audio.
- Show user-visible attribution for third-party learning media.

## UX and accessibility

- Design mobile first from 320px upward.
- Use real buttons for actions and at least 44px touch targets.
- Provide keyboard focus, useful labels, live status for media actions, and a
  non-recording fallback when microphone access is unavailable or denied.
- Keep zh-TW and English complete and avoid unnecessary jargon.

## Repository workflow

- Before remote mutation, verify repository identity, tracked instructions, and
  target branch.
- Implement one issue per branch and PR; never bulk-trigger Codex.
- Tier 0 may auto-merge only after required validation passes and the PR is
  clean and mergeable. Tier 1+ requires human review.
- Follow `REVIEW.md` and `.github/pull_request_template.md` when preparing PRs.

## Validation and delivery

Before syncing or publishing, run:

```bash
npm test
npm run lint
```

For Sites work, keep `.openai/hosting.json` intact, push the exact validated
source before saving a version, and deploy only that saved version.
