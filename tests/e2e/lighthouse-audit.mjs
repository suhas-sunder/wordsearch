import { existsSync } from "node:fs";
import { chromium } from "playwright";
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";
import { screenEmulationMetrics, throttling, userAgents } from "lighthouse/core/config/constants.js";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const routes = [
  { name: "Home", path: "/", editorial: true },
  { name: "Generator", path: "/word-search-generator", editorial: false },
  { name: "Easy puzzle", path: "/word-searches/animals/dog-word-search", editorial: false },
  { name: "Hard puzzle", path: "/word-searches/history/ancient-egypt-word-search", editorial: false },
  { name: "Category", path: "/categories/animals-word-searches", editorial: true },
  { name: "Collection", path: "/collections/easy-printable-word-searches", editorial: true },
  { name: "Guide", path: "/guides/how-to-print-a-word-search", editorial: true },
  { name: "Topics", path: "/topics", editorial: true }
];

const commonWindowsChrome = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
const chromePath = process.env.CHROME_PATH
  ?? (process.platform === "win32" && existsSync(commonWindowsChrome) ? commonWindowsChrome : chromium.executablePath());
const chrome = await launch({
  chromePath,
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
  logLevel: "silent"
});

function rounded(value, digits = 0) {
  return Number.isFinite(value) ? Number(value.toFixed(digits)) : null;
}

async function runAudit(route, formFactor = "mobile") {
  const result = await lighthouse(`${baseUrl}${route.path}`, {
    port: chrome.port,
    output: "json",
    logLevel: "error",
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    formFactor,
    screenEmulation: formFactor === "desktop" ? screenEmulationMetrics.desktop : screenEmulationMetrics.mobile,
    emulatedUserAgent: formFactor === "desktop" ? userAgents.desktop : userAgents.mobile,
    throttling: formFactor === "desktop" ? throttling.desktopDense4G : throttling.mobileSlow4G,
    throttlingMethod: "simulate"
  });
  const lhr = result.lhr;
  if (lhr.runtimeError) throw new Error(`${route.name} ${formFactor} Lighthouse runtime error ${lhr.runtimeError.code}: ${lhr.runtimeError.message}`);
  const audit = (id) => lhr.audits[id]?.numericValue ?? 0;
  return {
    name: route.name,
    formFactor,
    scores: {
      performance: Math.round((lhr.categories.performance?.score ?? 0) * 100),
      accessibility: Math.round((lhr.categories.accessibility?.score ?? 0) * 100),
      bestPractices: Math.round((lhr.categories["best-practices"]?.score ?? 0) * 100),
      seo: Math.round((lhr.categories.seo?.score ?? 0) * 100)
    },
    metrics: {
      lcpMs: rounded(audit("largest-contentful-paint")),
      cls: rounded(audit("cumulative-layout-shift"), 3),
      tbtMs: rounded(audit("total-blocking-time")),
      mainThreadMs: rounded(audit("mainthread-work-breakdown")),
      transferKb: rounded(audit("total-byte-weight") / 1024),
      unusedJsKb: rounded(audit("unused-javascript") / 1024),
      renderBlockingMs: rounded(audit("render-blocking-resources")),
      longTasksMs: rounded(audit("long-tasks"))
    },
    failedAudits: Object.fromEntries(
      Object.entries(lhr.categories).map(([category, data]) => [
        category,
        data.auditRefs
          .filter((reference) => reference.weight > 0 && lhr.audits[reference.id]?.score !== null && lhr.audits[reference.id].score < 1)
          .map((reference) => `${reference.id}: ${lhr.audits[reference.id].title}`)
      ])
    ),
    layoutShifts: lhr.audits["layout-shifts"]?.details?.items ?? [],
    lcpElement: lhr.audits["largest-contentful-paint-element"]?.details?.items ?? []
  };
}

const rawReports = [];
try {
  for (const route of routes) rawReports.push(await runAudit(route));
  for (const route of [routes[0], routes[1], routes[7]]) rawReports.push(await runAudit(route, "desktop"));
  const suspicious = rawReports.filter((report) =>
    report.scores.seo < 100
    || report.scores.accessibility < 100
    || report.scores.bestPractices < 95
    || report.metrics.cls > 0.1
    || report.metrics.lcpMs > 2500
    || (routeIsEditorial(report.name) && report.scores.performance < 90)
  );
  for (const report of suspicious) {
    const route = routes.find((item) => item.name === report.name);
    if (route) rawReports.push(await runAudit(route, report.formFactor));
  }
  for (const report of suspicious) {
    const group = rawReports.filter((item) => item.name === report.name && item.formFactor === report.formFactor);
    const route = routes.find((item) => item.name === report.name);
    if (!route || group.length < 2) continue;
    const medianLcp = median(group.map((item) => item.metrics.lcpMs));
    const medianCls = median(group.map((item) => item.metrics.cls));
    const medianPerformance = median(group.map((item) => item.scores.performance));
    const categoryIssue = group.some((item) => item.scores.seo < 100 || item.scores.accessibility < 100 || item.scores.bestPractices < 95);
    if (medianLcp > 2500 || medianCls > 0.1 || categoryIssue || (route.editorial && medianPerformance < 90)) {
      rawReports.push(await runAudit(route, report.formFactor));
    }
  }
} finally {
  try {
    await chrome.kill();
  } catch (error) {
    console.warn(`Chrome exited, but its temporary audit profile could not be removed immediately: ${error instanceof Error ? error.message : "unknown cleanup error"}`);
  }
}

