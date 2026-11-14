import { publicCopyProposals } from "./pilot";

const baselineCommit = "a057692afaadf4d530d1dfe60b0fcd351e473a7e";
const baselineCapture = "Retained production 471a118 and C4 a0df44f HTTP captures from 2026-11-13T04:14:21.462Z. Verified all 434 HTML SHA-256 values and counted normalized body text excluding scripts, styles and SVG. The arrays describe the observed baseline indexed reuse, including three occurrences on each puzzle’s own page. New HTML verification is independent of these counts.";

export const issue117Pilot = {
  authorization: "Owner issue #117 applied the five exact public-copy proposals. The historical proposal decisions are retained in pilot.ts.",
  baselineCommit,
  changes: publicCopyProposals,
  additionalReuse: {
    "pilot-homepage-ancient-egypt-context": ["/search", "/search-index.json"],
    "pilot-hard-collection-angle": ["/search-index.json"]
  }
} as const;

export const issue117FollowUp = {
  authorization: "Owner issue #117 requested a narrow correction of prominent confirmed instruction-like public copy.",
  baselineCommit,
  sourceFile: "content/curated-topics-prompt6.ts",
  field: "context",
  baselineCapture,
  additionalReuse: ["/search", "/search-index.json"],
  changes: [
    {
      recordId: "reading-word-search",
      before: "The page is a general reading-themed activity and must not promise literacy or academic improvement.",
      after: "Use this easy puzzle before or after reading together. Ask solvers to point out a title, an author’s name, and a chapter in a book.",
      reason: "Offer a concrete follow-up activity using the easy Reading bank’s TITLE, AUTHOR and CHAPTER terms.",
      constraint: "Avoid unsupported literacy or academic-outcome claims.",
      affectedPaths: [
        "/",
        "/categories",
        "/categories/books-and-reading-word-searches",
        "/collections/easy-printable-word-searches",
        "/collections/word-searches-with-answer-keys",
        "/easy-word-searches",
        "/word-searches/books-and-reading/reading-word-search"
      ]
    },
    {
      recordId: "swimming-word-search",
      before: "The puzzle is a vocabulary activity and must not be treated as water-safety or swimming instruction.",
      after: "Compare freestyle, backstroke, breaststroke, and butterfly, then sort the remaining words into pool, equipment, or race terms. Use the puzzle for vocabulary practice and follow your instructor or lifeguard for water-safety guidance.",
      reason: "Group the frozen bank’s four named strokes and related activity terms. Keep the water-safety boundary in practical visitor language.",
      constraint: "Keep swimming technique and water-safety instruction outside the vocabulary activity.",
      affectedPaths: [
        "/",
        "/categories",
        "/categories/sports-word-searches",
        "/collections/medium-word-searches",
        "/collections/word-searches-with-answer-keys",
        "/esl-word-searches",
        "/word-searches/sports/swimming-word-search"
      ]
    },
    {
      recordId: "north-america-word-search",
      before: "The word list mixes political geography with broad regional vocabulary and should not be described as an exhaustive country list.",
      after: "This selection includes country and island names alongside regional terms such as Arctic and Caribbean.",
      reason: "Name the actual kinds of terms in the bank and give two examples of regional terms.",
      constraint: "Describe the bank as a selection and distinguish regions from country names.",
      affectedPaths: [
        "/categories/geography-word-searches",
        "/collections/classroom-word-search-worksheets",
        "/collections/geography-word-search-worksheets",
        "/collections/hard-printable-word-searches",
        "/collections/word-searches-with-answer-keys",
        "/word-searches/geography/north-america-word-search"
      ]
    },
    {
      recordId: "ancient-rome-word-search",
      before: "The word list spans the Republic and Empire and should be described as a broad review rather than one historical moment.",
      after: "The word list spans the Roman Republic and Empire. Look for civic terms such as senate and consul alongside structures such as the Colosseum and aqueducts.",
      reason: "Keep the existing historical scope and use SENATE, CONSUL, COLOSSEUM and AQUEDUCT to illustrate it.",
      constraint: "Frame the bank as a broad vocabulary review across the Republic and Empire.",
      affectedPaths: [
        "/categories/history-word-searches",
        "/collections/hard-printable-word-searches",
        "/collections/history-word-search-worksheets",
        "/collections/word-searches-with-answer-keys",
        "/word-searches/history/ancient-rome-word-search"
      ]
    },
    {
      recordId: "industrial-revolution-word-search",
      before: "The puzzle is a terminology review and should not oversimplify the period’s social, regional, or economic effects.",
      after: "Look for factory and transport terms such as textile, mill, canal, and locomotive alongside energy terms such as steam and coal.",
      reason: "Use the frozen bank’s own terms to help visitors see the vocabulary covered.",
      constraint: "Avoid unsupported historical claims about the period’s social, regional or economic effects.",
      affectedPaths: [
        "/categories/history-word-searches",
        "/collections/hard-printable-word-searches",
        "/collections/history-word-search-worksheets",
        "/collections/word-searches-with-answer-keys",
        "/hard-word-searches",
        "/word-searches/history/industrial-revolution-word-search"
      ]
    }
  ]
} as const;

