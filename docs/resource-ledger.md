# Resource Ledger

Every external resource named in the master spec. Decision key: **ADOPT**,
**BORROW IDEAS**, **OPTIONAL LATER**, **REJECT**, **BLOCKED** (cannot decide
yet — access/verification needed). Default for everything below until
actually inspected is **BLOCKED — not yet inspected**; this ledger exists so
nothing gets silently installed without a recorded decision per constraint
12 ("do not treat a GitHub star count, video demonstration, or marketing
claim as proof of production readiness").

## Core priorities (spec 21.1)

| # | Resource | Verified? | Decision | Notes |
|---|---|---|---|---|
| 1 | microsoft/SkillOpt | Not inspected | BLOCKED | Needed for Phase 6; inspect README/license/activity before any adoption. |
| 2 | jaredrhod/ai-memory-vault | Not inspected | BLOCKED | Phase 2 candidate; check license + maintenance. |
| 3 | ruvnet/ruflo | Not inspected | BLOCKED | |
| 4 | microsoft/playwright-mcp | Not inspected | BLOCKED | Phase 9 candidate. |
| 5 | AlekDob/nami | Not inspected | BLOCKED | |
| 6 | JustVugg/colibri | Not inspected | BLOCKED | Local-model research only (Part 24.2); requires hardware assessment first. |
| 7 | deepseek-ai/deepseek-harness | Not inspected | BLOCKED | |
| 8 | paperclipai/paperclip | Not inspected | BLOCKED | |
| 9 | NousResearch/hermes-agent | Not inspected | BLOCKED | |
| 10 | titechprabhasolutions/Brahma-Ai-Evo | Not inspected | BLOCKED | |

## Additional repositories (spec 21.2)

All of the following are **BLOCKED — not yet inspected**, no exceptions made
yet: jamiepine/voicebox, calesthio/OpenMontage, palmier-io/palmier-pro,
imartinez/privateGPT, zackriya-solutions/meetily, cosscom/coss,
vellum-ai/originkit, techtrips/agent-ui, mrlnlms/obsidian-ui-system,
Atharvsinh-codez/ObsidianUI, teambit/bit, pewdiepie-archdaemon/odysseus,
p-e-w/heretic, FlashML-org/FreeToken, NandhaKishorM/laya,
diegosouzapw/OmniRoute, geopopos/higgsfield_ai_mcp, mnfst/awesome-free-llm-apis,
velo4705/awesome-free-byok-models, jaredrhod/fullstack-agent,
jaredrhod/backtalk, jaredrhod/ai-visualizer, jaredrhod/barehands,
jaredrhod/ai-marketing-skills.

None of these are required for Phase 0/1. They should be triaged in
batches when the relevant phase (per spec Part 25) is actually reached —
not inspected speculatively now, to avoid burning time on repos that may
never be needed.

## Skill/resource indexes (founder-supplied, post-Phase-0)

Not named in the original spec; supplied afterward. Both are large curated
*indexes* of links — not installable code, not an MCP server, not an agent
framework. Their value is as the "search existing skills / approved
resource index" step the spec requires in Part 7.3 before building any new
skill from scratch, and as a source to check during Phase 1 skill-building
(spec 6.3) and Phase 6 (SkillOpt).

| Resource | Inspected | Finding | Decision |
|---|---|---|---|
| [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) | Yes — README fetched this session | Hand-curated list of Claude Code resources: skills, agents, status lines, dev tooling, plugins. Data-driven (`THE_RESOURCES_TABLE_NEW.csv`, generator scripts). ~2,026 commits, 55.3k stars, 4.8k forks, ~1.2k open issues. External contributions go through issues, not direct PRs. License file present, type not confirmed from the page. | **ADOPT as a search index** — consult it whenever Part 7.3 says "search existing skills/resource index" before writing a new skill, especially for Phase 1's Apps Script / Sheets / Gmail / dashboard skills. Not installing anything from it yet — it's a catalog, each entry needs its own inspection before use. |
| [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) | Yes — README fetched this session (first ~100k chars; not fully read) | 1000+ agent skills indexed by publisher (Anthropic official skills, OpenAI, Google Gemini, Cloudflare, Microsoft/Azure — 133 skills, Supabase, MongoDB, Redis, Firebase, Angular, Expo, Flutter, WordPress, Trail of Bits security skills, Sentry, Datadog, SerpApi, Firecrawl, Browserbase, marketing/PM categories, etc.). MIT licensed. 742 commits, 35.4k stars, 3.8k forks, 41 open PRs, 1,497+ skills counted. Compatible across Claude Code, Codex, Gemini CLI, Cursor. Individual skills are hosted externally (officialskills.sh or their own repos) — this repo is purely the index. | **ADOPT as a search index**, same basis as above. Particularly relevant for Phase 9 (research/fact-checking — Firecrawl/Browserbase/SerpApi entries) and Phase 10 (any design/content skills) once those phases are reached. No individual skill from it has been inspected or installed. |

Neither entry changes Phase 0 status: still blocked on live sheet/Apps
Script access regardless of what skills exist to borrow from later.

## API / provider resources (spec 9, 23.2)

| Provider | Verified free tier (this session)? | Decision |
|---|---|---|
| Groq | No | BLOCKED |
| GitHub Models | No | BLOCKED |
| Google Gemini (AI Studio) | No | BLOCKED |
| NVIDIA NIM | No | BLOCKED (spec notes prior payment/access uncertainty — must re-verify before any reliance) |
| Mistral, SambaNova, LLM7.io, OpenRouter, Cerebras, Together AI, Cloudflare Workers AI, Hugging Face | No | BLOCKED |
| Serper (web search) | No | BLOCKED — spec says this was the working provider; re-verify quota/key validity before relying on it |
| Pollinations.ai (image gen) | No | BLOCKED — spec explicitly warns not to assume unlimited free generation |

**No provider should be claimed "free" or "working" anywhere in this repo's
docs or code until it has actually been called successfully this phase**,
per spec constraint 2 and Part 27.

## Organization / fundraising links (spec 23.1)

kindkoala.org, LinkedIn page, GoFundMe, Canva design — reference links only,
not engineering resources. No action needed unless content work (Phase 10)
references them.

## Untranscribed video URLs (spec 22.1)

20 YouTube URLs listed in the spec with no available transcript content.
**Not fetched, not summarized, not assumed.** Per the spec's own instruction:
mark unverified and continue; fetch only if later judged relevant and
accessible, and only as literal transcript retrieval, never inference from
title alone.

## Previous Claude Code sessions (spec 23.4)

Three private session URLs referenced. **Not accessible from this session.**
If they contain requirements not already captured in the master spec, the
founder needs to export/paste the relevant content — this repo cannot reach
another session's private transcript.

## How this ledger gets updated

Every time a resource is actually inspected (README read, license checked,
a test call made), update its row here with the real finding and move its
decision out of BLOCKED. Do not mark ADOPT/REJECT/OPTIONAL on anything that
hasn't been actually opened and read.
