// Deliberately allowlisted: never persist raw cookies, request paths, queries,
// headers, console text, frame IDs or Lighthouse artifacts.
export function originOnly(value) {
  try { const url = new URL(value); return ["http:", "https:"].includes(url.protocol) ? url.origin : null; }
  catch { return null; }
}

export function summarizeDiagnostic(result) {
  const { lhr, artifacts = {} } = result;
  const uniqueOrigins = (items) => [...new Set(items.map(originOnly).filter(Boolean))].sort();
  const audit = (id) => lhr.audits[id];
  const enumValue = (value) => typeof value === "string" && /^[A-Za-z][A-Za-z0-9]*$/.test(value) ? value : null;
  const inspector = Object.entries(artifacts.InspectorIssues ?? {}).map(([kind, issues]) => ({
    kind: enumValue(kind), count: issues.length,
    cookieReasons: [...new Set(issues.flatMap((issue) => [
      ...(issue.cookieWarningReasons ?? []), ...(issue.cookieExclusionReasons ?? [])
    ]).map(enumValue).filter(Boolean))].sort(),
    origins: uniqueOrigins(issues.flatMap((issue) => [issue.cookieUrl, issue.request?.url, issue.blockedURL, issue.mainResourceURL]))
  }));
  return {
    lighthouseVersion: lhr.lighthouseVersion,
    browserVersion: lhr.environment?.hostUserAgent?.match(/(?:HeadlessChrome|Chrome)\/[\d.]+/)?.[0] ?? null,
    fetchTime: lhr.fetchTime,
    runtimeErrorCode: enumValue(lhr.runtimeError?.code),
    scores: Object.fromEntries(Object.entries(lhr.categories).map(([id, category]) => [id, category.score === null ? null : Math.round(category.score * 100)])),
    failedWeightedAuditIds: Object.fromEntries(Object.entries(lhr.categories).map(([id, category]) => [id,
      category.auditRefs.filter((ref) => ref.weight > 0 && audit(ref.id)?.score !== null && audit(ref.id)?.score < 1).map((ref) => ref.id)
    ])),
    metrics: Object.fromEntries(["largest-contentful-paint", "cumulative-layout-shift", "total-blocking-time"].map((id) => [id, audit(id)?.numericValue ?? null])),
    cookieAudit: {
      score: audit("third-party-cookies")?.score ?? null,
      count: audit("third-party-cookies")?.details?.items?.length ?? 0,
      origins: uniqueOrigins((audit("third-party-cookies")?.details?.items ?? []).map((item) => item.url))
    },
    inspectorAudit: {
      score: audit("inspector-issues")?.score ?? null,
      categories: (audit("inspector-issues")?.details?.items ?? []).map((item) => ({
        // Lighthouse supplies these static issue labels, never arbitrary page text.
        category: ["Cookie", "Mixed content", "Content security policy", "Blocked by cross-origin policy", "Heavy resource usage by ads"].includes(item.issueType) ? item.issueType : "Other issue category",
        origins: uniqueOrigins((item.subItems?.items ?? []).map((entry) => entry.url))
      })),
      artifacts: inspector
    }
  };
}
