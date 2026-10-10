# Command Center Sheet

> Merged 2026-10-10 from the parallel local session's vault — was a blank
> template; filled in with what `docs/phase0-inventory.md` Section 2
> already confirmed, since that's richer than anything available locally.
> **`docs/phase0-inventory.md` stays the authoritative, evidence-backed
> source** — this note is a quick index into it, not a replacement.

**URL:** https://docs.google.com/spreadsheets/d/1BivsGfKnUhfzTZ02PV6jh0-YcZqIqT1iwiXRCfl_16w

The source of truth for live state: job schedules, run status, agent config. The
vault does not duplicate it — the vault records what it means.

## Tabs (confirmed 2026-10-09, see `docs/phase0-inventory.md` Section 2 for ranges/evidence)

16 tabs total — all 15 the master spec names, plus one undocumented:

| Tab | Purpose (as confirmed) | Notes |
|---|---|---|
| Tasks | ~55 task rows (T001–T055) | matches spec claim |
| Agents | 8–9 agent rows | has real `Auto_Allowed`, `Approval_Required`, `Restricted`, `Schedule`, `Model`, `Prompt`, `Enabled`, `Last_Run`, `Status` columns — a real per-agent permission model, not just prose |
| Memory | — | not yet detailed here |
| Approvals | 39 rows of real send history | first two rows: outreach to `info@dorcas.org` (now-bounced), approved by Hari |
| Activity_Log | — | shows a live provider error: `gemini-2.0-flash` no longer available, 10/4/2026 |
| **Settings** | config incl. API keys | **`GEMINI_API_KEY` stored here in plaintext** — see `vault/01-Architecture/API-Inventory.md`, risk R2 |
| Templates | — | not yet detailed here |
| Roles | — | not yet detailed here |
| Contacts | 45 rows | Dorcas Ministries (C001) confirmed `Relationship_Status: Bounced` |
| Funding | 2 rows: Triangle Community Foundation, Blue Cross NC Foundation | both `Not Started`, empty amounts — see `vault/03-Operations/Grant-Pipeline.md` |
| Decisions | header-only | zero decisions logged yet, despite the name |
| Org_Chart | — | not yet detailed here |
| Blockers | 2 rows | 1 open (missing real-time enrollment data), 1 resolved |
| Request_Queue | — | where Coco routes cloud-agent requests per `agents/chief-of-staff.md` |
| Agent_Health | — | not yet detailed here |
| **Reflex_Bus** (undocumented) | send-safety allow/block filter, e.g. blocks `info@dorcas.org` | not in the master spec; founder confirmed a prior agent built it autonomously; not referenced by current Apps Script source — likely dead weight, not closed (risk R10) |

## Fragility notes

- Apps Script addresses these positionally (`getRange` with numeric
  indices) — inserting a column breaks callers silently. Exact column
  letters aren't captured here yet; get them from the live sheet or
  `apps-script/Code.gs` before writing anything that touches a specific range.
- Which tabs are safe to write by hand vs. agent-owned-only: not yet documented.
