import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";
import { chromium } from "playwright";

const base = process.env.BASE_URL;
const sourceSha = process.env.UTILITY_SOURCE_SHA;
const output = process.env.UTILITY_SHIFT_OUTPUT;
assert.ok(base && output && /^[a-f0-9]{40}$/.test(sourceSha ?? ""), "Set BASE_URL, UTILITY_SOURCE_SHA and outside-repository UTILITY_SHIFT_OUTPUT");
const local = relative(process.cwd(), resolve(output));
assert.ok(local.startsWith("..") || isAbsolute(local));
await mkdir(output, { recursive: true });
const state = Buffer.from(JSON.stringify({ title: "UI review", wordsText: "CAT\nDOG", seed: "ui-review", alphabetPack: "latin", directions: ["E"], rows: 8, cols: 8, autoSize: false })).toString("base64url");
const report = { sourceSha, base, rows: [], limitations: ["Read-only diagnostic observer; no DOM/style change or observer reset", "QR-off URLs are causal controls, not replacement release measurements", "Trace timestamps/rectangles are laboratory evidence, not field CWV"] };
const browser = await chromium.launch();
try {
  for (const kind of ["print", "pdf", "answer-key"]) for (const qr of [true, false]) {
    const context = await browser.newContext({ viewport: { width: 390, height: 900 } });
    const page = await context.newPage();
    const errors = []; page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(() => {
      const result = { shifts: [], events: [] };
      window.__utilityShiftTrace = result;
      const rect = (box) => box ? { x: box.x, y: box.y, width: box.width, height: box.height } : null;
      const selector = (node) => {
        if (!(node instanceof Element)) return null;
        const parts = [];
        for (let current = node; current && parts.length < 4; current = current.parentElement) {
          if (current.id) { parts.unshift(`#${CSS.escape(current.id)}`); break; }
          let part = current.tagName.toLowerCase();
          part += [...current.classList].slice(0, 2).map((value) => `.${CSS.escape(value)}`).join("");
          if (current.parentElement) part += `:nth-of-type(${[...current.parentElement.children].filter((sibling) => sibling.tagName === current.tagName).indexOf(current) + 1})`;
          parts.unshift(part);
        }
        return parts.join(" > ");
      };
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) result.shifts.push({ t: entry.startTime, value: entry.value, hadRecentInput: entry.hadRecentInput, sources: entry.sources.map((source) => ({ selector: selector(source.node), text: source.node?.textContent?.trim().replace(/\s+/g, " ").slice(0, 140) ?? null, previous: rect(source.previousRect), current: rect(source.currentRect) })) });
      }).observe({ type: "layout-shift", buffered: true });
      let previous;
      let scheduled = false;
      function sample() {
        scheduled = false;
        const value = { state: document.querySelector("main[data-utility-state]")?.dataset.utilityState ?? null,
          qrStatus: [...document.querySelectorAll(".static-utility-controls [role=status]")].map((node) => node.textContent.trim()),
          qrImages: [...document.querySelectorAll(".print-footer img")].map((image) => ({ complete: image.complete, width: image.naturalWidth })),
          qrUnavailable: document.querySelectorAll(".print-qr-unavailable").length,
          guards: [...document.querySelectorAll(".print-fit-status")].map((node) => node.dataset.fitState),
          fonts: document.fonts.status,
          controls: rect(document.querySelector(".static-utility-controls")?.getBoundingClientRect()),
          paper: rect(document.querySelector(".print-sheet")?.getBoundingClientRect()) };
        const serialized = JSON.stringify(value);
        if (serialized !== previous) { result.events.push({ t: performance.now(), ...value }); previous = serialized; }
      }
      function schedule() { if (!scheduled) { scheduled = true; requestAnimationFrame(sample); } }
      new MutationObserver(schedule).observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-fit-state", "data-utility-state", "src", "disabled"] });
      document.addEventListener("DOMContentLoaded", schedule);
      document.addEventListener("load", schedule, true);
      document.fonts.addEventListener("loadingdone", schedule);
      schedule();
    });
    await page.goto(`${base}/${kind}/${state}${qr ? "" : "?qr=0"}`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => { const guards = [...document.querySelectorAll(".print-fit-status")]; return guards.length && guards.every((node) => node.dataset.fitState === "ready"); });
    await page.evaluate(async () => { await document.fonts.ready; await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame); });
    await page.waitForTimeout(250);
    const trace = await page.evaluate(() => window.__utilityShiftTrace);
    assert.deepEqual(errors, []);
    assert.equal(await page.locator(".puzzle-token").count(), 64);
    const cls = trace.shifts.filter(({ hadRecentInput }) => !hadRecentInput).reduce((sum, { value }) => sum + value, 0);
    const screenshot = `${kind}-${qr ? "qr" : "no-qr"}-390.png`;
    await page.screenshot({ path: resolve(output, screenshot), fullPage: true });
    report.rows.push({ kind, qr, cls, errors, ...trace, screenshot });
    await writeFile(resolve(output, "manifest.json"), `${JSON.stringify(report, null, 2)}\n`);
    console.log(JSON.stringify({ kind, qr, cls, shifts: trace.shifts.length, events: trace.events.length }));
    await context.close();
  }
} finally { await browser.close(); }
