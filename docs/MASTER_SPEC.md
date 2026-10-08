# Kind Koalas Apex — COCO Master Architecture Spec (v3.0)

> This is the full build mandate as supplied by the founder, kept verbatim
> as the source of truth for scope. Working documents derived from it live
> alongside this file in `docs/`: `phase0-inventory.md` (what's actually
> verified), `resource-ledger.md` (every linked resource + decision),
> `build-checklist.md` (feature status), `risk-register.md`.
>
> Note on `PART 23.4` below: the three private Claude Code session URLs it
> references are not accessible from this repo or this session. If they
> contain requirements not already captured here, they need to be
> exported/pasted in by the founder.

---

MASTER ARCHITECTURE, RESEARCH, ENGINEERING, AUTOMATION, AND AUTONOMY SPECIFICATION
Version: 3.0 — Comprehensive Build Mandate
Project: Kind Koalas Apex Chapter AI Operating System
Central AI: COCO
Engineering environment: Claude Code
Operational infrastructure: Google Workspace and Google Apps Script
Long-term memory: Obsidian and evaluated memory integrations
Budget: $0/month for the core system
Primary objective: Build a reliable, persistent, self-improving AI workplace that helps operate and grow the nonprofit while allowing the founder to concentrate on strategy, relationships, and decisions that genuinely require human judgment.

PART 1 — YOUR ROLE AND THE MISSION

You are the principal systems architect, senior software engineer, AI agent engineer, automation specialist, security engineer, researcher, quality assurance engineer, technical writer, and implementation lead for the Kind Koalas Apex Chapter.
Your responsibility is to transform the existing collection of Google Workspace automations and AI agents into a coherent, dependable, continuously improving operating system.
Do not produce only a plan, mockup, proof of concept, or impressive-looking dashboard.
Inspect the actual environment, understand the existing implementation, design the architecture, implement the improvements, test them, document them, and verify the results.
However, do not immediately modify production. Start with discovery, backups, and a baseline assessment. Work through explicit phases, preserve functioning systems, and obtain approval before destructive or otherwise high-risk changes.

1.1 The nonprofit mission

Kind Koalas is a youth-led nonprofit connecting individuals and families experiencing financial hardship with free or reduced-cost healthcare.
The Apex/Cary, North Carolina chapter previously had a 17-person human team. That team left, leaving the founder responsible for rebuilding the operation.
The current goal is to use AI to perform much of the routine organizational work that would otherwise require a substantial team.

The AI workplace should help:
- Discover healthcare providers and community partners.
- Build relationships with clinics, healthcare professionals, nonprofits, schools, churches, food banks, and other organizations.
- Conduct responsible outreach.
- Manage replies and follow-ups.
- Research grants and funding opportunities.
- Prepare grant applications.
- Coordinate volunteers and members.
- Create educational and promotional materials.
- Manage projects, tasks, deadlines, and meetings.
- Maintain institutional knowledge.
- Analyze failures and improve its working methods.
- Report meaningful progress and identify problems.
- Help connect eligible families with appropriate healthcare resources.

The mission is the priority. AI infrastructure is useful only insofar as it improves real nonprofit operations.

1.2 The desired founder experience

The founder should not need to supervise every routine task.
The ideal interaction is:
- "COCO, what happened today?"
- "What needs my attention?"
- "Handle the routine outreach."
- "Find five suitable healthcare partners."
- "Research grants we may qualify for."
- "Why did this task fail?"
- "What did we learn from that failure?"
- "Can you develop a skill for this recurring problem?"
- "Give me the most important decisions I need to make."
- "Show me the evidence behind that recommendation."

COCO should understand the request, consult organizational memory, inspect the live system, delegate work, execute authorized actions, verify results, and explain what happened.
The founder should remain responsible for strategic direction, significant external commitments, legal and organizational judgments, financial authority, and decisions that require human accountability.

PART 2 — NON-NEGOTIABLE CONSTRAINTS

1. $0/month core operating target. Do not introduce subscriptions or paid infrastructure as dependencies without explicit authorization.
2. Verify current free-tier limits, commercial terms, quotas, rate limits, data retention, and account requirements before adopting a service.
3. Preserve the live Google Sheets, Apps Script, Gmail, dashboard, templates, contacts, tasks, and working automations.
4. Do not rebuild working components merely because a newer framework exists.
5. Do not silently delete data, change permissions, replace production configuration, or deploy untested code.
6. Do not put API keys, tokens, or passwords in source code, public repositories, prompts, skill files, browser-visible JavaScript, or logs.
7. Do not allow self-improving agents to silently rewrite production code or instructions.
8. Every meaningful operation should be logged, attributable, and recoverable where practical.
9. Prefer the simplest architecture that meets the requirements.
10. Keep the founder-facing experience understandable to a student without requiring infrastructure expertise.
11. Do not pretend an integration works until it has been tested.
12. Do not treat a GitHub star count, video demonstration, or marketing claim as proof of production readiness.
13. Distinguish proposed features from implemented features and tested features.
14. Do not send duplicate, misleading, or unwanted outreach.
15. Do not claim that a provider guarantees care, a grant is secured, or a family has received assistance unless the evidence supports that statement.
16. Do not make paid voice calling, a VPS, local GPUs, or premium AI services prerequisites for the core system.
17. Do not allow advanced interfaces or experimental AI tools to delay the healthcare mission.
18. Use minimal necessary permissions for every integration.
19. Respect nonprofit policies, applicable privacy requirements, provider terms, and the rules of each external service.
20. If a task is blocked, record the blocker and explain the smallest actionable next step.

