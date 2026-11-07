import { validateClassroomPackInput, type ClassroomPackInput } from "@/lib/pack/classroom-pack";

export const classroomPresetsKey = "ilws:classroom-presets:v1";
export interface ClassroomPreset {
  input: ClassroomPackInput;
  paperSize: "letter" | "a4";
  order: "answers-last" | "interleaved";
  pages: "both" | "students" | "answers";
  largePrint?: boolean;
}

function validatePreset(value: unknown): asserts value is ClassroomPreset {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid saved preset.");
  const preset = value as ClassroomPreset;
  if (Object.keys(value).filter((key) => key !== "largePrint").sort().join(",") !== "input,order,pages,paperSize" || (preset.largePrint !== undefined && typeof preset.largePrint !== "boolean") || !["letter", "a4"].includes(preset.paperSize) || !["answers-last", "interleaved"].includes(preset.order) || !["both", "students", "answers"].includes(preset.pages)) throw new Error("Invalid saved preset.");
  if (!preset.input || typeof preset.input !== "object" || Array.isArray(preset.input) || Object.keys(preset.input).sort().join(",") !== "count,seed,title,wordsText") throw new Error("Invalid saved preset.");
  validateClassroomPackInput(preset.input);
}

export function parseClassroomPresets(raw: string): ClassroomPreset[] {
  if (raw.length > 20_000) throw new Error("Saved presets exceed the supported size.");
  const data: unknown = JSON.parse(raw);
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Invalid saved preset format.");
  const record = data as { v?: unknown; presets?: unknown };
  if (Object.keys(data).sort().join(",") !== "presets,v" || record.v !== 1 || !Array.isArray(record.presets) || record.presets.length > 5) throw new Error("Unsupported saved preset format.");
  record.presets.forEach(validatePreset);
  if (new Set(record.presets.map((item) => item.input.title)).size !== record.presets.length) throw new Error("Duplicate saved preset names.");
  return record.presets;
}

export function readClassroomPresets(storage: Pick<Storage, "getItem">): ClassroomPreset[] {
  const raw = storage.getItem(classroomPresetsKey);
  return raw === null ? [] : parseClassroomPresets(raw);
}

/** Explicit user save only. Invalid existing data is preserved for deliberate clearing. */
export function saveClassroomPreset(storage: Pick<Storage, "getItem" | "setItem">, preset: ClassroomPreset): ClassroomPreset[] {
  validatePreset(preset);
  const previous = readClassroomPresets(storage);
  const replacing = previous.some((item) => item.input.title === preset.input.title);
  if (!replacing && previous.length === 5) throw new Error("Five presets are already saved. Reuse a saved title or delete saved presets first.");
  const next = replacing ? previous.map((item) => item.input.title === preset.input.title ? preset : item) : [...previous, preset];
  const raw = JSON.stringify({ v: 1, presets: next });
  parseClassroomPresets(raw);
  storage.setItem(classroomPresetsKey, raw);
  return next;
}
