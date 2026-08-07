# turkish-inflect

Turkish noun and verb inflection library — vowel harmony, consonant mutation, and case/tense suffixes.

Türkçe isim ve fiil çekimi kütüphanesi — ünlü uyumu, ünsüz yumuşaması ve hâl/zaman ekleri.

## Install / Kurulum

`npm install turkish-inflect` 

## Usage / Kullanım
```
const tr = require("turkish-inflect");

console.log(tr.inflectNoun("kitap", "accusative")); // "kitabı"
console.log(tr.inflectVerb("gel", "present", "1s")); // "geliyorum"
```