PART 3 — DISCOVER AND PRESERVE THE EXISTING SYSTEM

The current system is live. Treat the following as the initial architecture inventory, then verify each item against the actual project.

3.1 Command Center spreadsheet

Existing spreadsheet:
https://docs.google.com/spreadsheets/d/1BivsGfKnUhfzTZ02PV6jh0-YcZqIqT1iwiXRCfl_16w/edit

Known tabs:
1. Tasks — approximately 55 tasks.
2. Agents — 9 operational agents.
3. Memory — dated agent outputs and organizational context.
4. Approvals — drafts, approvals, and send auditing.
5. Activity_Log — operational history.
6. Settings — configuration, modes, and integration settings.
7. Templates — communication templates.
8. Roles — chapter roles.
9. Contacts — 45+ community and healthcare contacts.
10. Funding — grant and funding opportunities.
11. Decisions — decisions and rationale.
12. Org_Chart — organizational relationships.
13. Blockers — unresolved issues.
14. Request_Queue — inter-agent requests.
15. Agent_Health — agent status and health.

Verify the live sheet structure before making changes. Preserve existing identifiers and data relationships.

3.2 Current agents

1. Chief of Staff: management, coordination, priorities, and escalation; runs hourly.
2. Healthcare Access: provider research, outreach, and partnership coordination; Monday, Wednesday, Friday.
3. Outreach: community organization outreach; Monday, Wednesday, Friday.
4. Community Engagement: fundraising, grants, and community relationships; weekly Monday.
5. Social Media: content calendar and social content; daily at 8 AM.
6. Operations: member tracking, onboarding, and operational tasks; weekly Tuesday.
7. Research: research and STORM-inspired grant investigation; weekly Wednesday.
8. Idea Creation: programs, campaigns, and tactics; weekly Thursday.
9. Organizer: cleanup, deduplication, and maintenance; weekly Sunday.

Retain these agents unless evidence supports a controlled redesign.
Do not lose the responsibilities from the earlier organizational model: Chief of Staff, Operations, Grants, Partnerships, Marketing, Volunteer, Finance, Research.
These can initially be implemented as skills or responsibilities within existing agents. Add separate agents when the workload justifies them.

3.3 Current working behavior

The existing system has previously demonstrated: 28 bulk outreach emails; 8 automated sends; a configurable daily sending limit of 5; daily briefings; daily stand-ups; weekly rollups; reply notifications; bounce warnings; blocker escalation; agent-to-agent requests; a Google Apps Script dashboard; real-time activity visibility; a request queue and activity log.
These are historical observations, not proof that every feature currently works. Re-test them.

3.4 Existing dashboard

Current dashboard URL:
https://script.google.com/macros/s/AKfycby8svWwHqUxmrLUa24bGsXwyPWxuoaz8dOfv_OlFQ9ZrCe5pkvP6UYWxlFA1mfTvj43JQ/exec

Existing features include: agent health grid and run buttons; activity feed; approvals and rejection actions; task status and overdue tasks; blockers and requests; latest briefing; automatic refresh; browser, phone, and tablet layouts.
Existing files include Dashboard.html, Sidebar.html, and Approvals.html.
Verify the deployed version before changing it. Do not assume the URL is still active or the deployment contains the latest source.

3.5 Existing interface features

Google Sheets sidebar; Approvals dialog; custom AI Team menu; Gmail labels; Tampermonkey floating agent panel; dedicated Chrome profile used to avoid permission conflicts.
Preserve working features and existing agent identity colors unless a change is necessary.

3.6 Existing scheduler

A consolidated master scheduler is used to avoid excessive Google Apps Script triggers.
Known intended schedule: every hour: orchestrator; every two hours: Chief of Staff processes blockers; 6 AM daily: system-health/morale calculation; 7 AM daily: founder briefing; 8 AM daily: social media planning; 9 AM Mon/Wed/Fri: healthcare report; 9 AM Monday: weekly outreach (up to 5 emails); 9 AM Tuesday: operations report; 9 AM Saturday: weekly rollup; 10 AM Mon/Wed/Fri: outreach report; 10 AM Thursday: idea brief; 11 AM Monday: community engagement report; 11 AM Wednesday: research/STORM brief; 5 PM daily: Gmail sent-status sync; 6 PM daily: reply detection and stand-up; 7 PM daily: reply drafting and authorized sending; 8 PM daily: bounce detection; 10 PM Sunday: organizer cleanup.
Verify timezone, trigger installation, execution history, and actual schedule.
Prefer one consolidated scheduler with a job registry, last-run state, locking, retry policy, and idempotency. Do not add one trigger per new feature without a documented reason.

