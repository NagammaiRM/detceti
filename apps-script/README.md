# Apps Script

Will hold a synchronized copy of the live Apps Script project source (the
function groups listed in `docs/MASTER_SPEC.md` Part 3.8: core settings, AI
provider adapters, Safe Mode/sending, agents, email/replies, research,
approvals, orchestration, operations, agent coordination, system health,
Obsidian bridge, setup/maintenance).

**Empty — blocked.** This session's Google Drive connector cannot see the
Command Center spreadsheet/bound script project (see
`docs/phase0-inventory.md`), and this environment's network policy blocks
`script.google.com` outright, so there is currently no way to pull the real
source from here. Do not write speculative reimplementations of these
functions until the real source has been inspected — the spec is explicit
that historical descriptions of these functions are claims to verify, not
specifications to build from scratch.
