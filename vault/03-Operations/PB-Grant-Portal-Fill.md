# Playbook — Fill a grant portal

> Merged 2026-10-09 from a parallel local session's vault; paths updated to
> this repo's layout (`scripts/browser/`, `vault/00-Inbox/`). The
> `Standard-Answers`/`_GRANT-PIPELINE` notes this playbook depends on weren't
> part of this merge — they're still in the other local vault
> (`C:\Users\sokku\KindKoalas\vault\04-Grants\`) — so step 2 below can't
> actually run yet without either pulling those over too or rebuilding them
> here against `docs/resource-ledger.md` / the real `Funding` sheet tab.

**Step 1 is built.** `scripts/browser/map-form.js` maps a page's fields,
screenshots it, and logs to `vault/00-Inbox/` — tested against a sample form.
Steps 2–5 (resolving fields, filling, stopping at submit) aren't built yet:
there's no real grant portal targeted and the standard-answers reference
doesn't live in this repo yet, so there's nothing real to resolve fields
against. Build those once both exist.

## Preconditions
- The grant has a tracked row (currently: the local vault's grant pipeline,
  or `docs/resource-ledger.md`'s Funding findings — not yet unified).
- Every field the form requires has a confirmed, non-placeholder value.
- A human is available to review before submission.

## Steps
1. **Map the form first, fill nothing.** Run
   `node scripts/browser/map-form.js <url> <short-name>` — it enumerates every
   field (label, type, required?, max length), screenshots the page, and writes
   both to `vault/00-Inbox/`. Forms change; the map is the thing worth keeping.
2. **Resolve each field** against a standard-answers reference. Any unresolved
   required field → stop, report which fields are missing, do not guess.
3. **Fill, then screenshot every page** before advancing. Screenshots go to
   `vault/00-Inbox/` next to the run log.
4. **Stop at the submit button.** Write a run log with the filled values and the
   screenshots, and hand off to the human.
5. **Human submits.** Then record the submission date and confirmation number.

## Hard rules
- The automation never clicks final submit.
- The automation never invents a value, rounds a number, or shortens a narrative
  to fit a character limit without flagging it.
- Account credentials come from `.env` or Script Properties, never from the
  vault, never typed into a log.
- One portal at a time. Nothing resembling bulk submission.
