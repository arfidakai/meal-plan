"use client";

import { Profile } from "@/lib/types";
import { calcBMI } from "@/lib/utils";

type Tip = { title: string; body: string };

function getTips(profile: Profile, bmi: ReturnType<typeof calcBMI>): Tip[] {
  const tips: Tip[] = [];
  const bb = Number(profile.bb);

  // 1. Goal-based
  if (profile.tujuan === "turun") {
    tips.push({
      title: "Defisit Kalori yang Sehat",
      body: `Untuk turun BB, kurangi 300–500 kcal per hari saja. Dengan BB ${profile.bb} kg, mulai dari porsi nasi lebih kecil + perbanyak sayur — jangan terlalu ekstrem.`,
    });
  } else if (profile.tujuan === "naik") {
    const targetProtein = bb ? Math.round(bb * 1.8) : null;
    tips.push({
      title: "Surplus Kalori + Protein",
      body: `Target${targetProtein ? ` sekitar ${targetProtein}g` : ""} protein per hari. Tambah 1–2 telur atau segelas susu untuk kalori ekstra tanpa lemak berlebih.`,
    });
  } else if (profile.tujuan === "maintain") {
    tips.push({
      title: "Konsistensi adalah Kuncinya",
      body: "Jaga jadwal makan yang sama tiap hari. Variasi menu oke, tapi waktu makan konsisten membantu metabolisme tetap stabil.",
    });
  } else {
    tips.push({
      title: "Clean Eating itu Simpel",
      body: "Pilih makanan yang paling dekat bentuk aslinya — makin sedikit diproses, makin baik. Tidak perlu diet ketat, cukup konsisten.",
    });
  }

  // 2. BMI-based
  if (bmi) {
    if (bmi.cat === "Underweight") {
      tips.push({
        title: "Tambah Kalori Padat Nutrisi",
        body: "Alpukat, kacang-kacangan, dan pisang adalah snack padat kalori sekaligus bergizi. Cocok untuk naikkan BB secara sehat.",
      });
    } else if (bmi.cat === "Overweight" || bmi.cat === "Obesitas") {
      tips.push({
        title: "Perbanyak Serat",
        body: "Sayur dan buah kaya serat bikin kenyang lebih lama dan kurangi keinginan ngemil. Isi setengah piring dengan sayur di setiap makan.",
      });
    } else {
      tips.push({
        title: "Jaga Karbohidrat Kompleks",
        body: "BMI kamu normal — pertahankan dengan pilihan karbo berkualitas seperti nasi merah, oat, atau kentang rebus untuk energi stabil.",
      });
    }
  }

  // 3. Aktivitas-based
  if (profile.aktivitas === "berat") {
    tips.push({
      title: "Protein untuk Recovery",
      body: "Makan protein dalam 30–60 menit setelah olahraga berat. Telur rebus atau tempe goreng sudah cukup efektif untuk pemulihan otot.",
    });
  } else if (profile.aktivitas === "sedentary") {
    tips.push({
      title: "Karbohidrat Kompleks",
      body: "Ganti nasi putih dengan nasi merah atau oat. Energi lebih stabil sepanjang hari — penting kalau kamu banyak duduk dan jarang bergerak.",
    });
  } else {
    tips.push({
      title: "Pilih Protein Berkualitas",
      body: "Tahu, tempe, telur, dan ikan adalah sumber protein terbaik untuk budget di bawah Rp 30K per hari.",
    });
  }

  // 4. Frekuensi makan-based
  if (profile.frekuensiMakan === "2") {
    tips.push({
      title: "Maksimalkan 2 Waktu Makan",
      body: "Dengan 2x makan, pastikan setiap porsi cukup protein + karbo kompleks supaya energi tahan lama dan tidak lapar tengah hari.",
    });
  } else if (profile.frekuensiMakan === "5") {
    tips.push({
      title: "Snack yang Tepat",
      body: "Snack bukan berarti junk food. Buah segar, rebusan singkong, atau segenggam kacang adalah pilihan clean yang mengenyangkan.",
    });
  } else {
    tips.push({
      title: "Jangan Skip Makan",
      body: "Makan teratur lebih baik dari makan besar tapi jarang. Skip makan justru bisa bikin makan berlebihan di waktu berikutnya.",
    });
  }

  // 5. Dislikes-based alternative
  if (profile.dislikes.includes("Nasi merah") || profile.dislikes.includes("Oat")) {
    tips.push({
      title: "Alternatif Karbo Sehat",
      body: "Ga suka nasi merah atau oat? Singkong, kentang rebus, atau jagung juga karbo kompleks yang bagus dan lebih mudah didapat.",
    });
  } else {
    tips.push({
      title: "Hidrasi",
      body: profile.aktivitas === "berat"
        ? "Kamu aktif — minum minimal 3 liter per hari. Dehidrasi ringan sudah bisa turunkan performa dan bikin cepat lapar."
        : "Minimal 8 gelas per hari. Coba minum segelas air dulu sebelum makan — sering kali rasa lapar itu sebenarnya haus.",
    });
  }

  return tips.slice(0, 5);
}

