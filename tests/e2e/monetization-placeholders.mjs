import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const adsenseEnabled = process.env.EXPECT_ADSENSE_ENABLED === "on";
const adsenseClient = "ca-pub-4810616735714570";
const adsenseLoader = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`;
const placementSlots = {
  "top-banner": "6498435012",
  "below-header-banner": "8471746257",
  "sidebar-left": "3872271670",
  "sidebar-right": "5709851549",
  "seo-section-square": "4396769879",
  "above-footer-banner": "7230906061"
};
const eligibleRoutes = [
  { route: "/", anchor: ".home-hero", square: true },
  { route: "/word-search-generator", anchor: ".above-fold-builder", square: true },
  { route: "/free-printable-word-searches", anchor: ".hub-hero", square: true },
  { route: "/collections/hard-printable-word-searches", anchor: ".hub-hero", square: true },
  { route: "/word-searches/animals/dog-word-search", anchor: ".above-fold-builder", square: true },
  { route: "/categories/animals-word-searches", anchor: ".hub-hero", square: true },
  { route: "/collections/easy-printable-word-searches", anchor: ".hub-hero", square: true },
  { route: "/guides/how-to-print-a-word-search", anchor: ".hub-hero", square: true },
  { route: "/topics", anchor: ".hub-hero", square: false }
];
const adFreeRoutes = [
  "/privacy",
  "/terms",
  "/copyright",
  "/accessibility",
  "/contact",
  "/editorial-policy",
  "/search?q=animals",
  "/print",
  "/pdf",
  "/answer-key",
  "/play",
  "/embed",
  "/custom",
  "/definitely-not-a-real-page"
];
const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 900 },
  { name: "desktop", width: 1280, height: 960 },
  { name: "large-desktop", width: 1600, height: 1000 },
  { name: "ultra-wide", width: 1920, height: 1080 }
];
const failures = [];
const externalAdRequests = new Set();
const contentWidths = new Map();
const browser = await chromium.launch({ headless: true });

function check(condition, message) {
  if (!condition) failures.push(message);
}

function expectedLivePlacements(width, square) {
  const placements = ["below-header-banner", "above-footer-banner"];
  if (square) placements.push("seo-section-square");
  if (width >= 768) placements.push("top-banner");
  if (width >= 1600) placements.push("sidebar-left", "sidebar-right");
  return placements.sort();
}

async function waitForRequestedUnits(page, count) {
  await page.waitForFunction(
    (expected) => document.querySelectorAll("ins.adsbygoogle[data-ilws-ad-unit='true'][data-ilws-ad-requested='true']").length === expected,
    count
  );
}

async function waitForFallbackCount(page, count) {
  await page.waitForFunction(
    (expected) => [...document.querySelectorAll(".ad-slot-live-fallback")].filter((element) => !element.hidden).length === expected,
    count
  );
}

async function setPlacementStatus(page, placement, status) {
  await page.locator(`[data-ad-placement='${placement}'] ins.adsbygoogle`).evaluate(
    (element, nextStatus) => element.setAttribute("data-ad-status", nextStatus),
    status
  );
}

async function setAllUnitStatuses(page, status) {
  await page.locator("ins.adsbygoogle[data-ilws-ad-unit='true']").evaluateAll((elements, nextStatus) => {
    elements.forEach((element, index) => {
      element.setAttribute("data-ad-status", index % 2 === 0 && nextStatus === "unfilled" ? "unfill-optimized" : nextStatus);
    });
  }, status);
}

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  if (adsenseEnabled) {
    await context.route("https://pagead2.googlesyndication.com/**", async (route) => {
      await route.fulfill({
        contentType: "application/javascript",
        body: "window.__ilwsMockAdSenseLoaderLoads = (window.__ilwsMockAdSenseLoaderLoads || 0) + 1;"
      });
    });
  }
  context.on("request", (request) => {
    if (/googlesyndication|doubleclick|googleadservices|pagead2|adsbygoogle/i.test(request.url())) {
      externalAdRequests.add(request.url());
    }
  });

  for (const { route, anchor, square } of eligibleRoutes) {
    const page = await context.newPage();
    const pageAdRequests = [];
    const runtimeErrors = [];
    page.on("pageerror", (error) => runtimeErrors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") runtimeErrors.push(message.text());
    });
    page.on("request", (request) => {
      if (/googlesyndication|doubleclick|googleadservices|pagead2|adsbygoogle/i.test(request.url())) pageAdRequests.push(request.url());
    });
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    check(Boolean(response) && response.status() < 400, `${viewport.name} ${route}: route did not load successfully`);

    if (adsenseEnabled) {
      const expectedPlacements = expectedLivePlacements(viewport.width, square);
      await waitForRequestedUnits(page, expectedPlacements.length);
      const units = page.locator("ins.adsbygoogle[data-ilws-ad-unit='true']");
      check(await units.count() === expectedPlacements.length, `${viewport.name} ${route}: unexpected live-unit count`);
      const livePlacements = (await units.evaluateAll((elements) => elements.map((element) => element.closest("[data-ad-placement]")?.getAttribute("data-ad-placement")).filter(Boolean))).sort();
      check(JSON.stringify(livePlacements) === JSON.stringify(expectedPlacements), `${viewport.name} ${route}: live placement eligibility mismatch`);
      for (const placement of expectedPlacements) {
        const unit = page.locator(`[data-ad-placement='${placement}'] ins.adsbygoogle`);
        check(await unit.getAttribute("data-ad-client") === adsenseClient, `${viewport.name} ${route}: publisher mismatch for ${placement}`);
        check(await unit.getAttribute("data-ad-slot") === placementSlots[placement], `${viewport.name} ${route}: slot mismatch for ${placement}`);
        check(await unit.getAttribute("data-ad-format") === null, `${viewport.name} ${route}: auto format leaked into ${placement}`);
        check(await unit.getAttribute("data-full-width-responsive") === null, `${viewport.name} ${route}: full-width auto sizing leaked into ${placement}`);
      }
      const pushCount = await page.evaluate(() => window.adsbygoogle?.length ?? 0);
      check(pushCount === expectedPlacements.length, `${viewport.name} ${route}: duplicate or missing unit initialization`);
      check(await page.locator("head script[data-ilws-adsense-loader='true']").count() === 1, `${viewport.name} ${route}: loader was not installed once in the document head`);
      check(pageAdRequests.filter((url) => url === adsenseLoader).length === 1, `${viewport.name} ${route}: shared loader request count was not one`);
      check(pageAdRequests.every((url) => url === adsenseLoader), `${viewport.name} ${route}: unexpected advertising request escaped interception`);
    } else {
      const slots = page.locator("[data-ad-placeholder='true']");
      check(await slots.count() === (square ? 6 : 5), `${viewport.name} ${route}: unexpected placeholder count`);
      const labels = await slots.allTextContents();
      check(labels.every((label) => label.trim() === "Advertisements"), `${viewport.name} ${route}: placeholder label changed`);
      check(await slots.locator("a, button, input, select, textarea").count() === 0, `${viewport.name} ${route}: placeholder became interactive`);
      check(await page.locator("ins.adsbygoogle, [data-ad-client], [data-ad-slot]").count() === 0, `${viewport.name} ${route}: disabled mode exposed a live unit`);
      check(pageAdRequests.length === 0, `${viewport.name} ${route}: disabled mode requested the loader or advertising resource`);
    }
    check(runtimeErrors.length === 0, `${viewport.name} ${route}: runtime errors: ${runtimeErrors.join(" | ")}`);

    const top = page.locator("[data-ad-placement='top-banner']");
    const topRegion = page.locator(".ad-top-region");
    const left = page.locator("[data-ad-placement='sidebar-left']");
    const right = page.locator("[data-ad-placement='sidebar-right']");
    check(await top.isVisible() === (viewport.width >= 768), `${viewport.name} ${route}: top-banner visibility mismatch`);
    check(await topRegion.isVisible() === (viewport.width >= 768), `${viewport.name} ${route}: top region visibility mismatch`);
    check(await left.isVisible() === (viewport.width >= 1600), `${viewport.name} ${route}: left sidebar visibility mismatch`);
    check(await right.isVisible() === (viewport.width >= 1600), `${viewport.name} ${route}: right sidebar visibility mismatch`);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(overflow <= 1, `${viewport.name} ${route}: horizontal overflow of ${overflow}px`);

    const headerBox = await page.locator(".site-header").boundingBox();
    const topBox = await top.boundingBox();
    const topRegionBox = await topRegion.boundingBox();
    const pageFrameBox = await page.locator(".ad-page-frame").boundingBox();
    if (viewport.width < 768) {
      check(topRegionBox === null, `${viewport.name} ${route}: hidden top region still consumes layout space`);
      if (headerBox && pageFrameBox) check(Math.abs(pageFrameBox.y - (headerBox.y + headerBox.height)) <= 1, `${viewport.name} ${route}: blank top-ad gap remains below the header`);
    } else {
      check(Boolean(topRegionBox), `${viewport.name} ${route}: top region is missing`);
      if (topBox) {
        const expectedTopSize = viewport.width >= 1024 ? { width: 728, height: 90 } : { width: 468, height: 60 };
        check(Math.abs(topBox.width - expectedTopSize.width) <= 1, `${viewport.name} ${route}: top-banner width mismatch`);
        check(Math.abs(topBox.height - expectedTopSize.height) <= 1, `${viewport.name} ${route}: top-banner height mismatch`);
      }
      if (topRegionBox && pageFrameBox) check(pageFrameBox.y >= topRegionBox.y + topRegionBox.height, `${viewport.name} ${route}: page content overlaps the top region`);
    }
    if (topBox && headerBox) check(topBox.y >= headerBox.y + headerBox.height, `${viewport.name} ${route}: top banner overlaps the header`);

    const anchorBox = await page.locator(anchor).first().boundingBox();
    const belowBox = await page.locator("[data-ad-placement='below-header-banner']").boundingBox();
    if (anchorBox && belowBox) check(belowBox.y >= anchorBox.y + anchorBox.height, `${viewport.name} ${route}: below-header banner precedes its page introduction`);

    const aboveFooter = await page.locator("[data-ad-placement='above-footer-banner']").boundingBox();
    const footer = await page.locator(".site-footer").boundingBox();
    if (aboveFooter && footer) check(aboveFooter.y + aboveFooter.height <= footer.y, `${viewport.name} ${route}: above-footer banner is inside or below the footer`);
    check(await page.locator(".site-footer [data-ad-placeholder='true']").count() === 0, `${viewport.name} ${route}: footer contains a placeholder`);
    check(await page.locator(".preview-toolbar [data-ad-placeholder='true'], .builder-controls [data-ad-placeholder='true'], .puzzle-grid [data-ad-placeholder='true']").count() === 0, `${viewport.name} ${route}: puzzle controls contain a placeholder`);

    if (square) {
      check(await page.locator("[data-ad-placement='seo-section-square']").count() === 1, `${viewport.name} ${route}: SEO square missing`);
      check(await page.locator(".preview-toolbar [data-ad-placement='seo-section-square'], .builder-controls [data-ad-placement='seo-section-square']").count() === 0, `${viewport.name} ${route}: SEO square entered interactive controls`);
    }

    if (route === "/word-search-generator" && [1280, 1600, 1920].includes(viewport.width)) {
      const contentBox = await page.locator(".above-fold-builder").boundingBox();
      if (contentBox) contentWidths.set(viewport.width, contentBox.width);
    }
    await page.close();
  }
  await context.close();
}

if (adsenseEnabled) {
  async function openStatePage(width, route = "/", square = true) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } });
    await context.route("https://pagead2.googlesyndication.com/**", async (requestRoute) => {
      await requestRoute.fulfill({ contentType: "application/javascript", body: "" });
    });
    const page = await context.newPage();
    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    await waitForRequestedUnits(page, expectedLivePlacements(width, square).length);
    return { context, page };
  }

  // A. Every requested unit is pending, so no page-wide fallback is visible.
  {
    const { context, page } = await openStatePage(1280);
    await waitForFallbackCount(page, 0);
    check(await page.locator(".ad-slot-live-fallback:not([hidden])").count() === 0, "A: pending units exposed fallback placeholders");
    await context.close();
  }

  // B. All requested units resolve empty, so every eligible position shows fallback.
  {
    const { context, page } = await openStatePage(1280);
    await setAllUnitStatuses(page, "unfilled");
    await waitForFallbackCount(page, 4);
    check(await page.locator(".ad-slot-live-fallback:not([hidden])").count() === 4, "B: all-unfilled did not expose every eligible fallback");
    await context.close();
  }

  // C and F. One fill suppresses all fallbacks and remains latched after becoming unfilled.
  {
    const { context, page } = await openStatePage(1280);
    await setAllUnitStatuses(page, "unfilled");
    await setPlacementStatus(page, "below-header-banner", "filled");
    await waitForFallbackCount(page, 0);
    check(await page.locator(".ad-slot-live-fallback:not([hidden])").count() === 0, "C: a filled unit did not suppress fallback page-wide");
    await setPlacementStatus(page, "below-header-banner", "unfilled");
    await page.waitForTimeout(50);
    check(await page.locator(".ad-slot-live-fallback:not([hidden])").count() === 0, "F: FILLED latch was lost after a later unfilled status");
    await context.close();
  }

  // D. A mixture of unfilled and unresolved units remains pending.
  {
    const { context, page } = await openStatePage(1280);
    await setPlacementStatus(page, "below-header-banner", "unfilled");
    await page.waitForTimeout(50);
    check(await page.locator(".ad-slot-live-fallback:not([hidden])").count() === 0, "D: partial unfilled state exposed fallbacks while other units were pending");
    await context.close();
  }

  // E. A late fill removes every fallback after an all-unfilled EMPTY state.
  {
    const { context, page } = await openStatePage(1280);
    await setAllUnitStatuses(page, "unfilled");
    await waitForFallbackCount(page, 4);
    await setPlacementStatus(page, "above-footer-banner", "filled");
    await waitForFallbackCount(page, 0);
    check(await page.locator(".ad-slot-live-fallback:not([hidden])").count() === 0, "E: late fill left a page fallback visible");
    await context.close();
  }

  // G. A definitive loader error before fill transitions the whole page to EMPTY.
  {
    const { context, page } = await openStatePage(1280);
    await page.locator("head script[data-ilws-adsense-loader='true']").evaluate((script) => script.dispatchEvent(new Event("error")));
    await waitForFallbackCount(page, 4);
    check(await page.locator(".ad-slot-live-fallback:not([hidden])").count() === 4, "G: loader error before fill did not expose every fallback");
    await context.close();
  }

  // H. A loader error after fill cannot undo the sticky FILLED state.
  {
    const { context, page } = await openStatePage(1280);
    await setPlacementStatus(page, "below-header-banner", "filled");
    await waitForFallbackCount(page, 0);
    await page.locator("head script[data-ilws-adsense-loader='true']").evaluate((script) => script.dispatchEvent(new Event("error")));
    await page.waitForTimeout(50);
    check(await page.locator(".ad-slot-live-fallback:not([hidden])").count() === 0, "H: loader error after fill overrode the FILLED latch");
    await context.close();
  }

  // I. Responsive registration excludes suppressed units, adds newly eligible units as pending, and preserves FILLED through resize.
  {
    const { context, page } = await openStatePage(390);
    await setAllUnitStatuses(page, "unfilled");
    await waitForFallbackCount(page, 3);
    await page.setViewportSize({ width: 1280, height: 1000 });
    await waitForRequestedUnits(page, 4);
    await waitForFallbackCount(page, 0);
    await setPlacementStatus(page, "top-banner", "unfilled");
    await waitForFallbackCount(page, 4);
    await setPlacementStatus(page, "below-header-banner", "filled");
    await waitForFallbackCount(page, 0);
    await page.setViewportSize({ width: 1600, height: 1000 });
    await waitForRequestedUnits(page, 6);
    await setAllUnitStatuses(page, "unfilled");
    await page.waitForTimeout(50);
    check(await page.locator(".ad-slot-live-fallback:not([hidden])").count() === 0, "I: FILLED latch was lost when sidebars registered or statuses changed");
    await page.setViewportSize({ width: 390, height: 1000 });
    await waitForRequestedUnits(page, 3);
    check(await page.locator("ins[data-ad-slot='6498435012'], ins[data-ad-slot='3872271670'], ins[data-ad-slot='5709851549']").count() === 0, "I: viewport-suppressed units remained registered below their breakpoints");
    check(await page.locator(".ad-slot-live-fallback:not([hidden])").count() === 0, "I: FILLED latch was lost after shrinking the viewport");
    await context.close();
  }

  // J. Topics coordinates exactly five requested units and never invents the SEO square.
  {
    const { context, page } = await openStatePage(1600, "/topics", false);
    check(await page.locator("ins.adsbygoogle[data-ilws-ad-unit='true']").count() === 5, "J: Topics requested-unit count was not five");
    check(await page.locator("[data-ad-placement='seo-section-square']").count() === 0, "J: Topics unexpectedly rendered the SEO square");
    await setAllUnitStatuses(page, "unfilled");
    await waitForFallbackCount(page, 5);
    check(await page.locator(".ad-slot-live-fallback:not([hidden])").count() === 5, "J: Topics did not coordinate all five fallbacks");
    await context.close();
  }
}

check(Math.abs((contentWidths.get(1280) ?? 0) - (contentWidths.get(1600) ?? -100)) <= 2, "large-desktop sidebars changed the generator content width");
check(Math.abs((contentWidths.get(1280) ?? 0) - (contentWidths.get(1920) ?? -100)) <= 2, "ultra-wide sidebars changed the generator content width");

for (const viewport of [{ width: 390, height: 844 }, { width: 1600, height: 1000 }]) {
  const context = await browser.newContext({ viewport });
  if (adsenseEnabled) {
    await context.route("https://pagead2.googlesyndication.com/**", async (route) => {
      await route.fulfill({ contentType: "application/javascript", body: "" });
    });
  }
  context.on("request", (request) => {
    if (/googlesyndication|doubleclick|googleadservices|pagead2|adsbygoogle/i.test(request.url())) externalAdRequests.add(request.url());
  });
  for (const route of adFreeRoutes) {
    const page = await context.newPage();
    const pageAdRequests = [];
    page.on("request", (request) => {
      if (/googlesyndication|doubleclick|googleadservices|pagead2|adsbygoogle/i.test(request.url())) pageAdRequests.push(request.url());
    });
    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    check(await page.locator("[data-ad-placeholder='true']").count() === 0, `${viewport.width}px ${route}: ad-free route rendered a placeholder`);
    check(await page.locator("ins.adsbygoogle, [data-ad-client], [data-ad-slot]").count() === 0, `${viewport.width}px ${route}: ad-free route rendered a live unit`);
    check(pageAdRequests.length === 0, `${viewport.width}px ${route}: ad-free route requested an advertising resource`);
    check(await page.locator("head script[data-ilws-adsense-loader='true']").count() === 0, `${viewport.width}px ${route}: ad-free route installed the loader`);
    await page.close();
  }
  await context.close();
}

const printContext = await browser.newContext({ viewport: { width: 1280, height: 960 } });
if (adsenseEnabled) {
  await printContext.route("https://pagead2.googlesyndication.com/**", async (route) => {
    await route.fulfill({ contentType: "application/javascript", body: "" });
  });
}
const printPage = await printContext.newPage();
await printPage.goto(`${baseUrl}/word-search-generator`, { waitUntil: "networkidle" });
await printPage.emulateMedia({ media: "print" });
const printVisibility = await printPage.locator(".ad-slot").evaluateAll((elements) => elements.map((element) => getComputedStyle(element).display));
check(printVisibility.every((display) => display === "none"), "print media leaves a placeholder visible");
await printContext.close();

const unexpectedExternalAdRequests = adsenseEnabled
  ? [...externalAdRequests].filter((url) => url !== adsenseLoader)
  : [...externalAdRequests];
check(unexpectedExternalAdRequests.length === 0, `unexpected external ad requests detected: ${unexpectedExternalAdRequests.join(", ")}`);
await browser.close();

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Monetization ${adsenseEnabled ? "enabled" : "disabled"} mode passed on ${eligibleRoutes.length} eligible routes at ${viewports.length} viewports and ${adFreeRoutes.length} ad-free routes.`);
