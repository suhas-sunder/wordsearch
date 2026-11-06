"use client";

import { useRef, useState, type FormEvent } from "react";
import styles from "./ClassroomPackBuilder.module.css";
import { buildClassroomPack } from "@/lib/pack/classroom-pack";
import type { PaperSize } from "@/lib/puzzle/output-options";

const control = styles.control;
const label = styles.label;

export function ClassroomPackBuilder() {
  const [title, setTitle] = useState("Classroom");
  const [wordsText, setWordsText] = useState("");
  const [seed, setSeed] = useState("");
  const [count, setCount] = useState<5 | 10>(5);
  const [paperSize, setPaperSize] = useState<PaperSize>("letter");
  const [order, setOrder] = useState<"answers-last" | "interleaved">("answers-last");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const active = useRef(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (active.current) return;
    active.current = true;
    setBusy(true);
    setError("");
    setStatus("Preparing your pack locally…");
    let downloading = false;
    try {
      // Allow the busy state to paint before the bounded synchronous work starts.
      await new Promise<void>((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
      const pack = buildClassroomPack({ title, wordsText, seed, count });
      downloading = true;
      const { downloadBrowserPuzzlePackPdf } = await import("@/lib/pdf/browser-pack-download");
      await downloadBrowserPuzzlePackPdf(pack, { paperSize, order });
      setStatus(`Your ${count}-puzzle PDF download has started.`);
    } catch (cause) {
      setStatus("");
      setError(downloading ? "The PDF could not be downloaded. Please try again; your entries are unchanged." : cause instanceof Error ? cause.message : "The pack could not be created. Please check your entries and try again.");
    } finally {
      active.current = false;
      setBusy(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.heading}>
        <span className="eyebrow">Printable classroom worksheets</span>
        <h1>Word Search Pack Builder</h1>
        <p>Create 5 or 10 different grids from the same word list. Each worksheet has a matching answer page.</p>
        <p>English letters only · One puzzle per page · Ink-saving output</p>
      </div>
      <form onSubmit={onSubmit} noValidate className={styles.form} aria-busy={busy}>
        <div><label className={label} htmlFor="pack-title">Pack title</label><input className={control} id="pack-title" value={title} onChange={(event) => setTitle(event.target.value)} aria-describedby="title-help" /><p id="title-help" className={styles.help}>Up to 20 letters, numbers, spaces, apostrophes or hyphens.</p></div>
        <div><label className={label} htmlFor="pack-words">Words or phrases</label><textarea className={control} id="pack-words" rows={8} value={wordsText} onChange={(event) => setWordsText(event.target.value)} aria-describedby="words-help" /><p id="words-help" className={styles.help}>Enter 2–12 different words or phrases, one per line. Use English letters and single spaces; 2–14 letters per entry. No blank lines or punctuation. Very wide lists may need fewer or shorter entries to fit on the page.</p></div>
        <div><label className={label} htmlFor="pack-seed">Base seed</label><input className={control} id="pack-seed" value={seed} onChange={(event) => setSeed(event.target.value)} aria-describedby="seed-help" /><p id="seed-help" className={styles.help}>Use 1–64 letters, numbers, underscores or hyphens. Save this seed and the exact title and word list to recreate the assignments. Assignment numbers 01–{String(count).padStart(2, "0")} use fixed derived seeds.</p></div>
        <div className={styles.options}>
          <div><label className={label} htmlFor="pack-count">Puzzles</label><select className={control} id="pack-count" value={count} onChange={(event) => setCount(Number(event.target.value) as 5 | 10)}><option value={5}>5 puzzles</option><option value={10}>10 puzzles</option></select></div>
          <div><label className={label} htmlFor="pack-paper">Paper size</label><select className={control} id="pack-paper" value={paperSize} onChange={(event) => setPaperSize(event.target.value as PaperSize)}><option value="letter">US Letter</option><option value="a4">A4</option></select></div>
          <div><label className={label} htmlFor="pack-order">Answer pages</label><select className={control} id="pack-order" value={order} onChange={(event) => setOrder(event.target.value as "answers-last" | "interleaved")}><option value="answers-last">All at the end</option><option value="interleaved">After each puzzle</option></select></div>
        </div>
        <p className={styles.help}>The PDF is created in your browser. It uses the existing ink-saving style, which includes some tinted gray elements.</p>
        {error && <p role="alert" className={styles.error}>{error}</p>}
        <p role="status" aria-live="polite" className={styles.status}>{status}</p>
        <button type="submit" disabled={busy} className={styles.button}>{busy ? "Preparing PDF…" : "Download PDF pack"}</button>
      </form>
    </div>
  );
}
