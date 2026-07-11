# Taigi research prototype test plan

## Purpose

Validate that the prototype faithfully implements the product decisions from
the ChatGPT Taigi research report before it is merged to `main`.

The report fixes the MVP boundary as a web-first, $0 learning experience for
total beginners of all ages. It requires open and attributable content, the
Hear → See → Say → Remember → Use loop, Tâi-lô-first romanization, simple SRS,
and culture context. It explicitly excludes paid services and AI speech
scoring.

## Merge gates

All gates are required:

1. `npm test` passes, including the production build and unit contracts.
2. `npm run lint` passes.
3. `git diff --check main...HEAD` passes.
4. Every P0 and P1 case below passes at 320 px and 412 px widths where noted.
5. No secret, personal feedback export, recording, or generated user data is
   present in the branch diff.
6. The PR is clean and mergeable, and all required GitHub checks are green.

Any P0 failure blocks merge. Any P1 failure blocks this prototype PR unless it
is demonstrated to be unrelated pre-existing behavior and recorded in the PR.

## Test matrix

| ID | Priority | Research requirement | Test | Expected result |
| --- | --- | --- | --- | --- |
| T01 | P0 | Beginner-first, mobile-first | Open `/` at 320×700 and 412×915. Inspect the first viewport. | Brand, one-sentence promise, primary CTA, audio preview, and next-step hint are understandable without horizontal scrolling. |
| T02 | P0 | Traditional Chinese and English | Verify the default interface, switch to English, and scan both states. | Default is `zh-Hant-TW`; English is complete; no Simplified Chinese UI text appears. |
| T03 | P0 | Truthful Hear stage | Start Lesson 1 and inspect the Hear stage before and after playing audio. | The next step is disabled until real audio starts; play/pause status is announced; playback failure exposes a clearly labelled continue-without-audio path and never claims that listening occurred. |
| T04 | P0 | Accurate, attributable open content | Inspect Lesson 1 content and attribution. | Hanji, MOE Tâi-lô, optional POJ, canonical MOE URL, and CC BY-ND licence are present; the checked-in audio file remains unmodified. |
| T05 | P0 | Hear → See → Say → Remember → Use | Complete all five stages in order. | Each stage unlocks only after the preceding action; See shows scripts, Say offers honest self-recording, Remember hides then reveals the answer, and Use explains context. |
| T06 | P0 | No false AI feedback | Inspect the Say stage and search the shipped source for learner-facing AI calls or scoring claims. | Recording is self-playback only; the app never claims pronunciation analysis, speech recognition, or AI scoring; no OpenAI/model API is called. |
| T07 | P0 | Recording privacy | Exercise recording where permission is available; also inspect denied/unsupported fallbacks. | The recording is temporary browser data, is not uploaded or persisted, and a non-recording practice path remains available. |
| T08 | P1 | Explainable SRS | Add the phrase to review and test Again, Hard, and Easy scheduling. | The review is due immediately when added; Again schedules 10 minutes, Hard 1 day, Easy 4 days; later intervals are deterministic and tested. |
| T09 | P1 | Device-local progress | Start the lesson, refresh, and reopen the review state. | Locale, stage, started state, and review card survive through the versioned local schema without a network account. |
| T10 | P0 | Truthful scope | Inspect lesson and course progress. | The UI says one phrase/lesson is available and labels Family and Numbers as planned; it does not claim 7/12 phrases or 15 completed lessons. |
| T11 | P0 | Keyboard accessibility | Navigate CTA, audio, stage controls, script tabs, review, language toggle, and modal close with keyboard only. | Focus is visible, controls are reachable in a logical order, disabled controls are skipped, Enter/Space works, and Escape closes the review modal. |
| T12 | P1 | Touch accessibility | Inspect interactive elements at both mobile widths. | Primary actions and navigation targets are at least 44 px high and do not overlap fixed navigation or safe-area padding. |
| T13 | P0 | Feedback privacy regression | Inspect feedback submission and owner-only export routes. | Public fields remain bounded and validated; raw feedback export remains owner-gated; no submitted feedback is committed. |
| T14 | P1 | Architecture for safe AI-assisted extension | Inspect lesson data, shared types, SRS, and UI boundaries. | Content and attribution use typed shared models; scheduling is pure and tested; components do not contain duplicated lesson facts or hidden AI behavior. |

## Automated evidence mapping

- `tests/rendered-html.test.mjs`: landing, responsive contracts, real audio,
  attribution, truthful scope, and production worker coverage.
- `tests/progress-storage.test.ts`: versioned local progress and migration.
- `tests/srs.test.ts`: explainable review intervals.
- `npm run lint`: TypeScript/React static quality gate.
- Production build inside `npm test`: deployment compatibility.

## Manual evidence record

Complete this table in the PR description after executing the plan.

| Area | Verdict | Evidence |
| --- | --- | --- |
| Automated suite | Pending | `npm test` |
| Lint | Pending | `npm run lint` |
| 320 px mobile | Pending | T01–T05, T10–T12 |
| 412 px mobile | Pending | T01–T05, T10–T12 |
| zh-TW / English | Pending | T02 |
| Keyboard | Pending | T11 |
| Privacy / AI boundary | Pending | T06, T07, T13 |
| Branch hygiene | Pending | diff and secret/data inspection |
