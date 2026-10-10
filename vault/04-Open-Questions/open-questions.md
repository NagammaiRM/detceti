# Open Questions

Things that need founder input before they can be resolved. Add a dated
entry per question; move to resolved (strike through or delete) once
answered, with the answer recorded in the relevant proper location
(risk-register, phase0-inventory, or here if purely informational).

## 2026-10-09

- **Where is the "Company Brain Spec" doc?** Referenced in the AI Tooling
  Ideas doc's priority order as "already built" and as the thing to do
  before anything else in that doc's list — but never supplied to this
  session. Needed to know what it actually says before acting on priority
  #1 of that list.
- **Is the pasted Apps Script v5.0 source what's currently deployed?**
  Found a real discrepancy between its `doGet` function (which returns the
  full Dashboard HTML page on a plain GET) and what the live dashboard URL
  actually returned when tested this session (`{"error":"use POST"}` on
  plain GET). See `docs/phase0-inventory.md` Section 3 for detail.
- **Is the `API_SECRET = 'CHANGE_ME_TO_RANDOM_STRING_32CHARS'` placeholder
  in the pasted source still literally what's deployed?** If so, this is a
  critical, trivially-guessable open secret on the dashboard API — need to
  confirm and rotate via `generateApiSecret()` if so.
- **What does "set up Claude Code with GitHub repos for maximum
  efficiency" mean beyond the current `detceti` connection?** Asked but
  underspecified — logged in `Founder-Directives-Checklist.md`.

## 2026-10-10

Surfaced while merging the rest of the parallel local session's vault (org
profile, grants, job roster — see `vault/00-Inbox/2026-10-10-*.md` and
`vault/03-Operations/`). All founder-input gaps, not engineering blockers:

- **Chapter facts for grant applications**: mission statement, founding
  date, geography served, programs/activities, legal status, EIN, website,
  public socials. See `vault/00-Inbox/2026-10-10-chapter-profile-and-brand-voice.md`.
- **Brand voice**: tone, phrases to use/avoid, reading level, emoji — needed
  before any agent drafts public-facing text (grant prose, Instagram captions).
- **Grant standard-answers**: narrative answers (mission, org summary, who
  we serve, measurable outcomes), numbers (budget, volunteers, people
  served). See `vault/03-Operations/Standard-Answers.md`. Blocks the
  grant-portal-fill playbook's step 2 until filled.
- **Grant pipeline contents**: which grants are actually being pursued,
  amounts, deadlines, stage. See `vault/03-Operations/Grant-Pipeline.md` —
  currently empty, and note it may already partly overlap with the real
  `Funding` sheet tab findings in `docs/phase0-inventory.md`/
  `docs/resource-ledger.md` rather than needing fresh founder input for
  everything.
