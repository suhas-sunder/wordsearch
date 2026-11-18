import { afterEach, describe, expect, test, vi } from "vitest";
import { downloadBrowserPuzzlePackPdf } from "@/lib/pdf/browser-pack-download";
import type { PuzzlePack } from "@/lib/pdf/create-puzzle-pack-pdf";

const renderer = vi.hoisted(() => vi.fn());
vi.mock("@/lib/pdf/create-puzzle-pack-pdf", () => ({ createPuzzlePackPdf: renderer }));
const pack = { id: "test-pack", name: "Classroom", puzzles: [] } as PuzzlePack;
const options = { paperSize: "letter" as const, order: "answers-last" as const, pages: "students" as const };

function environment(click = vi.fn()) {
  const anchor = { href: "", download: "", click, remove: vi.fn() };
  const createElement = vi.fn(() => anchor);
  const createObjectURL = vi.fn(() => "blob:classroom-test");
  const revokeObjectURL = vi.fn();
  vi.stubGlobal("document", { createElement, body: { appendChild: vi.fn() } });
  vi.stubGlobal("URL", { createObjectURL, revokeObjectURL });
  vi.stubGlobal("window", { setTimeout: (callback: () => void) => { callback(); return 1; } });
  return { anchor, createElement, createObjectURL, revokeObjectURL };
}

afterEach(() => { vi.unstubAllGlobals(); renderer.mockReset(); });

describe("classroom asynchronous download boundary", () => {
  test.each(["settings changed", "page unmounted"])("does not create a URL or file after %s", async () => {
    const browser = environment();
    let finish!: (bytes: Uint8Array) => void;
    renderer.mockReturnValue(new Promise<Uint8Array>(resolve => { finish = resolve; }));
    let current = true;
    const pending = downloadBrowserPuzzlePackPdf(pack, options, () => current);
    current = false;
    finish(new Uint8Array([1, 2, 3]));
    expect(await pending).toBe(false);
    expect(browser.createElement).not.toHaveBeenCalled();
    expect(browser.createObjectURL).not.toHaveBeenCalled();
    expect(browser.anchor.click).not.toHaveBeenCalled();
  });

  test("preserves the default call and student filename for a current download", async () => {
    const browser = environment();
    renderer.mockResolvedValue(new Uint8Array([1, 2, 3]));
    expect(await downloadBrowserPuzzlePackPdf(pack, options)).toBe(true);
    expect(browser.createObjectURL).toHaveBeenCalledOnce();
    expect(browser.anchor.download).toBe("classroom-student-worksheets.pdf");
    expect(browser.anchor.click).toHaveBeenCalledOnce();
    expect(browser.anchor.remove).toHaveBeenCalledOnce();
    expect(browser.revokeObjectURL).toHaveBeenCalledWith("blob:classroom-test");
  });

  test("cleans up its URL and anchor if the browser rejects the click", async () => {
    const browser = environment(vi.fn(() => { throw new Error("Download blocked"); }));
    renderer.mockResolvedValue(new Uint8Array([1, 2, 3]));
    await expect(downloadBrowserPuzzlePackPdf(pack, options)).rejects.toThrow("Download blocked");
    expect(browser.anchor.remove).toHaveBeenCalledOnce();
    expect(browser.revokeObjectURL).toHaveBeenCalledWith("blob:classroom-test");
  });
});
