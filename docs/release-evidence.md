# Release evidence

## Local release candidate

- Source: `codex/production-exit-plan`
- Commit: `579e31cce8b7f6b856f0fc0f443e59af60015c76`
- Server: local Vite preview from the clean release worktree
- Date: 2026-07-25
- Scope: Codex-assisted verification; not external learner research

## Evidence recorded

| Area | Status | Evidence |
| --- | --- | --- |
| Automated suite | Pass | `npm test`, 28/28 including production build |
| Lint | Pass | `npm run lint` |
| Diff and manifest | Pass | `git diff --check github/main...HEAD`; locked Sites project and `DB` binding |
| 320×700 | Pass | No horizontal overflow; visible controls met the 44px minimum |
| 390×844 | Pass | No horizontal overflow; visible controls met the 44px minimum |
| 412×915 | Pass | No horizontal overflow; visible controls met the 44px minimum |
| zh-TW / English | Pass | `zh-Hant-TW` and `en` states rendered; no Simplified Chinese pattern found |
| Truthful scope | Pass | `1 / 1` phrase available; `2` planned; no `7 / 12` copy |
| Hear gate | Pass | Real local MP3 playback changed `Listened 0 times` to `Listened 1 time` and enabled See |
| Initial stage lock | Pass | Fresh `127.0.0.1` origin showed See, Say, Recall, and Use disabled before Hear |
| Feedback modal | Pass | Modal opened and closed without submitting data |
| Keyboard traversal | Pending | Not yet recorded |
| Audio failure fallback | Pending | Not yet recorded in browser |
| Microphone denied/unsupported | Pending | Not yet recorded in browser |
| Full five-stage walkthrough | Pending | Automated contract passes; manual run not yet recorded |
| Staging feedback POST/export | Pending | Must use isolated D1; no production test data submitted |
| Sites ingress/auth attestation | Pending | Owner/platform evidence required |
| D1 backup/restore | Pending | Platform operation not yet demonstrated |
| Production rollback | Pending | Requires a saved version and deployment drill |

This file is evidence for the release candidate only. It does not set the
production preflight environment variables or convert pending items into a
production approval.
