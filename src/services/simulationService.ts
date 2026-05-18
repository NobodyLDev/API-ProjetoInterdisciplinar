import { productsCollection, materialsCollection } from "../database";

export const simulationService = {
  async simulate(data: any) {
    const { productId, quantidade } = data;

    const productIdNumber = Number(productId);
    const quantidadeNumber = Number(quantidade);

    if (!productIdNumber || !quantidadeNumber || quantidadeNumber <= 0) {
      throw new Error("productId e quantidade válidos são obrigatórios");
    }

    const product = await productsCollection.findOne({
      id: productIdNumber
    });

    if (!product) {
      throw new Error("Produto não encontrado");
    }

    let possivel = true;

    const materiaisNecessarios = await Promise.all(
      (product.materiais || []).map(async (m: any) => {
        const material = await materialsCollection.findOne({
          id: m.materialId
        });

        const necessario = m.quantidade * quantidadeNumber;

        const emEstoque = material?.quantidade || 0;

        if (necessario > emEstoque) {
          possivel = false;
        }

        return {
          material: material?.nome || null,
          necessario,
          emEstoque,
        };
      })
    );

    const maximoPorMaterial = await Promise.all(
      (product.materiais || []).map(async (m: any) => {
        const material = await materialsCollection.findOne({
          id: m.materialId
        });

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
  }
};