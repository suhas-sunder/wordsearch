# Decision required: three internal advertising eligibility findings

Source baseline R `ada6b6e89a67ca5c1c31a4cc927453994ba9d3d4`; application B `f7849cddda2a7df5daff2425ba179b9af21f6272`. This is an internal requirements decision, not an AdSense violation determination or legal advice. No advertising code, indexing flag, policy or test was changed by this analysis.

## Confirmed conflict and exact scope

| Existing URL | Actual model / wrapper | Current user effect |
| --- | --- | --- |
| `/categories/health-and-wellness-word-searches` | Draft category; noindex, follow; omitted sitemap. `app/categories/[slug]/page.tsx` always chooses category template. | Draft browse surface can reserve/display ads despite internal draft rule. No approval to publish health claims or change topic content. |
| `/collections/brain-training-word-searches` | Draft collection; noindex, follow; omitted sitemap. `app/collections/[slug]/page.tsx` always chooses collection template. | Draft collection can reserve/display ads; “brain training” title is not evidence of reviewed health benefit or substantive published children. |
| `/guides/how-hidden-message-word-searches-work` | Draft guide; noindex, follow; omitted sitemap. `app/guides/[slug]/page.tsx` always chooses guide template. | Incomplete guide can reserve/display ads before editorial approval. |

`components/layout/AdSlot.tsx` states `draft` has zero placements because “Draft and noindex content stays ad-free.” Category/collection/guide policies instead describe published substantive content and allow all six placements. The three wrappers choose their monetized template without checking the route record's indexability/publication. Published children and guides are filtered elsewhere, but that does not guard the wrapper itself. `docs/audits/adsense-placeholder-layout-review.md` section 4 and live-integration review list draft/noindex content as ad-free. `tests/e2e/route-audit.mjs:278–306` expressly retains these three cases and treats the mismatch as repository policy, not an ad-network ruling. Historical strict audit exit 1 remains unwaived.

The old route audit asserts **three representative URLs**, not the complete affected inventory. This independent bounded scan of B's actual `out/categories`, `out/collections` and `out/guides` HTML found **12 noindex outputs with ad-placement markup**. Besides the three above, the exact additional paths are:

- `/categories/faith-word-searches`
- `/collections/baby-shower-word-searches`
- `/collections/bridal-shower-word-searches`
- `/collections/christmas-word-searches-for-kids`
- `/collections/halloween-word-searches-for-kids`
- `/collections/rainy-day-word-searches`
- `/collections/road-trip-word-searches`
- `/collections/substitute-teacher-word-searches`
- `/guides/word-search-ideas-for-parties`

Each has six `data-ad-placement` markers. The exact file hashes and counts are retained outside Git in `excellence-copy/noindex-ad-output-scan.json` under the task visualization root (raw manifest SHA-256 `7b57e9e6ac55ac8ddf455396651841359dc562a0819c624f46e594862fc9f43b`). Source classification is 2 draft categories (`content/categories.ts` missing `publishedDetails` entries), 8 `remainingDrafts` collections and 2 `remainingDrafts` guides, all resolved as noindex by `content/registry.ts`; their literal wrapper templates remain category/collection/guide. This is fresh inspection of the frozen static output, not a new network/ad-provider compliance finding. It expands the **implementation blast radius to 12 existing draft URLs** if enforcing the same rule consistently. All three dynamic templates generate static params for every record. Before implementation, cross-check this complete static list against the registry and separately ensure canonical published templates retain existing placements. Preserve 217 sitemap entries, 35 redirects, metadata/robots/canonicals and all 150 puzzle fingerprints.

## Option 1: retain the documented rule, correct placement selection

Recommended default proposal, pending explicit owner approval for this scoped advertising change: derive the wrapper template from actual publication/indexability and choose existing `draft` for these unapproved records. Pass that same chosen template to **every** local BelowHeaderAd/SeoSectionAd and shell; changing only the outer shell leaves local ad slots behind. No global loader, fill detection, placement CSS, slot IDs, first-filled suppression or new lifecycle should change.

Visitor effect: these draft pages become ad-free and lose associated reserved advertisement regions. Their URLs/content/robots remain unchanged and they do not become indexable or approved. Advertising effect: fewer eligible requests on those pages; no traffic/revenue estimate is available and no ranking improvement is promised. Published-page placement geometry and genuine creative behavior must remain unchanged. This is a limited policy enforcement correction, not a provider-cookie or Lighthouse77 remedy.

Required validation: exact complete affected route manifest; static no-slot/no-loader checks for all gated draft outputs; retained placements on representative published category/collection/guide; route audit passes the original unchanged eligibility assertions; no sitemap/robots/content/fingerprint drift; unit/server markup coverage for wrapper and local slots. Because advertising presentation changes, the protected guidance also requires owner-approved representative blocked/delayed/unfilled/first-fill/later-fill/navigation/responsive/light-dark acceptance, genuine-network stacking evidence and rollback. Mocks prove markup regressions, not provider compliance. A small package should include a reviewed revert path and no changes to the global suppression rule.

## Option 2: explicitly change internal eligibility requirements

Owner may instead approve a precise exception for identified substantive noindex pages. Approval must state why each page is suitable despite draft status, who reviewed content and provider/consent requirements, and whether incomplete drafts remain excluded. Noindex alone is neither independent provider approval nor a universal network prohibition; do not invent either claim. The existing category/collection/guide policy reasons describe published content, so retaining today's mismatched wrappers without changing requirements is not a resolution.

Needed changes after that approval: update the policy model/reasons, documented eligibility table, launch checklist and exact route audit expectations together; represent exceptions as explicit reviewed route eligibility, not blanket “noindex can monetize.” Retain generic draft/error/utilities/trust ad-free defaults. Tests should prove only approved exceptions and refuse unknown/draft states. Existing three assertions must not merely be deleted to green the suite: link the approved replacement requirements and report the policy transition. If a page needs substantial editorial work to qualify, that is category C/owner-reviewed work and does not authorize automatic publication or indexability changes.

Visitor/advertising effect: the explicitly approved pages retain monetized wrappers; no benefit is assumed for unfinished draft content. This option cannot establish AdSense compliance from repository tests, cure provider cookie diagnostics, or waive actual consent/creative review. It has larger policy/maintenance risk than option 1 because future draft states need unambiguous handling.

## Hold state and recommended decision

Until the owner chooses, preserve all ad infrastructure and keep the three internal findings open. Prefer option 1 if the owner's existing rule still expresses the product requirement; option 2 needs explicit revised requirements and content/provider review, not an inferred exception. Do not solve the conflict by publishing drafts, toggling indexability, deleting public copy, disabling the provider, hiding placeholders over creatives or excluding failures from reports.

The protected [owner directive](../../ai-issues/AD-PLACEHOLDER-SAFETY.md) controls: after the first real fill, hide **all** placeholders globally for the page session; never restore per-slot overlays. Its explicit approval requirement applies to replacement behavior. This proposal uses existing templates and does not itself grant permission for placement edits. The Final Product Excellence Program expressly requests this decision document and withholds independent advertising-source changes.
