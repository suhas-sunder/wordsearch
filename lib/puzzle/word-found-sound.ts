export interface WordFoundSound {
  play(): Promise<void>;
  stop(): void;
  dispose(): void;
}

function browserContext() {
  return typeof window !== "undefined" && typeof window.AudioContext === "function" ? new window.AudioContext() : null;
}

/** Local opt-in feedback. Constructing the controller never opens an audio device. */
export function createWordFoundSound(createContext: () => AudioContext | null = browserContext): WordFoundSound {
  let context: AudioContext | null = null;
  let disposed = false;
  let generation = 0;
  const nodes = new Set<{ oscillator: OscillatorNode; gain: GainNode }>();

  function clearNodes() {
    for (const { oscillator, gain } of nodes) {
      oscillator.onended = null;
      try { oscillator.stop(); } catch { /* It may have already ended. */ }
      try { oscillator.disconnect(); gain.disconnect(); } catch { /* Best-effort cleanup. */ }
    }
    nodes.clear();
  }

  function stop() {
    generation++;
    clearNodes();
    const previous = context;
    context = null;
    if (previous && previous.state !== "closed") {
      try { void previous.close().catch(() => {}); } catch { /* Solving never depends on audio. */ }
    }
  }

  return {
    async play() {
      if (disposed) return;
      const ticket = ++generation;
      clearNodes();
      try {
        if (!context || context.state === "closed") context = createContext();
        const current = context;
        if (!current) return;
        if (current.state === "suspended") await current.resume();
        if (disposed || generation !== ticket || context !== current || current.state !== "running") return;
        const oscillator = current.createOscillator();
        const gain = current.createGain();
        const entry = { oscillator, gain };
        nodes.add(entry);
        const now = current.currentTime;
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(660, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.025, now + 0.008);
        gain.gain.linearRampToValueAtTime(0, now + 0.085);
        oscillator.connect(gain);
        gain.connect(current.destination);
        oscillator.onended = () => {
          nodes.delete(entry);
          try { oscillator.disconnect(); gain.disconnect(); } catch { /* The context may already be closed. */ }
        };
        oscillator.start(now);
        oscillator.stop(now + 0.09);
      } catch {
        // Unsupported, suspended, denied or interrupted audio stays silent.
        // A later successful word can retry after another user interaction.
        if (generation === ticket) stop();
      }
    },
    stop,
    dispose() { disposed = true; stop(); }
  };
}
