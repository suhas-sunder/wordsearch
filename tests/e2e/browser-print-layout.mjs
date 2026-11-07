import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { pathToFileURL } from "node:url";

const base = process.env.BASE_URL ?? "http://127.0.0.1:3452";
const output = process.env.BROWSER_PRINT_OUTPUT;
if (!output) throw new Error("Set BROWSER_PRINT_OUTPUT to an outside-repository evidence directory.");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const records = [];
try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 1000 }, acceptDownloads: true });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const [shape, rows, cols] of [["square", 8, 8], ["wide", 6, 40], ["tall", 40, 6]]) {
    const request = { title: `Browser print ${shape}`, wordsText: "CAT\nDOG", seed: `browser-print-${shape}`, rows, cols, autoSize: false, directions: ["E"], alphabetPack: "latin" };
    const state = Buffer.from(JSON.stringify(request)).toString("base64url");
    for (const paper of ["letter", "a4"]) for (const orientation of ["portrait", "landscape"]) for (const bank of ["below", "beside"]) {
      const name = `${shape}-${paper}-${orientation}-${bank}`;
      await page.goto(`${base}/print/${state}?answers=1&paper=${paper}&orientation=${orientation}&wordBank=${bank}&coordinates=1&qr=1`, { waitUntil: "networkidle" });
      await page.locator('[data-utility-state="ready"]').waitFor();
      await page.getByRole("button", { name: "Print", exact: true }).waitFor();
      await page.waitForFunction(() => document.querySelectorAll(".print-footer img").length === 2 && [...document.querySelectorAll(".print-footer img")].every((img) => img.complete && img.naturalWidth > 0));
      await page.waitForFunction(() => [...document.querySelectorAll(".print-fit-status")].every((node) => node.dataset.fitState === "ready"));
      assert.equal(await page.locator(".print-sheet").count(), 2);
      assert.equal(await page.locator("h1").count(), 1);
      assert.equal(await page.locator(".print-answer-sheet h2").count(), 1);
      assert.equal(await page.locator(".print-answer-sheet .print-word-bank").count(), 0);
      assert.equal(await page.locator(".print-answer-sheet svg line").count(), 2);
      assert.equal(await page.locator(".print-sheet:not(.print-answer-sheet) .grid-coordinate").count(), rows + cols);
      const studentTokens = await page.locator(".print-sheet:not(.print-answer-sheet) .puzzle-token").allTextContents();
      assert.equal(studentTokens.length, rows * cols);
      assert.deepEqual(await page.locator(".print-answer-sheet .puzzle-token").allTextContents(), studentTokens);
      assert.equal(await page.locator("[data-ad-placement]").count(), 0);
      const bytes = await page.pdf({ preferCSSPageSize: true, printBackground: true });
      await writeFile(resolve(output, `${name}.pdf`), bytes);
      const task = getDocument({ data: new Uint8Array(bytes), useSystemFonts: true });
      try {
        const pdf = await task.promise;
        assert.equal(pdf.numPages, 2, `${name}: exactly one student and one answer page`);
        const pages = [];
        for (let number = 1; number <= 2; number++) {
          const sheet = await pdf.getPage(number);
          const [x0, y0, width, height] = sheet.view;
          assert.equal(x0, 0); assert.equal(y0, 0);
          const portrait = paper === "letter" ? [612, 792] : [595.28, 841.89];
          const dimensions = orientation === "portrait" ? portrait : portrait.slice().reverse();
          assert.ok(Math.abs(width - dimensions[0]) < 1 && Math.abs(height - dimensions[1]) < 1, `${name}: selected paper and orientation`);
          const items = (await sheet.getTextContent()).items.filter((item) => "str" in item && item.str.trim());
          for (const item of items) {
            const x = item.transform[4], y = item.transform[5];
            assert.ok(x >= 20 && x + item.width <= width - 20 && y >= 20 && y + item.height <= height - 20, `${name} page${number}: bounded glyph ${item.str}`);
          }
          const text = items.map((item) => item.str).join(" ");
          assert.match(text, /Browser print/);
          assert.doesNotMatch(text, /QR code not ready|placeholder|Checking puzzle/);
          // Each SVG token is a separate text node; Chromium/PDF.js may group
          // them into space-separated row items. Coordinate numbers and bank
          // labels cannot be mistaken for one-letter grid tokens.
          const tokens = items.flatMap((item) => item.str.trim().split(/\s+/)).filter((word) => /^[A-Z]$/.test(word));
          assert.equal(tokens.length, rows * cols, `${name} page${number}: all grid glyphs retained`);
          assert.deepEqual(tokens, studentTokens, `${name} page${number}: deterministic row-major grid`);
          const coordinates = items.flatMap((item) => item.str.trim().split(/\s+/)).filter((word) => /^\d+$/.test(word));
          assert.equal(coordinates.length, rows + cols, `${name} page${number}: every coordinate retained`);
          pages.push({ width, height, glyphItems: items.length, gridTokens: tokens.length });
        }
      records.push({ name, pages });
      } finally { await task.destroy(); }
      await writeFile(resolve(output, "measurements.json"), JSON.stringify(records, null, 2));
    }
  }
  const normalRequest = { title: "Normal classroom browser print", wordsText: "CAT\nDOG\nBIRD\nFISH\nMOUSE\nHORSE\nCOW\nPIG\nSHEEP\nGOAT\nDUCK\nHEN", seed: "normal-print-fit", rows: 15, cols: 15, autoSize: false, directions: ["E", "S"] };
  const normalState = Buffer.from(JSON.stringify(normalRequest)).toString("base64url");
  for (const [kind, answerCount] of [["print", 1], ["pdf", 2], ["answer-key", 1]]) {
    await page.goto(`${base}/${kind}/${normalState}?answers=${kind === "print" ? 0 : 1}&qr=0`, { waitUntil: "networkidle" });
    await page.locator('[data-utility-state="ready"]').waitFor();
    await page.waitForFunction(() => [...document.querySelectorAll(".print-fit-status")].every((node) => node.dataset.fitState === "ready"));
    assert.equal(await page.locator(".print-sheet").count(), answerCount);
    const bytes = await page.pdf({ preferCSSPageSize: true, printBackground: true });
    await writeFile(resolve(output, `normal-${kind}.pdf`), bytes);
    const task = getDocument({ data: new Uint8Array(bytes), useSystemFonts: true });
    try { assert.equal((await task.promise).numPages, answerCount); } finally { await task.destroy(); }
    if (kind === "pdf") {
      const event = page.waitForEvent("download");
      await page.getByRole("button", { name: "Download this PDF", exact: true }).click();
      const download = await event;
      const { readFile } = await import("node:fs/promises");
      const downloaded = getDocument({ data: new Uint8Array(await readFile(await download.path())), useSystemFonts: true });
      try { assert.equal((await downloaded.promise).numPages, answerCount); } finally { await downloaded.destroy(); }
    }
  }
  // Exercise the browser's actual failure path without changing QR code source.
  const failure = await context.newPage();
  await failure.addInitScript(() => { HTMLCanvasElement.prototype.toDataURL = () => { throw new Error("Expected QR test failure"); }; });
  await failure.goto(`${base}/print/${normalState}?answers=1&qr=1`, { waitUntil: "networkidle" });
  await failure.getByRole("status").filter({ hasText: "could not be prepared" }).waitFor();
  assert.equal(await failure.getByRole("button", { name: "Print", exact: true }).isDisabled(), true);
  assert.equal(await failure.locator(".qr-placeholder").count(), 0);
  await failure.waitForFunction(() => [...document.querySelectorAll(".print-fit-status")].every((node) => node.dataset.fitState === "ready"));
  const beforeQr = getDocument({ data: new Uint8Array(await failure.pdf({ preferCSSPageSize: true })), useSystemFonts: true });
  try {
    const sheet = await (await beforeQr.promise).getPage(1);
    assert.match((await sheet.getTextContent()).items.filter((item) => "str" in item).map((item) => item.str).join(" "), /QR code not ready/);
  } finally { await beforeQr.destroy(); }
  await failure.getByRole("link", { name: "Print without a QR code", exact: true }).click();
  await failure.locator('[data-utility-state="ready"]').waitFor();
  await failure.waitForFunction(() => [...document.querySelectorAll(".print-fit-status")].every((node) => node.dataset.fitState === "ready"));
  assert.equal(await failure.getByRole("button", { name: "Print", exact: true }).isEnabled(), true);
  assert.equal(await failure.locator(".print-sheet").count(), 2);
  assert.equal(await failure.locator(".print-footer").count(), 0);
  await failure.close();

  // Offline output deliberately strips QR/links and stays entirely local.
  for (const [shape, rows, cols] of [["square", 15, 15], ["wide", 6, 40], ["tall", 40, 6]]) {
    for (const [paper, orientation] of [["letter", "portrait"], ["a4", "landscape"]]) {
      const request = { ...normalRequest, title: `Offline print ${shape}`, wordsText: "CAT\nDOG", rows, cols };
      const state = Buffer.from(JSON.stringify(request)).toString("base64url");
      await page.goto(`${base}/privacy`, { waitUntil: "networkidle" });
      await page.evaluate((options) => localStorage.setItem("ilws:puzzle-output-options", JSON.stringify(options)), { paperSize: paper, orientation, includeAnswerKey: true, coordinates: true, wordBankPlacement: shape === "wide" ? "beside" : "below" });
      await page.goto(`${base}/word-search-generator?state=${state}`, { waitUntil: "networkidle" });
      const event = page.waitForEvent("download");
      await page.getByRole("button", { name: "HTML worksheet", exact: true }).click();
      const download = await event;
      const htmlPath = resolve(output, `offline-${shape}-${paper}.html`);
      await download.saveAs(htmlPath);
      const offline = await context.newPage();
      const requests = [];
      offline.on("request", (request) => { if (/^https?:/.test(request.url())) requests.push(request.url()); });
      await offline.goto(pathToFileURL(htmlPath).href);
      assert.equal(await offline.locator(".print-sheet").count(), 2);
      assert.equal(await offline.locator(".print-footer, script, img, [href], [src]").count(), 0);
      const bytes = await offline.pdf({ preferCSSPageSize: true, printBackground: true });
      await writeFile(resolve(output, `offline-${shape}-${paper}.pdf`), bytes);
      const task = getDocument({ data: new Uint8Array(bytes), useSystemFonts: true });
      try {
        const pdf = await task.promise;
        assert.equal(pdf.numPages, 2, `offline ${shape}: student and answer fit`);
        for (let number = 1; number <= 2; number++) {
          const sheet = await pdf.getPage(number);
          const items = (await sheet.getTextContent()).items.filter((item) => "str" in item && item.str.trim());
          for (const item of items) {
            assert.ok(item.transform[4] >= 20 && item.transform[4] + item.width <= sheet.view[2] - 20 && item.transform[5] >= 20 && item.transform[5] + item.height <= sheet.view[3] - 20, `offline ${shape}: glyph bounds`);
          }
          const tokens = items.flatMap((item) => item.str.trim().split(/\s+/)).filter((word) => /^[A-Z]$/.test(word));
          assert.equal(tokens.length, rows * cols);
          assert.deepEqual(tokens, await offline.locator(".print-sheet").nth(number - 1).locator(".puzzle-token").allTextContents());
        }
      } finally { await task.destroy(); }
      assert.deepEqual(requests, []);
      await offline.close();
    }
  }
  assert.deepEqual(errors, []);
  await context.close();
} finally { await browser.close(); }
console.log(`PASS ${records.length} browser print PDFs: paper, pagination, grid/answer parity and glyph bounds.`);
