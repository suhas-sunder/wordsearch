import type { EditorialNote, PublicCopyProposal } from "./model";

const commit = "a0df44f6bdaccd1ecd72e34ff0bd32a65fa01d80";
const scopeEvidence = "Fresh production 471a118 and review a0df44f HTTP captures, 217 URLs each, verified 2026-11-12 against all 434 response hashes. Scripts/styles/head/SVG excluded, HTML entities decoded and whitespace normalized; exact body-text scope matches retained C4 semantic observations. Evidence: quality/http/capture.json and quality/pilot-fresh-scope.json in the current external evidence root. This is source-rendered HTTP text verification, not hydrated browser or visual acceptance; recheck scope after an approved runtime patch.";

const ancientEgypt = {
  file: "content/curated-topics-prompt6.ts",
  field: "context",
  recordId: "ancient-egypt-word-search",
  commit
};
const hardAngle = {
  file: "content/collections.ts",
  field: "angle",
  recordId: "hard-printable-word-searches",
  commit
};
const hardGuidance = { ...hardAngle, field: "selectionGuidance" };
const homophones = {
  file: "content/curated-topics-prompt6.ts",
  field: "introduction",
  recordId: "homophones-word-search",
  commit
};
const answerGuide = {
  file: "content/guides.ts",
  field: "sections[Verify each placed coordinate path].body",
  recordId: "how-to-make-a-word-search-with-answer-key",
  commit
};

export const editorialNotes: readonly EditorialNote[] = [
  {
    id: "ancient-egypt-factual-scope",
    subjectId: ancientEgypt.recordId,
    source: ancientEgypt,
    constraints: [{ kind: "factual", text: "The page is a general historical vocabulary review and should avoid unsupported dates, sensational claims, or fictional portrayals." }]
  },
  {
    id: "hard-collection-publication-boundary",
    subjectId: hardAngle.recordId,
    source: hardAngle,
    constraints: [{ kind: "quality", text: "Preserve the existing published Hard selection and exclude unfinished drafts. The original public sentence was: Every fully reviewed Hard puzzle is included; unfinished drafts are excluded. This note preserves the publication constraint without asserting new human approval." }]
  },
  {
    id: "hard-collection-inventory-explanation",
    subjectId: hardGuidance.recordId,
    source: hardGuidance,
    constraints: [{ kind: "quality", text: "The inventory is deliberately smaller because no unfinished hard draft is included. Keep this historical inventory rationale internal; do not add or publish draft puzzles to enlarge the collection." }]
  },
  {
    id: "homophones-group-count",
    subjectId: homophones.recordId,
    source: homophones,
    constraints: [{ kind: "factual", text: "The frozen sixteen-word bank forms seven sound groups: THERE/THEIR/THEYRE; TO/TOO/TWO; SEA/SEE; RIGHT/WRITE; SON/SUN; PEAR/PAIR; NIGHT/KNIGHT. Preserve the original bank and normalization; correct the introductory count only." }]
  },
  {
    id: "answer-guide-path-integrity",
    subjectId: answerGuide.recordId,
    source: answerGuide,
    constraints: [{ kind: "quality", text: "For every word, confirm the recorded start cell, direction, and ordered cells spell the normalized term. Excluded words must be reported rather than shown as if they have an answer." }]
  }
];

