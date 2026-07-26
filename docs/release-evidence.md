# Release evidence

## Exact production release

- Source: GitHub `main` mirrored to the locked Sites source repository
- Release source commit: `bcc0ff4327e6c3edf1c5305fc965a81d07367287`
- Sites saved version: `16`
- Sites saved source: `bcc0ff4327e6c3edf1c5305fc965a81d07367287`
- Production URL: https://taigi-start.alexcy2025.chatgpt.site
- Version 16 deployment: `appgdep_6a65690ae4a48191bca3a6d223497aea`, succeeded; env revision `5`
- Latest runtime-config deployment: `appgdep_6a64ecd7f7648191b1467cd0c1c03f25`, succeeded; Sites environment revision `5`
- Previous rollback restore deployment: `appgdep_6a64b32624908191b2bddfb337d15aa6`, succeeded
- Date: 2026-07-26
- Scope: Lessons 2–15 production release with Codex-assisted verification; not external learner research

## Evidence recorded

| Area | Status | Evidence |
| --- | --- | --- |
| Automated suite | Pass | `npm test`, 46/46 including production build, handoff validation, and local audio file checks |
| Lint | Pass | `npm run lint` |
| Archive | Pass | Sites archive contains `dist/server/index.js` and locked `.openai/hosting.json` |
| Sites provenance | Pass | Saved version 13 source equals the exact validated release commit |
| Production publish | Pass | Version 16 publish returned `succeeded`; final live URL is the Sites production URL |
| Rollback drill | Pass | Version 5 deployment succeeded, live reverted to the old `7 / 12` UI, version 6 restored `1 / 1`, and version 7 then deployed successfully |
| Live scope | Pass | Production browser shows `15 課可體驗`, 15 selectable course rows, and Lesson 15 renders as playable |
| Live attribution | Pass | Production Lesson 15 exposes the canonical MOE phrase page and CC BY-ND 3.0 TW licence link; release handoffs cover all 42 phrase audio files |
| Live Hear gate | Pass | Real production MP3 playback changed `已聽 0 次` to `已聽 1 次` and enabled See on Lesson 15 |
| Five-stage path | Pass (release QA) | Exact release local QA completed Hear → See → Say → Recall → Use; Recall answer stayed hidden until reveal, Use added review, and the next phrase advanced to `2 / 3` |
| Live zh-TW / English | Pass | Both language states rendered and returned correctly |
| 320×700 | Pass | No horizontal overflow; visible controls met the 44px minimum |
| 390×844 | Pass | Release QA selected Lessons 2–15, completed the Lesson 15 flow, and confirmed no horizontal overflow in the mobile viewport |
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
