import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const base = process.env.BASE_URL;
const output = process.env.CLASSROOM_CANCEL_OUTPUT;
assert.ok(base && output, "Set BASE_URL and outside-Git CLASSROOM_CANCEL_OUTPUT");
await mkdir(output, { recursive: true });
const report = { base, cases: [], failures: [] };
const browser = await chromium.launch();
try {
  for (const action of ["title", "pages", "seed-choice", "unmount", "unmount-reject"]) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
    await context.route("https://pagead2.googlesyndication.com/**", route => route.fulfill({ contentType: "application/javascript", body: "" }));
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.__packAnchorClicks = 0;
      document.addEventListener("click", event => {
        if (event.target instanceof Element && event.target.closest("a[download]")) window.__packAnchorClicks++;
      });
    });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    const downloads = [];
    page.on("download", download => downloads.push(download));
    await page.goto(`${base}/pack-builder`, { waitUntil: "networkidle" });
    await page.getByLabel("Pack title", { exact: true }).fill("Before edit");
    await page.getByLabel("Words or phrases", { exact: true }).fill("CAT\nDOG\nBIRD");
    await page.getByLabel("Base seed", { exact: true }).fill("classroom-cancellation");
    let release;
    const gate = new Promise(resolveGate => { release = resolveGate; });
    let observed;
    const held = new Promise(resolveHeld => { observed = resolveHeld; });
    let heldUrl;
    await context.route("**/_next/static/chunks/**", async route => {
      const response = await route.fetch();
      const body = await response.text();
      if (!heldUrl && body.includes("Invalid pack identity.")) {
        heldUrl = route.request().url();
        observed();
        await gate;
        if (action === "unmount-reject") { await route.abort("failed"); return; }
      }
      await route.fulfill({ response, body });
    });
    try {
      await page.getByRole("button", { name: "Download PDF pack", exact: true }).click();
      let timer;
      try { await Promise.race([held, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("PDF module did not reach the controlled gate")), 15000); })]); }
      finally { clearTimeout(timer); }
      if (action === "title") await page.getByLabel("Pack title", { exact: true }).fill("After edit");
      if (action === "pages") await page.getByLabel("Download pages", { exact: true }).selectOption("answers");
      if (action === "seed-choice") {
        await page.getByRole("button", { name: "Choose for me: Base seed", exact: true }).click();
        assert.match(await page.getByLabel("Base seed", { exact: true }).inputValue(), /^classroom-[a-f0-9]{16}$/);
      }
      if (action.startsWith("unmount")) {
        await page.locator('.site-header a[href="/"]').first().click();
        await page.waitForURL(`${base}/`);
        await page.getByRole("heading", { name: "Word Search Pack Builder", exact: true }).waitFor({ state: "detached" });
      }
      release();
      if (action.startsWith("unmount")) await page.waitForLoadState("networkidle");
      else {
        await page.getByRole("button", { name: "Download PDF pack", exact: true }).waitFor();
      }
      // Any late anchor click is observed synchronously, before its browser download event.
      await page.evaluate(() => new Promise(resolveFrame => requestAnimationFrame(() => requestAnimationFrame(resolveFrame))));
      const clicks = await page.evaluate(() => window.__packAnchorClicks);
      const staleFiles = [];
      for (let index = 0; index < downloads.length; index++) {
        const file = resolve(output, `stale-${action}-${index + 1}.pdf`);
        await downloads[index].saveAs(file);
        staleFiles.push(file);
      }
      report.cases.push({ action, heldUrl, staleAnchorClicks: clicks, staleDownloads: downloads.length, staleFiles });
      await writeFile(resolve(output, "report.json"), JSON.stringify(report, null, 2));
      assert.equal(clicks, 0, `${action}: an outdated pack must not create a download anchor`);
      assert.equal(downloads.length, 0, `${action}: an outdated pack must not download`);
      if (!action.startsWith("unmount")) {
        await page.getByRole("status").filter({ hasText: "Your settings changed" }).waitFor();
        const pending = page.waitForEvent("download");
        await page.getByRole("button", { name: "Download PDF pack", exact: true }).click();
        const download = await pending;
        const file = resolve(output, `${action}-current.pdf`);
        await download.saveAs(file);
        const task = getDocument({ data: new Uint8Array(await readFile(file)), useSystemFonts: true });
        try {
          const pdf = await task.promise;
          assert.equal(pdf.numPages, action === "pages" ? 5 : 10);
          for (let number = 1; number <= pdf.numPages; number++) {
            const text = (await (await pdf.getPage(number)).getTextContent()).items.map(item => "str" in item ? item.str : "").join(" ");
            assert.ok(text.includes(action === "title" ? "After edit" : "Before edit"));
            if (action === "pages") assert.match(text, /Answer Key/);
          }
        } finally { await task.destroy(); }
      }
      assert.deepEqual(errors, []);
      await page.screenshot({ path: resolve(output, `${action}.png`) });
    } finally { release(); await context.close(); }
  }
} catch (error) {
  report.failures.push(error.message);
  throw error;
} finally {
  await browser.close();
  await writeFile(resolve(output, "report.json"), JSON.stringify(report, null, 2));
}
console.log("PASS classroom settings/unmount cancellation, no stale files or errors, and exact current title/page-selection recovery.");
