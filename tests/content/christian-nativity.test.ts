import { createHash } from "node:crypto";
import { describe, expect, test } from "vitest";
import { christianNativityCandidates, christianNativityDraftStatus } from "@/content/staged/christian-nativity";
import { allStagedCandidates, stagedCandidateGroups } from "@/content/staged/catalog";
import { routeInventory, getSitemapRecords } from "@/content/registry";
import { searchCatalog } from "@/lib/search/catalog";
import { validateStaged } from "@/lib/content/staged-validation";
import { auditCandidates } from "@/lib/content/candidates";
import { readSourceInventory } from "@/lib/content/inventory";
import { inspectCandidatePdfs } from "@/lib/content/staged-output";
import { generatePuzzle } from "@/lib/puzzle/generate";

const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");

describe("X09 remains a separate unapproved Christian vocabulary source draft", () => {
  test("preserves every original sixty-candidate record and generation fingerprint", () => {
    const originalGroups = stagedCandidateGroups.filter(({ id }) => id !== "christian-nativity");
    const originalCandidates = originalGroups.flatMap(({ candidates }) => candidates);
    expect(originalCandidates).toHaveLength(60);
    expect(hash(originalCandidates)).toBe("a574caba61b3810795c82637ce0abfc0e1530c97fb86e78efbe64d19452fd966");
    const validations = originalGroups.map(({ candidates }) => validateStaged(candidates));
    expect(validations.flatMap(({ issues }) => issues)).toEqual([]);
    expect(hash(validations.flatMap(({ freezes }) => freezes).map(({ id, requestSha256, gridSha256, answerSha256 }) => ({ id, requestSha256, gridSha256, answerSha256 })))).toBe("576a0ff590c19ef3a033f9321404d4321b807d9a633e1de7001e7063b5fc19e4");
  });

  test("validates all intended words and rejects catalog/path/intent collisions", () => {
    expect(allStagedCandidates).toHaveLength(61);
    expect(christianNativityCandidates).toHaveLength(1);
    expect(auditCandidates(allStagedCandidates, routeInventory, readSourceInventory().redirects.map(({ source }) => source))).toEqual([]);
    const validation = validateStaged(christianNativityCandidates);
    expect(validation.issues).toEqual([]);
    expect(validation.freezes.map(({ id, requestSha256, gridSha256, answerSha256 }) => ({ id, requestSha256, gridSha256, answerSha256 }))).toEqual([{
      id: "X09",
      requestSha256: "cd3cfc940379537d851cf627764bab2721effcb02e6be5421f529d8519d3460c",
      gridSha256: "9209f28bddd6703e92db9a932b30b090d98f67bba3c029bdbd1456eac1ef08f9",
      answerSha256: "edb9503544ade393f3381d577ed5ef567c15640164a5f84ac52f6e4286954509"
    }]);
    const result = validation.freezes[0].result;
    expect(result.placed).toHaveLength(16);
    expect(result.excluded).toEqual([]);
    expect(result.warnings).toEqual([]);
    expect(generatePuzzle(result.request).grid).toEqual(result.grid);
    expect(generatePuzzle(result.request).placed).toEqual(result.placed);
    for (const placement of result.placed) expect(placement.cells.map(({ row, col }) => result.grid[row][col])).toEqual(placement.tokens);
  });

  test("retains distinct answer vocabulary against published and all earlier source banks", () => {
    const words = new Set(christianNativityCandidates[0].puzzle.words);
    const priorBanks = [
      ...routeInventory.filter(record => record.contentType === "puzzle" && record.publicationStatus === "published").map(record => record.contentType === "puzzle" ? record.puzzle.words : []),
      ...allStagedCandidates.filter(({ id }) => id !== "X09").map(({ puzzle }) => puzzle.words)
    ];
    for (const bank of priorBanks) expect(bank.filter(word => words.has(word)).length).toBeLessThanOrEqual(1);
  });

  test("does not infer faith review, editorial approval, publication or runtime exposure", () => {
    const candidate = christianNativityCandidates[0];
    expect(christianNativityDraftStatus).toEqual({ runtimeImportAllowed: false, editorialApproval: false, publicationAuthorized: false, newIndexableUrlAllowance: 0, faithReview: "pending", x10AroundTheWorld: "research-only-not-authored" });
    expect(Object.hasOwn(candidate, "approval")).toBe(false);
    expect(candidate.puzzle.largePrintSuitable).toBe(false);
    expect(routeInventory.some(({ canonicalPath }) => canonicalPath === candidate.proposedPath)).toBe(false);
    expect(getSitemapRecords().some(({ canonicalPath }) => canonicalPath === candidate.proposedPath)).toBe(false);
    expect(searchCatalog.some(({ href }) => href === candidate.proposedPath)).toBe(false);
    expect(candidate.sourceReferences.map(({ url }) => url)).toEqual(["https://bible.usccb.org/bible/luke/2", "https://bible.usccb.org/bible/matthew/2"]);
  });

  test("measures actual Letter/A4 student banks, identical teacher grids and all answer paths", async () => {
    const freeze = validateStaged(christianNativityCandidates).freezes[0];
    const report = await inspectCandidatePdfs(freeze);
    expect(report.issues).toEqual([]);
    expect(report.evidence.map(evidence => "paperSize" in evidence ? evidence.paperSize : undefined)).toEqual(["letter", "a4"]);
    for (const evidence of report.evidence) {
      expect("pages" in evidence ? evidence.pages : undefined).toBe(2);
      expect("minGridGlyphPt" in evidence ? evidence.minGridGlyphPt : undefined).toBeGreaterThanOrEqual(9);
      expect("minWordBankPt" in evidence ? evidence.minWordBankPt : undefined).toBeGreaterThanOrEqual(9.5);
    }
  });
});
