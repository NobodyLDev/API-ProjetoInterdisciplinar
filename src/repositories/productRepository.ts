import { productsCollection, materialsCollection } from "../database/database";

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

    async validateMaterials(materiais: { materialId: number; quantidade: number }[]) {
    for (const m of materiais) {

      if (!m.materialId || typeof m.quantidade !== "number" || m.quantidade <= 0) {
        throw new Error(
          `Material inválido: materialId e quantidade (> 0) são obrigatórios`
        );
      }

      const found = await materialsCollection.findOne({ id: m.materialId });

      if (!found) {
        throw new Error(
          `Material com id ${m.materialId} não encontrado`
        );
      }

    }
  },

};