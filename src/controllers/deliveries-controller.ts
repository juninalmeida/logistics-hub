import { Request, Response } from "express";

class DeliveriesController {
  create(request: Request, response: Response) {
    // O DeliveriesController. Graças ao "Middleware" instalado na rota, este controller tem certeza absoluta que quem chegou aqui está autenticado.
    return response.json({ message: "ok!" });
  }
}

export { DeliveriesController };
