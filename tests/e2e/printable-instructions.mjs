import assert from "node:assert/strict";
import { chromium } from "playwright";

const base = process.env.BASE_URL ?? "http://localhost:3211";
const encode = (state) => Buffer.from(JSON.stringify(state)).toString("base64url");
const legacy = "Find each word in the grid. Words may run forward, backward, up, down, or diagonally.";
const fixtures = [
  { difficulty: "easy", directions: ["E", "S"], expected: "left to right, top to bottom" },
  { difficulty: "medium", directions: ["E", "S", "SE", "NE"], expected: "down and right, up and right" },
  { difficulty: "hard", directions: ["E", "W", "S", "N", "SE", "SW", "NE", "NW"], expected: "up and left" },
  { difficulty: "medium", directions: ["NW"], expected: "up and left" },
  { difficulty: "easy", directions: ["E"], instructions: "Find words left to right.", expected: "Find words left to right." }
];
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  for (const { expected, ...settings } of fixtures) {
    const state = encode({ title: "Instruction check", wordsText: "cat\ndog\nbird", seed: "instruction-check", instructions: legacy, ...settings });
    await page.goto(`${base}/print/${state}`, { waitUntil: "networkidle" });
    await page.locator('[data-utility-state="ready"]').waitFor();
    assert.match(await page.locator(".print-instructions").first().innerText(), new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    await page.emulateMedia({ media: "print" });
    assert.match(await page.locator(".print-instructions").first().innerText(), new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    await page.emulateMedia({ media: "screen" });
    await page.goto(`${base}/answer-key/${state}`, { waitUntil: "networkidle" });
    await page.locator('[data-utility-state="ready"]').waitFor();
    assert.match(await page.locator(".print-instructions").first().innerText(), /Answer key/);
  }
  console.log("PASS printable instructions: shared easy, medium, hard, custom directions and authored text; print media and answer key");
} finally {
  await browser.close();
}
