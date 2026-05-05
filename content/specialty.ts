import type { AlphabetPackId } from "@/lib/puzzle/types";

export interface SpecialtyRoute {
  slug: string;
  title: string;
  description: string;
  alphabetPack: AlphabetPackId;
  words: string[];
  status: string;
}

export const specialtyRoutes: SpecialtyRoute[] = [
  { slug: "morse-code-word-search-generator", title: "Morse Code Word Search Generator", description: "Create Morse code word searches from plain text or dot/dash input with a printable legend.", alphabetPack: "morse", words: ["signal", "radio", "sos", "dash", "dot", "code", "beacon", "message"], status: "Plain-text and dot/dash token generation is active." },
  { slug: "braille-word-search-generator", title: "Braille Word Search Generator", description: "Generate word searches using real Unicode braille cells with larger print spacing.", alphabetPack: "braille", words: ["braille", "cells", "label", "reader", "touch", "dots", "letter", "access"], status: "Unicode braille-cell output is active." },
  { slug: "asl-fingerspelling-word-search-generator", title: "ASL Fingerspelling Word Search Generator", description: "Build ASL-labeled token puzzles while keeping the word bank readable in Latin text.", alphabetPack: "asl", words: ["sign", "hand", "letter", "shape", "learn", "label", "spell", "word"], status: "Accessible ASL-labeled token scaffolding is active; detailed handshape artwork can be expanded later." },
  { slug: "semaphore-word-search-generator", title: "Semaphore Word Search Generator", description: "A specialty route scaffold for semaphore-style symbol word searches.", alphabetPack: "emoji", words: ["signal", "flag", "angle", "ship", "message", "code", "visual", "letter"], status: "Symbol-pack route scaffold is active." },
  { slug: "binary-word-search-generator", title: "Binary Word Search Generator", description: "Encode classroom words as fixed-width binary tokens for coding and CS printables.", alphabetPack: "binary", words: ["code", "byte", "logic", "binary", "input", "output", "data", "debug"], status: "Binary token generation is active." },
  { slug: "hexadecimal-word-search-generator", title: "Hexadecimal Word Search Generator", description: "Encode text as hexadecimal tokens for computer science vocabulary activities.", alphabetPack: "hex", words: ["hex", "code", "byte", "color", "memory", "data", "logic", "value"], status: "Hex token generation is active." },
  { slug: "roman-numeral-word-search-generator", title: "Roman Numeral Word Search Generator", description: "Create symbol-style number puzzles through the specialty pack architecture.", alphabetPack: "latin", words: ["roman", "number", "value", "ten", "five", "one", "ancient", "count"], status: "Route scaffold is active with standard token output." },
  { slug: "greek-alphabet-word-search-generator", title: "Greek Alphabet Word Search Generator", description: "Map plain text into Greek display tokens for alphabet practice.", alphabetPack: "greek", words: ["alpha", "beta", "gamma", "delta", "omega", "letter", "symbol", "study"], status: "Greek display-token generation is active." },
  { slug: "spanish-word-search-generator", title: "Spanish Word Search Generator", description: "Create Spanish-friendly word searches with accent normalization for placement.", alphabetPack: "spanish", words: ["familia", "escuela", "comida", "clima", "viaje", "amigo", "ciudad", "libro"], status: "Spanish-friendly normalization is active." },
  { slug: "french-word-search-generator", title: "French Word Search Generator", description: "Create French-friendly word searches with accent normalization for placement.", alphabetPack: "french", words: ["famille", "ecole", "voyage", "livre", "ami", "ville", "temps", "repas"], status: "French-friendly normalization is active." },
  { slug: "japanese-kana-word-search-generator", title: "Japanese Kana Word Search Generator", description: "Map classroom text into simple kana display tokens through the alphabet-pack system.", alphabetPack: "kana", words: ["kana", "nihon", "sensei", "gakko", "hon", "tabi", "sora", "mizu"], status: "Kana display-token generation is active." },
  { slug: "emoji-word-search-generator", title: "Emoji Word Search Generator", description: "Create simple symbol word searches with accessible labels.", alphabetPack: "emoji", words: ["shape", "symbol", "star", "circle", "square", "pattern", "match", "play"], status: "Accessible symbol-token generation is active." },
  { slug: "hidden-message-word-search-generator", title: "Hidden Message Word Search Generator", description: "Create a word search where leftover cells can reveal a short hidden message.", alphabetPack: "latin", words: ["hidden", "message", "secret", "answer", "letters", "reveal", "search", "solve"], status: "Hidden-message validation and filler placement is active." }
];

export function getSpecialty(slug: string) {
  return specialtyRoutes.find((route) => route.slug === slug);
}
