import { allStagedCandidates, stagedCandidateGroups } from "@/content/staged/catalog";
import { largePrintDraftSelections } from "@/content/staged/large-print-selections";
import { preservedGrowthEnhancements } from "@/content/staged/preserved-growth-enhancements";
import { routeInventory } from "@/content/registry";
import { auditCandidates } from "@/lib/content/candidates";
import { readSourceInventory } from "@/lib/content/inventory";
import { validateStaged } from "@/lib/content/staged-validation";
import { inspectCandidateExport, inspectCandidatePdfs } from "@/lib/content/staged-output";

const redirects = readSourceInventory().redirects.map(({ source }) => source);
const crossIssues = auditCandidates(allStagedCandidates, routeInventory, redirects);
const validations = stagedCandidateGroups.map(({ id, candidates }) => ({ id, validation: validateStaged(candidates, redirects) }));
const pdfChecks = [];
if (process.argv.includes("--pdf")) for (const { validation } of validations) for (const freeze of validation.freezes) pdfChecks.push({ id: freeze.id, ...(await inspectCandidatePdfs(freeze)) });
const exportArg = process.argv.find((arg) => arg.startsWith("--export-dir="));
const exportChecked = process.argv.includes("--export") || exportArg !== undefined;
const exportIssues = exportChecked ? inspectCandidateExport(allStagedCandidates.map(({ proposedPath }) => proposedPath), exportArg?.slice("--export-dir=".length) || "out") : [];
const issues = [...crossIssues, ...validations.flatMap(({ validation }) => validation.issues), ...pdfChecks.flatMap(({ issues }) => issues), ...exportIssues];
console.log(JSON.stringify({
  candidateCount: allStagedCandidates.length,
  utilityOnlyLargePrintSelections: largePrintDraftSelections.length,
  preservedOwnerProposalCount: preservedGrowthEnhancements.length,
  preservedOwnerExistingDraftCount: preservedGrowthEnhancements.filter(({ targetKind }) => targetKind === "existing-draft").length,
  preservedOwnerNewPathProposalCount: preservedGrowthEnhancements.filter(({ targetKind }) => targetKind === "proposed-new-path").length,
  preservedOwnerEnhancements: preservedGrowthEnhancements.map(({ id, targetCanonicalPath, targetKind, sourceFileSha256, newIndexableUrlAllowance }) => ({ id, targetCanonicalPath, targetKind, sourceFileSha256, newIndexableUrlAllowance, validationReference: "tests/content/calendar-gap-candidates.test.ts: source preservation and real Letter/A4 PDF tests" })),
  editorialApproval: false, publicationAuthorized: false,
  groups: validations.map(({ id, validation }) => ({ id, count: validation.freezes.length, fingerprints: validation.freezes.map(({ id, requestSha256, gridSha256, answerSha256 }) => ({ id, requestSha256, gridSha256, answerSha256 })) })),
  pdfChecked: process.argv.includes("--pdf"), pdfCandidateCount: pdfChecks.length,
  pdfScope: "Main staged-candidate catalog only. Larger-type utilities and preserved owner proposals have separate measured tests; counts are not a claim this command reran them.",
  exportChecked, issues
}, null, 2));
if (issues.length) process.exitCode = 1;
