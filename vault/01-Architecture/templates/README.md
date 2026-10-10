# Vault Note Templates

> Merged 2026-10-10 from the parallel local session's vault
> (`vault/_templates/`). Nested here under `01-Architecture/` rather than as
> a new top-level vault folder — these are meta/tooling, not content.

Three of the original five came over. The other two were skipped as
redundant with code that already exists in this repo:

- **`proposal-template.md`** — skipped. `scripts/builder/propose.js` already
  generates this exact structure (problem/what-it-does/blast-radius/
  failure-handling/reviewer-notes) programmatically for every new proposal.
  A static copy here would just drift from the real one in the script.
- **`run-template.md`** — skipped, same reason: `scripts/browser/lib/run-log.js`
  generates run-log notes with this shape automatically.

## To use these as live Obsidian templates

Point Obsidian's Templates core plugin (Settings → Templates → Template
folder location) at `vault/01-Architecture/templates`. Not yet wired up —
this repo's `vault/.obsidian/` isn't tracked here (see root `.gitignore`),
so each person opening this vault in Obsidian sets that locally.

## What's here

- `agent-template.md` — for documenting a new agent (cloud or local)
- `decision-template.md` — for a new ADR-style decision note (`D-XXXX`)
- `job-template.md` — for documenting a new scheduled job
