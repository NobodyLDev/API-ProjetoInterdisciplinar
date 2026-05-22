import { Request, Response } from "express";

import { materialService } from "../services/materialService";

export const materialController = {

  async create(req: Request, res: Response) {

    try {

      const material = await materialService.create(
        req.body
      );

      return res.status(201).json(material);

    } catch (error: any) {

      return res.status(400).json({
        error: error.message
      });

    }

  },

  async list(req: Request, res: Response) {

    const materials = await materialService.list();

    return res.json(materials);

  }

};