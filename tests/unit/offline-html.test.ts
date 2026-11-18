import { describe, expect, test } from "vitest";
import { htmlWorksheetFilename } from "@/lib/print/offline-html";

describe("offline worksheet filenames", () => {
  test.each([
    ["My puzzle", "my-puzzle-worksheet.html"],
    ["../../unsafe<script>.html", "unsafe-script-html-worksheet.html"],
    ["Café & Noël", "cafe-noel-worksheet.html"],
    ["💫", "word-search-worksheet.html"],
    ["", "word-search-worksheet.html"]
  ])("uses safe portable file names for %s", (title, expected) => {
    expect(htmlWorksheetFilename(title)).toBe(expected);
  });
  test("bounds long names and never preserves path separators or control characters", () => {
    const name = htmlWorksheetFilename("X".repeat(256) + "\n/\\");
    expect(name.length).toBeLessThanOrEqual(95);
    expect(name).toMatch(/^[a-z0-9-]+\.html$/);
  });
});
