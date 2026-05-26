import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { initDb } from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import treatmentRoutes from "./routes/treatmentRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";

const app = express();
const port: number = 3000;

app.use(express.json()); //permette di leggere il body in formato json
app.use(cookieParser());
app.use(
  cors({
    origin: true,
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

app.use("/api/auth", authRoutes);
app.use("/api/treatments", treatmentRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/clients", clientRoutes);

app.listen(port, "0.0.0.0", () => {
  console.log(`http://localhost:${port}`);
});
