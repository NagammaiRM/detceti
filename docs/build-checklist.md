# Build Checklist

Every feature from the master spec, tracked through four honest states:
**PROPOSED** (in the spec, nothing built) → **IMPLEMENTED** (code exists) →
**TESTED** (ran against real or realistic data with a recorded result) →
**DEPLOYED** (live in production and the founder has confirmed it). A row
only advances when there's actual evidence — linked to a commit, a test
run, or a founder confirmation — not when it "should work."

## Phase 0 — Discovery, backup, baseline

| Item | State | Evidence |
|---|---|---|
| Repo inventory | IMPLEMENTED | This repo's `docs/phase0-inventory.md` |
| Live spreadsheet inventory | **TESTED** | Real tab/row content pulled via Drive `read_file_content`, findings in `docs/phase0-inventory.md` Section 2 — includes concrete deviations from the spec (undocumented tab, missing grant entry, exposed secret) |
| Live Apps Script inventory | **TESTED (partial)** | `GET`/`POST` behavior tested against the live URL (Section 3); full server-side source (`Code.gs`) received and reviewed — but found to likely NOT match what's actually deployed (see risk R12). `Dashboard.html`/`Sidebar.html`/`Approvals.html` still not received. |
| Backup plan | IMPLEMENTED | `docs/backup-recovery-plan.md` (plan only, not executed) |
| Backup executed | PROPOSED | A snapshot read happened, not a durable export — still open |
| Risk register | IMPLEMENTED | `docs/risk-register.md` |
| Resource ledger | IMPLEMENTED | `docs/resource-ledger.md` |

## Phase 1 — Claude Code foundation

| Item | State | Evidence |
|---|---|---|
| `CLAUDE.md` | IMPLEMENTED | this commit |
| Architecture docs | IMPLEMENTED (skeleton) | `docs/` — will expand per phase |
| Repo folder structure | IMPLEMENTED | this commit |
| Skill conventions | PROPOSED | `skills/README.md` to define lifecycle |
| Agent definitions | PROPOSED | `agents/` empty pending Phase 0 data |
| Tests/diagnostics | PROPOSED | `tests/` empty |
| Config schemas | PROPOSED | `schemas/` empty |
| Secret handling convention | IMPLEMENTED | `.gitignore` rules; `CLAUDE.md` statement |

## Phase 2 — Obsidian memory

All items PROPOSED. No Obsidian MCP tool available in current session.

## Phase 3 — COCO core

All items PROPOSED. Depends on Phase 0 live-system access.

## Phase 4 — Skills registry

All items PROPOSED.

## Phase 5 — Self-extending skills

All items PROPOSED.

## Phase 6 — SkillOpt integration

All items PROPOSED. Resource not yet inspected (see resource ledger).

## Phase 7 — Orchestration

All items PROPOSED. Depends on live Chief of Staff / agent inspection.

## Phase 8 — Autonomy and policy

All items PROPOSED. **No sending capability should move past PROPOSED until
Safe Mode, daily limits, and dedupe are independently TESTED** — this is a
hard gate, not a suggestion (risk R3).

## Phase 9 — Research and browser automation

All items PROPOSED. Serper key status unverified.

## Phase 10 — Creative workflow

All items PROPOSED. Pollinations.ai terms unverified.

## Phase 11-13 — Future agents, advanced interfaces, replication

All items PROPOSED, explicitly deferred per spec ("activate only when
workload... justify").

## Rule for this checklist

No PR, commit, or status report in this repo claims a feature "works" by
citing this file unless the row says TESTED or DEPLOYED with linked
evidence. A PROPOSED or IMPLEMENTED row is not a working feature.
