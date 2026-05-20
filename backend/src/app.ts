import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { initDb } from "./config/database.js";

const app = express();
const port: number = 3000;

app.use(express.json()); //permette di leggere il body in formato json
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // in questo modo il frontend puo inviare cookie al backend
  }),
);

initDb().catch((err) => {
  console.error("Error initialzing Database:", err);
  process.exit(1);
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Backend is working" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`http://localhost:${port}`);
});
