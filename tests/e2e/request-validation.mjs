import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const encode = (state) => Buffer.from(JSON.stringify(state)).toString("base64url");
const fixture = { title: "Input bounds", wordsText: "cat\ndog\nbird", seed: "input-bounds", directions: ["E"], autoSize: false, rows: 12, cols: 12 };
const invalid = [
  { rows: 0 }, { cols: -1 }, { rows: 12.5 }, { rows: 1e9 }, { rows: "12" },
  { alphabetPack: "missing" }, { autoSize: "false" }, { directions: [] },
  { title: "x".repeat(257) }, { wordsText: Array(201).fill("cat").join("\n") },
  { autoSize: undefined, rows: 6, cols: 6, directions: Array(128).fill("E"), wordsText: Array.from({ length: 20 }, (_, i) => "A".repeat(20) + String.fromCharCode(66 + i)).join("\n") }
];
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [390, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(() => {
      window.__fallbackRendered = false;
      new MutationObserver(() => {
        if (document.querySelector(".builder-preview .puzzle-svg")) window.__fallbackRendered = true;
      }).observe(document, { subtree: true, childList: true });
    });
    for (const patch of invalid) {
      await page.goto(`${baseUrl}/word-search-generator?state=${encode({ ...fixture, ...patch })}`, { waitUntil: "domcontentloaded" });
      await page.locator(".builder-surface").getByRole("alert").waitFor();
      assert.equal(await page.locator(".puzzle-svg, .utility-print-portal").count(), 0);
      assert.equal(await page.evaluate(() => window.__fallbackRendered), false);
      assert.equal(await page.getByRole("button", { name: "Download PDF", exact: true }).count(), 0);
    }
    for (const raw of ["broken!", "x".repeat(32_001), encode([])]) {
      const response = await page.goto(`${baseUrl}/word-search-generator?state=${raw}`, { waitUntil: "domcontentloaded" });
      if ([400, 414, 431].includes(response?.status())) {
        assert.equal(await page.locator(".puzzle-svg").count(), 0, "host rejects excessive request lines before application hydration");
        continue;
      }
      await page.locator(".builder-surface").getByRole("alert").waitFor();
      assert.equal(await page.locator(".puzzle-svg").count(), 0);
      await page.getByRole("button", { name: "Restore last valid settings" }).click();
      await page.locator(".builder-preview .puzzle-svg").waitFor();
    }
    // Unsafe values must be rejected consistently by every static utility shell.
    for (const patch of [{ rows: 1e9 }, { alphabetPack: "missing" }, { cols: "12" }]) {
      for (const kind of ["play", "print", "pdf", "answer-key", "embed", "custom"]) {
        await page.goto(`${baseUrl}/${kind}/${encode({ ...fixture, ...patch })}`, { waitUntil: "domcontentloaded" });
        await page.locator('[data-utility-state="invalid"]').waitFor();
        assert.equal(await page.locator(".puzzle-svg, [data-solver-cell]").count(), 0);
      }
    }
    await page.goto(`${baseUrl}/word-search-generator`, { waitUntil: "networkidle" });
    await page.getByLabel("Auto size", { exact: true }).uncheck();
    await page.waitForTimeout(300);
    assert.equal(await page.locator(".builder-surface").getByRole("alert").count(), 0, "turning off auto size initializes both dimensions");
    const previousRows = await page.getByLabel("Rows", { exact: true }).inputValue();
    const rowInput = page.getByLabel("Rows", { exact: true });
    await rowInput.focus();
    await page.keyboard.press("ControlOrMeta+A");
    await page.keyboard.press("Backspace");
    await page.locator(".builder-surface").getByRole("alert").waitFor();
    assert.equal(await rowInput.evaluate((element) => element === document.activeElement), true, "invalid intermediate editing retains focus");
    assert.equal(await rowInput.inputValue(), "");
    await page.keyboard.type("20");
    assert.equal(await page.locator(".puzzle-svg, .utility-print-portal").count(), 0, "old output stays blocked until the valid edit commits");
    await page.locator(".builder-preview .puzzle-svg").waitFor();
    assert.equal(await rowInput.inputValue(), "20");
    await rowInput.fill("");
    await page.getByLabel("Auto size", { exact: true }).check();
    await page.locator(".builder-preview .puzzle-svg").waitFor();
    assert.equal(await page.locator(".builder-surface").getByRole("alert").count(), 0, "auto size recovers a blank dimension");
    await page.getByLabel("Auto size", { exact: true }).uncheck();
    await rowInput.fill(previousRows);
    await page.locator(".builder-preview .puzzle-svg").waitFor();
    await page.getByLabel("Rows", { exact: true }).fill("0");
    await page.locator(".builder-surface").getByRole("alert").waitFor();
    assert.equal(await page.locator(".puzzle-svg, .utility-print-portal").count(), 0);
    assert.equal(await rowInput.isVisible(), true);
    await rowInput.fill(previousRows);
    await page.locator(".builder-preview .puzzle-svg").waitFor();
    assert.equal(await page.getByLabel("Rows", { exact: true }).inputValue(), previousRows);

    // Integration of PR #3 and #9: a difficulty change is an edit; clicking the
    // active difficulty remains a no-op even while a dimension draft is invalid.
    await rowInput.fill("");
    await page.getByRole("button", { name: "medium", exact: true }).click();
    assert.equal(await rowInput.inputValue(), "");
    assert.equal(await page.locator(".builder-controls").count(), 1);
    await page.getByRole("button", { name: "hard", exact: true }).click();
    assert.equal(await rowInput.inputValue(), "");
    assert.equal(await page.locator(".builder-controls").count(), 1);
    await rowInput.fill(previousRows);
    await page.locator(".builder-preview .puzzle-svg").waitFor();
    assert.equal(await page.locator('.direction-grid [aria-pressed="true"]').count(), 8);
    await page.locator('input[type="file"]').setInputFiles({ name: "oversized.txt", mimeType: "text/plain", buffer: Buffer.alloc(64_001, 65) });
    await page.locator(".builder-surface").getByRole("alert").filter({ hasText: /file is too large/i }).waitFor();
    await page.locator('input[type="file"]').setInputFiles({ name: "valid.txt", mimeType: "text/plain", buffer: Buffer.from("cat\ndog") });
    await page.locator(".builder-preview .puzzle-svg").waitFor();
    await page.getByLabel("Words and clues").fill(Array(201).fill("cat").join("\n"));
    await page.locator(".builder-surface").getByRole("alert").waitFor();
    assert.equal(await page.getByLabel("Words and clues").isVisible(), true);
    await page.getByLabel("Words and clues").fill("cat\ndog");
    await page.locator(".builder-preview .puzzle-svg").waitFor();
    await page.evaluate(() => localStorage.setItem("ilws:last-builder-state", JSON.stringify({ rows: 0 })));
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.locator(".builder-surface").getByRole("alert").waitFor();
    assert.equal(await page.evaluate(() => window.__fallbackRendered), false);
    assert.deepEqual(errors, []);
    await context.close();
  }
  console.log("PASS external input bounds: mobile/desktop, no fallback flashes, all utility shells, manual dimensions, upload limits, saved state and explicit recovery");
} catch (error) {
  for (const context of browser.contexts()) for (const page of context.pages()) {
    console.error("Input validation failure state:", page.url(), (await page.locator("body").innerText()).slice(0, 2500));
  }
  throw error;
} finally {
  await browser.close();
}
