import { expect, test } from "vitest";
import { downloadOfflineWorksheet } from "@/lib/print/offline-html";
import { defaultPuzzleOutputOptions } from "@/lib/puzzle/output-options";

test("a canceled HTML job does not read the portal or enter browser validation/download", async () => {
  const portal = new Proxy({} as HTMLElement, { get() { throw new Error("Canceled DOM must not be read"); } });
  await expect(downloadOfflineWorksheet(portal, "Private title", defaultPuzzleOutputOptions, () => false)).resolves.toBe(false);
});
