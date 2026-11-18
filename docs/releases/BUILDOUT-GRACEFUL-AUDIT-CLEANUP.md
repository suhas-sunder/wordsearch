# Graceful Lighthouse browser cleanup

The owner explicitly prohibited forced application termination for the final
session. Inspection of the locked `chrome-launcher` implementation found that
its convenience `kill()` invokes forced process termination on Windows. The
ordinary and diagnostic Lighthouse runners previously called that method.

The shared [audit browser helper](../../tests/e2e/audit-chrome.mjs) keeps the same
launcher, temporary profile and browser flags, then requests `Browser.close`
through the owned browser's debugging protocol. It requires actual child-process
exit, bounds acknowledgement/exit waits, and has no forced fallback. Closing
twice reuses the first result instead of targeting a potentially reused PID.
It rejects custom user profiles. Before recursive profile cleanup it resolves
both the profile and OS temporary root, requires a strict descendant named
`lighthouse.*`, and waits for browser exit. A locked temporary profile is retained
with an explicit warning; a browser-close failure produces a failing exit code.

This changes test-process cleanup only. Application code, advertising requests,
Lighthouse routes, repetitions, medians and thresholds are unchanged. The ordinary
gate still requires SEO/accessibility100, Best Practices95, CLS≤0.1, LCP≤2500ms
and editorial performance≥90. Provider-script blocking remains diagnostic-only.

## Executed cleanup validation

[The actual cleanup smoke](../../tests/e2e/audit-chrome-cleanup.mjs) launches an
isolated browser for normal completion and an intentional audit-error path. It
checks the protocol version, graceful exit0, profile cleanup, idempotence and a
closed debugging port. Both actual cases pass on Node22.23.4 and Chrome157.0.8103.38: CDP close,
exit0/no signal, verified profile cleanup, idempotent second close and closed
debugging port. No forced fallback ran. Evidence:
`product-final-f7849cd/lighthouse-cleanup/attempt-01/cleanup.json` outside Git.
The unchanged ordinary audit completed with its real exit1/Best Practices77;
the five-sample diagnosis completed exit0 for attribution only. Both audit browsers
also closed via CDP with exit0 and verified profile cleanup. Their performance
results remain separate from this lifecycle smoke; see
[the failed performance gate](FINAL-PERFORMANCE-GATES.md).

Run with the direct supported Node22 executable and an outside-repository
`AUDIT_CHROME_OUTPUT`; no production or unrelated browser is targeted. The frozen
application remains B`f7849cddda2a7df5daff2425ba179b9af21f6272`. This helper and the
two changed Lighthouse fixtures belong to the final evidence/operations review
commit; fixture hashes bind their execution separately from the application SHA.
