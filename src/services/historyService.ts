import { HistoryRepository } from "../repositories/historyRepository";
import { validateHistory } from "../schemas/HistorySchema";

const historyRepository = new HistoryRepository();

export class HistoryService {
  async create(
    action: string,
    entity: string,
    description: string
  ) {
    const historyData = {
      action,
      entity,
      description,
    };

    validateHistory(historyData);

    return await historyRepository.create(historyData);
  }

  async findAll() {
    return await historyRepository.findAll();
  }
}