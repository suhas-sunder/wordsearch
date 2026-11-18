import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.BASE_URL ?? "http://127.0.0.1:3276";
const output = process.env.SHARE_VISUAL_OUTPUT;
if (output) await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const colorScheme of ["light", "dark"]) {
    for (const [width, height] of [[320, 900], [390, 900], [768, 1000], [1024, 1000], [1280, 1000], [1600, 1000], [844, 390], [640, 450]]) {
      const context = await browser.newContext({ viewport: { width, height }, colorScheme });
      await context.route("https://pagead2.googlesyndication.com/**", route => route.fulfill({ contentType: "application/javascript", body: "" }));
      await context.addInitScript(() => {
        Object.defineProperty(navigator, "share", { configurable: true, value: undefined });
        Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => { throw new Error("Clipboard unavailable"); } } });
      });
      const page = await context.newPage();
      const providerRequests = [];
      page.on("request", request => { if (new URL(request.url()).hostname === "wa.me") providerRequests.push(request.url()); });
      await page.goto(`${base}/word-search-generator`, { waitUntil: "networkidle" });
      const trigger = page.locator(".preview-toolbar-actions").getByRole("button", { name: "Share", exact: true });
      await trigger.click();
      const dialog = page.getByRole("dialog", { name: "Share this puzzle", exact: true });
      await dialog.locator('img[alt*="QR code"]').waitFor();
      const playUrl = await dialog.getByLabel("Share URL").inputValue();
      const whatsapp = dialog.getByRole("link", { name: "WhatsApp (new tab)", exact: true });
      const email = dialog.getByRole("link", { name: "Email", exact: true });
      assert.equal(await dialog.locator("#share-destination-notice").evaluate(el => Boolean(el.compareDocumentPosition(document.querySelector('[aria-label="Share destinations"]')) & Node.DOCUMENT_POSITION_FOLLOWING)), true, "disclosure precedes destination choice");
      for (const [link, parameter] of [[whatsapp, "text"], [email, "body"]]) {
        const href = new URL(await link.getAttribute("href"));
        assert.equal(href.searchParams.get(parameter), `Solve this word search:\r\n${playUrl}`);
      }
      assert.equal(await whatsapp.getAttribute("target"), "_blank");
      assert.equal(await whatsapp.getAttribute("rel"), "noopener noreferrer");
      assert.equal(await whatsapp.getAttribute("referrerpolicy"), "no-referrer");
      assert.equal(await dialog.getByRole("button", { name: "Share with an app" }).count(), 0);
      await dialog.getByRole("button", { name: "Copy link", exact: true }).click();
      await dialog.getByText("Copy was not available. Select the URL above and copy it manually.").waitFor();
      for (const link of [whatsapp, email]) {
        await link.focus();
        assert.equal(await link.evaluate(el => el === document.activeElement), true);
        await link.scrollIntoViewIfNeeded();
        const bounds = await link.boundingBox();
        assert.ok(bounds && bounds.x >= 0 && bounds.x + bounds.width <= width + 1 && bounds.height >= 40);
      }
      assert.equal(await dialog.evaluate(el => el.scrollWidth > el.clientWidth + 1), false, "dialog horizontal overflow");
      const axe = await new AxeBuilder({ page }).include("dialog[open]").analyze();
      assert.deepEqual(axe.violations, []);
      assert.deepEqual(providerRequests, [], "opening a share dialog must not contact a destination");
      if (output) await page.screenshot({ path: `${output}/${colorScheme}-${width}x${height}.png` });
      // Exercise the real keyboard handoff, but fulfill locally before any provider traffic.
      let interceptedDestination;
      await context.route("https://wa.me/**", route => {
        interceptedDestination = route.request().url();
        return route.fulfill({ contentType: "text/html", body: "<title>Locally intercepted share draft</title>" });
      });
      await whatsapp.focus();
      const popupPromise = page.waitForEvent("popup");
      await page.keyboard.press("Enter");
      const popup = await popupPromise;
      await popup.waitForLoadState();
      assert.equal(interceptedDestination, await whatsapp.getAttribute("href"));
      await popup.close();
      await page.keyboard.press("Escape");
      assert.equal(await trigger.evaluate(el => el === document.activeElement), true);
      results.push({ colorScheme, width, height, providerRequests: 0, axeViolations: 0 });
      await context.close();
    }
  }
  const context = await browser.newContext();
  await context.addInitScript(() => {
    window.shareCalls = [];
    Object.defineProperty(navigator, "share", { configurable: true, value: async data => { window.shareCalls.push(data); throw new DOMException("Canceled", "AbortError"); } });
  });
  const page = await context.newPage();
  await page.goto(`${base}/word-search-generator`, { waitUntil: "networkidle" });
  await page.locator(".preview-toolbar-actions").getByRole("button", { name: "Share", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Share this puzzle" });
  await dialog.getByRole("button", { name: "Share with an app" }).click();
  const calls = await page.evaluate(() => window.shareCalls);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, await dialog.getByLabel("Share URL").inputValue());
  assert.equal(await dialog.locator(".share-status").textContent(), "", "native cancellation is neutral");
  assert.equal(await dialog.isVisible(), true);
  await context.close();
  if (output) await writeFile(`${output}/results.json`, JSON.stringify({ base, results, nativeCancellation: "pass", providerHandoffs: "Not sent; draft destinations checked locally" }, null, 2));
  console.log(`PASS ${results.length} responsive/theme sharing cases, exact URL handoffs, no provider requests, clipboard recovery and neutral native cancellation`);
} finally { await browser.close(); }
