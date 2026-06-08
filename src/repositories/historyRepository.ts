import { ObjectId } from "mongodb";
import { historyCollection } from "../database/database";
import { History } from "../models/history";
import { transformMongoData } from "../utils/mongoDataTransform";

export class HistoryRepository {

  async create(data: History) {
    const result = await historyCollection.insertOne({
      ...data,
      createdAt: new Date(),
    });

    return {
      id: result.insertedId.toString(),
      ...data,
    };
  }

  async findAll() {
    const history = await historyCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    return transformMongoData(history);
  }

  async findById(id: string) {
    if (!ObjectId.isValid(id)) throw new Error("ID inválido");
    const item = await historyCollection.findOne({ _id: new ObjectId(id) });
    return transformMongoData(item);
  }

  async delete(id: string) {
    if (!ObjectId.isValid(id)) throw new Error("ID inválido");
    return await historyCollection.deleteOne({ _id: new ObjectId(id) });
  }

}