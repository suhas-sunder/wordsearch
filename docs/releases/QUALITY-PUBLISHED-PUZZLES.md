# Published puzzle quality review — 2026-11-12

Status: source review, not publication approval. Baseline `a0df44f6bdaccd1ecd72e34ff0bd32a65fa01d80` (PR108); no runtime, definition, seed, metadata or publication changes made by this review. Read alongside the parent quality ledger and its separately recorded rendered-page observations. The earlier 677-test/150-fingerprint result is historical until the parent records fresh validation.

## Scope and method

All 60 records in `content/curated-topics.ts` and all 90 in `content/curated-topics-prompt6.ts` were individually read, including each complete word bank, introduction and context. Each row below assesses practical subject fit, language and meaningful differentiation. Count/duplicate comparisons were independently recomputed from those exact arrays: **150 puzzles, 2,272 bank entries, 48 easy, 86 medium, 16 hard; zero repeated normalized entries within a bank; zero identical normalized unordered banks**. Normalization for this comparison uppercases and removes non-A–Z characters; it is an audit comparison, not a change to generator behavior.

This is a source assessment, not a claim that 150 PDFs, physical worksheets or browser interactions were personally inspected. Typography, accidental filler words, full cultural correctness, child suitability, pronunciation variation and pedagogical outcomes are not certified. A general/classroom audience tag is not an assessed reading age. “No defect found” below means no concrete source issue was identified, not universal approval.

The context class is the primary purpose of that specific field: **B** useful subject/selection context; **C** useful limitation/safety/scope information; **D** instructions intended for an editor; **E** low-value reassurance or promotional comparison. Other page passages can have different classes. Nearly all introductions are useful B summaries; the Homophones introduction has a confirmed **F factual mismatch**. Classification is editorial judgment after reading the words and prose, not a keyword score. Keeping useful cautions is compatible with removing internal instructions.

## Prioritized decisions

