import { Request, Response } from "express";
import { getDb } from "../config/database.js";

export const createAppointment = async (req: Request, res: Response): Promise<void> => {
  const db = await getDb();

  try {
    const { clientId, treatments, date, startTime, endTime, notes } = req.body;

    if (!clientId || !treatments || treatments.length === 0 || !date || !startTime || !endTime) {
      res.status(400).json({ error: "Dati obbligatori mancanti" });
      return;
    }

    await db.exec("BEGIN TRANSACTION");

    const insertAppointment = await db.run(
      `INSERT INTO appointments (client_id, date, start_time, end_time, notes) 
       VALUES (?, ?, ?, ?, ?)`,
      [clientId, date, startTime, endTime, notes || null],
    );

    const newAppointmentId = insertAppointment.lastID;

    // Inseriamo ogni trattamento nella tabella ponte
    for (const treatmentId of treatments) {
      await db.run(`INSERT INTO appointment_treatments (appointment_id, treatment_id) VALUES (?, ?)`, [newAppointmentId, treatmentId]);
    }

    await db.exec("COMMIT");

    res.status(201).json({
      message: "Appuntamento creato",
      appointment: {
        id: newAppointmentId,
        startTime,
        endTime,
      },
    });
  } catch (error) {
    await db.exec("ROLLBACK");
    console.error("Errore creazione appuntamento:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const getAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb();

    // Recuperiamo tutti gli appuntamenti uniti ai dati base del cliente
    const appointments = await db.all(`
      SELECT 
        a.id, a.client_id, a.date, a.start_time, a.end_time, a.notes,
        c.name as client_name, c.surname as client_surname
      FROM appointments a
      JOIN clients c ON a.client_id = c.id
    `);

    // Per ogni appuntamento, recuperiamo la lista dei nomi dei trattamenti e
    // li assegnamo alla lista di trattamenti per quel appuntamento
    for (const appt of appointments) {
      const treatments = await db.all(
        `
        SELECT t.id, t.name, t.category_id, t.color, t.duration, t.price
        FROM treatments t
        JOIN appointment_treatments at ON t.id = at.treatment_id
        WHERE at.appointment_id = ?
      `,
        [appt.id],
      );

      appt.treatments = treatments;
      appt.total_duration = treatments.reduce((total, treatment) => total + Number(treatment.duration || 0), 0);
      appt.total_price = treatments.reduce((total, treatment) => total + Number(treatment.price || 0), 0);
    }

    res.status(200).json({ appointments });
  } catch (error) {
    console.error("Errore nel recupero appuntamenti:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const deleteAppointment = async (req: Request, res: Response): Promise<void> => {
  const db = await getDb();
  const appointmentId = req.params.id;

  try {
    const result = await db.run("DELETE FROM appointments WHERE id = ?", [appointmentId]);

    if (result.changes === 0) {
      res.status(404).json({ error: "Appuntamento non trovato" });
      return;
    }

    res.status(200).json({ message: "Appuntamento eliminato con successo" });
  } catch (error) {
    console.error("Errore durante l'eliminazione dell'appuntamento:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const editAppointment = async (req: Request, res: Response): Promise<void> => {
  const db = await getDb();
  const appointmentId = req.params.id;
  try {
    const { clientId, treatments, date, startTime, endTime, notes } = req.body;

    if (!clientId || !treatments || treatments.length === 0 || !date || !startTime) {
      res.status(400).json({ error: "Dati obbligatori mancanti" });
      return;
    }
    await db.exec("BEGIN TRANSACTION");
    await db.run(
      `
    UPDATE appointments SET client_id = ?, date = ?, start_time = ?,
    end_time = ?, notes = ?
    WHERE id = ?`,
      [clientId, date, startTime, endTime, notes || null, appointmentId],
    );
    await db.run(`DELETE FROM appointment_treatments WHERE appointment_id = ?`, [appointmentId]);
    for (const treatmentId of treatments) {
      await db.run(`INSERT INTO appointment_treatments (appointment_id, treatment_id) VALUES (?, ?)`, [appointmentId, treatmentId]);
    }
    await db.exec("COMMIT");
    res.status(200).json({ message: "Appuntamento aggiornato" });
  } catch (error) {
    await db.exec("ROLLBACK");
    res.status(500).json({ error: "Server Error" });
  }
};
