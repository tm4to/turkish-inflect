import { Word } from "./word";

/**
 * Represents a sequence of Turkish words parsed from a space-separated
 * string. Inflection functions operate on a Phrase's lastWord, so a Phrase
 * can represent anything from a single word to a full noun/verb phrase.
 */
export class Phrase {
  words: Word[] = [];
  lastWord: Word | undefined;

  constructor(str: string = "") {
    const splitted = str.split(" ");
    splitted.forEach((e) => {
      const t = e.trim();
      if (t.length) {
        this.words.push(new Word(e));
      }
    });
    this.lastWord = this.words[this.words.length - 1];
  }

  appendPhrase(p: Phrase): void {
    this.words.push(...p.words);
    this.lastWord = this.words[this.words.length - 1];
  }

  prependPhrase(p: Phrase): void {
    this.words.unshift(...p.words);
  }
}
