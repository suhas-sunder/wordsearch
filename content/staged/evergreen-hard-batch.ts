import type { StagedPuzzleCandidate } from "@/content/staged/model";

export const evergreenHardBatchStatus = {
  publicationStatus: "draft", editorialStatus: "unreviewed", runtimeImportAllowed: false,
  humanEditorialApprovalRequired: true
} as const;

interface Brief {
  id: string; slug: string; title: string; category: string; segment: string;
  words: string[]; intent: string; context: string;
  sources: StagedPuzzleCandidate["sourceReferences"];
}

const spellingReference = {
  title: "Merriam-Webster — human editorial reference",
  url: "https://www.merriam-webster.com/",
  note: "Available for the remaining human spelling and usage review; not a claim that every entry has been dictionary-verified. No dictionary definitions or prose are copied."
};

// Individually authored subject lists. Source notes distinguish checked topical
// references from entry-by-entry factual/semantic approval, which remains open.
const briefs: Brief[] = [
  {
    id: "H01-P", slug: "pollination-interactions", title: "Pollination Interactions", category: "nature-and-weather-word-searches", segment: "nature-and-weather",
    words: ["POLLEN", "NECTAR", "STIGMA", "ANTHER", "STAMEN", "PISTIL", "COROLLA", "PETAL", "SEPAL", "OVARY", "OVULE", "FERTILIZATION", "CROSS POLLINATION", "SELF POLLINATION", "POLLINATOR", "NECTARY", "GERMINATION", "FLOWERING", "SEED SET", "POLLEN TUBE"],
    intent: "A hard plant-reproduction and pollination vocabulary puzzle, distinct from existing general Flowers, Plants and Insects word banks.",
    context: "Search for selected flower structures and reproductive-process terms. Not every plant uses the same structures or pollination mechanism; human botanical review must confirm context before any lesson use.",
    sources: [{ title: "National Park Service — About Pollinators", url: "https://www.nps.gov/subjects/pollinators/what-is-a-pollinator.htm", note: "Checked the broad distinction between pollen movement and fertilization and the presence of self-pollination and animal/wind/water pollination. This is topical support, not verification of every anatomical entry. No NPS definitions or statistics are reproduced." }, spellingReference]
  },
  {
    id: "H02-C", slug: "cartography-and-projections", title: "Cartography and Projections", category: "geography-word-searches", segment: "geography",
    words: ["CARTOGRAPHY", "PROJECTION", "MERCATOR", "ROBINSON", "MOLLWEIDE", "GNOMONIC", "ORTHOGRAPHIC", "STEREOGRAPHIC", "AZIMUTHAL", "CYLINDRICAL", "CONIC", "EQUAL AREA", "CONFORMAL", "EQUIDISTANT", "GRATICULE", "MERIDIAN", "PARALLEL", "CENTRAL MERIDIAN", "STANDARD PARALLEL", "DISTORTION"],
    intent: "A specialist map-projection vocabulary challenge rather than a duplicate basic Map Vocabulary, Countries or Landmarks puzzle.",
    context: "The bank mixes projection names, projection families and descriptive properties. These terms are not interchangeable; the puzzle gives no claim that any projection preserves every property.",
    sources: [{ title: "U.S. Geological Survey — Map projections", url: "https://www.usgs.gov/publications/map-projections", note: "Checked the USGS publication scope: representing the round Earth on flat maps and comparing projection properties. Names and classifications in the draft require human entry-by-entry review; no USGS explanatory text or diagrams are copied." }, spellingReference]
  },
  {
    id: "H03-O", slug: "ocean-water-processes", title: "Ocean Water Processes", category: "science-word-searches", segment: "science",
    words: ["THERMOCLINE", "HALOCLINE", "PYCNOCLINE", "UPWELLING", "DOWNWELLING", "SALINITY", "DENSITY", "CIRCULATION", "THERMOHALINE", "GYRE", "EDDY", "MIXED LAYER", "STRATIFICATION", "ADVECTION", "DIFFUSION", "TURBULENCE", "CONVECTION", "CORIOLIS", "EKMAN TRANSPORT", "OVERTURNING"],
    intent: "A hard physical-oceanography vocabulary list, distinct from the existing Oceans names and Ocean Animals species puzzles.",
    context: "The bank names water properties, layers and motion processes. It contains no numerical depth, climate forecast or universal statement about ocean layering.",
    sources: [{ title: "NOAA — What is a thermocline?", url: "https://oceanservice.noaa.gov/facts/thermocline.html", note: "Checked thermocline as a temperature-transition-layer term; no quoted definition or depth figures are reused." }, { title: "NOAA Tides and Currents — Glossary", url: "https://www.tidesandcurrents.noaa.gov/glossary.html", note: "Checked topical glossary coverage including salinity, density, thermocline and upwelling. The full word bank still requires human oceanographic review; no definitions are copied." }]
  },
  {
    id: "H04-P", slug: "historic-print-shop", title: "Historic Print Shop", category: "history-word-searches", segment: "history",
    words: ["COMPOSING STICK", "TYPE CASE", "SORT", "GALLEY", "CHASE", "QUOIN", "FURNITURE", "PLATEN", "TYMPAN", "FRISKET", "INK BALL", "BRAYER", "IMPOSITION", "SIGNATURE", "FOLIO", "QUARTO", "OCTAVO", "LEADING", "TYPE METAL", "LETTERPRESS"],
    intent: "A historic printing-workshop vocabulary challenge, differentiated from the general Industrial Revolution and Inventors topics.",
    context: "Some words name tools, some printing processes and some book formats. This is a selected vocabulary bank rather than a timeline, attribution of inventions or description of one workshop.",
    sources: [{ title: "Smithsonian National Museum of American History — composing stick", url: "https://americanhistory.si.edu/collections/object/nmah_1875118", note: "Checked a museum object record for the conventional composing-stick tool label. No object images, catalog descriptions or claims about this entire draft list are reproduced." }, { title: "Folger Shakespeare Library — DIY Quarto", url: "https://www.folger.edu/explore/shakespeare-in-print/diy-quarto/", note: "Checked quarto as a book-format term. No play text, facsimiles or instructions are reused. Other workshop vocabulary remains subject to specialist editorial review." }, spellingReference]
  },
  {
    id: "H05-M", slug: "mineral-identification-properties", title: "Mineral Identification Properties", category: "science-word-searches", segment: "science",
    words: ["LUSTER", "STREAK", "HARDNESS", "CLEAVAGE", "FRACTURE", "DENSITY", "CRYSTAL FORM", "TRANSPARENCY", "FLUORESCENCE", "MAGNETISM", "TENACITY", "HABIT", "SPECIFIC GRAVITY", "VITREOUS", "METALLIC", "PEARLY", "RESINOUS", "SILKY", "ADAMANTINE", "COLOR"],
    intent: "A mineral-observation terminology puzzle rather than a repeated Rocks and Minerals species list or general Geology grid.",
    context: "The word bank combines properties and descriptive terms; not every mineral shows every property. It gives no testing instructions, chemical-handling advice or identification guarantee.",
    sources: [{ title: "National Park Service — Minerals", url: "https://www.nps.gov/subjects/geology/minerals.htm", note: "Checked selected mineral-property terminology including cleavage, luster, hardness and streak. No NPS prose or mineral photographs are copied." }, { title: "Australian Museum — Mineral properties", url: "https://australian.museum/learn/minerals/properties/", note: "Checked topical coverage of hardness, density, cleavage, magnetism and fluorescence. Descriptive-luster vocabulary still requires human review; no source definitions or testing instructions are reused." }]
  },
  {
    id: "H06-L", slug: "poetic-sound-and-structure", title: "Poetic Sound and Structure", category: "language-arts-word-searches", segment: "language-arts",
    words: ["ALLITERATION", "ASSONANCE", "CONSONANCE", "ONOMATOPOEIA", "ANAPHORA", "ENJAMBMENT", "CAESURA", "SCANSION", "METER", "STANZA", "COUPLET", "TERCET", "QUATRAIN", "SESTET", "OCTAVE", "REFRAIN", "INTERNAL RHYME", "SLANT RHYME", "END RHYME", "VOLTA"],
    intent: "A hard poetry-analysis terminology puzzle focused on sound and structural labels, differentiated from the existing introductory Poetry and Story Elements banks.",
    context: "Find selected analysis terms. No poem, lyric, poet biography or copyrighted literary example is reproduced, and the puzzle does not teach definitions by implication.",
    sources: [{ title: "Academy of American Poets — Glossary of Poetic Terms", url: "https://poets.org/glossary", note: "Checked glossary coverage and spellings of selected terms including alliteration and anaphora. No glossary definitions or poem excerpts are copied. Human review of the full selection and teaching context remains required." }, spellingReference]
  },
  {
    id: "H07-A", slug: "aircraft-structures-and-controls", title: "Aircraft Structures and Controls", category: "science-word-searches", segment: "science",
    words: ["AILERON", "FUSELAGE", "EMPENNAGE", "STABILIZER", "ELEVATOR", "RUDDER", "FLAP", "SLAT", "SPOILER", "AIRFOIL", "WINGLET", "NACELLE", "PYLON", "BULKHEAD", "LONGERON", "STRINGER", "SPAR", "RIB", "LANDING GEAR", "TRIM TAB"],
    intent: "An adult-interest aircraft-structure vocabulary challenge, distinct from the travel-service vocabulary of the published Airport puzzle.",
    context: "The list combines structural components and control surfaces. Aircraft designs differ; it gives no flight-control, maintenance or engineering instructions.",
    sources: [{ title: "NASA Glenn — Airplane Parts and Function", url: "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/airplane-parts-function/", note: "Checked selected airplane part names including aileron and fuselage. This is topical terminology support, not certification of every structural term or any operational guidance. No NASA diagrams or explanations are copied." }, spellingReference]
  },
  {
    id: "H07-B", slug: "architectural-elements", title: "Architectural Elements", category: "art-word-searches", segment: "art",
    words: ["ARCHITRAVE", "ENTABLATURE", "PEDIMENT", "PILASTER", "COLONNADE", "BALUSTRADE", "CORNICE", "FRIEZE", "PORTICO", "BUTTRESS", "TRACERY", "CLERESTORY", "DORMER", "CUPOLA", "LINTEL", "KEYSTONE", "VOUSSOIR", "SPANDREL", "APSE", "VAULT"],
    intent: "A hard architectural-detail terminology puzzle, distinct from the existing general sculpture, drawing and famous-landmark topics.",
    context: "Selected architectural parts form a long-word challenge. Terms span different building traditions; the list is not an attribution of one style or an exhaustive architectural survey.",
    sources: [spellingReference]
  },
  {
    id: "H05-R", slug: "renewable-electricity-systems", title: "Renewable Electricity Systems", category: "science-word-searches", segment: "science",
    words: ["PHOTOVOLTAIC", "INVERTER", "TURBINE", "GENERATOR", "GEOTHERMAL", "HYDROPOWER", "BIOMASS", "BIOGAS", "SOLAR ARRAY", "ROTOR", "BLADE", "PENSTOCK", "RESERVOIR", "CAPACITY FACTOR", "GRID", "TRANSMISSION", "STORAGE", "ELECTROLYSIS", "TIDAL POWER", "WAVE ENERGY"],
    intent: "A selected energy-systems vocabulary challenge beyond the basic Electricity bank, covering generation plus associated equipment and infrastructure.",
    context: "Not every listed component is exclusive to renewable generation, and storage is not itself an energy source. No emissions, cost, safety or policy claim is made.",
    sources: [{ title: "U.S. EPA — Green Power Markets Glossary", url: "https://www.epa.gov/green-power-markets/glossary", note: "Checked broad renewable-energy scope including wind, solar, geothermal, hydropower and biomass. The list also includes associated infrastructure, not a claim that every word is a renewable source. No definitions or performance data are reused." }, { title: "U.S. Energy Information Administration — renewable glossary", url: "https://www.eia.gov/TOOLS/GLOSSARY/index.php?id=renewable", note: "Topical reference for human review of energy-system labels. No source definitions, statistics or electricity-market advice are copied." }]
  },
  {
    id: "H06-W", slug: "word-formation-and-origins", title: "Word Formation and Origins", category: "language-arts-word-searches", segment: "language-arts",
    words: ["ETYMOLOGY", "MORPHOLOGY", "MORPHEME", "LEXEME", "COGNATE", "LOANWORD", "CALQUE", "COMPOUNDING", "DERIVATION", "INFLECTION", "AFFIXATION", "BACK FORMATION", "CLIPPING", "BLENDING", "ACRONYM", "INITIALISM", "EPONYM", "NEOLOGISM", "SEMANTIC SHIFT", "CONVERSION"],
    intent: "A hard word-formation terminology puzzle beyond the existing basic Prefixes, Suffixes and Compound Words banks.",
    context: "This vocabulary includes linguistic units and processes. It supplies no invented language histories or etymological examples; definitions and distinctions require human language-arts review.",
    sources: [spellingReference]
  }
];

