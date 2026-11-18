import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";

const [manifestPath, sourceRoot, destination] = process.argv.slice(2);
assert.ok(manifestPath && sourceRoot && destination, "Usage: node assert-frozen-export.mjs <manifest> <source-root> <outside-repository-proof>");
const local = relative(process.cwd(), resolve(destination));
assert.ok(local.startsWith("..") || isAbsolute(local), "Keep proof outside Git");
const bytes = await readFile(manifestPath);
const manifest = JSON.parse(bytes);
assert.equal(process.version, manifest.node, "Use the exact supported build Node version");
const git = (...args) => execFileSync("git", ["-C", sourceRoot, ...args], { encoding: "utf8" }).trim();
assert.equal(git("rev-parse", "HEAD"), manifest.applicationSha);
assert.equal(git("rev-parse", "HEAD^{tree}"), manifest.tree);
assert.equal(git("status", "--porcelain"), "", "Frozen source worktree must remain clean");
const hash = (value) => createHash("sha256").update(value).digest("hex");
const guardedPath = (root, path) => { const value = resolve(root, path); assert.ok(value.startsWith(resolve(root) + sep), "Manifest path must stay inside its declared root"); return value; };
async function pool(values, operation) {
  let cursor = 0;
  const result = new Array(values.length);
  await Promise.all(Array.from({ length: Math.min(8, values.length) }, async () => { while (cursor < values.length) { const index = cursor++; result[index] = await operation(values[index]); } }));
  return result;
}
const sourceFiles = await pool(manifest.sourceFiles, async (file) => { assert.equal(hash(await readFile(guardedPath(sourceRoot, file.path))), file.sha256, `Source changed: ${file.path}`); return file.path; });
assert.equal(hash(await readFile(resolve(sourceRoot, "package-lock.json"))), manifest.packageLockSha256);
const exportRoot = resolve(sourceRoot, "out");
async function names(root, prefix = "") {
  const result = [];
  for (const entry of await readdir(resolve(root, prefix), { withFileTypes: true })) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) result.push(...await names(root, path)); else result.push(path);
  }
  return result;
}
assert.deepEqual((await names(exportRoot)).sort(), manifest.exportFiles.map(({ path }) => path).sort(), "Exact exported file set changed");
const served = await pool(manifest.exportFiles, async (file) => {
  assert.equal(hash(await readFile(guardedPath(exportRoot, file.path))), file.sha256, `Export bytes changed: ${file.path}`);
  const response = await fetch(new URL(`/${file.path}`, manifest.baseUrl), { headers: { "Accept-Encoding": "identity" }, redirect: "manual", signal: AbortSignal.timeout(15000) });
  assert.equal(response.status, 200, `Literal exported file not served: ${file.path}`);
  const sha256 = hash(new Uint8Array(await response.arrayBuffer()));
  assert.equal(sha256, file.sha256, `Served bytes mismatch: ${file.path}`);
  return { path: file.path, status: response.status, sha256 };
});
for (const [route, path] of [["/", "index.html"], ["/word-search-generator", "word-search-generator.html"], ["/sitemap.xml", "sitemap.xml"]]) {
  const expected = manifest.exportFiles.find((file) => file.path === path);
  assert.ok(expected);
  const response = await fetch(new URL(route, manifest.baseUrl), { headers: { "Accept-Encoding": "identity" }, redirect: "manual" });
  assert.equal(response.status, 200);
  assert.equal(hash(new Uint8Array(await response.arrayBuffer())), expected.sha256, `Canonical response mismatch: ${route}`);
}
assert.equal(hash(await readFile(manifestPath)), hash(bytes), "Export manifest changed during guard");
assert.equal(git("rev-parse", "HEAD"), manifest.applicationSha);
assert.equal(git("status", "--porcelain"), "");
const proof = { applicationSha: manifest.applicationSha, tree: manifest.tree, node: process.version, exportSha256: manifest.exportSha256, manifestSha256: hash(bytes), generatedAt: new Date().toISOString(), sourceFilesVerified: sourceFiles.length, diskExportsVerified: served.length, httpExportsVerified: served.length, canonicalRoutesVerified: 3, sourceClean: true, served };
await mkdir(dirname(resolve(destination)), { recursive: true });
await writeFile(destination, `${JSON.stringify(proof, null, 2)}\n`);
console.log(JSON.stringify({ applicationSha: proof.applicationSha, node: proof.node, sourceFiles: sourceFiles.length, diskFiles: served.length, httpFiles: served.length, canonicalRoutes: 3, sourceClean: true }));
