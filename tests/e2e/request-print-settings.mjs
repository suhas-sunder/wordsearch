import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const base = process.env.BASE_URL ?? "http://127.0.0.1:3310";
const request = { title: "Print request synchronization", wordsText: "DOG\nCAT\nMOUSE\nHORSE\nFISH\nBIRD", seed: "print-flag-wiring", rows: 12, cols: 12, autoSize: false, directions: ["E", "S"], largePrint: false, showCoordinates: false, nameDateLine: true };
const output = { paperSize: "a4", orientation: "landscape", printScale: "standard", includeAnswerKey: true, nameDateLine: true, instructions: true, wordBankPlacement: "beside", qrCode: false, coordinates: false, inkSaving: true };
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [390, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, acceptDownloads: true });
    await context.route("https://pagead2.googlesyndication.com/**", (route) => route.abort());
    const page = await context.newPage(); const errors = []; page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${base}/privacy`, { waitUntil: "networkidle" });
    await page.evaluate((value) => localStorage.setItem("ilws:puzzle-output-options", JSON.stringify(value)), output);
    await page.goto(`${base}/word-search-generator?state=${Buffer.from(JSON.stringify(request)).toString("base64url")}`, { waitUntil: "networkidle" });
    const controls = page.locator(".builder-controls");
    await controls.getByRole("checkbox", { name: "Large print", exact: true }).waitFor();
    const tokens = await page.locator(".builder-preview .puzzle-token").allTextContents();
    await controls.getByRole("checkbox", { name: "Large print", exact: true }).check();
    await page.locator(".builder-preview .print-scale-large").waitFor();
    await controls.getByRole("checkbox", { name: "Coordinates", exact: true }).check();
    await page.waitForFunction(() => document.querySelectorAll(".builder-preview .grid-coordinate").length === 24);
    await controls.getByRole("checkbox", { name: "Name/date line", exact: true }).uncheck();
    await page.waitForFunction(() => !!document.querySelector(".builder-preview .print-sheet") && document.querySelectorAll(".builder-preview .name-date").length === 0);
    assert.deepEqual(await page.locator(".builder-preview .puzzle-token").allTextContents(), tokens);
    await controls.getByRole("textbox", { name: "Puzzle title", exact: true }).fill("Updated words keep output choices");
    await page.waitForFunction(() => document.querySelector(".builder-preview .print-header h2")?.textContent === "Updated words keep output choices");
    assert.equal(await page.locator(".builder-preview .print-scale-large").count(), 1);
    await page.getByRole("button", { name: "Print this puzzle", exact: true }).click();
    const dialog = page.getByRole("dialog");
    assert.equal(await dialog.getByRole("combobox", { name: "Paper size", exact: true }).inputValue(), "a4");
    assert.equal(await dialog.getByRole("combobox", { name: "Orientation", exact: true }).inputValue(), "landscape");
    assert.equal(await dialog.getByRole("combobox", { name: "Word bank", exact: true }).inputValue(), "beside");
    for (const [name, checked] of [["Large print", true], ["Answer key page", true], ["Name/date line", false], ["Coordinates", true], ["QR code", false], ["Ink-saving key", true]]) assert.equal(await dialog.getByRole("checkbox", { name, exact: true }).isChecked(), checked);
    await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
    await controls.getByRole("checkbox", { name: "Large print", exact: true }).uncheck();
    await page.waitForFunction(() => !!document.querySelector(".builder-preview .print-sheet") && !document.querySelector(".builder-preview .print-sheet")?.classList.contains("print-scale-large"));
    await page.getByRole("button", { name: "Download PDF", exact: true }).first().click();
    const pdfDialog = page.getByRole("dialog"); const event = page.waitForEvent("download");
    await pdfDialog.getByRole("button", { name: "Download PDF", exact: true }).click();
    const download = await event; const bytes = await readFile(await download.path());
    const task = getDocument({ data: new Uint8Array(bytes), useSystemFonts: true }); const pdf = await task.promise;
    assert.equal(pdf.numPages, 2); const pageOne = await pdf.getPage(1);
    assert.ok(Math.abs(pageOne.view[2] - 841.89) < 1); assert.ok(Math.abs(pageOne.view[3] - 595.28) < 1);
    const text = (await pageOne.getTextContent()).items.filter((item) => "str" in item).map((item) => item.str).join(" ");
    assert.ok(text.includes("Updated words keep output choices")); assert.doesNotMatch(text, /Name\s+Date/);
    await task.destroy();
    assert.deepEqual(errors, []);
    await context.close();
  }
} finally { await browser.close(); }
console.log("PASS request print flags update real preview/PDF choices; manual grid stable, title edits retain options, A4/landscape/bank/answers/QR/ink choices preserved on mobile/desktop");