export const issue117ExpandedContexts = {
  authorization: "Owner issue #117 requested correction of the remaining confirmed class-D puzzle contexts.",
  baselineCommit,
  sourceFile: issue117FollowUp.sourceFile,
  field: issue117FollowUp.field,
  baselineCapture,
  additionalReuse: issue117FollowUp.additionalReuse,
  changes: [
    {
      recordId: "human-body-word-search",
      before: "The page is an educational vocabulary activity and must not provide medical advice, diagnosis, or health claims.",
      after: "After finding the words, group them into organs, parts of the skeleton, and terms connected with movement.",
      reason: "Use BRAIN, HEART and LUNGS as organ examples and BONE, SPINE, JOINT and TENDON for a sorting activity.",
      constraint: "Keep anatomy vocabulary separate from medical advice, diagnosis and health claims.",
      affectedPaths: [
        "/categories/science-word-searches",
        "/collections/classroom-word-search-worksheets",
        "/collections/medium-word-searches",
        "/collections/word-searches-with-answer-keys",
        "/word-searches/science/human-body-word-search"
      ]
    },
    {
      recordId: "electricity-word-search",
      before: "The page supports terminology review and must not provide instructions for working with live electrical systems.",
      after: "Find circuit parts such as battery, wire, and switch, then compare the terms conductor and insulator. Use this as a vocabulary activity and follow your teacher’s safety instructions for practical work.",
      reason: "Name three components and a comparison from the frozen bank. Keep the practical-work safety boundary.",
      constraint: "Give no instructions for working with live electrical systems.",
      affectedPaths: [
        "/categories/science-word-searches",
        "/collections/classroom-word-search-worksheets",
        "/collections/medium-word-searches",
        "/collections/word-searches-with-answer-keys",
        "/word-searches/science/electricity-word-search"
      ]
    },
    {
      recordId: "money-word-search",
      before: "The puzzle is a terminology activity and must not provide financial advice or claims about financial outcomes.",
      after: "After solving, sort the words into things you can pay with, such as coins and bills, and words you might see on a price tag or receipt, such as price and total.",
      reason: "Use COIN, BILL, PRICE and TOTAL in a sorting prompt about dollars and cents vocabulary.",
      constraint: "Keep the activity to terminology and avoid financial advice or claims about financial outcomes.",
      affectedPaths: [
        "/categories/math-word-searches",
        "/collections/classroom-word-search-worksheets",
        "/collections/easy-printable-word-searches",
        "/collections/math-word-search-worksheets",
        "/collections/word-searches-with-answer-keys",
        "/word-searches/math/money-word-search"
      ]
    },
    {
      recordId: "percentages-word-search",
      before: "This is a math-language puzzle and must not be presented as financial, tax, or investment advice.",
      after: "Pair the words part and whole, then find percent, fraction, and decimal. Use the list alongside a lesson on relating different ways of writing parts of a whole.",
      reason: "Use the bank’s PART, WHOLE, PERCENT, FRACTION and DECIMAL terms in a math-language activity.",
      constraint: "Keep the activity to math vocabulary and avoid financial, tax and investment advice.",
      affectedPaths: [
        "/categories/math-word-searches",
        "/collections/classroom-word-search-worksheets",
        "/collections/math-word-search-worksheets",
        "/collections/medium-word-searches",
        "/collections/word-searches-with-answer-keys",
        "/word-searches/math/percentages-word-search"
      ]
    },
    {
      recordId: "gratitude-word-search",
      before: "The puzzle avoids mental-health claims and functions only as a general values-themed activity.",
      after: "After solving, choose a word such as help, share, or kindness and use it in a short thank-you note.",
      reason: "Offer a concrete written activity based on HELP, SHARE and KINDNESS.",
      constraint: "Avoid mental-health claims.",
      affectedPaths: [
        "/categories/classroom-and-values-word-searches",
        "/collections/classroom-word-search-worksheets",
        "/collections/easy-printable-word-searches",
        "/collections/word-searches-with-answer-keys",
        "/word-searches/classroom-values/gratitude-word-search"
      ]
    },
    {
      recordId: "mothers-day-word-search",
      before: "Use inclusive supporting copy that acknowledges families may recognize caregivers and important adults in different ways.",
      after: "Use the puzzle to think about how you might thank a mother, caregiver, or another important adult. May appears in the word list because some places celebrate Mother’s Day in May, and the date varies by country.",
      reason: "Keep the fixed MAY entry in context and offer an activity that includes different caregivers.",
      constraint: "Accommodate varied family circumstances and local observance dates.",
      affectedPaths: [
        "/categories/holiday-word-searches",
        "/collections/easy-printable-word-searches",
        "/collections/seasonal-word-searches",
        "/collections/word-searches-with-answer-keys",
        "/word-searches/holidays/mothers-day-word-search"
      ]
    },
    {
      recordId: "medieval-times-word-search",
      before: "Avoid presenting fictional castle stories or modern fantasy conventions as historical fact.",
      after: "This puzzle focuses on vocabulary often taught about medieval Europe. Look for castle features such as tower and moat, then find words about village life and work.",
      reason: "Use CASTLE, TOWER, MOAT, VILLAGE and GUILD to describe the European scope of this bank.",
      constraint: "Keep the European scope explicit and avoid treating modern fantasy or fictional castle stories as history.",
      affectedPaths: [
        "/categories/history-word-searches",
        "/collections/history-word-search-worksheets",
        "/collections/medium-word-searches",
        "/collections/word-searches-with-answer-keys",
        "/word-searches/history/medieval-times-word-search"
      ]
    },
    {
      recordId: "singing-word-search",
      before: "The puzzle is a music-vocabulary activity and must not provide vocal-health or technique claims.",
      after: "Find verse, chorus, and melody, then listen to a familiar song and try to identify its verse and chorus.",
      reason: "Connect three terms from the bank with an observable listening activity.",
      constraint: "Avoid vocal-health and technique claims.",
      affectedPaths: [
        "/categories/music-word-searches",
        "/collections/easy-printable-word-searches",
        "/collections/word-searches-with-answer-keys",
        "/word-searches/music/singing-word-search"
      ]
    },
    {
      recordId: "sculpture-word-search",
      before: "The puzzle is an art-terminology resource and must not provide instructions for hazardous tools or materials.",
      after: "Compare materials such as clay, stone, metal, and wood, then look for display words such as studio and pedestal.",
      reason: "Use CLAY, STONE, METAL, WOOD, STUDIO and PEDESTAL to contrast materials and display vocabulary.",
      constraint: "Give no instructions for using hazardous tools or materials.",
      affectedPaths: [
        "/categories/art-word-searches",
        "/collections/medium-word-searches",
        "/collections/word-searches-with-answer-keys",
        "/word-searches/art/sculpture-word-search"
      ]
    },
    {
      recordId: "crafts-word-search",
      before: "The page is a vocabulary activity and must not give age-specific or tool-safety assurances.",
      after: "After solving, group paper, yarn, and fabric as materials and fold, cut, and design as actions. Follow the project’s safety directions if you try a craft afterward.",
      reason: "Use six frozen-bank terms for a materials and actions sort with a practical safety reminder.",
      constraint: "Avoid age-specific and tool-safety assurances.",
      affectedPaths: [
        "/categories/art-word-searches",
        "/collections/easy-printable-word-searches",
        "/collections/word-searches-with-answer-keys",
        "/word-searches/art/crafts-word-search"
      ]
    }
  ]
} as const;

