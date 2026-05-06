"use client";

import { useState } from "react";
import { Profile } from "@/lib/types";
import { calcBMI } from "@/lib/utils";
import { FOOD_OPTIONS, CAT_TABS, FoodCategoryValue } from "@/lib/constants";

function FoodCategoryChips({
  catKey,
  data,
  getTagClass,
  toggleFood,
}: {
  catKey: string;
  data: FoodCategoryValue;
  getTagClass: (food: string) => string;
  toggleFood: (food: string) => void;
}) {
  if (Array.isArray(data)) {
    return (
      <div className="tag-wrap" style={{ marginTop: 0 }}>
        {data.map((f) => (
          <span key={f} className={getTagClass(f)} onClick={() => toggleFood(f)}>{f}</span>
        ))}
      </div>
    );
  }
  return (
    <>
      {Object.entries(data as Record<string, string[]>).map(([subcat, foods]) => (
        <div key={subcat} style={{ marginBottom: 14 }}>
          <div style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.8px",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: 8,
          }}>
            {subcat}
          </div>
          <div className="tag-wrap" style={{ marginTop: 0 }}>
            {foods.map((f) => (
              <span key={f} className={getTagClass(f)} onClick={() => toggleFood(f)}>{f}</span>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

const STEPS = [
  { label: "Data Diri" },
  { label: "Gaya Hidup" },
  { label: "Preferensi" },
];

export function ProfileScreen({
  profile,
  setProfile,
  onSave,
  saved,
  mode,
}: {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  onSave: () => void;
  saved: boolean;
  mode: "onboarding" | "edit";
}) {
  const bmi = calcBMI(profile.bb, profile.tb);
  const [step, setStep] = useState(1);
  const [foodMode, setFoodMode] = useState<"like" | "dislike">("like");
  const [activeTab, setActiveTab] = useState("protein");

  const step1Ready = !!(profile.nama && profile.bb && profile.tb && profile.usia && profile.gender);
  const step2Ready = !!(profile.aktivitas && profile.tujuan);

  function toggleFood(food: string) {
    if (foodMode === "like") {
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

  const likeStyle = {
    background: foodMode === "like" ? "var(--sage-light)" : "var(--bg)",
    borderColor: foodMode === "like" ? "var(--sage)" : "var(--border)",
    color: foodMode === "like" ? "var(--sage-dark)" : "var(--muted)",
  };
  const dislikeStyle = {
    background: foodMode === "dislike" ? "var(--red-light)" : "var(--bg)",
    borderColor: foodMode === "dislike" ? "var(--red)" : "var(--border)",
    color: foodMode === "dislike" ? "var(--red)" : "var(--muted)",
  };

  const stepTitles = ["Data Diri", "Gaya Hidup", "Preferensi Makan"];
  const stepSubs = [
    "Isi info dasarmu dulu",
    "Biar rekomendasinya makin tepat",
    "Opsional — bisa dilewati",
  ];

  return (
    <div className="screen">
      <div className="screen-header">
        <h1>{stepTitles[step - 1]}</h1>
        <p>{stepSubs[step - 1]}</p>
      </div>

      <div className="stepper">
        {STEPS.map((s, i) => {
          const n = i + 1;
          const done = n < step;
          const active = n === step;
          return (
            <div key={n} style={{ display: "flex", alignItems: "flex-start", flex: i < STEPS.length - 1 ? 1 : 0 }}>
              <div className="step-item">
                <div className={"step-dot " + (done ? "step-dot-done" : active ? "step-dot-active" : "step-dot-pending")}>
                  {done ? "✓" : n}
                </div>
                <span className={"step-label" + (active ? " step-label-active" : "")}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={"step-line" + (done ? " step-line-done" : "")} />
              )}
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <div className="card">
          <div className="input-group" style={{ marginBottom: 10 }}>
            <label>Nama</label>
            <input
              value={profile.nama}
              onChange={(e) => setProfile((p) => ({ ...p, nama: e.target.value }))}
              placeholder="Nama kamu"
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
            <div className="input-group">
              <label>Usia (tahun)</label>
              <input
                type="number"
                value={profile.usia}
                onChange={(e) => setProfile((p) => ({ ...p, usia: e.target.value }))}
                placeholder="25"
              />
            </div>
            <div className="input-group">
              <label>Jenis Kelamin</label>
              <select
                value={profile.gender}
                onChange={(e) => setProfile((p) => ({ ...p, gender: e.target.value }))}
              >
                <option value="">Pilih...</option>
                <option value="laki-laki">Laki-laki</option>
                <option value="perempuan">Perempuan</option>
              </select>
            </div>
          </div>
          {bmi && (
            <div className="bmi-row">
              <span style={{ fontSize: 12, color: "var(--muted)" }}>BMI kamu:</span>
              <div className="bmi-badge">
                <span className="bmi-val">{bmi.val}</span>
                {bmi.cat}
              </div>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <>
          <div className="card">
            <div className="card-label">Level Aktivitas</div>
            <div className="tag-wrap">
              {[
                { val: "sedentary", label: "Jarang gerak", desc: "Kerja duduk, olahraga jarang" },
                { val: "ringan", label: "Ringan", desc: "Olahraga 1-2x/minggu" },
                { val: "sedang", label: "Sedang", desc: "Olahraga 3-5x/minggu" },
                { val: "berat", label: "Aktif", desc: "Olahraga tiap hari / kerja fisik" },
              ].map((opt) => (
                <span
                  key={opt.val}
                  className={"tag" + (profile.aktivitas === opt.val ? " tag-like" : "")}
                  onClick={() => setProfile((p) => ({ ...p, aktivitas: opt.val }))}
                  style={{ display: "flex", flexDirection: "column", gap: 2, padding: "8px 14px" }}
                >
                  <span style={{ fontWeight: 600 }}>{opt.label}</span>
                  <span style={{ fontSize: 10, opacity: 0.75 }}>{opt.desc}</span>
                </span>
              ))}
            </div>
            <div className="card-label" style={{ marginTop: 16 }}>Tujuan Utama</div>
            <div className="tag-wrap">
              {[
                { val: "turun", label: "Turun BB", emoji: "📉" },
                { val: "naik", label: "Naik BB / Otot", emoji: "📈" },
                { val: "maintain", label: "Maintain", emoji: "⚖️" },
                { val: "sehat", label: "Hidup Sehat", emoji: "🌿" },
              ].map((opt) => (
                <span
                  key={opt.val}
                  className={"tag" + (profile.tujuan === opt.val ? " tag-like" : "")}
                  onClick={() => setProfile((p) => ({ ...p, tujuan: opt.val }))}
                >
                  {opt.emoji} {opt.label}
                </span>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-label">Budget Makan Per Hari</div>
            <div className="tag-wrap" style={{ marginBottom: 12 }}>
              {["15000", "25000", "35000", "50000"].map((b) => (
                <span
                  key={b}
                  className={"tag" + (profile.budget === b ? " tag-like" : "")}
                  onClick={() => setProfile((p) => ({ ...p, budget: b }))}
                >
                  Rp {Number(b).toLocaleString("id-ID")}
                </span>
              ))}
            </div>
            <div className="input-group">
              <label>Atau ketik sendiri (Rp)</label>
              <input
                type="number"
                value={profile.budget}
                min="5000"
                onChange={(e) => setProfile((p) => ({ ...p, budget: e.target.value }))}
                placeholder="30000"
              />
            </div>
          </div>
          <div className="card">
            <div className="card-label">Frekuensi Makan Per Hari</div>
            <div className="tag-wrap">
              {[
                { val: "2", label: "2x", desc: "Sarapan + Malam" },
                { val: "3", label: "3x", desc: "Sarapan + Siang + Malam" },
                { val: "4", label: "4x", desc: "+ 1 Snack" },
                { val: "5", label: "5x", desc: "+ 2 Snack" },
              ].map((opt) => (
                <span
                  key={opt.val}
                  className={"tag" + (profile.frekuensiMakan === opt.val ? " tag-like" : "")}
                  onClick={() => setProfile((p) => ({ ...p, frekuensiMakan: opt.val }))}
                  style={{ display: "flex", flexDirection: "column", gap: 2, padding: "8px 14px" }}
                >
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{opt.label}</span>
                  <span style={{ fontSize: 10, opacity: 0.75 }}>{opt.desc}</span>
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          {/* Suka / Ga Suka toggle */}
          <div className="card" style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <button className="mode-btn" style={likeStyle} onClick={() => setFoodMode("like")}>👍 Suka</button>
              <button className="mode-btn" style={dislikeStyle} onClick={() => setFoodMode("dislike")}>👎 Ga Suka</button>
            </div>
            <p style={{ fontSize: 11, color: "var(--muted)" }}>
              {foodMode === "like" ? "Tap makanan yang kamu suka" : "Tap makanan yang kamu ga suka"}
            </p>
            {/* Summary badge */}
            {(profile.likes.length > 0 || profile.dislikes.length > 0) && (
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                {profile.likes.length > 0 && (
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--sage-dark)", background: "var(--sage-light)", borderRadius: 50, padding: "3px 10px" }}>
                    👍 {profile.likes.length} dipilih
                  </span>
                )}
                {profile.dislikes.length > 0 && (
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--red)", background: "var(--red-light)", borderRadius: 50, padding: "3px 10px" }}>
                    👎 {profile.dislikes.length} dihindari
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Category tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12, overflowX: "auto", paddingBottom: 2, scrollbarWidth: "none" }}>
            {CAT_TABS.map((tab) => {
              const catFoods = FOOD_OPTIONS[tab.key];
              const allFoods: string[] = Array.isArray(catFoods)
                ? catFoods
                : Object.values(catFoods as Record<string, string[]>).flat();
              const selectedCount = allFoods.filter((f) => profile.likes.includes(f) || profile.dislikes.includes(f)).length;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "8px 16px",
                    borderRadius: 50,
                    border: "1.5px solid",
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: "DM Sans, sans-serif",
                    cursor: "pointer",
                    background: isActive ? "var(--sage-dark)" : "var(--surface)",
                    borderColor: isActive ? "var(--sage-dark)" : "var(--border)",
                    color: isActive ? "white" : "var(--muted)",
                    transition: "all 0.18s",
                  }}
                >
                  <span>{tab.emoji}</span>
                  <span>{tab.label}</span>
                  {selectedCount > 0 && (
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      background: isActive ? "rgba(255,255,255,0.25)" : "var(--sage-light)",
                      color: isActive ? "white" : "var(--sage-dark)",
                      borderRadius: 50,
                      padding: "1px 6px",
                      minWidth: 18,
                      textAlign: "center",
                    }}>
                      {selectedCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Food chips for active tab */}
          <div className="card">
            <FoodCategoryChips
              catKey={activeTab}
              data={FOOD_OPTIONS[activeTab]}
              getTagClass={getTagClass}
              toggleFood={toggleFood}
            />
          </div>
        </>
      )}

      <div className="nav-row">
        {step > 1 && (
          <button className="btn-back" onClick={() => setStep((s) => s - 1)}>← Kembali</button>
        )}
        {step < 3 ? (
          <button
            className="btn-primary"
            style={{ flex: 2 }}
            disabled={step === 1 ? !step1Ready : !step2Ready}
            onClick={() => setStep((s) => s + 1)}
          >
            Lanjut →
          </button>
        ) : (
          <button className="btn-primary" style={{ flex: 2 }} onClick={onSave}>
            {mode === "edit" ? "Simpan Perubahan" : "Mulai Clean Eating!"}
          </button>
        )}
      </div>
      {step === 3 && (
        <button className="btn-skip" onClick={onSave}>Lewati, langsung mulai</button>
      )}
    </div>
  );
}

export function ProfileViewScreen({
  profile,
  onEdit,
}: {
  profile: Profile;
  onEdit: () => void;
}) {
  const bmi = calcBMI(profile.bb, profile.tb);

  const aktivitasLabels: Record<string, string> = {
    sedentary: "Jarang gerak",
    ringan: "Ringan",
    sedang: "Sedang",
    berat: "Aktif",
  };
  const tujuanLabels: Record<string, string> = {
    turun: "Turun BB 📉",
    naik: "Naik BB / Otot 📈",
    maintain: "Maintain ⚖️",
    sehat: "Hidup Sehat 🌿",
  };
  const frekuensiLabels: Record<string, string> = {
    "2": "2x (Sarapan + Malam)",
    "3": "3x (Sarapan + Siang + Malam)",
    "4": "4x (+ 1 Snack)",
    "5": "5x (+ 2 Snack)",
  };

  return (
    <div className="screen">
      <div className="screen-header">
        <h1>Halo, {profile.nama || "Kamu"}!</h1>
        <p>Ini data dan preferensi kamu</p>
      </div>

      <div className="card">
        <div className="card-label">Data Diri</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "Nama", value: profile.nama || "-" },
            { label: "Berat Badan", value: profile.bb ? profile.bb + " kg" : "-" },
            { label: "Tinggi Badan", value: profile.tb ? profile.tb + " cm" : "-" },
            { label: "Usia", value: profile.usia ? profile.usia + " tahun" : "-" },
            { label: "Jenis Kelamin", value: profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : "-" },
          ].map((row) => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>{row.label}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{row.value}</span>
            </div>
          ))}
          {bmi && (
            <div className="bmi-row">
              <span style={{ fontSize: 12, color: "var(--muted)" }}>BMI</span>
              <div className="bmi-badge">
                <span className="bmi-val">{bmi.val}</span>
                {bmi.cat}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-label">Gaya Hidup</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "Aktivitas", value: aktivitasLabels[profile.aktivitas] || "-" },
            { label: "Tujuan", value: tujuanLabels[profile.tujuan] || "-" },
            { label: "Budget/hari", value: profile.budget ? "Rp " + Number(profile.budget).toLocaleString("id-ID") : "-" },
            { label: "Frekuensi Makan", value: frekuensiLabels[profile.frekuensiMakan] || "-" },
          ].map((row) => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>{row.label}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", textAlign: "right", maxWidth: "55%" }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-label">Preferensi Makanan</div>
        {profile.likes.length > 0 && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>Suka</div>
            <div className="tag-wrap">
              {profile.likes.map((f) => (
                <span key={f} className="tag tag-like">{f}</span>
              ))}
            </div>
          </div>
        )}
        {profile.dislikes.length > 0 && (
          <div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>Ga Suka</div>
            <div className="tag-wrap">
              {profile.dislikes.map((f) => (
                <span key={f} className="tag tag-dislike">{f}</span>
              ))}
            </div>
          </div>
        )}
        {profile.likes.length === 0 && profile.dislikes.length === 0 && (
          <p style={{ fontSize: 13, color: "var(--muted)" }}>Belum ada preferensi yang dipilih</p>
        )}
      </div>

      <button className="btn-primary" onClick={onEdit}>Edit Profil</button>
    </div>
  );
}
