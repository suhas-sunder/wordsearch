import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { semanticDocument } from "./seo-semantic-dom.mjs";

const capture = JSON.parse(await readFile(process.env.SEO_CAPTURE_FILE, "utf8"));
const output = process.env.SEO_RENDERED_OUTPUT;
assert.ok(output && !resolve(output).startsWith(process.cwd()), "Keep rendered evidence outside Git");
await mkdir(output, { recursive: true });
const cases = [
  { name: "hard-mobile", path: "/collections/hard-printable-word-searches", width: 390 },
  { name: "hard-desktop", path: "/collections/hard-printable-word-searches", width: 1280 },
  { name: "generator-desktop", path: "/word-search-generator", width: 1280 },
  { name: "puzzle-desktop", path: capture.endpoints[0].pages.find((page) => page.path.startsWith("/word-searches/")).path, width: 1280 }
];
const result = { capturedAt: new Date().toISOString(), node: process.version, cases: [], limitations: ["Eight representative normal enabled-script rendered observations; not an interaction, performance or live-filled-ad acceptance suite.", "Full217-route semantic coverage is separately SSR/no-script, not434 fully hydrated browser visits."] };
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  for (const endpoint of capture.endpoints) for (const fixture of cases) {
    await page.setViewportSize({ width: fixture.width, height: 900 });
    const response = await page.goto(new URL(fixture.path, endpoint.origin).href, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.locator("main h1").waitFor();
    if (!fixture.name.startsWith("hard")) await page.locator("main textarea").first().waitFor({ timeout: 30000 });
    await page.waitForTimeout(500);
    const screenshot = `${endpoint.name}-${fixture.name}.png`;
    await page.screenshot({ path: resolve(output, screenshot), fullPage: true });
    const semantic = await page.evaluate(semanticDocument, { html: null, origin: endpoint.origin, canonicalOrigin: "https://www.ilovewordsearch.com", path: fixture.path });
    result.cases.push({ endpoint: endpoint.name, operatorVerifiedSourceSha: endpoint.sha, ...fixture, status: response.status(), screenshot, semantic });
    console.log(`${endpoint.name}/${fixture.name}: rendered ${response.status()}`);
    await writeFile(resolve(output, "rendered.json"), `${JSON.stringify(result, null, 2)}\n`);
  }
  await context.close();
} finally { await browser.close(); }
