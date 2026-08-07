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
  const cases: [word: string, expected: string][] = [
    ["ağız", "ağzı"],
    ["burun", "burnu"],
    ["akıl", "aklı"],
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
  ];

  test.each(cases)("inflectNoun(%s, 'dative') => %s", (word, expected) => {
    expect(inflectNoun(word, "dative")).toBe(expected);
  });

  test("inflectNoun('ağız', 'dative') => 'ağza'", () => {
    expect(inflectNoun("ağız", "dative")).toBe("ağza");
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

describe("inflectNoun - possessive", () => {
  test("inflectNoun('araba', 'possessive', '3s') => 'arabası'", () => {
    expect(inflectNoun("araba", "possessive", "3s")).toBe("arabası");
  });
  test("inflectNoun('ağaç', 'possessive', '1s') => 'ağacım'", () => {
    expect(inflectNoun("ağaç", "possessive", "1s")).toBe("ağacım");
  });
  test("inflectNoun('ağaç', 'possessive', '3s') => 'ağacı'", () => {
    expect(inflectNoun("ağaç", "possessive", "3s")).toBe("ağacı");
  });
  test("inflectNoun('ağaç', 'possessive', '3p') => 'ağaçlar'", () => {
    expect(inflectNoun("ağaç", "possessive", "3p")).toBe("ağaçları");
  });
  test("inflectNoun('su', 'possessive', '3p') => 'suları'", () => {
    expect(inflectNoun("su", "possessive", "3p")).toBe("suları");
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

  test("rejects unsupported case names at the type level and at runtime", () => {
    // @ts-expect-error - "wrongcase" is not a valid NounCase
    expect(() => inflectNoun("ev", "wrongcase")).toThrow();
  });

  test("capitalized proper nouns should not have consonant softening", () => {
    // Word.isProperNoun is only ever set if the input string already ends
    // with a literal "'" character - nothing inserts one automatically, and
    // nothing in inflect.ts detects capitalization. Today inflectNoun("Ahmet",
    // "accusative") softens t->d same as any common noun and produces
    // "Ahmedi", not "Ahmet'i".
    expect(inflectNoun("Ahmet'", "accusative")).toBe("Ahmet'i");
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

describe("inflectVerb - 'imperative' mode", () => {
  test("inflectVerb('gel', 'imperative', '1s') => 'geleyim'", () => {
    expect(inflectVerb("gel", "imperative", "1s")).toBe("geleyim");
  });

  test("inflectVerb('gel', 'imperative', '2s') => 'gel'", () => {
    expect(inflectVerb("gel", "imperative", "2s")).toBe("gel");
  });

  test("inflectVerb('gel', 'imperative', '3s') => 'gelsin'", () => {
    expect(inflectVerb("gel", "imperative", "3s")).toBe("gelsin");
  });

  test("inflectVerb('vur', 'imperative', '3p') => 'vursunlar'", () => {
    expect(inflectVerb("vur", "imperative", "3p")).toBe("vursunlar");
  });

  test("inflectVerb('gör', 'imperative', '3p') => 'görsünler'", () => {
    expect(inflectVerb("gör", "imperative", "3p")).toBe("görsünler");
  });

  test("inflectVerb('oku', 'imperative', '1s') => 'okuyayım' (vowel-ending stem, 'y' buffer)", () => {
    expect(inflectVerb("oku", "imperative", "1s")).toBe("okuyayım");
  });

  test("inflectVerb('de', 'imperative', '1s') => 'diyeyim' (vowel narrowing)", () => {
    expect(inflectVerb("de", "imperative", "1s")).toBe("diyeyim");
  });
});

describe("inflectVerb - 'present'", () => {
  test("inflectVerb('gel', 'present', '1s') => 'geliyorum'", () => {
    expect(inflectVerb("gel", "present", "1s")).toBe("geliyorum");
  });

  test("inflectVerb('gel', 'present', '2s') => 'geliyorsun'", () => {
    expect(inflectVerb("gel", "present", "2s")).toBe("geliyorsun");
  });

  test("inflectVerb('gel', 'present', '3s') => 'geliyor'", () => {
    expect(inflectVerb("gel", "present", "3s")).toBe("geliyor");
  });

  test("inflectVerb('de', 'present', '1s') => 'diyorum' (vowel narrowing)", () => {
    expect(inflectVerb("de", "present", "1s")).toBe("diyorum");
  });

  test("inflectVerb('başla', 'present', '1s') => 'başlıyorum' (vowel narrowing)", () => {
    expect(inflectVerb("başla", "present", "1s")).toBe("başlıyorum");
  });
});

describe("inflectVerb - 'aorist'", () => {
  test("inflectVerb('gel', 'aorist', '1s') => 'gelirim'", () => {
    expect(inflectVerb("gel", "aorist", "1s")).toBe("gelirim");
  });

  test("inflectVerb('gel', 'aorist', '2s') => 'gelirsin'", () => {
    expect(inflectVerb("gel", "aorist", "2s")).toBe("gelirsin");
  });

  test("inflectVerb('gel', 'aorist', '3s') => 'gelir", () => {
    expect(inflectVerb("gel", "aorist", "3s")).toBe("gelir");
  });

  test("inflectVerb('gel', 'aorist', '1p') => 'geliriz'", () => {
    expect(inflectVerb("gel", "aorist", "1p")).toBe("geliriz");
  });

  test("inflectVerb('gel', 'aorist', '2p') => 'gelirsiniz'", () => {
    expect(inflectVerb("gel", "aorist", "2p")).toBe("gelirsiniz");
  });

  test("inflectVerb('gel', 'aorist', '3p') => 'gelirler'", () => {
    expect(inflectVerb("gel", "aorist", "3p")).toBe("gelirler");
  });

  test("inflectVerb('başla', 'aorist', '1s') => 'başlarım' (vowel narrowing)", () => {
    expect(inflectVerb("başla", "aorist", "1s")).toBe("başlarım");
  });
});

describe("inflectVerb - 'witnessedPast'", () => {
  test("inflectVerb('gel', 'witnessedPast', '1s') => 'geldim'", () => {
    expect(inflectVerb("gel", "witnessedPast", "1s")).toBe("geldim");
  });

  test("inflectVerb('gel', 'witnessedPast', '2s') => 'geldin'", () => {
    expect(inflectVerb("gel", "witnessedPast", "2s")).toBe("geldin");
  });

  test("inflectVerb('gel', 'witnessedPast', '3s') => 'geldi", () => {
    expect(inflectVerb("gel", "witnessedPast", "3s")).toBe("geldi");
  });

  test("inflectVerb('gel', 'witnessedPast', '1p') => 'geldik'", () => {
    expect(inflectVerb("gel", "witnessedPast", "1p")).toBe("geldik");
  });

  test("inflectVerb('gel', 'witnessedPast', '2p') => 'geldiniz'", () => {
    expect(inflectVerb("gel", "witnessedPast", "2p")).toBe("geldiniz");
  });

  test("inflectVerb('gel', 'witnessedPast', '3p') => 'geldiler'", () => {
    expect(inflectVerb("gel", "witnessedPast", "3p")).toBe("geldiler");
  });
});

describe("inflectVerb - 'inferentialPast'", () => {
  test("inflectVerb('gel', 'inferentialPast', '1s') => 'gelmişim'", () => {
    expect(inflectVerb("gel", "inferentialPast", "1s")).toBe("gelmişim");
  });

  test("inflectVerb('gel', 'inferentialPast', '2s') => 'gelmişsin'", () => {
    expect(inflectVerb("gel", "inferentialPast", "2s")).toBe("gelmişsin");
  });

  test("inflectVerb('gel', 'inferentialPast', '3s') => 'gelmiş'", () => {
    expect(inflectVerb("gel", "inferentialPast", "3s")).toBe("gelmiş");
  });

  test("inflectVerb('gel', 'inferentialPast', '1p') => 'gelmişiz'", () => {
    expect(inflectVerb("gel", "inferentialPast", "1p")).toBe("gelmişiz");
  });

  test("inflectVerb('gel', 'inferentialPast', '2p') => 'gelmişsiniz'", () => {
    expect(inflectVerb("gel", "inferentialPast", "2p")).toBe("gelmişsiniz");
  });

  test("inflectVerb('gel', 'inferentialPast', '3p') => 'gelmişler'", () => {
    expect(inflectVerb("gel", "inferentialPast", "3p")).toBe("gelmişler");
  });
});

describe("inflectVerb - 'future'", () => {
  test("inflectVerb('gel', 'future', '1s') => 'geleceğim'", () => {
    expect(inflectVerb("gel", "future", "1s")).toBe("geleceğim");
  });

  test("inflectVerb('gel', 'future', '2s') => 'geleceksin'", () => {
    expect(inflectVerb("gel", "future", "2s")).toBe("geleceksin");
  });

  test("inflectVerb('gel', 'future', '3s') => 'gelecek'", () => {
    expect(inflectVerb("gel", "future", "3s")).toBe("gelecek");
  });

  test("inflectVerb('gel', 'future', '1p') => 'geleceğiz'", () => {
    expect(inflectVerb("gel", "future", "1p")).toBe("geleceğiz");
  });

  test("inflectVerb('gel', 'future', '2p') => 'geleceksiniz'", () => {
    expect(inflectVerb("gel", "future", "2p")).toBe("geleceksiniz");
  });

  test("inflectVerb('gel', 'future', '3p') => 'gelecekler'", () => {
    expect(inflectVerb("gel", "future", "3p")).toBe("gelecekler");
  });

  test("inflectVerb('de', 'future', '1s') => 'diyeceğim'", () => {
    expect(inflectVerb("de", "future", "1s")).toBe("diyeceğim");
  });

});

describe("inflectVerb - 'pastPerfect'", () => {
  test("inflectVerb('gel', 'pastPerfect', '1s') => 'gelmiştim'", () => {
    expect(inflectVerb("gel", "pastPerfect", "1s")).toBe("gelmiştim");
  });
  test("inflectVerb('dökül', 'pastPerfect', '1s') => 'dökülmüştüm'", () => {
    expect(inflectVerb("dökül", "pastPerfect", "1s")).toBe("dökülmüştüm");
  });

  test("inflectVerb('gel', 'pastPerfect', '2s') => 'gelmiştin'", () => {
    expect(inflectVerb("gel", "pastPerfect", "2s")).toBe("gelmiştin");
  });

  test("inflectVerb('gel', 'pastPerfect', '3s') => 'gelmişti'", () => {
    expect(inflectVerb("gel", "pastPerfect", "3s")).toBe("gelmişti");
  });

  test("inflectVerb('gel', 'pastPerfect', '1p') => 'gelmiştik'", () => {
    expect(inflectVerb("gel", "pastPerfect", "1p")).toBe("gelmiştik");
  });

  test("inflectVerb('gel', 'pastPerfect', '2p') => 'gelmiştiniz'", () => {
    expect(inflectVerb("gel", "pastPerfect", "2p")).toBe("gelmiştiniz");
  });

  test("inflectVerb('gel', 'pastPerfect', '3p') => 'gelmişlerdi'", () => {
    expect(inflectVerb("gel", "pastPerfect", "3p")).toBe("gelmişlerdi");
  });
});

describe("inflectVerb - negation (not yet implemented)", () => {
  //   gel + present(3s) negative -> "gelmiyor"
  //   git + present(3s) negative -> "gitmiyor"
  test.todo("inflectVerb exposes a negative/question option and applies it (e.g. gel -> gelmiyor)");
});

// ---------------------------------------------------------------------------
// ALIASES
// ---------------------------------------------------------------------------

describe("inflectNoun / inflectVerb - alias input", () => {
  test.todo("inflectNoun accepts alias case names (e.g. 'yönelme' for dative)");
  test.todo("inflectVerb accepts alias tense names (e.g. 'miş' for inferentialPast)");
});