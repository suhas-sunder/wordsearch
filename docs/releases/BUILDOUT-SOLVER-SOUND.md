# U15: optional local word-found cue

Isolated branch `codex/optional-solver-sound`, based on candidate04 `afe8b50`.
The catalog's optional feedback row is implemented within the existing hydrated
solver. This is review work, with no production or editorial approval.

Inspection found visual selection/found feedback and live announcements, but no
audio. The existing local solver preferences now include `soundOnFound`, default
false. Only a saved literal boolean true restores opt-in; old/absent/corrupt
values remain off. The settings dialog has a labeled checkbox, **Sound when a
word is found**, with a concise description of browser/device silence limits.
Blocked storage still permits a session-only choice. Privacy storage wording
now includes sound preferences.

The one call site is after matching an unfound placement and adding its id. It
does not run on mount, enabling the checkbox, starting, restored progress,
revealing answers, duplicate/invalid selections, replay or navigation. Existing
visual and reduced-motion CSS and live announcements are unchanged; sound is
supplemental and never substitutes for readable progress or non-color feedback.

The helper opens WebAudio lazily on the next successful word only. One short
660Hz sine oscillator has a quiet numeric gain envelope (peak 0.025, eight-ms
attack, 90ms stop). No sample, SDK, network, microphone or recording is involved.
Repeated cues stop/disconnect the previous nodes. Normal completion disconnects
the nodes; opting out, replay, hiding/leaving the page and unmount close the
context. Generation checks suppress delayed resume after cancellation/disposal.
Unsupported constructors, rejected resume, interrupted contexts and cleanup
failure remain silent without interfering with solving or adding an intrusive
error. A later real word interaction can retry audio.

## Validation

- Lint and TypeScript pass; full unit suite 475 tests in 66 files passes.
- Five focused tests cover strict default-off normalization, lazy construction,
  the short envelope, node/context cleanup, delayed-resume cancellation and
  unavailable/blocked APIs.
- Production build passes 335 pages; the existing ESLint plugin-detection warning
  remains. Static-host audit passes 217 sitemap pages, 35 redirects, six utility
  shells.
- `BASE_URL=http://127.0.0.1:3279 npx tsx tests/e2e/solver-sound.ts`: two real
  Chromium WebAudio lifecycle cases (320 dark/1280 light, reduced motion) pass
  with muted output. Native constructor/oscillator/close calls are observed through
  a Proxy; actual native methods run. Mount, default success, enabling, duplicates,
  invalid paths, reveal, replay, begin, reload, saved-progress resume and page
  restoration do not add cues. New opt-in words do. Opt-out, replay, pagehide and
  client unmount close contexts. Preference persistence, no media requests, zero
  settings-dialog axe violations and no horizontal overflow pass.
- Four separately injected unsupported-constructor/resume/storage cases retain
  correct solving progress and produce no page errors. These failure simulations
  are not physical audio-policy acceptance.
- Existing `tests/e2e/solver-progress.ts` passes opt-in local-only progress,
  resume, seed isolation, replay, keyboard/touch, denied storage and quota.
- Final screenshots and report are outside git in
  `C:/Users/Suhas/.codex/visualizations/2026/11/06/01a1b33a-7733-7163-8af2-24bcc8caa97a/solver-sound-final-evidence/`.
  The mobile control was scrolled into view and manually reviewed. This is not
  a claim of physical sound, loudness or support across browsers/devices.

Earlier failed harness runs remain in `solver-sound/`, `solver-sound-final/`
and `solver-sound-diagnosis/`. The first selection raced the existing next-frame
settings focus restoration; the fixture now waits that real focus movement before
placing a keyboard path. Then tsx's serialized subclass referred to an unavailable
`__name` compiler helper, so instrumentation never installed. A native-constructor
Proxy fixes that harness problem. Product assertions and thresholds are intact;
no application change was needed for either issue. Full final reruns pass.

The puzzle generator, grid, placement/answer fingerprints, share definitions,
completion image privacy, advertising and indexable editorial bodies are intact.
An individual can turn the preference off in Puzzle settings or clear site
storage. Physical audio/device acceptance remains separate from this evidence.
