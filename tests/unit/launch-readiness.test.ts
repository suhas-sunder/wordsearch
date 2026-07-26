import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, test } from "vitest";
import { AdSlot, adPlacementConfig, adTemplateEligibility } from "@/components/layout/AdSlot";
import { routeInventory } from "@/content/registry";
import manifest from "@/tests/e2e/route-audit-manifest.json";

const root = process.cwd();
const originalAdSetting = process.env.NEXT_PUBLIC_AD_PLACEHOLDERS;

afterEach(() => {
  if (originalAdSetting === undefined) delete process.env.NEXT_PUBLIC_AD_PLACEHOLDERS;
  else process.env.NEXT_PUBLIC_AD_PLACEHOLDERS = originalAdSetting;
});

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

  test("ad placeholders are absent by default and explicit in development mode", () => {
    delete process.env.NEXT_PUBLIC_AD_PLACEHOLDERS;
    expect(renderToStaticMarkup(createElement(AdSlot, { placement: "top-banner", template: "home" }))).toBe("");
    process.env.NEXT_PUBLIC_AD_PLACEHOLDERS = "on";
    const enabled = renderToStaticMarkup(createElement(AdSlot, { placement: "top-banner", template: "home" }));
    expect(enabled).toContain('aria-label="Advertisement"');
    expect(enabled).toContain('data-ad-placement="top-banner"');
    expect(enabled).not.toContain("placeholder");
    expect(Object.keys(adPlacementConfig)).toHaveLength(6);
    expect(Object.values(adPlacementConfig).every((placement) => placement.label === "Advertisement")).toBe(true);
    expect(adTemplateEligibility.draft).toEqual([]);
    expect(adTemplateEligibility.utility).toEqual([]);
    expect(renderToStaticMarkup(createElement(AdSlot, { placement: "top-banner", template: "draft" }))).toBe("");
  });

  test("CSS hides ads in print and sidebars on smaller screens", () => {
    const css = readFileSync(`${root}/app/globals.css`, "utf8");
    expect(css.slice(css.indexOf("@media print"))).toMatch(/\.ad-slot[\s\S]*display:\s*none !important/);
    expect(css).toMatch(/@media \(max-width: 980px\)[\s\S]*\.ad-slot-sidebar[\s\S]*display:\s*none/);
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
  });

  test("ineligible utility and trust routes do not render ad slots", () => {
    const files = [
      "app/search/page.tsx",
      "app/print/[id]/page.tsx",
      "app/pdf/[id]/page.tsx",
      "app/answer-key/[id]/page.tsx",
      "app/play/[id]/page.tsx",
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

  test("the focused search island does not bundle the full content catalog", () => {
    const search = readFileSync(`${root}/components/search/PuzzleSearch.tsx`, "utf8");
    expect(search).toContain('import type { SearchCatalogItem }');
    expect(search).not.toContain("findSearchResults");
    expect(search).toContain('fetch(`/api/search?');
  });

  test("layout exposes a keyboard skip target and encoded routes reject fallback puzzles", () => {
    const layout = readFileSync(`${root}/app/layout.tsx`, "utf8");
    const embed = readFileSync(`${root}/app/embed/[id]/page.tsx`, "utf8");
    const custom = readFileSync(`${root}/app/custom/[slug]/page.tsx`, "utf8");
    expect(layout).toContain('href="#main-content"');
    expect(layout).toContain('id="main-content" tabIndex={-1}');
    expect(embed).toContain("decodePuzzleShareState");
    expect(embed).toContain("notFound()");
    expect(embed).not.toContain("defaultPuzzleRequest");
    expect(custom).toContain("notFound()");
  });
});
