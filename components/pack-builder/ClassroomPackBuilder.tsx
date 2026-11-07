"use client";

import { useRef, useState, type FormEvent } from "react";
import styles from "./ClassroomPackBuilder.module.css";
import { buildClassroomPack } from "@/lib/pack/classroom-pack";
import type { PaperSize } from "@/lib/puzzle/output-options";
import { classroomPresetsKey, readClassroomPresets, saveClassroomPreset, type ClassroomPreset } from "@/lib/pack/presets";

const control = styles.control;
const label = styles.label;

export function ClassroomPackBuilder() {
  const [title, setTitle] = useState("Classroom");
  const [wordsText, setWordsText] = useState("");
  const [seed, setSeed] = useState("");
  const [count, setCount] = useState<5 | 10 | 20>(5);
  const [paperSize, setPaperSize] = useState<PaperSize>("letter");
  const [order, setOrder] = useState<"answers-last" | "interleaved">("answers-last");
  const [pages, setPages] = useState<"both" | "students" | "answers">("both");
  const [largePrint, setLargePrint] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [presets, setPresets] = useState<ClassroomPreset[]>([]);
  const active = useRef(false);

  function presetAction(action: "show" | "save" | "clear") {
    setError("");
    setStatus("");
    try {
      const storage = window.localStorage;
      if (action === "clear") {
        storage.removeItem(classroomPresetsKey);
        setPresets([]);
        setStatus("Saved classroom presets deleted from this browser.");
      } else if (action === "show") {
        const saved = readClassroomPresets(storage);
        setPresets(saved);
        setStatus(saved.length ? `${saved.length} saved presets available.` : "No classroom presets saved in this browser.");
      } else {
        setPresets(saveClassroomPreset(storage, { input: { title, wordsText, seed, count }, paperSize, order, pages, largePrint }));
        setStatus(`Saved ${title} in this browser. Saving the same title replaces that preset.`);
      }
    } catch {
      setError("Presets could not be read or saved. Storage may be blocked, full, invalid or at the five-preset limit. Your form entries are unchanged. Delete saved presets to clear incompatible data.");
    }
  }

  function loadPreset(preset: ClassroomPreset) {
    setTitle(preset.input.title); setWordsText(preset.input.wordsText); setSeed(preset.input.seed); setCount(preset.input.count);
    setPaperSize(preset.paperSize); setOrder(preset.order); setPages(preset.pages); setLargePrint(preset.largePrint === true);
    setError(""); setStatus(`Loaded ${preset.input.title}. Review the entries before downloading.`);
  }

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
      await downloadBrowserPuzzlePackPdf(pack, { paperSize, order, pages, layoutProfile: largePrint ? "large-print" : "pack" });
      setStatus(`Your ${count}-puzzle PDF download has started.`);
    } catch (cause) {
      setStatus("");
      setError(cause instanceof Error && cause.name === "PdfPackLayoutError" ? cause.message : downloading ? "The PDF could not be downloaded. Please try again; your entries are unchanged." : cause instanceof Error ? cause.message : "The pack could not be created. Please check your entries and try again.");
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
        <p>Create 5, 10 or 20 different grids from the same word list. Download student worksheets, teacher answers or both.</p>
        <p>English letters only · One puzzle per page · Ink-saving output</p>
      </div>
      <form onSubmit={onSubmit} noValidate className={styles.form} aria-busy={busy}>
        <div><label className={label} htmlFor="pack-title">Pack title</label><input className={control} id="pack-title" value={title} onChange={(event) => setTitle(event.target.value)} aria-describedby="title-help" /><p id="title-help" className={styles.help}>Up to 80 letters, numbers, apostrophes or hyphens; use single spaces and no spaces at either end.</p></div>
        <div><label className={label} htmlFor="pack-words">Words or phrases</label><textarea className={control} id="pack-words" rows={8} value={wordsText} onChange={(event) => setWordsText(event.target.value)} aria-describedby="words-help" /><p id="words-help" className={styles.help}>Enter 2–30 different words or phrases, one per line. Use English letters and single spaces; 2–14 letters per entry. No blank lines or punctuation. A 9-point minimum grid type size applies; lists that cannot fit will be rejected.</p></div>
        <div><label className={label} htmlFor="pack-seed">Base seed</label><input className={control} id="pack-seed" value={seed} onChange={(event) => setSeed(event.target.value)} aria-describedby="seed-help" /><p id="seed-help" className={styles.help}>Use 1–64 letters, numbers, underscores or hyphens. Save this seed and the exact title and word list to recreate the assignments. Assignment numbers 01–{String(count).padStart(2, "0")} use fixed derived seeds.</p></div>
        <div className={styles.options}>
          <div><label className={label} htmlFor="pack-count">Puzzles</label><select className={control} id="pack-count" value={count} onChange={(event) => setCount(Number(event.target.value) as 5 | 10 | 20)}><option value={5}>5 puzzles</option><option value={10}>10 puzzles</option><option value={20}>20 puzzles</option></select></div>
          <div><label className={label} htmlFor="pack-paper">Paper size</label><select className={control} id="pack-paper" value={paperSize} onChange={(event) => setPaperSize(event.target.value as PaperSize)}><option value="letter">US Letter</option><option value="a4">A4</option></select></div>
          <div><label className={label} htmlFor="pack-pages">Download pages</label><select className={control} id="pack-pages" value={pages} onChange={(event) => setPages(event.target.value as typeof pages)}><option value="both">Worksheets and answers</option><option value="students">Student worksheets only</option><option value="answers">Teacher answers only</option></select></div>
          <div><label className={label} htmlFor="pack-order">Answer pages</label><select className={control} id="pack-order" value={order} disabled={pages !== "both"} onChange={(event) => setOrder(event.target.value as "answers-last" | "interleaved")}><option value="answers-last">All at the end</option><option value="interleaved">After each puzzle</option></select></div>
        </div>
        <div><label className={label} htmlFor="pack-type">Print type</label><select className={control} id="pack-type" value={largePrint ? "large" : "standard"} onChange={(event) => setLargePrint(event.target.value === "large")}><option value="standard">Standard</option><option value="large">Large grid and word bank</option></select><p className={styles.help}>Large output uses at least 16-point grid letters and an 18-point word bank at 100% scale. Header and footer text stays smaller. Dense lists may not fit; shorten the list if needed.</p></div>
        <p className={styles.help}>The PDF is created in your browser. It uses the existing ink-saving style, which includes some tinted gray elements.</p>
        <fieldset className={styles.presets} disabled={busy}>
          <legend>Local classroom presets</legend>
          <p className={styles.help}>Save stores the exact title, word list, seed and output choices on this device. Up to five titles; saving an existing title replaces it. Other people using this browser can read them. Nothing is uploaded or saved automatically.</p>
          <div className={styles.presetActions}>
            <button type="button" onClick={() => presetAction("save")}>Save preset on this device</button>
            <button type="button" onClick={() => presetAction("show")}>Show saved presets</button>
            <button type="button" onClick={() => presetAction("clear")}>Delete saved presets</button>
          </div>
          {presets.length > 0 && <ul>{presets.map((preset) => <li key={preset.input.title}><button type="button" onClick={() => loadPreset(preset)}>Load {preset.input.title}</button></li>)}</ul>}
        </fieldset>
        {error && <p role="alert" className={styles.error}>{error}</p>}
        <p role="status" aria-live="polite" className={styles.status}>{status}</p>
        <button type="submit" disabled={busy} className={styles.button}>{busy ? "Preparing PDF…" : "Download PDF pack"}</button>
      </form>
    </div>
  );
}
