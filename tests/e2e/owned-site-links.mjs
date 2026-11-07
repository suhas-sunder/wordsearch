import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.BASE_URL ?? "http://localhost:3296";
const expected = ["https://www.ilovetimers.com/classroom-timer/", "https://www.morsewords.com/morse-code-printable-worksheets", "https://www.ilovecoloringpage.com/"];
for (const path of ["/word-searches-for-teachers", "/word-search-worksheets", "/free-printable-word-searches", "/word-searches-for-kids", "/homeschool-word-searches", "/collections/classroom-word-search-worksheets", "/pack-builder"]) {
  const html = await (await fetch(`${base}${path}`)).text();
  assert.ok(html.includes("data-related-activities"), `${path} has server-rendered activity links`);
  for (const href of expected) assert.ok(html.includes(`href="${href}"`), `${path} includes ${href} without JavaScript`);
}
const browser = await chromium.launch({ headless: true });
try {
  for (const theme of ["light", "dark"]) for (const width of [320, 390, 768, 1024, 1280, 1600]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: theme });
    const page = await context.newPage();
    const unexpected = [];
    page.on("request", (request) => {
      if (/https:\/\/(?:www\.)?(?:ilovetimers|morsewords|ilovecoloringpage|suhassunder|linkedin)\./.test(request.url())) unexpected.push(request.url());
    });
    await page.route("https://pagead2.googlesyndication.com/**", (route) => route.fulfill({ contentType: "application/javascript", body: "" }));
    for (const path of ["/word-searches-for-teachers", "/collections/classroom-word-search-worksheets", "/pack-builder"]) {
      await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
      const section = page.locator("[data-related-activities]");
      await section.scrollIntoViewIfNeeded();
      assert.equal(await section.getByRole("link").count(), 3);
      assert.deepEqual(await section.getByRole("link").evaluateAll((links) => links.map((link) => link.href)), expected);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${path} ${width} ${theme}: no overflow`);
      assert.equal(await section.evaluate((element) => getComputedStyle(element).position), "static");
      const noAdOverlap = await page.evaluate(() => {
        const additions = [...document.querySelectorAll("[data-related-activities] a, nav[aria-label='Creator profiles'] a")];
        const ads = [...document.querySelectorAll("[data-ad-placement]")];
        return additions.every((element) => {
          const a = element.getBoundingClientRect();
          return ads.every((ad) => { const b = ad.getBoundingClientRect(); return !a.width || !a.height || !b.width || !b.height || a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom; });
        });
      });
      assert.equal(noAdOverlap, true, `${path} ${width} ${theme}: additions cannot cover ad slots`);
      const ordering = await page.evaluate(() => {
        const section = document.querySelector("[data-related-activities]");
        return [...document.querySelectorAll("main .faq-list")].every((faq) => Boolean(faq.compareDocumentPosition(section) & Node.DOCUMENT_POSITION_FOLLOWING));
      });
      assert.equal(ordering, true, "activity suggestions follow page FAQs when present");
      for (const link of await section.getByRole("link").all()) {
        await link.focus();
        assert.equal(await link.evaluate((element) => element === document.activeElement && getComputedStyle(element).outlineStyle !== "none"), true);
      }
      const profiles = page.getByRole("navigation", { name: "Creator profiles" });
      assert.equal(await profiles.getByRole("link").count(), 2);
      if (width === 390 || width === 1280) {
        const result = await new AxeBuilder({ page }).include("[data-related-activities]").include("nav[aria-label='Creator profiles']").analyze();
        assert.deepEqual(result.violations.filter(({ impact }) => impact === "serious" || impact === "critical"), []);
      }
      if (process.env.OWNED_LINK_VISUAL_OUTPUT && path === "/word-searches-for-teachers" && [390, 1280].includes(width)) {
        await mkdir(process.env.OWNED_LINK_VISUAL_OUTPUT, { recursive: true });
        await section.screenshot({ path: `${process.env.OWNED_LINK_VISUAL_OUTPUT}/related-${theme}-${width}.png` });
        await profiles.screenshot({ path: `${process.env.OWNED_LINK_VISUAL_OUTPUT}/profiles-${theme}-${width}.png` });
      }
      await page.emulateMedia({ media: "print" });
      assert.equal(await section.isVisible(), false, "optional tools do not print");
      assert.equal(await profiles.isVisible(), false, "creator profiles do not print");
      await page.emulateMedia({ media: "screen" });
    }
    assert.deepEqual(unexpected, [], "rendering links must not contact external destinations");
    await context.close();
  }
  const plain = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  await plain.goto(`${base}/word-searches-for-teachers`);
  assert.equal(await plain.locator("[data-related-activities]").getByRole("link").count(), 3);
  await plain.goto(`${base}/word-searches/animals/dog-word-search`);
  assert.equal(await plain.locator("[data-related-activities]").count(), 0);
  await plain.close();
} finally { await browser.close(); }
console.log("Contextual external links: SSR, six widths, themes, keyboard, axe, print and ad geometry passed.");
