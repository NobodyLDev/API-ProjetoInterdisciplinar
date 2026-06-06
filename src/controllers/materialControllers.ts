import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { materialService } from "../services/materialService";

export const materialController = {

  async create(req: Request, res: Response) {
    try {
      const material = await materialService.create(req.body);
      return res.status(201).json(material);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  async list(req: Request, res: Response) {
    try {
      const materials = await materialService.list();
      return res.json(materials);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Formato de ID inválido" });
      }

      const material = await materialService.getById(id);
      return res.json(material);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = String(req.params.id);

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Formato de ID inválido" });
      }

      const material = await materialService.update(id, req.body);
      return res.json(material);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = String(req.params.id);

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Formato de ID inválido" });
      }

      const result = await materialService.delete(id);
      return res.json(result);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  },

};