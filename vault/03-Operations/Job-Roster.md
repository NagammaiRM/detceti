# Job Roster

> Merged 2026-10-10 from the parallel local session's vault. Overlaps
> somewhat with `docs/build-checklist.md` (feature build status) and the
> `Agents` tab's own `Schedule` column (confirmed to exist with real
> structure per `docs/phase0-inventory.md` Section 2) — this note's job is
> specifically **failure impact** (what breaks if a job silently stops),
> which neither of those tracks.

24+ scheduled jobs on the cloud half. The Sheet owns schedule and last-run status.
This note owns **what breaks if the job stops** — the thing a dashboard won't tell you.

> [!todo] Document the 24+ jobs
> One row each. Prioritize the `failure_impact` column; it's the reason this
> note exists. Cross-check cadence against the real `Agents` tab `Schedule`
> column rather than guessing.

| Job | Trigger / cadence | Agent | Failure impact | Alerting? |
|---|---|---|---|---|
| TODO | | | | |

## Local jobs

None yet. When local jobs exist they run via Windows Task Scheduler and must be
written to assume **the laptop was off** for an arbitrary period — catch-up logic,
never "run every hour" assumptions.
