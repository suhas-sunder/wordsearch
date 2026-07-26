import { readFile, readdir, stat } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const out = resolve(root, "out");
const failures = [];

function fail(message) {
  failures.push(message);
}

async function exists(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

async function directoryExists(path) {
  try {
    return (await stat(path)).isDirectory();
  } catch {
    return false;
  }
}

function parseRedirects(source) {
  return source.split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const [from, to, status = "301"] = line.split(/\s+/);
      return { from, to, status: Number(status.replace("!", "")) };
    });
}

async function staticHtmlFor(pathname) {
  if (pathname === "/") return resolve(out, "index.html");
  return resolve(out, `${pathname.slice(1)}.html`);
}

const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const netlify = await readFile(resolve(root, "netlify.toml"), "utf8");
const nextConfig = await readFile(resolve(root, "next.config.ts"), "utf8");
const redirectsSource = await readFile(resolve(out, "_redirects"), "utf8");
const headersSource = await readFile(resolve(out, "_headers"), "utf8");
const manifest = JSON.parse(await readFile(resolve(root, "tests/e2e/route-audit-manifest.json"), "utf8"));
const redirects = parseRedirects(redirectsSource);

if (!nextConfig.includes('output: "export"')) fail("next.config.ts does not enable output: export");
if (!/publish\s*=\s*"out"/.test(netlify)) fail("Netlify publish directory is not out");
if (/\[\[plugins\]\]|@netlify\/plugin-nextjs/.test(netlify)) fail("Netlify Next.js runtime plugin remains configured");
if (packageJson.devDependencies?.["@netlify/plugin-nextjs"]) fail("@netlify/plugin-nextjs remains installed");
if (packageJson.scripts?.start !== "node tests/e2e/static-export-server.mjs") fail("npm start is not the static export server");

const configuredRedirects = new Map(redirects.filter((item) => item.status !== 200).map((item) => [item.from, item.to]));
for (const { source, target } of [...manifest.redirects, ...manifest.legacyAliases]) {
  if (configuredRedirects.get(source) !== target) fail(`missing static redirect ${source} -> ${target}`);
}
if (configuredRedirects.size !== manifest.redirects.length + manifest.legacyAliases.length) {
  fail(`expected ${manifest.redirects.length + manifest.legacyAliases.length} permanent redirects, found ${configuredRedirects.size}`);
}
if (redirects.some((item) => item.from === "/*" && item.status === 200)) fail("SPA catch-all rewrite remains configured");

for (const prefix of ["play", "print", "pdf", "answer-key", "embed", "custom"]) {
  const rewrite = redirects.find((item) => item.from === `/${prefix}/*`);
  if (!rewrite || rewrite.to !== `/${prefix}.html` || rewrite.status !== 200) {
    fail(`missing static utility rewrite for /${prefix}/*`);
  }
  if (!await exists(resolve(out, `${prefix}.html`))) fail(`missing exported ${prefix} shell`);
  if (!headersSource.includes(`/${prefix}/*`) || !headersSource.includes("X-Robots-Tag: noindex")) {
    fail(`missing noindex response header for /${prefix}/*`);
  }
}

for (const path of ["index.html", "404.html", "robots.txt", "sitemap.xml", "search-index.json", "_redirects", "_headers"]) {
  if (!await exists(resolve(out, path))) fail(`missing out/${path}`);
}
if (await exists(resolve(out, "api", "search", "index.html"))) fail("search API was exported");
if (await exists(resolve(out, "api", "puzzle-pdf", "index.html"))) fail("PDF API was exported");

const sitemap = await readFile(resolve(out, "sitemap.xml"), "utf8");
const sitemapPaths = [...sitemap.matchAll(/<loc>https:\/\/www\.ilovewordsearch\.com([^<]*)<\/loc>/g)].map((match) => match[1] || "/");
if (sitemapPaths.length !== manifest.sitemapCount) fail(`expected ${manifest.sitemapCount} sitemap URLs, found ${sitemapPaths.length}`);
for (const pathname of sitemapPaths) {
  if (!await exists(await staticHtmlFor(pathname))) fail(`sitemap path is missing static HTML: ${pathname}`);
}

const searchIndex = JSON.parse(await readFile(resolve(out, "search-index.json"), "utf8"));
if (!Array.isArray(searchIndex) || searchIndex.length < 200) fail("static search index is missing expected records");
if (searchIndex.filter((item) => item.type === "Puzzle").length !== 150) fail("static search index does not contain all 150 curated puzzles");

const sourceFiles = [];
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) await collect(path);
    else sourceFiles.push(path);
  }
}
await collect(resolve(root, "app"));
if (sourceFiles.some((path) => path.endsWith("route.ts"))) fail("an application route handler remains");
for (const path of sourceFiles.filter((item) => /\.[cm]?[jt]sx?$/.test(item))) {
  const source = await readFile(path, "utf8");
  if (/\b(cookies|headers|draftMode)\s*\(|["']use server["']|export const runtime/.test(source)) {
    fail(`request/runtime-dependent source remains: ${path.slice(root.length + 1)}`);
  }
}

const functionsManifestPath = resolve(root, ".next", "server", "functions-config-manifest.json");
if (await exists(functionsManifestPath)) {
  const functionsManifest = JSON.parse(await readFile(functionsManifestPath, "utf8"));
  if (Object.keys(functionsManifest.functions ?? {}).length) fail("Next functions manifest is not empty");
}

const middlewareManifestPath = resolve(root, ".next", "server", "middleware-manifest.json");
if (await exists(middlewareManifestPath)) {
  const middlewareManifest = JSON.parse(await readFile(middlewareManifestPath, "utf8"));
  if (Object.keys(middlewareManifest.middleware ?? {}).length || Object.keys(middlewareManifest.functions ?? {}).length) {
    fail("Next middleware or edge functions manifest is not empty");
  }
}

for (const path of [
  resolve(root, ".netlify", "functions"),
  resolve(root, ".netlify", "edge-functions"),
  resolve(root, ".netlify", "v1", "functions"),
  resolve(root, ".netlify", "v1", "edge-functions"),
  resolve(root, "netlify", "functions"),
  resolve(root, "netlify", "edge-functions")
]) {
  if (await directoryExists(path)) fail(`Function or Edge Function bundle remains: ${path.slice(root.length + 1)}`);
}

if (failures.length) {
  console.error(failures.map((message) => `- ${message}`).join("\n"));
  process.exit(1);
}

console.log(`Static export audit passed ${sitemapPaths.length} sitemap pages, ${configuredRedirects.size} permanent redirects, and 6 browser-decoded utility shells.`);
console.log("Netlify publishes only out; no route handlers or Next/Netlify runtime plugin remain.");
