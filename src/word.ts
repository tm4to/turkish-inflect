import { isVowel, isFrontVowel, isHardConsonant, isDiscontinuousHardConsonant } from "./utils";
import { SOFTENING_EXCEPTIONS, VOWEL_DROP_STEMS } from "./irregulars";
/**
 * Represents a single Turkish word and its phonological state as suffixes
 * are appended to it. Tracks the last vowel/consonant, whether it ends in a
 * vowel, and vowel-harmony/consonant-mutation flags needed to correctly
 * inflect it.
 */
export class Word {
  isVerb: boolean = false;
  isProperNoun: boolean = false;
  endsWithVowel: boolean = false;
  isLastVowelFront: boolean = false;
  isLastConsHard: boolean = false;
  isLastConsDisc: boolean = false;
  numVowels: number = 0;
  lastVowel: string = "";
  lastCons: string = "";
  base: string = "";
  suffixes: string[] = [];

  constructor(str: string, isVerb: boolean = false) {
    this.isVerb = isVerb;
    str = str.trim();
    let dunnoLastLetter = true;
    let dunnoLastVowel = true;
    let dunnoLastCons = true;

    for (let i = str.length - 1; i >= 0; i--) {
      const c = str[i];
      if (!c) { continue }

      if (i === str.length - 1 && c === "'") {
        this.isProperNoun = true;
      }

      this.base = c + this.base;

      if (c.toLowerCase() === c.toUpperCase()) {
        // Not a letter (punctuation, digit, apostrophe, etc.) - skip.
        continue;
      }

      if (isVowel(c)) {
        this.numVowels++;
        if (dunnoLastLetter) {
          this.endsWithVowel = true;
        }
        if (dunnoLastVowel) {
          this.isLastVowelFront = isFrontVowel(c);
          this.lastVowel = c;
          dunnoLastVowel = false;
        }
      } else {
        if (dunnoLastLetter) {
          this.endsWithVowel = false;
        }
        if (dunnoLastCons) {
          this.isLastConsHard = isHardConsonant(c);
          if (this.isLastConsHard) {
            this.isLastConsDisc = isDiscontinuousHardConsonant(c);
          }
          this.lastCons = c;
          dunnoLastCons = false;
        }
      }

      dunnoLastLetter = false;
    }
  }

  appendVowel(c: string): void {
    this.base += c;
    this.lastVowel = c;
    this.numVowels++;
    this.endsWithVowel = true;
    this.isLastVowelFront = isFrontVowel(c);
  }

  appendCons(c: string): void {
    this.base += c;
    this.lastCons = c;
    this.endsWithVowel = false;
    this.isLastConsHard = isHardConsonant(c);
    if (this.isLastConsHard) {
      this.isLastConsDisc = isDiscontinuousHardConsonant(c);
    }
  }

  /**
   * Applies consonant softening (yumuşama), e.g. kitap -> kitab-, when a
   * vowel-initial suffix follows a "disc hard" consonant (p/ç/t/k).
   * Skips words ending in "rt"/"lt", and skips monosyllabic words except
   * for a couple of lexical exceptions ("et", "git").
   */
  softenLastConsonant(): void {
    if (this.base.endsWith("rt") || this.base.endsWith("lt")) { // TODO: this skips "yoğurt" which it shouldn't
      return;
    }
    if (SOFTENING_EXCEPTIONS.has(this.base)) {
      return;
    }
    if (this.numVowels < 2) {
      switch (this.base) {
        case "et":
        case "git":
          break;
        default:
          return;
      }
    }

    let c: string;
    switch (this.lastCons) {
      case "K": c = "Ğ"; break;
      case "T": c = "D"; break;
      case "Ç": c = "C"; break;
      case "P": c = "B"; break;
      case "k": c = "ğ"; break;
      case "t": c = "d"; break;
      case "ç": c = "c"; break;
      case "p": c = "b"; break;
      default:
        return;
    }

    this.lastCons = c;
    this.base = this.base.slice(0, -1) + c;
  }

  dropIrregularVowel(): void {
    const dropped = VOWEL_DROP_STEMS.get(this.base);
    if (dropped) {
      this.base = dropped;
      // lastCons/isLastConsHard/isLastConsDisc are unchanged — same final
      // consonant either way, just the internal vowel is gone.
    }
  }

  /**
   * Appends a raw suffix string to the word, applying consonant softening
   * (before a vowel-initial suffix, when applicable) and consonant
   * devoicing (before a consonant-initial suffix following a hard
   * consonant) character-by-character as it goes.
   */
  addSuffix(str: string): void {
    this.suffixes.push(str);

    for (let i = 0; i < str.length; i++) {
      let c = str[i];
      if (!c) { continue; }
      if (isVowel(c)) {
        // if (i === 0 && !this.isProperNoun && !this.endsWithVowel && this.isLastConsDisc) {
        //   this.softenLastConsonant();
        // }
        if (i === 0 && !this.isProperNoun && !this.endsWithVowel) {
          this.dropIrregularVowel();
          if (this.isLastConsDisc) {
            this.softenLastConsonant();
          }
        }
        this.appendVowel(c);
      } else {
        if (i === 0 && !this.endsWithVowel && this.isLastConsHard) {
          switch (c) {
            case "G": case "g": c = "k"; break;
            case "D": case "d": c = "t"; break;
            case "C": case "c": c = "ç"; break;
            case "B": case "b": c = "p"; break;
          }
        }
        this.appendCons(c);
      }
    }
  }
}
