import { NextRequest, NextResponse } from "next/server";

const DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

function calcBMI(bb: string, tb: string) {
  if (!bb || !tb) return null;
  const bmi = Number(bb) / Math.pow(Number(tb) / 100, 2);
  const cat =
    bmi < 18.5
      ? "Underweight"
      : bmi < 25
      ? "Normal"
      : bmi < 30
      ? "Overweight"
      : "Obesitas";
  return { val: bmi.toFixed(1), cat };
}

export async function POST(req: NextRequest) {
  const { profile, day } = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const likes = profile.likes.length > 0 ? profile.likes.join(", ") : "semua makanan";
  const dislikes = profile.dislikes.length > 0 ? profile.dislikes.join(", ") : "tidak ada";
  const bmiInfo = calcBMI(profile.bb, profile.tb);
  const bmiText = bmiInfo ? bmiInfo.val + " (" + bmiInfo.cat + ")" : "tidak diketahui";

  const prompt =
    "Kamu adalah ahli gizi. Buat meal plan SEHAT dan CLEAN EATING untuk hari " +
    DAYS[day] +
    ".\n\nData pengguna:\n- BB: " +
    profile.bb +
    " kg, TB: " +
    profile.tb +
    " cm, BMI: " +
    bmiText +
    "\n- Budget: max Rp 30.000/hari\n- Suka: " +
    likes +
    "\n- Tidak suka: " +
    dislikes +
    '\n- Tujuan: clean eating, berat badan stabil\n\nBuat meal plan 4 waktu makan. Balas HANYA JSON ini tanpa markdown:\n{"sarapan":{"nama":"","deskripsi":"","estimasi_harga":"Rp X.000","kalori":"~XXX kcal"},"siang":{"nama":"","deskripsi":"","estimasi_harga":"Rp X.000","kalori":"~XXX kcal"},"malam":{"nama":"","deskripsi":"","estimasi_harga":"Rp X.000","kalori":"~XXX kcal"},"snack":{"nama":"","deskripsi":"","estimasi_harga":"Rp X.000","kalori":"~XXX kcal"}}';

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data.error?.message ?? "API error" }, { status: res.status });
  }

  const block = data.content?.find((b: { type: string }) => b.type === "text");
  const raw = block?.text ?? "{}";

  try {
    const parsed = JSON.parse(raw.replace(/```json/g, "").replace(/```/g, "").trim());
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Gagal parse respons AI" }, { status: 500 });
  }
}
