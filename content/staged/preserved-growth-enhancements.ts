import type { PuzzleDefinition } from "@/content/model";

/** Preserved source-only proposals for existing draft canonicals; no inferred approval. */
export interface PreservedGrowthEnhancement {
  id: string; targetCanonicalPath: string; title: string; sourceFile: string; sourceFileSha256: string;
  provenance: "preserved-uncommitted-owner-work"; originalReviewDateIgnored: true;
  publicationStatus: "draft"; editorialStatus: "unreviewed"; runtimeImportAllowed: false;
  newIndexableUrlAllowance: 0; puzzle: PuzzleDefinition;
}

export const preservedGrowthEnhancements: PreservedGrowthEnhancement[] = [
  {
    "id": "OWNER-LANDMARKS",
    "targetCanonicalPath": "/word-searches/geography/landmarks-word-search",
    "title": "World Landmarks Word Search",
    "sourceFile": "original-owner-worktree:content/curated-topics-growth.ts",
    "sourceFileSha256": "b5af328ea612dde28083fa86beedde9aeda370a988a30b730398325ecf17047c",
    "provenance": "preserved-uncommitted-owner-work",
    "originalReviewDateIgnored": true,
    "publicationStatus": "draft",
    "editorialStatus": "unreviewed",
    "runtimeImportAllowed": false,
    "newIndexableUrlAllowance": 0,
    "puzzle": {
      "puzzleTitle": "World Landmarks Word Search",
      "words": [
        "ACROPOLIS",
        "ALHAMBRA",
        "ANGKOR WAT",
        "BOROBUDUR",
        "CHICHEN ITZA",
        "COLOSSEUM",
        "EIFFEL TOWER",
        "FORBIDDEN CITY",
        "GREAT WALL",
        "MACHU PICCHU",
        "MOUNT FUJI",
        "PETRA",
        "POTALA PALACE",
        "PYRAMIDS OF GIZA",
        "STATUE OF LIBERTY",
        "STONEHENGE",
        "SYDNEY OPERA HOUSE",
        "TAJ MAHAL",
        "TIMBUKTU",
        "VICTORIA FALLS"
      ],
      "seed": "curated-landmarks-word-search-v1-221",
      "rows": 18,
      "columns": 18,
      "directions": [
        "E",
        "W",
        "S",
        "N",
        "SE",
        "SW",
        "NE",
        "NW"
      ],
      "difficulty": "hard",
      "alphabetPack": "latin",
      "allowOverlap": true,
      "answerKeyAvailable": true,
      "onlinePlayAvailable": true,
      "printableAvailable": true,
      "pdfAvailable": true,
      "largePrintSuitable": false
    }
  },
  {
    "id": "OWNER-PARKS",
    "targetCanonicalPath": "/word-searches/geography/national-parks-word-search",
    "title": "U.S. National Parks Word Search",
    "sourceFile": "original-owner-worktree:content/curated-topics-growth.ts",
    "sourceFileSha256": "b5af328ea612dde28083fa86beedde9aeda370a988a30b730398325ecf17047c",
    "provenance": "preserved-uncommitted-owner-work",
    "originalReviewDateIgnored": true,
    "publicationStatus": "draft",
    "editorialStatus": "unreviewed",
    "runtimeImportAllowed": false,
    "newIndexableUrlAllowance": 0,
    "puzzle": {
      "puzzleTitle": "U.S. National Parks Word Search",
      "words": [
        "ACADIA",
        "ARCHES",
        "BADLANDS",
        "BIG BEND",
        "BISCAYNE",
        "BRYCE CANYON",
        "CANYONLANDS",
        "CONGAREE",
        "DENALI",
        "EVERGLADES",
        "GLACIER",
        "GRAND CANYON",
        "GREAT BASIN",
        "MESA VERDE",
        "HOT SPRINGS",
        "JOSHUA TREE",
        "OLYMPIC",
        "REDWOOD",
        "YELLOWSTONE",
        "YOSEMITE"
      ],
      "seed": "curated-national-parks-word-search-v1-103",
      "rows": 18,
      "columns": 18,
      "directions": [
        "E",
        "W",
        "S",
        "N",
        "SE",
        "SW",
        "NE",
        "NW"
      ],
      "difficulty": "hard",
      "alphabetPack": "latin",
      "allowOverlap": true,
      "answerKeyAvailable": true,
      "onlinePlayAvailable": true,
      "printableAvailable": true,
      "pdfAvailable": true,
      "largePrintSuitable": false
    }
  }
];
