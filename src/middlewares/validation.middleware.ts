import { Request, Response, NextFunction } from "express";

export function validateRequiredFields(fields: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingFields = fields.filter(
      (field) => req.body[field] === undefined
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Campos obrigatórios: ${missingFields.join(", ")}`,
      });
    }

    next();
  };
}