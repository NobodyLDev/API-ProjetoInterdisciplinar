import { Request, Response } from "express";
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

};