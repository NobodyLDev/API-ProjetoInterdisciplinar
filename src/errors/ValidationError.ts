import { AppError } from "./AppError";

export class ValidationError extends AppError {
  constructor(message = "Dados inválidos") {
    super(message, 400);
  }
}