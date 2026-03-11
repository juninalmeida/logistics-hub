import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";

// Usamos uma "Closure" (uma função que retorna outra função).
// Isso permite que a gente passe parâmetros estáticos para o Middleware (ex: ["sale", "customer"]) na hora de declarar a rota,
// e o Express vai executar apenas a função de dentro (req, res, next) lembrando do parâmetro "role" que ficou salvo na memória externa!
function verifyUserAuthorization(role: string[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.user) {
      throw new AppError("Unauthorized", 401);
    }

    // O usuário existe (Autenticado), mas o array de "cargos aceitos" para essa nota NÃO INCLUI o cargo dele?
    if (!role.includes(request.user.role)) {
      throw new AppError("Unauthorized", 401);
    }

    return next();
  };
}

export { verifyUserAuthorization };