3.7 Historical problems to regression-test

Outdated/unavailable Gemini models; provider 404s; 429 rate limits; 503 provider overload; missing helper functions; browser Trusted Types errors; sidebar/dialog permission problems; trigger limits; Obsidian bridge failures; NVIDIA auth/payment requirements; OpenRouter/Cerebras access restrictions; missing trigger installers; duplicate agent requests; incorrect agent-health status parsing; stale dashboard deployments; Gmail send-status discrepancies; email bounces.
Historical bounced contacts include Dorcas Ministries and a food bank contact. Re-verify contact data before future outreach.

3.8 Apps Script function inventory

Audit existing implementations of functions in these groups: core settings/spreadsheet access (getSS, getSetting, setSetting); AI providers (callGemini, tryGroq, tryGemini, tryGithubModels, tryNvidiaNim, etc.); Safe Mode/sending (isSafeMode, checkSafeMode, sendOrDraft, etc.); agents (runAgent, chiefOfStaff, healthcareAgent, outreachAgent, communityAgent, socialAgent, operationsAgent, researchAgent, ideaCreationAgent, organizerAgent); email/replies (briefing, outreach, reply detection, response drafting, status sync, bounce checking); research (searchWeb, researchWithWebSearch, STORM functions); approvals; orchestration (orchestrator, masterScheduler, jobShouldRun, trigger installation); operations (task seeding, contact checks, due dates, role setup, funding setup); agent coordination (request creation/completion, marker parsing, duplicate cleanup); system health (morale, stand-ups, rollups, diagnostics, provider health checks); Obsidian (vaultWrite, vaultRead, vaultList); setup/maintenance functions including deprecated/disabled installers.
Do not restore old or disabled setup functions blindly. Determine which are safe, obsolete, or destructive.

3.9 Security incident check

A terminal/API secret was previously exposed and reportedly rotated. Verify: current secret validity; old secret no longer used; old credentials revoked where appropriate; no secret embedded in client-side code; git history does not expose live credentials; logs do not print credentials; API requests authenticate correctly; production endpoints expose only permitted operations; deployments use least necessary permissions.
Never display actual secrets in reports.

3.10 Phase-zero deliverables

1. Complete system inventory. 2. Architecture diagram. 3. Confirmed working features. 4. Broken features. 5. Unfinished features. 6. Obsolete/duplicate components. 7. Dependency map. 8. Backup and recovery plan. 9. Baseline test results. 10. Risk register. 11. Prioritized implementation plan. 12. Changes requiring founder approval.

PART 4 — THE CENTRAL ARCHITECTURE

Build one integrated workplace rather than nine disconnected scripts.
Target architecture: Founder → COCO → Policy and Tool Router → Chief of Staff → Specialized Agents → Google Workspace and Approved External Tools.
Supporting systems: Claude Code (engineering/local dev); Obsidian (long-term human-readable knowledge); Skills (reusable capabilities); Skill optimization (controlled capability improvement); Scheduler (recurring execution); Task system (workload/dependency management); Model router (provider resilience); Browser tools (bounded computer interaction); Dashboard (visual control room); Terminal CLI (command-line control); Observability (operational history/metrics); Backup system (recoverability); Evaluation framework (measurable quality).
Keep the system modular. Google Workspace should remain the operational backbone unless discovery identifies a verified, material reason to migrate.

PART 5 — COCO: THE LIVE AI OPERATING INTERFACE

COCO is the most important new architectural component. COCO is the founder-facing intelligence and interaction layer, not merely another department agent.

5.1 COCO responsibilities

Understand natural-language requests; answer questions using actual organizational data; read operational status from the spreadsheet and dashboard backend; search durable memory; retrieve previous decisions and explanations; ask the Chief of Staff to plan and delegate work; create tasks and assign owners; run authorized agents; monitor results; detect repeated failures and capability gaps; propose skills; explain system behavior; report pending decisions; summarize recent work; prepare daily and weekly briefings; explain uncertainty; distinguish verified facts from assumptions; escalate high-risk decisions; maintain conversational continuity across sessions using persistent memory.

5.2 COCO's internal components

1. Conversation manager. 2. Session context manager. 3. Persistent memory manager. 4. Organizational-state reader. 5. Task manager. 6. Delegation manager. 7. Tool router. 8. Model router. 9. Policy engine. 10. Skill registry. 11. Chief of Staff connector. 12. Observability and audit logger. 13. Error recovery manager. 14. User-facing explanation layer.
Do not place all logic into one enormous prompt.

5.3 COCO interaction examples

"What needs me?": inspect overdue/high-priority tasks; inspect blockers and pending approvals; check replies requiring judgment; check funding deadlines; check failures and unhealthy agents; rank issues by importance; explain recommended action and why.
"Handle the routine work": clarify only genuinely ambiguous details; check policy and existing work; create or identify tasks; delegate to the Chief of Staff; let the Chief of Staff allocate work; run permitted actions; verify outcomes; report completed, failed, and blocked work.

5.4 COCO interfaces

