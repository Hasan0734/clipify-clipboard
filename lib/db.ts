import Database from "@tauri-apps/plugin-sql";

// export const db = await Database.load("sqlite:clipboard.db");

// await db.execute(`
//       CREATE TABLE IF NOT EXISTS clipboards (
//         id TEXT PRIMARY KEY,
//         content TEXT,
//         type TEXT,
//         isFavorite INTEGER DEFAULT 0,
//         createdAt INTEGER
//       )
//     `);

let db: any;

export async function getDB() {
  if (!db) {
    db = await Database.load("sqlite:clipboard.db");

    await db.execute(`
      CREATE TABLE IF NOT EXISTS clipboards (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL,
        isFavorite INTEGER DEFAULT 0,
        createdAt INTEGER
      )
    `);

    await db.execute(`CREATE TABLE IF NOT EXISTS settings (
     key TEXT PRIMARY KEY, value TEXT
)`);
  }
  return db;
}
