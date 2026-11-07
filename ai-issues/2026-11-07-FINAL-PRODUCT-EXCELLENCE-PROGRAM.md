# iLoveWordSearch — Final Product Excellence Program
## Major UI/UX, Functionality, Public Copy and SEO Preservation Pass

The owner has reviewed the current development progress and wants a substantial additional product-quality pass.

**Primary objective: Make iLoveWordSearch feel like a polished, trustworthy, finished product that people genuinely enjoy using. Preserve everything already working well and improve what isn't.**

Do not interpret this assignment as permission to redesign the entire website, rewrite successful content, or generate additional pages to demonstrate progress.

This is an extended autonomous development assignment. Complete as much useful, authorized work as possible without waiting for the owner between milestones.

### 1. Reconcile the current project first

Inspect the actual local and remote Git state, active workers, worktrees, review branches, and unfinished tasks.

Last independently verified state:

- Production main: `471a118dd459f2181cd641ed0572ba6dd7005540`
- Primary review: PR #97, `codex/final-product-acceptance`
- Review head R: `ada6b6e89a67ca5c1c31a4cc927453994ba9d3d4`
- Frozen application B: `f7849cddda2a7df5daff2425ba179b9af21f6272`
- Evidence package: PR #101, already integrated into PR #97's review branch
- Feature acceptance: 38 technically tested, 3 manual pending, 2 blocked, 1 owner-deferred
- Unit tests reported: 551
- Full visual matrix reported: 448/448
- Utility CLS comparison: 84/84, candidate CLS zero
- Full/production dependency audit: zero reported vulnerabilities
- Strict route audit: 3 retained internal ad-eligibility findings
- Ordinary Lighthouse: Best Practices 77 in all 11 groups, attributed to third-party provider cookie/inspector diagnostics
- All new editorial content remains unpublished.

These are historical checkpoints, not assumptions about the current runtime. Recheck everything.

Read:

- `AGENTS.md`
- `ai-issues/README.md`
- `ai-issues/2026-11-06-MASTER-BUILDOUT-AND-CONTROLLED-RELEASES.md`
- `ai-issues/2026-11-06-PRODUCT-FINALIZATION-AND-ACCEPTANCE.md`
- `ai-issues/2026-11-06-2027-WEEKLY-EDITORIAL-CALENDAR.md`
- `docs/releases/PRODUCT-ACCEPTANCE.md`
- `docs/releases/PRODUCT-RELEASE-CANDIDATE-04.md`
- `docs/releases/FINAL-SCOPE-CROSSWALK.md`
- `docs/releases/FINAL-PERFORMANCE-GATES.md`
- `docs/releases/BUILDOUT-PR-RECONCILIATION.md`
- `docs/releases/OVERNIGHT-SESSION-CONTROL-2026-11-06.md`

Also read the new independent review comment on PR #97 regarding user-facing text and SEO preservation.

**Do not discard completed work or redo features without a confirmed need.**

Preserve the immutable tested application B and its evidence. New application changes must receive a new candidate SHA and new affected validation; do not reuse B's passing results as if they validate changed runtime code.

---

# PART A — Protect What's Already Successful

## 2. Establish the production experience as the baseline

The existing site already has meaningful organic traffic and working user flows. The buildout must protect those assets.

Historical Google Search Console evidence, August 4–November 3, 2026:

- 2,970 Google clicks.
- 2,402 clicks came from `/collections/hard-printable-word-searches`.
- This represented approximately 80.9% of recorded Google clicks.
- Other pages combined contributed 568 clicks.

These are dated observations, not current traffic measurements.

Treat the successful hard-printable collection as an especially sensitive page. Protect the existing generator, puzzle-solving flows, print functionality, indexed topic pages, and monetization.

Before making further UI changes, compare the current production website against the proposed candidate.

Inspect actual rendered output and functional behavior, not just source code.

Determine:

1. What users can do today.
2. What the new candidate improves.
3. What changed unintentionally.
4. What existing functionality might have regressed.
5. What remains difficult, ugly, confusing or unreliable.
6. What already works well and should be left untouched.

