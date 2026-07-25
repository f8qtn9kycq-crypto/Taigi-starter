# Release evidence

## Latest exact release candidate

- Source: GitHub `main` mirrored to the locked Sites source repository
- GitHub source commit: `361768ff6a27a4824d0f383a198ff3f7a0309bff`
- Sites saved version: `6`
- Sites saved source: `361768ff6a27a4824d0f383a198ff3f7a0309bff`
- Server: local Vite preview from a clean exact-source checkout
- Date: 2026-07-25
- Scope: Codex-assisted verification; not external learner research

## Evidence recorded

| Area | Status | Evidence |
| --- | --- | --- |
| Automated suite | Pass | `npm test`, 29/29 including production build |
| Lint | Pass | `npm run lint` |
| Archive | Pass | Sites archive contains `dist/server/index.js` and locked `.openai/hosting.json` |
| Sites provenance | Pass | Saved version 6 source equals the exact validated release commit |
| 320×700 | Pass | No horizontal overflow; visible controls met the 44px minimum |
| 390×844 | Pass | No horizontal overflow; visible controls met the 44px minimum |
| 412×915 | Pass | No horizontal overflow; visible controls met the 44px minimum |
| zh-TW / English | Pass | `zh-Hant-TW` and `en` states rendered; no Simplified Chinese pattern found |
| Truthful scope | Pass | `1 / 1` phrase available; planned lessons remain non-playable; no `7 / 12` copy |
| Hear gate | Pass | Real local MP3 playback changed the listened state and enabled See |
| Initial stage lock | Pass | Fresh origin showed later stages disabled before Hear |
| Feedback modal | Pass | Modal opened and closed without submitting data |
| Keyboard traversal | Pending | No reliable focus traversal evidence recorded yet |
| Audio failure fallback | Pending | Not yet recorded in browser |
| Microphone denied/unsupported | Pending | Not yet recorded in browser |
| Full five-stage walkthrough | Pending | Automated contract passes; manual run not yet recorded |
| Staging feedback POST/export | Pending | Must use isolated D1; no production test data submitted |
| Sites ingress/auth attestation | Pending | Owner/platform evidence required |
| D1 backup/restore | Pending | Platform operation not yet demonstrated |
| Production rollback | Pending | Requires a deployment drill against saved versions |

This file records release evidence only. It does not set the production
preflight assertions or convert pending items into a production approval.
