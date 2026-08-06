// Canonical case/tense types and their accepted aliases (English, Turkish
// grammatical terms, and bare suffix letters). Add new aliases here — the
// accepted input types in index.ts derive automatically from these maps.

// ---------------------------------------------------------------------------
// CANONICAL TYPES
// ---------------------------------------------------------------------------

export type NounCase =
    | "accusative"
    | "dative"
    | "locative"
    | "ablative"
    | "genitive"
    | "plural";

export type VerbTense =
    | "presentContinuous"
    | "past"
    | "future"
    | "aorist";

// ---------------------------------------------------------------------------
// ALIAS MAPS
// ---------------------------------------------------------------------------

export const NOUN_CASE_ALIASES = {
    "accusative": "accusative",
    "belirtme": "accusative",
    "i": "accusative",
    "ı": "accusative",
    "u": "accusative",
    "ü": "accusative",

    "dative": "dative",
    "yönelme": "dative",
    "e": "dative",
    "a": "dative",

    "locative": "locative",
    "bulunma": "locative",
    "de": "locative",
    "da": "locative",
    "te": "locative",
    "ta": "locative",

    "ablative": "ablative",
    "çıkma": "ablative",
    "den": "ablative",
    "dan": "ablative",
    "ten": "ablative",
    "tan": "ablative",

    "genitive": "genitive",
    "tamlayan": "genitive",
    "in": "genitive",
    "ın": "genitive",
    "un": "genitive",
    "ün": "genitive",

    "plural": "plural",
    "çoğul": "plural",
    "ler": "plural",
    "lar": "plural",
} as const satisfies Record<string, NounCase>;

export const VERB_TENSE_ALIASES = {
    "presentContinuous": "presentContinuous",
    "şimdikiZaman": "presentContinuous",
    "yor": "presentContinuous",

    "past": "past",
    "digecmis": "past", // ASCII fallback for "-dı geçmiş zaman"
    "dı": "past",
    "di": "past",
    "du": "past",
    "dü": "past",

    "future": "future",
    "gelecekZaman": "future",
    "ecek": "future",
    "acak": "future",

    "aorist": "aorist",
    "genisZaman": "aorist", // ASCII fallback for "geniş zaman"
    "ir": "aorist",
    "ır": "aorist",
} as const satisfies Record<string, VerbTense>;

// Accepted input types: every alias key, inferred automatically from the maps above.
export type NounCaseInput = keyof typeof NOUN_CASE_ALIASES;
export type VerbTenseInput = keyof typeof VERB_TENSE_ALIASES;

export function normalizeNounCase(input: NounCaseInput): NounCase {
    return NOUN_CASE_ALIASES[input];
}

export function normalizeVerbTense(input: VerbTenseInput): VerbTense {
    return VERB_TENSE_ALIASES[input];
}