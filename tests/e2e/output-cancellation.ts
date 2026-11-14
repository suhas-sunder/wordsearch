import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { chromium, type Page } from "playwright";
import { encodeShareState } from "@/lib/share-state/state";

declare global { interface Window { __holdPrint: boolean; __pendingPrint: Array<{ resolve(): void; reject(error: Error): void }>; __rejectOldPng?: () => void; } }
const base = process.env.BASE_URL ?? "http://127.0.0.1:3280";
const output = process.env.OUTPUT_CANCEL_EVIDENCE ?? join(tmpdir(), "ilws-output-cancellation");
await mkdir(output, { recursive: true });
const request = { title: "Private canceled worksheet", wordsText: "CAT | A small pet\nDOG | A friendly animal", wordBankMode: "clues" as const, seed: "output-cancellation", rows: 8, cols: 8, autoSize: false, directions: ["E" as const] };
const report = { base, html: [] as string[], utilityPdf: [] as string[], png: [] as string[], errors: [] as string[] };
const browser = await chromium.launch();

async function holdPrint(page: Page) {
  await page.evaluate(() => {
    window.__holdPrint = true; window.__pendingPrint = [];
    const create = document.createElement.bind(document);
    const frameDoc = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, "contentDocument")!;
    const visited = new WeakSet<Document>();
    document.createElement = ((tag: string, options?: ElementCreationOptions) => {
      const element = create(tag, options);
      if (tag.toLowerCase() === "iframe") Object.defineProperty(element, "contentDocument", { get() {
        const doc = frameDoc.get!.call(element) as Document | null;
        if (doc && !visited.has(doc)) {
          visited.add(doc);
          let prototype = Object.getPrototypeOf(doc), descriptor;
          while (prototype && !descriptor) { descriptor = Object.getOwnPropertyDescriptor(prototype, "fonts"); prototype = Object.getPrototypeOf(prototype); }
          const fonts = descriptor!.get!;
          Object.defineProperty(doc, "fonts", { get() {
            const actual = fonts.call(doc) as FontFaceSet;
            return new Proxy(actual, { get(target, key) {
              if (key === "ready") return target.ready.then(() => window.__holdPrint ? new Promise<void>((resolve, reject) => window.__pendingPrint.push({ resolve, reject })) : undefined);
              const value = Reflect.get(target, key, target); return typeof value === "function" ? value.bind(target) : value;
            } });
          } });
        }
        return doc;
      } });
      return element;
    }) as typeof document.createElement;
  });
}

