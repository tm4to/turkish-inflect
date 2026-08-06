import { describe, test, expect } from "vitest";
import { inflectNoun, inflectVerb } from "../src/index";
// Adjust the import path and function names above to match your actual exports.

// ---------------------------------------------------------------------------
// NOUN CASES
// ---------------------------------------------------------------------------

describe("inflectNoun - accusative", () => {
  const cases: [word: string, expected: string][] = [
    // back unrounded (a -> ı)
    ["kız", "kızı"],
    // back rounded (a/o/u -> u)
    ["kol", "kolu"],
    // front unrounded (e/i -> i)
    ["ev", "evi"],
    // front rounded (ö/ü -> ü)
    ["göz", "gözü"],
    // vowel-ending word, needs "y" buffer
    ["araba", "arabayı"],
    ["kapı", "kapıyı"],
    // consonant mutation p -> b
    ["kitap", "kitabı"],
    // consonant mutation ç -> c
    ["ağaç", "ağacı"],
    // consonant mutation t -> d
    ["kağıt", "kağıdı"],
    // monosyllabic loanword exception (no mutation)
    ["top", "topu"],
    // irregular vowel-drop
    ["ağız", "ağzı"],
    ["burun", "burnu"],
    ["akıl", "aklı"],
    // irregular "su"
    ["su", "suyu"],
  ];

  test.each(cases)("inflectNoun(%s, 'accusative') => %s", (word, expected) => {
    expect(inflectNoun(word, "accusative")).toBe(expected);
  });
});

describe("inflectNoun - dative", () => {
  const cases: [word: string, expected: string][] = [
    ["ev", "eve"],
    ["kol", "kola"],
    ["araba", "arabaya"],
    ["kitap", "kitaba"],
    ["su", "suya"],
    ["ağız", "ağza"],
  ];

  test.each(cases)("inflectNoun(%s, 'dative') => %s", (word, expected) => {
    expect(inflectNoun(word, "dative")).toBe(expected);
  });
});

describe("inflectNoun - locative", () => {
  const cases: [word: string, expected: string][] = [
    ["ev", "evde"],
    ["kol", "kolda"],
    ["kitap", "kitapta"], // voiceless consonant -> "t" not "d"
    ["araba", "arabada"],
  ];

  test.each(cases)("inflectNoun(%s, 'locative') => %s", (word, expected) => {
    expect(inflectNoun(word, "locative")).toBe(expected);
  });
});

describe("inflectNoun - ablative", () => {
  const cases: [word: string, expected: string][] = [
    ["ev", "evden"],
    ["kol", "koldan"],
    ["kitap", "kitaptan"],
    ["araba", "arabadan"],
  ];

  test.each(cases)("inflectNoun(%s, 'ablative') => %s", (word, expected) => {
    expect(inflectNoun(word, "ablative")).toBe(expected);
  });
});

describe("inflectNoun - genitive", () => {
  const cases: [word: string, expected: string][] = [
    ["ev", "evin"],
    ["kol", "kolun"],
    ["araba", "arabanın"], // "n" buffer
    ["kitap", "kitabın"],
    ["su", "suyun"],
  ];

  test.each(cases)("inflectNoun(%s, 'genitive') => %s", (word, expected) => {
    expect(inflectNoun(word, "genitive")).toBe(expected);
  });
});

describe("inflectNoun - plural", () => {
  const cases: [word: string, expected: string][] = [
    ["ev", "evler"],
    ["kol", "kollar"],
    ["araba", "arabalar"],
    ["göz", "gözler"],
  ];

  test.each(cases)("inflectNoun(%s, 'plural') => %s", (word, expected) => {
    expect(inflectNoun(word, "plural")).toBe(expected);
  });
});

// ---------------------------------------------------------------------------
// EDGE CASES / ROBUSTNESS
// ---------------------------------------------------------------------------

describe("inflectNoun - edge cases", () => {
  test("throws or handles empty string input", () => {
    // Decide the contract: should this throw, or return ""?
    // Pick one and assert it explicitly rather than leaving it undefined behavior.
    expect(() => inflectNoun("", "accusative")).toThrow();
  });

  test("handles capitalized proper nouns with apostrophe", () => {
    // Turkish orthography inserts an apostrophe before case suffixes on proper nouns.
    // Only include this test if you've decided to support it.
    expect(inflectNoun("Ahmet", "accusative")).toBe("Ahmet'i");
  });

  test("rejects unsupported case names at the type level", () => {
    // @ts-expect-error - "wrongcase" is not a valid NounCase
    inflectNoun("ev", "wrongcase");
  });
});

// ---------------------------------------------------------------------------
// VERB CONJUGATION
// ---------------------------------------------------------------------------

describe("inflectVerb - present continuous (-yor)", () => {
  const cases: [verb: string, expected: string][] = [
    ["gel", "geliyor"],
    ["git", "gidiyor"], // t -> d mutation
    ["oku", "okuyor"],
    ["bekle", "bekliyor"], // vowel drop before -yor
  ];

  test.each(cases)("inflectVerb(%s, 'presentContinuous') => %s", (verb, expected) => {
    expect(inflectVerb(verb, "presentContinuous")).toBe(expected);
  });
});

describe("inflectVerb - past tense (-di)", () => {
  const cases: [verb: string, expected: string][] = [
    ["gel", "geldi"],
    ["git", "gitti"], // voiceless consonant -> "t" not "d"
    ["oku", "okudu"],
    ["sev", "sevdi"],
  ];

  test.each(cases)("inflectVerb(%s, 'past') => %s", (verb, expected) => {
    expect(inflectVerb(verb, "past")).toBe(expected);
  });
});

describe("inflectVerb - future tense (-ecek)", () => {
  const cases: [verb: string, expected: string][] = [
    ["gel", "gelecek"],
    ["git", "gidecek"], // t -> d mutation
    ["oku", "okuyacak"], // buffer "y" + vowel harmony
  ];

  test.each(cases)("inflectVerb(%s, 'future') => %s", (verb, expected) => {
    expect(inflectVerb(verb, "future")).toBe(expected);
  });
});

describe("inflectVerb - negation", () => {
  const cases: [verb: string, expected: string][] = [
    ["gel", "gelmiyor"], // present continuous negative, adjust to your API shape
    ["git", "gitmiyor"],
  ];

  test.each(cases)(
    "inflectVerb(%s, 'presentContinuous', { negative: true }) => %s",
    (verb, expected) => {
      expect(inflectVerb(verb, "presentContinuous", { negative: true })).toBe(expected);
    }
  );
});

describe("inflectVerb - irregular verbs", () => {
  test("etmek", () => {
    expect(inflectVerb("et", "past")).toBe("etti");
  });

  test("gitmek future", () => {
    expect(inflectVerb("git", "future")).toBe("gidecek");
  });
});