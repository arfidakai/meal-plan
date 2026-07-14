"use client";

import { useState, useEffect } from "react";
import { FoodStock } from "@/lib/types";

interface StockScreenProps {
  sessionId: string;
  onBack: () => void;
}

const CATEGORIES = ["protein", "sayur", "karbo", "buah", "snack", "minuman", "lainnya"];
const UNITS = ["pcs", "kg", "gram", "liter", "ml", "bungkus", "kaleng", "botol"];

export function StockScreen({ sessionId, onBack }: StockScreenProps) {
  const [stocks, setStocks] = useState<FoodStock[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("protein");
  const [jumlah, setJumlah] = useState("");
  const [satuan, setSatuan] = useState("pcs");
  const [harga, setHarga] = useState("");
  const [tglExpired, setTglExpired] = useState("");
  const [catatan, setCatatan] = useState("");
  
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editJumlah, setEditJumlah] = useState("");

  useEffect(() => {
    loadStocks();
  }, []);

  const loadStocks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stock", {
        headers: { "x-session-id": sessionId },
      });
      if (!res.ok) throw new Error("Failed to load stocks");
      const data = await res.json();
      setStocks(data);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat stock makanan");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nama.trim() || !jumlah.trim()) {
      setError("Nama dan jumlah wajib diisi!");
      return;
    }

    try {
      const res = await fetch("/api/stock", {
        method: "POST",
        headers: { "x-session-id": sessionId },
        body: JSON.stringify({
          nama: nama.trim(),
          kategori,
          jumlah: parseFloat(jumlah),
          satuan,
          estimasi_harga: harga || undefined,
          tanggal_expired: tglExpired ? new Date(tglExpired).getTime() : undefined,
          catatan: catatan || undefined,
        }),
      });

      if (!res.ok) throw new Error("Failed to add stock");
      const newStock = await res.json();
      setStocks([newStock, ...stocks]);
      
      setNama(""); setKategori("protein"); setJumlah(""); setSatuan("pcs"); 
      setHarga(""); setTglExpired(""); setCatatan("");
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      setError("Gagal menambahkan stock");
    }
  };

  const handleDeleteStock = async (id: string | undefined) => {
    if (!id || !confirm("Yakin ingin menghapus item ini?")) return;

    try {
      const res = await fetch("/api/stock", {
        method: "DELETE",
        headers: { "x-session-id": sessionId },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to delete stock");
      setStocks(stocks.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      setError("Gagal menghapus stock");
    }
  };

  const handleUpdateQuantity = async (id: string | undefined) => {
    if (!id || !editJumlah) return;

    try {
      const res = await fetch("/api/stock", {
        method: "PUT",
        headers: { "x-session-id": sessionId },
        body: JSON.stringify({ id, jumlah: parseFloat(editJumlah) }),
      });

      if (!res.ok) throw new Error("Failed to update stock");
      setStocks(
        stocks.map((s) =>
          s.id === id ? { ...s, jumlah: parseFloat(editJumlah) } : s
        )
      );
      setEditingId(null);
      setEditJumlah("");
    } catch (err) {
      console.error(err);
      setError("Gagal memperbarui stock");
    }
  };

  const isExpired = (expiryTime: number | undefined) => {
    if (!expiryTime) return false;
    return expiryTime < Date.now();
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "24px 16px", fontFamily: "system-ui, sans-serif" }}>
      {/* Header tanpa tombol close */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", margin: "0 0 4px 0", color: "#1f2937" }}>
          Stock Makanan
        </h1>
        <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
          Kelola persediaan bahan makananmu
        </p>
      </div>

      <button
        onClick={() => setShowAddModal(true)}
        style={{
          width: "100%", background: "#4e7251", color: "white", padding: "14px",
          borderRadius: "12px", border: "none", fontSize: "16px", fontWeight: "600",
          cursor: "pointer", marginBottom: "24px", display: "flex", justifyContent: "center",
          alignItems: "center", gap: "8px", boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.2)"
        }}
      >
        <span>+</span> Tambah Stock Baru
      </button>

      {/* Modal Add Stock tetap ada untuk navigasi tambah */}
      {showAddModal && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(17, 24, 39, 0.6)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "20px",
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              background: "white", width: "100%", maxWidth: "480px", borderRadius: "16px",
              padding: "24px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#111827" }}>Tambah Item</h2>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", fontSize: "20px", color: "#9ca3af", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>
            {/* Form content sama seperti sebelumnya */}
            <form onSubmit={handleAddStock} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>Nama Makanan *</label>
                <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Misal: Telur Ayam" style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>Kategori</label>
                  <select value={kategori} onChange={(e) => setKategori(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", background: "white" }}>
                    {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>Jumlah *</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input type="number" step="0.1" value={jumlah} onChange={(e) => setJumlah(e.target.value)} placeholder="0" style={{ width: "60%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px" }} />
                    <select value={satuan} onChange={(e) => setSatuan(e.target.value)} style={{ width: "40%", padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", background: "#f9fafb" }}>
                      {UNITS.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              {/* ... (bagian form sisanya tetap sama) */}
              <button type="submit" style={{ width: "100%", background: "#111827", color: "white", padding: "14px", borderRadius: "8px", border: "none", fontSize: "15px", fontWeight: "600", cursor: "pointer", marginTop: "8px" }}>Simpan Item</button>
            </form>
          </div>
        </div>
      )}

      {/* Daftar Stock tetap sama */}
    </div>
  );
}