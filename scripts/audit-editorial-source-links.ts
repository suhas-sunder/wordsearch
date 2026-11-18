import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { editorialAssetReferences } from "@/content/staged/editorial-assets";

// Candidate files are immutable at their referenced content commit. Historical
// owner-preservation/doc references intentionally have different amendment rules.
const files = new Map(editorialAssetReferences.filter(({ kind }) => kind === "puzzle-candidate")
  .map((reference) => [`${reference.contentCommit}:${reference.sourceFile}`, reference]));
const evidence = [...files.values()].map(({ contentCommit, sourceFile, pr }) => {
  try {
    if (!/^[a-f0-9]{40}$/.test(contentCommit) || !/^content\/staged\/[a-z0-9-]+\.ts$/.test(sourceFile)) throw new Error("Invalid pinned source reference.");
    const pinned = execFileSync("git", ["show", `${contentCommit}:${sourceFile}`], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    const current = readFileSync(sourceFile, "utf8");
    if (pinned.replaceAll("\r\n", "\n") !== current.replaceAll("\r\n", "\n")) throw new Error("Current candidate file differs from its pinned source; record an explicit amendment reference.");
    return { pr, sourceFile, contentCommit, matchesPinnedSource: true };
  } catch (error) {
    return { pr, sourceFile, contentCommit, matchesPinnedSource: false, issue: error instanceof Error && error.message.startsWith("Current candidate") ? error.message : "Pinned Git object/file is missing or invalid. Fetch the referenced history; do not infer a match." };
  }
});
console.log(JSON.stringify({ candidateCount: editorialAssetReferences.filter(({ kind }) => kind === "puzzle-candidate").length, files: evidence, publicationAuthorized: false }, null, 2));
if (evidence.some(({ matchesPinnedSource }) => !matchesPinnedSource)) process.exitCode = 1;
