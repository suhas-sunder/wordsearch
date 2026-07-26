export interface Guide {
  slug: string;
  title: string;
  description: string;
  words: string[];
  sections: Array<{ heading: string; body: string }>;
  publicationStatus?: "draft" | "published";
  introduction?: string;
  metaTitle?: string;
  metaDescription?: string;
  authorId?: string;
  reviewedOn?: string;
  relatedGuides?: string[];
  relatedTools?: string[];
}

const reviewedOn = "2026-07-25";

const publishedGuides: Guide[] = [
  {
    slug: "how-to-make-a-word-search",
    title: "How to Make a Word Search",
    description: "A step-by-step process for preparing a useful word list, choosing puzzle settings, reviewing the grid, and creating matching outputs.",
    introduction: "A good word search begins with a clear purpose and ends with a checked solution. The steps below keep the topic, grid, printout, and answer key aligned.",
    metaTitle: "How to Make a Word Search | Step-by-Step Guide",
    metaDescription: "Learn how to choose a topic, prepare a word list, select a grid and difficulty, generate the puzzle, review it, and create an answer key.",
    words: ["topic", "words", "duplicates", "grid", "directions", "backwards", "seed", "excluded", "answer", "print", "share"],
    publicationStatus: "published",
    authorId: "suhas-sunder",
    reviewedOn,
    relatedGuides: ["how-to-make-a-word-search-with-answer-key", "word-search-difficulty-guide", "how-to-print-a-word-search"],
    relatedTools: ["/word-search-generator", "/free-printable-word-searches"],
    sections: [
      { heading: "Choose a clear topic", body: "Name one subject that a solver can recognize quickly. A focused topic keeps the word bank coherent and makes it easier to judge whether every term belongs." },
      { heading: "Build a relevant word list", body: "Choose familiar terms first, then add more specific vocabulary when the intended difficulty calls for it. For a garden example, a concise list might include SEED, SOIL, TROWEL, COMPOST, WATER, MULCH, BLOOM, and HARVEST." },
      { heading: "Remove duplicates and spelling errors", body: "Compare words after capitalization, spaces, and punctuation have been normalized for placement. Correct spelling in the displayed list before generating so the solver and answer key use the intended form." },
      { heading: "Choose grid dimensions", body: "The longest normalized word must fit the selected row or column. Larger grids can hold more or longer terms, while a compact grid produces a quicker scan." },
      { heading: "Choose allowed directions", body: "Forward horizontal and vertical paths are the simplest to follow. Diagonals and additional orientations increase the number of possible paths a solver must inspect." },
      { heading: "Decide whether backwards words are appropriate", body: "Reverse spelling adds challenge because the word bank shows the opposite reading order. Use it deliberately, especially when a group needs a straightforward activity." },
      { heading: "Generate with a stable seed", body: "A stable seed makes the same words and settings produce the same placements. Keep it unchanged when printouts, PDFs, online play, and shared copies must match." },
      { heading: "Review excluded words", body: "Check the generator report before publishing or printing. If a word did not fit, enlarge the grid within the intended difficulty or revise the list openly instead of silently omitting it." },
      { heading: "Test the answer key", body: "Confirm that every listed word has one exact coordinate path and that the highlighted solution matches the visible letters. The key should be derived from the generated placements, not rebuilt independently." },
      { heading: "Print, download, or share", body: "Review the page preview before choosing browser print or PDF. Share the unsolved puzzle state so another solver receives the same grid without inheriting your progress." },
      { heading: "Use the I Love Word Search generator", body: "Paste one word per line, choose difficulty and output options, then generate the puzzle. The generator carries the same stable definition into play, print, PDF, answer, share, and QR workflows." }
    ]
  },
  {
    slug: "how-to-print-a-word-search",
    title: "How to Print a Word Search",
    description: "Practical settings for printing a word search on Letter or A4 paper with standard or large-print layouts and an optional solution.",
    introduction: "A print-ready word search should keep the grid and word bank readable without clipping. Use the preview to choose paper, orientation, scale, and whether a separate answer page is needed.",
    metaTitle: "How to Print a Word Search | Letter and A4 Guide",
    metaDescription: "Learn how to print a word search using Letter or A4 paper, portrait or landscape orientation, large print, and optional answer pages.",
    words: ["curated", "custom", "print", "letter", "a4", "portrait", "landscape", "large", "answer", "preview", "margin"],
    publicationStatus: "published",
    authorId: "suhas-sunder",
    reviewedOn,
    relatedGuides: ["how-to-make-a-word-search", "how-to-make-a-word-search-with-answer-key", "word-search-difficulty-guide"],
    relatedTools: ["/free-printable-word-searches", "/word-search-pdf"],
    sections: [
      { heading: "Open a curated or custom puzzle", body: "Choose a reviewed topic page or generate a puzzle from your own list. Finish any word-list or difficulty changes before opening the printable view." },
      { heading: "Select Print", body: "Use the puzzle's Print control to open the dedicated preview. This view removes navigation and decorative interface elements from the page that will be sent to the printer." },
      { heading: "Choose Letter or A4", body: "Select Letter for the common North American page size or A4 for the international standard. The layout adjusts to the selected sheet rather than stretching a screenshot." },
      { heading: "Choose portrait or landscape", body: "Portrait usually suits square grids and a word bank beneath them. Landscape can give a wide grid or multi-column word bank more horizontal room." },
      { heading: "Choose standard or large print", body: "Standard print balances grid size with the word list and notes. Large print increases cell and letter size, which may require fewer words per page or an additional sheet." },
      { heading: "Include or exclude the answer key", body: "Leave the answer page off for a solver copy. Include it for a teacher, parent, host, or self-checking packet that needs the matching solution." },
      { heading: "Add name, date, and instructions", body: "Turn on the name and date line when the sheet will be distributed to a group. Keep instructions short and accurate for the directions actually allowed in the puzzle." },
      { heading: "Review the preview", body: "Check that the full grid, word bank, title, and optional answer page are visible. Look for unexpected wrapping or a page break that separates the grid from essential labels." },
      { heading: "Open the browser print dialog", body: "Continue from the preview to the browser dialog, select the physical printer or Save as PDF, and confirm paper size and orientation again. Browser settings can override the choices shown in a web preview." },
      { heading: "Troubleshoot clipping and printer margins", body: "Physical printer margins vary by device. If edges clip, return to the preview, choose a different orientation or scale, and avoid borderless settings unless the printer supports them." }
    ]
  },
  {
    slug: "how-to-make-a-word-search-with-answer-key",
    title: "How to Make a Word Search with an Answer Key",
    description: "A deterministic workflow for creating one puzzle and a matching solution across online play, print, PDF, sharing, and QR links.",
    introduction: "The safest answer key is not a second puzzle. It is a view of the exact placements stored by the one generated puzzle definition.",
    metaTitle: "How to Make a Word Search with an Answer Key",
    metaDescription: "Create a deterministic word search and matching answer key that stays consistent across online play, printing, PDF downloads, and sharing.",
    words: ["words", "seed", "settings", "coordinates", "preview", "answer", "pdf", "share", "regenerate"],
    publicationStatus: "published",
    authorId: "suhas-sunder",
    reviewedOn,
    relatedGuides: ["how-to-make-a-word-search", "how-to-print-a-word-search", "word-search-rules"],
    relatedTools: ["/word-search-generator", "/word-search-pdf"],
    sections: [
      { heading: "Enter and review words", body: "Add the final displayed list and correct duplicates or unsupported characters first. A key can only be accurate when it is based on the same accepted words the solver sees." },
      { heading: "Generate one stable puzzle", body: "Create the grid once using a stable seed. Treat that generated result as the source for every output instead of making separate print and solution grids." },
      { heading: "Preserve the seed and settings", body: "Keep rows, columns, difficulty, directions, overlap, alphabet pack, and seed together. Changing any of these can change placements even when the visible word list is unchanged." },
      { heading: "Verify each placed coordinate path", body: "For every word, confirm the recorded start cell, direction, and ordered cells spell the normalized term. Excluded words must be reported rather than shown as if they have an answer." },
      { heading: "Preview answers without marking progress as solved", body: "An answer reveal may overlay solution paths, but it should not write those paths into the player's found-word progress. Closing the preview should restore the unsolved interaction state." },
      { heading: "Print an answer-key second page", body: "Keep the student puzzle clean on the first page and place the highlighted solution on a separate page. Both pages must render the same letters in the same coordinates." },
      { heading: "Download a combined PDF", body: "When answers are enabled, export the puzzle and key from the same result in one document. This avoids mismatched files with similar titles." },
      { heading: "Share the unsolved puzzle", body: "A share or QR link should preserve the definition without carrying found words or an open answer overlay. The recipient gets the same grid in a fresh solving state." },
      { heading: "Avoid regenerating the key separately", body: "Do not ask the generator to place the words again for the answer page. Even a small seed or setting difference could produce a valid but unrelated solution." }
    ]
  },
  {
    slug: "word-search-difficulty-guide",
    title: "Word Search Difficulty Guide",
    description: "A comparison of easy, medium, and hard word searches using grid size, word count, length, directions, and overlap.",
    introduction: "Difficulty comes from several puzzle settings working together. Compare the actual grid and placement rules instead of relying on a fixed age label.",
    metaTitle: "Word Search Difficulty Guide | Easy, Medium, and Hard",
    metaDescription: "Compare easy, medium, and hard word searches by grid size, word count, directions, word length, overlap, and solving difficulty.",
    words: ["difficulty", "easy", "medium", "hard", "grid", "count", "length", "backwards", "diagonal", "overlap", "group"],
    publicationStatus: "published",
    authorId: "suhas-sunder",
    reviewedOn,
    relatedGuides: ["word-search-rules", "word-search-solving-tips", "how-to-make-a-word-search"],
    relatedTools: ["/word-search-generator", "/collections/easy-printable-word-searches", "/collections/hard-printable-word-searches"],
    sections: [
      { heading: "What changes difficulty", body: "Grid dimensions, number of terms, word length, allowed directions, and overlap all affect the search. Familiarity with the vocabulary and the printed letter size also change how demanding a particular grid feels." },
      { heading: "Easy preset", body: "The reviewed Easy preset uses a 12 × 12 grid with twelve words. Paths run forward horizontally, vertically, or diagonally, with overlap allowed and no backwards spelling." },
      { heading: "Medium preset", body: "The Medium preset uses a 15 × 15 grid with sixteen words. All eight straight directions are available, so solvers must check reverse and upward paths as well as familiar forward ones." },
      { heading: "Hard preset", body: "The Hard preset uses an 18 × 18 grid with twenty words, every straight direction, and denser placement. Longer lists and more possible paths create the intended advanced challenge." },
      { heading: "Grid size", body: "A larger grid contains more candidate letters and can hold longer terms. Grid size alone does not determine difficulty, because a large grid with few short words may still scan quickly." },
      { heading: "Number and length of words", body: "More terms increase the amount of tracking required. Long words can be easier to confirm once spotted, while short words can occur in many plausible locations." },
      { heading: "Backwards and diagonal placement", body: "Reverse paths make the first visible letter different from the word-bank reading order. Diagonals add scan lines that are less visually regular than rows and columns." },
      { heading: "Overlapping words", body: "Overlap lets words share matching letters and helps a list fit cleanly. It can also create dense regions where one discovered path provides a useful crossing letter for another." },
      { heading: "Choosing a puzzle for a group", body: "Consider vocabulary familiarity, available time, print size, and whether assistance or an answer key will be available. Avoid treating one preset as a guaranteed fit for everyone in a broad age band." },
      { heading: "Customizing difficulty in the generator", body: "Start from the closest preset, then adjust one factor at a time. Preserve the seed once the result is approved so every distributed copy remains identical." }
    ]
  },
  {
    slug: "word-search-rules",
    title: "Word Search Rules",
    description: "The basic rules for finding straight-line words, handling reverse and overlapping placements, and marking exact answers online or on paper.",
    introduction: "A word search asks the solver to match listed words to continuous straight paths in the grid. The active puzzle settings determine which directions count.",
    metaTitle: "Word Search Rules | How the Puzzle Works",
    metaDescription: "Learn the basic rules of word search puzzles, including directions, overlapping words, reverse spelling, word banks, and answer keys.",
    words: ["listed", "straight", "horizontal", "vertical", "diagonal", "forward", "backward", "overlap", "select", "paper", "solved"],
    publicationStatus: "published",
    authorId: "suhas-sunder",
    reviewedOn,
    relatedGuides: ["word-search-solving-tips", "word-search-difficulty-guide", "how-to-make-a-word-search-with-answer-key"],
    relatedTools: ["/online-word-search", "/word-search-generator"],
    sections: [
      { heading: "Find listed words in the grid", body: "Use the word bank as the set of targets. A displayed word is complete only when its normalized letters match one placed path in order." },
      { heading: "Words must follow a straight line", body: "A valid path cannot turn a corner, skip a cell, or jump between rows. Every selected cell must be adjacent along one constant direction vector." },
      { heading: "Horizontal, vertical, and diagonal placement", body: "Depending on the puzzle, words may run along rows, columns, or 45-degree diagonals. The instructions and difficulty indicate which orientations are possible." },
      { heading: "Forward and backward placement", body: "Easy puzzles in this batch use forward paths only. Medium and Hard puzzles may begin at either end, so a listed word can appear reversed in the grid." },
      { heading: "Overlapping words", body: "Two or more words may share a cell when the required letter is identical. Finding one word does not automatically solve another path that crosses it." },
      { heading: "Selecting words online", body: "Start on one endpoint and finish on the other endpoint. The solver resolves the exact straight coordinate path between those cells rather than accepting any loose group of matching letters." },
      { heading: "Marking words on paper", body: "Circle, highlight, or draw a line through every letter in one continuous path. Mark the corresponding word in the bank to keep track of completed targets." },
      { heading: "When a word counts as solved", body: "Online, the selected coordinates must match a stored placement in either endpoint order. On paper, compare the same complete sequence before crossing the word off." },
      { heading: "Using hints or answer keys", body: "A hint can narrow the search, while an answer view shows the recorded paths. Use either deliberately; viewing a solution online should not rewrite the player's progress as though each word was found." },
      { heading: "Differences among puzzle settings", body: "Grid size, allowed directions, overlap, alphabet pack, word-bank order, and print size can vary. Read the current puzzle's instructions instead of assuming every word search follows the same preset." }
    ]
  },
  {
    slug: "word-search-solving-tips",
    title: "Word Search Solving Tips",
    description: "Practical techniques for scanning letters, checking word shapes, tracing directions, and tracking completed terms.",
    introduction: "A consistent scan is often more useful than searching the whole grid at once. These strategies help organize the task without making claims about cognition or health.",
    metaTitle: "Word Search Solving Tips | Practical Search Strategies",
    metaDescription: "Use practical word search strategies such as scanning for uncommon letters, checking endings, tracing directions, and tracking completed words.",
    words: ["list", "uncommon", "first", "last", "direction", "pairs", "length", "backwards", "mark", "stuck", "hint"],
    publicationStatus: "published",
    authorId: "suhas-sunder",
    reviewedOn,
    relatedGuides: ["word-search-rules", "word-search-difficulty-guide", "how-to-make-a-word-search-with-answer-key"],
    relatedTools: ["/online-word-search", "/collections/medium-word-searches"],
    sections: [
      { heading: "Read the word list first", body: "Notice the longest terms, repeated beginnings, and any phrases normalized for the grid. Knowing the targets reduces the temptation to chase every accidental letter sequence." },
      { heading: "Start with uncommon letters", body: "Look for letters that appear rarely in the grid, then test the surrounding paths. A distinctive starting or interior letter can reduce the number of plausible matches." },
      { heading: "Check first and last letters", body: "Scan for both endpoints, especially when reverse placement is allowed. Matching the final letter first can reveal a backwards word that is easy to miss from its usual beginning." },
      { heading: "Scan one direction at a time", body: "Work across rows, then columns, then one diagonal slope and the other. A structured pass makes it easier to know which paths have already received attention." },
      { heading: "Look for letter pairs", body: "A pair such as PH, QU, or a doubled letter is more distinctive than one character. Confirm that the rest of the word continues in the same straight direction." },
      { heading: "Use word length", body: "Estimate how much space a target occupies before tracing it. Long words need a long uninterrupted path, while short words deserve careful endpoint checking because several candidates may exist." },
      { heading: "Check backwards paths", body: "When the settings allow reverse placement, read away from a possible final letter as well as from the first. Keep the direction constant for the whole word." },
      { heading: "Mark completed words", body: "Cross off or visually mark each confirmed item in the bank. Online found-state indicators and paper marks both prevent repeated searching for an already completed target." },
      { heading: "Change approach when stuck", body: "Switch to a different word, direction, or region of the grid instead of repeating the same scan. Returning later can make a familiar letter pattern easier to notice." },
      { heading: "Use hints or answers deliberately", body: "Use a hint for a small nudge or the answer view for a full check, depending on your purpose. If you want to keep solving, close the solution overlay and continue from your genuine found-word progress." }
    ]
  }
];

