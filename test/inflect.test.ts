import { describe, test, expect } from "vitest";
import { inflectNoun, inflectVerb } from "../src/index";
import type { NounCase, VerbTense, Person } from "../src/cases";
// Adjust the import paths above if your barrel file re-exports these differently.

// ---------------------------------------------------------------------------
// STATUS LEGEND
// ---------------------------------------------------------------------------
// - Plain `test`/`test.each`   -> currently implemented and passing.
// - `test.skip`/`test.skip.each` -> not yet implemented (or implemented
//   incorrectly). Expected values are linguistically correct targets; the
//   test is skipped so the suite stays green until the feature lands, but
//   the intended output is preserved in code as a spec/TODO list.
// - `test.todo`                -> open design question, not just missing
//   code. No fixed expected value has been written yet.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// NOUN CASES
// ---------------------------------------------------------------------------

describe("inflectNoun - accusative (implemented)", () => {
  const cases: [word: string, expected: string][] = [
    ["kız", "kızı"],
    ["kol", "kolu"],
    ["ev", "evi"],
    ["göz", "gözü"],
    ["araba", "arabayı"], // vowel-ending word, "y" buffer
    ["kapı", "kapıyı"],
    ["kitap", "kitabı"],  // p -> b softening
    ["ağaç", "ağacı"],    // ç -> c softening
    ["kağıt", "kağıdı"],  // t -> d softening
    ["top", "topu"],      // monosyllabic loanword: softening correctly skipped
    ["su", "suyu"],       // ends in vowel, "y" buffer handles this generically
  ];

  test.each(cases)("inflectNoun(%s, 'accusative') => %s", (word, expected) => {
    expect(inflectNoun(word, "accusative")).toBe(expected);
  });
});

describe("inflectNoun - accusative (known gap: vowel drop / ünlü düşmesi)", () => {
  // Word has no logic for dropping the second-syllable vowel of words like
  // ağız/burun/akıl before a vowel-initial suffix. Today these produce
  // "ağızı" / "burunu" / "akılı" instead. Softening (p/ç/t/k -> b/c/d/ğ)
  // is unaffected by this gap and already works correctly on its own.
  const cases: [word: string, expected: string][] = [
    ["ağız", "ağzı"],
    ["burun", "burnu"],
    ["akıl", "aklı"],
  ];

  test.skip.each(cases)("inflectNoun(%s, 'accusative') => %s", (word, expected) => {
    expect(inflectNoun(word, "accusative")).toBe(expected);
  });
});

describe("inflectNoun - other cases (not yet implemented)", () => {
  // inflectNoun_phrase's switch only has an "accusative" branch. Every other
  // NounCase falls through with an empty suffix and returns the word
  // unchanged. These are the correct target outputs once each case lands.
  const cases: [mode: NounCase, word: string, expected: string][] = [
    ["dative", "ev", "eve"],
    ["dative", "kol", "kola"],
    ["dative", "araba", "arabaya"],
    ["dative", "kitap", "kitaba"],
    ["dative", "su", "suya"],
    ["dative", "ağız", "ağza"], // also needs vowel drop

    ["locative", "ev", "evde"],
    ["locative", "kol", "kolda"],
    ["locative", "kitap", "kitapta"], // voiceless consonant -> "t" not "d"
    ["locative", "araba", "arabada"],

    ["ablative", "ev", "evden"],
    ["ablative", "kol", "koldan"],
    ["ablative", "kitap", "kitaptan"],
    ["ablative", "araba", "arabadan"],

    ["genitive", "ev", "evin"],
    ["genitive", "kol", "kolun"],
    ["genitive", "araba", "arabanın"], // "n" buffer
    ["genitive", "kitap", "kitabın"],
    ["genitive", "su", "suyun"],

    ["plural", "ev", "evler"],
    ["plural", "kol", "kollar"],
    ["plural", "araba", "arabalar"],
    ["plural", "göz", "gözler"],

    ["possessive", "araba", "arabası"], // (onun) araba-s-ı, 3rd person singular
  ];

  test.skip.each(cases)("inflectNoun(%s, %s) => %s", (mode, word, expected) => {
    expect(inflectNoun(word, mode)).toBe(expected);
  });
});

