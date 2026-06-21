"use client";

import { Profile } from "@/lib/types";
import { calcBMI } from "@/lib/utils";
import { FOOD_OPTIONS, CAT_TABS, FoodCategoryValue } from "@/lib/constants";

// Sub-komponen pendukung chips makanan
export function FoodCategoryChips({
  catKey,
  data,
  getTagClass,
  toggleFood,
  onAddCustom,
  customItems = []
}: {
  catKey: string;
  data: FoodCategoryValue;
  getTagClass: (food: string) => string;
  toggleFood: (food: string) => void;
  onAddCustom: () => void;
  customItems?: any[];
}) {
  const currentCustoms = customItems.filter(item => item.kategori === catKey).map(item => item.nama);
  
  const renderChips = (foods: string[]) => (
    <div className="tag-wrap" style={{ marginTop: 0 }}>
      {foods.map((f) => (
        <span key={f} className={getTagClass(f)} onClick={() => toggleFood(f)}>{f}</span>
      ))}
      {currentCustoms.map((f) => (
        <span key={f} className={getTagClass(f)} onClick={() => toggleFood(f)}>{f} ✨</span>
      ))}
      <span className="tag" onClick={onAddCustom} style={{ borderStyle: "dashed", borderColor: "var(--sage)" }}>
        + Lainnya
      </span>
    </div>
  );

  if (Array.isArray(data)) return renderChips(data);

  return (
    <>
      {Object.entries(data as Record<string, string[]>).map(([subcat, foods]) => (
        <div key={subcat} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", marginBottom: 8, textTransform: "uppercase" }}>
            {subcat}
          </div>
          {renderChips(foods)}
        </div>
      ))}
    </>
  );
}

// === STEP 1: DATA DIRI ===
export function StepDataDiri({ profile, setProfile, bmi }: { profile: Profile; setProfile: any; bmi: any }) {
  return (
    <div className="card">
      <div className="input-group" style={{ marginBottom: 10 }}>
        <label>Nama</label>
        <input
          value={profile.nama}
          onChange={(e) => setProfile((p: any) => ({ ...p, nama: e.target.value }))}
          placeholder="Nama kamu"
        />
      </div>
      <div className="profile-grid">
        <div className="input-group"><label>Berat Badan (kg)</label>
          <input type="number" value={profile.bb} onChange={(e) => setProfile((p: any) => ({ ...p, bb: e.target.value }))} placeholder="55" />
        </div>
        <div className="input-group"><label>Tinggi Badan (cm)</label>
          <input type="number" value={profile.tb} onChange={(e) => setProfile((p: any) => ({ ...p, tb: e.target.value }))} placeholder="160" />
        </div>
        <div className="input-group"><label>Usia (tahun)</label>
          <input type="number" value={profile.usia} onChange={(e) => setProfile((p: any) => ({ ...p, usia: e.target.value }))} placeholder="25" />
        </div>
        <div className="input-group"><label>Jenis Kelamin</label>
          <select value={profile.gender} onChange={(e) => setProfile((p: any) => ({ ...p, gender: e.target.value }))}>
            <option value="">Pilih...</option>
            <option value="laki-laki">Laki-laki</option>
            <option value="perempuan">Perempuan</option>
          </select>
        </div>
      </div>
      {bmi && (
        <div className="bmi-row">
          <span style={{ fontSize: 12, color: "var(--muted)" }}>BMI kamu:</span>
          <div className="bmi-badge"><span className="bmi-val">{bmi.val}</span>{bmi.cat}</div>
        </div>
      )}
    </div>
  );
}

// === STEP 2: GAYA HIDUP ===
export function StepGayaHidup({ profile, setProfile }: { profile: Profile; setProfile: any }) {
  return (
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
            <span key={opt.val} className={"tag" + (profile.aktivitas === opt.val ? " tag-like" : "")} onClick={() => setProfile((p: any) => ({ ...p, aktivitas: opt.val }))} style={{ display: "flex", flexDirection: "column", gap: 2, padding: "8px 14px" }}>
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
            <span key={opt.val} className={"tag" + (profile.tujuan === opt.val ? " tag-like" : "")} onClick={() => setProfile((p: any) => ({ ...p, tujuan: opt.val }))}>
              {opt.emoji} {opt.label}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-label">Budget Makan Per Hari</div>
        <div className="tag-wrap" style={{ marginBottom: 12 }}>
          {["15000", "25000", "35000", "50000"].map((b) => (
            <span key={b} className={"tag" + (profile.budget === b ? " tag-like" : "")} onClick={() => setProfile((p: any) => ({ ...p, budget: b }))}>
              Rp {Number(b).toLocaleString("id-ID")}
            </span>
          ))}
        </div>
        <div className="input-group">
          <label>Atau ketik sendiri (Rp)</label>
          <input type="number" value={profile.budget} min="5000" onChange={(e) => setProfile((p: any) => ({ ...p, budget: e.target.value }))} placeholder="30000" />
        </div>
      </div>

      <div className="card">
        <div className="card-label">Frekuensi Makan Per Hari</div>
        <div className="tag-wrap">
          {[
            { val: "2", label: "2x", desc: "Sarapan + Malam" },
            { val: "3", label: "3x", desc: "Sarapan + Siang + Malam" },
          ].map((opt) => (
            <span key={opt.val} className={"tag" + (profile.frekuensiMakan === opt.val ? " tag-like" : "")} onClick={() => setProfile((p: any) => ({ ...p, frekuensiMakan: opt.val }))} style={{ display: "flex", flexDirection: "column", gap: 2, padding: "8px 14px" }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{opt.label}</span>
              <span style={{ fontSize: 10, opacity: 0.75 }}>{opt.desc}</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}