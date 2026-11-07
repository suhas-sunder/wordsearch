import { z } from "zod";

export const acceptanceStatuses = ["NOT STARTED", "IN PROGRESS", "TESTED", "MANUAL ACCEPTANCE PENDING", "BLOCKED", "DONE", "OWNER-DEFERRED"] as const;
export const requiredOwnerIssues = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18];
export const requiredAcceptanceFeatures = [
  "F0.integration", "F0.integrity", "F0.cls",
  "F1.brand-icons", "F1.navigation", "F1.discovery", "F1.collection-browse", "F1.faq", "F1.internal-links", "F1.cross-sites", "F1.author-footer", "F1.social", "F1.theme", "F1.visual",
  "F2.settings", "F2.clues", "F2.feedback", "F2.input-safety", "F2.solver", "F2.sharing", "F2.resume", "F2.library",
  "F3.single-pdf", "F3.layout-fit", "F3.large-print", "F3.print-case", "F3.packets", "F3.presets", "F3.worksheet-fields", "F3.html-export", "F3.grid-exports",
  "F4.inventory", "F4.calendar", "F4.publication", "F4.cohorts",
  "F5.accessibility", "F5.performance", "F5.security", "F5.ads-lifecycle", "F5.ad-eligibility", "F5.seo-static", "F5.preview", "F5.rollback", "F6.optional"
];
const proof = z.object({ reviewer: z.string().min(1), reviewedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), reference: z.string().min(1) }).strict();
export const productAcceptanceSchema = z.object({
  schemaVersion: z.literal(1), updatedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), productStatus: z.enum(acceptanceStatuses),
  productionSha: z.string().regex(/^[a-f0-9]{40}$/), productionAccepted: z.literal(false), contentEditorialApproved: z.literal(false),
  initialNewUrlLimitPerApprovedWeeklyRelease: z.literal(1),
  sourceRefs: z.record(z.string().regex(/^\d+$/), z.object({ url: z.url(), sha: z.string().regex(/^[a-f0-9]{40}$/), branch: z.string().min(1), draft: z.boolean() }).strict()),
  features: z.array(z.object({
    id: z.string().regex(/^F[0-6]\.[a-z-]+$/), title: z.string().min(8), status: z.enum(acceptanceStatuses),
    ownerIssues: z.array(z.number().int().positive()), prs: z.array(z.number().int().positive()), checks: z.array(z.string().min(1)), evidence: z.array(z.string().min(1)), remaining: z.string().min(1),
    manualApproval: z.boolean(), manualEvidence: proof.optional()
  }).strict()).max(100)
}).strict();
export type ProductAcceptance = z.infer<typeof productAcceptanceSchema>;

export function validateProductAcceptance(input: unknown): string[] {
  const result = productAcceptanceSchema.safeParse(input);
  if (!result.success) return result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
  const { features, sourceRefs } = result.data;
  const errors: string[] = [];
  const ids = features.map(({ id }) => id);
  if (new Set(ids).size !== ids.length) errors.push("Duplicate feature IDs.");
  for (const id of requiredAcceptanceFeatures) if (!ids.includes(id)) errors.push(`Missing acceptance feature ${id}.`);
  const covered = new Set(features.flatMap(({ ownerIssues }) => ownerIssues));
  for (const issue of requiredOwnerIssues) if (!covered.has(issue)) errors.push(`Missing owner issue ${issue}.`);
  for (const feature of features) {
    for (const pr of feature.prs) if (!sourceRefs[String(pr)]) errors.push(`${feature.id}: missing exact PR/SHA reference ${pr}.`);
    if (feature.status === "TESTED" && (!feature.checks.length || !feature.evidence.length || !feature.prs.length)) errors.push(`${feature.id}: TESTED needs checks, evidence and source PR/SHA.`);
    if ((feature.status === "DONE" || feature.manualApproval) && (!feature.manualApproval || !feature.manualEvidence)) errors.push(`${feature.id}: manual completion needs named approval evidence.`);
    if (feature.status === "OWNER-DEFERRED" && !feature.id.startsWith("F6.")) errors.push(`${feature.id}: do not defer feasible guest functionality as an optional product.`);
  }
  if (result.data.productStatus === "DONE") errors.push("Development ledger cannot declare production/product acceptance; independent final signoff is separate.");
  return errors;
}

export function renderProductAcceptance(value: ProductAcceptance): string {
  const lines = ["# Product acceptance ledger", "", `Updated ${value.updatedOn}. Status: **${value.productStatus}**.`, "", "Generated from PRODUCT-ACCEPTANCE.json. Run audit:product-acceptance to verify coverage; --markdown reproduces this view. Tests and manual approval are independent. No production or new-content approval is recorded.", "", `Production reference: \`${value.productionSha}\`. Initially at most one genuinely new indexable URL per independently approved weekly release; zero is a valid outcome.`, ""];
  for (let area = 0; area <= 6; area++) {
    lines.push(`## F${area}`, "", "| Feature | Status | Evidence and remaining work |", "| --- | --- | --- |");
    for (const feature of value.features.filter(({ id }) => id.startsWith(`F${area}.`))) {
      const refs = feature.prs.map((pr) => { const ref = value.sourceRefs[String(pr)]; return `[PR${pr}](${ref.url}) at \`${ref.sha.slice(0, 12)}\``; }).join(", ");
      const evidence = feature.evidence.map((path) => `[${path}](${path.startsWith("docs/releases/") ? path.slice("docs/releases/".length) : `../../${path}`})`).join(", ");
      lines.push(`| ${feature.id}: ${feature.title}${feature.ownerIssues.length ? ` (owner ${feature.ownerIssues.join(", ")})` : ""} | ${feature.status} | ${refs}${refs ? ". " : ""}${feature.checks.join("; ")}. ${evidence}. **Remaining:** ${feature.remaining} |`);
    }
    lines.push("");
  }
  return lines.join("\n");
}