// ---------------------------------------------------------------------------
// EDGE CASES / ROBUSTNESS
// ---------------------------------------------------------------------------

describe("inflectNoun - edge cases", () => {
  test("empty string input returns '' (guarded before Phrase is constructed)", () => {
    expect(inflectNoun("", "accusative")).toBe("");
  });

  test("whitespace-only input throws (Phrase's empty-word invariant, not caught by the length guard)", () => {
    // "" is caught by `if (!input.length)` in inflectNoun and short-circuits
    // to "" before Phrase is ever constructed. A whitespace-only string has
    // nonzero length, so it reaches `new Phrase(" ")`, which throws once it
    // trims/filters down to zero words. Worth deciding if this asymmetry
    // (empty -> "", whitespace -> throw) is the intended contract.
    expect(() => inflectNoun(" ", "accusative")).toThrow();
  });

  test("rejects unsupported case names at the type level", () => {
    // @ts-expect-error - "wrongcase" is not a valid NounCase
    inflectNoun("ev", "wrongcase");
  });

  test.skip("capitalized proper nouns get an apostrophe and skip consonant softening", () => {
    // Word.isProperNoun is only ever set if the input string already ends
    // with a literal "'" character - nothing inserts one automatically, and
    // nothing in inflect.ts detects capitalization. Today inflectNoun("Ahmet",
    // "accusative") softens t->d same as any common noun and produces
    // "Ahmedi", not "Ahmet'i".
    expect(inflectNoun("Ahmet", "accusative")).toBe("Ahmet'i");
  });
});

// ---------------------------------------------------------------------------
// VERB CONJUGATION - full tense/person spec, sourced directly from the
// example forms given in cases.ts's own doc-comments on VerbTense (all
// using "yap-" as the example stem, as in those comments).
// ---------------------------------------------------------------------------

describe("inflectVerb - full tense/person spec (not yet implemented)", () => {
  // inflectVerb_phrase's switch only has a "present" branch, and within it
  // only "1s"/"2s" are handled - and (see next section) what it currently
  // produces for those doesn't match the progressive forms documented here.
  // Every row below is skipped; it's a spec/roadmap, not a regression check.
  const verb = "yap";
  const cases: [tense: VerbTense, person: Person, expected: string][] = [
    ["present", "1s", "yapıyorum"],
    ["present", "2s", "yapıyorsun"],
    ["present", "3s", "yapıyor"],

    ["present_2", "1s", "yapıyom"],
    ["present_2", "2s", "yapıyon"],
    ["present_2", "3s", "yapıyo"],

    ["present_3", "1s", "yapıom"],
    ["present_3", "2s", "yapıon"],
    ["present_3", "3s", "yapıo"],

    ["imperative", "1s", "yapayım"],
    ["imperative", "2s", "yap"],
    ["imperative", "3s", "yapsın"],

    ["imperative_2", "1s", "yapim"],
    ["imperative_2", "2s", "yap"],
    ["imperative_2", "3s", "yapsın"],

    ["imperative_3", "1s", "yapam"],
    ["imperative_3", "2s", "yap"],
    ["imperative_3", "3s", "yapsın"],

    ["aorist", "1s", "yaparım"],
    ["aorist", "2s", "yaparsın"],
    ["aorist", "3s", "yapar"],

    ["witnessedPast", "1s", "yaptım"],
    ["witnessedPast", "2s", "yaptın"],
    ["witnessedPast", "3s", "yaptı"],

    ["inferentialPast", "1s", "yapmışım"],
    ["inferentialPast", "2s", "yapmışsın"],
    ["inferentialPast", "3s", "yapmış"],

    ["future", "1s", "yapacağım"],
    ["future", "2s", "yapacaksın"],
    ["future", "3s", "yapacak"],

    ["future_2", "1s", "yapıcam"],
    ["future_2", "2s", "yapıcan"],
    ["future_2", "3s", "yapıcak"],

    ["future_3", "1s", "yapçam"],
    ["future_3", "2s", "yapçan"],
    ["future_3", "3s", "yapçak"],

    ["pastPerfect", "1s", "yapmıştım"],
    ["pastPerfect", "2s", "yapmıştın"],
    ["pastPerfect", "3s", "yapmıştı"],
  ];

  test.skip.each(cases)("inflectVerb('%s', %s, %s) => %s", (tense, person, expected) => {
    expect(inflectVerb(verb, tense, person)).toBe(expected);
  });
});

