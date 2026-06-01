import { getDb } from "@/lib/db";
import { FoodPreference } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const sessionId = request.headers.get("x-session-id");
  if (!sessionId) return NextResponse.json({ error: "No session" }, { status: 400 });

  const sql = getDb();
  try {
    const prefs = await sql`
      SELECT id, nama, kategori, kalori, estimasi_harga, created_at
      FROM food_preferences
      WHERE session_id = ${sessionId}
      ORDER BY created_at DESC
    `;
    return NextResponse.json(prefs);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const sessionId = request.headers.get("x-session-id");
  if (!sessionId) return NextResponse.json({ error: "No session" }, { status: 400 });

  const { nama, kategori, kalori, estimasi_harga } = await request.json();
  if (!nama || !kategori) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const sql = getDb();
  const id = crypto.randomUUID();
  const createdAt = Date.now();

  try {
    await sql`
      INSERT INTO food_preferences (id, session_id, nama, kategori, kalori, estimasi_harga, created_at)
      VALUES (${id}, ${sessionId}, ${nama}, ${kategori}, ${kalori || null}, ${estimasi_harga || null}, ${createdAt})
    `;
    return NextResponse.json({ id, nama, kategori, kalori, estimasi_harga, createdAt });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to add preference" }, { status: 500 });
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
      DELETE FROM food_preferences
      WHERE id = ${id} AND session_id = ${sessionId}
    `;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete preference" }, { status: 500 });
  }
}
