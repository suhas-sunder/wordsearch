import test from "node:test";
import assert from "node:assert/strict";
import { originOnly, summarizeDiagnostic } from "./lighthouse-diagnostic-summary.mjs";

test("diagnostic evidence excludes cookie values, identifiers, paths, queries and raw issue strings", () => {
  const secret = "DO_NOT_PERSIST_COOKIE_OR_TOKEN";
  const url = `https://user:${secret}@provider.example/private/${secret}?token=${secret}#${secret}`;
  const result = summarizeDiagnostic({
    lhr: {
      lighthouseVersion: "13.4.1", fetchTime: "2026-11-07T01:00:00Z",
      environment: { hostUserAgent: `Chrome/157.0.0.0 ${secret}` },
      categories: { "best-practices": { score: 0.77, auditRefs: [{ id: "third-party-cookies", weight: 1 }, { id: "informative", weight: 0 }] } },
      audits: {
        "third-party-cookies": { score: 0, details: { items: [{ name: secret, rawCookieLine: secret, value: secret, url }] } },
        "inspector-issues": { score: 0, details: { items: [{ issueType: "Cookie", subItems: { items: [{ url }] } }, { issueType: secret }] } },
        informative: { score: 0 }
      }
    },
    artifacts: { InspectorIssues: { cookieIssue: [{ cookie: { name: secret, value: secret }, rawCookieLine: secret, request: { url, requestId: secret }, cookieWarningReasons: ["WarnThirdPartyPhaseout"], cookieExclusionReasons: [] }] } }
  });
  assert.equal(JSON.stringify(result).includes(secret), false);
  assert.equal(JSON.stringify(result).includes("/private/"), false);
  assert.equal(JSON.stringify(result).includes("token="), false);
  assert.deepEqual(result.cookieAudit, { score: 0, count: 1, origins: ["https://provider.example"] });
  assert.deepEqual(result.failedWeightedAuditIds["best-practices"], ["third-party-cookies"]);
  assert.deepEqual(result.inspectorAudit.artifacts[0].cookieReasons, ["WarnThirdPartyPhaseout"]);
  assert.equal(result.inspectorAudit.categories[1].category, "Other issue category");
  assert.equal(result.scores["best-practices"], 77);
});

test("invalid and non-network URLs do not enter evidence", () => {
  for (const url of ["not a URL", "data:text/plain,secret", "file:///secret"]) assert.equal(originOnly(url), null);
});
