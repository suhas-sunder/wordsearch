# Explicit quick-share destinations

Owner issue 15; isolated branch `codex/accessible-share-destinations`, based on
candidate04 `203d2d83b9ef5ee9b9c4779b31effc888a934bc9` (including theme69).
No production release or editorial approval. Production reference remains
`471a118dd459f2181cd641ed0572ba6dd7005540`.

Inspection found native share, copy/manual recovery, and local QR already work.
Browsers without Web Share had no direct destination despite the owner's request
for quick social sharing. The existing share dialog now offers plain WhatsApp and
email links. The helper encodes one exact existing seeded play URL in the message;
there is no shortener, SDK, provider asset, automatic request, or sending action.
WhatsApp explicitly says new tab and uses noopener/noreferrer/no-referrer. Email
opens a draft in the configured handler. Destination links have text and decorative
Lucide icons, keyboard access, and a shared accessible privacy description.

The visible notice explains that opening a destination hands that service a link
containing the word list and settings; the link excludes solving progress. The
user still chooses whether to send the draft. Long encoded links can exceed an
external app's limits, so the existing copy/manual option remains available and
the notice does not promise provider delivery. Native share and its neutral
AbortError cancellation are unchanged. Private completion images remain a
separate action containing statistics only. No ad lifecycle, print settings,
published puzzle definition, content body, URL inventory, or metadata changes.

Formats checked against [WhatsApp Help Center](https://faq.whatsapp.com/5913398998672934)
(message-only `wa.me/?text=`) and [MDN email links](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Creating_links).

## Validation

- `npm run lint`, `npm run typecheck`, `git diff --check`: pass.
- `npx vitest run tests/unit/share-destinations.test.ts tests/unit/share-state.test.ts tests/seo/routes.test.ts tests/unit/direction-validation.test.ts`:
  27 tests pass, including unchanged150 published puzzle fingerprints.
- `npm test`: 450 tests in61 files pass (Node25.9.0).
- First `npm run build`:335 static pages pass, with the existing ESLint plugin
  detection warning. Static-host audit:217 sitemap pages,35 redirects,6 utility
  shells pass. First responsive browser run:16 cases pass with zero axe violations.
  Screenshot review shortened and moved the disclosure before destination choices.
- Final `npm run build` and `npm run audit:static-host` repeat pass335/217/35/6.
  Final `BASE_URL=http://127.0.0.1:3277 node tests/e2e/share-destinations.mjs`
  repeats all16 cases with zero axe violations; keyboard WhatsApp handoffs are
  intercepted/fulfilled locally, never sent to a provider. Native cancellation
  remains neutral; clipboard denial offers manual recovery. Actual provider and
  physical-device acceptance remain separate.
- Final16 screenshots and results are outside git in
  `C:/Users/Suhas/.codex/visualizations/2026/11/06/01a1b33a-7733-7163-8af2-24bcc8caa97a/share-destinations-final/`.
  Manually reviewed320 light,390 dark and short landscape samples. The earlier
  `share-destinations/` samples are the longer disclosure positioned after the
  links; they are superseded, not evidence of the final layout.

`tests/e2e/share-destinations.mjs` checks six required widths plus short landscape
and 200%-equivalent reflow, light/dark, exact message payloads, destination
privacy attributes, absent unsupported native control, clipboard denial/manual
recovery, focus/escape restoration, touch dimensions, dialog overflow, axe, no
provider request before click, and neutral canceled native sharing. It does not
send a real message or certify external accounts, delivery, or physical devices.
