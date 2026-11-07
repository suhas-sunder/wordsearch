# U13 follow-up — pause elapsed time across page restoration

Child of resume PR #34 atc6553c8. A browser can preserve a solver in its back/forward cache instead of reloading it. The old timer's original performance timestamp then counted time spent away from the page, contrary to the displayed navigation-pause behavior.

Before source edits the new real-browser lifecycle regression against combined export3290 failed: expected1:15 after65seconds playing,120seconds away and10seconds resumed; actual3:15. On pagehide the solver now saves the current snapshot and pauses the in-memory clock. On pageshow it resumes the same in-memory session; no storage read or new opt-in occurs. Begin/reset/request replacement clear pending restoration; completed times remain frozen. The help text distinguishes automatic browser page restoration from explicit Resume after reload.

Changed only OnlineSolver.tsx and existing solver-progress browser fixture, plus this evidence. No generation, seed, output, privacy payload, advertising or publication changes.

Node25 lint/typecheck/223unit+SEO tests PASS; Node22.23.4 production build PASS334pages using same-drive C: mirror of the two exact modified files (existing cross-drive dependency-junction limitation). Static-host PASS217sitemap/35redirects/6shells. Full solver-progress browser workflow with pagehide/pageshow persisted lifecycle and two minutes simulated absence PASS desktopkeyboard/mobiletouch; existing corrupt/blocked/quota/private-record/resume/replay tests unchanged. Completion PNG/time/share regression PASS.

The test dispatches actual PageTransitionEvent lifecycle events under Playwright's clock; it proves handler timing behavior, not every browser's bfcache eligibility or process-termination guarantees. Abrupt termination can still lose time since last successful save. No main push/merge, auto-merge or deployment. Rollback excludes/reverts this child.
