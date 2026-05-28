import { Router } from "express";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { createClient, getAllClients, deleteClient, editClient } from "../controllers/clientController.js";

const router = Router();

router.use(authenticateJWT);

router.get("/", getAllClients);
router.post("/", createClient);
router.post("/", deleteClient);
router.post("/", editClient);

export default router;
