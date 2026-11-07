/** Source-only optional review windows, never an automatic publishing schedule. */
export type EditorialWindowKind = "CANDIDATE" | "ENHANCE" | "HOLD";
export interface EditorialReviewWindow {
  slot: number; date: string; kind: EditorialWindowKind; focus: string; planningCondition: string;
  referenceIds: string[]; initialMaxNewIndexableUrls: 0 | 1; scopeNote: string;
  fallback: { canonicalPath: string; newIndexablePaths: []; publicationAuthorized: false };
  selectionStatus: "unselected"; newIndexablePaths: []; publicationAuthorized: false;
}

export const editorialCalendarPolicy = {
  planningCommit: "d297f7b71b336029e7d151d4e3e5ca6330438f52",
  planningFile: "ai-issues/2026-11-06-2027-WEEKLY-EDITORIAL-CALENDAR.md",
  acceptanceFile: "ai-issues/2026-11-06-PRODUCT-FINALIZATION-AND-ACCEPTANCE.md",
  timeZone: "America/New_York", initialMaximumNewIndexableUrls: 1,
  automaticPublication: false, editorialApprovalInferred: false, ownerApprovalInferred: false,
  noWorthyApprovedCandidateMeansZero: true, datesAreReleasePromises: false
} as const;

export const editorialReviewWindows: EditorialReviewWindow[] = [
  {
    "slot": 1,
    "date": "2027-01-01",
    "kind": "HOLD",
    "focus": "New Year maintenance, release verification",
    "planningCondition": "No new URL; validate 2026 holiday cohort and ensure no accidental draft exposure",
    "referenceIds": [
      "PACKAGE-MONITORING"
    ],
    "initialMaxNewIndexableUrls": 0,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/holidays/new-year-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 2,
    "date": "2027-01-08",
    "kind": "CANDIDATE",
    "focus": "Hard geography: U.S. mountain ranges (existing pilot H02)",
    "planningCondition": "One independently checked hard puzzle if editorial + print approved",
    "referenceIds": [
      "H02-01"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/nature-and-weather/mountains-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 3,
    "date": "2027-01-15",
    "kind": "CANDIDATE",
    "focus": "Winter sports challenge (X12)",
    "planningCondition": "One distinct winter-sports puzzle; no duplication of hockey/sports existing",
    "referenceIds": [
      "X12-01"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/sports/hockey-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 4,
    "date": "2027-01-22",
    "kind": "CANDIDATE",
    "focus": "Hard astronomy concepts (existing pilot H03)",
    "planningCondition": "One accurate and substantially different science puzzle",
    "referenceIds": [
      "H03-01"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/science/space-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 5,
    "date": "2027-01-29",
    "kind": "CANDIDATE",
    "focus": "Valentine's classroom activity",
    "planningCondition": "One school-friendly party/vocabulary worksheet, separate from existing Valentine's and Friendship",
    "referenceIds": [
      "S27-VAL"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/holidays/valentines-day-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 6,
    "date": "2027-02-05",
    "kind": "ENHANCE",
    "focus": "Valentine's discoverability and classroom pack",
    "planningCondition": "Improve existing Valentine/Friendship/Kindness routes; no new URL",
    "referenceIds": [
      "S27-VAL",
      "PACKAGE-ANNUAL"
    ],
    "initialMaxNewIndexableUrls": 0,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/holidays/valentines-day-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 7,
    "date": "2027-02-12",
    "kind": "ENHANCE",
    "focus": "Teacher name/date and worksheet workflow",
    "planningCondition": "Release polished guest tool if ready; no indexable puzzle required",
    "referenceIds": [
      "PACKAGE-CLASSROOM"
    ],
    "initialMaxNewIndexableUrls": 0,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-search-generator",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 8,
    "date": "2027-02-19",
    "kind": "CANDIDATE",
    "focus": "Phonics: word families and blends",
    "planningCondition": "One differentiated classroom word-search activity, not an age/grade SEO permutation",
    "referenceIds": [
      "T06-A"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Reuse the built AKE word-family sheet; no additional blend list or age/grade variant is implied.",
    "fallback": {
      "canonicalPath": "/collections/language-arts-word-search-worksheets",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 9,
    "date": "2027-02-26",
    "kind": "CANDIDATE",
    "focus": "Geography: world rivers",
    "planningCondition": "One source-checked challenging puzzle; distinguish existing Rivers/Map terms",
    "referenceIds": [
      "Y27-09"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/nature-and-weather/rivers-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 10,
    "date": "2027-03-05",
    "kind": "CANDIDATE",
    "focus": "Easter egg-hunt actions and vocabulary",
    "planningCondition": "One early-season, child-appropriate puzzle if distinct from existing Easter",
    "referenceIds": [
      "S27-EGG"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/holidays/easter-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 11,
    "date": "2027-03-12",
    "kind": "CANDIDATE",
    "focus": "Science: ecosystems and food chains",
    "planningCondition": "One accurate, reviewed school/science puzzle",
    "referenceIds": [
      "Y27-11"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/science/biology-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 12,
    "date": "2027-03-19",
    "kind": "ENHANCE",
    "focus": "St. Patrick's Day existing puzzle",
    "planningCondition": "Contextual links, print verification and seasonal discovery; no new URL",
    "referenceIds": [
      "PACKAGE-ANNUAL"
    ],
    "initialMaxNewIndexableUrls": 0,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/holidays/st-patricks-day-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 13,
    "date": "2027-03-26",
    "kind": "ENHANCE",
    "focus": "Easter and spring existing pages",
    "planningCondition": "Audit existing Easter / Spring usability and internal links; no new URL",
    "referenceIds": [
      "S27-EGG",
      "PACKAGE-ANNUAL"
    ],
    "initialMaxNewIndexableUrls": 0,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/holidays/easter-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 14,
    "date": "2027-04-02",
    "kind": "CANDIDATE",
    "focus": "Plants: seed-to-plant lifecycle",
    "planningCondition": "One reviewed nature/education puzzle, different from Plants/Flowers/Garden",
    "referenceIds": [
      "Y27-14"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/nature-and-weather/plants-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 15,
    "date": "2027-04-09",
    "kind": "CANDIDATE",
    "focus": "Geography: world deserts",
    "planningCondition": "One fact-checked hard printable, distinct from existing Landforms/Continents",
    "referenceIds": [
      "Y27-15"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/geography/landforms-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 16,
    "date": "2027-04-16",
    "kind": "CANDIDATE",
    "focus": "Nature: pollinators and habitats",
    "planningCondition": "One genuinely new vocabulary + answers asset",
    "referenceIds": [
      "H01-P"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Reuse the built pollination-relationships bank. Habitat-specific factual claims would require separate review.",
    "fallback": {
      "canonicalPath": "/word-searches/nature-and-weather/flowers-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 17,
    "date": "2027-04-23",
    "kind": "ENHANCE",
    "focus": "Earth Day and science discovery",
    "planningCondition": "Improve existing Earth Day, Plants and Science routes; no new URL",
    "referenceIds": [
      "H01-P",
      "PACKAGE-ANNUAL"
    ],
    "initialMaxNewIndexableUrls": 0,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/nature-and-weather/earth-day-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 18,
    "date": "2027-04-30",
    "kind": "CANDIDATE",
    "focus": "Language: literary devices",
    "planningCondition": "One classroom/hard puzzle, not duplicate Story Elements/Poetry",
    "referenceIds": [
      "H06-L"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Reuse the sound/structure analysis bank rather than inventing an overlapping generic literary-devices page.",
    "fallback": {
      "canonicalPath": "/word-searches/language-arts/poetry-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 19,
    "date": "2027-05-07",
    "kind": "ENHANCE",
    "focus": "Mother's Day content and family packs",
    "planningCondition": "Use existing Mother's Day and Family/Flower material; no new URL",
    "referenceIds": [
      "S27-MOM",
      "PACKAGE-ANNUAL"
    ],
    "initialMaxNewIndexableUrls": 0,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/holidays/mothers-day-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 20,
    "date": "2027-05-14",
    "kind": "CANDIDATE",
    "focus": "History: inventions and the printing press",
    "planningCondition": "One accurate hard history puzzle with distinct learning purpose",
    "referenceIds": [
      "H04-P"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/history/industrial-revolution-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 21,
    "date": "2027-05-21",
    "kind": "CANDIDATE",
    "focus": "Large-print garden or birdwatching pack",
    "planningCondition": "One genuinely readable themed experience, only new URL if distinct from large-print canonical",
    "referenceIds": [
      "L01",
      "L03"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "L01/L03 are utility selections for the existing large-print canonical. Typography alone does not justify a new indexable URL.",
    "fallback": {
      "canonicalPath": "/large-print-word-searches",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 22,
    "date": "2027-05-28",
    "kind": "CANDIDATE",
    "focus": "Reading: context clues",
    "planningCondition": "One reviewed language-arts worksheet, not rebranded Synonyms/Antonyms",
    "referenceIds": [
      "Y27-22"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/collections/language-arts-word-search-worksheets",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 23,
    "date": "2027-06-04",
    "kind": "CANDIDATE",
    "focus": "Father's Day hobbies vocabulary",
    "planningCondition": "One distinct family activity if verified and useful ahead of June holiday",
    "referenceIds": [
      "S27-DAD"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/collections/seasonal-word-searches",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 24,
    "date": "2027-06-11",
    "kind": "CANDIDATE",
    "focus": "Summer camp activities",
    "planningCondition": "One differentiated camp puzzle, not a clone of Camping",
    "referenceIds": [
      "S27-CAMP"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/nature-and-weather/camping-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 25,
    "date": "2027-06-18",
    "kind": "ENHANCE",
    "focus": "End-of-school/teacher multipacks",
    "planningCondition": "Improve existing classroom collection and print tool; no new URL",
    "referenceIds": [
      "S27-GRAD",
      "PACKAGE-CLASSROOM"
    ],
    "initialMaxNewIndexableUrls": 0,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/collections/classroom-word-search-worksheets",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 26,
    "date": "2027-06-25",
    "kind": "CANDIDATE",
    "focus": "Summer geography: U.S. parks and landmarks",
    "planningCondition": "One verified printable; names and facts require source check",
    "referenceIds": [
      "OWNER-PARKS"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Preserve original owner parks words and seed at the existing draft canonical. Original review date is not approval; any later noindex-to-indexable activation counts as one newly indexable URL.",
    "fallback": {
      "canonicalPath": "/word-searches/geography/us-states-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 27,
    "date": "2027-07-02",
    "kind": "ENHANCE",
    "focus": "Canada Day and U.S. Independence discovery",
    "planningCondition": "Existing Canada/US States pages, useful links, no year-suffixed pages",
    "referenceIds": [
      "PACKAGE-ANNUAL"
    ],
    "initialMaxNewIndexableUrls": 0,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/geography/canada-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 28,
    "date": "2027-07-09",
    "kind": "CANDIDATE",
    "focus": "Hard world landmarks",
    "planningCondition": "One source-checked puzzle, distinguish existing world capitals",
    "referenceIds": [
      "OWNER-LANDMARKS"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Preserve original owner landmark words and seed at the existing draft canonical rather than duplicating intent. A later indexing activation counts as one newly indexable URL.",
    "fallback": {
      "canonicalPath": "/word-searches/geography/world-capitals-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 29,
    "date": "2027-07-16",
    "kind": "CANDIDATE",
    "focus": "Deep-sea creatures",
    "planningCondition": "One original animal challenge, distinct from Ocean Animals",
    "referenceIds": [
      "Y27-29"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/animals/ocean-animals-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 30,
    "date": "2027-07-23",
    "kind": "ENHANCE",
    "focus": "Road-trip and travel pack",
    "planningCondition": "Upgrade existing Road Trip/Vacation and draft pack only when substantive",
    "referenceIds": [
      "T11-B",
      "PACKAGE-ANNUAL"
    ],
    "initialMaxNewIndexableUrls": 0,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/travel/road-trip-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 31,
    "date": "2027-07-30",
    "kind": "CANDIDATE",
    "focus": "Adult hard: long words and etymology",
    "planningCondition": "One genuinely difficult well-reviewed puzzle, not generic keyword repetition",
    "referenceIds": [
      "H06-W"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "The built word-formation bank supplies a differentiated hard option; no arbitrary long-word keyword variant is created.",
    "fallback": {
      "canonicalPath": "/collections/hard-printable-word-searches",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 32,
    "date": "2027-08-06",
    "kind": "CANDIDATE",
    "focus": "Back-to-school: first-week class vocabulary",
    "planningCondition": "One actually useful classroom page, separate from existing Back to School",
    "referenceIds": [
      "S27-SCHOOL"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/classroom-values/back-to-school-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 33,
    "date": "2027-08-13",
    "kind": "CANDIDATE",
    "focus": "Phonics: short vowels and CVC word families",
    "planningCondition": "One educational worksheet with technically valid placements",
    "referenceIds": [
      "Y27-33"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/collections/language-arts-word-search-worksheets",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 34,
    "date": "2027-08-20",
    "kind": "ENHANCE",
    "focus": "Substitute teacher printable bundle",
    "planningCondition": "Activate draft hub only if enough distinct reviewed worksheets are already public",
    "referenceIds": [
      "T06-A",
      "T07-A",
      "PACKAGE-CLASSROOM"
    ],
    "initialMaxNewIndexableUrls": 0,
    "scopeNote": "An existing draft hub cannot become indexable under an enhancement-only allowance. A later activation needs separate candidate review and must count as a newly indexable URL.",
    "fallback": {
      "canonicalPath": "/collections/classroom-word-search-worksheets",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 35,
    "date": "2027-08-27",
    "kind": "ENHANCE",
    "focus": "Back-to-school existing pages",
    "planningCondition": "Fix navigation/print pain points; no obligatory new indexed page",
    "referenceIds": [
      "S27-SCHOOL",
      "PACKAGE-ANNUAL"
    ],
    "initialMaxNewIndexableUrls": 0,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/classroom-values/back-to-school-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 36,
    "date": "2027-09-03",
    "kind": "CANDIDATE",
    "focus": "Science: electric circuits",
    "planningCondition": "One terminology-focused educational puzzle distinct from Electricity",
    "referenceIds": [
      "Y27-36"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/science/electricity-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 37,
    "date": "2027-09-10",
    "kind": "CANDIDATE",
    "focus": "Language: irregular verbs",
    "planningCondition": "One clearly differentiated school worksheet",
    "referenceIds": [
      "T07-A"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/language-arts/verbs-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 38,
    "date": "2027-09-17",
    "kind": "CANDIDATE",
    "focus": "Autumn harvest and agriculture",
    "planningCondition": "One useful seasonal vocabulary puzzle, distinct from Fall",
    "referenceIds": [
      "S27-HARV"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/holidays/fall-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 39,
    "date": "2027-09-24",
    "kind": "CANDIDATE",
    "focus": "Adult hard: aviation vocabulary",
    "planningCondition": "One difficult technical-topic puzzle with accurate terminology",
    "referenceIds": [
      "H07-A"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/travel/airport-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 40,
    "date": "2027-10-01",
    "kind": "CANDIDATE",
    "focus": "Canadian autumn wildlife",
    "planningCondition": "One seasonally relevant nature activity; not Canadian Thanksgiving near-duplicate",
    "referenceIds": [
      "Y27-40"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Selected multi-region fauna names remain zoologically unreviewed; no universal autumn behavior or Thanksgiving variant is implied.",
    "fallback": {
      "canonicalPath": "/word-searches/animals/arctic-animals-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 41,
    "date": "2027-10-08",
    "kind": "ENHANCE",
    "focus": "Canadian Thanksgiving: existing calendar and fall content",
    "planningCondition": "Contextual links and seasonal pack; no new URL by default",
    "referenceIds": [
      "S27-THANK",
      "PACKAGE-ANNUAL"
    ],
    "initialMaxNewIndexableUrls": 0,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/holidays/fall-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 42,
    "date": "2027-10-15",
    "kind": "CANDIDATE",
    "focus": "Hard Halloween puzzle",
    "planningCondition": "One truly difficult Halloween puzzle, different grid and word bank from existing medium",
    "referenceIds": [
      "Y27-42"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/holidays/halloween-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 43,
    "date": "2027-10-22",
    "kind": "CANDIDATE",
    "focus": "Easy Halloween classroom printable",
    "planningCondition": "One age-appropriate, distinct worksheet if editorial review passes",
    "referenceIds": [
      "Y27-43"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/holidays/halloween-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 44,
    "date": "2027-10-29",
    "kind": "ENHANCE",
    "focus": "Halloween existing topic and bundles",
    "planningCondition": "No last-minute keyword-variant URLs; monitor and repair",
    "referenceIds": [
      "S27-HALLOW",
      "PACKAGE-ANNUAL"
    ],
    "initialMaxNewIndexableUrls": 0,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/holidays/halloween-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 45,
    "date": "2027-11-05",
    "kind": "CANDIDATE",
    "focus": "History: ancient trade routes",
    "planningCondition": "One independently researched puzzle, not generic historical filler",
    "referenceIds": [
      "Y27-45"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/collections/history-word-search-worksheets",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 46,
    "date": "2027-11-12",
    "kind": "CANDIDATE",
    "focus": "U.S. Thanksgiving dinner vocabulary",
    "planningCondition": "One useful themed printable distinct from existing Thanksgiving",
    "referenceIds": [
      "Y27-46"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/holidays/thanksgiving-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 47,
    "date": "2027-11-19",
    "kind": "ENHANCE",
    "focus": "U.S. Thanksgiving / classroom pack",
    "planningCondition": "Refresh existing links and pack selection, not duplicated year variants",
    "referenceIds": [
      "S27-THANK",
      "PACKAGE-ANNUAL"
    ],
    "initialMaxNewIndexableUrls": 0,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/holidays/thanksgiving-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 48,
    "date": "2027-11-26",
    "kind": "CANDIDATE",
    "focus": "Christmas customs: specific reviewed tradition set",
    "planningCondition": "One factual/original theme only if vetted and unlike 2026 Christmas content",
    "referenceIds": [
      "Y27-48"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "A specific optional paper-decoration activity is built. A customs-focused release needs additional factual/cultural evidence; do not relabel the craft bank as culturally reviewed.",
    "fallback": {
      "canonicalPath": "/word-searches/holidays/christmas-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 49,
    "date": "2027-12-03",
    "kind": "CANDIDATE",
    "focus": "Christmas music and instruments",
    "planningCondition": "One distinctive music/holiday activity, not repeated seasonal word bank",
    "referenceIds": [
      "Y27-49"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/music/orchestra-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 50,
    "date": "2027-12-10",
    "kind": "ENHANCE",
    "focus": "Christmas collection and existing packs",
    "planningCondition": "Enhance already published canonicals, real pack quality, no new URL automatically",
    "referenceIds": [
      "X01",
      "X02",
      "X04",
      "X15"
    ],
    "initialMaxNewIndexableUrls": 0,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/holidays/christmas-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 51,
    "date": "2027-12-17",
    "kind": "CANDIDATE",
    "focus": "Winter wildlife adaptations (X13)",
    "planningCondition": "One distinct science/animals puzzle if technically and factually reviewed",
    "referenceIds": [
      "X13-01"
    ],
    "initialMaxNewIndexableUrls": 1,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/animals/arctic-animals-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 52,
    "date": "2027-12-24",
    "kind": "HOLD",
    "focus": "Christmas holiday maintenance",
    "planningCondition": "Print/PDF reliability, accessibility, monitoring; no indexed URL",
    "referenceIds": [
      "PACKAGE-MONITORING"
    ],
    "initialMaxNewIndexableUrls": 0,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/holidays/christmas-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  },
  {
    "slot": 53,
    "date": "2027-12-31",
    "kind": "HOLD",
    "focus": "Year-end maintenance and 2028 release preparation",
    "planningCondition": "Report 2027 cohorts and prebuild 2028; no indexed URL",
    "referenceIds": [
      "PACKAGE-MONITORING"
    ],
    "initialMaxNewIndexableUrls": 0,
    "scopeNote": "Use only independently reviewed work. If distinct value or approval is missing, choose the zero-publication fallback.",
    "fallback": {
      "canonicalPath": "/word-searches/holidays/new-year-word-search",
      "newIndexablePaths": [],
      "publicationAuthorized": false
    },
    "selectionStatus": "unselected",
    "newIndexablePaths": [],
    "publicationAuthorized": false
  }
];
