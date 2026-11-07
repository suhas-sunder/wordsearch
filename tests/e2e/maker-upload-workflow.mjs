import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.env.BASE_URL ?? "http://127.0.0.1:3504";
const output = process.env.EXCELLENCE_OUTPUT;
if (output) await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const results = [];
try {
  for (const [width, theme] of [[390, "light"], [320, "dark"], [1280, "light"]]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme, reducedMotion: "reduce" });
    await context.route("https://pagead2.googlesyndication.com/**", (route) => route.fulfill({ contentType: "application/javascript", body: "" }));
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(() => {
      window.fileReads = [];
      File.prototype.text = function () {
        return new Promise((resolve, reject) => window.fileReads.push({ name: this.name, resolve, reject }));
      };
    });
    await page.goto(`${base}/word-search-generator`);
    const words = page.getByRole("textbox", { name: "Words and clues", exact: true });
    const file = page.locator(".builder-surface input[type=file]");
    await words.fill("CAT\nDOG");
    await page.locator(".builder-preview .puzzle-svg").waitFor();
    if (width < 981) {
      await page.getByRole("button", { name: "Edit words and settings", exact: true }).click();
      assert.equal(await page.locator(".builder-controls").evaluate((element) => element === document.activeElement), true);
      const top = await words.evaluate((element) => element.getBoundingClientRect().top);
      assert.ok(top >= 0 && top < 400, `Words reachable directly at ${width}px`);
      await page.keyboard.press("Tab");
      assert.equal(await page.getByRole("textbox", { name: "Puzzle title", exact: true }).evaluate((element) => element === document.activeElement), true);
      if (output) await page.screenshot({ path: `${output}/maker-edit-${width}-${theme}.png` });
      await page.getByRole("button", { name: "Preview and print", exact: true }).click();
      assert.equal(await page.locator(".builder-preview").evaluate((element) => element === document.activeElement), true);
      assert.ok(await page.getByRole("button", { name: "Download PDF", exact: true }).first().isVisible());
    } else assert.equal(await page.locator(".builder-shortcuts").isVisible(), false);

    const upload = async (name, index) => {
      await file.setInputFiles({ name, mimeType: "text/plain", buffer: Buffer.from("OWL\nFOX") });
      await page.waitForFunction((count) => window.fileReads.length === count, index + 1);
    };
    await upload("delayed.txt", 0);
    await words.fill("HORSE\nSHEEP");
    await page.evaluate(() => window.fileReads[0].resolve("OWL\nFOX"));
    await page.getByRole("status").filter({ hasText: "Your edits were kept." }).waitFor();
    assert.equal(await words.inputValue(), "HORSE\nSHEEP", "late upload cannot overwrite newer edits");

    await upload("older.txt", 1);
    await upload("newer.txt", 2);
    await page.evaluate(() => window.fileReads[2].resolve("TIGER\nLION"));
    await page.waitForFunction(() => document.querySelector(".builder-controls textarea").value === "TIGER\nLION");
    await page.evaluate(() => window.fileReads[1].resolve("OWL\nFOX"));
    await page.waitForTimeout(300);
    assert.equal(await words.inputValue(), "TIGER\nLION", "older file cannot replace the latest upload");

    await upload("retry.txt", 3);
    await page.evaluate(() => window.fileReads[3].reject(new Error("read failure")));
    await page.getByRole("status").filter({ hasText: "Your words were kept. Try uploading it again." }).waitFor();
    assert.equal(await words.inputValue(), "TIGER\nLION");
    assert.equal(await page.locator(".builder-preview [role=alert]").count(), 0, "read failure leaves a valid puzzle usable");
    await upload("retry.txt", 4);
    await page.evaluate(() => window.fileReads[4].resolve("OWL\nFOX"));
    await page.getByRole("status").filter({ hasText: "Word list loaded." }).waitFor();
    assert.equal(await words.inputValue(), "OWL\nFOX", "same file can be selected again after failure");

    await upload("settings.txt", 5);
    await page.getByRole("button", { name: "hard", exact: true }).click();
    await page.evaluate(() => window.fileReads[5].resolve("UNWANTED"));
    await page.getByRole("status").filter({ hasText: "Your edits were kept." }).waitFor();
    assert.equal(await words.inputValue(), "OWL\nFOX", "settings changes cancel stale uploads too");
    assert.equal(await page.getByRole("button", { name: "hard", exact: true }).getAttribute("aria-pressed"), "true");
    assert.equal(await page.getByRole("button", { name: "medium", exact: true }).getAttribute("aria-pressed"), "false");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.emulateMedia({ media: "print" });
    assert.equal(await page.locator(".builder-shortcuts").isVisible(), false, "maker navigation is excluded from printing");
    assert.equal(await page.locator(".builder-controls").isVisible(), false);
    await page.emulateMedia({ media: "screen" });
    assert.deepEqual(errors, []);
    results.push({ width, theme, uploadCases: 5, mobileNavigation: width < 981, errors });
    await context.close();
  }
  if (output) await writeFile(`${output}/result.json`, `${JSON.stringify({ base, node: process.version, results }, null, 2)}\n`);
  console.log("Maker workflow: edit-preserving uploads, ordering, same-file retry, settings, focus and mobile shortcuts passed.");
} finally { await browser.close(); }
