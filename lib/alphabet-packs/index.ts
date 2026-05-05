import type { AlphabetPack, AlphabetPackId } from "@/lib/puzzle/types";

const latinAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const rareLetters = "ABCDEFGHIKLMNOPRSTUVWYZJQXZ".split("");

function stripDiacritics(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function cleanLatin(value: string) {
  return stripDiacritics(value)
    .replace(/&/g, " AND ")
    .replace(/[^A-Za-z0-9\s-]/g, " ")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function latinTokens(input: string) {
  return cleanLatin(input).replace(/\s+/g, "").split("");
}

function basicPack(id: AlphabetPackId, label: string, description: string): AlphabetPack {
  return {
    id,
    label,
    description,
    supportsPlainText: true,
    normalizeInput: cleanLatin,
    tokenize: latinTokens,
    encodeWord(input) {
      const labelValue = input.trim().replace(/\s+/g, " ");
      const normalized = cleanLatin(input);
      return {
        label: labelValue,
        normalized,
        tokens: normalized.replace(/\s+/g, "").split("")
      };
    },
    fillerTokens(seed, usedTokens, custom) {
      const customTokens = custom ? latinTokens(custom) : [];
      const source = customTokens.length ? customTokens : usedTokens.length ? Array.from(new Set([...usedTokens, ...latinAlphabet])) : latinAlphabet;
      return source.length ? source : latinAlphabet;
    },
    tokenLabel(token) {
      return token;
    }
  };
}

const morseMap: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....", I: "..",
  J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
  S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..",
  0: "-----", 1: ".----", 2: "..---", 3: "...--", 4: "....-", 5: ".....", 6: "-....", 7: "--...",
  8: "---..", 9: "----."
};

const brailleMap: Record<string, string> = {
  A: "⠁", B: "⠃", C: "⠉", D: "⠙", E: "⠑", F: "⠋", G: "⠛", H: "⠓", I: "⠊", J: "⠚",
  K: "⠅", L: "⠇", M: "⠍", N: "⠝", O: "⠕", P: "⠏", Q: "⠟", R: "⠗", S: "⠎", T: "⠞",
  U: "⠥", V: "⠧", W: "⠺", X: "⠭", Y: "⠽", Z: "⠵"
};

const greekMap: Record<string, string> = {
  A: "Α", B: "Β", C: "Γ", D: "Δ", E: "Ε", F: "Φ", G: "Γ", H: "Η", I: "Ι", J: "Ξ",
  K: "Κ", L: "Λ", M: "Μ", N: "Ν", O: "Ο", P: "Π", Q: "Θ", R: "Ρ", S: "Σ", T: "Τ",
  U: "Υ", V: "Β", W: "Ω", X: "Χ", Y: "Ψ", Z: "Ζ"
};

const kanaMap: Record<string, string> = {
  A: "ア", B: "ブ", C: "ク", D: "ド", E: "エ", F: "フ", G: "グ", H: "ハ", I: "イ", J: "ジ",
  K: "カ", L: "ル", M: "ム", N: "ン", O: "オ", P: "プ", Q: "ク", R: "ラ", S: "ス", T: "タ",
  U: "ウ", V: "ヴ", W: "ワ", X: "ク", Y: "ヤ", Z: "ズ"
};

const emojiMap: Record<string, string> = {
  A: "○", B: "□", C: "△", D: "◇", E: "★", F: "☆", G: "●", H: "■", I: "▲", J: "◆",
  K: "◎", L: "◇", M: "◐", N: "◑", O: "◯", P: "□", Q: "◇", R: "△", S: "★", T: "●",
  U: "▲", V: "◆", W: "◎", X: "◐", Y: "◑", Z: "☆"
};

function mappedPack(id: AlphabetPackId, label: string, description: string, map: Record<string, string>): AlphabetPack {
  return {
    id,
    label,
    description,
    supportsPlainText: true,
    normalizeInput: cleanLatin,
    tokenize(input) {
      return latinTokens(input).map((token) => map[token] ?? token);
    },
    encodeWord(input) {
      const normalized = cleanLatin(input);
      const baseTokens = normalized.replace(/\s+/g, "").split("");
      const unsupported = baseTokens.filter((token) => !map[token] && !/[0-9]/.test(token));
      return {
        label: input.trim().replace(/\s+/g, " "),
        normalized,
        tokens: baseTokens.map((token) => map[token] ?? token),
        warning: unsupported.length ? `Unsupported tokens ignored: ${Array.from(new Set(unsupported)).join(", ")}` : undefined
      };
    },
    fillerTokens(seed, usedTokens, custom) {
      const customTokens = custom ? latinTokens(custom).map((token) => map[token] ?? token) : [];
      return customTokens.length ? customTokens : Array.from(new Set([...usedTokens, ...Object.values(map)]));
    },
    tokenLabel(token) {
      const entry = Object.entries(map).find(([, value]) => value === token);
      return entry ? `${label} ${entry[0]}` : token;
    }
  };
}

export const alphabetPacks: Record<AlphabetPackId, AlphabetPack> = {
  latin: basicPack("latin", "Latin letters", "Standard A-Z word search output with diacritic normalization."),
  spanish: basicPack("spanish", "Spanish", "Spanish-friendly input with accents normalized for puzzle placement."),
  french: basicPack("french", "French", "French-friendly input with accents normalized for puzzle placement."),
  morse: {
    id: "morse",
    label: "Morse code",
    description: "Encodes plain text as Morse tokens and accepts dot/dash Morse input.",
    supportsPlainText: true,
    normalizeInput(input) {
      return input
        .replace(/[–—−]/g, "-")
        .replace(/[·•]/g, ".")
        .replace(new RegExp("[^A-Za-z0-9.\\-\\s/]", "g"), " ")
        .replace(/\s+/g, " ")
        .trim()
        .toUpperCase();
    },
    tokenize(input) {
      const normalized = this.normalizeInput(input);
      if (/^[.\-\s/]+$/.test(normalized)) {
        return normalized.split(new RegExp("[/\\s]+")).filter(Boolean);
      }
      return normalized.replace(/\s+/g, "").split("").map((token) => morseMap[token]).filter(Boolean);
    },
    encodeWord(input) {
      const normalized = this.normalizeInput(input);
      const tokens = this.tokenize(normalized);
      return {
        label: input.trim().replace(/\s+/g, " "),
        normalized,
        tokens,
        warning: tokens.length ? undefined : "No valid Morse tokens found."
      };
    },
    fillerTokens() {
      return [".", "-", ".-", "-.", "...", "---"];
    },
    tokenLabel(token) {
      return `Morse ${token.replace(/\./g, "dot ").replace(/-/g, "dash ").trim()}`;
    }
  },
  braille: mappedPack("braille", "Braille", "Uses real Unicode braille cells for plain-text input.", brailleMap),
  binary: {
    ...basicPack("binary", "Binary", "Encodes each letter as fixed-width 8-bit binary."),
    tokenize(input) {
      return latinTokens(input).map((token) => token.charCodeAt(0).toString(2).padStart(8, "0"));
    },
    encodeWord(input) {
      const normalized = cleanLatin(input);
      return {
        label: input.trim().replace(/\s+/g, " "),
        normalized,
        tokens: normalized.replace(/\s+/g, "").split("").map((token) => token.charCodeAt(0).toString(2).padStart(8, "0"))
      };
    },
    fillerTokens() {
      return ["01000001", "01000101", "01001001", "01001111", "01010101", "01010011", "01010100"];
    }
  },
  hex: {
    ...basicPack("hex", "Hexadecimal", "Encodes each letter as two-digit hexadecimal for CS classrooms."),
    tokenize(input) {
      return latinTokens(input).map((token) => token.charCodeAt(0).toString(16).toUpperCase());
    },
    encodeWord(input) {
      const normalized = cleanLatin(input);
      return {
        label: input.trim().replace(/\s+/g, " "),
        normalized,
        tokens: normalized.replace(/\s+/g, "").split("").map((token) => token.charCodeAt(0).toString(16).toUpperCase())
      };
    },
    fillerTokens() {
      return ["41", "45", "49", "4F", "55", "53", "54", "52"];
    }
  },
  greek: mappedPack("greek", "Greek alphabet", "Maps Latin classroom lists into Greek display tokens.", greekMap),
  kana: mappedPack("kana", "Japanese kana", "Maps plain classroom lists into simple kana display tokens.", kanaMap),
  emoji: mappedPack("emoji", "Symbol", "Uses simple geometric symbols while keeping accessible labels.", emojiMap),
  asl: mappedPack("asl", "ASL fingerspelling", "Uses accessible ASL-labeled letter cells with SVG-friendly labels.", Object.fromEntries(latinAlphabet.map((letter) => [letter, `ASL-${letter}`])))
};

export function getAlphabetPack(id: AlphabetPackId | string): AlphabetPack {
  return alphabetPacks[id as AlphabetPackId] ?? alphabetPacks.latin;
}

export function fillerByMode(mode: string, usedTokens: string[], pack: AlphabetPack, custom?: string) {
  if (mode === "used" && usedTokens.length) return Array.from(new Set(usedTokens));
  if (mode === "custom" && custom) return pack.fillerTokens("custom", usedTokens, custom);
  if (mode === "rare" && pack.id === "latin") return rareLetters;
  return pack.fillerTokens("alphabet", usedTokens, custom);
}