Build in this order: 1. Terminal/Claude Code interaction. 2. A persistent text-chat interface connected to the real backend. 3. Integration into the existing dashboard. 4. Optional voice interface. 5. Optional TARS-like face/avatar. 6. Optional computer-use and vision interfaces.
Do not build a decorative avatar before COCO can reliably read data, remember decisions, execute permitted actions, and explain results. Voice, face, and camera features must remain optional presentation layers.

PART 6 — CLAUDE CODE ENGINEERING ENVIRONMENT

Create a dedicated, version-controlled project repository for the COCO and Kind Koalas engineering layer. First verify whether an appropriate repository already exists.

6.1 Recommended project structure

CLAUDE.md; docs/; agents/; skills/; skill-registry/; evaluations/; src/; apps-script/; config/; schemas/; tests/; scripts/; memory/; artifacts/; deploy/; research/; CHANGELOG.md.
Use a .gitignore appropriate to the selected tools. Keep secrets and private data out of source control.

6.2 CLAUDE.md

Keep the root CLAUDE.md concise. It should tell Claude Code: what Kind Koalas is; what COCO is; what the existing system does; which documents describe the architecture; where skills and agent definitions live; how to run tests; how to back up and restore; which changes require approval; how to avoid modifying production prematurely; how to verify completion.
Do not dump every organizational fact into the root file. Use it as a signpost to authoritative documents.

6.3 Skills setup

Inspect current official Claude Code documentation before creating the skill structure.
Create useful skills for: Kind Koalas organizational context; Google Apps Script engineering; Google Sheets operations; Gmail outreach and reply handling; healthcare provider research; community partnership research; grant research; grant application analysis; STORM-style evidence synthesis; contact validation and deduplication; safe email operations; dashboard development; testing and regression prevention; debugging; Obsidian memory management; model routing; browser automation; social media content; documentation; skill evaluation and improvement; security review; backup and recovery.
A skill should contain focused, reusable instructions. Do not create skills solely to make the directory look extensive. Every skill must document its intended scope, permitted tools, expected output, failure behavior, and tests.

PART 7 — SELF-EXTENDING SKILLS AND SKILL OPTIMIZATION

This is a core feature, not a later optional extra. The system should be able to discover capability gaps, research existing solutions, propose skills, test improvements, and improve its capabilities using evidence.

7.1 Required lifecycle

Capability gap → Search existing skills → Research → Candidate → Isolated test → Evaluation → Validation → Version → Promotion → Monitoring → Rollback if needed.

7.2 Capability-gap detection

A gap may be detected from: repeated failed tasks; repeated manual work; recurring blockers; low evaluation scores; poor-quality drafts; agent requests that cannot be fulfilled; missing integrations; repeated founder corrections; outdated instructions; new organizational needs.
Record each gap with an identifier, evidence, affected workflow, expected benefit, urgency, and risk.

7.3 Candidate-skill creation

Before creating a new skill: search existing project skills; search the approved resource index; inspect available integrations; determine whether an existing skill can be improved; estimate implementation/maintenance cost; identify security/permission requirements; define a measurable success criterion.
Create the candidate in an isolated workspace. Do not allow a skill to silently change its own production instructions.

7.4 Skill metadata

Stable skill ID; name/purpose; version; status; owner; source; creation date; agent scope; inputs/outputs; tools required; permissions required; dependencies; risk class; evaluation dataset; baseline score; candidate score; changelog; approval/promotion record; rollback version.
Lifecycle states: DISCOVERED → CANDIDATE → TESTING → VALIDATED → ACTIVE. Additional: REJECTED, DEPRECATED, ROLLED_BACK.

7.5 Skill evaluation

Define representative test cases; record baseline results; run the candidate against the same cases; evaluate factual accuracy, task completion, policy compliance, consistency, resource use; use held-out tests to reduce overfitting; inspect regressions; record the results; reject improvements that do not produce meaningful evidence.
Do not declare a skill better because its output merely sounds more confident.

7.6 Controlled promotion

Low-risk skill changes may be automatically promoted only when the policy engine explicitly permits it and the evaluation threshold is met. Require founder review for high-risk changes, including those that: increase external permissions; change sending policy; change authentication; access sensitive data; modify production deployment; introduce a new external service; change financial or legal workflows.
Every promotion must be versioned and reversible.

7.7 Microsoft SkillOpt

Explicitly inspect the repository: https://github.com/microsoft/SkillOpt
Use the actual current source and documentation. Verify its architecture, dependencies, supported workflows, licensing, and compatibility. Investigate its rollout, reflection, skill-editing, and validation concepts. Do not assume old tutorial instructions or commands remain valid.
Intended optimization cycle: BASELINE → ROLLOUT → REFLECTION → EDIT → EVALUATE → VALIDATE → PROMOTE OR REJECT → MONITOR.
Implement only the parts that are compatible with the current system and measurably useful. The goal is controlled, evidence-based improvement of skills — not unrestricted self-modification of the entire AI system.

PART 8 — OBSIDIAN AND PERSISTENT MEMORY

Obsidian should become the long-term, human-readable knowledge layer. Google Sheets remains the operational database. Do not confuse the two.

8.1 Memory categories

