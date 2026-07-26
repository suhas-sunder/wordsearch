import { describe, expect, test } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

describe("robots rules", () => {
  test("allows crawling so utility noindex directives can be observed", () => {
    const rules = robots().rules;
    const first = Array.isArray(rules) ? rules[0] : rules;
    expect(first.allow).toBe("/");
    expect(first.disallow).toBeUndefined();
    expect(robots().sitemap).toBe("https://www.ilovewordsearch.com/sitemap.xml");
  });

  test("does not include search result pages in the sitemap", () => {
    expect(sitemap().map((entry) => entry.url)).not.toContain("https://www.ilovewordsearch.com/search");
  });
});
