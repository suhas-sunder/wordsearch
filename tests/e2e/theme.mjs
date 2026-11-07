import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.BASE_URL ?? "http://localhost:3264";
const browser = await chromium.launch({ headless: true });
if (process.env.THEME_VISUAL_OUTPUT) await mkdir(process.env.THEME_VISUAL_OUTPUT, { recursive: true });
try {
  for (const width of [320, 390, 768, 1024, 1280, 1440, 1600]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: "dark" });
    await context.route("https://pagead2.googlesyndication.com/**", (route) => route.fulfill({ contentType: "application/javascript", body: "" }));
    const page = await context.newPage();
    const errors = []; page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base, { waitUntil: "networkidle" });
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    const toggle = page.getByRole("button", { name: /^Theme:/ });
    await toggle.click(); // System -> light.
    assert.equal(await page.locator("html").getAttribute("data-theme"), "light");
    await toggle.click(); // Light -> dark.
    assert.equal(await page.evaluate(() => localStorage.getItem("ilws-theme")), "dark");
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    await page.emulateMedia({ colorScheme: "light" });
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark", "explicit theme overrides device");
    await toggle.click(); // Dark -> system, device now light.
    assert.equal(await page.locator("html").getAttribute("data-theme"), "light");
    await page.emulateMedia({ colorScheme: "dark" });
    await page.waitForFunction(() => document.documentElement.dataset.theme === "dark");
    for (const path of ["/", "/word-search-generator", "/categories", "/collections/hard-printable-word-searches", "/search?q=food", "/about", "/pack-builder"]) {
      await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${path} overflow at ${width}`);
      const axe = await new AxeBuilder({ page }).analyze();
      assert.deepEqual(axe.violations.filter((issue) => ["serious", "critical"].includes(issue.impact)), [], `${path} dark accessibility at ${width}`);
      if (process.env.THEME_VISUAL_OUTPUT && [390, 1440].includes(width) && ["/", "/word-search-generator"].includes(path)) await page.screenshot({ path: `${process.env.THEME_VISUAL_OUTPUT}/dark-${path === "/" ? "home" : "generator"}-${width}.png`, fullPage: true });
      if (path === "/word-search-generator") {
        const paper = page.locator(".print-sheet").first();
        await paper.waitFor();
        assert.equal(await paper.evaluate((el) => getComputedStyle(el).backgroundColor), "rgb(255, 255, 255)");
        await page.emulateMedia({ media: "print" });
        assert.equal(await page.locator("body").evaluate((el) => getComputedStyle(el).color), "rgb(23, 32, 51)");
        assert.equal(await paper.evaluate((el) => getComputedStyle(el).backgroundColor), "rgb(255, 255, 255)");
        await page.emulateMedia({ media: "screen" });
        if ([390, 1440].includes(width)) {
          for (const [action, title] of [["Share", "Share this puzzle"], ["Print this puzzle", "Print puzzle"], ["Download PDF", "Download PDF"]]) {
            await page.locator(".preview-toolbar-actions").getByRole("button", { name: action, exact: true }).click();
            await page.getByRole("dialog", { name: title, exact: true }).waitFor();
            const dialogAxe = await new AxeBuilder({ page }).include("dialog[open]").analyze();
            assert.deepEqual(dialogAxe.violations.filter((issue) => ["serious", "critical"].includes(issue.impact)), [], `${title} dark accessibility at ${width}`);
            await page.keyboard.press("Escape");
          }
        }
      }
    }
    await page.locator('header summary[aria-label="More: open navigation menu"]').click();
    const menuAxe = await new AxeBuilder({ page }).include("header").analyze();
    assert.deepEqual(menuAxe.violations.filter((issue) => ["serious", "critical"].includes(issue.impact)), []);
    assert.deepEqual(errors, []);
    await context.close();
  }
  const noScript = await browser.newPage({ javaScriptEnabled: false, colorScheme: "dark" });
  await noScript.goto(base);
  const unavailableToggle = noScript.getByRole("button", { name: "Theme selection requires JavaScript. Without it, your device preference is used.", exact: true });
  assert.equal(await unavailableToggle.isDisabled(), true, "no-JS theme control explains its inactive state");
  assert.equal(await noScript.locator("html").evaluate((el) => getComputedStyle(el).colorScheme), "dark", "no-JS device preference");
  await noScript.emulateMedia({ media: "print" });
  assert.equal(await noScript.locator("html").evaluate((el) => getComputedStyle(el).colorScheme), "light", "no-JS print remains light");
  await noScript.close();
  const restricted = await browser.newPage({ colorScheme: "light" });
  await restricted.addInitScript(() => { Object.defineProperty(window, "localStorage", { get() { throw new Error("blocked"); } }); });
  await restricted.goto(base, { waitUntil: "networkidle" });
  await restricted.getByRole("button", { name: /^Theme:/ }).click();
  await restricted.getByRole("button", { name: /^Theme:/ }).click();
  assert.equal(await restricted.locator("html").getAttribute("data-theme"), "dark");
  await restricted.close();
} finally { await browser.close(); }
console.log("PASS theme persistence/device override/system changes, blocked storage, no-JS, seven widths, dark axe and light print paper");