Organization profile; mission and goals; founder preferences; chapter operations; agent responsibilities; skills; current projects; strategic decisions; partnerships; healthcare provider knowledge; community organization knowledge; grant opportunities; outreach history; playbooks and procedures; daily summaries; weekly summaries; lessons learned; failed approaches; recurring workflows; system architecture; deployment instructions; incident history; open questions; future ideas.
Use stable identifiers and links between related notes.

8.2 Memory rules

Separate durable knowledge from temporary state; preserve source provenance; include timestamps where relevant; do not overwrite verified facts with unverified model-generated claims; do not duplicate every spreadsheet row in the vault; record important decisions with their rationale; record what was tried, what happened, and what should change; keep sensitive information to the minimum necessary; make memory searchable; test persistence across separate sessions.
Use a controlled write → verify → index → retrieve workflow.

8.3 AI Memory Vault

Inspect: https://github.com/jaredrhod/ai-memory-vault.git
Evaluate the architecture, license, dependencies, maintenance, and integration requirements. Use useful ideas for structured memory, retrieval, and continuity. Do not blindly copy a personality system or replace existing memory functionality without evidence.

8.4 Obsidian MCP

Research current Obsidian MCP implementations and the official/current Obsidian integration options. Two candidates previously mentioned: stevenstavrakis/obsidian-mcp; iansinnott/obsidian-claude-code-mcp. Verify the exact repository URLs before use. Choose an integration based on reliability, permissions, security, and maintainability.

8.5 Memory acceptance tests

Verify that COCO can: save a decision; retrieve the decision in a new session; find related notes; distinguish a verified fact from an assumption; update a note without deleting unrelated content; explain where a remembered fact came from; rebuild its index if needed; recover from a failed write.

PART 9 — MODEL ROUTING AND FREE AI PROVIDERS

Implement a provider-agnostic model router.
Historically researched providers: Groq; GitHub Models; Google Gemini; NVIDIA NIM; Mistral; SambaNova; LLM7.io; OpenRouter; Cerebras; Together AI; Cloudflare Workers AI; Hugging Face.
Groq was the historical primary provider, with GitHub Models and Gemini used as fallbacks. NVIDIA NIM was being investigated but had previous access/payment uncertainty. Serper was the web-search provider.
These are historical architecture notes, not guarantees of present availability.

9.1 Provider verification

For each provider verify: current endpoint; current model IDs; authentication method; free quota; rate limits; commercial usage terms; privacy/data-retention terms; required payment method; regional restrictions; reliability; whether it supports the task; whether it is actually free for the intended workload.
Never claim a provider is free without current evidence.

9.2 Routing behavior

Choose models by task: classification; structured extraction; email drafting; research synthesis; complex reasoning; fact-checking; skill evaluation; final quality review.
Use the cheapest reliable option for each task while preserving quality.
Implement fallback behavior for: rate limits; authentication errors; permission errors; missing models; retired models; timeouts; provider outages; malformed responses; invalid structured output. Use backoff and bounded retries.

9.3 Model telemetry

Record: provider; model; task; timestamp; latency; success/failure; fallback usage; error category; usage metrics where available; approximate cost status; evaluation result where applicable.
Do not record API keys or unnecessary private information.

PART 10 — RESEARCH, STORM, AND FACT-CHECKING

Preserve the existing Serper web-search integration if it is working.
Build a research pipeline: define the research question; develop a search strategy; gather multiple relevant sources; record source URLs and dates; extract supporting evidence; identify disagreements and uncertainty; summarize findings; recommend an action; store the research artifact; recheck time-sensitive claims before acting.
Use STORM-inspired research to improve grant research, partnership research, and complex questions. Do not invent sources or citations.
Create a dedicated fact-check capability for: organization names; public contact information; addresses; healthcare program details; provider services; grant deadlines; eligibility rules; nonprofit claims; public statistics; claims used in outreach or social content.
Require evidence before making consequential claims.

PART 11 — BROWSER AUTOMATION AND COMPUTER USE

Evaluate: https://github.com/microsoft/playwright-mcp
Use browser automation where it provides a concrete advantage.
Potential tasks: test the Kind Koalas dashboard; verify public webpages; research grant requirements; collect publicly available information; check whether links work; run browser-based quality tests; assist with repetitive, authorized workflows.
Implement explicit permissions and clear failure handling. Do not bypass access controls, CAPTCHAs, authentication boundaries, or service restrictions. Do not assume that a browser tool can reliably operate unattended without testing it. Browser automation is an additional tool, not the foundation of the operating system.

PART 12 — EMAIL AND OUTREACH AUTOMATION

Preserve the existing email templates and communication workflows.
Historical template subjects: community outreach: "Healthcare Access Initiative"; provider outreach: "Healthcare Professional Network".
The existing templates explain the Kind Koalas mission and request appropriate community referrals or provider participation. Do not rewrite them simply for stylistic reasons. If improvements are proposed, compare the original and revised templates, preserve factual accuracy, and test the changes.

12.1 Sending policy

