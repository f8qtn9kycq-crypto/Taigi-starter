# Lesson package readiness

## Current result

Every lesson package currently in `app/data/lesson-packages.ts` is ready for implementation through a validated handoff:

- Packages: Lessons 2–18, 17 lessons total.
- Phrases: 52 total.
- Local original MP3s: 52 total.
- POJ comparisons: 52/52, mapped from the source-verified Tâi-lô forms using the Ministry of Education's Tâi-lô/POJ correspondence tables.
- Handoffs: 17, one per package.
- Learner-facing path: `pathOrder` 1–18, prioritising self-introduction, food, shopping, directions, and transport before family, community, and work topics.
- Runtime candidate catalog: Lessons 1–18 playable.
- Mobile evidence: `docs/qa/lesson-2-18-390x844.md`.

## Readiness contract

Each handoff must have:

- the unchanged package record and all five learning stages;
- one attribution record for every phrase;
- the official MOE canonical phrase page and original MP3 URL;
- a non-empty POJ comparison for every Tâi-lô phrase;
- CC BY-ND 3.0 TW licence and licence URL;
- local MP3 presence and ID3 audio validation;
- `isUnmodifiedOriginal: true`;
- 390×844 mobile flow evidence; and
- explicit owner risk acceptance when `teacherReview.status` is not `approved`.

The routine gate is `npm run lessons:validate` and is also the first step of
`npm test`. It blocks missing POJ, missing or non-original audio metadata,
missing local MP3s, invalid ID3/size checks, mismatched handoff attribution,
incomplete 2–18 handoffs, a catalog outside Lessons 1–18, and a repeat of
Lesson 1's complete greeting in Lesson 12. Teacher review may remain pending
only when the handoff keeps the review fields and explicit owner risk
acceptance; this gate does not claim teacher approval.

The POJ correspondence reference is the Ministry of Education's
[臺灣台語羅馬字拼音方案使用手冊](https://language.moe.gov.tw/files/people_files/tshiutsheh_1140819.pdf).
All audio provenance is checked against the official
[MOE dictionary audio and licence guidance](https://sutian.moe.edu.tw/zh-hant/piantsip/pankhuan-singbing/).

The package data intentionally keeps `teacherReview.status: "required"` and pending checks. Owner risk acceptance makes the implementation handoff valid for this release candidate, but it is not a substitute for teacher approval.

## Scope boundary

This readiness work covers every package currently present, Lessons 2–18. Lesson 19 and later remain outside the package catalog and are not playable. Production now serves the Lessons 1–18 release. Lesson 12 is a distinct meal-context conversation and no longer repeats Lesson 1's complete greeting phrase.
