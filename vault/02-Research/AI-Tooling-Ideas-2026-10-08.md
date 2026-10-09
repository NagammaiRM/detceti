---
title: AI Tooling Ideas Worth Building
date: 2026-10-08
author: Hari
status: received verbatim, not yet independently verified by this session
---

> Filed verbatim from a founder-pasted research doc. Repo claims (stars,
> license, "confirmed real") are as stated by the source doc, not
> independently re-checked by this session yet. Treat star counts and
> "confirmed real" labels as the original author's claims until spot-checked.
> Cross-reference: `docs/resource-ledger.md` is the authoritative
> ADOPT/BORROW/REJECT tracker for the engineering repo — this note is the
> narrative version for context.

# AI Tooling Ideas Worth Building

## OpenDots
Repo: github.com/CopilotKit/OpenDots — confirmed real, MIT-licensed, built by CopilotKit. Labeled alpha / early development, not a hosted product — you run it yourself.

**What it is:** A template for building persistent AI agents ("Dots") that stay running and move between text, voice calls, and Slack — described as "always-on AI coworkers." Each Dot has its own role, its own instructions, and its own permitted tools, rather than one generic assistant doing everything.

**Key features:**
- Spaces and pages — a searchable document library with a visual editor where Dots save their own notes/output
- Specialist Dots — each one scoped to a role with its own tools
- Dot computers — each Dot gets its own browser, files, and shell (built on OpenBot), with permissions set per Dot
- Approval gates — drafts pause for your approval before saving; any non-read-only tool pauses before running
- Calls, Slack, and scheduled background work built in

**Setup:**
```
# requires Node.js 24 + npm
git clone https://github.com/CopilotKit/OpenDots.git
cd OpenDots
npm ci
cp .env.example .env
npm run dev
# open http://127.0.0.1:5173
```
To actually chat with a Dot, connect a model:
```
npx copilotkit@latest login
npx copilotkit@latest project select
# then add to .env:
# OPENAI_API_KEY=...
# OPENAI_MODEL=...
# restart: npm run dev
```
(Don't run `copilotkit onboard` in this folder — it adds a second, conflicting CopilotKit integration.) Voice calls need a separate speech provider the repo doesn't name — skip that part unless you specifically want voice.

**Where this could fit:** Closest match yet to what's wanted from both Coco (Kind Koalas's Chief of Staff agent) and TARS — both are, conceptually, exactly what OpenDots calls a "Dot." Worth a real test run before building more custom infrastructure. The approval-gate pattern is a direct, ready-made answer to the custom settings-file approach built by hand in the Automation Orbit video.

## Claude Dashboards + Claude Motion
Confirmed real — genuine Anthropic artifact types, not third-party.
- **Claude Dashboards** — build a live analytics dashboard directly from your data
- **Claude Motion** — turn a dashboard into an animated narrative video, steerable with comments, exports into design tools

**Where this helps:**
- Kind Koalas: chapter impact data → dashboard-then-narrated-video for volunteers/donors/partners
- TARS: once the Master Dashboard exists, turns "what's overdue / this week's priorities" into something glanceable
- Science Olympiad/research projects: a results dashboard turned into a narrated video for presentation/judging

## Magpie — Model Switcher
Repo: github.com/yetone/magpie — confirmed real. Menu-bar app, one gateway across ~20 coding agents, routes cheap/simple tasks to a cheaper model to save Claude quota for real-judgment work.
```
git clone https://github.com/yetone/magpie.git
cd magpie
# check the README for the exact build/run command for your OS
```
Still need your own subscriptions/API keys per model — this is a switcher, not a free-tier proxy.

**Where it helps:** Kind Koalas agents doing routine, low-judgment work (formatting, lookups, data entry) can run on a cheaper model, freeing Claude calls for Coco's actual decisions.

## Jev / Verification-Loop — Cheap Pre-Pass Verification
Source: a skill on Tessl's registry (tessl.io/registry/.../verification-loop) — confirmed real, added through Tessl, not a repo clone.

Pattern: a fast, cheap first-pass true/false + confidence check; Claude only does the full judgment pass on cases flagged uncertain.
```
# requires a Tessl account — check tessl.io for current signup/CLI install steps
tessl skill add verification-loop   # confirm exact syntax on Tessl's own page first
```
**Where it helps:** any workflow checking many items against criteria — e.g. "does this lead match our outreach criteria?" Use as the fast filter, Claude only for what it flags.

## Infrastructure Patterns Worth Adopting
Not single repos — patterns from the Automation Orbit and Hermes/Waterloots videos, worth building regardless of specific tool chosen.

**Tailscale** (free, real, widely used) — private network across devices, no publicly reachable address. Directly relevant to the omniroute exposed-port issue (0.0.0.0, no API key) and any future VPS use.
```
# install from https://tailscale.com/download, then on each device:
tailscale up
```

**routines.yaml — scheduled-job registry** — one file listing every scheduled routine (name, purpose, schedule, machine), instead of scattering jobs across Apps Script triggers with no single view. Directly applicable to Kind Koalas's existing triggers.

**Conbon / kanban task board** — cards move triage → ready → running → blocked → review → done, every handoff recorded. Worth it once agent count/task volume makes "what's everyone doing" hard to answer by eye.

## Perplexica / "Vain" — Research Literature Search
Open-source, self-hosted Perplexity alternative (~37k stars claimed), MIT-licensed. Clickable numbered sources, academic/forum search, PDF upload+Q&A. Works with free Gemini key or local Ollama, or your own Claude/OpenAI key.

**Where it helps:** research-heavy science-fair projects (AFib detection, BCL-2 inhibitor screening, oncolytic virus matching) as a literature-search layer with real citations, outside of asking Claude directly.

## Confirmed NOT Worth Pursuing

| Item | Why skip it |
|---|---|
| "Bass mode" (2nd brain tool) | No matching repo found — no spec possible |
| "Go Live" (app-deploy tool) | Same issue — no verifiable repo found |
| jcode | Unverified marketing claims (20x memory, 63x speed vs Claude Code/Codex), no independent confirmation |
| "Free Claude Code Repo" (bradautomates/claude-video) | Reroutes Claude Code's backend to third-party free models — against Anthropic's Claude Code terms, risks the account |
| "Free LLM API" (stacking free-tier quotas) | Likely violates providers' own ToS, routes API keys/history through a third-party tool |

If real repo links for "Bass mode" or "Go Live" surface later, re-spec them then — no guessing at install commands for unverifiable repos.

## Priority Order — What to Actually Try First

1. **The Company Brain** (separate doc, already built: Company Brain Spec — Kind Koalas + TARS) — do this first; everything below works better with shared context instead of none.
2. **OpenDots** — worth a real test run before building more custom agent infrastructure by hand.
3. **Tailscale** — quick win, fixes the omniroute exposure issue, sets up for future VPS use.
4. **Claude Dashboards + Motion** — once there's real Kind Koalas data worth presenting.
5. **Magpie + Jev** — once agent workload is big enough that API cost matters; not urgent yet.
6. **routines.yaml + conbon board** — once task volume makes tracking hard by eye.
7. **Perplexica** — whenever a research project needs a dedicated literature-search pass.

---
*Open question logged in `vault/04-Open-Questions/`: where is the "Company Brain Spec" doc referenced in priority #1? Not yet supplied to this session.*