const prompt6Guides: Guide[] = [
  {
    slug: "large-print-word-searches",
    title: "How to Create and Print Large Print Word Searches",
    description: "Practical choices for creating and printing word searches with larger letters, cells, and word-bank text.",
    introduction: "Large print is a layout choice: it gives the grid and labels more space while preserving the same seeded puzzle and answer key.",
    metaTitle: "How to Create and Print Large Print Word Searches",
    metaDescription: "Learn how grid size, word count, orientation, paper size, previews, and printer margins affect a large-print word search.",
    words: ["large", "letters", "grid", "words", "portrait", "landscape", "letter", "a4", "answer", "preview"],
    publicationStatus: "published",
    authorId: "suhas-sunder",
    reviewedOn,
    relatedGuides: ["how-to-print-a-word-search", "word-search-difficulty-guide", "custom-word-lists-for-word-searches"],
    relatedTools: ["/large-print-word-searches", "/word-search-generator"],
    sections: [
      { heading: "What large print changes", body: "Large print increases the visible size of grid letters, cells, headings, and word-bank text. It does not change the word placements, so standard and large-print outputs can still share one answer key." },
      { heading: "Letter size and grid size", body: "A larger type size needs a larger cell. A compact 12 by 12 grid usually has more room to grow than an 18 by 18 grid on the same sheet, so compare the actual preview before printing." },
      { heading: "Choosing shorter word lists", body: "Fewer words leave room for a larger grid and a readable bank. Keep the terms most central to the topic instead of shrinking the page to accommodate an unnecessarily long list." },
      { heading: "Portrait versus landscape", body: "Portrait often suits a square grid with the word bank below it. Landscape can provide extra width for a larger grid or multi-column bank, but the best choice depends on the selected paper and content." },
      { heading: "Letter and A4 paper", body: "Select Letter for common North American paper or A4 for the international standard. The preview fits the layout to the chosen sheet rather than treating one paper size as a scaled copy of the other." },
      { heading: "Word-bank readability", body: "Check the bank as carefully as the grid. Terms should not crowd together, split unexpectedly, or become so small that the larger grid no longer provides a consistent large-print layout." },
      { heading: "Printing an answer key", body: "Put the solution on a separate page when space is limited. The highlighted key should be derived from the same grid coordinates, not generated again with different settings." },
      { heading: "Using the site's Large Print option", body: "Open a reviewed puzzle or create one in the generator, choose Print, and enable Large Print in the output settings. The option enlarges the print layout without changing the stored puzzle definition." },
      { heading: "Checking the preview", body: "Confirm that every grid row, word-bank item, title, and optional answer page appears before opening the browser dialog. Also check orientation and paper size because browser settings can override the preview." },
      { heading: "Printer-margin limitations", body: "Printable areas vary among printers. If an edge clips, choose another orientation or reduce browser scale slightly; do not assume a borderless setting is available on every device." }
    ]
  },
  {
    slug: "classroom-word-search-ideas",
    title: "Classroom Word Search Ideas",
    description: "Ten bounded ways to use reviewed or custom word searches as supporting classroom activities.",
    introduction: "A word search can provide a short encounter with a prepared word set, but it should support—not replace—explanation, reading, discussion, or practice.",
    metaTitle: "Classroom Word Search Ideas | Printable Activities",
    metaDescription: "Use word searches for vocabulary previews, reviews, warm-ups, spelling lists, early finishers, partner checks, and printable answer keys.",
    words: ["preview", "review", "early", "warmup", "topic", "spelling", "partner", "answers", "difficulty", "review"],
    publicationStatus: "published",
    authorId: "suhas-sunder",
    reviewedOn,
    relatedGuides: ["vocabulary-practice-with-word-searches", "custom-word-lists-for-word-searches", "homeschool-word-search-ideas"],
    relatedTools: ["/word-searches-for-teachers", "/collections/classroom-word-search-worksheets"],
    sections: [
      { heading: "Vocabulary preview", body: "Show the word list before a new lesson and ask learners which terms they recognize. Define or discuss the terms separately so the puzzle remains a preview, not the instruction itself." },
      { heading: "Vocabulary review", body: "Use a focused list after the terms have been taught. A follow-up sort, definition check, or short response can reconnect the found words to their meanings." },
      { heading: "Early-finisher activity", body: "Keep a clearly optional puzzle available for students who finish assigned work. Choose vocabulary they can handle independently and avoid using speed on the puzzle as a measure of subject mastery." },
      { heading: "Classroom warm-up", body: "Select a short Easy puzzle for a bounded opening activity. State how long to spend and what should happen afterward, such as comparing two terms or identifying the current topic." },
      { heading: "Topic introduction", body: "A general science, geography, history, or reading puzzle can reveal the vocabulary in an upcoming unit. Follow it with context that explains people, processes, places, or concepts." },
      { heading: "Spelling-list puzzle", body: "Paste the exact reviewed spelling list into the generator. Check capitalization, duplicates, phrases, and accepted words before sharing the deterministic puzzle." },
      { heading: "Partner checking", body: "Partners can compare found paths or verify the word bank together. Give them the rule that a word must follow one continuous straight line and encourage them to explain any disagreement." },
      { heading: "Printable answer keys", body: "Print the answer page for the teacher or a checking station rather than placing it beside every unsolved copy. Because it uses the same seed, the letters and highlights match exactly." },
      { heading: "Selecting difficulty", body: "Compare grid size, word count, directions, vocabulary familiarity, and available time. Difficulty labels describe puzzle settings and are not fixed grade-level recommendations." },
      { heading: "Reviewing suitability before use", body: "Read the complete word list, directions, title, and surrounding text before distribution. Confirm that the content fits the class purpose, local expectations, and the time and support available." }
    ]
  },
  {
    slug: "homeschool-word-search-ideas",
    title: "Homeschool Word Search Ideas",
    description: "Flexible ways to add reviewed or custom word searches to a home-learning plan without prescribing a curriculum.",
    introduction: "Word searches can be brief, optional activities around a current topic. The useful choice depends on the learner, materials, and goals selected by the family.",
    metaTitle: "Homeschool Word Search Ideas | Print and Online",
    metaDescription: "Explore flexible homeschool word search ideas using current topics, custom lists, printables, online play, difficulty settings, and answer keys.",
    words: ["topics", "custom", "independent", "print", "online", "difficulty", "answers", "subjects", "purpose", "generator"],
    publicationStatus: "published",
    authorId: "suhas-sunder",
    reviewedOn,
    relatedGuides: ["classroom-word-search-ideas", "custom-word-lists-for-word-searches", "vocabulary-practice-with-word-searches"],
    relatedTools: ["/homeschool-word-searches", "/word-search-generator"],
    sections: [
      { heading: "Connecting puzzles to current topics", body: "Choose a puzzle whose vocabulary overlaps with the book, experiment, place, period, or project currently under discussion. Use the words as a bridge back to the main material." },
      { heading: "Creating custom vocabulary lists", body: "Build a list from terms already encountered in the current work. A focused custom set is often clearer than a broad puzzle that happens to share the same general subject." },
      { heading: "Using short independent activities", body: "A small Easy grid can fill a clearly bounded independent interval. Provide another option when the puzzle is not a useful fit for the learner or the day." },
      { heading: "Mixing printable and online use", body: "Print copies for offline work or use the online solver for direct interaction. Both can use the same deterministic definition, which makes later checking consistent." },
      { heading: "Choosing difficulty", body: "Consider word familiarity, grid size, directions, and time rather than relying on a broad age label. Start with the closest preset and adjust a custom puzzle if needed." },
      { heading: "Including answer keys", body: "Keep a matching key for independent checking or discussion. Print it separately or open the answer view after the solving attempt so the unsolved page remains uncluttered." },
      { heading: "Reusing a topic in several subjects", body: "A garden list might connect reading, plant science, measurement, or seasonal observation. Change the follow-up task and context rather than claiming the puzzle itself covers every subject." },
      { heading: "Keeping the activity optional and purposeful", body: "Decide whether the puzzle is a preview, review, break, or activity-page component. Skip it when a conversation, demonstration, reading, or other format better serves the immediate purpose." },
      { heading: "Reviewing word lists", body: "Check spelling, relevance, duplicated terms, word length, and phrases before use. For a curated page, read its context note; for a custom page, check the generator's excluded-word report." },
      { heading: "Using the generator", body: "Paste one term per line, choose the grid settings, generate once, and review the result. Preserve the seed when printed, online, shared, and answer versions need to match." }
    ]
  },
  {
    slug: "esl-word-search-activities",
    title: "ESL Word Search Activities",
    description: "Practical ways to prepare clear word-search activities for English-language vocabulary work without promising learning outcomes.",
    introduction: "A puzzle can provide one structured encounter with a chosen English word set when meanings, pronunciation, and context are handled through additional activities.",
    metaTitle: "ESL Word Search Activities | Vocabulary Ideas",
    metaDescription: "Prepare ESL word search activities with concrete vocabulary, familiar themes, shorter lists, clear spelling, easy directions, and answer keys.",
    words: ["concrete", "familiar", "short", "spelling", "definitions", "images", "easy", "aloud", "topics", "answers"],
    publicationStatus: "published",
    authorId: "suhas-sunder",
    reviewedOn,
    relatedGuides: ["custom-word-lists-for-word-searches", "vocabulary-practice-with-word-searches", "classroom-word-search-ideas"],
    relatedTools: ["/esl-word-searches", "/word-search-generator"],
    sections: [
      { heading: "Selecting concrete vocabulary", body: "Start with words that refer to visible objects, actions, or familiar places when that matches the lesson. Abstract terms need enough explanation before they appear as isolated puzzle targets." },
      { heading: "Starting with familiar themes", body: "Food, clothing, transport, weather, home, and classroom objects can provide recognizable groupings. Familiarity varies, so confirm the theme fits the particular learners." },
      { heading: "Limiting word count", body: "A shorter bank reduces visual load and leaves space for larger grid letters. Include only the terms connected to the current activity instead of filling every available slot." },
      { heading: "Reviewing spelling", body: "Check the displayed spelling and the normalized grid form. Explain how spaces, hyphens, or punctuation in a phrase are removed for letter placement." },
      { heading: "Pairing words with definitions or images", body: "Use a separate matching sheet, labeled picture, object, or brief definition to establish meaning. The grid identifies letter sequences; it does not supply the full meaning by itself." },
      { heading: "Using Easy direction settings", body: "Forward horizontal, vertical, and diagonal paths avoid reversed spelling while learners are working with the word forms. Move to mixed directions only when that added puzzle challenge is suitable." },
      { heading: "Reading words aloud after solving", body: "After a term is found, a teacher or learner can say it and use it in a short prompt. Provide pronunciation support as needed rather than treating visual recognition as spoken proficiency." },
      { heading: "Creating topic-specific lists", body: "Use the generator for the exact vocabulary in a lesson, reading, or conversation. Keep one clear topic and review every accepted or excluded term before sharing." },
      { heading: "Avoiding culturally unclear terms", body: "Check whether examples, holidays, foods, idioms, or situations require unstated local knowledge. Add context, choose a clearer alternative, or invite comparison where appropriate." },
      { heading: "Using answer keys", body: "A matching key can support self-checking or a group review. Keep it separate from the unsolved grid and use the highlighted coordinates to resolve uncertainty accurately." }
    ]
  },
  {
    slug: "custom-word-lists-for-word-searches",
    title: "How to Build Custom Word Lists for Word Searches",
    description: "A practical checklist for preparing a focused, correctly spelled word list that fits a deterministic puzzle.",
    introduction: "The word list defines the topic and constrains the grid. Review it before generation so exclusions, phrases, and output formats are predictable.",
    metaTitle: "Custom Word Lists for Word Searches | How-To Guide",
    metaDescription: "Build a custom word-search list by checking topic focus, relevance, duplicates, spelling, word length, phrase handling, grid size, and exclusions.",
    words: ["topic", "terms", "duplicates", "spelling", "length", "phrases", "grid", "excluded", "seed", "share"],
    publicationStatus: "published",
    authorId: "suhas-sunder",
    reviewedOn,
    relatedGuides: ["how-to-make-a-word-search", "word-search-difficulty-guide", "vocabulary-practice-with-word-searches"],
    relatedTools: ["/word-search-generator", "/word-search-with-answer-key"],
    sections: [
      { heading: "Choose one clear topic", body: "Name a subject narrow enough that every term has an obvious reason to be included. For example, a general garden-tools puzzle is clearer than a list that mixes tools, unrelated foods, and place names." },
      { heading: "Use relevant terms", body: "A non-copyrighted garden example could use TROWEL, RAKE, SPADE, HOSE, GLOVES, WHEELBARROW, WATERING CAN, PRUNERS, FORK, and SHOVEL. Each term directly serves the stated topic." },
      { heading: "Remove duplicates", body: "Compare terms after trimming spaces and standardizing case. Also look for repeated phrases whose punctuation differs but whose normalized letters would be identical." },
      { heading: "Check spelling", body: "Verify the displayed form before generation. The puzzle and answer key will reproduce what the list supplies, so an accepted misspelling becomes part of every output." },
      { heading: "Consider word length", body: "The longest normalized term must fit a permitted straight path in the selected grid. Count letters after spaces and punctuation are removed." },
      { heading: "Avoid too many long words", body: "Several long terms can compete for the same limited paths. Balance them with shorter relevant words or choose a larger grid instead of silently dropping difficult entries." },
      { heading: "Decide how phrases are normalized", body: "Display phrases naturally in the bank while documenting that spaces, hyphens, and supported punctuation are removed in the grid. WATERING CAN, for example, appears as WATERINGCAN in its placed path." },
      { heading: "Select an appropriate grid", body: "Choose dimensions and directions that fit the word lengths and intended challenge. Easy, Medium, and Hard presets provide starting points, but a custom preview is still necessary." },
      { heading: "Review excluded words", body: "Read the generator report after placement. If a term did not fit or uses unsupported characters, revise the list or settings openly before printing or sharing." },
      { heading: "Save or share the deterministic puzzle", body: "Keep the approved seed, words, dimensions, directions, overlap rule, and alphabet pack together. Those inputs let play, print, PDF, answers, share links, and QR links reproduce one grid." }
    ]
  },
  {
    slug: "vocabulary-practice-with-word-searches",
    title: "Vocabulary Practice with Word Searches",
    description: "A bounded sequence that connects a word-search list to definitions, categories, examples, and sentences.",
    introduction: "Finding a letter sequence is one activity within vocabulary work. Meaning, usage, comparison, and feedback need their own deliberate steps.",
    metaTitle: "Vocabulary Practice with Word Searches | Activity Guide",
    metaDescription: "Use word searches as one vocabulary activity alongside meaning review, categorizing, definitions, examples, sentences, related terms, and custom lists.",
    words: ["set", "meaning", "find", "sort", "define", "example", "sentence", "compare", "difficulty", "custom"],
    publicationStatus: "published",
    authorId: "suhas-sunder",
    reviewedOn,
    relatedGuides: ["classroom-word-search-ideas", "esl-word-search-activities", "custom-word-lists-for-word-searches"],
    relatedTools: ["/collections/language-arts-word-search-worksheets", "/word-search-generator"],
    sections: [
      { heading: "Use a clear word set", body: "Choose terms connected by one lesson, reading, topic, or purpose. A coherent bank makes later sorting and comparison more meaningful than a miscellaneous list." },
      { heading: "Review meanings before solving", body: "Introduce or revisit definitions, examples, objects, or images first. This gives the displayed words context beyond their letter patterns." },
      { heading: "Find the words", body: "Use the grid as a bounded recognition task. Follow the listed directions and mark each exact straight path, then return to the word bank for the next step." },
      { heading: "Sort or categorize the completed list", body: "Group the terms by a relevant property, such as nouns and verbs, land and water features, tools and materials, or causes and effects. Discuss terms that might fit more than one group." },
      { heading: "Write definitions or examples", body: "Ask for a brief definition, labeled example, sketch, or reference back to source material. Check the response separately from whether the word was located in the grid." },
      { heading: "Use the terms in sentences", body: "Create sentences that show the intended meaning and grammatical role. A sentence frame or model can provide support when appropriate." },
      { heading: "Compare related terms", body: "Select pairs such as synonym and antonym, category and example, or two easily confused concepts. State both the shared feature and the distinction." },
      { heading: "Choose an appropriate difficulty", body: "Match grid size, word count, directions, vocabulary familiarity, and time to the group. Puzzle difficulty is separate from the conceptual difficulty of the terms." },
      { heading: "Create a custom puzzle", body: "Use the generator when an existing topic does not match the exact word set. Review spelling, phrase normalization, exclusions, and the answer key before use." },
      { heading: "Treat the puzzle as one activity, not complete instruction", body: "Use explanations, reading, conversation, writing, examples, and feedback for the broader work. The puzzle alone does not guarantee retention, memory improvement, or any learning outcome." }
    ]
  }
];

const remainingDrafts: Guide[] = [
  ["how-hidden-message-word-searches-work", "How Hidden Message Word Searches Work", "Hidden-message guide draft.", ["hidden", "message"]],
  ["word-search-ideas-for-parties", "Word Search Ideas for Parties", "Party activity guide draft.", ["party", "print"]]
].map(([slug, title, description, words]) => ({
  slug: slug as string,
  title: title as string,
  description: description as string,
  words: words as string[],
  publicationStatus: "draft",
  sections: [
    { heading: "Editorial draft", body: "This guide remains outside the index until its distinct purpose and complete body are reviewed." }
  ]
}));

export const guides: Guide[] = [...publishedGuides, ...prompt6Guides, ...remainingDrafts];

export const guideRedirects: Record<string, string> = {
  "how-to-print-word-searches": "how-to-print-a-word-search",
  "word-search-difficulty-by-age": "word-search-difficulty-guide",
  "how-to-make-large-print-word-searches": "large-print-word-searches",
  "how-to-build-custom-word-lists": "custom-word-lists-for-word-searches",
  "word-search-benefits-for-vocabulary-practice": "vocabulary-practice-with-word-searches"
};

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
