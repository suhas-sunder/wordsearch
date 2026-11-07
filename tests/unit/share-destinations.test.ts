import { describe, expect, it } from "vitest";
import { puzzleShareDestinations } from "@/lib/share-state/destinations";
import { decodePuzzleShareState, puzzlePlayUrl } from "@/lib/share-state/state";

describe("explicit puzzle sharing destinations", () => {
  it("keeps the exact seeded Unicode definition inside a single encoded message", () => {
    const request = { title: "Café & <friends>", wordsText: "CAFÉ\nCAT", seed: "social-&?=#", rows: 8, cols: 8, autoSize: false, alphabetPack: "latin" as const };
    const playUrl = puzzlePlayUrl(request);
    const links = puzzleShareDestinations(playUrl);
    const whatsapp = new URL(links.whatsapp);
    const email = new URL(links.email);
    expect(whatsapp.origin + whatsapp.pathname).toBe("https://wa.me/");
    expect([...whatsapp.searchParams.keys()]).toEqual(["text"]);
    expect(whatsapp.searchParams.get("text")).toBe(`Solve this word search:\r\n${playUrl}`);
    expect(email.protocol).toBe("mailto:");
    expect(email.pathname).toBe("");
    expect([...email.searchParams.keys()]).toEqual(["subject", "body"]);
    expect(email.searchParams.get("body")).toBe(whatsapp.searchParams.get("text"));
    expect(decodePuzzleShareState(playUrl.split("/").pop())?.wordsText).toBe(request.wordsText);
  });

  it("does not allow URL punctuation or line breaks to add mail headers", () => {
    const links = puzzleShareDestinations("https://www.ilovewordsearch.com/play/a?x=1&bcc=other%40example.org#x\r\nBcc: other@example.org");
    const email = new URL(links.email);
    expect([...email.searchParams.keys()]).toEqual(["subject", "body"]);
    expect(email.searchParams.get("subject")).toBe("A word search to solve");
    expect(email.searchParams.get("body")).toContain("&bcc=other%40example.org");
  });
});
