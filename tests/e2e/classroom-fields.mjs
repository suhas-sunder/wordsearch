import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { chromium } from "playwright";
const base = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch({ headless: true });
const instructions = "Circle each word, then compare your vocabulary with a partner.";
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, acceptDownloads: true });
  await page.goto(`${base}/pack-builder`, { waitUntil: "networkidle" });
  await page.getByLabel("Pack title").fill("Botany Review");
  await page.getByLabel("Words or phrases").fill("garden\nflower\nbird\nseed\nleaf\nplant");
  await page.getByLabel("Base seed", { exact: true }).fill("class-fields");
  await page.getByLabel("Worksheet instructions").fill(instructions);
  const classLine = page.getByRole("checkbox", { name: /Add a blank Class line/ });
  await classLine.check();
  await page.getByLabel("Print type").selectOption("large");
  await page.getByRole("button", { name: "Save preset on this device" }).click();
  await page.getByRole("button", { name: "Load Botany Review", exact: true }).waitFor();
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Show saved presets" }).click();
  await page.getByRole("button", { name: "Load Botany Review", exact: true }).click();
  assert.equal(await page.getByLabel("Worksheet instructions").inputValue(), instructions);
  assert.ok(await classLine.isChecked());
  assert.equal(await page.getByLabel("Print type").inputValue(), "large");
  for (const paperSize of ["letter", "a4"]) {
    await page.getByLabel("Paper size").selectOption(paperSize);
    const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "Download PDF pack" }).click()]);
    const path = join(tmpdir(), `ilws-classroom-fields-${paperSize}.pdf`);
    await download.saveAs(path);
    const task = getDocument({ data: new Uint8Array(await readFile(path)), useSystemFonts: true });
    const pdf = await task.promise;
    try {
      assert.equal(pdf.numPages, 10);
      const grids = [];
      for (let i = 1; i <= 10; i++) {
        const content = await (await pdf.getPage(i)).getTextContent();
        const values = content.items.filter((item) => "str" in item).map((item) => item.str);
        const text = values.join(" ").replace(/\s+/g, " ");
        for (const label of ["Name", "Date", "Class"]) assert.equal(values.includes(label), i <= 5);
        assert.equal(text.includes(instructions), i <= 5);
        grids.push(values.filter((value) => /^[A-Z]$/.test(value)).join(""));
      }
      for (let i = 0; i < 5; i++) assert.equal(grids[i], grids[i + 5]);
    } finally { await task.destroy(); }
  }
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  console.log("PASS classroom Class/instructions/large-type preset reload and real Letter/A4 student/teacher PDF fields and grids.");
} finally { await browser.close(); }
