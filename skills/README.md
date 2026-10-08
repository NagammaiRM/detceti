# Skills

Reusable Claude Code skills per `docs/MASTER_SPEC.md` Part 6.3 / Part 7.

## Lifecycle (Part 7.4)

`DISCOVERED → CANDIDATE → TESTING → VALIDATED → ACTIVE`, with `REJECTED`,
`DEPRECATED`, `ROLLED_BACK` as exits. A skill only reaches `ACTIVE` after
baseline-vs-candidate evaluation (Part 7.5) and, for anything touching
sending policy, authentication, financial/legal workflows, or new external
services, explicit founder review (Part 7.6).

## Required metadata per skill

Stable ID, name/purpose, version, status, owner, source, creation date,
agent scope, inputs/outputs, tools required, permissions required,
dependencies, risk class, evaluation dataset, baseline score, candidate
score, changelog, approval/promotion record, rollback version.

**Empty for now.** First skills to build (per spec Part 6.3), in rough
priority order once Phase 0 access is confirmed:
1. Kind Koalas organizational context
2. Google Apps Script engineering
3. Google Sheets operations
4. Safe email operations (gates all outreach work — see risk R3)
5. Contact validation and deduplication
6. Grant research / grant application analysis

No skill should be marked ACTIVE in this repo without a linked test result
in `docs/build-checklist.md`.
