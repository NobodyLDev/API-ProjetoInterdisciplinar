import { ObjectId } from "mongodb";
import { historyCollection } from "../database/database";
import { History } from "../models/history";

export class HistoryRepository {

  async create(data: History) {
    const result = await historyCollection.insertOne({
      ...data,
      createdAt: new Date(),
    });

    return {
      _id: result.insertedId,
      ...data,
    };
  }

  async findAll() {
    return await historyCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();
  }

  async findById(id: string) {
    if (!ObjectId.isValid(id)) throw new Error("ID inválido");
    return await historyCollection.findOne({ _id: new ObjectId(id) });
  }

  async delete(id: string) {
    if (!ObjectId.isValid(id)) throw new Error("ID inválido");
    return await historyCollection.deleteOne({ _id: new ObjectId(id) });
  }

}