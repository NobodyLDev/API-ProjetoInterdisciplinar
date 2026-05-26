import { materialsCollection } from "../database/database";

export const materialRepository = {

  async findAll() {
    return await materialsCollection.find().toArray();
  },

  async create(material: any) {
    return await materialsCollection.insertOne(material);
  },

};