# turkish-inflect

> Turkish noun and verb inflection library — vowel harmony, consonant mutation, and case/tense suffixes.
>
> Türkçe isim ve fiil çekimi kütüphanesi — ünlü uyumu, ünsüz yumuşaması ve hâl/zaman ekleri.

[![npm version](https://img.shields.io/npm/v/turkish-inflect.svg)](https://www.npmjs.com/package/turkish-inflect)
[![license](https://img.shields.io/npm/l/turkish-inflect.svg)](LICENSE)

---

## Install / Kurulum

```bash
npm install turkish-inflect
```

  

## Usage / Kullanım

```js

const tr = require("turkish-inflect");

const noun = "kitap";
console.log(tr.inflectNoun(noun, "accusative")); // "kitabı"
console.log(tr.inflectNoun(noun, "ablative")); // "kitaptan"

// most nominal cases also have aliases:
console.log(tr.inflectNoun(noun, "i")); // "kitabı"
console.log(tr.inflectNoun(noun, "ı")); // "kitabı"
console.log(tr.inflectNoun(noun, "den")); // "kitaptan"

// some modes require person input:
console.log(tr.inflectNoun(noun, "possessive", "1s")); // "kitabım"
console.log(tr.inflectNoun(noun, "possessive", "1p")); // "kitabımız"
console.log(tr.inflectNoun(noun, "possessive", "3p")); // "kitapları"

// can add compound suffixes
const noun2 = tr.inflectNoun(noun, "plural"); // "kitaplar"
console.log(tr.inflectNoun(noun2, "possessive", "1s")); // "kitaplarım"

// end proper nouns with an apostrophe:
const properNoun = "Ahmet'";
console.log(tr.inflectNoun(properNoun, "i")); // "Ahmet'i"
console.log(tr.inflectNoun(properNoun, "den")); // "Ahmet'ten"

const verb = "Gel"
console.log(tr.inflectVerb(verb, "present", "1s")); // "geliyorum"
console.log(tr.inflectVerb(verb, "yor", "1s")); // "geliyorum"
console.log(tr.inflectVerb(verb, "future", "3p")); // "gelecekler"

```

## Noun Modes


| Mode | Turkish | Aliases | Example 
| :--- | :--- | :--- | :--- |
| `"accusative"` | Belirtme | `"i", "ı", "u", "ü"` | `"Ev"` -> `"Evi"` |
| `"dative"` | Yönelme | `"e", "a"` | `"Ev"` -> `"Eve"` |
| `"locative"` | Bulunma | `"de", "da"` | `"Ev"` -> `"Evde"` |
| `"ablative"` | Çıkma  | `"den", "dan"` | `"Ev"` -> `"Evde"` |
| `"genitive"` | Tamlayan | `"in", "ın"` | `"Ev"` -> `"Evin (kapısı)"` |
| `"possessive"` |  İyelik  | `"si", "sı"` | `"Ev"` -> `"(onun) Evi"` |
| `"plural"` |  Çoğul | `"ler", "lar"` | `"Ev"` -> `"Evler"` |
| `"instrumental"` |  Vasıta | `"ile", "la", "le"` | `"Ev"` -> `"Evle"` |

## Verb Modes

| Mode | Turkish | Aliases | Example 
| :--- | :--- | :--- | :--- |
| `"present"` |  Şimdiki | `"yor"` | `"Gel"` -> `"Geliyorum", "Geliyorsun", ...` |
| `"imperative"` |  Emir | `-` | `"Gel"` -> `"Geleyim", "Gel"` |
| `"aorist"` | Geniş | `"ir", "ır", "er", "ar"` | `"Gel"` -> `"Gelirim", "Gelirsin"` |
| `"witnessedPast"` |  "Di"li geçmiş | `"past", "di", "dı", "du", "dü"` | `"Gel"` -> `"Geldim", "Geldin"` |
| `"inferentialPast"` |  "Miş"li geçmiş | `"miş", "mış"` | `"Gel"` -> `"Gelmişim", "Gelmişsin"` |
| `"future"` |  Gelecek | `"ecek", "acak"` | `"Gel"` -> `"Gelecek", "Geleceksin"` |
| `"pastPerfect"` |  Hikaye | `"mişti", "mıştı"` | `"Gel"` -> `"Gelmiştim", "Gelmiştin"` |