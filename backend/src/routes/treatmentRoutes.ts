import { Router } from "express";
import { getAllTreatments, createTreatment, toggleTreatmentStatus } from "../controllers/treatmentController.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authenticateJWT);

router.get("/", getAllTreatments);
router.post("/", createTreatment);
router.patch("/:id/status", toggleTreatmentStatus);

export default router;
