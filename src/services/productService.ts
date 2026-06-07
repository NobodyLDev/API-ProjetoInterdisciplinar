import { productRepository } from "../repositories/productRepository";
import { HistoryRepository } from "../repositories/historyRepository";
const historyRepository = new HistoryRepository();

export const productService = {

  async create(data: any) {
       const { nome, materiais } = data;

       if (!nome || !Array.isArray(materiais) || materiais.length === 0) {
           throw new Error("nome e materiais (array não vazio) são obrigatórios");
       }

       await productRepository.validateMaterials(materiais);

       const product = { nome, materiais };
       await productRepository.create(product);

       // Envia os dados respeitando estritamente a interface History do seu projeto
       await historyRepository.create({
        action: "CREATE",
        entity: "PRODUCT",
        description: `Produto '${nome}' foi cadastrado com sucesso com os materiais vinculados.`
       });

       return product;
   },

  async list() {
    return await productRepository.findAll();
  },

  async getById(id: string) {
    const product = await productRepository.findById(id);

    if (!product) {
      throw new Error("Produto não encontrado");
    }

    return product;
  },

  async update(id: string, data: any) {
    const existing = await productRepository.findById(id);

    if (!existing) {
      throw new Error("Produto não encontrado");
    }

    const { nome, materiais } = data;

    if (materiais !== undefined) {
      if (!Array.isArray(materiais) || materiais.length === 0) {
        throw new Error("materiais deve ser um array não vazio");
      }

      await productRepository.validateMaterials(materiais);
    }

    const updateData: any = {};

    if (nome !== undefined) updateData.nome = nome;
    if (materiais !== undefined) updateData.materiais = materiais;

    await productRepository.update(id, updateData);

    return { ...existing, ...updateData };
  },

  async delete(id: string) {
    const existing = await productRepository.findById(id);

    if (!existing) {
      throw new Error("Produto não encontrado");
    }

    await productRepository.delete(id);

    return { message: "Produto removido com sucesso" };
  },

};