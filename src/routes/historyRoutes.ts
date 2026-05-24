import { HistoryController } from "../controllers/historyController";

const historyController = new HistoryController();

export async function getHistory() {
  return await historyController.findAll();
}