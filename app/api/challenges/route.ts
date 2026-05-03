import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  const sessionId = req.headers.get("x-session-id");
  if (!sessionId) return NextResponse.json([]);

  const sql = getDb();
  const rows = await sql`
    SELECT * FROM challenges WHERE session_id = ${sessionId} ORDER BY created_at DESC
  `;

  return NextResponse.json(
    rows.map((r: Record<string, unknown>) => ({
      id: Number(r.id),
      title: r.title,
      type: r.type,
      target: r.target,
      duration: r.duration,
      checkins: r.checkins,
      createdAt: Number(r.created_at),
    }))
  );
}

export async function POST(req: NextRequest) {
  const sessionId = req.headers.get("x-session-id");
  if (!sessionId) return NextResponse.json({ error: "No session" }, { status: 400 });

  const sql = getDb();
  const { id, title, type, target, duration, checkins, createdAt } = await req.json();

  await sql`
    INSERT INTO challenges (id, session_id, title, type, target, duration, checkins, created_at)
    VALUES (${id}, ${sessionId}, ${title}, ${type}, ${target ?? ""}, ${duration}, ${checkins}, ${createdAt})
  `;

  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  const sessionId = req.headers.get("x-session-id");
  if (!sessionId) return NextResponse.json({ error: "No session" }, { status: 400 });

  const sql = getDb();
  const { id, checkins } = await req.json();

  await sql`
    UPDATE challenges SET checkins = ${checkins} WHERE session_id = ${sessionId} AND id = ${id}
  `;

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const sessionId = req.headers.get("x-session-id");
  if (!sessionId) return NextResponse.json({ error: "No session" }, { status: 400 });

  const sql = getDb();
  const { id } = await req.json();

  await sql`
    DELETE FROM challenges WHERE session_id = ${sessionId} AND id = ${id}
  `;

  return NextResponse.json({ ok: true });
}
