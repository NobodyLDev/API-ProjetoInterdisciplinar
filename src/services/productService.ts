import { productRepository } from "../repositories/productRepository";

let nextId = 1;

export const productService = {

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

};