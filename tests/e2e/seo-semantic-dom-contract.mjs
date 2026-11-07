import assert from "node:assert/strict";
import { chromium } from "playwright";
import { semanticDocument } from "./seo-semantic-dom.mjs";
import { semanticHash } from "./seo-semantic-compare.mjs";

const html = `<html><head><title>Original &amp; useful</title><meta name="description" content="Original description"><script type="application/ld+json">{"@type":"WebPage","name":"Original"}</script></head><body><header class="site-header"><a href="/tool">Tools</a></header><main><h1>Original puzzle</h1><header><h2>Nested article heading</h2><p>Article header guidance.</p></header><footer><p>Article closing guidance.</p></footer><p>Substantive unchanged paragraph.</p><a href="#answers">Answers</a><section class="tools-section"><h2>All tools</h2><p>Shared wording is still protected.</p></section><section><fieldset data-collection-controls><legend>Find</legend></fieldset><p hidden>No results</p><p>Editorial guidance stays here.</p></section><section class="above-fold-builder"><header>Printable brand</header><footer>Printable QR help</footer></section><textarea>CAT\nDOG</textarea><svg aria-hidden="true"><text>DECORATIVE</text></svg><noscript>No-script recovery</noscript></main><footer class="site-footer">Truthful author</footer><a href="/cdn-cgi/content?id=opaque-generated-value" rel="nofollow noopener"></a></body></html>`;
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const extract = (source) => page.evaluate(semanticDocument, { html: source, origin: "https://preview.test", canonicalOrigin: "https://www.ilovewordsearch.com", path: "/published-puzzle" });
  const original = await extract(html);
  assert.equal(original.title, "Original & useful");
  assert.match(original.body.editorial, /Substantive unchanged paragraph/u);
  assert.match(original.body.editorial, /Editorial guidance stays here/u);
  assert.match(original.body.editorial, /Article header guidance/u);
  assert.match(original.body.editorial, /Article closing guidance/u);
  assert.equal(original.headings.find((heading) => heading.text === "Nested article heading").partition, "editorial");
  assert.equal(original.body["interactive-ui"], "Find No results Printable brand Printable QR help");
  assert.equal(original.body.header, "Tools");
  assert.equal(original.body["shared-tools"], "All tools Shared wording is still protected.");
  assert.equal(original.body.footer, "Truthful author");
  assert.equal(original.links.editorial[0].href, "/published-puzzle#answers");
  assert.deepEqual(original.vocabulary, ["CAT DOG"]);
  assert.deepEqual(original.noscript, ["No-script recovery"]);
  assert.deepEqual(original.providerLinks, [{ path: "/cdn-cgi/content", queryKeys: ["id"], label: "", rel: "nofollow noopener" }]);
  assert.deepEqual((await extract(html.replace("opaque-generated-value", "another-generated-value"))).providerLinks, original.providerLinks);
  for (const [old, replacement, partition] of [
    ["Substantive unchanged paragraph.", "Accidental editorial rewrite.", "editorial"],
    ["Shared wording is still protected.", "Unexpected shared rewrite.", "shared-tools"],
    ["Truthful author", "Invented author claim", "footer"],
    ["No results", "Changed recovery", "interactive-ui"]
  ]) assert.notEqual(semanticHash((await extract(html.replace(old, replacement))).body[partition]), semanticHash(original.body[partition]));
  assert.notDeepEqual((await extract(html.replace('href="/tool"', 'href="/wrong"'))).links.header, original.links.header);
  assert.notDeepEqual((await extract(html.replace("CAT", "RAT"))).vocabulary, original.vocabulary);
  assert.notDeepEqual((await extract(html.replace('"Original"', '"Changed"'))).schema, original.schema);
  console.log(JSON.stringify({ passed: true, editorialSharedFooterRecoveryMutationsDetected: 4, internalLinksVocabularySchemaDetected: 3, relativeFragmentResolvedAgainstActualRoute: true, providerOnlyOpaqueQueryNoiseSeparated: true }));
} finally { await browser.close(); }