| ID | Confirmed problem and evidence | User impact / SEO risk | Recommended decision / status |
|---|---|---|---|
| P-PUB-01 | `topics.ts` copies `topic.context` to `description` and `notes`; `registry.ts` also uses it for description, puzzleNote and wordListContext. Contexts such as Ancient Egypt, Reading and Mother's Day contain instructions to editors. | A visitor gets publishing rules instead of help choosing a puzzle. One shared field can affect its page and several indexed card surfaces. | Owner-held minimal copy pilots; map exact rendered reuse before applying. Preserve titles, metadata and banks. **Identified; not corrected here.** |
| P-PUB-02 | Homophones introduction: “Search for eight sets or pairs of words that sound alike while differing in spelling or meaning.” The bank contains seven groups: THERE/THEIR/THEYRE; TO/TOO/TWO; SEA/SEE; RIGHT/WRITE; SON/SUN; PEAR/PAIR; NIGHT/KNIGHT. | Incorrect teaching-facing count. One introduction field; exact rendered scope must be measured. | Proposed: “Search for groups of words that sound alike while differing in spelling or meaning.” Preserve all 16 entries. **Owner-held copy correction, not applied.** |
| P-PUB-03 | The bank displays `THEYRE`; other banks display joined expressions including `NORTHAMERICA`, `POINTOFVIEW`, `FREE THROW` (already spaced), `TRINIDADTOBAGO`, `SHOTPUT`, `SKIPCOUNT`. | Learners may mistake search-token spelling for ordinary written spelling. Removing spaces for grid placement is expected; the displayed bank need not imply those are normal spellings. | First add an approved, accurate bank-reading explanation where useful. Separate a future display-label proposal from underlying tokens; do not alter existing banks under a copy cleanup. **Review needed.** |
| P-PUB-04 | Story Elements and Storytelling share 11 of their 16 entries and the same medium configuration shape; their introductions describe closely related tasks. | Strongest existing semantic overlap. Distinct seeds alone do not establish distinctive educational value. No current query/landing data is available to diagnose search cannibalization. | Preserve both established URLs. Assess whether classroom follow-up tasks should distinguish analysis of a text from planning oral narration. Do not merge, redirect or rewrite automatically. **Owner review.** |
| P-PUB-05 | Arctic Animals includes both REINDEER and CARIBOU; these are common names for the same species, with regional/domestication usage differences. | Not a duplicate string, but fewer distinct animals than a reader might infer from the bank. Introduction does not promise 12 distinct species. | Keep frozen bank; optional accurate explanatory note after owner review. Not a demonstrated need for a grid migration. See [Alaska Department of Fish and Game species profile](https://www.adfg.alaska.gov/index.cfm?adfg=caribou.main). **No correction applied.** |
| P-PUB-06 | Thanksgiving includes NOVEMBER; Mother's Day includes MAY. Seasonal pages otherwise address broad audiences. | Country-specific assumptions need context; not all locales observe these dates. Existing page topical intent should be preserved. | Optional scope clarification rather than new country variants. Mother's Day's inclusion instruction should become real inclusive visitor text only after approval. **Owner review.** |
| P-PUB-07 | All published medium puzzles use eight directions; easy uses E/S/SE. Builder defaults differ, as already documented in WP-02 and tested by `direction-validation.test.ts`. | “Medium” is relative to this catalog, not a universal grading or reading-age guarantee. Easy still includes diagonals and sometimes long words. | Retain existing definitions and precise direction help. Do not “normalize” presets or change seeds. **Historical known behavior; no new defect correction.** |
| P-PUB-08 | `registry.ts` derives editorialStatus “reviewed” directly from publicationStatus; all records use the same review date, and generated print/meta wording sometimes says “reviewed.” | A code flag proves the site's declared state, not who reviewed vocabulary, when, or by what standard. | Preserve existing trust/legal copy pending owner verification; propose separate provenance records. Never describe this agent's review or automated tests as independent human approval. **Owner-held evidence gap.** |
| P-PUB-09 / Q08 | In both fresh production and candidate captures, **all150 puzzle pages contain their exact context sentence three times**, with the introduction once. `CuratedPuzzlePage.tsx` renders both puzzleNote and wordListContext, and the hero uses the same context as its description. | Low-value repetition triples awkward instructions without adding help. A shared-template change affects all150 established indexed puzzle pages. | Propose rendering the useful context once, retaining the word bank, genuinely distinct introduction, difficulty and print help. Do not replace repeated slots with filler. Prepare an exact semantic removal allowance and owner review before any shared-template edit. **Owner-held; no runtime patch.** |

## Whole-catalog source decisions

Rows C01–C60 correspond to the first source array's order; P01–P90 correspond to the second. Slugs are the exact `slug` field and resolve through each record's existing category into `/word-searches/{categorySegment}/{slug}`. E/M/H denote 12×12/12 words, 15×15/16 words and 18×18/20 words respectively. All banks remain frozen. “Keep” is a preservation recommendation, not an editorial approval token.

| Record / slug | Level | Context | Specific assessment and default |
|---|---|---|---|
| C01 dog-word-search | E | B | Care, actions and anatomy fit; WHISKERS is appropriate. Keep. |
| C02 cat-word-search | E | B | Household cat vocabulary distinguishes it from wild cats. Keep. |
| C03 farm-animals-word-search | E | B | Animals plus BARN/TRACTOR/FARMER are accurately disclosed. “Early readers” is broad; no assessed reading age. |
| C04 ocean-animals-word-search | M | B | Several animal groups plus CORAL; ORCA and WHALE overlap taxonomically but are useful familiar terms. Keep. |
| C05 zoo-animals-word-search | M | E | Real animal selection; no fictional-brand reassurance is needed to choose it. Preserve bank. |
| C06 birds-word-search | M | B | Backyard, seabird and raptor variety matches description. Keep. |
| C07 insects-word-search | M | B | All named animals are insects; diverse short/long terms. Keep. |
| C08 reptiles-word-search | M | B | MONITOR and ANOLE broaden familiar names; keep contextual reptile meaning. |
| C09 fruits-word-search | E | B | Twelve everyday fruits match scope; no vocabulary defect identified. |
| C10 vegetables-word-search | E | B | Culinary vegetable grouping is appropriate; avoid importing botanical-fruit distinctions unnecessarily. |
| C11 breakfast-word-search | M | B | Foods and drinks match a broad breakfast theme; not a universal menu. Keep. |
| C12 baking-word-search | M | B | Ingredients/tools/actions are relevant; ROLLING is an action, not a complete tool label. Keep. |
| C13 desserts-word-search | M | E | Specific variety is useful; “more variety than a basic sweets list” is unnecessary comparison. |
| C14 ice-cream-word-search | E | E | Flavors/toppings/equipment fit; brand-policy reassurance adds little. |
| C15 flowers-word-search | E | B | Flower names plus PETAL/STEM/BLOOM support stated introduction. Keep. |
| C16 trees-word-search | M | B | Tree groups plus structure words fit; “species” is colloquial rather than exact taxonomy. No bank change. |
| C17 garden-word-search | M | B | Process, tools and conditions fit; “full gardening process” is a broad summary, not instruction. |
| C18 forest-word-search | M | B | Habitat and walking-observation vocabulary is distinct from tree-name list. Keep. |
| C19 beach-word-search | E | E | Coastal objects and activities fit; destination/brand caveat is unnecessary. |
| C20 weather-word-search | M | B | Forecast measurements and severe-weather terms match scope. Keep. |
| C21 space-word-search | M | B | Exploration technology differentiates it from Solar System despite seven shared terms. |
| C22 solar-system-word-search | M | B | Eight planet names and related objects match introduction. Keep. |
| C23 biology-word-search | H | B | Twenty genuine cross-unit biology terms; broad review framing is accurate. Keep. |
| C24 chemistry-word-search | H | B | Particles, solutions and lab vocabulary fit; curriculum caveat is benign but dispensable. |
| C25 physics-word-search | H | B | Motion, electricity and waves give genuine breadth; no formula teaching promised. Keep. |
| C26 geology-word-search | M | B | Rocks and processes fit; nine terms overlap Earth Science but smaller scope/level differ. |
| C27 continents-word-search | E | B | Explicit seven-continent convention; long joined NORTHAMERICA/SOUTHAMERICA make “easy” spatial, not reading-age grading. |
| C28 oceans-word-search | M | B | Five named oceans plus coastal features match introduction. Keep. |
| C29 world-capitals-word-search | M | C | Selected-region limitation is useful; Europe-heavy selection is not a full world inventory. Keep. |
| C30 us-states-word-search | H | B | Twenty actual one-word state names; selection is explicit. Keep. |
| C31 canada-word-search | M | B | Selected provinces/territories plus landforms; not mislabeled a complete province list. Joined NOVASCOTIA needs reading care. |
| C32 map-vocabulary-word-search | M | B | Directions, symbols and coordinates give a clear practical topic. Keep. |
| C33 nouns-word-search | E | B | Concrete examples plus MUSIC/FRIEND support categorization; parts of speech depend on sentence use. Keep. |
| C34 verbs-word-search | E | B | Common actions and mental acts fit; no outcome guarantee. Keep. |
| C35 adjectives-word-search | M | B | Size, texture and mood examples support proposed grouping task. Keep. |
| C36 synonyms-word-search | M | B | Eight plausible pairs; context correctly invites discussion of usage differences. Keep. |
| C37 antonyms-word-search | M | B | Eight contrasting pairs with a concrete matching extension. Keep. |
| C38 punctuation-word-search | M | B | Written names and grammar words are intentional; explanation helps distinguish names from symbols. Keep. |
| C39 addition-word-search | E | C | Vocabulary-only versus calculation distinction is useful and accurate. Keep. |
| C40 subtraction-word-search | E | C | TAKEAWAY joins a phrase; vocabulary-only scope is useful. Keep bank pending display-label design. |
| C41 multiplication-word-search | M | B | Terms cover arrays/factors/property; SKIPCOUNT and REPEATED need lesson context. No frozen-bank edit. |
| C42 division-word-search | M | B | Quotient/dividend/divisor/remainder anchors clear subject value. Keep. |
| C43 fractions-word-search | M | B | Forms and related DECIMAL/PERCENT match the described scope. Keep. |
| C44 geometry-word-search | M | B | Foundational objects and measurements fit a broad review. Keep. |
| C45 soccer-word-search | M | B | Positions and match actions fit; no sports brands required. Keep. |
| C46 basketball-word-search | M | E | FREE THROW already has display spacing; league/player exclusion is internal selection rationale. |
| C47 baseball-word-search | M | E | Strong baseball terms; HOMERUN is joined; brand exclusion is low-value copy. |
| C48 hockey-word-search | M | E | ICE/RINK/SKATES clearly mean ice hockey; “hockey generally” could overstate field-hockey coverage. Preserve bank; scope-copy review. |
| C49 school-supplies-word-search | E | B | Concrete supplies fit; SCISSORS is vocabulary, not authorization for unsupervised tool use. Keep. |
| C50 classroom-word-search | M | B | People, subjects and tasks distinguish it from supplies. Keep. |
| C51 back-to-school-word-search | E | B | First-term routine and objects give seasonal activity use. Keep. |
| C52 spelling-word-search | M | B | This is spelling terminology, not a weekly spelling bank; generator reference helps. Keep. |
| C53 kindness-word-search | E | C | Discussion use is sensible; treatment disclaimer is disproportionate on a puzzle card. Optional careful shortening. |
| C54 friendship-word-search | E | E | Trust/listening vocabulary fits; developmental-outcome negation is editorial reassurance. |
| C55 spring-word-search | E | B | Plant growth, weather and activities give distinct seasonal vocabulary. Keep. |
| C56 summer-word-search | E | E | Warm-weather list fits; brand/destination exclusion adds little. |
| C57 fall-word-search | E | B | Harvest/leaf/clothing theme is distinct from Thanksgiving and Halloween. Keep. |
| C58 winter-word-search | E | B | Cold-weather equipment/comforts distinguish it from Christmas; seasonal scope is useful. |
| C59 halloween-word-search | M | E | Generic spooky/party terms work; copyright-selection rationale need not be card copy. |
| C60 christmas-word-search | M | E | Decorations/music/gatherings fit; internal brand exclusions add little. Preserve established seasonal page. |
| P01 wild-cats-word-search | M | B | Species/common labels plus features fit; PANTHER is a broad common term, not a distinct species claim. |
| P02 dinosaurs-word-search | M | E | Taxa plus eras/science words fit; long names are challenging despite medium grid. Brand caveat adds little. |
| P03 rainforest-animals-word-search | M | C | Multiple-region qualification prevents implying all animals coexist. Keep. |
| P04 arctic-animals-word-search | E | B | REINDEER/CARIBOU synonym issue merits note, not deletion; generic OWL/HARE require Arctic context. |
| P05 desert-animals-word-search | M | C | Multi-desert scope helps; generic LIZARD/IGUANA are broad category labels. Keep. |
| P06 baby-animals-word-search | E | B | Young-animal names support a real adult-name matching extension. Keep. |
| P07 pizza-word-search | E | E | Ingredients/equipment/serving words fit; brand avoidance is editorial rationale. |
| P08 pasta-word-search | E | C | Shapes/ingredients/tool mix fits; terminology versus recipe scope is reasonable. |
| P09 cooking-word-search | M | B | Cooking verbs distinguish this from kitchen equipment and baking. Keep. |
| P10 kitchen-tools-word-search | M | B | Tools and appliances are relevant; long joined phrases should be explained in display help. |
| P11 candy-word-search | E | E | Candy varieties are generic; repeated anti-brand copy has little independent benefit. |
| P12 everyday-foods-word-search | E | E | Broad kitchen foods fit; health-classification disclaimer is unnecessary beside neutral words. |
| P13 mountains-word-search | M | B | Landforms and hiking terms distinguish it from named mountain-range proposals. Keep. |
| P14 rivers-word-search | M | B | Features rather than named rivers give clear independent topic value. Keep. |
| P15 wetlands-word-search | M | B | BOG/FEN/MARSH/SWAMP plus ecology vocabulary are distinctive. Keep. |
| P16 camping-word-search | E | C | Vocabulary is not wilderness guidance; retain any needed caution in proportion to page context. |
| P17 plants-word-search | M | B | Structures plus photosynthesis/germination distinguish it from gardening/flowers. Keep. |
| P18 earth-day-word-search | M | E | Environmental action vocabulary fits; broad policy/outcome disclaimer reads like editorial constraints. |
| P19 human-body-word-search | M | D | Anatomy bank is appropriate; “must not provide medical advice” instructs an editor. Preserve no-medical-claims rule internally. |
| P20 scientific-method-word-search | M | C | Non-rigid-process explanation is a useful qualification. Keep. |
| P21 lab-safety-word-search | E | C | Supervision/procedure limitation is materially relevant to a safety-titled topic. Retain visitor-facing caution. |
| P22 electricity-word-search | M | D | Electrical terms fit; “must not provide instructions” is editorial wording with a legitimate safety purpose. |
| P23 magnetism-word-search | M | B | Poles/fields/materials provide distinct physical-science vocabulary. Keep. |
| P24 earth-science-word-search | H | B | System-level terms distinguish it from Geology despite nine shared words. Keep. |
| P25 landforms-word-search | M | B | Inland/coastal/glacial variety is topical; no specific location promise. Keep. |
| P26 europe-word-search | H | C | Twenty selected countries, explicitly incomplete; useful scope. Keep. |
| P27 asia-word-search | H | C | KOREA is a regional name; introduction deliberately says countries and regional names. Preserve that distinction. |
| P28 africa-word-search | H | C | Twenty selected country names; all eight directions are actually permitted. Keep. |
| P29 north-america-word-search | H | D | Region/island/country mix is disclosed; “should not be described” is internal. TRINIDADTOBAGO needs display-label review. |
| P30 south-america-word-search | H | B | Countries plus regions/landforms are explicitly distinguished. Keep. |
| P31 prefixes-word-search | M | B | PREFIX is a category term; examples offer useful affix discussion. AUTOGRAPH's combining form needs teacher context. |
| P32 suffixes-word-search | M | B | SUFFIX is a category term; example endings support the stated sorting task. Keep. |
| P33 homophones-word-search | M | B | Confirmed introduction count error (seven groups, not eight); THEYRE also needs ordinary-spelling context. Owner-held correction. |
| P34 compound-words-word-search | M | B | Sixteen ordinary compounds support component-word activity. Keep. |
| P35 story-elements-word-search | M | B | Analysis vocabulary is useful, but 11 terms overlap Storytelling; clarify distinct use before further expansion. |
| P36 poetry-word-search | M | B | Sound, structure and voice terms give clear subject value. Keep. |
| P37 shapes-word-search | E | B | Flat/solid figures support explicit sorting extension; DIAMOND is familiar informal vocabulary. Keep. |
| P38 measurement-word-search | M | C | Vocabulary versus unit-conversion practice is a useful distinction. Keep. |
| P39 money-word-search | E | D | Basic dollar/cent terms; “must not provide financial advice” is editorial instruction, not needed selection help. |
| P40 decimals-word-search | M | B | Place-value terms and operations match scope; PLACEVALUE is joined. Keep. |
| P41 percentages-word-search | M | D | Math terminology fits; financial/tax/investment instruction is disproportionate card text. |
| P42 algebra-word-search | M | C | Terminology versus worked solutions is a useful task limitation. Keep. |
| P43 tennis-word-search | M | E | Equipment/strokes/scoring fit; no-player-branding statement adds little. |
| P44 volleyball-word-search | M | B | LIBERO/ROTATION support indoor emphasis; copy already says indoor or general theme. Keep. |
| P45 swimming-word-search | M | D | Pool/strokes/race terms fit; preserve water-safety limitation in visitor wording, not “must not be treated.” |
| P46 track-and-field-word-search | M | E | Throws/jumps/sprints plus MARATHON form broad athletics vocabulary; do not imply every event occurs on a track. |
| P47 gymnastics-word-search | M | C | Apparatus/movements are terminology, not instruction; injury/training limitation may be concise. |
| P48 golf-word-search | E | E | Distinct course/equipment terms; branding disclaimer adds little. |
| P49 school-subjects-word-search | E | C | Recognizable subjects, accurately noting curricula differ. Keep. |
| P50 study-skills-word-search | M | E | Planning/review words fit; grade/memory-benefit negation is editorial reassurance. |
| P51 teamwork-word-search | E | E | Cooperation theme overlaps Friendship six words but retains PLAN/GROUP/COOPERATE; no outcome claims needed. |
| P52 respect-word-search | E | C | Boundaries/fairness theme is distinct; treatment disclaimer can be proportionate. |
| P53 gratitude-word-search | E | D | “The puzzle avoids mental-health claims” describes editorial compliance rather than activity. |
| P54 goals-word-search | E | E | Planning sequence words fit; educational-outcome disclaimer adds little. |
| P55 valentines-day-word-search | M | E | Recognizable holiday objects/colors; no need to announce brand exclusions. |
| P56 st-patricks-day-word-search | M | C | Folklore versus history caution is relevant; retain factual distinction without suggesting cultural expertise. |
| P57 easter-word-search | M | E | Explicit secular springtime imagery fits; copyright disclaimer adds little. |
| P58 thanksgiving-word-search | M | C | Modern foods/gatherings avoid invented history; NOVEMBER gives US scope that deserves acknowledgment. |
| P59 new-year-word-search | E | B | Gregorian-calendar celebration words fit; NEWYEAR joins phrase. Keep with scope awareness. |
| P60 mothers-day-word-search | E | D | Direct “Use inclusive supporting copy…” instruction leaks; MAY is locale-specific. Owner review for real inclusive wording. |
| P61 ancient-egypt-word-search | H | D | Names/objects/deities span history; “should avoid…” is an editorial rule. Highest-priority homepage pilot. |
| P62 ancient-greece-word-search | H | C | Different periods/city-states are explicitly acknowledged; historical/mythological mix is disclosed. Keep. |
| P63 ancient-rome-word-search | H | D | Republic/Empire breadth is useful; replace only instruction “should be described” after approval. |
| P64 medieval-times-word-search | M | D | Europe-centered castle/guild vocabulary; direct “Avoid presenting…” belongs in internal constraints. |
| P65 renaissance-word-search | M | B | Art/learning/printing vocabulary is coherent; Florence/Venice makes regional focus apparent. Keep. |
| P66 industrial-revolution-word-search | H | D | Production/transport/labor terms fit; “should not oversimplify” is editor guidance. |
| P67 airport-word-search | M | C | Travel terminology versus official instructions is legitimate; keep core limitation, simplify its imperative form if approved. |
| P68 road-trip-word-search | E | C | Driver-distraction concern is legitimate; a direct passenger-use note would serve visitors better than compliance narration. |
| P69 hotel-word-search | E | B | Guest-service vocabulary supports travel/ESL use; CHECKIN is joined. Keep. |
| P70 train-travel-word-search | M | C | General rail terms fit; local timetable/safety limitation is factual but should stay concise. |
| P71 cruise-travel-word-search | M | E | Ship/port/planning list is useful; exclusion of operators/ships/destinations is editorial rationale. |
| P72 vacation-word-search | E | B | General pre-trip activity use is credible; no invented benefit. Keep. |
| P73 musical-instruments-word-search | M | E | Families accurately represented; nine shared terms with Orchestra but this is an instrument list. Brand clause adds little. |
| P74 orchestra-word-search | H | B | Sections/score/conductor add ensemble specificity; larger grid/count supports relative challenge. Keep. |
| P75 piano-word-search | M | C | Parts/form/performance terms fit; terminology versus technique limit is accurate. Keep. |
| P76 guitar-word-search | M | B | Acoustic/electric coverage is useful; manufacturer exclusion unnecessary but not harmful. |
| P77 music-theory-word-search | H | C | Pitch/harmony/notation list is broad; not-a-complete-lesson clarification is accurate. Keep. |
| P78 singing-word-search | E | D | Voice/song words fit; vocal-health instruction belongs internally unless an actual safety issue arises. |
| P79 reading-word-search | E | D | Familiar book/reading words fit; “must not promise literacy” is not a description. Homepage priority. |
| P80 library-word-search | E | C | Borrowing/reference/staff vocabulary useful; variability of systems is reasonable context. Keep. |
| P81 book-genres-word-search | M | E | Genres/forms accurately broaden title; no copyright disclaimers needed for category names. |
| P82 book-parts-word-search | M | B | Physical and organizational features distinguish from genres/nonfiction layout. Keep. |
| P83 nonfiction-text-features-word-search | M | B | Concrete find-the-feature extension adds useful teaching context. Keep. |
| P84 storytelling-word-search | M | E | Planning/performance angle is plausible but 11/16 words overlap Story Elements; avoid more near-identical pages. |
| P85 colors-word-search | E | E | Twelve real colors fit; completeness caveat unnecessary. Keep definition. |
| P86 painting-word-search | M | C | Art media/techniques fit; safety disclaimer should be proportional, not framed as editing guidance. |
| P87 drawing-word-search | E | B | Simple marks/materials fit an introductory topic; no specific teaching method promised. Keep. |
| P88 sculpture-word-search | M | D | Materials/processes are appropriate; hazardous-tool instructions are prohibited internally, not an attractive card description. |
| P89 photography-word-search | M | E | Settings/equipment/composition fit; anti-manufacturer wording adds little. |
| P90 crafts-word-search | E | D | Concrete materials/actions fit; “must not give…assurances” is internal. Retain legitimate supervision cautions where needed. |

## Duplication and topic value

The six pairs with at least six normalized shared entries are Story Elements/Storytelling (11; Jaccard 0.524), Musical Instruments/Orchestra (9; 0.333), Geology/Earth Science (9; 0.333), Friendship/Teamwork (6; 0.333), Space/Solar System (7; 0.280), Piano/Music Theory (7; 0.241). This arithmetic helps prioritize editorial comparison; **it is not a quality threshold or a search-ranking formula**. The catalog's repeatable product template is appropriate. Different genuine word banks, configuration and useful task context can justify separate pages; brand-disclaimer variations do not add such value. Nothing here justifies deleting or canonicalizing established pages without current traffic/query evidence and a separate migration plan.

## Architecture recommendation

The current architecture already separates SEO metadata, introduction, context and difficulty/print help, and it has source-only staged records with provenance. Its flaw is semantic: `context` is implicitly publishable although it contains internal constraints, while `PuzzleEditorialContent` is itself public presentation content. Adding an `editorialNotes` property to that public interface would risk repeating the mistake.

Prefer a **separate source-only editorial dossier keyed by stable puzzle route/id**, outside the runtime content registry. Reuse the staged-review conventions where practical. A proposed type has `subjectId`, `sourceRef` (path, commit and field), `constraints` (typed factual/safety/rights/audience rules), `sources` (URL/title/access date and claim supported), `proposedPublicCopy` (field, original value/hash, replacement, reason, measured affected paths) and `decision` (pending/approved/rejected with real reviewer identity and artifact SHA only when available). Never derive reviewer identity from publication state.

Keep `context`, metadata and introduction explicitly public. Existing historical values stay exact until owner review. A small source-only pilot can preserve the original internal constraint verbatim while proposing the minimum public correction. Public card props should accept only the public projection; avoid object spreads from dossiers. A compile-time shape is useful but not sufficient—TypeScript types do not stop accidental runtime imports or string reuse.

Regression coverage should (1) verify dossier modules are absent from app/component/client import paths, (2) render sentinel dossier instructions and prove they cannot appear in public card/page output, (3) guard exact known approved replacement pairs and route scopes, (4) retain legitimate lab/water-safety examples, and (5) verify no title/meta/canonical/bank/fingerprint changes. Do not ban every occurrence of “should,” “review,” “not,” “safety,” or “claims.” Those words are valid in essential help and trust pages.

The initial boundary is now implemented in `content/review/model.ts` and `tests/content/editorial-review-boundary.test.ts`: readonly notes/provenance and exact public-copy proposals with a pending-only decision; a TypeScript-AST import-graph check from app, components and public content roots, including transitive library/barrel paths. Synthetic mutations cover static/dynamic/type imports and require; computed loads fail closed because their destinations cannot be inspected. A legitimate safety sentence is retained as a positive fixture. This is an import-isolation check, not a rendered-content audit or a guarantee against someone copying a raw string by hand. Existing public models and all150 definitions stay unchanged. Proposal-target/rendered-scope checks belong to the pilot's separate evidence.

## Verification and outstanding acceptance

Source extraction/counts/duplicate comparisons completed successfully on the two arrays. The report's 150 unique rows were checked against the complete C01–C60/P01–P90 identifier sets. No app mutation was made. Full generation, PDFs, visual and browser validation belongs to the parent combined source evidence; historical tests were inspected for coverage, not reported as rerun by this review. Existing `curated-publication.test.ts` covers all-word placement, deterministic replay, answer cells, configuration and share state; `direction-validation.test.ts` guards all150 baseline fingerprints. Those checks do not prove editorial usefulness or reading-age fit.

An independent follow-up read the fresh HTTP evidence at `C:/Users/Suhas/.codex/visualizations/2026/11/13/01a1d313-5cce-7880-aff3-d45fd55e6b71/quality/http/capture.json`, captured `2026-11-13T04:14:21.462Z` (November12 in the user's timezone). It SHA256-verified **all434 stored HTML files** against that manifest, then parsed body text excluding scripts/styles and normalized whitespace. Production and candidate each have217 entries. The five pilot before-values match exactly: Ancient Egypt context **7 URLs/9 occurrences** (three on its own puzzle page); hard angle **1/1**; hard selectionGuidance **1/1**; Homophones introduction **1/1**; answer-guide section body **1/1**. Their union is **9 indexed URLs**, not eleven, because the hard collection is also an Egypt-card surface. The exact path arrays in `content/review/pilot.ts` agree with this independent parse.

The same fresh corpus check matched all150 introductions and contexts at each endpoint: **150/150 introductions once, 150/150 contexts three times; zero missing or differing matches**. This proves served text scope and repetition, not CSS visibility, hands-on browser behavior or a manual review of434 page images. The source pilot's replacement words accurately fit the frozen banks and real controls; the sensitive hard-hub proposals preserve title/H1/meta/description, original16puzzles and factual difficulty guidance. The guide heading remains technical and unchanged; the one-section pilot is not a claim that the whole guide is polished. The source-only proposals remain pending owner approval.

The rendered-copy capture fixture was independently corrected to use the real specialty directory and extended to36 additional existing noindex routes (13specialty pages, six utility shells, search/FAQ/daily/pack/directory and12draft category/collection/guide outputs), for253planned browser observations including217indexed URLs. Its no-JavaScript utility observations are recovery-shell copy, not decoded puzzle output. It explicitly does not claim every served draft puzzle URL or every visual image was inspected. Execution results belong to the parent's browser evidence.

Current Search Console data is inaccessible through the connected service (subscription-required error observed by parent); no current ranking or cannibalization conclusion is inferred. Remaining decisions: approve the narrow pilots; verify review/authorship assertions; consider the Homophones count correction and language-display notes; obtain real teacher/reader and physical-print acceptance. Freeze the 150 definitions unless a separately justified and approved migration documents existing share-link effects.
