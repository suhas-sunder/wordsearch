import type { AlphabetPackId } from "@/lib/puzzle/types";

export interface SpecialtyRoute {
  slug: string;
  title: string;
  description: string;
  alphabetPack: AlphabetPackId;
  words: string[];
  status: string;
  implementation: "experimental" | "scaffold";
}

/** Visitor labels for unavailable formats; route titles/metadata remain stable. */
export function specialtyPresentation(route: SpecialtyRoute) {
  if (route.implementation !== "scaffold") return { title: route.title, description: route.description };
  const descriptions: Record<string, string> = {
    "asl-fingerspelling-word-search-generator": "Preview ASL-prefixed text labels. This format does not show fingerspelling handshapes or movement.",
    "semaphore-word-search-generator": "Preview geometric symbols. Semaphore flag positions are not available.",
    "roman-numeral-word-search-generator": "Preview an ordinary Latin-letter puzzle. Number-to-Roman-numeral conversion is not available."
  };
  return {
    title: `${route.title.replace(/ Word Search Generator$/, "")} — not available yet`,
    description: descriptions[route.slug] ?? route.status.replace("This scaffold", "This preview")
  };
}

export const specialtyRoutes: SpecialtyRoute[] = [
  { slug: "morse-code-word-search-generator", implementation: "experimental", title: "Morse Code Word Search Generator", description: "Create dot-and-dash token puzzles from Latin text or raw code groups.", alphabetPack: "morse", words: ["signal", "radio", "sos", "dash", "dot", "code", "beacon", "message"], status: "Latin letters and digits map to dot/dash cells. Raw groups are not validated as Morse characters, and a printable conversion legend is not included." },
  { slug: "braille-word-search-generator", implementation: "experimental", title: "Braille Word Search Generator", description: "Preview visual Unicode Braille letter patterns in a word-search grid.", alphabetPack: "braille", words: ["braille", "cells", "label", "reader", "touch", "dots", "letter", "access"], status: "This visual letter-pattern mapping is not tactile Braille or full Braille transcription. Digits remain ordinary digits; PDF export does not support these glyphs." },
  { slug: "asl-fingerspelling-word-search-generator", implementation: "scaffold", title: "ASL Fingerspelling Word Search Generator", description: "Build ASL-labeled token puzzles while keeping the word bank readable in Latin text.", alphabetPack: "asl", words: ["sign", "hand", "letter", "shape", "learn", "label", "spell", "word"], status: "This scaffold displays text labels such as ASL-A. It does not display handshapes or movement and is not an ASL fingerspelling representation." },
  { slug: "semaphore-word-search-generator", implementation: "scaffold", title: "Semaphore Word Search Generator", description: "A specialty route scaffold for semaphore-style symbol word searches.", alphabetPack: "emoji", words: ["signal", "flag", "angle", "ship", "message", "code", "visual", "letter"], status: "Semaphore flag positions are not implemented. This scaffold uses geometric-symbol mappings and is not a semaphore puzzle." },
  { slug: "binary-word-search-generator", implementation: "experimental", title: "Binary Word Search Generator", description: "Preview classroom words as fixed-width binary tokens.", alphabetPack: "binary", words: ["code", "byte", "logic", "binary", "input", "output", "data", "debug"], status: "Binary token generation is active. Downloadable PDF does not support these wide multi-character cells; the exporter rejects them rather than overlapping neighboring cells." },
  { slug: "hexadecimal-word-search-generator", implementation: "experimental", title: "Hexadecimal Word Search Generator", description: "Encode text as hexadecimal tokens for computer science vocabulary activities.", alphabetPack: "hex", words: ["hex", "code", "byte", "color", "memory", "data", "logic", "value"], status: "Hex token generation is active." },
  { slug: "roman-numeral-word-search-generator", implementation: "scaffold", title: "Roman Numeral Word Search Generator", description: "Create symbol-style number puzzles through the specialty pack architecture.", alphabetPack: "latin", words: ["roman", "number", "value", "ten", "five", "one", "ancient", "count"], status: "Roman numeral conversion is not implemented. This scaffold places ordinary Latin words; it does not convert numbers into Roman numerals." },
  { slug: "greek-alphabet-word-search-generator", implementation: "experimental", title: "Greek Alphabet Word Search Generator", description: "Map plain text into Greek display tokens for alphabet practice.", alphabetPack: "greek", words: ["alpha", "beta", "gamma", "delta", "omega", "letter", "symbol", "study"], status: "This experimental mapping converts Latin letters to Greek-looking symbols, with collisions. Native Greek input is not supported, and PDF export does not support these glyphs." },
  { slug: "spanish-word-search-generator", implementation: "experimental", title: "Spanish Word Search Generator", description: "Create Spanish-friendly word searches with accent normalization for placement.", alphabetPack: "spanish", words: ["familia", "escuela", "comida", "clima", "viaje", "amigo", "ciudad", "libro"], status: "Accents and the tilde in ñ are removed for placement, so año and ano become the same tokens. Review the grid carefully; this is not full Spanish-language support." },
  { slug: "french-word-search-generator", implementation: "experimental", title: "French Word Search Generator", description: "Create French-friendly word searches with accent normalization for placement.", alphabetPack: "french", words: ["famille", "ecole", "voyage", "livre", "ami", "ville", "temps", "repas"], status: "Accents are removed for placement and unsupported ligatures such as œ are discarded. Review the grid carefully; this is not full French-language support." },
  { slug: "japanese-kana-word-search-generator", implementation: "experimental", title: "Japanese Kana Word Search Generator", description: "Map classroom text into simple kana display tokens through the alphabet-pack system.", alphabetPack: "kana", words: ["kana", "nihon", "sensei", "gakko", "hon", "tabi", "sora", "mizu"], status: "This experimental mapping converts individual Latin letters to kana-looking symbols. Native kana input and validated romanization are not supported; PDF export does not support these glyphs." },
  { slug: "emoji-word-search-generator", implementation: "experimental", title: "Emoji Word Search Generator", description: "Preview word searches using an experimental geometric-symbol mapping.", alphabetPack: "emoji", words: ["shape", "symbol", "star", "circle", "square", "pattern", "match", "play"], status: "This experimental mapping uses geometric symbols, includes token collisions and does not accept direct emoji input. PDF export does not support these glyphs." },
  { slug: "hidden-message-word-search-generator", implementation: "experimental", title: "Hidden Message Word Search Generator", description: "Create a word search where leftover cells can reveal a short hidden message.", alphabetPack: "latin", words: ["hidden", "message", "secret", "answer", "letters", "reveal", "search", "solve"], status: "Leftover cells receive the message in row order. If the message exceeds available cells, only the fitting part is applied and a warning is shown." }
];

export function getSpecialty(slug: string) {
  return specialtyRoutes.find((route) => route.slug === slug);
}
