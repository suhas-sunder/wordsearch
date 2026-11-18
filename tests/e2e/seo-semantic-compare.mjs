import { createHash } from "node:crypto";

export const differenceCategories = ["expected-ui-structure", "approved-functional-content", "technical-accessibility-semantics", "potentially-meaningful-indexed-content", "unexpected-regression", "provider-indexability-header"];
export function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  return value;
}
export const semanticHash = (value) => createHash("sha256").update(JSON.stringify(stable(value)) ?? "undefined").digest("hex");

function fields(page) {
  const value = page.semantic;
  return {
    status: page.status, location: page.location, robotsHeader: page.robotsHeader,
    title: value.title, description: value.description, canonical: value.canonical,
    robotsHtml: value.robotsHtml, h1: value.h1, providerLinks: value.providerLinks,
    vocabulary: value.vocabulary, schema: value.schema, noscript: value.noscript,
    ...Object.fromEntries(Object.entries(value.body).map(([key, item]) => [`body.${key}`, item])),
    ...Object.fromEntries(Object.entries(value.links).map(([key, item]) => [`links.${key}`, item])),
    ...Object.fromEntries([...new Set(value.headings.map((heading) => heading.partition))].map((partition) => [`headings.${partition}`, value.headings.filter((heading) => heading.partition === partition)]))
  };
}
function defaultCategory(field) {
  if (field === "robotsHeader" || field === "providerLinks") return "provider-indexability-header";
  if (field.startsWith("body.") || field.startsWith("headings.") || field.startsWith("links.")) return "potentially-meaningful-indexed-content";
  return "unexpected-regression";
}

