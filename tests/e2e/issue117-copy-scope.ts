import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { chromium } from "playwright";
import type { PuzzleContentRecord } from "@/content/model";
import { getSitemapRecords, SITE_URL } from "@/content/registry";
import {
  issue117CollectionAndGuideCopy, issue117ExpandedContexts, issue117FollowUp, issue117Pilot
} from "@/content/review/issue117";
import visitorHelp from "@/content/review/issue117-visitor-help.json";
// @ts-expect-error The existing browser extraction module is shared with JS audit tools.
import { semanticDocument } from "./seo-semantic-dom.mjs";
// @ts-expect-error The existing semantic comparison module is shared with JS audit tools.
import { compareSnapshots } from "./seo-semantic-compare.mjs";

interface Semantics {
  title: string;
  description: string[];
  canonical: string[];
  robotsHtml: string[];
  h1: unknown[];
  body: Record<string, string>;
  links: Record<string, { href: string; label: string; rel: string }[]>;
  schema: unknown[];
  vocabulary: string[];
}

interface CapturePage {
  path: string;
  file: string;
  status: number;
  location: string | null;
  robotsHeader: string | null;
  contentType: string | null;
  sha256: string;
  semantic: Semantics;
}

interface SitemapEntry {
  loc: string;
  lastmod: string | null;
  changefreq: string | null;
  priority: string | null;
}

interface Redirect {
  source: string;
  expectedTarget: string;
  status: number;
  location: string | null;
}

interface Capture {
  name: string;
  origin: string;
  sha: string | null;
  sitemap: { paths: string[]; entries: SitemapEntry[]; locations: string[]; status: number; sha256: string };
  pages: CapturePage[];
  redirects: Redirect[];
  sourceVocabularyFiles: { path: string; sha256: string }[];
}

const BASELINE_SHA = "a057692afaadf4d530d1dfe60b0fcd351e473a7e";
const BASELINE_CAPTURE_SHA = "7eaf028926a3cf620616e37338ef3bc9d03171e5cd2bbdbd61515a1a0e0e9862";
const baselineFile = process.env.ISSUE117_BASELINE_CAPTURE;
const outputDir = process.env.ISSUE117_COPY_OUTPUT;
const origin = process.env.BASE_URL;
assert.ok(baselineFile && outputDir && origin, "Set ISSUE117_BASELINE_CAPTURE, ISSUE117_COPY_OUTPUT and BASE_URL");
assert.ok(["127.0.0.1", "localhost", "[::1]"].includes(new URL(origin).hostname), "Use the local static export server");
const outputRelativePath = relative(process.cwd(), resolve(outputDir));
assert.ok(outputRelativePath.startsWith("..") || isAbsolute(outputRelativePath), "Keep generated reports outside Git");
await mkdir(outputDir, { recursive: true });
const captureOutput = resolve(outputDir, "capture.json");
await assert.rejects(access(captureOutput), "Use a new output directory to preserve earlier captures");

const sha256 = (value: Uint8Array) => createHash("sha256").update(value).digest("hex");
const baselineBytes = await readFile(baselineFile);
assert.equal(sha256(baselineBytes), BASELINE_CAPTURE_SHA, "Retained baseline capture artifact hash");
const { endpoints, generatedAt: baselineCapturedAt } = JSON.parse(baselineBytes.toString("utf8")) as {
  endpoints: Capture[]; generatedAt: string
};
const baseline = endpoints[1];
assert.equal(baseline.sha, BASELINE_SHA);
assert.equal(baseline.pages.length, 217);
assert.equal(baseline.redirects.length, 35);
const baselineRaw = resolve(dirname(baselineFile), baseline.name);
const baselineByPath = new Map(baseline.pages.map((page) => [page.path, page]));
assert.equal(baselineByPath.size, 217);
assert.equal(sha256(await readFile(resolve(baselineRaw, "sitemap.xml"))), baseline.sitemap.sha256);
const exportDir = process.env.EXPORT_DIR ?? "out";

