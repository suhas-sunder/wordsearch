import { runInNewContext } from "node:vm";
import { describe, expect, test } from "vitest";
import { themeBootstrap } from "@/lib/theme";

describe("theme before paint", () => {
  test.each([
    ["light", true, "light"], ["dark", false, "dark"],
    [null, true, "dark"], [null, false, "light"],
    ["unexpected", true, "dark"], ["<script>", false, "light"]
  ])("stored %s with dark device %s resolves to %s", (saved, darkDevice, expected) => {
    const document = { documentElement: { dataset: {} as Record<string, string> } };
    runInNewContext(themeBootstrap, { document, localStorage: { getItem: () => saved }, matchMedia: () => ({ matches: darkDevice }) });
    expect(document.documentElement.dataset.theme).toBe(expected);
  });
  test("blocked storage follows the device without failing page startup", () => {
    const document = { documentElement: { dataset: {} as Record<string, string> } };
    runInNewContext(themeBootstrap, { document, localStorage: { getItem: () => { throw new Error("blocked"); } }, matchMedia: () => ({ matches: true }) });
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});
