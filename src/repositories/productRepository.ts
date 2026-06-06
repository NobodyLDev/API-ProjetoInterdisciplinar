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
    return await productsCollection.updateOne({ id }, { $set: data });
  },

  async delete(id: number) {
    return await productsCollection.deleteOne({ id });
  },

  // BUG 3 CORRIGIDO: o tipo anterior forçava materialId como string ObjectId,
  // mas o frontend envia número. Agora aceita number | string e faz a busca
  // correta dependendo do tipo recebido.
  async validateMaterials(
    materiais: { materialId: number | string; quantidade: number }[]
  ) {
    for (const m of materiais) {
      if (
        m.materialId === undefined ||
        m.materialId === null ||
        m.materialId === "" ||
        typeof m.quantidade !== "number" ||
        m.quantidade <= 0
      ) {
        throw new Error(
          "Material inválido: materialId e quantidade (> 0) são obrigatórios"
        );
      }

      let found = null;

      // Se vier como string válida de ObjectId, busca por _id
      if (
        typeof m.materialId === "string" &&
        ObjectId.isValid(m.materialId)
      ) {
        found = await materialsCollection.findOne({
          _id: new ObjectId(m.materialId),
        });
      }

      // Se não achou, ou vier como número, busca por id numérico
      if (!found) {
        const numericId = Number(m.materialId);
        if (!isNaN(numericId)) {
          found = await materialsCollection.findOne({ id: numericId });
        }
      }

      if (!found) {
        throw new Error(
          `Material com id ${m.materialId} não encontrado`
        );
      }
    }
  },
};