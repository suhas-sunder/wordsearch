import assert from "node:assert/strict";
import { chromium } from "playwright";

const base = process.env.BASE_URL ?? "http://127.0.0.1:3292";
const cases = [
  ["spanish", "Accents and the tilde in ñ are removed"],
  ["french", "unsupported ligatures such as œ are discarded"],
  ["emoji", "does not accept direct emoji input"],
  ["asl-fingerspelling", "does not display handshapes"],
  ["semaphore", "Semaphore flag positions are not implemented"],
  ["roman-numeral", "Roman numeral conversion is not implemented"],
  ["greek-alphabet", "Native Greek input is not supported"],
  ["japanese-kana", "Native kana input and validated romanization are not supported"]
];
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [390, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = []; page.on("pageerror", (error) => errors.push(error.message));
    for (const [slug, disclosure] of cases) {
      await page.goto(`${base}/specialty/${slug}-word-search-generator`, { waitUntil: "networkidle" });
      assert.match(await page.locator('meta[name="robots"]').getAttribute("content"), /noindex/);
      await page.getByText(disclosure, { exact: false }).first().waitFor();
      if (["spanish", "french", "emoji"].includes(slug)) {
        const selector = page.getByRole("combobox", { name: "Alphabet pack" });
        assert.equal(await selector.inputValue(), slug);
        assert.match(await selector.locator("option:checked").innerText(), /accent-normalized Latin|Geometric symbols/);
        await selector.selectOption("latin");
        assert.equal(await selector.inputValue(), "latin");
        assert.equal(await selector.locator(`option[value="${slug}"]`).count(), 0);
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    }
    assert.deepEqual(errors, []);
    await page.close();
  }
} finally { await browser.close(); }
console.log("PASS truthful noindex specialty disclosures and active-only selector at mobile/desktop widths");
