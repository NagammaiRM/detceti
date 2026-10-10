// Verifies the Playwright install actually works: launches Chromium, loads a
// page, takes a screenshot, and exits. No site-specific logic — this is just
// "is the toolchain alive," run after any Playwright/Chromium update.
import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// vault/00-Inbox is this repo's catch-all for dated, unfiled output — there's
// no 06-Runs section here (that was the other local vault's structure).
const outDir = path.join(__dirname, "..", "..", "vault", "00-Inbox", "screenshots");
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("https://example.com", { waitUntil: "domcontentloaded" });
const title = await page.title();
const shotPath = path.join(outDir, `smoke-test-${Date.now()}.png`);
await page.screenshot({ path: shotPath });
await browser.close();

console.log(`OK — loaded "${title}", screenshot saved to ${shotPath}`);
