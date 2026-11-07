import { describe, expect, test } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { StagedPuzzleCandidate } from "@/content/staged/model";
import { validateStaged } from "@/lib/content/staged-validation";
import { inspectCandidateExport, inspectCandidatePdfs } from "@/lib/content/staged-output";

const sample: StagedPuzzleCandidate = {
  id: "test-only-01", proposedPath: "/word-searches/holidays/staged-test-word-search", intent: "A test-only candidate for winter vocabulary", title: "Test Only Winter", status: "drafted", sourceReferences: [],
  taxonomy: { primaryCategory: "holiday-word-searches" }, editorial: {},
  puzzle: { puzzleTitle: "Test Only Winter", words: ["FROST", "SNOW", "GLOVES", "SCARF", "SKATE", "COAT"], seed: "staged-test-2026", rows: 12, columns: 12, directions: ["E", "S"], difficulty: "easy", alphabetPack: "latin", allowOverlap: true, answerKeyAvailable: true, onlinePlayAvailable: true, printableAvailable: true, pdfAvailable: true, largePrintSuitable: true }
};

describe("staged technical validation", () => {
  test("freezes the actual deterministic request, grid and answers", () => {
    const a = validateStaged([sample]); const b = validateStaged([sample]);
    expect(a.issues).toEqual([]);
    expect(a.freezes[0].requestSha256).toEqual(b.freezes[0].requestSha256);
    expect(a.freezes[0].gridSha256).toEqual(b.freezes[0].gridSha256);
    expect(a.freezes[0].answerSha256).toEqual(b.freezes[0].answerSha256);
    expect(validateStaged([{ ...sample, puzzle: { ...sample.puzzle, seed: "different" } }]).freezes[0].gridSha256).not.toEqual(a.freezes[0].gridSha256);
  });
  test("rejects malformed schema, unsupported words, duplicate tokens and utility paths", () => {
    expect(validateStaged([{ ...sample, approval: { reviewer: "fake" } }]).issues[0].stage).toBe("schema");
    expect(validateStaged("bad").issues[0].code).toBe("candidate-array");
    expect(validateStaged(Array(21).fill(sample)).issues[0].code).toBe("candidate-array");
    const bad = { ...sample, proposedPath: "/play/state", puzzle: { ...sample.puzzle, words: ["ice cream", "icecream", "SNOW!", "☃"] } };
    expect(validateStaged([bad]).issues.map((i) => i.code)).toEqual(expect.arrayContaining(["puzzle-path", "normalized-duplicate", "unsupported-characters", "unsupported-word"]));
  });
  test("compares candidate word sets using generator tokens rather than spacing", () => {
    const left = { ...sample, puzzle: { ...sample.puzzle, words: ["SNOWGLOBE", "FROST"] } };
    const right = { ...sample, id: "other", proposedPath: "/word-searches/holidays/another-test", intent: "Different intent", title: "Another", puzzle: { ...sample.puzzle, puzzleTitle: "Another", seed: "other", words: ["SNOW GLOBE", "FROST"] } };
    expect(validateStaged([left, right]).issues.map((i) => i.code)).toContain("duplicate-token-sets");
  });
  test("checks category, collisions, dimensions and incomplete placement", () => {
    const bad = { ...sample, proposedPath: "/word-searches/animals/dog-word-search", taxonomy: { primaryCategory: "holiday-word-searches" }, puzzle: { ...sample.puzzle, rows: 6, columns: 6, words: ["EXTRALONGWORD"] } };
    expect(validateStaged([bad]).issues.map((i) => i.code)).toEqual(expect.arrayContaining(["category-path", "duplicate-path", "excluded-word"]));
  });
  test("detects candidate exposure in generated indexed HTML, sitemap, search and files", () => {
    const dir = mkdtempSync(join(tmpdir(), "staged-export-"));
    try {
      mkdirSync(join(dir, "word-searches", "holidays"), { recursive: true });
      writeFileSync(join(dir, "sitemap.xml"), "<urlset />");
      writeFileSync(join(dir, "search-index.json"), "[]");
      writeFileSync(join(dir, "index.html"), `<a href="${sample.proposedPath}">leak</a>`);
      expect(inspectCandidateExport([sample.proposedPath], dir)[0].code).toBe("exported-candidate");
      writeFileSync(join(dir, "index.html"), "<html>safe</html>");
      expect(inspectCandidateExport([sample.proposedPath], dir)).toEqual([]);
      writeFileSync(join(dir, "word-searches", "holidays", "staged-test-word-search.html"), "draft");
      expect(inspectCandidateExport([sample.proposedPath], dir)[0].code).toBe("exported-candidate");
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
  test("inspects real Letter and A4 PDFs with answer pages", async () => {
    const output = await inspectCandidatePdfs(validateStaged([sample]).freezes[0]);
    expect(output.issues).toEqual([]);
    expect(output.evidence).toHaveLength(2);
  });
});
