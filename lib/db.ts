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
  await sql`
    CREATE TABLE IF NOT EXISTS food_preferences (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      nama TEXT NOT NULL,
      kategori TEXT NOT NULL,
      kalori TEXT,
      estimasi_harga TEXT,
      created_at BIGINT NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS food_stocks (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      nama TEXT NOT NULL,
      kategori TEXT NOT NULL,
      jumlah NUMERIC NOT NULL,
      satuan TEXT NOT NULL,
      estimasi_harga TEXT,
      tanggal_beli BIGINT,
      tanggal_expired BIGINT,
      catatan TEXT,
      created_at BIGINT NOT NULL
    )
  `;
}
