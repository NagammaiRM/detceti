// Shared helper so every browser-automation script logs to the vault the
// same way. Writes to vault/00-Inbox/ — this repo's vault has no dedicated
// run-log section (00-Inbox/01-Architecture/02-Research/03-Operations/
// 04-Open-Questions only), and 00-Inbox is explicitly "raw, dated, unedited,
// lands here first before being organized" per vault/README.md, which is
// exactly what an automated run log is. Refile into 03-Operations if a run
// log turns out to matter long-term.
import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const VAULT_INBOX_DIR = path.join(__dirname, "..", "..", "..", "vault", "00-Inbox");
export const SCREENSHOTS_DIR = path.join(VAULT_INBOX_DIR, "screenshots");

function stamp(d = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}${pad(d.getMinutes())}`,
  };
}

/**
 * Writes a dated run-log note into vault/00-Inbox/.
 */
export function writeRunLog({ what, agent, outcome, body, id }) {
  mkdirSync(VAULT_INBOX_DIR, { recursive: true });
  const { date, time } = stamp();
  const slug = (id ?? what).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const filename = `${date}-${time}-run-${slug}.md`;
  const filePath = path.join(VAULT_INBOX_DIR, filename);

  const frontmatter = [
    "---",
    `title: Run — ${what}`,
    `date: ${date}`,
    `outcome: ${outcome}`,
    `agent: ${agent}`,
    "---",
    "",
  ].join("\n");

  writeFileSync(filePath, frontmatter + body, "utf8");
  return filePath;
}
