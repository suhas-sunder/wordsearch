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
import {
  ADSENSE_CLIENT,
  ADSENSE_SCRIPT_SRC,
  ADSENSE_UNITS,
  placementMediaQuery,
  resolveAdSenseEnabled
} from "@/lib/monetization/adsense";

const root = process.cwd();
const source = (path: string) => readFileSync(`${root}/${path}`, "utf8");

describe("AdSense monetization architecture", () => {
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

  test("the activation gate defaults off unless explicitly set to on", () => {
    expect(resolveAdSenseEnabled(undefined)).toBe(false);
    expect(resolveAdSenseEnabled("")).toBe(false);
    expect(resolveAdSenseEnabled("true")).toBe(false);
    expect(resolveAdSenseEnabled("on")).toBe(true);

    const disabled = renderToStaticMarkup(createElement(AdSlot, { placement: "below-header-banner", template: "home", adsenseEnabled: false }));
    expect(disabled).toContain('data-ad-mode="placeholder"');
    expect(disabled).toContain('data-ad-placeholder="true"');
    expect(disabled).not.toMatch(/adsbygoogle|data-ad-client|data-ad-slot/);
  });

  test("centralizes the exact publisher, loader, unit names, and slot mapping", () => {
    expect(ADSENSE_CLIENT).toBe("ca-pub-4810616735714570");
    expect(ADSENSE_SCRIPT_SRC).toBe("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4810616735714570");
    expect(ADSENSE_UNITS).toEqual({
      "top-banner": { name: "ilovewordsearch-above-header-banner", slot: "6498435012" },
      "below-header-banner": { name: "ilovewordsearch-below-header-banner", slot: "8471746257" },
      "sidebar-left": { name: "ilovewordsearch-sidebar-left", slot: "3872271670" },
      "sidebar-right": { name: "ilovewordsearch-sidebar-right", slot: "5709851549" },
      "seo-section-square": { name: "ilovewordsearch-seo-section-square", slot: "4396769879" },
      "above-footer-banner": { name: "ilovewordsearch-above-footer", slot: "7230906061" }
    });
    expect(placementMediaQuery("top-banner")).toBe("(min-width: 768px)");
    expect(placementMediaQuery("sidebar-left")).toBe("(min-width: 1600px)");
    expect(placementMediaQuery("sidebar-right")).toBe("(min-width: 1600px)");
    expect(placementMediaQuery("below-header-banner")).toBeNull();
  });

  test("enabled units use modified responsive markup without auto-size attributes", () => {
    const enabled = renderToStaticMarkup(createElement(AdSlot, {
      placement: "below-header-banner",
      template: "home",
      adsenseEnabled: true
    }));
    expect(enabled).toContain('class="adsbygoogle"');
    expect(enabled).toContain(`data-ad-client="${ADSENSE_CLIENT}"`);
    expect(enabled).toContain(`data-ad-slot="${ADSENSE_UNITS["below-header-banner"].slot}"`);
    expect(enabled).not.toContain("data-ad-format");
    expect(enabled).not.toContain("data-full-width-responsive");
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
    expect(css).toMatch(/\.ad-slot-live\s*\{[\s\S]*?pointer-events:\s*auto/);
    expect(css.slice(css.indexOf("@media print"))).toMatch(/\.ad-slot,[\s\S]*?display:\s*none !important/);
  });

  test("uses one head loader and guards every mounted unit from duplicate pushes", () => {
    const client = source("components/layout/AdSense.tsx");
    const shell = source("components/layout/AdSlot.tsx");
    expect(shell.match(/<AdSenseLoader/g)).toHaveLength(1);
    expect(client).toContain("document.head.appendChild(script)");
    expect(client).toContain('unit.dataset.ilwsAdRequested === "true"');
    expect(client).toContain('unit.dataset.ilwsAdRequested = "true"');
    expect(client).toContain("(window.adsbygoogle = window.adsbygoogle || []).push({})");
    expect(client).not.toContain("data-ad-format");
    expect(client).not.toContain("data-full-width-responsive");
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
