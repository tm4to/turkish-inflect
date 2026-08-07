// Character-level helpers for Turkish vowel harmony and consonant classification.

//import { Y_BUFFER_STEMS } from "./irregulars";
//import type { Word } from "./word";

export function isVowel(c: string): boolean {
  switch (c) {
    case "A": case "E": case "I": case "İ": case "O": case "Ö": case "U": case "Ü":
    case "a": case "e": case "ı": case "i": case "o": case "ö": case "u": case "ü":
      return true;
    default:
      return false;
  }
}

export function isFrontVowel(c: string): boolean {
  switch (c) {
    case "E": case "İ": case "Ö": case "Ü":
    case "e": case "i": case "ö": case "ü":
      return true;
    default:
      return false;
  }
}

export function isHardConsonant(c: string): boolean {
  switch (c) {
    case "F": case "S": case "T": case "K": case "Ç": case "Ş": case "H": case "P":
    case "f": case "s": case "t": case "k": case "ç": case "ş": case "h": case "p":
      return true;
    default:
      return false;
  }
}

export function isDiscontinuousHardConsonant(c: string): boolean {
  switch (c) {
    case "T": case "K": case "Ç": case "P":
    case "t": case "k": case "ç": case "p":
      return true;
    default:
      return false;
  }
}

/**
 * Picks the correct vowel-harmony variant of a suffix vowel based on the
 * word's last vowel. accusative=true covers the 4-way harmony used by
 * accusative/genitive/possessive/aorist/etc (-ı/-i/-u/-ü); accusative=false
 * covers the 2-way dative harmony (-e/-a).
 */
export function generateVowel(lastVowel: string, isAccusative: boolean = true): string {
  if (isAccusative) {
    switch (lastVowel) {
      case "a": case "A": return "ı";
      case "e": case "E": return "i";
      case "o": case "O": return "u";
      case "ö": case "Ö": return "ü";
      default: return lastVowel;
    }
  } else {
    switch (lastVowel) {
      case "ö": case "Ö": return "e";
      case "o": case "O": return "a";
      case "ı": case "I": return "a";
      case "i": case "İ": return "e";
      case "u": case "U": return "a";
      case "ü": case "Ü": return "e";
      default: return lastVowel;
    }
  }
}

// export function getBufferConsonant(word: Word): string {
//   return (word.isVerb || word.suffixes.length > 0 || Y_BUFFER_STEMS.has(word.base)) ? "y" : "n";
// }
