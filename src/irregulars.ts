export const SOFTENING_EXCEPTIONS: ReadonlySet<string> = new Set([
    // 1. Polysyllabic Loanwords (Alıntı Kelimeler)
    "hukuk",
    "evrak",
    "ahlak",
    "millet",
    "devlet",
    "cumhuriyet",
    "sepet",
    "sanat",
    "paket",
    "bilet",
    "anket",
    "dikkat",
    "nefret",
    "servet",
    "şefkat",
    "tabiat",
    "ziyaret",
    "hürriyet",
    "merak",
    "idrak",
    "iştirak",
    "ittifak",
    "evlat",
    "saat",
    "kravat",
    "pilot",
    "bisiklet",
    "market",
    "ahret",
    "ahiret",
    // ... add more

    // 2. Monosyllabic Roots (Tek Heceli Kelimeler)
    // these are currently handled by Word.softenLastConsonant in a bypass

    // 3. Native Polysyllabic Abstract/Derived Nouns
    "anıt",
    "bulut",
    "kanıt",
    "ölçüt",
    "yazıt",
    "taşıt",
    "konut",
    "yakıt",
    "karşıt",
    "boyut",
    "özet",
    "aygıt",
    // ... add more

    // These survive vowel drop without softening
    "ufuk",
]);

// export const Y_BUFFER_STEMS: ReadonlySet<string> = new Set([
//     "su",
//     "ne"
// ]);

// Words where the vowel in the final syllable drops when a vowel-initial
// suffix is attached (ünlü düşmesi). Maps the dictionary form to its
// "dropped" stem — softening (p/ç/t/k -> b/c/d/ğ) is applied afterward by
// the normal Word.softenLastConsonant() pass, so stems here keep their
// original final consonant unless noted otherwise.

// TODO: may need this as a Set and calculate the dropped versions automatically
export const VOWEL_DROP_STEMS: ReadonlyMap<string, string> = new Map([
    // Body parts
    ["ağız", "ağz"],
    ["burun", "burn"],
    ["alın", "aln"],
    ["boyun", "boyn"],
    ["omuz", "omz"],
    ["göğüs", "göğs"],
    ["karın", "karn"],
    ["beyin", "beyn"],
    ["bağır", "bağr"],
    ["geniz", "genz"],
    ["gönül", "gönl"],
    ["avuç", "avç"], // also softens: ç -> c (avcu) — handled automatically

    // Arabic loanwords
    ["akıl", "akl"],
    ["fikir", "fikr"],
    ["isim", "ism"],
    ["resim", "resm"],
    ["cisim", "cism"],
    ["nesil", "nesl"],
    ["asıl", "asl"],
    ["sabır", "sabr"],
    ["şekil", "şekl"],
    ["ömür", "ömr"],
    ["şehir", "şehr"],
    ["hüküm", "hükm"],
    ["zulüm", "zulm"],
    ["izin", "izn"],
    ["emir", "emr"],
    ["kahır", "kahr"],
    ["keşif", "keşf"],
    ["devir", "devr"],
    ["metin", "metn"], // NB: same spelling as the name "Metin", which does NOT drop
    ["kayıp", "kayp"], // also softens: p -> b (kaybı) — handled automatically
    ["ayıp", "ayp"],   // also softens: p -> b (aybı) — handled automatically

    // Native kinship / abstract
    ["oğul", "oğl"],
    ["kayın", "kayn"],
    ["ufuk", "ufk"],
]);