import { Request, Response, NextFunction } from "express";

export function errorMiddleware(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(error);

  return res.status(error.status || 500).json({
    error: error.message || "Erro interno do servidor",
  });
}