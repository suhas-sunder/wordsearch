import { chromium } from "playwright";
import { readFile } from "node:fs/promises";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const routes = [
  "/",
  "/word-search-generator",
  "/free-printable-word-searches",
  "/online-word-search",
  "/categories",
  "/word-search-pdf",
  "/word-search-worksheets",
  "/large-print-word-searches",
  "/word-searches-for-kids",
  "/word-searches-for-adults",
  "/word-searches-for-teachers",
  "/easy-word-searches",
  "/hard-word-searches",
  "/word-search-with-answer-key",
  "/word-searches-for-seniors",
  "/homeschool-word-searches",
  "/esl-word-searches",
  "/topics",
  "/copyright",
  "/guides",
  "/categories/animals-word-searches",
  "/categories/science-word-searches",
  "/categories/language-arts-word-searches",
  "/categories/history-word-searches",
  "/categories/travel-word-searches",
  "/categories/music-word-searches",
  "/categories/books-and-reading-word-searches",
  "/categories/art-word-searches",
  "/word-searches/animals/dog-word-search",
  "/word-searches/animals/ocean-animals-word-search",
  "/word-searches/science/biology-word-search",
  "/word-searches/geography/world-capitals-word-search",
  "/word-searches/language-arts/nouns-word-search",
  "/word-searches/math/fractions-word-search",
  "/word-searches/sports/soccer-word-search",
  "/word-searches/classroom-values/school-supplies-word-search",
  "/word-searches/holidays/spring-word-search",
  "/word-searches/holidays/halloween-word-search",
  "/word-searches/history/ancient-egypt-word-search",
  "/word-searches/travel/road-trip-word-search",
  "/word-searches/music/musical-instruments-word-search",
  "/word-searches/books-and-reading/reading-word-search",
  "/word-searches/art/painting-word-search",
  "/collections/easy-printable-word-searches",
  "/collections/medium-word-searches",
  "/collections/hard-printable-word-searches",
  "/collections/classroom-word-search-worksheets",
  "/collections/geography-word-search-worksheets",
  "/collections/travel-word-search-printables",
  "/guides/how-to-print-a-word-search",
  "/guides/large-print-word-searches",
  "/guides/esl-word-search-activities",
  "/specialty/morse-code-word-search-generator"
];
const hubRoutes = new Set([
  "/",
  "/free-printable-word-searches",
  "/online-word-search",
  "/categories",
  "/word-search-pdf",
  "/word-search-worksheets",
  "/large-print-word-searches",
  "/word-searches-for-kids",
  "/word-searches-for-adults",
  "/word-searches-for-teachers",
  "/easy-word-searches",
  "/hard-word-searches",
  "/word-search-with-answer-key",
  "/word-searches-for-seniors",
  "/homeschool-word-searches",
  "/esl-word-searches",
  "/topics",
  "/copyright",
  "/guides"
]);
const widths = [320, 360, 390, 430, 768, 1024, 1280, 1440, 1920];

function encodedPuzzle(request) {
  return Buffer.from(JSON.stringify(request), "utf8").toString("base64url");
}

const horizontalSolverFixture = {
  title: "Horizontal Solver Test",
  wordsText: "horizontal",
  seed: "solver-horizontal-fixed",
  difficulty: "easy",
  alphabetPack: "latin",
  autoSize: false,
  rows: 6,
  cols: 10,
  directions: ["E"],
  allowOverlap: true,
  fillerMode: "alphabet"
};

const diagonalSolverFixture = {
  title: "Diagonal Solver Test",
  wordsText: "diagonals",
  seed: "solver-diagonal-fixed",
  difficulty: "hard",
  alphabetPack: "latin",
  autoSize: false,
  rows: 9,
  cols: 9,
  directions: ["SE"],
  allowOverlap: true,
  fillerMode: "alphabet"
};

function diagonalSolverPath() {
  return Array.from({ length: 9 }, (_, index) => ({ row: index, col: index }));
}

