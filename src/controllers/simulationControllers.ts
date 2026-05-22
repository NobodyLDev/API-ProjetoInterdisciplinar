import { Request, Response } from "express";
import { simulationService } from "../services/simulationService";

export const simulationController = {
  async simulate(req: Request, res: Response) {
    try {
      const result = await simulationService.simulate(req.body);

      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({
        error: error.message
      });
    }
  }
};