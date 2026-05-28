import { getDb } from "../config/database.js";
import User from "../models/User.js";

export const UserModel = {
  async findByEmail(email: string): Promise<User | undefined> {
    const db = await getDb();
    return db.get<User>("SELECT * FROM users WHERE email = ?", [email]);
  },

  async findById(id: number): Promise<User | undefined> {
    const db = await getDb();
    return db.get<User>("SELECT id, name, surname, email, role, created_at FROM users WHERE id = ?", [id]);
  },

  async create(
    user: Omit<User, "id" | "created_at">, // Omit crea l'oggetto user senza chiedere di popolare id e created_at
  ): Promise<number | undefined> {
    const db = await getDb();
    const result = await db.run("INSERT INTO users (name, surname, email, password, role) VALUES (?, ?, ?, ?, ?)", [user.name, user.surname, user.email, user.password, user.role || "admin"]);
    return result.lastID;
  },
};