Do not change a successful component merely to make the design stylistically different.

## 3. Establish explicit preservation requirements

By default, preserve:

- All 150 published curated puzzle definitions and generation fingerprints.
- All existing canonical URLs.
- Existing page titles, descriptions, H1s and substantive indexed copy.
- Existing topic word lists.
- Published difficulty and puzzle behavior.
- Valid links, redirects and breadcrumbs.
- Current sitemap/indexing classifications.
- Functional share links and legacy puzzle states.
- Historical printable/PDF behavior except separately reviewed improvements.
- The protected advertising lifecycle, placement logic and safe spacing.

The existing evidence includes 217 sitemap entries, 35 redirects, 150 published puzzles and historical PDF comparison records.

Run fresh source and static-output checks appropriate to every changed candidate.

Do not mass-update metadata, dates, HTML headings or body content in an attempt to make the site look newly updated.

If a successful page has a real functional or accessibility defect, fix it surgically without unnecessarily replacing its indexed content.

No ranking guarantee can be made. Our objective is to minimize avoidable SEO risk while improving user experience.

---

# PART B — Major Visual and User Experience Review

## 4. Conduct a genuinely independent visual audit

Perform a comprehensive review using actual browser screenshots and interactions.

Do not assume that passing automated accessibility and screenshot tests proves the website looks professional.

Review at least these page types:

- Homepage.
- Main word-search generator.
- Hard printable collection.
- Other collection pages.
- Category pages.
- Individual published puzzles.
- Online solver.
- Large-print pages.
- Classroom/teacher pages.
- Guest pack generator.
- PDF and print utilities.
- Search and navigation.
- Guide pages.
- Specialty-generator pages.
- About, contact, legal and policy pages.
- Error, empty, loading and invalid-input states.

Review representative layouts at 320, 390, 768, 1024, 1280 and 1600 pixels, with light and dark themes.

Include mobile landscape, responsive reflow, enlarged text and keyboard interaction.

Compare both the baseline and candidate for sensitive templates.

## 5. Evaluate design quality, not merely CSS correctness

Inspect:

- Visual hierarchy.
- Typography and readability.
- Button sizing and spacing.
- Heading proportions.
- Card consistency.
- Icon choice and placement.
- Alignment.
- Container widths.
- Section spacing.
- Form density.
- Control discoverability.
- Text contrast.
- Light/dark consistency.
- Hover, focus, loading and disabled states.
- Mobile touch targets.
- Modals, menus and dialogs.
- Error presentation.
- Print/PDF previews.
- Ads and surrounding layout.

Look for:

- Overly large empty spaces.
- Sections that push the useful tool too far down.
- Too many competing calls to action.
- Repetitive navigation.
- Inconsistent controls that do the same thing.
- Poor mobile wrapping.
- Hard-to-find export options.
- Unclear success/failure feedback.
- Clutter introduced by the expanded functionality.
- Generic design patterns that make the site feel assembled rather than thoughtfully designed.

Be especially careful with the above-the-fold experience.

Visitors should immediately understand what the page offers and how to use it.

Improve hierarchy and clarity before adding decorative elements.

## 6. Apply a restrained design strategy

Use existing design-system conventions and appropriate design skills/tools available in the runtime.

Do not turn the site into a completely different visual identity.

Avoid gratuitous animations, oversized illustrations, unnecessary cards, excessive gradients or additional client-side frameworks.

Prefer improvements such as:

- Better spacing.
- Clearer primary/secondary actions.
- Consistent typography.
- More informative icons.
- Improved responsive alignment.
- Better organization of advanced controls.
- Clearer empty and error states.
- Faster discovery of existing features.
- Less visual competition between related sections.

**Keep the existing design language where it works. Refine it rather than replacing it.**

For every meaningful visual change, record the user problem, before/after screenshots and verification.

---

# PART C — Public-Facing Copy Audit

## 7. Remove unhelpful documentation-style and generic AI-like copy

This is an explicit owner priority.

