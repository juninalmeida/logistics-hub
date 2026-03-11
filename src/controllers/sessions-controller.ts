import { Request, Response } from "express";

// O SessionsController é a "Guarita de Segurança". É aqui que o usuário tenta fazer Login para ganhar um Crachá (Token) e circular no galpão.
class SessionsController {
  create(request: Request, response: Response) {
    return response.json({ message: "ok!" });
  }
}

export { SessionsController };
