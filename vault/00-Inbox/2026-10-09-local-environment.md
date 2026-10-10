# Local Environment — Hari's laptop

> Pasted verbatim (lightly adjusted, noted below) from a parallel local
> Claude Code session's vault, merged here 2026-10-09 to stop two engineering
> efforts forking. Raw/dated per this folder's convention — file into
> `01-Architecture/` or elsewhere if it earns a permanent home.

Surveyed 2026-10-06, updated 2026-10-09. Re-check before assuming any of this.

## Machine
- Windows 11 Home, 10.0.26200
- Shells available: PowerShell 5.1 and Git Bash

## Installed
| Tool | Version | Notes |
|---|---|---|
| Node.js | v24.19.0 | current, fine for Playwright |
| npm | 11.17.0 | |
| Python | 3.14.7 | `python` works; `python3` is the Store stub, don't use it |
| pip | 26.2.1 | |
| git | 2.55.0.windows.3 | global identity is `nagu <nagammai.origin@gmail.com>` |
| Obsidian | installed | no community plugins in the pre-existing personal vault |
| Playwright | installed 2026-10-09 | Chromium only (not Firefox/WebKit — grant portals don't need cross-browser); lives in `scripts/browser/node_modules`, binaries in `%LOCALAPPDATA%\ms-playwright` |

## Not installed
- `gh` (GitHub CLI)
- `clasp` (Apps Script CLI) — one option for `scripts/builder/`'s push step;
  still needed before that script can actually deploy anything

## Constraints that shape the architecture

> [!success] Disk: resolved 2026-10-09
> Was ~1.0 GB free of 476 GB on C: — deleted 43 GB of leftover VM disk images
> (`OneDrive\Documents\Virtual Machines\`, confirmed unused), now ~56 GB free.
> This is what was blocking Playwright; it's installed and verified working now.

> [!note] Git identity, resolved
> Originally flagged here as "not Hari's" because it didn't match the
> KindKoalas local vault's assumptions. It actually matches this repo's own
> GitHub owner (`NagammaiRM` / `nagammai.origin@gmail.com`) closely enough
> that it's very likely correct for commits pushed here — flagging only in
> case "Hari" and the account name being different is itself worth a
> sentence of confirmation, not because the identity looks wrong.

## Other things on this machine
- `C:\Users\sokku\Hari's Brain` — pre-existing personal Obsidian vault (19
  notes: academics, NCSSM application, competitions, We Strive, daily
  notes). Deliberately kept separate from any Kind Koalas vault — personal
  notes shouldn't ride along with anything synced for the cloud half to read.
- `C:\Users\sokku\KindKoalas` — the parallel local project this content was
  merged from. Its `vault/` still holds org profile, grant pipeline, and
  decision-log content that wasn't part of this merge (roster/environment/
  playbooks only) — see that repo if something seems missing here.
- `C:\Users\sokku\Github` and `C:\Users\sokku\IdeaProjects` — unrelated older
  projects.
