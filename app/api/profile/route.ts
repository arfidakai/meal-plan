import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  const sessionId = req.headers.get("x-session-id");
  if (!sessionId) return NextResponse.json(null);

  const sql = getDb();
  const rows = await sql`SELECT * FROM profiles WHERE session_id = ${sessionId}`;
  if (rows.length === 0) return NextResponse.json(null);

  const row = rows[0];
  return NextResponse.json({
    nama: row.nama,
    bb: row.bb,
    tb: row.tb,
    likes: row.likes,
    dislikes: row.dislikes,
  });
}

export async function POST(req: NextRequest) {
  const sessionId = req.headers.get("x-session-id");
  if (!sessionId) return NextResponse.json({ error: "No session" }, { status: 400 });

  const sql = getDb();
  const { nama, bb, tb, likes, dislikes } = await req.json();

  await sql`
    INSERT INTO profiles (session_id, nama, bb, tb, likes, dislikes)
    VALUES (${sessionId}, ${nama}, ${bb}, ${tb}, ${likes}, ${dislikes})
    ON CONFLICT (session_id)
    DO UPDATE SET
      nama = EXCLUDED.nama,
      bb = EXCLUDED.bb,
      tb = EXCLUDED.tb,
      likes = EXCLUDED.likes,
      dislikes = EXCLUDED.dislikes,
      updated_at = NOW()
  `;

  return NextResponse.json({ ok: true });
}
