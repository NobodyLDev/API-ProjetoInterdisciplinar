import { productRepository } from "../repositories/productRepository";

export const productService = {
  async create(data: any) {
    const { nome, materiais } = data;

    if (!nome || !Array.isArray(materiais) || materiais.length === 0) {
      throw new Error("nome e materiais (array não vazio) são obrigatórios");
    }

    await productRepository.validateMaterials(materiais);

    // BUG 2 CORRIGIDO: nextId era variável em memória (let nextId = 1).
    // Ao reiniciar o servidor voltava para 1, gerando IDs duplicados no banco.
    // Agora busca o próximo ID diretamente do banco.
    const id = await productRepository.getNextId();

    const product = {
      id,
      nome,
      materiais,
    };

    await productRepository.create(product);

    return product;
  },

  async list() {
    return await productRepository.findAll();
  },

  async getById(id: number) {
    const product = await productRepository.findById(id);

    if (!product) {
      throw new Error("Produto não encontrado");
    }

    return product;
  },

  async update(id: number, data: any) {
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

  async delete(id: number) {
    const existing = await productRepository.findById(id);

    if (!existing) {
      throw new Error("Produto não encontrado");
    }

    await productRepository.delete(id);

    return { message: "Produto removido com sucesso" };
  },
};