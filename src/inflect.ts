import { Phrase } from "./phrase";
import { generateVowel } from "./utils";
import { Person, NounCase, VerbTense, normalizeNounCase, normalizeVerbTense, VerbTenseInput, NounCaseInput, VERB_TENSE_ALIASES, NOUN_CASE_ALIASES } from "./cases";

/**
 * Inflects the last word of a Phrase for the given nominal case, mutating
 * the underlying Word in place (appends the suffix via Word#addSuffix,
 * which itself applies consonant softening/devoicing as needed).
 */
export function inflectNoun_phrase(phrase: Phrase, mode: NounCase, person?: Person): Phrase {
  let suffix = "";
  const word = phrase.lastWord;
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
    case "dative": // yönelme: araba-ya
      suffix = generateVowel(word.lastVowel, false);
      if (word.endsWithVowel) {
        if (word.suffixes.length) { // araba(sı)-*n*a
          suffix = "n" + suffix;
        } else { // araba-*y*a
          suffix = "y" + suffix;
        }
      }
      break;
    case "locative": // bulunma: araba-da
      if (word.suffixes.length && word.endsWithVowel) { // araba(sı)-*n*da
        suffix += "n";
      }
      suffix += word.isLastVowelFront ? "de" : "da";
      break;
    case "ablative": // ayrılma: araba-dan
      if (word.suffixes.length && word.endsWithVowel) { // araba(sı)-*n*dan
        suffix += "n";
      }
      suffix += word.isLastVowelFront ? "den" : "dan";
      break;
    case "genitive": // araba-nın (kapısı)
      if (word.endsWithVowel) { // araba-*n*-ın
        if (word.base === "su" || word.base === "ne") {
          suffix = "y";
        } else {
          suffix = "n";
        }
      }
      suffix += generateVowel(word.lastVowel, true);
      switch (person) {
        case "1s": suffix += "m"; break;
        default: suffix += "n"; break;
      }
      break;
    case "possessive": // iyelik: (onun) araba-sı, (benim) araba-m 
      if (!person) {
        throw new Error(
          `inflectNoun: mode "possessive" requires a person argument (e.g. "1s", "3s", ...), but none was provided.`
        );
      }
      // if (person !== "3p" && !word.endsWithVowel) {// agaç-*ı*-m
      //   suffix = generateVowel(word.lastVowel, true);
      // }
      //suffix += generateVowel(word.lastVowel, true);
      switch (person) {
        case "1s":
          if (word.endsWithVowel) {
            suffix = "m"
          } else {
            suffix = generateVowel(word.lastVowel, true) + "m";
          }
          break;
        case "2s":
          if (word.endsWithVowel) {
            suffix = "n"
          } else {
            suffix = generateVowel(word.lastVowel, true) + "n";
          }
          break;
        case "3s":
          if (word.endsWithVowel) {
            suffix = "s" + generateVowel(word.lastVowel, true);
          } else {
            suffix = generateVowel(word.lastVowel, true);
          }
          break;
        case "1p": suffix = generateVowel(word.lastVowel, true) + "m" + generateVowel(word.lastVowel, true) + "z"; break;
        case "2p": suffix = generateVowel(word.lastVowel, true) + "n" + generateVowel(word.lastVowel, true) + "z"; break;
        case "3p":
          let suffixVowel = word.isLastVowelFront ? "e" : "a";
          suffix = "l" + suffixVowel + "r" + generateVowel(suffixVowel, true);
          break;
      }
      break;
    case "plural":
      suffix = "l" + generateVowel(word.lastVowel, false) + "r";
      break;
  }

  word.addSuffix(suffix);
  return phrase;
}

export function inflectNoun(inputPhrase: string, inputMode: NounCaseInput, person?: Person): string {
  if (!inputPhrase.length) { return "" };

  if (!Object.prototype.hasOwnProperty.call(NOUN_CASE_ALIASES, inputMode)) {
    throw new Error(
      `Invalid noun case "${inputMode}". Valid options: ${Object.keys(NOUN_CASE_ALIASES).join(", ")}`
    );
  }

  const phrase = new Phrase(inputPhrase);
  const mode = normalizeNounCase(inputMode);
  return inflectNoun_phrase(phrase, mode, person).lastWord?.base ?? "";
}

/**
 * Inflects the last word of a Phrase for the given verbal mode/tense,
 * mutating the underlying Word in place. Some modes (present, future,
 * etc.) also rewrite word.base directly to reflect stem changes before
 * appending the final suffix.
 */

export function inflectVerb_phrase(phrase: Phrase, tense: VerbTense, person: Person, _options?: { negative?: boolean; question?: boolean; }): Phrase {
  let suffix = "";
  const word = phrase.lastWord;
  if (!word) { return phrase }
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
  return phrase;
}

export function inflectVerb(inputPhrase: string, inputTense: VerbTenseInput, person: Person): string {
  if (!inputPhrase.length) { return "" };

  if (!Object.prototype.hasOwnProperty.call(VERB_TENSE_ALIASES, inputTense)) {
    throw new Error(
      `Invalid verb tense "${inputTense}". Valid options: ${Object.keys(VERB_TENSE_ALIASES).join(", ")}`
    );
  }

  const phrase = new Phrase(inputPhrase);
  const tense = normalizeVerbTense(inputTense);
  return inflectVerb_phrase(phrase, tense, person).lastWord?.base ?? "";
}