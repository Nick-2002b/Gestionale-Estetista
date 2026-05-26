import { Router } from "express";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { createClient, getAllClients } from "../controllers/clientController.js";

const router = Router();

router.use(authenticateJWT);

router.get("/", getAllClients);
router.post("/", createClient);

export default router;
