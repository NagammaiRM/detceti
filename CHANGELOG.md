# Changelog

## 2026-10-08 — Real Phase 0 findings: live sheet inspected, GitHub/network/Drive blockers all resolved

- Founder fixed GitHub access, this environment's network policy, and the
  Google Drive connector. All three re-verified working this session.
- Pulled real content from the live Command Center spreadsheet via Drive's
  `read_file_content`. Rewrote `docs/phase0-inventory.md` Sections 0, 2, 4, 5,
  6 from historical-claim to confirmed/contradicted status with evidence.
- **Security finding (critical):** a live Gemini API key is stored in
  plaintext in the `Settings` tab, readable by anyone with sheet-viewer
  access. Not reproduced anywhere in this repo. Recorded as risk R2
  (upgraded to "confirmed, currently live") in `docs/risk-register.md`, with
  a rotation recommendation for the founder.
- Discovered an undocumented `Reflex_Bus` tab (send-safety allow/block
  filter) not mentioned anywhere in the master spec — logged as risk R10,
  needs founder explanation.
- Found the spec's claimed CHIF grant ($5,000, Oct 30 deadline) does not
  exist in the live `Funding` tab — only Triangle Community Foundation and
  Blue Cross NC Foundation are present, both with empty amounts and
  non-current deadlines.
- Confirmed a live, current provider error in `Activity_Log`
  (`models/gemini-2.0-flash` no longer available) alongside an `Agents` tab
  still configured for `gemini-1.5-pro` — logged as risk R9, a real
  model-config mismatch to fix before relying on any agent.
- Tested the dashboard web app from this environment: `GET` works
  correctly on both deployment URLs; every `POST` (bogus secret, real
  payload shape, and empty `{}`, tried with method preserved and
  method-converted through the redirect) hits a broken Google-side
  "unable to open the file" error instead of the script's JSON response.
  Reproducible and payload-independent. Not yet known whether this is
  specific to this environment or a real deployment issue — needs the
  founder to run `kk_stats` from their own machine to isolate it.

## 2026-10-08 — Resource ledger: two skill indexes

- Inspected `hesreallyhim/awesome-claude-code` and `VoltAgent/awesome-agent-skills`
  (READMEs fetched live). Both are curated link indexes, not installable
  code. Recorded as **ADOPT as a search index** in `docs/resource-ledger.md`
  — to be consulted during Phase 1/5/6 skill work per spec Part 7.3, not
  installed as-is. No individual skill from either list inspected yet.

## 2026-10-08 — Phase 0 scaffold

- Established `detceti` as the Claude Code engineering repo for Kind Koalas
  Apex / COCO (founder decision).
- Attempted live verification of the Command Center spreadsheet (Drive
  connector: file not found/accessible) and the Apps Script dashboard web
  app (this environment's network policy blocks `script.google.com`). Both
  documented as open blockers with concrete next actions in
  `docs/phase0-inventory.md`.
- Added `CLAUDE.md`, `docs/phase0-inventory.md`, `docs/resource-ledger.md`,
  `docs/build-checklist.md`, `docs/risk-register.md`,
  `docs/backup-recovery-plan.md`, `.gitignore`.
- No production system touched. No secrets committed. No sending capability
  implemented.
