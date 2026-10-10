# Agent Roster

> **Provenance:** merged 2026-10-09 from a parallel local Claude Code session's
> vault. See the status note at the top of [[chief-of-staff]] — this table
> isn't yet cross-checked against the live `Agents` sheet tab per
> `docs/phase0-inventory.md`'s Phase 0 discipline.

Both halves, one table. Purpose and schedule come from [[chief-of-staff]]
(Coco's own account of the team); Reads/Writes/AI-backend columns are the
technical contract, still mostly unverified against the live system.

> [!todo] Reads / Writes / AI backend per cloud agent
> Still need: what each agent reads, what it writes, which free API it calls,
> cross-checked against the real `Agents` tab once Phase 0 access allows it.

## Cloud (Apps Script, 24/7)

| # | Agent | Purpose | Schedule | Reads | Writes | AI backend | Detail note |
|---|---|---|---|---|---|---|---|
| 1 | Chief of Staff (Coco) | Coordinates everyone, daily briefing | Hourly | | | | [[chief-of-staff]] |
| 2 | Healthcare Access | Provider outreach, MOUs, awareness | Mon/Wed/Fri | | | | |
| 3 | Outreach | Community org outreach, cold emails/calls | Mon/Wed/Fri | | | | |
| 4 | Community Engagement | Fundraising, grants, drives | Weekly Mon | | | | |
| 5 | Social Media | Content calendar, drafts posts | Daily 8 AM | | | | |
| 6 | Operations | Member tracking, onboarding, contacts | Weekly Tue | | | | |
| 7 | Research | Grant research via STORM method, web search | Weekly Wed | | | | |
| 8 | Idea Creation | New programs, campaigns, tactics | Weekly Thu | | | | |
| 9 | Organizer | Cleanup, dedup, data hygiene | Weekly Sun | | | | |

## Local (this laptop, when awake)

| # | Agent | Purpose | Reads | Writes | Status |
|---|---|---|---|---|---|
| 10 | Builder Agent | Drafts new automations/code from plain requests; everything lands in a review queue, nothing auto-deployed | `agents/`, `docs/` | `scripts/builder/proposals/` | Workflow scaffolded, approval gate tested (`scripts/builder/`) |
| 11 | Browser Agent | Playwright automation for grant portals and other no-API sites | `vault/03-Operations/` | `vault/00-Inbox/` | Form-mapper built and tested (`scripts/browser/`) |
| 12 | *(open slot)* | Reserved — candidates: a Memory Curator that condenses vault logs, or a Fact-Check agent for grant accuracy | — | — | Undecided |