async function request(path: string) {
  const response = await fetch(new URL(path, origin), { redirect: "manual", signal: AbortSignal.timeout(30000) });
  return {
    status: response.status,
    location: response.headers.get("location"),
    robotsHeader: response.headers.get("x-robots-tag"),
    contentType: response.headers.get("content-type"),
    bytes: Buffer.from(await response.arrayBuffer())
  };
}

const sitemap = await request("/sitemap.xml");
const xml = sitemap.bytes.toString("utf8");
const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/gu)].map((match): SitemapEntry => {
  const field = (name: string) => match[1].match(new RegExp(`<${name}>([^<]*)</${name}>`, "u"))?.[1] ?? null;
  const loc = field("loc");
  assert.ok(loc);
  return { loc, lastmod: field("lastmod"), changefreq: field("changefreq"), priority: field("priority") };
}).sort((left, right) => left.loc.localeCompare(right.loc));
const locations = entries.map((entry) => entry.loc).sort();
const paths = locations.map((location) => new URL(location).pathname).sort();
const guides = new Set(paths.filter((path) => path.startsWith("/guides/")));
const baselineGuides = baseline.sitemap.paths.filter((path) => path.startsWith("/guides/"));
const collections = paths.filter((path) => path.startsWith("/collections/"));
const puzzles = getSitemapRecords().filter((record): record is PuzzleContentRecord => record.contentType === "puzzle");
assert.equal(guides.size, 12);
assert.equal(collections.length, 13);
assert.equal(puzzles.length, 150);
const candidateDir = resolve(outputDir, "local-static-export");
await mkdir(candidateDir);
await writeFile(resolve(candidateDir, "sitemap.xml"), sitemap.bytes);

const candidate: Capture = {
  name: "local-static-export",
  origin,
  sha: null,
  sitemap: { paths, entries, locations, status: sitemap.status, sha256: sha256(sitemap.bytes) },
  pages: [],
  redirects: [],
  sourceVocabularyFiles: []
};
const candidateBaseSha = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
assert.equal(candidateBaseSha, BASELINE_SHA, "Candidate is a local diff against the pinned baseline");

const problems: string[] = [];
function same(actual: unknown, expected: unknown, label: string) {
  try {
    assert.deepEqual(actual, expected);
  } catch (error) {
    if (!(error instanceof assert.AssertionError)) throw error;
    problems.push(label);
  }
}

same(candidate.sitemap.status, 200, "Sitemap HTTP status");
same(sha256(await readFile(resolve(exportDir, "sitemap.xml"))), candidate.sitemap.sha256, "Served sitemap equals out bytes");
same(candidate.sitemap.paths, baseline.sitemap.paths, "Sitemap URL paths");
same(candidate.sitemap.locations, baseline.sitemap.locations, "Sitemap URL locations");
same([...guides], baselineGuides, "Exact 12 guide date exception paths");
same(candidate.sitemap.entries, baseline.sitemap.entries.map((entry) =>
  baselineGuides.includes(new URL(entry.loc).pathname) ? { ...entry, lastmod: null } : entry
), "Sitemap metadata outside the 12 reviewed guide lastmod omissions");
same(
  baseline.sitemap.entries.filter((entry) => baselineGuides.includes(new URL(entry.loc).pathname)).map((entry) => entry.lastmod),
  Array(12).fill("2026-07-25T00:00:00.000Z"),
  "Only the exact stored guide date can qualify for lastmod omission"
);

