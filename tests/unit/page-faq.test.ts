import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { EditorialModules, FaqBlock } from "@/components/page/PageSections";
import { corePages, supportPages } from "@/content/routes";

describe("page-specific FAQ rendering", () => {
  test("supplied questions render even without the legacy FAQ module flag", () => {
    const faq = corePages.find((page) => page.slug === "word-search-generator")!.faq!;
    const html = renderToStaticMarkup(createElement(EditorialModules, { modules: [], faq, adTemplate: "utility" }));
    for (const item of faq) expect(html).toContain(item.question);
    expect(html.match(/<details>/g)).toHaveLength(faq.length);
  });

  test("a page without questions or a legacy flag gets no generic FAQ substitute", () => {
    expect(renderToStaticMarkup(createElement(FaqBlock))).toBe("");
    const html = renderToStaticMarkup(createElement(EditorialModules, { modules: [], adTemplate: "utility" }));
    expect(html).not.toContain("<details>");
  });

  test("the legacy explicit flag preserves existing general answers", () => {
    const html = renderToStaticMarkup(createElement(EditorialModules, { modules: ["faq"], adTemplate: "utility" }));
    expect(html.match(/<details>/g)).toHaveLength(3);
  });

  test("the dedicated FAQ retains the previous general answers explicitly", () => {
    const faq = supportPages.find((page) => page.slug === "faq")!.faq!;
    expect(faq).toHaveLength(3);
    expect(renderToStaticMarkup(createElement(FaqBlock, { items: faq }))).toContain("Are the puzzles free to print?");
  });
});
