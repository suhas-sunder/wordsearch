import type { StagedPuzzleCandidate } from "@/content/staged/model";
import { christmasCandidates } from "@/content/staged/christmas";
import { winterSeasonalCandidates } from "@/content/staged/winter-seasonal";
import { evergreenPilotCandidates } from "@/content/staged/evergreen-pilot";
import { evergreenHardBatch } from "@/content/staged/evergreen-hard-batch";
import { seasonalClassroomCandidates } from "@/content/staged/seasonal-classroom";
import { teacherSubjectCandidates } from "@/content/staged/teacher-subjects";
import { calendarGapCandidates } from "@/content/staged/calendar-gap-candidates";
import { largePrintDraftSelections } from "@/content/staged/large-print-selections";
import { preservedGrowthEnhancements } from "@/content/staged/preserved-growth-enhancements";

export interface EditorialAssetReference {
  id: string;
  kind: "puzzle-candidate" | "utility-selection" | "existing-draft-enhancement" | "review-package";
  title: string;
  sourceFile: string;
  pr: number;
  contentCommit: string;
  technicalEvidence: "recorded-in-draft-pr";
  editorialStatus: "unreviewed";
  publicationAuthorized: false;
  proposedPath?: string;
  targetCanonicalPath?: string;
  hypotheticalNewIndexableUrls: 0 | 1;
}

const batches: Array<{ candidates: StagedPuzzleCandidate[]; sourceFile: string; pr: number; contentCommit: string }> = [
  { candidates: christmasCandidates, sourceFile: "content/staged/christmas.ts", pr: 80, contentCommit: "bd6f2d12098968c094cdd05eba122fe5b59b2c46" },
  { candidates: evergreenPilotCandidates, sourceFile: "content/staged/evergreen-pilot.ts", pr: 26, contentCommit: "f34b75a7487ac67a87ef70a2316a099726bac727" },
  { candidates: winterSeasonalCandidates, sourceFile: "content/staged/winter-seasonal.ts", pr: 29, contentCommit: "245845f03d5c9ba32748df9fdc2cd119148406d6" },
  { candidates: seasonalClassroomCandidates, sourceFile: "content/staged/seasonal-classroom.ts", pr: 80, contentCommit: "bd6f2d12098968c094cdd05eba122fe5b59b2c46" },
  { candidates: evergreenHardBatch, sourceFile: "content/staged/evergreen-hard-batch.ts", pr: 40, contentCommit: "7898813bb73fa8d2416cef8380aa0c613eea17a4" },
  { candidates: teacherSubjectCandidates, sourceFile: "content/staged/teacher-subjects.ts", pr: 41, contentCommit: "b687815c533b5805034045a127bc3a2d2ab75843" },
  { candidates: calendarGapCandidates, sourceFile: "content/staged/calendar-gap-candidates.ts", pr: 80, contentCommit: "bd6f2d12098968c094cdd05eba122fe5b59b2c46" }
];

export const allEditorialPuzzleCandidates = batches.flatMap(({ candidates }) => candidates);

const evidence = { technicalEvidence: "recorded-in-draft-pr", editorialStatus: "unreviewed", publicationAuthorized: false } as const;

export const editorialAssetReferences: EditorialAssetReference[] = [
  ...batches.flatMap(({ candidates, sourceFile, pr, contentCommit }) => candidates.map((candidate): EditorialAssetReference => ({ id: candidate.id, title: candidate.title, kind: "puzzle-candidate", sourceFile, pr, contentCommit, proposedPath: candidate.proposedPath, hypotheticalNewIndexableUrls: 1, ...evidence }))),
  ...largePrintDraftSelections.map(({ id, title }): EditorialAssetReference => ({ id, title, kind: "utility-selection", sourceFile: "content/staged/large-print-selections.ts", pr: 46, contentCommit: "bd4832c706e8e4220b465805d8f366dc9e315db7", targetCanonicalPath: "/large-print-word-searches", hypotheticalNewIndexableUrls: 0, ...evidence })),
  ...preservedGrowthEnhancements.map(({ id, title, targetCanonicalPath }): EditorialAssetReference => ({ id, title, kind: "existing-draft-enhancement", sourceFile: "content/staged/preserved-growth-enhancements.ts", pr: 53, contentCommit: "11e492098eaeeb9259ce98ed8b35c75558ba1760", targetCanonicalPath, hypotheticalNewIndexableUrls: 1, ...evidence })),
  { id: "PACKAGE-CLASSROOM", title: "5/10/20 student worksheets and answer packets", kind: "review-package", sourceFile: "docs/releases/BUILDOUT-CLASSROOM-EXPORTS.md", pr: 38, contentCommit: "37b4e526cffa15eb8ae7b4a0702127ab32c77b0a", hypotheticalNewIndexableUrls: 0, ...evidence },
  { id: "PACKAGE-ANNUAL", title: "Fourteen source-only annual pack compositions", kind: "review-package", sourceFile: "docs/releases/BUILDOUT-ANNUAL-PACKS.md", pr: 49, contentCommit: "6ca81e11b45e1fe8591334dd241f6af54287eebd", hypotheticalNewIndexableUrls: 0, ...evidence },
  { id: "PACKAGE-MONITORING", title: "Offline cohort measurement and monitoring", kind: "review-package", sourceFile: "docs/releases/BUILDOUT-B10.md", pr: 18, contentCommit: "5b4d857f910571e6f17a69a18f9f9a333e512416", hypotheticalNewIndexableUrls: 0, ...evidence }
];
