import { Phrase } from "./phrase";
import { generateVowel, isFrontVowel } from "./utils";
import { Person, NounCase, VerbTense, normalizeNounCase, normalizeVerbTense, VerbTenseInput, NounCaseInput, VERB_TENSE_ALIASES, NOUN_CASE_ALIASES } from "./cases";
import { NARROW_AORIST_EXCEPTIONS } from "./irregulars";
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
  let suffixVowel = "";
  const word = phrase.lastWord;
  switch (tense) {
    case "imperative":
      switch (person) {
        case "1s":
          if (word.base.length === 2 && word.base[1] === "e") { // de -> diyeyim, ye -> yiyeyim
            word.narrowLastVowel();
          }
          if (word.endsWithVowel) { suffix = "y"; }
          suffix += word.isLastVowelFront ? "eyim" : "ayım";
          break;
        case "3s":
          suffix = "s" + generateVowel(word.lastVowel, true) + "n";
          break;
        case "1p":
          if (word.base.length === 2 && word.base[1] === "e") {
            word.narrowLastVowel();
          }
          if (word.endsWithVowel) { suffix = "y"; }
          suffix += word.isLastVowelFront ? "elim" : "alım";
          break;
        case "2p":
          if (word.base.length === 2 && word.base[1] === "e") {
            word.narrowLastVowel();
          }
          if (word.endsWithVowel) { suffix = "y"; }
          suffix += word.isLastVowelFront ? "in" : "ın";
          break;
        case "3p":
          const suffixVowel = generateVowel(word.lastVowel, true);
          suffix += "s";
          suffix += suffixVowel;
          suffix += "nl";
          suffix += isFrontVowel(suffixVowel) ? "e" : "a";
          suffix += "r";
          break;
      }
      break;
    case "present":
      if (word.endsWithVowel) { // de -> diyorum, ye -> yiyorum
        word.narrowLastVowel();
      } else {
        suffix = generateVowel(word.lastVowel, true);
      }
      suffix += "yor";
      switch (person) {
        case "1s": suffix += "um"; break;
        case "2s": suffix += "sun"; break;
        case "1p": suffix += "uz"; break;
        case "2p": suffix += "sunuz"; break;
        case "3p": suffix += "lar"; break;
      }
      break;
    case "aorist": // genis
      if (word.numVowels < 2) {
        if (NARROW_AORIST_EXCEPTIONS.has(word.base)) {
          suffixVowel = generateVowel(word.lastVowel, true);
        }
        else {
          suffixVowel = word.isLastVowelFront ? "e" : "a";
        }
      } else {
        suffixVowel = generateVowel(word.lastVowel, true);
      }
      suffix = word.endsWithVowel ? "r" : (suffixVowel + "r");
      switch (person) {
        case "1s": suffix += generateVowel(suffixVowel, true) + "m"; break;
        case "2s": suffix += "s" + generateVowel(suffixVowel, true) + "n"; break;
        case "1p": suffix += generateVowel(suffixVowel, true) + "z"; break;
        case "2p": suffix += "s" + generateVowel(suffixVowel, true) + "n" + generateVowel(suffixVowel, true) + "z"; break;
        case "3p": suffix += "l" + (isFrontVowel(suffixVowel) ? "e" : "a") + "r"; break;
      }
      break;
    case "witnessedPast":
      suffixVowel = generateVowel(word.lastVowel, true);
      suffix = "d" + suffixVowel;
      switch (person) {
        case "1s": suffix += "m"; break;
        case "2s": suffix += "n"; break;
        case "1p": suffix += "k"; break;
        case "2p":
          suffix += "n";
          suffix += suffixVowel;
          suffix += "z";
          break;
        case "3p": suffix += "l";
          suffix += isFrontVowel(suffixVowel) ? "e" : "a";
          suffix += "r";
          break;
      }
      break;
    case "inferentialPast":
      suffixVowel = generateVowel(word.lastVowel, true);
      suffix = "m" + suffixVowel + "ş";
      switch (person) {
        case "1s": suffix += suffixVowel + "m"; break;
        case "2s": suffix += "s" + suffixVowel + "n"; break;
        case "1p": suffix += suffixVowel + "z"; break;
        case "2p":
          suffix += "s";
          suffix += suffixVowel;
          suffix += "n";
          suffix += suffixVowel;
          suffix += "z";
          break;
        case "3p": suffix += "l";
          suffix += isFrontVowel(suffixVowel) ? "e" : "a";
          suffix += "r";
          break;
      }
      break;
    case "future":
      if (word.base.length === 2 && word.base[1] === "e") { word.base = word.base[0] + "i" }
      if (word.endsWithVowel) { suffix = "y" }
      const isFront = word.isLastVowelFront;
      suffix += isFront ? "ece" : "aca";
      switch (person) {
        case "1s": suffix += isFront ? "ğim" : "ğım"; break;
        case "2s": suffix += isFront ? "ksin" : "ksın"; break;
        case "3s": suffix += "k"; break;
        case "1p": suffix += isFront ? "ğiz" : "ğız"; break;
        case "2p": suffix += isFront ? "ksiniz" : "ksınız"; break;
        case "3p": suffix += isFront ? "kler" : "klar"; break;
      }
      break;
    case "pastPerfect":
      suffixVowel = generateVowel(word.lastVowel, true);
      suffix = "m" + suffixVowel + "ş";
      switch (person) {
        case "1s": suffix += "t" + suffixVowel + "m"; break;
        case "2s": suffix += "t" + suffixVowel + "n"; break;
        case "3s": suffix += "t" + suffixVowel; break;
        case "1p": suffix += "t" + suffixVowel + "k"; break;
        case "2p": suffix += "t" + suffixVowel + "n" + suffixVowel + "z"; break;
        case "3p": suffix += isFrontVowel(suffixVowel) ? "lerdi" : "lardı"; break;
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