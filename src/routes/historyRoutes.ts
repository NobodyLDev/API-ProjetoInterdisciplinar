import { Router, Request, Response } from "express";
import { HistoryController } from "../controllers/historyController";

const router = Router();
const historyController = new HistoryController();

router.get("/", async (req: Request, res: Response) => {
  const result = await historyController.findAll();
  const status = (result as any).status || 200;
  if ((result as any).data) return res.status(status).json((result as any).data);
  return res.status(status).json({ message: (result as any).message });
});

export default router;