export const evergreenHardBatch: StagedPuzzleCandidate[] = briefs.map((brief) => ({
  id: brief.id, proposedPath: `/word-searches/${brief.segment}/${brief.slug}-word-search`,
  title: `${brief.title} Word Search`, intent: brief.intent, status: "drafted", sourceReferences: brief.sources,
  puzzle: {
    puzzleTitle: `${brief.title} Word Search`, words: brief.words, seed: `staged-${brief.id.toLowerCase()}-v1`,
    rows: 20, columns: 20, directions: ["E", "W", "S", "N", "SE", "SW", "NE", "NW"],
    allowOverlap: true, alphabetPack: "latin", difficulty: "hard", answerKeyAvailable: true,
    onlinePlayAvailable: true, printableAvailable: true, pdfAvailable: true, largePrintSuitable: false
  },
  editorial: {
    puzzleNote: brief.intent, wordListContext: brief.context,
    difficultyExplanation: "Twenty entries in a 20×20 grid with all eight directions available. This is a configuration description, not a measured solve-time, expert rating or educational certification.",
    printNote: "Standard Letter/A4 technical output requires layout and physical-sheet review. No large-print suitability or fixed readable point-size is claimed."
  },
  taxonomy: { primaryCategory: brief.category, secondaryCategories: ["hard-word-searches"], audience: ["general"], format: ["printable", "pdf", "answer-key", "online-play"], educationalSubject: brief.segment }
}));
