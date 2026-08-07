import { Word } from "./word";

/**
 * Represents a sequence of Turkish words parsed from a space-separated
 * string. Inflection functions operate on a Phrase's lastWord, so a Phrase
 * can represent anything from a single word to a full noun/verb phrase.
 */
export class Phrase {
  words: Word[] = [];
  lastWord: Word; // invariant: words is never empty (enforced in constructor)

  constructor(str: string) {
    const splitted = str.split(" ")
      .map(e => e.trim())
      .filter(e => e.length > 0);

    if (splitted.length === 0) {
      throw new Error("Phrase cannot be constructed from an empty string");
    }

    this.words = splitted.map(e => new Word(e));
    //this.lastWord = this.words[this.words.length - 1];
    this.lastWord = this.words.at(-1)!;
    // if (isLastWordVerb) {
    //   this.lastWord.isVerb = true;
    // }
  }

  appendPhrase(p: Phrase): void {
    this.words.push(...p.words);
    this.lastWord = this.words.at(-1)!;
  }

  prependPhrase(p: Phrase): void {
    this.words.unshift(...p.words);
    // lastWord unaffected — prepending can't change the last word
  }
}