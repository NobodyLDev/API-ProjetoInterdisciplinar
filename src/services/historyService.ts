import { HistoryRepository } from "../repositories/historyRepository";

const historyRepository = new HistoryRepository();

export class HistoryService {
  async create(
    action: string,
    entity: string,
    description: string
  ) {
    return await historyRepository.create({
      action,
      entity,
      description,
    });
  }

  async findAll() {
    return await historyRepository.findAll();
  }
}