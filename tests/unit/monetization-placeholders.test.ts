import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import {
  AD_PLACEMENTS,
  AdSlot,
  MonetizedPageShell,
  adTemplatePolicy,
  getAdTemplatePolicy
} from "@/components/layout/AdSlot";

const root = process.cwd();
const source = (path: string) => readFileSync(`${root}/${path}`, "utf8");

describe("AdSense placeholder architecture", () => {
  test("uses exactly the approved six-placement vocabulary", () => {
    expect(AD_PLACEMENTS).toEqual([
      "top-banner",
      "sidebar-left",
      "sidebar-right",
      "below-header-banner",
      "seo-section-square",
      "above-footer-banner"
    ]);
  });

  test("eligible templates expose the shared shell and unknown templates default ad-free", () => {
    for (const template of ["home", "generator", "curated-puzzle", "major-hub", "category", "collection", "guide"] as const) {
      expect(adTemplatePolicy[template].placements).toEqual(AD_PLACEMENTS);
    }
    expect(adTemplatePolicy.topics.placements).toEqual(AD_PLACEMENTS.filter((placement) => placement !== "seo-section-square"));
    expect(getAdTemplatePolicy(undefined)).toBe(adTemplatePolicy.error);

    const markup = renderToStaticMarkup(createElement(MonetizedPageShell, {
      template: "home",
      children: createElement("main", { id: "content-marker" })
    }));
    expect(markup.match(/data-ad-placeholder="true"/g)).toHaveLength(4);
    expect(markup.indexOf('data-ad-placement="top-banner"')).toBeLessThan(markup.indexOf("content-marker"));
    expect(markup.indexOf('data-ad-placement="above-footer-banner"')).toBeGreaterThan(markup.indexOf("content-marker"));
  });

  test("ad-free policies render no placeholders", () => {
    for (const template of ["draft", "utility", "trust", "error"] as const) {
      expect(adTemplatePolicy[template].eligibility).toBe("ad-free");
      expect(adTemplatePolicy[template].placements).toEqual([]);
      expect(renderToStaticMarkup(createElement(AdSlot, { placement: "top-banner", template }))).toBe("");
    }
    expect(renderToStaticMarkup(createElement(AdSlot, { placement: "top-banner" }))).toBe("");
  });

  test("below-header and SEO placements stay outside puzzle controls", () => {
    const indexable = source("components/page/IndexablePage.tsx");
    const sections = source("components/page/PageSections.tsx");
    const builder = source("components/builder/WordSearchBuilder.tsx");
    const utilities = source("components/puzzle/PuzzleUtilities.tsx");

    expect(indexable.indexOf("DeferredWordSearchBuilder")).toBeLessThan(indexable.indexOf("<BelowHeaderAd"));
    expect(sections.indexOf("<HowItWorks")).toBeLessThan(sections.indexOf("<SeoSectionAd"));
    expect(builder).not.toMatch(/AdSlot|BelowHeaderAd|SeoSectionAd|MonetizedPageShell/);
    expect(utilities).not.toMatch(/AdSlot|BelowHeaderAd|SeoSectionAd|MonetizedPageShell/);
  });

  test("above-footer placement remains before and outside SiteFooter", () => {
    const layout = source("app/layout.tsx");
    const shell = source("components/layout/AdSlot.tsx");
    expect(layout.indexOf('id="main-content"')).toBeLessThan(layout.indexOf("<SiteFooter"));
    expect(layout).not.toContain("above-footer-banner");
    expect(shell.indexOf('placement="above-footer-banner"')).toBeGreaterThan(shell.indexOf("{children}"));
  });

  test("responsive CSS reserves sizes and removes all placeholders from print", () => {
    const css = source("app/globals.css");
    expect(css).toMatch(/\.ad-placement-top-banner\s*\{[\s\S]*?display:\s*none/);
    expect(css).toMatch(/@media \(min-width: 768px\)[\s\S]*?\.ad-placement-top-banner\s*\{[\s\S]*?display:\s*grid/);
    expect(css).toMatch(/@media \(min-width: 1600px\)[\s\S]*?\.ad-sidebar-region\s*\{[\s\S]*?display:\s*block/);
    expect(css).toMatch(/@media \(min-width: 1900px\)[\s\S]*?grid-template-columns:\s*300px minmax\(0, 1212px\) 300px/);
    expect(css.slice(css.indexOf("@media print"))).toMatch(/\.ad-slot,[\s\S]*?display:\s*none !important/);
  });

  test("application sources contain placeholders only and no live ad integration", () => {
    const files = [
      "app/layout.tsx",
      "app/page.tsx",
      "app/globals.css",
      "components/layout/AdSlot.tsx",
      "components/page/IndexablePage.tsx",
      "components/page/PageSections.tsx",
      "components/page/RouteHub.tsx",
      "components/builder/WordSearchBuilder.tsx",
      "components/puzzle/PuzzleUtilities.tsx"
    ];
    const applicationSource = files.map(source).join("\n");
    expect(applicationSource).not.toMatch(/adsbygoogle/i);
    expect(applicationSource).not.toMatch(/googlesyndication|pagead2|googleadservices|doubleclick/i);
    expect(applicationSource).not.toMatch(/data-ad-slot|data-ad-client|ca-pub-/i);
    expect(source("components/layout/AdSlot.tsx")).toContain("<span>Advertisements</span>");
  });

  test("representative high-risk route classes remain unmonetized", () => {
    const routes = [
      "app/search/page.tsx",
      "app/print/page.tsx",
      "app/pdf/page.tsx",
      "app/answer-key/page.tsx",
      "app/play/page.tsx",
      "app/embed/page.tsx",
      "app/custom/page.tsx",
      "app/contact/page.tsx",
      "app/privacy/page.tsx",
      "app/terms/page.tsx",
      "app/copyright/page.tsx",
      "app/accessibility/page.tsx",
      "app/editorial-policy/page.tsx",
      "app/not-found.tsx"
    ];
    for (const route of routes) {
      expect(source(route), route).not.toMatch(/AdSlot|BelowHeaderAd|SeoSectionAd|MonetizedPageShell/);
    }
  });
});