Implement or verify: Safe Mode; configurable daily sending limit; approved recipient rules; approved template classes; duplicate suppression; bounce suppression; reply detection; sent-status synchronization; follow-up scheduling; accurate signatures; opt-out handling where applicable; audit logging; escalation for unusual requests.
Routine, low-risk outreach may be sent automatically when it meets established policy. Do not require manual approval for every ordinary email. Escalate unusual, sensitive, legally significant, or otherwise high-risk messages.

12.2 Outreach intelligence

Track: contact source; organization type; contact validity; relationship stage; first contact; last contact; response status; bounce status; next action; follow-up date; partnership potential; relevant notes.
Build response analytics and carefully controlled subject-line experiments only where appropriate. Avoid spam and repeated contact without a reasonable purpose.

PART 13 — HEALTHCARE ACCESS AND PARTNERSHIPS

The Healthcare Access Agent should: find suitable healthcare providers; verify publicly available information; draft provider outreach; track provider responses; maintain the partnership pipeline; coordinate follow-ups; record provider requirements and limitations; track potential MOUs and commitments; escalate decisions requiring human agreement.
Future capabilities may include: provider network mapping; referral process tracking; case coordination support; family connection tracking; provider availability and eligibility notes.
Never represent that a family is guaranteed care unless that is genuinely confirmed. Do not allow AI to make unsupported clinical, eligibility, or provider-commitment claims. The objective is to produce real-world healthcare access, not merely a high email count.

PART 14 — GRANTS, FUNDING, AND FINANCE

14.1 Grant research

Maintain a structured grant pipeline with: funder; opportunity; eligibility; deadline; funding amount; geographic requirements; application requirements; required attachments; budget requirements; narrative requirements; fit score; risk; status; next action; source URLs.
Historical funding opportunities included: Triangle Community Foundation; Blue Cross NC; a CHIF opportunity with a previously recorded $5,000 amount and October 30 deadline. These deadlines and amounts must be re-verified. Do not treat historical dates as current.

14.2 Grant-document analysis

Build the ability to inspect grant PDFs and application documents and produce: eligibility summary; required documents; deadline; evaluation criteria; budget requirements; narrative questions; risks; missing information; fit assessment; recommended next steps.
Never invent impact figures, organizational facts, budgets, or program outcomes.

14.3 Future Finance Agent

Design a Finance Agent for later activation. Responsibilities: funding pipeline; budget tracking; grant reporting; expense categorization; financial reminders; financial document organization.
Do not grant spending authority by default. Financial actions require explicit policy and appropriate authorization.

PART 15 — OPERATIONS, VOLUNTEERS, AND COMMUNITY ENGAGEMENT

15.1 Operations Agent

Maintain: member onboarding; membership records; task lists; checklists; missing-field detection; weekly reporting; operational blockers; stale-task detection; process documentation.

15.2 Future Volunteer Agent

Responsibilities: recruit prospective volunteers; track applicants; prepare onboarding; maintain training checklists; match people to roles; schedule follow-ups; track participation; support retention and recognition.
AI may coordinate human work but must not impersonate a human volunteer or make unauthorized legal or employment representations.

15.3 Community engagement

Build relationship tracking for: schools; churches; nonprofits; food banks; community centers; healthcare organizations; local businesses; volunteers.
Track relationship history, next steps, and contact provenance. Treat the historical bounced contacts as repair tasks and verify new contact information before retrying.

PART 16 — SOCIAL MEDIA AND CREATIVE PRODUCTION

Build a content workflow: Research → Idea → Draft → Fact-check → Visual → Policy check → Ready to publish → Publish → Measure → Learn.
The Social Media Agent should eventually be able to: build a content calendar; create captions; draft educational posts; generate image prompts; generate appropriate visuals; prepare flyers; create presentation and pitch-deck outlines; maintain brand voice; verify factual claims; track engagement and lessons.
Evaluate the previously identified image-generation provider: https://pollinations.ai/ — verify its current API, availability, terms, and cost before integration. Do not assume unlimited free generation.
Preserve existing Kind Koala brand assets and avoid unsupported medical claims. Sensitive or consequential claims must follow the policy engine.
Future creative tools may include video generation or advanced design MCP integrations, but these are optional and must not introduce paid dependencies.

PART 17 — ORCHESTRATION AND AGENT COORDINATION

The Chief of Staff is the operational manager. It should: inspect priorities; review deadlines; allocate tasks; resolve duplicate work; manage dependencies; inspect agent health; process blockers; coordinate agent requests; monitor outcomes; escalate important decisions; prepare reports.

17.1 Task states

BACKLOG → READY → IN_PROGRESS → REVIEW → DONE. Additional: BLOCKED, WAITING, FAILED, CANCELLED.
Every task should have: ID; objective; owner; requester; priority; due date; dependencies; required inputs; expected output; status; risk class; retry count; creation timestamp; completion timestamp.

17.2 Agent-to-agent communication

Preserve the existing marker protocol: [BLOCKER: type | description]; [REQUEST: agent | need | why]; [COMPLETE: id | response].
Where possible, convert these into validated structured records. Track: request ID; sender; receiver; need; reason; priority; deadline; status; response; creation time; completion time.
Set retry limits, timeouts, and maximum delegation depth to prevent infinite agent loops.

