import { describe, expect, test } from "vitest";
import { specialtyPresentation, specialtyRoutes } from "@/content/specialty";

describe("unavailable specialty choices", () => {
  test("names all three unavailable formats before users follow a generator link", () => {
    const unavailable = specialtyRoutes.filter(route => route.implementation === "scaffold");
    expect(unavailable).toHaveLength(3);
    for (const route of unavailable) {
      const presentation = specialtyPresentation(route);
      expect(presentation.title).toContain("not available yet");
      expect(presentation.title).not.toContain("Generator");
      expect(presentation.description).toMatch(/does not|not available/);
    }
  });
  test("preserves every experimental label and every stored route title", () => {
    for (const route of specialtyRoutes) {
      const before = JSON.stringify(route);
      const presentation = specialtyPresentation(route);
      if (route.implementation === "experimental") expect(presentation).toEqual({ title: route.title, description: route.description });
      expect(JSON.stringify(route)).toBe(before);
    }
  });
});
