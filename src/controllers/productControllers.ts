import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { productService } from "../services/productService";

export const productController = {

  async create(req: Request, res: Response) {
    try {
      const product = await productService.create(req.body);
      return res.status(201).json(product);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  async list(req: Request, res: Response) {
    try {
      const products = await productService.list();
      return res.json(products);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Formato de ID inválido" });
      }

      const product = await productService.getById(id);
      return res.json(product);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Formato de ID inválido" });
      }

      const product = await productService.update(id, req.body);
      return res.json(product);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Formato de ID inválido" });
      }

      const result = await productService.delete(id);
      return res.json(result);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  },

};