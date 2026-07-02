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
  const mealTemplate = keys.map((k) => `"${k}":{"nama":"","nama_en":"","deskripsi":"","estimasi_harga":"Rp X.000","kalori":"~XXX kcal"}`).join(",");
  const mealListText = keys.map((k) => k.replace("_", " ")).join(", ");

  const prompt =
  // Tambahkan baris ini di dalam string prompt kamu:
"\n- Catatan: Pada field 'nama_en', tuliskan terjemahan nama menu tersebut dalam bahasa Inggris yang sederhana dan umum agar mudah dicari di API internasional (contoh: 'Oatmeal with fruits', 'Grilled catfish', 'Chicken broccoli')." +
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
    // 1. Parse hasil generate dari Groq Llama
    const parsedMealPlan = JSON.parse(raw.replace(/```json/g, "").replace(/```/g, "").trim());
    
    // 2. Ambil Spoonacular API Key dari .env.local kamu
    const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;

if (unsplashAccessKey) {
  await Promise.all(
    Object.keys(parsedMealPlan).map(async (waktuMakan) => {
      const menuNameEn = parsedMealPlan[waktuMakan].nama_en;
      
      if (menuNameEn) {
        try {
          // Cari foto makanan estetik di Unsplash berdasarkan nama Inggris dari Groq
          const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(menuNameEn + " food")}&per_page=1&client_id=${unsplashAccessKey}`;
          const unsplashRes = await fetch(unsplashUrl);
          const unsplashData = await unsplashRes.json();

          if (unsplashData.results && unsplashData.results.length > 0) {
            // Ambil URL gambar ukuran regular/small yang pas buat card
            parsedMealPlan[waktuMakan].image = unsplashData.results[0].urls.small;
          } else {
            parsedMealPlan[waktuMakan].image = null;
          }
        } catch (err) {
          console.error(`Gagal fetch gambar Unsplash untuk ${menuNameEn}:`, err);
          parsedMealPlan[waktuMakan].image = null;
        }
      }
    })
  );
}
    // const spoonacularApiKey = process.env.SPOONACULAR_API_KEY;

    // // Jika API Key Spoonacular ada, kita perkaya datanya dengan foto dari Spoonacular
    // if (spoonacularApiKey) {
    //   // Loop setiap waktu makan (sarapan, siang, malam, dll) secara paralel
    //   await Promise.all(
    //     Object.keys(parsedMealPlan).map(async (waktuMakan) => {
    //       const menuNameEn = parsedMealPlan[waktuMakan].nama_en;
          
    //       if (menuNameEn) {
    //         try {
    //           // Cari resep di Spoonacular berdasarkan nama menu dari Groq
    //           const spoonUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(menuNameEn)}&number=1&apiKey=${spoonacularApiKey}`;
    //           const spoonRes = await fetch(spoonUrl);
    //           const spoonData = await spoonRes.json();

    //           // Jika resep ketemu, pasang gambar dan ID resepnya ke dalam object JSON kita
    //           if (spoonData.results && spoonData.results.length > 0) {
    //             parsedMealPlan[waktuMakan].image = spoonData.results[0].image;
    //             parsedMealPlan[waktuMakan].recipeId = spoonData.results[0].id; // Berguna jika nanti klik menu, mau lihat instruksi masaknya
    //           } else {
    //             parsedMealPlan[waktuMakan].image = null;
    //           }
    //         } catch (err) {
    //           console.error(`Gagal fetch gambar Spoonacular untuk ${menuNameEn}:`, err);
    //           parsedMealPlan[waktuMakan].image = null;
    //         }
    //       }
    //     })
    //   );
    // }

    // 3. Kembalikan data yang sudah lengkap dengan gambar ke frontend
    return NextResponse.json(parsedMealPlan);

  } catch (error) {
    console.error("Error parsing atau memperkaya data dengan Spoonacular:", error);
    return NextResponse.json({ error: "Gagal parse respons AI / Spoonacular" }, { status: 500 });
  }
}
