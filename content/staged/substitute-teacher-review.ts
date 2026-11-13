/** Source-only curation of an existing packet, not a new puzzle or public collection. */
export const substituteTeacherReview = {
  id: "T12",
  existingDraftPath: "/collections/substitute-teacher-word-searches",
  title: "Substitute Folder — Mixed Subject Review",
  sourcePackId: "math-science-history-5",
  purpose: "A reusable folder of five different subject-vocabulary worksheets for a teacher to inspect and select. It reuses exact existing drafts, not five random versions of one word list or a prescribed lesson sequence.",
  selectionGuidance: [
    "Read each full word bank and direction set before selecting any worksheet. Subject labels and medium difficulty do not establish a learner's age, grade or prior knowledge.",
    "Select only the sheet that fits the group's actual vocabulary and current work. The packet is a choice of companions, not a claim that every class should complete all five.",
    "Supply any explanations, example chart or source document yourself after reviewing suitability. The word searches do not teach definitions, assess mastery or replace a lesson plan."
  ],
  printingInstructions: [
    "Choose Letter or A4 at actual size, then print students-only pages for distribution and keep the separate answers-only packet with the teacher.",
    "Keep each worksheet's title and matching answer page together when selecting a subset; do not reuse a key from another seed or subject.",
    "Retain the exact source title, words and seed when reopening a worksheet. These drafts remain unapproved; this review is not permission to publish the existing collection."
  ],
  worksheets: [
    { sourceId: "T08-A", purpose: "Probability language", selectionNote: "Includes formal labels and everyday likelihood words. Select only when the teacher can provide the intended mathematical context; finding a word does not establish probability understanding." },
    { sourceId: "T08-B", purpose: "Charts and data", selectionNote: "Pairs graph-part and display vocabulary with a teacher-chosen example. The sheet contains no chart, numerical dataset or instructions for drawing conclusions." },
    { sourceId: "T09-A", purpose: "Weather observations", selectionNote: "Distinguishes instrument names from quantities. It supplies vocabulary, not operating instructions or a claim that any instrument alone predicts weather." },
    { sourceId: "T09-B", purpose: "Cell structures", selectionNote: "Includes structures from different cell types. Choose a suitable prior explanation; do not imply that all cells contain every listed structure." },
    { sourceId: "T10-A", purpose: "Primary source investigation", selectionNote: "Uses observe, reflect and question alongside source/context terms. The teacher selects an appropriate historical source; the puzzle makes no automatic reliability or historical-fact judgment." }
  ],
  audienceSuitabilityApproved: false,
  worksheetReuseApproved: false,
  collectionEditorialApproved: false,
  ownerPublicationApproved: false,
  runtimeImportAllowed: false,
  publicationAuthorized: false,
  newIndexableUrlAllowance: 0
} as const;
