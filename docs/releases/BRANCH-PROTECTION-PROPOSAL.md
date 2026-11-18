# Main protection proposal — November 6, 2026

Read-only verification of [GitHub's main branch resource](https://api.github.com/repos/suhas-sunder/wordsearch/branches/main)
returned `protected: false`, `protection.enabled: false`, and no required status
checks at main `471a118dd459f2181cd641ed0572ba6dd7005540`. No repository administration
setting was changed. A push to main automatically deploys production, so written
release rules currently have no branch-protection enforcement.

Propose an owner-configured rule/ruleset targeting exactly `main`:

1. Require pull requests and at least one independent approving review. Dismiss
   stale approvals after code changes; require review of the most recent push
   and resolution of review conversations. Confirm a qualified second reviewer:
   an author cannot approve their own PR, and a chat review is not automatically
   a GitHub approving review.
2. Require passing checks from the designated CI integration, with the branch
   up to date: lint/typecheck/unit/content fingerprints, production static build
   and host audit, affected browser/print/PDF parity, and advertising regressions.
   Add named requirements only after corresponding PR workflows exist and emit
   those exact check names. Do not configure nonexistent checks or convert a
   known failing gate into a green check. Resolve or explicitly review baseline
   release findings before claiming the release gate has passed.
3. Block force pushes and deletion of main; apply protection to administrators
   and minimize bypass actors. Keep production merges limited to the authorized
   release operator. Consider CODEOWNERS review for generator/share, SEO/routing,
   and protected advertising paths once actual reviewers are assigned.
4. Keep automatic merging disabled and make each release a deliberate merge of
   the exact validated candidate. Record the resulting squash/merge SHA and
   Netlify deployment ID. Never run a duplicate manual deploy. Keep emergency
   rollback access documented rather than granting general bypass privileges.

This is a proposal, not a configured safeguard or an invented CI status. Required
PR/check behavior and review settings are described in [GitHub's protected-branch
documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches).
Designing/installing CI and changing repository administration require a separate
bounded task; this integration changes neither.
