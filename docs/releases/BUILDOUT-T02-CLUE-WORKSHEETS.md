# T02 opt-in clue worksheets

Implementation review only. New user definitions remain private/nonindexable; no published inventory, advertising, deployment or main change.

## Behavior

The maker's Student bank control explicitly selects numbered clues. In this mode input is one `ANSWER | clue` per line, with commas, tabs and later pipe characters retained inside the clue. Every nonempty line must have a supported answer and a nonblank clue of at most500characters. Existing overall request, word, token and workload bounds apply. Missing clues fail visibly; the renderer never substitutes the answer onto student pages.

The opt-in `wordBankMode` field travels through the validated share definition and named local library. Omitted/words mode retains the original comma/newline/tab parsing. No new mode is inserted into default requests. An old definition changes parsing only when its author explicitly selects clue mode.

One placed-word bank helper aligns each clue to its source answer by word ID, then numbers only actual placed answers in the selected bank order. Excluded and duplicate answers do not shift the corresponding clue association. Student print/HTML/PDF banks show numbered clues; included teacher answer pages show the matching numbered answer and clue beside the unchanged answer grid. Online play uses the same clue order and reveals its answer after finding or explicitly revealing it. This is a word-search clue bank, not a crossword or automatic definition writer.

PDF clue banks wrap and reserve their actual height. Overlong/crowded content throws an actionable fit error. Every existing default legacy PDF path retains its prior rendering. A clue worksheet still contains answers in the grid and shared definition; it does not promise encryption or answer secrecy.

## Checks

- Targeted parser/request/share/bank/PDF/instruction tests passed, including punctuation, source-ID alignment, exclusions, missing clues, unsupported answers,500-character limit, markup escaping, Letter/A4 below/beside teacher/student output and crowded-page rejection.
- Actual1200 published PDFs replayed with zero measurement findings and zero SHA256 differences against the after68 baseline. Reports remain outside the repository.
- Final Node22 lint/typecheck, full474tests64files and335-page production build passed with PR77 print-fit guards integrated. Static audit passed217sitemap pages,35redirects and6utility shells. Existing Next ESLint-plugin warning remains.
- Real browser390/1280 x Letter/A4 x below/beside passed preview, downloaded two-page PDF, script-free real-file HTML, exact teacher mappings/grid tokens, keyboard clue solving, invalid-clue edit/recovery, offline network isolation and no serious/critical axe violations. Initial keyboard fixture needed the existing Begin-focus readiness wait; assertions were retained and the full matrix then passed twice.
- Actual Letter/below and A4/beside PDF student/teacher pages were rendered with Poppler and visually inspected, alongside offline HTML screenshots. No clipping, overlap or missing labels was observed. Poppler emitted its installed-font `Symbol` fallback warning; these tested ASCII clue pages rendered correctly. Evidence is outside the repository under the temporary ilws-clue-worksheets directory.

Physical printer acceptance and editorial review of user-written clues remain separate. Printable lowercase output and the zero-placement recovery defect are subsequent focused packages.