Review every major publicly rendered template, particularly newly introduced text.

The public site should not read like:

- A software project report.
- An AI-generated SEO content collection.
- A developer's implementation documentation.
- A release-readiness dashboard.
- A list of internal engineering features.
- A series of generic promotional paragraphs repeated across pages.

Review headings, instructions, FAQs, help messages, tool descriptions, status labels, limitations, empty states, footer sections and related-link introductions.

Flag prose that:

- Says many words without helping visitors.
- Repeats information already visible in the interface.
- Uses generic praise rather than explaining a feature.
- Includes unnecessary engineering terminology.
- Repeats nearly identical instructions across unrelated pages.
- Exists primarily to add keywords or word count.
- Makes unverified educational, accessibility, quality or performance claims.
- Describes features that are incomplete or unavailable.
- Creates an artificial impression of human testing, expertise or editorial review that has not occurred.

Examples of wording to question include generic claims such as “ultimate resource,” “comprehensive curated experience,” “seamless journey,” and lengthy explanations of internal implementation details.

**Do not use an AI detector or simplistic phrase blacklist as the decision maker.**

Assess whether the text actually helps the visitor.

Natural, concise instructional language is preferable to grand promotional language.

## 8. Review specific existing shared sections

Begin with:

- `components/page/PageSections.tsx`
- `components/page/IndexablePage.tsx`
- `components/page/RouteHub.tsx`
- `components/page/RelatedActivityTools.tsx`
- `app/editorial-policy/page.tsx`
- User-visible search, generator, pack, specialty and PDF components.

Specific items for assessment:

1. The repeated “Make, Check, Print” explanatory section.
2. Generic FAQ fallbacks and repeated FAQ topics.
3. Repeated editorial/puzzle standards links.
4. Page-hub explanatory paragraphs.
5. Specialty-format readiness disclosures.
6. Repeated “All tools” blocks and related-link introductions.
7. Advanced generator instructions involving seeds, directions and export formats.
8. Warnings and failure messages.
9. Author and editorial-process descriptions.

Some of these sections existed before the buildout. **Do not remove them automatically.**

Ask for each:

- Does this explain something users need to know?
- Does it answer a real question?
- Does it help someone complete a task?
- Is it relevant to this specific page?
- Would removing or shortening it make the page less useful?
- Was it part of the previously successful indexed page?
- Would changing it alter substantial crawlable content across many URLs?

If it is useful, keep it.

If it is redundant, prefer a minimal structural improvement.

If it is misleading or plainly confusing, fix it.

If its only purpose is generic SEO filler, recommend removal—but apply the SEO risk controls below.

## 9. Do not expose internal project terminology unnecessarily

Visitors generally should not see internal concepts such as:

- Pull request numbers.
- Development milestones.
- Release tracks.
- Build stages.
- Implementation scaffolds.
- Internal catalog IDs.
- Test statuses.
- Noindex classifications.
- Candidate approval metadata.

Exceptions are allowed when a technical explanation genuinely helps the user understand or control a feature.

For example, “Seed” is a real user-facing generator option. Retain it, but give it a simple and accurate explanation.

Similarly, incomplete specialty formats must disclose their actual limitations. Don't hide a limitation just to improve the wording.

Prefer task-based language.

Examples:

- “This format is not available yet” rather than unexplained implementation terminology.
- “Use the same settings to recreate this puzzle” rather than unnecessary discussion of internal deterministic generation.
- “This word list is too long to fit on the selected paper size” rather than an internal renderer error.

Keep language natural, informative and precise.

## 10. Protect useful trust and legal content

Do not strip legitimate:

- Privacy information.
- Terms.
- Copyright and attribution.
- Accessibility information.
- Accurate editorial standards.
- Actual author information.
- Important warnings.
- Feature limitations.
- Printing instructions.
- Classroom-use guidance.

A good About or editorial page can provide real visitor value.

But don't add repetitive trust statements to every puzzle page merely to manufacture authority.

Accuracy and relevance matter more than quantity.

---

# PART D — Strict SEO Change-Control Policy

