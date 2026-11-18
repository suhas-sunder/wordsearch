import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.BASE_URL ?? "http://127.0.0.1:3304";
const artifacts = join(tmpdir(), "ilws-offline-html"); await mkdir(artifacts, { recursive: true });
const title = '<img src="https://example.invalid/steal" onerror="window.pwned=1"> & "worksheet"';
const request = { title, wordsText: "CAT\nDOG\nBIRD\nFISH\nMOUSE\nHORSE", seed: "PRIVATE-HTML-SEED", autoSize: false, rows: 12, cols: 12, directions: ["E", "S"], allowOverlap: false };
const encoded = Buffer.from(JSON.stringify(request)).toString("base64url");
const browser = await chromium.launch({ headless: true });
try {
  for (const [paper, orientation, width, answers, large = false] of [["letter", "portrait", 390, true], ["a4", "landscape", 1280, true], ["letter", "portrait", 1280, false], ["letter", "portrait", 1280, true, true]]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, acceptDownloads: true });
    await context.addInitScript(() => {
      window.__worksheetBlobUrls = new Set();
      const create = URL.createObjectURL.bind(URL), revoke = URL.revokeObjectURL.bind(URL);
      URL.createObjectURL = (blob) => { const url = create(blob); window.__worksheetBlobUrls.add(url); return url; };
      URL.revokeObjectURL = (url) => { window.__worksheetBlobUrls.delete(url); revoke(url); };
    });
    await context.route("https://pagead2.googlesyndication.com/**", (route) => route.abort());
    const page = await context.newPage(); const errors = []; page.on("pageerror", (error) => errors.push(error.message));
    const actualTitle = large ? "Classroom animal word search" : title;
    const requestState = large ? Buffer.from(JSON.stringify({ ...request, title: actualTitle })).toString("base64url") : encoded;
    await page.goto(`${base}/word-search-generator?state=${requestState}`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Print this puzzle", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("combobox", { name: "Paper size", exact: true }).selectOption(paper);
    await dialog.getByRole("combobox", { name: "Orientation", exact: true }).selectOption(orientation);
    await dialog.getByLabel("Answer key page", { exact: true }).setChecked(answers);
    await dialog.getByLabel("Larger grid type", { exact: true }).setChecked(large);
    await dialog.getByLabel("Coordinates", { exact: true }).setChecked(large);
    await dialog.getByLabel("Ink-saving key", { exact: true }).setChecked(large);
    await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
    const original = await page.locator(".utility-print-portal .print-sheet").evaluateAll((articles) => articles.map((article) => ({
      tokens: [...article.querySelectorAll(".puzzle-token")].map((node) => node.textContent),
      lines: [...article.querySelectorAll("svg line")].map((line) => ["x1", "y1", "x2", "y2"].map((attr) => line.getAttribute(attr)))
    })));
    const downloadEvent = page.waitForEvent("download");
    await page.getByRole("button", { name: "HTML worksheet", exact: true }).click();
    const download = await downloadEvent;
    await page.waitForFunction(() => window.__worksheetBlobUrls.size === 0);
    assert.match(download.suggestedFilename(), /^[a-z0-9-]+-worksheet\.html$/);
    const path = join(artifacts, `${paper}-${orientation}-${width}-${answers}.html`); await download.saveAs(path);
    const html = await readFile(path, "utf8");
    assert.ok(html.length > 1000 && html.length < 1_000_000);
    assert.doesNotMatch(html, /PRIVATE-HTML-SEED|\/play\/|googlesyndication|<script\b|<link\b/i);
    assert.match(html, /default-src 'none'/);
    const offline = await context.newPage(); const network = [];
    offline.on("request", (req) => { if (/^https?:/.test(req.url())) network.push(req.url()); });
    await offline.goto(pathToFileURL(path).href, { waitUntil: "load" });
    assert.equal(await offline.locator("h1").textContent(), actualTitle);
    assert.equal(await offline.evaluate(() => window.pwned), undefined);
    assert.equal(await offline.locator("script,img,link,iframe,object,embed,[href],[src]").count(), 0);
    assert.equal(await offline.locator(".print-sheet").count(), answers ? 2 : 1);
    const actual = await offline.locator(".print-sheet").evaluateAll((articles) => articles.map((article) => ({
      tokens: [...article.querySelectorAll(".puzzle-token")].map((node) => node.textContent),
      lines: [...article.querySelectorAll("svg line")].map((line) => ["x1", "y1", "x2", "y2"].map((attr) => line.getAttribute(attr)))
    })));
    assert.deepEqual(actual, original);
    assert.deepEqual(await offline.locator(".print-word-bank span").allTextContents(), ["BIRD", "CAT", "DOG", "FISH", "HORSE", "MOUSE"]);
    if (large) {
      assert.equal(await offline.locator(".print-sheet").first().locator(".grid-coordinate").count(), 24);
      assert.ok(await offline.locator(".print-word-bank span").first().evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize)) >= 22);
    }
    assert.equal(await offline.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    const axe = await new AxeBuilder({ page: offline }).analyze();
    assert.deepEqual(axe.violations.filter((violation) => ["serious", "critical"].includes(violation.impact)), []);
    const pdfBytes = await offline.pdf({ preferCSSPageSize: true, printBackground: true });
    const pdfPath = join(artifacts, `${paper}-${orientation}-${width}-${answers}.pdf`); await offline.pdf({ path: pdfPath, preferCSSPageSize: true, printBackground: true });
    const standardFontDataUrl = `${fileURLToPath(new URL("../../node_modules/pdfjs-dist/standard_fonts/", import.meta.url))}/`;
    const loadingTask = getDocument({ data: new Uint8Array(pdfBytes), standardFontDataUrl }); const pdf = await loadingTask.promise;
    assert.equal(pdf.numPages, answers ? 2 : 1);
    const first = await pdf.getPage(1); const expected = paper === "letter" ? [612, 792] : [841.89, 595.28];
    assert.ok(Math.abs(first.view[2] - expected[0]) < 1); assert.ok(Math.abs(first.view[3] - expected[1]) < 1);
    const text = (await first.getTextContent()).items.filter((item) => "str" in item).map((item) => item.str).join(" ");
    for (const word of ["CAT", "DOG", "BIRD", "FISH", "MOUSE", "HORSE"]) assert.ok(text.includes(word), `Missing ${word}`);
    await loadingTask.destroy();
    await offline.screenshot({ path: join(artifacts, `${paper}-${orientation}-${width}-${answers}.png`), fullPage: true });
    assert.deepEqual(network, []); assert.deepEqual(errors, []);
    await context.close();
  }
} finally { await browser.close(); }
console.log(`PASS real offline HTML downloads, exact grids/answer paths, XSS/no-network, accessibility and Letter/A4 printed pages; artifacts ${artifacts}`);
