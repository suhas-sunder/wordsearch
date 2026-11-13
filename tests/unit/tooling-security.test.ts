import { createRequire } from "node:module";
import { describe, expect, test } from "vitest";

// Resolve the parser's dependency, not an unrelated hoisted minimatch version.
const parserRequire = createRequire(createRequire(import.meta.url).resolve("@typescript-eslint/typescript-estree"));
const { minimatch } = parserRequire("minimatch") as { minimatch(path: string, pattern: string, options: { dot: boolean }): boolean };

describe("parser glob dependency migration", () => {
  test("preserves default-project allowlist matching, including dotfiles and directory boundaries", () => {
    expect(minimatch("eslint.config.mjs", "*.mjs", { dot: true })).toBe(true);
    expect(minimatch(".config.ts", "*.ts", { dot: true })).toBe(true);
    expect(minimatch("app/page.tsx", "*.tsx", { dot: true })).toBe(false);
    expect(minimatch("app/page.tsx", "app/*.tsx", { dot: true })).toBe(true);
    expect(minimatch("tests/unit/pdf.test.ts", "tests/**/*.test.ts", { dot: true })).toBe(true);
    expect(minimatch("tests/unit/pdf.test.ts", "app/**/*.tsx", { dot: true })).toBe(false);
  });
});
