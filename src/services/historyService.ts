import { HistoryRepository } from "../repositories/historyRepository";
import { validateHistory } from "../schemas/historySchema";

const historyRepository = new HistoryRepository();

export class HistoryService {

  async create(action: string, entity: string, description: string) {
    const historyData = { action, entity, description };

    validateHistory(historyData);

    return await historyRepository.create(historyData);
  }

  async findAll() {
    return await historyRepository.findAll();
  }

  async findById(id: string) {
    const history = await historyRepository.findById(id);

    if (!history) {
      throw new Error("Histórico não encontrado");
    }

    return history;
  }

  async delete(id: string) {
    const existing = await historyRepository.findById(id);

    if (!existing) {
      throw new Error("Histórico não encontrado");
    }

    await historyRepository.delete(id);

    return { message: "Histórico removido com sucesso" };
  }

}