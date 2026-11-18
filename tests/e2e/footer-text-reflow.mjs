import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.BASE_URL ?? "http://127.0.0.1:3514";
const baseline = process.env.BASELINE_URL ?? "http://127.0.0.1:3510";
const output = process.env.FOOTER_REFLOW_OUTPUT;
assert.ok(output, "Set an outside-repository FOOTER_REFLOW_OUTPUT directory");
await mkdir(output, { recursive: true });
const report = { base, baseline, sourceSha: process.env.FOOTER_REFLOW_SOURCE_SHA ?? null, node: process.version,
  scope: "Actual root-font resizing, per-word DOM Range line checks, keyboard traversal, footer axe and ad geometry. Each origin's actual font faces are loaded and the page reloaded before comparison; existing text glyph widths prove matched used fonts. No runtime font policy change, native browser zoom, physical device, genuine ad rendering or performance claim.", rows: [], failures: [] };
const cases = [];
for (const width of [320, 390, 768, 1024, 1280, 1920]) for (const theme of ["light", "dark"]) for (const scale of [1, 2]) cases.push({ path: "/", width, theme, scale });
for (const path of ["/about", "/word-searches/animals/dog-word-search"]) for (const theme of ["light", "dark"]) for (const scale of [1, 2]) cases.push({ path, width: 1024, theme, scale });

async function inspect(page, url, scale) {
  await page.goto(url, { waitUntil: "networkidle" });
  // font-display: optional may retain a cold-load fallback even after fonts.ready.
  // Warm the real origin's font files, then reload the actual unmodified page.
  await page.evaluate(async () => { await Promise.all([...document.fonts].map((face) => face.load())); });
  let originalRoot;
  const fontReadiness = [];
  const session = await page.context().newCDPSession(page);
  try {
    await session.send("DOM.enable"); await session.send("CSS.enable");
    {
      const response = await page.reload({ waitUntil: "networkidle" });
      assert.equal(response.status(), 200);
      originalRoot = await page.locator("html").evaluate((node) => parseFloat(getComputedStyle(node).fontSize));
      if (scale === 2) await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
      await page.locator(".site-footer").scrollIntoViewIfNeeded();
      await page.evaluate(async () => { void document.body.offsetHeight; await document.fonts.ready; await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame); });
      await page.waitForFunction(({ originalRoot, scale }) => {
        const root = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const link = document.querySelector(".footer-grid > div:nth-child(2) a");
        return Math.abs(root - originalRoot * scale) < 0.1 && Math.abs(parseFloat(getComputedStyle(link).fontSize) - root * 0.9) < 0.1;
      }, { originalRoot, scale });
      const { root } = await session.send("DOM.getDocument");
      const probes = [];
      for (const selector of ["main h1", "main p", ".footer-grid a[href='/word-searches-for-kids']"]) {
        const { nodeId } = await session.send("DOM.querySelector", { nodeId: root.nodeId, selector });
        const { fonts } = await session.send("CSS.getPlatformFontsForNode", { nodeId });
        probes.push({ selector, fonts });
      }
      fontReadiness.push({ probes });
    }
    assert.ok(fontReadiness[0].probes.every((probe) => probe.fonts.length && probe.fonts.every((font) => font.glyphCount > 0)), "platform-font evidence must identify the actually rendered glyphs");
  } finally { await session.detach(); }
  const record = await page.evaluate(({ originalRoot, scale }) => {
    const footer = document.querySelector(".site-footer");
    const rect = (element) => { const b = element.getBoundingClientRect(); return { x: b.x, y: b.y + (element.getClientRects().length ? scrollY : 0), width: b.width, height: b.height }; };
    const words = [];
    const walker = document.createTreeWalker(footer, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.parentElement.closest("a,h2,.brand-wordmark")) continue;
      for (const match of node.textContent.matchAll(/[\p{L}\p{N}]+/gu)) {
        const range = document.createRange();
        range.setStart(node, match.index); range.setEnd(node, match.index + match[0].length);
        const boxes = [...range.getClientRects()].filter((b) => b.width > 0 && b.height > 0);
        words.push({ word: match[0], label: node.parentElement.closest("a,h2,.brand-wordmark").textContent.trim(),
          lines: new Set(boxes.map((b) => Math.round(b.top * 2) / 2)).size,
          boxes: boxes.map((b) => ({ x: b.x, y: b.y + scrollY, width: b.width, height: b.height })) });
      }
    }
    const links = [...footer.querySelectorAll("a")];
    const columns = [...footer.querySelector(".footer-grid").children].map(rect);
    const usedFontProbes = ["main h1", "main p", ".footer-grid a[href='/word-searches-for-kids']"].map((selector) => {
      const element = document.querySelector(selector);
      const probeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      while (probeWalker.nextNode()) {
        const match = /[\p{L}\p{N}]+/u.exec(probeWalker.currentNode.textContent);
        if (!match) continue;
        const range = document.createRange(); range.setStart(probeWalker.currentNode, match.index); range.setEnd(probeWalker.currentNode, match.index + match[0].length);
        const style = getComputedStyle(probeWalker.currentNode.parentElement);
        return { selector, word: match[0], glyphWidth: [...range.getClientRects()].reduce((total, box) => total + box.width, 0), fontFamily: style.fontFamily, fontSize: style.fontSize, fontWeight: style.fontWeight };
      }
      throw new Error(`Missing real text font probe: ${selector}`);
    });
    return { rootFont: parseFloat(getComputedStyle(document.documentElement).fontSize), originalRoot, scale,
      usedFontProbes,
      linkFont: parseFloat(getComputedStyle(footer.querySelector(".footer-grid > div:nth-child(2) a")).fontSize),
      words, splitWords: words.filter((word) => word.lines !== 1), columns,
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      clipped: [...footer.querySelectorAll("a,h2,.brand-wordmark")].filter((node) => node.scrollWidth > node.clientWidth + 1).map((node) => node.textContent.trim()),
      links: links.map((node) => [node.getAttribute("href"), node.textContent.trim()]),
      footerText: footer.textContent,
      title: document.title, mainText: document.querySelector("main")?.textContent,
      metadata: [...document.head.querySelectorAll("meta[name]:not([name='next-size-adjust']),meta[property],link[rel='canonical']")].map((node) => node.outerHTML).sort(),
      structuredData: [...document.querySelectorAll('script[type="application/ld+json"]')].map((node) => node.textContent),
      ads: [...document.querySelectorAll("[data-ad-placement]")].map((node) => ({ placement: node.dataset.adPlacement, template: node.dataset.adTemplate, mode: node.dataset.adMode, rect: rect(node) })),
      footer: rect(footer), adInsideFooter: footer.querySelectorAll("[data-ad-placement]").length };
  }, { originalRoot, scale });
  return { ...record, fontReadiness };
}

