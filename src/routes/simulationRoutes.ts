import { Router } from "express";
import { simulationController } from "../controllers/simulationControllers";

const router = Router();

router.post("/", simulationController.simulate);

export default router;