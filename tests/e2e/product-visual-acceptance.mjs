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
const allRoutes = [
  ["home", "/"], ["search", "/search?q=food"],
  ["generator", "/word-search-generator"], ["puzzle", "/word-searches/animals/dog-word-search"],
  ["hard-hub", "/collections/hard-printable-word-searches"], ["collection", "/collections/easy-printable-word-searches"],
  ["category", "/categories/animals-word-searches"], ["guide", "/guides/how-to-print-a-word-search"],
  ["specialty", "/specialty/morse-code-word-search-generator"], ["classroom", "/pack-builder"],
  ["pdf-tool", `/pdf/${encoded}`], ["about", "/about"], ["privacy", "/privacy"],
  ["404", "/definitely-not-a-real-page"]
];
const caseNames = process.env.F1_CASE_NAMES?.split(",").filter(Boolean);
if (caseNames) for (const name of caseNames) assert.ok(allRoutes.some(([candidate]) => candidate === name), `Unknown F1 case ${name}`);
const routes = caseNames ? allRoutes.filter(([name]) => caseNames.includes(name)) : allRoutes;
const viewports = [
  ...[320, 390, 768, 1024, 1280, 1600].map((width) => ({ name: `${width}`, width, height: 1000, deviceScaleFactor: 1 })),
  { name: "landscape-844x390", width: 844, height: 390, deviceScaleFactor: 1 },
  // Equivalent reflow/pixel density for a 1280x900 viewport at 200%; native browser zoom remains manual acceptance.
  { name: "zoom-200-reflow", width: 640, height: 450, deviceScaleFactor: 2 }
];
const report = { sourceSha, sourcePatchSha256: process.env.F1_SOURCE_PATCH_SHA256 ?? null, base, caseNames: caseNames ?? null, generatedAt: new Date().toISOString(), userAgent: "", cases: [], limitations: ["Blocked advertising script; real-network lifecycle remains a separate gate", "Desktop Chromium emulation, not physical mobile/Safari", "200% equivalent reflow/pixel-density simulation, not native browser zoom signoff", "Screenshots require visual review; automated passes alone do not establish product acceptance"] };
const save = () => writeFile(`${output}/manifest.json`, `${JSON.stringify(report, null, 2)}\n`);
const browser = await chromium.launch({ headless: true });
try {
  for (const theme of ["light", "dark"]) {
    for (const viewport of viewports) {
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: viewport.deviceScaleFactor, colorScheme: theme, reducedMotion: "reduce" });
      await context.route("https://pagead2.googlesyndication.com/**", (route) => route.fulfill({ contentType: "application/javascript", body: "" }));
      for (const [name, path] of routes) {
        const page = await context.newPage();
        const row = { name, path, theme, viewport, screenshots: [], failures: [], notices: [], runtimeErrors: [] };
        page.on("pageerror", (error) => row.runtimeErrors.push(error.message));
        try {
          const response = await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
          row.httpStatus = response?.status();
          if (name === "pdf-tool") await page.locator('[data-utility-state="ready"]').waitFor();
          if (["generator", "puzzle", "specialty"].includes(name)) await page.locator(".builder-surface").waitFor();
          await page.evaluate(() => document.fonts.ready);
          report.userAgent ||= await page.evaluate(() => navigator.userAgent);
          const geometry = await page.evaluate(() => {
            const h = document.querySelector("header.site-header")?.getBoundingClientRect();
            return {
              overflow: document.documentElement.scrollWidth > innerWidth + 1,
              activeTheme: document.documentElement.dataset.theme,
              h1FontSize: document.querySelector("main h1") ? getComputedStyle(document.querySelector("main h1")).fontSize : null,
              maintainerLinkDisplay: document.querySelector(".site-footer p[class] a") ? getComputedStyle(document.querySelector(".site-footer p[class] a")).display : null,
              headerAdOverlap: !!h && [...document.querySelectorAll("[data-ad-placement]")].some((ad) => {
                const a = ad.getBoundingClientRect();
                return a.width && a.height && a.top < h.bottom - 1 && a.bottom > h.top + 1 && a.left < h.right && a.right > h.left;
              })
            };
          });
          row.geometry = geometry;
          if (geometry.overflow) row.failures.push("horizontal document overflow");
          if (geometry.activeTheme !== theme) row.failures.push(`effective theme ${geometry.activeTheme} differs from device ${theme}`);
          if (geometry.headerAdOverlap) row.failures.push("header intersects an advertisement wrapper");
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
        } catch (error) { row.failures.push(`inspection error: ${error.message}`); }
        report.cases.push(row);
        await save();
        console.log(`${row.failures.length ? "FAIL" : "PASS"} ${theme} ${viewport.name} ${name}: ${row.failures.length} failures, ${row.notices.length} notices`);
        await page.close();
      }
      await context.close();
    }
  }
} finally { await browser.close(); }
report.summary = { total: report.cases.length, failed: report.cases.filter((row) => row.failures.length).length, notices: report.cases.filter((row) => row.notices.length).length };
await save();
console.log(JSON.stringify(report.summary));
if (report.summary.failed) process.exitCode = 1;
