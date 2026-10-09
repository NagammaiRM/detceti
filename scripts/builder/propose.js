// Creates a new builder proposal skeleton: a self-contained folder under
// scripts/builder/proposals/ holding both the code AND its review note.
// Writes ONLY under proposals/ — never to approved/. See scripts/builder/README.md
// for the approval-gate rationale (mirrors this repo's own skill-promotion
// founder-approval gate in CLAUDE.md / skills/README.md, applied to generated
// Apps Script code specifically).
//
// This script scaffolds the proposal structure. It does not generate code —
// there's no AI backend wired up yet. Fill code.gs by hand or wire up a model
// call later; either way the review gate below is unaffected.
//
// Usage: node scripts/builder/propose.js "<short title>" "<problem, one paragraph>"
import { mkdirSync, writeFileSync, readdirSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BUILDER_ROOT = __dirname;
const PROPOSALS_DIR = path.join(BUILDER_ROOT, "proposals");

const [, , title, problem] = process.argv;
if (!title) {
  console.error('Usage: node scripts/builder/propose.js "<short title>" "<problem, one paragraph>"');
  process.exit(1);
}

function nextProposalId() {
  mkdirSync(PROPOSALS_DIR, { recursive: true });
  const existing = readdirSync(PROPOSALS_DIR)
    .filter((n) => /^P-\d{4}$/.test(n))
    .map((n) => parseInt(n.slice(2), 10));
  const next = existing.length ? Math.max(...existing) + 1 : 1;
  return `P-${String(next).padStart(4, "0")}`;
}

const id = nextProposalId();
const dir = path.join(PROPOSALS_DIR, id);
if (existsSync(dir)) {
  console.error(`${dir} already exists — refusing to overwrite.`);
  process.exit(1);
}
mkdirSync(dir, { recursive: true });

writeFileSync(
  path.join(dir, "code.gs"),
  `// ${id} — ${title}\n// TODO: generated/drafted code goes here.\n// Nothing in this file runs anywhere until a human moves this\n// directory to scripts/builder/approved/ — see scripts/builder/README.md.\n`,
  "utf8"
);

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  path.join(dir, "README.md"),
  `# ${id} — ${title}

**status: proposed. Not deployed.** See \`scripts/builder/README.md\`.

- target Apps Script project: TODO — test project, per the approval gate (never prod first)
- created: ${today}

## Problem
${problem ?? "TODO — describe what isn't working or isn't automated today."}

## What this does
TODO — plain description, then the entry points in code.gs.

## Blast radius
- Writes to: TODO
- Sends to anyone? : TODO
- External calls: TODO
- Worst realistic outcome if it's wrong: TODO

## Failure handling
TODO — quota errors, missing data, partial completion.

## How to verify before approving
TODO — concrete checks the reviewer can run in a test script project.

## Reviewer notes
*(human fills in)*
`,
  "utf8"
);

console.log(`Created ${id}:`);
console.log(`  ${dir}\\code.gs`);
console.log(`  ${dir}\\README.md`);
console.log(`\nThis proposal goes nowhere until a human reads it, fills in the`);
console.log(`TODOs, and moves ${dir} to scripts/builder/approved/ themselves.`);
