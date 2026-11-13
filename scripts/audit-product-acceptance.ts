import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { productAcceptanceSchema, renderProductAcceptance, validateProductAcceptance } from "@/lib/content/product-acceptance";

const input: unknown = JSON.parse(readFileSync("docs/releases/PRODUCT-ACCEPTANCE.json", "utf8"));
const issues = validateProductAcceptance(input);
const parsed = productAcceptanceSchema.safeParse(input);
if (parsed.success) for (const feature of parsed.data.features) for (const path of feature.evidence) {
  if (path.startsWith("/") || path.includes("..") || !existsSync(resolve(path))) issues.push(`${feature.id}: missing/invalid repository evidence ${path}.`);
}
if (issues.length) { console.error(JSON.stringify({ issues }, null, 2)); process.exitCode = 1; }
else if (parsed.success) {
  if (process.argv.includes("--markdown")) console.log(renderProductAcceptance(parsed.data));
  else console.log(JSON.stringify({ featureCount: parsed.data.features.length, areas: 7, ownerIssuesCovered: [...new Set(parsed.data.features.flatMap(({ ownerIssues }) => ownerIssues))].sort((a, b) => a - b), statuses: Object.fromEntries([...new Set(parsed.data.features.map(({ status }) => status))].map((status) => [status, parsed.data.features.filter((feature) => feature.status === status).length])), issues, productionAccepted: false, contentEditorialApproved: false }, null, 2));
}