17.3 Agent health and morale

Retain the existing morale-meter concept as a system-health metaphor, not a claim that software agents experience human emotions.
Measure: workload; backlog; failures; blocked tasks; successful completions; unanswered requests; stale tasks; dependency failures; average latency; last successful run; current skill version.
Use this data to improve workload distribution and reliability.

PART 18 — POLICY-BASED AUTONOMY

The system must be autonomous enough to be useful without being uncontrolled.
Implement explicit capabilities such as: READ; DRAFT; SEND; MODIFY; DELETE; PUBLISH; DELEGATE; SPEND; AUTHENTICATE; CHANGE_CONFIGURATION; CREATE_SKILL; DEPLOY_SKILL.
Assign permissions by tool, agent, action, and risk.
Examples: reading a public grant page — normally permitted; drafting routine outreach — normally permitted; sending approved outreach under configured limits — permitted when policy conditions are met; signing a contract — requires human decision-making; spending money — denied unless explicitly authorized; deleting important data — requires protective controls; changing production authentication — requires controlled approval; deploying a skill that changes email permissions — requires review.
Build an auditable policy engine instead of relying on a single global approval switch. Safe Mode must remain available as an immediate way to stop external sending.

PART 19 — DASHBOARD AND TERMINAL CONTROL

19.1 Dashboard

Preserve the current dashboard and improve it incrementally. The eventual dashboard should expose: COCO chat; system health; agent health; task board; pending approvals; blockers; agent requests; memory search; skill registry; model/provider health; recent decisions; outreach metrics; grant pipeline; activity log; failure reports.
Do not rebuild the dashboard until the current implementation has been inspected and tested.

19.2 Terminal bridge

Complete the existing terminal bridge. Historically implemented server-side actions include: get_stats; get_agents; get_tasks; get_contacts; run_agent; read_sheet; append_row; update_cell; log_activity.
Create a safe local CLI where practical. Desired command concepts: coco status; coco agents; coco tasks; coco blockers; coco run healthcare; coco run outreach; coco memory search; coco skill list; coco skill test; coco skill propose; coco approvals; coco doctor.
These are desired interfaces, not proof that such commands already exist. Implement and test them. Never expose credentials in command output.

PART 20 — OBSERVABILITY, TESTING, AND RECOVERY

20.1 Unified logging

For each important event, record: timestamp; actor; action; target; result; risk level; tool; model; task ID; request ID; error category; artifact reference; before/after summary when appropriate.

20.2 Testing

Build tests for: model routing and fallback; email generation; email sending policy; daily limits; Safe Mode; bounce suppression; duplicate detection; reply detection; scheduler idempotency; task transitions; agent requests; dashboard endpoints; API authentication; skill loading; skill evaluation; memory persistence; browser automation; backup and restore; permission enforcement; recovery from provider failure.
Create a single documented diagnostic workflow. Test new features in staging or test mode before production use.

20.3 Backups

Back up: Apps Script source; configuration schemas; agent definitions; skills; memory; dashboard source; templates; documentation; important spreadsheet exports; deployment metadata.
Never back up live secrets into an ordinary repository. Document restore steps so the founder can follow them without needing to understand every implementation detail.

PART 21 — REPOSITORY RESEARCH AND TOOL ADOPTION

