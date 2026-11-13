import { readFile, stat } from "node:fs/promises";
import { measurementBaseline } from "../content/measurement-baseline";
import { releaseMeasurement } from "../lib/analytics/release-measurement";

try {
  const file = process.argv[2];
  if (process.argv.length > 3) throw new Error("Usage: tsx scripts/report-release-cohorts.ts [private-aggregate-evidence.json]");
  if (file && (await stat(file)).size > 1_000_000) throw new Error("Aggregate evidence must be at most 1MB; raw query/page exports are not accepted.");
  const input: unknown = file ? JSON.parse(await readFile(file, "utf8")) : measurementBaseline;
  console.log(JSON.stringify(releaseMeasurement(input), null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : "Invalid aggregate evidence.");
  process.exitCode = 1;
}
