import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test, vi } from "vitest";
import SpecialtyPage, { generateMetadata } from "@/app/specialty/[slug]/page";
import { specialtyRoutes } from "@/content/specialty";

// The full page includes a search control; SSR needs a router context even though
// this test never navigates. Keep the actual page, builder fallback and notices.
vi.mock("next/navigation", async (importOriginal) => ({
  ...await importOriginal<typeof import("next/navigation")>(),
  useRouter: () => ({ push: vi.fn() })
}));

describe("specialty limitations are available before using the preview", () => {
  test.each(specialtyRoutes)("$slug retains exact capability boundaries and noindex metadata", async (route) => {
    const props = { params: Promise.resolve({ slug: route.slug }) };
    const html = renderToStaticMarkup(await SpecialtyPage(props));
    const note = html.match(/<div[^>]*role="note"[\s\S]*?<\/div>/)?.[0];
    expect(note).toBeDefined();
    expect(note).toContain(route.status.replace("This scaffold", "This preview"));
    const previewIndex = html.indexOf('class="builder-loading-shell"');
    expect(previewIndex).toBeGreaterThan(-1);
    expect(html.indexOf(note!)).toBeLessThan(previewIndex);
    expect(html).toContain(`<h1>${route.title}</h1>`);
    expect(html).not.toContain("data-ad-placement=");
    const intro = html.match(/<section class="content-section site-shell intro-section">([\s\S]*?)<\/section>/)?.[1];
    expect(intro).not.toContain(route.status);
    if (route.implementation === "scaffold") expect(note).toContain("Format not available yet");
    const metadata = await generateMetadata(props);
    expect(metadata.robots).toEqual({ index: false, follow: true });
    expect(metadata.alternates?.canonical).toBe(`/specialty/${route.slug}`);
    if (process.env.COPY_RENDER_OUTPUT) {
      mkdirSync(process.env.COPY_RENDER_OUTPUT, { recursive: true });
      writeFileSync(join(process.env.COPY_RENDER_OUTPUT, `${route.slug}.html`), html);
    }
  });
});
