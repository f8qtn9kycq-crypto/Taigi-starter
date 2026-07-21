# Taigi research prototype test plan

## Purpose

Validate that the prototype faithfully implements the product decisions from
the ChatGPT Taigi research report before it is merged to `main`.

The report fixes the MVP boundary as a web-first, $0 learning experience for
total beginners of all ages. It requires open and attributable content, the
Hear → See → Say → Recall → Use loop, Tâi-lô-first romanization, simple SRS,
and culture context. It explicitly excludes paid services and AI speech
scoring.

## Busuu-style lesson validation contract

「Busuu 式」在本案不是複製介面，而是把每一課做成一個可完成、可回想、
可回到生活情境的小任務。每次驗證都要同時確認下面八件事；只看到五個
步驟名稱，不算通過。

| Contract | Lesson 1 requirement | Evidence that proves it |
| --- | --- | --- |
| One outcome | 一課只教一個主要生活任務與一個 phrase | typed lesson data and first-viewport copy |
| Short timebox | 5 個 stage、每段約 1 分鐘、總計約 5 分鐘 | `lesson-flow.test.ts` and manual stopwatch |
| Fixed progression | Hear → See → Say → Recall → Use，不能跳到未完成步驟 | stage-order test and keyboard/mobile walkthrough |
| Input to output | 先聽與看，再開口，最後才做回想和生活運用 | stage-specific headings, actions, and transition gates |
| Retrieval before reveal | Recall 先隱藏答案，按下顯示答案後才可進入 Use | rendered source contract and manual walkthrough |
| Safe speaking practice | Say 提供跟讀與本機暫存錄音；不冒充發音評分 | recorder/privacy inspection and denied-permission fallback |
| Spaced return | 完成 Use 後可加入複習，並以 Again / Hard / Easy 排程 | SRS tests and review walkthrough |
| Habit continuity | 重新開啟後回到已儲存 stage，不要求帳號或網路同步 | local-storage round-trip test and refresh walkthrough |

### Prototype decision rules

- P0 gates prove that the learner can start, understand the next action, finish
  the five-stage loop, and return for review without being misled about audio,
  recording, or AI feedback.
- A missing stage action, a bypass around Recall, a false pronunciation claim,
  or a lost local stage blocks merge.
- Completion rate, time-on-task, stage drop-off, and next-day return are
  learning signals rather than invented pass claims. Record them in moderated
  sessions first; set product targets only after a baseline exists.

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
| T05 | P0 | Hear → See → Say → Recall → Use | Complete one lesson from a clean device state. | Hear requires real audio start or an explicit fallback; See exposes Hanji and romanization; Say offers honest self-recording; Recall hides the answer until reveal; Use provides contextual transfer and the review handoff. |
| T06 | P0 | No false AI feedback | Inspect the Say stage and search the shipped source for learner-facing AI calls or scoring claims. | Recording is self-playback only; the app never claims pronunciation analysis, speech recognition, or AI scoring; no OpenAI/model API is called. |
| T07 | P0 | Recording privacy | Exercise recording where permission is available; also inspect denied/unsupported fallbacks. | The recording is temporary browser data, is not uploaded or persisted, and a non-recording practice path remains available. |
| T08 | P1 | Explainable SRS | Add the phrase to review and test Again, Hard, and Easy scheduling. | The review is due immediately when added; Again schedules 10 minutes, Hard 1 day, Easy 4 days; later intervals are deterministic and tested. |
| T09 | P1 | Device-local progress | Start the lesson, refresh, and reopen the review state. | Locale, stage, started state, and review card survive through the versioned local schema without a network account. |
| T10 | P0 | Truthful scope | Inspect lesson and course progress. | The UI says one phrase/lesson is available and labels Family and Numbers as planned; it does not claim 7/12 phrases or 15 completed lessons. |
| T11 | P0 | Keyboard accessibility | Navigate CTA, audio, stage controls, script tabs, review, language toggle, and modal close with keyboard only. | Focus is visible, controls are reachable in a logical order, disabled controls are skipped, Enter/Space works, and Escape closes the review modal. |
| T12 | P1 | Touch accessibility | Inspect interactive elements at both mobile widths. | Primary actions and navigation targets are at least 44 px high and do not overlap fixed navigation or safe-area padding. |
| T13 | P0 | Feedback privacy regression | Inspect feedback submission and owner-only export routes. | Public fields remain bounded and validated; raw feedback export remains owner-gated; no submitted feedback is committed. |
| T14 | P1 | Architecture for safe AI-assisted extension | Inspect lesson data, shared types, SRS, and UI boundaries. | Content and attribution use typed shared models; scheduling is pure and tested; components do not contain duplicated lesson facts or hidden AI behavior. |

### Busuu-style behavioral checks

These checks make the teaching rhythm testable instead of treating a stage label
as proof of learning behavior.

| ID | Priority | Check | Expected result |
| --- | --- | --- | --- |
| B01 | P0 | Inspect the lesson data contract. | Lesson 1 has exactly one phrase, five unique stages in the canonical order, positive stage estimates, and a stage total equal to its duration. |
| B02 | P0 | Start with cleared local storage and try each future stage control. | Future stages are disabled; only the current stage or an already completed stage can be opened. |
| B03 | P0 | Exercise the Hear transition with working and failing audio. | Working audio must start before See unlocks; a failure gives a labelled no-audio path and never reports a successful listen. |
| B04 | P0 | Move through See and Say. | See connects Hanji, meaning, Tâi-lô/POJ and audio; Say supports an actual speak-aloud attempt or an honest fallback without speech scoring. |
| B05 | P0 | Enter Recall without looking at the answer. | The answer is hidden at entry, and the Use transition is unavailable until the learner explicitly reveals it. |
| B06 | P1 | Finish Use and open Review. | The phrase can be added once, is due immediately, and rating it schedules the documented interval. |
| B07 | P1 | Refresh at each completed stage and reopen the page. | The saved stage is restored and never exceeds the lesson metadata stage count. |
| B08 | P1 | Observe a first-time learner at 390×844. | The learner can explain the next action without coaching and completes the flow without horizontal scrolling or a fixed-nav collision. |

For B01–B07, automated evidence is required. B08 is a human usability check;
its observation sheet must record: start time, stage where help was needed,
completion time, wording the learner expected for the next action, and any
confusion about unavailable AI/audio capability. Do not convert an unmeasured
signal into a green metric. The current recorded evidence is a Codex-moderated
proxy run, labeled as such rather than presented as external learner research.

## Automated evidence mapping

- `tests/rendered-html.test.mjs`: landing, responsive contracts, real audio,
  attribution, truthful scope, stage transition contracts, and production
  worker coverage.
- `tests/lesson-flow.test.ts`: one-outcome, five-stage order, duration budget,
  and truthful planned-lesson boundaries.
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
| Busuu-style lesson contract | Pending | B01–B08 |
| Branch hygiene | Pending | diff and secret/data inspection |
