# Kind Koalas / COCO Vault

This is the Obsidian vault for Kind Koalas Apex / COCO — the long-term,
human-readable knowledge layer the master spec (`docs/MASTER_SPEC.md` Part
8) calls for. It's just plain markdown files in folders — no Obsidian MCP
integration exists in this session yet, so for now it's a plain folder,
not an auto-syncing vault. **To use it as an actual Obsidian vault**: clone
this repo, then in Obsidian do File → Open folder as vault → select the
`vault/` folder. That's it — Obsidian needs nothing more than markdown
files and folders.

Why it lives inside `detceti` rather than a separate loose folder: it's
git-tracked and pushed to GitHub, so nothing pasted here gets lost even if
a session ends mid-conversation. If you'd rather have it as its own
separate repo later (e.g. to share with someone who shouldn't see the
engineering code), say so and we'll split it out — easy to do later,
annoying to undo.

## Structure

- **`00-Inbox/`** — raw pasted content lands here first, dated, verbatim,
  unedited. Nothing gets lost even before it's organized. Check here first
  if you're looking for something recently pasted that hasn't been filed
  into a proper section yet.
- **`01-Architecture/`** — system design, specs, decisions about how
  things are built.
- **`02-Research/`** — external tool/repo research, resource evaluations
  (overlaps with `docs/resource-ledger.md` in the engineering repo, which
  stays the authoritative ADOPT/REJECT tracker — this is where the
  narrative research write-ups live).
- **`03-Operations/`** — playbooks, procedures, incident history, lessons
  learned from running the system day to day.
- **`04-Open-Questions/`** — things that need founder input before they
  can be resolved, so they don't get lost in chat scrollback.

## Founder directives checklist

See `Founder-Directives-Checklist.md` in this folder — every discrete
instruction the founder has given gets tracked there and checked off as
completed, separate from the engineering `docs/build-checklist.md` (which
tracks feature status, not instruction status).

## Relationship to the rest of the repo

- `docs/` — Phase 0 inventory, risk register, resource ledger, build
  checklist. The engineering source-of-truth status tracking.
- `apps-script/` — actual Apps Script source code. Code, not knowledge —
  doesn't belong in the vault.
- `vault/` (this folder) — knowledge, research, decisions, open questions.
  Not code, not live operational data (that's the Google Sheet).
