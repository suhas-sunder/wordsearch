import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { metadata as searchMetadata } from "@/app/search/page";
import { primaryNavigation } from "@/content/navigation";
import { corePages } from "@/content/routes";

const root = process.cwd();

describe("homepage and route discovery architecture", () => {
  test("homepage is a discovery hub and generator owns the builder route", () => {
    const homepage = readFileSync(`${root}/app/page.tsx`, "utf8");
    const generator = readFileSync(`${root}/app/word-search-generator/page.tsx`, "utf8");
    const builderTemplate = readFileSync(`${root}/components/page/IndexablePage.tsx`, "utf8");
    expect(homepage).toContain("Free printable and online word search puzzles");
    expect(homepage).not.toContain("WordSearchBuilder");
    expect(generator).toContain("IndexablePage");
    expect(builderTemplate).toContain("WordSearchBuilder");
  });

  test("primary navigation maps to distinct destinations", () => {
    expect(primaryNavigation.map((item) => item.href)).toEqual([
      "/",
      "/free-printable-word-searches",
      "/online-word-search",
      "/word-search-generator",
      "/categories",
      "/large-print-word-searches",
      "/word-searches-for-teachers",
      "/guides"
    ]);
  });

  test("internal source links do not request new tabs", () => {
    const files = [
      "components/builder/WordSearchBuilder.tsx",
      "components/layout/SiteHeader.tsx",
      "components/layout/SiteFooter.tsx",
      "app/page.tsx"
    ];
    for (const file of files) {
      expect(readFileSync(`${root}/${file}`, "utf8")).not.toContain('target="_blank"');
      expect(readFileSync(`${root}/${file}`, "utf8")).not.toContain("window.open(");
    }
  });

  test("search is noindex with a stable canonical", () => {
    expect(searchMetadata.robots).toMatchObject({ index: false, follow: true });
    expect(searchMetadata.alternates).toMatchObject({ canonical: "/search" });
  });

  test("newly separated primary routes have unique metadata titles", () => {
    const slugs = [
      "word-search-generator",
      "free-printable-word-searches",
      "online-word-search",
      "word-search-pdf",
      "large-print-word-searches",
      "word-searches-for-kids",
      "word-searches-for-teachers",
      "word-search-worksheets",
      "guides"
    ];
    const pages = corePages.filter((page) => slugs.includes(page.slug));
    expect(pages).toHaveLength(slugs.length);
    expect(new Set(pages.map((page) => page.title)).size).toBe(pages.length);
  });

  test("advertisement placeholders are removed by print CSS", () => {
    const css = readFileSync(`${root}/app/globals.css`, "utf8");
    const printBlock = css.slice(css.indexOf("@media print"));
    expect(printBlock).toContain(".ad-slot");
    expect(printBlock).toContain("display: none !important");
  });
});
