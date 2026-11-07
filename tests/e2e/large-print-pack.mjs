import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const base = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const words = ["garden", "flower", "bird", "seed", "leaf", "plant"];
try {
  const page = await browser.newPage({ acceptDownloads: true, viewport: { width: 390, height: 844 } });
  await page.goto(`${base}/pack-builder`, { waitUntil: "networkidle" });
  await page.getByLabel("Pack title").fill("Family Activity");
  await page.getByLabel("Base seed").fill("large-grid");
  await page.getByLabel("Words or phrases").fill(Array.from({ length: 20 }, (_, i) => `WORD${String.fromCharCode(65 + i)}`).join("\n"));
  await page.getByLabel("Print type").selectOption("large");
  await page.getByRole("button", { name: "Download PDF pack" }).click();
  await page.locator("form").getByRole("alert").waitFor();
  assert.match(await page.locator("form").getByRole("alert").innerText(), /16-point/);
  assert.equal((await page.getByLabel("Words or phrases").inputValue()).split("\n").length, 20);
  await page.getByLabel("Words or phrases").fill(words.join("\n"));
  for (const paper of ["letter", "a4"]) {
    await page.getByLabel("Paper size").selectOption(paper);
    const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "Download PDF pack" }).click()]);
    const path = join(tmpdir(), `ilws-large-print-${paper}.pdf`);
    await download.saveAs(path);
    const bytes = await readFile(path);
    const task = getDocument({ data: new Uint8Array(bytes), useSystemFonts: true });
    const document = await task.promise;
    assert.equal(document.numPages, 10);
    const grids = [];
    for (let i = 1; i <= document.numPages; i++) {
      const text = await (await document.getPage(i)).getTextContent();
      const items = text.items.filter((item) => "str" in item);
      const grid = items.filter((item) => /^[A-Z]$/.test(item.str));
      assert.equal(grid.length, 225);
      assert.ok(grid.every((item) => Math.abs(item.transform[3]) >= 16));
      grids.push(grid.map((item) => item.str).join(""));
      if (i <= 5) for (const word of words) {
        const label = items.find((item) => item.str === word);
        assert.ok(label, `Missing ${word}`);
        assert.equal(label.transform[3], 18);
      }
    }
    for (let i = 0; i < 5; i++) assert.equal(grids[i], grids[i + 5]);
    await task.destroy();
    console.log(`PASS ${paper}: 5 student/teacher grids, min16pt letters/18pt bank; sample ${path}`);
  }
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
} finally { await browser.close(); }
