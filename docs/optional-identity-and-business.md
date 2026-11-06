# B13 / gated product discovery

Prepared November 6, 2026. This is a decision-ready specification, not a new
service, launch, demand forecast or authorization to collect information.
The [master buildout](https://github.com/suhas-sunder/wordsearch/blob/2525e8cfb6c825bb4d34be92e5c32757d138dc7b/ai-issues/2026-11-06-MASTER-BUILDOUT-AND-CONTROLLED-RELEASES.md)
and [catalog](https://github.com/suhas-sunder/wordsearch/blob/2525e8cfb6c825bb4d34be92e5c32757d138dc7b/ai-issues/2026-11-06-buildout-catalog-and-release-queue.md)
explicitly gate capture/storage, authentication, recurring infrastructure,
payments and community publishing. Development of unrelated guest features
continues while these decisions are unresolved.

## Evidence and current capabilities

The current site is a static Next.js export with browser-local generation, PDF,
solver, encoded share links and limited local preferences/builder persistence.
It has no approved account, waitlist, database, payment or realtime architecture.
Do not reinterpret an encoded URL as private cloud storage or a Netlify request
count as an engaged user/session. Public planning's dated GSC/Bing acquisition
aggregates do not establish recurring use, willingness to pay or classroom demand.
The new B10 report supports aggregate release evidence, not a tracking rollout.

Guest creation, play, share, printing and ordinary PDF/answer output remain
available without registration. New retention features should first work locally
with explicit clear/export controls. Cloud identity must add optional utility,
not interrupt the current free workflow or place ads over solving controls.

## Finite decision queue

| Catalog ID | Work completed by this specification | Implementation gate / present disposition |
| --- | --- | --- |
| U17 waitlist | Minimal opt-in flow, data fields, ownership and measurement specification below | **DEFER capture/storage** until owner approves provider, retention/deletion, consent wording and ongoing responsibility |
| U18 accounts/cloud history/class groups | Guest-first migration, data/permission boundaries, export/deletion and recovery requirements | **DEFER** until actual repeat-use need and secure backend/identity design are approved |
| U19 realtime co-solving | Shared-board state and reconnect/abuse acceptance contract | **DEFER service** until auth/room-cost/security and load evidence exist |
| U20 paid plans | Value hypotheses, cost model inputs and free-tier protections | **DEFER pricing/payment integration**; no conversion, price or revenue claim |
| U24 photo/OCR solver | Feasibility/rights/accuracy research contract | **RESEARCH incomplete**: no representative licensed test corpus, accuracy result or suitable existing OCR library; no upload endpoint/SEO landing |
| U26 daily/weekly challenge | Reuse-first repeat-visit experiment design | **RESEARCH incomplete**: differentiated purpose and repeat engagement unverified; no dated indexable archive or scheduled deployment |
| U28 community creator library | Moderation/rights/retention requirements | **DEFER**: owner moderation capacity, secure storage and abuse controls absent |

This is not a claim these products are implemented. Explicitly deferred items do
not block printable packs, source-only editorial drafting, UX, guest history or
technical validation. Publication dates do not block their development either.

## U17: concrete minimal waitlist design

Proposed journey: explain the optional future capability and that it does not
exist yet → email field plus explicit opt-in → neutral pending state → confirmed
success only after the selected service acknowledges receipt → verification and
unsubscribe where the owner-approved delivery model requires them. Never display
fake stored/subscribed success from a frontend-only form. Preserve existing
anonymous tools and keep the waitlist out of the puzzle/export path.

Minimum proposed stored fields: email, consent-text version/time, verification
state and coarse capability-interest choice only if useful. Do not collect
puzzle words, student names, school/class identifiers, shared-state URLs or usage
history. Owner must choose retention/deletion timing, support contact, delivery
provider, credentials owner, abuse/rate limits and failure handling. No suggested
retention number is silently treated as an approved policy.

Acceptance after those choices: duplicate submissions handled without revealing
membership; accessible error/retry flow; test-mode mail only in review; verified
unsubscribe/deletion; no secrets in client bundle; no new analytics or consent
provider sneaked into the form. A source-only visual prototype can precede a
backend, but must visibly state that it does not collect or send information.

## U18: optional accounts and saved assignments

Required before implementation:

- Map actual guest data and versioning. Retain a user-controlled local-only mode;
  require an explicit action before uploading existing puzzle text or progress.
- Define ownership/permissions for private puzzle, shared puzzle, teacher folder
  and class membership separately. The current reversible URL is not an account
  permission boundary. Avoid changing or invalidating existing guest links.
- Choose identity/session provider, storage location and schema, credential
  rotation/recovery, access checks, backup/export/deletion and operational owner.
- Specify failure states: offline, expired session, revoked membership, stale
  revision, duplicate assignment, storage quota and partial upload. Never lose
  local work because an account operation fails.
- Decide target audience and what information, if any, a teacher/student workflow
  actually needs. Do not collect real student/class records as a development
  fixture. No compliance or educational-outcome certification is assumed.

Proposed data boundaries: account identity separate from puzzle payload; immutable
puzzle configuration/version separated from progress; per-assignment access
records; content-free operational metrics only if separately approved. User
names and puzzle text must stay out of public route slugs, logs and events.
Cloud-save adoption, recovery success and support burden need real measurement
before expanding accounts into the mandatory site journey.

## U19: co-solving feasibility contract

A room must identify one frozen puzzle version/fingerprint. Joining clients must
agree on that fingerprint before interacting. Server acceptance of found words
must be idempotent; concurrent submissions must not double-count or overwrite
progress. Presence and chat are separate choices: co-solving does not require a
free-text chat feature. Private/invite-only membership and room expiry must be
defined before public rooms.

Test requirements after authorization: two clients find the same word, simultaneous
different words, disconnect/reconnect, expired/revoked invite, late join, stale
puzzle revision, clock differences, replay/reset authority, rate-limited abusive
client and offline read-only recovery. No client-supplied elapsed time becomes an
authoritative public score. Define maximum room size, expiry and concurrency from
measured resource use and owner budget, not invented market demand. Prototype
locally against a fake transport before choosing a recurring hosted service.

## U20: value and cost decision, not automatic monetization

Candidate optional value: organizing many assignments, reviewed printable packs,
reusable classroom templates or private collaboration. Existing free generation,
solving, printing and ordinary answers stay intact. These are hypotheses; no
paid tier, price, entitlement, checkout or subscription is activated here.

Collect these cost inputs before a go/no-go: monthly active accounts and retained
data; generated/stored bytes; reads/writes; concurrent rooms and message volume;
email volume; provider minimums/overage; backups/monitoring; moderation/support;
payment fees/refunds and owner maintenance time. Compute:

`monthly cost = fixed service costs + measured usage × verified unit rates + operations`

Obtain current official provider quotes only after requirements are chosen. No
subscription quote or profitable-user threshold is fabricated. Set an approved
spend ceiling, overage stop behavior, usage visibility and a reversible exit/data
export plan. Billing/auth work needs explicit owner authorization and review.

## U24: photo recognition research gates

No current dependency supplies word-search OCR. Evaluate a small licensed or
owner-created image corpus first: phone skew, faint/low-contrast scans, grid
lines, small letters, rotations, multiple alphabets and cropped/partial grids.
Separate token recognition, row/column reconstruction and actual word-path
accuracy; report measured errors and failure examples rather than one headline
accuracy number. Users must be able to correct recognition before solving.

Do not send images to a new paid API or store uploads under generic build
authorization. Review dataset/library commercial-use licenses and resource use,
compare local/browser feasibility, then propose a bounded implementation if it
passes. Missing corpus, rights, accuracy and cost evidence are named barriers;
an attractive upload button or keyword landing page is not a delivered solver.

## U26: differentiated recurring challenge research

Start from a repeat-visit use case and an existing reviewed library. A nonindexable
selection utility or explicit weekly curated choice may reuse season-stable
canonical pages; it must not create hundreds of near-duplicate date URLs. Define
timezone, immutable puzzle choice, replay behavior and accessible completion
before advertising a daily challenge. Do not install a schedule, server or daily
production deploy without separate authorization. Engagement is currently
unverified; missing data is not a negative demand result or a reason to invent
a streak/competition mechanism.

## U28: creator/community publication gates

Guest-local creation remains available. A public creator library would need
explicit submission consent/rights, abuse reporting, moderation ownership and
capacity, editing/removal/review history, rate limits and secure storage.
Default unreviewed submissions to unlinked/noindex; never convert user puzzle
text into an auto-indexed archive. Do not promise automatic classroom safety,
copyright clearance or medical/educational suitability. No submission endpoint,
creator profile or collection service is implemented by this specification.

## Review handoff

The owner can review these concrete requirements independently. To unblock any
deferred implementation, record the named product/data/provider/cost decisions,
then authorize a small implementation package with acceptance tests and rollback.
This document does not ask to block or stop unrelated authorized work, does not
modify existing policies, and creates no production surface or new indexable URL.