async function findRenderedHorizontalWord(page, word) {
  return page.locator("[data-solver-cell]").evaluateAll((cells, expectedWord) => {
    const rows = new Map();
    for (const cell of cells) {
      const row = Number(cell.getAttribute("data-row"));
      const col = Number(cell.getAttribute("data-col"));
      if (!rows.has(row)) rows.set(row, []);
      rows.get(row)[col] = cell.textContent?.trim().toUpperCase() ?? "";
    }
    for (const [row, tokens] of rows) {
      if (tokens.join("") === expectedWord) {
        return tokens.map((_, col) => ({ row, col }));
      }
    }
    return [];
  }, word.toUpperCase());
}

function solverCell(page, coordinate) {
  return page.locator(`[data-solver-cell][data-row="${coordinate.row}"][data-col="${coordinate.col}"]`);
}

async function cellCenter(page, coordinate) {
  const box = await solverCell(page, coordinate).boundingBox();
  if (!box) throw new Error(`Missing solver cell ${coordinate.row},${coordinate.col}`);
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

async function dragPath(page, path) {
  const start = await cellCenter(page, path[0]);
  const end = await cellCenter(page, path[path.length - 1]);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(end.x, end.y, { steps: 8 });
  await page.mouse.up();
}

async function beginSolver(page) {
  await page.getByRole("button", { name: "Begin puzzle" }).click();
  await page.locator(".solver-start-overlay").waitFor({ state: "hidden" });
}

const browser = await chromium.launch();
const failures = [];

function watchPage(page, label) {
  page.on("pageerror", (error) => failures.push(`${label} pageerror ${error.message}`));
}

if (!process.env.SOLVER_ONLY) {
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 1000 } });
  page.on("pageerror", (error) => failures.push(`${width} ${page.url()} pageerror ${error.message}`));
  for (const route of routes) {
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    const status = response?.status();
    const metrics = await page.evaluate(() => ({
      h1Count: document.querySelectorAll("h1").length,
      hasBuilder: Boolean(document.querySelector(".builder-surface")),
      hasPreview: Boolean(document.querySelector(".preview-paper")),
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth
    }));
    if (status !== 200) failures.push(`${width} ${route} status ${status}`);
    if (metrics.h1Count !== 1) failures.push(`${width} ${route} expected one h1, found ${metrics.h1Count}`);
    if (hubRoutes.has(route) && metrics.hasBuilder) failures.push(`${width} ${route} unexpectedly renders builder`);
    if (route === "/word-search-generator" && (!metrics.hasBuilder || !metrics.hasPreview)) failures.push(`${width} generator missing builder or preview`);
    if (metrics.scrollWidth > metrics.innerWidth + 2) failures.push(`${width} ${route} horizontal overflow ${metrics.scrollWidth}/${metrics.innerWidth}`);
  }
  await page.close();
}

const stateIsolationPage = await browser.newPage({ viewport: { width: 1024, height: 900 } });
await stateIsolationPage.addInitScript(() => {
  localStorage.setItem("ilws:last-builder-state", JSON.stringify({
    title: "Saved Custom Draft",
    wordsText: "CUSTOM\nDRAFT\nWORDS",
    seed: "saved-custom-draft"
  }));
});
await stateIsolationPage.goto(`${baseUrl}/word-searches/history/ancient-egypt-word-search`, { waitUntil: "networkidle" });
if (await stateIsolationPage.getByLabel("Puzzle title").inputValue() !== "Ancient Egypt Word Search") failures.push("curated puzzle restored a saved custom title");
if (!(await stateIsolationPage.getByLabel("Words and clues").inputValue()).includes("PHARAOH")) failures.push("curated puzzle restored a saved custom word list");
const sharedGeneratorState = encodedPuzzle({
  title: "Shared Generator Puzzle",
  wordsText: "STATIC\nEXPORT\nBROWSER",
  seed: "shared-generator-fixed"
});
await stateIsolationPage.goto(`${baseUrl}/word-search-generator?state=${sharedGeneratorState}`, { waitUntil: "networkidle" });
if (await stateIsolationPage.getByLabel("Puzzle title").inputValue() !== "Shared Generator Puzzle") failures.push("shared generator URL did not override a saved custom title");
if (!(await stateIsolationPage.getByLabel("Words and clues").inputValue()).includes("STATIC")) failures.push("shared generator URL did not restore its word list");
await stateIsolationPage.close();

