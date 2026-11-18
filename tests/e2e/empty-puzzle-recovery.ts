import assert from "node:assert/strict";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { generatePuzzle } from "../../lib/puzzle/generate";
import { noPlacementsError, noPlayableWordsError } from "../../lib/puzzle/request-validation";

const base = process.env.BASE_URL ?? "http://127.0.0.1:3316";
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [390, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    await context.route("https://pagead2.googlesyndication.com/**", (route) => route.abort());
    const page = await context.newPage(), errors: string[] = []; page.on("pageerror", (error) => errors.push(error.message));
    for (const wordsText of ["", "!!!", "ΕΛΛΑΔΑ", "A".repeat(31)]) {
      const request = { title: "Invalid empty puzzle", wordsText, seed: "empty-recovery" };
      const encoded = Buffer.from(JSON.stringify(request)).toString("base64url");
      await page.goto(`${base}/word-search-generator?state=${encoded}`, { waitUntil: "networkidle" });
      await page.getByRole("alert").filter({ hasText: noPlayableWordsError }).first().waitFor();
      assert.equal(await page.locator(".puzzle-token").count(), 0);
      assert.equal(await page.getByRole("link", { name: "Play", exact: true }).count(), 0);
      assert.equal(await page.getByRole("button", { name: "Grid text", exact: true }).count(), 0);
      const words = page.getByLabel("Words and clues"); assert.equal(await words.inputValue(), wordsText);
      if (wordsText === "!!!") assert.deepEqual((await new AxeBuilder({ page }).include(".builder-surface").analyze()).violations.filter((item) => ["serious", "critical"].includes(item.impact ?? "")), []);
      await words.fill("CAT\nDOG");
      await page.locator(".builder-preview .puzzle-svg").waitFor();
      const expected = generatePuzzle({ ...request, wordsText: "CAT\nDOG" });
      assert.deepEqual(await page.locator(".builder-preview .puzzle-token").allTextContents(), expected.grid.flat());
      await words.fill("!!!");
      await page.getByRole("alert").filter({ hasText: noPlayableWordsError }).first().waitFor();
      assert.equal(await page.getByRole("link", { name: "Play", exact: true }).count(), 0);
      for (const button of await page.getByRole("button", { name: "Download PDF", exact: true }).all()) assert.equal(await button.isDisabled(), true);
      for (const route of ["play", "print", "pdf", "answer-key"]) {
        await page.goto(`${base}/${route}/${encoded}`, { waitUntil: "networkidle" });
        await page.getByRole("heading", { name: "Puzzle needs changes", exact: true }).waitFor();
        const edit = page.getByRole("link", { name: "Edit this puzzle", exact: true });
        assert.equal(await edit.getAttribute("href"), `/word-search-generator?state=${encodeURIComponent(encoded)}`);
        assert.equal(await page.locator(".puzzle-token").count(), 0);
        assert.equal(await page.getByRole("button", { name: "Begin puzzle", exact: true }).count(), 0);
        assert.equal(await page.getByRole("button", { name: "Download PDF", exact: true }).count(), 0);
        if (route === "print") {
          if (wordsText === "!!!") assert.deepEqual((await new AxeBuilder({ page }).include("main[data-utility-state='invalid']").analyze()).violations.filter((item) => ["serious", "critical"].includes(item.impact ?? "")), []);
          await edit.click();
          await page.getByRole("alert").filter({ hasText: noPlayableWordsError }).first().waitFor();
          assert.equal(await page.getByLabel("Words and clues").inputValue(), wordsText);
        }
      }
    }
    const diagonal = { title: "Seed boundary", wordsText: "A".repeat(40), seed: "diagonal-0", rows: 40, cols: 40, autoSize: false, directions: ["SE" as const] };
    await page.goto(`${base}/privacy`, { waitUntil: "networkidle" });
    await page.evaluate((request) => localStorage.setItem("ilws:last-builder-state", JSON.stringify(request)), diagonal);
    await page.goto(`${base}/word-search-generator`, { waitUntil: "networkidle" });
    await page.locator(".builder-preview .puzzle-svg").waitFor();
    assert.deepEqual(await page.locator(".builder-preview .puzzle-token").allTextContents(), generatePuzzle(diagonal).grid.flat());
    await page.getByText("Advanced print and fill controls", { exact: true }).click();
    await page.getByLabel("Puzzle seed", { exact: true }).fill("diagonal-1");
    await page.getByRole("alert").filter({ hasText: noPlacementsError }).first().waitFor();
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("ilws:last-builder-state")!).seed), "diagonal-0");
    assert.equal(await page.getByRole("link", { name: "Play", exact: true }).count(), 0);
    await page.getByLabel("Puzzle seed", { exact: true }).fill("diagonal-0");
    await page.locator(".builder-preview .puzzle-svg").waitFor();
    assert.deepEqual(await page.locator(".builder-preview .puzzle-token").allTextContents(), generatePuzzle(diagonal).grid.flat());
    const missed = Buffer.from(JSON.stringify({ ...diagonal, seed: "diagonal-1" })).toString("base64url");
    for (const route of ["play", "print", "pdf", "answer-key"]) {
      await page.goto(`${base}/${route}/${missed}`, { waitUntil: "networkidle" });
      await page.getByRole("heading", { name: "Puzzle needs changes", exact: true }).waitFor();
      assert.equal(await page.getByRole("link", { name: "Edit this puzzle", exact: true }).getAttribute("href"), `/word-search-generator?state=${encodeURIComponent(missed)}`);
      assert.equal(await page.locator(".puzzle-token").count(), 0);
    }
    await page.goto(`${base}/print/not-a-puzzle`, { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "Puzzle link not found", exact: true }).waitFor();
    assert.equal(await page.getByRole("link", { name: "Edit this puzzle", exact: true }).count(), 0);
    assert.deepEqual(errors, []); await context.close();
  }
} finally { await browser.close(); }
console.log("PASS filler-only definitions fail closed across maker/play/print/PDF/answer routes, stay editable and recover exact valid grids on mobile/desktop");
