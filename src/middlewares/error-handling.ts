import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";
import { ZodError } from "zod";

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

  // Intercepta erros de validação do Zod
  // Devolve 400 (Bad Request) com o formato de erro estruturado pelo `.format()`
  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "validation error",
      issues: error.format(),
    });
  }

  // Tratamento de erros inesperados (não mapeados pela aplicação)
  return response.status(500).json({ message: error.message });
}
