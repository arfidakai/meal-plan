import { getDb } from "@/lib/db";
import { FoodStock } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const sessionId = request.headers.get("x-session-id");
  if (!sessionId) return NextResponse.json({ error: "No session" }, { status: 400 });

  const sql = getDb();
  try {
    const stocks = await sql`
      SELECT id, nama, kategori, jumlah, satuan, estimasi_harga, tanggal_beli, tanggal_expired, catatan, created_at
      FROM food_stocks
      WHERE session_id = ${sessionId}
      ORDER BY created_at DESC
    `;
    return NextResponse.json(stocks);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch stocks" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const sessionId = request.headers.get("x-session-id");
  if (!sessionId) return NextResponse.json({ error: "No session" }, { status: 400 });

  const { nama, kategori, jumlah, satuan, estimasi_harga, tanggal_beli, tanggal_expired, catatan } = await request.json();
  if (!nama || !kategori || !jumlah || !satuan) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const sql = getDb();
  const id = crypto.randomUUID();
  const createdAt = Date.now();

  try {
    await sql`
      INSERT INTO food_stocks (id, session_id, nama, kategori, jumlah, satuan, estimasi_harga, tanggal_beli, tanggal_expired, catatan, created_at)
      VALUES (${id}, ${sessionId}, ${nama}, ${kategori}, ${jumlah}, ${satuan}, ${estimasi_harga || null}, ${tanggal_beli || null}, ${tanggal_expired || null}, ${catatan || null}, ${createdAt})
    `;
    return NextResponse.json({ id, nama, kategori, jumlah, satuan, estimasi_harga, tanggal_beli, tanggal_expired, catatan, createdAt });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to add stock" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const sessionId = request.headers.get("x-session-id");
  if (!sessionId) return NextResponse.json({ error: "No session" }, { status: 400 });

  const { id, jumlah } = await request.json();
  if (!id || jumlah === undefined) {
    return NextResponse.json({ error: "Missing id or jumlah" }, { status: 400 });
  }

  const sql = getDb();
  try {
    await sql`
      UPDATE food_stocks
      SET jumlah = ${jumlah}
      WHERE id = ${id} AND session_id = ${sessionId}
    `;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update stock" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const sessionId = request.headers.get("x-session-id");
  if (!sessionId) return NextResponse.json({ error: "No session" }, { status: 400 });

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const sql = getDb();
  try {
    await sql`
      DELETE FROM food_stocks
      WHERE id = ${id} AND session_id = ${sessionId}
    `;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete stock" }, { status: 500 });
  }
}
