# Lesson package readiness

## Current result

Every lesson package currently in `app/data/lesson-packages.ts` is ready for implementation through a validated handoff:

- Packages: Lessons 2–18, 17 lessons total.
- Phrases: 52 total.
- Local original MP3s: 52 total.
- Handoffs: 17, one per package.
- Runtime candidate catalog: Lessons 1–18 playable.
- Mobile evidence: `docs/qa/lesson-2-18-390x844.md`.

## Readiness contract

Each handoff must have:

- the unchanged package record and all five learning stages;
- one attribution record for every phrase;
- the official MOE canonical phrase page and original MP3 URL;
- CC BY-ND 3.0 TW licence and licence URL;
- local MP3 presence and ID3 audio validation;
- `isUnmodifiedOriginal: true`;
- 390×844 mobile flow evidence; and
- explicit owner risk acceptance when `teacherReview.status` is not `approved`.

The package data intentionally keeps `teacherReview.status: "required"` and pending checks. Owner risk acceptance makes the implementation handoff valid for this release candidate, but it is not a substitute for teacher approval.

## Scope boundary

This readiness work covers every package currently present, Lessons 2–18. Lesson 19 and later remain outside the package catalog and are not playable. Production now serves the Lessons 1–18 release.
