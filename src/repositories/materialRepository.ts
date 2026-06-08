import { ObjectId } from "mongodb";
import { materialsCollection } from "../database/database";
import { transformMongoData } from "../utils/mongoDataTransform";

export const materialRepository = {

  async findAll() {
    const materials = await materialsCollection.find().toArray();
    return transformMongoData(materials);
  },

  async findById(id: string) {
    if (!ObjectId.isValid(id)) throw new Error("ID inválido");
    const material = await materialsCollection.findOne({ _id: new ObjectId(id) });
    return transformMongoData(material);
  },

  async create(material: any) {
    return await materialsCollection.insertOne(material);
  },

  async update(id: string, data: any) {
    if (!ObjectId.isValid(id)) throw new Error("ID inválido");
    return await materialsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );
  },

  async delete(id: string) {
    if (!ObjectId.isValid(id)) throw new Error("ID inválido");
    return await materialsCollection.deleteOne({ _id: new ObjectId(id) });
  },

};