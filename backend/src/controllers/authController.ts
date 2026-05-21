import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User.js";
import { error } from "node:console";

const cookieOptions = {
  httpOnly: true,
  //   secure: true
  sameSite: "strict" as const,
  maxAge: 24 * 60 * 60 * 1000, // 1 giorno
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, surname, email, password, confirmPassword } = req.body;

    if (!name || !surname || !email || !password || !confirmPassword) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ error: "Passwords dont match" });
      return;
    }

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      res.status(409).json({ error: "Email already in use" });
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await UserModel.create({
      name,
      surname,
      email,
      password: hashedPassword,
    });
    res.status(201).json({ message: "Sign in completed successfully" });
  } catch (error) {
    console.error("Error to sign in:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and Password required" });
      return;
    }

    const user = await UserModel.findByEmail(email);
    if (!user || !user.password) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const secret = process.env.JWT_SECRET || "not_secure_secret";
    const token = jwt.sign({ id: user.id, role: user.role }, secret, {
      expiresIn: "1d",
    });

    res.cookie("jwt", token, cookieOptions);

    res.status(200).json({
      message: "Login done",
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const logout = (req: Request, res: Response): void => {
  res.clearCookie("jwt", cookieOptions);
  res.status(200).json({ message: "Logout successfully" });
};
