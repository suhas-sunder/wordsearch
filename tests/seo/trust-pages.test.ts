import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const root = process.cwd();

describe("trust and ownership pages", () => {
  test("About includes approved facts and exact profile links", () => {
    const source = readFileSync(`${root}/app/about/page.tsx`, "utf8");
    expect(source).toContain("Suhas Sunder");
    expect(source).toContain("bachelor’s degree in engineering");
    expect(source).toContain("Master of Engineering in Electrical and Computer Engineering");
    expect(source).toContain("https://www.suhassunder.com/");
    expect(source).toContain("https://www.linkedin.com/in/s-sunder/");
  });

  test("methodology, policy, contact, accessibility, privacy, and terms are substantive", () => {
    const expectations = new Map([
      ["app/how-word-searches-are-made/page.tsx", "deterministic"],
      ["app/editorial-policy/page.tsx", "Arbitrary user-generated states"],
      ["app/contact/page.tsx", "public portfolio"],
      ["app/accessibility/page.tsx", "Keyboard puzzle solving"],
      ["app/privacy/page.tsx", "local browser storage"],
      ["app/terms/page.tsx", "User-entered content"]
    ]);
    for (const [file, text] of expectations) expect(readFileSync(`${root}/${file}`, "utf8")).toContain(text);
  });

  test("footer links the complete trust cluster", () => {
    const footer = readFileSync(`${root}/components/layout/SiteFooter.tsx`, "utf8");
    for (const path of ["/about", "/how-word-searches-are-made", "/editorial-policy", "/contact", "/accessibility", "/privacy", "/terms"]) expect(footer).toContain(path);
  });
});
