# Release evidence

## Exact production release

- Source: GitHub `main` mirrored to the locked Sites source repository
- Release source commit: `12611c66957f8f432f9302726af7b450d15ec7c8`
- Sites saved version: `7`
- Sites saved source: `12611c66957f8f432f9302726af7b450d15ec7c8`
- Production URL: https://taigi-start.alexcy2025.chatgpt.site
- Version 7 deployment: `appgdep_6a64d9ef3be48191a6de66ab54792bfc`, succeeded
- Previous rollback restore deployment: `appgdep_6a64b32624908191b2bddfb337d15aa6`, succeeded
- Date: 2026-07-25
- Scope: Codex-assisted verification; not external learner research

## Evidence recorded

| Area | Status | Evidence |
| --- | --- | --- |
| Automated suite | Pass | `npm test`, 29/29 including production build |
| Lint | Pass | `npm run lint` |
| Archive | Pass | Sites archive contains `dist/server/index.js` and locked `.openai/hosting.json` |
| Sites provenance | Pass | Saved version 7 source equals the exact validated release commit |
| Production publish | Pass | Version 7 publish returned `succeeded`; final live URL is the Sites production URL |
| Rollback drill | Pass | Version 5 deployment succeeded, live reverted to the old `7 / 12` UI, version 6 restored `1 / 1`, and version 7 then deployed successfully |
| Live scope | Pass | Browser snapshot shows `1 / 1` phrase, `2` planned lessons, and no `7 / 12` |
| Live Hear gate | Pass | Real production MP3 playback changed `已聽 0 次` to `已聽 1 次` and enabled See |
| Live five-stage path | Pass | Production browser completed Hear → See → Say → Recall → Use; Recall answer stayed hidden until reveal |
| Live zh-TW / English | Pass | Both language states rendered and returned correctly |
| 320×700 | Pass | No horizontal overflow; visible controls met the 44px minimum |
| 390×844 | Pass | No horizontal overflow; visible controls met the 44px minimum |
| 412×915 | Pass | No horizontal overflow; visible controls met the 44px minimum |
| Feedback anonymous export | Pass | Live `GET /api/feedback/export` returned 403 |
| Feedback cross-origin | Pass | Live evil Origin returned 403; unsupported content type returned 415 |
| Worker ingress evidence | Pass | Worker logs show Cloudflare-injected `cf-connecting-ip`; no error-level events in the smoke window |
| Keyboard traversal | Pending | Browser backend did not produce reliable Tab focus evidence |
| Audio failure fallback | Pass (isolated QA) | Clean exact-source local QA with a forced missing MP3 showed the labelled failure alert and enabled the continue-without-audio path; production network interception was unavailable |
| Microphone denied | Pass | Clean exact-source browser origin showed the denial alert and kept the next Say action usable |
| Microphone unsupported | Pass (isolated QA) | Clean exact-source local QA with an unsupported-capability override disabled recording and showed the unsupported-browser alert |
| Staging feedback POST/export | Pass (isolated D1) | Local exact-source staging POST returned 200 and inserted a test row in the isolated Miniflare D1; unauthenticated export returned 403; no production data submitted |
| External feedback configuration | Pass (fallback active) | Live `/api/feedback-config` returned `{"externalFormUrl":null}`; the live UI showed the private D1 form; no external provider URL was set |
| Sites owner/auth attestation | Pass | Owner deployment attestation recorded in PR #28 comment `5078972911`; it covers the live ingress, trusted forwarded source, platform auth boundary, and explicit acceptance |
| D1 backup/restore | Pending | Sites connector exposes no backup/restore operation; platform evidence not yet demonstrated |

This file records evidence only. It does not set the production preflight
assertions or convert pending items into a production approval.
