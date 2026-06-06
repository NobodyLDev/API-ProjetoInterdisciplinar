import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { HistoryService } from "../services/historyService";

const historyService = new HistoryService();

export class HistoryController {

  async create(req: Request, res: Response) {
    try {
      const { action, entity, description } = req.body;
      const history = await historyService.create(action, entity, description);
      return res.status(201).json(history);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const histories = await historyService.findAll();
      return res.json(histories);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Formato de ID inválido" });
      }

      const history = await historyService.findById(id);
      return res.json(history);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Formato de ID inválido" });
      }

      const result = await historyService.delete(id);
      return res.json(result);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

}