export const issue117CollectionAndGuideCopy = {
  authorization: "Owner issue #117 requested corrections to confirmed visitor-copy and capability mismatches.",
  baselineCommit,
  baselineCapture: "Fresh C4 indexed URL scope measured by each exact original sentence in docs/releases/QUALITY-PAGE-COPY.json.",
  changes: [
    {
      sourceFile: "content/collections.ts",
      recordId: "word-searches-with-answer-keys",
      field: "selectionGuidance",
      before: "Every listing opens one canonical puzzle page. Answer views are utilities rather than separate sitemap entries, so the unsolved grid and its solution remain one reproducible puzzle.",
      after: "Open a puzzle from the list and choose Show Answers to see the solution for that grid.",
      reason: "Point visitors to the actual answer control.",
      constraint: "Keep the solution paired with the puzzle selected.",
      affectedPaths: [
        "/collections/word-searches-with-answer-keys"
      ]
    },
    {
      sourceFile: "content/collections.ts",
      recordId: "history-word-search-worksheets",
      field: "selectionGuidance",
      before: "The six pages cover Ancient Egypt, Ancient Greece, Ancient Rome, Medieval Times, the Renaissance, and the Industrial Revolution without relying on fictional franchises.",
      after: "The six pages cover Ancient Egypt, Ancient Greece, Ancient Rome, Medieval Times, the Renaissance, and the Industrial Revolution.",
      reason: "Retain all six topics and trim the editorial aside.",
      constraint: "Keep fictional franchises outside the curated historical selection.",
      affectedPaths: [
        "/collections/history-word-search-worksheets"
      ]
    },
    {
      sourceFile: "content/guides.ts",
      recordId: "how-to-make-a-word-search",
      field: "sections[Test the answer key].body",
      before: "Confirm that every listed word has one exact coordinate path and that the highlighted solution matches the visible letters. The key should be derived from the generated placements, not rebuilt independently.",
      after: "Choose Show Answers and check that each highlighted line spells a listed word in the grid.",
      reason: "Use the actual control and describe what a visitor can verify.",
      constraint: "Derive the answer from the same generated placements.",
      affectedPaths: [
        "/guides/how-to-make-a-word-search"
      ]
    },
    {
      sourceFile: "content/guides.ts",
      recordId: "how-to-make-a-word-search-with-answer-key",
      field: "introduction",
      before: "The safest answer key is not a second puzzle. It is a view of the exact placements stored by the one generated puzzle definition.",
      after: "Use Show Answers or include an answer-key page when you print or download the puzzle to get the solution for the same grid.",
      reason: "Lead with actual ways to see or include the matching key.",
      constraint: "The answer always comes from the current puzzle's placements.",
      affectedPaths: [
        "/guides/how-to-make-a-word-search-with-answer-key"
      ]
    },
    {
      sourceFile: "content/guides.ts",
      recordId: "how-to-make-a-word-search-with-answer-key",
      field: "sections[Generate one stable puzzle].body",
      before: "Create the grid once using a stable seed. Treat that generated result as the source for every output instead of making separate print and solution grids.",
      after: "Generate the puzzle with a fixed seed. Use Print, Download PDF, or Show Answers for copies and solutions that match that grid.",
      reason: "Name real controls and keep the fixed-seed instruction.",
      constraint: "Derive output from the same generated result.",
      affectedPaths: [
        "/guides/how-to-make-a-word-search-with-answer-key"
      ]
    },
    {
      sourceFile: "content/guides.ts",
      recordId: "how-to-make-a-word-search-with-answer-key",
      field: "sections[Preview answers without marking progress as solved].body",
      before: "An answer reveal may overlay solution paths, but it should not write those paths into the player's found-word progress. Closing the preview should restore the unsolved interaction state.",
      after: "Choose Show Answers to check a word. Choose Hide Answers to continue solving from where you left off.",
      reason: "Describe the toggle using the labels users see.",
      constraint: "An answer overlay must preserve existing solver progress.",
      affectedPaths: [
        "/guides/how-to-make-a-word-search-with-answer-key"
      ]
    },
    {
      sourceFile: "content/guides.ts",
      recordId: "how-to-make-a-word-search-with-answer-key",
      field: "sections[Avoid regenerating the key separately].body",
      before: "Do not ask the generator to place the words again for the answer page. Even a small seed or setting difference could produce a valid but unrelated solution.",
      after: "Use the key from the puzzle you plan to share or print. If you change the seed, words, or settings, use the key from the updated puzzle.",
      reason: "Explain which answer key to keep when the puzzle changes.",
      constraint: "Changing a seed or other generation settings may change the placements.",
      affectedPaths: [
        "/guides/how-to-make-a-word-search-with-answer-key"
      ]
    },
    {
      sourceFile: "content/guides.ts",
      recordId: "word-search-rules",
      field: "sections[Words must follow a straight line].body",
      before: "A valid path cannot turn a corner, skip a cell, or jump between rows. Every selected cell must be adjacent along one constant direction vector.",
      after: "Follow one straight line through adjacent cells in the grid. Keep going in the same direction without skipping any letters.",
      reason: "Express the path rule in ordinary solving terms.",
      constraint: "Selections must follow adjacent cells in a fixed direction.",
      affectedPaths: [
        "/guides/word-search-rules"
      ]
    },
    {
      sourceFile: "content/guides.ts",
      recordId: "word-search-rules",
      field: "sections[Forward and backward placement].body",
      before: "Easy puzzles in this batch use forward paths only. Medium and Hard puzzles may begin at either end, so a listed word can appear reversed in the grid.",
      after: "Curated Easy puzzles use forward paths only. Medium and Hard puzzles may begin at either end, so a listed word can appear reversed in the grid.",
      reason: "Replace internal batch terminology with the relevant published scope.",
      constraint: "The forward-only statement applies to the curated Easy inventory.",
      affectedPaths: [
        "/guides/word-search-rules"
      ]
    },
    {
      sourceFile: "content/guides.ts",
      recordId: "word-search-solving-tips",
      field: "introduction",
      before: "A consistent scan is often more useful than searching the whole grid at once. These strategies help organize the task without making claims about cognition or health.",
      after: "A consistent scan is often more useful than searching the whole grid at once. These strategies help organize the task.",
      reason: "Keep the scanning guidance and trim the editorial aside.",
      constraint: "Avoid unsupported cognition and health claims.",
      affectedPaths: [
        "/guides/word-search-solving-tips"
      ]
    },
    {
      sourceFile: "content/guides.ts",
      recordId: "custom-word-lists-for-word-searches",
      field: "sections[Use relevant terms].body",
      before: "A non-copyrighted garden example could use TROWEL, RAKE, SPADE, HOSE, GLOVES, WHEELBARROW, WATERING CAN, PRUNERS, FORK, and SHOVEL. Each term directly serves the stated topic.",
      after: "A garden example could use TROWEL, RAKE, SPADE, HOSE, GLOVES, WHEELBARROW, WATERING CAN, PRUNERS, FORK, and SHOVEL. Each term directly serves the stated topic.",
      reason: "Keep the full garden example and trim the editorial adjective.",
      constraint: "Select examples suitable for publication under the site's rights policy.",
      affectedPaths: [
        "/guides/custom-word-lists-for-word-searches"
      ]
    },
    {
      sourceFile: "content/guides.ts",
      recordId: "large-print-word-searches",
      field: "introduction",
      before: "Large print is a layout choice: it gives the grid and labels more space while preserving the same seeded puzzle and answer key.",
      after: "Choose Larger grid type for the ordinary layout or download a measured large-print PDF. Both options keep the same puzzle and matching answer key.",
      reason: "Distinguish the layout options while retaining the same-puzzle guarantee.",
      constraint: "Layout choices must preserve the puzzle and solution.",
      affectedPaths: [
        "/guides/large-print-word-searches"
      ]
    },
    {
      sourceFile: "content/guides.ts",
      recordId: "large-print-word-searches",
      field: "sections[What large print changes].body",
      before: "Large print increases the visible size of grid letters, cells, headings, and word-bank text. It does not change the word placements, so standard and large-print outputs can still share one answer key.",
      after: "Larger grid type enlarges the grid letters in the ordinary layout. The measured large-print PDF uses at least 16-point grid letters and an 18-point word bank. The size minimums apply to the grid and word bank; word placements stay the same.",
      reason: "Use the tested PDF type minima and distinguish grid, bank, and supporting text.",
      constraint: "Apply measured type minima only to the measured PDF and preserve placements.",
      affectedPaths: [
        "/guides/large-print-word-searches"
      ]
    },
    {
      sourceFile: "content/guides.ts",
      recordId: "large-print-word-searches",
      field: "sections[Using the site's Large Print option].body",
      before: "Open a reviewed puzzle or create one in the generator, choose Print, and enable Large Print in the output settings. The option enlarges the print layout without changing the stored puzzle definition.",
      after: "For the ordinary layout, open Print and select Larger grid type. For the measured layout, open Download PDF and choose Download measured large-print PDF. Check the downloaded PDF before printing.",
      reason: "Use the actual controls and point visitors to preview.",
      constraint: "Keep the ordinary print choice and measured PDF separate and avoid promises about printer scaling.",
      affectedPaths: [
        "/guides/large-print-word-searches"
      ]
    }
  ]
} as const;