## 11. Establish four copy-change categories

**Category A — Low-risk interface copy**

Examples: button labels, validation messages, modal instructions, loading indicators and local-only help.

These may be improved after focused functional and accessibility testing, provided they do not change SEO semantics or important user expectations.

**Category B — Shared template copy on indexed pages**

Examples: common explanatory sections, related tools, standards links and general FAQ blocks.

These can affect many URLs at once. Require a measured baseline comparison, exact affected-route count, content-diff analysis and independent review before substantial alteration.

**Category C — Existing indexed editorial content**

Examples: existing H1s, introductory paragraphs, category descriptions, puzzle vocabulary, topic narratives, metadata and established FAQ content.

Default to **no changes**.

Only modify for a confirmed factual error, broken user experience, serious readability issue or other clearly demonstrated benefit.

Material changes require separate owner approval. Don't automatically apply stylistic rewrites.

**Category D — New unpublished content**

Review freely while it remains source-only. Require genuine usefulness, originality, accurate vocabulary, editorial approval and publication authorization before making any indexed page.

## 12. Add an explicit indexed-content diff guard

For the full current indexable inventory, compare production main against the candidate.

Capture and compare, as applicable:

- URL.
- HTTP status.
- Canonical.
- Robots directives.
- Title.
- Meta description.
- H1.
- Relevant H2 hierarchy.
- Substantive page body.
- Existing puzzle vocabulary.
- Schema/JSON-LD.
- Internal links.
- Sitemap membership.
- Redirect behavior.
- Indexability classification.

Separate shared header/footer/navigation changes from the actual editorial content.

Classify every difference as:

- Expected UI structure.
- Approved functional content.
- Technical accessibility/semantic improvement.
- Potentially meaningful indexed-content change.
- Unexpected regression.

Create an explicit allowlist for intentional differences, with explanations.

Do not use an excessively permissive test that ignores all text differences.

Do not fail because of irrelevant generated attributes or harmless DOM differences either. The comparison needs to distinguish semantic changes from implementation noise.

For high-traffic pages, conduct individual manual inspection.

Particularly protect `/collections/hard-printable-word-searches`.

## 13. No mass rewriting or unnecessary content pruning

Do not:

- Rephrase every published paragraph to make the website sound more human.
- Rewrite all page titles.
- Replace established introductions.
- Rebuild every FAQ from a template.
- Remove longstanding helpful content indiscriminately.
- Add automatically generated FAQ blocks to every page.
- Append paragraphs simply to introduce additional keywords.
- Insert the same cross-site links on unrelated pages.
- Change review dates without genuine review.
- Invent new canonical pages for PDF, print, answers or year variants.

A genuinely useful page should remain useful after changes.

Remember that even a small shared component change may affect hundreds of URLs.

If an improvement has a high SEO blast radius and its benefit is subjective, document it for owner review rather than automatically deploying it.

Continue work on other safe improvements.

---

# PART E — Deep Functional UX Acceptance

## 14. Audit real workflows as a new visitor would experience them

Do not simply rerun existing automated tests and declare success.

Use task-oriented scenarios.

### Find a puzzle

- Arrive at the home page.
- Find a hard printable puzzle.
- Select an appropriate topic.
- Understand the intended difficulty.
- Reach the actual puzzle without unnecessary detours.
- Locate print and answer options.
- Return to explore another puzzle.

### Make a custom puzzle

- Enter words.
- Choose difficulty.
- Adjust dimensions/directions.
- Select available alphabet and filler options.
- Generate and preview.
- Recover from invalid inputs.
- Modify settings without losing intended work.
- Save the puzzle.
- Resume later.
- Share the correct state.
- Export the correct output.

### Print a puzzle

- Select Letter or A4.
- Choose student versus answer output.
- Confirm print fit.
- Download PDF.
- Check actual rendered grid and text.
- Inspect the answer key.
- Test error and retry paths.
- Confirm no advertisements are printed.

### Teacher workflow

