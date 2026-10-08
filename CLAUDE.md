# Kind Koalas Apex — COCO Engineering Repo

Kind Koalas is a youth-led nonprofit (Apex/Cary, NC chapter) connecting people
with free/reduced-cost healthcare. The founder runs the chapter solo after the
prior 17-person team left. **COCO** is the AI operating layer being built to
take over routine organizational work (outreach, grant research, volunteer
coordination, reporting) so the founder can focus on strategy and
relationships.

Full build mandate: `docs/MASTER_SPEC.md` (the 27-part specification this
repo implements). Treat it as the source of truth for scope; this file is
only a signpost into the docs below.

## Where things live

- `docs/phase0-inventory.md` — what has actually been inspected/verified vs.
  blocked, with evidence. Read this before assuming anything works.
- `docs/resource-ledger.md` — every external resource/repo from the spec,
  with verification status and ADOPT/BORROW/OPTIONAL/REJECT/BLOCKED decision.
- `docs/build-checklist.md` — every feature, tracked as
  PROPOSED → IMPLEMENTED → TESTED → DEPLOYED. Nothing is "done" until it's
  DEPLOYED with a passing test.
- `docs/risk-register.md` — known risks and their current mitigation state.
- `docs/backup-recovery-plan.md` — backup/restore procedure for the live
  Google Sheet, Apps Script project, and dashboard.
- `agents/` — agent definitions (Chief of Staff + 8 specialists).
- `skills/` — reusable Claude Code skills; see `skills/README.md` for the
  lifecycle (DISCOVERED → CANDIDATE → TESTING → VALIDATED → ACTIVE).
- `apps-script/` — synchronized copy of the live Apps Script source, once
  access is confirmed. Do not hand-edit without a corresponding backup.
- `tests/` — unit, integration, regression, and safety tests.
- `scripts/` — setup, diagnostics, backup, restore, maintenance.
- `config/`, `schemas/` — non-secret configuration and data contracts.
  **Never commit secrets here or anywhere in this repo.**

## How to run tests

Not yet populated (Phase 0/1 in progress — see `docs/build-checklist.md`).
Once `tests/` has content, the runner and invocation will be documented here.

## Backup and restore

See `docs/backup-recovery-plan.md`. As of this writing, the live Sheet and
Apps Script project have **not yet been backed up** — this repo has no
confirmed access to them yet (see `docs/phase0-inventory.md`).

## Changes that require founder approval before merging/deploying

- Anything touching Gmail sending policy, Safe Mode, or daily send limits.
- Any change to Apps Script production deployment or authentication.
- Any new external service/API integration.
- Any schema change to the live spreadsheet.
- Any skill promotion that increases permissions (SEND, SPEND, DELETE,
  PUBLISH, AUTHENTICATE, CHANGE_CONFIGURATION, DEPLOY_SKILL).
- Anything financial.

## Current status (do not treat this repo as having working integrations yet)

- Google Sheet / Apps Script: **not yet verified** — Drive connector in this
  session could not see the Command Center spreadsheet. See
  `docs/phase0-inventory.md`.
- Dashboard / terminal bridge web app: **not yet reachable** from this
  environment (outbound network policy blocks `script.google.com`). The
  founder has a working PowerShell bridge (`kk.ps1`) that talks to it
  directly from their own machine — that is currently the only verified
  live connection to the backend.
- Obsidian: no MCP integration available in this session yet; untested.

Do not claim any of the above works until it has actually been exercised and
the result recorded in `docs/phase0-inventory.md`.
