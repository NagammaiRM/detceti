// The ONLY path from a proposal to a live Apps Script project. Deployment is
// never a side effect of generation or approval — this is a separate,
// deliberate, manual command. See scripts/builder/README.md.
//
// Structural enforcement (not just policy):
//   1. Refuses any proposal id that isn't physically sitting in
//      scripts/builder/approved/ — generation writes to proposals/, and
//      nothing this script runs can move a folder into approved/ itself.
//      That move is the human approval signal; this script only checks for it.
//   2. Requires --confirm. Running without it only prints what WOULD happen.
//   3. Defaults to the test script project. Pushing to prod requires --prod
//      AND --confirm together, and prints an extra warning either way.
//
// Usage:
//   node scripts/builder/push.js <proposal-id>              # dry run — shows the plan
//   node scripts/builder/push.js <proposal-id> --confirm     # pushes to TEST project
//   node scripts/builder/push.js <proposal-id> --prod --confirm   # pushes to PROD
import { existsSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BUILDER_ROOT = __dirname;

const [, , id, ...flags] = process.argv;
if (!id) {
  console.error("Usage: node scripts/builder/push.js <proposal-id> [--confirm] [--prod]");
  process.exit(1);
}
const confirm = flags.includes("--confirm");
const prod = flags.includes("--prod");

const approvedDir = path.join(BUILDER_ROOT, "approved", id);
const proposedDir = path.join(BUILDER_ROOT, "proposals", id);
const rejectedDir = path.join(BUILDER_ROOT, "rejected", id);

if (!existsSync(approvedDir)) {
  console.error(`REFUSED: ${id} is not in scripts/builder/approved/.`);
  if (existsSync(proposedDir)) {
    console.error(`It's still in scripts/builder/proposals/ — awaiting human review.`);
  } else if (existsSync(rejectedDir)) {
    console.error(`It was rejected (scripts/builder/rejected/) — not eligible for push.`);
  } else {
    console.error(`No proposal with this id was found anywhere.`);
  }
  console.error(`See scripts/builder/README.md for the approval gate.`);
  process.exit(1);
}

const codePath = path.join(approvedDir, "code.gs");
const code = existsSync(codePath) ? readFileSync(codePath, "utf8") : "(no code.gs found)";

const targetVar = prod ? "APPS_SCRIPT_PROD_PROJECT_ID" : "APPS_SCRIPT_TEST_PROJECT_ID";
const targetId = process.env[targetVar];

console.log(`Proposal: ${id}`);
console.log(`Target:   ${prod ? "PRODUCTION" : "test"} script project (${targetVar})`);
console.log(`Code:     ${codePath} (${code.split("\n").length} lines)`);
if (prod) console.log(`\n!! PRODUCTION PUSH !! — this is the chapter's live automation.`);

if (!confirm) {
  console.log(`\nDry run only — nothing was pushed. Re-run with --confirm to push.`);
  process.exit(0);
}

if (!targetId) {
  console.error(
    `\nREFUSED: ${targetVar} is not set. Deployment needs an Apps Script target ` +
      `project id (and project credentials) in .env. Nothing was pushed.`
  );
  process.exit(1);
}

// NOT IMPLEMENTED: the actual Apps Script API call (projects.updateContent).
// Deliberately absent until there's a real target project and a decided auth
// path (clasp vs. a service account) to wire up. Everything above this line
// is the part that matters structurally: by the time execution would reach
// here, the approval gate has already been checked and confirmation given.
console.error(
  `\nNOT YET WIRED: the Apps Script API push itself isn't implemented. ` +
    `The approval gate above passed (this proposal IS in scripts/builder/approved/, ` +
    `and --confirm was given) — the missing piece is purely the deploy call.`
);
process.exit(1);
