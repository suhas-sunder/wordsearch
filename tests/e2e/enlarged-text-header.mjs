import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.env.BASE_URL;
const output = process.env.ENLARGED_TEXT_OUTPUT;
assert.ok(base && output, "Set BASE_URL and external ENLARGED_TEXT_OUTPUT");
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const rows = [];
try {
  for (const width of [320, 390, 768, 1024, 1280, 1600]) for (const theme of ["light", "dark"]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, colorScheme: theme });
    try {
      await page.goto(`${base}/about`, { waitUntil: "networkidle" });
      await page.locator(".theme-toggle:not(:disabled)").waitFor();
      for (const percent of [100, 200]) {
        if (percent === 200) await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
        await page.evaluate(async () => { await document.fonts.ready; await new Promise(requestAnimationFrame); });
        const state = await page.evaluate(() => {
          const controls = [...document.querySelectorAll("header a, header button, header summary")].map((node) => {
            const box = node.getBoundingClientRect();
            return { label: node.getAttribute("aria-label") ?? node.textContent.trim(), x: box.x, right: box.right, y: box.y, bottom: box.bottom, width: box.width, height: box.height, visible: getComputedStyle(node).visibility !== "hidden" && box.width > 0 && box.height > 0 };
          }).filter((node) => node.visible);
          const footer = [...document.querySelectorAll("footer a, footer p, footer h2")].map((node) => {
            const box = node.getBoundingClientRect();
            return { label: node.textContent.trim(), x: box.x, right: box.right };
          });
          return { renderedTheme: document.documentElement.dataset.theme, font: getComputedStyle(document.documentElement).fontSize, overflow: document.documentElement.scrollWidth > innerWidth + 1, controls, footer, headerHeight: document.querySelector("header.site-header").getBoundingClientRect().height };
        });
        assert.equal(state.overflow, false, `${width}/${theme}/${percent} page overflow`);
        assert.equal(state.font, percent === 200 ? "32px" : "16px");
        assert.equal(state.renderedTheme, theme);
        for (const control of state.controls) assert.ok(control.x >= -1 && control.right <= width + 1 && control.y >= -1, `${control.label} onscreen at ${width}/${percent}`);
        for (let a = 0; a < state.controls.length; a++) for (let b = a + 1; b < state.controls.length; b++) {
          const first = state.controls[a], second = state.controls[b];
          assert.ok(Math.min(first.right, second.right) <= Math.max(first.x, second.x) + 1 || Math.min(first.bottom, second.bottom) <= Math.max(first.y, second.y) + 1, `${first.label}/${second.label} overlap`);
        }
        for (const item of state.footer) assert.ok(item.x >= -1 && item.right <= width + 1, `${item.label} footer remains within viewport`);
        const trigger = page.locator('header summary[aria-label="More: open navigation menu"]');
        const visibleLabel = (await trigger.innerText()).trim();
        assert.ok((await trigger.getAttribute("aria-label")).includes("More"), "accessible name retains the visible More label");
        if (visibleLabel) assert.ok((await trigger.getAttribute("aria-label")).toLowerCase().includes(visibleLabel.toLowerCase()), "visible label occurs in accessible name");
        await trigger.focus(); await page.keyboard.press("Enter");
        const panel = page.getByRole("navigation", { name: "All site navigation" });
        assert.equal(await panel.isVisible(), true);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, "open menu also fits");
        await page.keyboard.press("Escape");
        assert.equal(await panel.isVisible(), false);
        assert.equal(await trigger.evaluate((node) => node === document.activeElement), true);
        if (percent === 200) await page.screenshot({ path: `${output}/${width}-${theme}-header.png` });
        const toggle = page.locator(".theme-toggle");
        await toggle.focus(); const label = await toggle.getAttribute("aria-label"); await page.keyboard.press("Enter");
        assert.notEqual(await toggle.getAttribute("aria-label"), label, "keyboard theme control works");
        await page.keyboard.press("Enter"); await page.keyboard.press("Enter");
        assert.equal(await toggle.getAttribute("aria-label"), label, "full keyboard cycle restores original preference");
        assert.equal(await page.locator("html").getAttribute("data-theme"), theme);
        rows.push({ width, theme, percent, ...state });
      }
    } finally { await page.close(); }
  }
  for (const width of [390, 1024]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, javaScriptEnabled: false });
    try {
      page.setDefaultTimeout(20_000);
      await page.goto(`${base}/about`, { timeout: 20_000 });
      // addStyleTag waits for an in-page load callback, which cannot run when
      // scripts are disabled. A synchronous inspector DOM edit simulates the
      // user's text-size preference without enabling application JavaScript.
      await page.evaluate(() => document.documentElement.style.setProperty("font-size", "200%", "important"));
      assert.equal(await page.locator("html").evaluate((node) => getComputedStyle(node).fontSize), "32px");
      await page.locator('header summary[aria-label="More: open navigation menu"]').focus(); await page.keyboard.press("Enter");
      assert.equal(await page.getByRole("navigation", { name: "All site navigation" }).isVisible(), true);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      assert.equal(await page.locator(".theme-toggle").isDisabled(), true);
    } finally { await page.close(); }
  }
  await writeFile(`${output}/header-result.json`, JSON.stringify({ base, method: "actual 16px/32px computed text, keyboard and no-JavaScript checks; not native browser zoom", rows, noJsCases: 2 }, null, 2));
  console.log(`PASS ${rows.length} default/enlarged header/footer views plus 2 no-JavaScript cases`);
} finally { await browser.close(); }
