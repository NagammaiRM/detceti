# Grant Pipeline

> Merged 2026-10-10 from the parallel local session's vault, which had this
> as a blank template. **Replaced the TODO placeholder row with the real
> `Funding` tab contents already confirmed in `docs/phase0-inventory.md`
> Section 2** (not independently re-verified here, just not duplicating a
> blank tracker when the real data is already known one file over).

One row per grant. One detail note per grant once it's active.

| Grant | Funder | Amount | Deadline | Stage | Portal has API? | Next action |
|---|---|---|---|---|---|---|
| F001 | Triangle Community Foundation | not set in sheet | "Feb 2025 annual cycle" (unverified) | Not Started | unknown | confirm deadline is real/current — "Feb 2025" reads stale |
| F002 | Blue Cross NC Foundation | not set in sheet | "Rolling LOI" (unverified) | Not Started | unknown | same — confirm amount/deadline before treating as actionable |

Stages: `researching` → `drafting` → `submitted` → `decided` (per the
original template — the live sheet's own `Status` column currently only
shows `Not Started` for both rows, so this mapping isn't verified against
real data yet).

> [!note] CHIF grant doesn't exist
> An earlier spec referenced a CHIF $5,000 grant with an Oct 30 deadline —
> confirmed by the founder to be test data, correctly absent from the live
> sheet. Don't resurrect it without a real source.

## Why the local half cares

Grant portals are the clearest case for browser automation: almost none have APIs,
all of them want the same twenty facts, and the deadlines are real. The flow is
`Standard-Answers.md` + `PB-Grant-Portal-Fill.md` → a filled form a human checks and
submits. **The local half fills; a human submits.**