- Prepare five, ten and twenty assignments.
- Add class/name/date fields.
- Configure answer ordering.
- Generate teacher and student packets.
- Check that each packet actually contains the intended different puzzles.
- Validate long titles, dense vocabulary, duplicates and impossible layouts.
- Verify usability for an ordinary teacher who does not understand technical settings.

### Online solver

- Start a puzzle.
- Select words with mouse, touch and keyboard.
- Find all words.
- Observe completion.
- Review measured elapsed time.
- Replay or reset.
- Save/reopen.
- Use optional sound.
- Handle a lost or unavailable local-storage session.

### Sharing

- Share a real puzzle link.
- Copy it.
- Use available native sharing.
- Send to WhatsApp/email destinations where supported.
- Download a completed-result image.
- Ensure result images don't leak unnecessary puzzle content.
- Test invalid or excessively long links.
- Verify fallback behavior.

Document any confusing steps, unnecessary decisions, misleading labels or non-obvious controls.

The problem is not always a code defect. It may be poor hierarchy or discoverability.

Fix confirmed usability issues rather than adding features indiscriminately.

## 15. Improve the generator without overwhelming it

The generator is one of the site's central product offerings.

Review whether advanced functionality is organized properly.

Questions:

- Are the most important controls obvious?
- Are advanced settings easy to find without crowding beginners?
- Does the page explain settings only when the explanation is needed?
- Are defaults useful?
- Are invalid combinations handled clearly?
- Do settings changes preserve user intentions?
- Is the current output visible at the correct time?
- Can the user easily find Preview, Print, Download, Share and Save?
- Is there a clear distinction between changes that alter the puzzle and changes that alter its appearance?

Avoid unnecessary multi-step wizards and major rearrangements unless current testing proves a significant usability problem.

Preserve familiar controls and locations when they are working.

## 16. Printing and PDF remain priority workflows

Printing quality should be judged by actual output.

Investigate remaining issues including:

- Physical readability.
- Overflow.
- Dense word banks.
- Long titles.
- Margin safety.
- Landscape behavior.
- QR placement and loading.
- Teacher answer labels.
- Large-print claims.
- Error messages.
- Multi-page layout.
- No-ads-in-print.
- Mobile download/print behavior.

The current records retain 48 historical landscape PDF outputs with grid text below 9 pt, while the original output is intentionally preserved.

Do not silently rewrite the existing renderer or change published output bytes to make this issue disappear.

Investigate whether a clearly labeled, opt-in improved layout can handle these cases while preserving the legacy default.

Do not describe an output as accessible large print unless actual grid and word-bank measurements support the claim.

Real physical printing remains a manual gate.

---

# PART F — Performance and Remaining Release Blockers

## 17. Investigate genuine product performance problems

The existing evidence reports:

- 448/448 visual tests passing.
- 84/84 utility CLS comparisons with candidate CLS zero.
- Hard-puzzle mobile Lighthouse performance 87.
- Hard-puzzle total blocking time approximately 439 ms.
- Lighthouse Best Practices 77 in 11 groups, attributed to provider-cookie/inspector warnings.

Separate product performance defects from third-party audit artifacts.

Focus on meaningful user delays, interaction responsiveness, excessive JavaScript, unnecessary hydration, layout shifts and slow generator operations.

Profile before modifying.

Implement a change only if it produces a measurable or clearly demonstrated improvement with acceptable risk.

Do not trade stable puzzles, accurate PDFs or monetization for a superficial Lighthouse score.

Do not disable the advertising provider or change its protected lifecycle to make the audit green.

Record unresolved external causes honestly.

## 18. Handle advertising eligibility without speculative changes

Three internal repository eligibility findings remain:

- `/categories/health-and-wellness-word-searches`
- `/collections/brain-training-word-searches`
- `/guides/how-hidden-message-word-searches-work`

The repository's documented draft/noindex advertising rule conflicts with the wrappers on these pages.

These are internal policy findings, not automatically proven AdSense violations.

Prepare a clear decision document comparing:

1. Maintaining the documented rule and making a narrowly reviewed placement correction.
2. Explicitly revising the internal eligibility policy based on actual approved requirements.

