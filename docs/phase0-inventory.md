# Phase 0 Inventory — Discovery, Backup, Baseline

Status key: **CONFIRMED** (directly observed with evidence this session) /
**BLOCKED** (attempted, could not verify, reason given) / **UNVERIFIED**
(not yet attempted) / **HISTORICAL CLAIM** (asserted in the spec, not yet
re-checked).

Last updated: 2026-10-08, this session.

## 1. Engineering repository

| Item | Status | Evidence |
|---|---|---|
| `detceti` repo exists and is git-tracked | CONFIRMED | `git log` on branch `claude/bold-dirac-goghha` showed "does not have any commits yet"; repo is otherwise empty (no files besides `.git`). |
| `detceti` is the intended Phase-1 engineering repo | CONFIRMED (per founder decision this session) | Founder chose "Use detceti" when asked. |
| Repo previously contained Kind Koalas / COCO code | REJECTED | No files found; no references to "Kind Koala" anywhere in repo. |

## 2. Command Center spreadsheet

Spec URL: `https://docs.google.com/spreadsheets/d/1BivsGfKnUhfzTZ02PV6jh0-YcZqIqT1iwiXRCfl_16w/edit`

| Item | Status | Evidence |
|---|---|---|
| Spreadsheet reachable via this session's Google Drive connector | BLOCKED | `get_file_metadata` on file ID `1BivsGfKnUhfzTZ02PV6jh0-YcZqIqT1iwiXRCfl_16w` returned "Requested entity was not found." The connector's account either isn't shared on the file, or is the wrong account. |
| 15 tabs (Tasks, Agents, Memory, Approvals, Activity_Log, Settings, Templates, Roles, Contacts, Funding, Decisions, Org_Chart, Blockers, Request_Queue, Agent_Health) exist with the described structure | HISTORICAL CLAIM | Cannot verify until access is resolved. |
| ~55 tasks, 9 agents, 45+ contacts | HISTORICAL CLAIM | Cannot verify until access is resolved. |

**Next action (founder):** share the sheet with this session's connected
Google account, or reconnect the Google connector to the account that owns
it, at https://claude.ai/customize/connectors — then start a new session.

## 3. Apps Script project / dashboard web app

Spec URLs:
- Dashboard (from spec Part 3.4): `.../AKfycby8svWwHqUxmrLUa24bGsXwyPWxuoaz8dOfv_OlFQ9ZrCe5pkvP6UYWxlFA1mfTvj43JQ/exec`
- Redeployed URL given mid-conversation: `.../AKfycbxByJciqHYwmHCV9rQUOhBd2BAlzSw-EjGTzg7Vd_ZvarLpuy7pvkh3SsoXuWSp1hdwIQ/exec`

| Item | Status | Evidence |
|---|---|---|
| Either URL reachable from this environment | BLOCKED | `curl` to `script.google.com` on both URLs failed: agent egress proxy returned `connect_rejected` / gateway 403, i.e. this environment's network policy denies the host outright. No request reached Google. |
| Apps Script source files (`Dashboard.html`, `Sidebar.html`, `Approvals.html`, the function inventory in spec 3.8) exist as described | HISTORICAL CLAIM | Not inspected — no Apps Script API tool available in this session, and the bound Drive file (if any) hasn't been located (blocked on item 2 above). |
| A working PowerShell bridge (`kk.ps1`) exists on the founder's own Windows machine and can reach the redeployed URL directly | CONFIRMED (by founder, outside this session) | Built earlier this conversation; founder's machine has no network-policy restriction, unlike this cloud container. Founder has not yet reported back a `kk_stats` test result. |

**Next action (founder):** either (a) widen this environment's network
policy to allow `script.google.com`/`googleapis.com` so this session can
test the web app directly, or (b) run `kk_stats` from your own machine and
paste the output here, or (c) both — (a) is needed regardless for any
automated Phase-0+ testing to happen from this repo rather than manually.

## 4. Agents (spec 3.2)

9 agents claimed: Chief of Staff, Healthcare Access, Outreach, Community
Engagement, Social Media, Operations, Research, Idea Creation, Organizer —
each with a specific schedule. **HISTORICAL CLAIM, unverified.** Depends on
spreadsheet (`Agents`, `Agent_Health` tabs) and Apps Script source access.

## 5. Scheduler / triggers (spec 3.6)

The consolidated master-scheduler trigger list is a **HISTORICAL CLAIM**.
Cannot verify installed triggers, timezone, or execution history without
Apps Script project access.

## 6. Security incident (spec 3.9)

Claimed: a terminal/API secret was previously exposed and rotated.

| Item | Status |
|---|---|
| Current secret validity, old secret revocation, no secret in client code, git history clean, logs clean | UNVERIFIED — depends on Apps Script source + deployment access. |

No secret has been requested or stored in this repo or session. The
PowerShell bridge built earlier stores the secret only in
`~/.kk-bridge/config.json` on the founder's own machine, outside source
control.

## 7. Known historical problems to regression-test (spec 3.7)

Not yet re-tested (provider 404s, 429s, 503s, Trusted Types errors, trigger
limits, Obsidian bridge failures, bounced contacts incl. Dorcas Ministries
and a food bank contact, etc.) — all depend on live system access.

## 8. Obsidian / persistent memory

No Obsidian MCP tool is available in this session. `stevenstavrakis/obsidian-mcp`
and `iansinnott/obsidian-claude-code-mcp` (spec 8.4) have not been inspected.
**UNVERIFIED**, tracked in `docs/resource-ledger.md`.

## Summary: what's actually been established this session

1. The engineering repo location (`detceti`) is decided.
2. Two independent, concrete environment blockers exist and have documented
   fixes (network policy; Drive connector access/sharing).
3. Nothing about the live spreadsheet, Apps Script source, agents, triggers,
   or past incident could be confirmed yet — every claim above the line is
   either evidenced-BLOCKED or explicitly marked HISTORICAL CLAIM, not fact.

**Exit criterion for Phase 0 (per spec) is not yet met.** It requires actual
inspection of the live system, which requires both blockers above to be
resolved first.
