import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test, vi } from "vitest";
import CategoryPage, { generateStaticParams as categoryParams } from "@/app/categories/[slug]/page";
import CollectionPage, { generateStaticParams as collectionParams } from "@/app/collections/[slug]/page";
import GuidePage, { generateStaticParams as guideParams } from "@/app/guides/[slug]/page";
import { getRouteRecord } from "@/content/registry";
import { AD_PLACEMENTS } from "@/lib/monetization/adsense";
import { editorialAdTemplate } from "@/lib/monetization/editorial-template";
import { draftEditorialRoutes, publishedEditorialExamples } from "../fixtures/editorial-ad-routes";

// The site-wide search island needs an App Router. The page and ad slots render as usual.
vi.mock("@/components/search/PuzzleSearch", () => ({ PuzzleSearch: () => null }));

const pages = {
  categories: { render: CategoryPage, staticParams: categoryParams },
  collections: { render: CollectionPage, staticParams: collectionParams },
  guides: { render: GuidePage, staticParams: guideParams }
};

async function markup(path: string) {
  const [, family, slug] = path.split("/");
  const page = pages[family as keyof typeof pages];
  return renderToStaticMarkup(await page.render({ params: Promise.resolve({ slug }) }));
}

describe("editorial ad eligibility", () => {
  test("requires a published and indexable record", () => {
    expect(editorialAdTemplate(undefined, "guide")).toBe("draft");
    expect(editorialAdTemplate({ publicationStatus: "published", indexable: false }, "guide")).toBe("draft");
    expect(editorialAdTemplate({ publicationStatus: "draft", indexable: true }, "guide")).toBe("draft");
    expect(editorialAdTemplate({ publicationStatus: "published", indexable: true }, "guide")).toBe("guide");
  });

  test("the generated category, collection and guide route inventory covers the full approved draft set", () => {
    const drafts = Object.entries(pages).flatMap(([family, page]) =>
      page.staticParams().map(({ slug }) => `/${family}/${slug}`).filter((path) => {
        const record = getRouteRecord(path);
        expect(record, path).toBeDefined();
        const isDraft = record?.publicationStatus === "draft";
        expect(record?.indexable, path).toBe(!isDraft);
        return isDraft;
      })
    );
    expect(drafts.sort()).toEqual(draftEditorialRoutes);
  });

  test.each(draftEditorialRoutes)("%s renders content without shell or local ad slots", async (path) => {
    const html = await markup(path);
    expect(html).toContain("<h1>");
    expect(html).not.toMatch(/data-ad-(placement|placeholder|client|slot)|data-ilws-ad|adsbygoogle|ad-page-frame|ad-below-header-region|ad-seo-region/);
  });

  test.each(publishedEditorialExamples)("%s still renders all six placements", async (path) => {
    const html = await markup(path);
    const placements = [...html.matchAll(/data-ad-placement="([^"]+)"/g)].map((match) => match[1]);
    expect(placements.sort()).toEqual([...AD_PLACEMENTS].sort());
  });

  test("the collection browsing tip appears only when there are puzzle cards", async () => {
    const tip = "Check the difficulty on each card to find a puzzle that suits you.";
    expect(await markup("/collections/easy-printable-word-searches")).toContain(tip);
    expect(await markup("/collections/brain-training-word-searches")).not.toContain(tip);
  });
});
