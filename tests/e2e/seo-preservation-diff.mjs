import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";
import { compareSnapshots } from "./seo-semantic-compare.mjs";

const [capturePath, allowlistPath, output] = process.argv.slice(2);
assert.ok(capturePath && allowlistPath && output, "Usage: node seo-preservation-diff.mjs <capture> <allowlist> <outside-repository-report>");
const local = relative(process.cwd(), resolve(output));
assert.ok(local.startsWith("..") || isAbsolute(local), "Keep generated reports outside Git");
const capture = JSON.parse(await readFile(capturePath, "utf8"));
const allowlist = JSON.parse(await readFile(allowlistPath, "utf8"));
assert.equal(capture.endpoints.length, 2, "Need complete baseline and candidate captures");
for (const endpoint of capture.endpoints) {
  assert.equal(endpoint.pages.length, 217, "Full current indexable inventory is required");
  assert.equal(endpoint.sitemap.paths.length, 217);
  assert.equal(endpoint.redirects.length, 35);
  assert.equal(endpoint.sourceVocabularyFiles.length, 2);
}
const result = compareSnapshots(...capture.endpoints, allowlist);
await writeFile(output, `${JSON.stringify({ capturedAt: capture.generatedAt, baseline: capture.endpoints[0].sha, candidate: capture.endpoints[1].sha, ...result }, null, 2)}\n`);
console.log(JSON.stringify({ pathsCompared: result.pathsCompared, differences: result.differences.length, unexplained: result.unexplained, ownerReviewRequired: result.ownerReviewRequired, staleAllowlist: result.staleAllowlist.length, passed: result.passed }));
if (!result.passed) process.exitCode = 1;
