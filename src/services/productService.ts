import { productRepository } from "../repositories/productRepository";
import { HistoryRepository } from "../repositories/historyRepository";
const historyRepository = new HistoryRepository();

function normalizeProduct(product: any) {
  if (!product) return product;
  return {
    ...product,
    quantidade: typeof product.quantidade === "number" ? product.quantidade : 0,
    materiais: Array.isArray(product.materiais) ? product.materiais : [],
  };
}

export const productService = {

  async create(data: any) {
       const { nome, quantidade, materiais } = data;

       if (!nome || typeof quantidade !== "number" || quantidade <= 0) {
           throw new Error("nome e quantidade (número > 0) são obrigatórios");
       }

       if (!Array.isArray(materiais) || materiais.length === 0) {
           throw new Error("materiais (array não vazio) são obrigatórios");
       }

       await productRepository.validateMaterials(materiais);

       const result = await productRepository.create({ nome, quantidade, materiais });

       // Envia os dados respeitando estritamente a interface History do seu projeto
       await historyRepository.create({
        action: "CREATE",
        entity: "PRODUCT",
        description: `Produto '${nome}' foi cadastrado com sucesso com os materiais vinculados.`
       });

       return {
         id: result.insertedId.toString(),
         nome,
         quantidade,
         materiais
       };
   },

  async list() {
    const products = await productRepository.findAll();
    return products.map(normalizeProduct);
  },

  async getById(id: string) {
    const product = await productRepository.findById(id);

    if (!product) {
      throw new Error("Produto não encontrado");
    }

    return normalizeProduct(product);
  },

  async update(id: string, data: any) {
    const existing = await productRepository.findById(id);

    if (!existing) {
      throw new Error("Produto não encontrado");
    }

    const { nome, quantidade, materiais } = data;

    if (nome !== undefined && typeof nome !== "string") {
      throw new Error("nome deve ser uma string");
    }

    if (quantidade !== undefined && (typeof quantidade !== "number" || quantidade <= 0)) {
      throw new Error("quantidade deve ser um número maior que 0");
    }

    if (materiais !== undefined) {
      if (!Array.isArray(materiais) || materiais.length === 0) {
        throw new Error("materiais deve ser um array não vazio");
      }

      await productRepository.validateMaterials(materiais);
    }

    const updateData: any = {};

    if (nome !== undefined) updateData.nome = nome;
    if (quantidade !== undefined) updateData.quantidade = quantidade;
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