Describe the exact affected URLs, user/advertising effect, needed changes and test impact.

Do not independently change protected ad source, global fill detection, placement CSS or lifecycle logic without the required approval.

If this remains owner-blocked, continue all independent useful work.

## 19. Security and dependency checks

The frozen candidate's full and production dependency audits currently report zero vulnerabilities.

Do not reintroduce unnecessary libraries.

Recheck security only when changes warrant it or advisory information changes.

Keep build tools and runtime on the repository's supported Node configuration.

Do not weaken checks, silently suppress vulnerabilities or perform uncontrolled major upgrades.

---

# PART G — Product Polish and Delivery Discipline

## 20. Prioritize the remaining work by user value

Rank confirmed issues using:

1. Broken core functionality.
2. Confusing or obstructed user workflows.
3. Mobile usability problems.
4. Printing/PDF correctness.
5. Accessibility and readability.
6. Content/copy that actively misleads or fails users.
7. Meaningful performance defects.
8. Visual inconsistencies.
9. Minor cosmetic details.

High-risk SEO changes should be assessed separately rather than treated as routine cosmetic polish.

Do not prioritize building additional puzzle content over resolving a real usability failure in the existing product.

Avoid spending long periods polishing invisible implementation details that do not improve reliability, accessibility, safety or maintainability.

## 21. Organize development into independent reviewable packages

Suggested execution sequence:

**WP-A — Baseline and interface audit**

Complete production-versus-candidate visual and functional comparison. Produce a prioritized defect and preservation ledger.

**WP-B — Core UI fixes**

Address proven navigation, spacing, hierarchy, responsiveness, form, modal and control problems. Preserve recognizable design patterns.

**WP-C — Guest workflow improvements**

Resolve confusion in generator, solver, saving, sharing and completion flows.

**WP-D — PDF and classroom refinements**

Improve practical printing, download, preview and teacher-packet usability without breaking historical output.

**WP-E — Public-copy review**

Evaluate user-visible prose on all major templates and shared components. Apply only low-risk, genuinely helpful corrections. Hold substantive indexed copy changes for approval.

**WP-F — Accessibility and performance**

Validate keyboard, contrast, screen readers, zoom, reduced motion, responsive layout and meaningful runtime performance.

**WP-G — Final combined acceptance**

Reconcile all improvements into a new review candidate and validate exact new runtime source, static output, hosted behavior and known regressions.

These packages can overlap in isolated worktrees where there are no shared-file conflicts.

Do not work on the same CSS/layout component concurrently without a clear integration owner.

Finish each useful package with tested commits and a pushed draft PR.

Do not generate dozens of trivial PRs solely for activity counts.

## 22. Track corrections and carry-forward work

Maintain a durable review ledger with:

- Page/feature.
- Confirmed problem.
- Evidence.
- Severity.
- User impact.
- SEO impact.
- Existing behavior to preserve.
- Proposed correction.
- Implementation status.
- PR and SHA.
- Tests.
- Manual acceptance status.
- Any owner decision needed.

Use plain language rather than only internal work package references.

If a task repeatedly fails, record the diagnosis and continue another independent task.

If new bugs appear during integration, fix them before claiming the feature completed.

Keep the historical evidence for previously solved problems; do not reopen them based only on stale reports.

## 23. Fresh combined acceptance tests

For the final changed application candidate, complete appropriately scoped:

- Clean supported-runtime install.
- Lint and TypeScript.
- Unit/content/SEO tests.
- Published puzzle fingerprint tests.
- Static-host and sitemap audit.
- Redirect and metadata preservation.
- Draft publication isolation.
- Full meaningful browser functional tests.
- Generator settings and invalid-state tests.
- Save/resume/share tests.
- Real PDF and classroom packet checks.
- Light/dark visual matrix.
- Accessibility and keyboard tests.
- Responsive/mobile checks.
- Ad lifecycle and geometry tests.
- Lighthouse with all retained failures reported.
- Netlify preview verification at the exact candidate SHA.
- Public-copy and SEO semantic diff.

