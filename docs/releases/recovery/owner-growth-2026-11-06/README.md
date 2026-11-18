# Preserved owner preparation — recovery only

This is an intentional durable recovery checkpoint of the original13 saved but
uncommitted files. It is not runtime content, a new publishing implementation,
test approval or editorial approval. `.txt` suffixes and binary Git attributes
preserve exact bytes while excluding the archived code from compilation. The
manifest records every original path, SHA256 and status, plus the tracked diff.
No original file, index, branch or stash was changed to create this archive.

Original checkout: `E:/PROJECTS-and-WORK/work-projects/all_projects/wordsearch`.
Original branch: `review/adsense-placeholder-layout-20261008` at
`6d72c821101c72d5fc405cad6315fcf0fa001e93`. Eleven tracked modifications and two
untracked files were preserved. Prefer resuming that existing checkout if intact;
do not create duplicate work or apply this archive over the current candidate.

The eight topic proposals have already been preserved separately as unreviewed
assets in PR79. The original promotion/tests here contain older publication and
review assertions which remain unverified. They must not be applied wholesale
to main or the release candidate. Current editorial gates and the initial
one-new-URL-per-approved-release limit still apply.

## Restore only if the original checkout needs recovery

1. Read `manifest.json`. Fetch the preserved original branch/base if needed.
2. Create a **new**, separate worktree at the exact original base, for example:
   `git worktree add -b codex/owner-growth-recovered E:/PROJECTS-and-WORK/work-projects/all_projects/wordsearch-owner-growth-recovered 6d72c821101c72d5fc405cad6315fcf0fa001e93`.
3. For each manifest record, copy `archivePath` to `originalPath` under that new
   worktree. Use literal paths, verify resolved destinations stay inside the new
   worktree, and preserve the source bytes. Remove the terminal `.txt` only via
   the recorded destination mapping; do not guess paths or replace current work.
4. Verify all13 restored files against their manifest SHA256 values. The expected
   Git status is eleven modified and two untracked files. `tracked-preparation.patch`
   provides a reviewable/dry-checkable diff against the recorded base; it need not
   be applied when restoring complete raw files.
5. Review/rebase any future useful changes against the actual release head in a
   separate authorized package. Never use the old preparation as permission to
   publish the topics, restore older ad behavior or waive current validation.

Normal shutdown does not remove saved worktree changes. This remote-checkpoint
archive additionally makes their exact contents recoverable independently of the
original dirty directory. No build cache, dependency tree, PDF or temporary audit
output is stored here.
