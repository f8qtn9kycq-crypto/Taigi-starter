# Release evidence

## Exact production release

- Source: GitHub `main` mirrored to the locked Sites source repository
- Release source commit: `361768ff6a27a4824d0f383a198ff3f7a0309bff`
- Sites saved version: `6`
- Sites saved source: `361768ff6a27a4824d0f383a198ff3f7a0309bff`
- Production URL: https://taigi-start.alexcy2025.chatgpt.site
- Version 6 deployment: `appgdep_6a64b27f64508191bf01f7bb68728574`, succeeded
- Final restore deployment: `appgdep_6a64b32624908191b2bddfb337d15aa6`, succeeded
- Date: 2026-07-25
- Scope: Codex-assisted verification; not external learner research

## Evidence recorded

| Area | Status | Evidence |
| --- | --- | --- |
| Automated suite | Pass | `npm test`, 29/29 including production build |
| Lint | Pass | `npm run lint` |
| Archive | Pass | Sites archive contains `dist/server/index.js` and locked `.openai/hosting.json` |
| Sites provenance | Pass | Saved version 6 source equals the exact validated release commit |
| Production publish | Pass | Version 6 publish returned `succeeded`; final live URL is the Sites production URL |
| Rollback drill | Pass | Version 5 deployment succeeded, live reverted to the old `7 / 12` UI, then version 6 deployment succeeded and restored `1 / 1` |
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
| Audio failure fallback | Pending | Not yet recorded in browser |
| Microphone denied | Pass | Clean exact-source browser origin showed the denial alert and kept the next Say action usable |
| Microphone unsupported | Pending | Not separately recorded |
| Staging feedback POST/export | Pending | Must use isolated D1; no production test data submitted |
| Sites owner/auth attestation | Pending | Owner must accept the documented platform trust boundary in PR #28 |
| D1 backup/restore | Pending | Sites connector exposes no backup/restore operation; platform evidence not yet demonstrated |

This file records evidence only. It does not set the production preflight
assertions or convert pending items into a production approval.
