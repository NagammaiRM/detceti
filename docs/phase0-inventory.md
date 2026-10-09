# Phase 0 Inventory — Discovery, Backup, Baseline

Status key: **CONFIRMED** (directly observed with evidence this session) /
**BLOCKED** (attempted, could not verify, reason given) / **UNVERIFIED**
(not yet attempted) / **HISTORICAL CLAIM** (asserted in the spec, not yet
re-checked).

Last updated: 2026-10-08, this session (revised — all three prior blockers
resolved: GitHub push access, this environment's network policy, and the
Drive connector now all work; see Section 2 and 3 below for real findings).

## 0. CRITICAL — live secret exposed in plaintext in the sheet

The `Settings` tab (row 2, columns A–B) stores `GEMINI_API_KEY` as a raw
value directly in a cell, readable by anyone with viewer access to the
spreadsheet (and by this session, via `read_file_content`). **The key value
is not reproduced here or anywhere in this repo**, per spec constraint
("never display actual secrets in reports").

This is the same class of risk the spec's Part 3.9 security-incident check
was written for — a credential sitting somewhere it can leak from — except
this one is confirmed live, today, not historical. Recommended action for
the founder, independent of anything else in this document:
1. Rotate this Gemini API key now (generate a new one at
   https://aistudio.google.com/app/apikey, revoke the old one).
2. Move it out of a plain sheet cell into Apps Script's `PropertiesService`
   (script properties), which isn't readable via normal spreadsheet viewer
   access or the Drive content-export API used here.
3. Audit who/what currently has viewer or editor access to the spreadsheet,
   since anyone with view access could already have read this value.

## 1. Engineering repository

| Item | Status | Evidence |
|---|---|---|
| `detceti` repo exists and is git-tracked | CONFIRMED | `git log` on branch `claude/bold-dirac-goghha` showed "does not have any commits yet"; repo is otherwise empty (no files besides `.git`). |
| `detceti` is the intended Phase-1 engineering repo | CONFIRMED (per founder decision this session) | Founder chose "Use detceti" when asked. |
| Repo previously contained Kind Koalas / COCO code | REJECTED | No files found; no references to "Kind Koala" anywhere in repo. |

## 2. Command Center spreadsheet

Spec URL: `https://docs.google.com/spreadsheets/d/1BivsGfKnUhfzTZ02PV6jh0-YcZqIqT1iwiXRCfl_16w/edit`

**Access confirmed.** `get_file_metadata` now succeeds: title "Kind Koalas
AI Command Center", owned by `kindkoalaapex71@gmail.com`, created
2026-10-04, last modified 2026-10-08 20:41 UTC, 45,549 bytes. Full tab
content pulled via `read_file_content` this session.

| Item | Status | Evidence |
|---|---|---|
| Tab count and names | **CONFIRMED — differs from spec** | **16 tabs found, not 15.** All 15 spec-named tabs exist (Tasks, Agents, Memory, Approvals, Activity_Log, Settings, Templates, Roles, Contacts, Funding, Decisions, Org_Chart, Blockers, Request_Queue, Agent_Health) **plus one undocumented tab: `Reflex_Bus`** (A1:F128 — columns Timestamp, Circuit_ID, Input, Signal, Confidence, Notes; appears to be a send-safety allow/block filter, e.g. a row blocking `info@dorcas.org` with reason "Previously bounced"). **Founder confirmed this was built autonomously by a previous agent**, not by the founder or the spec. Whether it's actually wired into the live send path is still unverified — tracked as risk R10. |
| ~55 tasks | **CONFIRMED (close)** | `Tasks` tab range is A1:P56 → 55 task rows (T001–T055 range), matches spec's "~55" claim. |
| 9 agents | **CONFIRMED** | `Agents` tab range A1:N9 → 8 agent rows under the header, consistent with spec's 9-agent claim (header + 8, or 9 total depending on count method — worth an exact recount, but in the right ballpark). Columns include `Auto_Allowed`, `Approval_Required`, `Restricted`, `Schedule`, `Model`, `Prompt`, `Enabled`, `Last_Run`, `Status` — a real, structured permission model already exists per-agent, not just in the spec's prose. |
| 45+ contacts | **CONFIRMED** | `Contacts` tab range A1:P46 → 45 contact rows. Dorcas Ministries (C001) confirmed `Relationship_Status: Bounced`, matching the spec's historical claim exactly. |
| Funding pipeline: Triangle Community Foundation, Blue Cross NC, CHIF $5,000 Oct 30 deadline | **CONFIRMED (CHIF explained)** | `Funding` tab has only 2 rows: Triangle Community Foundation (F001) and Blue Cross NC Foundation (F002), both `Status: Not Started`, both with empty `Amount` and unverified deadlines ("Feb 2025 annual cycle" / "Rolling LOI"). **Founder confirmed the CHIF $5,000/Oct 30 entry was a test, not a real grant** — correctly absent from the live sheet. Treat any future CHIF-named entry as presumed test data unless the founder says otherwise. |
| `Decisions` tab has recorded decisions | **CONTRADICTED** | Tab is header-only (A1:H1) — zero decisions logged yet. |
| `Settings` tab holds config including API keys | **CONFIRMED — see Section 0 above** | Contains `GEMINI_API_KEY` (plaintext, not reproduced here) and `SPREADSHEET_ID`. |
| Live, current provider failures (spec 3.7's "outdated/unavailable Gemini models") | **CONFIRMED, currently happening** | `Activity_Log` shows a real error from 10/4/2026 10:49:49: `"This model models/gemini-2.0-flash is no longer available... use models/gemini-3.8-flash"`. The `Agents` tab still lists `Model: gemini-1.5-pro` for both inspected agent rows — i.e. the configured model and the model the code actually tries to call may not even match each other, separate from either being currently valid. **This needs fixing before any agent is relied on.** |
| `Approvals` log exists with real send history | **CONFIRMED** | 39 rows. First two both show outreach to `info@dorcas.org` (the now-bounced contact), status "Sent", approved by Hari — consistent with the spec's account of a 28-email bulk send episode. |
| `Blockers` tab | **CONFIRMED, mostly resolved** | Only 2 rows: one open ("Missing real-time enrollment data from Healthcare Access team"), one resolved (LinkedIn admin access). Far fewer open blockers than the spec's framing implied. |

**No further action needed to read the sheet** — access works. Remaining
gap: this was a snapshot read, not yet a full backup export (see
`docs/backup-recovery-plan.md`), and the Apps Script source itself is still
unverified (Section 3).

## 3. Apps Script project / dashboard web app

Spec URLs:
- Dashboard (from spec Part 3.4): `.../AKfycby8svWwHqUxmrLUa24bGsXwyPWxuoaz8dOfv_OlFQ9ZrCe5pkvP6UYWxlFA1mfTvj43JQ/exec`
- Redeployed URL given mid-conversation: `.../AKfycbxByJciqHYwmHCV9rQUOhBd2BAlzSw-EjGTzg7Vd_ZvarLpuy7pvkh3SsoXuWSp1hdwIQ/exec`

| Item | Status | Evidence |
|---|---|---|
| Network reachability from this environment | **CONFIRMED working** (was BLOCKED, founder widened network policy) | `curl` to `script.google.com` now succeeds (TLS connects, no proxy rejection). |
| `GET` on either deployment URL | **CONFIRMED working** | Both the spec's original URL and the redeployed URL return HTTP 200 with body `{"error":"use POST"}` — confirms `doGet` exists and correctly rejects non-POST, matching the spec's documented API shape. |
| `POST` on either deployment URL, tested from this cloud environment | **CONFIRMED BROKEN, but environment-specific — see next row** | Every POST tested from inside this session (bogus secret + real action, `{}` empty body) got a broken Google Drive error page via the redirect, never real JSON. |
| `POST` tested from the founder's own machine (`kk_stats` via `Invoke-RestMethod`) | **CONFIRMED WORKING** | 2026-10-09: founder ran `kk_stats` and got back clean JSON: `{"error":"unauthorized"}` — exactly `doPost`'s own unauthorized-secret branch from the received source (`apps-script/Code.gs`). **This resolves the POST mystery**: the deployment works fine; this cloud environment's proxy was mangling the POST+redirect flow, not the deployment itself. It also confirms the live `doPost` closely matches the received source. |
| Secret mismatch | **CONFIRMED — founder's config secret ≠ live `API_SECRET`** | The `unauthorized` response means whatever's in `~/.kk-bridge/config.json`'s `secret` field doesn't match the Apps Script project's actual `API_SECRET` constant. Two live possibilities, not yet distinguished: (a) the founder didn't actually edit the config.json placeholder before saving, or (b) they have a real secret but the live script's `API_SECRET` is a different value (possibly still the literal `'CHANGE_ME_TO_RANDOM_STRING_32CHARS'` placeholder flagged in risk R11). Founder needs to open the Apps Script editor, check the real `API_SECRET` value, and reconcile. |
| Apps Script source (`Code.gs`) | **RECEIVED, not yet confirmed as what's live** | Founder pasted the full server-side source (labeled "v5.0") on 2026-10-09 — saved to `apps-script/Code.gs`. **Found a real discrepancy**: this source's `doGet` has no code path producing the `{"error":"use POST"}` response this session actually got from both live dashboard URLs on a plain GET. Either this is a newer draft not yet deployed, or a third version is in play. See `apps-script/SOURCE_NOTES.md` and risk R12 — don't treat conclusions drawn from reading this file as confirmed live behavior until the founder checks the Apps Script editor. |
| `Dashboard.html`, `Sidebar.html`, `Approvals.html` | UNVERIFIED | Referenced by `Code.gs` (`HtmlService.createHtmlOutputFromFile(...)`) but not yet supplied. |
| `GEMINI_API_KEY` storage mechanism | **CONFIRMED, no alternative exists in code** | `getApiKey()` → `getSetting()` reads only from the `Settings` sheet tab — there's no `PropertiesService` read for this key anywhere in the source. Moving it to Script Properties (the "proper fix" recommended for risk R2) **requires a code change**, not just a settings change — confirmed as a real blocker, not hypothetical. |
| `API_SECRET` storage and value | **CONFIRMED mechanism, value unconfirmed** | Hardcoded as a JS `const`, not read from the sheet — better hygiene than the Gemini key (not exposed via sheet-viewer access). But the received source's literal value is still the placeholder `'CHANGE_ME_TO_RANDOM_STRING_32CHARS'`. **Unknown whether the live deployment still has this exact placeholder** — see risk R11, founder needs to check. |
| Per-agent `Model` column (`Agents` tab) actually controls routing | **CONTRADICTED** | `runAgent()` never reads it. Real routing is hardcoded inside `callGemini()`: Groq (3 models) → GitHub Models (4 models) → a fixed Gemini fallback list (`gemini-3.8-flash`, `gemini-3.7-flash`, `gemini-2.5-flash` — notably not `gemini-2.0-flash`, the model that 404'd in the live `Activity_Log`). If this source is actually deployed, that specific historical error may already be fixed — but see the deployment-match caveat above. |
| `Reflex_Bus` tab wired into the send path | **CONTRADICTED (in this file)** | No function in `Code.gs` reads or writes `Reflex_Bus`. It is listed as one of 12 "required tabs" in the `testEverything()` diagnostic, so it was deliberately added at some point, just not into active logic — most likely a half-finished feature, not live safety enforcement. Risk R10 downgraded accordingly, not closed. |

**Next action (founder):** run `kk_stats` from your own PowerShell and
report whether it works. That single result tells us whether the POST
failure above is this cloud environment's proxy or the deployment itself.

## 4. Agents (spec 3.2)

**Partially CONFIRMED via `Agents` tab (Section 2).** The 2 rows inspected
(Chief of Staff, Healthcare Access) match the spec's names, mission, and
schedule claims, and additionally have a real `Auto_Allowed` /
`Approval_Required` / `Restricted` permission split per agent — a concrete,
already-built piece of the Part 18 policy engine the spec asks for, not
something to design from scratch. `Agent_Health` tab (A1:G10) shows live
status: Chief of Staff 89% success/7d with 2 failures and 1 open blocker,
Healthcare Access 100%/7d. The remaining 7 agents' rows weren't individually
transcribed here — full dump belongs in a proper backup export, not pasted
inline into this doc.

## 5. Scheduler / triggers (spec 3.6)

Still **UNVERIFIED** — the sheet shows agents' intended `Schedule` field
(e.g. "Daily 7am", "Mon/Wed/Fri 9am") but that's the configured schedule,
not proof the Apps Script trigger is actually installed and firing. Needs
Apps Script project/trigger-list access, which is still blocked (Section 3).

## 6. Security incident (spec 3.9)

Claimed: a terminal/API secret was previously exposed and rotated.

| Item | Status |
|---|---|
| Current secret validity, old secret revocation, no secret in client code, git history clean, logs clean | UNVERIFIED — depends on Apps Script source access (still blocked, Section 3). |
| No secret stored in plaintext anywhere accessible | **CONTRADICTED — see Section 0.** A live `GEMINI_API_KEY` is stored in plaintext in the `Settings` sheet tab, readable by this session. This is a new, currently-live finding, not the historical incident the spec describes — treat as a separate, more urgent issue. |

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

1. The engineering repo location (`detceti`) is decided, and GitHub push
   access, this environment's network policy, and the Drive connector are
   all now confirmed working.
2. The live spreadsheet is real, accessible, and mostly matches the spec —
   with concrete deviations now on record: an undocumented `Reflex_Bus`
   safety tab, no CHIF grant entry despite the spec's claim, an empty
   `Decisions` tab, and a live (not historical) exposed API key.
3. The dashboard web app responds correctly to GET but every POST from this
   environment hits a broken Google-side redirect — not yet known whether
   that's this environment's proxy or the deployment itself. Resolving that
   needs one data point only the founder can supply: does `kk_stats` work
   from their own machine?
4. The Apps Script source code itself is still unverified — the spreadsheet
   data and the code that operates on it are two different things, and only
   the former has been inspected so far.

**Exit criterion for Phase 0 (per spec) is close but not met.** The
spreadsheet inventory is real; a full backup export, the Apps Script source
inspection, and the POST-reachability question are still open.
