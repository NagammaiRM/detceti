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