Test the final integration, not only the isolated source branches.

If source is changed after the tests, rerun the affected validation.

An interrupted test, stale report or unreviewed screenshot cannot count as a pass.

Do not claim manual physical-device or printer verification that was not performed.

## 24. Final owner review handbook

Prepare a concise but comprehensive manual acceptance guide.

It should tell the owner:

- Which preview URL to open.
- Which high-value pages to inspect.
- Which user flows to try.
- What the expected result looks like.
- What has changed visually.
- What was deliberately preserved.
- Which actual print/PDF files should be checked.
- Which mobile/device/assistive-tech checks remain.
- Which editorial or policy decisions need approval.
- Which blockers prevent production.
- How the candidate can be safely released or reverted after approval.

Include screenshots for important before/after changes.

Do not make the owner reconstruct test procedures from 100 PR descriptions.

---

# PART H — Continuing Work and Shutdown

## 25. Keep working autonomously

This is a substantial, multi-milestone continuation assignment.

The owner is frequently away from the computer.

Do not stop after one PR, one successful visual test or one integration checkpoint.

Continue until all remaining authorized and reasonably feasible work is completed.

If a task needs owner approval, record the decision and continue independent work.

Do not repeatedly request confirmation for ordinary engineering choices within the approved scope.

Use economical delegation when it provides real savings.

Serialize expensive builds and browser tests when memory pressure requires it.

Keep source, review evidence and unfinished owner work recoverable through Git.

## 26. Strict production boundaries

You are authorized to implement, test, commit and push review branches.

You are **not authorized** to:

- Merge or push production main.
- Automatically merge PRs.
- Publish the staged content inventory.
- Introduce new indexable URLs.
- Change advertising infrastructure or protected fill behavior.
- Perform an unapproved sitewide editorial rewrite.
- Introduce paid services or user-data infrastructure.
- Declare external/manual acceptance complete without evidence.

Continue all safe independent development while these gates remain.

## 27. Mandatory Windows shutdown after genuine completion

The owner explicitly authorizes shutting down this Windows PC when the autonomous development work is genuinely exhausted.

Before shutdown:

1. Complete all useful authorized implementation and validation.
2. Confirm no workers or task-owned processes are still doing useful work.
3. Commit and push all completed work.
4. Preserve unfinished owner work and historical worktrees.
5. Publish the final GitHub handoff and exact recovery instructions.
6. Confirm remote branch heads and clean/safely preserved working state.
7. Stop only task-owned idle development servers and temporary processes.
8. Inspect current open application windows, unsaved state and other active sessions.
9. Do not interrupt unrelated user activity or force-close unsaved applications.
10. Record the actual final checkpoint and shutdown readiness.

Then execute the normal Windows shutdown command as the final operation:

`shutdown.exe /s /t 0`

Do not use `/f`.

If the command is rejected or blocked, preserve the actual outcome. Never falsely report that the computer powered off.

Do not shut down while useful authorized work remains. But once implementation is exhausted and all required safeguards are satisfied, do not wait idly for another routine confirmation.

---

# FINAL ACCEPTANCE STANDARD

The final deliverable must be a coherent, well-tested, professionally polished guest-first word-search site.

It should be easy to navigate, easy to understand, reliable to use, pleasant to look at, and excellent at solving the practical problems visitors came for.

Its published puzzles and search assets must retain the successful behavior, definitions, links and substantive content that already work.

Its public-facing copy must be natural, useful, accurate and appropriate for each page—not generic SEO padding or unnecessary engineering documentation.

Its new content must remain staged until separately reviewed.

Its remaining external release gates must be reported accurately.

**Do not equate large code volume, passing test counts or extensive documentation with a finished user experience.**

Use actual browser interactions, actual exported files, visual inspection and controlled before/after comparisons to identify what still needs improvement.

If every remaining authorized improvement is genuinely exhausted, leave a comprehensive final handoff, preserve everything, and perform the authorized graceful Windows shutdown.

Otherwise, continue implementing and testing.