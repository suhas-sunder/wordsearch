import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import AxeBuilder from "@axe-core/playwright";
import { generatePuzzle } from "../../lib/puzzle/generate";
import { puzzleBankLabels } from "../../lib/puzzle/word-bank";
import type { DirectionKey } from "../../lib/puzzle/types";

const base = process.env.BASE_URL ?? "http://127.0.0.1:3314";
const artifacts = join(tmpdir(), "ilws-clue-worksheets"); await mkdir(artifacts, { recursive: true });
const request = { title: "Clue worksheet acceptance", wordsText: "CAT | A small, purring pet | feline\nPLANET | A world orbiting a star\nOX | A working animal", seed: "clues-browser", rows: 10, cols: 10, autoSize: false, directions: ["E"] as DirectionKey[], wordBankMode: "clues" as const, wordBankOrder: "input" as const };
const puzzle = generatePuzzle(request), encoded = Buffer.from(JSON.stringify(request)).toString("base64url");
const browser = await chromium.launch({ headless: true });
try {
  for (const [width, paper, bank] of [[390, "letter", "below"], [1280, "a4", "below"], [1280, "letter", "beside"], [390, "a4", "beside"]] as const) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, acceptDownloads: true });
    await context.route("https://pagead2.googlesyndication.com/**", (route) => route.abort());
    const page = await context.newPage(), errors: string[] = []; page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${base}/word-search-generator?state=${encoded}`, { waitUntil: "networkidle" });
    await page.locator(".builder-preview .print-clue-bank").waitFor();
    if (width === 390 && paper === "letter") {
      const controls = page.locator(".builder-controls");
      assert.ok((await page.locator("#word-input-help").innerText()).includes("Commas and tabs remain inside the clue"));
      assert.equal(await controls.locator('input[type="file"]').getAttribute("accept"), ".txt,text/plain");
      assert.ok(await controls.getByRole("button", { name: "Upload clue text", exact: true }).isVisible());
      await controls.getByText("Advanced print and fill controls", { exact: true }).click();
      await controls.getByRole("combobox", { name: "Student bank", exact: true }).selectOption("words");
      await page.waitForFunction(() => !!document.querySelector(".builder-preview .print-word-bank") && !document.querySelector(".builder-preview .print-clue-bank"));
      assert.ok(await controls.getByRole("button", { name: "Upload TXT/CSV/TSV", exact: true }).isVisible());
      await controls.getByRole("combobox", { name: "Student bank", exact: true }).selectOption("clues");
      await page.locator(".builder-preview .print-clue-bank").waitFor();
      await controls.locator('input[type="file"]').setInputFiles({ name: "invalid-clues.txt", mimeType: "text/plain", buffer: Buffer.from("CAT |") });
      await page.getByRole("alert").filter({ hasText: "Clue mode needs" }).first().waitFor();
      assert.equal(await page.getByRole("link", { name: "Play", exact: true }).count(), 0);
      await controls.locator('input[type="file"]').setInputFiles({ name: "clues.txt", mimeType: "text/plain", buffer: Buffer.from(request.wordsText) });
      await page.locator(".builder-preview .print-clue-bank").waitFor();
    }
    assert.deepEqual(await page.locator(".builder-preview .print-clue-bank span").allTextContents(), puzzleBankLabels(puzzle));
    assert.deepEqual(await page.locator(".builder-preview .puzzle-token").allTextContents(), puzzle.grid.flat());
    await page.getByRole("button", { name: "Print this puzzle", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("combobox", { name: "Paper size", exact: true }).selectOption(paper);
    await dialog.getByRole("combobox", { name: "Word bank", exact: true }).selectOption(bank);
    await dialog.getByRole("checkbox", { name: "Answer key page", exact: true }).check();
    await dialog.getByRole("checkbox", { name: "QR code", exact: true }).uncheck();
    await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
    const portal = page.locator(".utility-print-portal");
    assert.deepEqual(await portal.locator(".print-sheet").nth(1).locator(".print-clue-bank span").allTextContents(), puzzleBankLabels(puzzle, true));
    await page.getByRole("button", { name: "Download PDF", exact: true }).first().click();
    const pdfEvent = page.waitForEvent("download");
    await page.getByRole("dialog").getByRole("button", { name: "Download PDF", exact: true }).click();
    const pdfDownload = await pdfEvent;
    await pdfDownload.saveAs(join(artifacts, `${paper}-${bank}-${width}.pdf`));
    const task = getDocument({ data: new Uint8Array(await readFile((await pdfDownload.path())!)), useSystemFonts: true });
    try {
      const document = await task.promise;
      assert.equal(document.numPages, 2);
      for (let index = 1; index <= 2; index++) {
        const text = (await (await document.getPage(index)).getTextContent()).items.flatMap((item) => "str" in item ? [item.str] : []);
        for (const label of puzzleBankLabels(puzzle, index === 2)) assert.ok(text.join(" ").includes(label));
        assert.deepEqual(text.filter((item) => /^[A-Z]$/.test(item)), puzzle.grid.flat());
      }
    } finally { await task.destroy(); }
    const htmlEvent = page.waitForEvent("download");
    await page.getByRole("button", { name: "HTML worksheet", exact: true }).click();
    const htmlDownload = await htmlEvent, path = join(artifacts, `${paper}-${bank}-${width}.html`);
    await htmlDownload.saveAs(path);
    const offline = await context.newPage(), network: string[] = [];
    offline.on("request", (req) => { if (/^https?:/.test(req.url())) network.push(req.url()); });
    await offline.goto(pathToFileURL(path).href, { waitUntil: "load" });
    assert.deepEqual(await offline.locator(".print-sheet").first().locator(".print-clue-bank span").allTextContents(), puzzleBankLabels(puzzle));
    assert.deepEqual(await offline.locator(".print-sheet").nth(1).locator(".print-clue-bank span").allTextContents(), puzzleBankLabels(puzzle, true));
    assert.deepEqual(await offline.locator(".print-sheet").first().locator(".puzzle-token").allTextContents(), puzzle.grid.flat());
    assert.deepEqual(network, []);
    assert.equal(await offline.locator("script,img,[href],[src]").count(), 0);
    const printedTask = getDocument({ data: new Uint8Array(await offline.pdf({ preferCSSPageSize: true, printBackground: true })), useSystemFonts: true });
    try { assert.equal((await printedTask.promise).numPages, 2); } finally { await printedTask.destroy(); }
    await offline.screenshot({ path: join(artifacts, `${paper}-${bank}-${width}.png`), fullPage: true });
    const violations = (await new AxeBuilder({ page: offline }).analyze()).violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""));
    assert.deepEqual(violations, []);
    await page.goto(`${base}/play/${encoded}`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Begin puzzle", exact: true }).click();
    const solverBank = page.locator(".solver-bank");
    assert.ok((await solverBank.textContent())?.includes("1. A small, purring pet | feline"));
    assert.ok(!(await solverBank.textContent())?.includes("CAT"));
    const placement = puzzle.placed.find((word) => word.label === "CAT")!;
    const first = placement.cells[0];
    await page.waitForFunction(() => document.activeElement?.hasAttribute("data-solver-cell"));
    await page.locator(`[data-solver-cell][data-row="${first.row}"][data-col="${first.col}"]`).focus();
    await page.keyboard.press("Enter");
    for (let i = 1; i < placement.cells.length; i++) await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");
    await solverBank.locator(".found").filter({ hasText: "1. A small, purring pet | feline - CAT" }).waitFor();
    assert.deepEqual(errors, []);
    await context.close();
  }
} finally { await browser.close(); }
console.log("PASS opt-in clues in preview/PDF/offline HTML and keyboard solver; exact grids, teacher mappings and2-page Letter/A4 below/beside outputs; no network or serious accessibility failures");
