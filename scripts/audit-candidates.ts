import { readFileSync, statSync } from "node:fs";
import { readSourceInventory } from "@/lib/content/inventory";
import { validateStaged } from "@/lib/content/staged-validation";
import { inspectCandidateExport, inspectCandidatePdfs } from "@/lib/content/staged-output";

const path = process.argv[2];
const maxBytes = 256_000;
let input: unknown;
try {
  if (!path) throw new Error("Usage: npm run audit:candidates -- candidates.json [--export]");
  const stat = statSync(path);
  if (!stat.isFile() || stat.size > maxBytes) throw new Error(`Input must be a regular file of at most ${maxBytes} bytes.`);
  input = JSON.parse(readFileSync(path, "utf8"));
} catch (error) {
  console.log(JSON.stringify({ issues: [{ stage: "schema", code: "input-file", detail: error instanceof Error ? error.message : String(error) }] }, null, 2));
  process.exit(1);
}
const result = validateStaged(input, readSourceInventory().redirects.map((r) => r.source));
const pdf = [];
for (const freeze of result.freezes) pdf.push({ id: freeze.id, ...(await inspectCandidatePdfs(freeze)) });
const exportArg = process.argv.find((arg) => arg.startsWith("--export-dir="));
const exportChecked = process.argv.includes("--export") || exportArg !== undefined;
const exportDir = exportArg?.slice("--export-dir=".length) || "out";
const issues = [...result.issues, ...pdf.flatMap((item) => item.issues), ...(exportChecked ? inspectCandidateExport(result.candidates.map((c) => c.proposedPath), exportDir) : [])];
console.log(JSON.stringify({ candidateCount: result.candidates.length, issues, freezes: result.freezes.map(({ result: _result, ...freeze }) => freeze), pdf: pdf.map(({ id, evidence }) => ({ id, evidence })), exportChecked, humanReviewRequired: true }, null, 2));
if (issues.length) process.exitCode = 1;
