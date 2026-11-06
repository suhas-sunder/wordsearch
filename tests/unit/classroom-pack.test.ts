import { describe, expect, test } from "vitest";
import { buildClassroomPack } from "@/lib/pack/classroom-pack";

const input = { title: "Classroom", wordsText: "planet\ncomet\nstar", seed: "class-01", count: 5 as const };
describe("classroom pack assignment generation", () => {
  test("replays stable IDs, requests, grids and placements and extends the first five to ten", () => {
    const five = buildClassroomPack(input);
    const ten = buildClassroomPack({ ...input, count: 10 });
    expect(buildClassroomPack(input)).toEqual(five);
    expect(ten.puzzles.slice(0, 5)).toEqual(five.puzzles);
    expect(ten.puzzles.map((entry) => entry.id)).toEqual(Array.from({ length: 10 }, (_, i) => `assignment-${String(i + 1).padStart(2, "0")}`));
    expect(new Set(ten.puzzles.map((entry) => JSON.stringify(entry.puzzle.grid))).size).toBe(10);
    expect(five.puzzles.every((entry) => entry.puzzle.request.wordsText === input.wordsText && entry.puzzle.placed.length === 3)).toBe(true);
  });
  test.each([
    [{ ...input, seed: "" }, "seed"],
    [{ ...input, title: "" }, "title"],
    [{ ...input, title: "W".repeat(81) }, "title"],
    [{ ...input, wordsText: "" }, "2–12"],
    [{ ...input, wordsText: "planet\nPLANET" }, "duplicate"],
    [{ ...input, wordsText: "ice cream\nicecream" }, "duplicate"],
    [{ ...input, wordsText: "planet\n!!!" }, "English"],
    [{ ...input, wordsText: "planet\nextraordinarilylong" }, "2–14"],
    [{ ...input, wordsText: "planet\ncomet\n" }, "nonempty"],
    [{ ...input, wordsText: "planet\n comet" }, "nonempty"]
  ])("rejects invalid input without normalizing it", (bad, message) => {
    expect(() => buildClassroomPack(bad)).toThrow(message);
  });
});
