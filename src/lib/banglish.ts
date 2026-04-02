// Banglish (Roman) to Bengali transliteration utility

const conjuncts: [string, string][] = [
  // Multi-char conjuncts first (longest match)
  ["chh", "ছ"], ["cch", "চ্ছ"], ["shh", "ষ"],
  ["ksh", "ক্ষ"], ["ngg", "ঙ্গ"], ["ng", "ং"],
  ["ch", "চ"], ["sh", "শ"], ["th", "থ"], ["dh", "ধ"],
  ["bh", "ভ"], ["ph", "ফ"], ["gh", "ঘ"], ["jh", "ঝ"],
  ["kh", "খ"], ["rr", "ড়"], ["tt", "ট্ট"],
  ["dd", "ড্ড"], ["nn", "ন্ন"], ["ll", "ল্ল"],
  ["ou", "ঔ"], ["oi", "ঐ"],
  ["aa", "আ"], ["ee", "ঈ"], ["oo", "ঊ"],
  ["ai", "আই"], ["ei", "এই"],
];

const singles: [string, string][] = [
  ["a", "া"], ["e", "ে"], ["i", "ি"], ["o", "ো"], ["u", "ু"],
  ["k", "ক"], ["g", "গ"], ["t", "ত"], ["d", "দ"], ["n", "ন"],
  ["p", "প"], ["b", "ব"], ["m", "ম"], ["r", "র"], ["l", "ল"],
  ["s", "স"], ["h", "হ"], ["j", "জ"], ["c", "চ"], ["y", "য"],
  ["w", "ও"], ["f", "ফ"], ["z", "জ"], ["q", "ক"],
  ["v", "ভ"], ["x", "ক্স"],
];

// Common Banglish words → Bengali direct mapping (most effective approach)
const dictionary: Record<string, string> = {
  // Products
  "gorur": "গরুর", "dudh": "দুধ", "doodh": "দুধ", "milk": "দুধ",
  "ghee": "ঘি", "ghi": "ঘি",
  "chaul": "চাল", "chal": "চাল", "rice": "চাল",
  "dal": "ডাল", "daal": "ডাল", "dhal": "ডাল",
  "mosur": "মসুর", "mosoor": "মসুর", "moshur": "মসুর",
  "aam": "আম", "am": "আম", "mango": "আম",
  "malta": "মাল্টা", "orange": "মাল্টা",
  "holud": "হলুদ", "holood": "হলুদ", "turmeric": "হলুদ", "halud": "হলুদ",
  "golmorich": "গোলমরিচ", "golmrich": "গোলমরিচ", "pepper": "গোলমরিচ",
  "tomato": "টমেটো", "tometo": "টমেটো",
  "shoshar": "শসা", "shosha": "শসা", "sosa": "শসা", "cucumber": "শসা",
  "lal": "লাল", "shak": "শাক", "shaak": "শাক",
  "organic": "অর্গানিক", "orgenik": "অর্গানিক",
  "nim": "নিম", "neem": "নিম",
  "facewash": "ফেসওয়াশ", "face": "ফেস",
  "miniket": "মিনিকেট",
  "taja": "তাজা", "taza": "তাজা", "fresh": "তাজা",
  "khati": "খাঁটি", "khaati": "খাঁটি", "pure": "খাঁটি",
  "deshi": "দেশি", "desi": "দেশি",
  "rajshahi": "রাজশাহী",

  // Categories
  "sobji": "সবজি", "shobji": "সবজি", "sabji": "সবজি", "vegetables": "সবজি",
  "fol": "ফল", "fhol": "ফল", "fruits": "ফলমূল", "folmul": "ফলমূল",
  "dugdho": "দুগ্ধজাত", "dairy": "দুগ্ধজাত", "dugdhojat": "দুগ্ধজাত",
  "moshla": "মশলা", "mashla": "মশলা", "spices": "মশলা", "mosla": "মশলা",
  "shosso": "শস্য", "grains": "শস্য", "sosho": "শস্য",
  "prosadhoni": "প্রসাধনী", "cosmetics": "প্রসাধনী",
  "joibo": "জৈব", "joib": "জৈব",

  // Vendors
  "sobuj": "সবুজ", "shobuj": "সবুজ", "green": "সবুজ",
  "krishi": "কৃষি", "farm": "ফার্ম", "khrishi": "কৃষি",
};

/**
 * Convert a Banglish query to possible Bengali search terms.
 * Returns an array of Bengali strings to search with.
 */
export function banglishToBengali(input: string): string[] {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return [];

  // Check if already Bengali script
  if (/[\u0980-\u09FF]/.test(trimmed)) return [trimmed];

  // Check if it's pure English/Roman
  if (!/^[a-zA-Z0-9\s]+$/.test(trimmed)) return [trimmed];

  const words = trimmed.split(/\s+/);
  const bengaliWords: string[] = [];

  for (const word of words) {
    const match = dictionary[word];
    if (match) {
      bengaliWords.push(match);
    }
  }

  // If we found dictionary matches, return combined
  if (bengaliWords.length > 0) {
    return bengaliWords;
  }

  // No dictionary match - return empty (will fall back to original query)
  return [];
}

/**
 * Generate search patterns for a query - returns both original and Bengali translations
 */
export function getSearchPatterns(query: string): string[] {
  const patterns = [query];
  const bengali = banglishToBengali(query);
  patterns.push(...bengali);
  return Array.from(new Set(patterns.filter(Boolean)));
}
