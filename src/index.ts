// turkish-inflect
// Turkish noun and verb inflection: vowel harmony, consonant mutation, and case/tense suffixes.

import {
  type NounCase,
  type VerbTense,
  type NounCaseInput,
  type VerbTenseInput,
  normalizeNounCase,
  normalizeVerbTense,
} from "./cases";

// Re-export so consumers can `import { NounCase } from "turkish-inflect"`
// without needing to know about the internal file split.
export type { NounCase, VerbTense, NounCaseInput, VerbTenseInput };

// ---------------------------------------------------------------------------
// OPTIONS
// ---------------------------------------------------------------------------

export interface VerbOptions {
  negative?: boolean;
  question?: boolean;
  person?: "1sg" | "2sg" | "3sg" | "1pl" | "2pl" | "3pl";
}

// ---------------------------------------------------------------------------
// PUBLIC API
// ---------------------------------------------------------------------------

/**
 * Inflects a Turkish noun for the given grammatical case.
 * Accepts the canonical English name, the Turkish grammatical term, or the
 * bare suffix letter(s) — e.g. "accusative", "belirtme", and "i" all resolve
 * to the same case.
 *
 * @param word - the base form of the noun, e.g. "ev", "araba", "kitap"
 * @param nounCase - the case to inflect for (any accepted alias)
 * @returns the inflected form, e.g. inflectNoun("araba", "accusative") -> "arabayı"
 */
export function inflectNoun(word: string, nounCase: NounCaseInput): string {
  const canonical = normalizeNounCase(nounCase);
  return inflectNounCanonical(word, canonical);
}

/**
 * Inflects a Turkish verb stem for the given tense/aspect.
 * Accepts the canonical English name, the Turkish grammatical term, or the
 * bare suffix letter(s), same aliasing behavior as inflectNoun.
 *
 * @param verb - the verb stem, e.g. "gel", "git", "oku"
 * @param tense - the tense/aspect to inflect for (any accepted alias)
 * @param options - optional negation, question particle, and person agreement
 * @returns the inflected form, e.g. inflectVerb("git", "future") -> "gidecek"
 */
export function inflectVerb(
  verb: string,
  tense: VerbTenseInput,
  options?: VerbOptions
): string {
  const canonical = normalizeVerbTense(tense);
  return inflectVerbCanonical(verb, canonical, options);
}

// ---------------------------------------------------------------------------
// CANONICAL IMPLEMENTATIONS
// Keep these working only with the canonical types above — all alias
// resolution happens in the public functions before this point, so the
// harmony/mutation logic never has to think about aliases.
// ---------------------------------------------------------------------------

function inflectNounCanonical(word: string, nounCase: NounCase): string {
  throw new Error("inflectNounCanonical: not implemented");
}

function inflectVerbCanonical(
  verb: string,
  tense: VerbTense,
  options?: VerbOptions
): string {
  throw new Error("inflectVerbCanonical: not implemented");
}

// ---------------------------------------------------------------------------
// INTERNAL HELPERS (not exported - implement and unit test independently)
// ---------------------------------------------------------------------------

/**
 * Determines the vowel harmony group of a word based on its last vowel,
 * used to pick the correct allomorph of a suffix (e.g. -ı/-i/-u/-ü).
 */
// function getVowelHarmonyGroup(word: string): "a" | "e" | "i" | "ı" | "o" | "ö" | "u" | "ü" { ... }

/**
 * Applies consonant mutation (yumuşama) to a word-final voiceless stop
 * when a vowel-initial suffix follows, e.g. kitap -> kitab-, ağaç -> ağac-.
 * Should account for exceptions (monosyllabic loanwords, etc.).
 */
// function mutateFinalConsonant(word: string): string { ... }

/**
 * Determines the buffer consonant (kaynaştırma) needed when attaching
 * a vowel-initial suffix to a vowel-ending word, e.g. "y" in arabayı,
 * "n" in arabanın, "s" in arabası.
 */
// function getBufferConsonant(word: string, suffixType: "possessive3sg" | "genitive" | "case"): string { ... }

/**
 * Handles irregular vowel-drop nouns (ağız -> ağz-, burun -> burn-, akıl -> akl-)
 * and other lexical exceptions that don't follow the regular rules.
 */
// function applyIrregular(word: string): string | null { ... }