// Word banks for these routes are sent to the deferred builder in Next Flight
// payloads. Decode the inline JSON without executing it, then read wordsText.
function embeddedWordBank(html: string) {
  return [...html.matchAll(/<script>self\.__next_f\.push\((\[1,"[^\n]*?\])\)<\/script>/gu)]
    .flatMap((match) => {
      const [, payload] = JSON.parse(match[1]) as [number, string];
      return [...payload.matchAll(/"initialRequest":\{"title":"(?:[^"\\]|\\.)*","wordsText":("(?:[^"\\]|\\.)*")/gu)]
        .map((field) => JSON.parse(field[1]) as string);
    });
}

const puzzleByPath = new Map(puzzles.map((record) => [record.canonicalPath, record]));
const wordBanks: { path: string; words: number; matched: boolean }[] = [];
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const [index, path] of paths.entries()) {
    const before = baselineByPath.get(path);
    if (!before) {
      problems.push(`${path}: missing baseline page capture`);
      continue;
    }
    const previous = await readFile(resolve(baselineRaw, before.file));
    same(sha256(previous), before.sha256, `${path}: retained body hash`);
    const { bytes, ...http } = await request(path);
    const html = bytes.toString("utf8");
    const file = `${String(index).padStart(3, "0")}.html`;
    const exported = await readFile(resolve(exportDir, path === "/" ? "index.html" : `.${path}.html`));
    same(sha256(bytes), sha256(exported), `${path}: served body must equal out bytes`);
    const semantic: Semantics = await page.evaluate(semanticDocument, { html, origin, canonicalOrigin: SITE_URL, path });
    await writeFile(resolve(candidateDir, file), bytes);
    candidate.pages.push({ path, file, ...http, sha256: sha256(bytes), semantic });
    same(http.status, 200, `${path}: HTTP status`);
    same(http.location, null, `${path}: canonical redirect`);
    same(http.contentType?.split(";")[0], "text/html", `${path}: content type`);
    for (const field of ["title", "description", "canonical", "robotsHtml", "h1", "vocabulary"] as const) {
      same(semantic[field], before.semantic[field], `${path}: ${field}`);
    }
    const destinations = (links: Semantics["links"]) => Object.fromEntries(Object.entries(links).map(([partition, items]) => [
      partition, items.map(({ href, rel }) => ({ href, rel }))
    ]));
    same(destinations(semantic.links), destinations(before.semantic.links), `${path}: internal link order, destinations and rel`);
    const schema = structuredClone(before.semantic.schema);
    if (guides.has(path)) {
      const articles = schema.filter((item): item is Record<string, unknown> => Boolean(
        item && typeof item === "object" && "@type" in item && item["@type"] === "Article"
      ));
      same(articles.map((article) => article.dateModified), ["2026-07-25"], `${path}: baseline Article.dateModified`);
      for (const article of articles) delete article.dateModified;
    }
    same(semantic.schema, schema, `${path}: JSON-LD outside the guide date omission`);
    const puzzle = puzzleByPath.get(path);
    if (puzzle) {
      const beforeBank = embeddedWordBank(previous.toString("utf8"));
      const afterBank = embeddedWordBank(html);
      const expected = [puzzle.puzzle.words.join("\n")];
      const matched = JSON.stringify(afterBank) === JSON.stringify(expected);
      same(beforeBank, expected, `${path}: authored word bank matches the baseline Flight payload`);
      same(afterBank, expected, `${path}: authored word bank matches the new Flight payload`);
      wordBanks.push({ path, words: puzzle.puzzle.words.length, matched });
    }
  }
  await context.close();
} finally {
  await browser.close();
}

for (const row of baseline.redirects) {
  const { status, location } = await request(row.source);
  candidate.redirects.push({ source: row.source, expectedTarget: row.expectedTarget, status, location });
  same(status, row.status, `${row.source}: redirect status`);
  same(location && new URL(location, origin).pathname, row.expectedTarget, `${row.source}: redirect destination`);
}
for (const source of baseline.sourceVocabularyFiles) {
  const input = execFileSync("git", ["show", `${BASELINE_SHA}:${source.path}`]);
  same(sha256(input), source.sha256, `${source.path}: baseline source hash`);
  candidate.sourceVocabularyFiles.push({ path: source.path, sha256: sha256(await readFile(source.path)) });
}

await writeFile(captureOutput, `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  baselineCapturedAt,
  baselineCaptureSha256: sha256(baselineBytes),
  candidateBaseSha,
  candidateSource: "Uncommitted local static build. Every served HTML hash was checked against out.",
  limitations: ["SSR DOM extraction uses inert parsing. HTTP headers describe the local static server.", "No release approval is inferred."],
  endpoints: [baseline, candidate]
}, null, 2)}\n`);

const occurrences = (rows: CapturePage[], text: string) => rows.flatMap((row) => {
  const count = Object.values(row.semantic.body).reduce((sum, part) => sum + part.split(text).length - 1, 0);
  return count ? [{ path: row.path, occurrences: count }] : [];
}).sort((left, right) => left.path.localeCompare(right.path));
const candidateByPath = new Map(candidate.pages.map((page) => [page.path, page]));

const contextChanges = [
  ...issue117Pilot.changes.filter((change) => change.target.field === "context").map((change) => ({ ...change, recordId: change.target.recordId })),
  ...issue117FollowUp.changes,
  ...issue117ExpandedContexts.changes
];
const changedContexts = new Map(contextChanges.map((change) => [change.recordId, change]));
const proposals: { recordId: string; before: string; after: string; affectedPaths: readonly string[] }[] = [
  ...issue117Pilot.changes.map((change) => ({ ...change, recordId: change.target.recordId })),
  ...issue117FollowUp.changes,
  ...issue117ExpandedContexts.changes,
  ...issue117CollectionAndGuideCopy.changes,
  ...visitorHelp.corrections.map((change) => ({ ...change, recordId: change.record, affectedPaths: change.baselineOccurrences.map((row) => row.path) }))
];
same(proposals.length, 49, "Exact number of public proposals");
const proposalResults = proposals.map((proposal) => {
  const puzzleContext = changedContexts.get(proposal.recordId)?.before === proposal.before;
  const expectedBefore = proposal.affectedPaths.map((path) => ({
    path, occurrences: puzzleContext && path.endsWith(`/${proposal.recordId}`) ? 3 : 1
  })).sort((left, right) => left.path.localeCompare(right.path));
  const expectedAfter = expectedBefore.map(({ path }) => ({ path, occurrences: 1 }));
  const baselineBefore = occurrences(baseline.pages, proposal.before);
  const candidateBefore = occurrences(candidate.pages, proposal.before);
  const candidateAfter = occurrences(candidate.pages, proposal.after);
  const label = `${proposal.recordId}: ${proposal.before}`;
  same(baselineBefore, expectedBefore, `${label}: baseline copy scope`);
  same(candidateBefore, [], `${label}: original copy remains`);
  same(candidateAfter, expectedAfter, `${label}: replacement copy scope`);
  return { recordId: proposal.recordId, before: proposal.before, after: proposal.after, expectedBefore, baselineBefore, candidateBefore, candidateAfter };
});

const specialtyLabels = new Map([
  ["/specialty/asl-fingerspelling-word-search-generator", ["ASL Fingerspelling Word Search Generator", "ASL Fingerspelling — not available yet"]],
  ["/specialty/semaphore-word-search-generator", ["Semaphore Word Search Generator", "Semaphore — not available yet"]],
  ["/specialty/roman-numeral-word-search-generator", ["Roman Numeral Word Search Generator", "Roman Numeral — not available yet"]]
]);
for (const { path, semantic } of candidate.pages) {
  const original = baselineByPath.get(path)?.semantic.links.editorial ?? [];
  const expectedLabels = original.map(({ href, label }) => {
    const specialty = path === "/word-search-generator" ? specialtyLabels.get(href) : undefined;
    if (specialty) return label.replace(specialty[0], specialty[1]);
    return proposals.filter((proposal) => proposal.affectedPaths.includes(path))
      .reduce((text, proposal) => text.replaceAll(proposal.before, proposal.after), label);
  });
  same((semantic.links.editorial ?? []).map((link) => link.label), expectedLabels, `${path}: editorial link labels outside exact copy corrections`);
}

const puzzleResults = puzzles.map((record) => {
  const path = record.canonicalPath;
  const topicSlug = record.slug.slice(record.slug.lastIndexOf("/") + 1);
  const baselinePage = baselineByPath.get(path);
  const candidatePage = candidateByPath.get(path);
  assert.ok(baselinePage && candidatePage, path);
  const change = changedContexts.get(topicSlug);
  const oldContext = change?.before ?? record.description;
  const oldCount = occurrences([baselinePage], oldContext)[0]?.occurrences ?? 0;
  const newCount = occurrences([candidatePage], record.description)[0]?.occurrences ?? 0;
  const introChange = issue117Pilot.changes.find((entry) => entry.target.recordId === topicSlug && entry.target.field === "introduction");
  const oldIntro = introChange?.before ?? record.introduction;
  same(occurrences([baselinePage], oldIntro)[0]?.occurrences, 1, `${path}: baseline introduction`);
  same(occurrences([candidatePage], record.introduction)[0]?.occurrences, 1, `${path}: candidate introduction`);
  const difficultyText = `Difficulty: ${record.editorial.difficultyExplanation}`;
  same(occurrences([baselinePage], difficultyText)[0]?.occurrences, 1, `${path}: baseline difficulty text`);
  same(occurrences([candidatePage], difficultyText)[0]?.occurrences, 1, `${path}: candidate difficulty text`);
  same(oldCount, 3, `${path}: three original on-page context paragraphs`);
  same(newCount, 1, `${path}: one final on-page context paragraph`);
  const [hero, ...afterContext] = baselinePage.semantic.body.editorial.split(oldContext);
  const expectedEditorial = [hero, record.description, ...afterContext].join("")
    .replace(oldIntro, record.introduction).replace(/\s+/gu, " ").trim();
  same(candidatePage.semantic.body.editorial, expectedEditorial, `${path}: all other editorial text preserved`);
  return { path, baselineOccurrences: oldCount, candidateOccurrences: newCount };
});
same(puzzleResults.filter((row) => row.baselineOccurrences - row.candidateOccurrences === 2).length, 150, "Exactly 150 puzzle pages lost two duplicate paragraphs");

const expectedCollectionRows = collections.map((path) => ({ path, occurrences: 1 }));
const collectionBefore = "The count is derived from reviewed, published records in this collection.";
const collectionAfter = "Check the difficulty on each card to find a puzzle that suits you.";
same(occurrences(baseline.pages, collectionBefore), expectedCollectionRows, "Baseline collection count narration scope");
same(occurrences(candidate.pages, collectionBefore), [], "Final collection count narration absent");
same(occurrences(candidate.pages, collectionAfter), expectedCollectionRows, "Final collection browsing tip scope");

const date = "Written by Suhas Sunder · Reviewed on 2026-07-25";
const author = "Written by Suhas Sunder";
const attribution = {
  baseline: occurrences(baseline.pages, date),
  candidateDates: occurrences(candidate.pages, date),
  candidateAuthors: occurrences(candidate.pages, author)
};
const expectedGuideRows = [...guides].map((path) => ({ path, occurrences: 1 }));
same(attribution.baseline, expectedGuideRows, "Baseline guide date attribution scope");
same(attribution.candidateDates, [], "Final historical attribution removed");
same(attribution.candidateAuthors, expectedGuideRows, "Guide author attribution retained");

// Keep the general comparator output raw and unapproved for independent review.
const semanticDifferences = compareSnapshots(baseline, candidate);
await writeFile(resolve(outputDir, "report.json"), `${JSON.stringify({
  passed: problems.length === 0,
  baselineCaptureSha256: sha256(baselineBytes),
  counts: { indexed: paths.length, guides: guides.size, collections: collections.length, puzzles: puzzles.length, proposals: proposals.length },
  proposalResults,
  puzzleResults,
  wordBanks,
  attribution,
  semanticDifferences,
  problems,
  approvalsRecorded: false
}, null, 2)}\n`);
console.log(JSON.stringify({ paths: paths.length, proposals: proposals.length, puzzles: puzzles.length, rawSemanticDifferences: semanticDifferences.differences.length, problems }));
if (problems.length) process.exitCode = 1;
