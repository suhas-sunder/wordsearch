import { orderWordBank } from "@/lib/puzzle/parse";
import type { PuzzleResult } from "@/lib/puzzle/types";
import { shareUrl } from "@/lib/share-state/state";
import { PuzzleSvg } from "@/components/puzzle/PuzzleSvg";

interface PrintablePuzzleProps {
  puzzle: PuzzleResult;
  answerKey?: boolean;
  qrDataUrl?: string;
  utilityLabel?: string;
  headingLevel?: 1 | 2;
}

export function PrintablePuzzle({ puzzle, answerKey = false, qrDataUrl, utilityLabel, headingLevel = 1 }: PrintablePuzzleProps) {
  const words = orderWordBank(
    puzzle.placed.map((placement) => ({
      id: placement.wordId,
      raw: placement.label,
      label: placement.label,
      normalized: placement.label,
      tokens: placement.tokens
    })),
    puzzle.request.wordBankOrder
  );
  const target = shareUrl(puzzle.sharePath);
  const Heading = headingLevel === 1 ? "h1" : "h2";

  return (
    <article className="print-sheet" aria-label={answerKey ? "Answer key" : "Printable word search"}>
      <header className="print-header">
        <div>
          <p className="print-brand">www.iLoveWordSearch.com</p>
          <Heading>{puzzle.request.title}</Heading>
          {puzzle.request.subtitle && <p className="print-subtitle">{puzzle.request.subtitle}</p>}
          <p className="print-instructions">
            {answerKey ? "Answer key. Keep this page separate from student copies." : puzzle.request.instructions}
          </p>
        </div>
        {puzzle.request.nameDateLine && !answerKey && (
          <div className="name-date">
            <span>Name</span>
            <span>Date</span>
          </div>
        )}
      </header>
      <div className="print-grid-wrap">
        <PuzzleSvg puzzle={puzzle} answerKey={answerKey} />
      </div>
      {!answerKey && (
        <section className="print-word-bank" aria-label="Word bank">
          {words.map((word) => (
            <span key={word.id}>{word.label}</span>
          ))}
        </section>
      )}
      <footer className="print-footer">
        <div>
          <strong>{utilityLabel ?? (answerKey ? "Answer key" : "Create this puzzle")}</strong>
          <span>{target.length > 96 ? "Scan the QR code to open the exact seeded puzzle." : target}</span>
        </div>
        {qrDataUrl ? <img src={qrDataUrl} alt="QR code for this puzzle state" /> : <div className="qr-placeholder" aria-label="QR code placeholder" />}
      </footer>
    </article>
  );
}
