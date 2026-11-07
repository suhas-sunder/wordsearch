import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const source = process.env.COLLECTION_REVIEW_DIRECTORY;
const output = process.env.COLLECTION_REVIEW_OUTPUT;
assert.ok(source && output, "Set COLLECTION_REVIEW_DIRECTORY and outside-repository COLLECTION_REVIEW_OUTPUT");
const local = relative(process.cwd(), resolve(output));
assert.ok(local.startsWith("..") || isAbsolute(local), "Keep screenshots outside the repository");
await mkdir(output, { recursive: true });
const evidence = { source: resolve(source), rows: [], scope: "Local, script-free editorial review documents; no collection approval or public route activation" };
const browser = await chromium.launch();
try {
  for (const id of ["x05", "x06"]) {
    const manifest = JSON.parse(await readFile(resolve(source, `${id}-UNREVIEWED.json`), "utf8"));
    assert.equal(manifest.publicationAuthorized, false);
    assert.equal(manifest.runtimeActivation, false);
    for (const width of [390, 1280]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, javaScriptEnabled: false, colorScheme: "light" });
      const page = await context.newPage();
      const requests = [];
      const errors = [];
      page.on("request", (request) => requests.push(request.url()));
      page.on("pageerror", (error) => errors.push(error.message));
      const url = pathToFileURL(resolve(source, `${id}-UNREVIEWED.html`)).href;
      await page.goto(url);
      assert.equal(await page.getByRole("heading", { level: 1 }).textContent(), manifest.title);
      assert.equal(await page.locator("article").count(), manifest.children.length);
      assert.equal(await page.locator("script,iframe,img,a[href],link[href]").count(), 0);
      assert.equal(await page.locator('meta[name="robots"]').getAttribute("content"), "noindex,nofollow");
      for (let index = 0; index < manifest.children.length; index++) {
        const article = page.locator("article").nth(index);
        assert.deepEqual(await article.locator("h4 + ul").first().locator("li").allTextContents(), manifest.children[index].words);
        assert.ok((await article.textContent()).includes(manifest.children[index].seed));
        assert.ok((await article.textContent()).includes(manifest.children[index].canonicalPath));
      }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
      assert.equal(overflow, false);
      assert.deepEqual(errors, []);
      assert.deepEqual(requests, [url], "Review documents must load no external resources");
      // Preserve the real no-JavaScript proof above. Axe's asynchronous runner
      // needs a separate script-enabled analysis context, even for static files.
      const noScriptBody = await page.locator("body").innerHTML();
      const analysisContext = await browser.newContext({ viewport: { width, height: 1000 }, javaScriptEnabled: true, colorScheme: "light" });
      let axe;
      try {
        const analysis = await analysisContext.newPage();
        const analysisRequests = [];
        const analysisErrors = [];
        analysis.on("request", (request) => analysisRequests.push(request.url()));
        analysis.on("pageerror", (error) => analysisErrors.push(error.message));
        await analysis.goto(url);
        assert.equal(await analysis.locator("body").innerHTML(), noScriptBody, "Axe analyzes the identical reviewed document");
        assert.equal(await analysis.getByRole("heading", { level: 1 }).textContent(), manifest.title);
        assert.equal(await analysis.locator("script,iframe,img,a[href],link[href]").count(), 0, "The analysis document still contains no product scripts or external resources");
        for (let index = 0; index < manifest.children.length; index++) {
          const article = analysis.locator("article").nth(index);
          assert.deepEqual(await article.locator("h4 + ul").first().locator("li").allTextContents(), manifest.children[index].words);
          assert.ok((await article.textContent()).includes(manifest.children[index].seed));
          assert.ok((await article.textContent()).includes(manifest.children[index].canonicalPath));
        }
        axe = await new AxeBuilder({ page: analysis }).analyze();
        assert.deepEqual(axe.violations.filter(({ impact }) => ["serious", "critical"].includes(impact)), []);
        assert.deepEqual(analysisErrors, []);
        assert.deepEqual(analysisRequests, [url], "Axe analysis must not load external resources");
        assert.equal(await analysis.locator("body").innerHTML(), noScriptBody, "Analysis does not alter the reviewed body");
      } finally {
        await analysisContext.close();
      }
      const screenshots = [`${id}-${width}.png`, `${id}-${width}-first-child.png`];
      await page.screenshot({ path: resolve(output, screenshots[0]), fullPage: true });
      await page.locator("article").first().screenshot({ path: resolve(output, screenshots[1]) });
      evidence.rows.push({ id, width, children: manifest.children.length, sourceSha256: manifest.sourceSha256, externalRequests: 0, overflow, noJavaScriptContentChecked: true, axeSeparateIdenticalScriptFreeDocument: true, axeNotices: axe.violations.map(({ id, impact }) => ({ id, impact })), screenshots });
      await writeFile(resolve(output, "manifest.json"), `${JSON.stringify(evidence, null, 2)}\n`);
      await context.close();
      console.log(`PASS ${id} ${width}: exact banks, references, gates, no external requests, no serious/critical axe`);
    }
  }
} finally { await browser.close(); }