describe("inflectVerb - 'present' tense, 1s/2s: CURRENT actual behavior", () => {
  // These pass today and guard against accidental regressions, but flag
  // this clearly: the output doesn't match the progressive "yapıyorum"-style
  // forms documented for "present" above. "eyim"/"ayım" (1s) and "s_n" (2s)
  // look structurally like the imperative 1s/3s forms instead
  // (imperative 1s "yapayım", imperative 3s "yapsın"), just filed under the
  // wrong tense/person. Worth deciding: fix "present" to be progressive, or
  // rename/move this logic under "imperative"?
  test("inflectVerb('gel', 'present', '1s') => 'geleyim'", () => {
    expect(inflectVerb("gel", "present", "1s")).toBe("geleyim");
  });

  test("inflectVerb('gel', 'present', '2s') => 'gelsin'", () => {
    expect(inflectVerb("gel", "present", "2s")).toBe("gelsin");
  });

  test("inflectVerb('oku', 'present', '1s') => 'okuyayım' (vowel-ending stem, 'y' buffer)", () => {
    expect(inflectVerb("oku", "present", "1s")).toBe("okuyayım");
  });

  test.todo("3s/1p/2p/3p persons under 'present' are not handled by the switch - decide target forms once the 1s/2s semantics above are resolved");
});

describe("inflectVerb - negation (not yet implemented)", () => {
  // Two layers of gap here: inflectVerb_phrase accepts an `options` param
  // but never reads it, AND the public inflectVerb(input, tense, person)
  // wrapper doesn't even expose an options parameter at all - so this isn't
  // reachable from the string-based API yet no matter what. Target forms
  // once it is:
  //   gel + present(3s) negative -> "gelmiyor"
  //   git + present(3s) negative -> "gitmiyor"
  test.todo("inflectVerb exposes a negative/question option and applies it (e.g. gel -> gelmiyor)");
});

describe("inflectVerb - irregular verbs (not yet implemented)", () => {
  test.skip("etmek witnessedPast: 'et' is a monosyllabic softening exception", () => {
    expect(inflectVerb("et", "witnessedPast", "3s")).toBe("etti");
  });

  test.skip("gitmek future: t -> d mutation", () => {
    expect(inflectVerb("git", "future", "3s")).toBe("gidecek");
  });
});

// ---------------------------------------------------------------------------
// ALIASES
// ---------------------------------------------------------------------------

describe("inflectNoun / inflectVerb - alias input", () => {
  // NOUN_CASE_ALIASES / VERB_TENSE_ALIASES / normalizeNounCase /
  // normalizeVerbTense exist in cases.ts but aren't wired into inflectNoun
  // or inflectVerb - both still only accept the canonical NounCase/VerbTense
  // union, not NounCaseInput/VerbTenseInput. Once wired up, informal/Turkish
  // alias names like "yönelme" (dative) or "miş" (inferentialPast) should
  // work as direct inputs.
  test.todo("inflectNoun accepts alias case names (e.g. 'yönelme' for dative)");
  test.todo("inflectVerb accepts alias tense names (e.g. 'miş' for inferentialPast)");
});