# Complete sixty-candidate offline audit

The whole-catalog audit previously covered forty-five staged candidates even
after the fifteen calendar-gap candidates were built in PR 53. The source-only
catalog now includes that seventh group, so the existing command actually checks
all sixty candidates together against every registry record and redirect.

```powershell
npm run audit:staged-inventory -- --pdf --export-dir=../wordsearch-buildout-integration-03/out
```

Groups remain at most twenty entries for the existing bounded schema/placement
validator. The cross-family collision audit runs across all sixty first; it
does not lose cross-batch duplicate/near-duplicate coverage by chunking.
The catalog regression now requires the full sixty and the fifteen-member
calendar group rather than accepting any total greater than forty.

JSON output separately reports sixteen larger-type utility selections and the
two preserved owner parks/landmarks enhancements. Those are not new proposed
paths: the utilities do not create canonicals, and the enhancements target
existing draft/noindex records. The report explicitly identifies which sixty candidate
sets this command inspected and points to their separate tests;
counts are not described as rerun physical printing or human approval.

The enhancement records expose the original source-file SHA and zero package
publication allowance, without adopting its asserted review date or modifying
the root worktree. Any future draft-to-indexable activation still counts as a
newly indexable URL and needs the calendar's separate one-URL/approval gate.

No runtime registry, content promotion, metadata, published seed, ad code or
production operation changes. All sixty candidates remain editorially
unreviewed. Lint, typecheck and all394 tests pass. The full --pdf/export audit inspected all60 candidates (120 actual Letter/A4 PDFs), seven bounded groups, with zero issues against the preserved integration03 export. Rerun against the next exact combined export.
