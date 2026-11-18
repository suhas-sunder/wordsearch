import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { specialtyRoutes } from "../../content/specialty";

const before = process.env.COPY_BASELINE_URL;
const after = process.env.BASE_URL;
const output = process.env.COPY_OUTPUT;
assert.ok(before && after && output, "Set explicit COPY_BASELINE_URL, BASE_URL and external COPY_OUTPUT");
await mkdir(output, { recursive: true });
const results = [];
const browser = await chromium.launch({ headless: true });
try {
  for (const route of specialtyRoutes) {
    const views = route.implementation === "scaffold"
      ? [{ width: 390, height: 844, colorScheme: "light" as const }, { width: 1280, height: 900, colorScheme: "dark" as const }]
      : [{ width: 390, height: 844, colorScheme: "light" as const }];
    for (const view of views) {
      const observed: Array<{ label: string; grid: string[]; canonical: string | null; title: string; screenshot: string; htmlSha256: string }> = [];
      const targets: Array<["before" | "after", string]> = [["before", before], ["after", after]];
      for (const [label, base] of targets) {
        const context = await browser.newContext({ viewport: view, colorScheme: view.colorScheme });
        try {
          const page = await context.newPage();
          const errors: string[] = [];
          page.on("pageerror", (error) => errors.push(error.message));
          await page.route("https://pagead2.googlesyndication.com/**", (request) => request.fulfill({ contentType: "application/javascript", body: "" }));
          const response = await page.goto(`${base}/specialty/${route.slug}`, { waitUntil: "networkidle" });
          assert.equal(response?.status(), 200);
          await page.getByRole("heading", { name: "Build a word search", exact: true }).waitFor();
          const note = page.getByRole("note", { name: "Format readiness" });
          assert.equal(await note.count(), 1);
          const expected = label === "before" ? route.status : route.status.replace("This scaffold", "This preview");
          assert.equal(await note.locator("p").innerText(), expected);
          assert.equal(await page.locator("h1").innerText(), route.title);
          assert.match((await page.locator('meta[name="robots"]').getAttribute("content"))!, /noindex/);
          assert.equal(await page.locator("[data-ad-placement]").count(), 0);
          if (label === "after" && route.implementation === "scaffold") assert.equal(await note.locator("strong").innerText(), "Format not available yet");
          const noteBox = await note.boundingBox();
          const editorBox = await page.getByRole("heading", { name: "Build a word search", exact: true }).boundingBox();
          assert.ok(noteBox && editorBox && noteBox.y + noteBox.height <= editorBox.y, "full limitation precedes editor");
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
          const grid = await page.locator(".puzzle-token").allTextContents();
          assert.ok(grid.length > 0, "actual hydrated puzzle rendered");
          const screenshot = `${route.slug}-${view.width}-${view.colorScheme}-${label}.png`;
          await page.screenshot({ path: join(output, screenshot) });
          assert.deepEqual(errors, []);
          observed.push({ label, grid, canonical: await page.locator('link[rel="canonical"]').getAttribute("href"), title: await page.title(), screenshot, htmlSha256: createHash("sha256").update(await response!.body()).digest("hex") });
        } finally { await context.close(); }
      }
      assert.deepEqual(observed[1].grid, observed[0].grid, "copy does not change preview tokens");
      assert.equal(observed[1].canonical, observed[0].canonical);
      assert.equal(observed[1].title, observed[0].title);
      results.push({ slug: route.slug, viewport: view, observed });
    }
  }
  await writeFile(join(output, "result.json"), JSON.stringify({ before, after, scope: "Actual browser correctness and screenshots; advertising loader mocked, no performance or physical-device claim", cases: results.length, results }, null, 2));
  console.log(`PASS ${results.length} paired specialty views; ${results.length * 2} actual screenshots`);
} finally { await browser.close(); }
