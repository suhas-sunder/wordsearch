import { readFileSync } from "node:fs";
import { routeInventory } from "@/content/registry";

export function sourceInventory(redirectText: string, catalogText: string) {
  const redirects = redirectText.split(/\r?\n/).flatMap((line) => {
    const match = line.match(/^\s*(\/\S+)\s+(\/\S+)\s+(301!?)\s*$/);
    return match ? [{ source: match[1], target: match[2], status: match[3] }] : [];
  });
  // Catalog identifiers are references to proposals or batches, not public paths.
  const ids = new Set(catalogText.match(/\b(?:X|H|L|T|G|P|F|U|M|Q|B)\d{2}\b/g) ?? []);
  for (const match of catalogText.matchAll(/\b([A-Z])(\d{2})\s*[–-]\s*(?:\1)?(\d{2})\b/g)) {
    const start = Number(match[2]), end = Number(match[3]);
    if (end >= start && end - start <= 100) for (let n = start; n <= end; n++) ids.add(`${match[1]}${String(n).padStart(2, "0")}`);
  }
  for (const match of catalogText.matchAll(/\bL-[A-E]\b/g)) ids.add(match[0]);
  return {
    records: routeInventory.map(({ id, canonicalPath, contentType, publicationStatus, indexable, redirectTarget }) => ({ id, canonicalPath, contentType, publicationStatus, indexable, ...(redirectTarget ? { redirectTarget } : {}) })),
    redirects,
    catalogIds: [...ids].sort().map((id) => ({ id, status: "proposal-or-existing-reference" as const, source: "ai-issues/2026-11-06-buildout-catalog-and-release-queue.md" }))
  };
}

export function readSourceInventory() {
  return sourceInventory(readFileSync("public/_redirects", "utf8"), readFileSync("ai-issues/2026-11-06-buildout-catalog-and-release-queue.md", "utf8"));
}

