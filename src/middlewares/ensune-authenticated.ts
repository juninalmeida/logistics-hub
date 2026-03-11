import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { authConfig } from "@/configs/auth";
import { AppError } from "@/utils/AppError";

interface TokenPayload {
  role: String;
  sub: string;
}

function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new AppError("JWT token not found", 401);
    }

    // O Token vem no formato "Bearer token123". O split separa o "Bearer" e pega só o "token123".
    const [, token] = authHeader.split(" ");

    // Usa o segredo da empresa para checar se o token: 1. Foi emitido pela própria empresa. 2. Não está vencido. 3. Não foi adulterado.
    const { role, sub: user_id } = verify(
      token,
      authConfig.jwt.secret,
    ) as TokenPayload;

    // token válido! Injeta as informações do usuário logado DENTRO da requisição pra frente e libera a passagem (next).
    request.user = {
      id: user_id,
      role,
    };

    return next()
  } catch (error) {
    throw new AppError("Invalid JWT token", 401);
  }
}