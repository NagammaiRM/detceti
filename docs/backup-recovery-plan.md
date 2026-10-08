# Backup and Recovery Plan

## Status: plan only — not yet executed

Execution is blocked on the same two items in `docs/phase0-inventory.md`
(Drive connector access to the Command Center sheet; this environment's
network policy for `script.google.com`). Nothing below has been run yet.

## What must be backed up before any production change

1. **Command Center spreadsheet** — full export (Sheets → File → Download →
   .xlsx, or Drive API export) of all 15 tabs, timestamped, stored outside
   this git repo (spreadsheets can contain contact/family data — do not
   commit raw exports to a public or shared repo; store in a private
   location the founder controls, e.g. a private Drive folder or local
   encrypted storage).
2. **Apps Script source** — every `.gs`/`.html` file in the bound script
   project, pulled via `clasp pull` (if clasp is set up and authorized) or
   manually copied from the Apps Script editor, into `apps-script/` in this
   repo. Source code itself is safe to commit; any hardcoded config values
   need review first — per spec constraint 6, no secrets in source control.
3. **Dashboard deployment metadata** — current deployment ID, web app URL,
   version number, and execution permissions (who it runs as, who can
   access it), recorded in `docs/deployment-metadata.md` (to be created once
   inspected).
4. **Templates, Roles, Contacts, Funding tab contents** — exported alongside
   the full sheet backup in item 1; also worth a lightweight CSV snapshot
   for diffing after future changes.
5. **Trigger configuration** — list of installed triggers (function, event
   type, schedule) from the Apps Script project's trigger list, recorded for
   comparison against the spec's claimed schedule (spec 3.6).

## Backup cadence (once working)

- Before any destructive or production-affecting change: ad hoc backup,
  always.
- Routine: weekly automated export once `scripts/backup.sh` (or equivalent
  Apps Script time-driven export) exists and is tested.

## Restore procedure (draft — to be tested once backups exist)

1. Identify the target restore point (timestamped export).
2. For the spreadsheet: create a copy of the backup file, verify tab
   structure and row counts match the backup manifest, then — only with
   founder sign-off — replace or merge into the live sheet. Never overwrite
   the live sheet directly from a restore without a founder-approved diff
   review first (matches constraint: "do not silently ... replace production
   configuration").
3. For Apps Script: `clasp push` the backed-up source to a **test
   deployment** first, verify `doGet`/`doPost` respond correctly, only then
   promote to the production deployment.
4. Record the restore in `Activity_Log` (once live) and in this repo's
   `CHANGELOG.md`.

## Open items before this plan is "real"

- Confirm whether `clasp` (Apps Script CLI) is the intended tool, or manual
  editor copy-paste, once Apps Script project access is confirmed.
- Confirm where the founder wants spreadsheet exports stored (never in this
  public/shared git history, given contact and family-related data).
- Run the full backup once, verify it restores into a throwaway copy
  correctly, and record that test's result here.
