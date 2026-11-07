import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { chromium, type Page } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { encodeShareState } from "@/lib/share-state/state";

declare global { interface Window { __soundProbe: { constructed: number; started: number; closed: number }; } }
const base = process.env.BASE_URL ?? "http://127.0.0.1:3279";
const output = process.env.SOLVER_SOUND_OUTPUT ?? join(tmpdir(), "ilws-solver-sound");
await mkdir(output, { recursive: true });
const request = { title: "Optional sound", wordsText: "CAT\nDOG\nBIRD", seed: "sound-only-new-word", autoSize: false, rows: 8, cols: 8, directions: ["E" as const], allowOverlap: false };
const puzzle = generatePuzzle(request);
const path = `/play/${encodeShareState(request)}`;
const report = { realApiCases: [] as unknown[], failureCases: [] as string[], limitations: "Chromium WebAudio lifecycle instrumentation with muted output, not physical hearing, loudness or device/audio-policy acceptance." };

async function select(page: Page, index: number) {
  // Begin/settings close restore focus on the next frame. Let that genuine
  // focus movement finish before starting this independent keyboard selection.
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => resolve())));
  const placement = puzzle.placed[index], first = placement.cells[0];
  await page.locator(`[data-solver-cell][data-row="${first.row}"][data-col="${first.col}"]`).focus();
  await page.keyboard.press("Enter");
  for (let step = 1; step < placement.cells.length; step++) await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
}

