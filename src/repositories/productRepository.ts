import { ObjectId } from "mongodb";
import { productsCollection, materialsCollection } from "../database/database";
import { transformMongoData } from "../utils/mongoDataTransform";

export const productRepository = {

  async findAll() {
    const products = await productsCollection.find().toArray();
    return transformMongoData(products);
  },

  async findById(id: string) {
    if (!ObjectId.isValid(id)) throw new Error("ID inválido");
    const product = await productsCollection.findOne({ _id: new ObjectId(id) });
    return transformMongoData(product);
  },

  async create(product: any) {
    return await productsCollection.insertOne(product);
  },

  async update(id: string, data: any) {
    if (!ObjectId.isValid(id)) throw new Error("ID inválido");
    return await productsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );
  },

  async delete(id: string) {
    if (!ObjectId.isValid(id)) throw new Error("ID inválido");
    return await productsCollection.deleteOne({ _id: new ObjectId(id) });
  },

  async validateMaterials(
    materiais: { materialId: string; quantidade: number }[]
  ) {
    for (const m of materiais) {
      if (
        !m.materialId ||
        !ObjectId.isValid(String(m.materialId)) ||
        typeof m.quantidade !== "number" ||
        m.quantidade <= 0
      ) {
        throw new Error(
          "Material inválido: materialId (ObjectId) e quantidade (> 0) são obrigatórios"
        );
      }

      const found = await materialsCollection.findOne({
        _id: new ObjectId(String(m.materialId)),
      });

      if (!found) {
        throw new Error(`Material com id ${m.materialId} não encontrado`);
      }
    }
  },

};