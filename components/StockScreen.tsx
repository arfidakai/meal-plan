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
  const [success, setSuccess] = useState("");
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
    setSuccess("");

    if (!nama.trim() || !jumlah.trim()) {
      setError("Nama dan jumlah tidak boleh kosong");
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
      setNama("");
      setKategori("protein");
      setJumlah("");
      setSatuan("pcs");
      setHarga("");
      setTglExpired("");
      setCatatan("");
      setSuccess("Stock ditambahkan!");
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      setError("Gagal menambahkan stock");
    }
  };

  const handleDeleteStock = async (id: string | undefined) => {
    if (!id) return;

    try {
      const res = await fetch("/api/stock", {
        method: "DELETE",
        headers: { "x-session-id": sessionId },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to delete stock");
      setStocks(stocks.filter((s) => s.id !== id));
      setSuccess("Stock dihapus!");
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
      setSuccess("Stock diperbarui!");
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
    <div className="screen" style={{ paddingTop: "20px" }}>
      <div className="screen-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px" }}>
        <h1 style={{ fontSize: "24px", margin: 0 }}>Stock Makanan</h1>
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

      <div style={{ marginBottom: "18px" }}>
        <button type="button" className="btn-primary" onClick={() => setShowAddModal(true)}>
          + Tambah Stock
        </button>
      </div>

      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(42, 42, 42, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: "20px",
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="card"
            style={{
              width: "100%",
              maxWidth: "520px",
              marginBottom: 0,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div className="card-label" style={{ marginBottom: 0 }}>Tambah Stock</div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "var(--muted)",
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStock}>
              <div className="input-group" style={{ marginBottom: "12px" }}>
                <label>Nama Makanan*</label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="e.g., Telur Ayam"
                />
              </div>

              <div style={{ marginBottom: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="input-group">
                  <label>Kategori</label>
                  <select value={kategori} onChange={(e) => setKategori(e.target.value)}>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Jumlah*</label>
                  <input
                    type="number"
                    step="0.1"
                    value={jumlah}
                    onChange={(e) => setJumlah(e.target.value)}
                    placeholder="e.g., 12"
                  />
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: "12px" }}>
                <label>Satuan*</label>
                <select value={satuan} onChange={(e) => setSatuan(e.target.value)}>
                  {UNITS.map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div className="input-group">
                  <label>Harga (Rp)</label>
                  <input
                    type="text"
                    value={harga}
                    onChange={(e) => setHarga(e.target.value)}
                    placeholder="e.g., 30000"
                  />
                </div>
                <div className="input-group">
                  <label>Tanggal Expired</label>
                  <input
                    type="date"
                    value={tglExpired}
                    onChange={(e) => setTglExpired(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: "12px" }}>
                <label>Catatan</label>
                <textarea
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="e.g., Disimpan di kulkas"
                  style={{
                    minHeight: "60px",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              {error && <div className="error-msg" style={{ marginBottom: "12px" }}>{error}</div>}
              {success && <div style={{ background: "#E8F5E9", border: "1px solid #C8E6C9", borderRadius: "12px", padding: "12px 14px", fontSize: "12px", color: "#2E7D32", marginBottom: "12px" }}>{success}</div>}

              <button type="submit" className="btn-primary">
                Simpan Stock
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Stock list */}
      <div style={{ marginBottom: "24px" }}>
        <h2 className="screen-header" style={{ paddingTop: 0, paddingBottom: "12px", margin: 0 }}>Daftar Stock ({stocks.length})</h2>
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px", color: "var(--muted)" }}>Memuat...</div>
        ) : stocks.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px", color: "var(--muted)" }}>Belum ada stock</div>
        ) : (
          stocks.map((stock) => (
            <div
              key={stock.id}
              className="card"
              style={{
                padding: "14px 16px",
                background: isExpired(stock.tanggal_expired) ? "var(--red-light)" : "var(--surface)",
                borderColor: isExpired(stock.tanggal_expired) ? "var(--red)" : "var(--border)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>
                    {stock.nama}
                    {isExpired(stock.tanggal_expired) && (
                      <span style={{ marginLeft: "8px", color: "var(--red)", fontSize: "12px" }}>🔴 EXPIRED</span>
                    )}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--muted)" }}>
                    {stock.kategori}
                    {stock.estimasi_harga ? ` • Rp${stock.estimasi_harga}` : ""}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteStock(stock.id)}
                  className="btn-danger"
                >
                  Hapus
                </button>
              </div>

              {editingId === stock.id ? (
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="number"
                    step="0.1"
                    value={editJumlah}
                    onChange={(e) => setEditJumlah(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      border: "1.5px solid var(--border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontFamily: "inherit",
                    }}
                  />
                  <button
                    onClick={() => handleUpdateQuantity(stock.id)}
                    style={{
                      background: "var(--sage-dark)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    style={{
                      background: "var(--muted)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => {
                    setEditingId(stock.id || null);
                    setEditJumlah(stock.jumlah.toString());
                  }}
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: "8px",
                    background: "var(--sage-light)",
                    borderRadius: "8px",
                    display: "inline-block",
                    color: "var(--sage-dark)",
                  }}
                >
                  {stock.jumlah} {stock.satuan}
                </div>
              )}

              {stock.catatan && (
                <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "8px", fontStyle: "italic" }}>💬 {stock.catatan}</div>
              )}
              {stock.tanggal_expired && (
                <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>
                  📅 Expired: {new Date(stock.tanggal_expired).toLocaleDateString("id-ID")}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
