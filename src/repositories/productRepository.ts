import { ObjectId } from "mongodb";
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

  async getNextId() {
    const all = await productsCollection
      .find({}, { projection: { id: 1 } })
      .toArray();

    const ids = new Set<number>();

    for (const doc of all) {
      const v = (doc as any)?.id;
      const n = Number(v);

      if (!isNaN(n) && n > 0) {
        ids.add(n);
      }
    }

    let candidate = 1;

    while (ids.has(candidate)) {
      candidate++;
    }

    return candidate;
  },

  async update(id: number, data: any) {
    return await productsCollection.updateOne(
      { id },
      { $set: data }
    );
  },

  async delete(id: number) {
    return await productsCollection.deleteOne({ id });
  },

  async validateMaterials(
    materiais: { materialId: string; quantidade: number }[]
  ) {
    for (const m of materiais) {

      if (
        !m.materialId ||
        typeof m.quantidade !== "number" ||
        m.quantidade <= 0
      ) {
        throw new Error(
          "Material inválido: materialId e quantidade (> 0) são obrigatórios"
        );
      }

      if (!ObjectId.isValid(m.materialId)) {
        throw new Error(
          `ID de material inválido: ${m.materialId}`
        );
      }

      const found = await materialsCollection.findOne({
        _id: new ObjectId(m.materialId)
      });

      if (!found) {
        throw new Error(
          `Material com id ${m.materialId} não encontrado`
        );
      }
    }
  }

};