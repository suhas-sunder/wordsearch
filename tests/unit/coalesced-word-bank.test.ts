import { describe, expect, test } from "vitest";
import { splitCoalescedWordBank } from "@/lib/pdf/coalesced-word-bank";

describe("coalesced PDF bank measurement", () => {
  const box = { text: "LILY PANSY PEONY", x: 301.566, y: 106, width: 184.074, height: 18, fontPt: 18 };
  test("recovers actual short-label geometry only with the observed width contract", async () => {
    const parts = await splitCoalescedWordBank(box, ["PANSY", "PEONY", "LILY"]);
    expect(parts?.map(({ text }) => text)).toEqual(["LILY", "PANSY", "PEONY"]);
    expect(parts?.[0].x).toBeCloseTo(301.566);
    expect(parts?.[1].x).toBeCloseTo(350.412);
    expect(parts?.[2].x).toBeCloseTo(422.622);
    expect(parts![2].x + parts![2].width).toBeCloseTo(box.x + box.width);
    expect(parts?.every(({ fontPt, y }) => fontPt === 18 && y === 106)).toBe(true);
  });
  test("bounds kerned label placement using observed unkerned glyph extent", async () => {
    const parts = await splitCoalescedWordBank({ ...box, text: "QUILT RUG", x: 382.974, width: 104.196 }, ["RUG", "QUILT"]);
    expect(parts?.map(({ text }) => text)).toEqual(["QUILT", "RUG"]);
    expect(parts?.[0].width).toBeCloseTo(54);
    expect(parts?.[1].x).toBeCloseTo(447.174);
    expect(parts![1].x + parts![1].width).toBeCloseTo(487.17);
  });
  test("keeps ambiguous, unknown, differently spaced and ordinary single labels unmeasured", async () => {
    expect(await splitCoalescedWordBank({ ...box, text: "ICE CREAM ROSE" }, ["ICE", "CREAM", "ICE CREAM", "ROSE"])).toBeNull();
    expect(await splitCoalescedWordBank({ ...box, text: "LILY UNKNOWN" }, ["LILY", "PANSY"])).toBeNull();
    expect(await splitCoalescedWordBank({ ...box, width: box.width - 2 }, ["LILY", "PANSY", "PEONY"])).toBeNull();
    expect(await splitCoalescedWordBank({ ...box, text: "LILY" }, ["LILY"])).toBeNull();
  });
});
