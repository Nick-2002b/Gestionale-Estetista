import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import path from "path";

let dbInstance: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export const getDb = async () => {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await open({
    filename: path.join(__dirname, "../../database.sqlite"),
    driver: sqlite3.Database,
  });

  return dbInstance;
};

export const initDb = async () => {
  const db = await getDb();

  // abilita l'utilizzo delle foreign key
  await db.exec("PRAGMA foreign_keys = ON;");

  // creazione tabella utenti
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    create_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    `);
  console.log("Db Creato");
};
