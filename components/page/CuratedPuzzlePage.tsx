import Link from "next/link";
import type { PuzzleContentRecord } from "@/content/model";
import { IndexablePage } from "@/components/page/IndexablePage";

export interface RelatedContentLink {
  id: string;
  title: string;
  path: string;
}

export function CuratedPuzzlePage({ record, category, related = [] }: { record: PuzzleContentRecord; category: RelatedContentLink; related?: RelatedContentLink[] }) {
  const { puzzle, editorial } = record;
  return (
    <IndexablePage
      title={record.title}
      h1={record.h1}
      description={record.description}
      intro={record.introduction}
      path={record.canonicalPath}
      words={puzzle.words}
      difficulty={puzzle.difficulty}
      alphabetPack={puzzle.alphabetPack}
      faq={editorial.faq}
      adTemplate="curated-puzzle"
      breadcrumbs={record.breadcrumbs}
      requestOverride={{
        title: puzzle.puzzleTitle,
        seed: puzzle.seed,
        rows: puzzle.rows,
        cols: puzzle.columns,
        autoSize: !puzzle.rows || !puzzle.columns,
        directions: puzzle.directions,
        allowOverlap: puzzle.allowOverlap,
        largePrint: puzzle.largePrintSuitable
      }}
    >
      <section className="content-section site-shell two-col">
        <div>
          <h2>Puzzle details</h2>
          {editorial.puzzleNote ? <p>{editorial.puzzleNote}</p> : null}
          {editorial.difficultyExplanation ? <p><strong>Difficulty:</strong> {editorial.difficultyExplanation}</p> : null}
          {editorial.wordListContext ? <p>{editorial.wordListContext}</p> : null}
        </div>
        <div>
          <h2>Using this puzzle</h2>
          {editorial.suggestedUses?.length ? <ul>{editorial.suggestedUses.map((use) => <li key={use}>{use}</li>)}</ul> : null}
          {editorial.classroomNote ? <p>{editorial.classroomNote}</p> : null}
          {editorial.printNote ? <p>{editorial.printNote}</p> : null}
        </div>
      </section>
      <section className="content-section site-shell">
        <h2>More puzzles and tools</h2>
        <div className="topic-list">
          <Link href={category.path}>{category.title}</Link>
          {related.map((item) => <Link key={item.id} href={item.path}>{item.title}</Link>)}
          <Link href="/word-search-generator">Create a custom word search</Link>
        </div>
      </section>
    </IndexablePage>
  );
}

export function GuideAttribution({ authorName, authorPath, reviewerName, dateModified }: { authorName?: string; authorPath?: string; reviewerName?: string; dateModified?: string }) {
  if (!authorName && !reviewerName && !dateModified) return null;
  return (
    <p className="guide-attribution">
      {authorName ? <>By {authorPath ? <Link href={authorPath}>{authorName}</Link> : authorName}</> : null}
      {reviewerName ? <> · Reviewed by {reviewerName}</> : null}
      {dateModified ? <> · Updated <time dateTime={dateModified}>{dateModified}</time></> : null}
    </p>
  );
}
