import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { chromium, type Page } from "playwright";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { encodeShareState } from "@/lib/share-state/state";

declare global {
  interface Window {
    __gridExportLiveUrls?: Set<string>;
    __gridExportDocument?: string;
    __releaseGridExport?: () => Promise<void>;
  }
}

const base = process.env.BASE_URL ?? "http://127.0.0.1:3491";
const output = process.env.GRID_COMPAT_OUTPUT ?? join(tmpdir(), "ilws-grid-export-compatibility");
await mkdir(output, { recursive: true });
const report = {
  base,
  cases: [] as unknown[], checks: [] as string[], failures: [] as string[],
  priorBinaryFitFailure: { source: "Frozen3491 before export fit guard", cellWidth: 34, maxStandaloneTokenWidth: 36.77, overflowingCells: 96, evidence: "grid-export-compatibility-final/binary-390.png and report.json", disposition: "Authoritative visual fit failure; revised SVG/PNG must reject this request while exact TXT remains available." },
  limitations: "Installed Chromium/system fonts only; ink presence does not establish glyph identity, every platform font, physical-device rendering or PDF parity."
};
const browser = await chromium.launch();

async function download(page: Page, label: string) {
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: label, exact: true }).click();
  const result = await pending;
  return readFile((await result.path())!);
}

