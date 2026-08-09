# Post-change UX validation plan

This gate checks whether a change still supports the learner's task. It does not
turn automated checks, an expert walkthrough, or a deployment status into
participant evidence.

## Evidence levels

Report every level separately as `Pass`, `Partial`, `Pending`, or `Blocked`.

| Level | What it can establish | What it cannot establish |
| --- | --- | --- |
| Automated | Build, type/runtime contracts, data validation, and known regressions | Visual clarity, audible quality, or learner understanding |
| Expert walkthrough | A named journey works on an exact Preview or Production deployment | Real-device behavior or beginner usability |
| Real-device | Touch, viewport, browser, microphone, and audio behavior on the recorded device | Learning effectiveness across participants |
| Participant pilot | Observed comprehension, completion, recall, and confidence | Statistical representativeness or teacher approval |

Do not collapse these levels into one `QA passed` statement. A failure in
privacy, truthful audio/recording claims, keyboard access, or saved progress is
a release blocker. A missing real-device or participant run is `Pending`, not a
failure and not a pass.

## Before implementation

For each product change, record:

- the learner journey and primary task affected;
- the expected starting state, including fresh or migrated device-local data;
- the behavior and copy that must not change;
- the target locale, viewport, browser, and lesson;
- privacy, audio, recording, persistence, and content risks;
- the smallest rollback or follow-up if validation fails.

## Exact-head Preview gate

Run this after the final code commit and restart it whenever the PR head changes.
Use the Vercel Preview attached to that exact head SHA.

1. Confirm the page loads and the course path becomes interactive after saved
   progress hydrates.
2. At 390×844, select a three-phrase lesson. A fresh lesson must show `0/15`;
   selection alone must not count as progress.
3. Play Hear and continue to See. Progress must become `1/15`.
4. Select another fresh lesson, then return and reload. The first lesson must
   retain `1/15`; the other lesson must remain independent.
5. Switch zh-TW → English → zh-TW. The current lesson, progress, navigation,
   attribution, and action labels must remain understandable and complete.
6. Open and close feedback. Confirm it uses the configured external form and
   does not imply that feedback is stored by Taigi Start.
7. Check keyboard focus order and the relevant audio/microphone failure path
   when the change can affect those surfaces.
8. Record viewport, URL, head SHA, journey, result, and any console or visual
   issue. Do not claim a viewport or browser that was not exercised.

Run 320×700 and 412×915 when layout, navigation, copy length, or touch geometry
changes. Run a real iPhone/Safari check when audio, recording, sticky controls,
or touch behavior changes.

## PR review gate

Use the repository review order in `REVIEW.md`, then review the exact PR head:

- scope contains only the linked issue;
- required checks and Vercel Preview are successful on the same SHA;
- no unresolved actionable threads, requested changes, or merge conflict;
- Preview evidence names what was actually tested;
- real-device and participant evidence remain explicitly separate;
- a supplemental review comment is posted when the issue requests recorded
  review evidence. It is informational and is not a GitHub approval.

## Post-merge Production gate

After merge, wait for the Vercel Production deployment tied to the merge commit.
On that deployment, repeat only the smallest journey needed to prove the changed
behavior is present and the critical learner path still works. Record the merge
SHA, deployment URL, production result, and any rollback decision in the issue
completion comment. Preview evidence must not substitute for this read-back.

## Human validation boundary

The moderated beginner study remains governed by
`docs/beginner-pilot-plan.md`. It starts only when its teacher-review, audio,
mobile, consent, privacy, and facilitator gates are satisfied. Until then:

- do not recruit participants under this plan;
- do not add estimated metrics or participant-level notes to the repository;
- report teacher review and beginner evidence as `Pending` or `Blocked`;
- use expert walkthrough findings only to refine the next testable hypothesis.

## 2026-08-09 production baseline walkthrough

- Source SHA: `bfab21447f511e61308a6934405299aa4b2aa832`
- Vercel Production: https://taigi-starter-krz9sb3yg-alex-vercel-x-projects.vercel.app
- Viewport: 390×844
- Evidence type: expert task walkthrough, not real-device or participant research

| Journey | Status | Evidence |
| --- | --- | --- |
| Course discovery | Pass | Production displayed 20 available lessons and selectable Lessons 1–20 |
| Truthful progress | Pass | Lesson 2 showed `0/15`; Hear → See changed it to `1/15` |
| Cross-lesson persistence | Pass | Lesson 3 remained `0/15`; returning to Lesson 2 and reloading retained `1/15` |
| zh-TW / English | Pass | Switching both directions preserved Lesson 2, `1/15`, course navigation, and actions |
| Feedback entry | Pass | The feedback dialog opened, exposed the external form path, and closed successfully |
| Audible quality | Partial | Playback unlocked See, but an expert automation run cannot judge perceived audio quality |
| Keyboard and failure fallbacks | Partial | Existing automated contracts pass; this production walkthrough did not repeat full keyboard or forced-failure scenarios |
| Horizontal overflow and touch geometry | Pending | Not measured in this walkthrough; required when layout changes |
| Real iPhone/Safari | Pending | No real-device run was performed |
| Beginner participant pilot | Blocked | Teacher-approval and human-research prerequisites remain incomplete |

