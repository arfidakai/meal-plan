import { neon } from "@neondatabase/serverless";

export function getDb() {
  return neon(process.env.DATABASE_URL!);
}

export async function initDb() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS profiles (
      session_id TEXT PRIMARY KEY,
      nama TEXT NOT NULL DEFAULT '',
      bb TEXT DEFAULT '',
      tb TEXT DEFAULT '',
      likes TEXT[] DEFAULT '{}',
      dislikes TEXT[] DEFAULT '{}',
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS challenges (
      id BIGINT NOT NULL,
      session_id TEXT NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      target TEXT DEFAULT '',
      duration INTEGER NOT NULL,
      checkins BOOLEAN[] DEFAULT '{}',
      created_at BIGINT NOT NULL,
      PRIMARY KEY (session_id, id)
    )
  `;
}
