import { readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { getDocument, OPS } from "pdfjs-dist/legacy/build/pdf.mjs";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const outputPath = process.env.PDF_AUDIT_OUTPUT ?? join(tmpdir(), "ilws-production-pdf-audit.pdf");
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });

try {
  await page.goto(`${baseUrl}/word-search-generator`, { waitUntil: "networkidle" });
  await page.locator(".builder-surface").waitFor({ state: "visible", timeout: 8_000 });
  await page.getByRole("button", { name: "Download PDF" }).first().click();
  const dialog = page.getByRole("dialog", { name: "Download PDF" });
  await dialog.getByLabel("Paper size").selectOption("a4");
  await dialog.getByLabel("Orientation").selectOption("landscape");
  await dialog.getByText("Answer key page").click();
  await dialog.getByLabel("QR code").check();
  const downloadPromise = page.waitForEvent("download");
  await dialog.getByRole("button", { name: "Download PDF" }).click();
  const download = await downloadPromise;
  await download.saveAs(outputPath);

  const bytes = await readFile(outputPath);
  if (bytes.subarray(0, 5).toString("ascii") !== "%PDF-") throw new Error("Production download is not a PDF.");
  if (!download.suggestedFilename().endsWith("-word-search.pdf")) throw new Error(`Unsafe filename ${download.suggestedFilename()}`);
  const document = await getDocument({
    data: new Uint8Array(bytes),
    useSystemFonts: true
  }).promise;
  if (document.numPages !== 2) throw new Error(`Expected puzzle and answer pages, received ${document.numPages}`);
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const pdfPage = await document.getPage(pageNumber);
    const viewport = pdfPage.getViewport({ scale: 1 });
    if (viewport.width < viewport.height || Math.abs(viewport.width - 841.89) > 2 || Math.abs(viewport.height - 595.28) > 2) {
      throw new Error(`Page ${pageNumber} is not A4 landscape (${viewport.width}x${viewport.height}).`);
    }
    const text = (await pdfPage.getTextContent()).items.map((item) => "str" in item ? item.str : "").join(" ");
    if (!text.includes("Word Search Generator")) throw new Error(`Page ${pageNumber} is missing its title.`);
    const operatorList = await pdfPage.getOperatorList();
    const embeddedImages = operatorList.fnArray.filter((operator) => (
      operator === OPS.paintImageXObject
      || operator === OPS.paintInlineImageXObject
      || operator === OPS.paintImageMaskXObject
    )).length;
    if (!embeddedImages) throw new Error(`Page ${pageNumber} is missing its QR image.`);
    if (pageNumber === 1 && (!text.includes("Find each word") || !text.toLowerCase().includes("classroom"))) throw new Error("Puzzle page is missing its instructions or word bank.");
    if (pageNumber === 2 && !text.includes("Answer Key")) throw new Error("Answer page is missing its answer-key label.");
  }
  console.log(`Production PDF audit passed: two A4 landscape pages, real PDF signature, safe filename, title/word text, answer page, and embedded QR images. Artifact: ${outputPath}`);
} finally {
  await browser.close();
}
