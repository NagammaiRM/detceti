# Playbook — Instagram posting

> Merged 2026-10-09 from a parallel local session's vault. **Worth
> reconciling**: `apps-script/SOURCE_NOTES.md` already documents a live
> `socialAgent()` wired to Fly Brain for content hooks — unclear yet whether
> it posts directly, drafts for a human, or does something else entirely.
> This playbook's recommendation (below) may already be moot, or may be
> exactly what's needed if `socialAgent()` turns out not to publish anything
> itself. Check before building on this.

**Not built. Read the route question below before building anything.**

## Two routes, and they are not equivalent

### Browser automation (Playwright driving instagram.com)
Technically straightforward. But automating posting through the web UI is against
Instagram's terms of use, and the practical consequence lands on the chapter: action
blocks, shadow-limiting, or losing the account. For a nonprofit whose outreach depends
on that account, that is a bad risk to carry for a convenience.

### Instagram Graph API *(recommended)*
The supported path. Requirements:
- Convert the chapter account to a **Business or Creator** account
- Link it to a Facebook Page
- Create a Meta app, get `instagram_content_publish` permission
- Publishing is a two-step call: create a media container, then publish it

Costs nothing, won't get the account restricted, and — importantly for this
architecture — it's a plain HTTP API, which means **the cloud half can do it**
on a schedule without the laptop being on. Browser automation would have forced
it to be local.

## Recommendation

Use the Graph API and move Instagram posting to the cloud half. Keep browser
automation for things that genuinely have no API — grant portals, which is the
real need. Revisit only if the Graph API can't do something specific (Stories
with certain stickers, for example).

> [!todo] Decide the route, then record it
> If Graph API: this becomes a Social Media agent job — reconcile with
> whatever `socialAgent()` already does in the live Apps Script source
> before assuming this is still unbuilt.
