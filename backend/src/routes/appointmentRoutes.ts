import { Router } from "express";
import { createAppointment, getAppointments, deleteAppointment, editAppointment } from "../controllers/appointmentController.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";

const router = Router();
router.use(authenticateJWT);

router.get("/", getAppointments);
router.post("/", createAppointment);
router.delete("/:id", deleteAppointment);
router.post("/:id", editAppointment);

export default router;
