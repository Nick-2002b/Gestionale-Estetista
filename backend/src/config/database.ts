import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

let dbInstance: Database<sqlite3.Database, sqlite3.Statement> | null = null;

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

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

  // TABELLA UTENTI
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    `);
  // TABELLA CLIENTI
  await db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      surname TEXT NOT NULL,
      sex TEXT CHECK(sex IN ('M', 'F', 'Altro')),
      birth_date DATE NOT NULL,
      phone TEXT,
      email TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  // TABELLA TRATTAMENTI
  await db.exec(`
    CREATE TABLE IF NOT EXISTS treatments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      duration INTEGER NOT NULL,
      price REAL
      description TEXT,
      is_active INTEGER DEFAULT 1,
    );
  `);

  // TABELLA APPUNTAMENTI
  await db.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      date TEXT NOT NULL, 
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      notes TEXT,
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
    );
  `);

  // Tabella Ponte (Relazione Molti-a-Molti tra Appuntamenti e Trattamenti)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS appointment_treatments (
      appointment_id INTEGER NOT NULL,
      treatment_id INTEGER NOT NULL,
      PRIMARY KEY (appointment_id, treatment_id),
      FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
      FOREIGN KEY (treatment_id) REFERENCES treatments(id) ON DELETE CASCADE
    );
  `);
  console.log("Database Created");
};
