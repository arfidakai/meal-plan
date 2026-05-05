import { NextRequest, NextResponse } from "next/server";

const DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

function calcBMI(bb: string, tb: string) {
  if (!bb || !tb) return null;
  const bmi = Number(bb) / Math.pow(Number(tb) / 100, 2);
  const cat =
    bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obesitas";
  return { val: bmi.toFixed(1), cat };
}

function calcTDEE(bb: string, tb: string, usia: string, gender: string, aktivitas: string) {
  const w = Number(bb), h = Number(tb), a = Number(usia);
  if (!w || !h || !a) return null;
  const bmr = gender === "perempuan"
    ? 10 * w + 6.25 * h - 5 * a - 161
    : 10 * w + 6.25 * h - 5 * a + 5;
  const multiplier: Record<string, number> = { sedentary: 1.2, ringan: 1.375, sedang: 1.55, berat: 1.725 };
  return Math.round(bmr * (multiplier[aktivitas] ?? 1.2));
}

function getTujuanLabel(tujuan: string) {
  return { turun: "menurunkan berat badan (defisit kalori ~300-500 kcal)", naik: "menaikkan berat badan / massa otot (surplus kalori ~300-500 kcal)", maintain: "mempertahankan berat badan", sehat: "hidup sehat dan menjaga kondisi tubuh" }[tujuan] ?? "hidup sehat";
}

const FOOD_PRICE_REF = `Referensi harga bahan makanan umum di Indonesia (gunakan ini sebagai acuan estimasi harga per porsi):
Protein: telur ayam Rp2.500/butir, tahu putih Rp2.000/potong, tempe Rp3.000/bungkus, dada ayam Rp8.000/100g, ikan lele Rp8.000/ekor, ikan tuna kaleng Rp8.000/kaleng, udang Rp12.000/100g, daging sapi Rp18.000/100g
Karbohidrat: nasi putih Rp3.000/porsi, nasi merah Rp5.000/porsi, oat Rp4.000/porsi, roti gandum Rp3.000/lembar, kentang Rp4.000/buah, singkong Rp3.000/porsi, jagung Rp3.000/buah
Sayuran: bayam Rp3.000/ikat, kangkung Rp2.000/ikat, brokoli Rp5.000/100g, wortel Rp3.000/buah, timun Rp2.000/buah, tomat Rp2.000/buah, kol Rp2.000/porsi
Buah: pisang Rp2.000/buah, pepaya Rp4.000/potong, apel Rp5.000/buah, jeruk Rp4.000/buah, semangka Rp5.000/potong
Lain-lain: susu UHT Rp5.000/200ml, yogurt plain Rp8.000/cup, minyak goreng Rp1.000/sdm, bumbu dapur Rp1.000-2.000/masak`;

export async function POST(req: NextRequest) {
  const { profile, day } = await req.json();

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const likes = profile.likes.length > 0 ? profile.likes.join(", ") : "semua makanan";
  const dislikes = profile.dislikes.length > 0 ? profile.dislikes.join(", ") : "tidak ada";
  const bmiInfo = calcBMI(profile.bb, profile.tb);
  const bmiText = bmiInfo ? bmiInfo.val + " (" + bmiInfo.cat + ")" : "tidak diketahui";
  const tdee = calcTDEE(profile.bb, profile.tb, profile.usia, profile.gender, profile.aktivitas);
  const tujuanText = getTujuanLabel(profile.tujuan);

  let targetKalori = tdee ?? 2000;
  if (profile.tujuan === "turun") targetKalori -= 400;
  else if (profile.tujuan === "naik") targetKalori += 400;

  const budgetPerHari = Number(profile.budget ?? 30000);

  const mealKeys: Record<string, string[]> = {
    "2": ["sarapan", "malam"],
    "3": ["sarapan", "siang", "malam"],
    "4": ["sarapan", "siang", "malam", "snack"],
    "5": ["sarapan", "snack_pagi", "siang", "snack_sore", "malam"],
  };
  const keys = mealKeys[profile.frekuensiMakan ?? "3"] ?? mealKeys["3"];
  const mealTemplate = keys.map((k) => `"${k}":{"nama":"","deskripsi":"","estimasi_harga":"Rp X.000","kalori":"~XXX kcal"}`).join(",");
  const mealListText = keys.map((k) => k.replace("_", " ")).join(", ");

  const prompt =
    "Kamu adalah ahli gizi. Buat meal plan SEHAT dan CLEAN EATING untuk hari " +
    DAYS[day] +
    ".\n\nData pengguna:\n- Nama: " + profile.nama +
    "\n- Usia: " + profile.usia + " tahun, Jenis kelamin: " + profile.gender +
    "\n- BB: " + profile.bb + " kg, TB: " + profile.tb + " cm, BMI: " + bmiText +
    "\n- Level aktivitas: " + profile.aktivitas +
    "\n- TDEE: ~" + (tdee ?? "?") + " kcal/hari" +
    "\n- Target kalori harian: ~" + targetKalori + " kcal (terbagi " + keys.length + " waktu makan)" +
    "\n- Tujuan: " + tujuanText +
    "\n- Budget makan: max Rp " + budgetPerHari.toLocaleString("id-ID") + "/hari (total semua waktu makan)" +
    "\n- Suka: " + likes +
    "\n- Tidak suka: " + dislikes +
    "\n\n" + FOOD_PRICE_REF +
    "\n\nSesuaikan porsi dan jenis makanan dengan tujuan dan kebutuhan kalori. Pastikan total estimasi harga tidak melebihi budget harian." +
    "\n\nBuat meal plan " + keys.length + " waktu makan (" + mealListText + "). Balas HANYA JSON ini tanpa markdown:\n{" + mealTemplate + "}";

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data.error?.message ?? "API error" }, { status: res.status });
  }

  const raw = data.choices?.[0]?.message?.content ?? "{}";

  try {
    const parsed = JSON.parse(raw.replace(/```json/g, "").replace(/```/g, "").trim());
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Gagal parse respons AI" }, { status: 500 });
  }
}
