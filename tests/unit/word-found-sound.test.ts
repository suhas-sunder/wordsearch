import { describe, expect, test, vi } from "vitest";
import { createWordFoundSound } from "@/lib/puzzle/word-found-sound";
import { defaultSolverPreferences, normalizeSolverPreferences } from "@/components/puzzle/SolverPreferencesDialog";

function audio(state = "running") {
  const parameter = () => ({ setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() });
  const oscillator = { type: "", frequency: parameter(), connect: vi.fn(), disconnect: vi.fn(), start: vi.fn(), stop: vi.fn(), onended: null as (() => void) | null };
  const gain = { gain: parameter(), connect: vi.fn(), disconnect: vi.fn() };
  const context = { state, currentTime: 10, destination: {}, createOscillator: vi.fn(() => oscillator), createGain: vi.fn(() => gain), resume: vi.fn(async () => { context.state = "running"; }), close: vi.fn(async () => { context.state = "closed"; }) };
  return { context, oscillator, gain, factory: vi.fn(() => context as unknown as AudioContext) };
}

describe("optional local word-found sound", () => {
  test("old, invalid and absent preferences stay off; only an explicit boolean opts in", () => {
    expect(defaultSolverPreferences.soundOnFound).toBe(false);
    for (const value of [undefined, null, {}, { soundOnFound: "true" }, { soundOnFound: 1 }, { soundOnFound: false }]) expect(normalizeSolverPreferences(value).soundOnFound).toBe(false);
    expect(normalizeSolverPreferences({ soundOnFound: true }).soundOnFound).toBe(true);
  });

  test("does nothing on construction and creates one short low-gain sine cue only when played", async () => {
    const fake = audio();
    const feedback = createWordFoundSound(fake.factory);
    expect(fake.factory).not.toHaveBeenCalled();
    await feedback.play();
    expect(fake.factory).toHaveBeenCalledOnce();
    expect(fake.oscillator.type).toBe("sine");
    expect(fake.oscillator.start).toHaveBeenCalledWith(10);
    expect(fake.oscillator.stop).toHaveBeenCalledWith(10.09);
    expect(fake.gain.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0.025, 10.008);
    fake.oscillator.onended!();
    expect(fake.oscillator.disconnect).toHaveBeenCalledOnce();
    expect(fake.gain.disconnect).toHaveBeenCalledOnce();
    feedback.dispose();
    expect(fake.context.close).toHaveBeenCalledOnce();
  });

  test("stop/dispose invalidate a delayed resume before any oscillator or stale cue exists", async () => {
    const fake = audio("suspended");
    let release!: () => void;
    fake.context.resume.mockImplementation(() => new Promise<void>(resolve => { release = resolve; }));
    const feedback = createWordFoundSound(fake.factory);
    const playing = feedback.play();
    feedback.dispose();
    release(); await playing;
    expect(fake.context.createOscillator).not.toHaveBeenCalled();
    expect(fake.context.close).toHaveBeenCalledOnce();
    await feedback.play();
    expect(fake.factory).toHaveBeenCalledOnce();
  });

  test("stop disconnects active nodes and closes its audio device", async () => {
    const fake = audio(); const feedback = createWordFoundSound(fake.factory);
    await feedback.play(); feedback.stop();
    expect(fake.oscillator.disconnect).toHaveBeenCalledOnce();
    expect(fake.gain.disconnect).toHaveBeenCalledOnce();
    expect(fake.context.close).toHaveBeenCalledOnce();
  });

  test("unsupported constructors and rejected audio policy stay silent without rejecting", async () => {
    await expect(createWordFoundSound(() => null).play()).resolves.toBeUndefined();
    await expect(createWordFoundSound(() => { throw new Error("Unavailable"); }).play()).resolves.toBeUndefined();
    const fake = audio("suspended"); fake.context.resume.mockRejectedValue(new Error("Blocked"));
    await expect(createWordFoundSound(fake.factory).play()).resolves.toBeUndefined();
    expect(fake.context.createOscillator).not.toHaveBeenCalled();
    expect(fake.context.close).toHaveBeenCalledOnce();
  });
});
