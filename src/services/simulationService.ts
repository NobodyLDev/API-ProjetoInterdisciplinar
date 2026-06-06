import { ObjectId } from "mongodb";
import { productsCollection, materialsCollection } from "../database/database";

export const simulationService = {
  async simulate(data: any) {
    const { productId, quantidade } = data;
    const quantidadeNumber = Number(quantidade);

    if (!productId || !quantidadeNumber || quantidadeNumber <= 0) {
      throw new Error("productId e quantidade válidos são obrigatórios");
    }

    if (!ObjectId.isValid(String(productId))) {
      throw new Error("productId inválido");
    }

    const product = await productsCollection.findOne({
      _id: new ObjectId(String(productId)),
    });

    if (!product) {
      throw new Error("Produto não encontrado");
    }

    let possivel = true;

    const materiaisNecessarios = await Promise.all(
      (product.materiais || []).map(async (m: any) => {
        let material = null;

        if (m.materialId && ObjectId.isValid(String(m.materialId))) {
          material = await materialsCollection.findOne({
            _id: new ObjectId(String(m.materialId)),
          });
        }

        const necessario = m.quantidade * quantidadeNumber;
        const emEstoque = material?.quantidade || 0;

        if (necessario > emEstoque) {
          possivel = false;
        }

        return {
          material: material?.nome || "Material não encontrado",
          necessario,
          emEstoque,
        };
      })
    );

    const maximoPorMaterial = await Promise.all(
      (product.materiais || []).map(async (m: any) => {
        let material = null;

        if (m.materialId && ObjectId.isValid(String(m.materialId))) {
          material = await materialsCollection.findOne({
            _id: new ObjectId(String(m.materialId)),
          });
        }

        if (!material) return 0;

        return Math.floor(material.quantidade / m.quantidade);
      })
    );

    const maximoProducao = maximoPorMaterial.length
      ? Math.min(...maximoPorMaterial)
      : 0;

    return {
      possivel,
      materiaisNecessarios,
      maximoProducao,
    };
  },
};