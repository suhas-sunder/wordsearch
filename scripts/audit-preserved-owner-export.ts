import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve, relative, join } from "node:path";
import { preservedGrowthEnhancements } from "@/content/staged/preserved-growth-enhancements";

const output = resolve(process.argv.find((arg) => arg.startsWith("--export-dir="))?.slice("--export-dir=".length) ?? "out");
if (!existsSync(join(output, "sitemap.xml"))) throw new Error("Build the static export before checking owner draft isolation.");
const sitemap = readFileSync(join(output, "sitemap.xml"), "utf8");
const search = readFileSync(join(output, "search-index.json"), "utf8");
const issues: string[] = [];
for (const record of preservedGrowthEnhancements) {
  if (sitemap.includes(record.targetCanonicalPath) || search.includes(record.targetCanonicalPath)) issues.push(`${record.id}: unpublished path exposed in sitemap/search.`);
  const files = [join(output, `${record.targetCanonicalPath}.html`), join(output, record.targetCanonicalPath, "index.html")];
  const file = files.find(existsSync);
  if (record.targetKind === "proposed-new-path") {
    if (file) issues.push(`${record.id}: proposed new path was exported.`);
  } else if (!file) issues.push(`${record.id}: existing draft canonical is missing.`);
  else {
    const html = readFileSync(file, "utf8");
    if (!/<meta\s+name="robots"\s+content="[^"]*noindex/.test(html)) issues.push(`${record.id}: existing draft lacks noindex.`);
    if (!html.includes(`rel="canonical" href="https://www.ilovewordsearch.com${record.targetCanonicalPath}"`)) issues.push(`${record.id}: existing canonical changed.`);
  }
}
let scannedFiles = 0;
function inspect(directory: string) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) inspect(path);
    else if (/\.(html|js|json)$/.test(entry.name)) {
      scannedFiles++;
      const text = readFileSync(path, "utf8");
      for (const record of preservedGrowthEnhancements) if (text.includes(record.puzzle.seed)) issues.push(`${record.id}: source-only request leaked into ${relative(output, path)}.`);
    }
  }
}
inspect(output);
console.log(JSON.stringify({ sourceOnlyOwnerProposals: preservedGrowthEnhancements.length, existingDraftTargets: preservedGrowthEnhancements.filter(({ targetKind }) => targetKind === "existing-draft").length, proposedNewPaths: preservedGrowthEnhancements.filter(({ targetKind }) => targetKind === "proposed-new-path").length, scannedFiles, issues, publicationAuthorized: false, editorialApproved: false }, null, 2));
if (issues.length) process.exitCode = 1;
