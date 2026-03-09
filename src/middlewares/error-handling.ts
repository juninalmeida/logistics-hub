import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";

// Middleware global de erros do Express obriga a assinatura exata de 4 parâmetros.

export function errorHandler(
  error: any,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message });
  }

  // Tratamento de erros inesperados (não mapeados pela aplicação)
  return response.status(500).json({ message: error.message });
}
