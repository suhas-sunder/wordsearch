import { describe, expect, test } from "vitest";
import { classroomPresetsKey, parseClassroomPresets, readClassroomPresets, saveClassroomPreset, type ClassroomPreset } from "@/lib/pack/presets";
import { buildClassroomPack } from "@/lib/pack/classroom-pack";

const preset: ClassroomPreset = { input: { title: "Nature", wordsText: "garden\nflower\nbird", seed: "class-1", count: 5 }, paperSize: "a4", order: "answers-last", pages: "students" };
function storage() {
  const values = new Map<string, string>();
  return { values, getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
}
describe("explicit local classroom presets", () => {
  test("saves exact private input/options and replays matching assignments", () => {
    const local = storage();
    expect(readClassroomPresets(local)).toEqual([]);
    saveClassroomPreset(local, preset);
    const [loaded] = readClassroomPresets(local);
    expect(loaded).toEqual(preset);
    expect(buildClassroomPack(loaded.input)).toEqual(buildClassroomPack(preset.input));
    expect([...local.values.keys()]).toEqual([classroomPresetsKey]);
  });
  test("replaces the named entry and bounds the total at five", () => {
    const local = storage();
    for (let i = 0; i < 5; i++) saveClassroomPreset(local, { ...preset, input: { ...preset.input, title: `Class ${i}` } });
    const before = local.getItem(classroomPresetsKey);
    expect(() => saveClassroomPreset(local, preset)).toThrow("Five presets");
    expect(local.getItem(classroomPresetsKey)).toBe(before);
    saveClassroomPreset(local, { ...preset, input: { ...preset.input, title: "Class 0", count: 20 } });
    expect(readClassroomPresets(local)).toHaveLength(5);
    expect(readClassroomPresets(local)[0].input.count).toBe(20);
  });
  test.each(["{", "null", "[]", "x".repeat(20_001), JSON.stringify({ v: 2, presets: [] }), JSON.stringify({ v: 1, presets: [preset, preset] }), JSON.stringify({ v: 1, presets: [{ ...preset, pages: "invalid" }] }), JSON.stringify({ v: 1, presets: [{ ...preset, input: { ...preset.input, count: 5000 } }] }), JSON.stringify({ v: 1, presets: [{ ...preset, input: { ...preset.input, wordsText: "planet\nPLANET" } }] })])("rejects corrupt/incompatible data without overwriting it", (raw) => {
    const local = storage(); local.setItem(classroomPresetsKey, raw);
    expect(() => parseClassroomPresets(raw)).toThrow();
    expect(() => saveClassroomPreset(local, preset)).toThrow();
    expect(local.getItem(classroomPresetsKey)).toBe(raw);
  });
  test("propagates denial/quota failures without changing form data", () => {
    const before = structuredClone(preset);
    expect(() => readClassroomPresets({ getItem: () => { throw new Error("blocked"); } })).toThrow("blocked");
    expect(() => saveClassroomPreset({ getItem: () => null, setItem: () => { throw new Error("quota"); } }, preset)).toThrow("quota");
    expect(preset).toEqual(before);
  });
});
