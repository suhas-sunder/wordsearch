import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";
import { chromium } from "playwright";

// A rendered reading inventory, not an automatic editorial verdict. Every
// captured passage retains its route and role for human/contextual review.
const origin = process.env.BASE_URL;
const output = process.env.COPY_CAPTURE_OUTPUT;
assert.ok(origin && output, "Set BASE_URL and outside-Git COPY_CAPTURE_OUTPUT");
const local = relative(process.cwd(), resolve(output));
assert.ok(local === ".." || local.startsWith(`..${sep}`) || isAbsolute(local), "Keep generated evidence outside Git");
await mkdir(output, { recursive: true });
const sitemapResponse = await fetch(new URL("/sitemap.xml", origin));
assert.equal(sitemapResponse.status, 200);
const sitemap = await sitemapResponse.text();
const indexedPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gu)].map(match => new URL(match[1]).pathname);
assert.equal(indexedPaths.length, 217);
// Real exported routes: specialty.ts, the six prefixes checked by
// static-export-audit.mjs, and the existing noindex registry entries. These
// intentionally exclude fabricated /specialty and dynamic share payloads.
const extraPaths = [
  "/search", "/pack-builder", "/specialty-word-search-generators", "/faq", "/daily-word-search",
  ...["play", "print", "pdf", "answer-key", "embed", "custom"].map(prefix => `/${prefix}`),
  ...[
    "morse-code", "braille", "asl-fingerspelling", "semaphore", "binary", "hexadecimal",
    "roman-numeral", "greek-alphabet", "spanish", "french", "japanese-kana", "emoji", "hidden-message"
  ].map(format => `/specialty/${format}-word-search-generator`),
  "/categories/health-and-wellness-word-searches", "/categories/faith-word-searches",
  ...[
    "halloween-word-searches-for-kids", "christmas-word-searches-for-kids", "road-trip-word-searches",
    "substitute-teacher-word-searches", "brain-training-word-searches", "baby-shower-word-searches",
    "bridal-shower-word-searches", "rainy-day-word-searches"
  ].map(slug => `/collections/${slug}`),
  "/guides/how-hidden-message-word-searches-work", "/guides/word-search-ideas-for-parties"
];
assert.equal(new Set([...indexedPaths, ...extraPaths]).size, indexedPaths.length + extraPaths.length, "Route coverage must not double-count indexed paths");
const browser = await chromium.launch();
const result = { capturedAt: new Date().toISOString(), origin, indexedPaths, extraPaths, pages: [], limitations: ["All indexed pages are browser-rendered with JavaScript disabled to inventory crawlable copy. Interactive workflows are tested separately.", "The 36 additional existing noindex routes cover specialty, search, FAQ, daily, classroom-pack, utility-shell and draft hub/guide templates; they are not an inventory of every served draft puzzle URL.", "Utility-shell observations contain the no-JavaScript recovery state, not decoded puzzle output or hydrated controls.", "Passage collection is not a linguistic quality score or an assertion of individual visual inspection."] };
try {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  for (const path of [...indexedPaths, ...extraPaths]) {
    const response = await page.goto(new URL(path, origin).href, { waitUntil: "domcontentloaded", timeout: 30000 });
    assert.equal(response.status(), 200, path);
    const content = await page.evaluate(() => ({
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      robots: document.querySelector('meta[name="robots"]')?.content,
      // Preserve all visible copy as well as the structured passage sample,
      // including navigation/footer links and standalone status/control text.
      visibleText: document.body.innerText,
      headings: [...document.querySelectorAll("main h1,main h2,main h3")].map(node => ({ level: node.tagName, text: node.innerText })),
      passages: [...document.querySelectorAll("main p,main li,main summary,main label,main a,footer p,header button")].filter(node => node.getClientRects().length && !node.closest("[aria-hidden=true]")) .map(node => ({ role: node.tagName, text: node.innerText.replace(/\s+/gu, " ").trim(), href: node.getAttribute("href") })).filter(node => node.text),
      links: [...document.querySelectorAll("a[href]")].map(node => node.getAttribute("href")),
      overflow: document.documentElement.scrollWidth > innerWidth + 1
    }));
    result.pages.push({ path, status: response.status(), ...content });
    await writeFile(resolve(output, "rendered-copy.json"), JSON.stringify(result, null, 2));
    if (result.pages.length % 25 === 0) console.log(`Rendered ${result.pages.length}/${indexedPaths.length + extraPaths.length}`);
  }
  await context.close();
} finally { await browser.close(); }
console.log(JSON.stringify({ indexed: indexedPaths.length, rendered: result.pages.length, output }));
