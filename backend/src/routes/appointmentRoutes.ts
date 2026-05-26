import { Router } from "express";
import { createAppointment, getAppointments } from "../controllers/appointmentController.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";

const router = Router();
router.use(authenticateJWT);

router.get("/", getAppointments);
router.post("/", createAppointment);

export default router;
