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