const interactionPage = await browser.newPage({ viewport: { width: 390, height: 900 } });
await interactionPage.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
await interactionPage.getByRole("combobox", { name: "Search puzzles and categories" }).fill("animals");
const suggestions = interactionPage.getByRole("option");
await suggestions.first().waitFor({ state: "visible", timeout: 5_000 }).catch(() => undefined);
if (await suggestions.count() === 0) failures.push("homepage autocomplete returned no known animal results");
await interactionPage.getByRole("combobox", { name: "Search puzzles and categories" }).press("ArrowDown");
await interactionPage.getByRole("combobox", { name: "Search puzzles and categories" }).press("Escape");
const mobileMenu = interactionPage.locator('summary[aria-label="Open navigation menu"]');
if (!(await mobileMenu.isVisible())) failures.push("mobile navigation control is not visible");
await mobileMenu.click();
if (!(await interactionPage.getByRole("navigation", { name: "Mobile primary navigation" }).isVisible())) failures.push("mobile navigation panel did not open");
await interactionPage.close();

const searchPage = await browser.newPage({ viewport: { width: 1024, height: 900 } });
await searchPage.goto(`${baseUrl}/search?q=animals`, { waitUntil: "networkidle" });
const searchData = await searchPage.evaluate(() => ({
  noindex: document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "",
  results: document.querySelectorAll(".search-result-list > a").length,
  canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? ""
}));
if (!searchData.noindex.includes("noindex")) failures.push("search results missing noindex");
if (!searchData.results) failures.push("search results returned no known animal records");
if (!searchData.canonical.endsWith("/search")) failures.push(`search canonical is ${searchData.canonical}`);
await searchPage.goto(`${baseUrl}/search?q=zzzz-no-real-puzzle-zzzz`, { waitUntil: "networkidle" });
if (!(await searchPage.getByText("Create a custom puzzle").isVisible())) failures.push("search empty state is missing generator link");
await searchPage.close();

const utilityPage = await browser.newPage({ viewport: { width: 1024, height: 1000 } });
await utilityPage.goto(`${baseUrl}/word-search-generator`, { waitUntil: "networkidle" });
const playLink = utilityPage.locator(".preview-toolbar a").filter({ hasText: /Play/i });
const playHref = await playLink.getAttribute("href");
if (!playHref) failures.push("builder Play action is missing its deterministic URL");
if (await utilityPage.locator(".preview-toolbar [target]").count()) failures.push("builder utility action unexpectedly opens a new tab");

await utilityPage.evaluate(() => {
  window.__printCalled = false;
  window.print = () => { window.__printCalled = true; };
});
await utilityPage.getByRole("button", { name: "Print this puzzle" }).click();
const printDialog = utilityPage.getByRole("dialog", { name: "Print puzzle" });
if (!(await printDialog.isVisible())) failures.push("Print button did not open the in-page Print dialog");
await printDialog.getByLabel("Paper size").selectOption("a4");
await printDialog.getByLabel("Orientation").selectOption("landscape");
await printDialog.getByText("Answer key page").click();
await printDialog.getByRole("button", { name: "Open print dialog" }).click();
await utilityPage.waitForFunction(() => window.__printCalled === true);
if (await printDialog.isVisible()) failures.push("Print dialog remained open while print was invoked");

