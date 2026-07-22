import { describe, expect, test } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

describe("robots rules", () => {
  test("disallows utility surfaces and query state URLs", () => {
    const rules = robots().rules;
    const first = Array.isArray(rules) ? rules[0] : rules;
    expect(first.disallow).toContain("/print/");
    expect(first.disallow).toContain("/pdf/");
    expect(first.disallow).toContain("/answer-key/");
    expect(first.disallow).toContain("/*?state=");
  });

  test("does not include search result pages in the sitemap", () => {
    expect(sitemap().map((entry) => entry.url)).not.toContain("https://www.ilovewordsearch.com/search");
  });
});
