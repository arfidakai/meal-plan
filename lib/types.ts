export interface Profile {
  nama: string;
  bb: string;
  tb: string;
  usia: string;
  gender: string;
  aktivitas: string;
  tujuan: string;
  budget: string;
  frekuensiMakan: string;
  likes: string[];
  dislikes: string[];
}

export interface MealItem {
  nama: string;
  deskripsi: string;
  estimasi_harga: string;
  kalori: string;
  image?: string | null;    
  recipeId?: number | null;
}

export interface DayPlan {
  [key: string]: MealItem | undefined;
}

export interface Challenge {
  id: number;
  title: string;
  type: "avoid" | "streak";
  target: string;
  duration: number;
  checkins: boolean[];
  createdAt: number;
}

export interface FoodPreference {
  id?: string;
  nama: string;
  kategori: string; // e.g., "protein", "sayur", "karbo", "buah", "snack"
  kalori?: string;
  estimasi_harga?: string;
  createdAt?: number;
}

export interface FoodStock {
  id?: string;
  nama: string;
  kategori: string;
  jumlah: number;
  satuan: string; // e.g., "pcs", "kg", "liter", "bungkus"
  estimasi_harga?: string;
  tanggal_beli?: number;
  tanggal_expired?: number;
  catatan?: string;
  createdAt?: number;
}
