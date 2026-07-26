import { readFile } from "node:fs/promises";

const manifest = JSON.parse(await readFile(new URL("./route-audit-manifest.json", import.meta.url), "utf8"));
const baseUrl = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const canonicalHost = manifest.canonicalHost;
const failures = [];
const pageReports = new Map();

const validState = Buffer.from(JSON.stringify({
  title: "Route Audit Puzzle",
  wordsText: "ALPHA\nBRAVO\nCHARLIE",
  seed: "route-audit-fixed",
  difficulty: "easy",
  alphabetPack: "latin",
  autoSize: false,
  rows: 10,
  cols: 10,
  directions: ["E", "S", "SE"],
  allowOverlap: true,
  fillerMode: "alphabet"
}), "utf8").toString("base64url");

function fail(scope, message) {
  failures.push(`${scope}: ${message}`);
}

function decodeEntities(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

function textContent(value) {
  return decodeEntities(
    value
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function attributes(tag) {
  const result = {};
  for (const match of tag.matchAll(/([:\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
    result[match[1].toLowerCase()] = decodeEntities(match[2] ?? match[3] ?? match[4] ?? "");
  }
  return result;
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map((match) => ({
    raw: match[0],
    attrs: attributes(match[0])
  }));
}

function metaContent(html, key, value) {
  return tags(html, "meta")
    .filter(({ attrs }) => attrs[key] === value)
    .map(({ attrs }) => attrs.content ?? "");
}

function absoluteCanonicalPath(value) {
  try {
    const url = new URL(value);
    return url.origin === canonicalHost ? `${url.pathname}${url.search}` : null;
  } catch {
    return null;
  }
}

function equivalentUrl(left, right) {
  try {
    const a = new URL(left);
    const b = new URL(right);
    return a.origin === b.origin
      && (a.pathname || "/") === (b.pathname || "/")
      && a.search === b.search;
  } catch {
    return false;
  }
}

function collectJsonIds(value, ids = []) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectJsonIds(item, ids));
  } else if (value && typeof value === "object") {
    if (typeof value["@id"] === "string" && Object.keys(value).some((key) => key !== "@id")) ids.push(value["@id"]);
    Object.values(value).forEach((item) => collectJsonIds(item, ids));
  }
  return ids;
}

function flattenJsonLd(value, items = []) {
  if (Array.isArray(value)) {
    value.forEach((item) => flattenJsonLd(item, items));
  } else if (value && typeof value === "object") {
    items.push(value);
    if (Array.isArray(value["@graph"])) flattenJsonLd(value["@graph"], items);
  }
  return items;
}

function parseJsonLd(html, path) {
  const values = [];
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      values.push(JSON.parse(match[1]));
    } catch (error) {
      fail(path, `invalid JSON-LD (${error instanceof Error ? error.message : "parse error"})`);
    }
  }
  const ids = values.flatMap((value) => collectJsonIds(value));
  if (new Set(ids).size !== ids.length) fail(path, "duplicate JSON-LD @id values");
  return values.flatMap((value) => flattenJsonLd(value));
}

function visibleBreadcrumbs(html) {
  const nav = html.match(/<nav\b[^>]*class=["'][^"']*\bbreadcrumbs\b[^"']*["'][^>]*>([\s\S]*?)<\/nav>/i);
  return nav ? [...nav[1].matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map((match) => textContent(match[1])) : [];
}

function internalLinks(html, sourcePath) {
  const links = [];
  for (const match of html.matchAll(/<a\b[^>]*>/gi)) {
    const attrs = attributes(match[0]);
    if (!attrs.href || attrs.href.startsWith("#") || /^(mailto|tel|javascript):/i.test(attrs.href)) continue;
    let url;
    try {
      url = new URL(attrs.href, `${canonicalHost}${sourcePath}`);
    } catch {
      fail(sourcePath, `malformed link ${attrs.href}`);
      continue;
    }
    const internal = url.origin === canonicalHost;
    if (internal && attrs.target?.toLowerCase() === "_blank") fail(sourcePath, `internal link opens a new tab: ${attrs.href}`);
    if (internal && /\bnofollow\b/i.test(attrs.rel ?? "")) fail(sourcePath, `normal internal link is nofollow: ${attrs.href}`);
    if (!internal && attrs.target?.toLowerCase() === "_blank") {
      const rel = new Set((attrs.rel ?? "").toLowerCase().split(/\s+/));
      if (!rel.has("noopener") || !rel.has("noreferrer")) fail(sourcePath, `external new-tab link lacks noopener/noreferrer: ${attrs.href}`);
    }
    if (internal) links.push({ path: `${url.pathname}${url.search}`, sourcePath });
  }
  for (const nav of html.matchAll(/<nav\b[^>]*>([\s\S]*?)<\/nav>/gi)) {
    const targets = [...nav[1].matchAll(/<a\b[^>]*>/gi)]
      .map((match) => attributes(match[0]).href)
      .filter(Boolean);
    if (new Set(targets).size !== targets.length) fail(sourcePath, "duplicate target inside one navigation landmark");
  }
  return links;
}

async function fetchManual(path, options = {}) {
  return fetch(`${baseUrl}${path}`, { redirect: "manual", ...options });
}

async function mapLimited(items, limit, worker) {
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      await worker(items[index], index);
    }
  }));
}

