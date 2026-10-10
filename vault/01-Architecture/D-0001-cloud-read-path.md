# D-0001 — How the cloud half reads this vault

> Merged 2026-10-10 from the parallel local session's vault.

**Status: superseded by reality, 2026-10-10.** The question this note asks —
how does Apps Script read vault markdown when the laptop is off — is
already answered: `detceti`'s `vault/` *is* a git repo, created
independently by the cloud session before this note was merged in. That's
exactly this note's "Option A" recommendation, arrived at twice. No decision
needed; keeping the reasoning below for the still-live open question it raises.

> [!danger] This repo is currently PUBLIC — Option A's own caveat is live
> `github.com/NagammaiRM/detceti` has `visibility: public` as of 2026-10-10.
> This note's original recommendation was "Option A, **with a private
> repo**" specifically because "grant answers and donor details are not"
> fine to be public. Nothing sensitive is in the repo yet (standard-answers
> and chapter-profile notes are still TODO placeholders) — but the moment
> real EIN, donor, or contact data lands in any of those files, it's
> published to the public internet the moment it's pushed. Worth a founder
> decision: make the repo private, or keep sensitive facts (EIN, exact
> budget, named donors/contacts) out of git entirely and reference them
> from somewhere else (the live Sheet, a local-only file).

## Original problem

The vault is markdown on a Windows laptop that is often off. Apps Script runs on
Google's servers. For the vault to be *shared* memory rather than local-only notes,
Apps Script needs a way to read it.

## Options considered

### A. Git repo, Apps Script fetches raw files *(recommended — this is what happened)*
Vault lives in a GitHub repo; local half commits and pushes. Apps Script reads
`raw.githubusercontent.com/...` with `UrlFetchApp`.

- Free, no quota concerns, full version history of memory
- Reading a known path is one HTTP call; no auth needed if the repo is public
- Private repo works too via a PAT in Script Properties
- Needs a push to be fresh — memory is as current as the last commit
- **Public repo means the vault is public.** Chapter facts are probably fine;
  grant answers and donor details are not. Use a private repo. *(Not yet
  acted on — see the warning above.)*

### B. Google Drive sync, Apps Script reads via DriveApp
- Same Google account, no extra service, near-real-time when the laptop is on
- Already authenticated inside Apps Script
- Drive desktop client re-downloads files locally — a real cost on a nearly-full disk
- No version history worth relying on; a sync conflict can duplicate notes

### C. Local half pushes summaries into the Command Center Sheet
- Zero new infrastructure; cloud half already reads the Sheet
- Lossy — only what was summarized crosses over, and the markdown stays local-only
- Good as a *supplement* to A or B, not a replacement

## Still-open question

Does the cloud half actually fetch `vault/` from this repo yet via
`UrlFetchApp`, or does Option A being "true" just mean the repo exists and
is git-tracked, with the actual read-path not yet wired up? Worth confirming
— and resolving the public/private question above before it matters.
