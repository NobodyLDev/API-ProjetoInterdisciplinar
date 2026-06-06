import { materialRepository } from "../repositories/materialRepository";

export const materialService = {
  async create(data: any) {
    const { nome, quantidade } = data;

    if (!nome || typeof quantidade !== "number") {
      throw new Error("nome e quantidade são obrigatórios");
    }

    const material = {
      nome,
      quantidade,
    };

    // BUG EXTRA CORRIGIDO: antes retornava o objeto local sem _id.
    // Agora insere no banco e retorna o documento completo (com _id do MongoDB),
    // o que é necessário para qualquer integração futura com produtos e simulação.
    const result = await materialRepository.create(material);

    return {
      _id: result.insertedId,
      ...material,
    };
  },

  async list() {
    return await materialRepository.findAll();
  },
};