const sitemapResponse = await fetchManual("/sitemap.xml");
if (sitemapResponse.status !== 200) fail("/sitemap.xml", `expected 200, received ${sitemapResponse.status}`);
if (!/application\/xml|text\/xml/i.test(sitemapResponse.headers.get("content-type") ?? "")) {
  fail("/sitemap.xml", `unexpected content type ${sitemapResponse.headers.get("content-type")}`);
}
const sitemapXml = await sitemapResponse.text();
const sitemapUrls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => decodeEntities(match[1]));
if (sitemapUrls.length !== manifest.sitemapCount) fail("/sitemap.xml", `expected ${manifest.sitemapCount} URLs, received ${sitemapUrls.length}`);
if (new Set(sitemapUrls).size !== sitemapUrls.length) fail("/sitemap.xml", "contains duplicate URLs");
if (sitemapUrls.some((url) => !url.startsWith(`${canonicalHost}/`) && url !== `${canonicalHost}/`)) fail("/sitemap.xml", "contains a non-canonical host");
const sitemapPaths = new Set(sitemapUrls.map((url) => new URL(url).pathname));

await mapLimited(sitemapUrls, 12, async (sitemapUrl) => {
  const expectedUrl = new URL(sitemapUrl);
  const path = expectedUrl.pathname;
  const response = await fetchManual(path);
  if (response.status !== 200) {
    fail(path, `expected canonical 200, received ${response.status}`);
    return;
  }
  if (response.headers.get("location")) fail(path, "canonical URL redirected");
  if (!/^text\/html\b/i.test(response.headers.get("content-type") ?? "")) fail(path, "response is not HTML");
  if (response.headers.has("x-powered-by")) fail(path, "exposes X-Powered-By");
  for (const header of ["x-content-type-options", "referrer-policy", "permissions-policy"]) {
    if (!response.headers.has(header)) fail(path, `missing ${header} header`);
  }
  const html = await response.text();
  const title = textContent(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  if (!title) fail(path, "missing title");
  const descriptions = metaContent(html, "name", "description").filter(Boolean);
  if (descriptions.length !== 1) fail(path, `expected one meta description, received ${descriptions.length}`);
  const canonicalTags = tags(html, "link").filter(({ attrs }) => attrs.rel?.toLowerCase().split(/\s+/).includes("canonical"));
  if (canonicalTags.length !== 1) {
    fail(path, `expected one canonical, received ${canonicalTags.length}`);
  } else if (!equivalentUrl(canonicalTags[0].attrs.href, sitemapUrl)) {
    fail(path, `canonical ${canonicalTags[0].attrs.href} does not match sitemap URL ${sitemapUrl}`);
  }
  const robotsValues = metaContent(html, "name", "robots").join(",").toLowerCase();
  if (!robotsValues.includes("index") || !robotsValues.includes("follow") || robotsValues.includes("noindex")) fail(path, `unexpected robots metadata "${robotsValues}"`);
  const h1Count = (html.match(/<h1\b[^>]*>/gi) ?? []).length;
  if (h1Count !== 1) fail(path, `expected one H1, received ${h1Count}`);
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  if (!main || textContent(main[1]).length < 80) fail(path, "missing substantial crawlable main content");
  const visibleText = textContent(main?.[1] ?? html);
  if (/\b(coming soon|under construction|lorem ipsum)\b/i.test(visibleText) || /\{\{[^}]+\}\}/.test(visibleText)) fail(path, "contains unresolved or under-construction copy");
  if (/\b(page not found|404 not found|content not found)\b/i.test(visibleText)) fail(path, "appears to be a soft 404");
  if (/localhost(?::\d+)?/i.test(html)) fail(path, "contains localhost production metadata");
  if (/data-ad-placement=/i.test(html)) fail(path, "renders an ad placeholder when placeholders are disabled");

  const ogUrl = metaContent(html, "property", "og:url");
  const ogTitle = metaContent(html, "property", "og:title");
  const ogDescription = metaContent(html, "property", "og:description");
  const ogImage = metaContent(html, "property", "og:image");
  if (ogUrl.length !== 1 || !equivalentUrl(ogUrl[0], sitemapUrl)) fail(path, "Open Graph URL does not match canonical");
  if (ogTitle.length !== 1 || !ogTitle[0]) fail(path, "missing page-specific Open Graph title");
  if (ogDescription.length !== 1 || !ogDescription[0]) fail(path, "missing page-specific Open Graph description");
  if (ogImage.length !== 1 || !ogImage[0].startsWith(`${canonicalHost}/`)) fail(path, "missing canonical social image URL");

  const jsonLd = parseJsonLd(html, path);
  const breadcrumb = jsonLd.find((item) => item["@type"] === "BreadcrumbList");
  if (breadcrumb) {
    const visible = visibleBreadcrumbs(html);
    const schema = (breadcrumb.itemListElement ?? []).map((item) => item.name);
    if (JSON.stringify(visible) !== JSON.stringify(schema)) fail(path, `visible/schema breadcrumbs differ (${JSON.stringify(visible)} vs ${JSON.stringify(schema)})`);
  }
  for (const itemList of jsonLd.filter((item) => item["@type"] === "ItemList")) {
    const members = itemList.itemListElement ?? [];
    if (itemList.numberOfItems !== undefined && itemList.numberOfItems !== members.length) fail(path, "ItemList count does not match membership");
    if (members.some((item, index) => item.position !== index + 1)) fail(path, "ItemList positions are not sequential");
  }
  pageReports.set(path, {
    title,
    description: descriptions[0],
    canonical: canonicalTags[0]?.attrs.href,
    links: internalLinks(html, path),
    cacheControl: response.headers.get("cache-control") ?? ""
  });
});

