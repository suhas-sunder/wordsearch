# Explicit local classroom presets

Review-only child of PR38. A user can save up to five classroom titles on this
device, show saved entries, explicitly load one, replace one by saving the same
title, or delete the saved set. Nothing is saved automatically. Exact words,
title, seed, count, paper and page/order choices are retained. Saved input is
validated without generating grids during read; actual download still validates
complete placement and layout. No auth, server, sync or telemetry is added.

The versioned20KB store rejects malformed, foreign-version, oversized, duplicate
name, invalid count/output and duplicate-word records before loading. Invalid
existing data is never silently overwritten; users can deliberately delete it.
Blocked/quota storage errors retain form entries and do not disable downloads.
The UI and privacy policy explain that raw unencrypted words are visible to
other users of the same browser. Only the preset-specific key is deleted.

Validation November6 Node25: lint/typecheck289tests, production build335pages,
static-host217/35/6, whitespace checks pass. Twelve unit cases cover exact
seeded replay, limits/replacement, corrupt/incompatible preservation and denied
storage. Browser `classroom-presets.mjs` passes explicit-save/no-autosave,
reload and20-assignment output choice restoration, corrupt-data recovery,
deletion, blocked storage and mobile overflow at3393. The existing full pack
workflow also passes5/10/20 PDF downloads, paired grids and mobile axe.

Existing published puzzle fingerprints stay unchanged. Presets can remain on a
shared device until explicitly deleted, and clearing site data removes them.
Concurrent tabs may replace the same store; cross-tab merging is outside this
bounded feature. Existing release/ad-eligibility/CLS/security and physical-print
gates are not waived. Rollback by excluding/reverting this package; saved data
stays local and inert if its UI is removed.
