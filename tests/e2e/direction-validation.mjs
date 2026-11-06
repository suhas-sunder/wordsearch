import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const encode = (state) => Buffer.from(JSON.stringify(state)).toString("base64url");
const fixture = { title: "Direction regression", seed: "ws-a01", wordsText: "cat\ndog\nbird", directions: ["E"] };
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [390, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${baseUrl}/word-search-generator?state=${encode(fixture)}`, { waitUntil: "networkidle" });
    const east = page.getByRole("button", { name: "Toggle E direction", exact: true });
    await east.waitFor();
    const grid = () => page.locator(".builder-preview .puzzle-token").allTextContents();
    const original = await grid();
    // This fails on main: the final selection is removed while the preview uses presets.
    await east.click({ force: true });
    assert.match(await east.getAttribute("class"), /active/, "last direction must remain selected");
    assert.equal(await east.getAttribute("aria-pressed"), "true");
    assert.equal(await east.getAttribute("aria-disabled"), "true");
    assert.match(await page.locator(`#${await east.getAttribute("aria-describedby")}`).textContent(), /at least one direction/i);
    await east.focus();
    await page.keyboard.press("Space");
    assert.equal(await east.getAttribute("aria-pressed"), "true");
    assert.deepEqual(await grid(), original);

    const keys = ["W", "S", "N", "SE", "SW", "NE", "NW"];
    for (const key of keys) await page.getByRole("button", { name: `Toggle ${key} direction`, exact: true }).click();
    assert.equal(await page.locator('.direction-grid [aria-pressed="true"]').count(), 8);
    for (let cycle = 0; cycle < 3; cycle++) {
      for (const key of keys) await page.getByRole("button", { name: `Toggle ${key} direction`, exact: true }).click();
      assert.equal(await page.locator('.direction-grid [aria-pressed="true"]').count(), 1);
      await east.focus();
      await page.keyboard.press("Enter");
      assert.equal(await east.getAttribute("aria-pressed"), "true");
      for (const key of keys) await page.getByRole("button", { name: `Toggle ${key} direction`, exact: true }).click();
    }
    await page.waitForTimeout(350);
    await page.getByRole("button", { name: "Share", exact: true }).first().click();
    const dialog = page.getByRole("dialog", { name: "Share this puzzle" });
    const url = await dialog.locator("input").inputValue();
    const shared = JSON.parse(Buffer.from(new URL(url).pathname.split("/").at(-1), "base64url").toString());
    assert.equal(shared.directions.length, 8);
    await page.keyboard.press("Escape");
    const allGrid = await grid();
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.locator('.direction-grid [aria-pressed="true"]').count(), 1, "URL state wins on reload");
    await page.goto(`${baseUrl}${new URL(url).pathname}`, { waitUntil: "networkidle" });
    await page.locator('[data-utility-state="ready"]').waitFor();
    assert.deepEqual(await page.locator("[data-solver-cell] > span").allTextContents(), allGrid);

    // Local state persists without URL state and valid one-direction links replay exactly.
    await page.goto(`${baseUrl}/word-search-generator`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "easy", exact: true }).click();
    await page.getByRole("button", { name: "Toggle S direction", exact: true }).click();
    await page.waitForFunction(() => JSON.parse(localStorage.getItem("ilws:last-builder-state") ?? "{}").directions?.join() === "E");
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.locator('.direction-grid [aria-pressed="true"]').count(), 1);
    await page.getByRole("button", { name: "hard", exact: true }).click();
    await page.waitForFunction(() => JSON.parse(localStorage.getItem("ilws:last-builder-state") ?? "{}").directions?.length === 8);
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.locator('.direction-grid [aria-pressed="true"]').count(), 8);
    await page.goto(`${baseUrl}/play/${encode(fixture)}`, { waitUntil: "networkidle" });
    await page.locator('[data-utility-state="ready"]').waitFor();
    assert.deepEqual(await page.locator("[data-solver-cell] > span").allTextContents(), original);

    const omitted = { ...fixture };
    delete omitted.directions;
    await page.goto(`${baseUrl}/word-search-generator?state=${encode(omitted)}`, { waitUntil: "networkidle" });
    assert.equal(await page.locator('.direction-grid [aria-pressed="true"]').count(), 4);
    const omittedGrid = await grid();
    await page.goto(`${baseUrl}/play/${encode(omitted)}`, { waitUntil: "networkidle" });
    await page.locator('[data-utility-state="ready"]').waitFor();
    assert.deepEqual(await page.locator("[data-solver-cell] > span").allTextContents(), omittedGrid);
    for (const kind of ["print", "pdf", "answer-key", "embed"]) {
      await page.goto(`${baseUrl}/${kind}/${encode(shared)}`, { waitUntil: "networkidle" });
      await page.locator('[data-utility-state="ready"]').waitFor();
      assert.deepEqual(await page.locator(".puzzle-svg").first().locator(".puzzle-token").allTextContents(), allGrid);
    }

    await page.addInitScript(() => {
      window.__invalidPuzzleRendered = false;
      new MutationObserver(() => {
        if (document.querySelector(".builder-preview .puzzle-svg")) window.__invalidPuzzleRendered = true;
      }).observe(document, { childList: true, subtree: true });
    });
    for (const directions of [[], null, "E", {}, ["E", "BAD"], ["constructor"]]) {
      const state = encode({ ...fixture, directions });
      await page.goto(`${baseUrl}/word-search-generator?state=${state}`, { waitUntil: "networkidle" });
      await page.getByRole("alert").filter({ hasText: /direction/i }).waitFor();
      assert.equal(await page.locator(".puzzle-svg, .utility-print-portal").count(), 0);
      assert.equal(await page.evaluate(() => window.__invalidPuzzleRendered), false, "invalid links never flash a fallback preview");
      assert.equal(await page.getByRole("button", { name: "Download PDF", exact: true }).count(), 0);
      await page.getByRole("button", { name: "Use medium preset directions", exact: true }).click();
      await page.locator(".builder-preview .puzzle-svg").waitFor();
      for (const kind of ["play", "print", "pdf", "answer-key", "embed", "custom"]) {
        await page.goto(`${baseUrl}/${kind}/${state}`, { waitUntil: "networkidle" });
        await page.locator('[data-utility-state="invalid"]').waitFor();
        assert.equal(await page.locator(".puzzle-svg").count(), 0);
      }
    }
    await page.goto(`${baseUrl}/word-search-generator`, { waitUntil: "networkidle" });
    await page.evaluate((fixture) => localStorage.setItem("ilws:last-builder-state", JSON.stringify({ ...fixture, directions: [] })), fixture);
    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("alert").filter({ hasText: /direction/i }).waitFor();
    assert.equal(await page.locator(".puzzle-svg, .utility-print-portal").count(), 0);
    assert.deepEqual(errors, []);
    await page.close();
  }
  console.log("PASS direction validation: mobile/desktop, keyboard, repeated toggles, persistence, share replay, invalid builder and all utility routes");
} finally {
  await browser.close();
}
