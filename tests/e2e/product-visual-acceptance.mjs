import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve, relative, isAbsolute } from "node:path";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.BASE_URL ?? "http://127.0.0.1:3394";
const sourceSha = process.env.F1_SOURCE_SHA;
const output = process.env.F1_VISUAL_OUTPUT;
assert.ok(sourceSha && /^[a-f0-9]{40}$/.test(sourceSha), "F1_SOURCE_SHA must identify the frozen application export");
assert.ok(output, "F1_VISUAL_OUTPUT must identify an outside-repository evidence directory");
const outputRelative = relative(process.cwd(), resolve(output));
assert.ok(outputRelative.startsWith("..") || isAbsolute(outputRelative), "Keep visual evidence outside the repository");
await mkdir(output, { recursive: true });

const encoded = Buffer.from(JSON.stringify({ title: "F1 print acceptance", wordsText: "CAT\nDOG", seed: "f1-print-acceptance", alphabetPack: "latin", directions: ["E"], rows: 8, cols: 8, autoSize: false })).toString("base64url");
const clueWords = "CAT | A small, purring pet | feline\nPLANET | A world orbiting a star\nOX | A working animal";
const clueState = Buffer.from(JSON.stringify({ title: "F1 clue worksheet", wordsText: clueWords, seed: "f1-clue-visual", rows: 10, cols: 10, autoSize: false, directions: ["E"], wordBankMode: "clues", wordBankOrder: "input" })).toString("base64url");
const allRoutes = [
  ["home", "/"], ["search", "/search?q=food"],
  ["generator", "/word-search-generator"], ["puzzle", "/word-searches/animals/dog-word-search"],
  ["hard-hub", "/collections/hard-printable-word-searches"], ["collection", "/collections/easy-printable-word-searches"],
  ["category", "/categories/animals-word-searches"], ["guide", "/guides/how-to-print-a-word-search"],
  ["specialty", "/specialty/morse-code-word-search-generator"], ["classroom", "/pack-builder"],
  ["pdf-tool", `/pdf/${encoded}`], ["about", "/about"], ["privacy", "/privacy"],
  ["404", "/definitely-not-a-real-page"],
  ["teacher-hub", "/word-searches-for-teachers"], ["worksheet-hub", "/word-search-worksheets"],
  ["print-tool", `/print/${encoded}?answers=1&qr=0`], ["answer-tool", `/answer-key/${encoded}?qr=0`],
  ["play-tool", `/play/${encoded}`], ["invalid-utility", "/print/invalid-state"],
  ["saved-library", `/word-search-generator?state=${encoded}`],
  ["clue-ready", `/word-search-generator?state=${clueState}`],
  ["clue-invalid", `/word-search-generator?state=${clueState}`],
  ["grid-export-status", `/word-search-generator?state=${encoded}`],
  ["grid-export-error", `/word-search-generator?state=${encoded}`],
  ["measured-pdf-dialog", `/word-search-generator?state=${encoded}`],
  ["solver-settings", `/play/${encoded}`]
];
const caseNames = process.env.F1_CASE_NAMES?.split(",").filter(Boolean);
if (caseNames) for (const name of caseNames) assert.ok(allRoutes.some(([candidate]) => candidate === name), `Unknown F1 case ${name}`);
const routes = caseNames ? allRoutes.filter(([name]) => caseNames.includes(name)) : allRoutes;
assert.ok(routes.length, "F1 case selection must not be empty");
const allViewports = [
  ...[320, 390, 768, 1024, 1280, 1600].map((width) => ({ name: `${width}`, width, height: 1000, deviceScaleFactor: 1 })),
  { name: "landscape-844x390", width: 844, height: 390, deviceScaleFactor: 1 },
  // Equivalent reflow/pixel density for a 1280x900 viewport at 200%; native browser zoom remains manual acceptance.
  { name: "zoom-200-reflow", width: 640, height: 450, deviceScaleFactor: 2 }
];
const viewportNames = process.env.F1_VIEWPORT_NAMES?.split(",").filter(Boolean);
if (viewportNames) for (const name of viewportNames) assert.ok(allViewports.some((viewport) => viewport.name === name), `Unknown F1 viewport ${name}`);
const viewports = viewportNames ? allViewports.filter(({ name }) => viewportNames.includes(name)) : allViewports;
assert.ok(viewports.length, "F1 viewport selection must not be empty");
const report = { sourceSha, sourcePatchSha256: process.env.F1_SOURCE_PATCH_SHA256 ?? null, base, caseNames: caseNames ?? null, viewportNames: viewportNames ?? null, generatedAt: new Date().toISOString(), userAgent: "", cases: [], limitations: ["Blocked advertising script; real-network lifecycle remains a separate gate", "Desktop Chromium emulation, not physical mobile/Safari", "200% equivalent reflow/pixel-density simulation, not native browser zoom signoff", "Muted Chromium audio instrumentation does not certify physical hearing or audio-device policy", "Screenshots require visual review; automated passes alone do not establish product acceptance"] };
report.nodeVersion = process.version;
const save = () => writeFile(`${output}/manifest.json`, `${JSON.stringify(report, null, 2)}\n`);
const browser = await chromium.launch({ headless: true, args: ["--mute-audio"] });
try {
  for (const theme of ["light", "dark"]) {
    for (const viewport of viewports) {
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: viewport.deviceScaleFactor, colorScheme: theme, reducedMotion: "reduce", acceptDownloads: true });
      await context.route("https://pagead2.googlesyndication.com/**", (route) => route.fulfill({ contentType: "application/javascript", body: "" }));
      for (const [name, path] of routes) {
        const page = await context.newPage();
        const row = { name, path, theme, viewport, screenshots: [], failures: [], notices: [], runtimeErrors: [] };
        page.on("pageerror", (error) => row.runtimeErrors.push(error.message));
        if (name === "solver-settings") { row.audioMediaRequests = 0; page.on("request", (request) => { if (request.resourceType() === "media") row.audioMediaRequests++; }); }
        try {
          if (name === "grid-export-error") await page.addInitScript(() => { HTMLCanvasElement.prototype.toBlob = function (callback) { callback(null); }; });
          if (name === "solver-settings") await page.addInitScript(() => {
            window.__f1AudioProbe = { constructed: 0, started: 0, available: typeof AudioContext === "function" };
            const Native = window.AudioContext;
            if (Native) window.AudioContext = new Proxy(Native, { construct(Target, args) {
              window.__f1AudioProbe.constructed++;
              const audio = Reflect.construct(Target, args), create = audio.createOscillator.bind(audio);
              audio.createOscillator = () => { const oscillator = create(), start = oscillator.start.bind(oscillator); oscillator.start = (...values) => { window.__f1AudioProbe.started++; start(...values); }; return oscillator; };
              return audio;
            } });
          });
          const response = await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
          row.httpStatus = response?.status();
          if (["pdf-tool", "print-tool", "answer-tool", "play-tool", "solver-settings"].includes(name)) await page.locator('[data-utility-state="ready"]').waitFor();
          if (name === "invalid-utility") {
            await page.locator('[data-utility-state="invalid"]').waitFor();
            assert.equal(await page.locator(".puzzle-svg").count(), 0);
          }
          if (["generator", "puzzle", "specialty", "saved-library", "clue-ready", "clue-invalid", "grid-export-status", "grid-export-error", "measured-pdf-dialog"].includes(name)) await page.locator(".builder-surface").waitFor();
          if (name === "saved-library") {
            await page.getByText("Saved puzzles on this device", { exact: true }).click();
            const savedName = "Classroom vocabulary with a longer saved name for responsive review";
            await page.getByRole("textbox", { name: "Saved puzzle name", exact: true }).fill(savedName);
            await page.getByRole("button", { name: "Save puzzle on this device", exact: true }).click();
            await page.getByText("Puzzle saved on this device.", { exact: true }).waitFor();
            assert.equal(await page.getByRole("button", { name: `Open saved puzzle ${savedName}`, exact: true }).count(), 1);
          }
          if (["clue-ready", "clue-invalid"].includes(name)) {
            await page.locator(".builder-preview .print-clue-bank span").first().waitFor();
            await page.getByText("Advanced print and fill controls", { exact: true }).click();
            if (name === "clue-invalid") {
              await page.getByRole("textbox", { name: "Words and clues", exact: true }).fill("CAT |\nPLANET | A world orbiting a star\nOX | A working animal");
              await page.locator(".builder-preview [role=alert]").waitFor();
              assert.equal(await page.locator(".builder-preview .export-row button").count(), 0);
            }
          }
          if (name === "grid-export-status") {
            for (const [button, message] of [["SVG grid", "SVG grid downloaded."], ["PNG grid", "PNG grid downloaded."], ["Grid text", "TXT grid downloaded."]]) {
              const download = page.waitForEvent("download");
              await page.getByRole("button", { name: button, exact: true }).click();
              assert.ok((await download).suggestedFilename());
              await page.getByRole("status").filter({ hasText: message }).waitFor();
            }
          }
          if (name === "grid-export-error") {
            const tokens = await page.locator(".builder-preview .puzzle-token").allTextContents();
            await page.getByRole("button", { name: "PNG grid", exact: true }).click();
            await page.getByRole("status").filter({ hasText: "PNG export failed" }).waitFor();
            assert.deepEqual(await page.locator(".builder-preview .puzzle-token").allTextContents(), tokens);
          }
          if (name === "measured-pdf-dialog") {
            await page.getByRole("button", { name: "Download PDF", exact: true }).first().click();
            await page.getByRole("dialog").getByRole("button", { name: "Download measured large-print PDF", exact: true }).waitFor();
            assert.match(await page.locator("#measured-pdf-description").textContent(), /16-point.*18-point/);
          }
          if (name === "solver-settings") {
            const settings = page.locator(".solver-actions").getByRole("button", { name: "Settings", exact: true });
            await settings.click();
            const dialog = page.getByRole("dialog", { name: "Puzzle settings", exact: true });
            const sound = dialog.getByRole("checkbox", { name: "Sound when a word is found", exact: true });
            assert.equal(await sound.isChecked(), false, "sound defaults off");
            await sound.check(); await sound.uncheck();
            row.audioProbe = await page.evaluate(() => window.__f1AudioProbe);
            assert.equal(row.audioProbe.constructed, 0, "toggling alone creates no audio context");
            assert.equal(row.audioProbe.started, 0, "toggling without solving is silent");
            assert.equal(row.audioMediaRequests, 0);
            await dialog.getByRole("button", { name: "Done", exact: true }).click();
            await dialog.waitFor({ state: "hidden" });
            await page.waitForFunction(() => document.activeElement?.matches(".solver-actions button") && document.activeElement.textContent.trim() === "Settings");
            await settings.click();
            assert.equal(await sound.isChecked(), false);
            await sound.scrollIntoViewIfNeeded();
            await page.locator("#solver-sound-help").scrollIntoViewIfNeeded();
            assert.equal(await page.locator("#solver-sound-help").isVisible(), true);
            row.soundHelpWithinViewport = await page.locator("#solver-sound-help").evaluate((element) => { const box = element.getBoundingClientRect(); return box.top >= 0 && box.bottom <= innerHeight; });
            assert.equal(row.soundHelpWithinViewport, true);
            row.settingsFocusReturn = true;
          }
          if (name !== "clue-invalid") await page.waitForFunction(() => [...document.querySelectorAll(".print-fit-status")].every((node) => node.dataset.fitState === "ready"));
          await page.evaluate(() => document.fonts.ready);
          report.userAgent ||= await page.evaluate(() => navigator.userAgent);
          const geometry = await page.evaluate(() => {
            const h = document.querySelector("header.site-header")?.getBoundingClientRect();
            // Form help uses a negative top margin inside a gap layout. Export help
            // is ordinary document flow: compare rendered text, not only containers.
            const help = [...document.querySelectorAll(".builder-preview > .export-row > span, .builder-preview > p.control-help, .builder-preview > [role='status'] > p.control-help")]
              .filter((element) => element.textContent.trim() && element.getClientRects().length)
              .map((element, index) => {
                const range = document.createRange();
                range.selectNodeContents(element);
                return { index, boxes: [...range.getClientRects()].filter((box) => box.width && box.height) };
              });
            const helpTextOverlaps = [];
            for (let i = 0; i < help.length; i++) for (let j = i + 1; j < help.length; j++) {
              if (help[i].boxes.some((a) => help[j].boxes.some((b) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 0.5 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 0.5))) helpTextOverlaps.push([help[i].index, help[j].index]);
            }
            return {
              helpTextOverlaps,
              solverStartTitleColors: document.querySelector("#solver-start-title") ? {
                foreground: getComputedStyle(document.querySelector("#solver-start-title")).color,
                background: getComputedStyle(document.querySelector(".solver-start-overlay > div")).backgroundColor
              } : null,
              overflow: document.documentElement.scrollWidth > innerWidth + 1,
              activeTheme: document.documentElement.dataset.theme,
              h1FontSize: document.querySelector("main h1") ? getComputedStyle(document.querySelector("main h1")).fontSize : null,
              maintainerLinkDisplay: document.querySelector(".site-footer p[class] a") ? getComputedStyle(document.querySelector(".site-footer p[class] a")).display : null,
              headerAdOverlap: !!h && [...document.querySelectorAll("[data-ad-placement]")].some((ad) => {
                const a = ad.getBoundingClientRect();
                return a.width && a.height && a.top < h.bottom - 1 && a.bottom > h.top + 1 && a.left < h.right && a.right > h.left;
              }),
              dialogOverflow: [...document.querySelectorAll("dialog[open],dialog[open] .solver-dialog-panel")].some((element) => element.scrollWidth > element.clientWidth + 1)
            };
          });
          row.geometry = geometry;
          if (geometry.overflow) row.failures.push("horizontal document overflow");
          if (geometry.activeTheme !== theme) row.failures.push(`effective theme ${geometry.activeTheme} differs from device ${theme}`);
          if (geometry.headerAdOverlap) row.failures.push("header intersects an advertisement wrapper");
          if (geometry.dialogOverflow) row.failures.push("open dialog has horizontal overflow");
          if (geometry.helpTextOverlaps.length) row.failures.push(`export helper text overlaps: ${JSON.stringify(geometry.helpTextOverlaps)}`);
          const axe = await new AxeBuilder({ page }).analyze();
          row.axe = axe.violations.map((issue) => ({ id: issue.id, impact: issue.impact, targets: issue.nodes.map((node) => node.target) }));
          for (const issue of row.axe) {
            const text = `${issue.id}: ${JSON.stringify(issue.targets)}`;
            if (["serious", "critical"].includes(issue.impact)) row.failures.push(text);
            else row.notices.push(text);
          }
          const stem = `${theme}-${viewport.name}-${name}`;
          row.scrollBeforeScreenshot = await page.evaluate(() => { const previous = scrollY; window.scrollTo({ top: 0, left: 0, behavior: "instant" }); return previous; });
          await page.screenshot({ path: `${output}/${stem}.png` });
          row.screenshots.push(`${stem}.png`);
          if (["390", "1280"].includes(viewport.name)) {
            await page.screenshot({ path: `${output}/${stem}-full.png`, fullPage: true });
            row.screenshots.push(`${stem}-full.png`);
            const focus = name === "saved-library" ? ".local-puzzle-library" : name.startsWith("clue-") || name.startsWith("grid-export-") ? ".builder-preview" : null;
            if (focus) {
              await page.locator(focus).screenshot({ path: `${output}/${stem}-detail.png` });
              row.screenshots.push(`${stem}-detail.png`);
            }
          }
          if (name === "clue-invalid") {
            await page.getByRole("textbox", { name: "Words and clues", exact: true }).fill(clueWords);
            await page.waitForFunction(() => document.querySelectorAll(".builder-preview .print-clue-bank span").length === 3 && [...document.querySelectorAll(".print-fit-status")].every((node) => node.dataset.fitState === "ready"));
            const recovered = await new AxeBuilder({ page }).include(".builder-surface").analyze();
            for (const issue of recovered.violations.filter(({ impact }) => ["serious", "critical"].includes(impact))) row.failures.push(`clue recovery ${issue.id}`);
            row.clueRecovery = "ready bank and serious/critical axe checked";
            if (["390", "1280"].includes(viewport.name)) {
              await page.locator(".builder-preview").screenshot({ path: `${output}/${stem}-recovered.png` });
              row.screenshots.push(`${stem}-recovered.png`);
            }
          }
          if (name === "home") {
            await page.locator('summary[aria-label="Open navigation menu"]').focus();
            await page.keyboard.press("Enter");
            await page.getByRole("navigation", { name: "All site navigation" }).waitFor();
            const menuAxe = await new AxeBuilder({ page }).include("header").analyze();
            for (const issue of menuAxe.violations.filter((issue) => ["serious", "critical"].includes(issue.impact))) row.failures.push(`open menu ${issue.id}`);
            await page.screenshot({ path: `${output}/${stem}-menu.png` });
            row.screenshots.push(`${stem}-menu.png`);
            await page.keyboard.press("Escape");
          }
          if (name === "generator") {
            await page.emulateMedia({ media: "print" });
            row.print = await page.evaluate(() => ({ scheme: getComputedStyle(document.documentElement).colorScheme, paper: getComputedStyle(document.querySelector(".print-sheet")).backgroundColor, header: getComputedStyle(document.querySelector("header.site-header")).display }));
            if (row.print.scheme !== "light" || row.print.paper !== "rgb(255, 255, 255)" || row.print.header !== "none") row.failures.push(`unexpected print palette/chrome ${JSON.stringify(row.print)}`);
          }
          if (row.runtimeErrors.length) row.failures.push(...row.runtimeErrors.map((error) => `runtime: ${error}`));
        } catch (error) {
          row.failures.push(`inspection error: ${error.message}`);
          try {
            const file = `${theme}-${viewport.name}-${name}-inspection-error.png`;
            await page.screenshot({ path: `${output}/${file}`, fullPage: true });
            row.screenshots.push(file);
          } catch { row.notices.push("Failure screenshot unavailable after page error."); }
        }
        report.cases.push(row);
        await save();
        console.log(`${row.failures.length ? "FAIL" : "PASS"} ${theme} ${viewport.name} ${name}: ${row.failures.length} failures, ${row.notices.length} notices`);
        await page.close();
      }
      await context.close();
    }
  }
} finally { await browser.close(); }
report.summary = { total: report.cases.length, expected: routes.length * viewports.length * 2, fullMatrix: !caseNames && !viewportNames, failed: report.cases.filter((row) => row.failures.length).length, notices: report.cases.filter((row) => row.notices.length).length };
await save();
console.log(JSON.stringify(report.summary));
if (report.summary.failed) process.exitCode = 1;
