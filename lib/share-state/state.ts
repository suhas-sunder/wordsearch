import type { PuzzleRequest } from "@/lib/puzzle/types";

export function encodeShareState(state: Partial<PuzzleRequest>) {
  const json = JSON.stringify(state);
  if (typeof window === "undefined" && typeof Buffer !== "undefined") {
    return Buffer.from(json, "utf8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function decodeShareState(value: string | null | undefined): Partial<PuzzleRequest> | null {
  if (!value) return null;
  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    if (typeof window === "undefined" && typeof Buffer !== "undefined") {
      return JSON.parse(Buffer.from(padded, "base64").toString("utf8")) as Partial<PuzzleRequest>;
    }
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as Partial<PuzzleRequest>;
  } catch {
    return null;
  }
}

export function shareUrl(path: string) {
  const base = "https://www.ilovewordsearch.com";
  return `${base}${path}`;
}

export function stateId(state: Partial<PuzzleRequest>) {
  return encodeShareState(state);
}
