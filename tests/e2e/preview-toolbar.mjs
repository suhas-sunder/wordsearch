import { readFile } from "node:fs/promises";
import { chromium } from "playwright";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch({ headless: true });
const failures = [];

async function pdfPageCount(download) {
  const path = await download.path();
  if (!path) throw new Error("The browser did not expose the downloaded PDF.");
  const bytes = await readFile(path);
  if (bytes.subarray(0, 5).toString("ascii") !== "%PDF-") throw new Error("The browser download is not a real PDF.");
  return (await getDocument({ data: new Uint8Array(bytes), useSystemFonts: true }).promise).numPages;
}

try {
  const page = await browser.newPage({ viewport: { width: 1024, height: 1000 } });
  await page.addInitScript(() => {
    window.__createdObjectUrls = [];
    window.__revokedObjectUrls = [];
    const createObjectURL = URL.createObjectURL.bind(URL);
    const revokeObjectURL = URL.revokeObjectURL.bind(URL);
    URL.createObjectURL = (value) => {
      if (window.__failCreateObjectUrlOnce) {
        window.__failCreateObjectUrlOnce = false;
        throw new Error("Intentional preview audit failure");
      }
      const url = createObjectURL(value);
      window.__createdObjectUrls.push(url);
      return url;
    };
    URL.revokeObjectURL = (url) => {
      window.__revokedObjectUrls.push(String(url));
      revokeObjectURL(url);
    };
  });
  await page.goto(`${baseUrl}/word-search-generator`, { waitUntil: "networkidle" });
  const toolbar = page.locator(".output-preview-toolbar");
  const actionGroup = toolbar.locator(".preview-toolbar-actions");
  const preview = page.locator(".preview-paper-single");
  const previewButton = actionGroup.getByRole("button", { name: "Show Answers" });

  if (await toolbar.getByText("Answer page", { exact: true }).count()) failures.push("visible preview toolbar still contains Answer page");
  if (await toolbar.locator('input[type="checkbox"]').evaluateAll((items) => items.some((item) => item.parentElement?.textContent?.includes("Answer")))) failures.push("visible preview toolbar still contains an answer checkbox");
  if (!(await actionGroup.getByRole("button", { name: "Share", exact: true }).isVisible())) failures.push("Share is not in the preview action group");
  if (await toolbar.locator("[target]").count()) failures.push("preview toolbar contains a new-tab action");
  if (await toolbar.locator(".ad-slot").count()) failures.push("an advertisement appears inside the preview toolbar");
  const actionLabels = await actionGroup.getByRole("button").allTextContents();
  if (!actionLabels[0]?.includes("Share") || !actionLabels[1]?.includes("Print this puzzle") || !actionLabels[2]?.includes("Download PDF") || !actionLabels[3]?.includes("Show Answers")) {
    failures.push(`preview action order is incorrect: ${actionLabels.join(" | ")}`);
  }
  const shortControls = await actionGroup.getByRole("button").evaluateAll((buttons) => buttons.filter((button) => button.getBoundingClientRect().height < 40).length);
  if (shortControls) failures.push(`${shortControls} preview actions are too short for touch use`);

  const shareButton = actionGroup.getByRole("button", { name: "Share", exact: true });
  await shareButton.focus();
  await page.keyboard.press("Enter");
  const shareDialog = page.getByRole("dialog", { name: "Share this puzzle" });
  await shareDialog.locator("img[alt*='QR code']").waitFor();
  if (!(await shareDialog.isVisible())) failures.push("keyboard activation did not open the Share dialog");
  await page.keyboard.press("Escape");
  if (!(await shareButton.evaluate((element) => element === document.activeElement))) failures.push("Share dialog did not return keyboard focus");

  const initial = await page.evaluate(() => {
    const preview = document.querySelector(".preview-paper-single");
    const sheet = preview?.querySelector(".print-sheet");
    return {
      mode: preview?.getAttribute("data-preview-mode"),
      sheetCount: preview?.querySelectorAll(".print-sheet").length ?? 0,
      answerCount: preview?.querySelectorAll(".print-answer-sheet").length ?? 0,
      grid: Array.from(preview?.querySelectorAll(".puzzle-token") ?? [], (node) => node.textContent).join("|"),
      viewBox: preview?.querySelector(".puzzle-svg")?.getAttribute("viewBox"),
      seed: document.querySelector(".validation-panel code")?.textContent,
      portalSheets: document.querySelectorAll(".utility-print-portal .print-sheet").length,
      portalAnswers: document.querySelectorAll(".utility-print-portal .print-answer-sheet").length,
      sheetTop: sheet?.getBoundingClientRect().top
    };
  });
  if (initial.mode !== "puzzle" || initial.sheetCount !== 1 || initial.answerCount !== 0) failures.push("initial preview is not exactly one unsolved sheet");
  if (initial.portalSheets !== 1 || initial.portalAnswers !== 0) failures.push("initial output composition is not one puzzle page");

  await previewButton.scrollIntoViewIfNeeded();
  const scrollBefore = await page.evaluate(() => window.scrollY);
  const sheetTopBefore = await preview.locator(".print-sheet").evaluate((sheet) => sheet.getBoundingClientRect().top);
  await previewButton.click();
  const hideButton = actionGroup.getByRole("button", { name: "Hide Answers" });
  const answer = await page.evaluate(() => {
    const preview = document.querySelector(".preview-paper-single");
    const sheet = preview?.querySelector(".print-sheet");
    return {
      mode: preview?.getAttribute("data-preview-mode"),
      sheetCount: preview?.querySelectorAll(".print-sheet").length ?? 0,
      answerCount: preview?.querySelectorAll(".print-answer-sheet").length ?? 0,
      puzzleCount: preview?.querySelectorAll(".print-sheet:not(.print-answer-sheet)").length ?? 0,
      grid: Array.from(preview?.querySelectorAll(".puzzle-token") ?? [], (node) => node.textContent).join("|"),
      viewBox: preview?.querySelector(".puzzle-svg")?.getAttribute("viewBox"),
      answerLines: preview?.querySelectorAll(".puzzle-svg line").length ?? 0,
      seed: document.querySelector(".validation-panel code")?.textContent,
      portalSheets: document.querySelectorAll(".utility-print-portal .print-sheet").length,
      portalAnswers: document.querySelectorAll(".utility-print-portal .print-answer-sheet").length,
      announcement: Array.from(document.querySelectorAll('[role="status"]'), (node) => node.textContent).find((text) => text?.includes("Answer key preview")) ?? "",
      sheetTop: sheet?.getBoundingClientRect().top
    };
  });
  if (answer.mode !== "answer" || answer.sheetCount !== 1 || answer.answerCount !== 1 || answer.puzzleCount !== 0) failures.push("Show Answers did not replace the puzzle with exactly one answer sheet");
  if (answer.grid !== initial.grid || answer.viewBox !== initial.viewBox || answer.seed !== initial.seed) failures.push("answer preview changed the deterministic grid or seed");
  if (!answer.answerLines) failures.push("answer preview is missing placement markings");
  if (answer.portalSheets !== 1 || answer.portalAnswers !== 0) failures.push("answer preview changed output answer inclusion");
  if ((await hideButton.getAttribute("aria-pressed")) !== "true") failures.push("Show Answers did not set aria-pressed=true");
  if (!answer.announcement.includes("Answer key preview is visible")) failures.push("answer preview change was not announced");
  const scrollAfter = await page.evaluate(() => window.scrollY);
  if (Math.abs(scrollAfter - scrollBefore) > 4) failures.push(`answer replacement moved the scroll position by ${Math.abs(scrollAfter - scrollBefore)}px`);
  if (Math.abs((answer.sheetTop ?? 0) - sheetTopBefore) > 1) failures.push("answer sheet did not render in the same preview position");

  await actionGroup.getByRole("button", { name: "Print this puzzle" }).click();
  const printDialog = page.getByRole("dialog", { name: "Print puzzle" });
  const printAnswers = printDialog.getByLabel("Answer key page");
  if (!(await printAnswers.isVisible())) failures.push("Print dialog lost its answer-key option");
  if (await printAnswers.isChecked()) failures.push("preview answer mode enabled Print answer inclusion");
  await printAnswers.check();
  if ((await page.locator(".utility-print-portal .print-sheet").count()) !== 2) failures.push("Print answer inclusion did not compose two pages");
  if ((await preview.locator(".print-sheet").count()) !== 1 || !(await preview.locator(".print-answer-sheet").count())) failures.push("Print answer inclusion changed the one-sheet answer preview");
  await printAnswers.uncheck();
  if ((await page.locator(".utility-print-portal .print-sheet").count()) !== 1) failures.push("Print without answers did not compose one page");
  await printDialog.getByRole("button", { name: "Cancel" }).click();

  async function downloadPdfWithAnswers(includeAnswers, retryOnce = false) {
    await actionGroup.getByRole("button", { name: "Download PDF" }).click();
    const dialog = page.getByRole("dialog", { name: "Download PDF" });
    const answerOption = dialog.getByLabel("Answer key page");
    if (!(await answerOption.isVisible())) failures.push("PDF dialog lost its answer-key option");
    if (includeAnswers) await answerOption.check();
    else await answerOption.uncheck();
    if (retryOnce) {
      await page.evaluate(() => { window.__failCreateObjectUrlOnce = true; });
      await dialog.getByRole("button", { name: "Download PDF" }).click();
      await dialog.getByRole("alert").waitFor();
      if (!(await dialog.getByRole("button", { name: "Retry PDF" }).isVisible())) failures.push("PDF failure did not expose an accessible retry");
    }
    const downloadPromise = page.waitForEvent("download");
    await dialog.getByRole("button", { name: retryOnce ? "Retry PDF" : "Download PDF" }).click();
    return pdfPageCount(await downloadPromise);
  }

  if (await downloadPdfWithAnswers(false, true) !== 1) failures.push("PDF without answers did not contain exactly one page");
  if ((await preview.locator(".print-sheet").count()) !== 1 || !(await preview.locator(".print-answer-sheet").count())) failures.push("one-page PDF selection changed answer preview mode");
  if (await downloadPdfWithAnswers(true) !== 2) failures.push("PDF with answers did not contain exactly two pages");
  if ((await page.locator(".utility-print-portal .print-sheet").count()) !== 2) failures.push("two-page PDF option was not retained for output");

  await hideButton.click();
  const restored = await page.evaluate(() => {
    const preview = document.querySelector(".preview-paper-single");
    return {
      mode: preview?.getAttribute("data-preview-mode"),
      sheetCount: preview?.querySelectorAll(".print-sheet").length ?? 0,
      answerCount: preview?.querySelectorAll(".print-answer-sheet").length ?? 0,
      grid: Array.from(preview?.querySelectorAll(".puzzle-token") ?? [], (node) => node.textContent).join("|"),
      seed: document.querySelector(".validation-panel code")?.textContent,
      portalSheets: document.querySelectorAll(".utility-print-portal .print-sheet").length,
      announcement: Array.from(document.querySelectorAll('[role="status"]'), (node) => node.textContent).find((text) => text?.includes("Puzzle preview is visible")) ?? ""
    };
  });
  if (restored.mode !== "puzzle" || restored.sheetCount !== 1 || restored.answerCount !== 0) failures.push("Hide Answers did not restore exactly one puzzle sheet");
  if (restored.grid !== initial.grid || restored.seed !== initial.seed) failures.push("Hide Answers changed the deterministic puzzle");
  if (restored.portalSheets !== 2) failures.push("hiding answer preview disabled answer inclusion for output");
  if ((await actionGroup.getByRole("button", { name: "Show Answers" }).getAttribute("aria-pressed")) !== "false") failures.push("Hide Answers did not set aria-pressed=false");
  if (!restored.announcement.includes("Puzzle preview is visible")) failures.push("puzzle preview restoration was not announced");

  await page.waitForTimeout(1_100);
  const objectUrls = await page.evaluate(() => ({
    created: window.__createdObjectUrls,
    revoked: window.__revokedObjectUrls
  }));
  if (objectUrls.created.length < 2 || objectUrls.created.some((url) => !objectUrls.revoked.includes(url))) failures.push("PDF object URLs were not all revoked");
  await page.close();

  for (const viewport of [
    { width: 320, height: 760 },
    { width: 360, height: 800 },
    { width: 390, height: 844 },
    { width: 430, height: 900 },
    { width: 768, height: 900 },
    { width: 1024, height: 900 },
    { width: 1440, height: 1000 },
    { width: 667, height: 320 }
  ]) {
    const responsivePage = await browser.newPage({ viewport });
    await responsivePage.goto(`${baseUrl}/word-search-generator`, { waitUntil: "networkidle" });
    const metrics = await responsivePage.evaluate(() => {
      const toolbar = document.querySelector(".output-preview-toolbar");
      const buttons = Array.from(toolbar?.querySelectorAll("button") ?? []);
      return {
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        sheetCount: document.querySelectorAll(".preview-paper-single .print-sheet").length,
        hiddenButtons: buttons.filter((button) => button.getBoundingClientRect().width === 0 || button.getBoundingClientRect().height === 0).length,
        clippedLabels: buttons.filter((button) => button.scrollWidth > button.clientWidth + 1).length
      };
    });
    if (metrics.overflow > 2) failures.push(`${viewport.width}x${viewport.height} preview toolbar has horizontal overflow`);
    if (metrics.sheetCount !== 1) failures.push(`${viewport.width}x${viewport.height} does not show exactly one preview sheet`);
    if (metrics.hiddenButtons) failures.push(`${viewport.width}x${viewport.height} hides ${metrics.hiddenButtons} preview actions`);
    if (metrics.clippedLabels) failures.push(`${viewport.width}x${viewport.height} clips ${metrics.clippedLabels} preview labels`);
    await responsivePage.close();
  }
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Printable preview audit passed replace-in-place answers, separated output composition, Share/keyboard access, 1/2-page PDFs, object URL cleanup, and 8 responsive viewports.");
