import { Request, Response } from "express";
import { getDb } from "../config/database.js";

export const getAllTreatments = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb();
    const treatments = await db.all(`
      SELECT t.*, c.name as category_name 
      FROM treatments t
      JOIN categories c ON t.category_id = c.id
      ORDER BY c.name ASC, t.name ASC
      `);

    res.status(200).json({ treatments });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb();
    const categories = await db.all(`
      SELECT c.*, COUNT(t.id) as treatments_count
      FROM categories c
      LEFT JOIN treatments t ON c.id = t.category_id
      GROUP BY c.id
      ORDER BY c.name ASC`);
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

export const editCategory = async (req: Request, res: Response): Promise<void> => {
  const db = await getDb();
  const categoryId = req.params.id;
  try {
    const name = req.body;
    if (!name) {
      res.status(400).json({ error: "Il nome della categoria è obbligatorio" });
      return;
    }
    const result = await db.run(`UPDATE categories SET name = ? WHERE id = ?`, [name, categoryId]);
    if (result.changes === 0) {
      res.status(404).json({ error: "Categoria non trovata" });
      return;
    }
    res.status(200).json({ message: "Categoria aggiornata con successo" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  const db = await getDb();
  const categoryId = req.params.id;

  try {
    const result = await db.run("DELETE FROM categories WHERE id = ?", [categoryId]);
    if (result.changes === 0) {
      res.status(404).json({ error: "Categoria non trovata" });
      return;
    }
    res.status(200).json({ message: "Categoria eliminata con successo" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const name = req.body.name;
    if (!name) {
      res.status(400).json({ error: "Nome categoria obbligatorio" });
      return;
    }
    const db = await getDb();
    const result = await db.run(`INSERT INTO categories (name) VALUES (?)`, [name]);
    res.status(201).json({ category: { id: result.lastID, name } });
  } catch (error) {
    res.status(500).json({ error: "Errore o categoria già esistente" });
  }
};

export const createTreatment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category_id, description, duration, price } = req.body;

    if (!name || !category_id || !duration) {
      res.status(400).json({ error: "Nome, categoria e durata sono campi obbligatori" });
      return;
    }

    const db = await getDb();
    const result = await db.run(
      `INSERT INTO treatments (name, category_id, description, duration, price, is_active) 
       VALUES (?, ?, ?, ?, ?, 1)`,
      [name, category_id, description || null, duration, price || null],
    );

    res.status(201).json({
      message: "Trattamento creato con successo",
      treatment: {
        id: result.lastID,
        name,
        category_id,
        description,
        duration,
        price,
        is_active: 1,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Errore interno del server" });
  }
};

// Attiva o Disattiva un trattamento
export const toggleTreatmentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (is_active !== 0 && is_active !== 1) {
      res.status(400).json({ error: "Il campo is_active deve essere (attivo) o (disattivo)" });
      return;
    }

    const db = await getDb();

    // Verifica che l'ID esista prima di aggiornarlo
    const existing = await db.get("SELECT id FROM treatments WHERE id = ?", [id]);
    if (!existing) {
      res.status(404).json({ error: "Trattamento non trovato" });
      return;
    }

    await db.run("UPDATE treatments SET is_active = ? WHERE id = ?", [is_active, id]);

    res.status(200).json({ message: "Stato del trattamento aggiornato con successo" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

export const editTreatment = async (req: Request, res: Response): Promise<void> => {
  const db = await getDb();
  const treatmentId = req.params.id;
  try {
    const { name, category_id, description, duration, price } = req.body;
    if (!name || !category_id || !duration) {
      res.status(400).json({ error: "Nome, categoria e durata sono obbligatori" });
      return;
    }
    const result = await db.run(
      `
      UPDATE treatments
      SET name = ?, category_id = ?, description = ?, duration = ?, price = ?
      WHERE id = ?
  `,
      [name, category_id, description || null, duration, price || null, treatmentId],
    );
    if (result.changes === 0) {
      res.status(404).json({ error: "Trattamento non trovato" });
      return;
    }
    res.status(200).json({ message: "Trattamento aggiornato con successo" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

export const deleteTreatment = async (req: Request, res: Response): Promise<void> => {
  const db = await getDb();
  const treatmentId = req.params.id;

  try {
    const result = await db.run("DELETE FROM treatments WHERE id = ?", [treatmentId]);
    if (result.changes === 0) {
      res.status(404).json({ error: "Trattamento non trovato" });
      return;
    }
    res.status(200).json({ message: "Trattamento eliminato con successo" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};
