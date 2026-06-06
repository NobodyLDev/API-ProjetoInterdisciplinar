import { ObjectId } from "mongodb";
import { productsCollection, materialsCollection } from "../database/database";

export const simulationService = {
  async simulate(data: any) {
    const { productId, quantidade } = data;

    const productIdNumber = Number(productId);
    const quantidadeNumber = Number(quantidade);

    if (!productIdNumber || !quantidadeNumber || quantidadeNumber <= 0) {
      throw new Error("productId e quantidade válidos são obrigatórios");
    }

    // Busca produto pelo campo id numérico (gerado pelo productService)
    const product = await productsCollection.findOne({
      id: productIdNumber,
    });

    if (!product) {
      throw new Error("Produto não encontrado");
    }

    let possivel = true;

    // BUG 1 CORRIGIDO: materiais são buscados por _id (ObjectId) e não por id numérico,
    // pois o materialId salvo no produto é o _id string do MongoDB.
    const materiaisNecessarios = await Promise.all(
      (product.materiais || []).map(async (m: any) => {
        let material = null;

        // Tenta buscar por _id (ObjectId) — caso o materialId seja um ObjectId string
        if (m.materialId && ObjectId.isValid(String(m.materialId))) {
          material = await materialsCollection.findOne({
            _id: new ObjectId(String(m.materialId)),
          });
        }

        // Fallback: tenta buscar por campo id numérico (compatibilidade)
        if (!material && !isNaN(Number(m.materialId))) {
          material = await materialsCollection.findOne({
            id: Number(m.materialId),
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

        if (!material && !isNaN(Number(m.materialId))) {
          material = await materialsCollection.findOne({
            id: Number(m.materialId),
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