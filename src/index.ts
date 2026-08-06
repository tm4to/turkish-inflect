// turkish-inflect
// Turkish noun and verb inflection: vowel harmony, consonant mutation, and case/tense suffixes.

export { Word } from "./word";
export { Phrase } from "./phrase";
export { inflectNoun, inflectVerb } from "./inflect";
export { isVowel, isFrontVowel, isHardConsonant as isHardCons, isDiscontinuousHardConsonant as isDiscHardCons, generateVowel } from "./utils";
