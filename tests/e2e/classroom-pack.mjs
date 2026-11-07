import { chromium } from "playwright";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { PDFDocument } from "pdf-lib";
import AxeBuilder from "@axe-core/playwright";
import { fileURLToPath } from "node:url";
import { strict as assert } from "node:assert";

const base = process.env.BASE_URL ?? "http://127.0.0.1:3225";
const browser = await chromium.launch({ headless: true });
const words = "planet\ncomet\nstar\nmoon";
async function downloadBytes(download) {
  const chunks = [];
  for await (const chunk of await download.createReadStream()) chunks.push(chunk);
  return Buffer.concat(chunks);
}
async function readPages(bytes) {
  const standardFontDataUrl = `${fileURLToPath(new URL("../../node_modules/pdfjs-dist/standard_fonts/", import.meta.url))}/`;
  const loadingTask = getDocument({ data: new Uint8Array(bytes), standardFontDataUrl });
  const pdf = await loadingTask.promise;
  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const content = await (await pdf.getPage(i)).getTextContent();
    const values = content.items.filter((item) => "str" in item).map((item) => item.str);
    pages.push({ text: values.join(" "), grid: values.filter((value) => /^[A-Z]$/.test(value)).slice(0, 225).join("") });
  }
  await loadingTask.destroy();
  return pages;
}
try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 850 }, acceptDownloads: true });
  const page = await context.newPage();
  const requests = [];
  page.on("request", (request) => requests.push({ url: request.url(), method: request.method() }));
  const response = await page.goto(`${base}/pack-builder`, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200);
  assert.match((await response.allHeaders())["x-robots-tag"], /noindex/);
  assert.match(await page.locator('meta[name="robots"]').getAttribute("content"), /noindex/);
  assert.equal(await page.locator('.ad-slot, ins.adsbygoogle, [data-ad-slot], [data-ad-placeholder]').count(), 0);
  assert.ok(!(await (await page.request.get(`${base}/sitemap.xml`)).text()).includes("/pack-builder"));
  await page.getByLabel("Base seed").fill("teacher-1");
  await page.getByRole("button", { name: "Download PDF pack" }).focus();
  await page.keyboard.press("Enter");
  await page.locator("form").getByRole("alert").waitFor();
  assert.match(await page.locator("form").getByRole("alert").innerText(), /words|lines/i);
  await page.getByLabel("Words or phrases").fill("planet\nPLANET");
  await page.getByLabel("Base seed").fill("teacher-1");
  await page.getByRole("button", { name: "Download PDF pack" }).click();
  assert.match(await page.locator("form").getByRole("alert").innerText(), /duplicate/i);
  assert.equal(await page.getByLabel("Words or phrases").inputValue(), "planet\nPLANET");
  await page.getByLabel("Words or phrases").fill("planet\n!!!");
  await page.getByRole("button", { name: "Download PDF pack" }).click();
  assert.match(await page.locator("form").getByRole("alert").innerText(), /English letters/i);
  const difficult = Array.from({ length: 12 }, (_, i) => Array.from({ length: 14 }, (_, j) => String.fromCharCode(65 + (i * 17 + j * 7 + j * j) % 26)).join("")).join("\n");
  await page.getByLabel("Words or phrases").fill(difficult);
  await page.getByLabel("Base seed").fill("s0");
  await page.getByLabel("Puzzles").selectOption("10");
  await page.getByRole("button", { name: "Download PDF pack" }).click();
  assert.match(await page.locator("form").getByRole("alert").innerText(), /could not place every word/);
  assert.equal(await page.getByLabel("Words or phrases").inputValue(), difficult);
  await page.getByLabel("Base seed").fill("teacher-1");
  await page.getByLabel("Puzzles").selectOption("5");
  await page.getByLabel("Words or phrases").fill(words);
  await page.route("**/_next/static/chunks/**", async (route) => { await new Promise((resolve) => setTimeout(resolve, 300)); await route.continue(); });
  let requestStart = requests.length;
  const [fiveDownload] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "Download PDF pack" }).click(), page.getByRole("button", { name: "Preparing PDF…" }).waitFor()]);
  const fiveBytes = await downloadBytes(fiveDownload);
  assert.equal(fiveDownload.suggestedFilename(), "classroom-word-search-pack.pdf");
  const fivePdf = await PDFDocument.load(fiveBytes);
  assert.equal(fivePdf.getPageCount(), 10);
  assert.equal(fivePdf.getPage(0).getWidth(), 612);
  assert.ok(fiveBytes.length < 2_000_000);
  let exportRequests = requests.slice(requestStart);
  assert.ok(exportRequests.every((request) => request.method === "GET" && new URL(request.url).origin === new URL(base).origin));
  const five = await readPages(fiveBytes);
  for (let i = 0; i < 5; i++) {
    assert.match(five[i].text, new RegExp(`Classroom - 0${i + 1}`));
    assert.match(five[i + 5].text, /Answer Key/);
    assert.equal(five[i].grid.length, 225);
    assert.equal(five[i].grid, five[i + 5].grid);
  }
  await page.getByLabel("Puzzles").selectOption("10");
  await page.getByLabel("Paper size").selectOption("a4");
  await page.getByLabel("Answer pages").selectOption("interleaved");
  requestStart = requests.length;
  const [tenDownload] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "Download PDF pack" }).click()]);
  const tenBytes = await downloadBytes(tenDownload);
  const tenPdf = await PDFDocument.load(tenBytes);
  assert.equal(tenPdf.getPageCount(), 20);
  assert.ok(tenBytes.length < 2_000_000);
  assert.ok(Math.abs(tenPdf.getPage(0).getWidth() - 595.28) < 0.1);
  exportRequests = requests.slice(requestStart);
  assert.ok(exportRequests.every((request) => request.method === "GET" && new URL(request.url).origin === new URL(base).origin));
  const ten = await readPages(tenBytes);
  for (let i = 0; i < 10; i++) {
    assert.match(ten[2 * i].text, new RegExp(`Classroom - ${String(i + 1).padStart(2, "0")}`));
    assert.match(ten[2 * i + 1].text, /Answer Key/);
    assert.equal(ten[2 * i].grid.length, 225);
    assert.equal(ten[2 * i].grid, ten[2 * i + 1].grid);
    if (i < 5) assert.equal(ten[2 * i].grid, five[i].grid);
  }
  await page.evaluate(() => { URL.createObjectURL = () => { throw new Error("Download unavailable"); }; });
  await page.getByRole("button", { name: "Download PDF pack" }).click();
  assert.match(await page.locator("form").getByRole("alert").innerText(), /could not be downloaded/);
  assert.equal(await page.getByLabel("Words or phrases").inputValue(), words);
  assert.equal(await page.getByLabel("Base seed").inputValue(), "teacher-1");
  await page.setViewportSize({ width: 375, height: 812 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  assert.ok(await page.getByRole("button", { name: "Download PDF pack" }).isEnabled());
  const axe = await new AxeBuilder({ page }).analyze();
  assert.deepEqual(axe.violations.filter((violation) => ["serious", "critical"].includes(violation.impact)).map((violation) => violation.id), []);
  console.log(`Pack workflow passed: 5/10 downloads (${fiveBytes.length}/${tenBytes.length} bytes), matching answer grids, stable assignments, noindex, local requests, busy/error recovery and desktop/mobile.`);
} finally { await browser.close(); }
