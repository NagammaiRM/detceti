# Source Verification Notes — Code.gs

Received verbatim from the founder on 2026-10-09 (chat paste), labeled
"v5.0" in its own header comment. This is real code, not a historical
claim — but **not yet confirmed to be what's currently deployed** at either
dashboard URL tested in `docs/phase0-inventory.md` Section 3.

## Discrepancy found: `doGet` behavior doesn't match what was tested live

This source's `doGet(e)`:
```js
function doGet(e) {
  if (e?.parameter?.health === '1') return jsonResponse({ ok: true, service: 'Kind Koalas API' });
  return HtmlService.createHtmlOutputFromFile('Dashboard')...
}
```
A plain GET (no `health=1` param) should return the full Dashboard HTML
page. But this session's `curl` test of a plain GET on both deployment
URLs returned `{"error":"use POST"}` — a response this `doGet` function
has no code path to produce. **Either this source is a newer draft not yet
pushed to either tested deployment, or there's a third deployment/version
in play that this session hasn't found yet.** Needs the founder to confirm
in the Apps Script editor which version is actually live.

## Why this probably also explains the POST failure

`doPost(e)` here wraps everything in try/catch and always returns valid
JSON via `jsonResponse(...)` — including the unauthorized-secret case.
There's no code path that could produce the broken Google-side "unable to
open the file" HTML error this session got when POSTing to the live URL.
That error is consistent with the request never reaching this function at
all — i.e. a deployment-level problem (stale/broken deployment, wrong
execution/access settings), not something `doPost`'s own logic produced.
Combined with the `doGet` mismatch above, the simplest explanation is: the
code actually deployed right now differs from this file, and is probably
older/broken. **This needs the founder to open the Apps Script editor and
check which version is deployed as the live web app**, rather than this
session guessing further from the outside.

## Critical: hardcoded placeholder `API_SECRET`

```js
const API_SECRET = 'CHANGE_ME_TO_RANDOM_STRING_32CHARS';
```
This is obviously meant to be replaced via `generateApiSecret()` (defined
right below it) before deployment. **If this literal placeholder string is
still what's live, the dashboard/terminal-bridge API has a trivially
guessable secret** — anyone who's seen any tutorial or template this came
from could call every action in `doPost`, including `run_agent` (which can
trigger `sendDailyBriefing`, outreach batches, etc., though real sending
still gates through `sendOrDraft`'s `SEND_MODE`/`SAFE_MODE`/daily-limit
checks). Separate from whatever secret the founder put in their own
`~/.kk-bridge/config.json` — that's a per-client credential; this is
asking whether the *source itself*, independent of any client, still
carries the unrotated default. Founder needs to check the actual deployed
script's `API_SECRET` constant and regenerate it with `generateApiSecret()`
if it's still the placeholder.

## Things this source newly confirms (vs. spec claims)

- **The per-agent `Model` column in the `Agents` sheet tab is decorative —
  not read by any code path.** `runAgent()` never reads `config.model`; the
  actual model routing is entirely inside `callGemini()`: Groq first (3
  models), then GitHub Models (4 models), then a hardcoded Gemini fallback
  list (`gemini-3.8-flash`, `gemini-3.7-flash`, `gemini-2.5-flash` — notably
  **not** `gemini-2.0-flash`, the model that 404'd in the live
  `Activity_Log` on 10/4). If this `callGemini` is what's actually
  deployed, that specific historical error may already be moot — but see
  the deployment-mismatch issue above before assuming that.
- **`GEMINI_API_KEY` is read via `getApiKey()` → `getSetting()` → the
  `Settings` sheet tab** — confirms exactly the plaintext-in-sheet exposure
  already flagged as critical in `docs/risk-register.md` (R2). The code
  itself offers no alternative storage path (no `PropertiesService` read
  for this key) — meaning moving it to Script Properties, as recommended,
  **requires a code change to `getApiKey()`/`getSetting()`**, not just a
  settings change. Confirmed this is a real blocker to the "proper fix"
  step mentioned earlier, not a hypothetical one.
- **`API_SECRET` itself, unlike the Gemini key, is a hardcoded JS constant,
  not read from the sheet** — so it isn't exposed via sheet-viewer access,
  only via source-code access (Apps Script editor, or a repo like this
  one). Better hygiene than the Gemini key's placement, assuming the
  placeholder was actually rotated before deploy.
- **`Reflex_Bus` (the undocumented tab, R10) is not referenced anywhere in
  this source** — no function reads or writes it. Combined with the
  founder's confirmation that a previous agent built it: it's very likely
  dead weight from an earlier iteration, not something currently wired
  into the send path. Downgrading R10's severity accordingly, but not
  closing it — "not referenced in this file" isn't proof it's unused
  everywhere, since this is the only source file received so far.
- **`testEverything()` lists `Reflex_Bus` as one of the 12 "required
  tabs"** — so at some point it was intentionally added to the system's own
  self-check, even though nothing else reads it. Possibly a half-finished
  feature rather than pure dead code. Still needs the founder's fuller
  explanation.
- **Fly Brain integration is real, extensive, and wired into
  `socialAgent()` and `checkForReplies()`** (creative content hooks, and
  priority-flagging replies via `flyBrainAssessEmail`) — per founder
  instruction 2026-10-09, parked/not investigated until briefed.

## Missing pieces

`Dashboard.html`, `Sidebar.html`, `Approvals.html` are referenced but not
supplied — the dashboard's actual UI/behavior still isn't fully visible
from the server-side code alone.