await utilityPage.getByRole("button", { name: "Download PDF" }).first().click();
const pdfDialog = utilityPage.getByRole("dialog", { name: "Download PDF" });
const downloadPromise = utilityPage.waitForEvent("download");
await pdfDialog.getByRole("button", { name: "Download PDF" }).click();
const pdfDownload = await downloadPromise;
if (!pdfDownload.suggestedFilename().endsWith("-word-search.pdf")) failures.push(`PDF filename is unsafe or unclear: ${pdfDownload.suggestedFilename()}`);
const pdfPath = await pdfDownload.path();
if (!pdfPath || (await readFile(pdfPath)).subarray(0, 5).toString("ascii") !== "%PDF-") failures.push("browser-generated PDF download is not a real PDF");
if (await pdfDialog.isVisible()) failures.push("PDF dialog remained open after download began");

await utilityPage.evaluate(() => {
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (value) => { window.__copiedShareUrl = value; } } });
});
const builderShareButton = utilityPage.getByRole("button", { name: "Share" });
await builderShareButton.click();
const shareDialog = utilityPage.getByRole("dialog", { name: "Share this puzzle" });
await shareDialog.locator("img[alt*='QR code']").waitFor();
const shareUrl = await shareDialog.getByLabel("Share URL").inputValue();
await shareDialog.getByRole("button", { name: "Copy link" }).click();
const copiedShareUrl = await utilityPage.evaluate(() => window.__copiedShareUrl);
if (copiedShareUrl !== shareUrl) failures.push("QR/share dialog and copied share URL are not identical");
if (!shareUrl.includes("/play/")) failures.push(`Share URL is not the canonical play URL: ${shareUrl}`);
if (!(await shareDialog.locator("img").getAttribute("src"))?.startsWith("data:image/png")) failures.push("Share QR is not generated locally as a PNG data URL");
await utilityPage.keyboard.press("Escape");
if (await shareDialog.isVisible()) failures.push("Escape did not close Share dialog");
if (!(await builderShareButton.evaluate((element) => element === document.activeElement))) failures.push("Share dialog did not return focus to its trigger");

if (playHref) {
  const encoded = new URL(playHref, baseUrl).pathname.split("/").pop();
  for (const path of [`/print/${encoded}`, `/pdf/${encoded}`, `/answer-key/${encoded}`]) {
    const checkPage = await browser.newPage({ viewport: { width: 1024, height: 1000 } });
    await checkPage.goto(`${baseUrl}${path}?paper=A4&orientation=landscape`, { waitUntil: "networkidle" });
  const data = await checkPage.evaluate(() => ({
    grid: Boolean(document.querySelector(".puzzle-svg, .solver-grid")),
    qr: Boolean(document.querySelector(".print-footer img")),
    noindex: document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "",
    path: location.pathname,
    pageClass: document.querySelector(".print-sheet")?.className ?? ""
  }));
    if (!data.grid) failures.push(`legacy utility missing grid at ${data.path}`);
    if (!data.qr) failures.push(`legacy utility missing QR at ${data.path}`);
    if (!data.noindex.includes("noindex")) failures.push(`legacy utility missing noindex at ${data.path}`);
    if (!data.pageClass.includes("print-page-a4-landscape")) failures.push(`legacy utility ignored output options at ${data.path}`);
    await checkPage.close();
  }
  for (const path of [`/play/${encoded}`, `/embed/${encoded}`, `/custom/${encoded}`]) {
    const checkPage = await browser.newPage({ viewport: { width: 1024, height: 1000 } });
    await checkPage.goto(`${baseUrl}${path}`, { waitUntil: "networkidle" });
    if (!(await checkPage.locator('[data-utility-state="ready"]').isVisible())) failures.push(`static utility state did not load at ${path}`);
    if (!(await checkPage.locator(".puzzle-svg, .solver-grid").count())) failures.push(`static utility missing grid at ${path}`);
    await checkPage.close();
  }
}
for (const path of ["/play/invalid-state", "/print/invalid-state", "/pdf/invalid-state", "/answer-key/invalid-state"]) {
  const response = await utilityPage.goto(`${baseUrl}${path}`, { waitUntil: "networkidle" });
  if (response?.status() !== 200) failures.push(`static utility shell did not load at ${path}`);
  if (!(await utilityPage.locator('[data-utility-state="invalid"]').isVisible())) failures.push(`invalid utility state did not show its explicit error at ${path}`);
  if (await utilityPage.locator(".puzzle-svg, .solver-grid").count()) failures.push(`invalid utility state generated a fallback grid at ${path}`);
}
await utilityPage.goto(`${baseUrl}/word-search-generator`, { waitUntil: "networkidle" });
await utilityPage.emulateMedia({ media: "print" });
const visiblePrintAds = await utilityPage.locator(".ad-slot").evaluateAll((slots) => slots.filter((slot) => getComputedStyle(slot).display !== "none").length);
if (visiblePrintAds) failures.push(`${visiblePrintAds} advertisement placeholders remain visible in print media`);
const printMetrics = await utilityPage.evaluate(() => ({
  visibleSheets: Array.from(document.querySelectorAll(".print-sheet")).filter((sheet) => getComputedStyle(sheet).display !== "none" && sheet.getBoundingClientRect().height > 0).length,
  visibleControls: Array.from(document.querySelectorAll(".preview-toolbar, .builder-controls, .site-header, .ad-slot")).filter((element) => getComputedStyle(element).display !== "none").length,
  answerSheets: document.querySelectorAll(".utility-print-portal .print-answer-sheet").length
}));
if (printMetrics.visibleSheets !== 2 || printMetrics.answerSheets !== 1) failures.push(`print media expected puzzle plus selected answer key, found ${printMetrics.visibleSheets}/${printMetrics.answerSheets}`);
if (printMetrics.visibleControls) failures.push(`${printMetrics.visibleControls} controls/navigation items remain visible in print media`);
await utilityPage.close();
}

