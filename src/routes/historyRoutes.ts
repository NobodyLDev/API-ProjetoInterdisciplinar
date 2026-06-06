import { Router, Request, Response } from "express";
import { HistoryController } from "../controllers/historyController";

const router = Router();
const historyController = new HistoryController();

router.get("/", (req: Request, res: Response) => historyController.findAll(req, res));
router.get("/:id", (req: Request, res: Response) => historyController.findById(req, res));
router.post("/", (req: Request, res: Response) => historyController.create(req, res));
router.delete("/:id", (req: Request, res: Response) => historyController.delete(req, res));

export default router;