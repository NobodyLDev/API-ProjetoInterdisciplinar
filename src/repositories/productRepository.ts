import { productsCollection, materialsCollection } from "../database";

export const productRepository = {

  async findAll() {
    return await productsCollection.find().toArray();
  },

  async findById(id: number) {
    return await productsCollection.findOne({ id });
  },

  async create(product: any) {
    return await productsCollection.insertOne(product);
  },

  async update(id: number, data: any) {
    return await productsCollection.updateOne({ id }, { $set: data });
  },

  async delete(id: number) {
    return await productsCollection.deleteOne({ id });
  },

};