const solverPage = await browser.newPage({ viewport: { width: 1100, height: 900 } });
watchPage(solverPage, "desktop solver");
const horizontalPlayPath = `/play/${encodedPuzzle(horizontalSolverFixture)}`;
await solverPage.goto(`${baseUrl}${horizontalPlayPath}`, { waitUntil: "networkidle" });
const horizontalPath = await findRenderedHorizontalWord(solverPage, "horizontal");
if (horizontalPath.length !== 10) throw new Error(`Stable horizontal fixture path was not found: ${JSON.stringify(horizontalPath)}`);
const initialPrintableGrid = await solverPage.locator(".solver-print-preview .print-sheet .puzzle-svg").innerHTML();
const initialSolverGrid = (await solverPage.locator(".solver-grid").innerText()).toLocaleUpperCase();
if (!(await solverPage.getByRole("button", { name: "Begin puzzle" }).isVisible())) failures.push("solver start overlay is missing");
if (!(await solverPage.locator(".solver-grid [data-solver-cell]:disabled").count())) failures.push("solver cells are enabled before Begin");
const leakedCellLabel = await solverCell(solverPage, horizontalPath[0]).getAttribute("aria-label");
if (leakedCellLabel?.toLowerCase().includes("horizontal") || leakedCellLabel?.toLowerCase().includes("part of")) {
  failures.push(`solver cell label leaks answer data: ${leakedCellLabel}`);
}

const overlaySettingsButton = solverPage.locator(".solver-start-overlay").getByRole("button", { name: "Accessibility and controls" });
await overlaySettingsButton.click();
if (!(await solverPage.getByRole("dialog", { name: "Puzzle settings" }).isVisible())) failures.push("solver settings dialog did not open accessibly");
await solverPage.keyboard.press("Escape");
if (await solverPage.getByRole("dialog", { name: "Puzzle settings" }).isVisible()) failures.push("Escape did not close solver settings");
if (!(await overlaySettingsButton.evaluate((element) => element === document.activeElement))) failures.push("settings dialog did not return focus to its trigger");
await overlaySettingsButton.click();
await solverPage.getByLabel("Letter case").selectOption("lowercase");
await solverPage.getByRole("button", { name: "Done" }).click();
const lowerGrid = await solverPage.locator(".solver-grid").innerText();
if (lowerGrid !== lowerGrid.toLocaleLowerCase()) failures.push("lowercase preference did not change display case");

