# API Inventory

> Merged 2026-10-10 from the parallel local session's vault — **and
> corrected on the way in.** The original assumed all cloud secrets live in
> Script Properties. That's wrong for at least one of them: `docs/risk-register.md`
> R2 and `apps-script/SOURCE_NOTES.md` both confirm `GEMINI_API_KEY` is read
> via `getSetting()` from the live **`Settings` sheet tab**, in plaintext,
> with no `PropertiesService` path in the code at all — moving it would
> need a code change, not just a settings change. Table below reflects that;
> don't trust the original version if it resurfaces elsewhere.

**Names and locations of credentials only. No values in this vault, ever.**

| Service | Used by | Free tier limits | Secret name | Actually stored where |
|---|---|---|---|---|
| Google Gemini | cloud agents, via `callGemini()` fallback chain | TODO | `GEMINI_API_KEY` | **`Settings` sheet tab, plaintext** (confirmed — risk R2) — not Script Properties |
| Groq | cloud agents (tried first in `callGemini()`'s fallback chain per `apps-script/SOURCE_NOTES.md`) | TODO — RPM/TPD limits | `GROQ_API_KEY` | unconfirmed — don't assume Script Properties just because that'd be better practice; check the source the same way R2 was checked |
| GitHub Models | cloud agents (second fallback) | TODO | `GITHUB_MODELS_TOKEN` | unconfirmed, same caveat |
| Apps Script API | builder agent push step (`scripts/builder/push.js`) | n/a | OAuth / `clasp` creds | local, gitignored (`.env`) — not yet set up |
| `API_SECRET` (dashboard/bridge auth) | `doPost` handler | n/a | hardcoded JS constant | in the Apps Script source itself, not the sheet — rotated and confirmed live 2026-10-10 per `Founder-Directives-Checklist.md` |
| GitHub (this repo) | vault sync / engineering history | n/a | — | repo is currently **public** — see `vault/01-Architecture/D-0001-cloud-read-path.md`'s warning before treating any secret-adjacent note as safe to commit |

## Quota discipline

With 24+ scheduled jobs on free tiers, quota exhaustion is a realistic daily failure
mode, not an edge case. Record each provider's actual limits above as you learn them,
and note in `Job-Roster.md` which jobs degrade gracefully when a provider returns 429.