const browser = await chromium.launch();
try {
  for (const testCase of cases) {
    const { path, width, theme, scale } = testCase;
    const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: theme, reducedMotion: "reduce" });
    // Standard correctness-fixture mock: never request or click a genuine creative.
    await context.route("https://pagead2.googlesyndication.com/**", (route) => route.fulfill({ contentType: "application/javascript", body: "" }));
    const page = await context.newPage();
    const row = { ...testCase };
    try {
      const takeScreenshot = path === "/" && ((width === 1024 && theme === "dark" && scale === 2) || (width === 1280 && theme === "light" && scale === 1));
      const screenshotName = `${width}-${theme}-text${scale * 100}`;
      let before; let after;
      row.fontPairAttempts = [];
      // A natural optional-font fallback is valid. Exact cross-build geometry is
      // comparable only when actual used faces AND existing glyph widths match.
      // Reload solely for this environment precondition, never for an app failure.
      for (let attempt = 1; attempt <= 5; attempt += 1) {
        before = await inspect(page, `${baseline}${path}`, scale);
        if (takeScreenshot) await page.locator(".site-footer").screenshot({ path: join(output, `before-${screenshotName}-fontpair${attempt}.png`), style: ".site-header, .skip-link { visibility: hidden !important; }" });
        after = await inspect(page, `${base}${path}`, scale);
        const matched = JSON.stringify(before.usedFontProbes) === JSON.stringify(after.usedFontProbes) && JSON.stringify(before.fontReadiness) === JSON.stringify(after.fontReadiness);
        row.fontPairAttempts.push({ attempt, matched, before: { glyphs: before.usedFontProbes, platform: before.fontReadiness }, after: { glyphs: after.usedFontProbes, platform: after.fontReadiness } });
        if (matched) break;
      }
      assert.ok(row.fontPairAttempts.at(-1).matched, "actual used font faces and glyph widths must match before comparing geometry");
      row.beforeSplitWords = before.splitWords; row.beforeFontReadiness = before.fontReadiness; row.after = after;
      assert.ok(after.words.length > 30, "Range checks cover real footer words");
      assert.deepEqual(after.splitWords, [], "ordinary footer words must remain on a single line");
      assert.deepEqual(after.clipped, [], "footer labels must not be clipped");
      assert.equal(after.overflow, false, "no horizontal overflow");
      assert.ok(Math.abs(after.rootFont - after.originalRoot * scale) < 0.1, "actual root-font scale");
      assert.ok(Math.abs(after.linkFont - after.rootFont * 0.9) < 0.1, "link text follows root size without a font cap");
      assert.deepEqual(after.links, before.links, "all crawlable text/link inventory preserved");
      assert.equal(after.footerText, before.footerText, "all footer copy preserved");
      assert.deepEqual(after.usedFontProbes, before.usedFontProbes, "existing text glyph widths prove the same used font faces");
      assert.deepEqual(after.fontReadiness, before.fontReadiness, "platform font identities and rendered glyph counts match");
      assert.equal(after.title, before.title); assert.equal(after.mainText, before.mainText);
      assert.deepEqual(after.metadata, before.metadata); assert.deepEqual(after.structuredData, before.structuredData);
      assert.deepEqual(after.ads, before.ads, "all reserved ad geometry/placement/mode preserved");
      assert.equal(after.adInsideFooter, 0);
      for (const ad of after.ads) if (ad.rect.width && ad.rect.height) assert.ok(ad.rect.y + ad.rect.height <= after.footer.y + 1, "footer does not overlap an advertising region");
      if (width >= 1024 && scale === 1) {
        assert.equal(new Set(after.columns.map((column) => Math.round(column.y))).size, 1, "default desktop keeps five columns");
        assert.ok(after.columns[0].width > after.columns[1].width * 1.4, "brand column retains its wider hierarchy");
      }
      if (width === 1024 && scale === 2) assert.ok(new Set(after.columns.map((column) => Math.round(column.y))).size > 1, "enlarged desktop text reflows into multiple rows");
      const links = page.locator(".site-footer a");
      await links.first().focus();
      for (let index = 0; index < await links.count(); index += 1) {
        if (index) await page.keyboard.press("Tab");
        assert.ok(await links.nth(index).evaluate((node) => document.activeElement === node), "footer keyboard order follows DOM order");
        assert.ok(await links.nth(index).evaluate((node) => { const style = getComputedStyle(node); return style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0; }), "keyboard focus remains visible");
      }
      const axe = await new AxeBuilder({ page }).include(".site-footer").analyze();
      row.axeViolations = axe.violations;
      assert.deepEqual(axe.violations, [], "footer accessibility rules unchanged");
      if (takeScreenshot) await page.locator(".site-footer").screenshot({ path: join(output, `after-${screenshotName}.png`), style: ".site-header, .skip-link { visibility: hidden !important; }" });
      await page.emulateMedia({ media: "print" });
      assert.equal(await page.locator(".site-footer").isVisible(), false, "footer excluded from print");
      row.pass = true;
    } catch (error) {
      row.error = error.stack; report.failures.push({ ...testCase, error: error.message });
      await page.screenshot({ path: join(output, `failure-${report.rows.length + 1}.png`) });
    } finally { report.rows.push(row); await context.close(); }
  }
  await writeFile(join(output, "result.json"), `${JSON.stringify(report, null, 2)}\n`);
  assert.deepEqual(report.failures, [], "footer readability, keyboard, accessibility and preservation");
  console.log(`PASS footer reflow: ${report.rows.length} cases, six widths, both palettes and actual default/200% text; unbroken words, keyboard, axe, print and ad geometry.`);
} finally { await browser.close(); }
