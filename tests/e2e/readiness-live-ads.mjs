import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";
import { chromium } from "playwright";

// Opt-in real-network observations. No provider interception, consent override,
// geolocation spoofing, ad clicks or changes to the production account.
const output = process.env.LIVE_AD_OUTPUT;
const candidate = process.env.LIVE_AD_CANDIDATE;
assert.ok(output && (relative(process.cwd(), resolve(output)).startsWith("..") || isAbsolute(relative(process.cwd(), resolve(output)))), "Use outside-Git evidence");
assert.match(candidate ?? "", /^https:\/\/[a-f0-9]{24}--ilovewordsearch\.netlify\.app$/u);
await mkdir(output, { recursive: true });
const report = { startedAt: new Date().toISOString(), candidate, node: process.version, providerInterception: false, geographyOverride: false, cookieValuesRecorded: false, cases: [], findings: [], limitations: ["Provider-marked fill needs screenshot review to distinguish a visible creative from a blank frame.", "One natural network location cannot verify other regions or account-side CMP settings.", "Absence of a message is not proof of noncompliance or legal acceptance.", "This is an isolated Chromium software test, not physical mobile or native-browser acceptance."] };
const adHost = /googlesyndication|doubleclick|googleadservices|fundingchoices|googlefc/iu;
const safeUrl = (value) => { try { const url = new URL(value); return `${url.origin}${url.pathname}`; } catch { return "unparseable"; } };
const safeSignals = (value) => {
  const params = new URL(value).searchParams;
  const known = ["gdpr", "npa", "rdp", "tfcd", "tfua", "gpp_sid", "gcs", "gcd", "slotname"];
  return { ...Object.fromEntries(known.filter(key => params.has(key)).map(key => [key, params.get(key)])), ...Object.fromEntries(["gdpr_consent", "gpp", "us_privacy", "addtl_consent"].filter(key => params.has(key)).map(key => [key, { present: true, length: params.get(key).length }])) };
};
const persist = () => writeFile(resolve(output, "observations.json"), `${JSON.stringify(report, null, 2)}\n`);

async function observe(page, context, stage) {
  const dom = await page.evaluate(() => {
    const box = element => { const r = element.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; };
    const visible = element => { const style = getComputedStyle(element), r = element.getBoundingClientRect(); return !element.hidden && style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0 && r.width > 0 && r.height > 0; };
    const intersects = (a, b) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
    const placeholders = [...document.querySelectorAll("[data-ad-placeholder]")].map(element => ({ visible: visible(element), rect: box(element), hidden: element.hidden }));
    const units = [...document.querySelectorAll("ins.adsbygoogle")].map(element => ({ appUnit: element.hasAttribute("data-ilws-ad-unit"), slot: element.getAttribute("data-ad-slot"), status: element.getAttribute("data-ad-status"), requested: element.getAttribute("data-ilws-ad-requested"), visible: visible(element), rect: box(element), position: getComputedStyle(element).position, frames: element.querySelectorAll("iframe").length }));
    const frames = [...document.querySelectorAll("iframe")].filter(element => /google|doubleclick|ad_iframe|aswift|fundingchoice/iu.test(`${element.src} ${element.id} ${element.title}`)).map(element => {
      const r = box(element), x = Math.max(0, Math.min(innerWidth - 1, r.x + r.width / 2)), y = Math.max(0, Math.min(innerHeight - 1, r.y + r.height / 2));
      const inViewport = r.x >= 0 && r.y >= 0 && r.x < innerWidth && r.y < innerHeight;
      const top = inViewport ? document.elementFromPoint(x, y) : null;
      return { id: element.id, providerFillStatus: element.closest("ins.adsbygoogle")?.getAttribute("data-ad-status") ?? null, kind: /fundingchoices|googlefc/iu.test(`${element.src} ${element.id}`) ? "consent" : "advertising-or-provider", src: element.src ? new URL(element.src, location.href).origin + new URL(element.src, location.href).pathname : "", title: element.title, rect: r, visible: visible(element), inViewport, topElement: top ? `${top.tagName}.${top.className}`.slice(0, 150) : null, topIsFrame: top === element, overlapsVisiblePlaceholder: placeholders.some(p => p.visible && intersects(r, p.rect)) };
    });
    const controlOverlaps = [...document.querySelectorAll(".builder-surface button, .builder-surface input, .builder-surface textarea, .solver-grid button")].filter(element => visible(element)).flatMap(element => {
      const r = box(element); if (r.y < 0 || r.y >= innerHeight) return [];
      return frames.filter(frame => frame.kind !== "consent" && frame.visible && frame.inViewport && intersects(r, frame.rect)).map(frame => ({ control: element.getAttribute("aria-label") || element.textContent?.trim().slice(0, 60), frame: frame.id }));
    });
    return {
      url: location.origin + location.pathname,
      theme: document.documentElement.getAttribute("data-theme"), viewport: { width: innerWidth, height: innerHeight },
      scripts: [...document.scripts].filter(script => /adsbygoogle|fundingchoices|googlefc/iu.test(script.src)).map(script => new URL(script.src).origin + new URL(script.src).pathname),
      appPlacements: [...document.querySelectorAll("[data-ad-placement]")].map(element => element.getAttribute("data-ad-placement")),
      units, frames, placeholders, controlOverlaps,
      consentApis: { tcf: typeof window.__tcfapi, gpp: typeof window.__gpp, usp: typeof window.__uspapi, googlefc: typeof window.googlefc, gpc: navigator.globalPrivacyControl ?? null, dnt: navigator.doNotTrack },
      consentControls: [...document.querySelectorAll("button, a, [role=dialog]")].filter(element => visible(element) && /consent|do not sell|privacy choices|manage privacy|reject all|accept all/iu.test(element.textContent ?? "")).map(element => ({ role: element.getAttribute("role") || element.tagName, text: element.textContent.trim().slice(0, 180) })),
      localStorageKeys: Object.keys(localStorage), sessionStorageKeys: Object.keys(sessionStorage)
    };
  });
  const consentPing = await page.evaluate(async () => {
    const ping = (api, args) => new Promise(resolve => {
      const timer = setTimeout(() => resolve({ timedOut: true }), 1000);
      const callback = data => { clearTimeout(timer); resolve(Object.fromEntries(["cmpLoaded", "cmpStatus", "gdprApplies", "apiVersion", "gppVersion", "signalStatus", "displayStatus", "applicableSections"].filter(key => data && key in data).map(key => [key, data[key]]))); };
      try { api(...args(callback)); } catch { clearTimeout(timer); resolve({ threw: true }); }
    });
    return { tcf: typeof window.__tcfapi === "function" ? await ping(window.__tcfapi, cb => ["ping", 2, cb]) : null, gpp: typeof window.__gpp === "function" ? await ping(window.__gpp, cb => ["ping", cb]) : null };
  });
  const cookies = (await context.cookies()).map(({ name, domain, path, secure, httpOnly, sameSite }) => ({ name, domain, path, secure, httpOnly, sameSite }));
  return { stage, at: new Date().toISOString(), ...dom, consentPing, cookies };
}