try {
  for (const pack of ["morse", "binary", "braille"] as const) {
    for (const [width, colorScheme] of [[390, "dark"], [1280, "light"]] as const) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme, acceptDownloads: true });
      await context.route("https://pagead2.googlesyndication.com/**", route => route.fulfill({ contentType: "application/javascript", body: "" }));
      const page = await context.newPage();
      const request = { title: `Compatibility ${pack}`, wordsText: "CAT\nDOG\nBIRD", seed: "grid-export-compatibility", rows: 8, cols: 12, autoSize: false, directions: ["E" as const], alphabetPack: pack, showCoordinates: true };
      const expected = generatePuzzle(request);
      await page.goto(`${base}/word-search-generator?state=${encodeShareState(request)}`, { waitUntil: "networkidle" });
      const source = page.locator(".builder-preview svg.puzzle-svg");
      await source.locator(".puzzle-token").last().waitFor();
      assert.deepEqual(await source.locator(".puzzle-token").allTextContents(), expected.grid.flat());
      const dimensions = await source.evaluate(svg => {
        const element = svg as SVGSVGElement;
        const token = element.querySelector<SVGTextElement>(".puzzle-token")!;
        const rect = token.previousElementSibling!;
        return { width: element.viewBox.baseVal.width, height: element.viewBox.baseVal.height, cell: Number(rect.getAttribute("width")), gutter: Number(rect.getAttribute("x")) };
      });
      assert.ok(dimensions.gutter > 0, "coordinate fixture must include a real gutter");
      assert.equal((await download(page, "Grid text")).toString(), expected.grid.map(row => row.join("\t")).join("\n") + "\n");
      if (pack === "binary") {
        let blockedDownloads = 0;
        page.on("download", () => blockedDownloads++);
        for (const name of ["SVG grid", "PNG grid"]) {
          await page.getByRole("button", { name, exact: true }).click();
          const error = page.getByRole("status").filter({ hasText: /Grid text/i });
          await error.waitFor();
          assert.match(await error.textContent() ?? "", /fit|wide|width|cell/i, "rejection explains the actual fit problem");
          assert.equal(await page.getByRole("button", { name, exact: true }).isEnabled(), true);
          assert.equal(blockedDownloads, 0, "unreadable Binary SVG/PNG must fail closed, with no file");
        }
        assert.deepEqual(await source.locator(".puzzle-token").allTextContents(), expected.grid.flat(), "rejected export leaves the exact preview intact");
        page.removeAllListeners("download");
        assert.equal((await download(page, "Grid text")).toString(), expected.grid.map(row => row.join("\t")).join("\n") + "\n", "TXT remains available after both graphics are rejected");
        report.cases.push({ pack, width, colorScheme, tokenCount: expected.grid.flat().length, graphics: "Actionable fit rejection; no download", text: "Exact canonical parity before and after rejection" });
        await context.close();
        continue;
      }
      const svg = await download(page, "SVG grid");
      await writeFile(join(output, `${pack}-${width}.svg`), svg);
      // Open the actual downloaded file as its own SVG document, with no site stylesheet.
      const standalone = await context.newPage();
      const remoteRequests: string[] = [];
      standalone.on("request", item => { if (/^https?:/.test(item.url())) remoteRequests.push(item.url()); });
      await standalone.goto(`data:image/svg+xml;base64,${svg.toString("base64")}`);
      assert.deepEqual(await standalone.locator(".puzzle-token").allTextContents(), expected.grid.flat());
      assert.equal(await standalone.locator(".grid-coordinate").count(), request.rows + request.cols);
      const typography = await standalone.locator("svg").evaluate(root => {
        const element = root as unknown as SVGSVGElement;
        return Array.from(element.querySelectorAll<SVGTextElement>("text")).map(text => {
          const style = getComputedStyle(text), box = text.getBBox();
          return { token: text.textContent, coordinate: text.classList.contains("grid-coordinate"), family: style.fontFamily, size: parseFloat(style.fontSize), weight: style.fontWeight, fill: style.fill, width: box.width, height: box.height, nominalSize: Number(text.getAttribute("font-size")) };
        });
      });
      for (const text of typography) {
        assert.equal(text.family, "Arial, Helvetica, sans-serif");
        assert.equal(text.size, text.coordinate ? 12 : text.nominalSize);
        assert.equal(text.weight, text.coordinate ? "400" : "700");
        assert.equal(text.fill, text.coordinate ? "rgb(71, 85, 105)" : "rgb(17, 24, 39)");
        assert.ok(text.width > 0 && text.height > 0 && text.size > 0, `standalone text has real dimensions: ${text.token}`);
        if (!text.coordinate) assert.ok(text.width <= dimensions.cell, `standalone token exceeds its cell: ${text.token}`);
      }
      assert.deepEqual(remoteRequests, [], "standalone SVG must not fetch site fonts/styles");
      // Keep the actual SVG and inspect its independent document. Chromium's
      // full-page screenshot can stall on an SVG-document root; raster evidence
      // is retained from the actual exported PNG below instead.
      await standalone.close();
      const png = await download(page, "PNG grid");
      assert.equal(png.subarray(1, 4).toString(), "PNG");
      const scale = Math.min(2, 3200 / Math.max(dimensions.width, dimensions.height));
      assert.equal(png.readUInt32BE(16), Math.ceil(dimensions.width * scale));
      assert.equal(png.readUInt32BE(20), Math.ceil(dimensions.height * scale));
      const ink = await page.evaluate(async ({ data, rows, cols, cell, gutter, svgWidth, svgHeight }) => {
        const image = new Image(); image.src = `data:image/png;base64,${data}`; await image.decode();
        const canvas = document.createElement("canvas"); canvas.width = image.width; canvas.height = image.height;
        const ctx = canvas.getContext("2d")!; ctx.drawImage(image, 0, 0);
        let inked = 0;
        for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
          const pixels = ctx.getImageData(Math.ceil((gutter + (col + .1) * cell) * image.width / svgWidth), Math.ceil((gutter + (row + .1) * cell) * image.height / svgHeight), Math.floor(.8 * cell * image.width / svgWidth), Math.floor(.8 * cell * image.height / svgHeight)).data;
          for (let i = 0; i < pixels.length; i += 4) if (pixels[i] < 150 && pixels[i + 1] < 150 && pixels[i + 2] < 150) { inked++; break; }
        }
        return inked;
      }, { data: png.toString("base64"), rows: request.rows, cols: request.cols, cell: dimensions.cell, gutter: dimensions.gutter, svgWidth: dimensions.width, svgHeight: dimensions.height });
      assert.equal(ink, request.rows * request.cols, "every coordinate-offset grid cell has actual token ink away from borders");
      await writeFile(join(output, `${pack}-${width}.png`), png);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      report.cases.push({ pack, width, colorScheme, dimensions, tokenCount: expected.grid.flat().length, inkedCells: ink, typography, remoteStandaloneRequests: remoteRequests });
      await context.close();
    }
  }

  const failure = await browser.newPage();
  await failure.addInitScript(() => {
    const create = URL.createObjectURL.bind(URL), revoke = URL.revokeObjectURL.bind(URL);
    window.__gridExportLiveUrls = new Set();
    URL.createObjectURL = blob => { const url = create(blob); window.__gridExportLiveUrls!.add(url); return url; };
    URL.revokeObjectURL = url => { window.__gridExportLiveUrls!.delete(url); revoke(url); };
    const descriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src")!;
    Object.defineProperty(HTMLImageElement.prototype, "src", { ...descriptor, set(this: HTMLImageElement, value: string) {
      if (value.startsWith("blob:")) queueMicrotask(() => this.dispatchEvent(new Event("error")));
      else descriptor.set!.call(this, value);
    } });
  });
  await failure.goto(`${base}/word-search-generator`, { waitUntil: "networkidle" });
  const before = await failure.locator(".builder-preview .puzzle-token").allTextContents();
  await failure.getByRole("button", { name: "PNG grid", exact: true }).click();
  await failure.getByRole("status").filter({ hasText: "The PNG could not be created" }).waitFor();
  assert.equal(await failure.getByRole("button", { name: "PNG grid", exact: true }).isEnabled(), true);
  assert.deepEqual(await failure.locator(".builder-preview .puzzle-token").allTextContents(), before);
  assert.equal(await failure.evaluate(() => window.__gridExportLiveUrls!.size), 0, "image error revokes its source Blob URL");
  await failure.close();
  report.checks.push("Forced Image.onerror reports an actionable error, restores PNG control, preserves grid, and revokes source URL.");

  const unmounted = await browser.newPage();
  await unmounted.addInitScript(() => {
    window.__gridExportDocument = "same-document-client-navigation";
    const original = HTMLCanvasElement.prototype.toBlob;
    HTMLCanvasElement.prototype.toBlob = function (callback, type, quality) {
      const canvas = this;
      window.__releaseGridExport = () => new Promise(resolve => original.call(canvas, blob => {
        callback(blob);
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }, type, quality));
    };
  });
  await unmounted.goto(`${base}/word-search-generator`, { waitUntil: "networkidle" });
  let downloads = 0; unmounted.on("download", () => downloads++);
  await unmounted.getByRole("button", { name: "PNG grid", exact: true }).click();
  await unmounted.waitForFunction(() => typeof window.__releaseGridExport === "function");
  await unmounted.locator('.site-header a[href="/"]').first().click();
  await unmounted.waitForURL(`${base}/`);
  await unmounted.locator(".builder-preview").waitFor({ state: "detached" });
  assert.equal(await unmounted.evaluate(() => window.__gridExportDocument), "same-document-client-navigation", "must test client unmount, not document replacement");
  await unmounted.evaluate(() => window.__releaseGridExport!());
  assert.equal(downloads, 0, "completion after client unmount must not download the stale PNG");
  await unmounted.close();
  report.checks.push("A real delayed raster finishes after same-document client unmount; no stale download occurs.");
} catch (error) { report.failures.push(error instanceof Error ? error.stack ?? error.message : String(error)); process.exitCode = 1; }
finally { await browser.close(); await writeFile(join(output, "report.json"), JSON.stringify(report, null, 2)); console.log(JSON.stringify({ cases: report.cases.length, checks: report.checks, failures: report.failures, limitations: report.limitations }, null, 2)); }
