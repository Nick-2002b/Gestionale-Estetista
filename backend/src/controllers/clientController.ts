import { Request, Response } from "express";
import { getDb } from "../config/database.js";

export const getAllClients = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb();
    const clients = await db.all("SELECT * FROM clients ORDER BY surname ASC, name ASC");
    res.status(200).json({ clients });
  } catch (error) {
    console.error("Errore recupero clienti:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const createClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, surname, sex, birth_date, phone, email, notes } = req.body;

    if (!name || !surname || !birth_date) {
      res.status(400).json({ error: "Nome, cognome e data di nascita sono obbligatori" });
      return;
    }

    const db = await getDb();
    const result = await db.run(
      `INSERT INTO clients (name, surname, sex, birth_date, phone, email, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, surname, sex || null, birth_date, phone || null, email || null, notes || null],
    );

    res.status(201).json({
      message: "Cliente creato con successo",
      client: {
        id: result.lastID,
        name,
        surname,
        sex: sex || null,
        birth_date,
        phone: phone || null,
        email: email || null,
        notes: notes || null,
      },
    });
  } catch (error) {
    console.error("Errore creazione cliente:", error);
    res.status(500).json({ error: "Server Error" });
  }
};