await beginSolver(solverPage);
const showAnswersButton = solverPage.locator(".solver-control-row").getByRole("button", { name: "Show Answers" });
await showAnswersButton.click();
const answerConfirmDialog = solverPage.getByRole("dialog", { name: "Show puzzle answers?" });
if (!(await answerConfirmDialog.isVisible())) failures.push("unfinished answer reveal did not open an accessible confirmation dialog");
await solverPage.keyboard.press("Escape");
if (await answerConfirmDialog.isVisible()) failures.push("Escape did not close answer confirmation");
if (!(await showAnswersButton.evaluate((element) => element === document.activeElement))) failures.push("answer confirmation did not return focus to its trigger");
if (await solverPage.locator(".solver-answer-line").count()) failures.push("canceling answer confirmation revealed paths");
await showAnswersButton.click();
await answerConfirmDialog.getByRole("button", { name: "Show answers" }).click();
if ((await solverPage.locator(".solver-answer-line").count()) !== 1) failures.push("answer reveal did not draw every exact answer path");
if ((await solverPage.locator(".solver-bank > span.revealed").count()) !== 1) failures.push("revealed answer chip is not semantically distinct");
if ((await solverPage.locator("[data-testid=solver-progress]").innerText()) !== "0 of 1 words found") failures.push("answer reveal changed found progress");
if (await solverPage.getByText("Puzzle complete", { exact: true }).count()) failures.push("answer reveal triggered completion");
await solverPage.locator(".solver-control-row").getByRole("button", { name: "Hide Answers" }).click();
if (await solverPage.locator(".solver-answer-line").count()) failures.push("hiding answers left revealed paths visible");
await solverCell(solverPage, horizontalPath[0]).click();
if ((await solverPage.locator(".solver-bank > span.found").count()) !== 0) failures.push("random click solved a word");

const invalidEnd = { row: horizontalPath[0].row === 5 ? 4 : horizontalPath[0].row + 1, col: horizontalPath[0].col };
await dragPath(solverPage, [horizontalPath[0], invalidEnd]);
if ((await solverPage.locator(".solver-bank > span.found").count()) !== 0) failures.push("invalid drag solved a word");
if (await solverPage.locator(".solver-active-line").count()) failures.push("invalid drag left an active selection");

const penStart = await cellCenter(solverPage, horizontalPath[0]);
await solverCell(solverPage, horizontalPath[0]).dispatchEvent("pointerdown", { pointerId: 72, pointerType: "pen", isPrimary: true, clientX: penStart.x, clientY: penStart.y, buttons: 1 });
if (!(await solverPage.locator(".solver-active-line").count())) failures.push("pen pointer did not begin an active selection");
await solverPage.locator(".solver-grid").dispatchEvent("pointercancel", { pointerId: 72, pointerType: "pen", isPrimary: true, clientX: penStart.x, clientY: penStart.y, buttons: 0 });
if (await solverPage.locator(".solver-active-line").count()) failures.push("pointer cancellation left a stuck selection");

const forwardStart = await cellCenter(solverPage, horizontalPath[0]);
const forwardEnd = await cellCenter(solverPage, horizontalPath[horizontalPath.length - 1]);
await solverPage.mouse.move(forwardStart.x, forwardStart.y);
await solverPage.mouse.down();
await solverPage.mouse.move(forwardEnd.x, forwardEnd.y, { steps: 8 });
if (!(await solverPage.locator(".solver-active-line").count())) failures.push("active selection capsule did not follow the drag");
if ((await solverPage.locator(".solver-grid button.active-path").count()) !== horizontalPath.length) failures.push("active drag did not highlight every crossed letter");
await solverPage.mouse.up();
if ((await solverPage.locator(".solver-bank > span.found").count()) !== 1) failures.push("correct forward drag did not solve the word");
if (!(await solverPage.getByText("Puzzle complete", { exact: true }).isVisible())) failures.push("completion state did not appear after the final genuine solve");
if ((await solverPage.locator(".solver-found-line").count()) !== 1) failures.push("found-word capsule did not persist");
if ((await solverPage.locator("[data-testid=solver-progress]").innerText()) !== "1 of 1 words found") failures.push("solver progress did not update");
if ((await solverPage.locator(".solver-print-preview .print-sheet .puzzle-svg").innerHTML()) !== initialPrintableGrid) failures.push("solver progress altered the printable preview");
await solverPage.locator(".solver-control-row").getByRole("button", { name: "Show Answers" }).click();
await solverPage.locator(".solver-control-row").getByRole("button", { name: "Hide Answers" }).click();
if ((await solverPage.locator(".solver-bank > span.found").count()) !== 1) failures.push("hiding answers discarded genuinely found progress");

