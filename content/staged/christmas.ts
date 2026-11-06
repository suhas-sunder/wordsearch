import type { StagedPuzzleCandidate } from "@/content/staged/model";
import type { PuzzleContentRecord } from "@/content/model";

/**
 * Frozen source-only Christmas candidates. These records are intentionally not
 * imported by the runtime registry, topic catalog, collections, or search index.
 * Technical validation does not constitute human editorial approval.
 */
export const christmasCandidates: StagedPuzzleCandidate[] = [
  {
    id: "X01",
    proposedPath: "/word-searches/holidays/christmas-hard-word-search",
    intent: "A genuinely harder Christmas challenge with a distinct 20-word vocabulary, 18x18 grid, and all eight search directions. It is a separate puzzle from the published 16-word medium Christmas puzzle.",
    title: "Hard Christmas Word Search",
    status: "drafted",
    sourceReferences: [
      {
        title: "Merriam-Webster Dictionary: poinsettia",
        url: "https://www.merriam-webster.com/dictionary/poinsettia",
        note: "Spelling reference for a seasonal plant term; no botanical or historical claims are made."
      },
      {
        title: "Collins English Dictionary: snow globe",
        url: "https://www.collinsdictionary.com/us/dictionary/english/snow-globe",
        note: "Confirms the conventional open-compound spelling used in the printable word bank."
      },
      {
        title: "Cambridge Dictionary: gift wrap",
        url: "https://dictionary.cambridge.org/us/dictionary/english/gift-wrap",
        note: "Confirms the conventional open-compound noun spelling used in the printable word bank."
      },
      {
        title: "Government of Canada TERMIUM Plus: sleigh bell",
        url: "https://www.btb.termiumplus.gc.ca/tpv2alpha/alpha-eng.html?i=&index=ent&lang=eng&srchtxt=SLEIGH-BELL",
        note: "Terminology entry lists sleigh bell as the English term; no instrument-history claims are made."
      },
      {
        title: "Collins English Dictionary: paper chain",
        url: "https://www.collinsdictionary.com/dictionary/english/paper-chain",
        note: "Confirms the conventional two-word spelling."
      },
      {
        title: "Merriam-Webster Dictionary browse list: pine cone",
        url: "https://scrabble.m-w.com/browse/dictionary/p/43",
        note: "Dictionary browse list uses the open-compound spelling."
      }
    ],
    puzzle: {
      puzzleTitle: "Hard Christmas Word Search",
      words: [
        "EVERGREEN", "MISTLETOE", "POINSETTIA", "NUTCRACKER", "SNOW GLOBE",
        "TINSEL", "GARLAND", "GIFT WRAP", "PEPPERMINT", "CRANBERRY",
        "SLEIGH BELL", "YULETIDE", "MIDWINTER", "CANDLELIGHT", "FIREPLACE",
        "CHIMNEY", "TREE SKIRT", "PINE CONE", "PAPER CHAIN", "FESTOON"
      ],
      seed: "staged-x01-christmas-hard-v1",
      rows: 18,
      columns: 18,
      directions: ["E", "W", "S", "N", "SE", "SW", "NE", "NW"],
      allowOverlap: true,
      alphabetPack: "latin",
      difficulty: "hard",
      answerKeyAvailable: true,
      onlinePlayAvailable: true,
      printableAvailable: true,
      pdfAvailable: true,
      largePrintSuitable: false
    },
    editorial: {
      puzzleNote: "A larger grid, twenty entries, and forward, reverse, vertical, and diagonal placements make this a harder search than the published medium Christmas puzzle.",
      difficultyExplanation: "Hard is based on the 18×18 grid, 20-word list, and all eight directions. Difficulty is a configuration description, not a measured time or guarantee.",
      wordListContext: "The words cover winter greenery, decorations, treats, gift wrapping, and familiar seasonal objects. The vocabulary is original to this candidate and does not use branded characters or franchises.",
      printNote: "Candidate output is intended for standard Letter and A4 print validation at actual size; no print measurement has been approved yet."
    },
    taxonomy: {
      primaryCategory: "holiday-word-searches",
      secondaryCategories: ["christmas", "printable-word-searches"],
      audience: ["general"],
      format: ["printable", "pdf", "answer-key", "online-play"],
      season: "winter"
    }
  },
  {
    id: "X02",
    proposedPath: "/word-searches/holidays/easy-christmas-word-search",
    intent: "A short, familiar-word Christmas puzzle with only forward horizontal and vertical paths. Vocabulary length supports an easy configuration, but no age or reading-level certification is claimed.",
    title: "Easy Christmas Word Search",
    status: "drafted",
    sourceReferences: [
      {
        title: "Merriam-Webster Dictionary: word entries",
        url: "https://www.merriam-webster.com/",
        note: "General spelling reference for ordinary English vocabulary; the list is a draft and has not received a readability review."
      }
    ],
    puzzle: {
      puzzleTitle: "Easy Christmas Word Search",
      words: ["STAR", "GIFT", "TREE", "SNOW", "BELL", "TOY", "JOY", "CARD", "RED", "BOW", "PIE", "SLED"],
      seed: "staged-x02-christmas-easy-v1",
      rows: 12,
      columns: 12,
      directions: ["E", "S"],
      allowOverlap: true,
      alphabetPack: "latin",
      difficulty: "easy",
      answerKeyAvailable: true,
      onlinePlayAvailable: true,
      printableAvailable: true,
      pdfAvailable: true,
      largePrintSuitable: false
    },
    editorial: {
      puzzleNote: "Twelve short entries and left-to-right or top-to-bottom placements keep this candidate simpler than the published medium puzzle.",
      difficultyExplanation: "Easy describes the short list, 12×12 grid, and forward-only directions. It does not certify suitability for a particular age or reading level.",
      wordListContext: "The draft list combines short words for decorations, gifts, winter weather, and a seasonal treat.",
      printNote: "Candidate output is intended for standard Letter and A4 print validation at actual size; no print measurement has been approved yet."
    },
    taxonomy: {
      primaryCategory: "holiday-word-searches",
      secondaryCategories: ["christmas", "easy-word-searches"],
      audience: ["general"],
      format: ["printable", "pdf", "answer-key", "online-play"],
      season: "winter"
    }
  },
  {
    id: "X04",
    proposedPath: "/word-searches/holidays/christmas-baking-word-search",
    intent: "A Christmas baking and kitchen vocabulary puzzle with ingredients, tools, and baked items, separate from generic decorations and gift vocabulary.",
    title: "Christmas Baking Word Search",
    status: "drafted",
    sourceReferences: [
      {
        title: "King Arthur Baking: Christmas Baking Guide",
        url: "https://www.kingarthurbaking.com/learn/guides/christmas-baking-guide",
        note: "Reviewed for ordinary baking and holiday-cookie vocabulary such as cookies, gingerbread, glaze, icing, flour, and tools. No recipe text or proprietary list was copied."
      },
      {
        title: "King Arthur Baking: Gingerbread Cookies Recipe",
        url: "https://www.kingarthurbaking.com/recipes/gingerbread-cookies-recipe",
        note: "Checked common ingredient and process terms (for example, cinnamon, ginger, flour, dough, whisk, and baking sheets); no recipe instructions or quantities are used."
      },
      {
        title: "Cambridge Dictionary: rolling pin",
        url: "https://dictionary.cambridge.org/us/dictionary/english/rolling-pin",
        note: "Confirms the conventional two-word kitchen-tool label."
      },
      {
        title: "Cambridge Dictionary: baking sheet",
        url: "https://dictionary.cambridge.org/dictionary/english/baking-sheet?topic=pots-and-pans",
        note: "Confirms the conventional two-word label used instead of a concatenated form."
      }
    ],
    puzzle: {
      puzzleTitle: "Christmas Baking Word Search",
      words: [
        "CINNAMON", "FLOUR", "DOUGH", "OVEN", "ICING", "COOKIE", "WHISK", "MIXER",
        "APRON", "ROLLING PIN", "SUGAR", "NUTMEG", "SPATULA", "BAKING SHEET", "SPRINKLE", "GINGER"
      ],
      seed: "staged-x04-christmas-baking-v1",
      rows: 15,
      columns: 15,
      directions: ["E", "S", "SE", "NE"],
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
      puzzleNote: "The words focus on baking ingredients, kitchen tools, dough, and cookies rather than seasonal decorations.",
      difficultyExplanation: "Medium describes a 15×15 grid, sixteen entries, and forward horizontal, vertical, and diagonal paths, including up and down diagonals.",
      wordListContext: "This draft uses ordinary baking vocabulary. The cited baking references support the topic and spelling checks only; this puzzle does not offer baking instructions or food-safety advice.",
      printNote: "Candidate output is intended for standard Letter and A4 print validation at actual size; no print measurement has been approved yet."
    },
    taxonomy: {
      primaryCategory: "holiday-word-searches",
      secondaryCategories: ["christmas", "food-word-searches", "kitchen-word-searches"],
      audience: ["general"],
      format: ["printable", "pdf", "answer-key", "online-play"],
      season: "winter"
    }
  },
  {
    id: "X11",
    proposedPath: "/word-searches/holidays/winter-cozy-activities-word-search",
    intent: "A winter vocabulary puzzle about indoor hobbies, textiles, and household objects. It uses words distinct from the published winter puzzle, though some categories overlap.",
    title: "Winter Cozy Activities Word Search",
    status: "drafted",
    sourceReferences: [
      {
        title: "Merriam-Webster Dictionary: word entries",
        url: "https://www.merriam-webster.com/",
        note: "General spelling reference for ordinary activity and household vocabulary; no health or wellbeing claim is made."
      }
    ],
    puzzle: {
      puzzleTitle: "Winter Cozy Activities Word Search",
      words: [
        "FLEECE", "FLANNEL", "HANDKNIT", "WOOLENS", "TEAPOT", "TEACUP", "READING", "STORYBOOK",
        "KNITTING", "CROCHET", "SLIPPERS", "QUILTING", "ARMCHAIR", "CRAFTING", "JIGSAW", "JOURNAL"
      ],
      seed: "staged-x11-winter-cozy-v1",
      rows: 15,
      columns: 15,
      directions: ["E", "S", "SE", "NE"],
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
      puzzleNote: "A winter-themed set of indoor reading, craft, textile, and tea vocabulary.",
      difficultyExplanation: "Medium describes a 15×15 grid, sixteen entries, and forward horizontal, vertical, and diagonal paths, including up and down diagonals.",
      wordListContext: "The list uses distinct answer words from the published winter puzzle while keeping an indoor winter theme.",
      printNote: "Candidate output is intended for standard Letter and A4 print validation at actual size; no print measurement has been approved yet."
    },
    taxonomy: {
      primaryCategory: "holiday-word-searches",
      secondaryCategories: ["winter", "hobbies", "indoor-activities"],
      audience: ["general"],
      format: ["printable", "pdf", "answer-key", "online-play"],
      season: "winter"
    }
  },
  {
    id: "X15",
    proposedPath: "/word-searches/holidays/christmas-gift-wrapping-word-search",
    intent: "A distinct Christmas gift-wrapping and mailing vocabulary candidate to complete a five-puzzle draft Christmas pack without treating winter or New Year assets as Christmas children.",
    title: "Christmas Gift-Wrapping Word Search",
    status: "drafted",
    sourceReferences: [
      {
        title: "Merriam-Webster Dictionary: word entries",
        url: "https://www.merriam-webster.com/",
        note: "General spelling reference for ordinary paper, parcel, and mailing vocabulary; no shipping or historical claims are made."
      }
    ],
    puzzle: {
      puzzleTitle: "Christmas Gift-Wrapping Word Search",
      words: ["SCISSORS", "TAPE", "TAG", "BOX", "TWINE", "FOLD", "CREASE", "LABEL", "STAMP", "ENVELOPE", "POSTMARK", "MAILBOX", "TISSUE", "GIFT BAG", "POSTAGE", "MAILER"],
      seed: "staged-x15-christmas-gift-wrap-v1",
      rows: 15,
      columns: 15,
      directions: ["E", "S", "SE", "NE"],
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
      puzzleNote: "A focused set about preparing, tagging, and mailing wrapped gifts, separate from the generic Christmas decorations and baking themes.",
      difficultyExplanation: "Medium describes a 15×15 grid, sixteen entries, and forward horizontal, vertical, and diagonal paths, including up and down diagonals.",
      wordListContext: "The draft uses common wrapping and mailing vocabulary. It does not provide packaging or shipping advice.",
      printNote: "Candidate output is intended for standard Letter and A4 print validation at actual size; no print measurement has been approved yet."
    },
    taxonomy: {
      primaryCategory: "holiday-word-searches",
      secondaryCategories: ["christmas", "gift-wrapping"],
      audience: ["general"],
      format: ["printable", "pdf", "answer-key", "online-play"],
      season: "winter"
    }
  }
];

