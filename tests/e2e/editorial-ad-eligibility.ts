import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { SITE_URL, getRouteRecord, routeInventory } from "@/content/registry";
import { AD_PLACEMENTS, ADSENSE_CLIENT, ADSENSE_SCRIPT_SRC, ADSENSE_UNITS } from "@/lib/monetization/adsense";
import { draftEditorialRoutes, publishedEditorialExamples } from "../fixtures/editorial-ad-routes";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const exportDir = process.env.EXPORT_DIR ?? "out";
const enabled = process.env.EXPECT_ADSENSE_ENABLED !== "off";
const adNetwork = /googlesyndication|doubleclick|googleadservices|pagead2|adsbygoogle/i;
const adMarkup = /data-ad-(placement|placeholder|client|slot)=|data-ilws-ad[\w-]*=|adsbygoogle\.js|ad-page-frame|ad-below-header-region|ad-seo-region/;
const families = ["categories", "collections", "guides"];
const viewports = [{ width: 390, height: 844 }, { width: 1600, height: 1000 }];
const sitemap = await readFile(join(exportDir, "sitemap.xml"), "utf8");
const nonSidebarPlacements = AD_PLACEMENTS.filter((placement) => !placement.startsWith("sidebar-"));

const staticRoutes = await Promise.all(families.map(async (family) => {
  const files = await readdir(join(exportDir, family), { withFileTypes: true });
  return Promise.all(files.filter((entry) => entry.isFile() && entry.name.endsWith(".html")).map(async ({ name }) => {
    const path = `/${family}/${name.slice(0, -5)}`;
    const html = await readFile(join(exportDir, family, name), "utf8");
    const robots = html.match(/<meta name="robots" content="([^"]+)"/)?.[1];
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    const placements = [...html.matchAll(/data-ad-placement="([^"]+)"/g)].map((match) => match[1]).sort();
    const unitSlots = [...html.matchAll(/data-ad-slot="([^"]+)"/g)].map((match) => match[1]).sort();
    const record = getRouteRecord(path);
    assert.ok(record, `${path}: exported route has no registry record`);
    const draft = !record.indexable || record.publicationStatus !== "published";
    assert.equal(robots, draft ? "noindex, follow" : "index, follow", `${path}: robots`);
    assert.equal(canonical, `${SITE_URL}${path}`, `${path}: canonical`);
    assert.equal(sitemap.includes(`<loc>${canonical}</loc>`), !draft, `${path}: sitemap inclusion`);
    assert.deepEqual(placements, draft ? [] : [...AD_PLACEMENTS].sort(), `${path}: static placements`);
    assert.deepEqual(unitSlots, enabled && !draft ? nonSidebarPlacements.map((placement) => ADSENSE_UNITS[placement].slot).sort() : [], `${path}: static unit IDs`);
    if (draft) assert.doesNotMatch(html, adMarkup, `${path}: static ad markup`);
    return {
      path, publicationStatus: record.publicationStatus, indexable: record.indexable, robots, canonical, placements, unitSlots,
      sha256: createHash("sha256").update(html).digest("hex")
    };
  }));
}));
const inventory = staticRoutes.flat().sort((left, right) => left.path.localeCompare(right.path));
const registryPaths = routeInventory
  .filter((record) => !record.redirectTarget && families.includes(record.canonicalPath.split("/")[1]) && record.canonicalPath.split("/").length === 3)
  .map((record) => record.canonicalPath)
  .sort((left, right) => left.localeCompare(right));
assert.deepEqual(inventory.map((entry) => entry.path), registryPaths, "exported editorial routes match the registry");
assert.deepEqual(inventory.filter((entry) => !entry.indexable).map((entry) => entry.path), [...draftEditorialRoutes]);

const browser = await chromium.launch();
const boundaries = [];
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    await context.route(adNetwork, async (route) => {
      if (route.request().url() === ADSENSE_SCRIPT_SRC && enabled) {
        await route.fulfill({ contentType: "application/javascript", body: "" });
      } else {
        await route.abort();
      }
    });
    for (const path of [...draftEditorialRoutes, ...publishedEditorialExamples]) {
      const draft = draftEditorialRoutes.some((candidate) => candidate === path);
      const label = `${viewport.width}px ${path}`;
      const page = await context.newPage();
      const requests: string[] = [];
      const pageErrors: string[] = [];
      page.on("request", (request) => {
        if (adNetwork.test(request.url())) requests.push(request.url());
      });
      page.on("pageerror", (error) => pageErrors.push(error.message));
      const response = await page.goto(new URL(path, baseUrl).href, { waitUntil: "networkidle" });
      assert.equal(response?.status(), 200, `${label}: HTTP status`);
      assert.deepEqual(pageErrors, [], `${label}: runtime errors`);
      const placements = await page.locator("[data-ad-placement]").evaluateAll((elements) =>
        elements.map((element) => element.getAttribute("data-ad-placement")).sort()
      );
      assert.deepEqual(placements, draft ? [] : [...AD_PLACEMENTS].sort(), `${label}: placements`);
      const placeholders = await page.locator("[data-ad-placeholder]").count();
      const loader = await page.locator("script[data-ilws-adsense-loader]").count();
      const pushes = await page.evaluate(() => (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle?.length ?? 0);
      const units = await page.locator("ins.adsbygoogle, [data-ad-client], [data-ad-slot]").evaluateAll((elements) =>
        elements.map((element) => ({
          client: element.getAttribute("data-ad-client"),
          placement: element.closest("[data-ad-placement]")?.getAttribute("data-ad-placement"),
          slot: element.getAttribute("data-ad-slot")
        }))
      );
      const live = enabled && !draft;
      assert.equal(loader, live ? 1 : 0, `${label}: installed loader`);
      assert.deepEqual(requests, live ? [ADSENSE_SCRIPT_SRC] : [], `${label}: provider requests`);
      assert.equal(pushes, units.length, `${label}: requested units`);
      if (live) {
        const expectedUnits = viewport.width >= 1600 ? AD_PLACEMENTS : nonSidebarPlacements;
        assert.deepEqual(units.sort((left, right) => (left.placement ?? "").localeCompare(right.placement ?? "")),
          [...expectedUnits].sort().map((placement) => ({ client: ADSENSE_CLIENT, placement, slot: ADSENSE_UNITS[placement].slot })),
          `${label}: responsive live units`);
      } else {
        assert.deepEqual(units, [], `${label}: no live units`);
        assert.equal(placeholders, draft ? 0 : AD_PLACEMENTS.length, `${label}: disabled placeholders`);
      }
      boundaries.push({ path, width: viewport.width, placements, placeholders, loader, pushes, units, requests });
      await page.close();
    }
    await context.close();
  }
} finally {
  await browser.close();
}

console.log(JSON.stringify({ enabled, providerIntercepted: true, inventory, boundaries }, null, 2));
