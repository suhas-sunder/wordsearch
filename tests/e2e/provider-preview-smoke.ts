import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { chromium } from "playwright";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { allStagedCandidates } from "@/content/staged/catalog";

const base = process.env.NETLIFY_PREVIEW_URL;
const expectedCommit = process.env.EXPECTED_PREVIEW_COMMIT;
const destination = process.env.PREVIEW_AUDIT_OUTPUT;
if (!base || !/^https:\/\/(?:[a-f0-9]{24}|deploy-preview-\d+)--ilovewordsearch\.netlify\.app\/?$/.test(base)) throw new Error("Supply an exact ilovewordsearch deploy-preview/permalink, never production.");
if (!expectedCommit || !/^[a-f0-9]{40}$/.test(expectedCommit)) throw new Error("Supply the expected commit read from the provider's deploy record.");
if (!destination || resolve(destination).toLowerCase().startsWith(resolve(process.cwd()).toLowerCase())) throw new Error("PREVIEW_AUDIT_OUTPUT must be outside the repository.");
await mkdir(destination, { recursive: true });
const browser = await chromium.launch({ headless: true });
const report: { preview: string; expectedCommit: string; checks: string[]; artifacts: string[]; failures: string[] } = { preview: base, expectedCommit, checks: [], artifacts: [], failures: [] };
try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
  // Do not generate artificial advertising impressions during automated preview smoke.
  await context.route("https://pagead2.googlesyndication.com/**", (route) => route.fulfill({ contentType: "application/javascript", body: "" }));
  const page = await context.newPage();
  const errors: string[] = []; page.on("pageerror", (error) => errors.push(error.message));
  const home = await page.goto(base, { waitUntil: "networkidle" });
  assert.equal(home?.status(), 200);
  assert.match((await home!.allHeaders())["x-robots-tag"] ?? "", /noindex/);
  assert.equal(new URL((await page.locator('link[rel="canonical"]').getAttribute("href"))!).href, "https://www.ilovewordsearch.com/");
  const sitemap = await (await page.request.get(`${base}/sitemap.xml`)).text();
  assert.equal((sitemap.match(/<loc>/g) ?? []).length, 217);
  assert.ok(!sitemap.includes("netlify.app"));
  const index = await (await page.request.get(`${base}/search-index.json`)).text();
  for (const candidate of allStagedCandidates) {
    assert.ok(!sitemap.includes(candidate.proposedPath)); assert.ok(!index.includes(candidate.proposedPath));
    const response = await page.request.get(`${base}${candidate.proposedPath}`);
    assert.equal(response.status(), 404, candidate.id);
  }
  report.checks.push(`Preview noindex; production canonical;217 sitemap URLs;${allStagedCandidates.length} draft paths absent from sitemap/search/HTTP routes.`);
  const theme = page.getByRole("button", { name: /^Theme:/ });
  await theme.click(); await theme.click();
  assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
  const homeShot = join(destination, "provider-home-dark.png"); await page.screenshot({ path: homeShot }); report.artifacts.push(homeShot);
  await page.goto(`${base}/search?q=animals`, { waitUntil: "networkidle" });
  await page.locator(".search-results .search-result-list a").first().waitFor();
  await page.goto(`${base}/pack-builder`, { waitUntil: "networkidle" });
  assert.match((await page.locator('meta[name="robots"]').getAttribute("content"))!, /\bnoindex\b/);
  assert.equal(await page.locator(".ad-slot, ins.adsbygoogle").count(), 0);
  await page.getByLabel("Pack title").fill("Preview Check");
  await page.getByLabel("Words or phrases").fill("cat\ndog\nbird");
  await page.getByLabel("Base seed", { exact: true }).fill("provider-preview-check");
  await page.getByLabel("Download pages").selectOption("students");
  const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "Download PDF pack" }).click()]);
  const pdfPath = join(destination, "provider-student-pack.pdf"); await download.saveAs(pdfPath); report.artifacts.push(pdfPath);
  const task = getDocument({ data: new Uint8Array(await readFile(pdfPath)), useSystemFonts: true });
  const pdf = await task.promise;
  try {
    assert.equal(pdf.numPages, 5);
    const grids = [];
    for (let i = 1; i <= 5; i++) {
      const content = await (await pdf.getPage(i)).getTextContent();
      const text = content.items.filter((item) => "str" in item).map((item) => item.str);
      assert.ok(!text.some((value) => value.includes("Answer Key")));
      const grid = text.filter((value) => /^[A-Z]$/.test(value)).join(""); assert.equal(grid.length, 225); grids.push(grid);
    }
    assert.equal(new Set(grids).size, 5);
  } finally { await task.destroy(); }
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  const packShot = join(destination, "provider-pack-mobile.png"); await page.screenshot({ path: packShot, fullPage: true }); report.artifacts.push(packShot);
  assert.deepEqual(errors, []);
  report.checks.push("Actual hosted search/theme and five-page distinct student PDF download; no ads on pack utility; mobile overflow and runtime checks.");
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noJs.newPage();
  await staticPage.goto(`${base}/guides/how-to-print-a-word-search`);
  assert.equal(await staticPage.locator("h1").count(), 1);
  assert.ok((await staticPage.locator("main").innerText()).length > 500);
  report.checks.push("Editorial guide content remains useful without JavaScript.");
  await noJs.close();
} catch (error) {
  report.failures.push(error instanceof Error ? error.message : String(error)); process.exitCode = 1;
} finally {
  await browser.close();
  await writeFile(join(destination, "provider-preview-smoke.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}
