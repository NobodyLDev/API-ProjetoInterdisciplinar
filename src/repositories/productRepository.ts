import { productsCollection, materialsCollection } from "../database";

export const productRepository = {

  async findAll() {
    return await productsCollection.find().toArray();
  },

  async findById(id: number) {
    return await productsCollection.findOne({ id });
  },

}