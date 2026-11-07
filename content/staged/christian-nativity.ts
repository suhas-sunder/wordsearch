import type { StagedPuzzleCandidate } from "@/content/staged/model";

/** Offline editorial draft only. No faith-category launch or publication approval. */
export const christianNativityCandidates: StagedPuzzleCandidate[] = [{
  id: "X09",
  proposedPath: "/word-searches/holidays/christian-nativity-word-search",
  intent: "An explicitly Christian Nativity and infancy-narrative vocabulary companion, identifying Luke 2 and Matthew 2 separately. Its people, places and narrative terms differ from the existing decorations-and-gifts Christmas bank; no universal belief, merged chronology or Advent lesson is implied.",
  title: "Christian Nativity Word Search",
  status: "drafted",
  sourceReferences: [
    {
      title: "USCCB: Luke, chapter 2",
      url: "https://bible.usccb.org/bible/luke/2",
      note: "Primary Christian text in an identified Catholic translation, read in full for the birth/shepherd narrative: Jesus, Mary, Joseph, Bethlehem, Nazareth, manger, shepherds, flock, angel and swaddling. Vocabulary and original paraphrases only; no passage or commentary is reproduced."
    },
    {
      title: "USCCB: Matthew, chapter 2",
      url: "https://bible.usccb.org/bible/matthew/2",
      note: "Primary Christian infancy narrative, read in full for Magi, star, gold, frankincense, myrrh and dream. The passage describes a house and does not name or number the Magi; do not merge this visit with Luke's manger/shepherd scene."
    }
  ],
  puzzle: {
    puzzleTitle: "Christian Nativity Word Search",
    words: ["JESUS", "MARY", "JOSEPH", "BETHLEHEM", "NAZARETH", "MANGER", "SHEPHERDS", "FLOCK", "ANGEL", "SWADDLING", "MAGI", "GOLD", "FRANKINCENSE", "MYRRH", "STAR", "DREAM"],
    seed: "staged-x09-christian-nativity-v1",
    rows: 16,
    columns: 16,
    directions: ["E", "S", "SE", "SW"],
    allowOverlap: true,
    alphabetPack: "latin",
    difficulty: "medium",
    answerKeyAvailable: true,
    onlinePlayAvailable: true,
    printableAvailable: true,
    pdfAvailable: true,
    largePrintSuitable: false
  },
  editorial: {
    puzzleNote: "This faith-specific draft uses vocabulary from Christian birth and infancy narratives. It is a search companion to identified texts, not a statement that everyone celebrates Christmas or shares these beliefs.",
    difficultyExplanation: "Medium describes sixteen entries in a 16×16 grid with horizontal, vertical and diagonal paths. Frankincense and swaddling are longer vocabulary; no age, grade, reading-level or completion-time claim is made.",
    wordListContext: "Luke 2 supplies the manger and shepherd narrative, including Mary, Joseph, Bethlehem, Nazareth, flock, angel and swaddling. Matthew 2 supplies the Magi's visit, star, gifts of gold, frankincense and myrrh, and a dream. These are distinct textual accounts, not a single asserted chronology; Matthew describes a house and does not state the number or names of the Magi.",
    classroomNote: "Choose this explicitly Christian vocabulary only where the context is appropriate. Faith-literate editorial and audience review remain outstanding. Advent preparation and denomination-specific wreath customs are outside this bank; it is not a general holiday or universal classroom lesson.",
    printNote: "Validate ordinary Letter and A4 student and answer pages at actual size. This candidate makes no measured-large-print, physical-printer or low-vision certification claim."
  },
  taxonomy: {
    primaryCategory: "holiday-word-searches",
    secondaryCategories: ["christmas", "printable-word-searches"],
    audience: ["general"],
    format: ["printable", "pdf", "answer-key", "online-play"]
  }
}];

export const christianNativityDraftStatus = {
  runtimeImportAllowed: false,
  editorialApproval: false,
  publicationAuthorized: false,
  newIndexableUrlAllowance: 0,
  faithReview: "pending",
  x10AroundTheWorld: "research-only-not-authored"
} as const;
