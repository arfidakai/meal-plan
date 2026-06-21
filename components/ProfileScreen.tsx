"use client";

import { useState, useEffect } from "react";
import { Profile } from "@/lib/types";
import { calcBMI } from "@/lib/utils";
import { FOOD_OPTIONS, CAT_TABS } from "@/lib/constants";

// Import komponen hasil pecahan
import { StepDataDiri, StepGayaHidup, FoodCategoryChips } from "./ProfileStep";
import { PreferencesScreen } from "./PreferencesScreen";
import { TipsScreen } from "./TipsScreen";

const STEPS = [{ label: "Data Diri" }, { label: "Gaya Hidup" }, { label: "Preferensi" }];

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
  
  // State untuk Opsi 2 (Modal Custom Makanan)
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customPrefs, setCustomPrefs] = useState<any[]>([]);
  const [newFood, setNewFood] = useState({ nama: "", kalori: "", harga: "" });

  const step1Ready = !!(profile.nama && profile.bb && profile.tb && profile.usia && profile.gender);
  const step2Ready = !!(profile.aktivitas && profile.tujuan);

  useEffect(() => {
    if (step === 3) loadCustomPrefs();
  }, [step]);

  const loadCustomPrefs = async () => {
    try {
      const res = await fetch("/api/preferences", { headers: { "x-session-id": profile.nama || "default" } });
      const data = await res.json();
      setCustomPrefs(data);
    } catch (err) { console.error(err); }
  };

  const handleSaveCustom = async () => {
    if (!newFood.nama.trim()) return;
    try {
      const res = await fetch("/api/preferences", {
        method: "POST",
        headers: { "x-session-id": profile.nama || "default" },
        body: JSON.stringify({
          nama: newFood.nama.trim(),
          kategori: activeTab,
          kalori: newFood.kalori || undefined,
          estimasi_harga: newFood.harga || undefined,
        }),
      });
      const savedData = await res.json();
      setCustomPrefs([savedData, ...customPrefs]);
      toggleFood(savedData.nama);
      setShowCustomModal(false);
      setNewFood({ nama: "", kalori: "", harga: "" });
    } catch (err) { console.error(err); }
  };

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

  const stepTitles = ["Data Diri", "Gaya Hidup", "Preferensi Makan"];
  const stepSubs = ["Isi info dasarmu dulu", "Biar rekomendasinya makin tepat", "Opsional — bisa dilewati"];

  return (
    <div className="screen">
      <div className="screen-header">
        <h1>{stepTitles[step - 1]}</h1>
        <p>{stepSubs[step - 1]}</p>
      </div>

      {/* Stepper horizontal */}
      <div className="stepper">
        {STEPS.map((s, i) => {
          const n = i + 1;
          return (
            <div key={n} style={{ display: "flex", alignItems: "flex-start", flex: i < STEPS.length - 1 ? 1 : 0 }}>
              <div className="step-item">
                <div className={"step-dot " + (n < step ? "step-dot-done" : n === step ? "step-dot-active" : "step-dot-pending")}>
                  {n < step ? "✓" : n}
                </div>
                <span className={"step-label" + (n === step ? " step-label-active" : "")}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={"step-line" + (n < step ? " step-line-done" : "")} />}
            </div>
          );
        })}
      </div>

      {/* Render komponen eksternal berdasarkan step aktif */}
      {step === 1 && <StepDataDiri profile={profile} setProfile={setProfile} bmi={bmi} />}
      {step === 2 && <StepGayaHidup profile={profile} setProfile={setProfile} />}
      
      {step === 3 && (
        <>
          <div className="card" style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <button className="mode-btn" style={{ background: foodMode === "like" ? "var(--sage-light)" : "var(--bg)", color: foodMode === "like" ? "var(--sage-dark)" : "var(--muted)", borderColor: foodMode === "like" ? "var(--sage)" : "var(--border)" }} onClick={() => setFoodMode("like")}>👍 Suka</button>
              <button className="mode-btn" style={{ background: foodMode === "dislike" ? "var(--red-light)" : "var(--bg)", color: foodMode === "dislike" ? "var(--red)" : "var(--muted)", borderColor: foodMode === "dislike" ? "var(--red)" : "var(--border)" }} onClick={() => setFoodMode("dislike")}>👎 Ga Suka</button>
            </div>
            {(profile.likes.length > 0 || profile.dislikes.length > 0) && (
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                {profile.likes.length > 0 && <span className="tag tag-like">👍 {profile.likes.length} dipilih</span>}
                {profile.dislikes.length > 0 && <span className="tag tag-dislike">👎 {profile.dislikes.length} dihindari</span>}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 12, overflowX: "auto", scrollbarWidth: "none" }}>
            {CAT_TABS.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: "8px 16px", borderRadius: 50, border: "1.5px solid", background: activeTab === tab.key ? "var(--sage-dark)" : "var(--surface)", color: activeTab === tab.key ? "white" : "var(--muted)", cursor: "pointer" }}>
                {tab.emoji} {tab.label}
              </button>
            ))}
          </div>

          <div className="card">
            <FoodCategoryChips
              catKey={activeTab}
              data={FOOD_OPTIONS[activeTab]}
              getTagClass={getTagClass}
              toggleFood={toggleFood}
              onAddCustom={() => setShowCustomModal(true)}
              customItems={customPrefs}
            />
          </div>
        </>
      )}

      {/* Navigasi Row */}
      <div className="nav-row" style={{ marginTop: 24 }}>
        {step > 1 && <button className="btn-back" onClick={() => setStep((s) => s - 1)}>← Kembali</button>}
        <button
          className="btn-primary"
          style={{ flex: 2 }}
          disabled={step === 1 ? !step1Ready : step === 2 ? !step2Ready : false}
          onClick={() => step < 3 ? setStep((s) => s + 1) : onSave()}
        >
          {step < 3 ? "Lanjut →" : mode === "edit" ? "Simpan Perubahan" : "Mulai Clean Eating!"}
        </button>
      </div>
      {step === 3 && <button className="btn-skip" onClick={onSave} style={{ marginTop: 12, width: "100%", background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}>Lewati, langsung mulai</button>}

      {/* Modal Overlay Form Kustom */}
      {showCustomModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="card" style={{ width: "100%", maxWidth: 400, position: "relative", background: "white" }}>
            <button onClick={() => setShowCustomModal(false)} style={{ position: "absolute", right: 15, top: 15, background: "none", border: "none", fontSize: 18, cursor: "pointer" }}>✕</button>
            <div className="card-label" style={{ marginBottom: 12 }}>Tambah ke Kategori {activeTab}</div>
            <div className="input-group" style={{ marginBottom: 12 }}>
              <label>Nama Makanan*</label>
              <input value={newFood.nama} onChange={e => setNewFood({...newFood, nama: e.target.value})} placeholder="Misal: Dada Ayam Panggang" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <div className="input-group"><label>Kalori (kcal)</label>
                <input type="number" value={newFood.kalori} onChange={e => setNewFood({...newFood, kalori: e.target.value})} placeholder="200" />
              </div>
              <div className="input-group"><label>Harga (Rp)</label>
                <input type="number" value={newFood.harga} onChange={e => setNewFood({...newFood, harga: e.target.value})} placeholder="15000" />
              </div>
            </div>
            <button className="btn-primary" onClick={handleSaveCustom}>Simpan & Pilih</button>
          </div>
        </div>
      )}
    </div>
  );
}

