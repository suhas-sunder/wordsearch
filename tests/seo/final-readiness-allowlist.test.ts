import { readFileSync } from "node:fs";
import { expect, test } from "vitest";

test("final readiness changes only the exact privacy editorial field after issue117", () => {
  const delta = JSON.parse(readFileSync("tests/seo/final-readiness-delta-allowlist.json", "utf8"));
  const prior = JSON.parse(readFileSync("tests/seo/issue117-semantic-allowlist.json", "utf8"));
  expect(delta).toHaveLength(1);
  const row = delta[0];
  expect(row.path).toBe("/privacy");
  expect(row.field).toBe("body.editorial");
  expect(row.paths).toBeUndefined();
  expect(row.beforeSha256).toMatch(/^[a-f0-9]{64}$/u);
  expect(row.afterSha256).toMatch(/^[a-f0-9]{64}$/u);
  expect(row.beforeSha256).not.toBe(row.afterSha256);
  const previous = prior.find((entry: { path?: string; paths?: string[]; field: string }) =>
    (entry.path === row.path || entry.paths?.includes(row.path)) && entry.field === row.field);
  expect(previous.afterSha256).toBe(row.beforeSha256);
  expect(row.reviewDisposition).toBe("technical-intent-recorded");
  expect(row.reviewReference).toBe("docs/releases/FINAL-READINESS-ADS.md");
});
