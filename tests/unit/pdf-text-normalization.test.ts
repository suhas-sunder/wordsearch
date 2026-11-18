import { describe, expect, test } from "vitest";
import { normalizePdfText } from "@/lib/pdf/create-puzzle-pdf";

describe("established PDF typography normalization", () => {
  test("shares the existing quote, dash and whitespace substitutions without altering words", () => {
    expect(normalizePdfText("  Mother’s Day — ‘Card’  “Thanks”\nWorksheet ")).toBe("Mother's Day - 'Card' \"Thanks\" Worksheet");
    expect(normalizePdfText(undefined)).toBe("");
    expect(normalizePdfText("Plain Word Search")).toBe("Plain Word Search");
  });
});
