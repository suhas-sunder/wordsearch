import type { StagedPuzzleCandidate } from "@/content/staged/model";

/** Draft-only pilot status. This file is not imported by the public registry. */
export const evergreenPilotStatus = {
  publicationStatus: "draft",
  editorialStatus: "unreviewed",
  runtimeImportAllowed: false,
  humanEditorialApprovalRequired: true
} as const;

export const evergreenPilotCandidates: StagedPuzzleCandidate[] = [
  {
    id: "H02-01",
    proposedPath: "/word-searches/geography/selected-us-mountain-ranges-word-search",
    intent: "A hard geography candidate built around selected proper names of U.S. mountain ranges. Its name-focused word bank differs from the published Mountains landform and hiking vocabulary. The selection is not a complete list of U.S. ranges.",
    title: "Selected U.S. Mountain Ranges Word Search",
    status: "drafted",
    sourceReferences: [
      {
        title: "National Park Service: Geology and Physical Processes — Mountains",
        url: "https://www.nps.gov/subjects/mountains/geology.htm",
        note: "Checked the names and spelling of U.S. range features listed by NPS, including the Alaska Range, Appalachian Mountain Belt, Brooks Range, Cascade Range, Ouachita Mountains, Rocky Mountain System, and Sierra Nevada. The candidate shortens Appalachian Mountain Belt to Appalachian Belt for its word-bank label. No NPS prose, images, or list was copied."
      },
      {
        title: "U.S. Geological Survey: GNIS Domestic Names Feature Classes",
        url: "https://www.usgs.gov/us-board-on-geographic-names/gnis-domestic-names-feature-classes",
        note: "Checked the USGS feature-class description for Range and its scope as a domestic geographic-name class. This reference does not imply that every entry in the candidate was independently queried in GNIS."
      },
      {
        title: "U.S. Geological Survey: Geology of South-Central Alaska",
        url: "https://www.usgs.gov/publications/geology-south-central-alaska",
        note: "Checked Alaska range-name spellings used for the Alaska, Aleutian, Chugach, Kuskokwim, Nutzotin, Talkeetna, and Wrangell ranges. No report prose or map assets were copied."
      },
      {
        title: "U.S. Geological Survey: Professional Paper 1386-K, Glaciers of Alaska",
        url: "https://pubs.usgs.gov/pp/p1386k/",
        note: "Checked Alaska range-name spellings including Brooks, Kigluaik, and Wood River. The candidate uses names only; it makes no glaciology claims."
      },
      {
        title: "U.S. Geological Survey: Rocky Mountains",
        url: "https://pubs.usgs.gov/publication/70207970",
        note: "Checked the familiar Rocky Mountains name as a regional set of named ranges. No scientific summary or wording was copied."
      },
      {
        title: "U.S. Geological Survey: Streamflow-Characteristic Estimation Methods for Unregulated Streams of Tennessee",
        url: "https://pubs.usgs.gov/sir/2009/5159/pdf/sir20095159.pdf",
        note: "Checked the Unaka Range name and its classification as a mountain region/range. No streamflow content is used in the puzzle."
      }
    ],
    puzzle: {
      puzzleTitle: "Selected U.S. Mountain Ranges Word Search",
      words: [
        "ALASKA RANGE", "ALEUTIAN RANGE", "APPALACHIAN BELT", "UNAKA RANGE", "BROOKS RANGE",
        "CASCADE RANGE", "COAST RANGES", "MARATHON MOUNTAINS", "OUACHITA MOUNTAINS", "ROCKY MOUNTAINS",
        "SIERRA NEVADA", "CHUGACH MOUNTAINS", "KENAI MOUNTAINS", "TALKEETNA MOUNTAINS", "WRANGELL MOUNTAINS",
        "ST ELIAS MOUNTAINS", "WOOD RIVER MOUNTAINS", "KIGLUAIK MOUNTAINS", "KUSKOKWIM MOUNTAINS", "NUTZOTIN MOUNTAINS"
      ],
      seed: "staged-h02-01-us-mountain-ranges-v1-73",
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
      puzzleNote: "Find selected named mountain ranges from across the United States, with a strong set of Alaska names alongside ranges named in the National Park Service overview.",
      difficultyExplanation: "Hard describes an 18×18 grid, twenty entries, and placements in all eight directions. It is a configuration description, not a measured solve-time promise.",
      wordListContext: "The list is a selected set of range names for a word search, not a comprehensive geography inventory. USGS and NPS references support spelling and name checks; factual scope and labels still need human review.",
      printNote: "Letter and A4 candidate PDFs require print-layout, answer-key, and physical-sheet review before any publication decision."
    },
    taxonomy: {
      primaryCategory: "geography-word-searches",
      secondaryCategories: ["geography", "mountain-ranges"],
      audience: ["general"],
      format: ["printable", "online-play", "answer-key"],
      educationalSubject: "geography",
      relatedTerms: ["named mountain ranges", "United States geography"]
    }
  },
  {
    id: "H03-01",
    proposedPath: "/word-searches/science/observational-astronomy-word-search",
    intent: "A hard science candidate focused on astronomy vocabulary for observing and describing celestial phenomena. Its technical terms differ from the published Space and Solar System lists and the existing basic Planets and Stars and Galaxies drafts.",
    title: "Observational Astronomy Word Search",
    status: "drafted",
    sourceReferences: [
      {
        title: "NASA Science: Universe Glossary",
        url: "https://science.nasa.gov/universe/glossary/",
        note: "Checked standard spellings and usage for astronomy terms such as astrophysics, blueshift, brown dwarf, luminosity, parallax, parsec, pulsar, quasar, redshift, and supernova. Only individual vocabulary terms were selected; NASA definitions, prose, images, and any presented list were not copied."
      },
      {
        title: "NASA Science: Hubble Glossary",
        url: "https://science.nasa.gov/mission/hubble/multimedia/hubble-glossary/",
        note: "Cross-checked observational terms including parallax and redshift in a second NASA reference. No educational claims or NASA explanatory text are reused."
      },
      {
        title: "NASA Science: Exoplanet Glossary",
        url: "https://science.nasa.gov/exoplanets/glossary/",
        note: "Checked astronomy and observation vocabulary in NASA's science glossary. The candidate excludes planet-name lists and uses no NASA text or media."
      }
    ],
    puzzle: {
      puzzleTitle: "Observational Astronomy Word Search",
      words: [
        "ASTROPHYSICS", "BLUESHIFT", "BROWN DWARF", "DARK ENERGY", "DARK MATTER",
        "EMISSION LINE", "LIGHT CURVE", "LUMINOSITY", "NEUTRON STAR", "PARALLAX",
        "PARSEC", "PROPER MOTION", "PROTOSTAR", "PULSAR", "QUASAR",
        "REDSHIFT", "SPECTRAL LINE", "SPECTROGRAPH", "SUPERNOVA", "WHITE DWARF"
      ],
      seed: "staged-h03-01-observational-astronomy-v1",
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
      puzzleNote: "Search for astronomy vocabulary about light, distance, stellar remnants, and observing celestial objects.",
      difficultyExplanation: "Hard describes an 18×18 grid, twenty entries, and placements in all eight directions. It is a configuration description, not a measured solve-time promise.",
      wordListContext: "The selected terms cover measurement, observed light, and astrophysical objects or phenomena. The NASA references support vocabulary and spelling checks; definitions and scientific framing require human review.",
      printNote: "Letter and A4 candidate PDFs require print-layout, answer-key, and physical-sheet review before any publication decision."
    },
    taxonomy: {
      primaryCategory: "science-word-searches",
      secondaryCategories: ["science", "astronomy"],
      audience: ["general"],
      format: ["printable", "online-play", "answer-key"],
      educationalSubject: "astronomy",
      relatedTerms: ["observational astronomy", "astrophysics vocabulary"]
    }
  }
];
