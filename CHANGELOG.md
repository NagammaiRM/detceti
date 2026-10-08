# Changelog

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
