"use client";

import { useState, useEffect } from "react";
import { FoodPreference } from "@/lib/types";

interface PreferencesScreenProps {
  sessionId: string;
  onBack: () => void;
}

const CATEGORIES = ["protein", "sayur", "karbo", "buah", "snack", "minuman", "lainnya"];

export function PreferencesScreen({ sessionId, onBack }: PreferencesScreenProps) {
  const [preferences, setPreferences] = useState<FoodPreference[]>([]);
  const [loading, setLoading] = useState(false);
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("protein");
  const [kalori, setKalori] = useState("");
  const [harga, setHarga] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/preferences", {
        headers: { "x-session-id": sessionId },
      });
      if (!res.ok) throw new Error("Failed to load preferences");
      const data = await res.json();
      setPreferences(data);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat preferensi makanan");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPreference = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!nama.trim()) {
      setError("Nama makanan tidak boleh kosong");
      return;
    }

    try {
      const res = await fetch("/api/preferences", {
        method: "POST",
        headers: { "x-session-id": sessionId },
        body: JSON.stringify({
          nama: nama.trim(),
          kategori,
          kalori: kalori || undefined,
          estimasi_harga: harga || undefined,
        }),
      });

      if (!res.ok) throw new Error("Failed to add preference");
      const newPref = await res.json();
      setPreferences([newPref, ...preferences]);
      setNama("");
      setKategori("protein");
      setKalori("");
      setHarga("");
      setSuccess("Preferensi ditambahkan!");
    } catch (err) {
      console.error(err);
      setError("Gagal menambahkan preferensi");
    }
  };

  const handleDeletePreference = async (id: string | undefined) => {
    if (!id) return;

    try {
      const res = await fetch("/api/preferences", {
        method: "DELETE",
        headers: { "x-session-id": sessionId },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to delete preference");
      setPreferences(preferences.filter((p) => p.id !== id));
      setSuccess("Preferensi dihapus!");
    } catch (err) {
      console.error(err);
      setError("Gagal menghapus preferensi");
    }
  };

  return (
    <div className="screen" style={{ paddingTop: "20px" }}>
      <div className="screen-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px" }}>
        <h1 style={{ fontSize: "24px", margin: 0 }}>Preferensi Makanan</h1>
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            padding: "8px",
          }}
        >
          ✕
        </button>
      </div>

      {/* Add preference form */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <div className="card-label">Tambah Preferensi</div>
        <form onSubmit={handleAddPreference}>
          <div className="input-group" style={{ marginBottom: "12px" }}>
            <label>Nama Makanan*</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="e.g., Ayam Goreng"
            />
          </div>

          <div className="input-group" style={{ marginBottom: "12px" }}>
            <label>Kategori*</label>
            <select value={kategori} onChange={(e) => setKategori(e.target.value)}>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div className="input-group">
              <label>Kalori (kcal)</label>
              <input
                type="number"
                value={kalori}
                onChange={(e) => setKalori(e.target.value)}
                placeholder="e.g., 200"
              />
            </div>
            <div className="input-group">
              <label>Harga (Rp)</label>
              <input
                type="text"
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
                placeholder="e.g., 20000"
              />
            </div>
          </div>

          {error && <div className="error-msg" style={{ marginBottom: "12px" }}>{error}</div>}
          {success && <div style={{ background: "#E8F5E9", border: "1px solid #C8E6C9", borderRadius: "12px", padding: "12px 14px", fontSize: "12px", color: "#2E7D32", marginBottom: "12px" }}>{success}</div>}

          <button type="submit" className="btn-primary">
            Tambah Preferensi
          </button>
        </form>
      </div>

      {/* Preferences list */}
      <div style={{ marginBottom: "24px" }}>
        <h2 className="screen-header" style={{ paddingTop: 0, paddingBottom: "12px", margin: 0 }}>Daftar Preferensi ({preferences.length})</h2>
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px", color: "var(--muted)" }}>Memuat...</div>
        ) : preferences.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px", color: "var(--muted)" }}>Belum ada preferensi</div>
        ) : (
          preferences.map((pref) => (
            <div key={pref.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>{pref.nama}</div>
                <div style={{ fontSize: "12px", color: "var(--muted)" }}>
                  {pref.kategori}
                  {pref.kalori ? ` • ${pref.kalori} kcal` : ""}
                  {pref.estimasi_harga ? ` • Rp${pref.estimasi_harga}` : ""}
                </div>
              </div>
              <button
                onClick={() => handleDeletePreference(pref.id)}
                className="btn-danger"
                style={{ marginLeft: "12px" }}
              >
                Hapus
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
