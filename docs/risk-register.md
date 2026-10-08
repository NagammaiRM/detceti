# Risk Register

| ID | Risk | Likelihood | Impact | Mitigation | Status |
|---|---|---|---|---|---|
| R1 | Building agents/skills against assumed (unverified) sheet schema, then breaking on real structure | High while blocked | High (rework, possible data corruption on first real write) | No schema-dependent code until Phase 0 access confirmed and real schema inspected | Open |
| R2 | API secret exposure (recurrence of prior incident, spec 3.9) | Medium | High (unauthorized send/data access) | Secrets only in founder's local `~/.kk-bridge/config.json`, never in this repo; `.gitignore` excludes any `*secret*`, `*.key`, `config/*local*` | Mitigated, monitor |
| R3 | Automated outreach sends duplicate/unwanted email before Safe Mode + dedupe logic is verified | Medium | High (reputational/mission harm, matches explicit "never send duplicate/misleading/unwanted outreach" constraint) | No send-capable code to be written or enabled until Safe Mode, daily limits, and dedupe are implemented AND tested against real data | Open — blocks Phase 8 |
| R4 | Self-extending skills silently modifying production instructions | Low (not yet built) | High | Lifecycle states + promotion gate (spec Part 7) to be enforced in `skills/README.md` before any skill-generation code is written | Planned, not yet built |
| R5 | This cloud environment's network policy blocks live verification, leading to untested claims of "it works" | Confirmed, ongoing | Medium (slows Phase 0, risk of false confidence if skipped) | Explicit BLOCKED status tracked in `docs/phase0-inventory.md`; no feature marked TESTED without an actual run | Open, founder action needed |
| R6 | Treating historical spec claims (55 tasks, 9 agents, specific schedule, specific dollar amounts/deadlines for grants) as current fact | High if not disciplined | Medium (bad decisions from stale data) | Every historical claim tagged explicitly in `phase0-inventory.md` and re-verified before use | Open, ongoing discipline required |
| R7 | Financial/legal actions taken without explicit authorization | Low (no finance agent yet) | High | No SPEND permission granted to any agent by default (spec Part 18); Finance Agent design-only until explicitly activated | Planned |
| R8 | Obsidian memory writes overwrite verified facts with unverified model output | Low (not yet integrated) | Medium | Write→verify→index→retrieve workflow (spec 8.2) to be enforced once Obsidian integration exists | Planned, not yet built |

This register is updated as each phase proceeds — not a one-time document.
