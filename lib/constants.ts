export type FoodCategoryValue = string[] | Record<string, string[]>;

export const FOOD_OPTIONS: Record<string, FoodCategoryValue> = {
  protein: {
    Hewani: ["Ayam", "Telur", "Ikan", "Udang", "Daging sapi", "Tuna kaleng"],
    Nabati: ["Tahu", "Tempe", "Kacang merah", "Kacang hijau"],
  },
  carbs: {
    Kompleks: ["Nasi merah", "Oat", "Kentang", "Singkong", "Jagung", "Roti gandum"],
    Sederhana: ["Nasi putih", "Mie", "Roti putih"],
  },
  veggies: {
    Hijau: ["Bayam", "Kangkung", "Brokoli", "Sawi"],
    Lainnya: ["Wortel", "Timun", "Tomat", "Kol"],
  },
  fruits: ["Pisang", "Pepaya", "Apel", "Jeruk", "Semangka", "Melon", "Mangga", "Alpukat"],
};

export const CAT_TABS = [
  { key: "protein", label: "Protein", emoji: "🥩" },
  { key: "carbs", label: "Karbo", emoji: "🌾" },
  { key: "veggies", label: "Sayur", emoji: "🥦" },
  { key: "fruits", label: "Buah", emoji: "🍎" },
];

export const CAT_LABELS: Record<string, string> = {
  protein: "Protein",
  carbs: "Karbohidrat",
  veggies: "Sayuran",
  fruits: "Buah",
};

export const DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

export const MEAL_CONFIGS: Record<string, { key: string; label: string; time: string }[]> = {
  "2": [
    { key: "sarapan", label: "Sarapan", time: "07.00 - 08.00" },
    { key: "malam", label: "Makan Malam", time: "18.00 - 19.30" },
  ],
  "3": [
    { key: "sarapan", label: "Sarapan", time: "07.00 - 08.00" },
    { key: "siang", label: "Makan Siang", time: "11.30 - 13.00" },
    { key: "malam", label: "Makan Malam", time: "18.00 - 19.30" },
  ],
  "4": [
    { key: "sarapan", label: "Sarapan", time: "06.00 - 08.00" },
    { key: "siang", label: "Makan Siang", time: "11.30 - 13.00" },
    { key: "malam", label: "Makan Malam", time: "18.00 - 19.30" },
    { key: "snack", label: "Snack", time: "Bebas" },
  ],
  "5": [
    { key: "sarapan", label: "Sarapan", time: "07.00 - 08.00" },
    { key: "snack_pagi", label: "Snack Pagi", time: "10.00 - 10.30" },
    { key: "siang", label: "Makan Siang", time: "12.00 - 13.00" },
    { key: "snack_sore", label: "Snack Sore", time: "15.30 - 16.00" },
    { key: "malam", label: "Makan Malam", time: "18.00 - 19.30" },
  ],
};