solverPage.once("dialog", (dialog) => dialog.accept());
await solverPage.getByRole("button", { name: "Reset puzzle" }).click();
if (!(await solverPage.getByRole("button", { name: "Begin puzzle" }).isVisible())) failures.push("reset did not return to the start state");
if ((await solverPage.locator(".solver-bank > span.found").count()) !== 0) failures.push("reset did not clear found progress");
if ((await solverPage.locator(".solver-grid").innerText()).toLocaleUpperCase() !== initialSolverGrid) failures.push("reset changed the deterministic grid");
await beginSolver(solverPage);
await dragPath(solverPage, [...horizontalPath].reverse());
if ((await solverPage.locator(".solver-bank > span.found").count()) !== 1) failures.push("reverse drag did not solve the word");

await solverPage.setViewportSize({ width: 390, height: 850 });
const alignment = await solverPage.evaluate(() => {
  const grid = document.querySelector(".solver-grid")?.getBoundingClientRect();
  const overlay = document.querySelector(".solver-selection-overlay")?.getBoundingClientRect();
  return {
    aligned: Boolean(grid && overlay && Math.abs(grid.left - overlay.left) < 1 && Math.abs(grid.width - overlay.width) < 1 && Math.abs(grid.height - overlay.height) < 1),
    overflow: document.documentElement.scrollWidth - window.innerWidth
  };
});
if (!alignment.aligned) failures.push("selection overlay drifted after responsive resize");
if (alignment.overflow > 2) failures.push(`solver causes horizontal overflow by ${alignment.overflow}px`);
const solverTargets = await solverPage.locator(".online-solver [target]").count();
if (solverTargets) failures.push(`${solverTargets} solver controls open a new tab`);

const scrollBefore = await solverPage.evaluate(() => { window.scrollTo(0, 0); window.scrollBy(0, 180); return window.scrollY; });
await solverPage.evaluate(() => window.scrollBy(0, 140));
const scrollAfter = await solverPage.evaluate(() => window.scrollY);
if (scrollBefore <= 0 || scrollAfter <= scrollBefore) failures.push("page scrolling did not work before and after a solver gesture");
await solverPage.setViewportSize({ width: 850, height: 390 });
const landscapeShareButton = solverPage.locator(".solver-control-row").getByRole("button", { name: "Share" });
await landscapeShareButton.click();
const landscapeDialog = solverPage.getByRole("dialog", { name: "Share this puzzle" });
const landscapeDialogMetrics = await landscapeDialog.evaluate((element) => ({
  width: element.getBoundingClientRect().width,
  height: element.getBoundingClientRect().height,
  viewportWidth: window.innerWidth,
  viewportHeight: window.innerHeight,
  overflowY: getComputedStyle(element).overflowY
}));
if (landscapeDialogMetrics.width > landscapeDialogMetrics.viewportWidth || landscapeDialogMetrics.height > landscapeDialogMetrics.viewportHeight) failures.push("Share dialog clips in a short landscape viewport");
if (!['auto', 'scroll'].includes(landscapeDialogMetrics.overflowY)) failures.push("Short landscape dialog is not scrollable");
await solverPage.keyboard.press("Escape");
await solverPage.close();

