import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";
import { chromium } from "playwright";

const baseline = process.env.BASELINE_URL ?? "http://127.0.0.1:3394";
const candidate = process.env.BASE_URL ?? "http://127.0.0.1:3272";
const candidateSourceSha = process.env.UTILITY_SOURCE_SHA ?? null;
const baselineSourceSha = process.env.UTILITY_BASELINE_SHA ?? null;
for (const sha of [candidateSourceSha, baselineSourceSha]) if (sha) assert.match(sha, /^[a-f0-9]{40}$/, "Source provenance must use a full commit SHA");
const output = process.env.UTILITY_LAYOUT_OUTPUT;
assert.ok(output, "UTILITY_LAYOUT_OUTPUT must identify an outside-repository evidence directory");
const outputRelative = relative(process.cwd(), resolve(output));
assert.ok(outputRelative.startsWith("..") || isAbsolute(outputRelative), "Keep utility evidence outside the repository");
await mkdir(output, { recursive: true });
const kinds = ["play", "print", "pdf", "answer-key", "embed", "custom"];
const profiles = [["square", 8, 8], ["rectangular", 8, 14], ["extreme-wide", 6, 40], ["extreme-tall", 40, 6]];
const longGridHint = "This long grid fits one sheet using small letters. Choose fewer rows or columns for larger type.";
const makerLabel = "Edit or save in maker";
const cases = profiles.map(([name, rows, cols]) => {
  const request = { title: "UI review", wordsText: "CAT\nDOG", seed: "ui-review", alphabetPack: "latin", directions: ["E"], rows, cols, autoSize: false };
  const json = JSON.stringify(request);
  return { name, encoded: Buffer.from(json).toString("base64url"), requestSha256: createHash("sha256").update(json).digest("hex"), cells: rows * cols };
});
cases.push({ name: "invalid", encoded: "invalid-state", requestSha256: createHash("sha256").update("invalid-state").digest("hex"), cells: 0 });
const report = { baseline, candidate, baselineSourceSha, candidateSourceSha, generatedAt: new Date().toISOString(), comparisons: [], loading: [], limitations: ["Desktop Chromium, no physical device/provider assertion", "Source SHAs are operator assertions, not automatic server attestation", "Footer reveal is scoped to the pending raw utility; ready and invalid states restore it without a timer", "Request and grid hashes are recorded separately from the existing published puzzle fingerprint suite"] };
const save = () => writeFile(`${output}/measurements.json`, `${JSON.stringify(report, null, 2)}\n`);
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [390, 1440]) {
    for (const kind of kinds) {
      for (const fixture of cases) {
        const repeats = fixture.name === "square" ? 3 : 1;
        for (let trial = 1; trial <= repeats; trial++) {
          const result = { width, kind, profile: fixture.name, requestSha256: fixture.requestSha256, path: `/${kind}/${fixture.encoded}`, trial, samples: [] };
          for (const [label, base] of [["before", baseline], ["after", candidate]]) {
            const context = await browser.newContext({ viewport: { width, height: 900 } });
            const page = await context.newPage();
            const errors = []; page.on("pageerror", (error) => errors.push(error.message));
            await page.addInitScript(() => {
              window.__utilityCls = 0;
              new PerformanceObserver((list) => list.getEntries().forEach((entry) => { if (!entry.hadRecentInput) window.__utilityCls += entry.value; })).observe({ type: "layout-shift", buffered: true });
            });
            const response = await page.goto(`${base}${result.path}`, { waitUntil: "networkidle" });
            assert.ok((response.headers()["x-robots-tag"] ?? "").includes("noindex"));
            await page.locator(`[data-utility-state="${fixture.cells ? "ready" : "invalid"}"]`).waitFor();
            await page.evaluate(() => document.fonts.ready);
            if (label === "after" && fixture.cells && ["print", "pdf", "answer-key"].includes(kind)) await page.waitForFunction(() => { const guards = [...document.querySelectorAll(".print-fit-status")]; return guards.length > 0 && guards.every((node) => node.dataset.fitState === "ready"); });
            const tokens = await page.locator(kind === "play" || kind === "custom" ? ".solver-grid [data-solver-cell]" : ".puzzle-svg .puzzle-token").allTextContents();
            assert.equal(tokens.length, fixture.cells);
            assert.equal(await page.locator("[data-ad-placement]").count(), 0);
            assert.deepEqual(errors, []);
            const sample = await page.evaluate(({ hint, makerLabel }) => ({ cls: window.__utilityCls, text: document.querySelector("main").innerText, footerVisibility: getComputedStyle(document.querySelector(".site-footer")).visibility, pendingMarker: document.documentElement.dataset.ilwsUtilityPending ?? null, overflow: document.documentElement.scrollWidth > innerWidth + 1,
              longGridHints: [...document.querySelectorAll("main .static-utility-controls p")].filter((node) => node.textContent.trim() === hint).length,
              largerGridLabels: [...document.querySelectorAll("main .output-preview-toolbar label")].filter((node) => node.textContent.trim() === "Larger grid type").length,
              printFitStates: [...document.querySelectorAll(".print-fit-status")].map((node) => node.dataset.fitState),
              makerLinks: [...document.querySelectorAll("main a")].filter((node) => node.textContent.trim() === makerLabel).map((node) => node.getAttribute("href")),
              qrStatuses: [...document.querySelectorAll("main .static-utility-controls [data-qr-readiness]")].map((node) => ({ state: node.dataset.qrReadiness, text: node.innerText, label: node.querySelector("span")?.textContent, href: node.querySelector("a")?.getAttribute("href") }))
            }), { hint: longGridHint, makerLabel });
            sample.label = label;
            sample.gridSha256 = createHash("sha256").update(JSON.stringify(tokens)).digest("hex");
            result.samples.push(sample);
            if (trial === 1 && ["square", "extreme-wide", "invalid"].includes(fixture.name)) await page.screenshot({ path: `${output}/${label}-${kind}-${fixture.name}-${width}.png` });
            await context.close();
          }
          report.comparisons.push(result);
          await save();
          const [before, after] = result.samples;
          assert.equal(after.gridSha256, before.gridSha256, "exact seeded grid preserved");
          const expectedHint = fixture.cells && ["print", "pdf", "answer-key"].includes(kind) && fixture.name.startsWith("extreme-") ? 1 : 0;
          assert.equal(after.longGridHints, expectedHint, "only actual long print grids receive the precise small-type disclosure");
          const expectedLargerLabel = fixture.cells && ["play", "custom"].includes(kind) ? 1 : 0;
          assert.equal(after.largerGridLabels, expectedLargerLabel, "ordinary preview label accurately describes larger grid type");
          assert.equal(before.makerLinks.length, 0, "historical baseline has no PR64 maker action");
          assert.equal(after.makerLinks.length, expectedLargerLabel, "only valid solver modes gain the exact PR64 maker action");
          if (expectedLargerLabel) {
            const href = new URL(after.makerLinks[0], candidate);
            assert.equal(href.origin, new URL(candidate).origin);
            assert.equal(href.pathname, "/word-search-generator");
            assert.deepEqual([...href.searchParams.keys()], ["state"]);
            assert.equal(href.hash, "");
            const state = JSON.parse(Buffer.from(href.searchParams.get("state"), "base64url").toString("utf8"));
            const original = JSON.parse(Buffer.from(fixture.encoded, "base64url").toString("utf8"));
            for (const [key, value] of Object.entries(original)) assert.deepEqual(state[key], value, `maker action preserves original ${key}`);
            after.makerRequestFieldsVerified = Object.keys(original);
          }
          const expectedQrStatus = fixture.cells && ["print", "pdf", "answer-key"].includes(kind) ? 1 : 0;
          assert.equal(before.qrStatuses.length, 0, "historical baseline has no persistent QR readiness row");
          assert.equal(after.qrStatuses.length, expectedQrStatus, "only valid QR print modes gain one useful readiness/recovery row");
          let qrStatusText = "";
          if (expectedQrStatus) {
            const status = after.qrStatuses[0];
            assert.equal(status.state, "ready");
            assert.equal(status.label, "QR code ready.");
            assert.equal(status.text.replace(/\s+/g, " ").trim(), "QR code ready. Print without a QR code");
            const recovery = new URL(status.href, new URL(result.path, candidate));
            assert.equal(recovery.origin, new URL(candidate).origin);
            assert.equal(recovery.pathname, result.path);
            assert.equal(recovery.hash, "");
            assert.deepEqual(Object.fromEntries(recovery.searchParams), { paper: "letter", orientation: "portrait", scale: "standard", answers: "0", nameDate: "1", instructions: "1", wordBank: "below", qr: "0", coordinates: "0", ink: "0" }, "No-QR recovery preserves every original output choice and changes only QR");
            qrStatusText = status.text;
          }
          const normalizedBefore = before.text.replace(/\s+/g, " ").trim();
          const normalizedAfter = after.text.replace(qrStatusText, "").replace(longGridHint, "").replace(makerLabel, "").replaceAll("Larger grid type", "Large print").replace(/\s+/g, " ").trim();
          assert.equal(normalizedAfter, normalizedBefore, "all other visible utility words/order preserved after the four explicitly asserted amendments");
          assert.equal(after.footerVisibility, "visible", "ready/error footer is immediately restored");
          assert.equal(after.pendingMarker, null);
          assert.equal(after.overflow, false);
          assert.ok(after.cls <= before.cls + 0.01, `new CLS ${kind}/${fixture.name}/${width}: ${before.cls} -> ${after.cls}`);
          console.log(JSON.stringify({ kind, profile: fixture.name, width, trial, beforeCls: before.cls, afterCls: after.cls }));
        }
      }
    }
  }
  for (const invalid of [false, true]) {
    const context = await browser.newContext({ viewport: { width: 390, height: 900 } });
    const page = await context.newPage();
    let release;
    const gate = new Promise((resolve) => { release = resolve; });
    await page.route(/\/_next\/static\/.*\.js(?:\?.*)?$/, async (route) => { await gate; await route.continue(); });
    await page.goto(`${candidate}/pdf/${invalid ? "invalid-state" : cases[0].encoded}`, { waitUntil: "commit" });
    await page.locator('[data-utility-state="loading"]').waitFor();
    await page.locator(".site-footer").waitFor({ state: "attached" });
    assert.equal(await page.locator(".site-footer").evaluate((el) => getComputedStyle(el).visibility), "hidden");
    assert.equal(await page.locator("main .static-utility-controls button:not(:disabled)").count(), 0);
    assert.equal(await page.locator(".puzzle-svg, .solver-grid, .print-sheet, [data-utility-state=ready]").count(), 0, "neutral pending preview is never a fallback puzzle");
    await page.screenshot({ path: `${output}/pending-${invalid ? "invalid" : "valid"}-390.png` });
    await page.emulateMedia({ media: "print" });
    assert.equal(await page.getByText("Please wait for the puzzle link to be checked before printing.", { exact: true }).isVisible(), true);
    await page.emulateMedia({ media: "screen" });
    release();
    await page.locator(`[data-utility-state="${invalid ? "invalid" : "ready"}"]`).waitFor();
    assert.equal(await page.locator(".site-footer").evaluate((el) => getComputedStyle(el).visibility), "visible");
    report.loading.push({ invalid, withheldOnlyPending: true, activeOutputWhilePending: false, fallbackGridWhilePending: false });
    await save();
    await context.close();
  }
  const noScript = await browser.newPage({ javaScriptEnabled: false });
  await noScript.goto(`${candidate}/pdf/${cases[0].encoded}`);
  const warning = noScript.getByRole("heading", { name: "JavaScript is required for a shared puzzle", exact: true });
  assert.equal(await warning.isVisible(), true);
  assert.ok((await warning.boundingBox()).y < 400, "no-JS requirement and recovery are not buried below a permanent loading preview");
  assert.equal(await noScript.locator(".site-footer").evaluate((el) => getComputedStyle(el).visibility), "visible");
  assert.ok(await noScript.locator('main a[href="/topics"]').count() > 0);
  assert.equal(await noScript.locator("main button:not(:disabled)").count(), 0);
  await noScript.close();
} finally { await browser.close(); }
await save();
console.log(`PASS ${report.comparisons.length} paired utility measurements, exact request/grid hashes, all six kinds, square/rectangular/extremes/invalid, pending fail-closed output and no-JS recovery`);
