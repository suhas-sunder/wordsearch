import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { CategoryIcon } from "@/components/page/CategoryIcon";

describe("category icon lookup", () => {
  test("renders the mapped decorative icon for a known category", () => {
    const markup = renderToStaticMarkup(createElement(CategoryIcon, { slug: "food-and-drink-word-searches" }));
    expect(markup).toContain('data-category-icon="food-and-drink-word-searches"');
    expect(markup).toContain('aria-hidden="true"');
  });

  test("renders no icon for unknown or prototype-like keys", () => {
    expect(renderToStaticMarkup(createElement(CategoryIcon, { slug: "not-a-category" }))).toBe("");
    expect(renderToStaticMarkup(createElement(CategoryIcon, { slug: "constructor" }))).toBe("");
    expect(renderToStaticMarkup(createElement(CategoryIcon, { label: "constructor" }))).toBe("");
    expect(renderToStaticMarkup(createElement(CategoryIcon, { label: "__proto__" }))).toBe("");
  });
});
