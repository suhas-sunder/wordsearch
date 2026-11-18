import assert from "node:assert/strict";
import { readFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium, type Page } from "playwright";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { generatePuzzle } from "../../lib/puzzle/generate";

const base = process.env.BASE_URL ?? "http://127.0.0.1:3315";
const artifacts = join(tmpdir(), "ilws-printable-case"); await mkdir(artifacts, { recursive: true });
const request = { title: "Printable lowercase acceptance", wordsText: "CAT\nDOG\nBIRD", seed: "printable-case", rows: 10, cols: 10, autoSize: false, directions: ["E" as const], alphabetPack: "latin" as const };
const expected = generatePuzzle(request), lower = expected.grid.flat().map((token) => token.toLowerCase());
async function download(page: Page, name: string) {
  const event = page.waitForEvent("download"); await page.getByRole("button", { name, exact: true }).click();
  return await event;
}
const browser = await chromium.launch({ headless: true });
try {
  for (const [width, paper] of [[390, "letter"], [1280, "a4"]] as const) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, acceptDownloads: true });
    await context.route("https://pagead2.googlesyndication.com/**", (route) => route.abort());
    const page = await context.newPage(), errors: string[] = []; page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${base}/word-search-generator?state=${Buffer.from(JSON.stringify(request)).toString("base64url")}`, { waitUntil: "networkidle" });
    const grid = page.locator(".builder-preview .puzzle-svg"); await grid.locator(".puzzle-token").last().waitFor();
    const play = page.getByRole("link", { name: "Play", exact: true }), share = await play.getAttribute("href");
    const upperPng = await readFile((await (await download(page, "PNG grid")).path())!);
    await page.getByRole("button", { name: "Print this puzzle", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("combobox", { name: "Printed letter case", exact: true }).selectOption("lowercase");
    await dialog.getByRole("combobox", { name: "Paper size", exact: true }).selectOption(paper);
    await dialog.getByRole("checkbox", { name: "Answer key page", exact: true }).check();
    await dialog.getByRole("checkbox", { name: "QR code", exact: true }).uncheck();
    await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
    assert.deepEqual(await grid.locator(".puzzle-token").allTextContents(), lower);
    assert.deepEqual(await page.locator(".builder-preview .print-word-bank span").allTextContents(), ["bird", "cat", "dog"]);
    assert.equal(await play.getAttribute("href"), share);
    const text = await readFile((await (await download(page, "Grid text")).path())!, "utf8");
    assert.equal(text, expected.grid.map((row) => row.join("\t").toLowerCase()).join("\n") + "\n");
    const svg = await readFile((await (await download(page, "SVG grid")).path())!, "utf8");
    const standalone = await context.newPage();
    await standalone.goto(`data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`);
    assert.deepEqual(await standalone.locator(".puzzle-token").allTextContents(), lower); await standalone.close();
    const png = await download(page, "PNG grid"), pngBytes = await readFile((await png.path())!);
    assert.equal(pngBytes.readUInt32BE(16), upperPng.readUInt32BE(16));
    assert.equal(pngBytes.readUInt32BE(20), upperPng.readUInt32BE(20));
    assert.notDeepEqual(pngBytes, upperPng, "same-size image must actually change letter glyphs");
    await png.saveAs(join(artifacts, `lowercase-${width}.png`));
    await page.getByRole("button", { name: "Download PDF", exact: true }).first().click();
    const pdfEvent = page.waitForEvent("download");
    await page.getByRole("dialog").getByRole("button", { name: "Download PDF", exact: true }).click();
    const pdf = await pdfEvent;
    await pdf.saveAs(join(artifacts, `lowercase-${width}.pdf`));
    const task = getDocument({ data: new Uint8Array(await readFile((await pdf.path())!)), useSystemFonts: true });
    try {
      const document = await task.promise; assert.equal(document.numPages, 2);
      for (let index = 1; index <= 2; index++) {
        const tokens = (await (await document.getPage(index)).getTextContent()).items.flatMap((item) => "str" in item && /^[a-z]$/.test(item.str) ? [item.str] : []);
        assert.deepEqual(tokens, lower);
      }
    } finally { await task.destroy(); }
    const html = await download(page, "HTML worksheet"), path = join(artifacts, `lowercase-${width}.html`); await html.saveAs(path);
    const offline = await context.newPage(); await offline.goto(pathToFileURL(path).href, { waitUntil: "load" });
    assert.deepEqual(await offline.locator(".print-sheet").first().locator(".puzzle-token").allTextContents(), lower);
    assert.deepEqual(await offline.locator(".print-sheet").nth(1).locator(".puzzle-token").allTextContents(), lower);
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForFunction(() => document.querySelector(".builder-preview .puzzle-token")?.textContent?.match(/^[a-z]$/));
    assert.deepEqual(await grid.locator(".puzzle-token").allTextContents(), lower);
    await page.getByRole("button", { name: "Print this puzzle", exact: true }).click();
    await page.getByRole("dialog").getByRole("combobox", { name: "Printed letter case", exact: true }).selectOption("uppercase");
    await page.getByRole("dialog").getByRole("button", { name: "Cancel", exact: true }).click();
    assert.deepEqual(await grid.locator(".puzzle-token").allTextContents(), expected.grid.flat());
    assert.equal(await play.getAttribute("href"), share);
    const clueRequest = { ...request, wordsText: "CAT | A Purring Pet\nDOG | A Helpful Animal", wordBankMode: "clues", wordBankOrder: "input" };
    await page.goto(`${base}/word-search-generator?state=${Buffer.from(JSON.stringify(clueRequest)).toString("base64url")}`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Print this puzzle", exact: true }).click();
    await page.getByRole("dialog").getByRole("combobox", { name: "Printed letter case", exact: true }).selectOption("lowercase");
    await page.getByRole("dialog").getByRole("button", { name: "Cancel", exact: true }).click();
    assert.deepEqual(await page.locator(".builder-preview .print-clue-bank span").allTextContents(), ["1. A Purring Pet", "2. A Helpful Animal"]);
    assert.deepEqual(await page.locator(".utility-print-portal .print-sheet").nth(1).locator(".print-clue-bank span").allTextContents(), ["1. cat - A Purring Pet", "2. dog - A Helpful Animal"]);
    for (const kind of ["print", "answer-key"]) {
      await page.goto(`${base}/${kind}/${Buffer.from(JSON.stringify(request)).toString("base64url")}?case=lower&qr=0&answers=1`, { waitUntil: "networkidle" });
      await page.locator(".print-sheet .puzzle-token").first().waitFor();
      assert.deepEqual(await page.locator(".print-sheet").first().locator(".puzzle-token").allTextContents(), lower);
    }
    const hexadecimal = { ...request, alphabetPack: "hex" as const };
    await page.goto(`${base}/word-search-generator?state=${Buffer.from(JSON.stringify(hexadecimal)).toString("base64url")}`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Print this puzzle", exact: true }).click();
    assert.equal(await page.getByRole("dialog").getByRole("combobox", { name: "Printed letter case", exact: true }).isDisabled(), true);
    await page.getByRole("dialog").getByRole("button", { name: "Cancel", exact: true }).click();
    assert.deepEqual(await grid.locator(".puzzle-token").allTextContents(), generatePuzzle(hexadecimal).grid.flat());
    assert.deepEqual(errors, []); await context.close();
  }
} finally { await browser.close(); }
console.log("PASS printable lowercase parity in preview/PDF/HTML/SVG/PNG/TXT, persisted display preference and explicit reset; seeded play state unchanged on mobile/desktop");
