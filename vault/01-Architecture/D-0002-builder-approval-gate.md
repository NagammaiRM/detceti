# D-0002 — Builder agent never auto-deploys

> Merged 2026-10-10 from the parallel local session's vault. The mechanism
> this describes already moved here on 2026-10-09 (`scripts/builder/`,
> restated briefly in its own README) — this is the fuller decision record
> with the "why," which that README only summarized.

**Status: active. This is a hard constraint, set by Hari at project start.**
Same principle this repo's root `CLAUDE.md` already applies more broadly
("Changes that require founder approval before merging/deploying") and that
`skills/README.md`'s lifecycle applies to skill promotion — this note is
specifically about generated Apps Script automations.

## Decision

The builder agent may *generate* Apps Script code and *propose* it. It may never
deploy, push, or enable a trigger without an explicit human approval step.

## Why

The cloud half runs 24/7 and sends real things to real people — a bad generated
trigger can email the chapter's contacts in a loop, exhaust free API quotas, or
corrupt the Command Center. Generated code is a draft by definition; nobody has
read it yet. A review gate is the difference between "the AI drafted an automation"
and "the AI changed how the nonprofit operates."

## How it is enforced

Three layers, so no single mistake removes the gate:

1. **Self-contained proposal folders.** Each proposal's code and review note
   live together under `scripts/builder/proposals/P-XXXX/`. `push.js`
   refuses any path outside `scripts/builder/approved/`.
2. **An explicit human move.** A human reviews it and moves the proposal to
   `scripts/builder/approved/`. Moving the folder *is* the approval signal —
   the agent cannot do it, because nothing in `propose.js` or `push.js`
   writes to `approved/`.
3. **Push is a separate, manual command.** Deployment is never a side effect
   of generation. `push.js` names what it is about to deploy and to which
   script project, and requires `--confirm` — dry-run is the default.

Additionally: pushes target a **non-production Apps Script project** by
default (`--prod` is required, explicitly, to target production) until the
automation has run clean there. Triggers should be created disabled.

Tested end to end twice (2026-10-09 in the local vault, re-verified
2026-10-09 after the code moved here): refuses an unapproved push, dry-runs
before acting, stops cleanly rather than faking success when deploy
credentials are absent.

## What this costs

The builder agent is slower than it could be, and Hari is a bottleneck. That is the
intended trade. Revisit only if the review queue becomes the thing that stops work —
and then the fix is better proposals, not a weaker gate.
