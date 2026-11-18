"use client";

import { useEffect, useId, useState } from "react";
import type { PuzzleRequest } from "@/lib/puzzle/types";
import { decodePuzzleShareState } from "@/lib/share-state/state";
import { clearPuzzleLibrary, deleteLocalPuzzle, puzzleLibraryKey, puzzleLibraryLimit, readPuzzleLibrary, saveLocalPuzzle, type LibraryRead } from "@/lib/puzzle/library";

export function LocalPuzzleLibrary({ request, onOpen }: { request: Partial<PuzzleRequest> | null; onOpen(request: Partial<PuzzleRequest>): void }) {
  const [library, setLibrary] = useState<LibraryRead | { kind: "loading" }>({ kind: "loading" });
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const nameId = useId();
  function refresh() {
    try { setLibrary(readPuzzleLibrary(window.localStorage)); } catch { setLibrary({ kind: "unavailable" }); }
  }
  useEffect(() => {
    refresh();
    const update = (event: StorageEvent) => { if (event.key === puzzleLibraryKey || event.key === null) refresh(); };
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []);
  function save() {
    let result: ReturnType<typeof saveLocalPuzzle> = "unavailable";
    try { if (request) result = saveLocalPuzzle(window.localStorage, crypto.randomUUID(), name.trim(), request); } catch { /* Local saving is optional. */ }
    setMessage(result === "saved" ? "Puzzle saved on this device." : result === "duplicate" ? "That saved name already exists. Choose another name or delete the old entry." : result === "full" ? "Your device library is full. Delete an entry before saving another." : result === "invalid" ? "The puzzle, name, or saved library is invalid. Nothing was overwritten." : "Device storage is unavailable or full. You can keep editing without saving.");
    if (result === "saved") setName("");
    refresh();
  }
  function open(id: string) {
    try {
      const fresh = readPuzzleLibrary(window.localStorage);
      setLibrary(fresh);
      const entry = fresh.kind === "ready" ? fresh.entries.find((item) => item.id === id) : undefined;
      const decoded = entry ? decodePuzzleShareState(entry.state) : null;
      if (!decoded) { setMessage("This saved puzzle is missing or invalid. Current edits were kept."); return; }
      if (!window.confirm("Open this saved puzzle and replace the current builder edits?")) return;
      onOpen(decoded);
      setMessage(`Opened ${entry!.name}. The original seed and puzzle definition were restored.`);
    } catch { setMessage("Device storage is unavailable. Current edits were kept."); }
  }
  function remove(id: string) {
    if (!window.confirm("Delete this saved puzzle from this device?")) return;
    try { setMessage(deleteLocalPuzzle(window.localStorage, id) ? "Saved puzzle deleted." : "The saved puzzle could not be deleted."); } catch { setMessage("Device storage is unavailable."); }
    refresh();
  }
  function clear() {
    if (!window.confirm("Delete all saved puzzle definitions from this device? Solver progress and classroom presets are separate and will be kept.")) return;
    try { setMessage(clearPuzzleLibrary(window.localStorage) ? "Saved puzzle library cleared." : "The library could not be cleared."); } catch { setMessage("Device storage is unavailable."); }
    refresh();
  }
  return <details className="local-puzzle-library">
    <summary>Saved puzzles on this device</summary>
    <p>Save up to {puzzleLibraryLimit} named puzzle definitions, then reopen the exact seed and word list. This is separate from found-word progress and classroom presets.</p>
    <p className="control-help">Names, titles, words and seeds are stored unencrypted in this browser when you choose Save. Other people using this browser can read them. Nothing is uploaded or synchronized. Avoid saving sensitive classroom information on shared devices.</p>
    <label htmlFor={nameId}>Saved puzzle name</label>
    <input id={nameId} value={name} maxLength={80} onChange={(event) => setName(event.target.value)} />
    <button type="button" className="secondary-button" disabled={!request || !name.trim() || library.kind !== "ready"} onClick={save}>Save puzzle on this device</button>
    {library.kind === "loading" && <p>Checking saved puzzles…</p>}
    {library.kind === "unavailable" && <p>Device storage is unavailable. Puzzle creation still works.</p>}
    {library.kind === "invalid" && <p>The saved library is invalid or from an unsupported version. It will not be opened or overwritten. You can explicitly clear it below.</p>}
    {library.kind === "ready" && (library.entries.length ? <ul>{library.entries.map((entry) => <li key={entry.id}><span>{entry.name}</span> <button type="button" className="secondary-button" aria-label={`Open saved puzzle ${entry.name}`} onClick={() => open(entry.id)}>Open</button> <button type="button" className="secondary-button" aria-label={`Delete saved puzzle ${entry.name}`} onClick={() => remove(entry.id)}>Delete</button></li>)}</ul> : <p>No named puzzles saved yet.</p>)}
    {(library.kind === "invalid" || (library.kind === "ready" && library.entries.length > 0)) && <button type="button" className="secondary-button" onClick={clear}>Clear saved puzzle library</button>}
    {message && <p role="status">{message}</p>}
  </details>;
}
