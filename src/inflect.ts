import { Phrase } from "./phrase";
import { isVowel, generateVowel } from "./utils";
import { Person, NounCase, VerbTense, normalizeNounCase, normalizeVerbTense, NOUN_CASE_ALIASES } from "./cases";

/**
 * Inflects the last word of a Phrase for the given nominal case, mutating
 * the underlying Word in place (appends the suffix via Word#addSuffix,
 * which itself applies consonant softening/devoicing as needed).
 */
export function inflectNoun(input: string, mode: NounCase, person?: Person): string {
  if (!input.length) { return "" };
  const phrase = new Phrase(input);
  let suffix = "";
  const word = phrase.lastWord;
  if (!word) { return "" }
  switch (mode) {
    case "accusative": // belirtme: araba-yı
      suffix = generateVowel(word.lastVowel, true);
      if (word.endsWithVowel) {
        if (word.suffixes.length) {
          suffix = "n" + suffix; // araba(sı)-n-ı
        } else {
          suffix = "y" + suffix; // araba-y-ı
        }
      }
      break;
  }

  word.addSuffix(suffix);
  return word.base;
}

/**
 * Inflects the last word of a Phrase for the given verbal mode/tense,
 * mutating the underlying Word in place. Some modes (present, future,
 * etc.) also rewrite word.base directly to reflect stem changes before
 * appending the final suffix.
 */
export function inflectVerb(input: string, tense: VerbTense, person?: Person): string {
  if (!input.length) { return "" };
  const phrase = new Phrase(input);
  let suffix = "";
  const word = phrase.lastWord;
  if (!word) { return "" }
  const base = word.base;
  switch (tense) {
    case "present":
      switch (person) {
        case "1s":
          if (base.length === 2 && base[1] === "e") { word.base = base[0] + "i"; }
          if (word.endsWithVowel) { suffix = "y"; }
          suffix += word.isLastVowelFront ? "eyim" : "ayım";
          break;
        case "2s":
          suffix = "s" + generateVowel(word.lastVowel, true) + "n";
          break;
      }
      break;
  }

  word.addSuffix(suffix);
  return word.base;
}