for (const key of ["title", "description", "canonical"]) {
  const values = [...pageReports.values()].map((report) => report[key]?.toLowerCase());
  if (new Set(values).size !== values.length) fail("rendered SEO", `duplicate ${key} across sitemap pages`);
}

const knownRedirects = new Map([...manifest.redirects, ...manifest.legacyAliases].map((item) => [item.source, item.target]));
for (const { source, target } of [...manifest.redirects, ...manifest.legacyAliases]) {
  if (sitemapPaths.has(source)) fail(source, "redirect source appears in sitemap");
  const response = await fetchManual(source);
  if (![301, 308].includes(response.status)) fail(source, `expected permanent redirect, received ${response.status}`);
  const location = response.headers.get("location");
  const normalizedLocation = location ? new URL(location, canonicalHost).pathname : "";
  if (normalizedLocation !== target) fail(source, `redirect target ${normalizedLocation || "(missing)"} does not match ${target}`);
  if (knownRedirects.has(target)) fail(source, `redirects to another redirect source ${target}`);
  const destination = await fetchManual(target);
  if (destination.status !== 200 || destination.headers.get("location")) fail(source, `destination ${target} is not a canonical 200`);
  const destinationHtml = await destination.text();
  if (metaContent(destinationHtml, "name", "robots").join(",").toLowerCase().includes("noindex")) fail(source, `destination ${target} is noindex`);
}

const noindexRoutes = [
  { path: "/search", canonical: "/search" },
  { path: "/search?q=animals", canonical: "/search" },
  { path: `/play/${validState}`, canonical: "/word-search-generator" },
  { path: `/print/${validState}?paper=a4`, canonical: "/word-search-generator" },
  { path: `/pdf/${validState}?orientation=landscape`, canonical: "/word-search-generator" },
  { path: `/answer-key/${validState}`, canonical: "/word-search-generator" },
  { path: `/embed/${validState}`, canonical: "/word-search-generator" },
  { path: "/categories/health-and-wellness-word-searches", canonical: "/categories/health-and-wellness-word-searches" },
  { path: "/specialty/morse-code-word-search-generator", canonical: "/specialty/morse-code-word-search-generator" },
  { path: "/collections/brain-training-word-searches", canonical: "/collections/brain-training-word-searches" },
  { path: "/guides/how-hidden-message-word-searches-work", canonical: "/guides/how-hidden-message-word-searches-work" }
];

for (const { path, canonical } of noindexRoutes) {
  const response = await fetchManual(path);
  if (response.status !== 200) {
    fail(path, `representative noindex route expected 200, received ${response.status}`);
    continue;
  }
  const html = await response.text();
  const robotsValue = metaContent(html, "name", "robots").join(",").toLowerCase();
  if (!robotsValue.includes("noindex") || !robotsValue.includes("follow")) fail(path, `expected noindex,follow, received "${robotsValue}"`);
  const canonicalValues = tags(html, "link").filter(({ attrs }) => attrs.rel?.toLowerCase().split(/\s+/).includes("canonical")).map(({ attrs }) => attrs.href);
  if (canonicalValues.length !== 1 || absoluteCanonicalPath(canonicalValues[0]) !== canonical) fail(path, `unexpected canonical ${canonicalValues.join(", ")}`);
  if (sitemapPaths.has(new URL(path, canonicalHost).pathname)) fail(path, "noindex route appears in sitemap");
  if (/data-ad-placement=/i.test(html)) fail(path, "ineligible noindex route renders an ad slot");
}

