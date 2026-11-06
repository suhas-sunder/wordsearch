import { readFileSync } from "node:fs";
import type { StagedPuzzleCandidate } from "@/content/staged/model";
import { routeInventory } from "@/content/registry";
import { auditCandidates } from "@/lib/content/candidates";
import { readSourceInventory } from "@/lib/content/inventory";

const path = process.argv[2];
if (!path) throw new Error("Usage: npm run audit:candidates -- candidates.json");
const candidates: StagedPuzzleCandidate[] = JSON.parse(readFileSync(path, "utf8"));
if (!Array.isArray(candidates)) throw new Error("Candidate input must be an array.");
const issues = auditCandidates(candidates, routeInventory, readSourceInventory().redirects.map((r) => r.source));
console.log(JSON.stringify({ candidateCount: candidates.length, issues }, null, 2));
if (issues.length) process.exitCode = 1;
