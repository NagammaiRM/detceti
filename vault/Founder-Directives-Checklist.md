# Founder Directives Checklist

Every discrete instruction the founder has given, tracked here and checked
off as completed. Separate from `docs/build-checklist.md` (feature status)
and `docs/risk-register.md` (risks) — this is specifically "did I do what
was asked."

- [x] Build a kk.ps1 PowerShell bridge for local terminal → dashboard access
- [x] Build the Claude Code engineering repo scaffold (Phase 0/1)
- [x] Produce real Phase 0 findings from the live sheet once access worked
- [x] Create the Obsidian vault (this folder) before anything else, so
      pasted content doesn't get lost
- [x] File the "AI Tooling Ideas Worth Building" research doc into the vault
- [x] File the real Apps Script v5.0 source into `apps-script/`
- [x] Add `vercel-labs/skills` to the resource ledger
- [ ] **Set up Claude Code with GitHub repos "for maximum efficiency"** —
      asked but underspecified. Currently `detceti` is the only repo
      connected to this session. If this means something more specific
      (connecting additional repos, e.g. a separate vault repo, or one of
      the researched tool repos like OpenDots), say which ones and they'll
      get added via `add_repo`.
- [ ] **Rotate the Gemini API key** (founder action — AI Studio + Settings
      tab, see prior message) — not yet confirmed done
- [x] **Confirm whether the pasted Apps Script v5.0 source is what's
      actually deployed** — `doPost`/`api_stats()` now confirmed matching
      exactly (real `kk_stats` response shape proves it); `doGet` match
      still open but low-priority, see `docs/phase0-inventory.md` Section 3
- [x] **Run `kk_stats` successfully from PowerShell** — done 2026-10-10,
      returns real live task/approval/contact data
- [x] Decide what to do about the hardcoded placeholder `API_SECRET` —
      regenerated via `generateApiSecret()` and redeployed; confirmed live
      via working `kk_stats`
- [ ] Consolidate the local Claude Code session's separate vault/work into
      this repo — instructions given 2026-10-09, not yet confirmed done
- [ ] Explain Fly Brain integration when ready — founder said "ignore for
      now," so it's parked, not investigated, not built on
