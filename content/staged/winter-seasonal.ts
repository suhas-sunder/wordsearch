import type { StagedPuzzleCandidate } from "@/content/staged/model";

/** Source-only seasonal drafts. Neither candidate is imported by the public registry. */
export const winterSeasonalStatus = {
  publicationStatus: "draft",
  editorialStatus: "unreviewed",
  runtimeImportAllowed: false,
  humanEditorialApprovalRequired: true
} as const;

export const winterSeasonalCandidates: StagedPuzzleCandidate[] = [
  {
    id: "X12-01",
    proposedPath: "/word-searches/sports/snow-and-ice-sports-word-search",
    intent: "A selected vocabulary puzzle about snow and ice sports. It gives the catalog's broad Winter Sports proposal a distinct, scoped candidate path and uses different terms from the published Hockey and Swimming puzzles. It makes no claim to cover every winter sport.",
    title: "Snow and Ice Sports Word Search",
    status: "drafted",
    sourceReferences: [
      {
        title: "Team USA: Milano Cortina 2026 sports",
        url: "https://www.teamusa.com/milano-cortina-2026",
        note: "Checked standard U.S. names for selected snow and ice disciplines, including alpine skiing, biathlon, bobsled, cross-country skiing, curling, figure skating, luge, skeleton, ski jumping, and speed skating. The word bank is a selected vocabulary set, not a copied event list or a claim about a particular Games program. No Team USA prose or graphics are reused."
      },
      {
        title: "U.S. Ski & Snowboard: 2026 Alpine Competition Guide",
        url: "https://www.usskiandsnowboard.org/files/2026-alpine-competition-guide",
        note: "Checked alpine event terminology and spelling, including slalom. No rules, explanations, or event descriptions were copied."
      },
      {
        title: "U.S. Ski & Snowboard: 2025–26 Freestyle and Freeski Competition Guide",
        url: "https://www.usskiandsnowboard.org/sites/default/files/files-resources/files/2025/2026_Freestyle-Freeski_Guide.pdf",
        note: "Checked selected freestyle and snowboard event terms, including moguls, halfpipe, and big air. The candidate does not reproduce rules or event descriptions."
      },
      {
        title: "Team USA: Snowboarding at Milano Cortina 2026",
        url: "https://www.teamusa.com/news/2026/february/03/olympic-winter-games-milano-cortina-2026-preview-snowboarding",
        note: "Checked selected snowboarding event labels, including snowboard cross. The candidate does not reproduce event descriptions or Games-specific claims."
      },
      {
        title: "Team USA: Speedskating at the Olympic Winter Games",
        url: "https://www.teamusa.com/sports/speedskating",
        note: "Checked the distinction and spelling of short track and long track speed skating. The word bank uses the brief label SHORT TRACK. No explanatory copy or images are reused."
      },
      {
        title: "U.S. Figure Skating: Ice Skating Disciplines",
        url: "https://usfigureskating.org/sports/2025/9/18/disciplines.aspx",
        note: "Checked the conventional discipline name figure skating. No explanatory copy or imagery is reused."
      }
    ],
    puzzle: {
      puzzleTitle: "Snow and Ice Sports Word Search",
      words: [
        "ALPINE SKIING", "CROSS COUNTRY SKIING", "FREESTYLE SKIING", "SNOWBOARDING", "SKI JUMPING",
        "BIATHLON", "NORDIC COMBINED", "SPEED SKATING", "SHORT TRACK", "FIGURE SKATING",
        "CURLING", "BOBSLED", "LUGE", "SKELETON", "SKI MOUNTAINEERING",
        "SNOWBOARD CROSS", "MOGULS", "HALFPIPE", "BIG AIR", "SLALOM"
      ],
      seed: "staged-x12-01-snow-and-ice-sports-v1-1",
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
      puzzleNote: "Find selected names of snow and ice sports and a few related event terms.",
      difficultyExplanation: "Hard describes an 18×18 grid, twenty entries, with all eight directions available for placement. It is a configuration description, not a measured solve-time promise.",
      wordListContext: "This selected list spans several snow and ice disciplines. It is scoped separately from the existing Hockey and Swimming puzzles and the broader Winter Sports draft. Sport labels, the intended audience, and topical distinctness still need human review.",
      printNote: "Letter and A4 candidate PDFs require print-layout, answer-key, and physical-sheet review before any publication decision."
    },
    taxonomy: {
      primaryCategory: "sports-word-searches",
      secondaryCategories: ["sports", "snow-sports", "ice-sports"],
      audience: ["general"],
      format: ["printable", "online-play", "answer-key"],
      educationalSubject: "sports",
      relatedTerms: ["snow sports", "ice sports"]
    }
  },
  {
    id: "X13-01",
    proposedPath: "/word-searches/animals/winter-animal-adaptations-word-search",
    intent: "A vocabulary puzzle about selected animal strategies and features associated with winter conditions. It focuses on adaptation terms rather than the species-name list in the published Arctic Animals puzzle and does not claim that every strategy applies to every animal.",
    title: "Winter Animal Adaptations Word Search",
    status: "drafted",
    sourceReferences: [
      {
        title: "National Park Service: Prepare for Cold Air — SnowSchool pre-visit activity",
        url: "https://www.nps.gov/teachers/classrooms/prepare-for-cold-air-snowschool-pre-visit-activity.htm",
        note: "Checked terms including camouflage, hibernation, migration, torpor, insulation, fur, hollow hairs, and fat storage. The candidate uses selected vocabulary labels only; it copies no lesson directions, explanatory text, or images."
      },
      {
        title: "National Park Service: Wildlife in Winter — Survival Strategies",
        url: "https://home.nps.gov/articles/000/winter-survival-strategies.htm",
        note: "Checked the distinctions among migration, dormancy, hibernation, torpor, winter coat changes, camouflage, and roosting. The sources describe strategies used by particular species; this puzzle does not assign them universally."
      },
      {
        title: "National Park Service: Hibernation — Nature's Nap Time",
        url: "https://www.nps.gov/articles/the-science-of-hibernation.htm",
        note: "Checked the vocabulary for dormancy, hibernation, torpor, brumation, and stored energy. Definitions and biological framing require human review; no NPS prose is copied."
      },
      {
        title: "National Park Service: Winter Survival Adaptations — Caching Food",
        url: "https://www.nps.gov/teachers/classrooms/winter-survival-adaptations-caching-food.htm",
        note: "Checked the terms cache, food caching, and midden in the described Yellowstone examples. Those examples support vocabulary selection only and are not generalized to all wildlife."
      }
    ],
    puzzle: {
      puzzleTitle: "Winter Animal Adaptations Word Search",
      words: [
        "HIBERNATION", "TORPOR", "BRUMATION", "DORMANCY", "MIGRATION",
        "CAMOUFLAGE", "THERMOREGULATION", "INSULATION", "HOLLOW HAIRS", "WINTER COAT",
        "COLOR CHANGE", "FAT STORAGE", "ENERGY RESERVES", "FOOD CACHE", "MIDDEN",
        "SUBNIVEAN LAYER", "ROOSTING", "SNOW COVER", "DENNING", "BROWN FAT"
      ],
      seed: "staged-x13-01-winter-animal-adaptations-v1-1",
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
      puzzleNote: "Search for vocabulary about selected ways animals cope with winter conditions.",
      difficultyExplanation: "Hard describes an 18×18 grid, twenty entries, with all eight directions available for placement. It is a configuration description, not a measured solve-time promise.",
      wordListContext: "The list combines selected behavior, body-feature, and winter-habitat terms from National Park Service references. Individual strategies vary by species, location, and conditions; the list and its distinctions require human factual review.",
      printNote: "Letter and A4 candidate PDFs require print-layout, answer-key, and physical-sheet review before any publication decision."
    },
    taxonomy: {
      primaryCategory: "animals-word-searches",
      secondaryCategories: ["animals", "winter-wildlife", "animal-adaptations"],
      audience: ["general"],
      format: ["printable", "online-play", "answer-key"],
      educationalSubject: "biology",
      relatedTerms: ["winter wildlife", "animal adaptations"]
    }
  }
];
