import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { AD_PLACEMENTS, AdSlot, adTemplatePolicy } from "@/components/layout/AdSlot";
import { routeInventory } from "@/content/registry";
import manifest from "@/tests/e2e/route-audit-manifest.json";

const root = process.cwd();
describe("launch readiness safeguards", () => {
  test("route-audit redirect manifest stays synchronized with the registry", () => {
    const registryRedirects = routeInventory
      .filter((record) => record.redirectTarget)
      .map((record) => ({ source: record.canonicalPath, target: record.redirectTarget }))
      .sort((a, b) => a.source.localeCompare(b.source));
    expect(manifest.redirects.slice().sort((a, b) => a.source.localeCompare(b.source))).toEqual(registryRedirects);
    expect(registryRedirects).toHaveLength(22);
    expect(manifest.sitemapCount).toBe(217);
  });

  test("ad placeholders use the six-role contract and ad-free templates reject them", () => {
    const enabled = renderToStaticMarkup(createElement(AdSlot, { placement: "top-banner", template: "home" }));
    expect(enabled).toContain("<span>Advertisements</span>");
    expect(enabled).toContain('data-ad-placement="top-banner"');
    expect(enabled).toContain('data-ad-placeholder="true"');
    expect(AD_PLACEMENTS).toEqual([
      "top-banner",
      "sidebar-left",
      "sidebar-right",
      "below-header-banner",
      "seo-section-square",
      "above-footer-banner"
    ]);
    expect(adTemplatePolicy.draft.placements).toEqual([]);
    expect(adTemplatePolicy.utility.placements).toEqual([]);
    expect(renderToStaticMarkup(createElement(AdSlot, { placement: "top-banner", template: "draft" }))).toBe("");
  });

  test("CSS hides ads in print and sidebars on smaller screens", () => {
    const css = readFileSync(`${root}/app/globals.css`, "utf8");
    expect(css.slice(css.indexOf("@media print"))).toMatch(/\.ad-slot[\s\S]*display:\s*none !important/);
    expect(css).toMatch(/\.ad-placement-top-banner\s*\{[\s\S]*?display:\s*none/);
    expect(css).toMatch(/@media \(min-width: 1600px\)[\s\S]*\.ad-sidebar-region[\s\S]*display:\s*block/);
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
  });

  test("ineligible utility and trust routes do not render ad slots", () => {
    const files = [
      "app/search/page.tsx",
      "app/print/page.tsx",
      "app/pdf/page.tsx",
      "app/answer-key/page.tsx",
      "app/play/page.tsx",
      "app/contact/page.tsx",
      "app/privacy/page.tsx",
      "app/terms/page.tsx",
      "app/copyright/page.tsx",
      "app/not-found.tsx"
    ];
    for (const file of files) expect(readFileSync(`${root}/${file}`, "utf8"), file).not.toContain("AdSlot");
  });

  test("static directories remain server-rendered and do not import puzzle grids", () => {
    const topics = readFileSync(`${root}/app/topics/page.tsx`, "utf8");
    expect(topics).not.toContain('"use client"');
    expect(topics).not.toContain("WordSearchBuilder");
    expect(topics).not.toContain("OnlineSolver");
    expect(topics).not.toContain("PuzzleSvg");
    expect(topics).not.toContain("qrcode");
    expect(topics).not.toContain("pdf-lib");
    expect(topics.match(/publishedTopics\.map/g)).toHaveLength(2);
  });

  test("interactive builder hydration is isolated and deferred from editorial paint", () => {
    const template = readFileSync(`${root}/components/page/IndexablePage.tsx`, "utf8");
    const deferred = readFileSync(`${root}/components/builder/DeferredWordSearchBuilder.tsx`, "utf8");
    expect(template).toContain("DeferredWordSearchBuilder");
    expect(template).not.toContain('from "@/components/builder/WordSearchBuilder"');
    expect(deferred).toContain("requestIdleCallback");
    expect(deferred).toContain('import("@/components/builder/WordSearchBuilder")');
    expect(deferred).toContain('aria-busy={status === "loading"}');
  });

  test("the focused search island loads and searches the catalog locally on demand", () => {
    const search = readFileSync(`${root}/components/search/PuzzleSearch.tsx`, "utf8");
    const browserCatalog = readFileSync(`${root}/lib/search/browser-catalog.ts`, "utf8");
    expect(search).toContain('import type { SearchCatalogItem }');
    expect(search).toContain("searchStaticCatalog(value");
    expect(search).not.toContain("/api/search");
    expect(browserCatalog).toContain('fetch("/search-index.json"');
    expect(browserCatalog).not.toContain("@/content/");
  });

  test("layout exposes a keyboard skip target and static utility shells reject fallback puzzles", () => {
    const layout = readFileSync(`${root}/app/layout.tsx`, "utf8");
    const utility = readFileSync(`${root}/components/puzzle/StaticPuzzleRoute.tsx`, "utf8");
    expect(layout).toContain('href="#main-content"');
    expect(layout).toContain('id="main-content" tabIndex={-1}');
    expect(utility).toContain("decodePuzzleShareState");
    expect(utility).toContain('data-utility-state="invalid"');
    expect(utility).not.toContain("defaultPuzzleRequest");
  });

  test("Netlify publishes only the static export and browser features use no API routes", () => {
    const nextConfig = readFileSync(`${root}/next.config.ts`, "utf8");
    const netlify = readFileSync(`${root}/netlify.toml`, "utf8");
    const redirects = readFileSync(`${root}/public/_redirects`, "utf8");
    const utilities = readFileSync(`${root}/components/puzzle/PuzzleUtilities.tsx`, "utf8");
    expect(nextConfig).toContain('output: "export"');
    expect(netlify).toMatch(/publish\s*=\s*"out"/);
    expect(netlify).not.toContain("@netlify/plugin-nextjs");
    expect(redirects).toContain("/play/* /play.html 200");
    expect(redirects).toContain("/pdf/* /pdf.html 200");
    expect(utilities).toContain("downloadBrowserPuzzlePdf");
    expect(utilities).not.toContain('fetch("/api/');
  });

  test("printable preview mode is separate from Print and PDF answer composition", () => {
    const utilities = readFileSync(`${root}/components/puzzle/PuzzleUtilities.tsx`, "utf8");
    expect(utilities).toContain('export type PreviewMode = "puzzle" | "answer"');
    expect(utilities).toContain('data-preview-mode={previewMode}');
    expect(utilities).toContain('answerKey={previewMode === "answer"}');
    expect(utilities).not.toContain('optionCheckbox("Answer page"');
    expect(utilities).toContain('optionCheckbox("Answer key page", options.includeAnswerKey');
    expect(utilities).toContain("options.includeAnswerKey && <PrintablePuzzle");
    expect(utilities).not.toContain("(answersVisible || options.includeAnswerKey)");
  });
});
