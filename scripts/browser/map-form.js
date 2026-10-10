// Step 1 of vault/03-Operations/PB-Grant-Portal-Fill.md: "Map the form first,
// fill nothing." Enumerates every field on a page (label, type, required?,
// max length), screenshots it, and writes both to vault/00-Inbox/. Never
// types into a field, never clicks a button, never submits anything.
//
// Usage: node scripts/browser/map-form.js <url> <short-name>
//   short-name is used for the run-log filename and screenshot, e.g.
//   "communityfdn" -> vault/00-Inbox/2026-10-09-1430-run-map-communityfdn.md
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { writeRunLog, SCREENSHOTS_DIR } from "./lib/run-log.js";

const [, , url, shortName] = process.argv;
if (!url || !shortName) {
  console.error("Usage: node scripts/browser/map-form.js <url> <short-name>");
  process.exit(1);
}

mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(url, { waitUntil: "load", timeout: 30000 });

// Enumerate fields in the DOM. Label resolution order: <label for>, an
// ancestor <label>, aria-label, aria-labelledby, placeholder — in that
// order, falling back to null so a missing label is visible, not guessed.
const fields = await page.evaluate(() => {
  function labelFor(el) {
    if (el.id) {
      const lbl = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
      if (lbl) return lbl.innerText.trim();
    }
    const ancestorLabel = el.closest("label");
    if (ancestorLabel) return ancestorLabel.innerText.trim();
    if (el.getAttribute("aria-label")) return el.getAttribute("aria-label").trim();
    const labelledBy = el.getAttribute("aria-labelledby");
    if (labelledBy) {
      const ref = document.getElementById(labelledBy);
      if (ref) return ref.innerText.trim();
    }
    if (el.placeholder) return el.placeholder.trim();
    return null;
  }

  const els = Array.from(document.querySelectorAll("input, select, textarea"));
  return els
    .filter((el) => el.type !== "hidden")
    .map((el) => {
      const base = {
        tag: el.tagName.toLowerCase(),
        type: el.type || null,
        name: el.name || null,
        id: el.id || null,
        label: labelFor(el),
        required: el.required || false,
        maxLength: el.maxLength > 0 ? el.maxLength : null,
        placeholder: el.placeholder || null,
      };
      if (el.tagName.toLowerCase() === "select") {
        base.options = Array.from(el.options).map((o) => o.text.trim());
      }
      return base;
    });
});

const screenshotPath = path.join(SCREENSHOTS_DIR, `map-${shortName}-${Date.now()}.png`);
await page.screenshot({ path: screenshotPath, fullPage: true });
await browser.close();

const jsonPath = path.join(SCREENSHOTS_DIR, "..", `map-${shortName}-${Date.now()}.json`);
writeFileSync(jsonPath, JSON.stringify({ url, fields }, null, 2), "utf8");

const requiredCount = fields.filter((f) => f.required).length;
const unlabeled = fields.filter((f) => !f.label);

const body = `
## What happened
Mapped form fields at ${url}. Filled nothing, clicked nothing, submitted nothing.

- Fields found: ${fields.length}
- Required: ${requiredCount}
- Unlabeled (need a human to identify by screenshot): ${unlabeled.length}

## Fields

| Label | Tag | Type | Name/ID | Required | Max length |
|---|---|---|---|---|---|
${fields
  .map(
    (f) =>
      `| ${f.label ?? "*(none found)*"} | ${f.tag} | ${f.type ?? "-"} | ${f.name ?? f.id ?? "-"} | ${f.required ? "yes" : "no"} | ${f.maxLength ?? "-"} |`
  )
  .join("\n")}

## Output / artifacts
- Screenshot: \`${screenshotPath}\`
- Field map (JSON): \`${jsonPath}\`

## Needs a human
${
  unlabeled.length
    ? `${unlabeled.length} field(s) have no resolvable label — check the screenshot to identify them before resolving against a standard-answers reference.`
    : "None — every field resolved to a label. Still needs a human to map each field to a standard-answers reference before any fill step runs."
}
`.trim();

const logPath = writeRunLog({
  what: `map form — ${shortName}`,
  agent: "Browser Agent",
  outcome: unlabeled.length ? "partial" : "success",
  id: `map-${shortName}`,
  body,
});

console.log(`Mapped ${fields.length} fields (${requiredCount} required, ${unlabeled.length} unlabeled).`);
console.log(`Run log: ${logPath}`);
console.log(`Screenshot: ${screenshotPath}`);
