import { getDb } from "../config/database.js";

export default interface User {
  id?: number;
  username: string;
  password?: string;
  role?: string;
  created_at?: string;
}

export const UserModel = {
  async findByUsername(username: string): Promise<User | undefined> {
    const db = await getDb();
    return db.get<User>("SELECT * FROM users WHERE username = ?", [username]);
  },

  async findById(id: number): Promise<User | undefined> {
    const db = await getDb();
    return db.get<User>(
      "SELECT id, username, role, created_at FROM users WHERE id = ?",
      [id],
    );
  },

  async create(
    user: Omit<User, "id" | "created_at">, // Omit crea l'oggetto user senza chiedere di popolare id e created_at
  ): Promise<number | undefined> {
    const db = await getDb();
    const result = await db.run(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [user.username, user.password, user.role || "admin"],
    );
    return result.lastID;
  },
};