Investigate the listed repositories and references (see docs/resource-ledger.md for the full list extracted from this spec's Parts 21.1 and 21.2). These are research candidates, not an instruction to install everything.
For each, inspect the README, source code where appropriate, license, activity, dependencies, architecture, security, maintenance, hardware requirements, costs, and overlap with the existing system.
Assign one of: ADOPT; BORROW IDEAS; OPTIONAL LATER; REJECT; BLOCKED. Record the rationale and evidence.
Verify repository ownership, exact URL, activity, and current implementation before relying on any of these. Also investigate current Obsidian MCP implementations, official Claude Code skills, current MCP standards, and currently available free model providers.
Do not install multiple competing orchestration systems without demonstrating why the existing architecture cannot do the job.

PART 22 — VIDEO AND RESEARCH IDEAS

Use the transcripts supplied in the project files where available. Extract engineering patterns rather than copying demonstrations blindly. Evaluate ideas according to reliability, mission value, cost, and implementation difficulty. A video demonstration is not proof that the method is safe or production-ready.
22.1 names 20 untranscribed YouTube URLs — see docs/resource-ledger.md. Do not infer their contents from titles; mark unverified and continue.

PART 23 — OTHER EXISTING RESOURCES

Organization/fundraising links, API/developer resource links, research articles, and three previous private Claude Code session URLs — see docs/resource-ledger.md for the full list and status. The exact PayPal resource and the exact Paperclip video URL were not retained in the available record; do not invent them.

PART 24 — ADVANCED IDEAS TO EVALUATE LATER

Only implement after the core system is reliable: TARS-like COCO (persistent identity, voice, optional face/avatar, memory, computer-use, optional camera/vision); local models (investigate Colibri — measure hardware, RAM/GPU, inference speed, electricity/maintenance, model quality, setup complexity, uptime requirements; do not assume local inference is automatically free or practical); Nami multi-model workspace (adopt only if it improves quality/debugging/routing enough to justify complexity); additional future ideas (newsletter drafting, reply analytics, A/B subject testing, grant PDF analysis, automatic slide/flyer generation, voice interfaces, advanced avatars, compliant free phone calling only if verified, always-on execution if sustainable at $0, Tailscale or equivalent if needed, additional specialist agents, multi-chapter replication, open-source distribution, setup wizard, reusable documentation/onboarding).

PART 25 — IMPLEMENTATION PHASES

Implement sequentially. Do not begin every feature simultaneously.

Phase 0 — Discover, back up, and baseline. Exit criterion: the existing system is understood, backed up, and recoverable.
Phase 1 — Claude Code foundation. Exit criterion: Claude Code can navigate, test, and document the project without uncontrolled production changes.
Phase 2 — Obsidian memory. Exit criterion: durable memory survives separate sessions and can be audited.
Phase 3 — COCO core. Exit criterion: COCO can answer real questions and complete permitted workflows using live data.
Phase 4 — Skills registry. Exit criterion: skills are reusable, documented, versioned, and testable.
Phase 5 — Self-extending skills. Exit criterion: the system can propose and test new capabilities without silently modifying production.
Phase 6 — SkillOpt integration. Exit criterion: skill optimization produces measurable, repeatable results.
Phase 7 — Orchestration. Exit criterion: agents coordinate reliably and can recover from common failures.
Phase 8 — Autonomy and policy. Exit criterion: routine work can run autonomously while high-risk actions are controlled.
Phase 9 — Research and browser automation. Exit criterion: research results are attributable and browser operations are bounded and testable.
Phase 10 — Creative workflow. Exit criterion: creative work is useful, accurate, consistent, and affordable.
Phase 11 — Future specialist agents (Finance, Volunteer, Grant Specialist, Fact Checker, Newsletter/Communications) — activate only when workload, quality, and measurable benefits justify separate agents.
Phase 12 — Advanced interfaces (dashboard chat, voice, avatar, computer-use, local models, multi-model workflows).
Phase 13 — Replication (separate reusable architecture from chapter-specific data, anonymize private information, setup wizard, deployment instructions, open-source chapter template, test clean-environment install).

PART 26 — FINAL TARGETS AND SUCCESS METRICS

These are goals, not guaranteed outcomes.

Within 30 days: dependable daily AI workflow; 100+ outreach emails where appropriate/permitted; 10+ provider agreements or meaningful commitments; 2+ suitable grant applications if eligible/feasible; recruit 2–3 human volunteers; reduce routine founder intervention substantially; identify and resolve the largest reliability bottlenecks.

Within 90 days: work toward connecting the first family with appropriate care; meaningful funding progress; secure a provider partnership/MOU where feasible; build a sustainable human volunteer pipeline; establish a reliable task/memory/reporting process; measure actual outcomes, not just AI activity.

Within one year: operate a substantially autonomous chapter; let the founder focus on strategy and high-value relationships; maintain reliable healthcare-access and partnership workflows; build an evidence-backed case study; publish a reusable chapter operating system if safe/practical; explore replication to additional chapters; maintain the $0/month core target wherever feasible.

Technical success criteria — the system is not complete until: COCO can communicate with the founder; COCO can inspect live organizational state; COCO can retrieve persistent memory; COCO can delegate work; the Chief of Staff coordinates agents; routine tasks execute within policy; high-risk actions escalate; important actions are logged; failures recover or escalate; skills can be loaded and evaluated; new skills can be proposed and tested; production skill changes are controlled and reversible; Obsidian memory persists across sessions; Google Workspace remains functional; the dashboard remains functional; the terminal bridge works; model fallbacks are tested; browser automation is bounded; backups and restoration are tested; the core system remains within budget; the founder can understand what happened without reading source code.

PART 27 — HOW YOU MUST WORK

For every phase, report: what you inspected; what you found; what already works; what is broken; what is missing; what you recommend; what you changed; which files changed; which commands and tests you ran; the actual test results; the risks that remain; the rollback procedure; the next step.

Never claim success without evidence. Never claim a repository was installed when only its documentation was inspected. Never claim a free service is free without current verification. Never claim a skill improved without baseline comparison. Never claim memory is persistent without testing across sessions. Never claim an agent is autonomous without testing its permissions, failure handling, and audit logging.
If you cannot perform a step because access or authorization is missing, document the blocker and give the founder the exact next action required.

Final operating principle: Build a reliable nonprofit operating system, not a collection of impressive AI demonstrations. Choose mission impact over novelty. Choose measurable quality over confident claims. Choose observability over cleverness. Choose controlled improvement over uncontrolled self-modification. Preserve functioning systems unless a replacement demonstrates a measurable advantage.

The ultimate goal is COCO: a persistent, conversational, memory-enabled, tool-using AI operating layer coordinating a specialized, continuously improving AI workplace for Kind Koalas Apex — operating reliably, responsibly, and as close to $0/month as possible, so the founder can focus on helping families access healthcare.
