import { describe, expect, test } from "vitest";
import { completionCardSvg, elapsedLabel, type CompletionStats } from "@/lib/puzzle/completion-card";

const stats: CompletionStats = { wordsFound: 20, rows: 18, cols: 18, elapsedMs: 125_999.9 };
describe("private-by-default result card", () => {
  test("renders measured counts and elapsed whole seconds without accepting puzzle content", () => {
    const svg = completionCardSvg(stats);
    expect(svg).toContain("20 placed words found");
    expect(svg).toContain("18 × 18 grid");
    expect(svg).toContain("Elapsed: 2:05");
    expect(svg).toContain('width="1200" height="630"');
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(svg.replace('xmlns="http://www.w3.org/2000/svg"', "")).not.toMatch(/https?:|href=|<image|<script|foreignObject/);
  });
  test("does not fabricate timing when measurement is unavailable", () => {
    expect(completionCardSvg({ ...stats, elapsedMs: null })).toContain("Time not measured");
    expect(elapsedLabel(0)).toBe("0:00");
    expect(elapsedLabel(3_661_000)).toBe("61:01");
  });
  test.each([NaN, Infinity, -1, Number.MAX_SAFE_INTEGER + 1, "private text"])("rejects unsafe duration %s", (elapsedMs) => {
    expect(() => completionCardSvg({ ...stats, elapsedMs } as CompletionStats)).toThrow();
  });
  test("rejects malformed numeric result fields rather than serializing arbitrary content", () => {
    for (const patch of [{ wordsFound: 0 }, { wordsFound: 201 }, { rows: 41 }, { cols: 0 }, { rows: 6.1 }, { wordsFound: "<script>private</script>" }]) {
      expect(() => completionCardSvg({ ...stats, ...patch } as CompletionStats)).toThrow();
    }
  });
});
