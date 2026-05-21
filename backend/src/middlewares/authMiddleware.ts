import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: number;
  role: string;
  iat: number;
  exp: number;
}

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.cookies.jwt;

  if (!token) {
    res.status(401).json({ error: "Access denied. Authentication required." });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || "not_secure_secret";
    const decoded = jwt.verify(token, secret) as DecodedToken;

    // Agganciamo i dati dell'utente alla richiesta, così i controller successivi vi avranno accesso
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next(); // passiamo i dati al prossimo controller o middleware
  } catch (error) {
    console.error("Error validating JWT:", error);
    res.status(403).json({ error: "Invalid or expired token." });
  }
};