function getHacks(profile: Profile): string[] {
  const budget = Number(profile.budget);
  const hacks: string[] = [];

  if (budget <= 20000) {
    hacks.push("Telur sumber protein paling murah — Rp 2.500–3.000/butir, bisa diolah jadi apa saja");
    hacks.push("Tempe lebih murah dari tahu tapi lebih kaya protein — prioritaskan tempe");
    hacks.push("Bayam dan kangkung: sayur termurah dengan nutrisi paling tinggi");
    hacks.push("Pisang = snack terjangkau, bikin kenyang, dan kaya kalium");
    hacks.push("Masak nasi sekali untuk 2 hari — hemat gas, simpan di kulkas");
  } else if (budget <= 35000) {
    hacks.push("Beli sayuran di pasar pagi — lebih murah 20–30% dari minimarket");
    hacks.push(`Masak sendiri: ayam + nasi merah + tumis sayur bisa masuk budget Rp ${budget.toLocaleString("id-ID")}/hari`);
    hacks.push("Batch cooking: masak 2–3 porsi sekaligus hemat waktu dan bahan bakar");
    hacks.push("Telur dan tempe sebagai protein harian, ikan sesekali untuk variasi");
    hacks.push("Buah lokal (pisang, pepaya, mangga) selalu lebih murah dan lebih segar");
  } else {
    hacks.push(`Budget Rp ${budget.toLocaleString("id-ID")}/hari cukup untuk variasi protein tiap hari — rotasi ayam, ikan, telur, tahu, tempe`);
    hacks.push("Masak sendiri tetap jauh lebih hemat dari beli — investasikan di bumbu dasar");
    hacks.push("Beli protein frozen (ayam, ikan) dalam jumlah besar untuk harga lebih efisien");
    hacks.push("Meal prep Minggu malam untuk seminggu — hemat waktu dan hindari makan impulsif");
    hacks.push("Buah musiman selalu lebih murah dan lebih bergizi dari buah impor");
  }

  // Preference-based bonus hacks
  if (profile.likes.includes("Tahu") || profile.likes.includes("Tempe")) {
    hacks.push("Tahu & tempe favoritmu bisa diolah 10+ cara: goreng, bacem, tumis, kukus — variasi tanpa biaya tambahan");
  }
  if (profile.dislikes.includes("Nasi putih")) {
    hacks.push("Sudah hindari nasi putih? Nasi merah hampir sama harganya tapi jauh lebih mengenyangkan karena indeks glikemik lebih rendah");
  }

  return hacks.slice(0, 5);
}

export function TipsScreen({ profile }: { profile: Profile }) {
  const bmi = calcBMI(profile.bb, profile.tb);
  const tips = getTips(profile, bmi);
  const hacks = getHacks(profile);

  const tujuanLabel: Record<string, string> = {
    turun: "Turun BB",
    naik: "Naik BB / Otot",
    maintain: "Maintain",
    sehat: "Hidup Sehat",
  };

  return (
    <div className="screen">
      <div className="screen-header">
        <h1>Tips untuk {profile.nama || "Kamu"}</h1>
        <p>Disesuaikan dengan profil dan tujuanmu</p>
      </div>

      {/* BMI + Goal summary card */}
      <div className="tip-card">
        {bmi ? (
          <>
            <h3>BMI {bmi.val} — {bmi.cat}</h3>
            <p>
              {bmi.cat === "Underweight" && "Fokus tingkatkan asupan kalori dan protein secara bertahap."}
              {bmi.cat === "Normal" && "BMI ideal! Pertahankan dengan pola makan konsisten."}
              {bmi.cat === "Overweight" && "Perlahan kurangi kalori, perbanyak sayur dan protein."}
              {bmi.cat === "Obesitas" && "Konsultasi dokter dianjurkan — mulai dari perubahan kecil yang konsisten."}
              {profile.tujuan && ` Tujuan: ${tujuanLabel[profile.tujuan] ?? profile.tujuan}.`}
            </p>
          </>
        ) : (
          <>
            <h3>Lengkapi profil dulu ya!</h3>
            <p>Isi berat dan tinggi badan agar tips bisa lebih personal.</p>
          </>
        )}
      </div>

      {/* Personalized tips */}
      <div className="card">
        <div className="card-label">Tips Personal</div>
        {tips.map((tip) => (
          <div key={tip.title} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{tip.title}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>{tip.body}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic budget hacks */}
      <div className="card">
        <div className="card-label">
          Budget Hack · Rp {Number(profile.budget || 0).toLocaleString("id-ID")}/hari
        </div>
        {hacks.map((hack, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
            <span style={{ color: "var(--sage-dark)", fontWeight: 700, fontSize: 13 }}>+</span>
            <span style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.4 }}>{hack}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