function median(values) {
  const ordered = values.slice().sort((a, b) => a - b);
  const middle = Math.floor(ordered.length / 2);
  return ordered.length % 2 ? ordered[middle] : (ordered[middle - 1] + ordered[middle]) / 2;
}

const grouped = new Map();
for (const report of rawReports) {
  const key = `${report.name}:${report.formFactor}`;
  const group = grouped.get(key) ?? [];
  group.push(report);
  grouped.set(key, group);
}
const reports = [...grouped.values()].map((group) => {
  const first = group[0];
  const worstCls = group.slice().sort((a, b) => b.metrics.cls - a.metrics.cls)[0];
  const worstLcp = group.slice().sort((a, b) => b.metrics.lcpMs - a.metrics.lcpMs)[0];
  return {
    ...first,
    runs: group.length,
    scores: Object.fromEntries(Object.keys(first.scores).map((key) => [key, Math.round(median(group.map((item) => item.scores[key])))])),
    metrics: Object.fromEntries(Object.keys(first.metrics).map((key) => [key, rounded(median(group.map((item) => item.metrics[key])), key === "cls" ? 3 : 0)])),
    failedAudits: Object.fromEntries(Object.keys(first.failedAudits).map((key) => [key, [...new Set(group.flatMap((item) => item.failedAudits[key]))]])),
    layoutShifts: worstCls.layoutShifts,
    lcpElement: worstLcp.lcpElement
  };
});

console.table(reports.map((report) => ({
  Route: report.name,
  Mode: report.formFactor,
  Runs: report.runs,
  Performance: report.scores.performance,
  Accessibility: report.scores.accessibility,
  "Best Practices": report.scores.bestPractices,
  SEO: report.scores.seo,
  "LCP ms": report.metrics.lcpMs,
  CLS: report.metrics.cls,
  "TBT ms": report.metrics.tbtMs,
  "Main thread ms": report.metrics.mainThreadMs,
  "Transfer KB": report.metrics.transferKb,
  "Unused JS KB": report.metrics.unusedJsKb,
  "Render blocking ms": report.metrics.renderBlockingMs,
  "Long tasks ms": report.metrics.longTasksMs
})));
for (const report of reports) {
  const failures = Object.entries(report.failedAudits).filter(([, audits]) => audits.length);
  if (failures.length || report.metrics.cls > 0.1) {
    console.log(`Diagnostics for ${report.name} (${report.formFactor}):`);
    for (const [category, audits] of failures) console.log(`  ${category}: ${audits.join("; ")}`);
    if (report.layoutShifts.length) console.log(`  layout shifts: ${JSON.stringify(report.layoutShifts)}`);
    if (report.lcpElement.length) console.log(`  LCP element: ${JSON.stringify(report.lcpElement)}`);
  }
}

const guardrailIssues = reports.flatMap((report) => [
  ...(report.scores.seo < 100 ? [`${report.name} ${report.formFactor} SEO ${report.scores.seo}`] : []),
  ...(report.scores.accessibility < 100 ? [`${report.name} ${report.formFactor} accessibility ${report.scores.accessibility}`] : []),
  ...(report.scores.bestPractices < 95 ? [`${report.name} ${report.formFactor} best practices ${report.scores.bestPractices}`] : []),
  ...(report.metrics.cls > 0.1 ? [`${report.name} ${report.formFactor} CLS ${report.metrics.cls}`] : []),
  ...(report.metrics.lcpMs > 2500 ? [`${report.name} ${report.formFactor} LCP ${report.metrics.lcpMs}ms`] : []),
  ...(routeIsEditorial(report.name) && report.scores.performance < 90 ? [`${report.name} ${report.formFactor} editorial performance ${report.scores.performance}`] : [])
]);

function routeIsEditorial(name) {
  return routes.find((route) => route.name === name)?.editorial ?? false;
}

if (guardrailIssues.length) {
  console.error(`Lighthouse guardrails require investigation:\n${guardrailIssues.join("\n")}`);
  process.exit(1);
}
console.log(`Lighthouse guardrails passed for ${routes.length} mobile routes and 3 desktop spot checks.`);
