import { History } from "../models/history";

export class HistoryRepository {
  async create(data: History) {
    /*
      Implementação do banco ficará
      responsável pela equipe de infraestrutura.
    */

    return data;
  }

  async findAll() {
    /*
      Implementação futura do banco.
    */

    return [];
  }
}