export function compareSnapshots(baseline, candidate, allowlist = []) {
  allowlist = allowlist.flatMap((entry) => {
    if (entry.path && entry.paths) throw new Error("Use either one exact path or an explicit path list");
    if (entry.paths && (!Array.isArray(entry.paths) || !entry.paths.length)) throw new Error("Explicit path list must not be empty");
    return entry.paths ? entry.paths.map((path) => ({ ...entry, path, paths: undefined })) : [entry];
  });
  const differences = [];
  const staleAllowlist = [];
  const used = new Set();
  const seen = new Set();
  for (const entry of allowlist) {
    if (!entry.path?.startsWith("/") || /[*]/u.test(entry.path) || !entry.field || !differenceCategories.includes(entry.category) || !["technical-intent-recorded", "owner-review-required", "owner-decision-verified"].includes(entry.reviewDisposition) || !entry.reason?.trim() || !entry.reviewReference?.trim() || !/^[a-f0-9]{64}$/u.test(entry.beforeSha256) || !/^[a-f0-9]{64}$/u.test(entry.afterSha256)) throw new Error("Allowlist requires exact route, field, hashes, category, explanation, disposition and review reference");
    if (entry.reviewDisposition === "owner-decision-verified" && (!/^https:\/\/github\.com\/suhas-sunder\/wordsearch\/issues\/\d+(?:#issuecomment-\d+)?$/.test(entry.ownerDecisionReference ?? "") || !entry.verificationReference?.trim())) throw new Error("Verified owner decisions require the exact owner issue and executed verification reference");
    const key = `${entry.path}\n${entry.field}`;
    if (seen.has(key)) throw new Error(`Duplicate allowlist scope: ${key}`);
    seen.add(key);
  }
  function inspect(path, field, before, after) {
    const beforeSha256 = semanticHash(before), afterSha256 = semanticHash(after);
    if (beforeSha256 === afterSha256) return;
    const index = allowlist.findIndex((entry) => entry.path === path && entry.field === field && entry.beforeSha256 === beforeSha256 && entry.afterSha256 === afterSha256);
    const permission = index >= 0 ? allowlist[index] : null;
    if (permission) used.add(index);
    const ownerDecisionVerified = permission?.reviewDisposition === "owner-decision-verified";
    differences.push({ path, field, beforeSha256, afterSha256, before: before ?? null, after: after ?? null, category: permission?.category ?? defaultCategory(field), disposition: ownerDecisionVerified ? "explained-owner-decision" : permission ? permission.reviewDisposition === "owner-review-required" ? "explained-owner-review-required" : "explained-technical-intent" : "review-required", ownerApprovalRecorded: ownerDecisionVerified, ownerDecisionReference: permission?.ownerDecisionReference ?? null, verificationReference: permission?.verificationReference ?? null, reason: permission?.reason ?? null, reviewReference: permission?.reviewReference ?? null });
  }
  inspect("/sitemap.xml", "sitemap.paths", baseline.sitemap.paths, candidate.sitemap.paths);
  inspect("/sitemap.xml", "sitemap.locations", baseline.sitemap.locations, candidate.sitemap.locations);
  inspect("/sitemap.xml", "sitemap.entries", baseline.sitemap.entries, candidate.sitemap.entries);
  inspect("/sitemap.xml", "sitemap.status", baseline.sitemap.status, candidate.sitemap.status);
  inspect("/@published-source", "sourceVocabularyFiles", baseline.sourceVocabularyFiles, candidate.sourceVocabularyFiles);
  const beforePages = new Map(baseline.pages.map((page) => [page.path, page]));
  const afterPages = new Map(candidate.pages.map((page) => [page.path, page]));
  if (beforePages.size !== baseline.pages.length || afterPages.size !== candidate.pages.length) throw new Error("Duplicate page observations");
  const paths = [...new Set([...baseline.sitemap.paths, ...candidate.sitemap.paths, ...beforePages.keys(), ...afterPages.keys()])].sort();
  for (const path of paths) {
    const before = beforePages.get(path), after = afterPages.get(path);
    if (!before || !after) {
      differences.push({ path, field: "page.presence", category: "unexpected-regression", disposition: "review-required", before: Boolean(before), after: Boolean(after), reason: "Every sitemap path requires both actual page observations; missing evidence cannot pass" });
      continue;
    }
    const a = fields(before), b = fields(after);
    for (const field of new Set([...Object.keys(a), ...Object.keys(b)])) inspect(path, field, a[field], b[field]);
    for (const [label, page] of [["baseline", before], ["candidate", after]]) {
      if (page.status !== 200 || !Array.isArray(page.semantic.h1) || page.semantic.h1.length !== 1 || !Array.isArray(page.semantic.canonical) || page.semantic.canonical.length !== 1 || !Array.isArray(page.semantic.robotsHtml) || page.semantic.robotsHtml.some((robots) => /\bnoindex\b/iu.test(robots))) differences.push({ path, field: `invariant.${label}`, category: "unexpected-regression", disposition: "review-required", reason: "Indexable sitemap page must return200 with oneH1, a canonical and indexable HTML robots", before: null, after: { status: page.status, h1: page.semantic.h1, canonical: page.semantic.canonical, robotsHtml: page.semantic.robotsHtml } });
      if (!page.semantic.title?.trim() || !Array.isArray(page.semantic.description) || page.semantic.description.length !== 1 || !page.semantic.description[0]?.trim() || !Array.isArray(page.semantic.canonical) || page.semantic.canonical[0] !== `https://www.ilovewordsearch.com${path === "/" ? "" : path}`) differences.push({ path, field: `metadata-invariant.${label}`, category: "unexpected-regression", disposition: "review-required", reason: "Require a nonempty title/description and the exact production canonical for this path", before: null, after: { title: page.semantic.title, description: page.semantic.description, canonical: page.semantic.canonical } });
    }
  }
  const redirects = (snapshot) => snapshot.redirects.map((entry) => {
    let location = entry.location;
    if (location) { const url = new URL(location, snapshot.origin); if ([snapshot.origin, "https://www.ilovewordsearch.com"].includes(url.origin)) location = `${url.pathname}${url.search}${url.hash}`; }
    if (entry.status !== 301 || location !== entry.expectedTarget) differences.push({ path: entry.source, field: "redirect.invariant", category: "unexpected-regression", disposition: "review-required", reason: "Permanent alias must return301 to its declared canonical target", before: null, after: { status: entry.status, location, expectedTarget: entry.expectedTarget } });
    return { source: entry.source, expectedTarget: entry.expectedTarget, status: entry.status, location };
  });
  inspect("/@redirects", "redirects", redirects(baseline), redirects(candidate));
  allowlist.forEach((entry, index) => { if (!used.has(index)) staleAllowlist.push(entry); });
  return { pathsCompared: paths.length, differences, staleAllowlist, unexplained: differences.filter((entry) => entry.disposition === "review-required").length, ownerReviewRequired: differences.filter((entry) => entry.disposition === "explained-owner-review-required").length, verifiedOwnerDecisions: differences.filter((entry) => entry.disposition === "explained-owner-decision").length, ownerApprovalRecorded: false, releaseApproved: false, passed: differences.every((entry) => ["explained-technical-intent", "explained-owner-decision"].includes(entry.disposition)) && staleAllowlist.length === 0 };
}
