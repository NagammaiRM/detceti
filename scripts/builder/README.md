# Builder Agent

Drafts new Apps Script automations as **proposals only** — self-contained
folders (code + review note together) under `proposals/`, never deployed
until a human moves one to `approved/` themselves.

This mirrors the founder-approval gate this repo already applies to skill
promotion (see root `CLAUDE.md`'s "Changes that require founder approval"
list, and `skills/README.md`'s lifecycle) — same principle, applied here to
generated Apps Script code specifically rather than Claude Code skills.

## Workflow

```
node scripts/builder/propose.js "<title>" "<problem>"
```
Creates `proposals/P-XXXX/code.gs` and `proposals/P-XXXX/README.md` together.
Fill in the TODOs — right now that means writing `code.gs` by hand, since
there's no AI backend wired up yet (no API key configured). This script
scaffolds the *structure*; it doesn't generate code.

**A human reviews it** — read the proposal's own README for what to write,
and check specifically: what does it write to, can it loop, does it email
anyone, what happens on a quota error, does it touch anything on the root
CLAUDE.md's founder-approval list (sending policy, Safe Mode, production
deployment, a new external service, a schema change, anything financial) —
and approves by moving the directory themselves:
```
mv proposals/P-XXXX approved/P-XXXX
```
Nothing in this repo can do that move for you. That's the approval signal.

```
node scripts/builder/push.js P-XXXX              # dry run — shows the plan, pushes nothing
node scripts/builder/push.js P-XXXX --confirm    # pushes to the TEST script project
node scripts/builder/push.js P-XXXX --prod --confirm   # pushes to PRODUCTION
```
`push.js` refuses anything not physically in `approved/`, refuses to act
without `--confirm`, and defaults to the test project. **The actual Apps
Script API call isn't implemented yet** — it needs a target project id and
a decided auth path (`clasp` vs. a service account) in `.env`. The gate
above it is real and tested; the deploy call itself is the next piece to
build once there's a real target project.

## What's NOT here yet

- **Code generation.** Proposals are hand-written until an AI backend is
  wired in with a key in `.env`.
- **The actual push.** See above — the gate works, the API call doesn't exist.

## Relationship to `skill-registry/` and `skills/`

Those track *Claude Code skills* (reusable, evaluated, with baseline/
candidate scores) — a different artifact type from the Apps Script
automations this tool proposes. Don't conflate the two review flows; this
one is deliberately simpler because the thing being reviewed is simpler
(a script to deploy, not a skill to evaluate against a benchmark).