const draftSource = await readFile("tests/fixtures/editorial-ad-routes.ts", "utf8");
const drafts = [...draftSource.split("export const publishedEditorialExamples")[0].matchAll(/"(\/(?:categories|collections|guides)\/[^"]+)"/gu)].map(match => match[1]);
assert.equal(drafts.length, 12);
const published = ["/", "/word-searches/history/ancient-egypt-word-search", "/categories/animals-word-searches", "/collections/hard-printable-word-searches", "/guides/how-to-print-a-word-search", "/word-search-generator"];
const utility = `/play/${Buffer.from(JSON.stringify({ title: "Live ad boundary", wordsText: "CAT\nDOG\nBIRD", seed: "readiness-ads", rows: 8, cols: 8, autoSize: false, directions: ["E"] })).toString("base64url")}`;
const cases = [
  ...published.map(path => ({ path, eligible: true, origin: candidate })),
  ...drafts.map(path => ({ path, eligible: false, origin: candidate })),
  ...["/privacy", "/search", utility].map(path => ({ path, eligible: false, origin: candidate })),
  ...published.map(path => ({ path, eligible: true, origin: "https://www.ilovewordsearch.com" })),
  { path: utility, eligible: false, origin: "https://www.ilovewordsearch.com" }
];
const browser = await chromium.launch();
report.browser = browser.version();
try {
  for (const viewport of [{ width: 390, height: 844, theme: "light" }, { width: 1600, height: 1000, theme: "dark" }]) {
    for (const fixture of cases) {
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, colorScheme: viewport.theme });
      const page = await context.newPage();
      const row = { ...fixture, viewport, unavailableInteractions: [], requests: [], hostingRequests: [], failures: [], snapshots: [], errors: [] };
      const requests = new Map();
      report.cases.push(row);
      const started = Date.now();
      page.on("request", request => {
        if (/cloudflareinsights|\/cdn-cgi\/rum/iu.test(request.url())) {
          const body = request.postData() ?? "";
          row.hostingRequests.push({ url: safeUrl(request.url()), method: request.method(), payloadContainsSyntheticSharePath: fixture.path.startsWith("/play/") && body.includes(fixture.path), payloadBytes: body.length });
        }
      });
      page.on("request", request => { if (adHost.test(new URL(request.url()).hostname)) { const observed = { atMs: Date.now() - started, documentPath: new URL(page.url()).pathname, url: safeUrl(request.url()), type: request.resourceType(), signals: safeSignals(request.url()) }; row.requests.push(observed); requests.set(request, observed); } });
      page.on("response", response => { const observed = requests.get(response.request()); if (observed) observed.httpStatus = response.status(); });
      page.on("requestfailed", request => { if (adHost.test(new URL(request.url()).hostname)) row.failures.push({ url: safeUrl(request.url()), error: request.failure()?.errorText }); });
      page.on("pageerror", error => row.errors.push(error.message.slice(0, 300)));
      try {
        row.httpStatus = (await page.goto(`${fixture.origin}${fixture.path}`, { waitUntil: "domcontentloaded", timeout: 45000 }))?.status();
        await page.locator("main").first().waitFor({ timeout: 20000 });
        await page.waitForTimeout(fixture.eligible ? 3000 : 2000);
        row.snapshots.push(await observe(page, context, "initial"));
        if (fixture.eligible) {
          await page.waitForTimeout(12000);
          row.snapshots.push(await observe(page, context, "settled"));
          const shot = `${String(report.cases.length).padStart(2, "0")}-${viewport.width}.png`;
          await page.screenshot({ path: resolve(output, shot), fullPage: true }); row.screenshot = shot;
          if (fixture.path === "/") {
            const theme = page.getByRole("button", { name: /^Theme:/u });
            if (await theme.count()) {
              await theme.click();
              await page.waitForTimeout(1000);
              row.snapshots.push(await observe(page, context, "theme-change"));
            } else row.unavailableInteractions.push("This source does not expose the candidate theme control.");
            await page.setViewportSize({ width: viewport.width === 390 ? 844 : 1280, height: viewport.width === 390 ? 390 : 900 });
            await page.waitForTimeout(2000);
            row.snapshots.push(await observe(page, context, "resized"));
            const prior = row.requests.length;
            const sourceTimeOrigin = await page.evaluate(() => performance.timeOrigin);
            await page.locator('footer a[href="/privacy"]').click();
            await page.waitForURL(`${fixture.origin}/privacy`);
            await page.waitForTimeout(10000);
            row.navigation = { destination: "/privacy", sourceTimeOrigin, destinationTimeOrigin: await page.evaluate(() => performance.timeOrigin), providerRequestsAfterClick: row.requests.slice(prior) };
            row.snapshots.push(await observe(page, context, "privacy-after-click"));
            const navShot = `${String(report.cases.length).padStart(2, "0")}-${viewport.width}-privacy.png`;
            await page.screenshot({ path: resolve(output, navShot), fullPage: true }); row.navigation.screenshot = navShot;
          }
          if (fixture.path === "/word-searches/history/ancient-egypt-word-search") {
            await page.locator(".builder-surface").scrollIntoViewIfNeeded();
            row.snapshots.push(await observe(page, context, "puzzle-controls"));
            await page.emulateMedia({ media: "print" });
            row.snapshots.push(await observe(page, context, "print-media"));
            await page.emulateMedia({ media: "screen" });
          }
        }
        for (const snapshot of row.snapshots) {
          if (snapshot.frames.some(frame => frame.visible && frame.overlapsVisiblePlaceholder && !["unfilled", "unfill-optimized"].includes(frame.providerFillStatus))) report.findings.push({ path: fixture.path, width: viewport.width, stage: snapshot.stage, kind: "visible-placeholder-frame-overlap" });
          if (snapshot.controlOverlaps.length) report.findings.push({ path: fixture.path, width: viewport.width, stage: snapshot.stage, kind: "ad-frame-control-overlap", details: snapshot.controlOverlaps });
          if (snapshot.units.some(unit => unit.status === "filled") && snapshot.placeholders.some(placeholder => placeholder.visible)) report.findings.push({ path: fixture.path, width: viewport.width, stage: snapshot.stage, kind: "visible-placeholder-after-provider-fill" });
        }
        if (!fixture.eligible && (row.requests.length || row.snapshots[0].appPlacements.length || row.snapshots[0].units.length)) report.findings.push({ path: fixture.path, width: viewport.width, kind: "direct-ad-free-boundary", providerRequests: row.requests.length });
      } catch (error) { row.executionError = error instanceof Error ? error.message : String(error); }
      finally { await context.close(); await persist(); }
      console.log(`${report.cases.length}/${cases.length * 2}: ${fixture.origin === candidate ? "candidate" : "production"} ${viewport.width} ${fixture.path} requests=${row.requests.length} executionError=${Boolean(row.executionError)}`);
    }
  }
} finally { await browser.close(); }
report.completedAt = new Date().toISOString();
report.executionComplete = report.cases.every(row => !row.executionError);
report.releaseApproval = false;
await persist();
console.log(JSON.stringify({ cases: report.cases.length, findings: report.findings.length, executionComplete: report.executionComplete, releaseApproval: false }));
if (!report.executionComplete || report.findings.length) process.exitCode = 1;
