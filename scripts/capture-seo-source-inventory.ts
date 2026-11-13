import { writeFile } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";
import { routeInventory, getSitemapRecords } from "@/content/registry";
import type { PuzzleContentRecord } from "@/content/model";

const destination = process.argv[2];
if (!destination) throw new Error("Supply an outside-repository JSON destination");
const pathFromRepository = relative(process.cwd(), resolve(destination));
if (!pathFromRepository.startsWith("..") && !isAbsolute(pathFromRepository)) throw new Error("Generated inventories must stay outside Git");
const records = routeInventory.filter((record) => record.publicationStatus === "published" && record.indexable && !record.redirectTarget);
const sitemapPaths = getSitemapRecords().map((record) => record.canonicalPath).sort();
const indexablePaths = records.map((record) => record.canonicalPath).sort();
const puzzles = records.filter((record): record is PuzzleContentRecord => record.contentType === "puzzle");
const value = {
  indexablePaths,
  sitemapPaths,
  indexableOutsideSitemap: indexablePaths.filter((path) => !sitemapPaths.includes(path)),
  publishedPuzzles: puzzles.map((record) => ({ path: record.canonicalPath, words: record.puzzle.words, definition: record.puzzle })),
  classification: routeInventory.map((record) => ({ path: record.canonicalPath, status: record.publicationStatus, indexable: record.indexable, includeInSitemap: record.metadata.includeInSitemap, noindex: record.metadata.noindex, redirectTarget: record.redirectTarget ?? null }))
};
await writeFile(destination, `${JSON.stringify(value, null, 2)}\n`);
console.log(JSON.stringify({ indexable: indexablePaths.length, sitemap: sitemapPaths.length, indexableOutsideSitemap: value.indexableOutsideSitemap.length, publishedPuzzles: puzzles.length }));
