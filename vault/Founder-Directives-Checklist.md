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
- [ ] **Confirm whether the pasted Apps Script v5.0 source is what's
      actually deployed** — found a real discrepancy (see
      `docs/phase0-inventory.md` Section 3) between this source's `doGet`
      behavior and what the live dashboard URL actually returned when
      tested
- [ ] **Run `kk_stats` successfully from PowerShell** — blocked: the
      `~/.kk-bridge/` folder/files were never actually saved on the
      founder's machine (see chat — `kk.ps1` wasn't found at
      `C:\Users\sokku\.kk-bridge\kk.ps1`)
- [ ] Decide what to do about the hardcoded placeholder `API_SECRET =
      'CHANGE_ME_TO_RANDOM_STRING_32CHARS'` found in the pasted source —
      critical if that literal placeholder is still what's live
- [ ] Explain Fly Brain integration when ready — founder said "ignore for
      now," so it's parked, not investigated, not built on
