import { HistoryService } from "../services/historyService";

const historyService = new HistoryService();

export class HistoryController {
  async findAll() {
    try {
      const histories = await historyService.findAll();

      return {
        status: 200,
        data: histories,
      };
    } catch (error) {
      return {
        status: 500,
        message: "Erro interno do servidor",
      };
    }
  }
}