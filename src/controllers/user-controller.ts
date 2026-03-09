import { Request, Response } from "express";

class UsersController {
  // O Controller isola a regra de negócio/lógica de processamento da Rota
  create(request: Request, response: Response) {
    return response.json({ message: "ok!" });
  }
}

export { UsersController };
