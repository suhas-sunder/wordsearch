/** Offline editorial assets only. Never import this module into runtime catalogs. */
export interface CollectionReviewChild {
  source: "published" | "staged";
  id: string;
  canonicalPath: string;
  selectionGuidance: string;
  reviewQuestions: string[];
  collectionFitApproved: boolean;
  audienceSuitabilityApproved: boolean;
  reuseApproved: boolean;
}

export interface StagedCollectionReview {
  id: "X05" | "X06";
  proposedPath: string;
  title: string;
  status: "draft";
  audience: "general" | "children-pending-review";
  introduction: string;
  selectionGuidance: string[];
  classroomInstructions: string[];
  excludedSelections: { id: string; reason: string }[];
  children: CollectionReviewChild[];
  minimumApprovedPublishedChildren: number;
  collectionEditorialApproved: boolean;
  ownerPublicationApproved: boolean;
  publicationAuthorized: false;
}

const pending = { collectionFitApproved: false, audienceSuitabilityApproved: false, reuseApproved: false };
const easy: CollectionReviewChild = {
  source: "staged", id: "X02", canonicalPath: "/word-searches/holidays/easy-christmas-word-search", ...pending,
  selectionGuidance: "Consider this forward-path draft when the solver wants twelve short entries in a 12×12 grid, searched left to right or top to bottom. Read the complete word bank first; short words alone do not establish reading level or child suitability.",
  reviewQuestions: ["Can the intended reader recognize and understand every selected word?", "Are the Christmas and winter associations appropriate to the specific group?", "Does the printed sheet remain practical for the intended reader at actual size?"]
};

export const christmasCollectionReviews: StagedCollectionReview[] = [
  {
    id: "X05", proposedPath: "/collections/christmas-traditions-word-searches", title: "Christmas Traditions Collection", status: "draft", audience: "general",
    introduction: "Compare an existing Christmas puzzle with two distinct unpublished configurations before choosing a worksheet. These lists concern familiar decorations, gifts and seasonal objects; they are not an account of how every family or culture celebrates Christmas.",
    selectionGuidance: [
      "Start with the actual word bank and directions, then choose a grid. The published medium label is not a promise of forward-only placement.",
      "Choose the X02 forward-path draft for fewer entries and two directions; choose X01 for its larger vocabulary and all eight directions. Neither configuration supplies an age recommendation.",
      "Keep the existing medium puzzle's canonical URL and seeded grid. These are comparisons of existing sources, not a reason to create format or difficulty copies.",
      "The proposed Traditions heading requires an editorial scope decision: the selected lists do not yet establish researched cultural or historical traditions. Narrow the collection title or add verified context before considering publication."
    ],
    classroomInstructions: ["Read each word list before distributing a sheet; participation and seasonal topics must fit the group.", "Print only the chosen student worksheet and retain its own matching answer page separately. Do not distribute this review document as a classroom packet.", "Use the existing shared definition or approved pack exporter for output; this collection does not introduce new puzzle seeds."],
    children: [
      { source: "published", id: "published:christmas-word-search", canonicalPath: "/word-searches/holidays/christmas-word-search", ...pending,
        selectionGuidance: "Reuse the unchanged published medium Christmas puzzle when its existing vocabulary and direction set suit the solver. Inspect the complete list rather than treating its family/classroom metadata as approval for every child or class.",
        reviewQuestions: ["Does this published puzzle fit the proposed collection's actual scope?", "Has reuse in this collection and the intended audience been independently reviewed?"] },
      easy,
      { source: "staged", id: "X01", canonicalPath: "/word-searches/holidays/christmas-hard-word-search", ...pending,
        selectionGuidance: "Consider this 18×18, twenty-entry draft for a solver who explicitly wants forward, reverse, vertical and diagonal placements. Preview unfamiliar terms such as poinsettia and festoon; do not assign it merely because a child has completed the shorter sheet.",
        reviewQuestions: ["Are the vocabulary, reverse paths and larger grid suitable for the actual audience?", "Does its distinct challenge justify inclusion alongside the existing medium puzzle?"] }
    ],
    excludedSelections: [{ id: "X04", reason: "Baking overlaps the published Baking puzzle. Resolve the recorded merge-or-differentiate decision; do not count it as an approved traditions child." }, { id: "X15", reason: "A seasonal snapshot is not automatically a researched tradition. Review the narrow object-vocabulary intent separately before expanding this collection." }],
    minimumApprovedPublishedChildren: 2, collectionEditorialApproved: false, ownerPublicationApproved: false, publicationAuthorized: false
  },
  {
    id: "X06", proposedPath: "/collections/christmas-word-searches-for-kids", title: "Christmas Word Searches for Kids — collection repair review", status: "draft", audience: "children-pending-review",
    introduction: "This is a review of the existing unpublished kids collection, not a completed child index. Only the X02 forward-path candidate is currently proposed for suitability review; it has not received child-audience approval.",
    selectionGuidance: ["Review X02's complete short-word list, two search directions and actual printed size with the intended audience. Do not infer a grade, age or learning outcome from its easy label.", "A collection needs multiple distinct, suitable, approved and published children. One promising draft is insufficient, even if the collection copy is complete.", "Do not add the existing medium or the hard Christmas puzzle to satisfy a numeric quota. A reviewer may choose a future independently justified child only after assessing its actual vocabulary and practical task."],
    classroomInstructions: ["An adult selecting material should check the seasonal context and vocabulary against the actual group before use.", "When a child is approved, keep its answer page separate and offer the exact same seeded worksheet; do not silently simplify its grid for this hub.", "Until multiple suitable children and this repair are separately approved, retain the current draft/noindex behavior and omit the proposed index from navigation and sitemap."],
    children: [{ ...easy, reviewQuestions: [...easy.reviewQuestions] }],
    excludedSelections: [{ id: "published:christmas-word-search", reason: "Published medium status and family/classroom metadata do not establish child-audience suitability for this collection." }, { id: "X01", reason: "No child-suitability evidence supports forcing this harder all-direction puzzle into the kids collection." }, { id: "X04", reason: "No child-suitability approval and an unresolved duplicate-intent decision." }, { id: "X15", reason: "No independent child-suitability approval; do not pad the index with another seasonal label." }],
    minimumApprovedPublishedChildren: 2, collectionEditorialApproved: false, ownerPublicationApproved: false, publicationAuthorized: false
  }
];