export interface ChristmasDraftProposal {
  id: "X03" | "X05" | "X06" | "X07" | "X08";
  status: "draft";
  intent: string;
  dependsOn: string[];
  constraints: string[];
}

/** Source-only format and pack proposals; none represent a public content record. */
export const christmasDraftProposals: ChristmasDraftProposal[] = [
  {
    id: "X03",
    status: "draft",
    intent: "Large-print presentation of a canonical Christmas candidate, with measured grid and word-bank legibility for Letter and A4 output.",
    dependsOn: ["X01", "X02", "X04", "X15"],
    constraints: [
      "Treat as an output format of a canonical puzzle unless genuinely distinct puzzle content and user intent justify a separate page.",
      "Measure rendered grid and word-bank sizes and verify Letter/A4 PDF and print at 100%; do not claim a point size or accessibility certification before measurement."
    ]
  },
  {
    id: "X05",
    status: "draft",
    intent: "Christmas traditions browsing hub, only if multiple appropriate and independently reviewed children exist and the hub provides selection guidance.",
    dependsOn: ["X01", "X02", "X04", "X15"],
    constraints: ["Do not activate as a public collection while its children are drafts.", "Avoid unresearched cultural or faith-specific claims."]
  },
  {
    id: "X06",
    status: "draft",
    intent: "Repair the existing Christmas-for-kids collection draft into a useful child index only after human review confirms appropriate child inventory.",
    dependsOn: ["X02"],
    constraints: ["Keep the existing collection record unchanged in this source-only milestone.", "Do not claim age suitability or certification from short word length alone."]
  },
  {
    id: "X07",
    status: "draft",
    intent: "Five-puzzle Christmas draft pack using distinct candidate puzzles and their corresponding answer keys; reuse source candidates without creating duplicate puzzle pages.",
    dependsOn: ["published:christmas-word-search", "X01", "X02", "X04", "X15"],
    constraints: [
      "The five-puzzle draft mix is the existing published medium Christmas puzzle plus the four frozen Christmas candidates X01, X02, X04, and X15. X11 is winter content and X14 is a New Year pack proposal; neither is counted toward the Christmas pack.",
      "Keep this source-only manifest as a proposal until reuse of the published puzzle, all child editorial reviews, and pack PDF/answer parity are approved.",
      "Keep the answer section separate from the student puzzle pages and verify each key against its own frozen seed."
    ]
  },
  {
    id: "X08",
    status: "draft",
    intent: "Classroom-oriented Christmas worksheet pack with name/date line and answer-only teacher section, reusing the pack candidates without a redundant SEO page.",
    dependsOn: ["X07"],
    constraints: ["Teacher utility and print workflow require separate functional and human review.", "No grade-level or educational-outcome claims."]
  }
];

export const newYearDraftProposal = {
  id: "X14",
  status: "draft" as const,
  intent: "New Year celebration printable pack; reuse the existing published New Year puzzle and add distinct children only if user value is justified.",
  dependsOn: ["published:new-year-word-search"],
  constraints: ["Do not create a duplicate for format or wording alone.", "The source proposal has no frozen new-puzzle word list or printable pack functionality."]
};

export const christmasSourceOnlyStatus = {
  publicationStatus: "draft",
  editorialStatus: "unreviewed",
  runtimeImportAllowed: false,
  humanEditorialApprovalRequired: true
} as const satisfies Pick<PuzzleContentRecord, "publicationStatus" | "editorialStatus"> & {
  runtimeImportAllowed: false;
  humanEditorialApprovalRequired: true;
};
