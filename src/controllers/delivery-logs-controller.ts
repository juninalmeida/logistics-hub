import { Request, Response } from "express";

class DeliveryLogsController {
  async create(request: Request, response: Response) {
    // Isso é um "Stub" ou "Placeholder". 
    // Uma resposta fake só pra gente testar no Insomnia se as portas, rotas e catracas (middlewares)
    // estão funcionando antes de perdermos tempo programando a lógica de banco de dados real.
    return response.json({ message: "ok!" });
  }
}

export { DeliveryLogsController };
