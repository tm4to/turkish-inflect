
# turkish-inflect

  

Turkish noun and verb inflection library — vowel harmony, consonant mutation, and case/tense suffixes.

  

Türkçe isim ve fiil çekimi kütüphanesi — ünlü uyumu, ünsüz yumuşaması ve hâl/zaman ekleri.

  

## Install / Kurulum

  

`npm install turkish-inflect`

  

## Usage / Kullanım

```

const tr = require("turkish-inflect");

  

const noun = "kitap";

console.log(tr.inflectNoun(noun, "accusative")); // "kitabı"

console.log(tr.inflectNoun(noun, "ablative")); // "kitaptan"

  

// also supports aliases:

console.log(tr.inflectNoun(noun, "i")); // "kitabı"

console.log(tr.inflectNoun(noun, "ı")); // "kitabı"

console.log(tr.inflectNoun(noun, "den")); // "kitaptan"

  

console.log(tr.inflectVerb("gel", "present", "1s")); // "geliyorum"

console.log(tr.inflectVerb("gel", "future", "3p")); // "gelecekler"

```

## Noun Modes


| Mode | Türkçe | Aliases | Example 
| :--- | :--- | :--- | :--- |
| `"accusative"` | Belirtme | `"i", "ı", "u", "ü"` | `"Ev"` -> `"Evi"` |
| `"dative"` | Yönelme | `"e", "a"` | `"Ev"` -> `"Eve"` |
| `"locative"` | Bulunma | `"de", "da"` | `"Ev"` -> `"Evde"` |
| `"ablative"` |  | `` | `` |

## Verb Modes

| Mode | Türkçe | Aliases | Example 
| :--- | :--- | :--- | :--- |
| `"present"` | Şimdiki | `"yor"` | `"Gel"` -> `"Geliyorum", "Geliyorsun", ...` |
| `"imperative"` | Emir | `-` | `"Gel"` -> `"Geleyim", "Gel"` |
| `"Aorist"` | Geniş |  |