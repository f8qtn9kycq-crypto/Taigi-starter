# Release evidence

> This file records a historical Sites release snapshot. It is not a current
> production attestation: before any publish, verify that the exact validated
> GitHub source SHA equals the saved Sites source SHA and the deployed version.
> A provenance mismatch is a release blocker. This PR does not deploy Sites.

## Exact production release

- Source: validated release branch pushed to the locked Sites source repository
- Release source commit: `e1b326d6b97781ae0701930fede29248c68f8fef`
- Sites saved version: `24`
- Sites saved source: `e1b326d6b97781ae0701930fede29248c68f8fef`
- Production URL: https://taigi-start.alexcy2025.chatgpt.site
- Version 24 deployment: `appgdep_6a657e775f048191a53ce1b7b0d51d7e`, succeeded; env revision `5`
- Latest runtime-config deployment: `appgdep_6a64ecd7f7648191b1467cd0c1c03f25`, succeeded; Sites environment revision `5`
- Previous rollback restore deployment: `appgdep_6a64b32624908191b2bddfb337d15aa6`, succeeded
- Date: 2026-07-26
- Scope: Lessons 1–20 production release with practical path order, POJ/audio provenance completion, title-to-content target lists, and Codex-moderated verification; not external learner research

## Evidence recorded

| Area | Status | Evidence |
| --- | --- | --- |
| Automated suite | Pass | `npm test`, 50/50 including production build, routine lesson validation, handoff validation, path-order checks, and local audio file checks |
| Lint | Pass | `npm run lint` |
| Sites source provenance | Pass | Saved version 21 source equals the exact validated release commit; Sites built from the pushed source repository state |
| Production publish | Pass | Version 24 publish returned `succeeded`; cache-busted live read-back matched the 20-lesson scope |
| Rollback drill | Pass | Version 5 deployment succeeded, live reverted to the old `7 / 12` UI, version 6 restored `1 / 1`, and version 7 then deployed successfully |
| Live scope | Pass | Cache-busted production read-back shows 20 selectable course rows; Lesson 2 shows all three polite target phrases and Lesson 20 shows all three help/slow-down target phrases |
| Live attribution | Pass | Production Lesson 2/20 expose canonical MOE phrase pages and CC BY-ND 3.0 TW licence links; release handoffs cover all 58 phrase audio files |
| Live Hear gate | Pass | Real production Lesson 20 MP3 playback changed `已聽 0 次` to `已聽 1 次` and enabled See |
| Five-stage path | Pass (release QA) | Exact release QA completed Lesson 18 Hear → See → Say → Recall → Use; Recall answer stayed hidden until reveal, Use added review, and the next phrase advanced to `2 / 4` |
| Live zh-TW / English | Pass | Both language states rendered and returned correctly |
| 320×700 | Pass | No horizontal overflow; visible controls met the 44px minimum |
| 390×844 | Pass | Candidate QA selected Lessons 2/3/20, confirmed complete target lists, completed a representative five-stage flow, and found no horizontal overflow; production read-back then confirmed the same 20-lesson scope |
| 412×915 | Pass | No horizontal overflow; visible controls met the 44px minimum |
| Feedback anonymous export | Pass | Live `GET /api/feedback/export` returned 403 |
| Feedback cross-origin | Pass | Live evil Origin returned 403; unsupported content type returned 415 |
| Worker ingress evidence | Pass | Worker logs show Cloudflare-injected `cf-connecting-ip`; no error-level events in the smoke window |
| Keyboard traversal | Pass | Production version 14: Shift+Tab from Close focused the external-form link, Tab wrapped back to Close, and Escape closed the dialog and returned focus to the feedback trigger; focus-boundary tests also pass |
| Audio failure fallback | Pass (isolated QA) | Clean exact-source local QA with a forced missing MP3 showed the labelled failure alert and enabled the continue-without-audio path; production network interception was unavailable |
| Microphone denied | Pass | Clean exact-source browser origin showed the denial alert and kept the next Say action usable |
| Microphone unsupported | Pass (isolated QA) | Clean exact-source local QA with an unsupported-capability override disabled recording and showed the unsupported-browser alert |
| Staging feedback POST/export | Pass (isolated D1) | Local exact-source staging POST returned 200 and inserted a test row in the isolated Miniflare D1; unauthenticated export returned 403; no production data submitted |
| External feedback configuration | Pass | Live `/api/feedback-config` returned the owner-provided Google Form HTTPS URL with `cache-control: no-store`; the production dialog exposed the external-form link |
| Google Form readiness | Pass | Unauthenticated preview exposed enabled radio, checkbox, textbox, and Submit controls; no response was submitted by Codex; the URL is now active in production |
| Live API security smoke | Pass (previous release) | Version 14 live config returned the Google Form URL with `no-store`; valid same-origin POST returned 410 `external_feedback_only`, export returned 410, `/feedback` returned 404, evil Origin returned 403, and unsupported content type returned 415 |
| Sites owner/auth attestation | Pass | Owner deployment attestation recorded in PR #28 comment `5078972911`; it covers the live ingress, trusted forwarded source, platform auth boundary, and explicit acceptance |
| External feedback-only mode | Pass (inherited) | Version 14 smoke evidence remains valid for the unchanged feedback routes; Version 15 changed lesson content only |
| D1 backup/restore | N/A for active production feedback path | Production feedback writes/exports are disabled in external-only mode; D1 remains only for local/legacy fallback. If the external-only smoke fails, restore the D1 gate and require platform evidence |

This file records evidence only. It does not set the production preflight
assertions or convert pending items into a production approval.

## External-only release gate

This release changes production feedback to the verified owner-provided Google Form. The
live version 14 deployment proved all three conditions:

- `/api/feedback-config` returns the owner HTTPS form URL.
- A valid same-origin feedback POST returns `410 external_feedback_only` before D1 access.
- `/api/feedback/export` and `/feedback` are unavailable in external-only mode.
