import { describe, expect, test, vi } from "vitest";
import { createPrintMeasurementQueue } from "@/lib/print/browser-fit";
import { defaultPuzzleOutputOptions } from "@/lib/puzzle/output-options";

function gate() {
  let resolve!: () => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<void>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
const options = { ...defaultPuzzleOutputOptions };
const tick = async () => { await Promise.resolve(); await Promise.resolve(); };

describe("in-flight exact print measurements", () => {
  test("identical concurrent worksheets share one actual check, never a completed result", async () => {
    const ready = gate();
    const measure = vi.fn(() => ready.promise);
    const validate = createPrintMeasurementQueue(measure);
    const first = validate("same", options, false);
    const second = validate("same", { ...options }, false);
    await tick(); expect(measure).toHaveBeenCalledTimes(1);
    ready.resolve(); await Promise.all([first, second]);
    await validate("same", options, false);
    expect(measure).toHaveBeenCalledTimes(2);
  });

  test("any HTML/CSS byte, option or offline-mode difference receives its own check", async () => {
    const measure = vi.fn(async () => {});
    const validate = createPrintMeasurementQueue(measure);
    await Promise.all([
      validate("<style>a{color:red}</style>sheet", options, false),
      validate("<style>a{color:blue}</style>sheet", options, false),
      validate("<style>a{color:red}</style>sheet ", options, false),
      validate("<style>a{color:red}</style>sheet", { ...options, qrCode: !options.qrCode }, false),
      validate("<style>a{color:red}</style>sheet", options, true)
    ]);
    expect(measure).toHaveBeenCalledTimes(5);
  });

  test("a failure reaches every subscriber unchanged and is never cached", async () => {
    const ready = gate(), failure = new Error("Does not fit");
    const measure = vi.fn().mockImplementationOnce(() => ready.promise).mockResolvedValue(undefined);
    const validate = createPrintMeasurementQueue(measure);
    const first = validate("same", options, false), second = validate("same", options, false);
    const settled = Promise.allSettled([first, second]);
    ready.reject(failure);
    expect(await settled).toEqual([{ status: "rejected", reason: failure }, { status: "rejected", reason: failure }]);
    await validate("same", options, false); expect(measure).toHaveBeenCalledTimes(2);
  });

  test("canceling one consumer preserves its exact reason and another consumer's check", async () => {
    const ready = gate(), firstAbort = new AbortController(), reason = { canceled: "first" };
    let underlying: AbortSignal | undefined;
    const validate = createPrintMeasurementQueue((_html, _options, _offline, signal) => { underlying = signal; return ready.promise; });
    const first = validate("same", options, false, firstAbort.signal);
    const second = validate("same", options, false);
    const rejected = expect(first).rejects.toBe(reason);
    await tick(); firstAbort.abort(reason); await rejected;
    expect(underlying?.aborted).toBe(false);
    ready.resolve(); await second;
  });

  test("last cancellation aborts the active job and a later equal request starts fresh", async () => {
    const controllers = [new AbortController(), new AbortController()];
    const signals: AbortSignal[] = [];
    const validate = createPrintMeasurementQueue((_html, _options, _offline, signal) => {
      signals.push(signal!);
      return signals.length > 1 ? Promise.resolve() : new Promise((_yes, no) => signal!.addEventListener("abort", () => no(signal!.reason), { once: true }));
    });
    const pending = controllers.map((c) => validate("same", options, false, c.signal));
    const settled = Promise.allSettled(pending);
    await tick(); controllers[0].abort("one"); expect(signals[0].aborted).toBe(false);
    controllers[1].abort("two"); expect(signals[0].aborted).toBe(true); expect(signals[0].reason).toBe("two");
    await validate("same", options, false);
    expect(signals).toHaveLength(2);
    expect(await settled).toEqual([{ status: "rejected", reason: "one" }, { status: "rejected", reason: "two" }]);
  });

  test("a queued job abandoned by all consumers never opens a measurement", async () => {
    const ready = gate(), cancel = new AbortController();
    const measure = vi.fn().mockImplementationOnce(() => ready.promise).mockResolvedValue(undefined);
    const validate = createPrintMeasurementQueue(measure);
    const first = validate("first", options, false);
    const abandoned = validate("second", options, false, cancel.signal);
    const rejected = expect(abandoned).rejects.toBe("gone");
    await tick(); cancel.abort("gone"); await rejected;
    ready.resolve(); await first; await tick();
    expect(measure).toHaveBeenCalledTimes(1);
    await validate("third", options, false); expect(measure).toHaveBeenCalledTimes(2);
  });

  test("already-canceled consumers create no shared work", async () => {
    const cancel = new AbortController(); cancel.abort("before");
    const measure = vi.fn(async () => {});
    await expect(createPrintMeasurementQueue(measure)("same", options, false, cancel.signal)).rejects.toBe("before");
    expect(measure).not.toHaveBeenCalled();
  });

  test("subscriber abort listeners are removed on success, failure and cancellation", async () => {
    for (const mode of ["success", "failure", "cancel"] as const) {
      const ready = gate(), cancel = new AbortController();
      const remove = vi.spyOn(cancel.signal, "removeEventListener");
      const validate = createPrintMeasurementQueue(() => ready.promise);
      const result = validate("same", options, false, cancel.signal);
      const settled = Promise.allSettled([result]);
      if (mode === "cancel") { cancel.abort(); ready.resolve(); }
      else if (mode === "failure") ready.reject(new Error("bad")); else ready.resolve();
      await settled; expect(remove).toHaveBeenCalledTimes(1);
    }
  });

  test("queued work captures option values and preserves serialization", async () => {
    const ready = gate(), seen: string[] = [];
    const measure = vi.fn(async (html: string, _options: typeof options) => { seen.push(html); if (html === "first") await ready.promise; });
    const validate = createPrintMeasurementQueue(measure);
    const first = validate("first", options, false);
    const mutable = { ...options };
    const second = validate("second", mutable, false);
    mutable.paperSize = options.paperSize === "a4" ? "letter" : "a4";
    await tick(); expect(seen).toEqual(["first"]);
    ready.resolve(); await Promise.all([first, second]);
    expect(seen).toEqual(["first", "second"]);
    expect(measure.mock.calls[1][1]).toEqual(options);
  });
});