// // === FILE ProfileViewScreen TETAP BERADA DI SINI DI PALING BAWAH (Sama seperti sebelumnya) ===
// export function ProfileViewScreen({ profile, onEdit, sessionId = "default-session" }: { profile: Profile; onEdit: () => void; sessionId?: string }) {
//   // ... (Gunakan kode ProfileViewScreen terakhir yang pakai dropdown titik tiga) ...
// }
export function ProfileViewScreen({
  profile,
  onEdit,
  sessionId = "default-session",
}: {
  profile: Profile;
  onEdit: () => void;
  sessionId?: string;
}) {
  const bmi = calcBMI(profile.bb, profile.tb);
  
  // --- STATE UNTUK SCREEN DAN DROPDOWN ---
  const [subView, setSubView] = useState<"menu" | "preferences" | "tips">("menu");
  const [showDropdown, setShowDropdown] = useState(false);

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

  // Logika Render Sub-Screen jika diakses via dropdown
  if (subView === "preferences") {
    return <PreferencesScreen sessionId={sessionId} onBack={() => setSubView("menu")} />;
  }

  // if (subView === "tips") {
  //   return <TipsScreen sessionId={sessionId} onBack={() => setSubView("menu")} />;
  // }

  return (
    <div className="screen" onClick={() => setShowDropdown(false)}>
      
      {/* Header dengan Trigger Dropdown Titik Tiga */}
      <div className="screen-header" style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1>Halo, {profile.nama || "Kamu"}!</h1>
          <p>Ini data dan preferensi kamu</p>
        </div>

        {/* Pembungkus Tombol Titik Tiga */}
        <div style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              padding: "4px 8px",
              color: "var(--text)",
              letterSpacing: "1px"
            }}
          >
            •••
          </button>

          {/* Elemen Floating Dropdown Menu */}
          {showDropdown && (
            <div style={{
              position: "absolute",
              right: 0,
              top: "35px",
              background: "var(--surface, #ffffff)",
              border: "1px solid var(--border, #e0e0e0)",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              zIndex: 100,
              minWidth: "170px",
              overflow: "hidden"
            }}>
              <button 
                onClick={() => { setSubView("preferences"); setShowDropdown(false); }}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  color: "var(--text)",
                  borderBottom: "1px solid var(--border, #f0f0f0)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <span>⚙️</span> Atur Preferensi
              </button>
              <button 
                onClick={() => { setSubView("tips"); setShowDropdown(false); }}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  color: "var(--text)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <span>💡</span> Tips Sehat
              </button>
            </div>
          )}
        </div>
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
        <div className="card-label">Bahan Makanan (Onboarding)</div>
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

      <button className="btn-primary" onClick={onEdit} style={{ marginBottom: "20px" }}>Edit Profil</button>
    </div>
  );
}