async function settings(page: Page, enabled: boolean) {
  await page.locator(".solver-actions").getByRole("button", { name: "Settings", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Puzzle settings", exact: true });
  await dialog.getByRole("checkbox", { name: "Sound when a word is found", exact: true }).setChecked(enabled);
  await dialog.getByRole("button", { name: "Done", exact: true }).click();
  await dialog.waitFor({ state: "hidden" });
}

const browser = await chromium.launch({ args: ["--mute-audio"] });
try {
  for (const width of [320, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: "reduce", colorScheme: width === 320 ? "dark" : "light" });
    await context.addInitScript(() => {
      window.__soundProbe = { constructed: 0, started: 0, closed: 0 };
      const Native = window.AudioContext;
      window.AudioContext = new Proxy(Native, {
        construct(Target, args) {
          const instance = Reflect.construct(Target, args) as AudioContext;
          window.__soundProbe.constructed++;
          const create = instance.createOscillator.bind(instance), close = instance.close.bind(instance);
          instance.createOscillator = () => {
            const oscillator = create(), start = oscillator.start.bind(oscillator);
            oscillator.start = (...args) => { window.__soundProbe.started++; start(...args); };
            return oscillator;
          };
          instance.close = () => { window.__soundProbe.closed++; return close(); };
          return instance;
        }
      });
    });
    const page = await context.newPage();
    const errors: string[] = [], mediaRequests: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("request", item => { if (item.resourceType() === "media" || /\.(wav|mp3|ogg)(\?|$)/.test(item.url())) mediaRequests.push(item.url()); });
    await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
    assert.deepEqual(errors, [], "native instrumentation must load without injected-script errors");
    await page.waitForFunction(() => !document.querySelector<HTMLInputElement>(".solver-save-progress input")?.disabled);
    await page.getByRole("checkbox", { name: "Remember progress on this device", exact: true }).check();
    await page.getByRole("button", { name: "Accessibility and controls", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "Puzzle settings", exact: true });
    assert.equal(await dialog.getByRole("checkbox", { name: "Sound when a word is found", exact: true }).isChecked(), false);
    await dialog.getByRole("checkbox", { name: "Sound when a word is found", exact: true }).scrollIntoViewIfNeeded();
    assert.deepEqual((await new AxeBuilder({ page }).include("dialog[open]").analyze()).violations, []);
    assert.equal(await dialog.evaluate(el => el.scrollWidth > el.clientWidth + 1), false);
    await page.screenshot({ path: join(output, `settings-${width}.png`) });
    await dialog.getByRole("button", { name: "Done", exact: true }).click();
    await page.getByRole("button", { name: "Begin puzzle", exact: true }).click();
    await select(page, 0);
    assert.deepEqual(await page.evaluate(() => window.__soundProbe), { constructed: 0, started: 0, closed: 0 }, "default mount/begin/success is silent without an audio context");
    await settings(page, true);
    assert.equal(await page.evaluate(() => window.__soundProbe.constructed), 0, "enabling alone must not play or open audio");
    await select(page, 0); // Already found.
    assert.equal(await page.evaluate(() => window.__soundProbe.started), 0);
    await page.locator(".solver-actions").getByRole("button", { name: "Show Answers", exact: true }).click();
    await page.getByRole("dialog", { name: "Show puzzle answers?", exact: true }).getByRole("button", { name: "Show answers", exact: true }).click();
    assert.equal(await page.evaluate(() => window.__soundProbe.started), 0, "revealing answers never emits a success cue");
    await page.locator(".solver-actions").getByRole("button", { name: "Hide Answers", exact: true }).click();
    await select(page, 1);
    try { await page.waitForFunction(() => window.__soundProbe.started === 1); }
    catch (error) {
      await writeFile(join(output, `first-cue-failure-${width}.json`), JSON.stringify({ probe: await page.evaluate(() => window.__soundProbe), progress: await page.getByTestId("solver-progress").textContent(), stored: await page.evaluate(() => localStorage.getItem("ilws:solver-preferences")), active: await page.evaluate(() => ({ tag: document.activeElement?.tagName, text: document.activeElement?.textContent, row: (document.activeElement as HTMLElement)?.dataset.row, col: (document.activeElement as HTMLElement)?.dataset.col })), errors }, null, 2));
      throw error;
    }
    await select(page, 1);
    assert.equal(await page.evaluate(() => window.__soundProbe.started), 1, "duplicate path stays silent");
    // A one-cell path is invalid for this fixture's three-letter/four-letter words.
    await page.locator('[data-solver-cell][data-row="0"][data-col="0"]').focus();
    await page.keyboard.press("Enter"); await page.keyboard.press("Enter");
    assert.equal(await page.evaluate(() => window.__soundProbe.started), 1, "invalid path stays silent");
    await select(page, 2);
    await page.waitForFunction(() => window.__soundProbe.started === 2);
    page.once("dialog", prompt => prompt.accept());
    await page.getByRole("button", { name: "Replay this puzzle", exact: true }).click();
    assert.equal(await page.evaluate(() => window.__soundProbe.started), 2, "replay never emits a cue");
    assert.equal(await page.evaluate(() => window.__soundProbe.closed), 1);
    await page.getByRole("button", { name: "Begin puzzle", exact: true }).click();
    assert.equal(await page.evaluate(() => window.__soundProbe.started), 2);
    await select(page, 0);
    await page.waitForFunction(() => window.__soundProbe.started === 3);
    await settings(page, false);
    assert.equal(await page.evaluate(() => window.__soundProbe.closed), 2, "opting out closes audio");
    await select(page, 1);
    assert.equal(await page.evaluate(() => window.__soundProbe.started), 3);
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("ilws:solver-preferences")!).soundOnFound), false);
    await settings(page, true);
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.evaluate(() => window.__soundProbe.constructed), 0, "persisted opt-in does not autoplay on load");
    await page.getByRole("button", { name: "Resume saved progress", exact: true }).click();
    assert.equal(await page.evaluate(() => window.__soundProbe.constructed), 0, "resuming found words never emits a cue");
    await select(page, 2);
    await page.waitForFunction(() => window.__soundProbe.started === 1);
    await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pagehide", { persisted: true })));
    assert.equal(await page.evaluate(() => window.__soundProbe.closed), 1);
    await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true })));
    assert.equal(await page.evaluate(() => window.__soundProbe.started), 1, "page restoration never emits a cue");
    page.once("dialog", prompt => prompt.accept());
    await page.getByRole("button", { name: "Replay this puzzle", exact: true }).click();
    await page.getByRole("button", { name: "Begin puzzle", exact: true }).click();
    await select(page, 0);
    await page.waitForFunction(() => window.__soundProbe.started === 2);
    await page.locator('.site-header a[href="/"]').first().click();
    await page.waitForURL(`${base}/`);
    assert.equal(await page.evaluate(() => window.__soundProbe.closed), 2, "client unmount closes audio");
    assert.deepEqual(errors, []); assert.deepEqual(mediaRequests, []);
    report.realApiCases.push({ width, reducedMotion: true, nativeApiInstrumentation: await page.evaluate(() => window.__soundProbe), noMediaRequests: true });
    await context.close();
  }

  for (const mode of ["unsupported", "constructor-denied", "resume-denied", "storage-blocked"] as const) {
    const context = await browser.newContext();
    await context.addInitScript(mode => {
      if (mode === "unsupported") Object.defineProperty(window, "AudioContext", { value: undefined });
      if (mode === "constructor-denied") window.AudioContext = new Proxy(window.AudioContext, { construct() { throw new Error("Audio denied"); } });
      if (mode === "resume-denied") {
        const Native = window.AudioContext;
        window.AudioContext = new Proxy(Native, { construct(Target, args) {
          const instance = Reflect.construct(Target, args) as AudioContext;
          Object.defineProperty(instance, "state", { get: () => "suspended" });
          instance.resume = () => Promise.reject(new DOMException("Audio policy", "NotAllowedError"));
          return instance;
        } });
      }
      if (mode === "storage-blocked") Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Storage blocked", "SecurityError"); } });
    }, mode);
    const page = await context.newPage(), errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Begin puzzle", exact: true }).click();
    await settings(page, true);
    await select(page, 0);
    await page.getByTestId("solver-progress").filter({ hasText: "1 of 3 words found" }).waitFor();
    assert.deepEqual(errors, [], `${mode}: solving must survive unavailable audio/storage`);
    await context.close(); report.failureCases.push(mode);
  }
  await writeFile(join(output, "report.json"), JSON.stringify(report, null, 2));
  console.log(`PASS ${report.realApiCases.length} real WebAudio lifecycle cases with muted output, default silence/opt-in/new-word-only/reset/reload/unmount and ${report.failureCases.length} blocked-API/storage cases. Physical audio not claimed.`);
} finally { await browser.close(); }
