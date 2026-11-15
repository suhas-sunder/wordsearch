import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";
import { chromium } from "playwright";

const base = new URL(process.env.BASE_URL ?? "http://127.0.0.1:3520").origin;
const output = process.env.OUTPUT;
if (output) {
  const relativeOutput = relative(process.cwd(), resolve(output));
  assert.ok(isAbsolute(relativeOutput) || relativeOutput.startsWith(".." + sep), "Use an evidence directory outside the worktree");
  await mkdir(output, { recursive: true });
}
const loaderSelector = 'script[data-ilws-adsense-loader], script[src*="/pagead/js/adsbygoogle.js"]';
const guide = "/guides/how-to-print-a-word-search";
const generator = "/word-search-generator";
const specialty = "/specialty/morse-code-word-search-generator";
const searchHeading = "Search Word Searches";

const cases = [
  { name: "footer privacy", source: "/", href: "/privacy", heading: "Privacy Policy", selector: 'footer a[href="/privacy"]' },
  { name: "footer maintainer", source: "/", href: "/about", heading: "About I Love Word Search", selector: 'footer a[href="/about"]', text: "Suhas Sunder" },
  { name: "header help", source: "/", href: "/accessibility", heading: "Accessibility", selector: 'header details a[href="/accessibility"]', openMenu: true },
  { name: "header full search link", source: "/", href: "/search", heading: searchHeading, selector: 'header details a[href="/search"]', openMenu: true },
  { name: "guide author", source: guide, href: "/about", heading: "About I Love Word Search", selector: 'main .guide-attribution a[href="/about"]' },
  { name: "guide methodology", source: guide, href: "/how-word-searches-are-made", heading: "How Our Word Searches Are Made", selector: 'main .intent-panel a[href="/how-word-searches-are-made"]' },
  { name: "guide editorial policy", source: guide, href: "/editorial-policy", heading: "Editorial and Puzzle Standards", selector: 'main .intent-panel a[href="/editorial-policy"]' },
  { name: "indexable puzzle standards", source: "/word-searches/history/ancient-egypt-word-search", href: "/editorial-policy", heading: "Editorial and Puzzle Standards", selector: 'main .standards-link a[href="/editorial-policy"]' },
  { name: "pack tool link", source: generator, href: "/pack-builder", heading: "Word Search Pack Builder", selector: 'main .tools-section a[href="/pack-builder"]' },
  { name: "teacher pack call to action", source: "/word-searches-for-teachers", href: "/pack-builder", heading: "Word Search Pack Builder", selector: 'main .hero-actions a[href="/pack-builder"]' },
  { name: "inline full search submission", source: "/free-printable-word-searches", href: "/search?q=animals", heading: searchHeading, form: "main .tools-section form" },
  { name: "header full search submission", source: "/", href: "/search?q=animals", heading: searchHeading, form: "header details form", openMenu: true },
  { name: "categories full search link", source: "/categories", href: "/search", heading: searchHeading, selector: 'main .intent-panel a[href="/search"]' },
  { name: "hub full search link", source: "/free-printable-word-searches", href: "/search", heading: searchHeading, selector: 'main a[href="/search"]', text: "Search puzzles" },
  { name: "specialty entry", source: generator, href: specialty, heading: "Morse Code Word Search Generator", selector: 'main a[href="' + specialty + '"]' },
  { name: "published SPA control", source: "/", href: "/free-printable-word-searches", heading: "Free Printable Word Searches", selector: 'header [aria-label="Primary navigation"] a[href="/free-printable-word-searches"]', sameDocument: true }
];

const report = {
  base, node: process.version, startedAt: new Date().toISOString(),
  provider: "Inert AdSense script fixture. Measures document identity and app ad markup.",
  cases: []
};
const browser = await chromium.launch();
report.browserVersion = browser.version();

async function documentState(page) {
  return page.evaluate((loaderSelector) => ({
    marker: window.__adDocumentNavigationMarker ?? null,
    timeOrigin: performance.timeOrigin,
    placements: document.querySelectorAll("[data-ad-placement]").length,
    units: document.querySelectorAll("ins.adsbygoogle").length,
    loaders: document.querySelectorAll(loaderSelector).length
  }), loaderSelector);
}

async function trigger(page, scenario) {
  if (scenario.openMenu) await page.locator(".site-header summary").click();
  if (scenario.form) {
    const form = page.locator(scenario.form);
    await form.getByRole("combobox").fill("animals");
    // Suggestions establish this form is hydrated before choosing full submit.
    await form.locator("..").getByRole("option").first().waitFor();
    await form.getByRole("button", { name: "Search", exact: true }).click();
    return;
  }
  const link = page.locator(scenario.selector);
  await (scenario.text ? link.filter({ hasText: scenario.text }) : link).click();
}

try {
  for (const scenario of cases) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await context.route("https://pagead2.googlesyndication.com/**", (route) =>
      route.fulfill({ contentType: "application/javascript", body: "" }));
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    const result = { name: scenario.name, source: scenario.source, destination: scenario.href, expectedSameDocument: Boolean(scenario.sameDocument) };
    try {
      const sourceResponse = await page.goto(new URL(scenario.source, base).href, { waitUntil: "domcontentloaded" });
      assert.equal(sourceResponse?.status(), 200);
      await page.locator(loaderSelector).first().waitFor({ state: "attached" });
      await page.evaluate((marker) => { window.__adDocumentNavigationMarker = marker; }, scenario.name);
      result.before = await documentState(page);
      assert.ok(result.before.placements > 0 && result.before.units > 0 && result.before.loaders > 0, "Source must have the app's live ad markup");
      const destination = new URL(scenario.href, base);
      await Promise.all([
        page.waitForURL((url) => url.pathname === destination.pathname && url.search === destination.search, { waitUntil: "domcontentloaded" }),
        trigger(page, scenario)
      ]);
      await page.getByRole("main").getByRole("heading", { level: 1, name: scenario.heading, exact: true }).waitFor();
      result.after = await documentState(page);
      if (scenario.sameDocument) {
        assert.equal(result.after.marker, result.before.marker, "Published navigation retains its document marker");
        assert.equal(result.after.timeOrigin, result.before.timeOrigin, "Published navigation keeps its document time origin");
        assert.ok(result.after.placements > 0, "Published destination remains monetized");
      } else {
        assert.equal(result.after.marker, null, "The source document marker disappears at the ad-free boundary");
        assert.notEqual(result.after.timeOrigin, result.before.timeOrigin, "The ad-free route is a new document");
        assert.deepEqual(
          [result.after.placements, result.after.units, result.after.loaders],
          [0, 0, 0],
          "Ad-free destination has no ad placements, provider units or loader script"
        );
      }
      result.passed = true;
      console.log("PASS " + scenario.name);
    } catch (error) {
      result.passed = false;
      result.error = error instanceof Error ? error.stack : String(error);
      console.error("FAIL " + scenario.name + "\n" + result.error);
    } finally {
      report.cases.push(result);
      await context.close();
    }
  }
} finally {
  await browser.close();
  report.finishedAt = new Date().toISOString();
  report.passed = report.cases.length === cases.length && report.cases.every(({ passed }) => passed);
  if (output) await writeFile(resolve(output, "ad-document-navigation.json"), JSON.stringify(report, null, 2) + "\n");
}
if (!report.passed) process.exitCode = 1;
