import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
import { describe, expect, test } from "vitest";

const extensions = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json"];
const slash = (value: string) => value.replaceAll("\\", "/");

function dependencies(source: string, file: string) {
  const parsed = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  const imports: string[] = [];
  const unresolved: string[] = [];
  const visit = (node: ts.Node) => {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteralLike(node.moduleSpecifier)) {
      imports.push(node.moduleSpecifier.text);
    }
    if (ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference)) {
      const expression = node.moduleReference.expression;
      if (expression && ts.isStringLiteralLike(expression)) imports.push(expression.text);
    }
    if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument) && ts.isStringLiteralLike(node.argument.literal)) {
      imports.push(node.argument.literal.text);
    }
    if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(node.expression) && node.expression.text === "require"))) {
      const argument = node.arguments[0];
      if (argument && ts.isStringLiteralLike(argument)) imports.push(argument.text);
      else unresolved.push(node.getText(parsed));
    }
    ts.forEachChild(node, visit);
  };
  visit(parsed);
  return { imports, unresolved };
}

/** Resolve the repository's @/* alias and ordinary relative module paths. */
function resolveLocal(from: string, specifier: string, hasFile: (file: string) => boolean) {
  const target = specifier.startsWith("@/")
    ? path.posix.normalize(specifier.slice(2))
    : specifier.startsWith(".")
      ? path.posix.normalize(path.posix.join(path.posix.dirname(from), specifier))
      : undefined;
  if (!target) return undefined; // External packages are not repository content.
  const candidates = [target, ...extensions.map((extension) => `${target}${extension}`), ...extensions.map((extension) => `${target}/index${extension}`)];
  // TypeScript accepts imports ending in .js that resolve to a .ts/.tsx source.
  if (/\.[cm]?js$/.test(target)) candidates.push(target.replace(/\.[cm]?js$/, ".ts"), target.replace(/\.[cm]?js$/, ".tsx"));
  return candidates.find(hasFile);
}

function reviewBoundary(entries: string[], read: (file: string) => string | undefined) {
  const seen = new Set<string>();
  const problems: string[] = [];
  const walk = (file: string, chain: string[]) => {
    if (file.toLowerCase().startsWith("content/review/")) {
      problems.push([...chain, file].join(" -> "));
      return;
    }
    if (seen.has(file)) return;
    seen.add(file);
    const source = read(file);
    if (source === undefined || file.endsWith(".json")) return;
    const { imports, unresolved } = dependencies(source, file);
    // A computed import would prevent proving the source-only boundary.
    for (const expression of unresolved) problems.push(`${file}: uninspectable module load ${expression}`);
    for (const specifier of imports) {
      const target = resolveLocal(file, specifier, (candidate) => read(candidate) !== undefined);
      if (target) walk(target, [...chain, file]);
    }
  };
  entries.forEach((entry) => walk(entry, []));
  return problems;
}

function filesUnder(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(file) : extensions.some((extension) => file.endsWith(extension)) ? [slash(file)] : [];
  });
}

describe("source-only editorial review boundary", () => {
  test("keeps review notes and proposed text outside all public dependency graphs", () => {
    const config = ts.readConfigFile("tsconfig.json", ts.sys.readFile);
    expect(config.error).toBeUndefined();
    // New aliases require extending the resolver rather than silently escaping it.
    expect(config.config.compilerOptions.paths).toEqual({ "@/*": ["./*"] });
    const cache = new Map<string, string | undefined>();
    const read = (file: string) => {
      if (!cache.has(file)) cache.set(file, existsSync(file) && statSync(file).isFile() ? readFileSync(file, "utf8") : undefined);
      return cache.get(file);
    };
    // Include public content roots even if a new module has no app consumer yet.
    const entries = ["app", "components", "content"].flatMap(filesUnder).filter((file) => !file.startsWith("content/review/") && !file.startsWith("content/staged/"));
    expect(entries.length).toBeGreaterThan(0);
    expect(reviewBoundary(entries, read)).toEqual([]);
  });

  test.each([
    'import { note } from "@/content/review/pilot";',
    'export { note } from "@/content/review/pilot";',
    'const note = import("@/content/review/pilot");',
    'const note = require("@/content/review/pilot");',
    'import type { EditorialNote } from "@/content/review/pilot";',
    'type Note = import("@/content/review/pilot").EditorialNote;'
  ])("detects direct review-module access: %s", (source) => {
    const files: Record<string, string> = { "app/page.tsx": source, "content/review/pilot.ts": "export const note = 'INTERNAL EDITORIAL SENTINEL';" };
    expect(reviewBoundary(["app/page.tsx"], (file) => files[file])).toEqual(["app/page.tsx -> content/review/pilot.ts"]);
  });

  test("detects transitive barrel access through a library module", () => {
    const files: Record<string, string> = {
      "components/Card.tsx": 'import { description } from "@/lib/card";',
      "lib/card.ts": 'export { description } from "../content/review";',
      "content/review/index.ts": 'export { description } from "./pilot";',
      "content/review/pilot.ts": "export const description = 'INTERNAL EDITORIAL SENTINEL';"
    };
    expect(reviewBoundary(["components/Card.tsx"], (file) => files[file])).toEqual(["components/Card.tsx -> lib/card.ts -> content/review/index.ts"]);
  });

  test("normalizes parent segments before checking the review boundary", () => {
    const files: Record<string, string> = {
      "app/page.tsx": 'import { note } from "@/content/../content/review/pilot";',
      "content/review/pilot.ts": "export const note = 'INTERNAL EDITORIAL SENTINEL';"
    };
    expect(reviewBoundary(["app/page.tsx"], (file) => files[file])).toEqual(["app/page.tsx -> content/review/pilot.ts"]);
  });

  test("permits legitimate public safety language without scanning wording", () => {
    const files: Record<string, string> = {
      "app/page.tsx": 'import { description } from "@/content/public";',
      "content/public.ts": 'export const description = "This vocabulary puzzle does not replace laboratory supervision or official safety instructions.";',
      "content/review/pilot.ts": "export const note = 'INTERNAL EDITORIAL SENTINEL';"
    };
    expect(reviewBoundary(["app/page.tsx"], (file) => files[file])).toEqual([]);
  });

  test("fails closed for computed module loads that hide dependency paths", () => {
    expect(reviewBoundary(["app/page.tsx"], (file) => file === "app/page.tsx" ? "const data = import(reviewPath);" : undefined)).toEqual(["app/page.tsx: uninspectable module load import(reviewPath)"]);
  });
});
