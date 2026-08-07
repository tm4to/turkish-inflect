// Canonical case/tense types and their accepted aliases (English, Turkish
// grammatical terms, and bare suffix letters). Add new aliases here — the
// accepted input types in index.ts derive automatically from these maps.

// ---------------------------------------------------------------------------
// CANONICAL TYPES
// ---------------------------------------------------------------------------
export type Person =
    | "1s"  // Ben
    | "2s"  // Sen
    | "3s"  // O
    | "1p"  // Biz
    | "2p"  // Siz
    | "3p"; // Onlar

export type NounCase =
    | "accusative" // araba-y-ı
    | "dative" // araba-y-a
    | "locative" // araba-da
    | "ablative" // araba-dan
    | "genitive" // araba-n-ın
    | "possessive" // (onun) araba-s-ı
    | "plural" // araba-lar
    | "instrumental" // araba-yla

export type VerbTense =
    | "imperative" // yapayım, yap, yapsın
    | "imperative_2" // yapim, yap, yapsın
    | "imperative_3" // yapam, yap, yapsın    
    | "present" // yapıyorum, yapıyorsun, yapıyor
    | "present_2" // yapıyom, yapıyon, yapıyo
    | "present_3" // yapıom, yapıon, yapıo
    | "aorist" // yaparım, yaparsın, yapar
    | "witnessedPast" // yaptım, yaptın, yaptı
    | "inferentialPast" // yapmışım, yapmışsın, yapmış
    | "future" // yapacağım, yapacaksın, yapacak
    | "future_2" // yapıcam, yapıcan, yapıcak
    | "future_3" // yapçam, yapçan, yapçak
    | "pastPerfect"; // yapmıştım, yapmıştın, yapmıştı
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

    "ablative": "ablative",
    "çıkma": "ablative",
    "den": "ablative",
    "dan": "ablative",

    "genitive": "genitive",
    "tamlayan": "genitive",
    "in": "genitive",
    "ın": "genitive",

    "possessive": "possessive",
    "iyelik": "possessive",
    "si": "possessive",
    "sı": "possessive",

    "plural": "plural",
    "çoğul": "plural",
    "ler": "plural",
    "lar": "plural",

    "instrumental": "instrumental",
    "le": "instrumental",
    "la": "instrumental",
    "ile": "instrumental",
} as const satisfies Record<string, NounCase>;

export const VERB_TENSE_ALIASES = {
    "present": "present",
    "şimdiki": "present",
    "yor": "present",

    "present_2": "present_2",
    "present_3": "present_3",

    "imperative": "imperative",
    "imperative_2": "imperative_2",
    "imperative_3": "imperative_3",

    "aorist": "aorist",
    "geniş": "aorist",
    "ir": "aorist",
    "ır": "aorist",
    "er": "aorist",
    "ar": "aorist",

    "past": "witnessedPast",
    "witnessedPast": "witnessedPast",
    "dı": "witnessedPast",
    "di": "witnessedPast",
    "du": "witnessedPast",
    "dü": "witnessedPast",

    "inferentialPast": "inferentialPast",
    "miş_geçmiş": "inferentialPast",
    "mış_geçmiş": "inferentialPast",
    "miş": "inferentialPast",
    "mış": "inferentialPast",
    "muş": "inferentialPast",
    "müş": "inferentialPast",

    "future": "future",
    "gelecek": "future",
    "ecek": "future",
    "acak": "future",

    "future_2": "future_2",
    "future_3": "future_3",

    "pastPerfect": "pastPerfect",
    "hikaye": "pastPerfect",
    "mıştı": "pastPerfect",
    "mişti": "pastPerfect",
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