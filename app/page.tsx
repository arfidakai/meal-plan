"use client";

import { useState, useEffect } from "react";

// ── Styles ──────────────────────────────────────────────────────────────────
const appStyle = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #F7F5F0; --surface: #FFFFFF; --sage: #7A9E7E;
    --sage-light: #C8DBC9; --sage-dark: #4E7251; --cream: #EDE8DC;
    --brown: #5C4A32; --text: #2A2A2A; --muted: #8A8070;
    --border: #E5DFD3; --red: #C0513F; --red-light: #F5E0DC;
    --gold: #C49A3C; --gold-light: #F5EDD6;
  }
  body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); }
  .app { max-width: 390px; margin: 0 auto; min-height: 100vh; background: var(--bg); position: relative; }
  .status-bar { background: var(--bg); padding: 14px 24px 0; display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: 600; }
  .screen { padding: 0 20px 110px; overflow-y: auto; height: calc(100vh - 48px); }
  .screen::-webkit-scrollbar { display: none; }
  .screen-header { padding: 20px 0 16px; }
  .screen-header h1 { font-family: 'DM Serif Display', serif; font-size: 28px; line-height: 1.15; color: var(--brown); }
  .screen-header p { font-size: 13px; color: var(--muted); margin-top: 4px; }
  .card { background: var(--surface); border-radius: 20px; padding: 18px; margin-bottom: 14px; border: 1px solid var(--border); box-shadow: 0 2px 12px rgba(90,74,50,0.06); }
  .card-label { font-size: 10px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
  .profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .input-group { display: flex; flex-direction: column; gap: 5px; }
  .input-group label { font-size: 11px; color: var(--muted); font-weight: 500; }
  .input-group input, .input-group select { background: var(--bg); border: 1.5px solid var(--border); border-radius: 12px; padding: 10px 14px; font-size: 14px; font-family: 'DM Sans', sans-serif; color: var(--text); outline: none; transition: border 0.2s; width: 100%; }
  .input-group input:focus, .input-group select:focus { border-color: var(--sage); }
  .tag-wrap { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
  .tag { padding: 6px 14px; border-radius: 50px; font-size: 12px; font-weight: 500; border: 1.5px solid var(--border); background: var(--bg); color: var(--muted); cursor: pointer; user-select: none; }
  .tag-like { background: var(--sage-light); border-color: var(--sage); color: var(--sage-dark); }
  .tag-dislike { background: var(--red-light); border-color: var(--red); color: var(--red); }
  .bmi-row { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; }
  .bmi-badge { background: var(--cream); border-radius: 12px; padding: 8px 14px; font-size: 12px; color: var(--brown); font-weight: 500; }
  .bmi-val { font-size: 18px; font-weight: 700; margin-right: 4px; }
  .btn-primary { width: 100%; background: var(--sage-dark); color: #fff; border: none; border-radius: 16px; padding: 15px; font-size: 15px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; margin-top: 4px; }
  .btn-primary:hover { background: var(--sage); }
  .btn-primary:disabled { background: var(--sage-light); cursor: not-allowed; }
  .day-tabs { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; margin-bottom: 16px; }
  .day-tabs::-webkit-scrollbar { display: none; }
  .day-tab { flex-shrink: 0; padding: 8px 14px; border-radius: 50px; font-size: 12px; font-weight: 500; border: 1.5px solid var(--border); background: var(--surface); color: var(--muted); cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .day-tab-active { background: var(--sage-dark); border-color: var(--sage-dark); color: #fff; }
  .meal-slot { background: var(--surface); border-radius: 18px; border: 1px solid var(--border); margin-bottom: 12px; overflow: hidden; }
  .meal-slot-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid var(--border); background: var(--cream); }
  .meal-slot-title { font-size: 12px; font-weight: 600; color: var(--brown); letter-spacing: 0.5px; }
  .meal-time { font-size: 11px; color: var(--muted); }
  .meal-content { padding: 14px 16px; }
  .meal-name { font-family: 'DM Serif Display', serif; font-size: 17px; color: var(--text); margin-bottom: 4px; }
  .meal-desc { font-size: 12px; color: var(--muted); line-height: 1.5; }
  .meal-meta { display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap; }
  .meal-pill { font-size: 11px; font-weight: 500; padding: 4px 10px; border-radius: 50px; background: var(--bg); color: var(--muted); border: 1px solid var(--border); }
  .meal-pill-green { background: var(--sage-light); color: var(--sage-dark); border-color: var(--sage); }
  .skeleton { background: linear-gradient(90deg, var(--cream) 25%, var(--border) 50%, var(--cream) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 10px; height: 14px; margin-bottom: 8px; }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  .btn-regen { background: none; border: 1.5px solid var(--sage); color: var(--sage-dark); border-radius: 12px; padding: 10px 16px; font-size: 13px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; width: 100%; margin-top: 4px; }
  .btn-regen:hover { background: var(--sage-light); }
  .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 390px; background: rgba(247,245,240,0.95); backdrop-filter: blur(16px); border-top: 1px solid var(--border); display: flex; justify-content: space-around; padding: 10px 0 24px; z-index: 100; }
  .nav-item { display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; padding: 4px 12px; border-radius: 12px; }
  .nav-icon { font-size: 20px; color: var(--muted); }
  .nav-icon-active { color: var(--sage-dark); }
  .nav-label { font-size: 10px; color: var(--muted); font-weight: 500; }
  .nav-label-active { color: var(--sage-dark); font-weight: 600; }
  .tip-card { background: linear-gradient(135deg, #4E7251, #7A9E7E); border-radius: 20px; padding: 20px; color: white; margin-bottom: 14px; }
  .tip-card h3 { font-family: 'DM Serif Display', serif; font-size: 18px; margin-bottom: 6px; }
  .tip-card p { font-size: 13px; opacity: 0.88; line-height: 1.5; }
  .error-msg { background: #FEF0EE; border: 1px solid #F5C6BF; border-radius: 12px; padding: 12px 14px; font-size: 12px; color: var(--red); margin-top: 10px; }
  .hint-text { text-align: center; font-size: 12px; color: var(--muted); margin-top: 10px; }
  .mode-btn { flex: 1; padding: 8px; border-radius: 10px; border: 1.5px solid; font-size: 12px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; }
  .cat-label { font-size: 10px; color: var(--muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px; }
  .challenge-card { background: var(--surface); border-radius: 20px; border: 1px solid var(--border); margin-bottom: 14px; overflow: hidden; box-shadow: 0 2px 12px rgba(90,74,50,0.06); }
  .challenge-card-header { padding: 16px 18px 12px; }
  .challenge-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px; }
  .challenge-title { font-family: 'DM Serif Display', serif; font-size: 18px; color: var(--text); }
  .challenge-badge { font-size: 10px; font-weight: 600; padding: 4px 10px; border-radius: 50px; letter-spacing: 0.5px; }
  .badge-avoid { background: var(--red-light); color: var(--red); }
  .badge-streak { background: var(--gold-light); color: var(--gold); }
  .badge-done { background: var(--sage-light); color: var(--sage-dark); }
  .progress-wrap { background: var(--bg); border-radius: 50px; height: 8px; overflow: hidden; margin-bottom: 8px; }
  .progress-bar { height: 100%; border-radius: 50px; background: linear-gradient(90deg, var(--sage-dark), var(--sage)); transition: width 0.4s ease; }
  .progress-bar-gold { background: linear-gradient(90deg, var(--gold), #E8B84B); }
  .challenge-meta { display: flex; justify-content: space-between; font-size: 11px; color: var(--muted); }
  .checkin-row { display: flex; gap: 6px; overflow-x: auto; padding: 12px 18px; border-top: 1px solid var(--border); scrollbar-width: none; }
  .checkin-row::-webkit-scrollbar { display: none; }
  .day-dot-wrap { display: flex; flex-direction: column; align-items: center; gap: 4px; flex-shrink: 0; }
  .day-dot { width: 32px; height: 32px; border-radius: 50%; border: 1.5px solid var(--border); background: var(--bg); display: flex; align-items: center; justify-content: center; font-size: 13px; cursor: pointer; transition: all 0.18s; }
  .day-dot-done { background: var(--sage-dark); border-color: var(--sage-dark); color: white; }
  .day-dot-today { border-color: var(--sage); border-width: 2px; }
  .day-dot-future { opacity: 0.4; cursor: not-allowed; }
  .day-dot-label { font-size: 9px; color: var(--muted); font-weight: 500; }
  .streak-badge { display: flex; align-items: center; gap: 6px; background: var(--gold-light); border-radius: 12px; padding: 8px 14px; margin-bottom: 10px; }
  .streak-badge span { font-size: 13px; color: var(--gold); font-weight: 600; }
  .add-challenge-form { background: var(--surface); border-radius: 20px; border: 1px solid var(--border); padding: 18px; margin-bottom: 14px; }
  .form-title { font-family: 'DM Serif Display', serif; font-size: 18px; color: var(--brown); margin-bottom: 14px; }
  .type-selector { display: flex; gap: 8px; margin-bottom: 14px; }
  .type-btn { flex: 1; padding: 10px 8px; border-radius: 14px; border: 1.5px solid var(--border); font-size: 12px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; text-align: center; background: var(--bg); color: var(--muted); }
  .type-btn-active-avoid { background: var(--red-light); border-color: var(--red); color: var(--red); }
  .type-btn-active-streak { background: var(--gold-light); border-color: var(--gold); color: var(--gold); }
  .empty-challenge { text-align: center; padding: 40px 20px; color: var(--muted); }
  .empty-challenge p { font-size: 14px; margin-top: 8px; }
  .btn-danger { background: none; border: 1.5px solid var(--red); color: var(--red); border-radius: 10px; padding: 6px 12px; font-size: 11px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; }
  .completed-banner { background: linear-gradient(135deg, var(--sage-dark), var(--sage)); color: white; border-radius: 14px; padding: 10px 14px; margin: 8px 18px 12px; font-size: 12px; font-weight: 600; text-align: center; }
`;

// ── Constants ───────────────────────────────────────────────────────────────
const FOOD_OPTIONS: Record<string, string[]> = {
  protein: ["Ayam", "Tahu", "Tempe", "Telur", "Ikan", "Udang", "Daging sapi", "Tuna kaleng"],
  carbs: ["Nasi merah", "Oat", "Kentang", "Singkong", "Nasi putih", "Jagung", "Roti gandum"],
  veggies: ["Bayam", "Kangkung", "Brokoli", "Wortel", "Timun", "Tomat", "Kol", "Sawi"],
  fruits: ["Pisang", "Pepaya", "Apel", "Jeruk", "Semangka", "Melon"],
};
const CAT_LABELS: Record<string, string> = {
  protein: "Protein",
  carbs: "Karbohidrat",
  veggies: "Sayuran",
  fruits: "Buah",
};
const DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const MEALS = [
  { key: "sarapan", label: "Sarapan", time: "06.00 - 08.00" },
  { key: "siang", label: "Makan Siang", time: "11.30 - 13.00" },
  { key: "malam", label: "Makan Malam", time: "18.00 - 19.30" },
  { key: "snack", label: "Snack", time: "Bebas" },
];

// ── Types ────────────────────────────────────────────────────────────────────
interface Profile {
  nama: string;
  bb: string;
  tb: string;
  likes: string[];
  dislikes: string[];
}

interface MealItem {
  nama: string;
  deskripsi: string;
  estimasi_harga: string;
  kalori: string;
}

interface DayPlan {
  sarapan?: MealItem;
  siang?: MealItem;
  malam?: MealItem;
  snack?: MealItem;
}

interface Challenge {
  id: number;
  title: string;
  type: "avoid" | "streak";
  target: string;
  duration: number;
  checkins: boolean[];
  createdAt: number;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
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

async function generateMealPlan(profile: Profile, day: number): Promise<DayPlan> {
  const res = await fetch("/api/generate-meal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile, day }),
  });
  if (!res.ok) throw new Error("API error");
  return res.json();
}

// ── Profile Screen ───────────────────────────────────────────────────────────
function ProfileScreen({
  profile,
  setProfile,
  onSave,
}: {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  onSave: () => void;
}) {
  const bmi = calcBMI(profile.bb, profile.tb);
  const [mode, setMode] = useState<"like" | "dislike">("like");

  function toggleFood(food: string) {
    if (mode === "like") {
      setProfile((p) => ({
        ...p,
        likes: p.likes.includes(food) ? p.likes.filter((f) => f !== food) : [...p.likes, food],
        dislikes: p.dislikes.filter((f) => f !== food),
      }));
    } else {
      setProfile((p) => ({
        ...p,
        dislikes: p.dislikes.includes(food) ? p.dislikes.filter((f) => f !== food) : [...p.dislikes, food],
        likes: p.likes.filter((f) => f !== food),
      }));
    }
  }

  function getTagClass(food: string) {
    if (profile.likes.includes(food)) return "tag tag-like";
    if (profile.dislikes.includes(food)) return "tag tag-dislike";
    return "tag";
  }

  const ready = profile.bb && profile.tb && profile.nama;
  const likeStyle = {
    background: mode === "like" ? "var(--sage-light)" : "var(--bg)",
    borderColor: mode === "like" ? "var(--sage)" : "var(--border)",
    color: mode === "like" ? "var(--sage-dark)" : "var(--muted)",
  };
  const dislikeStyle = {
    background: mode === "dislike" ? "var(--red-light)" : "var(--bg)",
    borderColor: mode === "dislike" ? "var(--red)" : "var(--border)",
    color: mode === "dislike" ? "var(--red)" : "var(--muted)",
  };

  return (
    <div className="screen">
      <div className="screen-header">
        <h1>Profil Kamu</h1>
        <p>Isi data dulu biar rekomendasinya pas!</p>
      </div>
      <div className="card">
        <div className="card-label">Data Diri</div>
        <div className="input-group" style={{ marginBottom: 10 }}>
          <label>Nama</label>
          <input
            value={profile.nama}
            onChange={(e) => setProfile((p) => ({ ...p, nama: e.target.value }))}
            placeholder="Nama lo..."
          />
        </div>
        <div className="profile-grid">
          <div className="input-group">
            <label>Berat Badan (kg)</label>
            <input
              type="number"
              value={profile.bb}
              onChange={(e) => setProfile((p) => ({ ...p, bb: e.target.value }))}
              placeholder="55"
            />
          </div>
          <div className="input-group">
            <label>Tinggi Badan (cm)</label>
            <input
              type="number"
              value={profile.tb}
              onChange={(e) => setProfile((p) => ({ ...p, tb: e.target.value }))}
              placeholder="160"
            />
          </div>
        </div>
        {bmi && (
          <div className="bmi-row">
            <span style={{ fontSize: 12, color: "var(--muted)" }}>BMI lo:</span>
            <div className="bmi-badge">
              <span className="bmi-val">{bmi.val}</span>
              {bmi.cat}
            </div>
          </div>
        )}
      </div>
      <div className="card">
        <div className="card-label">Preferensi Makanan</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <button className="mode-btn" style={likeStyle} onClick={() => setMode("like")}>Suka</button>
          <button className="mode-btn" style={dislikeStyle} onClick={() => setMode("dislike")}>Ga Suka</button>
        </div>
        <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>
          {mode === "like" ? "Tap makanan yang lo suka" : "Tap makanan yang lo ga suka"}
        </p>
        {Object.keys(FOOD_OPTIONS).map((cat) => (
          <div key={cat} style={{ marginBottom: 12 }}>
            <div className="cat-label">{CAT_LABELS[cat]}</div>
            <div className="tag-wrap">
              {FOOD_OPTIONS[cat].map((f) => (
                <span key={f} className={getTagClass(f)} onClick={() => toggleFood(f)}>{f}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button className="btn-primary" disabled={!ready} onClick={onSave}>
        Mulai Clean Eating!
      </button>
      {!ready && <p className="hint-text">Isi nama, BB dan TB dulu ya</p>}
    </div>
  );
}

// ── Planner Screen ───────────────────────────────────────────────────────────
function PlannerScreen({ profile }: { profile: Profile }) {
  const [activeDay, setActiveDay] = useState(0);
  const [plans, setPlans] = useState<Record<number, DayPlan>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function loadDay(day: number) {
    setLoading(true);
    setError("");
    generateMealPlan(profile, day)
      .then((result) => {
        setPlans((p) => ({ ...p, [day]: result }));
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal generate. Coba lagi ya!");
        setLoading(false);
      });
  }

  useEffect(() => {
    if (!plans[activeDay]) loadDay(activeDay);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDay]);

  const plan = plans[activeDay];

  return (
    <div className="screen">
      <div className="screen-header">
        <h1>Meal Plan</h1>
        <p>Hi {profile.nama}! Ini jadwal makan sehatmu</p>
      </div>
      <div className="day-tabs">
        {DAYS.map((d, i) => (
          <button
            key={i}
            className={"day-tab" + (activeDay === i ? " day-tab-active" : "")}
            onClick={() => setActiveDay(i)}
          >
            {d}
          </button>
        ))}
      </div>
      {error && <div className="error-msg">{error}</div>}
      {MEALS.map((meal) => {
        const mealData = plan && plan[meal.key as keyof DayPlan];
        return (
          <div key={meal.key} className="meal-slot">
            <div className="meal-slot-header">
              <span className="meal-slot-title">{meal.label}</span>
              <span className="meal-time">{meal.time}</span>
            </div>
            <div className="meal-content">
              {loading ? (
                <div>
                  <div className="skeleton" style={{ width: "60%" }} />
                  <div className="skeleton" style={{ width: "90%" }} />
                  <div className="skeleton" style={{ width: "40%" }} />
                </div>
              ) : mealData ? (
                <div>
                  <div className="meal-name">{mealData.nama}</div>
                  <div className="meal-desc">{mealData.deskripsi}</div>
                  <div className="meal-meta">
                    <span className="meal-pill meal-pill-green">Clean</span>
                    <span className="meal-pill">{mealData.kalori}</span>
                    <span className="meal-pill">{mealData.estimasi_harga}</span>
                  </div>
                </div>
              ) : (
                <div style={{ padding: 20, textAlign: "center", color: "var(--muted)", fontSize: 13 }}>
                  Loading...
                </div>
              )}
            </div>
          </div>
        );
      })}
      {!loading && (
        <button className="btn-regen" onClick={() => loadDay(activeDay)}>
          Generate Ulang Hari Ini
        </button>
      )}
    </div>
  );
}

// ── Challenge Screen ─────────────────────────────────────────────────────────
function ChallengeScreen({ sessionId }: { sessionId: string }) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", type: "avoid" as "avoid" | "streak", target: "", duration: "7" });

  useEffect(() => {
    if (!sessionId) return;
    fetch("/api/challenges", { headers: { "x-session-id": sessionId } })
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setChallenges(data); })
      .catch(() => {});
  }, [sessionId]);

  function getTodayIndex(challenge: Challenge) {
    const daysPassed = Math.floor((Date.now() - challenge.createdAt) / 86400000);
    return Math.min(daysPassed, challenge.duration - 1);
  }

  function toggleCheckin(cid: number, dayIndex: number) {
    let updatedCheckins: boolean[] | null = null;
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id !== cid) return c;
        const today = getTodayIndex(c);
        if (dayIndex > today) return c;
        const next = [...c.checkins];
        next[dayIndex] = !next[dayIndex];
        updatedCheckins = next;
        return { ...c, checkins: next };
      })
    );
    if (sessionId && updatedCheckins !== null) {
      fetch("/api/challenges", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-session-id": sessionId },
        body: JSON.stringify({ id: cid, checkins: updatedCheckins }),
      }).catch(() => {});
    }
  }

  function deleteChallenge(cid: number) {
    setChallenges((prev) => prev.filter((c) => c.id !== cid));
    if (sessionId) {
      fetch("/api/challenges", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-session-id": sessionId },
        body: JSON.stringify({ id: cid }),
      }).catch(() => {});
    }
  }

  function addChallenge() {
    if (!form.title || !form.duration) return;
    const dur = parseInt(form.duration, 10);
    if (!dur || dur < 1) return;
    const newC: Challenge = {
      id: Date.now(),
      title: form.title,
      type: form.type,
      target: form.target,
      duration: dur,
      checkins: [],
      createdAt: Date.now(),
    };
    setChallenges((prev) => [newC, ...prev]);
    setForm({ title: "", type: "avoid", target: "", duration: "7" });
    setShowForm(false);
    if (sessionId) {
      fetch("/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-session-id": sessionId },
        body: JSON.stringify(newC),
      }).catch(() => {});
    }
  }

  function getStreak(challenge: Challenge) {
    const today = getTodayIndex(challenge);
    let streak = 0;
    for (let i = today; i >= 0; i--) {
      if (challenge.checkins[i]) streak++;
      else break;
    }
    return streak;
  }

  function getDoneCount(challenge: Challenge) {
    return challenge.checkins.filter(Boolean).length;
  }

  function isCompleted(challenge: Challenge) {
    const today = getTodayIndex(challenge);
    return today >= challenge.duration - 1 && getDoneCount(challenge) === challenge.duration;
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <h1>Challenge</h1>
        <p>Buktiin konsistensi lo!</p>
      </div>

      {challenges.length === 0 && !showForm && (
        <div className="empty-challenge">
          <div style={{ fontSize: 40 }}>🎯</div>
          <p>Belum ada challenge nih.</p>
          <p style={{ fontSize: 12, marginTop: 4 }}>Tambahin yang pertama yuk!</p>
        </div>
      )}

      {challenges.map((c) => {
        const today = getTodayIndex(c);
        const done = getDoneCount(c);
        const streak = getStreak(c);
        const pct = Math.round((done / c.duration) * 100);
        const completed = isCompleted(c);

        return (
          <div key={c.id} className="challenge-card">
            <div className="challenge-card-header">
              <div className="challenge-top">
                <div>
                  <div className="challenge-title">{c.title}</div>
                  {c.target && (
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Hindari: {c.target}</div>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  <span
                    className={
                      "challenge-badge " +
                      (completed ? "badge-done" : c.type === "avoid" ? "badge-avoid" : "badge-streak")
                    }
                  >
                    {completed ? "Selesai!" : c.type === "avoid" ? "Hindari" : "Streak"}
                  </span>
                  <button className="btn-danger" onClick={() => deleteChallenge(c.id)}>Hapus</button>
                </div>
              </div>

              {streak > 1 && (
                <div className="streak-badge">
                  <span>🔥 {streak} hari streak!</span>
                </div>
              )}

              <div className="progress-wrap">
                <div
                  className={"progress-bar" + (completed ? " progress-bar-gold" : "")}
                  style={{ width: pct + "%" }}
                />
              </div>
              <div className="challenge-meta">
                <span>{done} / {c.duration} hari</span>
                <span>{pct}% selesai</span>
              </div>
            </div>

            {completed ? (
              <div className="completed-banner">Selamat, lo berhasil! Keep it up!</div>
            ) : (
              <div className="checkin-row">
                {Array.from({ length: c.duration }, (_, i) => {
                  const isPast = i < today;
                  const isToday = i === today;
                  const isFuture = i > today;
                  const checked = !!c.checkins[i];
                  let cls = "day-dot";
                  if (checked) cls += " day-dot-done";
                  else if (isToday) cls += " day-dot-today";
                  else if (isFuture) cls += " day-dot-future";

                  return (
                    <div key={i} className="day-dot-wrap">
                      <div className={cls} onClick={() => { if (!isFuture) toggleCheckin(c.id, i); }}>
                        {checked ? "✓" : i + 1}
                      </div>
                      <div className="day-dot-label">
                        {isToday ? "Hari ini" : isPast ? "H" + (i + 1) : "H" + (i + 1)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {showForm ? (
        <div className="add-challenge-form">
          <div className="form-title">Challenge Baru</div>
          <div className="type-selector">
            <button
              className={"type-btn" + (form.type === "avoid" ? " type-btn-active-avoid" : "")}
              onClick={() => setForm((f) => ({ ...f, type: "avoid" }))}
            >
              Hindari Makanan
            </button>
            <button
              className={"type-btn" + (form.type === "streak" ? " type-btn-active-streak" : "")}
              onClick={() => setForm((f) => ({ ...f, type: "streak" }))}
            >
              Makan Sehat Rutin
            </button>
          </div>
          <div className="input-group" style={{ marginBottom: 10 }}>
            <label>Nama Challenge</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder={form.type === "avoid" ? "Contoh: No Gorengan" : "Contoh: Makan Sehat 7 Hari"}
            />
          </div>
          {form.type === "avoid" && (
            <div className="input-group" style={{ marginBottom: 10 }}>
              <label>Makanan yang dihindari</label>
              <input
                value={form.target}
                onChange={(e) => setForm((f) => ({ ...f, target: e.target.value }))}
                placeholder="Contoh: Gorengan, Nasi putih, Sugar..."
              />
            </div>
          )}
          <div className="input-group" style={{ marginBottom: 14 }}>
            <label>Durasi (hari)</label>
            <input
              type="number"
              value={form.duration}
              min="1"
              max="90"
              onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
              placeholder="7"
            />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-primary" style={{ flex: 2 }} onClick={addChallenge}>
              Mulai Challenge!
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{
                flex: 1,
                background: "var(--bg)",
                border: "1.5px solid var(--border)",
                borderRadius: 16,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "DM Sans",
                cursor: "pointer",
                color: "var(--muted)",
              }}
            >
              Batal
            </button>
          </div>
        </div>
      ) : (
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Tambah Challenge
        </button>
      )}
    </div>
  );
}

// ── Tips Screen ──────────────────────────────────────────────────────────────
function TipsScreen({ profile }: { profile: Profile }) {
  const bmi = calcBMI(profile.bb, profile.tb);
  const tips = [
    ["Pilih protein berkualitas", "Tahu, tempe, telur, dan ikan adalah pilihan terbaik untuk budget di bawah Rp 30K."],
    ["Karbohidrat kompleks", "Ganti nasi putih dengan nasi merah, oat, atau singkong untuk energi lebih stabil."],
    ["Cukup minum air", "Minimal 8 gelas per hari. Kadang rasa lapar itu sebenarnya dehidrasi."],
    ["Jangan skip makan", "Makan teratur 3x sehari + 1 snack lebih baik daripada makan besar tapi jarang."],
    ["Perbanyak sayur", "Isi setengah piringmu dengan sayuran setiap makan untuk nutrisi optimal."],
  ];
  const hacks = [
    "Beli sayuran di pasar pagi, lebih murah dan segar",
    "Masak sendiri jauh lebih hemat dari beli jadi",
    "Telur dan tempe adalah protein terjangkau dan bergizi tinggi",
    "Batch cooking: masak sekali untuk 2-3 hari",
    "Pisang sebagai snack: murah, kenyang, bergizi",
  ];

  return (
    <div className="screen">
      <div className="screen-header">
        <h1>Tips dan Info</h1>
        <p>Panduan clean eating buat lo</p>
      </div>
      <div className="tip-card">
        <h3>{bmi ? "BMI lo: " + bmi.val : "Isi profil dulu ya!"}</h3>
        {bmi && <p>{bmi.cat} - Tetap jaga pola makan sehat dan konsisten ya!</p>}
      </div>
      <div className="card">
        <div className="card-label">Prinsip Clean Eating</div>
        {tips.map((tip) => (
          <div key={tip[0]} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{tip[0]}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>{tip[1]}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-label">Budget Hack kurang dari Rp 30K per hari</div>
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

// ── Root ─────────────────────────────────────────────────────────────────────
type Screen = "profile" | "planner" | "challenge" | "tips";

export default function App() {
  const [screen, setScreen] = useState<Screen>("profile");
  const [profile, setProfile] = useState<Profile>({ nama: "", bb: "", tb: "", likes: [], dislikes: [] });
  const [saved, setSaved] = useState(false);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    let id = localStorage.getItem("cleaneat_session");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("cleaneat_session", id);
    }
    setSessionId(id);
    fetch("/api/setup", { method: "POST" }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    fetch("/api/profile", { headers: { "x-session-id": sessionId } })
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setProfile(data);
          setSaved(true);
          setScreen("planner");
        }
      })
      .catch(() => {});
  }, [sessionId]);

  function handleSave() {
    setSaved(true);
    setScreen("planner");
    if (sessionId) {
      fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-session-id": sessionId },
        body: JSON.stringify(profile),
      }).catch(() => {});
    }
  }

  const navItems = [
    { key: "profile" as Screen, icon: "👤", label: "Profil" },
    { key: "planner" as Screen, icon: "🥗", label: "Meal Plan" },
    { key: "challenge" as Screen, icon: "🎯", label: "Challenge" },
    { key: "tips" as Screen, icon: "💡", label: "Tips" },
  ];

  return (
    <div>
      <style>{appStyle}</style>
      <div className="app">
        <div className="status-bar">
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 14, color: "var(--sage-dark)" }}>
            CleanEat
          </span>
          <span>●●●</span>
        </div>

        {screen === "profile" && (
          <ProfileScreen profile={profile} setProfile={setProfile} onSave={handleSave} />
        )}
        {screen === "planner" && saved && <PlannerScreen profile={profile} />}
        {screen === "planner" && !saved && (
          <div className="screen">
            <div className="error-msg" style={{ marginTop: 20 }}>Isi profil dulu ya!</div>
          </div>
        )}
        {screen === "challenge" && <ChallengeScreen sessionId={sessionId} />}
        {screen === "tips" && <TipsScreen profile={profile} />}

        <nav className="bottom-nav">
          {navItems.map((n) => {
            const isActive = screen === n.key;
            return (
              <div key={n.key} className="nav-item" onClick={() => setScreen(n.key)}>
                <span className={"nav-icon" + (isActive ? " nav-icon-active" : "")}>{n.icon}</span>
                <span className={"nav-label" + (isActive ? " nav-label-active" : "")}>{n.label}</span>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