try {
  for (const action of ["edit", "invalid", "case", "paper", "unmount", "unmount-reject"] as const) {
    const context = await browser.newContext({ acceptDownloads: true });
    await context.route("https://pagead2.googlesyndication.com/**", route => route.fulfill({ contentType: "application/javascript", body: "" }));
    const page = await context.newPage();
    page.on("pageerror", error => report.errors.push(error.message));
    await page.goto(`${base}/word-search-generator?state=${encodeShareState(request)}`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => document.querySelectorAll(".print-fit-status").length > 0 && [...document.querySelectorAll<HTMLElement>(".print-fit-status")].every(node => node.dataset.fitState === "ready"));
    let downloads = 0; page.on("download", () => downloads++);
    await holdPrint(page);
    await page.getByRole("button", { name: "HTML worksheet", exact: true }).click();
    const busy = page.getByRole("button", { name: "Checking HTML…", exact: true });
    assert.equal(await busy.isDisabled(), true, "only one pending HTML export is permitted");
    await page.getByRole("status").filter({ hasText: "Checking worksheet print fit before creating the HTML file" }).waitFor();
    await page.waitForFunction(() => window.__pendingPrint.length > 0);
    if (action === "edit") await page.getByLabel("Puzzle title", { exact: true }).fill("Current edited title");
    if (action === "invalid") await page.getByLabel("Rows", { exact: true }).fill("3");
    if (action === "case" || action === "paper") {
      await page.locator(".preview-toolbar-actions").getByRole("button", { name: "Download PDF", exact: true }).click();
      const dialog = page.getByRole("dialog", { name: "Download PDF", exact: true });
      if (action === "case") await dialog.getByRole("combobox", { name: "Printed letter case", exact: true }).selectOption("lowercase");
      else await dialog.getByRole("combobox", { name: "Paper size", exact: true }).selectOption("a4");
      await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
    }
    if (action.startsWith("unmount")) {
      await page.locator('.site-header a[href="/"]').first().click();
      await page.waitForURL(`${base}/`);
      await page.locator(".builder-preview").waitFor({ state: "detached" });
    }
    // Cancellation aborts the measurement immediately; releasing or rejecting
    // the original readiness Promise later must not resurrect output or status.
    await page.evaluate(reject => {
      window.__holdPrint = false;
      for (const pending of window.__pendingPrint) {
        if (reject) pending.reject(new Error("Forced late font failure")); else pending.resolve();
      }
      window.__pendingPrint = [];
    }, action === "unmount-reject");
    await page.waitForFunction(() => document.querySelectorAll('iframe[title="Checking worksheet print fit"]').length === 0);
    await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => resolve())));
    assert.equal(downloads, 0, `${action}: stale HTML download must be canceled`);
    assert.equal(await page.getByRole("status").filter({ hasText: /HTML worksheet downloaded|Forced late font failure/ }).count(), 0);
    if (action !== "invalid" && !action.startsWith("unmount")) assert.equal(await page.getByRole("button", { name: "HTML worksheet", exact: true }).isEnabled(), true);
    if (action === "case") {
      const pending = page.waitForEvent("download");
      await page.getByRole("button", { name: "HTML worksheet", exact: true }).click();
      const file = await pending, html = await readFile((await file.path())!, "utf8");
      assert.match(html, /class="puzzle-token"[^>]*>[a-z]</);
      assert.ok(html.includes("1. A small pet") && html.includes("2. A friendly animal"), "current clue numbering/prose is retained");
      await writeFile(join(output, "current-lowercase-clue-worksheet.html"), html);
    }
    report.html.push(action); await context.close();
  }

  for (const outcome of ["complete", "reject"] as const) {
    const context = await browser.newContext({ acceptDownloads: true });
    const page = await context.newPage();
    page.on("pageerror", error => report.errors.push(error.message));
    await page.goto(`${base}/pdf/${encodeShareState(request)}?qr=0`, { waitUntil: "networkidle" });
    await page.locator('main[data-utility-state="ready"]').waitFor();
    let release!: () => void, heldResolve!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; }), held = new Promise<void>(resolve => { heldResolve = resolve; });
    await context.route("**/_next/static/chunks/**", async route => {
      const response = await route.fetch(), body = await response.text();
      if (body.includes("Puzzle data is invalid for PDF generation.")) {
        heldResolve(); await gate;
        if (outcome === "reject") { await route.abort("failed"); return; }
      }
      await route.fulfill({ response, body });
    });
    let downloads = 0; page.on("download", () => downloads++);
    await page.getByRole("button", { name: "Download this PDF", exact: true }).click();
    let timeout: ReturnType<typeof setTimeout> | undefined;
    try { await Promise.race([held, new Promise((_, reject) => { timeout = setTimeout(() => reject(new Error("Expected PDF renderer chunk was not held")), 10000); })]); }
    finally { clearTimeout(timeout); }
    await page.locator('.site-header a[href="/"]').first().click();
    await page.waitForURL(`${base}/`);
    await page.locator("main[data-utility-state]").waitFor({ state: "detached" });
    release();
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    assert.equal(downloads, 0, `utility PDF ${outcome}: unmounted output must not download`);
    // Next's empty route announcer is itself role=alert; reject only stale
    // output errors, not the framework's legitimate navigation announcement.
    assert.equal(await page.getByRole("alert").filter({ hasText: /PDF failed|PDF could not|Loading chunk|ChunkLoadError/ }).count(), 0);
    report.utilityPdf.push(`unmount-${outcome}`); await context.close();
  }
  {
    const context = await browser.newContext({ acceptDownloads: true });
    await context.route("https://pagead2.googlesyndication.com/**", route => route.fulfill({ contentType: "application/javascript", body: "" }));
    await context.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.toBlob;
      HTMLCanvasElement.prototype.toBlob = function (callback) {
        HTMLCanvasElement.prototype.toBlob = original;
        window.__rejectOldPng = () => callback(null);
      };
    });
    const page = await context.newPage();
    page.on("pageerror", error => report.errors.push(error.message));
    await page.goto(`${base}/word-search-generator?state=${encodeShareState(request)}`, { waitUntil: "networkidle" });
    let downloads = 0; page.on("download", () => downloads++);
    await page.getByRole("button", { name: "PNG grid", exact: true }).click();
    await page.waitForFunction(() => typeof window.__rejectOldPng === "function");
    await page.locator(".preview-toolbar-actions").getByRole("button", { name: "Download PDF", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "Download PDF", exact: true });
    await dialog.getByRole("combobox", { name: "Printed letter case", exact: true }).selectOption("lowercase");
    await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
    assert.match(await page.locator(".builder-preview .puzzle-token").first().textContent() ?? "", /^[a-z]$/);
    await page.evaluate(() => window.__rejectOldPng!());
    await page.getByRole("button", { name: "PNG grid", exact: true }).waitFor();
    assert.equal(await page.getByRole("status").filter({ hasText: "PNG export failed" }).count(), 0, "prior-style rejection must not replace the current preview status");
    assert.equal(downloads, 0);
    const pending = page.waitForEvent("download"); await page.getByRole("button", { name: "PNG grid", exact: true }).click();
    const bytes = await readFile((await (await pending).path())!);
    assert.equal(bytes.subarray(1, 4).toString(), "PNG", "current style still downloads successfully");
    await page.evaluate(() => { HTMLCanvasElement.prototype.toBlob = function (callback) { callback(null); }; });
    await page.getByRole("button", { name: "PNG grid", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "PNG export failed" }).waitFor();
    report.png.push("prior-style rejection canceled; current-style retry succeeds; current failure remains actionable");
    await context.close();
  }
  assert.deepEqual(report.errors, []);
  await writeFile(join(output, "report.json"), JSON.stringify(report, null, 2));
  console.log(`PASS ${report.html.length} delayed HTML cases, ${report.utilityPdf.length} static-PDF unmount cases and PNG style-rejection recovery; current lowercase clue HTML, useful current errors, no late files/status or leaked frames.`);
} finally { await browser.close(); }