const invalidRoutes = [
  "/categories/not-a-real-category",
  "/word-searches/animals/not-a-real-puzzle",
  "/collections/not-a-real-collection",
  "/guides/not-a-real-guide",
  "/play/not-valid-state",
  "/print/not-valid-state",
  "/pdf/not-valid-state",
  "/answer-key/not-valid-state",
  "/embed/not-valid-state",
  "/custom/not-valid-state"
];
for (const path of invalidRoutes) {
  const response = await fetchManual(path);
  if (response.status !== 404) fail(path, `expected 404, received ${response.status}`);
}
const invalidPdf = await fetchManual("/api/puzzle-pdf", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ puzzle: null, options: null })
});
if (invalidPdf.status !== 400 || !/^application\/json\b/i.test(invalidPdf.headers.get("content-type") ?? "")) {
  fail("/api/puzzle-pdf", `malformed request expected JSON 400, received ${invalidPdf.status} ${invalidPdf.headers.get("content-type")}`);
}
if (!/no-store/i.test(invalidPdf.headers.get("cache-control") ?? "") || !/noindex/i.test(invalidPdf.headers.get("x-robots-tag") ?? "")) {
  fail("/api/puzzle-pdf", "malformed PDF responses are missing private no-store/noindex headers");
}
const searchApi = await fetchManual("/api/search?q=animals&limit=6");
const searchPayload = await searchApi.json().catch(() => null);
if (searchApi.status !== 200 || !Array.isArray(searchPayload?.results) || searchPayload.results.length === 0) fail("/api/search", "valid query did not return JSON suggestions");
if (!/no-store/i.test(searchApi.headers.get("cache-control") ?? "") || !/noindex/i.test(searchApi.headers.get("x-robots-tag") ?? "")) fail("/api/search", "search suggestions are missing private no-store/noindex headers");

const internalTargets = new Map();
for (const report of pageReports.values()) {
  for (const link of report.links) {
    const pathOnly = new URL(link.path, canonicalHost).pathname;
    if (knownRedirects.has(pathOnly)) fail(link.sourcePath, `links to redirect source ${pathOnly}`);
    const sources = internalTargets.get(link.path) ?? new Set();
    sources.add(link.sourcePath);
    internalTargets.set(link.path, sources);
  }
}
await mapLimited([...internalTargets], 12, async ([target, sources]) => {
  if (target.startsWith("/api/")) return;
  const response = await fetchManual(target);
  if (response.status >= 400) fail([...sources][0], `broken internal link ${target} returned ${response.status}`);
});

const robotsResponse = await fetchManual("/robots.txt");
const robotsText = await robotsResponse.text();
if (robotsResponse.status !== 200 || !/^text\/plain\b/i.test(robotsResponse.headers.get("content-type") ?? "")) fail("/robots.txt", "expected text/plain 200");
if (!robotsText.includes(`Sitemap: ${canonicalHost}/sitemap.xml`) || /localhost/i.test(robotsText) || /^Disallow:\s*\/\s*$/im.test(robotsText)) fail("/robots.txt", "canonical sitemap/allow policy is incorrect");

for (const imageUrl of new Set([...pageReports.values()].flatMap((report) => report.canonical ? [`${canonicalHost}/opengraph-image`] : []))) {
  const response = await fetch(`${baseUrl}${new URL(imageUrl).pathname}`, { redirect: "manual" });
  if (response.status !== 200 || !/^image\/png\b/i.test(response.headers.get("content-type") ?? "")) fail("/opengraph-image", "social image is not a PNG 200");
}

if (failures.length) {
  console.error(`Route audit failed with ${failures.length} issue(s):\n${failures.join("\n")}`);
  process.exit(1);
}

console.log([
  `Route audit passed ${sitemapUrls.length} canonical sitemap URLs.`,
  `Validated ${manifest.redirects.length} consolidation redirects and ${manifest.legacyAliases.length} legacy aliases as permanent, single-hop redirects.`,
  `Validated ${noindexRoutes.length} representative noindex states and ${invalidRoutes.length} invalid routes plus malformed PDF API input.`,
  `Validated ${internalTargets.size} unique internal link targets, rendered SEO, JSON-LD, breadcrumbs, social metadata, headers, robots, and the social image.`
].join("\n"));
