import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { access, readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { semanticDocument } from "./seo-semantic-dom.mjs";

const output = process.env.SEO_CAPTURE_OUTPUT;
assert.ok(output && !resolve(output).startsWith(process.cwd()), "Use an outside-repository output directory");
await assert.rejects(access(resolve(output, "capture.json")), "Use a new output folder; preserve previous observations");
const endpoints = [
  { name: process.env.SEO_BASELINE_NAME ?? "production", origin: process.env.SEO_BASELINE_URL ?? "https://www.ilovewordsearch.com", sha: process.env.SEO_BASELINE_SHA ?? "471a118dd459f2181cd641ed0572ba6dd7005540" },
  { name: process.env.SEO_CANDIDATE_NAME ?? "review-r", origin: process.env.SEO_CANDIDATE_URL ?? "https://6aeecf5d87e1713c8c60f2f2--ilovewordsearch.netlify.app", sha: process.env.SEO_CANDIDATE_SHA ?? "ada6b6e89a67ca5c1c31a4cc927453994ba9d3d4" }
];
for (const endpoint of endpoints) {
  assert.match(endpoint.name, /^[a-z0-9][a-z0-9-]*$/u, "Use a plain endpoint label");
  assert.match(endpoint.sha, /^[a-f0-9]{40}$/u, "Supply an exact operator-verified source SHA");
}
assert.notEqual(endpoints[0].name, endpoints[1].name, "Endpoint artifact directories must differ");
const canonicalOrigin = "https://www.ilovewordsearch.com";
const existing = process.env.SEO_CAPTURE_REPARSE_FROM ? JSON.parse(await readFile(resolve(process.env.SEO_CAPTURE_REPARSE_FROM, "capture.json"), "utf8")) : null;
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const redirectSource = await readFile(new URL("../../public/_redirects", import.meta.url), "utf8");
const redirects = redirectSource.split(/\r?\n/u).map((line) => line.trim().split(/\s+/u)).filter((parts) => /^301!?$/u.test(parts[2] ?? "")).map(([source, target]) => ({ source, target }));
assert.equal(redirects.length, 35);
await mkdir(output, { recursive: true });
async function request(url) {
  const response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(30000) });
  const bytes = new Uint8Array(await response.arrayBuffer());
  return { status: response.status, location: response.headers.get("location"), robotsHeader: response.headers.get("x-robots-tag"), contentType: response.headers.get("content-type"), html: new TextDecoder().decode(bytes), sha256: sha256(bytes) };
}
const browser = await chromium.launch({ headless: true });
const result = { generatedAt: new Date().toISOString(), node: process.version, sourceRefs: endpoints, endpoints: [], limitations: ["Source SHAs independently verified by operator/provider records; response hashes bind observed bodies, not an intrinsic Git attestation.", "SSR snapshots use inert DOM parsing with no page scripts; browser observations are separately labeled.", "No cookie values, tokens or raw response headers recorded."] };
try {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const endpoint of endpoints) {
    const directory = resolve(output, endpoint.name);
    await mkdir(directory, { recursive: true });
    const priorEndpoint = existing?.endpoints.find((item) => item.name === endpoint.name);
    const reuseHttp = process.env.SEO_CAPTURE_REUSE_HTTP === "1";
    if (reuseHttp) assert.ok(priorEndpoint, "HTTP reuse requires complete preserved observations");
    const sitemap = reuseHttp ? { ...priorEndpoint.sitemap, html: await readFile(resolve(process.env.SEO_CAPTURE_REPARSE_FROM, endpoint.name, "sitemap.xml"), "utf8") } : await request(`${endpoint.origin}/sitemap.xml`);
    const locations = [...sitemap.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]).sort();
    const entries = [...sitemap.html.matchAll(/<url>([\s\S]*?)<\/url>/gu)].map((match) => Object.fromEntries(["loc", "lastmod", "changefreq", "priority"].map((name) => [name, match[1].match(new RegExp(`<${name}>([^<]*)</${name}>`, "u"))?.[1] ?? null]))).sort((a, b) => a.loc.localeCompare(b.loc));
    const urls = locations.map((location) => new URL(location).pathname).sort();
    assert.equal(sitemap.status, 200);
    assert.equal(urls.length, 217);
    assert.equal(new Set(urls).size, 217);
    await writeFile(resolve(directory, "sitemap.xml"), sitemap.html);
    const captured = { ...endpoint, sitemap: { status: sitemap.status, sha256: sitemap.sha256, locations, entries, paths: urls }, pages: [], redirects: [], sourceVocabularyFiles: [] };
    for (const path of urls) {
      const old = priorEndpoint?.pages.find((item) => item.path === path);
      if (reuseHttp) assert.ok(old, `Missing preserved response: ${path}`);
      const response = old ? { ...old, html: await readFile(resolve(process.env.SEO_CAPTURE_REPARSE_FROM, endpoint.name, old.file), "utf8") } : await request(new URL(path, endpoint.origin));
      assert.equal(sha256(Buffer.from(response.html, "utf8")), response.sha256, "Preserve exact observed UTF-8 response bytes");
      const semantic = await page.evaluate(semanticDocument, { html: response.html, origin: endpoint.origin, canonicalOrigin, path });
      const file = `${String(captured.pages.length).padStart(3, "0")}.html`;
      await writeFile(resolve(directory, file), response.html);
      const http = { ...response };
      delete http.html;
      delete http.semantic;
      captured.pages.push({ path, file, ...http, semantic });
      if (captured.pages.length % 40 === 0) console.log(`${endpoint.name}: ${captured.pages.length}/217 SSR responses`);
    }
    for (const redirect of redirects) {
      const response = reuseHttp ? priorEndpoint.redirects.find((item) => item.source === redirect.source) : await request(new URL(redirect.source, endpoint.origin));
      assert.ok(response, `Missing redirect observation: ${redirect.source}`);
      captured.redirects.push({ source: redirect.source, expectedTarget: redirect.target, status: response.status, location: response.location });
    }
    // Exact source bytes additionally protect all150 authored banks, including
    // candidate deferred editors whose initial vocabulary is not in SSR text.
    for (const file of ["content/curated-topics.ts", "content/curated-topics-prompt6.ts"]) {
      const bytes = execFileSync("git", ["show", `${endpoint.sha}:${file}`]);
      captured.sourceVocabularyFiles.push({ path: file, sha256: sha256(bytes) });
    }
    result.endpoints.push(captured);
    if (existing) result.reparsedFrom = { path: process.env.SEO_CAPTURE_REPARSE_FROM, originalCapturedAt: existing.generatedAt, rawPageBytesReused: true, sitemapAndRedirectsRefetched: !reuseHttp };
    await writeFile(resolve(output, "capture.json"), `${JSON.stringify(result, null, 2)}\n`);
    console.log(`${endpoint.name}: all217 SSR + ${captured.redirects.length} redirect observations saved`);
  }
  await context.close();
} finally { await browser.close(); }