const keyboardPage = await browser.newPage({ viewport: { width: 1000, height: 900 } });
watchPage(keyboardPage, "keyboard solver");
await keyboardPage.goto(`${baseUrl}${horizontalPlayPath}`, { waitUntil: "networkidle" });
await beginSolver(keyboardPage);
await keyboardPage.waitForTimeout(50);
await solverCell(keyboardPage, horizontalPath[0]).focus();
await keyboardPage.keyboard.press("Enter");
for (let index = 1; index < horizontalPath.length; index += 1) await keyboardPage.keyboard.press("ArrowRight");
await keyboardPage.keyboard.press("Enter");
if ((await keyboardPage.locator(".solver-bank > span.found").count()) !== 1) failures.push("keyboard path did not solve the word");
await keyboardPage.close();

const tapPage = await browser.newPage({ viewport: { width: 768, height: 900 } });
watchPage(tapPage, "tap solver");
await tapPage.goto(`${baseUrl}${horizontalPlayPath}`, { waitUntil: "networkidle" });
await tapPage.getByRole("button", { name: "Accessibility and controls" }).click();
await tapPage.getByRole("radio", { name: /Tap endpoints/ }).check();
await tapPage.getByRole("button", { name: "Done" }).click();
await beginSolver(tapPage);
await solverCell(tapPage, horizontalPath[0]).click();
if (!(await tapPage.locator(".solver-active-line").count())) failures.push("tap mode did not mark a pending start");
await tapPage.keyboard.press("Escape");
if (await tapPage.locator(".solver-active-line").count()) failures.push("Escape did not cancel tap endpoint selection");
await solverCell(tapPage, horizontalPath[0]).click();
await solverCell(tapPage, horizontalPath[horizontalPath.length - 1]).click();
if ((await tapPage.locator(".solver-bank > span.found").count()) !== 1) failures.push("tap-endpoint mode did not solve the word");
await tapPage.close();

const diagonalPage = await browser.newPage({ viewport: { width: 900, height: 900 } });
watchPage(diagonalPage, "diagonal solver");
await diagonalPage.goto(`${baseUrl}/play/${encodedPuzzle(diagonalSolverFixture)}`, { waitUntil: "networkidle" });
await beginSolver(diagonalPage);
await dragPath(diagonalPage, diagonalSolverPath());
if ((await diagonalPage.locator(".solver-bank > span.found").count()) !== 1) failures.push("diagonal drag did not solve the word");
await diagonalPage.close();

const touchContext = await browser.newContext({ viewport: { width: 390, height: 850 }, hasTouch: true, isMobile: true });
const touchPage = await touchContext.newPage();
watchPage(touchPage, "touch solver");
await touchPage.goto(`${baseUrl}${horizontalPlayPath}`, { waitUntil: "networkidle" });
await beginSolver(touchPage);
const touchStart = await cellCenter(touchPage, horizontalPath[0]);
const touchEnd = await cellCenter(touchPage, horizontalPath[horizontalPath.length - 1]);
await solverCell(touchPage, horizontalPath[0]).dispatchEvent("pointerdown", { pointerId: 41, pointerType: "touch", isPrimary: true, clientX: touchStart.x, clientY: touchStart.y, buttons: 1 });
await touchPage.locator(".solver-grid").dispatchEvent("pointermove", { pointerId: 41, pointerType: "touch", isPrimary: true, clientX: touchEnd.x, clientY: touchEnd.y, buttons: 1 });
await touchPage.locator(".solver-grid").dispatchEvent("pointerup", { pointerId: 41, pointerType: "touch", isPrimary: true, clientX: touchEnd.x, clientY: touchEnd.y, buttons: 0 });
if ((await touchPage.locator(".solver-bank > span.found").count()) !== 1) failures.push("touch pointer drag did not solve the word");
await touchContext.close();

await browser.close();

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Browser smoke passed ${routes.length} routes x ${widths.length} viewports plus search, navigation, utility, print, and pointer/touch/tap/keyboard solver checks.`);
