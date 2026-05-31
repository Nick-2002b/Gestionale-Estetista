import { Router } from "express";
import { getAllTreatments, createTreatment, toggleTreatmentStatus, getCategories, createCategory, editTreatment, deleteTreatment } from "../controllers/treatmentController.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authenticateJWT);

router.get("/", getAllTreatments);
router.post("/", createTreatment);
router.post("/:id/status", toggleTreatmentStatus);
router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.post("/:id", editTreatment);
router.delete("/:id", deleteTreatment);

export default router;
