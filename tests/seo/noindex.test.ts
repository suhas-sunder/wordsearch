import { describe, expect, test } from "vitest";
import robots from "@/app/robots";

describe("robots rules", () => {
  test("disallows utility surfaces and query state URLs", () => {
    const rules = robots().rules;
    const first = Array.isArray(rules) ? rules[0] : rules;
    expect(first.disallow).toContain("/print/");
    expect(first.disallow).toContain("/pdf/");
    expect(first.disallow).toContain("/answer-key/");
    expect(first.disallow).toContain("/*?state=");
  });
});
