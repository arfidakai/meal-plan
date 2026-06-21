import { Profile } from "@/lib/types";
import { calcBMI } from "@/lib/utils";

export type Tip = {
  title: string;
  body: string;
};

export function getRandomPersonalTip(profile: Profile): Tip {
  const bmi = calcBMI(profile.bb, profile.tb);
  const tips: Tip[] = [];

  const bb = Number(profile.bb);
  const budget = Number(profile.budget);

  // ── 1. Goal-based Tips ───────────────────────────────────────────────────
  if (profile.tujuan === "turun") {
    tips.push({
      title: "💡 Defisit Kalori yang Sehat",
      body: `Kurangi 300–500 kcal/hari. Dengan BB ${profile.bb} kg, fokus kurangi porsi karbohidrat berlebih dan perbanyak sayur. Jangan ekstrem!`,
    });
  }

  if (profile.tujuan === "naik") {
    const proteinTarget = bb ? Math.round(bb * 1.8) : 100;
    tips.push({
      title: "💪 Surplus Kalori + Protein",
      body: `Target sekitar ${proteinTarget}g protein per hari. Tambahkan telur, susu, atau tempe untuk membantu kenaikan berat badan secara sehat.`,
    });
  }

  if (profile.tujuan === "maintain") {
    tips.push({
      title: "🔄 Konsistensi adalah Kuncinya",
      body: "Jaga jadwal makan yang sama tiap hari. Variasi menu oke, tapi waktu makan konsisten membantu metabolisme tetap stabil.",
    });
  }

  // ── 2. BMI-based Tips ────────────────────────────────────────────────────
  if (bmi?.cat === "Underweight") {
    tips.push({
      title: "🥑 Kalori Padat Nutrisi",
      body: "Alpukat, pisang, kacang-kacangan, dan susu bisa membantu meningkatkan berat badan secara sehat tanpa lemak berlebih.",
    });
  }

  if (bmi?.cat === "Normal") {
    tips.push({
      title: "🎯 Pertahankan yang Sudah Baik",
      body: "Berat badanmu sudah berada dalam rentang ideal. Fokus pada konsistensi pola makan sehat dan aktivitas fisik.",
    });
  }

  if (bmi?.cat === "Overweight" || bmi?.cat === "Obesitas") {
    tips.push({
      title: "🥗 Perbanyak Serat",
      body: "Isi setengah piring dengan sayur untuk membantu kenyang lebih lama dan mengurangi keinginan ngemil seharian.",
    });
  }

  if (bmi?.cat === "Obesitas") {
    tips.push({
      title: "🚶 Mulai dari Aktivitas Ringan",
      body: "Jalan kaki 20–30 menit setiap hari dapat membantu meningkatkan pembakaran kalori secara bertahap dan aman bagi sendi.",
    });
  }

  // ── 3. Goal + BMI Combination ────────────────────────────────────────────
  if (profile.tujuan === "naik" && bmi?.cat === "Underweight") {
    tips.push({
      title: "🍚 Jangan Takut Karbohidrat",
      body: "Karbohidrat kompleks seperti nasi merah, kentang, dan oatmeal sangat baik membantu menaikkan berat badan jika dikombinasikan dengan protein.",
    });
  }

  if (profile.tujuan === "turun" && (bmi?.cat === "Overweight" || bmi?.cat === "Obesitas")) {
    tips.push({
      title: "📉 Target yang Realistis",
      body: "Menurunkan 0,5–1 kg per minggu sudah termasuk progres yang sangat sehat, aman, dan berkelanjutan untuk jangka panjang.",
    });
  }

  if (profile.tujuan === "turun" && bmi?.cat === "Normal") {
    tips.push({
      title: "⚖️ Fokus Komposisi Tubuh",
      body: "BMI kamu sudah normal. Fokus meningkatkan massa otot lewat olahraga ringan dan mengurangi persentase lemak daripada sekadar menurunkan angka timbangan.",
    });
  }

  // ── 4. Aktivitas-based Tips (Pindahan Baru) ──────────────────────────────
  if (profile.aktivitas === "berat") {
    tips.push({
      title: "🍳 Protein untuk Recovery",
      body: "Kamu sangat aktif! Makan protein dalam 30–60 menit setelah beraktivitas fisik berat. Telur rebus atau tempe sudah cukup efektif membantu pemulihan otot.",
    });
  } else if (profile.aktivitas === "sedentary") {
    tips.push({
      title: "🌾 Energi Stabil Saat Banyak Duduk",
      body: "Karena aktivitasmu seharian lebih banyak duduk, utamakan pilihan karbo berkualitas seperti nasi merah atau kentang rebus agar energi stabil dan tidak gampang ngantuk.",
    });
  }

  // ── 5. Frekuensi Makan-based Tips (Pindahan Baru) ────────────────────────
  if (profile.frekuensiMakan === "2") {
    tips.push({
      title: "🍽️ Maksimalkan 2 Waktu Makan",
      body: "Dengan pola 2x makan harian, pastikan setiap piring porsinya padat protein + karbo kompleks agar energimu awet sepanjang hari.",
    });
  } else if (profile.frekuensiMakan === "5") {
    tips.push({
      title: "🍓 Strategi Snack Clean",
      body: "Makan 5x sehari berarti porsi snack harus dijaga. Pilih buah segar, rebusan singkong, atau segenggam kacang sebagai opsi clean yang mengenyangkan.",
    });
  }

  // ── 6. Budget-based Tips ─────────────────────────────────────────────────
  if (budget <= 20000) {
    tips.push({
      title: "🪙 Budget Hack Rp20K",
      body: "Tempe dan telur adalah sumber protein paling murah dengan kualitas gizi yang sangat baik dan bersahabat di kantong.",
    });
  }

  if (budget > 20000 && budget <= 35000) {
    tips.push({
      title: "🛒 Belanja Pasar Pagi",
      body: "Sayuran harian dan buah lokal di pasar pagi biasanya jauh lebih segar dan 20-30% lebih murah dibanding minimarket.",
    });
  }

  if (budget <= 25000) {
    tips.push({
      title: "🐟 Protein Hemat Alternatif",
      body: "Ikan pindang, tempe, tahu, dan telur memberikan asupan protein tinggi harian dengan harga yang super ramah kantong.",
    });
  }

  // ── 7. Budget + Goal Combination ─────────────────────────────────────────
  if (profile.tujuan === "naik" && budget <= 20000) {
    tips.push({
      title: "💪 Bulking Hemat",
      body: "Kombinasi sederhana telur, tempe, tahu, dan porsi nasi yang pas adalah cara paling murah dan efektif untuk menambah berat badan.",
    });
  }

  if (profile.tujuan === "turun" && budget <= 20000) {
    tips.push({
      title: "🥬 Diet Tidak Harus Mahal",
      body: "Kangkung, bayam, kol, dan mentimun adalah sayur rendah kalori paling murah yang bisa bikin piring makanmu terlihat penuh dan mengenyangkan.",
    });
  }

  // ── 8. Likes / Dislikes Food Logic (Pindahan Baru) ──────────────────────
  if (profile.likes.includes("Tahu") || profile.likes.includes("Tempe")) {
    tips.push({
      title: "🍢 Variasi Olahan Kedelai",
      body: "Tahu & tempe favoritmu bisa diolah dengan banyak cara clean: bacem tanpa digoreng, tumis minim minyak, atau dikukus agar bebas kalori minyak.",
    });
  }

  if (profile.dislikes.includes("Nasi merah") || profile.dislikes.includes("Oat")) {
    tips.push({
      title: "🥔 Alternatif Karbohidrat Lain",
      body: "Nggak cocok dengan nasi merah atau oat? Singkong rebus, kentang, atau jagung manis juga merupakan sumber karbo kompleks yang jempolan.",
    });
  } else {
    tips.push({
      title: "💧 Aturan Hidrasi Simpel",
      body: "Minum minimal 8 gelas air per hari. Coba biasakan minum segelas air putih sebelum makan — sering kali rasa lapar itu sebenarnya sinyal haus.",
    });
  }

  // ── 9. Personalized Protein ─────────────────────────────────────────────
  if (bb) {
    const proteinNeed = Math.round(bb * 1.5);
    tips.push({
      title: "🥚 Target Protein Harian",
      body: `Dengan berat badan ${bb} kg, usahakan mengonsumsi sekitar ${proteinNeed} gram protein per hari dari makanan utuh kamu.`,
    });
  }

  // ── 10. Motivation Tips ──────────────────────────────────────────────────
  tips.push(
    {
      title: "🔥 Sedikit Lebih Baik Hari Ini",
      body: "Tidak perlu sempurna. Satu pilihan porsi makanan yang sedikit lebih sehat hari ini sudah merupakan kemajuan besar.",
    },
    {
      title: "🌱 Konsistensi > Perfeksi",
      body: "Perubahan kecil yang rutin dilakukan setiap hari jauh lebih efektif daripada diet ekstrem ketat yang hanya bertahan seminggu.",
    },
    {
      title: "🏆 Fokus pada Kebiasaan",
      body: "Target berat badan di timbangan memang penting, tetapi fokus membangun kebiasaan makan yang baik akan memberikan hasil permanen jangka panjang.",
    }
  );

  // Fallback jika profile kosong melompong
  if (tips.length === 0) {
    return {
      title: "🌿 Clean Eating itu Simpel",
      body: "Pilih makanan yang paling dekat dengan bentuk aslinya. Semakin sedikit diproses oleh pabrik, biasanya semakin baik gizinya.",
    };
  }

  const randomIndex = Math.floor(Math.random() * tips.length);
  return tips[randomIndex];
}