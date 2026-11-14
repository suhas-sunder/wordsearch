import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test, vi } from "vitest";
import TopicPage from "@/app/word-searches/[category]/[topicSlug]/page";
import { CuratedPuzzlePage } from "@/components/page/CuratedPuzzlePage";
import type { PuzzleContentRecord } from "@/content/model";
import { getSitemapRecords } from "@/content/registry";

// The site-wide search island needs the App Router context. Render the puzzle page and its editorial sections directly.
vi.mock("@/components/search/PuzzleSearch", () => ({ PuzzleSearch: () => null }));

const puzzles = getSitemapRecords().filter((record): record is PuzzleContentRecord => record.contentType === "puzzle");

function paragraph(text: string, className?: string) {
  return renderToStaticMarkup(createElement("p", { className }, text));
}

function renderEditorialFixture(editorial: PuzzleContentRecord["editorial"]) {
  return renderToStaticMarkup(createElement(CuratedPuzzlePage, {
    record: {
      ...puzzles[0],
      description: "Find the animal names.",
      introduction: "Start at the top of the grid.",
      editorial
    },
    category: { id: "animals", title: "Animals", path: "/categories/animal-word-searches" }
  }));
}

describe("curated puzzle context", () => {
  test("renders the context once in the hero for all 150 indexed puzzle routes", async () => {
    expect(puzzles).toHaveLength(150);
    for (const record of puzzles) {
      const [, , category, topicSlug] = record.canonicalPath.split("/");
      const html = renderToStaticMarkup(await TopicPage({ params: Promise.resolve({ category, topicSlug }) }));
      expect(record.editorial.puzzleNote, record.canonicalPath).toBe(record.description);
      expect(record.editorial.wordListContext, record.canonicalPath).toBe(record.description);
      expect(html, record.canonicalPath).toContain(paragraph(record.description, "value-prop"));
      expect(html, record.canonicalPath).not.toContain(paragraph(record.description));
      expect(html, record.canonicalPath).toContain(paragraph(record.introduction));
      const difficulty = renderToStaticMarkup(createElement("p", null,
        createElement("strong", null, "Difficulty:"), ` ${record.editorial.difficultyExplanation}`
      ));
      expect(html, record.canonicalPath).toContain(difficulty);
      expect(html, record.canonicalPath).toContain(paragraph(record.editorial.printNote!));
    }
  });

  test("skips optional paragraphs that match the hero or introduction after collapsing whitespace", () => {
    const puzzleNote = "Find the  animal names.";
    const wordListContext = "Start at the top\nof the grid.";
    const html = renderEditorialFixture({ puzzleNote, wordListContext });
    expect(html).toContain(paragraph("Find the animal names.", "value-prop"));
    expect(html).toContain(paragraph("Start at the top of the grid."));
    expect(html).not.toContain(paragraph(puzzleNote));
    expect(html).not.toContain(paragraph(wordListContext));
  });

  test("keeps the puzzle note when only the two supplemental paragraphs match", () => {
    const puzzleNote = "Names include animals from forests and wetlands.";
    const wordListContext = "Names include animals from forests and\t wetlands.";
    const html = renderEditorialFixture({ puzzleNote, wordListContext });
    expect(html).toContain(paragraph(puzzleNote));
    expect(html).not.toContain(paragraph(wordListContext));
  });

  test("keeps similar paragraphs with extra guidance and a distinct word-list explanation", () => {
    const puzzleNote = "Find the animal names. Use the right margin to check off each animal.";
    const wordListContext = "The names include animals from forests and wetlands.";
    const html = renderEditorialFixture({ puzzleNote, wordListContext });
    expect(html).toContain(paragraph("Find the animal names.", "value-prop"));
    expect(html).toContain(paragraph(puzzleNote));
    expect(html).toContain(paragraph(wordListContext));
  });
});
