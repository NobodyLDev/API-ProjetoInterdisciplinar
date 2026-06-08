import { ObjectId } from "mongodb";
import { materialRepository } from "../repositories/materialRepository";

export const materialService = {

  async create(data: any) {
    const { nome, quantidade } = data;

    if (!nome || typeof quantidade !== "number") {
      throw new Error("nome e quantidade são obrigatórios");
    }

    const result = await materialRepository.create({ nome, quantidade });

    return {
      id: result.insertedId.toString(),
      nome,
      quantidade,
    };
  },

  async list() {
    return await materialRepository.findAll();
  },

  async getById(id: string) {
    const material = await materialRepository.findById(id);

    if (!material) {
      throw new Error("Material não encontrado");
    }

    return material;
  },

  async update(id: string, data: any) {
    const existing = await materialRepository.findById(id);

    if (!existing) {
      throw new Error("Material não encontrado");
    }

    const { nome, quantidade } = data;

    if (nome !== undefined && typeof nome !== "string") {
      throw new Error("nome deve ser uma string");
    }

    if (quantidade !== undefined && typeof quantidade !== "number") {
      throw new Error("quantidade deve ser um número");
    }

    const updateData: any = {};
    if (nome !== undefined) updateData.nome = nome;
    if (quantidade !== undefined) updateData.quantidade = quantidade;

    await materialRepository.update(id, updateData);

    return { ...existing, ...updateData };
  },

  async delete(id: string) {
    const existing = await materialRepository.findById(id);

    if (!existing) {
      throw new Error("Material não encontrado");
    }

    await materialRepository.delete(id);

    return { message: "Material removido com sucesso" };
  },

};