export const publicCopyProposals: readonly PublicCopyProposal[] = [
  {
    id: "pilot-homepage-ancient-egypt-context",
    noteIds: ["ancient-egypt-factual-scope"],
    target: ancientEgypt,
    before: "The page is a general historical vocabulary review and should avoid unsupported dates, sensational claims, or fictional portrayals.",
    after: "This general historical vocabulary review includes the Nile, pyramids, hieroglyphs, scribes, and ancient Egyptian religious vocabulary.",
    reason: "Replace editor-directed constraints with actual vocabulary selection help; preserve the general historical subject, all twenty words, seed, introduction, H1 and metadata. The shared context changes more than the homepage card, including the sensitive hard collection.",
    classification: "D",
    affectedPaths: [
      "/",
      "/categories",
      "/categories/history-word-searches",
      "/collections/hard-printable-word-searches",
      "/collections/history-word-search-worksheets",
      "/collections/word-searches-with-answer-keys",
      "/word-searches/history/ancient-egypt-word-search"
    ],
    scopeEvidence: `${scopeEvidence} Seven indexed URLs, nine body-text occurrences in each fresh endpoint; the puzzle page contains three occurrences. Search-data reuse is additional nonindexable scope.`,
    decision: { status: "pending-owner-review" }
  },
  {
    id: "pilot-hard-collection-angle",
    noteIds: ["hard-collection-publication-boundary"],
    target: hardAngle,
    before: "Every fully reviewed Hard puzzle is included; unfinished drafts are excluded.",
    after: "Choose a Hard puzzle to print or play online.",
    reason: "Replace draft-status narration with a direct choice while leaving the topical description and useful difficulty guidance intact. High historical traffic makes this an explicit owner-held correction.",
    classification: "D",
    affectedPaths: ["/collections/hard-printable-word-searches"],
    scopeEvidence: `${scopeEvidence} One indexed URL and one occurrence per fresh endpoint.`,
    decision: { status: "pending-owner-review" }
  },
  {
    id: "pilot-hard-collection-guidance",
    noteIds: ["hard-collection-inventory-explanation"],
    target: hardGuidance,
    before: "Hard puzzles use an 18 × 18 grid, twenty terms, overlap, and every straight direction. The inventory is deliberately smaller because no unfinished hard draft is included.",
    after: "Hard puzzles use an 18 × 18 grid, twenty terms, overlap, and every straight direction.",
    reason: "Delete only the internal draft-inventory explanation. Preserve the complete useful first sentence, sixteen children and original puzzle definitions.",
    classification: "D",
    affectedPaths: ["/collections/hard-printable-word-searches"],
    scopeEvidence: `${scopeEvidence} One indexed URL and one occurrence per fresh endpoint; overlaps the angle proposal rather than adding a second affected URL.`,
    decision: { status: "pending-owner-review" }
  },
  {
    id: "pilot-homophones-introduction",
    noteIds: ["homophones-group-count"],
    target: homophones,
    before: "Search for eight sets or pairs of words that sound alike while differing in spelling or meaning.",
    after: "Search for seven sets or pairs of words that sound alike while differing in spelling or meaning.",
    reason: "Correct one demonstrably incorrect count: two triples and five pairs form seven groups, not eight. No word bank, normalization, placement, difficulty, metadata or share definition changes.",
    classification: "F",
    affectedPaths: ["/word-searches/language-arts/homophones-word-search"],
    scopeEvidence: `${scopeEvidence} One indexed URL and one occurrence per fresh endpoint.`,
    decision: { status: "pending-owner-review" }
  },
  {
    id: "pilot-answer-guide-verification",
    noteIds: ["answer-guide-path-integrity"],
    target: answerGuide,
    before: "For every word, confirm the recorded start cell, direction, and ordered cells spell the normalized term. Excluded words must be reported rather than shown as if they have an answer.",
    after: "Choose Show Answers and check that each highlighted line spells a listed word. If the builder reports excluded words, review them before printing; adjust the word list or grid settings if you need every original word included.",
    reason: "Give visitors a real control and an observable check instead of developer instructions about stored coordinates. Keep the existing section heading and all metadata; preserve exclusion and matching-answer requirements internally.",
    classification: "D",
    affectedPaths: ["/guides/how-to-make-a-word-search-with-answer-key"],
    scopeEvidence: `${scopeEvidence} One indexed URL and one body occurrence per fresh endpoint. The current Show Answers control and Excluded list were verified in source; browser task acceptance is separate.`,
    decision: { status: "pending-owner-review" }
  }
];
