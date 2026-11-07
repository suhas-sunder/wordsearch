# Overnight completion and shutdown control

The owner's current instruction explicitly authorizes Windows shutdown after all
feasible work, validation, saved GitHub checkpoints and safety checks. It does
not authorize stopping useful work, forcing applications closed, merging main,
deploying production or publishing editorial drafts.

## Why the preceding session remained on

[The November5 handoff](OVERNIGHT-2026-11-05.md#final-verification-and-shutdown-decision)
states that all workers and task-owned validation listeners were stopped and
review branches pushed, but **no shutdown command was issued**. It stopped at an
unverified-unsaved-desktop-state condition based on process/chat inventory.
The previous chat, "Fix direction selection behavior", repeats that decision.
The master plan also records this reason. There is no recorded rejected Windows
shutdown command to repair or permission/security setting to change.

The workflow correction is to keep completion/shutdown gates explicit in durable
state, inspect actual open-window/session state, finish useful work and save the
handoff, then issue the owner's non-forced command as the final operation. The
[official long-horizon Codex guidance](https://developers.openai.com/blog/run-long-horizon-tasks-with-codex)
supports durable specifications, continuous verification and a status log; it is
not evidence that a shutdown command was attempted in this session or the last.

## Gates, evaluated again immediately before shutdown

1. Reconcile every authorized build/research lane. Fix feasible confirmed defects.
   Record genuine external/editorial/owner gates without representing them as
   passes. Never use a ready PR or a future publication date as completion.
2. Confirm workers have finished, and no task-owned process is still doing useful
   work. Finish running validation rather than interrupting it.
3. Commit/push completed implementation, tests, documentation and recovery state;
   verify remote heads and publish the final GitHub handoff. Preserve unfinished
   original work and describe exact recovery paths/branches/hashes.
4. Stop only identified task-owned idle servers/helpers. Preserve unrelated
   processes and user work during development. Do not kill applications to make
   shutdown appear successful.
5. Read active Windows session inventory and actual open-window state. Inspect
   known editor/document unsaved indicators when relevant, without transmitting
   private titles/content into a public handoff. Check for unrelated active chats,
   tests, builds or sessions. Refresh observations at completion; earlier checks
   are not a final safety certificate.
6. Save sanitized final safety observations and GitHub checkpoint references.
   Record that the non-forced shutdown request is about to be issued, not that
   the PC has already powered off. Do not idle for another routine confirmation.
7. Execute exactly `shutdown.exe /s /t 0`, with no `/f`, as the final operation.
   If rejected, preserve the actual exit/error and update the final handoff with
   the failure. Never claim successful shutdown from a rejected request.

## Initial investigation observations, not final clearance

Computer Use's read-only window inventory exposed only the Codex/ChatGPT window;
no unrelated editor/document window was returned. `query.exe user` returned one
current console session and no additional logged-in session. System-log lookup
found no matching1074/6005/6006/6008 events in the requested three-day window;
this limited lookup does not prove why a command was not run. The preceding
session's explicit handoff remains the direct evidence for that decision.

No shutdown is scheduled while the buildout is running. This document is a
runbook, not a background shutdown hook. Actual final checks, saved checkpoint
SHA and command outcome must be recorded separately when the work is exhausted.

## Runtime guard correction during this session

Before final B browser acceptance, the root freeze recorded Node25.9.0 and
exposed a task-local PATH prefix missing the Node package's `bin` directory.
That550-test/build/static attempt is retained under
`product-final-f7849cd/node25-attempt/` outside Git and is not a supported-runtime
pass. No browser acceptance used that export. The complete preflight and build
were rerun using the explicit Node22.23.4 executable and verified child PATH;
550tests/79files, lint, typecheck,335-page build and217/35/6 static checks pass.

The freeze helper now rejects any runtime other than the verified Node22.23.4,
and the independent carry audit rejects a manifest with a mismatched runtime.
Use the actual `node/bin/node.exe`, verify both direct and child `node --version`,
and preserve failed or unsupported attempts rather than relabeling them.
