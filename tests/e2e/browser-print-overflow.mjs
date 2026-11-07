import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const base = process.env.BASE_URL ?? "http://127.0.0.1:3452";
const output = process.env.BROWSER_PRINT_OUTPUT;
if (!output) throw new Error("Set BROWSER_PRINT_OUTPUT outside the repository.");
await mkdir(output, { recursive: true });
const words = Array.from({ length: 200 }, (_, i) => `WORD ${String.fromCharCode(65 + Math.floor(i / 26))}${String.fromCharCode(65 + i % 26)}`).join("\n");
const crowded = { title: "Crowded word bank", wordsText: words, seed: "print-overflow-check", rows: 40, cols: 40, autoSize: false, directions: ["E"] };
const state = Buffer.from(JSON.stringify(crowded)).toString("base64url");
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 1000 }, acceptDownloads: true });
  const page = await context.newPage();
  await page.addInitScript(() => { window.__printCalls = 0; window.print = () => { window.__printCalls++; }; });
  await page.goto(`${base}/print/${state}?qr=0&answers=1&wordBank=beside`, { waitUntil: "networkidle" });
  const student = page.getByRole("article", { name: "Printable word search", exact: true });
  await student.locator('.print-fit-status[data-fit-state="error"]').waitFor();
  assert.match(await student.locator(".print-fit-status").textContent(), /does not fit.*bank below/s);
  assert.equal(await student.locator(".print-word-bank span").count(), 200, "failure never removes the screen words");
  assert.equal(await student.locator(".puzzle-token").count(), 1600, "failure never truncates the screen grid");
  await page.getByRole("button", { name: "Print", exact: true }).click();
  assert.equal(await page.evaluate(() => window.__printCalls), 0, "Print action refuses unsupported layout");
  const rejected = await page.pdf({ preferCSSPageSize: true, printBackground: true });
  await writeFile(resolve(output, "crowded-beside-diagnostic.pdf"), rejected);
  const failedTask = getDocument({ data: new Uint8Array(rejected), useSystemFonts: true });
  try {
    const pdf = await failedTask.promise;
    assert.equal(pdf.numPages, 1, "native print yields one clear diagnostic, no partial answer packet");
    const text = (await (await pdf.getPage(1)).getTextContent()).items.filter((item) => "str" in item).map((item) => item.str).join(" ");
    assert.match(text, /does not fit the selected paper/);
    assert.doesNotMatch(text, /WORD AA|Answer key\. Keep/);
  } finally { await failedTask.destroy(); }
  await student.getByRole("link", { name: "Use a bank below the grid", exact: true }).click();
  await student.locator('.print-fit-status[data-fit-state="error"]').waitFor();
  assert.match(await student.locator(".print-fit-status").textContent(), /labels do not fit inside their cells/);
  assert.equal(await student.locator(".print-word-bank span").count(), 200);
  await page.evaluate(() => localStorage.setItem("ilws:puzzle-output-options", JSON.stringify({ includeAnswerKey: true, qrCode: false, wordBankPlacement: "below" })));
  await student.getByRole("link", { name: "Edit puzzle and print settings", exact: true }).click();
  const input = page.getByRole("textbox", { name: "Words and clues", exact: true });
  assert.equal((await input.inputValue()).split("\n").length, 200, "edit recovery preserves every input word");
  await input.fill(words.split("\n").slice(0, 40).join("\n"));
  await page.waitForFunction(() => document.querySelectorAll(".utility-print-portal .print-word-bank span").length === 40 && [...document.querySelectorAll(".print-fit-status")].every((node) => node.dataset.fitState === "ready"));
  const recovered = await page.pdf({ preferCSSPageSize: true, printBackground: true });
  await writeFile(resolve(output, "crowded-below-recovered.pdf"), recovered);
  const task = getDocument({ data: new Uint8Array(recovered), useSystemFonts: true });
  try {
    const pdf = await task.promise;
    assert.equal(pdf.numPages, 2);
    const first = await pdf.getPage(1);
    const items = (await first.getTextContent()).items.filter((item) => "str" in item);
    const text = items.map((item) => item.str).join(" ");
    assert.equal((text.match(/WORD\s+[A-Z]{2}/g) ?? []).length, 40);
    assert.equal(items.flatMap((item) => item.str.trim().split(/\s+/)).filter((token) => /^[A-Z]$/.test(token)).length, 1600);
    for (const item of items.filter((item) => item.str.trim())) assert.ok(item.transform[4] >= 20 && item.transform[4] + item.width <= first.view[2] - 20 && item.transform[5] >= 20 && item.transform[5] + item.height <= first.view[3] - 20);
  } finally { await task.destroy(); }

  const long = { ...crowded, rows: 8, cols: 8, wordsText: "CAT\nDOG", title: "A long worksheet title ".repeat(12).slice(0, 256), subtitle: "Subtitle classroom context ".repeat(25).slice(0, 500), instructions: "Read each selected word carefully and find its complete path in the puzzle grid. ".repeat(28).slice(0, 2000) };
  await page.goto(`${base}/print/${Buffer.from(JSON.stringify(long)).toString("base64url")}?qr=0`, { waitUntil: "networkidle" });
  await page.locator('.print-fit-status[data-fit-state="error"]').waitFor();
  assert.match(await page.locator(".print-fit-status").textContent(), /shorter title or instructions/);
  assert.equal((await page.locator("h1").textContent()).length, 256, "long header input is never silently shortened");
  assert.equal(await page.locator(".puzzle-token").count(), 64);

  for (const pack of ["latin", "morse", "braille", "binary"]) {
    const request = { title: `Grid cell fit ${pack}`, wordsText: "CAT\nDOG", seed: "print-token-fit", rows: pack === "binary" ? 12 : 8, cols: pack === "binary" ? 6 : 8, autoSize: false, directions: ["E"], alphabetPack: pack };
    await page.goto(`${base}/print/${Buffer.from(JSON.stringify(request)).toString("base64url")}?qr=0`, { waitUntil: "networkidle" });
    const expected = pack === "binary" ? "error" : "ready";
    await page.locator(`.print-fit-status[data-fit-state="${expected}"]`).waitFor({ state: "attached" });
    assert.equal(await page.locator(".puzzle-token").count(), request.rows * request.cols);
    if (pack === "binary") assert.match(await page.locator(".print-fit-status").textContent(), /labels do not fit inside their cells/);
  }

  // Validate the independent serialized HTML stylesheet too; no malformed file
  // may be offered just because the live preview uses a different stylesheet.
  await page.goto(`${base}/privacy`, { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.setItem("ilws:puzzle-output-options", JSON.stringify({ paperSize: "letter", orientation: "portrait", includeAnswerKey: true, qrCode: false, wordBankPlacement: "beside" })));
  await page.goto(`${base}/word-search-generator?state=${state}`, { waitUntil: "networkidle" });
  let downloads = 0; page.on("download", () => { downloads++; });
  await page.getByRole("button", { name: "HTML worksheet", exact: true }).click();
  await page.getByRole("status").filter({ has: page.locator("p.control-help"), hasText: "This worksheet does not fit the selected paper" }).waitFor();
  assert.equal(downloads, 0, "unsupported offline layout produces no file");
  await page.getByRole("textbox", { name: "Words and clues", exact: true }).fill(words.split("\n").slice(0, 40).join("\n"));
  await page.getByRole("button", { name: "Print this puzzle", exact: true }).click();
  await page.getByRole("dialog").getByRole("combobox", { name: "Word bank", exact: true }).selectOption("below");
  await page.getByRole("dialog").getByRole("button", { name: "Cancel", exact: true }).click();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "HTML worksheet", exact: true }).click();
  assert.match((await download).suggestedFilename(), /worksheet\.html$/);
  assert.equal(await page.locator('iframe[title="Checking worksheet print fit"]').count(), 0, "measurement frame is cleaned up");
  await context.close();
} finally { await browser.close(); }
console.log("PASS actual crowded-bank rejection, native-print diagnostic, no dropped screen content, recovery, maximum header and offline file refusal/recovery.");
