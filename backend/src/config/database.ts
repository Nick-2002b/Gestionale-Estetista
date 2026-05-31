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

  const clientsCount = await db.get("SELECT COUNT(*) as count FROM clients");
  if (clientsCount.count === 0) {
    await db.exec(`
      INSERT INTO clients (name, surname, sex, birth_date, phone, email, notes) VALUES
      ('Giulia', 'Rossi', 'F', '1992-04-10', '+39 333 1111111', 'giulia.rossi@example.com', NULL),
      ('Sofia', 'Conti', 'F', '1989-09-23', '+39 333 2222222', 'sofia.conti@example.com', NULL),
      ('Luca', 'Ferri', 'M', '1987-01-15', '+39 333 3333333', 'luca.ferri@example.com', NULL);
    `);
  }
  // TABELLA TRATTAMENTI
  await db.exec(`
    CREATE TABLE IF NOT EXISTS treatments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category_id INTEGER NOT NULL,
      duration INTEGER NOT NULL,
      price REAL,
      description TEXT,
      is_active INTEGER DEFAULT 1,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
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

  // Tabella Ponte (Relazione Molti-a-Molti tra Appuntamenti e Trattamenti
  await db.exec(`
    CREATE TABLE IF NOT EXISTS appointment_treatments (
      appointment_id INTEGER NOT NULL,
      treatment_id INTEGER NOT NULL,
      PRIMARY KEY (appointment_id, treatment_id),
      FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
      FOREIGN KEY (treatment_id) REFERENCES treatments(id) ON DELETE CASCADE
    );
  `);
  // TABELLA CATEGORIE
  await db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
    );`);

  const treatmentsCount = await db.get("SELECT COUNT(*) as count FROM categories");
  if (treatmentsCount.count === 0) {
    await db.exec(`INSERT INTO categories (name) VALUES ('Mani'), ('Viso'), ('Corpo');`);
    await db.exec(`
      INSERT INTO treatments (name, category_id, description, duration, price, is_active) VALUES 
      ('Manicure Classica', 1, 'Trattamento completo unghie naturali.', 45, 25.00, 1),
      ('Massaggio', 3, '', 15, 55.00, 1),
      ('Ceretta', 3, 'Ceretta busto', 60, 80.00, 1),
      ('Baffi', 2, 'ceretta baffi', 10, 55.00, 1);
    `);
  }
  console.log("Database Created");
};
