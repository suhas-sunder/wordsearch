import { describe, expect, test } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { activityToolContext } from "@/content/activity-tools";
import { RelatedActivityTools } from "@/components/page/RelatedActivityTools";
import { SiteFooter } from "@/components/layout/SiteFooter";

describe("contextual owned-site activity suggestions", () => {
  test("offers three distinct useful destinations in explicit activity contexts", () => {
    for (const path of ["/word-searches-for-teachers", "/word-search-worksheets", "/free-printable-word-searches", "/word-searches-for-kids", "/homeschool-word-searches", "/collections/classroom-word-search-worksheets", "/pack-builder"]) {
      const context = activityToolContext(path);
      expect(context?.links).toHaveLength(3);
      expect(new Set(context?.links.map(({ href }) => new URL(href).hostname)).size).toBe(3);
      for (const { href, description } of context!.links) {
        expect(new URL(href).protocol).toBe("https:");
        expect(new URL(href).search).toBe("");
        expect(description.length).toBeGreaterThan(30);
      }
    }
  });
  test("does not spread a network directory into unrelated pages or generated outputs", () => {
    for (const path of ["/", "/about", "/search", "/word-search-generator", "/word-searches/animals/dog-word-search", "/collections/hard-printable-word-searches", "/privacy", "/print/example", "/play/example", "/specialty/morse-code-word-search-generator"]) {
      expect(activityToolContext(path)).toBeNull();
      expect(renderToStaticMarkup(createElement(RelatedActivityTools, { path }))).toBe("");
    }
  });
  test("renders actual crawlable links on the server without embeds or scripts", () => {
    const html = renderToStaticMarkup(createElement(RelatedActivityTools, { path: "/word-searches-for-teachers" }));
    expect((html.match(/<a /g) ?? [])).toHaveLength(3);
    expect(html).toContain("https://www.morsewords.com/morse-code-printable-worksheets");
    expect(html).not.toMatch(/<iframe|<script|<img|target=/);
    expect(html).toContain('aria-labelledby="related-activities-heading"');
  });
  test("offers verified creator profiles without invented word-search social accounts", () => {
    const html = renderToStaticMarkup(createElement(SiteFooter));
    expect(html).toContain('aria-label="Creator profiles"');
    expect(html).toContain('href="https://www.suhassunder.com/"');
    expect(html).toContain('href="https://www.linkedin.com/in/s-sunder/"');
    expect(html).not.toMatch(/x\.com|instagram\.com|youtube\.com|WordSkull/);
  });
});
