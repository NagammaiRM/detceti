# Tests

Unit, integration, regression, and safety tests per
`docs/MASTER_SPEC.md` Part 20.2. Nothing in `docs/build-checklist.md` may be
marked TESTED without a corresponding test here (or a documented manual
test run with recorded evidence).

Priority test areas once there's something to test against: Safe Mode
enforcement, daily send-limit enforcement, duplicate/bounce suppression,
scheduler idempotency, API authentication on the dashboard/terminal bridge.
