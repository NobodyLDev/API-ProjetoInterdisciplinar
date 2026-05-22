import { materialRepository } from "../repositories/materialRepository";

export const materialService = {

  async create(data: any) {

    const { nome, quantidade } = data;

    if (!nome || typeof quantidade !== "number") {
      throw new Error(
        "nome e quantidade são obrigatórios"
      );
    }

    const material = {
      nome,
      quantidade,
    };

    await materialRepository.create(material);

    return material;
  },

  async list() {
    return await materialRepository.findAll();
  }

};