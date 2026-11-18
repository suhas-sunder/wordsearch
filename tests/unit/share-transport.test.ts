import QRCode from "qrcode";
import { describe, expect, test } from "vitest";
import { defaultPuzzleRequest } from "@/lib/puzzle/generate";
import { decodePuzzleShareState, puzzlePlayUrl } from "@/lib/share-state/state";

describe("share transport boundaries", () => {
  test.each([12, 20, 40, 100])("preserves %i Unicode words through the public URL", (count) => {
    const wordsText = Array.from({ length: count }, (_, i) => `WORD${String.fromCharCode(65 + Math.floor(i / 26), 65 + i % 26)}é`).join("\n");
    const request = { ...defaultPuzzleRequest, title: "Café 漢字 🔎", seed: `share-${count}`, wordsText };
    const url = puzzlePlayUrl(request);
    const encoded = url.split("/").pop()!;
    expect(decodePuzzleShareState(encoded)).toMatchObject({ title: request.title, seed: request.seed, wordsText });
    // URL-safe base64 is encoding, not secrecy. A recipient can recover the JSON.
    expect(JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"))).toMatchObject({ title: request.title, wordsText });
  });

  test("reports QR capacity overflow instead of implying every URL can be encoded", () => {
    expect(() => QRCode.create(`https://www.ilovewordsearch.com/play/${"a".repeat(5000)}`, { errorCorrectionLevel: "M" })).toThrow();
  });
});
