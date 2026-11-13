import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.env.BASE_URL ?? "http://127.0.0.1:3504";
const output = process.env.EXCELLENCE_COLLECTION_OUTPUT;
if (output) await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const rows = [];
try {
  for (const javaScriptEnabled of [true, false]) for (const width of [320, 390, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, javaScriptEnabled, colorScheme: width === 320 ? "dark" : "light" });
    await context.route("https://pagead2.googlesyndication.com/**", (route) => route.fulfill({ contentType: "application/javascript", body: "" }));
    const page = await context.newPage();
    for (const slug of ["hard-printable-word-searches", "word-searches-with-answer-keys"]) {
      const response = await page.goto(`${base}/collections/${slug}`);
      assert.equal(response.status(), 200);
      const cards = page.locator("[data-collection-id]");
      const count = await cards.count();
      const link = page.getByRole("link", { name: `Browse ${count} puzzles`, exact: true });
      const target = page.getByRole("heading", { name: "Included word searches", exact: true });
      const originalLinks = await cards.evaluateAll((elements) => elements.map((element) => element.getAttribute("href")));
      const jump = await link.getAttribute("href");
      assert.equal(jump, `#${await target.getAttribute("id")}`);
      if (output && javaScriptEnabled && slug === "hard-printable-word-searches") await page.screenshot({ path: `${output}/hard-before-jump-${width}.png` });
      await link.focus();
      await link.press("Enter");
      assert.equal(await target.evaluate((element) => element === document.activeElement), true, "native anchor transfers keyboard focus");
      const box = await target.boundingBox();
      assert.ok(box.y >= 55 && box.y < 180, "heading lands below the fixed header");
      await page.keyboard.press("Tab");
      assert.equal(await page.evaluate(() => document.activeElement?.matches("[data-collection-controls] input, [data-collection-id]")), true, "next Tab reaches filtering or the no-JS puzzle list");
      assert.deepEqual(await cards.evaluateAll((elements) => elements.map((element) => element.getAttribute("href"))), originalLinks);
      assert.equal(await page.getByRole("link", { name: "Create a custom puzzle", exact: true }).getAttribute("href"), "/word-search-generator");
      const geometry = await link.evaluate((element) => {
        const box = element.getBoundingClientRect();
        return { overflow: document.documentElement.scrollWidth > innerWidth, adOverlap: [...document.querySelectorAll("[data-ad-placement]")].some((ad) => { const bounds = ad.getBoundingClientRect(); return bounds.width > 0 && bounds.height > 0 && bounds.top < box.bottom && bounds.bottom > box.top && bounds.left < box.right && bounds.right > box.left; }) };
      });
      assert.deepEqual(geometry, { overflow: false, adOverlap: false });
      if (output && javaScriptEnabled && slug === "hard-printable-word-searches") await page.screenshot({ path: `${output}/hard-puzzle-list-${width}.png` });
      rows.push({ slug, width, javaScriptEnabled, count, jump, geometry });
    }
    await context.close();
  }
  if (output) await writeFile(`${output}/result.json`, `${JSON.stringify({ base, node: process.version, rows }, null, 2)}\n`);
  console.log(`Collection browse shortcuts: ${rows.length} keyboard/no-JS responsive cases passed.`);
} finally { await browser.close(); }
