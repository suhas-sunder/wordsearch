import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { isAbsolute, relative, resolve } from "node:path";
import { christmasCollectionReviews } from "@/content/staged/christmas-collections";
import { buildCollectionReview, collectionReviewHtml } from "@/lib/content/collection-review";

const destination = process.argv[2];
if (!destination) throw new Error("Usage: npx tsx scripts/export-christmas-collection-review.ts <outside-repository-directory>");
const output = resolve(destination);
const local = relative(process.cwd(), output);
if (!local.startsWith("..") && !isAbsolute(local)) throw new Error("Keep review exports outside the repository.");
await mkdir(output, { recursive: true });
const sourceSha256 = Object.fromEntries(await Promise.all(["content/staged/christmas-collections.ts", "content/staged/christmas.ts", "content/curated-topics.ts", "content/registry.ts"].map(async (path) => [path, createHash("sha256").update(await readFile(path)).digest("hex")])));
for (const asset of christmasCollectionReviews) {
  const report = buildCollectionReview(asset);
  await writeFile(resolve(output, `${asset.id.toLowerCase()}-UNREVIEWED.json`), `${JSON.stringify({ sourceSha256, ...report }, null, 2)}\n`);
  await writeFile(resolve(output, `${asset.id.toLowerCase()}-UNREVIEWED.html`), collectionReviewHtml(report));
  console.log(JSON.stringify({ id: asset.id, proposedChildren: report.children.length, approvedPublishedChildren: report.approvedPublishedChildCount, publicationAuthorized: false, runtimeActivation: false }));
}
