import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { chromium } from "playwright";
const base = process.env.BASE_URL ?? "http://localhost:3000";
const request = { title: "Wide Title ".repeat(5).trim(), wordsText: "garden\nflower\nplant", seed: "fit-check", alphabetPack: "latin", difficulty: "easy", rows: 12, cols: 12, autoSize: false, directions: ["E", "S"], allowOverlap: true };
const state = Buffer.from(JSON.stringify(request)).toString("base64url");
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [390, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, acceptDownloads: true });
    await page.route("https://pagead2.googlesyndication.com/**", (route) => route.fulfill({ contentType: "application/javascript", body: "" }));
    await page.goto(`${base}/word-search-generator?state=${state}`, { waitUntil: "networkidle" });
    await page.locator(".builder-surface").waitFor();
    const grid = await page.locator(".builder-preview .print-sheet").first().locator(".puzzle-token").allTextContents();
    assert.equal(grid.length, 144);
    await page.getByRole("button", { name: "Download PDF", exact: true }).first().click();
    const dialog = page.getByRole("dialog", { name: "Download PDF", exact: true });
    await dialog.getByLabel("QR code", { exact: true }).uncheck();
    await dialog.getByRole("button", { name: "Download PDF", exact: true }).click();
    await dialog.getByRole("alert").waitFor();
    assert.match(await dialog.getByRole("alert").innerText(), /title is too long.*name\/date/i);
    assert.equal(await page.getByLabel("Puzzle title", { exact: true }).inputValue(), request.title);
    assert.deepEqual(await page.locator(".builder-preview .print-sheet").first().locator(".puzzle-token").allTextContents(), grid);
    await dialog.getByLabel("Name/date line", { exact: true }).uncheck();
    const [download] = await Promise.all([page.waitForEvent("download"), dialog.getByRole("button", { name: /^(Download PDF|Retry PDF)$/ }).click()]);
    const bytes = await readFile(await download.path());
    const task = getDocument({ data: new Uint8Array(bytes), useSystemFonts: true });
    const pdf = await task.promise;
    try {
      assert.equal(pdf.numPages, 1);
      const text = await (await pdf.getPage(1)).getTextContent();
      const tokens = text.items.filter((item) => "str" in item && /^[A-Z]$/.test(item.str)).map((item) => item.str);
      assert.deepEqual(tokens, grid);
      assert.ok(text.items.some((item) => "str" in item && item.str === request.title));
    } finally { await task.destroy(); }
    assert.equal(await page.getByLabel("Puzzle title", { exact: true }).inputValue(), request.title);
    await page.close();
  }
  console.log("PASS mobile/desktop actionable PDF title error, retained input/grid, retry via name/date option and exact downloaded grid.");
} finally { await browser.close(); }
