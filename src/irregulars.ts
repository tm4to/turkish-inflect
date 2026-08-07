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
]);