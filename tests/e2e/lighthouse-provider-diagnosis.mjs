import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve, relative, dirname, isAbsolute } from "node:path";
import { chromium } from "playwright";
import { launchAuditChrome } from "./audit-chrome.mjs";
import lighthouse from "lighthouse";
import { summarizeDiagnostic } from "./lighthouse-diagnostic-summary.mjs";

const base = new URL(process.env.BASE_URL ?? "http://127.0.0.1:3394");
if (!["127.0.0.1", "localhost"].includes(base.hostname) || base.protocol !== "http:" || base.username || base.password || base.pathname !== "/" || base.search || base.hash) throw new Error("Use an explicit local static-export origin only.");
const appSha = process.env.APP_SHA;
const reviewSha = process.env.REVIEW_SHA;
if (![appSha, reviewSha].every((sha) => /^[a-f0-9]{40}$/.test(sha ?? ""))) throw new Error("APP_SHA and REVIEW_SHA must identify the frozen export and review commit.");
if (!process.env.DIAGNOSTIC_OUTPUT) throw new Error("DIAGNOSTIC_OUTPUT must point outside the repository.");
const output = resolve(process.env.DIAGNOSTIC_OUTPUT);
const fromRepo = relative(process.cwd(), output);
if (!fromRepo.startsWith("..") && !isAbsolute(fromRepo)) throw new Error("Keep generated evidence outside the repository.");
const providerPattern = "*://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js*";
const plan = [
  { path: "/", mode: "enabled", repetition: 1 },
  { path: "/", mode: "enabled", repetition: 2 },
  { path: "/about", mode: "ad-free-control", repetition: 1 },
  { path: "/search", mode: "ad-free-control", repetition: 1 },
  { path: "/", mode: "provider-script-blocked-diagnostic-only", repetition: 1 }
];
const windowsChrome = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
const chromePath = process.env.CHROME_PATH ?? (existsSync(windowsChrome) ? windowsChrome : chromium.executablePath());
const report = { schemaVersion: 1, baseOrigin: base.origin, assertedProvenance: { appSha, reviewSha },
  provenanceLimit: "SHAs supplied by operator; per-route response hashes bind observed HTML, not automatic source attestation.",
  scope: "Five serial mobile laboratory samples; blocked mode is attribution only, never a release pass or field CWV.", runs: [] };
await mkdir(dirname(output), { recursive: true });
let chrome;
try {
  chrome = await launchAuditChrome({ chromePath, chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"], logLevel: "silent" });
  for (const sample of plan) {
    const response = await fetch(new URL(sample.path, base), { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`SSR status ${response.status} on ${sample.path}`);
    const html = await response.text();
    const ssrActiveAdUnits = (html.match(/<ins\b[^>]*class="adsbygoogle"/g) ?? []).length;
    if ((ssrActiveAdUnits > 0) !== (sample.mode !== "ad-free-control")) throw new Error(`Unexpected active-ad scope on ${sample.path}; inspect the frozen export before proceeding.`);
    const result = await lighthouse(new URL(sample.path, base).href, {
      port: chrome.port, output: "json", logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      formFactor: "mobile", throttlingMethod: "simulate", maxWaitForLoad: 45000,
      ...(sample.mode === "provider-script-blocked-diagnostic-only" ? { blockedUrlPatterns: [providerPattern] } : {})
    });
    const providerRequests = (result.lhr.audits["network-requests"]?.details?.items ?? [])
      .filter((item) => { try { const url = new URL(item.url); return url.hostname === "pagead2.googlesyndication.com" && url.pathname === "/pagead/js/adsbygoogle.js"; } catch { return false; } })
      .map((item) => ({ statusCode: item.statusCode ?? null, resourceType: item.resourceType ?? null }));
    const run = { ...sample, htmlSha256: createHash("sha256").update(html).digest("hex"), ssrActiveAdUnits, providerRequests, ...summarizeDiagnostic(result) };
    report.runs.push(run);
    await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
    console.log(JSON.stringify({ path: sample.path, mode: sample.mode, repetition: sample.repetition, scores: run.scores, failures: run.failedWeightedAuditIds["best-practices"] }));
    if (result.lhr.runtimeError) throw new Error("Lighthouse runtime error; partial sanitized evidence retained.");
  }
} finally {
  if (chrome) {
    try { console.log(`Audit browser cleanup: ${JSON.stringify(await chrome.close())}`); }
    catch (error) {
      console.error(`Audit browser graceful cleanup failed: ${error instanceof Error ? error.message : String(error)}`);
      process.exitCode = 1;
    }
  }
}
console.log("Diagnosis complete; this command does not replace or waive audit:lighthouse guardrails.");
