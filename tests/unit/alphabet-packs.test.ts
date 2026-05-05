import { describe, expect, test } from "vitest";
import { getAlphabetPack } from "@/lib/alphabet-packs";
import { generatePuzzle } from "@/lib/puzzle/generate";

describe("alphabet packs", () => {
  test("normalizes diacritics for Latin-family packs", () => {
    const pack = getAlphabetPack("spanish");
    expect(pack.encodeWord("canción").tokens.join("")).toBe("CANCION");
  });

  test("encodes Morse from plain text", () => {
    const pack = getAlphabetPack("morse");
    expect(pack.encodeWord("SOS").tokens).toEqual(["...", "---", "..."]);
  });

  test("accepts dot dash Morse input", () => {
    const pack = getAlphabetPack("morse");
    expect(pack.encodeWord("... --- ...").tokens).toEqual(["...", "---", "..."]);
  });

  test("uses Unicode braille cells", () => {
    const pack = getAlphabetPack("braille");
    expect(pack.encodeWord("cab").tokens).toEqual(["⠉", "⠁", "⠃"]);
  });

  test("generates fixed width binary tokens", () => {
    const puzzle = generatePuzzle({
      title: "Binary",
      wordsText: "code",
      seed: "binary-seed",
      difficulty: "easy",
      alphabetPack: "binary",
      autoSize: true,
      directions: ["E"],
      allowOverlap: true,
      fillerMode: "alphabet"
    });
    expect(puzzle.placed[0]?.tokens[0]).toMatch(/^[01]{8}$/);
  });
});
